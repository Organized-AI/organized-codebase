---
name: update-changelog
description: Fetch the latest Claude Code changelog from GitHub and update DOCUMENTATION/
user-invocable: true
allowed-tools:
  - Bash
  - Read
---

# Update Claude Code Changelog

Fetches the latest Claude Code changelog from the official GitHub repository and updates `DOCUMENTATION/CLAUDE-CODE-CHANGELOG.md`.

## Prerequisites

Ensure APIFY_TOKEN is set in your environment:
```bash
export APIFY_TOKEN=apify_api_xxxxx
```

## Execution

Run the fetch script:

```bash
cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
node scripts/fetch-changelog.js
```

## What This Does

1. Calls Apify RAG Web Browser to scrape the GitHub changelog
2. Parses and cleans the markdown content
3. Compares with existing changelog to detect new versions
4. Writes formatted output to `DOCUMENTATION/CLAUDE-CODE-CHANGELOG.md`
5. Saves raw API response to `DOCUMENTATION/changelog-raw.json`

## Output Summary

After completion, report:
- Latest version number
- Total versions in changelog
- Any new versions detected since last fetch
- File location of updated changelog

## Quick Summary Format

```
📋 Claude Code Changelog Updated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Status: Success
📦 Latest Version: [version]
🔢 Total Versions: [count]
🆕 New Versions: [list or "None"]
📄 Output: DOCUMENTATION/CLAUDE-CODE-CHANGELOG.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Troubleshooting

If fetch fails:
1. Verify `APIFY_TOKEN` is set: `echo $APIFY_TOKEN`
2. Check internet connectivity
3. Ensure `apify-client` is installed: `npm install apify-client`
4. Review `DOCUMENTATION/changelog-raw.json` for API response details
