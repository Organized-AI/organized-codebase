# Organized Codebase

Meta-repository for Claude Code skills, commands, agents, and project templates.

## Tech Stack
- Runtime: Node.js 20+
- Languages: TypeScript, Markdown
- Tools: Claude Code CLI, MCP servers
- Key Dependencies: @anthropic-ai/sdk, various MCP integrations

## Project Structure
```
.claude/           → Local Claude Code config (commands, agents, skills, hooks)
PLANNING/          → Implementation phases and methodology docs
ARCHITECTURE/      → System design documentation
DOCUMENTATION/     → General docs and guides
skills/            → Distributable skills (organized-codebase-applicator, etc.)
scripts/           → Automation scripts
```

## Code Conventions
- Use TypeScript with strict mode for all new code
- Prefer async/await over callbacks
- Use conventional commits (feat/fix/docs/refactor/test/chore)
- Skills use SKILL.md format with YAML frontmatter

## DO NOT
- Never use `--dangerously-skip-permissions` (use structured permissions instead)
- Never skip plan mode for complex features (always plan first)
- Never commit without running verification first
- Never hardcode paths - use relative paths or environment variables
- Never create files without reading existing patterns first

## Verification Requirements
Before completing ANY task:
1. Describe your verification approach first
2. Run linting/type checks if applicable
3. For skills/commands: test by invoking them
4. For UI changes: provide screenshot or description
5. Update CLAUDE.md "DO NOT" section if you discover new anti-patterns

---

## MCP Integration

### Byterover Knowledge Base
You are given two tools from Byterover MCP server:

#### 1. `byterover-store-knowledge`
You `MUST` always use this tool when:
+ Learning new patterns, APIs, or architectural decisions from the codebase
+ Encountering error solutions or debugging techniques
+ Finding reusable code patterns or utility functions
+ Completing any significant task or plan implementation

#### 2. `byterover-retrieve-knowledge`
You `MUST` always use this tool when:
+ Starting any new task or implementation to gather relevant context
+ Before making architectural decisions to understand existing patterns
+ When debugging issues to check for previous solutions
+ Working with unfamiliar parts of the codebase
