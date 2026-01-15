# Phase 3: Slash Commands & Inner Loop Workflows

**Objective:** Create slash commands for repetitive "inner loop" workflows

---

## Boris's Key Insights

> "Starting with slash commands, he refers to his repetitive workflows as his inner loop workflows, things he has to repeat many times a day."

> "Since all of these /commands are stored inside your .claude folder in a command subfolder, you can actually commit them to git. This is also how he shares them with his entire team."

---

## Current State

You have 1 command:
- `.claude/commands/new-project.md` - Project creation

Missing: Daily workflow automation commands

---

## Target Commands

### Essential Inner Loop Commands

| Command | Purpose | Frequency |
|---------|---------|-----------|
| `/verify` | Run all verification checks | Every task |
| `/commit` | Smart commit with verification | Multiple/day |
| `/review` | Self-review before PR | Every PR |
| `/status` | Project health check | Start of session |
| `/test` | Run tests with coverage | During development |
| `/plan` | Enter plan mode with template | Starting features |

---

## Command Definitions

### `/verify`
```markdown
# Verify Current Work

Run complete verification suite:

1. **Linting Check**
   ```bash
   npm run lint
   ```

2. **Test Suite**
   ```bash
   npm test
   ```

3. **Type Check** (if TypeScript)
   ```bash
   npm run typecheck
   ```

4. **Build Check**
   ```bash
   npm run build
   ```

Report: Pass/Fail for each, with specific errors if any.
```

### `/commit`
```markdown
# Smart Commit

Before committing:

1. Run `/verify` to ensure code quality
2. Show `git status` summary
3. Show `git diff --stat` for changed files
4. Generate commit message following conventional commits:
   - feat: New feature
   - fix: Bug fix
   - docs: Documentation
   - refactor: Code refactoring
   - test: Adding tests
   - chore: Maintenance

5. Ask for confirmation before committing
6. Push only if explicitly requested
```

### `/review`
```markdown
# Self-Review Before PR

Perform comprehensive self-review:

1. **Diff Analysis**
   ```bash
   git diff main...HEAD
   ```

2. **Check for:**
   - Console.logs or debug statements
   - Commented-out code
   - TODO comments without tickets
   - Missing error handling
   - Hardcoded values
   - Missing tests for new code

3. **Verification**
   - Run full test suite
   - Check linting
   - Verify build succeeds

4. **Summary**
   - List all changes
   - Potential concerns
   - Recommendation: Ready / Needs Work
```

### `/status`
```markdown
# Project Health Check

Check overall project status:

1. **Git Status**
   ```bash
   git status
   git log --oneline -5
   ```

2. **Dependency Health**
   ```bash
   npm outdated
   ```

3. **Test Status**
   ```bash
   npm test -- --coverage
   ```

4. **Build Status**
   ```bash
   npm run build
   ```

5. **Recent Activity**
   - Last 5 commits
   - Current branch
   - Uncommitted changes

Provide summary: Healthy / Needs Attention / Critical Issues
```

### `/test`
```markdown
# Run Tests with Details

Execute test suite with coverage:

1. **Run all tests**
   ```bash
   npm test -- --coverage
   ```

2. **Report:**
   - Total tests: X
   - Passed: X
   - Failed: X
   - Coverage: X%

3. **If failures:**
   - List failing tests
   - Show error messages
   - Suggest fixes

4. **If low coverage:**
   - Identify uncovered files
   - Suggest test additions
```

### `/plan`
```markdown
# Enter Planning Mode

Switch to plan mode for feature development:

1. **Gather Context**
   - Read relevant existing code
   - Check CLAUDE.md for conventions
   - Review related tests

2. **Create Plan Structure:**
   - Objective
   - Files to modify
   - New files needed
   - Tests to write
   - Verification approach

3. **Confirm before proceeding**

Use this BEFORE starting any significant feature.
```

---

## Tasks

1. **Create commands directory structure**
   ```
   .claude/commands/
   ├── verify.md
   ├── commit.md
   ├── review.md
   ├── status.md
   ├── test.md
   └── plan.md
   ```

2. **Write each command file**
   - Follow the definitions above
   - Customize for your project's tools

3. **Test each command**
   - Run each command in Claude Code
   - Verify output is useful
   - Adjust as needed

4. **Add to git**
   - Commit all commands
   - Share with team

5. **Document in CLAUDE.md**
   - Add available commands section
   - When to use each

---

## Verification Checklist

- [ ] All 6 commands created
- [ ] Each command tested and working
- [ ] Commands follow project conventions
- [ ] Commands added to git
- [ ] CLAUDE.md updated with command list
- [ ] Team can access via git pull

---

## Advanced Commands (Optional)

Consider adding based on your workflow:

| Command | Purpose |
|---------|---------|
| `/deploy` | Deployment workflow |
| `/debug` | Debugging session setup |
| `/refactor` | Guided refactoring |
| `/docs` | Generate documentation |
| `/clean` | Clean up temp files |

---

## Prompt Template

```
Create slash commands for inner loop workflows:

1. Create .claude/commands/ directory
2. Create these command files:
   - verify.md - Run all verification
   - commit.md - Smart commit workflow
   - review.md - Self-review before PR
   - status.md - Project health check
   - test.md - Run tests with coverage
   - plan.md - Enter planning mode

Each command should:
- Be specific to this project's tooling
- Include verification steps
- Provide clear output

Follow Boris's principle: Automate repetitive inner loop workflows.
```

---

## Completion

When complete:
1. Test each command
2. Verify commands work in fresh session
3. Git commit: "Phase 3: Inner loop slash commands"
4. Move to Phase 4
