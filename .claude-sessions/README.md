# Claude Code Session Archive

This folder syncs session transcripts across machines via iCloud.

## Why This Exists

Claude Code stores sessions in `~/.claude/projects/` which is **LOCAL to each machine**.
This folder provides cross-machine session continuity.

## Auto-Export Setup

Add this to `~/.claude/settings.json` on EACH machine:

```json
{
  "hooks": {
    "SessionEnd": [
      "cp ~/.claude/projects/-Users-supabowl-Library-Mobile-Documents-com-apple-CloudDocs-BHT-Promo-iCloud-Organized-AI-Windsurf-Clawdbot-Ready/*.jsonl '/Users/supabowl/Library/Mobile Documents/com~apple~CloudDocs/BHT Promo iCloud/Organized AI/Windsurf/Clawdbot Ready/.claude-sessions/' 2>/dev/null || true"
    ]
  }
}
```

## Manual Export

```bash
# Export current sessions to shared folder
cp ~/.claude/projects/-Users-supabowl-Library-Mobile-Documents-com-apple-CloudDocs-BHT-Promo-iCloud-Organized-AI-Windsurf-Clawdbot-Ready/*.jsonl .claude-sessions/
```

## Session Files

Each `.jsonl` file is a complete session transcript with:
- User messages
- Assistant responses
- Tool calls and results
- Timestamps

## CLI Tools

Session management tools are in `CLI/session-tools.sh`
