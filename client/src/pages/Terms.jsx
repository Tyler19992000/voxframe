import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="border-b border-border px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Scissors size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">VoxFrame</span>
        </Link>
        <Link to="/" className="btn-secondary text-sm">Back home</Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-8 py-16 w-full text-center">
        <h1 className="text-3xl font-bold mb-3">Terms of Service</h1>
        <p className="text-muted text-sm leading-relaxed">
          Our Terms of Service are being finalized and will be posted here shortly. In the meantime, if you have any
          questions, please contact us at{' '}
          <a href="mailto:only86177@gmail.com" className="text-accent hover:underline">only86177@gmail.com</a>.
        </p>
      </main>

      <Footer />
    </div>
  );
}
