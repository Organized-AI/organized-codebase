# iCloud Sync - Claude Code Session Intelligence

Automatic cross-machine session synchronization via hooks.

## How It Works

**Zero manual effort required.** Sessions sync automatically:

1. **Session Start** → Imports sessions from other machines
2. **Session End** → Exports your sessions to iCloud
3. **Remote environments** → Falls back to git-based sync

## First-Time Setup

Run once on each new machine:
```bash
CLI/claude-auto-sync.sh
```

This auto-installs the hooks. After that, everything is automatic.

## Architecture

```
LOCAL (per-machine)                    ICLOUD (shared)
─────────────────                      ───────────────
~/.claude/                             ~/Library/Mobile Documents/.../
  projects/                              Claude-Code-Sessions/
    <project-hash>/                        <hostname>/
      *.jsonl (sessions)       ←sync→        projects/
      sessions-index.json                    *.jsonl
  history.jsonl                              .last_sync

REMOTE ENVIRONMENTS (Codespaces, SSH, Docker)
──────────────────────────────────────────────
Falls back to git-based sync via .claude-sessions/
```

## Skill Actions

When the user asks about sessions or sync, respond intelligently:

### "Check sync status"
```bash
# Show sync info
ls -la ~/Library/Mobile\ Documents/com~apple~CloudDocs/BHT\ Promo\ iCloud/Organized\ AI/Claude-Code-Sessions/

# View sync log
tail -20 ~/Library/Mobile\ Documents/com~apple~CloudDocs/BHT\ Promo\ iCloud/Organized\ AI/Claude-Code-Sessions/.sync.log
```

### "What machines have synced?"
```bash
# List all machines in sync folder
for d in ~/Library/Mobile\ Documents/com~apple~CloudDocs/BHT\ Promo\ iCloud/Organized\ AI/Claude-Code-Sessions/*/; do
    name=$(basename "$d")
    last=$(cat "$d/.last_sync" 2>/dev/null || echo "never")
    count=$(find "$d/projects" -name "*.jsonl" 2>/dev/null | wc -l)
    echo "$name: $count sessions, last sync: $last"
done
```

### "Search past sessions for [topic]"
```bash
CLI/session-tools.sh search "[topic]"
```

### "List recent sessions"
```bash
CLI/session-tools.sh list 7
```

### "Force sync now"
```bash
CLI/claude-auto-sync.sh end   # Export
CLI/claude-auto-sync.sh start # Import
```

### "Setup sync on this machine"
```bash
CLI/claude-auto-sync.sh
```

## Session Search Tool

For searching session content, use `session-tools.sh`:

```bash
# Search all sessions for content
CLI/session-tools.sh search "error message"
CLI/session-tools.sh search "feature name"

# List sessions from last N days
CLI/session-tools.sh list      # Last 7 days
CLI/session-tools.sh list 30   # Last 30 days

# Show specific session
CLI/session-tools.sh show <session-id>
```

## Memory MCP Integration

Store persistent learnings across sessions:

```bash
# Store a learning
CLI/session-tools.sh store "EntityName" "What you learned"

# Search knowledge
CLI/session-tools.sh memory-search "topic"

# Read all knowledge
CLI/session-tools.sh memory-read
```

## Troubleshooting

| Symptom | Diagnosis | Fix |
|---------|-----------|-----|
| Sessions not syncing | Hooks not installed | Run `CLI/claude-auto-sync.sh` |
| No other machines visible | They haven't synced yet | Wait for their session to end |
| iCloud not syncing | Check iCloud Drive status | Open Finder → iCloud Drive |
| Permission denied | Scripts not executable | `chmod +x CLI/*.sh` |
| Git sync failing | Remote env issues | Check git credentials |

## File Reference

```
CLI/
├── claude-auto-sync.sh   # Hook executor (auto-runs)
├── session-tools.sh      # Search + Memory MCP
└── README.md             # Documentation

.claude-sessions/         # Git-based sync for remote envs
└── <hostname>/           # Machine-specific sessions
```

## When to Use This Skill

Trigger on:
- "sync my sessions"
- "check sync status"
- "what happened in my last session"
- "search sessions for..."
- "list my sessions"
- "setup session sync"
- "sessions from other machines"
