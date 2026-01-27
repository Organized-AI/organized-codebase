---
name: organized-codebase-applicator
version: "2.0"
description: Applies Organized Codebase template structure to existing projects using Just scaffolding. Creates Claude Code Plugins, sets up verification infrastructure (Boris methodology), and manages project scaffolding via justfile recipes. Use when user wants to organize an existing project, apply the Organized Codebase template, create a plugin, scaffold .claude/ directory, set up planning docs, or mentions "organized codebase", "apply template", "just scaffolding", "add claude", "add planning", "add handoff", or "verification infrastructure".
---

# Organized Codebase Applicator v2.0

Applies the Organized Codebase template to existing projects using **Just** as the scaffolding engine.

## What's New in v2

| Feature | v1 | v2 |
|---------|----|----|
| Scaffolding | Direct bash scripts | Just recipes |
| Modularity | All-or-nothing | Individual recipes |
| Portability | macOS-focused | Cross-platform |
| Entry point | Shell script | `just apply-organized` |

---

## Quick Start

### Option 1: Just Command (Recommended)
```bash
# Copy justfile to your project
cp templates/justfile /path/to/your/project/

# Run full scaffolding
cd /path/to/your/project
just apply-organized
```

### Option 2: Shell Script
```bash
# Run the applicator script
./scripts/apply-organized-codebase.sh /path/to/your/project
```

### Option 3: Individual Recipes
```bash
just add-claude    # Just the .claude/ directory
just add-planning  # Just the PLANNING/ docs
just add-handoff   # Just the AGENT-HANDOFF/
just add-ralphy    # Just the .ralphy/ config
```

---

## Just Recipes Reference

| Recipe | Creates | Description |
|--------|---------|-------------|
| `apply-organized` | All | Full Organized Codebase structure |
| `add-claude` | `.claude/` | Agents, commands, hooks, skills, settings |
| `add-ralphy` | `.ralphy/` | Ralphy workflow configuration |
| `add-planning` | `PLANNING/` | Implementation phases, decisions, experiments |
| `add-handoff` | `AGENT-HANDOFF/` | Context transfer documents |
| `verify` | - | Run verification suite |
| `project-status` | - | Show git status and structure |
| `archive-iterations` | `.archive/` | Move iteration dirs to archive |
| `clean-regenerable` | - | Remove node_modules, dist, etc. |

---

## Workflow Overview

| Phase | Purpose | Just Recipe |
|-------|---------|-------------|
| 1. Analysis | Analyze project structure | Manual |
| 2. Template | Apply directory structure | `just apply-organized` |
| 3. Cleanup | Archive iterations | `just archive-iterations` |
| 4. Plugin | Create distributable plugin (optional) | Manual |
| 5. Verification | Set up Boris methodology | `just add-claude` |

---

## Directory Structure Created

```
project-root/
├── .claude/                 # Claude Code configuration
│   ├── agents/              # Verification agents
│   │   ├── verify-build.md
│   │   └── verify-architecture.md
│   ├── commands/            # Slash commands
│   │   ├── verify.md        # /verify
│   │   ├── commit.md        # /commit
│   │   ├── review.md        # /review
│   │   └── status.md        # /status
│   ├── hooks/               # Pre/post hooks
│   ├── skills/              # Local skills
│   └── settings.json        # Permissions (allow/ask/deny)
│
├── .ralphy/                 # Ralphy configuration
│   └── config.yaml
│
├── PLANNING/                # Planning documentation
│   ├── implementation-phases/
│   │   └── PHASE-0-PROMPT.md
│   ├── decisions/           # ADRs
│   └── experiments/         # POCs
│
├── AGENT-HANDOFF/           # Context transfer
│   ├── HANDOFF.md
│   └── CONTEXT-WINDOW.md
│
├── ARCHITECTURE/            # System design docs
├── DOCUMENTATION/           # General docs
├── SPECIFICATIONS/          # Specs
├── CONFIG/                  # Config files
├── scripts/                 # Automation
├── .archive/                # Archived iterations
│
├── justfile                 # Just recipes
└── CLAUDE.md                # Project overview
```

---

## Installing Just

Just is required for v2 recipes. Install with:

```bash
# macOS (Homebrew)
brew install just

# Linux (Cargo)
cargo install just

# Windows (Winget)
winget install casey.just

# Or download from releases
# https://github.com/casey/just/releases
```

Verify installation:
```bash
just --version
```

---

## Verification Infrastructure (Boris Methodology)

The `add-claude` recipe creates verification infrastructure based on Boris methodology:

### Slash Commands Created

| Command | Purpose |
|---------|---------|
| `/verify` | Run lint, typecheck, tests, build |
| `/commit` | Smart commit with verification |
| `/review` | Self-review before PR |
| `/status` | Project health check |

### Agents Created

| Agent | Purpose |
|-------|---------|
| `verify-build` | Clean build validation |
| `verify-architecture` | Code pattern verification |

### Permissions Structure

`.claude/settings.json` with:
- **allow**: Safe read-only commands (git status, npm run, just)
- **ask**: Modifying commands (git push, npm install)
- **deny**: Dangerous commands (force push, rm -rf /)

---

## Plugin Creation (Optional)

When project should be distributed as a Claude Code Plugin:

### Create Plugin Manifest
```bash
mkdir -p .claude-plugin
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
```

### Plugin vs Local Structure

| Component | Local (`.claude/`) | Plugin (root) |
|-----------|-------------------|---------------|
| Commands | `.claude/commands/` | `commands/` |
| Agents | `.claude/agents/` | `agents/` |
| Skills | `.claude/skills/` | `skills/` |
| Manifest | `.claude/settings.json` | `.claude-plugin/plugin.json` |

---

## Usage with Claude Code

### Via /j Command
```
/j                    # List recipes
/j add-claude         # Scaffold .claude/
/j apply-organized    # Full setup
```

### Via Skill Invocation
Just ask Claude:
- "Apply Organized Codebase template"
- "Set up verification infrastructure"
- "Add planning documentation"
- "Scaffold .claude directory"

---

## Migration from v1

If you have a v1 setup:

1. **Backup existing files**
   ```bash
   cp -r .claude .claude.v1.backup
   ```

2. **Copy new justfile**
   ```bash
   cp templates/justfile ./justfile
   ```

3. **Run selective recipes** (won't overwrite existing)
   ```bash
   just add-claude    # Adds only missing files
   just add-planning
   ```

---

## Cleanup Patterns

| Pattern | Action | Recipe |
|---------|--------|--------|
| `*-v[0-9]*/` | Archive | `just archive-iterations` |
| `*-old/`, `*-backup/` | Archive | `just archive-iterations` |
| `node_modules/` | Delete | `just clean-regenerable` |
| `dist/`, `build/` | Delete | `just clean-regenerable` |

---

## Boris Methodology Quick Reference

| Principle | Implementation |
|-----------|----------------|
| Verify work | `/verify` command, stop hooks |
| Plan first | Always use plan mode |
| Anti-patterns | Add mistakes to CLAUDE.md "DO NOT" |
| Permissions | Structured allow/ask/deny |
| Inner loop | Slash commands for daily workflows |
| Subagents | Verification-focused agents |

**Source:** Boris (Claude Code Creator) - [Video Interview](https://www.youtube.com/watch?v=B-UXpneKw6M)
