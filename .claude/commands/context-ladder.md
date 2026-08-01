---
description: Route a recurring agent failure to the right layer: prompt, CLAUDE.md, skill, MCP/tool, or verification surface
---

# /context-ladder

Use this when Claude gets something wrong and you need to decide **where the fix belongs**.

Do **not** default to adding more text to `CLAUDE.md`.

## Goal

Choose the **lightest layer** that can reliably fix the failure:
1. prompt
2. `CLAUDE.md`
3. skill
4. MCP / tool surface

Before promoting anything, check whether the problem is actually a **verification gap** instead of a context gap.

## Routing rules

### 1) Prompt
Choose this when:
- the issue is specific to the current task
- the instruction was unclear
- no permanent repo memory is needed

### 2) `CLAUDE.md`
Choose this when the rule is:
- short
- always true for the repo
- useful at session start
- not obvious from repo inspection alone

### 3) Skill
Choose this when:
- the guidance is longer
- it is only needed sometimes
- the same explanation keeps recurring
- the workflow has steps, pitfalls, or verification worth packaging

### 4) MCP / tool surface
Choose this when:
- the needed information lives outside the repo
- the model cannot access it reliably on its own
- the issue is missing access, not weak wording

### 5) Verification surface
Prefer this over extra prose when:
- a test would catch the issue
- a screenshot or diff would prove correctness faster
- a verifier/reviewer can localize the failure better than more instruction text

## Anti-patterns

- Do **not** put long tutorials into `CLAUDE.md`.
- Do **not** make a skill for a one-off clarification.
- Do **not** write prompt prose to compensate for data the model cannot see.
- Do **not** keep adding instructions when the real need is a test, diff, or screenshot check.

## Output format

Return:

```md
## Diagnosis
- failure type:
- repeated or one-off:
- access gap or context gap:

## Recommended layer
- prompt | `CLAUDE.md` | skill | MCP/tool | verification surface

## Minimal change
- the smallest fix that should be tried first

## Why not a lower layer
- why the cheaper layer is insufficient

## Verification
- what evidence will show the fix worked
```

## Escalation rule

Start as low as possible.
Promote upward only when the lower layer fails repeatedly.

## Companion docs

- `DOCUMENTATION/BORIS-CONTEXT-PLACEMENT-LADDER.md`
- `.claude/commands/outcome-prompt.md`
- `.claude/commands/ablate.md`
