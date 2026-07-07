import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border px-8 py-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-muted text-sm">
      <span>© {new Date().getFullYear()} VoxFrame. All rights reserved.</span>
      <span className="hidden sm:inline text-border">•</span>
      <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
      <span className="hidden sm:inline text-border">•</span>
      <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
    </footer>
  );
}
