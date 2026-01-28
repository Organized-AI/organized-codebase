---
name: verify-changelog
description: Verify local Claude Code changelog is up-to-date with upstream GitHub source. Compares versions without fetching full content.
user-invocable: true
allowed-tools:
  - Bash
---

# Verify Changelog

Quick verification that compares local changelog version against upstream.

**Compares:**
- Local: `DOCUMENTATION/claude-code-changelog.md`
- Upstream: `https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md`

## Usage

Run verification:
```bash
node scripts/verify-changelog.js
```

If outdated, run `/update-changelog` to fetch latest.
