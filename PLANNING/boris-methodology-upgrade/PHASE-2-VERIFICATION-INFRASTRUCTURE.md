# Phase 2: Verification Infrastructure

**Objective:** Implement multiple verification methods to give Claude feedback loops

---

## Boris's Key Insights (The Core Philosophy)

> "They basically give it a task and then when there are minor errors or it's not able to complete it 100%, they get disappointed. But humans work in a very similar way. That's why he tells us that we should always give Claude a way to verify its work."

> "You should tell it to use tests as well. This is because Claude gets that feedback loop and this instantly increases the quality of the final result."

> "Before it does any work, it should mention how it would verify that work. So, it gets that constant feedback loop."

> "Verification is different for each domain."

---

## Verification Methods Boris Mentions

1. **Tests** - Run tests to verify functionality
2. **Linters/Formatters** - Clean up remaining 10% of code issues
3. **Browser Extension** - Navigate and verify UI
4. **Screenshots** - Visual verification
5. **Stop Hooks** - Auto-trigger verification when Claude stops
6. **Test-Driven Development** - Write tests first
7. **iOS/Android Simulator MCPs** - Mobile verification

---

## Current State

Your project has:
- `tests/` directory (exists but unclear what's in it)
- No visible linter config
- No hooks configured
- No verification workflow defined

---

## Target Infrastructure

### 1. Test Verification
```
tests/
├── unit/           # Unit tests for functions
├── integration/    # Integration tests for modules
└── e2e/           # End-to-end tests
```

### 2. Linting/Formatting
```
.eslintrc.js        # ESLint config
.prettierrc         # Prettier config
package.json        # Scripts: lint, format, lint:fix
```

### 3. Stop Hook for Verification
```
.claude/hooks/
└── stop.sh         # Runs when Claude completes
```

### 4. Verification Checklist in CLAUDE.md
```markdown
## Verification Requirements
Before marking any task complete:
1. Run `npm test` - all tests must pass
2. Run `npm run lint` - no errors allowed
3. If UI change: take screenshot and verify
4. If API change: test with curl/httpie
```

---

## Tasks

### Task 1: Audit Test Infrastructure
- Check what's in tests/ directory
- Identify test framework (Jest, Vitest, etc.)
- Document current test coverage

### Task 2: Set Up Linting
- Install ESLint and Prettier
- Create configuration files
- Add npm scripts: lint, lint:fix, format
- Integrate with pre-commit (optional)

### Task 3: Create Stop Hook
```bash
# .claude/hooks/stop.sh
#!/bin/bash
echo "=== Verification Check ==="
npm run lint --silent
if [ $? -ne 0 ]; then
    echo "❌ Linting errors found"
    exit 1
fi
npm test --silent
if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi
echo "✅ All verification passed"
```

### Task 4: Update CLAUDE.md
Add verification section:
```markdown
## Verification Requirements

Before completing ANY task, I must:

1. **Describe verification approach first**
   - Before coding, state how I'll verify the work

2. **Run tests**
   - `npm test` for unit tests
   - All tests must pass

3. **Run linting**
   - `npm run lint`
   - No errors allowed (warnings ok)

4. **Visual verification (if UI)**
   - Take screenshot
   - Describe what should appear
```

### Task 5: Create Verification Templates

For different domains:

**Code Changes:**
```
Verification: npm test && npm run lint
```

**API Changes:**
```
Verification: curl -X GET http://localhost:3000/endpoint
Expected: 200 OK with [expected response]
```

**UI Changes:**
```
Verification: Screenshot of [component]
Expected: [description of correct appearance]
```

---

## Stop Hook Details

Boris mentions:
> "The second approach is using a stop hook to automatically trigger this verification when Claude stops outputting."

Create `.claude/hooks.json`:
```json
{
  "hooks": {
    "stop": {
      "command": "bash .claude/hooks/stop.sh",
      "description": "Run verification on task completion"
    }
  }
}
```

---

## Test-Driven Development Workflow

Boris recommends TDD:
> "You can use test-driven development where tests for a new feature are written first and then you do the actual implementation."

Add to CLAUDE.md:
```markdown
## Development Workflow

For new features:
1. Write failing test first
2. Implement minimum code to pass
3. Refactor if needed
4. Verify all tests still pass
```

---

## Verification Checklist

- [ ] Test directory structure organized
- [ ] Linting configured (ESLint + Prettier)
- [ ] npm scripts added (test, lint, format)
- [ ] Stop hook created and tested
- [ ] CLAUDE.md updated with verification requirements
- [ ] Verification templates created for each domain
- [ ] TDD workflow documented

---

## Prompt Template

```
Set up verification infrastructure:

1. Check existing tests/ and create proper structure
2. Install and configure ESLint + Prettier
3. Add npm scripts: test, lint, lint:fix, format
4. Create .claude/hooks/stop.sh for auto-verification
5. Update CLAUDE.md with verification requirements

Follow Boris's principle: Claude needs feedback loops to produce quality work.
```

---

## Completion

When complete:
1. Run verification manually to confirm it works
2. Test stop hook triggers correctly
3. Git commit: "Phase 2: Verification infrastructure with hooks"
4. Move to Phase 3
