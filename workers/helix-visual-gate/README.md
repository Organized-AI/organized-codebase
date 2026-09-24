# helix-visual-gate

Cloudflare Worker for **Helix G2 (visual gate)**. Compares a reference screenshot with an
implementation screenshot using Gemini, derives a blocking verdict, and stores screenshots +
verdict in R2.

```
POST /gate  {reference_png, impl_png, scope, checkpoint?}
      │
      ├─ validate PNGs (else 422 INVALID)
      ├─ R2: {checkpoint}/{run_id}/reference.png, impl.png
      ├─ Gemini (temperature 0, JSON responseSchema)
      ├─ deriveVerdict()  ← the Worker decides, not the model
      └─ R2: {checkpoint}/{run_id}/verdict.json   → response
```

## API

All routes except `/health` require `Authorization: Bearer $HELIX_GATE_TOKEN`.

### `POST /gate`

| Field | Type | Notes |
|-------|------|-------|
| `reference_png` | string | Base64 PNG (or `data:image/png;base64,…`). The spec. ≤ 8 MB |
| `impl_png` | string | Base64 PNG of the implementation, same route/viewport/data. ≤ 8 MB |
| `scope` | string | What to judge, e.g. `"cart drawer, 390x844, 1 item"` |
| `checkpoint` | string | Optional `CP-NN`, used as the R2 prefix |

Response:

```json
{
  "verdict": "FAIL",
  "diffs": [
    { "severity": "major", "location": "drawer footer", "description": "Checkout button is outlined; reference is solid black", "blocking": true },
    { "severity": "cosmetic", "location": "drawer header", "description": "1px baseline shift on title", "blocking": false }
  ],
  "summary": "…",
  "model_verdict": "FAIL",
  "checkpoint": "CP-02",
  "run_id": "2026-09-24T18-47-47-504Z-35298812",
  "artifacts": { "reference": "CP-02/…/reference.png", "impl": "CP-02/…/impl.png", "verdict": "CP-02/…/verdict.json" }
}
```

### `GET /runs/:checkpoint/:run_id` — stored `verdict.json`
### `GET /health`

## Verdict rules — blocker by default

The model's opinion is advisory; `src/verdict.ts` makes the call:

| Condition | Verdict |
|-----------|---------|
| Bad input (not PNG, too big, no scope) | `INVALID` (HTTP 422) |
| Gemini error / non-JSON / missing verdict | `INVALID` |
| Model says `INVALID` (blank, error page, wrong viewport) | `INVALID` |
| Any diff with `blocking: true` | `FAIL` (even if the model said PASS) |
| Model says `FAIL` but lists no blocking diff | `INVALID` (not actionable ≠ pass) |
| Model says `PASS`, no blocking diffs | `PASS` |

**Screenshot diffs are blockers by default.** A diff becomes non-blocking only when the model
explicitly sets `blocking: false` **and** severity is `minor` or `cosmetic`. `critical`/`major`
always block; unknown severities are treated as `major`. Set `DEFAULT_BLOCKING = "false"` to let
unflagged minor/cosmetic diffs through (critical/major still block).

## Setup

```bash
cd workers/helix-visual-gate
npm install
npm run r2:create                         # wrangler r2 bucket create helix-visual-gate-artifacts
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put HELIX_GATE_TOKEN
npm run deploy
```

`GEMINI_MODEL` (default `gemini-2.5-pro`) is a plain var in `wrangler.toml` — bump it when a newer
vision model ships, and re-run a few known PASS/FAIL pairs before trusting it (treat it like `/ablate`
for the gate).

## Local dev & tests

```bash
npm test            # verdict logic (node --test, no Workers runtime needed)
npm run typecheck
npx wrangler dev --var HELIX_GATE_TOKEN:dev --var GEMINI_API_KEY:$GEMINI_API_KEY
```

## Calling it from `/helix-gate`

```bash
curl -sS -X POST "$HELIX_VISUAL_GATE_URL/gate" \
  -H "Authorization: Bearer $HELIX_GATE_TOKEN" -H 'content-type: application/json' \
  -d "{\"checkpoint\":\"CP-02\",\"scope\":\"cart drawer 390x844\",
       \"reference_png\":\"$(base64 -i ref.png)\",\"impl_png\":\"$(base64 -i impl.png)\"}" \
  > PLANNING/helix/evidence/CP-02/g2-visual.json
```

Capture tips (most `INVALID`s are capture problems): same viewport, same seeded data, fonts loaded,
animations finished (`prefers-reduced-motion`), cookie banners dismissed on both sides.
