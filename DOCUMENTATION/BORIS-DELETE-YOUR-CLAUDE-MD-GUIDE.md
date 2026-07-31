# Delete Your `CLAUDE.md`? — Boris Cherny’s 7 Takeaways for Organized Codebase

This guide ingests the July 2026 Boris Cherny / Y Combinator talk plus the Hyperautomation Labs commentary video that distilled it into seven operator-level takeaways.

The short version: **"delete your `CLAUDE.md`" is not anti-documentation advice.** It is shorthand for **ablate stale prompting, stale hooks, stale skills, and stale harness code every time model capability jumps** — then rebuild only what repeated failures prove you still need.

---

## Source packet

### Primary source
- **Y Combinator:** [Boris Cherny: We Cut 80% of Claude Code’s Prompt](https://www.youtube.com/watch?v=qyPCVqFUyDo)
- **Transcript mirror:** [Root Access transcript](https://www.ycrootaccess.com/p/boris-cherny-building-claude-code)

### Commentary source
- **Hyperautomation Labs:** [Claude Code’s Creator: “Delete Your CLAUDE.md” — 7 Moments That Matter](https://www.youtube.com/watch?v=Egd65CLmb6w)

### Receipts referenced by the commentary video
- [Bun rewrite in Rust](https://bun.com/blog/bun-in-rust)
- [Anthropic acquires Bun](https://www.anthropic.com/news/anthropic-acquires-bun)
- [ARC Prize Anthropic results](https://arcprize.org/results/anthropic)
- [Boris’s TI-83 programming guide](https://www.ticalc.org/programming/concepts/)

---

## Executive takeaway

Treat the Organized Codebase stack as **per-model infrastructure**, not sacred scripture.

What should stay stable the longest:
- verification loops
- permissions and safety boundaries
- static analysis
- evals for as long as they still discriminate
- routines that keep the codebase healthy

What should be aggressively questioned every model generation:
- giant `CLAUDE.md` files
- brittle system prompts
- stale skills and hooks
- tool instructions added to compensate for old-model weaknesses
- harness code that only exists to steer behavior the model now handles natively

---

## The 7 moments that matter

### 1) Delete prompt bloat when the model gets smarter
- **Commentary chapter:** 1:16
- **YC talk:** 03:21 — “Why Claude Code Deleted 80% of Its System Prompt”

Boris says Claude Code deleted over 80% of its system prompt because Opus 5 no longer needed many of the corrective instructions older models required. He also says the team changes tool prompts and harness behavior constantly because each model generation behaves differently.

**Why it matters:**
A lot of prompt mass is really compensation for old-model weakness. Once the model gets stronger, that same prompt becomes drag.

**Organized Codebase implication:**
- Keep `CLAUDE.md` lean.
- Assume every long instruction block must justify its token cost.
- Prefer short guardrails + good verification over encyclopedic prompting.

---

### 2) “Delete your `CLAUDE.md`” really means run ablations, not abandon structure
- **Commentary chapter:** 3:41
- **YC talk:** 06:37–07:20 — “Press Delete on Your AI Product” and “How to Rebuild Your System Prompt”

Boris clarifies that Anthropic does **not** literally delete everything forever. They delete prompts, tools, and harness pieces **as an ablation test**, then add back only what repeated failures prove is necessary. His advice for Claude Code users is to periodically delete `CLAUDE.md`, skills, and hooks to see what the newest model can already do unassisted.

**Why it matters:**
The goal is not less rigor. The goal is less superstition.

**Organized Codebase implication:**
- Treat `CLAUDE.md`, hooks, and skills as **hypotheses**.
- Re-add instructions one behavior at a time.
- Document only the deltas that consistently improve outcomes.

**Practical rule:**
If an instruction exists only because a model from two releases ago needed it, it should be on the chopping block.

---

### 3) Claude Code’s birth story is “product overhang” — unhobble the model
- **Commentary chapter:** 5:10
- **YC talk:** 10:30 — “Product Overhang and ‘Unhobbling’ AI”

Boris frames Claude Code as a response to **product overhang**: the model could already do more than existing products allowed. Old coding tools constrained the model to autocomplete and read-only chat. Claude Code removed enough scaffolding to let the model actually write files and complete larger tasks.

**Why it matters:**
A weak product can make a strong model look mediocre.

**Organized Codebase implication:**
- The job of the scaffold is not to micromanage the model.
- The job is to provide **safe access, verification, and escape criteria**.
- Over-constraining the model can be as harmful as under-specifying the task.

**Design heuristic:**
Build the smallest harness that safely unlocks real capability.

---

### 4) The frontier move is to give the model harder tasks than you think it can do
- **Commentary chapter:** 7:07
- **YC talk:** 14:26 — “Give Claude Harder Problems”

Boris’s canonical example is Bun’s rewrite from Zig to Rust. He describes it as a dynamic workflow backed by a strong test suite, running for 11 days, with steering, until the migration worked in production.

**Why it matters:**
The limiting factor is often not raw model capability — it is whether you gave the model a hard enough task plus a reliable way to check correctness.

**Organized Codebase implication:**
- Aim higher on migrations, refactors, and system-wide cleanup tasks.
- Pair ambitious tasks with crisp verification:
  - tests
  - build checks
  - screenshots / UI diffs
  - static analysis
  - PR-sized milestones when one-shot is too risky

**Rule of thumb:**
Ask for outcomes, not manual keystroke choreography.

---

### 5) The “2-week prompt” is simple: task + guardrails + verification
- **Commentary chapter:** 10:18
- **YC talk:** 21:57 — “The Two-Week Claude Code Prompt”

Boris’s example prompt for a long-running rewrite was strikingly plain: give Claude access to the repo and runner, define the target state, require visual comparison, and tell it not to stop until done. He explicitly says the hard part is **not clever wording** — it is giving the model a way to verify its work and unstick itself.

**Why it matters:**
This is the strongest argument in the talk against prompt cargo culting.

**Organized Codebase implication:**
- Good prompts are often shorter than expected.
- The highest-value prompt components are:
  1. task
  2. guardrails
  3. exit criteria
  4. verification path
- If a workflow fails repeatedly, prefer a skill, tool, MCP, or better test surface over more prose.

**What to avoid:**
- overspecifying implementation order
- telling the model exactly how you would do the work
- stuffing prompts with every past lesson instead of encoding them in tools/tests

---

### 6) Claude should maintain its own codebase
- **Commentary chapter:** 13:06
- **YC talk:** 24:42 — “Running Thousands of AI Agents”

Boris describes dynamic workflows, loops, and routines as ways to orchestrate large numbers of agents. He also says Anthropic already runs recurring maintenance routines against its own codebases: deleting dead code, cleaning up experiments, writing tests, removing useless tests, and unifying duplicate abstractions.

**Why it matters:**
The real leverage is not one heroic prompt. It is recurring automated upkeep.

**Organized Codebase implication:**
The repo should increasingly encode repeatable maintenance patterns such as:
- dead-code cleanup
- stale experiment removal
- test gap detection
- duplicate abstraction detection
- routine docs / templates for recurring upkeep

**Mental model:**
Dynamic workflows handle a hard one-off objective. Routines handle repeated maintenance.

---

### 7) The winning mindset is empirical, practical, and product-first
- **Commentary chapter:** 15:36
- **YC talk:** 30:15 and 32:20

Boris’s final throughline is that the best users are not the people chasing secret prompts. They are the people willing to:
- forget stale priors
- test current model behavior directly
- verify relentlessly
- combine engineering with product judgment
- build things people actually want

His TI-83 story lands the point: he learned programming to solve a practical problem first, then went deeper as the problem demanded it.

**Why it matters:**
Agentic leverage is no longer just a coding skill. It is a systems + product + evaluation skill.

**Organized Codebase implication:**
- The repo should bias toward shipping systems that help builders verify, compare, and iterate.
- Docs should teach decision rules, not just commands.
- “Verification-first” remains the durable center of gravity even as prompts and models change.

---

## What this means for Organized Codebase right now

### Keep
- concise project context
- strong verification commands
- explicit safety / permissions boundaries
- reusable skills where repetition is proven
- workflows that create evidence, not vibes

### Prune aggressively
- bloated `CLAUDE.md` sections
- instructions copied forward without fresh evidence
- hooks nobody can justify anymore
- “best practices” that were really workarounds for older models

### Build next
- an ablation / re-baseline workflow for `CLAUDE.md`, hooks, and skills
- routine templates for self-maintenance tasks
- stronger guidance on outcome-first prompting
- more examples of verification surfaces for long-running agent tasks

---

## Suggested operating checklist

When a new model lands:
1. Back up the current scaffold.
2. Remove non-essential `CLAUDE.md` guidance.
3. Disable optional hooks/skills temporarily.
4. Re-run real project tasks.
5. Record where the model truly fails.
6. Add back only the smallest instruction/tooling delta that fixes repeated failure.
7. Refresh evals once they stop distinguishing quality.

---

## Bottom line

The talk does **not** say documentation is dead.

It says **stale documentation is expensive**.

For Organized Codebase, the durable lesson is:
> keep the scaffold light, keep verification strong, and rebuild assumptions every time model capability steps up.
