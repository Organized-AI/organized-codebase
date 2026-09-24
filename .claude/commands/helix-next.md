---
description: Autonomously run the next N approved Helix checkpoints (G1–G3 enforced per checkpoint, G4 human review batched at the end)
argument-hint: [N=1]
---

# /helix-next $ARGUMENTS

Run up to **N** checkpoints back-to-back without stopping for the human between them. Autonomy
changes *when* the human looks (once, at the end), never *whether* machine gates block.

## Step 0: Select

```bash
node scripts/helix/helix-check.js validate
node scripts/helix/helix-check.js next ${N:-1}
```

`next` returns the eligible checkpoints in plan order and a `halted_by` reason if something stops
the run early (sequence not approved, a `blocked` checkpoint, an unmet dependency). If `eligible`
is empty, report `halted_by` and stop.

Read `PLANNING/helix/helix-memory.md` (active entries) once, and again whenever you add an entry.

## Step 1: For each eligible checkpoint, in order

1. `status: in_progress`; fill `acceptance` from the reference.
2. `test-agent` in HELIX MODE → tests pass on reference, RED on target.
3. Implement until green.
4. `/helix-gate <CP-ID>` — full G1 → G2 → G3 loop with restart-from-G1 and the convergence budget.
5. `gates.g4_human = { "status": "pending" }` — the human sees it in the batch review.
6. `/commit` → `feat(helix): <CP-ID> <title>` with the `Gates:` trailer (`G4 pending`).
   Set `status: committed` and record the SHA (it rides along in the next checkpoint's commit).
7. `node scripts/helix/helix-check.js stop <CP-ID>` → `done: true`, or stop the run.

## Stop early when

- a checkpoint goes `blocked` (convergence budget exhausted) — write the `helix-memory.md` entry first
- G2 or G1 is `invalid` and one repair attempt didn't fix the evidence (reference down, capture broken)
- a dependency isn't `committed`
- you'd need to change something outside the checkpoint's `scope` or `ARCHITECTURE/system-design.md`
- context is running low — finish the current checkpoint's commit, then stop (long-runner handoff)

Never "skip ahead" past a blocked checkpoint, even if later ones don't depend on it — the approved
sequence is the contract.

## Step 2: Batched G4 review

End the run with ONE review packet for the human:

```
═══════════════════════════════════════════════════════
  HELIX NEXT — 3 of 3 checkpoints committed, G4 pending
═══════════════════════════════════════════════════════
CP-02  Cart drawer opens        a1b2c3d  attempts 2  G2 PASS (1 cosmetic)   G3 A✅ B✅
CP-03  Inventory sync endpoint  d4e5f6a  attempts 1  G2 skipped (no UI)     G3 A✅ B✅
CP-04  Checkout address form    0718293  attempts 3  G2 PASS                G3 A✅ B✅

Evidence: PLANNING/helix/evidence/CP-0{2,3,4}/
New memory entries: HM-004
Promotion candidates: HM-001 (prevented on CP-02, CP-03, CP-04)

Approve all · or reject by id with a reason
═══════════════════════════════════════════════════════
```

- **Approve** → `g4_human.status = pass` for each (with `at`).
- **Reject CP-NN** → `g4_human = { status: "fail", reason }`, write a `helix-memory.md` entry, set the
  checkpoint back to `in_progress`, fix *on top* (no history rewrite), re-run `/helix-gate`, recommit.
  Later checkpoints that depend on it are re-gated from G1 too.

## Step 3: Memory promotion review

For each entry whose `Prevented` lists ≥ 3 checkpoints, mark it `candidate` and list it in the packet.
Promotion itself goes through `/ablate` — see **Promotion path** below.

## Promotion path: helix-memory → CLAUDE.md via /ablate

```
helix-memory.md (active) ─► candidate (≥3 prevented) ─► /ablate ─► smallest durable home
```

`/ablate` is the gatekeeper because `CLAUDE.md` is paid for on *every* session. When running it for a
Helix candidate:

1. Treat the candidate as a proposed **re-add** (Step 5 of `/ablate`): prefer a test, lint rule, or
   `helix-check.js` rule over prose; then a reviewer checklist line; `CLAUDE.md` last.
2. Evidence = the entry's `Source` + `Prevented` checkpoints, plus a re-run of one representative
   checkpoint **without** the entry in context. If the failure comes back, the entry has earned its place.
3. If it goes to `CLAUDE.md`, add ONE line under `## DO NOT` (or the relevant section), commit as
   `docs(claude-md): promote HM-NNN from helix-memory`, and set the entry to
   `promoted` with the commit SHA.
4. At the next model upgrade, promoted Helix lines are ablated like any other `CLAUDE.md` line.

## Rules

- G1–G3 are never relaxed in autonomous mode.
- One checkpoint = one `feat(helix)` commit. Fix-ups after G4 rejection are new commits.
- Don't push unless the user asked; the batch review happens before anything leaves the machine.
