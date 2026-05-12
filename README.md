# Dr. Shahidur's Portfolio — Frontend Documentation

This repository contains the frontend implementation for Dr. Shahidur Rahman Khan's professional portfolio site. It is built as a modern Next.js application with a strong focus on reusable UI, theme support, content-driven routing, and a clean developer experience.

## Project Overview

The frontend is designed as a lightweight, content-driven portfolio with the following capabilities:

- Responsive landing experience with hero, about, specialties, and testimonial sections
- Dark and light theme toggle with persistent user preference
- Dynamic routing for articles and research details
- Search and filtering for content discovery
- Appointment booking CTA and contact form submission flows
- Global state providers for theme, API queries, and reCAPTCHA
- Accessibility-minded UI components with Tailwind CSS styling

## Architecture

This app uses the Next.js App Router with server-side metadata generation and client-side interactivity where needed.

### Core folders

- `src/app` — route definitions, page files, and root layout
- `src/components` — reusable sections, layout pieces, and UI primitives
- `src/providers` — React providers for theme, query client, and reCAPTCHA
- `src/lib` — shared utilities and API client wrappers
- `src/types` — domain models and typed interfaces
- `public` — static assets and public images

### Primary providers

- `ThemeProvider` — manages theme selection and syncs the `dark` class on `<html>`
- `QueryProvider` — configures `@tanstack/react-query` for client-side data fetching
- `RecaptchaProvider` — wraps site interactions that require Google reCAPTCHA support

### Global layout

`src/app/layout.tsx` configures the app shell and metadata:

- custom Google font via `next/font/google`
- client-only providers for theme, query, and reCAPTCHA
- global toast notifications using `sonner`
- app metadata from `getAppInfo()` with fallback values

## Routes and Pages

The app ships with the following routes:

- `/` — homepage with hero, featured content, testimonials, and CTAs
- `/appointment` — appointment booking page
- `/articles` — article listing page
- `/articles/[slug]` — article detail page
- `/research` — research listing page
- `/research/[slug]` — research detail page
- `/contact` — contact page with submission form
- `/search` — site-wide search interface
- `/testimonials` — testimonial page

## UI and Theming

The visual system is based on Tailwind CSS with custom class names for light and dark mode handling.

### Theme behavior

- The theme toggle is exposed in `src/components/layout/Header.tsx`
- Selected theme is stored in `localStorage`
- `ThemeProvider` resolves system color scheme when the theme is set to `system`
- The `dark` class is added/removed from `document.documentElement`

### Design system

Reusable UI components include:

- `Button`, `Input`, `Textarea`, `Select`, `Modal`, `Spinner`, `Badge`
- layout elements such as `AppShell`, `Header`, and `Footer`
- content sections like `FeaturedArticles`, `Specialties`, and `TestimonialsCarousel`

## Data and API Layer

The app consumes backend content via the shared API layer in `src/lib/api`.

### API clients

- `app-info.ts` — site metadata and doctor info
- `appointments.ts` — appointment submission endpoints
- `articles.ts` — article list/detail fetching
- `research.ts` — research list/detail fetching
- `search.ts` — search endpoint integration
- `testimonials.ts` — testimonial data retrieval
- `contact.ts` — contact form submission

Each API module is typed using interfaces from `src/types`.

## Environment

The repo includes environment samples:

- `.env.example` — base variables to populate
- `.env.local` — local overrides for development

Important environment variables:

- `NEXT_PUBLIC_SITE_URL` — base URL used for Open Graph metadata and site links
- any backend API URLs required by `src/lib/api`

## Development Workflow

### Prerequisites

- Node.js 18+ or Bun 1.0+
- npm, pnpm, yarn, or bun

### Install dependencies

```bash
npm install
# or
pnpm install
# or
bun install
```

### Run locally

```bash
npm run dev
```

Then open `http://localhost:3000`.

### Build for production

```bash
npm run build
```

### Run production preview

```bash
npm run start
```

### Code quality tools

- `npm run lint` — run Biome checks
- `npm run format` — format code with Biome
- `npm run type-check` — run TypeScript type checking

## Configuration and Tooling

### Next.js config

`next.config.ts` currently enables the `reactCompiler` feature.

### Styling

This project uses Tailwind CSS v4 via `@tailwindcss/postcss` and `postcss.config.mjs`.

### Fonts and metadata

- Google font loaded with `next/font/google`
- metadata generated server-side from `getAppInfo()` in `src/app/layout.tsx`

## Contribution Notes

If you extend this codebase, follow these guidelines:

- Keep route-level logic in `src/app`
- Keep presentational markup in `src/components`
- Use `src/types` for shared interfaces and avoid implicit `any`
- Keep provider logic isolated in `src/providers`
- Register reusable hooks in `src/hooks` when shared behavior is required
- Use `@tanstack/react-query` for client-side async requests and caching

## Deployment

This app is production-ready for Vercel or any compatible Node hosting environment.

1. Build the application:

```bash
npm run build
```

2. Deploy the `.next` output and host static assets from `public/`.

## Known Extension Points

- `src/constants/navigation.ts` — update or extend navigation links
- `src/lib/api/*` — point to alternate backend endpoints
- `src/components/*` — add custom sections, filters, or page modules
- `src/app/*` — add new routes or subpages

## License

This project is released under the MIT License.
