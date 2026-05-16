# Dr. Shahidur's Portfolio — Frontend

This is the frontend for Dr. Shahidur Rahman Khan’s portfolio, built as a modern Next.js app with a strong focus on content-driven pages, responsive design, and a smooth developer experience.

## What this project does

- Renders a professional portfolio site with a hero section, specialties, about section, testimonials, and CTAs
- Supports article and research content with listing pages and detail pages
- Includes appointment booking and contact form flows
- Provides search across site content with interactive filtering
- Enables light/dark theming with persisted user preference
- Uses desktop-only 3D hero content to preserve mobile performance

## Why it is built this way

- `src/app` is the central route layer, so pages are easy to add and maintain
- `src/components` contains reusable UI sections and presentation logic
- `src/providers` isolates theme, query client, and reCAPTCHA behavior
- `src/lib/api` is the API integration layer for backend data
- The app balances server-rendered metadata, static content, and client-side interactivity

## Key features

- Responsive layout and accessible navigation
- Theme switcher with system mode support
- Animated page transitions and UI motion using Framer Motion
- API-driven content fetching through shared client wrappers
- Global toast notifications with Sonner
- Cookie consent, analytics tracking, and WhatsApp support built into the shell

## Tech stack

- Next.js App Router (Next 16)
- React 19 + TypeScript
- Tailwind CSS v4
- @tanstack/react-query for client-side data caching
- framer-motion for animation
- three.js for desktop hero visualization
- zustand for lightweight UI state
- Biome for linting and formatting

## Main folders

- `src/app` — pages, layout, metadata, and route config
- `src/components` — page sections, layout pieces, UI primitives, and shared widgets
- `src/providers` — app-wide providers like theme, query client, and reCAPTCHA
- `src/lib` — API clients, fetch helpers, and utility wrappers
- `src/types` — shared data models and type definitions
- `public` — static images, icons, and public assets

## Run locally

```bash
cd Dr-Shahidur-s-Portfolio-frontend
bun install
bun run dev
```

Then open `http://localhost:3000`.

## Build and preview

```bash
bun run build
bun run start
```

## Useful commands

- `bun run lint` — run Biome checks
- `bun run format` — format files
- `bun run type-check` — run TypeScript type checks

## Notes for reviewers

- `src/app/layout.tsx` sets global app metadata and wraps the app with providers
- The app uses `serverFetch` in `src/lib/fetcher.ts` to keep backend API responses consistent
- Mobile views avoid loading the Three.js hero viewer to improve phone performance
- `next.config.ts` includes remote image domains and `allowedDevOrigins` for remote device testing

## Environment

Use `.env.local` for local development when needed.

Common variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `NEXT_PUBLIC_API_BASE_URL`

## Contribution guidance

- Add route UI in `src/app`
- Keep reusable UI in `src/components`
- Add shared state or helpers in `src/hooks` and `src/lib`
- Keep provider behavior inside `src/providers`

---
