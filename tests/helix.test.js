/**
 * Helix plan checker tests — run with: node --test tests/helix.test.js
 */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { validate, stop, next } = require('../scripts/helix/helix-check');

const EXAMPLE = path.join(__dirname, '..', 'PLANNING', 'helix', 'checkpoints.example.json');
const load = () => JSON.parse(fs.readFileSync(EXAMPLE, 'utf8'));

test('example plan is valid', () => {
  assert.deepStrictEqual(validate(load()), []);
});

test('schema file is valid JSON with the gate set the checker expects', () => {
  const schema = JSON.parse(fs.readFileSync(path.join(path.dirname(EXAMPLE), 'checkpoints.schema.json'), 'utf8'));
  const gates = schema.$defs.checkpoint.properties.gates.required;
  assert.deepStrictEqual(gates, ['g1_behavior', 'g2_visual', 'g3_review_a', 'g3_review_b', 'g4_human']);
});

test('rejects long checkpoint titles', () => {
  const plan = load();
  plan.checkpoints[1].title = 'Cart drawer opens and shows line items with totals';
  assert.match(validate(plan).join('\n'), /few words/);
});

test('rejects skipping G2 on a UI checkpoint', () => {
  const plan = load();
  plan.checkpoints[1].gates.g2_visual = { status: 'skipped', reason: 'lazy' };
  assert.match(validate(plan).join('\n'), /UI checkpoints must pass G2/);
});

test('rejects skipping any gate other than G2', () => {
  const plan = load();
  plan.checkpoints[2].gates.g3_review_b = { status: 'skipped', reason: 'no time' };
  assert.match(validate(plan).join('\n'), /cannot be skipped/);
});

test('rejects committed checkpoint whose reviewers did not both pass', () => {
  const plan = load();
  plan.checkpoints[0].gates.g3_review_b = { status: 'fail', reason: 'BLOCK: missing error state' };
  assert.match(validate(plan).join('\n'), /G1–G3 have not all passed/);
});

test('rejects work starting before the sequence is approved', () => {
  const plan = load();
  plan.approval.sequence_approved = false;
  assert.match(validate(plan).join('\n'), /requires approval.sequence_approved/);
});

test('rejects forward dependencies', () => {
  const plan = load();
  plan.checkpoints[1].depends_on = ['CP-03'];
  assert.match(validate(plan).join('\n'), /EARLIER checkpoint/);
});

test('stop: gates_passed true, committed false when SHA is not in git', () => {
  const plan = load();
  plan.checkpoints[0].commit = 'deadbeefdeadbeef';
  const r = stop(plan, 'CP-01');
  assert.strictEqual(r.gates_passed, true);
  assert.strictEqual(r.checkpoint_committed, false);
  assert.strictEqual(r.done, false);
});

test('stop: non-UI checkpoint may pass with G2 skipped', () => {
  const plan = load();
  const cp = plan.checkpoints[2];
  for (const g of ['g1_behavior', 'g3_review_a', 'g3_review_b']) cp.gates[g] = { status: 'pass' };
  assert.strictEqual(stop(plan, 'CP-03').gates_passed, true);
});

test('stop: INVALID visual evidence blocks', () => {
  const plan = load();
  plan.checkpoints[0].gates.g2_visual = { status: 'invalid', reason: 'reference screenshot 404' };
  assert.deepStrictEqual(stop(plan, 'CP-01').failing_gates, ['g2_visual']);
});

test('next: returns eligible checkpoints in order', () => {
  assert.deepStrictEqual(next(load(), 5), { eligible: ['CP-02', 'CP-03'], halted_by: null });
});

test('next: halts at a blocked checkpoint', () => {
  const plan = load();
  plan.checkpoints[1].status = 'blocked';
  plan.checkpoints[1].blocked_reason = 'convergence budget exhausted';
  const r = next(plan, 5);
  assert.deepStrictEqual(r.eligible, []);
  assert.match(r.halted_by, /CP-02 is blocked/);
});

test('next: nothing runs until the sequence is approved', () => {
  const plan = load();
  plan.approval.sequence_approved = false;
  assert.deepStrictEqual(next(plan, 3).eligible, []);
});

test('stop: without a recorded SHA, falls back to commit subject lookup', () => {
  const plan = load();
  delete plan.checkpoints[0].commit;
  assert.strictEqual(stop(plan, 'CP-01').checkpoint_committed, false);
});
