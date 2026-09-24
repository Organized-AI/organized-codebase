---
name: stop-verification-evidence
description: |
  Optional Stop hook that blocks completion when code or docs changed but the response lacks a concrete verification surface or evidence summary.
  Designed to reinforce Boris's "verification over prompt bloat" principle.
trigger: Stop
condition: Work modified files or claimed completion without showing how success was checked
version: 1.0.0
---

# Stop Verification Evidence Hook

## Purpose

Prevent "looks done to me" completions.

This hook enforces the idea that stronger verification surfaces beat longer prompt instructions.

## What it should inspect

Before allowing the session or task to end, the hook should check for:
- changed files
- declared completion claims
- whether verification commands were run
- whether any evidence artifact, screenshot, diff summary, or test output was cited

## Expected evidence types

At least one of:
- test output
- build output
- lint / typecheck output
- screenshot or visual evidence
- runtime health check
- artifact existence check
- reviewer / verifier pass

## Suggested blocking message

```text
STOP BLOCKED — verification evidence missing.

You changed files or claimed completion, but no verification surface was reported.
Run the appropriate checks or explain why verification is not applicable.
Suggested follow-up: /verify or add a verification contract.
```

## Good cases to block

- "Implemented" with no tests, diff review, or build proof
- UI changes with no screenshots or browser checks
- long-running tasks with no exit criteria
- migration claims with no parity or smoke-test evidence

## Cases not to over-block

- pure brainstorming with no file changes
- small editorial changes where manual diff review is the evidence
- scaffold planning that explicitly has no executable verification yet

## Helix mode: per-checkpoint evidence bundle

When `PLANNING/helix/checkpoints.json` exists and this session touched a checkpoint (status left
`planned`, or a `feat(helix): CP-NN` commit was made), generic evidence is **not enough**. Each touched
checkpoint must have a complete bundle:

```
PLANNING/helix/evidence/CP-NN/
├── g1-tests.txt       # G1 — integration test output against the target (and reference run)
├── g2-visual.json     # G2 — helix-visual-gate verdict {verdict, diffs[], artifacts{R2 keys}}
├── g3-review-a.md     # G3 — reviewer A verdict (architecture & correctness)
├── g3-review-b.md     # G3 — reviewer B verdict (reference fidelity & hostile user)
└── bundle.json        # manifest written by helix-check: gate statuses, evidence paths, G4, commit
```

The hook runs:

```bash
node scripts/helix/helix-check.js validate && \
node scripts/helix/helix-check.js evidence --all
```

`evidence` writes `bundle.json` for every non-`planned` checkpoint and exits `1` if any gate claims
`pass` / `fail` / `invalid` without its evidence file. `pending` gates and a G2 `skipped` for a
non-UI checkpoint need no file.

**Block when:**
- `validate` fails (e.g. `committed` with a reviewer still `fail`, G2 skipped on a UI checkpoint)
- `evidence --all` exits 1 (a gate result with no artifact behind it)
- a checkpoint is claimed done but `node scripts/helix/helix-check.js stop CP-NN` isn't `done: true`
- the response claims G4 approval that isn't recorded in `checkpoints.json`

**Suggested blocking message (Helix):**

```text
STOP BLOCKED — Helix evidence bundle incomplete.

CP-04 Checkout address form [gates_passed]
  missing: g3_review_b (PLANNING/helix/evidence/CP-04/g3-review-b.md)

Re-run /helix-gate CP-04 (gates restart from G1) or record the missing verdict.
```

**Don't block** a `/helix-next` run that stopped early on a `blocked` checkpoint — that's the loop
working. Require only that the blocked checkpoint has `blocked_reason` and a `helix-memory.md` entry.

## Best companion artifacts

- `/verify`
- `/outcome-prompt`
- `/helix-gate`, `/helix-next` (Helix mode)
- `verification-surface-designer` skill
- project-specific build/test commands
