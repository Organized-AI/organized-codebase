# Boris Methodology Cheat Sheet

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                        BORIS METHODOLOGY CHEAT SHEET                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  CORE PRINCIPLE:  "Always give Claude a way to verify its work."             ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  DAILY COMMANDS                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    /status   →  Project health check (run at session start)                  ║
║    /verify   →  Run all verification checks (before commits)                 ║
║    /commit   →  Smart commit with verification                               ║
║    /review   →  Self-review before PR                                        ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  FEATURE WORKFLOW                                                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    1. PLAN      →  Always plan mode first                                    ║
║    2. VERIFY    →  Describe verification approach                            ║
║    3. IMPLEMENT →  One feature at a time                                     ║
║    4. CHECK     →  /verify                                                   ║
║    5. COMMIT    →  /commit                                                   ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  PERMISSION TIERS                                                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    ALLOW  →  git status, npm test, ls       (run immediately)                ║
║    ASK    →  git commit, rm, npm install    (prompt first)                   ║
║    DENY   →  git push --force, sudo, rm -rf (block always)                   ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  CLAUDE.MD SECTIONS (keep < 2.5k tokens)                                     ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    ## Tech Stack         →  Runtime, framework, deps                         ║
║    ## Project Structure  →  Brief folder map                                 ║
║    ## Code Conventions   →  3-5 key patterns                                 ║
║    ## DO NOT             →  Anti-patterns from errors ← UPDATE OFTEN         ║
║    ## Verification       →  Required checks before completion                ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  VERIFICATION AGENTS                                                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    verify-architecture  →  Check file locations, naming, imports             ║
║    verify-build         →  Clean install + build + artifacts                 ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  SKILLS                                                                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    phased-build   →  Execute PHASE-X-PROMPT.md files sequentially            ║
║    long-runner    →  Multi-session projects with progress tracking           ║
║    phase-0-boot   →  Bootstrap TypeScript/Node.js projects                   ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  WHEN CLAUDE MAKES A MISTAKE                                                 ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    1. Identify the error                                                     ║
║    2. Add to CLAUDE.md "DO NOT" section                                      ║
║    3. Commit the update                                                      ║
║    4. Team learns from the error                                             ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  FILE LOCATIONS                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    .claude/settings.json        →  Team permissions (commit to git)          ║
║    .claude/settings.local.json  →  Personal overrides (gitignored)           ║
║    .claude/commands/*.md        →  Slash commands                            ║
║    .claude/agents/*.md          →  Verification agents                       ║
║    .claude/skills/*/SKILL.md    →  Complex skills                            ║
║    CLAUDE.md                    →  Project context (team-maintained)         ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  MODEL SELECTION                                                             ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║    Opus 4.5 + Thinking  →  Complex work (fewer corrections = less time)      ║
║    Sonnet               →  Routine tasks                                     ║
║    Haiku                →  Quick lookups                                     ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

Source: Boris (Claude Code Creator) - https://www.youtube.com/watch?v=B-UXpneKw6M
```
