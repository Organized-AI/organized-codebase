---
description: Run Helix gates G1 behavior → G2 visual → G3 2x adversarial review on one checkpoint, re-running from G1 after any fix
argument-hint: <CP-ID> [--no-fix]
---

# /helix-gate $ARGUMENTS

Run the machine gates for one Helix checkpoint until they all pass, a gate is INVALID and can't be
repaired, or the convergence budget runs out. Gates are **ordered** and **blocking**.

## Step 0: Preconditions

```bash
node scripts/helix/helix-check.js validate
```
- The checkpoint exists, `approval.sequence_approved` is true, every `depends_on` is `committed`.
- Read active entries in `PLANNING/helix/helix-memory.md`.
- `mkdir -p PLANNING/helix/evidence/<CP-ID>`
- Note `budget = settings.convergence_budget` (default 3) and the checkpoint's current `attempts`.

## The loop

```
attempt = attempts + 1
while attempt <= budget:
    G1 behavior   → FAIL/INVALID? fix → attempt++ → restart at G1
    G2 visual     → FAIL/INVALID? fix → attempt++ → restart at G1
    G3 A and B    → any BLOCK?     fix → attempt++ → restart at G1
    all passed    → status = gates_passed, break
if attempt > budget: status = blocked (+ blocked_reason), write helix-memory entry, STOP
```

**Why restart at G1 after every fix:** a reviewer-driven refactor can break behavior; a CSS fix can
break a test selector; a behavior fix can shift layout. Earlier passes are void once code changes.

Increment and persist `attempts` in `checkpoints.json` after every failed loop.

### G1 — Behavior

Run the checkpoint's integration tests (written by `test-agent` in HELIX MODE) against the **target**:
```bash
HELIX_BASE_URL=<target.location> <project test runner> tests/helix/<CP-ID>* \
  2>&1 | tee PLANNING/helix/evidence/<CP-ID>/g1-tests.txt
```
- If no tests exist for this checkpoint → spawn `test-agent` with `HELIX MODE. Checkpoint <CP-ID>.`
- If the reference run was never recorded, run the same tests against `reference.location` first; a
  failure there means the **test** is wrong → fix the test, gate is `invalid` until it passes on the reference.
- Set `gates.g1_behavior` = `pass` | `fail` | `invalid` (+ `reason`, `evidence`, `at`).

### G2 — Visual

Skip only if `has_ui: false` → `status: skipped`, `reason: "No UI: …"`.

1. Capture matching screenshots of the reference and the target for every viewport in
   `reference.viewports` (same route, same data, same viewport, animations settled).
2. Call the visual gate worker (`settings.visual_gate_url`, see `workers/helix-visual-gate/README.md`):
   ```bash
   curl -sS -X POST "$HELIX_VISUAL_GATE_URL/gate" \
     -H "Authorization: Bearer $HELIX_GATE_TOKEN" -H 'content-type: application/json' \
     -d "{\"checkpoint\":\"<CP-ID>\",\"scope\":\"<one-line scope>\",
          \"reference_png\":\"$(base64 -i ref.png)\",\"impl_png\":\"$(base64 -i impl.png)\"}" \
     > PLANNING/helix/evidence/<CP-ID>/g2-visual.json
   ```
3. Map the verdict: `PASS` → `pass`; `FAIL` → `fail`; `INVALID` → `invalid`. The worker already
   returns `FAIL` if any diff has `blocking: true` — do not override it by hand.
4. Fix **blocking** diffs only. Non-blocking diffs go in the commit body as known deltas.

### G3 — Adversarial review ×2

Spawn **both** reviewers **in parallel**, each in a fresh context, each given ONLY the checkpoint id,
the diff, and file paths — never your reasoning, never the other reviewer's output:

```
Task(subagent_type="helix-reviewer-a", prompt="Checkpoint <CP-ID>. Diff: git diff <base>...HEAD (plus working tree). Plan: PLANNING/helix/checkpoints.json.")
Task(subagent_type="helix-reviewer-b", prompt="Checkpoint <CP-ID>. Diff: git diff <base>...HEAD (plus working tree). Plan: PLANNING/helix/checkpoints.json. Reference: <reference.location>. Target: <target.location>.")
```

- `gates.g3_review_a` / `g3_review_b` = `pass` on PASS, `fail` on BLOCK (reason = first blocking finding).
- G3 passes only if **both** pass. Fix every blocking finding from **both** reviews in one pass, then restart at G1.
- If the same finding appears on this and a previous checkpoint → add a `helix-memory.md` entry.
- Never re-prompt a reviewer to "reconsider". A new review = a new, isolated reviewer on the new diff.

## Output

```
═══════════════════════════════════════════
  HELIX GATE — CP-02 Cart drawer opens
═══════════════════════════════════════════
Attempt 1: G1 ✅  G2 ❌ (2 blocking diffs)     → fix → restart
Attempt 2: G1 ✅  G2 ✅  G3a ✅  G3b ❌ (empty state) → fix → restart
Attempt 3: G1 ✅  G2 ✅  G3a ✅  G3b ✅

Status: gates_passed      Attempts: 3/3
Evidence: PLANNING/helix/evidence/CP-02/
Next: G4 human review, then /commit
═══════════════════════════════════════════
```

Finish with:
```bash
node scripts/helix/helix-check.js stop <CP-ID>   # expect gates_passed: true
```

## Flags

- `--no-fix` — report-only: run each gate once, record results, don't modify code.

## Rules

- Never mark a gate `pass` without its evidence file existing.
- Never treat `invalid` as `pass`. Repair the evidence (reference down, wrong viewport, harness crash) and re-run.
- Never skip G2 for a checkpoint with `has_ui: true`.
- Never run G3 before G1 and G2 pass — reviewer tokens are the most expensive in the loop.
