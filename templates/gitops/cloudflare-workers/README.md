# GitOps for Cloudflare Workers

The Organized Codebase GitOps pack for any project that deploys a Cloudflare Worker. It follows the same rules as
[podcast-agent's GitOps](https://github.com/Organized-AI/podcast-agent/blob/main/docs/GITOPS.md), with Worker versions
in place of image digests and `wrangler versions deploy` in place of an Argo CD sync.

```bash
just add-gitops            # from the project root (needs a wrangler.jsonc); fills in the worker, account and owner
```

What it adds:

| Path | What it is |
|---|---|
| `.github/workflows/ci.yml` | Every PR and push: `wrangler deploy --dry-run`, `npm test`, env-file shape, secret scan |
| `.github/workflows/security.yml` | CodeQL and dependency review |
| `.github/workflows/release.yml` | Merge to main: sync staging (if `env.staging` exists), e2e on staging, upload ONE production version, open "Deploy <sha> to production" |
| `.github/workflows/deploy.yml` | Merging that PR: environment `production` (required reviewer), migrate, `wrangler versions deploy`, e2e on production |
| `.github/workflows/e2e-nightly.yml` | The e2e suite against production every night; a failure opens an issue |
| `scripts/gitops/{upload,promote,sync}.sh` | The same steps by hand, still through Git (no Cloudflare token in CI needed) |
| `scripts/check.mjs` | The checks that need no Cloudflare account |
| `tests/e2e/smoke.mjs` | A starting e2e: the Worker answers and logs. Replace with one test per platform your users connect from |
| `deploy/envs/production.json` | The one file automation writes: the production version id |
| `docs/GITOPS.md`, `docs/OBSERVABILITY.md` | How it works, one-time setup, logs and traces |

The full worked example, with a suite that tests every way attendees connect (REST, browser, Cloudflare Worker, MCP
clients, Pi) and checks Workers Logs, D1 audit rows and AI Gateway logs, is
[Organized-AI/jev-pi-deal-desk](https://github.com/Organized-AI/jev-pi-deal-desk).
