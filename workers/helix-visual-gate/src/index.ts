/**
 * helix-visual-gate — Helix G2 visual gate.
 *
 * POST /gate            {reference_png, impl_png, scope, checkpoint?}  → {verdict, diffs, ...}
 * GET  /runs/:cp/:id    → stored verdict.json from R2
 * GET  /health
 *
 * Screenshots and verdicts are stored in R2 under {checkpoint}/{run_id}/.
 */

import { buildPrompt, decodePng, deriveVerdict, GEMINI_RESPONSE_SCHEMA, toBase64, type GateResult } from './verdict.ts';

export interface Env {
  HELIX_ARTIFACTS: R2Bucket;
  GEMINI_API_KEY: string;
  HELIX_GATE_TOKEN: string;
  GEMINI_MODEL?: string;
  DEFAULT_BLOCKING?: string;
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const CHECKPOINT_RE = /^CP-[0-9]{2,3}$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), { status, headers: { 'content-type': 'application/json' } });

function authorized(req: Request, env: Env): boolean {
  if (!env.HELIX_GATE_TOKEN) return false;
  return req.headers.get('authorization') === `Bearer ${env.HELIX_GATE_TOKEN}`;
}

async function callGemini(env: Env, scope: string, ref: Uint8Array, impl: Uint8Array): Promise<string> {
  const model = env.GEMINI_MODEL || 'gemini-2.5-pro';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: buildPrompt(scope) },
            { text: 'Image 1 — REFERENCE:' },
            { inline_data: { mime_type: 'image/png', data: toBase64(ref) } },
            { text: 'Image 2 — IMPLEMENTATION:' },
            { inline_data: { mime_type: 'image/png', data: toBase64(impl) } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0,
        responseMimeType: 'application/json',
        responseSchema: GEMINI_RESPONSE_SCHEMA,
      },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 500)}`);
  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
  if (!text) throw new Error('Gemini returned no candidate text');
  return text;
}

async function handleGate(req: Request, env: Env): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ verdict: 'INVALID', diffs: [], summary: 'Body must be JSON' }, 400);
  }

  const scope = typeof body.scope === 'string' ? body.scope.trim() : '';
  const checkpoint = typeof body.checkpoint === 'string' && CHECKPOINT_RE.test(body.checkpoint) ? body.checkpoint : 'adhoc';
  const ref = decodePng(body.reference_png);
  const impl = decodePng(body.impl_png);

  const problems: string[] = [];
  if (!scope) problems.push('scope is required');
  if (!ref) problems.push('reference_png must be base64 PNG');
  if (!impl) problems.push('impl_png must be base64 PNG');
  if (ref && ref.length > MAX_IMAGE_BYTES) problems.push('reference_png exceeds 8MB');
  if (impl && impl.length > MAX_IMAGE_BYTES) problems.push('impl_png exceeds 8MB');
  if (problems.length) return json({ verdict: 'INVALID', diffs: [], summary: problems.join('; ') }, 422);

  const runId = `${new Date().toISOString().replace(/[:.]/g, '-')}-${crypto.randomUUID().slice(0, 8)}`;
  const prefix = `${checkpoint}/${runId}`;
  await Promise.all([
    env.HELIX_ARTIFACTS.put(`${prefix}/reference.png`, ref!, { httpMetadata: { contentType: 'image/png' } }),
    env.HELIX_ARTIFACTS.put(`${prefix}/impl.png`, impl!, { httpMetadata: { contentType: 'image/png' } }),
  ]);

  let result: GateResult;
  try {
    const text = await callGemini(env, scope, ref!, impl!);
    result = deriveVerdict(text, env.DEFAULT_BLOCKING !== 'false');
  } catch (e) {
    // A gate that couldn't judge must never read as a pass.
    result = { verdict: 'INVALID', diffs: [], summary: `Visual model error: ${(e as Error).message}` };
  }

  const record = {
    ...result,
    checkpoint,
    run_id: runId,
    scope,
    model: env.GEMINI_MODEL || 'gemini-2.5-pro',
    artifacts: {
      reference: `${prefix}/reference.png`,
      impl: `${prefix}/impl.png`,
      verdict: `${prefix}/verdict.json`,
    },
    at: new Date().toISOString(),
  };
  await env.HELIX_ARTIFACTS.put(`${prefix}/verdict.json`, JSON.stringify(record, null, 2), {
    httpMetadata: { contentType: 'application/json' },
  });
  return json(record);
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === '/health') return json({ ok: true });
    if (!authorized(req, env)) return json({ error: 'unauthorized' }, 401);

    if (req.method === 'POST' && url.pathname === '/gate') return handleGate(req, env);

    const run = url.pathname.match(/^\/runs\/([^/]+)\/([^/]+)$/);
    if (req.method === 'GET' && run) {
      const obj = await env.HELIX_ARTIFACTS.get(`${run[1]}/${run[2]}/verdict.json`);
      return obj ? new Response(obj.body, { headers: { 'content-type': 'application/json' } }) : json({ error: 'not found' }, 404);
    }
    return json({ error: 'not found' }, 404);
  },
} satisfies ExportedHandler<Env>;
