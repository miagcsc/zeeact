# Build context:
# - Coolify: set build context to repository root (`d:/Cursor/zeeact`)
# - Dockerfile path: `artifacts/api-server/Dockerfile`

FROM node:20-slim AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc tsconfig.base.json tsconfig.json ./
COPY artifacts ./artifacts
COPY lib ./lib
COPY scripts ./scripts

RUN pnpm install --no-frozen-lockfile

# Railway currently deploys a single container that serves the frontend
# and the API (API server serves the built website from dist/public).
RUN pnpm --filter @workspace/zeeacts-website run build
RUN pnpm --filter @workspace/api-server run build

FROM node:20-slim AS runner
WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/artifacts ./artifacts
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/.npmrc ./.npmrc

# Coolify/Railway/local: require `PORT` (and optionally `HOST`) env vars.
CMD ["sh", "-c", "pnpm --filter @workspace/db run push-force && pnpm --filter @workspace/api-server run start"]

