# Decision Trees and Logic

## Decision Tree 1: When to Update README

```
Is there a repository change?
├─ Yes → What type of change?
│  ├─ New skill added?
│  │  └─ Update README (add to category, features, matrix)
│  │
│  ├─ Skill removed?
│  │  └─ Update README (remove all references)
│  │
│  ├─ Skill modified?
│  │  ├─ Name changed? → Update all references
│  │  ├─ Category changed? → Move in organization
│  │  └─ Features changed? → Update feature section
│  │
│  ├─ Version released?
│  │  └─ Update version number and What's New
│  │
│  ├─ Documentation improved?
│  │  └─ Update relevant sections
│  │
│  └─ Links changed?
│     └─ Update links and verify
│
└─ No → No README update needed
```

---

## Decision Tree 2: Version Number Selection

```
What changed since last version?
│
├─ Breaking changes or major reorganization?
│  └─ Major version (X.0.0)
│
├─ How many new skills added?
│  ├─ 6+ skills?
│  │  └─ Major version (X.0.0)
│  │
│  ├─ 3-5 skills?
│  │  └─ Minor version (x.X.0)
│  │
│  └─ 1-2 skills?
│     └─ Patch version (x.x.X)
│
├─ Documentation only?
│  ├─ Significant docs overhaul?
│  │  └─ Minor version (x.X.0)
│  │
│  └─ Minor doc fixes?
│     └─ Patch version (x.x.X)
│
└─ Bug fixes or typos?
   └─ Patch version (x.x.X)
```

### Version Examples

**Major (X.0.0):**
- Added 10 new skills across 2 new categories
- Complete repository reorganization
- Breaking changes to skill structure
- Renamed or removed multiple skills

**Minor (x.X.0):**
- Added 3-5 new skills
- Added new category with 2+ skills
- Significant documentation improvements
- New feature in multiple skills

**Patch (x.x.X):**
- Added 1-2 new skills
- Fixed broken links
- Updated attribution
- Minor documentation corrections

---

## Decision Tree 3: Branch Naming

```
What operation are you performing?
│
├─ Adding skills?
│  ├─ Single skill?
│  │  └─ feature/add-[skill-name]
│  │
│  └─ Multiple skills?
│     └─ feature/add-[source]-skills
│        OR feature/add-[category]-skills
│
├─ Updating documentation?
│  ├─ Major README update?
│  │  └─ feature/update-readme-[version]
│  │
│  └─ Minor doc fixes?
│     └─ docs/[description]
│
├─ Releasing version?
│  └─ release/v[version]
│
├─ Fixing bug?
│  └─ fix/[brief-description]
│
├─ Maintenance?
│  └─ chore/[task-description]
│
└─ Refactoring?
   └─ refactor/[area]
```

---

## Decision Tree 4: Should I Create a PR?

```
How significant is the change?
│
├─ Adding any skills?
│  └─ Yes, always create PR
│
├─ Updating README?
│  └─ Yes, always create PR
│
├─ Releasing version?
│  └─ Yes, always create PR (then merge to create release)
│
├─ Fixing typo in README?
│  ├─ Are you a maintainer?
│  │  ├─ Yes → Can commit directly if very minor
│  │  └─ No → Create PR
│  │
│  └─ Multiple typos?
│     └─ Create PR
│
└─ Any structural changes?
   └─ Yes, always create PR
```

---

## Decision Tree 5: Skill Addition License Check

```
User wants to add skill from external source
│
├─ Check license
│  │
│  ├─ MIT License?
│  │  └─ ✅ Proceed with addition
│  │
│  ├─ Apache 2.0?
│  │  └─ ✅ Proceed (compatible with MIT)
│  │
│  ├─ BSD License?
│  │  └─ ✅ Proceed (compatible)
│  │
│  ├─ CC0 / Public Domain?
│  │  └─ ✅ Proceed (most permissive)
│  │
│  ├─ GPL / AGPL?
│  │  └─ ❌ STOP - Incompatible (copyleft)
│  │     Inform user cannot add
│  │
│  ├─ Proprietary / No License?
│  │  └─ ❌ STOP - No permission
│  │     Inform user cannot add
│  │
│  └─ Unknown / Unclear?
│     └─ ⚠️ Ask user to clarify
│        Research license compatibility
```

