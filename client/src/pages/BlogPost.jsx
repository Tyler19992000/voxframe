import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Scissors, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
import { getPostBySlug } from '../data/posts';

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const { meta, Content } = post;

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
          <Link to="/login" className="btn-secondary text-sm">Sign in</Link>
          <Link to="/signup" className="btn-primary text-sm">Get started free</Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-8 py-16 w-full">
        <Link to="/blog" className="text-muted hover:text-white text-sm inline-flex items-center gap-1.5 mb-8">
          <ArrowLeft size={14} /> Back to blog
        </Link>

        <p className="text-muted text-xs mb-2">{formatDate(meta.date)}</p>
        <h1 className="text-3xl font-bold mb-8 leading-tight">{meta.title}</h1>

        <article
          className="text-muted leading-relaxed space-y-4
            [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3
            [&_strong]:text-white [&_strong]:font-semibold
            [&_a]:text-accent [&_a]:hover:underline
            [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2
            [&_li]:leading-relaxed"
        >
          <Content />
        </article>
      </main>

      <Footer />
    </div>
  );
}
