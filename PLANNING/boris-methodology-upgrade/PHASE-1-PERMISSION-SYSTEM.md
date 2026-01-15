# Phase 1: Permission System Setup

**Objective:** Create a structured permission system with explicit allow/deny/ask rules

---

## Boris's Key Insights

> "Boris says he doesn't use [dangerously skip permissions] and he's right, especially in production environments where a single terminal command can mess up the entire project."

> "Instead, he uses the permissions in Claude code to set up which commands are allowed, which commands it should ask before running and which commands are completely denied."

> "The Claude folder also contains a settings.json file where all of these commands are written down and he can then share that file with the rest of the team."

---

## Current State

Your `.claude/settings.local.json` has a basic allow list but:
- No structured deny list
- No ask list for dangerous commands
- Contains old commit messages (bloated)
- Not organized by category

---

## Target Structure

### `.claude/settings.json` (Team-shared)
```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(npm run:*)",
      "Bash(npm test:*)",
      "Bash(npx:*)",
      "Bash(node:*)",
      "Bash(python3:*)",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(mkdir:*)",
      "Bash(touch:*)",
      "Read(**/src/**)",
      "Read(**/tests/**)",
      "Read(**/PLANNING/**)"
    ],
    "ask": [
      "Bash(git push:*)",
      "Bash(git commit:*)",
      "Bash(rm:*)",
      "Bash(mv:*)",
      "Bash(npm install:*)",
      "Bash(pip install:*)"
    ],
    "deny": [
      "Bash(git push --force:*)",
      "Bash(git reset --hard:*)",
      "Bash(rm -rf /)",
      "Bash(sudo:*)",
      "Bash(chmod 777:*)"
    ]
  }
}
```

### `.claude/settings.local.json` (Personal overrides)
```json
{
  "permissions": {
    "allow": [
      "WebSearch"
    ]
  }
}
```

---

## Permission Categories

### Category 1: Safe Operations (ALLOW)
Commands that can't cause harm:
- Read operations (ls, cat, grep, find)
- Git status/diff/log
- Running tests
- Linting/formatting
- Starting dev servers

### Category 2: Careful Operations (ASK)
Commands that make changes:
- Git commits and pushes
- File deletions/moves
- Package installations
- Database operations
- API calls with side effects

### Category 3: Dangerous Operations (DENY)
Commands that can cause serious harm:
- Force pushes
- Hard resets
- System-wide operations (sudo)
- Recursive deletes at root
- Permission changes

---

## Tasks

1. **Audit current permissions**
   - List all currently allowed commands
   - Identify gaps in coverage
   - Note any dangerous patterns

2. **Create allow list**
   - All safe read operations
   - All test/lint commands
   - Development server commands
   - Build commands

3. **Create ask list**
   - Git commits and pushes
   - File system modifications
   - Package installations
   - Database migrations

4. **Create deny list**
   - Force operations
   - System operations
   - Destructive patterns

5. **Separate team vs personal**
   - settings.json for team rules
   - settings.local.json for personal preferences

6. **Clean up old cruft**
   - Remove embedded commit messages
   - Organize by category

---

## Verification Checklist

- [ ] settings.json created with team permissions
- [ ] Allow list covers all safe operations
- [ ] Ask list covers all modifying operations
- [ ] Deny list blocks dangerous operations
- [ ] settings.local.json cleaned up
- [ ] Tested with common workflows
- [ ] Can be shared via git

---

## Testing Plan

Test each permission category:

```bash
# Test allow (should run immediately)
git status
npm test

# Test ask (should prompt)
git commit -m "test"
rm somefile.txt

# Test deny (should be blocked)
git push --force origin main
sudo apt-get install something
```

---

## Prompt Template

```
Review the current .claude/settings.local.json and create:

1. A new .claude/settings.json with:
   - Categorized allow list (safe operations)
   - Categorized ask list (modifying operations)
   - Categorized deny list (dangerous operations)

2. A cleaned .claude/settings.local.json with only personal overrides

Follow Boris's principle: Never skip permissions, always be explicit.
```

---

## Completion

When complete:
1. Test all permission categories
2. Verify team file is portable
3. Git commit: "Phase 1: Structured permission system"
4. Move to Phase 2
