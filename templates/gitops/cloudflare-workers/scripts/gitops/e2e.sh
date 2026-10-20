#!/usr/bin/env bash
# Run the project's e2e suite (npm run e2e) if it has one, otherwise the starter smoke test. Failures fail.
set -euo pipefail
cd "$(dirname "$0")/../.."
if [ "$(npm pkg get scripts.e2e 2>/dev/null)" != "{}" ] && [ -n "$(npm pkg get scripts.e2e 2>/dev/null)" ]; then
  npm run e2e
else
  node tests/e2e/smoke.mjs
fi
