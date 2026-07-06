import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

export default function DropZone({ accept, multiple, onFiles, label, sublabel, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    onFiles(multiple ? Array.from(fileList) : [fileList[0]]);
  }

  function onDragOver(e) {
    e.preventDefault();
    if (!disabled) setDragging(true);
  }

  function onDragLeave() {
    setDragging(false);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
        disabled
          ? 'border-border opacity-50 cursor-not-allowed'
          : dragging
          ? 'border-accent bg-accent/5'
          : 'border-border hover:border-accent/50 hover:bg-white/2'
      }`}
    >
      <Upload size={24} className={dragging ? 'text-accent' : 'text-muted'} />
      <p className="mt-3 font-medium text-sm">{label}</p>
      {sublabel && <p className="text-muted text-xs mt-1">{sublabel}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />
    </div>
  );
}
