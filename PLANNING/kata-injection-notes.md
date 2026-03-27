# Kata Integration — Injection Notes

Phase 0 analysis artifact. Documents exact files, insertion points, and decisions for Phase 1.

**Kata version:** 0.3.0
**Branch:** `feat/kata-integration` (from `origin/main` at `8d84a5c`)
**Date:** 2026-03-27

---

## Kata CLI Audit

### Commands Verified

| Command | Status | Output |
|---------|--------|--------|
| `npx kata --version` | exit 0 | `0.3.0` |
| `npx kata modes` | exit 0 | 8 modes: research, planning, implementation, task, freeform, verify, debug, onboard |
| `npx kata setup --help` | exit 0 | Flags: `--yes`, `--strict`, `--batteries` |
| `npx kata batteries` | exit 0 | Scaffolded 28 files (templates, agents, prompts, specs, GitHub issue templates) |
| `npx kata config --show` | exit 0 | Config at `.claude/workflows/kata.yaml` |

### Key Discovery: Config Location

Kata stores config at `.claude/workflows/kata.yaml` — NOT `.kata/kata.yaml` as initial docs suggested. Session state goes to `.claude/sessions/{SESSION_ID}/state.json`.

### Agent Runner CLI (`kata agent-run`)

Not a separate "agent runner" — it's a prompt-driven agent dispatch:
```
kata agent-run --prompt=<name>           # Named prompt from .claude/workflows/prompts/
kata agent-run --custom="<text>"         # Inline prompt
  --provider=claude|gemini|codex         # Multi-provider support
  --tools=all | --yolo                   # Tool access control
  --context=git_diff,spec,template       # Context injection
  --gate --threshold=75                  # Score gating
```

### Multi-Project Management (`kata projects`)

```
kata projects init-manager               # Initialize ~/.kata/manager/
kata projects list | add | remove        # Registry management
kata projects doctor | upgrade           # Health checks, bulk updates
kata projects sync <source> <target>     # Config sync between projects
```

### Batteries Scaffold Output

`kata batteries` created 28 files:
- `.claude/workflows/kata.yaml` — main config
- `.claude/workflows/templates/*.md` — 8 mode templates
- `.claude/agents/{impl,review,test}-agent.md` — 3 agents
- `.claude/workflows/prompts/*.md` — 5 review prompts
- `planning/spec-templates/{bug,epic,feature}.md` — spec templates
- `.github/ISSUE_TEMPLATE/{bug,epic,feature}.yml` — GitHub issue templates
- `.claude/workflows/interviews.yaml` — onboard interview config
- `.claude/workflows/subphase-patterns.yaml` — subphase patterns
- `.claude/workflows/verification-tools.md` — verification tool config

---

## Settings.json Audit

### On `origin/main` (current branch base)

**Permissions only — NO `hooks` key.**

```
allow: git read ops, npm run/test/build, npx, ls, pwd, which, echo, node/npm/claude version
ask:   git write ops, rm, mv, npm install/uninstall
deny:  force push, hard reset, rm -rf, sudo, chmod 777, curl|bash
```

Uses `npm` references throughout (no pnpm).

### On `feature/multi-doc-tracker` (not yet merged)

Has elaborate `hooks` block:
- **PreToolUse:** Bash destructive-op blocker, Edit|Write sensitive-file blocker
- **PostToolUse:** Auto-formatter (biome/prettier/ruff)
- **Notification:** macOS osascript

Also has pnpm references in permissions (`pnpm run`, `pnpm dlx`, etc.).

### Kata Hook Registration

`kata setup` registers these hooks (NOT `kata batteries` — batteries only scaffolds content):

| Hook Point | Kata Command | Purpose |
|------------|-------------|---------|
| SessionStart | `kata hook session-start` | Initialize session + inject context |
| UserPromptSubmit | `kata hook user-prompt` | Detect mode from user message |
| PreToolUse (optional, `--strict`) | `kata hook mode-gate` | Block writes without active mode |
| PreToolUse:TaskUpdate (optional, `--strict`) | `kata hook task-deps` | Check task dependencies |
| PreToolUse:TaskUpdate (optional, `--strict`) | `kata hook task-evidence` | Check git status for evidence |
| Stop | `kata hook stop-conditions` | Check exit conditions |

**`--strict` adds 3 extra PreToolUse hooks.** Without `--strict`, only SessionStart, UserPromptSubmit, and Stop are registered.

---

## Scaffold Surface Analysis

### Surface 1: `templates/justfile`

