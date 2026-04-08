# Build a production-ready static frontend image (nginx)
#
# Build context:
# - Coolify: set build context to the repository root (`d:/Cursor/zeeact`)
# - Dockerfile path: `artifacts/zeeacts-website/Dockerfile`

FROM node:20-slim AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY artifacts ./artifacts
COPY lib ./lib
COPY scripts ./scripts

RUN pnpm install --no-frozen-lockfile

RUN pnpm --filter @workspace/zeeacts-website run build

FROM nginx:1.27-alpine AS runner

RUN apk add --no-cache gettext

COPY --from=builder /app/artifacts/zeeacts-website/dist/public/ /usr/share/nginx/html/

COPY artifacts/zeeacts-website/nginx.conf /etc/nginx/conf.d/default.conf
COPY artifacts/zeeacts-website/docker-entrypoint.sh /docker-entrypoint.sh
COPY artifacts/zeeacts-website/env.js.template /usr/share/nginx/html/env.js.template

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

