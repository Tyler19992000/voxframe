const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const storage = require('../services/storage');

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/webp'];
const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/wave',
  'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/ogg', 'audio/webm',
  // Some browsers/OS send these for MP3/WAV
  'application/octet-stream',
];

// Separate multer instances per upload type so fileFilter knows what to allow.
// Using req.params.type doesn't work because these are fixed routes, not /:type.
const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per image
  fileFilter(req, file, cb) {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // Also accept by extension as a fallback (Windows sometimes sends wrong MIME)
      const ext = path.extname(file.originalname).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`Unsupported image format: ${file.mimetype}. Please upload JPG, PNG, or WEBP.`));
      }
    }
  },
});

const uploadAudio = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB for audio
  fileFilter(req, file, cb) {
    if (ALLOWED_AUDIO_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      // Accept by extension as fallback
      const ext = path.extname(file.originalname).toLowerCase();
      if (['.mp3', '.wav', '.m4a', '.aac', '.ogg'].includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`Unsupported audio format: ${file.mimetype}. Please upload MP3, WAV, or M4A.`));
      }
    }
  },
});

const uploadJson = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for JSON
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype === 'application/json' || file.mimetype === 'text/plain' || ext === '.json') {
      cb(null, true);
    } else {
      cb(new Error('Please upload a .json file.'));
    }
  },
});

// POST /api/upload/image — upload one or more images
router.post('/image', uploadImage.array('files', 50), async (req, res) => {
  try {
    const results = await Promise.all(
      req.files.map(async (file) => {
        const ext = path.extname(file.originalname) || '.jpg';
        const filename = `${uuidv4()}${ext}`;
        const url = await storage.saveFile(file.buffer, filename, 'uploads');
        return { id: uuidv4(), filename, originalName: file.originalname, url };
      })
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/upload/audio — upload audio file
router.post('/audio', uploadAudio.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No audio file received.' });
    const ext = path.extname(file.originalname) || '.mp3';
    const filename = `${uuidv4()}${ext}`;
    const url = await storage.saveFile(file.buffer, filename, 'uploads');
    res.json({ filename, originalName: file.originalname, url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/upload/json — upload timestamp JSON
router.post('/json', uploadJson.single('file'), async (req, res) => {
  try {
    const text = req.file.buffer.toString('utf8');
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON file' });
    }
    if (!Array.isArray(parsed)) {
      return res.status(400).json({ error: 'JSON must be an array of timestamp segments' });
    }
    // Validate shape
    const valid = parsed.every((s) => typeof s.start === 'number' && typeof s.end === 'number');
    if (!valid) {
      return res.status(400).json({ error: 'Each segment must have numeric "start" and "end" fields (in seconds)' });
    }
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
