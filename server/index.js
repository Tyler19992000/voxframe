require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authMiddleware = require('./middleware/auth');
const { apiLimiter } = require('./middleware/rateLimit');
const projectRoutes = require('./routes/projects');
const uploadRoutes = require('./routes/upload');
const renderRoutes = require('./routes/render');
const stripeRoutes = require('./routes/stripe');

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure upload/output dirs exist
['uploads', 'outputs'].forEach((dir) => {
  const p = path.join(__dirname, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Stripe webhook needs raw body — mount before express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Serve uploaded files and rendered outputs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

// Routes
// apiLimiter (100 req/min per user) covers general dashboard/editor traffic —
// project CRUD, uploads, and render status polling/ffmpeg-check. The stricter
// exportLimiter (10/hour per user) is applied separately, inside render.js,
// only to POST /api/render/start.
app.use('/api/stripe', stripeRoutes);
app.use('/api/projects', authMiddleware, apiLimiter, projectRoutes);
app.use('/api/upload', authMiddleware, apiLimiter, uploadRoutes);
app.use('/api/render', authMiddleware, apiLimiter, renderRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// In production, serve the React build from the client dist folder
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  // All non-API routes hand off to React Router
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`VoxFrame server running on http://localhost:${PORT}`);
});
