# Changelog

All notable changes to Organized Codebase. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and versions follow [Semantic Versioning](https://semver.org/). Entries use the Fact + Context pattern from
[DOCUMENTATION/CHANGELOG-STANDARDS.md](DOCUMENTATION/CHANGELOG-STANDARDS.md). A release is a `vX.Y.Z` tag on `main`;
see [DOCUMENTATION/GITOPS.md](DOCUMENTATION/GITOPS.md).

## [Unreleased]

### Added

- PR Gate (`.github/workflows/ci.yml`) on every pull request and push to `main`: `npm ci`, the repository structure
  check, the hermetic test suite, and the version/changelog check. Branch protection requires only the final
  "PR Gate" job, so new jobs can be added without touching repository settings
- Security workflow: CodeQL (JavaScript/TypeScript and Actions), gitleaks over the full history, zizmor for workflow
  injection and permission issues, and dependency review on pull requests. Findings fail the run, so a leaked key or
  a vulnerable new dependency stops the merge
- OpenSSF Scorecard, Dependabot (npm and GitHub Actions, weekly, 7-day cooldown), CODEOWNERS and a pull request
  template, matching Organized-AI/podcast-agent
- Release workflow: pushing tag `vX.Y.Z` on `main` checks the tag against `package.json` and this file, then
  publishes a GitHub Release from the matching section. Nothing is released by hand
- `npm run check` (`scripts/ci/check.mjs`): every JSON and YAML file parses, every skill, agent and command has valid
  frontmatter, skill names match their directories, shell scripts pass `bash -n`, and the example Helix plan
  validates. Runs offline in under a second, so it is safe to run before every commit
- `DOCUMENTATION/GITOPS.md`: how changes reach `main`, how releases work, and the one-time repository setup

### Changed

- `npm test` runs the hermetic Helix suite (`node --test tests/helix.test.js`). The provider benchmark needs API keys
  and network, so it stays under `npm run benchmark` and is no longer what `/verify` and CI call "tests"
- The Claude Code changelog sync opens or updates a pull request (`bot/claude-code-changelog`) instead of pushing to
  `main`, so every change to `main`, including bot changes, passes the PR Gate

### Security

- `.env.example` held what look like a real OpenRouter key and a real GLM key, committed in `ff46fe2` (2025-12-02).
  The values are now empty like every other key in the file. Both keys must be revoked at their providers: the
  repository is public, so they stay readable in its history. Their two history findings are recorded in
  `.gitleaksignore` so the full-history scan fails only on new leaks
- The Cloudflare Workers GitOps template (`templates/gitops/cloudflare-workers`) passes zizmor: every action pinned to
  a commit SHA, no checkout keeps credentials (the production pull request pushes with `gh auth setup-git` instead),
  `release.yml` grants write permissions only to the job that opens the pull request, the version id reaches the shell
  through `env`, and Dependabot waits 7 days. Every new Workers project inherits these defaults
- Dependency review accepts two advisories brought in by the corrected lockfile, each with its reason and way out in
  `.github/dependency-review-config.yml`: GHSA-c475-qrg2-pj4r (`basic-ftp` 5.x, reachable only through
  `apify-client`'s proxy agent with an `ftp://` proxy) and GHSA-mrhx-c7xc-m3w5 (`zod` < 4.6.6, pulled in by the
  `kata` dev tool; no code here imports `zod`). Both fixes are major versions outside their parents' ranges. Keeping
  the settings in that file means a future exception is a plain reviewed change, not a workflow edit

### Fixed

- `package-lock.json` was out of sync with `package.json` (missing `@codevibesmatter/kata`), so `npm ci` failed on
  every clean checkout. Reproducible installs are what CI and Dependabot depend on
- Four agent definitions and one command had unquoted descriptions containing `: `, which strict YAML parsers reject.
  Claude Code tolerated them; other tools that read the frontmatter did not

## [1.0.0]

- Baseline: everything on `main` up to the merge of PR #17 (`f00c693`), before this changelog was kept
