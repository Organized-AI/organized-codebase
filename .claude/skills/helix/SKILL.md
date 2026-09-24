---
name: helix
description: |
  Checkpoint + blocking-gate convergence loop (Shopify-style "Helix") for rebuilding, porting, or
  cloning something that already exists. A working reference IS the spec: work is sliced into small,
  human-approved checkpoints, and each checkpoint must pass four ordered, blocking gates
  (behavior → visual → 2x adversarial review → human) before it is committed.
  Use when: (1) porting/migrating an app, screen, or service to a new stack, (2) rebuilding UI from a
  reference site, design export, or screenshots, (3) user says "helix", "checkpoint loop", "gate it",
  "match the reference", "converge on the reference", "next N checkpoints", (4) a phased build keeps
  "finishing" phases that don't actually match the thing it was supposed to replicate.
metadata:
  version: 1.0.0
  source: Shopify engineering — checkpoint + blocking-gate convergence loop
  sibling_of: boris
  integrates_with:
    - boris (skill)
    - phased-build (skill)
    - long-runner (skill)
    - git-worktree-master (skill)
    - verification-surface-designer (skill)
    - helix-planner (agent)
    - test-agent (agent)
    - helix-reviewer-a (agent)
    - helix-reviewer-b (agent)
    - helix-gate (command)
    - helix-next (command)
    - commit (command)
    - ablate (command)
    - stop-verification-evidence (hook)
    - helix-visual-gate (worker)
triggers:
  - "helix"
  - "checkpoint loop"
  - "gate it"
  - "match the reference"
  - "converge on the reference"
  - "port this"
  - "rebuild this from"
  - "next checkpoint"
  - "helix next"
---

# Helix Skill

A convergence loop for work that has a **reference**: an existing app, a legacy service, a live site,
a Figma export, a screenshot set. Instead of writing a spec, you point at the reference and say
"make it do that". Helix turns that into small checkpoints, and no checkpoint lands until four
blocking gates agree it matches.

> **Boris:** "Always give Claude a way to verify its work."
> **Helix:** "…and when a reference exists, the reference *is* the verification."

---

## ⚡ Core Principles

| # | Principle | What it means in practice |
|---|-----------|---------------------------|
| 1 | **Reference-as-spec** | The reference is the source of truth. Tests, screenshots, and reviews compare *against it*, not against a prose spec that drifted from it. If reference and prose disagree, the reference wins (and the prose gets fixed). |
| 2 | **Skeleton-first checkpoints** | Plan the *sequence* before the *content*. Each checkpoint gets a few-word title (≤ 6 words). Details are filled in just-in-time, when that checkpoint starts. |
| 3 | **Human approves the sequence only** | The human reviews ordering and slicing once — not every acceptance criterion. That's where human judgment is cheapest and highest-leverage. |
| 4 | **Blocking, ordered gates** | G1 → G2 → G3 → G4. A gate never runs until the previous one passes. A FAIL blocks. INVALID also blocks (bad evidence is not a pass). |
| 5 | **Fix ⇒ re-run from G1** | Any code change made to satisfy a later gate re-opens every earlier gate. This is what makes it *converge* instead of oscillate. |
| 6 | **Commit per checkpoint** | One checkpoint = one commit, with gate evidence referenced in the message. Every commit on the branch is a known-good state. |
| 7 | **Feedback memory** | Human rejections and repeat reviewer findings are written to `PLANNING/helix/helix-memory.md` and read at the start of every checkpoint. Proven entries get promoted to `CLAUDE.md` via `/ablate`. |

---

## 🧬 The Loop

```
                    ┌──────────────────────────────────────────┐
                    │  REFERENCE (running app / site / export) │
                    └───────────────────┬──────────────────────┘
                                        │ helix-planner
                                        ▼
                    PLANNING/helix/checkpoints.json   (skeleton, titles only)
                                        │
                              HUMAN approves SEQUENCE
                                        │
        ┌───────────────────────────────▼───────────────────────────────┐
        │  for each checkpoint CP-NN:                                    │
        │    1. read helix-memory.md                                     │
        │    2. flesh out scope + acceptance from the reference          │
        │    3. test-agent → user-perspective integration tests (RED)    │
        │    4. implement until tests GREEN                              │
        │    5. /helix-gate:                                             │
        │         G1 behavior ─► G2 visual ─► G3 review A + review B     │
        │           ▲                                     │              │
        │           └──────── any fix re-opens G1 ◄───────┘              │
        │    6. G4 human (inline, or batched in /helix-next N)           │
        │    7. /commit  → status = committed                            │
        └───────────────────────────────────────────────────────────────┘
```

