#!/bin/sh
set -e

# Coolify/Railway/local: inject runtime API origin into the static frontend.
# The app reads `window.__ENV.API_URL` at runtime (see `src/runtime-env.ts`).
API_URL="${API_URL:-}"
export API_URL

envsubst '${API_URL}' < /usr/share/nginx/html/env.js.template > /usr/share/nginx/html/env.js

exec nginx -g 'daemon off;'

