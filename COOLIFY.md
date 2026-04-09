# Coolify Deployment (Nixpacks)

This repository is a pnpm monorepo and should be deployed from the repository root.

## Resource Settings

- Build Pack: `Nixpacks`
- Base Directory: repository root
- Start Command: read from `nixpacks.toml`
- Health Check Path: `/api/healthz`

## Required Environment Variables

Runtime:

- `PORT` (usually injected by Coolify)
- `DATABASE_URL`
- `NODE_ENV=production`
- `SITE_URL` (public app URL, e.g. `https://example.com`)

Frontend build-time:

- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_CLERK_PROXY_URL` (if using Clerk proxy)

Backend runtime (if using auth):

- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Recommended runtime:

- `ALLOWED_ORIGINS` (comma-separated allowed browser origins)
- `ADMIN_USER_IDS`

Optional:

- `RUN_DB_PUSH_ON_BOOT=true|false` (default `true`)
- `SEED_ON_BOOT=true|false` (default `false`)
- `R2_*` and `RESEND_*` variables if those integrations are enabled

## Notes

- `nixpacks.toml` sets `NODE_ENV` to production by default at startup.
- Startup DB sync uses `drizzle-kit push` (non-force) when `RUN_DB_PUSH_ON_BOOT` is enabled.
- Seeding does not run by default in production; enable with `SEED_ON_BOOT=true` only when needed.
