# Mastered by Edouard

Production-grade Next.js website for a professional music mastering studio in France.

## Tech Stack

- **Next.js 16** with App Router & Turbopack
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** for page transitions
- **Sanity CMS** (headless) for editable content (artists, legal pages, FAQ)
- **Dropbox API** for file uploads
- **Vercel** for hosting

## Features

- ✅ Multilingual (French & English) with auto-detection
- ✅ Full-screen app-like experience
- ✅ Smooth page transitions
- ✅ SEO optimized (meta tags, sitemap, robots.txt)
- ✅ Cookie-based language persistence
- ✅ Dynamic content via Sanity
- ✅ File upload system (audio files & production sheets)
- ✅ PDF generation for production sheets
- ✅ Dropbox integration for client file management

## Getting Started

### Installation

```bash
npm install
```

### Configure environment

Create `.env.local` file with:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
DROPBOX_ACCESS_TOKEN=your-dropbox-token
```

⚠️ **Security**: Never commit `.env.local` to version control. See `SECURITY.md` for details.

### Run development server

```bash
npm run dev
```

Open http://localhost:3000 (language auto-detected from browser)

## Project Structure

See `ARCHITECTURE.md` for detailed technical documentation.

## Sanity Setup

The CMS Studio is embedded at `/admin`. Content schemas live in `sanity/schemaTypes/`.

## Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run dev:safe     # Start dev server with reduced memory
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Deployment

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_BASE_URL`
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `DROPBOX_ACCESS_TOKEN`

## Security

See `SECURITY.md` for security guidelines and best practices.

## License

Private project - All rights reserved
