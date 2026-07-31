---
description: Run a multi-angle review graph for complex changes that need more than one generic review pass
---

# /review-graph

Use this command when the current work is too important, too broad, or too multi-surface for a single linear review.

Good fits:
- PRs that span frontend/backend/tests/docs
- refactors or migrations
- UI work that needs visual + functional review
- template / skill / command changes that need multiple review angles

Do **not** use this for tiny changes, typo fixes, or one-file edits with an obvious review path.

## Goal

Turn one vague review request into a **review graph**:
- split review into specialized lenses,
- force the important checks to complete,
- and consolidate everything into one fix-ready report.

## Review Graph Procedure

### 1. Gather review inputs
Read:
- the diff against the base branch
- the spec or task brief if one exists
- any verification output already produced

Minimum commands:
```bash
git status
git diff main...HEAD
```

### 2. Choose review lenses
Pick 3-5 lenses based on the change. Common defaults:
- **Correctness** — does the implementation actually solve the task?
- **Verification** — are tests/build/verification surfaces strong enough?
- **Architecture** — does this follow repo patterns and keep the design clean?
- **Docs / UX / Design** — if the change affects docs, prompts, or interface behavior
- **Simplification** — is there unnecessary complexity or stale scaffolding?

Avoid building one mega-review that tries to score everything at once.

### 3. Route the judge correctly
Cheap models may help with build work, but the **judge nodes should be stronger than the builder whenever the work matters**.

If a weak judge would create fake rework, escalate the judge.

### 4. Use fresh-context review where helpful
When the builder's own context is likely to bias the review, request a fresh-context second opinion.

This is especially useful for:
- large refactors
- contentious design decisions
- code that "looks fine" but may encode the wrong assumptions

### 5. Barrier before verdict
Do not declare the review complete until the required lenses have all reported back.

At minimum, wait for:
- correctness
- verification
- architecture

### 6. Consolidate into one report
Return one report with:
- critical blockers
- important issues
- optional improvements
- final verdict

## Output Format

```md
## Review Graph Report

### Lenses Run
- Correctness
- Verification
- Architecture
- {Additional lens if used}

### Critical
- {must-fix issue}

### Important
- {should-fix issue}

### Minor
- {optional improvement}

### Final Verdict
- APPROVE / REQUEST CHANGES / NEEDS DISCUSSION

### Why
- {1-3 sentence explanation}
```

## Operator Rules

- Prefer a small number of sharp review lenses over one blurry review.
- Do not hide disagreement between lenses — surface it.
- If tests are already broken for pre-existing reasons, say so exactly.
- If one lens finds issues but another lens disproves them, explain the conflict rather than averaging them away.
