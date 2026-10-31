# GitOps

Git is the only way anything reaches `main`, and a tag on `main` is the only way anything is released. Modeled on
[Organized-AI/podcast-agent's GitOps](https://github.com/Organized-AI/podcast-agent/blob/main/docs/GITOPS.md). This
repository ships skills, commands, agents and templates rather than a running service, so it keeps podcast-agent's
pull request gate, security scanning and tag-driven releases, and has no image or environment to promote.

```
 pull request ─► ci: npm ci, structure check, hermetic tests, version check ─► "PR Gate" (required)
               └► security: CodeQL, gitleaks (full history), zizmor, dependency review
 merge to main ─► ci and security again on main; scorecard
 tag vX.Y.Z    ─► release: tag on main? PR Gate passed on that commit? tag = package.json = CHANGELOG?
                  └► GitHub Release, notes from the CHANGELOG.md section
 every 6 hours ─► changelog sync: upstream Claude Code changelog changed? ─► pull request (never a push)
 every Monday  ─► Dependabot pull requests (npm, GitHub Actions; 7-day cooldown) and the weekly security scan
```

## Rules

- **Every change to `main` is a pull request**, including bot changes. The changelog sync and Dependabot open pull
  requests; no workflow pushes to `main`.
- **One required check.** Branch protection requires only `PR Gate`, the last job in `ci.yml`, which fails unless every
  job before it succeeded. New jobs join the gate by being added to its `needs:` list, with no settings change.
- **Release what was tested.** `release.yml` refuses a tag unless the PR Gate passed on that exact commit on `main`.
- **Versions agree.** The tag, `package.json` and a `CHANGELOG.md` section must match before anything is published.
- **Pinned and least-privilege workflows.** Every action is pinned to a commit SHA with its tag in a comment,
  checkouts do not persist credentials, and each job asks only for the permissions it uses. zizmor enforces this.
- **No secrets in Git.** gitleaks scans the full history on every pull request.
- **Exceptions are code-reviewed and explain themselves.** A history finding goes in `.gitleaksignore` only after the
  secret is revoked. An accepted dependency advisory goes in `allow-ghsas` in `.github/dependency-review-config.yml`
  with its reason and the change that will let it be removed. Both arrive by pull request like everything else.

## Layout

| Path | What it is |
|---|---|
| `.github/workflows/ci.yml` | The PR Gate: `npm ci --ignore-scripts`, `npm run check`, `npm test`, `npm run version:check` |
| `.github/workflows/security.yml` | CodeQL (JavaScript/TypeScript and Actions), gitleaks, zizmor, dependency review |
| `.github/workflows/scorecard.yml` | OpenSSF Scorecard, published for the badge |
| `.github/workflows/release.yml` | Tag `vX.Y.Z` → checks → GitHub Release |
| `.github/workflows/sync-claude-changelog.yml` | Upstream Claude Code changelog → pull request on `bot/claude-code-changelog` |
| `.github/dependabot.yml` | Weekly npm and GitHub Actions updates, grouped, with a 7-day cooldown |
| `.github/dependency-review-config.yml` | Dependency review severity, denied licenses and reviewed exceptions |
| `.gitleaksignore` | History findings for secrets that have been revoked |
| `.github/CODEOWNERS`, `.github/PULL_REQUEST_TEMPLATE.md` | Review routing and the Purpose / Test plan / Test result template |
| `scripts/ci/check.mjs` | Offline structure check: JSON, YAML, skill/agent/command frontmatter, `bash -n`, the Helix plan |
| `scripts/ci/check-version.mjs` | Version and changelog agreement; prints release notes with `--notes` |
| `CHANGELOG.md` | Keep a Changelog; every user-visible change adds a line under `[Unreleased]` |

## Checks on every pull request

Run the same checks locally before pushing:

```bash
npm ci --ignore-scripts
npm run check          # structure
npm test               # hermetic tests (Helix); the provider benchmark is `npm run benchmark` and needs API keys
npm run version:check  # package.json and CHANGELOG.md agree
```

## Releasing

1. In a pull request, move the `[Unreleased]` entries under a new `## [X.Y.Z] - YYYY-MM-DD` heading, add an empty
   `[Unreleased]`, and set `"version": "X.Y.Z"` in `package.json`. Merge it.
2. Tag the merge commit and push the tag:

   ```bash
   git switch main && git pull --ff-only
   git tag -a vX.Y.Z -m "vX.Y.Z" && git push origin vX.Y.Z
   ```

3. `release.yml` publishes the GitHub Release. If a check fails, nothing is published; delete the tag, fix it in a
   pull request, and tag again.

## Bot pull requests

The changelog sync opens its pull requests as the `organized-ai-gitops` GitHub App when the repository variable
`DEPLOY_APP_ID` and the secret `DEPLOY_APP_PRIVATE_KEY` are set, the same App podcast-agent uses. Its pull requests
trigger the normal checks. Without the App, the workflow token is used; GitHub runs no workflows for pull requests
opened that way, so the job dispatches `ci.yml` and `security.yml` on the bot branch itself. That fallback needs
**Settings → Actions → General → Allow GitHub Actions to create and approve pull requests**.

## One-time setup

Run as a repository admin (this repository is public, so all of it is free):

```bash
R=repos/Organized-AI/organized-codebase
# main: the PR Gate must pass, branches must be up to date, admins included
gh api -X PUT $R/branches/main/protection --input - <<< '{"required_status_checks":{"strict":true,"contexts":["PR Gate"]},"enforce_admins":true,"required_pull_request_reviews":null,"restrictions":null,"allow_force_pushes":false,"allow_deletions":false}'
# workflow tokens are read-only by default; bot pull requests are allowed (for the fallback above)
gh api -X PUT $R/actions/permissions/workflow -f default_workflow_permissions=read -F can_approve_pull_request_reviews=true
# merged branches are deleted; tidy history
gh api -X PATCH $R -F delete_branch_on_merge=true
```

`PR Gate` appears as a status check only after `ci.yml` has run once on a pull request, so set protection after the
first gated pull request runs. `required_pull_request_reviews` stays `null` because the repository has one maintainer;
CODEOWNERS still requests that review on every pull request.
