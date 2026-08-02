# Git Worktrees in Organized Codebase — The Parallel Branch Process

This guide ingests the August 1, 2026 David Ondrej short **“My Biggest AI Mistake...”** and turns it into an Organized Codebase operating process.

The short version: **parallel agents should not share one mutable branch.** The failure mode is not just messy diffs. It is release coupling:
- unrelated features landing together,
- database migrations mixed with low-risk docs or UI work,
- manual QA scopes bleeding together,
- and hours wasted untangling commits before a safe deploy.

For Organized Codebase, the durable rule is:
> **one outcome, one branch, one worktree, one verification loop.**

---

## Source packet

### Commentary source
- **David Ondrej:** [My Biggest AI Mistake...](https://www.youtube.com/shorts/FtyePPCE5q0)
- **Published:** 2026-08-01
- **Duration:** 0m 50s

### Local ingest artifacts
- Transcript: `/tmp/FtyePPCE5q0.transcript.txt`
- Metadata: `/tmp/FtyePPCE5q0.info.json`

### Grounding note
This guide is grounded directly in the YouTube Shorts transcript and metadata captured during ingest. The short is commentary / operator advice rather than a full primary-source technical article, so the process below is an Organized Codebase adaptation of the video's operating lesson.

---

## Executive takeaway

The short describes a common agentic coding mistake:
- multiple agents work at once,
- they all mutate the same branch,
- the model often muddles through for a while,
- and the team mistakes "no immediate explosion" for a good workflow.

That works right up until release time.

Once different features, migrations, and verification needs are mixed into one branch, you lose the basic unit of safe delivery. You can no longer answer cleanly:
- what changed for this feature,
- what needs manual testing,
- what can ship now,
- what should wait,
- or which agent introduced the risky commit.

Organized Codebase already cares about:
- explicit planning,
- explicit verification,
- explicit review,
- explicit handoff.

Git worktrees are the missing physical boundary that keeps those disciplines separate when several agents are active in parallel.

---

## The failure mode to avoid

The transcript's warning is simple: even strong models can appear coordinated on a shared branch, but the repo state becomes a deployment trap.

### What goes wrong on one shared branch
- Feature A, Feature B, and a docs tweak all land together.
- One feature needs a migration; another needs product review; a third is safe to merge now.
- The branch becomes a mixed queue instead of a releasable unit.
- Untangling commits becomes a manual salvage job.

### Why this is worse in agentic workflows
Agents increase throughput, but they also increase the number of simultaneous partial changes. Without isolation, faster output just means faster branch contamination.

### Organized Codebase interpretation
Verification-first workflows only stay trustworthy if the thing being verified is scoped cleanly.

If `/verify` is run against a branch containing three unrelated agent outputs, the signal is weaker:
- a failing check does not clearly map to one workstream,
- a passing check does not mean each feature is ready on its own,
- and the PR review surface is bloated by unrelated context.

---

## The Organized Codebase worktree rules

### 1) One outcome = one branch = one worktree
If the work would deserve its own PR, it deserves its own branch and worktree.

Good examples:
- `feat/user-onboarding-flow`
- `fix/cache-key-bug`
- `docs/git-worktree-process`

Bad example:
- `main` containing seven unfinished agent tasks at once

### 2) One agent owns one mutable worktree at a time
Do not let two agents edit the same worktree concurrently.

Parallelism should come from **multiple isolated worktrees**, not from multiple actors stomping the same checkout.

### 3) Main stays boring and releasable
`main` is not the place where agents improvise together.

Use `main` as the stable merge target. Feature work happens elsewhere and returns only after verification and review.

### 4) Planning and handoff stay branch-local
Each worktree should carry its own:
- relevant `PLANNING/` artifact,
- implementation context,
- and handoff notes if another agent or human needs to continue.

Do not mix planning notes for unrelated efforts into one branch just because the repo root is shared.

### 5) Verification happens inside the same isolated worktree
Run the branch's checks from the worktree that contains that branch's changes.

That means the evidence for `/verify`, tests, screenshots, and review comments all map to one outcome.

### 6) Merge finished units, not blended progress
A worktree is complete when its branch has:
- a coherent diff,
- a clear verification story,
- and a PR that can be reviewed on its own merits.

If the change cannot be explained cleanly in one PR body, the unit of work is probably still too blended.

---

## Recommended directory convention

Keep worktrees **outside** the primary checkout so the main repo stays clean and you do not accidentally nest repositories.

A simple default:

```text
~/code/organized-codebase/
~/code/organized-codebase-worktrees/
  docs-git-worktree-process/
  feat-user-onboarding/
  fix-cache-key-bug/
```

The exact parent directory can vary, but the operating rule should stay stable:
- one sibling directory for the canonical repo,
- one sibling directory for disposable task worktrees.

---

## The default process

### Step 1) Start from an updated main

```bash
git fetch origin
git checkout main
git pull --ff-only origin main
```

This keeps every new worktree based on a fresh merge target.

### Step 2) Name the outcome before you create the worktree
Choose the branch from the deliverable, not from the implementation detail.

Examples:
- `docs/git-worktree-process`
- `feat/pr-review-dashboard`
- `fix/posthog-flag-evaluation`

If you cannot name the outcome, you probably do not yet have a clean unit of work.

### Step 3) Create a dedicated worktree

```bash
repo_root=$(git rev-parse --show-toplevel)
repo_name=$(basename "$repo_root")
parent_dir=$(dirname "$repo_root")
worktree_root="$parent_dir/${repo_name}-worktrees"
slug="docs-git-worktree-process"
branch="docs/git-worktree-process"

mkdir -p "$worktree_root"
git fetch origin
git worktree add "$worktree_root/$slug" -b "$branch" origin/main
```

This gives the task:
- its own filesystem location,
- its own branch,
- and a clean diff against `main`.

### Step 4) Enter the Organized Codebase workflow inside that worktree
From the new worktree:

```bash
cd "$worktree_root/$slug"
```

Then use the repo's normal workflow discipline:
- create or update the relevant `PLANNING/` artifact if the task is non-trivial,
- implement only the scoped outcome,
- run verification before commit,
- use self-review before PR.

If the repo has Kata enabled, this is where `kata enter planning|implementation|task|verify` belongs.

### Step 5) Keep verification scoped
Typical sequence:

```bash
# make the change
# run repo checks
# inspect diff
# self-review
```

For Organized Codebase, the important point is not one universal command. It is that the verification evidence belongs to one branch and one outcome.

### Step 6) Open one PR per worktree
The PR should describe exactly one task's:
- purpose,
- source or issue,
- verification,
- and rollout risk.

If the PR body starts listing multiple independent features, split the work across more worktrees.

### Step 7) Merge and retire the worktree
After merge:

```bash
git checkout main
git pull --ff-only origin main
git worktree remove "$worktree_root/$slug"
git branch -d "$branch"
```

Use removal as a hygiene step. Finished worktrees should not linger forever as zombie branches.

---

## How this fits the rest of Organized Codebase

### `PLANNING/`
Use planning docs to define the unit of work before the branch sprawls.

### `AGENT-HANDOFF/`
If one agent starts a task and another finishes it, the handoff should stay inside the worktree's branch context.

### `/verify`
Verification becomes more meaningful when it judges one isolated change-set.

### `/review`
Self-review is faster and sharper when the PR is not polluted by unrelated diffs.

### Plugin ecosystem
The `git-worktree-master` plugin can automate parts of this lifecycle, but the plugin is not the process. The process is the discipline:
- isolate work,
- verify in isolation,
- merge finished units only.

---

## Suggested operating checklist

Before starting parallel work:
- [ ] Each task has its own branch name
- [ ] Each task has its own worktree path
- [ ] No two agents are mutating the same worktree
- [ ] `main` remains free of in-progress feature work

Before opening a PR:
- [ ] The diff covers one coherent outcome
- [ ] Verification evidence was produced from that worktree
- [ ] Manual QA / migration needs are specific to that branch
- [ ] The PR body can be explained without referencing unrelated tasks

After merge:
- [ ] The worktree is removed
- [ ] The local branch is deleted if no longer needed
- [ ] Remaining open worktrees still map one-to-one with live tasks

---

## Bottom line

The video's advice is not really about a Git trick. It is about preserving deployable units when agent throughput rises.

For Organized Codebase, that means:
> **parallel agents should share a repository, not a branch.**

Use worktrees so planning, implementation, verification, review, and release decisions all stay attached to one clean unit of work.
