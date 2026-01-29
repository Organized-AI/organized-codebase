---
description: Ad-hoc task execution with OC guarantees (skip research/planning)
---

# Quick Command

Execute ad-hoc tasks quickly while maintaining quality guarantees.

## When to Use

- Bug fixes that don't need planning
- Small improvements
- Documentation updates
- Config changes
- Quick refactors

**NOT for:**
- New features (use `/oc:new-project` or `/oc:discuss`)
- Multi-file changes (needs planning)
- Architectural changes

## Quick Task Flow

### Step 1: Understand the Task

User describes what they need. Confirm understanding:

"I understand you want to [restate task]. This will involve [brief scope]."

### Step 2: Verify Scope is Quick-appropriate

Check that task is:
- [ ] Single-purpose
- [ ] Limited file changes (1-3 files)
- [ ] No architectural decisions needed
- [ ] Clear success criteria

If not, suggest: "This might benefit from `/oc:discuss` first."

### Step 3: Execute

1. Make the changes
2. Verify with quick checks

```bash
npm run lint 2>/dev/null || echo "Lint: skipped"
npx tsc --noEmit 2>/dev/null || echo "Types: skipped"
```

### Step 4: Commit

```bash
git add <specific-files>
git commit -m "type(scope): description

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                    QUICK TASK COMPLETE                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Task:     Fix typo in error message                         ║
║  Files:    1 changed                                         ║
║                                                              ║
║  Changes:                                                    ║
║    • src/utils/errors.ts: Fixed spelling                     ║
║                                                              ║
║  Verification:                                               ║
║    ✓ Lint passed                                             ║
║    ✓ Types passed                                            ║
║                                                              ║
║  Commit: abc1234 fix(errors): correct typo in message        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Quality Guarantees

Even quick tasks maintain:

1. **Verification** - Always run lint/type checks
2. **Atomic commits** - One task, one commit
3. **Conventional messages** - Proper commit format
4. **No debug code** - Clean code only

## Escalation

If during execution you discover:
- Task is bigger than expected → Pause, run `/oc:discuss`
- Related issues → Note them, but stay focused on original task
- Blockers → Report and ask how to proceed
