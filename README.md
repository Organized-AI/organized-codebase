# Organized Codebase

> 🚀 **A curated collection of Claude Code skills, commands, and project templates implementing the Boris methodology - the verification-first workflow from Claude Code's creator.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Organized AI](https://img.shields.io/badge/Organized-AI-blue.svg)](https://organized.ai)

## 🎯 What's Included

This repository provides everything you need to supercharge your Claude Code experience:

- **15+ Skills** - Specialized capabilities from project setup to deployment
- **8 Commands** - Quick actions like `/commit`, `/verify`, `/review`
- **Boris Methodology** - Verification-first development workflow
- **Project Templates** - Organized structure for new projects
- **NPM Package** - `create-organized-codebase` for instant setup

## ⚡ Quick Start

### Option 1: Use the NPM Package (Recommended)

```bash
npx create-organized-codebase my-project
```

This creates a new project with:
- ✅ Boris methodology pre-configured
- ✅ All verification commands ready
- ✅ Planning documents structure
- ✅ Claude Code settings optimized

### Option 2: Clone and Apply

```bash
# Clone the repository
git clone https://github.com/Organized-AI/organized-codebase.git

# Copy skills to your project
cp -r organized-codebase/.claude/skills ~/.claude/skills
cp -r organized-codebase/.claude/commands ~/.claude/commands
```

## 🤖 Boris Methodology

> "Always give Claude a way to verify its work." - Boris (Claude Code Creator)

The Boris methodology is a verification-first development workflow that ensures quality at every step:

| Phase | Command | Purpose |
|-------|---------|---------|
| **Start** | `/status` | Orient to project state |
| **Plan** | Plan Mode | Design before coding |
| **Build** | One feature | Focused implementation |
| **Verify** | `/verify` | Run all checks |
| **Commit** | `/commit` | Smart git workflow |
| **Review** | `/review` | Self-review before PR |

### Core Principles

1. **Verification First** - Define how to verify before writing code
2. **One Feature at a Time** - Focus prevents bugs
3. **Plan Mode for Complexity** - Think before you code
4. **Continuous Verification** - Check as you go

## 📦 Available Skills

| Skill | Description |
|-------|-------------|
| `boris` | Master orchestrator for Boris methodology |
| `git-worktree-master` | Manage parallel branches and isolated workspaces |
| `long-runner` | Orchestrate multi-session development |
| `phased-build` | Execute multi-phase builds with verification gates |
| `phase-0-bootstrap` | Bootstrap TypeScript/Node.js projects |
| `phased-planning` | Create structured implementation plans |
| `changelog-updater` | Track and apply Claude Code updates |
| `skill-creator-enhanced` | Create new skills with packaging |
| `tech-stack-orchestrator` | Analyze and recommend Claude Code components |
| `organized-codebase-applicator` | Apply template structure to existing projects |
| `repo-manager` | Automate repository maintenance |
| `data-audit` | Meta Ads account auditing |
| `posthog-wizard` | PostHog integration patterns |
| `skill-genie` | Skill discovery and recommendations |

## ⌨️ Available Commands

| Command | Description |
|---------|-------------|
| `/verify` | Run all verification checks |
| `/commit` | Smart commit with verification |
| `/review` | Self-review before PR |
| `/status` | Project health check |
| `/j` | Just command runner integration |
| `/new-project` | Create new project from template |
| `/update-changelog` | Fetch latest Claude Code changelog |
| `/verify-changelog` | Verify changelog is up-to-date |

## 📁 Project Structure

```
organized-codebase/
├── .claude/
│   ├── skills/              → 15+ specialized skills
│   ├── commands/            → Quick action commands
│   └── settings.json        → Claude Code configuration
├── packages/
│   └── create-organized-codebase/  → NPM scaffolding tool
├── PLANNING/                → Implementation methodology docs
├── DOCUMENTATION/           → Guides and references
│   ├── BORIS-CHEAT-SHEET.md
│   ├── BORIS-METHODOLOGY-DEMO.md
│   ├── CHANGELOG-STANDARDS.md
│   └── claude-code-changelog.md
└── ARCHITECTURE/            → System design docs
```

## 🚀 Using Skills

Skills activate automatically based on triggers. Examples:

```
# Boris methodology
"help me start a new session"  → boris skill
"verify my work"               → boris skill

# Git worktrees
"work on multiple branches"    → git-worktree-master
"create isolated workspace"    → git-worktree-master

# Project phases
"execute phase 2"              → phased-build
"create implementation plan"   → phased-planning
```

Or invoke directly:
```
/boris
/git-worktree-master
/phased-build
```

## 📚 Documentation

- [Boris Cheat Sheet](DOCUMENTATION/BORIS-CHEAT-SHEET.md) - Quick reference
- [Boris Methodology Demo](DOCUMENTATION/BORIS-METHODOLOGY-DEMO.md) - Full walkthrough
- [Changelog Standards](DOCUMENTATION/CHANGELOG-STANDARDS.md) - Version tracking
- [Claude Code Changelog](DOCUMENTATION/claude-code-changelog.md) - Latest updates

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Add Skills** - Create new skills using `skill-creator-enhanced`
2. **Improve Docs** - Help clarify documentation
3. **Report Issues** - Share feedback and bugs
4. **Share Workflows** - Submit your verified patterns

See [DOCUMENTATION/CONTRIBUTING.md](DOCUMENTATION/CONTRIBUTING.md) for guidelines.

## 📖 Resources

### Organized AI
- **Live Events**: [Organized AI Events](https://lu.ma/organizedai-starterstacks)
- **Community**: [Join Us](https://lu.ma/Organizedai)
- **Website**: [organized.ai](https://organized.ai)

### Learn More
- [Boris Methodology Video](https://www.youtube.com/watch?v=B-UXpneKw6M) - Original source
- [Claude Code Docs](https://docs.anthropic.com/claude-code) - Official documentation

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Ready to level up your Claude Code workflow?** Start with `/boris` and let the methodology guide you to better code!

For questions, join the [Organized AI community](https://lu.ma/Organizedai).
