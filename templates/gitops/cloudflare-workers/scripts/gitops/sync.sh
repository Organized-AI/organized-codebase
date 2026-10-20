#!/usr/bin/env bash
# Reconcile: make Cloudflare run exactly the version deploy/envs/<env>.json names on origin/main.
# Like an Argo CD sync: it reads Git, never a local file, and does nothing when Cloudflare already matches.
#   scripts/gitops/sync.sh [env]         SKIP_E2E=1 to skip the post-deploy suite
set -euo pipefail
cd "$(dirname "$0")/../.."
ENV="${1:-production}"
FILE="deploy/envs/$ENV.json"

git fetch -q origin main
WANT="$(git show "origin/main:$FILE" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);if(!j.version_id){console.error('no version_id in $FILE');process.exit(3)}console.log(j.version_id+' '+j.commit)})")"
VERSION_ID="${WANT%% *}"; COMMIT="${WANT##* }"
LIVE="$(npx wrangler deployments status --json 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const j=JSON.parse(s);const v=(j.versions||[]).find(v=>v.percentage===100);console.log(v?v.version_id:'')}catch{console.log('')}})" || true)"

if [ "$LIVE" = "$VERSION_ID" ]; then
  echo "in sync: $ENV already runs $VERSION_ID ($COMMIT)"
else
  bash scripts/gitops/migrate.sh "$ENV"
  npx wrangler versions deploy "$VERSION_ID@100%" --yes --message "gitops sync $ENV → $COMMIT"
  echo "synced: $ENV now runs $VERSION_ID ($COMMIT)"
fi
if [ "${SKIP_E2E:-0}" != "1" ]; then
  bash scripts/gitops/e2e.sh
fi
