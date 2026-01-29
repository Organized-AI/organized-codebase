# Changelog Documentation Standards

> **Purpose:** Guidelines for writing clear, actionable changelog entries that support both human readers and the interactive update system.

---

## Entry Format

Every changelog entry should follow the **Fact + Context** pattern:

```
- [What changed]. [Why it matters or how to use it]
```

### Examples

**❌ Cryptic:**
```
- Auto-compact triggering too early on models with large output token limits
```

**✅ Clear:**
```
- Auto-compact triggering too early on models with large output token limits. Auto-compact automatically summarizes conversation history when approaching context limits to preserve session continuity
```

---

## Entry Categories

Each entry implicitly belongs to a category that determines how the interactive update system presents it to users.

### 🔧 Configuration Changes
Entries that affect `settings.json`, environment variables, or CLAUDE.md.

**User Action:** Review and optionally update local configuration.

**Markers:** `env var`, `settings.json`, `CLAUDE.md`, `configure`, `flag`

**Example:**
```
- `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` environment variable to override the default file read token limit
```

**Interactive Prompt:**
> "New env var available: `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS`. Would you like to add it to your shell profile?"

---

### ⚡ New Commands/Shortcuts
Entries introducing slash commands, keyboard shortcuts, or CLI flags.

**User Action:** Learn and optionally add to muscle memory or keybindings.

**Markers:** `/command`, `Ctrl+`, `Cmd+`, `--flag`, `shortcut`

**Example:**
```
- `/teleport` and `/remote-env` slash commands for claude.ai subscribers. `/teleport` lets you resume a Claude Code session that was started on claude.ai (cloud-based)
```

**Interactive Prompt:**
> "New command: `/teleport`. This lets you resume cloud sessions locally. Try it now?"

---

### 🔌 Tool/Integration Changes
Entries affecting MCP tools, plugins, or external integrations.

**User Action:** Update permissions, install plugins, or configure integrations.

**Markers:** `MCP`, `mcp__`, `plugin`, `tool`, `integration`, `Chrome`, `VSCode`

**Example:**
```
- Wildcard syntax `mcp__server__*` for MCP tool permissions to allow or deny all tools from a server
```

**Interactive Prompt:**
> "New MCP permission syntax available. Would you like to review your current MCP permissions?"

---

### 🏗️ Architecture/System Changes
Entries that change core behavior or introduce new systems.

**User Action:** Understand implications, possibly migrate from old patterns.

**Markers:** `system`, `replacing`, `new`, `architecture`, `Task system`, `SDK`

**Example:**
```
- **New Task system** replacing the old TODO/TodoWrite system. Tasks provide better tracking with unique IDs, status management, and a `TaskUpdate` tool for modifications
```

**Interactive Prompt:**
> "Breaking change: TodoWrite → Task system. Your existing workflows will still work, but consider updating custom commands that reference TodoWrite."

---

### 🐛 Bug Fixes
Entries that fix broken behavior.

**User Action:** Usually none—just awareness that an issue is resolved.

**Markers:** `Fixed`, `bug`, `issue`, `crash`, `error`

**Example:**
```
- Crashes on processors without AVX instruction support
```

**Interactive Prompt:**
> "Bug fixed: AVX processor crashes. No action needed."

---

### 📈 Improvements
Entries that enhance existing features without changing behavior.

**User Action:** Usually none—performance or UX is just better.

**Markers:** `Improved`, `performance`, `reliability`, `UX`

**Example:**
```
- Terminal rendering performance when using native installer or Bun, especially for text with emoji
```

**Interactive Prompt:**
> "Performance improved: Terminal rendering is faster. No action needed."

---

### ⚠️ Breaking Changes / Removals
Entries that remove features or change defaults.

**User Action:** Update workflows, learn new patterns.

**Markers:** `Removed`, `Changed`, `breaking`, `no longer`, `instead`

**Example:**
```
- `#` shortcut for quick memory entry. Previously, typing `#` at the prompt start would add a note to Claude's memory. Now, ask Claude directly to "remember this" or "add to CLAUDE.md" instead
```

**Interactive Prompt:**
> "Removed: `#` memory shortcut. Migration: Ask Claude to 'remember this' or 'add to CLAUDE.md' instead."

---

## Structured Metadata (For Interactive System)

When the interactive update system parses changelog entries, it should extract:

```yaml
entry:
  version: "2.1.19"
  category: "architecture"  # config | command | tool | architecture | fix | improvement | breaking
  summary: "New Task system replacing TodoWrite"
  action_required: true
  action_type: "awareness"  # awareness | config_update | learn_command | migrate
  migration_path: "Set CLAUDE_CODE_ENABLE_TASKS=false to use legacy system temporarily"
  related_files:
    - ".claude/settings.json"
  commands_to_try:
    - "/tasks"
  learn_more: "https://docs.anthropic.com/claude-code/tasks"
```

---

## Writing Checklist

Before adding a changelog entry, verify:

- [ ] **Self-sufficient:** Can someone understand this without external context?
- [ ] **Actionable:** If action is needed, is the path clear?
- [ ] **Categorizable:** Does it clearly fit one of the categories above?
- [ ] **Linked:** Are related features mentioned (e.g., "part of the Task system introduced in 2.1.19")?
- [ ] **Migration path:** For breaking changes, is the old→new path explained?

---

## Version Linking

When features span multiple versions, link them:

```
- Ability to delete tasks via the `TaskUpdate` tool (part of the new Task system introduced in 2.1.19)
```

This helps users understand feature evolution and find related changes.

---

## Interactive Update System Integration

This standards document supports the planned interactive update workflow:

```
┌─────────────────────────────────────────────────────────────────┐
│  CHANGELOG UPDATE DETECTED: v2.1.19 → v2.1.22                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏗️ Architecture Changes (1)                                    │
│  └─ New Task system replacing TodoWrite                         │
│     └─ [Learn more] [Update settings] [Skip]                    │
│                                                                 │
│  ⚡ New Commands (2)                                             │
│  ├─ /teleport - Resume cloud sessions locally                   │
│  │  └─ [Try it] [Skip]                                          │
│  └─ /keybindings - Customize keyboard shortcuts                 │
│     └─ [Configure] [Skip]                                       │
│                                                                 │
│  🐛 Bug Fixes (5) - No action required                          │
│                                                                 │
│  [Apply All Recommendations] [Review One-by-One] [Dismiss]      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

The interactive system can:
1. **Parse** changelog entries using category markers
2. **Present** grouped by action type (config, learn, migrate, awareness)
3. **Execute** recommended actions (update settings, open docs, run commands)
4. **Track** which updates the user has acknowledged

---

## Related Files

- [claude-code-changelog.md](./claude-code-changelog.md) - The changelog itself
- `.claude/skills/changelog-tracker/` - Skill that fetches and updates changelog
- `.claude/skills/update-changelog/` - Skill that runs the interactive update flow (planned)
