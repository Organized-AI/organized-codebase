# Drift check: code against its documents

Runs after verify passes and before the final report. Verify proves the flows work. Drift proves the
documents still describe what the code does. A change can pass every flow and still leave a README,
a skill description, or a command table lying about the new behavior.

## Scope

The files the change touched, plus any document whose README, spec, or design names them. Scope
stays at the change by default. Whole-repo drift is an explicit opt-in, the same as the EGM swarm.

## Sources of truth, in order

1. The approved spec (`planning/specs/<slug>.md`), including its design sections.
2. The folder README and the `CLAUDE.md` or `AGENTS.md` rules for each touched folder.
3. Skill and command descriptions that name the changed behavior.

## Procedure

1. List every documented claim in scope: commands, file paths, behavior, invariants, counts, and
   the names of agents, skills, and hooks.
2. Check each claim against the code. Record `file:line` for each check, not a yes or no.
3. Classify each mismatch:
   - **Code wrong.** The code contradicts the approved spec. Send it back to the builder window. It
     counts toward the two-round cap.
   - **Doc stale.** The code is right and the document says otherwise. Fix the document in the same
     PR.
   - **Spec gap.** The spec never decided the question. Record it in the notes file and carry it to
     the final report as an open question with a recommended answer.
4. Write `planning/task-loop/<slug>/drift.md`: claims checked, mismatches, classification, and
   resolution.

## Rules

- Drift is a check, not a rewrite. Do not use it to widen scope or to tidy unrelated docs.
- Never edit code to match a document unless the approved spec backs the document.
- The check reads artifacts: the spec, the docs, and the code. It does not read the build transcript.
- Like the evidence files, `drift.md` is a convention until a hook enforces it from settings.json.
