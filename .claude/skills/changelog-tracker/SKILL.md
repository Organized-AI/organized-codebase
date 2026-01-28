---
name: changelog-tracker
description: Fetches, verifies, and tracks Claude Code changelog updates from GitHub using Apify RAG Web Browser. Outputs formatted markdown to DOCUMENTATION/. Use when user wants to update changelog, verify changelog status, track Claude Code updates, fetch latest releases, or mentions "changelog", "claude code updates", "what's new in claude code", "verify changelog".
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Edit
---

# Claude Code Changelog Tracker

Automatically fetches and verifies the Claude Code changelog from GitHub, outputting clean formatted markdown to your project's `DOCUMENTATION/` directory.

## Features

- **Fetch**: Scrapes official Claude Code changelog via Apify RAG Web Browser
- **Verify**: Compares local vs upstream versions without fetching full content
- **Parse**: Cleans markdown content and adds metadata
- **Detect**: Identifies new versions compared to previous fetch
- **Integrate**: Works with Organized Codebase structure

## Prerequisites

1. **Apify Account**: Get your API token at https://console.apify.com/account/integrations
2. **Environment Variable**: Set `APIFY_TOKEN` in your environment
3. **Dependencies**: Run `npm install apify-client` in the Organized Codebase root

## Usage

### Verify Status (Quick Check)

Check if local changelog is up-to-date without fetching:

```bash
# Via CLI
node scripts/verify-changelog.js

# JSON output for automation
node scripts/verify-changelog.js --json
```

**Compares:**
- `https://github.com/Organized-AI/organized-codebase/blob/main/DOCUMENTATION/claude-code-changelog.md`  
- `https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md`

### Update Changelog (Full Fetch)

Fetch and update the local changelog:

```
/update-changelog
```

Or via CLI:
```bash
node scripts/fetch-changelog.js
```

## Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                 CHANGELOG TRACKER WORKFLOW                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐    ┌─────────────┐    ┌──────────────────┐   │
│  │  VERIFY  │───▶│  OUTDATED?  │───▶│  FETCH & UPDATE  │   │
│  └──────────┘    └─────────────┘    └──────────────────┘   │
│       │                │                     │              │
│       ▼                ▼                     ▼              │
│   Compare         If yes, show         Use Apify RAG       │
│   versions        missing versions     to fetch full       │
│   (fast)          and prompt           changelog           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    GIT WORKFLOW                       │  │
│  │  git add → git commit → git push                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-Step

1. **Verify** (Optional): Run `node scripts/verify-changelog.js` to check status
2. **Fetch**: If outdated, run `/update-changelog` or `node scripts/fetch-changelog.js`
3. **Review**: Check `DOCUMENTATION/claude-code-changelog.md`
4. **Commit**: `git add -A && git commit -m "docs: Update Claude Code Changelog to vX.X.X"`
5. **Push**: `git push origin main`

## Output Files

```
DOCUMENTATION/
├── claude-code-changelog.md   # Formatted changelog with metadata
└── changelog-raw.json         # Raw API response (for debugging)
```

## Verification Output Example

```
══════════════════════════════════════════════════════════════
  Claude Code Changelog Verification
  Comparing: Local ↔ Upstream
══════════════════════════════════════════════════════════════

📍 Sources:
   Local:    https://github.com/Organized-AI/organized-codebase/...
   Upstream: https://github.com/anthropics/claude-code/...

📊 Version Comparison:
────────────────────────────────────────
   Upstream Latest: v2.1.22
   Local Latest:    v2.1.20
   Upstream Total:  89 versions
   Local Total:     45 versions

⚠️  STATUS: UPDATES AVAILABLE

🆕 Missing Versions:
   • v2.1.22
   • v2.1.21

📝 To update, run:
   /update-changelog
══════════════════════════════════════════════════════════════
```

## Configuration

Edit `CONFIG/changelog-tracker.json` to customize:

```json
{
  "targets": [
    {
      "name": "claude-code",
      "url": "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md",
      "outputFile": "claude-code-changelog.md"
    }
  ],
  "output": {
    "directory": "DOCUMENTATION",
    "filename": "claude-code-changelog.md"
  },
  "verification": {
    "enabled": true,
    "checkOnStartup": false
  }
}
```

## Metadata Header

```markdown
---
title: Claude Code Changelog
source: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
fetched_at: 2025-01-28T12:00:00.000Z
latest_version: 2.1.22
total_versions: 45
actor: apify/rag-web-browser
generated_by: organized-codebase/changelog-tracker
---
```

## Exit Codes

| Script | Code | Meaning |
|--------|------|---------|
| verify-changelog.js | 0 | Up to date |
| verify-changelog.js | 1 | Updates available or error |
| fetch-changelog.js | 0 | Fetch successful |
| fetch-changelog.js | 1 | Fetch failed |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "APIFY_TOKEN not set" | Export your token: `export APIFY_TOKEN=apify_api_xxx` |
| Empty changelog | Check `changelog-raw.json` for API response |
| Verification fails | Check network connection to GitHub |
| Parse errors | The GitHub page structure may have changed |

## Integration with Other Skills

- **repo-manager**: Auto-commit changelog updates
- **skill-creator-enhanced**: Create custom changelog trackers
- **daily-checkpoint**: Track changelog updates in daily reviews
