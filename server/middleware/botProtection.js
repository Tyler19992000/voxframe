/**
 * Server-side bot/crawler gate. Runs before rate limiting and before any
 * route handler, so bad actors and disallowed bot access to private routes
 * are rejected immediately, before any page content or data is processed.
 *
 * This middleware only ever evaluates and acts on User-Agent strings that
 * identify as (or heuristically look like) a crawler. Real browser traffic —
 * anything with a normal Mozilla/Chrome/Safari-style UA — is never touched
 * and passes straight through to the app, exactly as before.
 */

// Routes containing private/authenticated data. No crawler — good, bad, or
// unrecognized — should ever be allowed to reach these.
const PRIVATE_PATH_PREFIXES = ['/dashboard', '/project', '/account', '/api/'];

// Explicitly allowed, well-behaved crawlers (case-insensitive substring match
// against the User-Agent header). Keep this in sync with client/public/robots.txt.
const GOOD_BOTS = [
  'googlebot',
  'bingbot',
  'gptbot',
  'chatgpt-user',
  'claudebot',
  'anthropic-ai',
  'perplexitybot',
  'google-extended',
];

// Known aggressive/non-compliant scrapers — blocked everywhere, no exceptions,
// regardless of which path they request.
const BAD_BOTS = [
  'ahrefsbot',
  'semrushbot',
  'mj12bot',
  'dotbot',
  'bytespider',
  'petalbot',
  'seekportbot',
  'dataforseobot',
  'serpstatbot',
  'barkrowler',
  'mauibot',
  'megaindex',
  'blexbot',
  'zoominfobot',
];

// Generic, non-browser scripting/tooling signatures — only relevant when
// hitting /api/* directly (requirement: block missing/empty/generic UA on
// API routes specifically, not site-wide).
const GENERIC_TOOL_PATTERNS = [
  'curl/',
  'wget/',
  'python-requests',
  'python-urllib',
  'scrapy',
  'go-http-client',
  'libwww-perl',
  'okhttp',
  'java/',
  'httpclient',
];

// Infrastructure endpoints that must stay reachable regardless of User-Agent —
// deploy platform health checks and the Stripe webhook caller are legitimate
// server-to-server traffic, not crawlers, and often send no/generic UAs.
// Exempting them here so they're never accidentally locked out.
const UA_CHECK_EXEMPT_PATHS = ['/api/health', '/api/stripe/webhook'];

function matchesAny(ua, list) {
  return list.some((needle) => ua.includes(needle));
}

// A "bot" for the purposes of the private-path rule: explicitly known (good
// or bad) OR self-identifies via a generic crawler-naming convention.
// Deliberately narrow so it can never catch a real browser or a legitimate
// server-to-server caller like Stripe's webhook UA ("Stripe/1.0 (+https://...)").
function looksLikeBot(ua) {
  if (matchesAny(ua, GOOD_BOTS) || matchesAny(ua, BAD_BOTS)) return true;
  return /\b(bot|crawler|spider|spyder|scraper)\b/i.test(ua);
}

function botProtection(req, res, next) {
  const rawUa = req.headers['user-agent'];
  const ua = (rawUa || '').toLowerCase();
  const pathname = req.path;

  // 1. Known bad actor — blocked everywhere, before anything else runs.
  if (ua && matchesAny(ua, BAD_BOTS)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const isApiPath = pathname.startsWith('/api/');
  const isPrivatePath = PRIVATE_PATH_PREFIXES.some((p) => pathname.startsWith(p));

  // 2. Missing/empty/generic User-Agent hitting an API route directly.
  if (isApiPath && !UA_CHECK_EXEMPT_PATHS.includes(pathname)) {
    const isMissingOrEmpty = !rawUa || rawUa.trim() === '';
    const isGenericTool = ua && matchesAny(ua, GENERIC_TOOL_PATTERNS);
    if (isMissingOrEmpty || isGenericTool) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }

  // 3. Any bot at all — good, bad (already caught above), or unrecognized but
  //    bot-shaped — is blocked from private/authenticated routes.
  if (isPrivatePath && ua && looksLikeBot(ua)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Everything else — real browsers, unrecognized non-bot UAs, and allowed
  // bots hitting public pages — passes through untouched, still subject to
  // apiLimiter on API routes exactly as before.
  next();
}

module.exports = botProtection;
