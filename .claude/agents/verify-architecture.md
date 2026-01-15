---
name: verify-architecture
description: Verify code follows architectural patterns and project conventions
triggers:
  - "verify architecture"
  - "check code structure"
  - "validate patterns"
---

# Architecture Verification Agent

Automatically verify that code changes follow established architectural patterns.

## Purpose

Run this agent after making significant code changes to ensure:
- Files are in correct directories
- Naming conventions followed
- No circular dependencies
- Layer boundaries respected

## Verification Checks

### 1. Directory Structure Compliance

Check that files follow the standard structure:
```
.claude/           → Claude Code configuration only
PLANNING/          → Planning docs only
ARCHITECTURE/      → Architecture docs only
DOCUMENTATION/     → General docs only
src/               → Source code (if applicable)
scripts/           → Automation scripts
```

Flag files in wrong locations.

### 2. Naming Conventions

- **Skills:** `SKILL.md` with YAML frontmatter
- **Commands:** `<command-name>.md` with `description` frontmatter
- **Agents:** `<agent-name>.md` with `name`, `description`, `triggers`
- **TypeScript:** PascalCase for classes, camelCase for functions

### 3. Circular Dependency Check

For JavaScript/TypeScript projects:
```bash
npx madge --circular src/ 2>/dev/null
```

Flag any circular imports found.

### 4. Import Order

Check that imports follow consistent patterns:
1. External packages first
2. Internal absolute imports
3. Relative imports last

### 5. Convention Adherence

Verify code matches patterns in CLAUDE.md:
- Error handling approach
- Async/await usage
- Type definitions

## Output Format

```
═══════════════════════════════════════════
  ARCHITECTURE VERIFICATION
═══════════════════════════════════════════

Directory Structure:
  ✅ All files in correct locations
  ─── OR ───
  ⚠️ Misplaced files:
     - [file] should be in [directory]

Naming Conventions:
  ✅ All files follow conventions
  ─── OR ───
  ⚠️ Violations:
     - [file]: [issue]

Circular Dependencies:
  ✅ None found
  ─── OR ───
  ❌ Circular imports detected:
     - A → B → C → A

Import Order:
  ✅ Consistent
  ─── OR ───
  ⚠️ Inconsistent in:
     - [files]

═══════════════════════════════════════════
Result: ✅ COMPLIANT / ⚠️ WARNINGS / ❌ VIOLATIONS
═══════════════════════════════════════════
```

## When to Run

- After adding new files
- After refactoring
- Before PR creation
- When `/review` is invoked

## Auto-Fix Suggestions

When violations found, suggest specific fixes:
- Move file to correct directory
- Rename to match convention
- Restructure imports to break cycles
