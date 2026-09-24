# Helix Feedback Memory

The Helix loop's learning surface. **Read every `active` entry at the start of each checkpoint**
(planner, test-agent, implementer, and both reviewers). Keep entries short: one rule, one reason,
where it came from.

## When to write an entry

| Source | Trigger |
|--------|---------|
| G4 human rejection | Always — one entry per distinct reason |
| G3 reviewers | Same finding on ≥ 2 checkpoints |
| G2 visual | Same kind of blocking diff on ≥ 2 checkpoints |
| Convergence budget exhausted (`blocked`) | Always — what kept failing and why |
| G1 | A test was wrong against the reference in a way likely to recur |

## Entry format

```markdown
### HM-NNN <short rule, imperative>
- **Status:** active | promoted | retired
- **Source:** G4 CP-07 · G3b CP-09, CP-11
- **Why:** <one sentence — what went wrong>
- **Rule:** <what to do instead; concrete enough to check>
- **Prevented:** CP-12, CP-14            ← checkpoints where this entry was applied and the failure did NOT recur
- **Promotion:** — | candidate | CLAUDE.md (commit abc1234) | skill: <name>
```

## Lifecycle → promotion path

```
new finding ──► active ──(prevented on ≥ 3 checkpoints)──► candidate ──/ablate──► promoted | stays active | retired
```

1. **active** — lives here, read by every Helix role on every checkpoint. Cheap to add, local to this loop.
2. **candidate** — `Prevented` lists ≥ 3 checkpoints. It's earned a look at a wider audience.
3. **`/ablate` decides** (see `.claude/commands/ablate.md` → "Decision rules"). Promote only if it is
   repeatedly needed, short, and not better solved by tooling. Pick the smallest home:
   - a **test / lint rule / helix-check rule** if it can be checked mechanically (preferred)
   - a **reviewer checklist line** in `helix-reviewer-a.md` / `helix-reviewer-b.md` if it's Helix-specific
   - one line in **`CLAUDE.md` → `## DO NOT`** if it applies to all work in the repo, not just Helix
4. **promoted** — note the commit where it landed; keep the entry (for history) but stop reading it
   into context. **retired** — the ablation showed it no longer helps (new model, refactor made it moot).

Run the promotion review at the end of each `/helix-next N` batch and at every model upgrade.

---

## Entries

<!-- Newest first. Example (delete once real entries exist): -->

### HM-001 Seed empty states in G1 fixtures
- **Status:** active
- **Source:** G3b CP-02 (example)
- **Why:** Reference shows an empty-cart message; target rendered a blank drawer and no test covered it.
- **Rule:** For every list/collection in scope, add a G1 test for the zero-items state as seen on the reference.
- **Prevented:** —
- **Promotion:** —
