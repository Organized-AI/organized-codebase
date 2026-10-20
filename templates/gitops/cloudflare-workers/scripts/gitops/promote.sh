#!/usr/bin/env bash
# Propose a deploy: write one version id into deploy/envs/<env>.json on a branch and open a pull request.
# Merging that pull request is the deploy decision; sync.sh (or deploy.yml) makes Cloudflare match it.
#   scripts/gitops/promote.sh <version-id> [env]
set -euo pipefail
cd "$(dirname "$0")/../.."
VERSION_ID="${1:?usage: promote.sh <version-id> [env]}"
ENV="${2:-production}"
FILE="deploy/envs/$ENV.json"
SHA="$(git rev-parse --short=12 HEAD)"
SUBJECT="$(git log -1 --format=%s | cut -c1-90)"
BRANCH="gitops/$ENV-$SHA"
WORKER="$(node -e "const j=JSON.parse(require('fs').readFileSync('$FILE','utf8'));console.log(j.worker)")"

# Come back to where we started, a branch or a detached checkout (CI, a release worktree).
ORIG="$(git symbolic-ref -q --short HEAD || git rev-parse HEAD)"

git fetch -q origin main
git switch -q -C "$BRANCH" origin/main
node -e "
const fs=require('fs');
fs.writeFileSync('$FILE', JSON.stringify({ worker: '$WORKER', version_id: '$VERSION_ID', commit: '$SHA', uploaded_at: new Date().toISOString(), message: process.argv[1] }, null, 2) + '\n');
" "$SUBJECT"
git add "$FILE"
git commit -q -m "deploy($ENV): $SHA $SUBJECT" -m "Version $VERSION_ID of $WORKER, built from $SHA. Merging this deploys it."
git push -q -u origin "$BRANCH"
gh pr create --base main --head "$BRANCH" --title "Deploy $SHA to $ENV" \
  --body "$(printf 'Deploys Worker version `%s` (%s) to **%s**.\n\n- Built once from `%s`: %s\n- Only `%s` changes. Merging this pull request is the deploy; reverting it rolls back.\n' "$VERSION_ID" "$WORKER" "$ENV" "$SHA" "$SUBJECT" "$FILE")"
git switch -q "$ORIG" 2>/dev/null || git switch -q --detach "$ORIG"
