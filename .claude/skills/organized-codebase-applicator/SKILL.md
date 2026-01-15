---
name: organized-codebase-applicator
description: Applies Organized Codebase template structure to existing projects, creates Claude Code Plugins, sets up verification infrastructure (Boris methodology), and cleans up unused/redundant directories. Use when user wants to organize an existing project, apply the Organized Codebase template, create a plugin, clean up a messy codebase, remove iteration folders, standardize project structure, set up verification, or mentions "organized codebase", "clean up codebase", "apply template", "create plugin", "remove unused folders", "standardize project", "clean up directories", or "verification infrastructure".
---

# Organized Codebase Applicator

Applies the Organized Codebase template to existing projects, creates Claude Code Plugins for distribution, sets up verification infrastructure based on Boris methodology (Claude Code creator), and performs intelligent cleanup of unused or redundant directories.

## Workflow Overview

| Phase | Purpose |
|-------|---------|
| 1. Analysis | Analyze project structure |
| 2. Cleanup | Archive redundant directories |
| 3. Template | Create standard directories |
| 4. Plugin | Create distributable plugin (optional) |
| 5. Migration | Move content to new locations |
| 6. Finalize | Update references, git commit |
| 7. Verification | Set up Boris methodology verification infrastructure |

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

---

## Phase 7: Verification Infrastructure (Boris Methodology)

Based on insights from Boris, the creator of Claude Code. Core principle:

> "Always give Claude a way to verify its work."

### 7.1 Enhanced CLAUDE.md

Update `CLAUDE.md` to include verification requirements (keep under 2.5k tokens):

```markdown
# [Project Name]

## Tech Stack
- Runtime: [e.g., Node.js 20, Python 3.11]
- Framework: [e.g., Express, React, FastAPI]
- Database: [e.g., PostgreSQL, MongoDB]
- Key Dependencies: [list major packages]

## Project Structure
[Brief folder map - 5-10 lines max]

## Code Conventions
- [Naming convention]
- [Import order]
- [Error handling pattern]

## DO NOT
- [Anti-pattern from past error 1]
- [Anti-pattern from past error 2]
- [Anti-pattern from past error 3]

## Verification Requirements
Before completing ANY task:
1. Describe verification approach first
2. Run `npm test` (all tests must pass)
3. Run `npm run lint` (no errors)
4. For UI changes: take screenshot
```

**Key insight:** Update CLAUDE.md whenever Claude makes a mistake. Add it to "DO NOT" section.

### 7.2 Structured Permissions

Create/update `.claude/settings.json` with allow/ask/deny structure:

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(npm run:*)",
      "Bash(npm test:*)",
      "Bash(npx:*)",
      "Bash(ls:*)",
      "Bash(cat:*)"
    ],
    "ask": [
      "Bash(git push:*)",
      "Bash(git commit:*)",
      "Bash(rm:*)",
      "Bash(npm install:*)"
    ],
    "deny": [
      "Bash(git push --force:*)",
      "Bash(git reset --hard:*)",
      "Bash(rm -rf /)",
      "Bash(sudo:*)"
    ]
  }
}
```

**Key insight:** Never use `--dangerously-skip-permissions`. Use structured permissions instead.

### 7.3 Inner Loop Slash Commands

Create essential daily workflow commands in `.claude/commands/`:

**`.claude/commands/verify.md`**
```markdown
---
description: Run all verification checks
---

# Verify Current Work

Run complete verification suite:

1. **Linting**: `npm run lint`
2. **Tests**: `npm test`
3. **Type Check**: `npm run typecheck` (if TypeScript)
4. **Build**: `npm run build`

Report Pass/Fail for each with specific errors.
```

**`.claude/commands/commit.md`**
```markdown
---
description: Smart commit with verification
---

# Smart Commit

1. Run verification first (`/verify`)
2. Show `git status` and `git diff --stat`
3. Generate conventional commit message (feat/fix/docs/refactor/test/chore)
4. Ask for confirmation before committing
5. Do NOT push unless explicitly requested
```

**`.claude/commands/review.md`**
```markdown
---
description: Self-review before PR
---

# Self-Review

