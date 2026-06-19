# Architecture Overview

## Core Structure

### App Router (`/app`)

```
app/
├── [lang]/                      # Dynamic locale segment
│   ├── layout.tsx              # Root layout + page transitions
│   ├── page.tsx                # Home
│   ├── listen/page.tsx         # Listen page
│   ├── send-files/page.tsx     # File upload
│   ├── studio/page.tsx         # Studio showcase
│   └── contact/page.tsx        # Contact
├── globals.css                 # Global styles + Tailwind
├── sitemap.ts                  # Dynamic sitemap generation
└── robots.ts                   # SEO robots configuration
```

### Internationalization (`/lib/i18n`)

- **Types:** TypeScript definitions for locales and translations
- **Translation files:** `en.ts`, `fr.ts`
- **Utilities:** Locale validation, translation getters
- **Default locale:** French (`fr`)

### API Layer (`/lib/sanity`)

- **Sanity client:** Type-safe GROQ query helpers with:
  - Public read-only dataset (no token required)
  - Bilingual (`fr`/`en`) field shapes fetched once per request
  - TypeScript interfaces for all content types

### SEO (`/lib/seo`)

- Metadata generation helper
- OpenGraph tags
- Twitter cards
- Canonical URLs
- Alternate language links
- Sitemap generation utility

### Components (`/components`)

- **PageTransition:** Framer Motion wrapper for page animations
- **LanguageSwitcher:** Cookie-based language toggle

### Sanity CMS (`/sanity`, Studio embedded at `/admin`)

Schemas with bilingual (`localeString`/`localeText`) field support:
- **Artist:** name, picture, link, order, featured (powers `/listen`)
- **Terms & Conditions, Legal Notice, FAQ:** singleton documents holding editable prose

## Routing & Middleware

### URL Structure

```
/           → redirects to /fr or /en
/fr         → French home
/en         → English home
/fr/listen  → French listen page
/en/studio  → English studio page
```

### Language Detection Flow

1. Check if URL has locale prefix → pass through
2. Check `NEXT_LOCALE` cookie → redirect with saved locale
3. Parse `Accept-Language` header → redirect with detected locale
4. Fallback to French → redirect to `/fr`

### Cookie Persistence

- Name: `NEXT_LOCALE`
- Max-Age: 1 year (31536000s)
- Set on every language change

## Styling

### Tailwind Configuration

- Custom color palette (primary, neutral)
- Font variables (Inter)
- Container utilities
- Responsive breakpoints

### Design System

- Full-screen pages (`h-screen`)
- No vertical scroll on desktop
- Subtle transitions (0.3s ease)
- Mobile-app feel

## Page Transitions

### Framer Motion Settings

- **Mode:** `wait` (exit before enter)
- **Type:** `tween`
- **Easing:** `easeInOut`
- **Duration:** 300ms
- **Animation:** Fade + Y translation (±20px)

## Environment Variables

### Required

- `NEXT_PUBLIC_BASE_URL` - Site URL (for SEO, sitemap)
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset (`production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` - Sanity API version

### Development Defaults

- Base URL: `http://localhost:3000`

## Content Strategy

### Hard-coded Pages

All page structure and navigation is in code:
- Home
- Listen
- Send Files
- Studio
- Contact

### Dynamic Content (Sanity)

Only specific content blocks come from CMS:
- Artist list (`/listen`)
- Terms & Conditions, Legal Notice prose
- FAQ entries

This separation ensures:
- Fast page loads (static generation)
- Content flexibility where needed
- Full developer control over UX

## Deployment Strategy

### Vercel Configuration

1. Automatic builds on git push
2. Environment variables in dashboard
3. Preview deployments per branch
4. Edge middleware for language detection

### Performance Optimization

- Static page generation
- Image optimization via Next.js
- Sanity content fetched server-side per request (no token, public dataset)
- No runtime JS for static pages

## Security

- No `X-Powered-By` header
- Sanity Studio (`/admin`) gated by Sanity account login, disallowed in `robots.txt`
- Environment variables for secrets

## Type Safety

All major entities are typed:
- Locale: `'en' | 'fr'`
- Translations: Nested interface
- Sanity responses: Typed per query in `lib/sanity/queries.ts`
- Content types: Interface per entity

## Extension Points

### Adding a new page

1. Create `app/[lang]/new-page/page.tsx`
2. Add translations to `lib/i18n/en.ts` + `fr.ts`
3. Update navigation in `app/[lang]/page.tsx`
4. Add route to sitemap in `lib/seo/index.ts`

### Adding a new Sanity content type

1. Create schema in `sanity/schemaTypes/[name].ts`, register it in `sanity.config.ts`
2. Add a GROQ query + fetcher in `lib/sanity/queries.ts`
3. Use in a server component page, pass data down as props

### Modifying page transitions

Edit `components/page-transition.tsx`:
- Change `variants` object for different animations
- Adjust `transition` settings for timing
- Update `mode` for different enter/exit behavior