| Property | Value |
|----------|-------|
| Creates settings.json? | YES — inline HEREDOC (lines 21-54) |
| Package manager | npm |
| Has dependency install? | No |

**Injection points:**
- **Line ~225:** Insert new `add-kata` recipe (between `add-planning` and next section). Recipe should run `npx kata setup --yes` or `npx kata setup --batteries`
- **Line 395:** Add `add-kata` to `apply-organized` dependency chain: `apply-organized: add-claude add-kata add-ralphy add-planning add-handoff`
- **Lines 21-54:** The inline settings.json in `add-claude` may need kata hook entries IF we want hooks registered via template rather than `kata setup`

### Surface 2: `scripts/apply-organized-codebase.sh`

| Property | Value |
|----------|-------|
| Creates settings.json? | No (delegates to justfile) |
| Package manager | None (shell orchestration) |
| Has dependency install? | No |

**Injection points:**
- **Line 96:** In `direct_scaffold()`, after `.ralphy` mkdir, add `.claude/workflows` mkdir
- **Lines 166-175:** In fallback messaging, add kata setup as a recommended next step

### Surface 3: `setup-template.sh`

| Property | Value |
|----------|-------|
| Creates settings.json? | No (copies from template at line 78) |
| Package manager | npm |
| Has dependency install? | YES — creates package.json (lines 107-131) |

**Injection points:**
- **After line 78:** Add `cp -r "$TEMPLATE_DIR"/.claude/workflows . 2>/dev/null` for kata config
- **Line 124:** Add `@codevibesmatter/kata` to devDependencies in generated package.json
- **Lines 228-234:** Add kata setup to post-setup instructions

### Surface 4: `packages/create-organized-codebase/templates/config/settings.json` (FUTURE)

NOT on `origin/main`. Exists on `feature/multi-doc-tracker` only.
**Action:** Document as post-merge surface. When that branch merges, update the template settings.json to include kata hooks.

### Surface 5: `packages/create-organized-codebase/src/installers/core.ts` (FUTURE)

NOT on `origin/main`. Exists on `feature/multi-doc-tracker` only.
**Action:** Document as post-merge surface. The `installConfig()` function will need to handle kata hooks.

---

## Key Decisions

### 1. Package Manager

**Decision: Use npm for all template surfaces (match `origin/main`).**

Rationale: The pnpm migration is on `feature/multi-doc-tracker` and hasn't merged. Kata integration should not depend on or couple to that migration. When pnpm merges, update kata references from `npx` to `pnpm dlx`.

### 2. Hook Registration Strategy

**Decision: Deferred — not blocking for Phase 0.**

Hook registration strategy will be decided during Phase 1 implementation when we can test the actual merge behavior.

### 3. `.kata/` vs `.claude/workflows/` Scaffolding

**Decision: Let `kata setup` or `kata batteries` create `.claude/workflows/`.**

Rationale: Kata 0.3.0 uses `.claude/workflows/kata.yaml` as its config path. The template should NOT ship a pre-authored kata.yaml — instead, the `add-kata` recipe runs `kata setup` or `kata batteries` which creates the correct structure for the installed version.

### 4. `--batteries` vs `--yes` vs `--strict`

**Decision: Option 3 — `kata setup --batteries --strict`**

Full batteries + strict PreToolUse enforcement. Organized Codebase is opinionated by design — maximum workflow discipline matches the philosophy. Users who want less can always `kata teardown` and re-setup with fewer flags.

---

## Recommended Phase 1 Order

1. Add `add-kata` recipe to `templates/justfile` (runs `npx kata setup [flags]`)
2. Add `add-kata` to `apply-organized` dependency chain in justfile
3. Update `scripts/apply-organized-codebase.sh` direct_scaffold fallback
4. Update `setup-template.sh` to include kata in generated package.json + post-setup instructions
5. Update CLAUDE.md to document kata-enabled workflow
6. **Post `feature/multi-doc-tracker` merge:** Update `packages/create-organized-codebase/` surfaces
7. **Post merge:** Reconcile kata hooks with security hooks in settings.json (security BEFORE workflow)

---

## Open Questions for Phase 1

1. Should kata hooks be registered declaratively in the template's settings.json, or via `kata setup` at scaffold time?
2. Should the default scaffold use `--batteries` (full content) or `--yes` (minimal)?
3. Should `--strict` (PreToolUse enforcement) be the default for Organized Codebase projects?
4. How should Boris methodology commands (`/verify`, `/commit`, `/review`) interact with kata modes?
5. Should `kata enter onboard` be part of the new-project experience?
