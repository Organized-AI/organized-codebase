#!/usr/bin/env bash
# Apply D1 migrations for an environment, when wrangler.jsonc has a D1 database with a migrations_dir.
# Migrations must be additive: they run before the new version takes traffic.
#   scripts/gitops/migrate.sh [production|staging]
set -euo pipefail
cd "$(dirname "$0")/../.."
ENV="${1:-production}"
DB="$(node -e "
const s=require('fs').readFileSync('wrangler.jsonc','utf8').replace(/^\s*\/\/.*$/gm,'').replace(/,(\s*[}\]])/g,'\$1');
const c=JSON.parse(s); const e='$ENV'==='production'?c:(c.env||{})['$ENV']||{};
const d=(e.d1_databases||[]).find(d=>d.migrations_dir); console.log(d?d.database_name:'');
" 2>/dev/null || true)"
if [ -z "$DB" ]; then echo "no D1 migrations for $ENV"; exit 0; fi
if [ "$ENV" = "production" ]; then npx wrangler d1 migrations apply "$DB" --remote
else npx wrangler d1 migrations apply "$DB" --remote --env "$ENV"; fi
