---
name: verification-surface-designer
description: |
  Design verification surfaces for hard or long-running Claude tasks.
  Use when the model needs reliable ways to prove progress, avoid drift, or complete multi-stage work without step-by-step micromanagement.
metadata:
  version: 1.0.0
  author: Organized Codebase
  source: DOCUMENTATION/BORIS-DELETE-YOUR-CLAUDE-MD-GUIDE.md
  integrates_with:
    - outcome-prompt (command)
    - verify (command)
    - verify-build (agent)
    - verify-architecture (agent)
triggers:
  - "verification surface"
  - "long-running task"
  - "hard task"
  - "agent routine"
  - "prove it works"
  - "exit criteria"
---

# Verification Surface Designer

The fastest way to make Claude more autonomous is usually **not** more prompt text.

It is giving Claude a better way to verify its own work.

## What is a verification surface?

A verification surface is the set of signals that tell the model:
- whether it is making progress
- whether it has regressed behavior
- when it is actually done
- what to do when a result is ambiguous

## Surface types

### 1. Build / compiler surfaces
Use when syntax, types, or packaging matter.

Examples:
- `npm run build`
- `npx tsc --noEmit`
- `cargo check`
- `python -m pytest`

### 2. Test surfaces
Use when behavior can be encoded directly.

Examples:
- unit tests
- integration tests
- contract tests
- regression test fixtures

### 3. Visual surfaces
Use when UI fidelity matters.

Examples:
- screenshot diffs
- browser automation checks
- pixel / layout comparisons
- reference-image overlays

### 4. Runtime surfaces
Use when the system must boot and answer correctly.

Examples:
- health endpoints
- smoke-test routes
- CLI exit codes
- artifact existence / file-size checks

### 5. Data surfaces
Use when correctness lives in state transitions.

Examples:
- DB queries
- fixture parity checks
- JSON snapshots
- schema validation

### 6. Review surfaces
Use when generated work needs a second pass.

Examples:
- `verify-architecture` for structure
- `verify-build` for clean-state validation
- focused reviewer agents for style/security

## Design rules

### Rule 1 — Match the surface to the risk
- logic bug → tests
- UI drift → screenshots
- packaging regression → build checks
- flaky runtime behavior → health probes and smoke tests
- ambiguous quality → second-pass review agent

### Rule 2 — Prefer surfaces the model can run itself
The best surface is one Claude can execute repeatedly without human intervention.

### Rule 3 — Give every long-running task a loop-closing signal
Do not ask Claude to "keep going until done" unless it can tell what done looks like.

### Rule 4 — Use multiple surfaces for high-stakes work
A migration may need all of:
- test suite
- build
- screenshot parity
- API response parity
- artifact diff review

## Verification contract template

```md
## Verification Contract

### Outcome
[What must be true]

### Surfaces
- Build:
- Tests:
- Visual:
- Runtime:
- Data:
- Review:

### Exit Criteria
- [observable check 1]
- [observable check 2]
- [observable check 3]

### Escalation
If one surface passes but another fails, prioritize:
1. safety
2. correctness
3. reproducibility
4. polish
```

## Examples

### Example: long-running UI rewrite
- Build: app compiles
- Tests: critical flows pass
- Visual: screenshots match reference within agreed tolerance
- Runtime: app boots locally
- Review: architecture agent checks file placement and conventions

### Example: codebase maintenance routine
- Build: no type errors introduced
- Tests: targeted suite stays green
- Data: dead-code detector output shrinks
- Review: diff review confirms no functional behavior changed

## Anti-patterns

- "Done" means "the prompt felt complete"
- one giant manual QA checklist for work Claude could check automatically
- adding more and more instructions instead of a measurable surface
- relying on a single weak proxy for correctness

## Best pairing

Use this skill together with `/outcome-prompt` to convert a vague task into:
- outcome
- guardrails
- exit criteria
- verification surfaces

That combination is usually better than adding another paragraph to `CLAUDE.md`.
