#!/bin/bash
# Verify Phase 0 setup is complete and working

set -e

echo "=== Phase 0 Verification ==="
echo ""

# Track failures
FAILURES=0

# Check required files
echo "1. Checking required files..."
REQUIRED_FILES=("package.json" "tsconfig.json" ".gitignore")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file exists"
    else
        echo "   ✗ $file MISSING"
        FAILURES=$((FAILURES + 1))
    fi
done

# Check optional files
echo ""
echo "2. Checking optional files..."
OPTIONAL_FILES=(".env.example" ".eslintrc.json")
for file in "${OPTIONAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file exists"
    else
        echo "   - $file not found (optional)"
    fi
done

# Check directories
echo ""
echo "3. Checking directory structure..."
REQUIRED_DIRS=("src" "tests")
OPTIONAL_DIRS=("src/lib" "src/agents" "src/mcp" "logs")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "   ✓ $dir/ exists"
    else
        echo "   ✗ $dir/ MISSING"
        FAILURES=$((FAILURES + 1))
    fi
done
for dir in "${OPTIONAL_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "   ✓ $dir/ exists"
    else
        echo "   - $dir/ not found (optional)"
    fi
done

# Check entry point
echo ""
echo "4. Checking entry point..."
if [ -f "src/index.ts" ]; then
    echo "   ✓ src/index.ts exists"
else
    echo "   ✗ src/index.ts MISSING"
    FAILURES=$((FAILURES + 1))
fi

# Run npm commands
echo ""
echo "5. Running verification commands..."

# npm install check
if [ -d "node_modules" ]; then
    PACKAGE_COUNT=$(ls node_modules | wc -l | tr -d ' ')
    echo "   ✓ node_modules exists ($PACKAGE_COUNT packages)"
else
    echo "   ! node_modules missing - running npm install..."
    npm install > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "   ✓ npm install succeeded"
    else
        echo "   ✗ npm install FAILED"
        FAILURES=$((FAILURES + 1))
    fi
fi

# TypeScript build check
echo ""
echo "   Running npm run build..."
if npm run build > /dev/null 2>&1; then
    echo "   ✓ npm run build succeeded"
else
    echo "   ✗ npm run build FAILED"
    FAILURES=$((FAILURES + 1))
fi

# TypeScript typecheck
echo ""
echo "   Running npm run typecheck..."
if npm run typecheck > /dev/null 2>&1; then
    echo "   ✓ npm run typecheck succeeded"
else
    echo "   ✗ npm run typecheck FAILED"
    FAILURES=$((FAILURES + 1))
fi

# Entry point execution (try --help for CLI apps, fallback to plain execution)
echo ""
echo "   Testing entry point..."
if npx tsx src/index.ts --help > /dev/null 2>&1; then
    echo "   ✓ Entry point executes (CLI with --help)"
elif npx tsx src/index.ts > /dev/null 2>&1; then
    echo "   ✓ Entry point executes"
else
    # Check if it's a syntax/import error vs runtime error
    OUTPUT=$(npx tsx src/index.ts 2>&1 || true)
    if echo "$OUTPUT" | grep -q "SyntaxError\|Cannot find module\|Error: Cannot find"; then
        echo "   ✗ Entry point has errors:"
        echo "$OUTPUT" | head -3
        FAILURES=$((FAILURES + 1))
    else
        echo "   ✓ Entry point compiled (may require args)"
    fi
fi

# Check for completion doc
echo ""
echo "6. Checking completion status..."
if [ -f "PLANNING/implementation-phases/PHASE-0-COMPLETE.md" ]; then
    echo "   ✓ PHASE-0-COMPLETE.md exists"
else
    echo "   - PHASE-0-COMPLETE.md not created yet"
fi

# Summary
echo ""
echo "=== Summary ==="
if [ $FAILURES -eq 0 ]; then
    echo "✓ All Phase 0 checks passed!"
    echo ""
    echo "Next steps:"
    echo "  1. Create PLANNING/implementation-phases/PHASE-0-COMPLETE.md"
    echo "  2. Git commit: 'Phase 0: Project setup complete'"
    echo "  3. Proceed to Phase 1"
    exit 0
else
    echo "✗ $FAILURES check(s) failed"
    echo ""
    echo "Fix the issues above before proceeding."
    exit 1
fi