---

## Decision Tree 6: README Update Scope

```
Skills changed in repository
│
├─ How many skills changed?
│  │
│  ├─ 1 skill?
│  │  └─ Update:
│  │     - Skill's feature section
│  │     - Comparison matrix row
│  │     - Requirements table row
│  │     - Total count
│  │
│  ├─ 2-3 skills?
│  │  └─ Update:
│  │     - All skill sections
│  │     - Category if changed
│  │     - Full comparison matrix
│  │     - Full requirements table
│  │     - Version number
│  │
│  └─ 4+ skills?
│     └─ Full README regeneration:
│        - Rescan all skills
│        - Regenerate all sections
│        - Update all matrices
│        - Update version
│        - Update What's New
│
└─ Category added/removed?
   └─ Full structure update:
      - Repository structure tree
      - Category sections
      - All organizational elements
```

---

## Decision Tree 7: Quality Validation

```
Before committing/pushing:
│
├─ Check skill structure
│  ├─ SKILL.md present? → If no, STOP
│  ├─ Size 2-5KB? → If no, warn (might be super skill)
│  ├─ Activation phrases? → If no, warn
│  └─ YAML frontmatter? → If no, STOP
│
├─ Check documentation
│  ├─ All skills in README? → If no, update
│  ├─ Categories correct? → If no, fix
│  ├─ Links work? → If no, fix
│  └─ Version current? → If no, update
│
├─ Check attribution
│  ├─ External skills? → If yes, check attribution file
│  ├─ Attribution current? → If no, update
│  └─ Licenses verified? → If no, verify
│
└─ Check repository health
   ├─ .DS_Store files? → Remove
   ├─ node_modules? → Remove
   ├─ Unnecessary files? → Remove
   └─ Branch conflicts? → Resolve
```

---

## Decision Tree 8: Maintenance Scheduling

```
When to run maintenance?
│
├─ Weekly Tasks (Run if > 7 days since last)
│  ├─ Check external skills for updates
│  ├─ Verify links work
│  └─ Clean unnecessary files
│
├─ Monthly Tasks (Run if > 30 days since last)
│  ├─ Comprehensive documentation review
│  ├─ Quality audit
│  └─ Community feedback review
│
└─ On-Demand Tasks (Run when triggered)
   ├─ After adding 3+ skills → Full quality check
   ├─ Before major version → Complete audit
   ├─ User reports issue → Investigate and fix
   └─ Quarterly → Deep dive review
```

---

## Quick Reference Cheatsheet

### Version Selection
```
Changes              → Version
─────────────────────────────────
1-2 skills           → x.x.X
3-5 skills           → x.X.0
6+ skills            → X.0.0
Breaking changes     → X.0.0
Docs only (major)    → x.X.0
Docs only (minor)    → x.x.X
```

### Branch Names
```
Operation            → Branch Name
─────────────────────────────────
Add skills           → feature/add-[names]
Update README        → feature/update-readme-[ver]
Release version      → release/v[ver]
Fix bug              → fix/[description]
Maintenance          → chore/[task]
```

### PR Requirements
```
Change Type          → PR Needed?
─────────────────────────────────
Add skills           → Yes
Update README        → Yes
Release version      → Yes
Fix typo             → Maybe
Maintenance          → Yes
```

### License Compatibility
```
License              → Compatible?
─────────────────────────────────
MIT                  → ✅ Yes
Apache 2.0           → ✅ Yes
BSD                  → ✅ Yes
CC0 / Public Domain  → ✅ Yes
GPL / AGPL           → ❌ No
Proprietary          → ❌ No
No license           → ❌ No
```
