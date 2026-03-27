# Organized Codebase Kata Integration Plan

## Objective

Integrate [`@codevibesmatter/kata`](https://github.com/codevibesmatter/kata) into the Organized Codebase template in a way that is consistent across all scaffold entrypoints and does not regress the existing Boris-oriented workflow.

This plan updates the original Phase 0 so it reflects the repository's actual structure:

- The repo default branch is `main`
- The current local checkout may not be based on `main`
- The repo currently mixes `npm` and `pnpm` usage across template surfaces
- Kata integration is more than package installation; the documented setup path includes:
  - hook registration in `.claude/settings.json`
  - `.kata/kata.yaml` creation
  - mode availability

---

## Scope

### In scope for Phase 0

- Create the working branch from `origin/main`
- Install kata in the root repo for development and verification
- Verify the kata CLI is present and inspect its documented setup contract
- Audit existing Claude settings and hook/permission patterns
- Identify every template/scaffold surface that must be updated for kata
- Document concrete injection points and merge strategy

### Explicitly out of scope for Phase 0

- Editing template files
- Running `kata setup` as a committed repo change
- Shipping `.kata/` project state into the template
- Pushing implementation changes beyond the Phase 0 analysis commit

Phase 0 is analysis and planning only. It should produce a clean, actionable implementation brief for Phase 1.

---

## Repository Reality Check

Before doing any work, treat these as facts to validate against:

1. Root repo package manager:
   - `package.json` declares `packageManager: "pnpm@10.28.2"`
   - Root setup scripts already prefer `pnpm`

2. Existing scaffold surfaces:
   - `templates/justfile`
   - `scripts/apply-organized-codebase.sh`
   - `setup-template.sh`
   - `packages/create-organized-codebase/templates/config/settings.json`
   - `packages/create-organized-codebase/src/installers/core.ts`

3. Existing settings patterns are not uniform:
   - Some template surfaces still use `npm`/`npx`
   - Some newer surfaces already use `pnpm`

4. Kata's documented integration path is not just install/version:
   - `kata setup`
   - `.claude/settings.json` hook registration
   - `.kata/kata.yaml` creation
   - `kata modes` for mode discovery

---

## Phase 0

### Goal

Produce a verified implementation brief for kata integration without yet modifying the template behavior.

### Preconditions

1. Working tree is clean, or any unrelated changes are explicitly acknowledged.
2. Local branch is rebased or branched from `origin/main`, not from the current feature branch by accident.
3. Node/npm are available locally.

### Phase 0 Tasks

1. Confirm repo state.
   - Record current branch.
   - Confirm `origin/main` exists and is the intended base.
   - Check worktree cleanliness.

2. Create the integration branch from `origin/main`.
   - Command target: `feat/kata-integration`
   - Do not branch off the current feature branch unless explicitly intended.

3. Install kata as a root dev dependency for development verification.
   - Use the repo's chosen package manager for the root project.
   - Record the installed version.

4. Verify the CLI is available.
   - Run `npx kata --version`
   - Run `npx kata modes`
   - Capture the built-in modes listed by the installed version

5. Read and audit the committed Claude settings model.
   - Read `.claude/settings.json`
   - List existing permission rules
   - Determine whether a `hooks` key already exists in the committed version
   - Note any anomalies between working tree and committed content before drawing conclusions

6. Read kata documentation specifically for setup behavior.
   - Confirm which hooks `kata setup` registers
   - Confirm whether `kata setup --batteries` is relevant to this repo
   - Confirm what files are expected to be created or modified

7. Inspect every scaffold/update surface that could need kata integration.
   - `templates/justfile`
   - `scripts/apply-organized-codebase.sh`
   - `setup-template.sh`
   - `packages/create-organized-codebase/templates/config/settings.json`
   - `packages/create-organized-codebase/src/installers/core.ts`

8. For each surface, answer these questions.
   - Does this surface create `.claude/settings.json`, copy it, or preserve it?
   - Does this surface need to call `kata setup`, seed documentation, or only document next steps?
   - Is this surface currently `npm`-based or `pnpm`-based?
   - Would kata integration here create duplication with another surface?

9. Decide the Phase 1 integration strategy and document it.
   - Preferred package manager for template consumers
   - Whether kata is seeded automatically or offered as an optional post-setup step
   - How `.claude/settings.json` hook registration should coexist with existing Boris permissions
   - Whether the template should ship a pre-authored settings file, a merge step, or a documented command flow
   - Whether `.kata/` should be scaffolded directly or created by `kata setup`

10. Write the findings to `PLANNING/kata-injection-notes.md`.
   - Include exact files
   - Include exact insertion points
   - Include unresolved decisions
   - Include recommended Phase 1 order of implementation

11. Commit only the Phase 0 planning artifact(s).
   - Do not include implementation edits in the Phase 0 commit
   - Use a commit message that clearly marks this as analysis/planning

12. Push the branch and stop.
   - After push, do not begin Phase 1 without confirmation

---

## Phase 0 Deliverables

Phase 0 should leave behind:

- `PLANNING/organized-codebase-kata-plan.md`
- `PLANNING/kata-injection-notes.md`
- a branch pushed as `feat/kata-integration`
- a planning-only commit

---

## Success Criteria

Phase 0 is successful only if all of the following are true:

- `npx kata --version` exits 0
- `npx kata modes` exits 0
- The integration branch exists and is pushed from the correct base (`origin/main`)
- Existing `.claude/settings.json` permissions and any hook usage are documented
- All scaffold surfaces that affect kata integration are documented
- `PLANNING/kata-injection-notes.md` contains:
  - exact files to update
  - exact insertion points
  - package-manager decision notes
  - settings/hook merge strategy
  - whether `.kata/` is scaffolded or created by `kata setup`
- No implementation changes are mixed into the Phase 0 commit

---

## Non-Goals / Failure Modes

Phase 0 fails if any of the following happen:

- Branch is created from the wrong base branch
- Kata is installed with a package manager strategy that conflicts with the chosen root approach and this is left undocumented
- Only shell scripts are reviewed while `templates/justfile` or `packages/create-organized-codebase` are ignored
- Success is declared based only on version output
- Existing settings/hook behavior is assumed without verifying committed content
- Template implementation changes are started before the injection notes are written

---

## Phase 1 Preview

Phase 1 should implement the decisions from `PLANNING/kata-injection-notes.md`, likely in this order:

1. Normalize package-manager language across scaffold surfaces
2. Update the primary scaffold path (`templates/justfile`)
3. Update fallback/setup scripts
4. Update `create-organized-codebase` templates and installer behavior
5. Add or update docs explaining kata-enabled workflow usage
6. Verify no conflict between Boris commands and kata hook registration

Do not start Phase 1 until Phase 0 artifacts are reviewed.
