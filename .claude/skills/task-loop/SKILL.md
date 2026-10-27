---
name: task-loop
description: |
  Ship a non-trivial repo change through one shared-context build loop with isolated review and
  verification: spec -> build -> independent review -> fix -> verify -> final report, stopping
  before merge. Defaults to ONE working window: spec, build, and every fix share context, and a
  fresh window opens only where independence is the point (review, verification) or the user opts
  into a full reviewer swarm. Use when: the user says "task loop", "one window", "minimize context
  windows", "spec then build", "reviewed and verified PR", "elephant goldfish", "egm", or asks to
  implement, build, or fix a non-trivial change and wants it reviewed and proven to work without
  fanning out subagents. Not for read-only review (use review-agent or /review) or
  reference-rebuild work (use helix).
metadata:
  version: 1.0.0
  sources:
    - google/elephant-goldfish-model (Apache-2.0) - elephant/goldfish split, artifact-first, living specs
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
| [EGM](https://github.com/google/elephant-goldfish-model) (Google, Apache-2.0) | Elephant/goldfish split: deep-context spec drafting, zero-context review. Artifact-first rule: long output goes to files, not chat. Living specs checked into the repo. | The default 6-persona review swarm per round. Here the swarm is an explicit opt-in for big design docs. |
| [task-lifecycle](https://github.com/ray-amjad/skills/tree/main/skills/task-lifecycle) (Ray Amjad, MIT) | The loop shape: build -> PR -> review -> fix -> verify -> final report. One builder continued across every fix. Two-round caps. Merge is the user's call. | Orchestrator-plus-fan-out as the default shape. Here the orchestration stays in the builder's window. |
| [Anthropic: when to fold subagents into your main agent loop](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop) (2026-10-22) | Fold specialists into the main loop by default. Split only by what a task must NOT share (context need), never by job title. Subagents earn their window: measurable degradation, truly parallel disposable work, or conflicting instructions. | - |
| Organized Codebase native | Boris verification, `/verify`, `/commit`, review-agent, test-agent, impl-agent, stop-verification-evidence hook, kata modes. | - |

---

## Core principles

| # | Principle | In practice |
|---|-----------|-------------|
| 1 | **One builder, one window** | Spec, build, and every fix round happen in the same window. The builder's context is what makes fixes cheap and coherent. |
| 2 | **Fresh eyes only where independence is the point** | The reviewer and the flow verifier never saw the build conversation. They get the spec and the diff, not the reasoning trail. A builder checking its own work proves nothing. |
| 3 | **Files are the memory** | Spec, implementation notes, review findings, and verify evidence live in the repo. Window state is reloadable, so "minimize windows" never means "lose the plot". |
| 4 | **Split by context, never by job title** | No persona teams, no ticket fan-out, no parallel coordinators. A second window must justify itself by what it must not know (review) or must do alone (parallel disposable work). |
| 5 | **Two rounds, then stop** | Review and verify each cap at two fix rounds, stopping early when clean. Past the cap, report what is unresolved and stop for the human. |
| 6 | **Merge is the user's call** | The loop ends at a final report. Never merge, never deploy, never revert on your own. |

---

## The loop

```
planning/specs/<slug>.md          spec, written by the builder window
planning/specs/<slug>.notes.md    decisions, deviations, tradeoffs, open questions
planning/task-loop/<slug>/        review rounds and verify evidence

+--------------------------- WINDOW 1: builder (long-lived) ----------------+
|  1. SPEC    draft the spec, artifact-first, no chat dumps                |
|  2. BUILD   branch, implement, commit as you go, write notes             |
|  4. FIX     apply confirmed findings, commit, push  (max 2 rounds)       |
+----------------------------------------------------------------------------+
             | spec + diff only                    ^ confirmed findings
             v                                    |
+-------- WINDOW 2: goldfish-reviewer (fresh dispatch) ---------------------+
|  3. REVIEW  reads spec + diff, returns PASS / NEEDS-FIXES + findings     |
+----------------------------------------------------------------------------+
             | changed flows
             v
+-------- WINDOW 3: flow verifier (fresh dispatch) -------------------------+
|  5. VERIFY  drives each changed flow the way a user would; a separate    |
|             reader judges the evidence. No runnable surface: /verify     |
+----------------------------------------------------------------------------+
6. REPORT  PR link, what review found, what was fixed, one line per verified
           flow, open questions with recommended answers. Ask "Merge?" Stop.
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
- A typical run costs 1 long-lived window plus 2 stateless dispatches. The EGM swarm is the
  deliberate escalation, not the default.

---

## Step 0: Size the change

| Size | Examples | Path |
|------|----------|------|
| Small | typo, copy change, one-function bug | Skip the loop. Fix in one window, run `/verify`, `/commit`. |
| Typical | feature, behavior-changing bug fix | Full loop: 1 long-lived builder window + 1 review dispatch. Add a verify dispatch only when the change has a runnable surface to drive. |
| Large or risky | new subsystem, data migration, public API change | Full loop, and consider the EGM swarm opt-in below. |

---

## Step 1: Spec (elephant, in the builder window)

Write `planning/specs/<slug>.md` in the same window that will build it. Deep context is an
advantage here: the drafter should know the system's history and conventions.

Required sections: goal, non-goals, design, acceptance checks. Every acceptance check names how it
is verified (a test, a flow, a command). If a check cannot name its verification, it is not a check
yet. Keep the spec in the repo; it is a living document, not chat history (EGM rule).

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
4. Max two rounds. Stop early when the reviewer returns PASS.

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

## Step 4: Verify (fresh dispatch for runnable surfaces)

Read `references/verify-round.md`, then:

- Always run the `/verify` suite (lint, typecheck, tests, build). It is the floor, not the proof.
- If the change has a runnable surface, a fresh agent drives each changed flow the way a user
  would, and a separate reader judges the evidence. Route on evidence, never on the driver's claim.
- If the change has no runnable surface (docs, CI config, types, pure refactor), say so plainly
  and stop at `/verify`.
- Write evidence to `planning/task-loop/<slug>/verify/`. These files satisfy the
  stop-verification-evidence hook.

## Step 5: Final report, then stop

```
== TASK LOOP REPORT ==
PR: <link>  (branch: <name>, N commits)
Built: <one paragraph>
Review: <rounds run, what was found, what was fixed, what was carried as P2>
Verified: <one line per flow, or "no runnable surface: /verify suite only">
Open questions: <from the notes file, each with a recommended answer>
Next: Merge PR #n?
```

Ask, then stop. Merging, deploying, and reverting are the user's call.

---

## Organized Codebase integration

| Piece | How task-loop uses it |
|-------|------------------------|
| boris | Verification over prompt bloat: evidence files beat claims. The stop-verification-evidence hook is satisfied by the verify evidence, not by narrative. |
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
- Two rounds per stage, then report and stop.
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
