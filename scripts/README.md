# Organized Codebase Scripts

Automation scripts for Claude Code project management.

---

## 📊 Token Tracker

**Automated token usage tracking for Claude Code**

### `update-token-tracker.js`

Parses Claude Code JSONL files and tracks token usage by model (Opus 4, Sonnet 4, Haiku 4).

**Features:**
- ✅ Weekly usage tracking (resets Monday 00:00)
- ✅ Daily usage tracking
- ✅ Per-model breakdown (Opus 4, Sonnet 4, Haiku 4)
- ✅ 5-hour window status from quota-tracker.json
- ✅ Runs in background automatically

**Usage:**

```bash
# Run manually
node scripts/update-token-tracker.js

# View results
cat ~/.claude/token-tracker.json | jq .
```

**Output Format:**

```json
{
  "lastUpdated": "2025-10-07T22:43:15.459Z",
  "weekStart": "2025-10-06T05:00:00.000Z",
  "todayStart": "2025-10-07T05:00:00.000Z",
  "weekly": {
    "total": 64497,
    "opus4": 0,
    "sonnet4": 64497,
    "haiku4": 0,
    "other": 0,
    "limits": {
      "opus4": 0,
      "sonnet4": 0
    }
  },
  "daily": {
    "total": 18154,
    "opus4": 0,
    "sonnet4": 18154,
    "haiku4": 0,
    "other": 0
  },
  "fiveHourWindow": {
    "limit": 200000,
    "remaining": 200000,
    "resetTime": "2025-10-06T21:45:26.016Z"
  }
}
```

---

## ⏰ Automated Setup

### `setup-cron.sh`

Installs hourly cron job for token tracking.

**Installation:**

```bash
bash scripts/setup-cron.sh
```

**What it does:**
- Creates hourly cron job (runs at :00 of every hour)
- Creates log directory at `~/.claude/logs/`
- Logs output to `~/.claude/logs/token-tracker.log`

**Schedule:**
```
0 * * * * node update-token-tracker.js
```

**Verify cron job:**
```bash
crontab -l | grep token-tracker
```

**Remove cron job:**
```bash
crontab -e
# Delete the line containing "update-token-tracker.js"
```

---

## 🤖 Claude Agent Setup

### `setup-agent.js`

AI-powered project configuration using Claude Agent SDK.

Analyzes your PLANNING documents and automatically:
- Generates package.json dependencies
- Creates .env.example variables
- Sets up directory structure
- Configures development scripts

**Usage:**

```bash
# From your project root (after filling PLANNING docs)
npm run agent:setup
```

**Requirements:**
- ANTHROPIC_API_KEY environment variable
- Completed PLANNING/01-project-brief.md (minimum)

---

## 📝 Integration with iCal Scheduler

The token tracker is designed to integrate with iCal-based session scheduling:

1. **Check budget before scheduling:**
   ```javascript
   const tracker = require('~/.claude/token-tracker.json');
   if (tracker.weekly.opus4 < OPUS_WEEKLY_LIMIT) {
     // Schedule Opus 4 session
   }
   ```

2. **Reserve budget for planned sessions:**
   ```javascript
   // Update limits.opus4 to reserve budget
   tracker.weekly.limits.opus4 = RESERVED_TOKENS;
   ```

3. **Track session completion:**
   ```javascript
   // After session, tracker auto-updates hourly
   // Check updated usage in token-tracker.json
   ```

---

## 🔧 Troubleshooting

**Token tracker not updating?**

```bash
# Check cron job is running
crontab -l | grep token-tracker

# Check logs
tail -f ~/.claude/logs/token-tracker.log

# Run manually to test
node scripts/update-token-tracker.js
```

**No JSONL files found?**

The tracker reads from `~/.claude/projects/`. Make sure you've used Claude Code at least once.

**Incorrect weekly totals?**

Weekly tracking resets every Monday at 00:00 local time. If you need different timing, edit the `getWeekStart()` function in `update-token-tracker.js`.

---

## 📚 Related Documentation

- CONFIG/DEVCONTAINER_INTEGRATION.md - DevContainer setup
- CONFIG/ARCHITECTURE.md - System architecture
- .devcontainer/setup-organized-codebase.sh - DevContainer automation

---

*Last Updated: 2025-10-07*
*Version: 1.0*
