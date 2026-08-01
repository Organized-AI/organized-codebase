# Boris Context Placement Ladder — Where Instructions Belong in Organized Codebase

This guide ingests the July 2026 AI LABS video **“Claude Code Creator's Greatest Tip For Using AI Agents”** and extracts the part that is most useful for Organized Codebase.

The short version: **most context bugs are placement bugs.**

When Claude gets something wrong, do not reflexively stuff more text into `CLAUDE.md`. Start with the **cheapest layer that can reliably fix the failure** and escalate only when needed:

1. prompt
2. `CLAUDE.md`
3. skill
4. MCP / tool surface

Pair that ladder with **outcome-first prompting** and **verification-first routines**, and you get a cleaner default operating model for Organized Codebase.

---

## Source packet

### Commentary source
- **AI LABS:** [Claude Code Creator's Greatest Tip For Using AI Agents](https://www.youtube.com/watch?v=pGro_uKt-_M)

### Local ingest artifact
- Transcript: `/tmp/pGro_uKt-_M.transcript.txt`

### Grounding note
This pass is grounded in the AI LABS transcript above and cross-checked against existing Organized Codebase Boris docs and command surfaces.

I did **not** verify a primary-source link from the video description during this ingest pass, so this document should be treated as a **repo-fit companion** to the existing Boris source docs rather than as a replacement for them.

### Best companion docs already in this repo
- `DOCUMENTATION/BORIS-DELETE-YOUR-CLAUDE-MD-GUIDE.md`
- `DOCUMENTATION/BORIS-ABLATION-EVAL-MATRIX.md`
- `DOCUMENTATION/BORIS-ABLATION-SCORECARD-TEMPLATE.md`
- `.claude/commands/ablate.md`
- `.claude/commands/outcome-prompt.md`
- `DOCUMENTATION/GRAPH-ENGINEERING-ORGANIZED-CODEBASE-FIT.md`

---

## Executive takeaway

The most durable idea in this video is **not** “delete everything.”
It is:

> **put each instruction in the lightest layer that earns its keep, and prefer verification over prose whenever possible.**

That means:
- one-off clarification belongs in the prompt,
- short always-true repo context belongs in `CLAUDE.md`,
- longer or occasional guidance belongs in a skill,
- inaccessible external context belongs behind an MCP or tool,
- and recurring cleanup belongs in routines with verification, not in giant permanent prompt blobs.

---

## 1) Ablate first, then rebuild with evidence

The video repeats Boris’s core pattern: when a new model generation lands, remove stale scaffolding and see what the model can now do unassisted.

That does **not** mean deleting safety rails.

Keep by default:
- permissions and safety boundaries
- build / test / lint commands
- static analysis
- evals that still discriminate
- evidence requirements

Question aggressively:
- stale `CLAUDE.md` prose
- workaround instructions added for older models
- skills that duplicate model-native behavior
- hooks or helpers nobody can justify anymore

### Organized Codebase fit
This repo already has the right home for that workflow:
- use **`/ablate`** to re-baseline `CLAUDE.md`, hooks, and skills
- use the **ablation eval matrix + scorecard** to decide what actually stays deleted

The important operating rule is simple:

> if a layer is not repeatedly needed and cannot beat a tool/test-based alternative, it is a deletion candidate.

---

## 2) Prompt for outcomes, not keystroke choreography

The video strongly reinforces an Organized Codebase default that is already emerging elsewhere in the repo:

- say **what must be true** when the task is done
- define guardrails
- define exit criteria
- define verification
- avoid prescribing every intermediate step unless the sequence itself is the critical constraint

Why this matters:
- step-by-step micromanagement caps the model at your own first idea
- stronger models often do better when told the target state plus constraints
- long prompts are often compensating for missing verification, not missing intelligence

### Organized Codebase fit
This maps directly to **`.claude/commands/outcome-prompt.md`**.

The durable pattern is:
1. outcome
2. guardrails
3. exit criteria
4. verification surface

If a prompt keeps growing, that is usually a sign to move information to a better layer rather than to keep adding prose.

---

## 3) The placement ladder: prompt → `CLAUDE.md` → skill → MCP

This is the clearest net-new operator rule in the video.

When Claude fails, diagnose the failure by asking **what kind of missing context this actually is**.

### Level 1 — Fix the prompt
Use the prompt when:
- the instruction was unclear
- the task is one-off
- the missing detail is specific to this run
- no persistent repo memory is needed

This is the cheapest fix and should be the default first move.

### Level 2 — Put it in `CLAUDE.md`
Use `CLAUDE.md` when the instruction is:
- short
- always true for this repo
- needed at session start
- hard for the model to infer reliably from the codebase alone

Good examples:
- repo purpose
- top-level structure
- a few key conventions
- anti-patterns in the `DO NOT` section
- required verification expectations

Bad examples:
- long generic best-practice essays
- information Claude can infer by reading the repo
- occasional procedures that only matter for special tasks

### Level 3 — Make it a skill
Use a skill when:
- the instruction is longer
- it is only needed sometimes
- you are repeating the same explanation over and over
- the workflow has steps, pitfalls, and verification that deserve a reusable package

This is the right place for:
- route-specific workflows
- complex setup or verification procedures
- task-class guidance that should load on demand instead of every session

### Level 4 — Build or use an MCP / tool surface
Use an MCP or other tool integration when:
- the needed information lives outside the repo
- the model cannot reliably access it on its own
- the bottleneck is **missing access**, not weak instructions

Examples:
- external systems
- dashboards
- incident data
- private knowledge stores
- structured services the model must query directly

### Organized Codebase fit
This ladder clarifies how existing repo surfaces should relate:
- **prompt** = task-specific request
- **`CLAUDE.md`** = short always-true repo context
- **skills** = on-demand reusable workflows
- **MCP/tooling** = access to otherwise unreachable systems

That is cleaner than treating `CLAUDE.md` as the universal dumping ground.

---

## 4) Prefer routines for recurring maintenance; treat dynamic workflows as an advanced tool

The video draws a sharp line between:
- **dynamic workflows** for very large fan-out jobs
- **routines** for recurring maintenance work

The practical warning is useful:
- giant multi-agent workflows can be expensive
- they are harder to debug when something goes wrong
- they should not become the default answer to everyday upkeep

For day-to-day operation, the video recommends routine maintenance tasks such as:
- dead code cleanup
- stale experiment cleanup
- missing test detection
- duplicate abstraction cleanup

### Organized Codebase fit
That maps well to the repo’s current direction:
- use graph/dynamic workflows selectively for complex multi-surface work
- use recurring routines for repo hygiene
- keep verification attached to both

This complements rather than replaces:
- `DOCUMENTATION/GRAPH-ENGINEERING-ORGANIZED-CODEBASE-FIT.md`
- `DOCUMENTATION/GRAPH-ENGINEERING-VERIFICATION-PLAYBOOK.md`

A good default interpretation for Organized Codebase is:

> **graphs are an advanced orchestration primitive; routines are the everyday maintenance primitive.**

---

## 5) What this means for Organized Codebase right now

### Keep doing
- keep `CLAUDE.md` lean
- keep verification central
- rewrite over-specified tasks into outcome-first briefs
- move long repeated guidance into skills
- use tool/MCP integration for access problems instead of prompt bloat

### Clarify in docs and examples
- `CLAUDE.md` is for short always-true repo context
- skills are for longer on-demand workflows
- MCPs are for inaccessible external context
- routines are the default recurring maintenance layer
- graph workflows are powerful but should stay selective

### Strong fit inside the current repo
This video fits best as a **companion to the existing Boris docs**, not as a replacement for them.

Why:
- the ablation idea is already covered well
- eval discipline already has a matrix + scorecard
- graph adoption already has a fit guide
- the missing connective tissue was the **context placement ladder**

That is the part worth preserving.

---

## Suggested operating checklist

When Claude gets something wrong:
1. Ask whether the prompt was simply unclear.
2. If yes, fix the prompt first.
3. If the instruction is short and always true, move it to `CLAUDE.md`.
4. If it is longer or only needed sometimes, move it to a skill.
5. If the issue is missing access to external information, add or use an MCP/tool surface.
6. If the guidance still feels large, ask whether a verification surface would solve the problem better than more prose.
7. Re-run the task and keep only what repeatedly improves outcomes.

---

## Bottom line

The best Organized Codebase reading of this video is:

> **don’t just minimize context — place it correctly.**

A lean repo scaffold is only durable when:
- prompts stay outcome-first,
- `CLAUDE.md` stays short,
- skills carry the heavy reusable procedures,
- MCPs solve access problems,
- and routines keep the codebase healthy without turning every task into a giant workflow.
