# Codex vs Claude Surface Map

| Need | Claude surface | Codex surface | Notes |
|---|---|---|---|
| Repo-wide operator primer | `CLAUDE.md` | `AGENTS.md` | Keep `AGENTS.md` shorter; point back to `CLAUDE.md` for deep context. |
| Role specialization | `.claude/agents/*.md` | `.codex/agents/*.toml` | Same intent, different config surface. |
| Reusable commands | `.claude/commands/*.md` | invoke from prompt / agent roles | Codex does not mirror slash commands directly. |
| Verification discipline | Boris commands + kata | Boris rules from `AGENTS.md` + reviewer role | Verification policy stays shared. |
| Routing policy | `CONFIG/router/*` | `CONFIG/router/*` | Shared declarative layer; separate from both harnesses. |
| Pi/local harness companion | `harnesses/pi-agent/*` | `harnesses/pi-agent/*` | Shared sibling surface; not global core. |

## Practical rule

- Put **universal repo policy** in `CLAUDE.md`
- Put **Codex-specific operator hints** in `AGENTS.md` and `.codex/agents/`
- Put **routing policy** in `CONFIG/router/`
- Put **local harness behavior** in `harnesses/pi-agent/`

That separation keeps Organized Codebase dual-harness without accumulating ECC-like bloat.
