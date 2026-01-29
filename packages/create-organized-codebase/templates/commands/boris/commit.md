---
description: Smart commit with automatic verification (Boris methodology)
---

# Commit Command

Create a verified commit following Boris methodology. This command ensures verification passes before committing.

## Workflow

### Step 1: Run Verification First

Before committing, run the verification checks:

```bash
# Run linting
npm run lint 2>/dev/null || echo "Lint: skipped"

# Run type check
npm run typecheck 2>/dev/null || npx tsc --noEmit 2>/dev/null || echo "Types: skipped"

# Run tests
npm test 2>/dev/null || echo "Tests: skipped"
```

If any critical check fails, **stop and fix before committing**.

### Step 2: Stage Changes

Review what will be committed:

```bash
git status
git diff --staged
```

Stage the appropriate files (avoid `git add -A` to prevent accidental commits):

```bash
git add <specific-files>
```

### Step 3: Generate Commit Message

Create a commit message following conventional commits:

**Format:** `type(scope): description`

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `refactor` - Code change that neither fixes nor adds
- `test` - Adding tests
- `chore` - Maintenance tasks

### Step 4: Commit

```bash
git commit -m "type(scope): description

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                       COMMIT CREATED                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Hash:    abc1234                                            ║
║  Message: feat(auth): add password reset flow                ║
║                                                              ║
║  Files:   3 changed, 142 insertions, 12 deletions            ║
║                                                              ║
║  Verification: ✓ Passed                                      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Important Rules

1. **NEVER** use `--no-verify` to skip hooks
2. **NEVER** amend commits without explicit user request
3. **NEVER** force push without explicit user request
4. **ALWAYS** run verification before committing
