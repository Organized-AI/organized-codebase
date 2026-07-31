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

## Best companion artifacts

- `/verify`
- `/outcome-prompt`
- `verification-surface-designer` skill
- project-specific build/test commands
