---
name: task-loop
description: |
  Ship a non-trivial repo change through one shared-context build loop with isolated review and
  verification: spec -> build -> independent review -> fix -> verify -> drift check -> final report,
  stopping before merge. Defaults to ONE working window: spec, build, and every fix share context,
  and a fresh window opens only where independence is the point (review, verification) or the user
  opts into a full reviewer swarm. Use when: the user says "task loop", "one window", "minimize
  context windows", "spec then build", "reviewed and verified PR", "elephant goldfish", "egm", or asks
  to implement, build, or fix a non-trivial change and wants it reviewed and proven to work without
  fanning out subagents. Not for read-only review (use review-agent or /review) or
  reference-rebuild work (use helix).
metadata:
  version: 1.1.0
  sources:
    - google/elephant-goldfish-model (Apache-2.0) - elephant/goldfish split, artifact-first, living specs, drift
    - ray-amjad/skills task-lifecycle (MIT) - build -> PR -> review -> fix -> verify -> report loop
    - Anthropic Applied AI, "Building agents: when to fold subagents into your main agent loop" (2026-10-22)
  sibling_of: [boris, helix]
  integrates_with:
    - boris (skill)
    - helix (skill)
    - phased-build (skill)
    - impl-agent (agent)
    - review-agent (agent)
    - test-agent (agent)
    - verify (command)
    - commit (command)
    - stop-verification-evidence (hook)
    - kata (workflow)
triggers:
  - "task loop"
  - "one window"
  - "minimize context windows"
  - "spec then build"
  - "reviewed and verified"
  - "elephant goldfish"
  - "egm"
  - "ship it end to end"
  - "drift check"
  - "test matrix"
---

# Task Loop

Ship a change as a reviewed, verified PR while spending the fewest context windows that still keep
review honest. One window drafts the spec and builds the change. Fresh windows appear only where
independence is the whole point: the reviewer and the verifier. Everything that matters lives in
repo files, so a compacted or new window reloads state in seconds instead of starting over.

> **Boris:** "Always give Claude a way to verify its work."
> **Task loop:** one window builds, other eyes verify, files remember everything.

---

## Where this comes from

