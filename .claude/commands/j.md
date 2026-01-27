---
description: Just command runner integration - execute Just recipes from Claude
---

# Just Integration

Execute Just recipes directly from Claude Code.

## Usage

`/j [recipe]` - Run a Just recipe

## Available Recipes

When invoked, list available recipes and help the user:

### 1. Check Just Installation
```bash
just --version
```

If not installed, provide installation instructions:
- macOS: `brew install just`
- Linux: `cargo install just`
- Windows: `winget install casey.just`

### 2. List Available Recipes
```bash
just --list
```

### 3. Execute Recipe
If user provides a recipe name as argument, execute it:
```bash
just <recipe>
```

## Common Recipes (Organized Codebase)

| Recipe | Description |
|--------|-------------|
| `just` | Show all available recipes |
| `just apply-organized` | Apply full Organized Codebase structure |
| `just add-claude` | Scaffold .claude/ directory |
| `just add-planning` | Create PLANNING/ docs |
| `just add-handoff` | Create AGENT-HANDOFF/ |
| `just add-ralphy` | Create .ralphy/ config |
| `just verify` | Run verification suite |
| `just project-status` | Show project status |
| `just archive-iterations` | Archive old iteration dirs |
| `just clean-regenerable` | Clean node_modules, dist, etc. |

## Examples

**User:** `/j`
**Action:** Run `just --list` to show available recipes

**User:** `/j add-claude`
**Action:** Run `just add-claude` to scaffold .claude/

**User:** `/j apply-organized`
**Action:** Run `just apply-organized` for full setup

## Error Handling

- If Just is not installed, provide installation instructions
- If justfile doesn't exist, offer to create one from template
- If recipe fails, show error and suggest fixes

## Integration with /verify

The `/j verify` recipe delegates to Claude's verification - for full verification, use `/verify` directly.
