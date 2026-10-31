# Drift check: code against its documents

Verify proves the flows work. Drift proves the documents still describe what the code does. A change
can pass every flow and still leave a README, a skill description, or a command table lying about
the new behavior.

**When it runs:** once verify is settled. The entry gate is defined once, in `../SKILL.md` Step 5.
It runs for changes with no runnable surface too.

## Scope

The files the change touched, plus every document that references one of them. Find those by
searching the repo for each touched file's path and for the name it is known by (skill, command,
agent, or hook name). Scope stays at the change by default. Whole-repo drift is an explicit opt-in,
the same as the EGM swarm.

## Sources of truth, in order

1. The approved spec (`planning/specs/<slug>.md`), including its design sections.
2. The folder README and the `CLAUDE.md` or `AGENTS.md` rules for each touched folder.
3. Skill and command descriptions that name the changed behavior.

## Procedure

1. List every documented claim in scope: commands, file paths, behavior, invariants, counts, and
   the names of agents, skills, and hooks.
2. Check each claim against the code. Record `file:line` for each check, not a yes or no.
3. Classify each mismatch:
   - **Code wrong.** The code contradicts the approved spec. Send it to FIX in the builder window,
     then back to verify for the affected rows and the `/verify` suite. That spends a verify round
     (principle 5 in `../SKILL.md`). Re-run drift on what the fix touched.
   - **Doc stale.** The code is right and the document says otherwise. Fix the document in the same
     PR and re-run the `/verify` suite. No round is spent.
   - **Spec gap.** The spec never decided the question. Record it in the notes file and carry it to
     the final report as an open question with a recommended answer.
4. Write `planning/task-loop/<slug>/drift.md`: the head SHA checked, claims checked, mismatches,
   classification, and resolution.

## Rules

- Drift is a check, not a rewrite. Do not use it to widen scope or to tidy unrelated docs.
- Never edit code to match a document unless the approved spec backs the document.
- Every check rests on `file:line` in the spec, the docs, and the code, never on memory of the
  build. That is what lets drift run in the builder window and still be audited. On a large or
  risky change, run it as a fresh dispatch instead.
- Like the evidence files, `drift.md` is a convention until a hook enforces it from settings.json.
