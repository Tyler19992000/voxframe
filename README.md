# VoxFrame

Purpose-built video assembly tool for YouTube faceless automation creators. Import images and a voiceover, sync them automatically, export a finished MP4.

## Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Video**: FFmpeg (via fluent-ffmpeg)
- **Auth + DB**: Supabase
- **Payments**: Stripe

## Quick start

### 1. Prerequisites

- Node.js 18+
- FFmpeg installed and in PATH ([download](https://ffmpeg.org/download.html))
- Supabase project ([supabase.com](https://supabase.com))
- Stripe account ([stripe.com](https://stripe.com))

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure environment

```bash
cp .env.example server/.env
cp .env.example client/.env
```

Edit `server/.env` and `client/.env` with your actual keys.

### 4. Set up Supabase

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor.

### 5. Set up Stripe

Create four price IDs in Stripe Dashboard:
- Starter Monthly ($6.99/mo)
- Starter Annual ($59/yr)
- Pro Monthly ($12.99/mo)
- Pro Annual ($99/yr)

Add the price IDs to your `.env` files.

For webhooks, use Stripe CLI locally:
```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

### 6. Run development servers

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001

## Project structure

```
/client       React frontend (Vite)
/server       Express API + FFmpeg renderer
/shared       Shared type definitions
/supabase     Database schema SQL
```

## Subscription tiers

| Plan     | Price         | Exports | Watermark |
|----------|---------------|---------|-----------|
| Free     | Free          | 2/mo    | Yes       |
| Starter  | $6.99/mo      | ∞       | No        |
| Pro      | $12.99/mo     | ∞       | No        |

## Deployment (Railway/Render)

1. Set all environment variables in your hosting dashboard
2. Set `CLIENT_URL` to your deployed frontend URL
3. Build command: `npm run build`
4. Start command: `npm run start`
5. Point a Stripe webhook to `https://your-domain.com/api/stripe/webhook`
