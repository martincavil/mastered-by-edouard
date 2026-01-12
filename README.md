# Mastered by Edouard

Production-grade Next.js website for a professional music mastering studio in France.

## Tech Stack

- **Next.js 15+** with App Router
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** for page transitions
- **Strapi CMS** (headless) for dynamic content
- **Vercel** for hosting

## Features

- ✅ Multilingual (French & English) with auto-detection
- ✅ Full-screen app-like experience (no scroll on desktop)
- ✅ Smooth page transitions
- ✅ SEO optimized (meta tags, sitemap, robots.txt)
- ✅ Cookie-based language persistence
- ✅ Dynamic content via Strapi
- ✅ Vercel-ready deployment

## Getting Started

### Installation

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
- `NEXT_PUBLIC_BASE_URL`: Your domain
- `NEXT_PUBLIC_STRAPI_URL`: Strapi API URL
- `STRAPI_API_TOKEN`: Strapi API token

### Run development server

```bash
npm run dev
```

Open:
- French: http://localhost:3000
- English: http://localhost:3000/en

## Project Structure

See `ARCHITECTURE.md` for detailed technical documentation.

## Strapi Setup

See `strapi/README.md` for CMS configuration.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Deployment

Push to GitHub and import to Vercel. Add environment variables in Vercel dashboard.

## License

Private project - All rights reserved
