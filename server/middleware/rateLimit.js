const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

// Applied to /api/render/start — each request kicks off an expensive FFmpeg job.
// Keyed per authenticated user (this route always runs after authMiddleware),
// not per IP, so it can't be dodged by rotating IPs and can't punish users
// sharing a NAT/office IP.
const exportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
  message: { error: 'Too many export requests. You can start up to 10 exports per hour — try again shortly.' },
});

// Applied broadly to authenticated API routes (projects, uploads, render status
// polling) — generous, since this covers normal dashboard/editor usage.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
  message: { error: 'Too many requests. Please slow down and try again in a moment.' },
});

// NOT wired up to anything yet — see server/index.js for why. Kept here so it's
// ready to attach the moment a real server-side login route exists.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
});

module.exports = { exportLimiter, apiLimiter, loginLimiter };
