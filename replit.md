# ZeeActs Website

A premium single-page marketing website for ZeeActs, an IT solutions company founded by Zohaib. Features a public marketing site and a Clerk-protected admin CMS panel.

## Architecture

- **Monorepo** managed by pnpm workspaces
- **Frontend**: React + Vite at `/` (port 23373) — `artifacts/zeeacts-website/`
- **Backend**: Express API server (port 8080) — `artifacts/api-server/`
- **Database**: PostgreSQL via Drizzle ORM — `lib/db/`
- **Auth**: Clerk (whitelabel) — proxy via `/__clerk`
- **API client**: Auto-generated React Query hooks via Orval — `lib/api-client-react/`
- **Zod validators**: Auto-generated from OpenAPI spec — `lib/api-zod/`

## Key Libraries

- **Frontend**: React, Vite, Tailwind CSS, Wouter (routing), TanStack Query, react-hook-form, Lucide React, Shadcn UI components
- **Backend**: Express, Drizzle ORM, @clerk/express, pino logger, zod
- **Fonts**: Syne (display/headlines) + Outfit (body) from Google Fonts

## Brand Identity

- **Colors**: Crimson (#E63950) as accent, near-black (#0A0A0F) as dark background, off-white (#F5F5F0) as light surface
- **Typography**: Syne 700/800 for headings, Outfit 400/500/600 for body

## Database Tables

All in PostgreSQL, managed via Drizzle ORM (`lib/db/src/schema/`):

| Table | Purpose |
|-------|---------|
| `services` | Service cards (icon, title, description, sort_order) |
| `portfolio` | Portfolio/case study items (title, category, description, tech_stack[], result_metric, result_label, accent_color, sort_order) |
| `testimonials` | Client testimonials (name, company, role, quote, avatar_initials, avatar_color, sort_order) |
| `contact_submissions` | Contact form submissions (name, email, company, project_type, budget, message, is_read) |
| `site_settings` | Key-value store for CMS-editable content (hero text, about, founder bio, contact email) |

## API Endpoints (`/api/*`)

All endpoints served by Express, documented in `lib/api-spec/openapi.yaml`:

- `GET/POST /api/services` — list / create services
- `GET/PUT/DELETE /api/services/:id` — get / update / delete service
- `GET/POST /api/portfolio` — list / create portfolio items
- `GET/PUT/DELETE /api/portfolio/:id` — get / update / delete portfolio item
- `GET/POST /api/testimonials` — list / create testimonials
- `PUT/DELETE /api/testimonials/:id` — update / delete testimonial
- `POST /api/contact` — submit contact form
- `GET /api/contact/submissions` — list submissions (admin)
- `PATCH /api/contact/submissions/:id/read` — mark as read (admin)
- `GET/PUT /api/settings` — get / update site settings

## Frontend Pages

### Public Website (`/`) — `src/pages/HomePage.tsx`
Single-page website with sections:
1. **Hero** — full-viewport dark hero with floating dashboard widget, GSAP animations
2. **Marquee** — scrolling crimson strip with service categories
3. **About** — founder card + values grid (dark bg)
4. **Stats bar** — animated counters (crimson strip)
5. **Services** — card grid fetched from API
6. **Portfolio** — filterable case studies fetched from API
7. **Testimonials** — testimonial grid fetched from API
8. **Contact** — react-hook-form contact form submitting to API
9. **Footer** — links and copyright

### Admin Panel (`/admin`) — `src/pages/AdminPage.tsx`
Clerk-protected admin CMS with dark sidebar navigation and views:
- **Dashboard** — stat cards (total services, portfolio, testimonials, unread contacts)
- **Services** — CRUD table with modal forms
- **Portfolio** — CRUD table with modal forms
- **Testimonials** — CRUD table with modal forms
- **Contacts** — list of submissions with read/unread status, mark as read
- **Settings** — form for hero text, about content, founder bio, contact email

## Running Locally

Workflows are auto-configured:
- `artifacts/zeeacts-website: web` — Vite dev server
- `artifacts/api-server: API Server` — Express API

## Environment Variables

Set automatically by Clerk provisioning:
- `CLERK_SECRET_KEY` — server auth
- `CLERK_PUBLISHABLE_KEY` — server
- `VITE_CLERK_PUBLISHABLE_KEY` — frontend
- `VITE_CLERK_PROXY_URL` — frontend proxy URL
- `DATABASE_URL` — PostgreSQL connection string

## Development Notes

- Run `pnpm --filter @workspace/db run push` to sync schema changes to DB
- Run `pnpm --filter @workspace/api-spec run codegen` to regenerate API hooks after OpenAPI changes
- Import React Query hooks from `@workspace/api-client-react` only
- Do NOT import from relative paths for API hooks
- Google Fonts `@import url(...)` MUST be the first line in `index.css` (before `@import "tailwindcss"`)
- The JSX transform handles React auto-import — do not import React explicitly
