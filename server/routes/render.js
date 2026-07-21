const express = require('express');
const router = express.Router();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../services/supabase');
const { renderVideo, getAudioDuration, checkFfmpeg } = require('../services/ffmpeg');
const storage = require('../services/storage');
const { exportLimiter } = require('../middleware/rateLimit');

// In-memory render job store (swap for Redis/DB in production)
const jobs = {};

// Monthly export caps per plan. 'pro' is intentionally absent = unlimited.
const EXPORT_LIMITS = { free: 2, starter: 10 };

// GET /api/render/check — verify ffmpeg is available
router.get('/check', async (req, res) => {
  const result = await checkFfmpeg();
  res.json(result);
});

// POST /api/render/start — kick off a render job (10/hour per user — each one is a real FFmpeg job)
router.post('/start', exportLimiter, async (req, res) => {
  const { projectId } = req.body;
  if (!projectId) return res.status(400).json({ error: 'projectId required' });

  // Load project from DB
  const { data: project, error: projErr } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', req.user.id)
    .single();

  if (projErr || !project) return res.status(404).json({ error: 'Project not found' });

  const images = project.images || [];
  if (images.length === 0) return res.status(400).json({ error: 'No images in project' });
  if (!project.audio_url) return res.status(400).json({ error: 'No audio file in project' });

  // Check ffmpeg
  const ffCheck = await checkFfmpeg();
  if (!ffCheck.available) return res.status(503).json({ error: ffCheck.error });

  // Check user export limit for free tier
  const { data: userRow } = await supabase
    .from('users')
    .select('plan, exports_this_month')
    .eq('id', req.user.id)
    .single();

  const plan = userRow?.plan || 'free';
  const exportsThisMonth = userRow?.exports_this_month || 0;
  const limit = EXPORT_LIMITS[plan]; // undefined for pro = no cap

  if (limit !== undefined && exportsThisMonth >= limit) {
    return res.status(403).json({
      error: `${plan === 'free' ? 'Free' : 'Starter'} plan limit reached (${limit} exports/month). Upgrade to export more.`,
      upgradeRequired: true,
    });
  }

  const jobId = uuidv4();
  jobs[jobId] = { status: 'queued', progress: 0 };

  // Start async render (don't await — client polls)
  runRender({ jobId, project, plan, userId: req.user.id }).catch((err) => {
    console.error(`Render ${jobId} failed:`, err.message);
    jobs[jobId] = { status: 'error', progress: 0, error: err.message };
  });

  res.json({ jobId });
});

// GET /api/render/status/:jobId — poll render progress
router.get('/status/:jobId', (req, res) => {
  const job = jobs[req.params.jobId];
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

async function runRender({ jobId, project, plan, userId }) {
  jobs[jobId] = { status: 'rendering', progress: 0 };

  const images = project.images;
  const audioFilename = project.audio_url.split('/').pop();
  const audioPath = storage.getFilePath(audioFilename, 'uploads');

  // Resolve image paths
  const imagePaths = images.map((img) => {
    const fname = img.url.split('/').pop();
    return storage.getFilePath(fname, 'uploads');
  });

  // Compute per-image durations
  let durations;
  if (project.segments && project.segments.length > 0) {
    // Use timestamp segments, one per image
    durations = images.map((_, i) => {
      const seg = project.segments[i];
      if (seg) return Math.max(0.1, seg.end - seg.start);
      // fallback: use last segment end or 3s
      const last = project.segments[project.segments.length - 1];
      return last ? last.end / images.length : 3;
    });
  } else {
    const totalDuration = await getAudioDuration(audioPath);
    const perImage = totalDuration / images.length;
    durations = images.map(() => perImage);
  }

  const outputFilename = `${jobId}.mp4`;
  const outputPath = storage.getFilePath(outputFilename, 'outputs');

  await renderVideo({
    imagePaths,
    durations,
    audioPath,
    outputPath,
    watermark: plan === 'free',
    fade: project.fade !== false,
    bgColor: project.bg_color || 'black',
    onProgress: (pct) => {
      jobs[jobId] = { ...jobs[jobId], progress: pct };
    },
  });

  const downloadUrl = `/outputs/${outputFilename}`;
  jobs[jobId] = { status: 'done', progress: 100, downloadUrl };

  // Increment export counter and save output URL to project
  await supabase.rpc('increment_exports', { uid: userId });
  await supabase
    .from('projects')
    .update({ status: 'done', output_url: downloadUrl, updated_at: new Date().toISOString() })
    .eq('id', project.id);
}

module.exports = router;
