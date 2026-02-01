# CLI Tools

Custom command-line tools for this codebase. These sync across machines via iCloud.

## Session Sync (Automatic)

Sessions sync automatically between machines. **No manual steps required.**

### First-Time Setup

Run once on each new machine:
```bash
./claude-auto-sync.sh
```

This installs hooks that run automatically:
- **Session Start**: Imports sessions from other machines
- **Session End**: Exports your sessions to iCloud

### How It Works

1. Hooks trigger on Claude Code session start/end
2. Sessions export to `~/Library/Mobile Documents/.../Claude-Code-Sessions/<hostname>/`
3. iCloud syncs the folder across your Macs
4. Remote environments (SSH, Codespaces, Docker) use git-based sync instead

### Intelligent Operations

Use the `icloud-sync` skill for status, search, and troubleshooting:
- "Check sync status"
- "Search past sessions for [topic]"
- "What machines have synced?"

## Available Tools

### session-tools.sh - Session Search & Memory

Search session content and manage persistent learnings.

```bash
# List recent sessions
./session-tools.sh list
./session-tools.sh list 30  # Last 30 days

# Search session content
./session-tools.sh search "disk space"
./session-tools.sh search "Lume" "Clawdbot"

# Store learnings in memory MCP
./session-tools.sh store "LumeInstallation" "Use Homebrew-first approach"

# Search memory
./session-tools.sh memory-search "Lume"
```

### claude-auto-sync.sh - Hook Executor

Runs automatically via hooks. Not for manual use.

## Adding Tools to PATH

Add this to your `~/.zshrc` or `~/.bashrc`:

```bash
export PATH="$PATH:/path/to/CLI"
```

## Dependencies

- **jq** - JSON processor (`brew install jq`)
- **mcporter** - MCP tool runner (`npm install -g mcporter`) - optional, for Memory MCP

## Creating New Tools

1. Add your script to this directory
2. Make it executable: `chmod +x your-tool.sh`
3. Document it in this README
4. Tools sync automatically via iCloud