---

## 🚦 The Four Gates

| Gate | Name | Who runs it | PASS means | Evidence written to |
|------|------|-------------|------------|---------------------|
| **G1** | Behavior | `test-agent` + project test runner | Every user-perspective integration test for this checkpoint passes, and the same assertions pass against the reference | `PLANNING/helix/evidence/CP-NN/g1-tests.txt` |
| **G2** | Visual | `workers/helix-visual-gate` (Gemini) | Verdict `PASS` — no diff with `blocking: true` for the checkpoint's scope | `PLANNING/helix/evidence/CP-NN/g2-visual.json` |
| **G3** | Adversarial review ×2 | `helix-reviewer-a` **and** `helix-reviewer-b`, context-isolated | **Both** return `PASS`. One `BLOCK` from either reviewer fails the gate | `PLANNING/helix/evidence/CP-NN/g3-review-{a,b}.md` |
| **G4** | Human | The human | Explicit approval of the checkpoint (or of the batch, in autonomous mode) | `checkpoints.json` → `gates.g4_human` |

**Rules:**
- Gates are **ordered**. Don't spend reviewer tokens (G3) on something that visually doesn't match (G2).
- Gates are **blocking**. `FAIL` and `INVALID` both stop the line.
- **INVALID** = the gate couldn't judge (missing screenshot, wrong viewport, reference down, test harness crashed). Fix the evidence, re-run the gate. Never treat INVALID as a soft pass.
- **Any fix re-runs from G1.** A reviewer-requested refactor can break behavior; a CSS fix can break a test selector.
- **Non-UI checkpoints** (APIs, jobs, CLIs) mark G2 `skipped` with a one-line reason in `checkpoints.json`. Skipping G2 for a checkpoint that renders UI is not allowed.
- **Convergence budget:** default 3 full G1→G3 loops per checkpoint. On the 4th failure, set status `blocked`, write the reason to `helix-memory.md`, and stop for the human.

---

## 📋 Protocol 1: Plan (skeleton first)

1. **Pin the reference.** Record *exactly* what the reference is in `checkpoints.json → reference`
   (URL + commit/date, path to export, or screenshot folder). A moving reference makes gates meaningless.
2. **Run `helix-planner`.** It reads the reference and emits `PLANNING/helix/checkpoints.json`
   conforming to `PLANNING/helix/checkpoints.schema.json`:
   - checkpoints ordered so each builds on committed predecessors
   - titles only (≤ 6 words, e.g. `"Cart drawer opens"`, `"Checkout address form"`)
   - `scope` + `reference_anchors` sketched, `acceptance` left mostly empty
3. **Human approves the sequence.** They reorder, merge, split, or delete — then set
   `approval.sequence_approved = true`. They are **not** asked to approve acceptance details.
4. **Validate:** `node scripts/helix/helix-check.js validate`

## 📋 Protocol 2: Execute a checkpoint

1. Read `PLANNING/helix/helix-memory.md` (all entries marked `active`).
2. Set status `in_progress`. Fill `acceptance` from the reference — observable, user-perspective
   behaviors only ("user adds item → drawer shows 1 item, subtotal $12.00").
3. `test-agent` in **Helix mode** writes integration tests from the reference (see that agent's
   "Helix Mode" section). Run them against the reference first — they must pass there, or the
   test is wrong, not the implementation.
4. Implement until G1 tests are green.
5. Run `/helix-gate CP-NN`. It loops G1 → G2 → G3, re-running from G1 after any fix.
6. G4: human approves (interactive) or it is queued (autonomous).
7. `/commit` with message `feat(helix): CP-NN <title>` and a `Gates:` trailer. Record the SHA in
   `checkpoints.json`, set status `committed`.
8. Stop condition check: `node scripts/helix/helix-check.js stop CP-NN`

## 📋 Protocol 3: Autonomous "next N"

