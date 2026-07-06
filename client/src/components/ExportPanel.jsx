import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import { Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function ExportPanel({ projectId, canExport }) {
  const [jobId, setJobId] = useState(null);
  const [job, setJob] = useState(null);
  const [starting, setStarting] = useState(false);
  const pollRef = useRef(null);
  const toast = useToast();

  // Clear poll on unmount
  useEffect(() => () => clearInterval(pollRef.current), []);

  async function startExport() {
    if (!canExport) {
      toast('Add images and audio before exporting', 'error');
      return;
    }
    setStarting(true);
    try {
      const { jobId: id } = await api.startRender(projectId);
      setJobId(id);
      setJob({ status: 'queued', progress: 0 });
      pollRef.current = setInterval(() => pollStatus(id), 2000);
    } catch (err) {
      if (err.message.includes('FFmpeg')) {
        toast('FFmpeg not found. Install FFmpeg and restart the server.', 'error', 8000);
      } else if (err.message.includes('limit reached')) {
        toast('Free plan export limit reached. Upgrade for unlimited exports.', 'error', 6000);
      } else {
        toast(err.message, 'error');
      }
    } finally {
      setStarting(false);
    }
  }

  async function pollStatus(id) {
    try {
      const status = await api.getRenderStatus(id);
      setJob(status);
      if (status.status === 'done' || status.status === 'error') {
        clearInterval(pollRef.current);
        if (status.status === 'done') toast('Video ready! Click Download.', 'success');
        if (status.status === 'error') toast(status.error || 'Render failed', 'error');
      }
    } catch {
      // ignore transient poll errors
    }
  }

  function reset() {
    clearInterval(pollRef.current);
    setJobId(null);
    setJob(null);
  }

  return (
    <div className="card space-y-4">
      <h2 className="font-semibold">Export</h2>

      {!job && (
        <button
          onClick={startExport}
          disabled={starting || !canExport}
          className="btn-primary flex items-center gap-2"
        >
          {starting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {starting ? 'Starting…' : 'Export MP4'}
        </button>
      )}

      {job && job.status !== 'done' && job.status !== 'error' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 size={15} className="animate-spin text-accent" />
            <span>{job.status === 'queued' ? 'Queued…' : `Rendering… ${job.progress}%`}</span>
          </div>
          <div className="w-full h-2 bg-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>
      )}

      {job?.status === 'done' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle size={16} />
            <span>Export complete!</span>
          </div>
          <div className="flex gap-3">
            <a href={job.downloadUrl} download className="btn-primary flex items-center gap-2">
              <Download size={16} />
              Download MP4
            </a>
            <button onClick={reset} className="btn-secondary">
              Export again
            </button>
          </div>
        </div>
      )}

      {job?.status === 'error' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-accent text-sm">
            <AlertCircle size={16} />
            <span>{job.error || 'Render failed'}</span>
          </div>
          <button onClick={reset} className="btn-secondary">
            Try again
          </button>
        </div>
      )}

      <p className="text-xs text-muted">
        Output: 1920×1080 MP4 · H.264 · 30fps · AAC audio
      </p>
    </div>
  );
}
