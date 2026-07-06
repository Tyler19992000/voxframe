import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Zap, Clock, Download } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Auto-sync images to audio', desc: 'Drop in your images and voiceover — VoxFrame handles the timing automatically.' },
  { icon: Clock, title: 'Timestamp precision', desc: 'Upload a JSON timestamp file to lock each image to an exact audio segment.' },
  { icon: Download, title: 'Export-ready MP4', desc: 'Get a 1920×1080 H.264 file ready to upload to YouTube in seconds.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Nav */}
      <header className="border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Scissors size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">VoxFrame</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/pricing" className="btn-ghost text-sm">Pricing</Link>
          <Link to="/login" className="btn-secondary text-sm">Sign in</Link>
          <Link to="/signup" className="btn-primary text-sm">Get started free</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-8 py-24">
        <div className="inline-flex items-center gap-2 badge bg-accent/10 text-accent border border-accent/20 mb-6 px-3 py-1">
          <Zap size={13} />
          <span>Built for faceless YouTube automation</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-3xl leading-tight">
          Sync images to your voiceover.<br />
          <span className="text-accent">Export in one click.</span>
        </h1>
        <p className="text-muted text-xl max-w-xl mb-10 leading-relaxed">
          Drop in your images and audio, let VoxFrame handle the assembly. No timeline editing. No fuss. Just a finished MP4.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/signup" className="btn-primary text-base px-8 py-3">Start for free</Link>
          <Link to="/pricing" className="btn-secondary text-base px-8 py-3">See pricing</Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-8 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Icon size={20} className="text-accent" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-8 py-6 text-center text-muted text-sm">
        © {new Date().getFullYear()} VoxFrame. All rights reserved.
      </footer>
    </div>
  );
}