`/helix-next N` runs up to N approved checkpoints back-to-back:
- G1–G3 are enforced exactly as in Protocol 2 — autonomy never weakens a machine gate.
- G4 is **batched**: each checkpoint is committed with `g4_human.status = "pending"`, and the run ends
  with one human review of all N commits.
- The run **stops early** on: a checkpoint going `blocked`, convergence budget exhausted, INVALID
  evidence that can't be self-repaired, or a dependency not yet `committed`.
- If the human rejects a batched checkpoint: revert/fix on top, log the rejection to
  `helix-memory.md`, and re-gate from G1.

## 📋 Protocol 4: Feedback memory

`PLANNING/helix/helix-memory.md` is the loop's learning surface.

| Source | Write an entry when… |
|--------|---------------------|
| G4 human rejection | Always |
| G3 reviewers | The same finding appears on ≥ 2 checkpoints |
| G2 visual | The same kind of blocking diff appears on ≥ 2 checkpoints |
| Convergence budget exhausted | Always |

Entries are short rules with a checkpoint citation. After an entry prevents repeats across
≥ 3 checkpoints, it's a **promotion candidate** — run `/ablate` to decide whether it earns a line
in `CLAUDE.md` (see `/helix-next` → "Promotion path").

---

## 🗂 Files

```
.claude/skills/helix/SKILL.md            # this file
.claude/agents/helix-planner.md          # reference → checkpoints.json
.claude/agents/helix-reviewer-a.md       # G3 reviewer (correctness / architecture)
.claude/agents/helix-reviewer-b.md       # G3 reviewer (reference fidelity / adversarial user)
.claude/agents/test-agent.md             # G1 (see "Helix Mode")
.claude/commands/helix-gate.md           # runs G1 → G2 → G3
.claude/commands/helix-next.md           # autonomous next-N
.claude/workflows/kata.yaml              # mode: helix (prefix HX)
.claude/workflows/templates/helix.md     # kata template for helix mode
PLANNING/helix/checkpoints.schema.json   # checkpoint plan schema
PLANNING/helix/checkpoints.example.json  # worked example
PLANNING/helix/helix-memory.md           # feedback memory
PLANNING/helix/evidence/CP-NN/           # per-checkpoint gate evidence
scripts/helix/helix-check.js             # validate plan + evaluate stop conditions
workers/helix-visual-gate/               # G2 Cloudflare Worker (Gemini + R2)
```

---

## 🔄 Helix vs Boris vs phased-build

| | Boris | phased-build | Helix |
|---|---|---|---|
| Source of truth | CLAUDE.md + tests | PHASE-X-PROMPT.md | **The reference** |
| Unit of work | Feature | Phase (hours) | **Checkpoint (small, few-word title)** |
| Human approves | Plan | Phase prompts | **Checkpoint sequence only** |
| Verification | `/verify` | Success criteria | **4 ordered blocking gates** |
| On fix | Re-verify | Re-run criteria | **Re-run from G1** |
| Learning | CLAUDE.md DO NOT | Completion docs | **helix-memory.md → /ablate → CLAUDE.md** |

Use **Boris** as the always-on baseline. Reach for **Helix** when a reference exists and "done"
means "indistinguishable from the reference". Helix checkpoints can live *inside* a phased-build
phase; a long-runner session can execute `/helix-next N` per session.

---

## ⚡ Quick Reference

```
┌───────────────────────────────────────────────────────────────┐
│                     HELIX QUICK REFERENCE                      │
├───────────────────────────────────────────────────────────────┤
│  PLAN:     pin reference → helix-planner → human OKs sequence  │
│  BUILD:    memory → acceptance → tests (RED) → code (GREEN)    │
│  GATE:     /helix-gate CP-NN   G1 → G2 → G3  (fix ⇒ back to G1)│
│  LAND:     G4 human → /commit → status committed               │
│  AUTO:     /helix-next N   (G4 batched at end)                 │
│  LEARN:    helix-memory.md → /ablate → CLAUDE.md               │
├───────────────────────────────────────────────────────────────┤
│  CORE RULE: the reference is the spec; gates block; converge.  │
└───────────────────────────────────────────────────────────────┘
```

See `DOCUMENTATION/HELIX-CHEAT-SHEET.md` for the one-page version.