| Source | What task-loop takes | What it leaves behind |
|--------|----------------------|------------------------|
| [EGM](https://github.com/google/elephant-goldfish-model) (Google, Apache-2.0) | Elephant/goldfish split: deep-context spec drafting, zero-context review. Artifact-first rule: long output goes to files, not chat. Living specs checked into the repo. Drift checks after implementation. | The default 6-persona review swarm per round. Here the swarm is an explicit opt-in for big design docs. |
| [task-lifecycle](https://github.com/ray-amjad/skills/tree/main/skills/task-lifecycle) (Ray Amjad, MIT) | The loop shape: build -> PR -> review -> fix -> verify -> final report. One builder continued across every fix. Two-round caps. Merge is the user's call. | Orchestrator-plus-fan-out as the default shape. Here the orchestration stays in the builder's window. |
| [Anthropic: when to fold subagents into your main agent loop](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop) (2026-10-22) | Fold specialists into the main loop by default. Split only by what a task must NOT share (context need), never by job title. Subagents earn their window: measurable degradation, truly parallel disposable work, or conflicting instructions. Test matrix of user journeys, reset between flows. | - |
| Organized Codebase native | Boris verification, `/verify`, `/commit`, review-agent, test-agent, impl-agent, stop-verification-evidence hook, kata modes. | - |

---

## Core principles

| # | Principle | In practice |
|---|-----------|-------------|
| 1 | **One builder, one window** | Spec, build, and every fix round happen in the same window. The builder's context is what makes fixes cheap and coherent. |
| 2 | **Fresh eyes only where independence is the point** | The reviewer and the flow verifier never saw the build conversation. The reviewer gets the spec and the diff; each flow driver gets its row's brief. Neither gets the reasoning trail. A builder checking its own work proves nothing. |
| 3 | **Files are the memory** | Spec, implementation notes, review findings, verify evidence, and drift results live in the repo. Window state is reloadable, so "minimize windows" never means "lose the plot". |
| 4 | **Split by context, never by job title** | No persona teams, no ticket fan-out, no parallel coordinators. A second window must justify itself by what it must not know (review) or must do alone (parallel disposable work). |
| 5 | **Two rounds, then stop** | Two caps, and only two: review gets at most two fix rounds, and verify gets at most two. A drift "code wrong" fix re-enters verify, so it spends a verify round. A "doc stale" fix spends nothing. Stop early when clean. Past a cap, report what is unresolved and stop for the human. |
| 6 | **Merge is the user's call** | The loop ends at a final report. Never merge, never deploy, never revert on your own. |

---

## The loop

```
planning/specs/<slug>.md          spec (+ design sections when large or risky)
planning/specs/<slug>.notes.md    decisions, deviations, design approval, open questions
planning/task-loop/<slug>/        review rounds, verify evidence per row, drift.md

Numbers match the Step headings below. FIX is not a step; it is where every
confirmed finding lands, always in the builder window.

+-------------------- WINDOW 1: builder (long-lived) ---------------------+
|  1. SPEC    goal, non-goals, design, journeys, acceptance checks        |
|     GATE    large or risky: user approves the design, line in notes     |
|  2. BUILD   branch, implement, commit as you go, write notes            |
|     FIX     findings from 3, 4 or 5; commit, push                       |
|  5. DRIFT   docs vs code, file:line per claim, classify each mismatch   |
+-------------------------------------------------------------------------+
     | spec + diff only            ^ P1 findings (review cap)
     v                             |
+------------ WINDOW 2: goldfish-reviewer (fresh dispatch) ---------------+
|  3. REVIEW  reads spec + diff, returns PASS / NEEDS-FIXES + findings    |
+-------------------------------------------------------------------------+
     | PASS -> one matrix row per critical user journey
     v
+------ WINDOWS 3..N+3: one driver per row + one reader (fresh) ----------+
|  4. VERIFY  /verify suite; reset, then drive each row; reader judges    |
|             the evidence. Ran wrong -> FIX, re-drive (verify cap)       |
|             No runnable surface: /verify suite only, no matrix          |
+-------------------------------------------------------------------------+
     | verify settled (Step 5 entry gate)
     v
  5. DRIFT    in the builder window. Code wrong -> FIX -> back to 4 for
              the affected rows. Doc stale -> fix the doc. Spec gap ->
              open question.
     |
     v
  6. REPORT   at the final head SHA. Ask "Merge?" Stop.
```


**Path case note:** `planning/` is lowercase on purpose. It matches `kata.yaml`'s
`spec_path: planning/specs` and impl-agent, the two wired runtime readers, so specs land where kata
looks for them on case-sensitive systems. The repo's human-docs directories are uppercase
(`PLANNING/`, where helix keeps its evidence). Don't "fix" either side's case.

---

## The window budget

The decision rules for when one window is enough and when a fresh one earns its cost live in
`references/window-budget.md`. The short version:

- Default: one window does spec, build, and every fix. Compact when long; the files carry state.
- Fresh window only for: review independence, verify independence, measurable degradation, or
  truly parallel disposable work.
- Never: persona teams, ticket fan-out, parallel coordinators, or "reviewing" inside the builder
  window.
- A typical run costs 1 long-lived window, 1 review dispatch per review round, and, when there is a
  runnable surface, N + 1 dispatches per verify round (one driver per matrix row, one reader). The
  formula is in `references/window-budget.md`. The EGM swarm is the deliberate escalation, not the
  default.

---

## Step 0: Size the change

| Size | Examples | Path |
|------|----------|------|
| Small | typo, copy change, one-function bug | Skip the loop. Fix in one window, run `/verify`, `/commit`. |
| Typical | feature, behavior-changing bug fix | Full loop: 1 long-lived builder window + 1 review dispatch. Add the matrix and verify dispatches only when the change has a runnable surface to drive. |
| Large or risky | new subsystem, data migration, public API change | Full loop with the design stage (Step 1), and consider the EGM swarm opt-in below. |

---

## Step 1: Spec (elephant, in the builder window)

Write `planning/specs/<slug>.md` in the same window that will build it. Deep context is an
advantage here: the drafter should know the system's history and conventions.

Required sections: goal, non-goals, design, acceptance checks. Every acceptance check names how it
is verified (a test, a flow, a command). If a check cannot name its verification, it is not a check
yet. Keep the spec in the repo; it is a living document, not chat history (EGM rule).

**Critical user journeys (required when the change has a runnable surface).** List each journey a
user takes through the change, with its entry point (route, click path, or API call). These become
the rows of the test matrix. Also name the command that resets the non-production environment to a
known baseline (a seed script, a fixture load); verify runs it before every row. A journey with no
entry point, or a runnable surface with no reset command, is not ready to build. The goldfish
reviewer checks both.

**Design stage (large or risky changes).** No new sections: the same required sections go deeper,
written before any code.

| Section | For a large or risky change it also carries |
|---------|---------------------------------------------|
| Goal | A concept brief: the problem and why now. |
| Non-goals | Everything explicitly out of scope. This is the scope boundary; there is no separate scope section. |
| Design | The technical approach (interfaces, files touched) and **alternatives considered**, each with its trade-off and why it lost. |
| Critical user journeys | As above. |
| Acceptance checks | An ordered **implementation plan**: each step names the acceptance checks it satisfies. A `phased-planning` plan can fill this section; link it rather than copying it. |

**Design approval gate.** After committing the spec, stop and ask the user to approve the design.
Record the answer as one line in `planning/specs/<slug>.notes.md`:

```
Design approved: <who>, <date>, spec at <commit sha>
```

The build starts only when that line exists. A resumed or compacted window that finds no approval
line asks again; it never builds on an unapproved design. A design change after approval updates the
spec and needs a new approval line. Changes go back through the user, not through the builder alone.

Never paste the spec into chat. Write the file and point at it.

## Step 2: Build (same window)

- New branch. Commit as you go, so a dead run resumes from the branch.
- Follow impl-agent's rules: read files before editing, minimal scope, no gold plating, match
  existing patterns, typecheck after significant edits.
- Where the spec is silent, decide and record the call in `planning/specs/<slug>.notes.md` as you
  work. Read `references/implementation-notes.md`.

## Step 3: Review (goldfish, fresh dispatch)

Read `references/review-round.md`, then:

1. Open the PR, or stage the diff against the base branch.
2. Dispatch the **goldfish-reviewer** agent with exactly two inputs: the spec path and the base
   branch. Do not summarize the build for it. Do not paste your reasoning into its brief.
3. Send confirmed (P1) findings back to the builder window and fix them there. Carry maybes (P2)
   to the final report.
4. Review cap (principle 5). Stop early when the reviewer returns PASS.
5. **Delta review.** If verify or drift later changes behavior (not docs alone), dispatch one more
   goldfish review of the diff since the last reviewed SHA before the report. It spends a review
   round. Docs-only fixes after review are listed in the report instead.

One dispatch is the design, not a starting bid: behavior changes earn exactly one independent
review because independence is what it buys. If a change is small enough that an honest self-check
plus `/verify` suffices, Step 0 already routed it out of the loop - do not run review as ceremony.

A review run inside the builder window is not a goldfish review; it inherits every blind spot the
build created. If the harness cannot dispatch a fresh agent, say so and stop rather than
self-reviewing and calling it independent.

**Swarm opt-in (large or risky design docs only):** the full EGM pipeline reviews a spec with six
isolated personas (zoom out, comprehension, design critic, implementation readiness, structural,
style) and a synthesizer. That costs six or more fresh windows per round, which is exactly what
this skill avoids by default. When the design justifies it, install EGM and run it on purpose:

```bash
claude plugin marketplace add google/elephant-goldfish-model && claude plugin install egm@egm
```

## Step 4: Verify (fresh dispatch per matrix row)

Read `references/test-matrix.md` and `references/verify-round.md`, then:

- Always run the `/verify` suite (lint, typecheck, tests, build). It is the floor, not the proof.
- If the change has a runnable surface, build the test matrix from the spec's critical user
  journeys. One fresh driver per row resets the environment to baseline, then drives the row the
  way a user would. Rows run in parallel only when they share no state, as `references/test-matrix.md`
  defines it.
- One fresh reader per verify round judges every row's evidence file. It did not drive any row.
  Route on its verdict, never on a driver's claim.
- A row that ran wrong goes to FIX in the builder window, then that row is re-driven after a reset.
  That spends a verify round (principle 5).
- If the change has no runnable surface (docs, CI config, types, pure refactor), say so plainly.
  There is no matrix; the `/verify` suite is the whole of verify, and drift runs next.
- Write evidence to `planning/task-loop/<slug>/verify/`, one file per row. These files follow the
  stop-verification-evidence hook's contract (evidence over narrative). That hook ships as a spec
  in `.claude/hooks/` and becomes an active gate only once wired into settings.json; until then
  the evidence is a convention this loop keeps, not an enforced check.

## Step 5: Drift check (docs against code)

**Entry gate.** This is the one definition; `references/verify-round.md` and
`references/drift-check.md` point here. Drift starts when verify is settled:

1. The `/verify` suite passes, and
2. no matrix row is left at "ran wrong" with verify rounds still unspent.

Rows reported as couldn't boot or unreachable do not block drift; they reach the report as
unverified. A change with no runnable surface still runs drift, because docs-only changes are the
ones most likely to drift. If the verify cap is spent with a row still wrong, skip drift and report.

Read `references/drift-check.md`, then run it in the builder window on the change's scope:

- List the documented claims in scope, check each against the code with `file:line` evidence, and
  classify each mismatch:
  - **Code wrong:** go to FIX, then back to Step 4 for the affected rows (reset, re-drive, re-judge)
    and the `/verify` suite. That spends a verify round. Then re-run drift on what the fix touched.
  - **Doc stale:** fix the doc in this PR and re-run the `/verify` suite. No verify round is spent.
  - **Spec gap:** carry it to the report as an open question.
- Write `planning/task-loop/<slug>/drift.md`.
- Drift stays at the change's scope unless the user opts into a wider check. On a large or risky
  change, run it as a fresh dispatch (spec, diff, and in-scope docs) instead of in the builder
  window.

## Step 6: Final report, then stop

```
== TASK LOOP REPORT ==
PR: <link>  (branch: <name>, N commits)
Built: <one paragraph>
Head: <final head SHA; every line below describes this SHA>
Review: <rounds run, last reviewed SHA, what was found, fixed, carried as P2; commits after the
        last reviewed SHA and whether each was delta-reviewed or docs-only>
Verified: <one line per matrix row with its verdict at the head SHA, or "no runnable surface:
          /verify suite only">
Drift: <claims checked, mismatches, how each was classified and resolved>
Open questions: <from the notes file, each with a recommended answer>
Next: Merge PR #n?
```

Ask, then stop. Merging, deploying, and reverting are the user's call.

---

## Organized Codebase integration

| Piece | How task-loop uses it |
|-------|------------------------|
| boris | Verification over prompt bloat: evidence files beat claims. Verify evidence follows the stop-verification-evidence hook's contract; that hook ships as a spec and is enforced only when wired into settings.json. |
| helix | Use helix instead when a running reference exists (the reference is the spec). Use task-loop when the spec must be written, not pointed at. |
| phased-build / phased-planning | A phase plan can feed the spec; the loop then owns review and verification. |
| impl-agent / test-agent | Dispatchable helpers for isolated pieces. They assist the builder window; they do not replace its ownership of the change. |
| review-agent | General second opinion, still available: full-context, reads anything, backs `/review`. goldfish-reviewer exists for the one job review-agent cannot do: reviewing without the context, because independence is the point. |
| kata | Lines up with kata's implementation mode (stop conditions: tasks complete, committed, pushed, tests pass). Run `npx kata status` to check an active session. |
| `/commit`, `/verify` | The loop's commit and automated-check floor. |

## Other CLIs

This skill is Claude-shaped like the rest of `.claude/`. For Codex, OpenCode, and Pi, read
`references/other-clis.md`: the rules render into an AGENTS.md, review runs through each harness's
own reviewer, and gates that hooks enforce here must live outside the agent there.

## Rules

- Keep the builder window alive across fix rounds. Fixes are cheap because the builder remembers.
- Give reviewers the spec and the diff, never the build transcript.
- Write long output to files and point at the path. No chat dumps.
- Fix-round caps are principle 5's. Past a cap, report and stop.
- Reset the environment before every matrix row: reseed for sequential rows, a separate sandbox
  per row when rows run in parallel. No row inherits another row's state.
- The report describes the final head SHA. Evidence from an earlier SHA is not verification.
- Never merge, deploy, or revert on your own.
- Never spawn a swarm by default. One goldfish reviewer; more only on explicit opt-in.
- Never self-review and call it independent.

## When NOT to use this skill

- Read-only review of someone else's PR: use review-agent or `/review`.
- Rebuilding something with a running reference: use helix.
- Open exploration with no change to ship: kata research mode.
- A fix you can hold in your head: fix it, `/verify`, `/commit`.

## Attribution

Adapted for Organized Codebase from [EGM](https://github.com/google/elephant-goldfish-model)
(Apache-2.0) and Ray Amjad's [task-lifecycle](https://github.com/ray-amjad/skills) (MIT), shaped by
[Anthropic's fold-in guidance](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop)
and the Organized Codebase constraint: minimize context windows. Text here is original to this
repo; the links are the sources.
