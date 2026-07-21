import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/uploads': { target: 'http://localhost:3001', changeOrigin: true },
      '/outputs': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  ssgOptions: {
    // Only prerender the landing page — every other route (editor, dashboard,
    // anything behind auth) stays a normal client-rendered SPA route.
    includedRoutes: (paths) => paths.filter((path) => path === '/'),
  },
});
