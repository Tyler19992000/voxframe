import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import { posts } from '../data/posts';

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Blog() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="border-b border-border px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Scissors size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">VoxFrame</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/pricing" className="btn-ghost text-sm">Pricing</Link>
          <Link to="/login" className="btn-secondary text-sm">Sign in</Link>
          <Link to="/signup" className="btn-primary text-sm">Get started free</Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-8 py-16 w-full">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-muted text-lg mb-10">Guides and tips for faceless YouTube creators.</p>

        <div className="space-y-4">
          {posts.map(({ meta }) => (
            <Link
              key={meta.slug}
              to={`/blog/${meta.slug}`}
              className="card block hover:border-accent transition-colors"
            >
              <p className="text-muted text-xs mb-2">{formatDate(meta.date)}</p>
              <h2 className="text-xl font-bold mb-2">{meta.title}</h2>
              <p className="text-muted text-sm leading-relaxed mb-3">{meta.excerpt}</p>
              <span className="text-accent text-sm font-medium inline-flex items-center gap-1">
                Read more <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