1. Run `git diff main...HEAD`
2. Check for: console.logs, commented code, TODOs, missing error handling
3. Run full verification
4. Provide recommendation: Ready / Needs Work
```

**`.claude/commands/status.md`**
```markdown
---
description: Project health check
---

# Project Status

1. Git status and last 5 commits
2. `npm outdated` for dependency health
3. `npm test -- --coverage` for test coverage
4. Build status
5. Summary: Healthy / Needs Attention / Critical
```

### 7.4 Verification Subagents

Create verification-focused agents in `.claude/agents/`:

**`.claude/agents/verify-architecture.md`**
```markdown
---
name: verify-architecture
description: Verify code follows architectural patterns
---

# Architecture Verification Agent

## Checks
1. Files in correct directories
2. No circular imports
3. Layer boundaries respected
4. Naming conventions followed

## Output
- ✅ Passed checks
- ⚠️ Warnings
- ❌ Violations
```

**`.claude/agents/verify-build.md`**
```markdown
---
name: verify-build
description: Validate builds work correctly
---

# Build Validation Agent

## Checks
1. Clean install: `rm -rf node_modules && npm ci`
2. Build: `npm run build`
3. Verify artifacts exist
4. Smoke test: start app, check for crashes

## Output
Build status, time, artifact sizes, warnings
```

### 7.5 Stop Hook for Auto-Verification

Create `.claude/hooks/stop.sh`:

```bash
#!/bin/bash
echo "=== Auto-Verification ==="

# Lint check
npm run lint --silent 2>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ Linting errors found"
    exit 1
fi

# Test check
npm test --silent 2>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

echo "✅ All verification passed"
```

Make executable: `chmod +x .claude/hooks/stop.sh`

### 7.6 Verification Checklist

After Phase 7, verify:

- [ ] CLAUDE.md has Tech Stack, Conventions, DO NOT, Verification sections
- [ ] CLAUDE.md is under 2,500 tokens
- [ ] `.claude/settings.json` has allow/ask/deny permissions
- [ ] `/verify` command created and working
- [ ] `/commit` command created and working
- [ ] `/review` command created and working
- [ ] `/status` command created and working
- [ ] At least one verification agent created
- [ ] Stop hook created (optional but recommended)

### 7.7 Quick Setup Commands

```bash
# Create verification commands
cat > .claude/commands/verify.md << 'EOF'
---
description: Run all verification checks
---
# Verify Current Work
Run: npm run lint && npm test && npm run build
Report Pass/Fail for each.
EOF

cat > .claude/commands/commit.md << 'EOF'
---
description: Smart commit with verification
---
# Smart Commit
1. Run /verify first
2. Show git status and diff
3. Generate conventional commit message
4. Confirm before committing
EOF

cat > .claude/commands/status.md << 'EOF'
---
description: Project health check
---
# Project Status
Show: git status, npm outdated, test coverage, build status
EOF

# Create verification agent
cat > .claude/agents/verify-build.md << 'EOF'
---
name: verify-build
description: Validate builds work
---
# Build Validation
1. npm ci
2. npm run build
3. Verify artifacts
4. Report status
EOF

# Create stop hook
mkdir -p .claude/hooks
cat > .claude/hooks/stop.sh << 'EOF'
#!/bin/bash
npm run lint --silent && npm test --silent && echo "✅ Verified" || echo "❌ Issues found"
EOF
chmod +x .claude/hooks/stop.sh

# Commit
git add -A && git commit -m "Phase 7: Add Boris methodology verification infrastructure"
```

---

## Boris Methodology Quick Reference

| Principle | Implementation |
|-----------|----------------|
| Verify work | Tests, linters, hooks, screenshots |
| Plan first | Always use plan mode before features |
| Anti-patterns | Add mistakes to CLAUDE.md "DO NOT" |
| Permissions | Structured allow/ask/deny (never skip) |
| Inner loop | Slash commands for daily workflows |
| Subagents | Verification-focused agents |
| Model choice | Opus 4.5 with thinking (fewer corrections) |

**Source:** Boris (Claude Code Creator) - [Video Interview](https://www.youtube.com/watch?v=B-UXpneKw6M)
