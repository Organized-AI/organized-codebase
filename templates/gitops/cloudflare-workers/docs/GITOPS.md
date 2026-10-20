# GitOps

Git is the only way anything reaches Cloudflare. `main` is what staging runs. `deploy/envs/production.json` is what
production runs: one Worker version id, written only by automation and changed only by merging a pull request.

```
 pull request ─► ci: wrangler deploy --dry-run, unit tests, env-file shape, secret scan
               └► security: CodeQL, dependency review
 merge to main ─► release: migrate + deploy staging ─► e2e on staging
                           └► upload ONE production version (tag = commit, not deployed)
                              └► pull request "Deploy <sha> to production"  (only deploy/envs/production.json)
 merge that PR ─► deploy: environment `production` (required reviewer) ─► migrate ─► wrangler versions deploy <id>@100%
                           └► e2e on production
 every night   ─► e2e-nightly against production; a failure opens an issue
```

## Rules

- **Build once.** The production version is uploaded once from the merged commit and promoted by id, never rebuilt.
- **Production moves only by pull request.** Rolling back is reverting the deploy pull request.
- **Migrations are additive.** They run before the new version takes traffic; the running version keeps working.
- **No secrets in Git.** Worker secrets live in Cloudflare (`wrangler secret put`), CI secrets in GitHub.
- **Every platform passes the e2e suite** before and after a production deploy: one test per way users connect.

## One-time setup

| Where | What |
|---|---|
| Repository secret `CLOUDFLARE_API_TOKEN` | Account: Workers Scripts Edit, D1 Edit (if used), Workers Tail Read, Workers Observability Read, Account Settings Read |
| Repository secret `GITOPS_TOKEN` (optional) | A GitHub App or fine-grained token, so deploy pull requests trigger checks |
| Environments | `staging` (no reviewers), `production` (deploys only from `main`; required reviewer) |
| Branch protection on `main` | `ci / check` must pass |
| Private repo on the free plan | Required reviewers, branch protection, CodeQL and dependency review are paid features there. The deploy pull request is still the gate, and `security` falls back to `npm audit`. See "Reviewers and protection" below |
| `wrangler.jsonc` | Optional `env.staging` with its own Worker name and its own D1 database |

### Reviewers and protection

On a public repository, or any repository on a paid plan:

```bash
R=repos/<owner>/<repo>; ID=$(gh api users/<reviewer> --jq .id)
gh api -X PUT $R/environments/staging --input - <<< '{}'
gh api -X PUT $R/environments/production --input - <<< "{\"reviewers\":[{\"type\":\"User\",\"id\":$ID}],\"deployment_branch_policy\":{\"protected_branches\":false,\"custom_branch_policies\":true}}"
gh api -X POST $R/environments/production/deployment-branch-policies -f name=main -f type=branch
gh api -X PUT $R/branches/main/protection --input - <<< '{"required_status_checks":{"strict":true,"contexts":["check"]},"enforce_admins":false,"required_pull_request_reviews":null,"restrictions":null}'
gh api -X PUT $R/actions/permissions/workflow -f default_workflow_permissions=read -F can_approve_pull_request_reviews=true
```

On a private repository on the free plan, the reviewer and protection calls return 422/403. Keep the environments and the branch policy (those work), and treat merging the deploy pull request as the approval.

## By hand (no Cloudflare token in CI, or from a laptop)

```bash
bash scripts/gitops/upload.sh                 # prints <version-id>; the tree must be committed
bash scripts/gitops/promote.sh <version-id>   # opens "Deploy <sha> to production"
# merge the pull request, then:
bash scripts/gitops/sync.sh                   # production := deploy/envs/production.json on origin/main, then e2e
```
