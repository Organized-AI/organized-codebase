---
description: Rewrite an over-specified request into an outcome-first Claude task with guardrails and verification
---

# /outcome-prompt

Translate a vague or over-engineered request into an **outcome-first task brief**.

Use this when:
- the prompt is too step-by-step
- the model is being micromanaged
- you want a task to run longer with less babysitting
- you need a cleaner handoff to an agent, routine, or workflow

## Principle

Modern models often perform better when given:
1. **the outcome**
2. **guardrails**
3. **exit criteria**
4. **a verification surface**

...instead of keystroke choreography.

## Rewrite format

Turn the request into this structure:

```md
## Outcome
What must be true when the task is done.

## Guardrails
What the model must avoid or preserve.

## Exit Criteria
How to know the task is complete.

## Verification Surface
What evidence, tests, screenshots, diffs, or artifacts prove success.
```

## Rewrite rules

### 1) Lead with the outcome
Bad:
- "Open file A, then file B, then change line 22, then run X, then maybe fix Y"

Better:
- "Refactor the auth flow so the login redirect preserves `next=` and all existing auth tests still pass."

### 2) Keep guardrails crisp
Examples:
- do not change public API shape
- preserve copy exactly
- do not remove analytics hooks
- keep migrations reversible
- do not push without review

### 3) Make exit criteria observable
Examples:
- tests pass
- build succeeds
- screenshot matches reference
- health endpoint returns 200
- output artifact exists and is non-empty

### 4) Prefer verification over extra prose
If you are about to add more prompt text, ask:
- would a test catch this better?
- would a screenshot or diff prove it faster?
- would a skill or MCP give the missing context more cleanly?

## Example transformations

### Example A — Feature build
**Before:**
"First inspect every auth file, then update the route, then patch the form, then rerun tests, then inspect the redirect helper..."

**After:**
```md
## Outcome
Fix login so successful auth preserves and respects the `next` redirect target.

## Guardrails
Do not change the public auth API. Do not weaken validation. Keep existing error copy.

## Exit Criteria
Relevant auth tests pass and a manual login flow lands on the requested page.

## Verification Surface
- `npm test -- auth`
- route diff review
- browser verification of login → redirected page
```

### Example B — Long-running migration
```md
## Outcome
Migrate the service from runtime A to runtime B while preserving behavior.

## Guardrails
Keep API compatibility, preserve existing fixtures, and avoid manual data edits.

## Exit Criteria
The migrated system passes the agreed test suite and starts cleanly in the target runtime.

## Verification Surface
- clean build
- integration tests
- fixture parity checks
- smoke endpoint check
```

## When to stop rewriting

Stop once the brief is:
- specific enough to verify
- short enough to stay legible
- strong on constraints
- not bloated with implementation trivia

## Output

When invoked, produce:
1. the cleaned outcome-first brief
2. a note on what prompt bloat was removed
3. one suggested verification improvement if the task still feels fragile
