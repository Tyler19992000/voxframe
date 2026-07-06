import React, { useRef, useState, useEffect } from 'react';

/**
 * Visual timeline showing image segments mapped to audio.
 * Supports dragging segment boundaries to adjust timing.
 */
export default function Timeline({ images, segments, audioDuration, onSegmentsChange, audioUrl }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const timelineRef = useRef(null);
  const [dragging, setDragging] = useState(null); // { index, startX, startTime }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    function onTime() { setCurrentTime(audio.currentTime); }
    function onPlay() { setPlaying(true); }
    function onPause() { setPlaying(false); }
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [audioUrl]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    playing ? audio.pause() : audio.play();
  }

  function timeToPercent(t) {
    return audioDuration > 0 ? (t / audioDuration) * 100 : 0;
  }

  function getActiveIndex() {
    return segments.findIndex((s) => currentTime >= s.start && currentTime < s.end);
  }

  // Drag a boundary between segment i and i+1
  function onBoundaryMouseDown(e, idx) {
    e.preventDefault();
    const rect = timelineRef.current.getBoundingClientRect();
    setDragging({ idx, startX: e.clientX, rect });

    function onMouseMove(ev) {
      const delta = ev.clientX - e.clientX;
      const pct = delta / rect.width;
      const timeDelta = pct * audioDuration;
      const newSegs = segments.map((s) => ({ ...s }));
      const boundary = segments[idx].end + timeDelta;
      const min = segments[idx].start + 0.1;
      const max = segments[idx + 1].end - 0.1;
      const clamped = Math.max(min, Math.min(max, boundary));
      newSegs[idx].end = clamped;
      newSegs[idx + 1].start = clamped;
      onSegmentsChange(newSegs);
    }

    function onMouseUp() {
      setDragging(null);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  const activeIdx = getActiveIndex();

  if (images.length === 0 || segments.length === 0) {
    return (
      <div className="card flex items-center justify-center h-32 text-muted text-sm">
        Add images and audio to see the timeline
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={togglePlay} className="btn-secondary px-4 py-2 text-sm">
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <span className="text-muted text-xs font-mono">
          {formatTime(currentTime)} / {formatTime(audioDuration)}
        </span>
      </div>

      {/* Timeline bar */}
      <div
        ref={timelineRef}
        className="relative h-16 rounded-lg overflow-hidden bg-bg border border-border select-none"
        style={{ cursor: dragging ? 'ew-resize' : 'default' }}
      >
        {segments.map((seg, i) => {
          const left = timeToPercent(seg.start);
          const width = timeToPercent(seg.end - seg.start);
          const isActive = i === activeIdx;
          const img = images[i];

          return (
            <div
              key={i}
              className={`absolute top-0 h-full border-r border-black/30 flex items-center justify-center overflow-hidden transition-colors ${
                isActive ? 'ring-2 ring-inset ring-accent' : ''
              }`}
              style={{ left: `${left}%`, width: `${width}%` }}
            >
              {img?.url && (
                <img src={img.url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              )}
              <span className="relative z-10 text-white text-xs font-bold drop-shadow">{i + 1}</span>

              {/* Drag handle between segments */}
              {i < segments.length - 1 && (
                <div
                  className="absolute right-0 top-0 w-2 h-full cursor-ew-resize z-20 hover:bg-accent/40 transition-colors"
                  onMouseDown={(e) => onBoundaryMouseDown(e, i)}
                />
              )}
            </div>
          );
        })}

        {/* Playhead */}
        <div
          className="absolute top-0 h-full w-0.5 bg-accent z-30 pointer-events-none"
          style={{ left: `${timeToPercent(currentTime)}%` }}
        >
          <div className="w-2 h-2 bg-accent rounded-full absolute -left-[3px] -top-1" />
        </div>
      </div>

      {/* Active image preview */}
      {activeIdx >= 0 && images[activeIdx] && (
        <div className="flex items-center gap-3 text-sm text-muted">
          <img
            src={images[activeIdx].url}
            alt=""
            className="w-12 h-8 object-cover rounded border border-border"
          />
          <span>Image {activeIdx + 1} — {formatTime(segments[activeIdx].start)} → {formatTime(segments[activeIdx].end)}</span>
        </div>
      )}

      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} className="hidden" />
      )}
    </div>
  );
}

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}
