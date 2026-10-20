---
name: organized-codebase-applicator
version: "2.1"
description: Applies Organized Codebase template structure to existing projects using Just scaffolding. Creates Claude Code Plugins, sets up verification infrastructure (Boris methodology), sets up GitOps for Cloudflare Workers projects (CI, staging on merge, production by pull request, e2e, logs and traces), and manages project scaffolding via justfile recipes. Use when user wants to organize an existing project, apply the Organized Codebase template, create a plugin, scaffold .claude/ directory, set up planning docs, set up GitOps or deploys, or mentions "organized codebase", "apply template", "just scaffolding", "add claude", "add planning", "add handoff", "add gitops", "gitops", or "verification infrastructure".
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
| `add-gitops` | `.github/`, `scripts/gitops/`, `deploy/envs/`, `docs/GITOPS.md` | GitOps for Cloudflare Workers projects (skipped when there is no `wrangler.jsonc`) |
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
| 6. GitOps | Git is the only way to production (Workers projects) | `just add-gitops` |

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

## GitOps for Cloudflare Workers projects (every new coding project)

Every project that deploys a Cloudflare Worker gets the same GitOps pack, modeled on
[Organized-AI/podcast-agent](https://github.com/Organized-AI/podcast-agent/blob/main/docs/GITOPS.md):
Worker versions stand in for image digests, and `wrangler versions deploy` stands in for an Argo CD sync.
`apply-organized` runs `add-gitops` automatically; it does nothing in a project without `wrangler.jsonc`, and it never
overwrites a file that exists.

```bash
WORKERS_SUBDOMAIN=jordan-691 just add-gitops       # worker + account from wrangler.jsonc, owner from gh
just add-gitops my-worker jordan-691 jhillbht     # or say them explicitly
```

The rules it encodes (put them in the project's CLAUDE.md "DO NOT" section too):

1. **Git is the only way to production.** `main` is what staging runs; `deploy/envs/production.json` (one version id,
   written only by automation) is what production runs. Never `wrangler deploy` production by hand.
2. **Build once, promote by id.** Merge to main uploads one production version (`wrangler versions upload --tag <sha>`)
   and opens "Deploy <sha> to production". Merging that pull request is the deploy; reverting it rolls back.
3. **Production sits behind a GitHub environment with a required reviewer**, and `main` is protected (PR + `ci / check`).
4. **Every platform passes the e2e suite** on staging before the production pull request, and on production after it:
   one test per way users connect, with evals on the answers, and checks that the run shows up in Workers Logs/traces.
5. **Migrations are additive** and run before the new version takes traffic.
6. **Logs and traces on** (`head_sampling_rate: 1`), one structured log line per request, never a secret in a log.
7. **Commits and PRs are the user's** (for Organized-AI: Jordan Hill, no Claude co-author or trailers).

After running it, walk the user through docs/GITOPS.md → One-time setup: the `CLOUDFLARE_API_TOKEN` secret (Workers
Scripts Edit, D1 Edit, Workers Tail Read, Workers Observability Read, Account Settings Read), the `staging` and
`production` environments, branch protection, and an optional `env.staging` in wrangler.jsonc. Until the token exists,
the same flow runs by hand and still goes through Git: `scripts/gitops/upload.sh` → `promote.sh <id>` → merge → `sync.sh`.

Worked example with a full platform suite: [Organized-AI/jev-pi-deal-desk](https://github.com/Organized-AI/jev-pi-deal-desk).

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
