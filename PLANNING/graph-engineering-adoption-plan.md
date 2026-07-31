# Graph Engineering Adoption Plan

> **For Hermes:** Use this as the implementation plan for adding a minimal graph-engineering layer to Organized Codebase.

**Goal:** Add a practical, verification-first graph-engineering layer to Organized Codebase so teams can use parallel subagent workflows where they actually outperform a single linear loop.

**Architecture:** Keep the first release narrow. Ship one explanatory doc, one fit/use-case doc, one reusable graph workflow template, and one review-graph command/agent pair. Do **not** make graph orchestration the default for every task; position it as an advanced workflow for complex, multi-surface work.

**Tech Stack:** Markdown documentation, Claude command docs in `.claude/commands/`, Claude agent docs in `.claude/agents/`, existing Boris verification philosophy.

---

## Why this belongs in Organized Codebase

Organized Codebase already has the right primitives for graph engineering:
- task decomposition,
- subagents,
- commands,
- verification surfaces,
- architecture docs,
- and Boris-style review discipline.

What it is missing is a **clear operating policy** for when to fan work out, how to route review, and how to consolidate findings without creating opaque agent sprawl.

---

## Scope for v1

### In scope
1. A grounded explainer connecting the source video to Organized Codebase.
2. A repo-facing guide on where graph engineering fits and where it does not.
3. A reusable planning/spec template for graph workflows.
4. A `/review-graph` command for multi-angle review.
5. A `review-graph-orchestrator` agent definition that consolidates findings.

### Out of scope
- runtime automation that truly spawns background review workers
- automatic graph execution for all repo commands
- replacing existing `/verify` or `/review`
- adding model-specific hard requirements to the repo

---

## Implementation Tasks

### Task 1: Preserve the grounded source doc
**Objective:** Keep the transcript-grounded graph-engineering playbook in repo docs.

**Files:**
- Verify: `DOCUMENTATION/GRAPH-ENGINEERING-VERIFICATION-PLAYBOOK.md`
- Update: `README.md`

**Done when:**
- the source-derived playbook exists in `DOCUMENTATION/`
- the README resources section links to it

### Task 2: Add a practical fit guide
**Objective:** Document concrete use cases, anti-use-cases, and rollout advice.

**Files:**
- Create: `DOCUMENTATION/GRAPH-ENGINEERING-ORGANIZED-CODEBASE-FIT.md`
- Update: `README.md`

**Done when:**
- maintainers can tell when graph workflows are worth the overhead
- the doc recommends a narrow, high-signal v1

### Task 3: Add a reusable graph workflow template
**Objective:** Give planners a standard shape for node/edge/judge/barrier design.

**Files:**
- Create: `PLANNING/spec-templates/graph-workflow.md`

**Done when:**
- a fresh agent can define nodes, edges, verification, barrier points, and failure handling without inventing structure from scratch

### Task 4: Add a review-graph command
**Objective:** Add a command-level entrypoint for review fan-out.

**Files:**
- Create: `.claude/commands/review-graph.md`

**Done when:**
- the command clearly explains when to use graph review
- it routes work into specialized review lenses instead of one vague mega-review

### Task 5: Add a review-graph orchestrator agent
**Objective:** Define an orchestrator agent that consolidates multi-angle review.

**Files:**
- Create: `.claude/agents/review-graph-orchestrator.md`

**Done when:**
- the agent is explicit about inputs, review lenses, severity ranking, and final consolidation
- it does not mutate code directly

### Task 6: Verify and integrate
**Objective:** Make the new layer discoverable and verify file integrity.

**Files:**
- Update: `README.md`
- Verify: new docs and `.claude` files

**Verification commands:**
```bash
git diff --check
python3 - <<'PY'
from pathlib import Path
files = [
    Path('DOCUMENTATION/GRAPH-ENGINEERING-VERIFICATION-PLAYBOOK.md'),
    Path('DOCUMENTATION/GRAPH-ENGINEERING-ORGANIZED-CODEBASE-FIT.md'),
    Path('PLANNING/spec-templates/graph-workflow.md'),
    Path('.claude/commands/review-graph.md'),
    Path('.claude/agents/review-graph-orchestrator.md'),
]
for path in files:
    assert path.exists(), f'missing {path}'
print('file-existence: ok')
PY
npm test
```

**Expected verification note:**
- `git diff --check` should pass
- file existence check should pass
- `npm test` may still be blocked by the repo's existing `agent-booster` dependency issue; if so, report it transparently rather than widening scope into dependency repair

---

## Recommended v1 operator policy

Use graph workflows for:
- PR review orchestration
- features that span frontend/backend/tests/docs independently
- large refactors and migrations
- UI work that benefits from parallel visual + functional review
- maintenance routines with multiple review angles

Do **not** use graph workflows for:
- tiny edits
- one-file fixes
- tasks with weak verification surfaces
- anything where orchestration cost exceeds execution cost

---

## Success criteria

- The repo contains a grounded explanation of graph engineering.
- The repo contains an opinionated fit guide for maintainers.
- The repo contains a reusable graph workflow template.
- The repo exposes a `review-graph` command and orchestrator definition.
- The README points maintainers to the new materials.
- Verification is honest about any pre-existing blockers.
