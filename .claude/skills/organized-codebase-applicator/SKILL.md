---
name: organized-codebase-applicator
description: Applies Organized Codebase template structure to existing projects, creates Claude Code Plugins, and cleans up unused/redundant directories. Use when user wants to organize an existing project, apply the Organized Codebase template, create a plugin, clean up a messy codebase, remove iteration folders, standardize project structure, or mentions "organized codebase", "clean up codebase", "apply template", "create plugin", "remove unused folders", "standardize project", or "clean up directories".
---

# Organized Codebase Applicator

Applies the Organized Codebase template to existing projects, creates Claude Code Plugins for distribution, and performs intelligent cleanup of unused or redundant directories.

## Workflow Overview

| Phase | Purpose |
|-------|---------|
| 1. Analysis | Analyze project structure |
| 2. Cleanup | Archive redundant directories |
| 3. Template | Create standard directories |
| 4. Plugin | Create distributable plugin (optional) |
| 5. Migration | Move content to new locations |
| 6. Finalize | Update references, git commit |

---

## Phase 1: Analysis

Analyze target project before making changes:

1. List current structure with `find . -type d -maxdepth 3`
2. Identify redundancy patterns: `-v[0-9]`, `-old`, `-backup`, `-pwa`, `-app` suffixes
3. Detect regenerable directories: `node_modules/`, `dist/`, `build/`, `.next/`
4. Check for existing Organized Codebase directories
5. **Determine if project should be a Plugin** (see Plugin Decision Tree)

---

## Phase 2: Cleanup

Archive iteration directories to `.archive/` (never delete):

```bash
# Patterns to archive
*-pwa/           # PWA variants
*-app/           # App variants  
*-v[0-9]*/       # Version iterations
*-old/           # Old versions
*-backup/        # Backups
```

