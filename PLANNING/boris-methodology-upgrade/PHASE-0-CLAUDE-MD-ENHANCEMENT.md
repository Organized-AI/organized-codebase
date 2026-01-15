# Phase 0: CLAUDE.md Enhancement

**Objective:** Create a comprehensive, team-maintainable CLAUDE.md that stays under 2.5k tokens

---

## Boris's Key Insights

> "Think of it this way. It should contain all the basic information that a newly created claude session should have about your project."

> "His own claude.md is about 2.5k tokens"

> "He has made it a habit to ask his whole team to contribute to the claude.md multiple times a week. Anytime they see it doing something incorrectly, they add it there as well."

> "Each microservice can have its own claude.md"

---

## Current State

Your CLAUDE.md currently contains only MCP-related instructions (~200 tokens). Missing:
- Tech stack
- Project structure
- Code conventions
- Anti-patterns / things NOT to do
- Verification expectations

---

## Target Structure

```markdown
# [Project Name]

## Tech Stack
- Runtime: [Node.js version, Python version, etc.]
- Framework: [Express, FastAPI, React, etc.]
- Database: [PostgreSQL, MongoDB, etc.]
- Key Dependencies: [List major packages]

## Project Structure
```
src/
├── [folder]/   # [purpose]
├── [folder]/   # [purpose]
```

## Code Conventions
- [Naming conventions]
- [Import order]
- [Error handling pattern]
- [Logging format]

## DO NOT
- [Anti-pattern 1 from past errors]
- [Anti-pattern 2 from past errors]
- [Anti-pattern 3 from past errors]

## Verification Requirements
Before completing any task, verify by:
1. [Test approach]
2. [Lint check]
3. [Other verification]

## MCP Integrations
[Existing byterover content]
```

---

## Tasks

1. **Audit current project**
   - Identify tech stack from package.json
   - Map project structure from src/
   - Find existing patterns in code

2. **Define code conventions**
   - Review existing code for patterns
   - Document naming conventions
   - Note error handling approach

3. **Create anti-patterns section**
   - Review git history for reverted changes
   - List common Claude mistakes you've corrected
   - Add "DO NOT" rules

4. **Add verification section**
   - Define how Claude should verify work
   - Specify test commands
   - List lint/format commands

5. **Integrate existing MCP content**
   - Keep byterover instructions
   - Add any other MCP tools

6. **Token count check**
   - Verify total is under 2.5k tokens
   - Trim if necessary

---

## Verification Checklist

- [ ] CLAUDE.md contains tech stack
- [ ] Project structure documented
- [ ] At least 3 code conventions listed
- [ ] At least 3 "DO NOT" anti-patterns
- [ ] Verification requirements specified
- [ ] Token count under 2,500
- [ ] File reads correctly in new Claude session

---

## Team Contribution Workflow

Boris's approach:
1. Anyone who sees Claude make a mistake adds it to CLAUDE.md
2. Assign team members to maintain specific sections
3. Review CLAUDE.md in weekly standup
4. Each microservice/module can have its own CLAUDE.md

---

## Prompt Template

```
Read the current CLAUDE.md and package.json. Create an enhanced CLAUDE.md that:

1. Documents the tech stack from package.json
2. Maps the project structure (keep brief)
3. Adds code conventions based on existing patterns
4. Creates a "DO NOT" section for anti-patterns
5. Specifies verification requirements
6. Keeps existing MCP content
7. Stays UNDER 2,500 tokens total

Output the complete new CLAUDE.md content.
```

---

## Completion

When complete:
1. Verify token count
2. Test in fresh Claude session
3. Git commit: "Phase 0: Enhanced CLAUDE.md with Boris methodology"
4. Move to Phase 1
