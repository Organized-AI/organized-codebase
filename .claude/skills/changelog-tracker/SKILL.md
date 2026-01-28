---
name: changelog-tracker
description: Fetches and tracks Claude Code changelog updates from GitHub using Apify RAG Web Browser. Outputs formatted markdown to DOCUMENTATION/. Use when user wants to update changelog, track Claude Code updates, fetch latest releases, or mentions "changelog", "claude code updates", "what's new in claude code".
user-invocable: true
allowed-tools:
  - Bash
  - Read
  - Edit
---

# Claude Code Changelog Tracker

Automatically fetches the Claude Code changelog from GitHub and outputs clean, formatted markdown to your project's `DOCUMENTATION/` directory.

## Features

- Scrapes official Claude Code changelog via Apify RAG Web Browser
- Parses and cleans markdown content
- Adds metadata header with timestamps and version info
- Detects new versions compared to previous fetch
- Integrates with Organized Codebase structure

## Prerequisites

1. **Apify Account**: Get your API token at https://console.apify.com/account/integrations
2. **Environment Variable**: Set `APIFY_TOKEN` in your environment
3. **Dependencies**: Run `npm install apify-client` in the Organized Codebase root

## Usage

### Via Slash Command
```
/update-changelog
```

### Via CLI
```bash
# From Organized Codebase root
node scripts/fetch-changelog.js
```

### Via npm script
```bash
npm run changelog:fetch
```

## Workflow

1. **Check Environment**: Verify APIFY_TOKEN is set
2. **Fetch Changelog**: Call Apify RAG Web Browser actor
3. **Parse Content**: Extract and clean markdown
4. **Detect Changes**: Compare with existing changelog
5. **Write Output**: Save to `DOCUMENTATION/CLAUDE-CODE-CHANGELOG.md`
6. **Report Results**: Show version count and any new releases

## Output Location

```
DOCUMENTATION/
├── CLAUDE-CODE-CHANGELOG.md   # Formatted changelog with metadata
└── changelog-raw.json          # Raw API response (for debugging)
```

## Configuration

Edit `CONFIG/changelog-tracker.json` to customize:
- Target URLs
- Output settings
- Scheduling options

## Example Output Header

```markdown
---
title: Claude Code Changelog
source: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
fetched_at: 2025-01-28T12:00:00.000Z
latest_version: 2.1.4
total_versions: 45
---
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "APIFY_TOKEN not set" | Export your token: `export APIFY_TOKEN=apify_api_xxx` |
| Empty changelog | Check `changelog-raw.json` for API response |
| Parse errors | The GitHub page structure may have changed |

## Integration with Other Skills

This skill works well with:
- **repo-manager**: Auto-commit changelog updates
- **skill-creator-enhanced**: Create custom changelog trackers for other projects