**Safety rules**:
- Never delete `.git/`
- Always archive (don't delete)
- Confirm before making changes

---

## Phase 3: Template Application

Create these directories if they don't exist:

```
.claude/           # Claude Code LOCAL configuration
├── agents/        # Local agent definitions
├── commands/      # Local slash commands
├── hooks/         # Local pre/post hooks
├── skills/        # Local skills
└── settings.json  # Claude Code settings

PLANNING/          # Project planning docs
ARCHITECTURE/      # System architecture docs
DOCUMENTATION/     # General documentation
SPECIFICATIONS/    # Functional/technical specs
AGENT-HANDOFF/     # Agent handoff instructions
CONFIG/            # Configuration files
scripts/           # Automation scripts
.archive/          # Archived iterations
```

---

## Phase 4: Plugin Creation (Optional)

### Plugin Decision Tree

Create a Plugin when:
- ✅ Project provides reusable commands, agents, or skills
- ✅ Functionality should be shared across projects/teams
- ✅ Will be distributed via marketplace
- ✅ Contains autonomous workflows others can use

Use local `.claude/` only when:
- ❌ Project-specific configuration only
- ❌ No need to share with others
- ❌ One-time implementation

### Plugin Structure

Plugins live at the **project root** (not inside `.claude/`):

```
project-root/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest (REQUIRED)
├── commands/                # Slash commands (at root, not .claude/)
│   ├── deploy.md
│   ├── status.md
│   └── rollback.md
├── agents/                  # Agents (at root)
│   └── automation-agent.md
├── skills/                  # Skills (at root)
│   └── my-skill/
│       └── SKILL.md
├── hooks/                   # Hooks (at root)
│   └── hooks.json
│
├── .claude/                 # LOCAL config (separate from plugin)
│   └── settings.json
├── PLANNING/
├── CONFIG/
└── ...
```

### Plugin Manifest Schema

Create `.claude-plugin/plugin.json`:

```json
{
  "name": "plugin-name",
  "description": "What this plugin does",
  "version": "1.0.0",
  "author": {
    "name": "Author Name",
    "url": "https://github.com/org"
  },
  "keywords": ["keyword1", "keyword2"],
  "repository": {
    "type": "git",
    "url": "https://github.com/org/repo"
  },
  "license": "MIT",
  "engines": {
    "claude-code": ">=1.0.0"
  },
  "capabilities": {
    "commands": true,
    "agents": true,
    "skills": true,
    "hooks": true
  }
}
```

### Command File Template

Create `commands/my-command.md`:

```markdown
---
description: Brief description of what this command does
---

# Command Title

Detailed description of the command's purpose and behavior.

## What This Command Does

1. Step one
2. Step two
3. Step three

## Prerequisites

- Requirement one
- Requirement two

## Usage

Instructions for how to use the command.

## Success Criteria

- [ ] Expected outcome one
- [ ] Expected outcome two
```

### Agent File Template

Create `agents/my-agent.md`:

```markdown
---
name: agent-name
description: Agent description
triggers:
  - "trigger phrase one"
  - "trigger phrase two"
---

# Agent Name

## Purpose

What this agent does autonomously.

## Workflow

### Phase 1: [Name]
[Steps]

### Phase 2: [Name]
[Steps]

## Tools Required

- Tool 1
- Tool 2

## Success Criteria

- [ ] Outcome one
- [ ] Outcome two
```

### Skill File Template

Create `skills/my-skill/SKILL.md`:

```markdown
---
name: skill-name
description: What this skill enables Claude to do
triggers:
  - "when user asks about X"
  - "when task involves Y"
---

# Skill Name

## Capabilities

- Capability one
- Capability two

## Usage

How Claude should apply this skill.

## Examples

Example invocations and responses.
```

### Hooks File Template

Create `hooks/hooks.json`:

```json
{
  "hooks": [
    {
      "name": "pre-deploy",
      "event": "before_command",
      "command_pattern": "deploy",
      "description": "Verify prerequisites before deployment",
      "action": {
        "type": "prompt",
        "content": "Before deploying, verify all requirements are met."
      }
    },
    {
      "name": "post-deploy",
      "event": "after_command",
      "command_pattern": "deploy",
      "description": "Log completion after deployment",
      "action": {
        "type": "prompt",
        "content": "Deployment complete. Update state and documentation."
      }
    }
  ]
}
```

---

## Phase 5: Migration

Move existing content to new locations:

| Old Location | New Location |
|--------------|--------------|
| `docs/` | `DOCUMENTATION/` |
| `experiments/` | `PLANNING/experiments/` |
| `SUBAGENT-FRAMEWORK/agents/` | `.claude/agents/` (local) or `agents/` (plugin) |

---

## Phase 6: Finalize

1. Update references in all documentation files
2. Create/update `CLAUDE.md` with project overview
3. Create/update `README.md` with installation instructions (for plugins)
4. Git commit with descriptive message
5. Confirm structure with user

---

## Local vs Plugin Structure Comparison

| Component | Local (`.claude/`) | Plugin (root) |
|-----------|-------------------|---------------|
| Commands | `.claude/commands/` | `commands/` |
| Agents | `.claude/agents/` | `agents/` |
| Skills | `.claude/skills/` | `skills/` |
| Hooks | `.claude/hooks/` | `hooks/` |
| Manifest | `.claude/settings.json` | `.claude-plugin/plugin.json` |
| Scope | This project only | Distributable |

**Key Distinction**: 
- `.claude/` = Local project configuration
- `.claude-plugin/` + root directories = Distributable plugin

---

## Cleanup Patterns

| Pattern | Action | Confidence |
|---------|--------|------------|
| `*-v[0-9]*/` | Archive to `.archive/` | High |
| `*-old/`, `*-backup/` | Archive to `.archive/` | High |
| `*-pwa/`, `*-app/` | Archive to `.archive/` | Medium |
| `node_modules/` | Can delete (regenerable) | High |
| `dist/`, `build/` | Can delete (regenerable) | High |
| `.next/`, `.cache/` | Can delete (regenerable) | High |

---

## Example Commands

### Create Standard Directories (Local)

```bash
# Create local .claude structure
mkdir -p .claude/{agents,commands,hooks,skills}

# Create documentation directories
mkdir -p PLANNING ARCHITECTURE DOCUMENTATION SPECIFICATIONS
mkdir -p AGENT-HANDOFF CONFIG scripts .archive

# Git commit
git add -A && git commit -m "Apply Organized Codebase template structure"
```

### Create Plugin Structure

```bash
# Create plugin manifest directory
mkdir -p .claude-plugin

# Create plugin.json
cat > .claude-plugin/plugin.json << 'EOF'
{
  "name": "my-plugin",
  "description": "Plugin description",
  "version": "1.0.0",
  "author": { "name": "Your Name" },
  "capabilities": {
    "commands": true,
    "agents": true,
    "skills": true,
    "hooks": true
  }
}
EOF

# Create plugin directories at root
mkdir -p commands agents skills hooks

# Git commit
git add -A && git commit -m "Initialize as Claude Code Plugin"
```

### Convert Local to Plugin

```bash
# Create plugin manifest
mkdir -p .claude-plugin
# Create plugin.json (see template above)

# Copy local components to root (plugin location)
cp -r .claude/commands/* commands/ 2>/dev/null
cp -r .claude/agents/* agents/ 2>/dev/null
cp -r .claude/skills/* skills/ 2>/dev/null
cp -r .claude/hooks/* hooks/ 2>/dev/null

# Keep .claude/ for local settings only
# Remove duplicated content from .claude/ subdirs if needed

git add -A && git commit -m "Convert to distributable Claude Code Plugin"
```

---

## Template Files to Create

### AGENT-HANDOFF/HANDOFF.md

```markdown
# Agent Handoff Document

## Project: [PROJECT_NAME]

### Quick Context
[Brief description]

### Key Files to Read
1. `CLAUDE.md` - Project overview
2. `DOCUMENTATION/` - Technical docs

### Current State
- Framework: ✅/⏳
- Implementation: ✅/⏳

### Next Steps
1. [Next task]
```

### README.md (For Plugins)

```markdown
# Plugin Name

Brief description of what this plugin provides.

## Installation

### Via Marketplace
/plugin marketplace add [marketplace-url]
/plugin install plugin-name@marketplace

### Local Installation
/plugin marketplace add ./path-to-plugin
/plugin install plugin-name@local

## Commands

| Command | Description |
|---------|-------------|
| `/command-one` | What it does |
| `/command-two` | What it does |

## Agents

- **agent-name**: Description

## Requirements

- Requirement one
- Requirement two
```

---

## Default Template Path (macOS)

```
~/Library/Mobile Documents/com~apple~CloudDocs/BHT Promo iCloud/Organized AI/Windsurf/Organized Codebase
```

---

## Plugin Distribution

### Option 1: Git Repository
```bash
git remote add origin https://github.com/org/plugin-name
git push -u origin main
```

### Option 2: Create Marketplace
```bash
mkdir -p marketplace/.claude-plugin
cat > marketplace/.claude-plugin/marketplace.json << 'EOF'
{
  "name": "my-marketplace",
  "owner": { "name": "Your Name" },
  "plugins": [
    {
      "name": "plugin-name",
      "source": "./plugin-directory",
      "description": "Plugin description"
    }
  ]
}
EOF
```

### Installing from Marketplace
```
/plugin marketplace add org/marketplace-repo
/plugin install plugin-name@marketplace-name
```
