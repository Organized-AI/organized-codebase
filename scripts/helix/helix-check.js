#!/usr/bin/env node
/**
 * helix-check — verification surface for the Helix convergence loop.
 *
 * Usage:
 *   node scripts/helix/helix-check.js validate [--plan <path>]
 *   node scripts/helix/helix-check.js stop <CP-ID> [--plan <path>]
 *   node scripts/helix/helix-check.js next [N] [--plan <path>]
 *
 * validate  Structural + semantic checks on checkpoints.json (mirrors checkpoints.schema.json
 *           without needing a JSON Schema library, plus rules a schema can't express).
 * stop      Evaluates the kata `helix` mode stop conditions for one checkpoint:
 *           gates_passed (G1, G2, G3a, G3b) and checkpoint_committed (SHA exists in git).
 *           Exit 0 only when both hold.
 * next      Lists up to N checkpoints eligible to run now, in plan order (used by /helix-next).
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DEFAULT_PLAN = 'PLANNING/helix/checkpoints.json';
const GATES = ['g1_behavior', 'g2_visual', 'g3_review_a', 'g3_review_b', 'g4_human'];
const MACHINE_GATES = ['g1_behavior', 'g2_visual', 'g3_review_a', 'g3_review_b'];
const GATE_STATUSES = ['pending', 'pass', 'fail', 'invalid', 'skipped'];
const CP_STATUSES = ['planned', 'in_progress', 'gates_passed', 'committed', 'blocked'];
const CP_ID = /^CP-[0-9]{2,3}$/;
const SHA = /^[0-9a-f]{7,40}$/;
const MAX_TITLE_WORDS = 6;

function loadPlan(planPath) {
  const raw = fs.readFileSync(planPath, 'utf8');
  return JSON.parse(raw);
}

/** A machine gate counts as passed if it passed, or G2 was legitimately skipped for a non-UI checkpoint. */
function gatePassed(cp, gate) {
  const g = cp.gates && cp.gates[gate];
  if (!g) return false;
  if (g.status === 'pass') return true;
  return gate === 'g2_visual' && g.status === 'skipped' && cp.has_ui === false;
}

function machineGatesPassed(cp) {
  return MACHINE_GATES.every((gate) => gatePassed(cp, gate));
}

function validate(plan) {
  const errors = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);

  if (plan.version !== 1) err('version', 'must be 1');
  const ref = plan.reference || {};
  for (const k of ['kind', 'location', 'pinned_at']) {
    if (!ref[k]) err('reference', `missing "${k}" (pin the reference or gates are meaningless)`);
  }
  if (!plan.approval || typeof plan.approval.sequence_approved !== 'boolean') {
    err('approval', 'sequence_approved must be a boolean');
  }
  if (!Array.isArray(plan.checkpoints) || plan.checkpoints.length === 0) {
    err('checkpoints', 'must be a non-empty array');
    return errors;
  }

  const approved = plan.approval && plan.approval.sequence_approved === true;
  const seen = new Set();

  plan.checkpoints.forEach((cp, i) => {
    const where = cp.id || `checkpoints[${i}]`;
    if (!CP_ID.test(cp.id || '')) err(where, 'id must match CP-NN');
    if (seen.has(cp.id)) err(where, 'duplicate id');

    const title = (cp.title || '').trim();
    if (!title) err(where, 'title is required');
    else if (title.split(/\s+/).length > MAX_TITLE_WORDS) {
      err(where, `title must be a few words (<= ${MAX_TITLE_WORDS}); move detail into scope/acceptance`);
    }

    if (!CP_STATUSES.includes(cp.status)) err(where, `status must be one of ${CP_STATUSES.join(', ')}`);
    if (cp.status !== 'planned' && !approved) {
      err(where, `status "${cp.status}" requires approval.sequence_approved = true`);
    }

    for (const dep of cp.depends_on || []) {
      if (!seen.has(dep)) err(where, `depends_on ${dep} must reference an EARLIER checkpoint`);
    }
    seen.add(cp.id);

    const gates = cp.gates || {};
    for (const gate of GATES) {
      const g = gates[gate];
      if (!g) { err(where, `gates.${gate} missing`); continue; }
      if (!GATE_STATUSES.includes(g.status)) err(where, `gates.${gate}.status invalid: ${g.status}`);
      if (['skipped', 'fail', 'invalid'].includes(g.status) && !g.reason) {
        err(where, `gates.${gate} is ${g.status} and needs a reason`);
      }
      if (g.status === 'skipped' && gate !== 'g2_visual') {
        err(where, `gates.${gate} cannot be skipped (only G2 may be skipped, and only for non-UI work)`);
      }
    }
    if (gates.g2_visual && gates.g2_visual.status === 'skipped' && cp.has_ui !== false) {
      err(where, 'G2 visual skipped but has_ui is not false — UI checkpoints must pass G2');
    }

    if (['gates_passed', 'committed'].includes(cp.status) && !machineGatesPassed(cp)) {
      err(where, `status "${cp.status}" but G1–G3 have not all passed`);
    }
    if (cp.status === 'committed') {
      if (!SHA.test(cp.commit || '')) err(where, 'committed checkpoints need a commit SHA');
      const g4 = gates.g4_human && gates.g4_human.status;
      if (!['pass', 'pending'].includes(g4)) {
        err(where, 'committed checkpoints need G4 pass (or pending, in a batched /helix-next run)');
      }
    }
    if (cp.status === 'blocked' && !cp.blocked_reason) err(where, 'blocked checkpoints need blocked_reason');
  });

  return errors;
}

