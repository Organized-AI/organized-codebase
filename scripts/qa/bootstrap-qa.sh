#!/usr/bin/env bash
# bootstrap-qa.sh
# QA loop for the Organized Codebase staged bootstrap.
# Run after any phase reports "complete" to confirm it actually did what it claimed.
#
# Usage:
#   ./bootstrap-qa.sh <project_root> [phase]
#   phase = 0 | 1 | 2 | all   (default: all)
#
# Exit codes: 0 = pass, 1 = one or more checks failed

set -uo pipefail

PROJECT_ROOT="${1:-.}"
PHASE="${2:-all}"
QA_LOG="$PROJECT_ROOT/scripts/qa/bootstrap-qa-$(date +%Y%m%d-%H%M%S).log"
PASS=0
FAIL=0

mkdir -p "$PROJECT_ROOT/scripts/qa"

check() {
  local desc="$1"
  local cmd="$2"
  if eval "$cmd" >/dev/null 2>&1; then
    echo "  [PASS] $desc" | tee -a "$QA_LOG"
    PASS=$((PASS+1))
  else
    echo "  [FAIL] $desc" | tee -a "$QA_LOG"
    FAIL=$((FAIL+1))
  fi
}

echo "=== Bootstrap QA Loop ===" | tee "$QA_LOG"
echo "Project: $PROJECT_ROOT" | tee -a "$QA_LOG"
echo "Phase target: $PHASE" | tee -a "$QA_LOG"
echo "" | tee -a "$QA_LOG"

# ---------------------------------------------------------
# PHASE 0: Bootstrap Scaffold
# ---------------------------------------------------------
if [[ "$PHASE" == "0" || "$PHASE" == "all" ]]; then
  echo "--- Phase 0: Scaffold ---" | tee -a "$QA_LOG"
  check "CLAUDE.md present" "[ -f '$PROJECT_ROOT/CLAUDE.md' ]"
  for d in skills commands agents hooks; do
    check ".claude/$d/ exists and non-empty" \
      "[ -d '$PROJECT_ROOT/.claude/$d' ] && [ \"\$(ls -A '$PROJECT_ROOT/.claude/$d' 2>/dev/null)\" ]"
  done
  for d in PLANNING ARCHITECTURE DOCUMENTATION SPECIFICATIONS AGENT-HANDOFF CONFIG scripts; do
    check "$d/ directory exists" "[ -d '$PROJECT_ROOT/$d' ]"
  done
  check "git repo initialized" "[ -d '$PROJECT_ROOT/.git' ]"
  check "git default branch is main" \
    "git -C '$PROJECT_ROOT' symbolic-ref --short HEAD | grep -qx main"
  echo "" | tee -a "$QA_LOG"
fi

# ---------------------------------------------------------
# TOKEN ROUTING LAYER (scaffolded at Phase 0 -> Phase 1 gate)
# ---------------------------------------------------------
if [[ "$PHASE" == "1" || "$PHASE" == "all" ]]; then
  echo "--- Token Routing Layer ---" | tee -a "$QA_LOG"
  check "token routing module exists" \
    "find '$PROJECT_ROOT' -maxdepth 3 -iname '*token-rout*' | grep -q ."
  echo "" | tee -a "$QA_LOG"

  # ---------------------------------------------------------
  # SANDBOXING LAYER (conditional on sandbox-* prefix)
  # ---------------------------------------------------------
  echo "--- Sandboxing Layer (conditional) ---" | tee -a "$QA_LOG"
  if find "$PROJECT_ROOT" -maxdepth 2 -iname 'sandbox-*' | grep -q .; then
    check "sandbox layer module exists" \
      "find '$PROJECT_ROOT' -maxdepth 3 -iname '*sandbox*' | grep -q ."
    check "sandbox hook registered in .claude/hooks" \
      "grep -rl 'sandbox' '$PROJECT_ROOT/.claude/hooks' 2>/dev/null | grep -q ."
  else
    echo "  [SKIP] no sandbox-* prefix detected, layer not expected" | tee -a "$QA_LOG"
  fi
  echo "" | tee -a "$QA_LOG"
fi

# ---------------------------------------------------------
# PHASE 2: Doc + Visual auto-gen (triggered on first working build)
# ---------------------------------------------------------
if [[ "$PHASE" == "2" || "$PHASE" == "all" ]]; then
  echo "--- Phase 2: Doc / Visual Auto-Gen ---" | tee -a "$QA_LOG"
  check "DOCUMENTATION/ has generated content" \
    "[ \"\$(ls -A '$PROJECT_ROOT/DOCUMENTATION' 2>/dev/null)\" ]"
  check "visual surface artifact exists (base.html or surfaces output)" \
    "find '$PROJECT_ROOT' -maxdepth 4 -iname 'base.html' -o -iname 'visual*.html' | grep -q ."
  echo "" | tee -a "$QA_LOG"
fi

# ---------------------------------------------------------
# SUMMARY
# ---------------------------------------------------------
echo "=== Summary ===" | tee -a "$QA_LOG"
echo "Pass: $PASS  Fail: $FAIL" | tee -a "$QA_LOG"
echo "Log written to: $QA_LOG" | tee -a "$QA_LOG"

if [[ "$FAIL" -gt 0 ]]; then
  echo "" | tee -a "$QA_LOG"
  echo "Bootstrap QA FAILED. Do not advance phase until fixed." | tee -a "$QA_LOG"
  exit 1
else
  echo "" | tee -a "$QA_LOG"
  echo "Bootstrap QA PASSED. Safe to advance phase." | tee -a "$QA_LOG"
  exit 0
fi
