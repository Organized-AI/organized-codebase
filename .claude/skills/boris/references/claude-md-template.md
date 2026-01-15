# CLAUDE.md Template

Use this template when setting up Boris methodology for a new project.

**Token Budget:** Keep under 2,500 tokens total.

---

## Template

```markdown
# [Project Name]

[One sentence description of what this project does]

## Tech Stack
- Runtime: [e.g., Node.js 20, Python 3.11, Deno]
- Framework: [e.g., Express, React, FastAPI, SvelteKit]
- Database: [e.g., PostgreSQL, MongoDB, SQLite]
- Key Dependencies: [list 3-5 major packages]

## Project Structure
```
src/
├── lib/          → Shared utilities
├── services/     → Business logic
├── types/        → TypeScript definitions
├── routes/       → API endpoints (or pages/)
└── index.ts      → Entry point
tests/            → Test files
scripts/          → Automation scripts
```

## Code Conventions
- [Naming: camelCase for functions, PascalCase for classes/types]
- [Imports: external first, then internal, then relative]
- [Errors: use custom error classes, always include context]
- [Async: prefer async/await over callbacks/promises]

## DO NOT
- Never use `--dangerously-skip-permissions` (use structured permissions)
- Never skip plan mode for complex features
- Never commit without running verification first
- Never use `any` type - use `unknown` and narrow
- Never leave console.log in production code

## Verification Requirements
Before completing ANY task:
1. Describe your verification approach first
2. Run `npm test` (all tests must pass)
3. Run `npm run lint` (no errors allowed)
4. Run `npm run build` (must compile cleanly)
5. For UI changes: provide screenshot or description

## MCP Integration
[Document any MCP servers the project uses]

### [MCP Name]
- Tool: `tool-name`
- When to use: [describe usage]
```

---

## Section Guidelines

### Tech Stack
- Be specific about versions
- Include only what Claude needs to know
- Skip obvious dependencies (don't list every npm package)

### Project Structure
- Show only the main directories
- Use → to explain purpose
- Keep to 5-10 lines max

### Code Conventions
- List 3-5 key patterns
- Focus on things Claude might get wrong
- Be specific, not generic

### DO NOT (Critical!)
- Start with universal rules
- **Add new items whenever Claude makes a mistake**
- Be specific: "Never X" not "Avoid X when possible"
- Include context for non-obvious rules

### Verification Requirements
- List specific commands to run
- Include acceptance criteria
- Mention screenshot/visual verification if UI project

---

## Example: Node.js API Project

```markdown
# User Auth Service

REST API for user authentication and authorization.

## Tech Stack
- Runtime: Node.js 20 LTS
- Framework: Express 4.x with TypeScript
- Database: PostgreSQL 15 with Prisma ORM
- Key Dependencies: bcrypt, jsonwebtoken, zod

## Project Structure
```
src/
├── lib/          → Utilities (logger, errors, validation)
├── services/     → Business logic (auth, user, token)
├── routes/       → Express route handlers
├── middleware/   → Auth, error handling, logging
├── types/        → TypeScript interfaces
└── index.ts      → Server entry point
prisma/           → Database schema and migrations
tests/            → Jest test files
```

## Code Conventions
- Functions: camelCase (e.g., `createUser`)
- Types/Interfaces: PascalCase (e.g., `UserCredentials`)
- Files: kebab-case (e.g., `auth-service.ts`)
- Errors: Throw custom `AppError` with status code
- Validation: Use Zod schemas at API boundaries

## DO NOT
- Never store passwords in plain text (always bcrypt)
- Never return full user objects (exclude password hash)
- Never use string concatenation for SQL (use Prisma)
- Never skip input validation on routes
- Never log sensitive data (passwords, tokens)

## Verification Requirements
Before completing ANY task:
1. Run `npm test` - all tests pass
2. Run `npm run lint` - no errors
3. Run `npm run build` - compiles cleanly
4. Test API endpoints with curl/httpie
5. Check Prisma migrations are up to date
```

---

## Maintenance

**Update CLAUDE.md when:**
1. Claude makes a mistake → Add to "DO NOT"
2. Tech stack changes → Update versions/deps
3. New conventions adopted → Add to conventions
4. Team learns new anti-pattern → Document it

**Keep it fresh:** Boris recommends team members update CLAUDE.md multiple times per week.