function commitExists(sha) {
  try {
    execFileSync('git', ['cat-file', '-e', `${sha}^{commit}`], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/** The SHA is recorded lazily (in the next checkpoint's commit), so fall back to the commit subject. */
function findCommitBySubject(id) {
  try {
    const out = execFileSync('git', ['log', '--format=%H', '-n', '1', '--fixed-strings', `--grep=feat(helix): ${id} `],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return out.trim() || null;
  } catch {
    return null;
  }
}

function stop(plan, id) {
  const cp = plan.checkpoints.find((c) => c.id === id);
  if (!cp) throw new Error(`checkpoint ${id} not found`);
  const gatesPassed = machineGatesPassed(cp);
  const committed = cp.commit
    ? SHA.test(cp.commit) && commitExists(cp.commit)
    : Boolean(findCommitBySubject(id));
  const failing = MACHINE_GATES.filter((g) => !gatePassed(cp, g));
  return {
    checkpoint: id,
    gates_passed: gatesPassed,
    checkpoint_committed: committed,
    failing_gates: failing,
    g4_human: cp.gates.g4_human.status,
    done: gatesPassed && committed,
  };
}

/** Checkpoints runnable now, in plan order. Deps must be committed or selected earlier in this run. */
function next(plan, n) {
  if (!plan.approval || !plan.approval.sequence_approved) return { eligible: [], halted_by: 'sequence not approved' };
  const committed = new Set(plan.checkpoints.filter((c) => c.status === 'committed').map((c) => c.id));
  const eligible = [];
  for (const cp of plan.checkpoints) {
    if (eligible.length >= n) break;
    if (cp.status === 'committed') continue;
    if (cp.status === 'blocked') return { eligible, halted_by: `${cp.id} is blocked: ${cp.blocked_reason || 'no reason'}` };
    const missing = (cp.depends_on || []).filter((d) => !committed.has(d) && !eligible.includes(d));
    if (missing.length) return { eligible, halted_by: `${cp.id} waits on ${missing.join(', ')}` };
    eligible.push(cp.id);
  }
  return { eligible, halted_by: null };
}

function main(argv) {
  const args = argv.slice(2);
  const planIdx = args.indexOf('--plan');
  const planPath = planIdx >= 0 ? args.splice(planIdx, 2)[1] : DEFAULT_PLAN;
  const [cmd, arg] = args;

  let plan;
  try {
    plan = loadPlan(path.resolve(planPath));
  } catch (e) {
    console.error(`helix-check: cannot read ${planPath}: ${e.message}`);
    return 2;
  }

  if (cmd === 'validate') {
    const errors = validate(plan);
    if (errors.length) {
      console.error(`✗ ${planPath} — ${errors.length} problem(s):`);
      errors.forEach((e) => console.error(`  - ${e}`));
      return 1;
    }
    console.log(`✓ ${planPath} — ${plan.checkpoints.length} checkpoint(s) valid`);
    return 0;
  }
  if (cmd === 'stop') {
    if (!arg) { console.error('usage: helix-check stop <CP-ID>'); return 2; }
    const result = stop(plan, arg);
    console.log(JSON.stringify(result, null, 2));
    return result.done ? 0 : 1;
  }
  if (cmd === 'next') {
    const n = arg ? parseInt(arg, 10) : 1;
    if (!Number.isInteger(n) || n < 1) { console.error('N must be a positive integer'); return 2; }
    console.log(JSON.stringify(next(plan, n), null, 2));
    return 0;
  }
  console.error('usage: helix-check <validate|stop <CP-ID>|next [N]> [--plan <path>]');
  return 2;
}

if (require.main === module) process.exit(main(process.argv));

module.exports = { validate, stop, next, gatePassed, machineGatesPassed };
