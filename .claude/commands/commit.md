---
description: Smart commit with verification (Boris methodology)
---

# Smart Commit

Create a well-crafted git commit with verification checks.

## Workflow

### Step 0: Check Kata Session
```bash
npx kata status 2>/dev/null || echo "No kata session active"
```
If a kata session is active, include the current mode and phase in the commit context.

### Step 1: Run Verification First
Execute `/verify` checks. If any critical checks fail, STOP and report issues.

### Step 2: Show Changes
```bash
git status
git diff --stat
```

Show what will be committed clearly.

### Step 3: Generate Commit Message

Analyze changes and generate a conventional commit message:

**Format:**
```
<type>(<scope>): <description>

[optional body with more details]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code restructuring (no behavior change)
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `style`: Formatting, whitespace (no code change)

### Step 4: Confirm Before Committing
Present the generated commit message and ASK for confirmation before running:
```bash
git add -A
git commit -m "<message>"
```

### Step 5: Do NOT Push
Never auto-push. Only push if explicitly requested by user.

## Example Output

```
═══════════════════════════════════════════
  SMART COMMIT
═══════════════════════════════════════════

Verification: ✅ All checks passed

Changes to commit:
 M CLAUDE.md
 A .claude/commands/verify.md
 A .claude/settings.json

Proposed commit message:
────────────────────────────────────────────
feat(methodology): Add Boris methodology verification infrastructure

- Enhanced CLAUDE.md with verification requirements
- Added structured permissions (allow/ask/deny)
- Created /verify slash command

🤖 Generated with [Claude Code](https://claude.com/claude-code)
────────────────────────────────────────────

Proceed with commit? [Waiting for confirmation]
═══════════════════════════════════════════
```

## Safety Rules

- NEVER commit if verification fails
- NEVER push without explicit user request
- NEVER use `--no-verify` flag
- Always show diff summary before committing
