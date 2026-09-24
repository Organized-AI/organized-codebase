import test from 'node:test';
import assert from 'node:assert';
import { decodePng, deriveVerdict, normalizeDiff } from '../src/verdict.ts';

const diff = (o: Record<string, unknown>) => ({ severity: 'major', location: 'header', description: 'logo missing', blocking: true, ...o });

test('PASS when model passes with no diffs', () => {
  assert.strictEqual(deriveVerdict(JSON.stringify({ verdict: 'PASS', summary: 'match', diffs: [] })).verdict, 'PASS');
});

test('blocking diff forces FAIL even if model says PASS', () => {
  const r = deriveVerdict(JSON.stringify({ verdict: 'PASS', summary: '', diffs: [diff({})] }));
  assert.strictEqual(r.verdict, 'FAIL');
});

test('blocker by default: a major diff marked non-blocking still blocks', () => {
  assert.strictEqual(normalizeDiff(diff({ blocking: false }))!.blocking, true);
});

test('blocker by default: diff with missing blocking flag blocks', () => {
  const { blocking, ...rest } = diff({ severity: 'cosmetic' });
  assert.strictEqual(normalizeDiff(rest)!.blocking, true);
});

test('explicitly cleared cosmetic diff does not block', () => {
  const r = deriveVerdict(JSON.stringify({ verdict: 'PASS', summary: '', diffs: [diff({ severity: 'cosmetic', blocking: false })] }));
  assert.strictEqual(r.verdict, 'PASS');
  assert.strictEqual(r.diffs[0].blocking, false);
});

test('DEFAULT_BLOCKING=false: unflagged minor diff is cleared, major still blocks', () => {
  const { blocking: _b, ...minor } = diff({ severity: 'minor' });
  assert.strictEqual(normalizeDiff(minor, false)!.blocking, false);
  assert.strictEqual(normalizeDiff(diff({ blocking: false }), false)!.blocking, true);
});

test('unknown severity is treated as major', () => {
  assert.strictEqual(normalizeDiff(diff({ severity: 'huge', blocking: false }))!.severity, 'major');
});

test('non-JSON model output is INVALID', () => {
  assert.strictEqual(deriveVerdict('Looks good to me!').verdict, 'INVALID');
});

test('model INVALID stays INVALID', () => {
  assert.strictEqual(deriveVerdict(JSON.stringify({ verdict: 'INVALID', summary: 'blank screenshot', diffs: [] })).verdict, 'INVALID');
});

test('FAIL without any blocking diff is INVALID (not actionable, not a pass)', () => {
  assert.strictEqual(deriveVerdict(JSON.stringify({ verdict: 'FAIL', summary: '', diffs: [] })).verdict, 'INVALID');
});

test('missing verdict is INVALID', () => {
  assert.strictEqual(deriveVerdict(JSON.stringify({ diffs: [] })).verdict, 'INVALID');
});

test('diffs without description are dropped', () => {
  assert.strictEqual(deriveVerdict(JSON.stringify({ verdict: 'PASS', summary: '', diffs: [{ severity: 'major' }] })).diffs.length, 0);
});

test('decodePng accepts PNG base64 and data URLs, rejects others', () => {
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]).toString('base64');
  assert.ok(decodePng(png));
  assert.ok(decodePng(`data:image/png;base64,${png}`));
  assert.strictEqual(decodePng(Buffer.from('GIF89a....').toString('base64')), null);
  assert.strictEqual(decodePng('!!!not base64'), null);
  assert.strictEqual(decodePng(undefined), null);
});
