# Boris Context Placement Ladder — Operator Rules for Organized Codebase

This guide ingests the July 2026 AI LABS video **“Claude Code Creator's Greatest Tip For Using AI Agents”** and preserves the part that is most reusable inside Organized Codebase.

The core idea is simple:

> **when Claude gets something wrong, fix the failure at the lightest layer that can solve it reliably.**

Default escalation order:
1. prompt
2. `CLAUDE.md`
3. skill
4. MCP / tool surface

Before adding any of those, ask whether the problem is really a **verification gap** instead of a context gap.

---

## Source packet

### Commentary source
- **AI LABS:** [Claude Code Creator's Greatest Tip For Using AI Agents](https://www.youtube.com/watch?v=pGro_uKt-_M)

### Local ingest artifact
- Transcript: `/tmp/pGro_uKt-_M.transcript.txt`

### Grounding note
This guide is grounded in the AI LABS transcript and cross-checked against existing Organized Codebase Boris docs and command surfaces.

I did **not** verify a primary-source link from the video description during this ingest pass, so this page should be treated as a **repo-fit companion** to the existing Boris source docs, not a replacement for them.

### Companion surfaces already in this repo
- `DOCUMENTATION/BORIS-DELETE-YOUR-CLAUDE-MD-GUIDE.md`
- `DOCUMENTATION/BORIS-ABLATION-EVAL-MATRIX.md`
- `DOCUMENTATION/BORIS-ABLATION-SCORECARD-TEMPLATE.md`
- `.claude/commands/ablate.md`
- `.claude/commands/outcome-prompt.md`
- `.claude/commands/context-ladder.md`
- `DOCUMENTATION/GRAPH-ENGINEERING-ORGANIZED-CODEBASE-FIT.md`

---

## Executive takeaway

Organized Codebase should not treat `CLAUDE.md` as the universal fix for agent mistakes.

Use this routing rule instead:
- **prompt** for one-off clarification
- **`CLAUDE.md`** for short, always-true repo context
- **skill** for longer or occasional reusable workflows
- **MCP/tooling** for information the model cannot access on its own
- **verification surfaces** when the real problem is weak proof, not weak instructions

---

## Decision table

| Symptom | Best home | Why |
|---|---|---|
| This run was unclear | prompt | cheapest one-off fix |
| The repo always needs this short fact | `CLAUDE.md` | load at session start |
| We keep re-explaining a longer procedure | skill | on-demand, reusable, cheaper than global prompt load |
| The info lives outside the repo | MCP / tool | this is an access problem, not a prose problem |
| The agent drifts even with clear instructions | test / screenshot / diff / verifier | the missing piece is proof, not more words |

---

## 1) Prompt first

Use the prompt when:
- the task is one-off
- the failure came from ambiguity in this request
- the missing detail is specific to this run
- the model does not need permanent repo memory to do the work

Examples:
- clarify the outcome
- add a guardrail
- state the exit criteria
- say what artifact proves success

### Rule
If a fix does not need to survive past this task, do **not** promote it yet.

---

## 2) `CLAUDE.md` only for short always-true repo context

Use `CLAUDE.md` when the instruction is:
- short
- always true for this repo
- useful at session start
- not reliably inferable from the codebase alone

Good fits:
- repo purpose
- top-level structure
- a few code conventions
- required verification expectations
- anti-patterns in `DO NOT`

Bad fits:
- long tutorials
- generic best-practice prose
- occasional workflows
- anything Claude can discover by reading the repo

### Rule
If the instruction is expensive, situational, or procedural, it probably does **not** belong in `CLAUDE.md`.

---

## 3) Skills for longer reusable workflows

Use a skill when:
- the same explanation keeps recurring
- the workflow has steps, pitfalls, and verification
- the guidance is longer than `CLAUDE.md` should carry
- the knowledge is useful only for certain task classes

Good fits:
- setup flows
- verification playbooks
- route-specific harness behavior
- task-class guidance that should load only on demand

### Rule
If the content is reusable but not always needed, move it into a skill instead of paying for it every session.

---

## 4) MCP / tool surfaces for access problems

Use MCP or tooling when:
- the needed information lives outside the repo
- the model cannot reach it by normal repo inspection
- the issue is not misunderstanding, but missing access

Good fits:
- dashboards
- incident systems
- private knowledge stores
- external services the workflow depends on

### Rule
Do not write paragraphs to compensate for data the model simply cannot see.

---

## 5) Prefer verification over prompt bloat

Before adding more context, ask:
- would a test catch this better?
- would a screenshot or diff prove it faster?
- would a verifier or review pass localize the failure better?

This is the Boris center of gravity that should stay stable even as models improve.

### Strong verification examples
- lint / typecheck / tests
- build from clean state
- smoke checks
- screenshot comparison
- artifact existence and size checks
- reviewer/verifier passes

### Rule
If the agent keeps failing in a way that should be machine-detectable, add proof before adding prose.

---

## 6) Outcome-first prompting stays the default

This video reinforces a rule that already fits Organized Codebase well:

Prefer:
1. outcome
2. guardrails
3. exit criteria
4. verification surface

Over:
- keystroke choreography
- implementation micromanagement
- long speculative prompt padding

### Repo fit
Use `.claude/commands/outcome-prompt.md` when a request is getting too procedural.

---

## 7) Ablate stale scaffold, not safety rails

The video also reinforces the existing Boris ablation pattern.

Keep by default:
- permissions and safety boundaries
- build/test/lint commands
- static analysis
- evals that still discriminate
- evidence requirements

Question aggressively:
- stale `CLAUDE.md` prose
- old workaround instructions
- skills duplicating model-native behavior
- hooks nobody can justify anymore

### Repo fit
Use `.claude/commands/ablate.md` plus:
- `DOCUMENTATION/BORIS-ABLATION-EVAL-MATRIX.md`
- `DOCUMENTATION/BORIS-ABLATION-SCORECARD-TEMPLATE.md`

### Rule
Delete only what repeated tasks and verification say is safe to delete.

---

## 8) Routines are the maintenance default; dynamic workflows are advanced

The useful Organized Codebase reading is:
- **routines** are for recurring maintenance
- **dynamic workflows / graphs** are for larger multi-surface orchestration

Use routines for:
- dead code cleanup
- stale experiment cleanup
- missing test detection
- duplicate abstraction cleanup

Use graph-like orchestration when:
- the task spans multiple independent surfaces
- review needs to fan out across lenses
- orchestration cost is justified by the scope

### Rule
Do not turn ordinary repo hygiene into a giant workflow when a routine plus verification will do.

---

## What Organized Codebase should keep doing

- keep `CLAUDE.md` lean
- keep verification central
- rewrite over-specified work into outcome-first briefs
- move long repeated guidance into skills
- use MCP/tool integration for access problems
- treat routines as the normal maintenance primitive
- use graph/dynamic workflows selectively, not by default

---

## Fast operator checklist

When Claude gets something wrong:
1. Was this prompt just unclear?
2. If yes, fix the prompt first.
3. Is the missing rule short and always true for this repo?
4. If yes, put it in `CLAUDE.md`.
5. Is it longer or only needed sometimes?
6. If yes, make or update a skill.
7. Is the real issue inaccessible external context?
8. If yes, use or build an MCP/tool surface.
9. Could a test, screenshot, diff, or verifier solve this better than more prose?
10. If yes, strengthen verification instead of adding more context.

---

## Bottom line

The Organized Codebase version of this video is:

> **don’t just minimize context — route it correctly.**

A durable scaffold is one where:
- prompts stay task-specific
- `CLAUDE.md` stays short
- skills carry reusable procedures
- MCPs solve access problems
- verification catches drift
- routines keep the repo healthy without unnecessary orchestration
