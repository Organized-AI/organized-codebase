# Organized Codebase Template

> 🚀 **A comprehensive boilerplate for structuring projects with Claude Code, featuring the Boris methodology for verification-first development.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Organized AI](https://img.shields.io/badge/Organized-AI-blue.svg)](https://organized.ai)

## 🎯 Purpose

This template provides a standardized project structure optimized for AI-assisted development with Claude Code. It bridges the gap between human planning and AI execution, giving you:

- **Structured directories** for planning, architecture, and handoff
- **Verification infrastructure** via the Boris methodology
- **Ready-to-use commands** like `/verify`, `/commit`, `/review`
- **Permission management** with allow/ask/deny patterns

**Perfect for:**
- [Organized AI Live Events](https://lu.ma/organizedai-starterstacks) attendees
- Developers using Claude Code for AI-assisted development
- Teams wanting better project documentation and handoff processes
- Anyone building software with AI assistance

## ⚡ Quick Start

### Option 1: NPM Package (New Projects)

```bash
npx create-organized-codebase my-project
cd my-project
```

### Option 2: Apply to Existing Project

Use the **organized-codebase-applicator** skill (our flagship tool):

```bash
# Install Just (required for v2)
brew install just  # macOS
# cargo install just  # Linux

# Copy justfile to your project
curl -o justfile https://raw.githubusercontent.com/Organized-AI/organized-codebase/main/templates/justfile

# Apply full template
just apply-organized

# Or apply individual components
just add-claude    # Just .claude/ directory
just add-planning  # Just PLANNING/ docs
just add-handoff   # Just AGENT-HANDOFF/
```

### Option 3: Use via Claude Code

Just ask Claude:
- *"Apply Organized Codebase template to this project"*
- *"Set up verification infrastructure"*
- *"Add planning documentation"*

## 📁 Template Structure

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
│   ├── hooks/               # Pre/post execution hooks
│   ├── skills/              # Local project skills
│   └── settings.json        # Permissions (allow/ask/deny)
│
├── PLANNING/                # Planning documentation
│   ├── implementation-phases/
│   │   └── PHASE-0-PROMPT.md
│   ├── decisions/           # Architecture Decision Records
│   └── experiments/         # POCs and experiments
│
├── AGENT-HANDOFF/           # Context transfer documents
│   ├── HANDOFF.md
│   └── CONTEXT-WINDOW.md
│
├── ARCHITECTURE/            # System design documentation
├── DOCUMENTATION/           # General docs and guides
├── SPECIFICATIONS/          # Functional and technical specs
├── CONFIG/                  # Configuration files
├── scripts/                 # Automation scripts
│
├── justfile                 # Just recipes for scaffolding
└── CLAUDE.md                # Project overview for Claude
```

## 🤖 Boris Methodology

This template implements the **Boris methodology** - a verification-first development workflow from Claude Code's creator:

> "Always give Claude a way to verify its work."

### Core Commands

| Command | Purpose |
|---------|---------|
| `/status` | Check project health and git state |
| `/verify` | Run lint, typecheck, tests, build |
| `/commit` | Smart commit with pre-verification |
| `/review` | Self-review before creating PR |

### Verification Agents

| Agent | Purpose |
|-------|---------|
| `verify-build` | Validate builds from clean state |
| `verify-architecture` | Check code follows patterns |

### Workflow

```
Start Session → /status
     ↓
Plan (use plan mode for complex tasks)
     ↓
Build (one feature at a time)
     ↓
/verify → Fix issues → /verify
     ↓
/commit
     ↓
/review → Create PR
```

## 🔌 Plugin Marketplace

Find more Claude Code components (skills, commands, agents) in our **Plugin Marketplace**:

👉 **[github.com/Organized-AI/plugin-marketplace](https://github.com/Organized-AI/plugin-marketplace)**

### Install from Marketplace

```bash
# Add the marketplace
/plugin marketplace add Organized-AI/plugin-marketplace

# Install individual plugins
/plugin install boris@organized-ai-marketplace
/plugin install phased-planning@organized-ai-marketplace
```

### Featured Plugins

| Plugin | Description |
|--------|-------------|
| `boris` | Verification-first methodology commands |
| `phased-planning` | Generate structured implementation plans |
| `organized-codebase-applicator` | Apply this template to projects |
| `gtm-ai-plugin` | Google Tag Manager automation |

## 🛠️ Customization

### Selective Application

Apply only what you need:

```bash
just add-claude    # .claude/ with commands and agents
just add-planning  # PLANNING/ with phase templates
just add-handoff   # AGENT-HANDOFF/ for context transfer
just add-ralphy    # .ralphy/ workflow configuration
```

### Permission Management

The `.claude/settings.json` uses a tiered permission model:

```json
{
  "permissions": {
    "allow": ["git status", "npm run *", "just *"],
    "ask": ["git push", "npm install"],
    "deny": ["git push --force", "rm -rf /"]
  }
}
```

## 📚 Documentation

- [Boris Cheat Sheet](DOCUMENTATION/BORIS-CHEAT-SHEET.md) - Quick reference
- [Boris Methodology Demo](DOCUMENTATION/BORIS-METHODOLOGY-DEMO.md) - Full walkthrough
- [Changelog Standards](DOCUMENTATION/CHANGELOG-STANDARDS.md) - Version tracking

## 🤝 Contributing

We welcome contributions!

1. **Improve templates** - Enhance directory structures
2. **Add commands** - Create useful slash commands
3. **Submit skills** - Build specialized skills
4. **Fix bugs** - Found an issue? Submit a fix

See [DOCUMENTATION/CONTRIBUTING.md](DOCUMENTATION/CONTRIBUTING.md) for guidelines.

## 📖 Resources

### Organized AI
- **Live Events**: [Organized AI Events](https://lu.ma/organizedai-starterstacks)
- **Community**: [Join Us](https://lu.ma/Organizedai)
- **Plugin Marketplace**: [github.com/Organized-AI/plugin-marketplace](https://github.com/Organized-AI/plugin-marketplace)

### Learn More
- [Boris Methodology Video](https://www.youtube.com/watch?v=B-UXpneKw6M) - Original source
- [Claude Code Docs](https://docs.anthropic.com/claude-code) - Official documentation

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Ready to organize your project?** Run `npx create-organized-codebase my-project` or apply to an existing project with `just apply-organized`!

For questions, join the [Organized AI community](https://lu.ma/Organizedai).
