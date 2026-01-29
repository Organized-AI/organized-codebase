# create-organized-codebase

Interactive CLI to set up [Organized Codebase](https://github.com/Organized-AI/organized-codebase) with Boris methodology for Claude Code projects.

## Quick Start

```bash
npx create-organized-codebase
```

## What Gets Installed

### Command Packs

| Pack | Commands | Purpose |
|------|----------|---------|
| **Boris** | `/verify`, `/commit`, `/status`, `/review` | Verification-first workflow |
| **OC Workflow** | `/oc:new-project`, `/oc:progress`, `/oc:discuss`, `/oc:pause`, `/oc:resume`, `/oc:quick` | Structured project management |
| **Session** | `/session:start`, `/session:end` | Session rituals |

### Configuration Files

- `.claude/settings.json` - Permissions configuration
- `CLAUDE.md` - Project context for AI

## Installation Options

### Interactive Mode (Default)

```bash
npx create-organized-codebase
```

The wizard will:
1. Detect your project type
2. Ask about installation scope (local/global)
3. Let you choose which command packs to install
4. Configure verification depth

### Non-Interactive Mode

```bash
# Install locally with all defaults
npx create-organized-codebase --local -y

# Install globally
npx create-organized-codebase --global -y

# Install to both local and global
npx create-organized-codebase --both -y

# Minimal installation (quick verification)
npx create-organized-codebase --local --minimal -y

# Preview without installing
npx create-organized-codebase --dry-run
```

## Command Reference

### Boris Methodology

| Command | Description |
|---------|-------------|
| `/verify` | Run all verification checks before committing |
| `/commit` | Smart commit with automatic verification |
| `/status` | Project health check and orientation |
| `/review` | Self-review before creating PR |

### OC Workflow

| Command | Description |
|---------|-------------|
| `/oc:new-project` | Initialize with structured questioning |
| `/oc:progress` | Show current state and next steps |
| `/oc:discuss` | Capture implementation decisions |
| `/oc:pause` | Create handoff documentation |
| `/oc:resume` | Restore from last session |
| `/oc:quick` | Ad-hoc task with quality guarantees |

### Session Management

| Command | Description |
|---------|-------------|
| `/session:start` | Session initialization ritual |
| `/session:end` | Session closure ritual |

## Philosophy

Organized Codebase combines two powerful approaches:

1. **Boris Methodology** - Verification-first development from Claude Code's creator
2. **GSD-inspired Workflow** - Context-preserving project management

The result: Consistent, high-quality AI-assisted development without context rot.

## License

MIT
