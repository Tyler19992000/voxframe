import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import DropZone from '../components/DropZone';
import ImageGrid from '../components/ImageGrid';
import Timeline from '../components/Timeline';
import ExportPanel from '../components/ExportPanel';
import { ArrowLeft, Loader2, Music, FileJson, Settings } from 'lucide-react';

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  async function loadProject() {
    try {
      const data = await api.getProject(id);
      setProject(data);
      if (data.audio_url) measureAudio(data.audio_url);
    } catch (err) {
      toast(err.message, 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  function measureAudio(url) {
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => {
      setAudioDuration(audio.duration);
      // If no segments, build evenly spaced ones
      setProject((prev) => {
        if (!prev || (prev.segments && prev.segments.length > 0)) return prev;
        const imgs = prev.images || [];
        if (imgs.length === 0) return prev;
        const perImg = audio.duration / imgs.length;
        const segments = imgs.map((_, i) => ({
          start: i * perImg,
          end: (i + 1) * perImg,
        }));
        return { ...prev, segments };
      });
    });
  }

  async function save(updates) {
    setSaving(true);
    try {
      const updated = await api.updateProject(id, updates);
      setProject(updated);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(files) {
    setUploadingImages(true);
    try {
      const uploaded = await api.uploadImages(files);
      const newImages = [
        ...(project.images || []),
        ...uploaded.map((u, i) => ({ ...u, order: (project.images?.length || 0) + i })),
      ];
      await save({ images: newImages });
      // Rebuild segments if audio is loaded
      if (audioDuration > 0) rebuildSegments(newImages, audioDuration);
      toast(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} added`, 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setUploadingImages(false);
    }
  }

  async function handleAudioUpload(files) {
    setUploadingAudio(true);
    try {
      const result = await api.uploadAudio(files[0]);
      measureAudio(result.url);
      await save({ audio_url: result.url, audio_filename: result.originalName });
      toast('Audio uploaded', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setUploadingAudio(false);
    }
  }

  async function handleJsonUpload(files) {
    try {
      const segments = await api.uploadJson(files[0]);
      await save({ segments });
      toast(`Loaded ${segments.length} timestamp segments`, 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  function rebuildSegments(images, duration) {
    const perImg = duration / images.length;
    const segments = images.map((_, i) => ({
      start: i * perImg,
      end: (i + 1) * perImg,
    }));
    setProject((prev) => ({ ...prev, segments }));
    save({ segments });
  }

  function handleReorder(newImages) {
    setProject((prev) => ({ ...prev, images: newImages }));
    save({ images: newImages });
    if (audioDuration > 0) rebuildSegments(newImages, audioDuration);
  }

  function handleRemoveImage(imageId) {
    const newImages = project.images.filter((img) => img.id !== imageId);
    setProject((prev) => ({ ...prev, images: newImages }));
    save({ images: newImages });
    if (audioDuration > 0 && newImages.length > 0) rebuildSegments(newImages, audioDuration);
  }

  function handleSegmentsChange(segments) {
    setProject((prev) => ({ ...prev, segments }));
    // Debounce save
    clearTimeout(window._segSaveTimer);
    window._segSaveTimer = setTimeout(() => save({ segments }), 800);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-muted" />
      </div>
    );
  }

  const images = project?.images || [];
  const segments = project?.segments || [];
  const audioUrl = project?.audio_url;
  const canExport = images.length > 0 && !!audioUrl;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="btn-ghost p-2">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">{project?.name}</h1>
          <p className="text-muted text-sm">{images.length} images · {audioUrl ? '✓ Audio' : 'No audio'}</p>
        </div>
        <div className="flex items-center gap-2">
          {saving && <span className="text-xs text-muted flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Saving…</span>}
          <button onClick={() => setShowSettings(!showSettings)} className="btn-ghost p-2">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="card space-y-4">
          <h2 className="font-semibold">Project settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Background color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                  value={project?.bg_color || '#000000'}
                  onChange={(e) => setProject((prev) => ({ ...prev, bg_color: e.target.value }))}
                  onBlur={(e) => save({ bg_color: e.target.value })}
                />
                <span className="text-sm text-muted">{project?.bg_color || 'Black (default)'}</span>
              </div>
            </div>
            <div>
              <label className="label">Fade transition</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={project?.fade !== false}
                  onChange={(e) => save({ fade: e.target.checked })}
                  className="w-4 h-4 accent-accent"
                />
                <span className="text-sm">0.3s crossfade between images</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left column — uploads */}
        <div className="col-span-2 space-y-5">
          {/* Image upload */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Images</h2>
              {images.length > 0 && (
                <span className="text-xs text-muted">{images.length} images · drag to reorder</span>
              )}
            </div>

            <DropZone
              accept="image/jpeg,image/png,image/webp"
              multiple
              onFiles={handleImageUpload}
              label={uploadingImages ? 'Uploading…' : 'Drop images here or click to browse'}
              sublabel="JPG, PNG, WEBP — multiple files at once"
              disabled={uploadingImages}
            />

            {images.length > 0 && (
              <ImageGrid images={images} onReorder={handleReorder} onRemove={handleRemoveImage} />
            )}
          </div>

          {/* Timeline */}
          {images.length > 0 && audioUrl && (
            <div>
              <h2 className="font-semibold mb-3">Timeline</h2>
              <Timeline
                images={images}
                segments={segments}
                audioDuration={audioDuration}
                onSegmentsChange={handleSegmentsChange}
                audioUrl={audioUrl}
              />
            </div>
          )}
        </div>

        {/* Right column — audio, json, export */}
        <div className="space-y-4">
          {/* Audio upload */}
          <div className="card space-y-3">
            <div className="flex items-center gap-2">
              <Music size={16} className="text-accent" />
              <h2 className="font-semibold">Audio</h2>
            </div>
            {audioUrl ? (
              <div className="space-y-2">
                <p className="text-xs text-muted truncate">{project?.audio_filename || 'Audio file'}</p>
                <audio controls src={audioUrl} className="w-full h-8" />
                <button
                  onClick={() => { setProject((p) => ({ ...p, audio_url: null })); save({ audio_url: null }); }}
                  className="text-xs text-accent hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <DropZone
                accept="audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a"
                multiple={false}
                onFiles={handleAudioUpload}
                label={uploadingAudio ? 'Uploading…' : 'Drop audio here'}
                sublabel="MP3, WAV, M4A"
                disabled={uploadingAudio}
              />
            )}
          </div>

          {/* Timestamp JSON */}
          <div className="card space-y-3">
            <div className="flex items-center gap-2">
              <FileJson size={16} className="text-accent" />
              <h2 className="font-semibold">Timestamps (optional)</h2>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Upload a JSON file with <code className="text-white bg-bg px-1 rounded">start</code> and <code className="text-white bg-bg px-1 rounded">end</code> fields (in seconds) to precisely sync images to audio segments.
            </p>
            {segments.length > 0 && (
              <p className="text-xs text-green-400">{segments.length} segments loaded</p>
            )}
            <DropZone
              accept=".json,application/json"
              multiple={false}
              onFiles={handleJsonUpload}
              label="Drop JSON here"
              sublabel="[{start: 0, end: 5}, …]"
            />
          </div>

          {/* Export */}
          <ExportPanel projectId={id} canExport={canExport} />
        </div>
      </div>
    </div>
  );
}
