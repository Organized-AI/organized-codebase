# Changelog Tracker Skill

Automated tracking and verification of Claude Code changelog updates.

## Components

```
changelog-tracker/
├── SKILL.md           # Main skill definition
├── README.md          # This file
├── commands/
│   ├── update-changelog.md    # /update-changelog command
│   └── verify-changelog.md    # /verify-changelog command
├── config/
│   └── changelog-tracker.json # Configuration options
└── scripts/
    ├── fetch-changelog.js     # Fetch via Apify RAG
    └── verify-changelog.js    # Remote-to-remote verification
```

## Quick Start

### Verify Status
```bash
node scripts/verify-changelog.js
```

### Fetch Updates
```bash
# Requires APIFY_TOKEN
export APIFY_TOKEN=apify_api_xxx
node scripts/fetch-changelog.js
```

## Verification Workflow

Compares two GitHub sources directly:
- **Local:** `Organized-AI/organized-codebase/.../claude-code-changelog.md`
- **Upstream:** `anthropics/claude-code/CHANGELOG.md`

Uses GitHub API to avoid CDN caching delays.

## Prerequisites

- Node.js 18+
- Apify account (for fetch)
- `npm install apify-client` (for fetch)

## Exit Codes

| Script | Code | Meaning |
|--------|------|---------|
| verify | 0 | Up to date |
| verify | 1 | Updates available |
| fetch | 0 | Success |
| fetch | 1 | Failed |

## Integration

Works with Organized Codebase template structure:
- Output: `DOCUMENTATION/claude-code-changelog.md`
- Config: `CONFIG/changelog-tracker.json`
