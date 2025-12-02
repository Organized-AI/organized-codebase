# Organized Codebase Architecture
## Complete System Architecture & Structure

---

## 📐 System Architecture Overview

### ASCII Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ORGANIZED CODEBASE                              │
│                    Modular Claude Code Framework                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
        ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
        │  FRAMEWORKS  │   │    AGENTS    │   │   RUNTIME    │
        └──────────────┘   └──────────────┘   └──────────────┘
```

---

## 🗂️ Directory Structure

### Complete File System Layout
```
organized-codebase/
│
├── 📁 agents/                        # Tool-agnostic agent specifications
│   │
│   ├── 📄 PROJECT_MANAGER.md         # Master orchestrator
│   │
│   ├── 📁 core/                      # Core specialist agents
│   │   ├── 📄 FRONTEND_SPECIALIST.md
│   │   ├── 📄 BACKEND_SPECIALIST.md
│   │   ├── 📄 TESTING_SPECIALIST.md
│   │   └── 📄 DEVOPS_SPECIALIST.md
│   │
│   ├── 📁 project/                   # Project-specific agents
│   └── 📁 personal/                  # Personal reusable agents
│
├── 📁 docs/                          # Documentation
│   ├── 📁 architecture/
│   ├── 📁 frameworks/
│   ├── 📁 guides/
│   └── 📁 project/
│
├── 📁 config/                        # Configuration files
├── 📁 scripts/                       # Setup & utilities
└── 📁 .claude/                       # Claude Code runtime
```

---

## 🔄 Agent Communication Flow

### ASCII Flow Diagram
```
USER REQUEST
     │
     ▼
┌─────────────────────┐
│  PROJECT MANAGER    │
│  (Never Implements) │
└─────────────────────┘
     │
     ├──── Analyze
     ├──── Delegate
     │
     ▼
┌──────────────┐
│ Specialists  │
└──────────────┘
     │
     ├──── Review
     │
     ▼
┌──────────────┐
│   RESULT     │
└──────────────┘
```

---

*Architecture Document v2.0 - Organized Codebase Framework*
