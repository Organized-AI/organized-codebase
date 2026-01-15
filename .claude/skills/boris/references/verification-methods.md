# Verification Methods Reference

Comprehensive guide to verification approaches for different domains.

---

## Core Principle

> "Always give Claude a way to verify its work."

Every task needs a verification approach. Choose methods based on what you're building.

---

## Verification by Domain

### 1. Code Logic

**Methods:**
```bash
# Unit tests
npm test
pytest
go test ./...

# Integration tests
npm run test:integration

# Coverage check
npm test -- --coverage
```

**When to use:** Any code that has logic/behavior to verify.

---

### 2. Type Safety (TypeScript/Typed Languages)

**Methods:**
```bash
# TypeScript
npx tsc --noEmit

# Python (mypy)
mypy src/

# Go (built-in)
go build ./...
```

**When to use:** After any code changes in typed codebases.

---

### 3. Code Style & Linting

**Methods:**
```bash
# JavaScript/TypeScript
npm run lint
npx eslint src/

# Python
ruff check .
black --check .

# Go
golangci-lint run
```

**When to use:** Before every commit.

---

### 4. UI / Frontend

**Methods:**
| Method | Tool | Use Case |
|--------|------|----------|
| Screenshots | Browser DevTools | Visual verification |
| Browser Extension | Claude Browser Ext | Interactive verification |
| E2E Tests | Playwright, Cypress | Automated UI testing |
| Visual Regression | Percy, Chromatic | Catch visual changes |

**Example E2E:**
```bash
npx playwright test
npx cypress run
```

**When to use:** Any UI changes, component updates, styling changes.

---

### 5. API / Backend

**Methods:**
```bash
# Quick verification
curl -X GET http://localhost:3000/health
curl -X POST http://localhost:3000/api/users -d '{"name":"test"}'

# HTTPie (more readable)
http GET localhost:3000/health
http POST localhost:3000/api/users name=test

# API testing tools
npx newman run collection.json
```

**Integration tests:**
```bash
npm run test:api
pytest tests/api/
```

**When to use:** Any API endpoint changes, new routes, data model updates.

---

### 6. Build Verification

**Methods:**
```bash
# Clean build
rm -rf node_modules dist
npm ci
npm run build

# Verify artifacts
ls -la dist/
du -sh dist/

# Smoke test
npm start &
sleep 5
curl localhost:3000/health
```

**When to use:** Before releases, after dependency updates, CI/CD.

---

### 7. Architecture Verification

**Methods:**
```bash
# Circular dependency check
npx madge --circular src/

# Dependency analysis
npx depcheck

# Import order verification
# (Usually via ESLint rules)
```

**Use agent:**
```
Invoke verify-architecture agent
```

**When to use:** After refactoring, adding new files, before PR.

---

### 8. Security Verification

**Methods:**
```bash
# Dependency vulnerabilities
npm audit
pip-audit
snyk test

# Secret scanning
gitleaks detect
trufflehog git file://. --only-verified

# SAST (Static Analysis)
npx eslint --plugin security src/
bandit -r src/
```

**When to use:** Before releases, periodically, after adding dependencies.

---

### 9. Database / Migrations

**Methods:**
```bash
# Prisma
npx prisma migrate status
npx prisma db push --dry-run

# Knex
npx knex migrate:status

# Django
python manage.py showmigrations
python manage.py check
```

**When to use:** After schema changes, before deployment.

---

### 10. Documentation

**Methods:**
```bash
# Link checking
npx markdown-link-check README.md

# Spell checking
npx cspell "**/*.md"

# API docs generation (verify builds)
npm run docs
```

**Manual verification:**
- README is accurate
- API docs match implementation
- CLAUDE.md is under 2.5k tokens

---

## Verification Checklist Template

Use this for any task:

```markdown
## Verification Plan

**Task:** [What you're implementing]

**Verification Approach:**
1. [ ] [Specific check 1]
2. [ ] [Specific check 2]
3. [ ] [Specific check 3]

**Commands to run:**
```bash
[command 1]
[command 2]
```

**Success criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
```

---

## Quick Reference Table

| Domain | Primary Method | Command |
|--------|---------------|---------|
| Logic | Unit tests | `npm test` |
| Types | Type checker | `tsc --noEmit` |
| Style | Linter | `npm run lint` |
| UI | E2E + Screenshots | `playwright test` |
| API | Integration tests | `npm run test:api` |
| Build | Clean build | `npm ci && npm run build` |
| Architecture | Agent | `verify-architecture` |
| Security | Audit | `npm audit` |
| Database | Migration status | `prisma migrate status` |

---

## Creating Custom Verification

For project-specific verification, add to `package.json`:

```json
{
  "scripts": {
    "verify": "npm run lint && npm test && npm run build",
    "verify:full": "npm run verify && npm run test:e2e && npm audit"
  }
}
```

Then the `/verify` command can use these scripts.
