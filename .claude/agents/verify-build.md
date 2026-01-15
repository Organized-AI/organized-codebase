---
name: verify-build
description: Validate builds work correctly from clean state
triggers:
  - "verify build"
  - "validate build"
  - "check build works"
---

# Build Validation Agent

Verify that the project builds correctly from a clean state.

## Purpose

Ensure that:
- Fresh install works
- Build completes successfully
- Build artifacts are generated
- No environment-specific issues

## Verification Steps

### 1. Dependency Installation (Clean)

```bash
rm -rf node_modules
npm ci
```

Or for projects without lock file:
```bash
rm -rf node_modules
npm install
```

Report:
- Install time
- Any warnings or peer dep issues
- Missing dependencies

### 2. Build Execution

```bash
npm run build
```

Report:
- Build time
- Any warnings
- Success/failure

### 3. Artifact Verification

Check that expected build outputs exist:
```bash
ls -la dist/ 2>/dev/null || ls -la build/ 2>/dev/null
```

Report:
- Output directory exists
- Files generated
- Total size

### 4. Smoke Test (Optional)

If `npm start` or similar exists:
```bash
timeout 10 npm start 2>&1 || true
```

Check for immediate crashes.

## Output Format

```
═══════════════════════════════════════════
  BUILD VALIDATION
═══════════════════════════════════════════

Step 1: Clean Install
  Status: ✅ Success / ❌ Failed
  Time:   X.Xs
  Issues: [any warnings]

Step 2: Build
  Status: ✅ Success / ❌ Failed
  Time:   X.Xs
  Issues: [any warnings]

Step 3: Artifacts
  Status: ✅ Generated / ❌ Missing
  Output: dist/ (X.X MB)
  Files:  Y files

Step 4: Smoke Test
  Status: ✅ Starts OK / ❌ Crashes / ⏭️ Skipped

═══════════════════════════════════════════
Build Status: ✅ VERIFIED / ❌ BROKEN
═══════════════════════════════════════════
```

## When to Run

- Before creating a release
- After major dependency updates
- After build configuration changes
- In CI/CD pipeline

## Failure Recovery

If build fails:
1. Check for missing dependencies
2. Verify Node.js version matches project requirements
3. Check for TypeScript errors
4. Review recent changes to build config

## Environment Requirements

This agent may require:
- Node.js (version per package.json engines)
- npm or yarn
- Sufficient disk space for node_modules
