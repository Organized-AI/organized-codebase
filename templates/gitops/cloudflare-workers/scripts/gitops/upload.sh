#!/usr/bin/env bash
# Build once: upload the committed tree as a Worker version, tagged with its commit. Nothing is deployed.
#   scripts/gitops/upload.sh                 → prints the version id (and writes it to $GITHUB_OUTPUT in CI)
set -euo pipefail
cd "$(dirname "$0")/../.."

if [ -n "$(git status --porcelain --untracked-files=no)" ] && [ "${ALLOW_DIRTY:-0}" != "1" ]; then
  echo "refusing to upload: the working tree has uncommitted changes (commit first)" >&2
  exit 2
fi
SHA="$(git rev-parse --short=12 HEAD)"
SUBJECT="$(git log -1 --format=%s | cut -c1-90)"
OUT="$(npx wrangler versions upload --tag "$SHA" --message "$SHA $SUBJECT" 2>&1)" || { echo "$OUT" >&2; exit 1; }
echo "$OUT" | grep -vE "^\s*$" | tail -n 6 >&2
VERSION_ID="$(echo "$OUT" | grep -oE 'Worker Version ID: [0-9a-f-]{36}' | awk '{print $4}' | tail -n1)"
[ -n "$VERSION_ID" ] || { echo "no version id in wrangler's output" >&2; exit 1; }
echo "$VERSION_ID"
[ -n "${GITHUB_OUTPUT:-}" ] && { echo "version_id=$VERSION_ID"; echo "commit=$SHA"; } >> "$GITHUB_OUTPUT"
exit 0
