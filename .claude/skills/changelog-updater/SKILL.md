---
name: changelog-updater
description: |
  Interactive changelog update assistant that notifies users of new Claude Code
  features and helps them understand and apply relevant changes to their workflow.
  Parses changelog entries by category, presents grouped updates, and executes
  approved configuration changes.
metadata:
  version: 0.1.0
  author: Organized Codebase
  dependencies: []
  integrates_with: changelog-tracker, settings.json
triggers:
  - "check for updates"
  - "what's new in claude code"
  - "apply changelog updates"
  - "review claude code changes"
  - "update my setup"
allowed-tools:
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - Bash
  - AskUserQuestion
---

# Changelog Updater Skill

Helps users stay current with Claude Code updates by presenting changes in an actionable, contextual way.

## When to Use

This skill activates when:
- User asks "what's new" or "check for updates"
- Changelog has been updated (triggered by changelog-tracker)
- User wants to review and apply recommended changes

## Workflow

### Phase 1: Detection
```
1. Read local changelog version from DOCUMENTATION/claude-code-changelog.md
2. Compare against latest fetched version
3. Identify new entries since last acknowledged version
```

### Phase 2: Classification
```
For each new entry, detect category using markers:

Category Markers:
- config:       env var, settings.json, CLAUDE.md, configure, flag
- command:      /command, Ctrl+, Cmd+, --flag, shortcut
- tool:         MCP, mcp__, plugin, tool, integration, Chrome, VSCode
- architecture: system, replacing, new, architecture, Task system, SDK
- fix:          Fixed, bug, issue, crash, error
- improvement:  Improved, performance, reliability, UX
- breaking:     Removed, Changed, breaking, no longer, instead
```

### Phase 3: Presentation
```
Group entries by action type:

🏗️ Architecture Changes (needs understanding)
   └─ [Learn more] [Acknowledge]

⚡ New Commands (can try immediately)
   └─ [Try it] [Skip]

🔧 Config Updates (can apply to settings)
   └─ [Apply] [Skip]

⚠️ Breaking Changes (needs migration)
   └─ [View migration] [Acknowledge]

📈 Improvements (just awareness)
   └─ [Acknowledge all]
```

### Phase 4: Execution
```
Based on user selection:
- Config: Update settings.json or suggest env var additions
- Command: Explain and optionally demonstrate the command
- Breaking: Show migration path from CHANGELOG-STANDARDS.md
- Architecture: Explain implications for user's workflow
```

### Phase 5: Tracking
```
Store acknowledged versions in:
.claude/changelog-updater-state.json

{
  "last_acknowledged_version": "2.1.22",
  "acknowledged_entries": ["2.1.22-fix-1", "2.1.21-feat-1"],
  "applied_configs": ["CLAUDE_CODE_ENABLE_TASKS"],
  "skipped_entries": ["2.1.20-vim-motions"]
}
```

## Example Interaction

```
╭─────────────────────────────────────────────────────────────────╮
│  📋 Claude Code Updates Available (v2.1.19 → v2.1.22)           │
╰─────────────────────────────────────────────────────────────────╯

🏗️ Architecture Changes
   New Task system replacing TodoWrite
   ├─ Tasks now have unique IDs and better status tracking
   ├─ Your workflow: Consider updating any custom commands that reference TodoWrite
   └─ [Learn more] [I understand]

⚡ New Commands (2)
   /teleport - Resume cloud sessions locally
   └─ [Try /teleport] [Skip]

   /keybindings - Customize keyboard shortcuts
   └─ [Open /keybindings] [Skip]

🔧 Suggested Config Updates
   CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS - Override file read limits
   └─ [Add to shell profile] [Skip]

📈 Improvements & Fixes (7)
   Performance, bug fixes, and UX improvements
   └─ [View details] [Acknowledge all]

────────────────────────────────────────────────────────────────────
[Apply All Recommendations] [Review One-by-One] [Dismiss for Now]
```

## Integration with changelog-tracker

When changelog-tracker fetches a new changelog:
1. It updates DOCUMENTATION/claude-code-changelog.md
2. This skill can be triggered to process updates
3. User is prompted only for genuinely new entries

## Files

- `feature_list.json` - Development progress tracking
- `claude-progress.txt` - Session handoff notes
- `SKILL.md` - This file

## Development Status

This skill is under active development using the Ralphy/long-runner methodology.
See `feature_list.json` for current progress.
