<div align="center">

# ORGANIZED CODEBASE

**A lightweight scaffolding system for Claude Code with optional Codex, Organized Router, and Pi/local harness companion surfaces.**

**Implements the Boris methodology — verification-first development from Claude Code's creator.**

[![npm version](https://img.shields.io/npm/v/create-organized-codebase?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/create-organized-codebase)
[![GitHub stars](https://img.shields.io/github/stars/Organized-AI/organized-codebase?style=for-the-badge&logo=github&color=181717)](https://github.com/Organized-AI/organized-codebase)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Organized AI](https://img.shields.io/badge/Organized-AI-blue?style=for-the-badge)](https://organized.ai)

<br>

```bash
npx create-organized-codebase my-project
```

**Works on Mac, Windows, and Linux.**

<br>

*"Finally, a template that actually understands how Claude Code works."*

*"The Boris methodology commands alone are worth it. /verify changed how I ship code."*

*"Applied it to 3 existing projects in under 5 minutes each."*

<br>

[Why This Exists](#why-this-exists) · [How It Works](#how-it-works) · [Commands](#commands) · [Plugin Marketplace](#plugin-marketplace)

</div>

---

## Why This Exists

Most project templates are designed for humans. This one is designed for Claude.

When you give Claude Code a messy codebase with no structure, you get inconsistent results. Claude doesn't know where to put things. It doesn't know your conventions. It makes stuff up.

Organized Codebase fixes that. It gives your project a predictable structure that Claude understands:
- Where planning docs live
- Where architecture decisions go
- How to verify work before committing
- What permissions are safe to auto-approve

The template implements the **Boris methodology** — a verification-first workflow designed by Claude Code's creator. Every commit gets verified. Every PR gets reviewed. No more "it works on my machine."

— **Organized AI**

---

## Who This Is For

Developers who use Claude Code and want:
- Consistent project structure across all their work
- Built-in verification commands (`/verify`, `/commit`, `/review`)
- A sensible permissions system (allow/ask/deny)
- Planning docs that actually get used
- Optional Codex support without dragging in an ECC-sized control plane
- Optional Router + Pi/local harness layers that stay separate from the core scaffold

Not for you if you like reinventing folder structures for every project.

---

## Getting Started

### New Project

```bash
npx create-organized-codebase my-project
cd my-project
```

Done. You have:
- `.claude/` directory with commands and agents
- `PLANNING/` for implementation phases
- `AGENT-HANDOFF/` for context transfer
- Pre-configured permissions
- Boris methodology ready to go

Optional add-ons for cross-harness work:
- `just add-codex`
- `just add-organized-router`
- `just add-pi-harness-companion`

Canonical execution reference:
- `DOCUMENTATION/CROSS-HARNESS-EXECUTION-STANDARD.md`

### Existing Project

Use the **organized-codebase-applicator** — our flagship skill:

```bash
# Install Just (one-time)
brew install just          # macOS
# cargo install just       # Linux
# winget install casey.just  # Windows

# Get the justfile
curl -o justfile https://raw.githubusercontent.com/Organized-AI/organized-codebase/main/templates/justfile

# Apply everything
just apply-organized
```

Or apply only what you need:

```bash
just add-claude    # Just .claude/ (commands, agents, permissions)
just add-planning  # Just PLANNING/ (phase templates, decisions)
just add-handoff   # Just AGENT-HANDOFF/ (context transfer docs)
```

### Via Claude Code

Just ask:
- *"Apply Organized Codebase template"*
- *"Set up verification infrastructure"*
- *"Add Boris methodology commands"*

---

## How It Works

### The Structure

```
your-project/
├── .claude/                 # Claude Code configuration
├── .codex/                  # Optional Codex adapter surface
├── AGENTS.md                # Optional Codex-facing primer
├── PLANNING/                # Planning documentation
├── AGENT-HANDOFF/           # Context transfer
├── CONFIG/router/           # Optional Organized Router policy layer
├── harnesses/pi-agent/      # Optional Pi/local harness companion layer
├── justfile                 # Scaffolding recipes
└── CLAUDE.md                # Canonical project overview
```

Claude reads `CLAUDE.md` first. It knows the structure. It follows the conventions.

### Boris Methodology

> "Always give Claude a way to verify its work."

That's it. That's the whole philosophy. Every task should have a verification step.

**The workflow:**

```
/status → See where you are
    ↓
Plan Mode → Think before coding
    ↓
Build → One feature at a time
    ↓
/verify → Run all checks
    ↓
/commit → Commit with verification
    ↓
/review → Self-review before PR
```

The commands enforce the discipline. You can't forget to verify because the workflow includes it.

### Permissions

The `.claude/settings.json` uses three tiers:

| Tier | What it means | Examples |
|------|---------------|----------|
| `allow` | Auto-approve, no prompt | `git status`, `npm run *`, `just *` |
| `ask` | Prompt before running | `git push`, `npm install` |
| `deny` | Never allow | `git push --force`, `rm -rf /` |

You stop approving `git status` 50 times per session. Claude just works.

---

## Commands

### Core Workflow

| Command | What it does |
|---------|--------------|
| `/status` | Project health check — git state, recent changes, what's next |
| `/ablate` | Re-baseline `CLAUDE.md`, hooks, and skills after a model upgrade |
| `/context-ladder` | Route a failure to the right layer: prompt vs `CLAUDE.md` vs skill vs MCP vs verification |
| `/verify` | Run lint, typecheck, tests, build — all your checks |
| `/commit` | Smart commit with pre-verification |
| `/outcome-prompt` | Rewrite work into outcome + guardrails + exit criteria + verification |
| `/review` | Self-review before creating PR |

### Verification Agents

| Agent | What it does |
|-------|--------------|
| `verify-build` | Validates build works from clean state |
| `verify-architecture` | Checks code follows project patterns |

### Just Recipes

| Recipe | What it creates |
|--------|-----------------|
| `just apply-organized` | Full template structure |
| `just add-claude` | `.claude/` directory only |
| `just add-planning` | `PLANNING/` docs only |
| `just add-handoff` | `AGENT-HANDOFF/` only |
| `just add-codex` | `AGENTS.md` + `.codex/` thin Codex adapter |
| `just add-organized-router` | `CONFIG/router/` policy files + Router docs |
| `just add-pi-harness-companion` | `harnesses/pi-agent/` pairing presets + scaffold script |
| `just verify` | Run verification suite |
| `just project-status` | Show git status and structure |

---

## Plugin Marketplace

Want more commands, agents, and skills?

👉 **[github.com/Organized-AI/plugin-marketplace](https://github.com/Organized-AI/plugin-marketplace)**

```bash
# Add the marketplace
/plugin marketplace add Organized-AI/plugin-marketplace

# Install plugins
/plugin install boris@organized-ai-marketplace
/plugin install phased-planning@organized-ai-marketplace
```

### Featured Plugins

| Plugin | What it does |
|--------|--------------|
| `boris` | Full Boris methodology orchestration |
| `phased-planning` | Generate structured implementation plans |
| `long-runner` | Multi-session development orchestration |
| `git-worktree-master` | Parallel branch workflows |

---

## Configuration

### Selective Application

Don't want everything? Pick what you need:

```bash
just add-claude               # Commands + agents + permissions
just add-codex                # AGENTS.md + .codex/ thin adapter
just add-organized-router     # CONFIG/router policy layer
just add-pi-harness-companion # local/frontier sibling harness scaffold
just add-planning             # Phase templates + ADRs
just add-handoff              # Context transfer docs
just add-ralphy               # Ralphy workflow config
```

### Customizing Permissions

Edit `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "git status",
      "git diff",
      "npm run *",
      "just *"
    ],
    "ask": [
      "git push",
      "npm install"
    ],
    "deny": [
      "git push --force",
      "rm -rf /"
    ]
  }
}
```

Add your own patterns. Remove what you don't need.

---

## Troubleshooting

**Commands not found?**
- Restart Claude Code to reload slash commands
- Check files exist in `.claude/commands/`

**Just not installed?**
```bash
brew install just        # macOS
cargo install just       # Linux/cross-platform
winget install casey.just  # Windows
```

**Want to update?**
```bash
npx create-organized-codebase@latest my-project
```

---

## Resources

- **[Boris Methodology Video](https://www.youtube.com/watch?v=B-UXpneKw6M)** — Original source from Claude Code's creator
- **[Delete Your `CLAUDE.md`? — Boris Cherny’s 7 Takeaways for Organized Codebase](DOCUMENTATION/BORIS-DELETE-YOUR-CLAUDE-MD-GUIDE.md)** — July 2026 YC / Hyperautomation Labs synthesis with actionable repo takeaways
- **[Boris Context Placement Ladder](DOCUMENTATION/BORIS-CONTEXT-PLACEMENT-LADDER.md)** — Operator rules for prompt vs `CLAUDE.md` vs skill vs MCP, plus routines vs dynamic workflows
- **[Graph Engineering in Organized Codebase](DOCUMENTATION/GRAPH-ENGINEERING-ORGANIZED-CODEBASE-FIT.md)** — Practical use cases, anti-use-cases, and a narrow rollout recommendation for OC
- **[Codex Setup](DOCUMENTATION/CODEX-SETUP.md)** — Thin project-local Codex surface for Organized Codebase
- **[Codex vs Claude Surface Map](DOCUMENTATION/CODEX-VS-CLAUDE-SURFACE-MAP.md)** — Where each harness-specific layer should live
- **[Organized Router](DOCUMENTATION/ORGANIZED-ROUTER.md)** — Separate routing policy layer for Claude, Codex, and Pi/local routes
- **[Pi Agent Harness Companion](DOCUMENTATION/PI-AGENT-HARNESS-COMPANION.md)** — How to spin up frontier-paired local sibling harnesses
- **[Cross-Harness Execution Standard](DOCUMENTATION/CROSS-HARNESS-EXECUTION-STANDARD.md)** — Canonical execution modes, Herdr session role, naming rules, and anti-bloat guardrails
- **[Closed-Loop Evals for Multimodal Agents](DOCUMENTATION/CLOSED-LOOP-EVALS-MULTIMODAL-AGENTS.md)** — TwelveLabs + transcript-grounded takeaways from Uber’s multimodal eval talk, translated into OC operator rules
- **[Eval Loop Spec Template](PLANNING/spec-templates/eval-loop.md)** — Reusable scaffold for stage metrics, judges, replay, promotion gates, and rollback
- **[Boris Ablation Eval Matrix](DOCUMENTATION/BORIS-ABLATION-EVAL-MATRIX.md)** — How to decide what to prune using tests + evals across models and harnesses
- **[Boris Ablation Scorecard Template](DOCUMENTATION/BORIS-ABLATION-SCORECARD-TEMPLATE.md)** — Default results sheet for scaffold deletion experiments
- **[Plugin Marketplace](https://github.com/Organized-AI/plugin-marketplace)** — More commands, agents, skills

- **[Organized AI Events](https://lu.ma/organizedai-starterstacks)** — Live sessions and workshops
- **[Community](https://lu.ma/Organizedai)** — Join the conversation

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Claude Code is powerful. Structure makes it reliable.**

</div>
