# Codex Setup for Organized Codebase

Organized Codebase now supports a **thin Codex adapter surface** without turning the repo into ECC-sized infrastructure.

## What gets added

- `AGENTS.md` — Codex-friendly project primer
- `.codex/config.toml` — project-local Codex defaults
- `.codex/agents/*.toml` — lightweight role cards for exploration, review, and docs research

## Why this layer stays thin

Codex is a **harness surface**, not the whole architecture.
The core methodology still lives in Boris + repo structure:

- `CLAUDE.md` remains the canonical project manual
- `AGENTS.md` gives Codex the shortest useful operator brief
- `.codex/agents/` captures role-specific behavior without copying the whole repo manual

## Install into another repo

```bash
curl -o justfile https://raw.githubusercontent.com/Organized-AI/organized-codebase/main/templates/justfile
just add-codex
```

## Suggested workflow

1. Read `AGENTS.md`
2. Read `CLAUDE.md`
3. Use `.codex/agents/explorer.toml` for repo orientation
4. Use `.codex/agents/reviewer.toml` before merge or large refactors
5. Use `.codex/agents/docs-researcher.toml` for workflow/docs changes

## Relationship to Organized Router

Codex support does **not** imply global routing logic.
Codex is a harness surface.
Organized Router is a separate policy layer under `CONFIG/router/`.

## Relationship to Pi Agent companion harnesses

Codex is for strong coding / review workflows.
Pi/local harnesses are sibling execution environments for cheaper, privacy-sensitive, or task-specialized loops.
Keep those rules under `harnesses/pi-agent/`.
