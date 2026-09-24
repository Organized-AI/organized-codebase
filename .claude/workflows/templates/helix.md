---
id: helix
name: "Helix Checkpoint Loop"
description: "Reference-as-spec: plan checkpoints, then gate each one G1 behavior → G2 visual → G3 2x review → G4 human, commit per checkpoint"
mode: helix
workflow_prefix: "HX"
reviewer_prompt: verify-fix-review

phases:
  - id: p0
    name: Plan
    task_config:
      title: "P0: Pin reference, emit checkpoint skeleton, get sequence approved"
      labels: [helix, planning]
    steps:
      - id: load-plan
        title: "Load or create the checkpoint plan"
        instruction: |
          Read `.claude/skills/helix/SKILL.md` and `PLANNING/helix/helix-memory.md`.

          If `PLANNING/helix/checkpoints.json` exists:
          ```bash
          node scripts/helix/helix-check.js validate
          node scripts/helix/helix-check.js next 1
          ```
          Skip to P1 if the sequence is already approved.

          Otherwise spawn the planner:
          Task(subagent_type="helix-planner", prompt="Reference: {reference}. Emit PLANNING/helix/checkpoints.json.")
          Then: Mark this task completed via TaskUpdate

      - id: approve-sequence
        title: "Human approves the checkpoint SEQUENCE (not details)"
        instruction: |
          Show the human ONLY the ordered list: `CP-NN  <title>  (depends_on)`.
          Ask them to reorder / merge / split / drop. Do not ask them to approve acceptance criteria.
          On approval set `approval.sequence_approved = true`, `approved_by`, `approved_at`, then:
          ```bash
          node scripts/helix/helix-check.js validate
          ```
          Then: Mark this task completed via TaskUpdate

  - id: p1
    name: Checkpoint
    task_config:
      title: "P1: Build CP-NN against the reference"
      labels: [helix, implementation]
    steps:
      - id: flesh-out
        title: "Fill scope + acceptance from the reference"
        instruction: |
          Set the checkpoint `status: in_progress`. Re-read active helix-memory entries.
          Write user-perspective acceptance items by observing the reference at `reference_anchors`.
          Then: Mark this task completed via TaskUpdate

      - id: tests-first
        title: "Generate G1 integration tests from the reference"
        instruction: |
          Task(subagent_type="test-agent", prompt="HELIX MODE. Checkpoint {CP-NN}. Plan: PLANNING/helix/checkpoints.json.")
          Tests must pass against the reference and fail (RED) against the target before implementing.
          Then: Mark this task completed via TaskUpdate

      - id: implement
        title: "Implement until G1 tests are green"
        instruction: |
          Smallest change that makes the checkpoint's tests pass. Stay inside `scope`.
          Then: Mark this task completed via TaskUpdate

  - id: p2
    name: Gates
    task_config:
      title: "P2: /helix-gate CP-NN — G1 → G2 → G3, re-run from G1 after any fix"
      labels: [helix, verification]
    steps:
      - id: run-gates
        title: "Run /helix-gate"
        instruction: |
          Run `/helix-gate {CP-NN}`. It updates `gates.*` and evidence under
          `PLANNING/helix/evidence/{CP-NN}/`. Stop condition `gates_passed` is met when:
          ```bash
          node scripts/helix/helix-check.js stop {CP-NN}   # gates_passed: true
          ```
          If the checkpoint goes `blocked`, STOP and report to the human.
          Then: Mark this task completed via TaskUpdate

      - id: human-gate
        title: "G4 human approval"
        instruction: |
          Present: acceptance list, G2 verdict summary, both G3 verdicts, `git diff --stat`.
          Approve → `g4_human.status = pass`. Reject → log to helix-memory.md, fix, back to /helix-gate.
          (In /helix-next runs, G4 is left `pending` and batched at the end.)
          Then: Mark this task completed via TaskUpdate

  - id: p3
    name: Commit
    task_config:
      title: "P3: Commit the checkpoint"
      labels: [helix, commit]
    steps:
      - id: commit
        title: "Commit per checkpoint"
        instruction: |
          Run `/commit` with message:
          ```
          feat(helix): {CP-NN} {title}

          Gates: G1 pass · G2 {pass|skipped} · G3a pass · G3b pass · G4 {pass|pending}
          Evidence: PLANNING/helix/evidence/{CP-NN}/
          ```
          Set `status: committed` and record the SHA in `checkpoints.json` (`commit`). The SHA edit rides
          along in the NEXT checkpoint's commit — no extra commit needed; until then the checker finds the
          commit by its `feat(helix): {CP-NN} ` subject. Then verify both stop conditions:
          ```bash
          node scripts/helix/helix-check.js stop {CP-NN}   # done: true
          ```
          Then: Mark this task completed via TaskUpdate
