/**
 * Pure verdict logic for the Helix G2 visual gate. No Workers APIs here so it runs under `node --test`.
 *
 * The model proposes; this module decides. Gemini's raw verdict is advisory — the gate verdict is
 * derived from the normalized diffs, and any diff not explicitly cleared is a blocker by default.
 */

export type Verdict = 'PASS' | 'FAIL' | 'INVALID';
export type Severity = 'critical' | 'major' | 'minor' | 'cosmetic';

export interface Diff {
  severity: Severity;
  location: string;
  description: string;
  blocking: boolean;
}

export interface GateResult {
  verdict: Verdict;
  diffs: Diff[];
  summary: string;
  model_verdict?: string;
}

const SEVERITIES: Severity[] = ['critical', 'major', 'minor', 'cosmetic'];
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/** JSON schema handed to Gemini as responseSchema (OpenAPI subset). */
export const GEMINI_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    verdict: { type: 'STRING', enum: ['PASS', 'FAIL', 'INVALID'] },
    summary: { type: 'STRING' },
    diffs: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          severity: { type: 'STRING', enum: SEVERITIES },
          location: { type: 'STRING' },
          description: { type: 'STRING' },
          blocking: { type: 'BOOLEAN' },
        },
        required: ['severity', 'location', 'description', 'blocking'],
      },
    },
  },
  required: ['verdict', 'summary', 'diffs'],
};

export function buildPrompt(scope: string): string {
  return [
    'You are the visual gate in a reference-as-spec build loop.',
    'Image 1 is the REFERENCE (the spec). Image 2 is the IMPLEMENTATION.',
    `Judge ONLY this scope: ${scope}`,
    'List every visible difference inside the scope: layout, spacing, alignment, typography, color,',
    'copy/text, icons, imagery, missing or extra elements, and state (e.g. empty vs populated).',
    'Ignore: anti-aliasing, sub-pixel rendering, and dynamic content that obviously differs by data',
    '(timestamps, random product images) unless its layout differs.',
    'Severity: critical = wrong/missing element or broken layout; major = clearly noticeable to a user;',
    'minor = noticeable on close inspection; cosmetic = pixel-level.',
    'Set blocking=true unless a user fluent in the reference would not notice the difference.',
    'verdict: PASS if no blocking diffs; FAIL if any; INVALID if the images cannot be compared',
    '(different pages, error screen, blank/loading screenshot, different viewport).',
    'Respond with JSON only.',
  ].join('\n');
}

/**
 * Normalize one model diff. Blocker by default: a diff is non-blocking only when the model explicitly
 * says blocking=false AND the severity is minor/cosmetic AND defaultBlocking allows clearing it.
 */
export function normalizeDiff(raw: unknown, defaultBlocking = true): Diff | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Record<string, unknown>;
  const description = typeof d.description === 'string' ? d.description.trim() : '';
  if (!description) return null;
  const severity: Severity = SEVERITIES.includes(d.severity as Severity) ? (d.severity as Severity) : 'major';
  const lowSeverity = severity === 'minor' || severity === 'cosmetic';
  const explicitlyCleared = d.blocking === false && lowSeverity;
  const blocking = defaultBlocking ? !explicitlyCleared : d.blocking === true || !lowSeverity;
  return {
    severity,
    location: typeof d.location === 'string' && d.location.trim() ? d.location.trim() : 'unspecified',
    description,
    blocking,
  };
}

/** Derive the gate verdict from the model's JSON text. Unparseable or contradictory output is INVALID. */
export function deriveVerdict(modelText: string, defaultBlocking = true): GateResult {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(modelText);
  } catch {
    return { verdict: 'INVALID', diffs: [], summary: 'Model returned non-JSON output' };
  }
  const modelVerdict = typeof parsed.verdict === 'string' ? parsed.verdict.toUpperCase() : undefined;
  const summary = typeof parsed.summary === 'string' ? parsed.summary : '';
  const diffs = (Array.isArray(parsed.diffs) ? parsed.diffs : [])
    .map((d) => normalizeDiff(d, defaultBlocking))
    .filter((d): d is Diff => d !== null);

  if (modelVerdict === 'INVALID') return { verdict: 'INVALID', diffs, summary, model_verdict: modelVerdict };
  if (diffs.some((d) => d.blocking)) return { verdict: 'FAIL', diffs, summary, model_verdict: modelVerdict };
  if (modelVerdict === 'FAIL') {
    // The model says FAIL but gave no blocking diff to act on — not actionable, so not a pass either.
    return {
      verdict: 'INVALID',
      diffs,
      summary: `Model verdict FAIL without a blocking diff. ${summary}`.trim(),
      model_verdict: modelVerdict,
    };
  }
  if (modelVerdict !== 'PASS') {
    return { verdict: 'INVALID', diffs, summary: 'Model verdict missing or unrecognized', model_verdict: modelVerdict };
  }
  return { verdict: 'PASS', diffs, summary, model_verdict: modelVerdict };
}

/** Decode base64 (optionally a data: URL) and check it's a PNG. Returns null if not. */
export function decodePng(input: unknown): Uint8Array | null {
  if (typeof input !== 'string' || input.length === 0) return null;
  const b64 = input.startsWith('data:') ? input.slice(input.indexOf(',') + 1) : input;
  let bytes: Uint8Array;
  try {
    const bin = atob(b64.replace(/\s/g, ''));
    bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  } catch {
    return null;
  }
  if (bytes.length < PNG_SIGNATURE.length) return null;
  return PNG_SIGNATURE.every((b, i) => bytes[i] === b) ? bytes : null;
}

export function toBase64(bytes: Uint8Array): string {
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}
