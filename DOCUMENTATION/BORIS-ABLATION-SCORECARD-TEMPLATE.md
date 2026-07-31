# Boris Ablation Scorecard Template

Use this template to record **tests + evals** for scaffold pruning.

Goal: prove whether a prompt section, hook, skill, or harness layer should stay, move, or be deleted.

---

## Run metadata

- Date:
- Evaluator:
- Repo / branch:
- Baseline branch:
- Model:
- Harness:
- Scaffold variant:
- Changed layer:
- Why this layer is being tested:

---

## Representative task pack

| Task ID | Task Type | Description | Verification Surface | Result |
|---|---|---|---|---|
| T1 | routine |  |  |  |
| T2 | implementation |  |  |  |
| T3 | refactor/bugfix |  |  |  |
| T4 | long-running or harness-specific |  |  |  |

---

## Checks summary

### Code correctness checks
- Build:
- Lint / typecheck:
- Tests:
- Smoke check:

### Methodology checks
- Completion rate:
- Evidence quality:
- Intervention required:
- Repeated failure modes:
- Did removal increase ambiguity or drift?

---

## Per-task scorecard

| Task | Completed | Tests/Build Passed | Evidence Quality (H/M/L) | Intervention (None/Light/Heavy) | Failure Mode | Notes |
|---|---|---|---|---|---|---|
| T1 |  |  |  |  |  |  |
| T2 |  |  |  |  |  |  |
| T3 |  |  |  |  |  |  |
| T4 |  |  |  |  |  |  |

---

## Cross-route comparison

Use this section when a scaffold layer may behave differently across models or harnesses.

| Route | Model | Harness | Outcome | Keep/Delete/Move |
|---|---|---|---|---|
| baseline |  |  |  |  |
| route-2 |  |  |  |  |
| route-3 |  |  |  |  |

---

## Decision

### Tests protect code
- Did code correctness regress? 
- If yes, what failed?

### Evals protect methodology
- Did agent behavior regress?
- If yes, under which model/harness/task class?

### Final recommendation
Choose one:
- **Delete globally** — no meaningful regressions
- **Keep globally** — clearly improves outcomes broadly
- **Move to companion skill** — only needed for certain harnesses/models
- **Keep temporarily, retest later** — evidence still inconclusive

### Rationale
- 
- 
- 

---

## Optional machine-readable summary

```json
{
  "model": "",
  "harness": "",
  "scaffold_variant": "",
  "changed_layer": "",
  "tasks": [
    {
      "id": "T1",
      "completed": false,
      "verification_surface": [],
      "evidence_quality": "high|medium|low",
      "intervention": "none|light|heavy",
      "failure_mode": ""
    }
  ],
  "decision": "delete-globally|keep-globally|move-to-companion-skill|retest-later"
}
```
