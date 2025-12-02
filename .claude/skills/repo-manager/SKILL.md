---
name: repo-manager
description: Automate all operations for maintaining the claude-skills-worth-using repository. Use when user wants to add skills, update documentation, release versions, check repository status, manage GitHub operations, or maintain the skills repository. Handles skill addition from external sources, README updates, version management, quality assurance, and repository maintenance with 85-95% time savings.
---

# Repository Manager

Automate all claude-skills-worth-using repository operations.

## Activation Triggers

**Status & Health:**
- "Check claude-skills-worth-using status"
- "Update claude-skills-worth-using"
- "Show repository health"

**Adding Skills:**
- "Add [skill-name] from [source]"
- "Find and add [category] skills"
- "Integrate skills from [repo-url]"

**Documentation:**
- "Update skills repo README"
- "Update README to version [X.X.X]"
- "Refresh documentation"

**Releases:**
- "Release version [X.X.X]"
- "Create release for skills repo"
- "Tag version [X.X.X]"

**Maintenance:**
- "Clean up skills repository"
- "Check for skill updates"
- "Validate repository structure"

## Core Workflows

### 1. Repository Status Check (Always Start Here)

When user mentions the repository, first check current state:

```
1. Scan skills directory:
   github:get_file_contents(owner="Organized-AI", repo="clalude-skills-worth-using", path="skills")

2. Count and categorize skills:
   - ⏰ Productivity & Planning
   - 💻 Development Tools
   - 💼 Business & M&A
   - 🔍 Content & Marketing
   - 🧠 Knowledge & Patterns

3. Check README version:
   github:get_file_contents(owner="Organized-AI", repo="clalude-skills-worth-using", path="README.md")
   Extract: Version number, last update date

4. Check for open PRs:
   github:list_pull_requests(owner="Organized-AI", repo="clalude-skills-worth-using", state="open")

5. Report status:
   "Repository has X skills across Y categories (version Z.Z.Z)"
   "Health: [Excellent/Good/Needs Attention]"
   "Recommendations: [list any needed actions]"
```

### 2. Adding Skills from External Sources

**When user wants to add skills:**

```
Phase 1: Validate Source
1. Verify license (MUST be MIT or compatible)
2. Confirm skills to add with user
3. Check for duplicates in existing repo

Phase 2: Prepare Files
1. Download complete skill structure:
   - SKILL.md (2-5KB, core file)
   - README.md (if exists)
   - /references directory
   - /examples directory
   - /assets or /scripts

2. Clean files:
   - Remove .DS_Store, node_modules, package.json, index.js
   - Verify SKILL.md has proper structure
   - Check size (should be 2-5KB, modular)

Phase 3: Push to Repository
1. Create branch: feature/add-[skill-names]
2. Use github:push_files to upload all at once
3. Create/update attribution file if external source
4. Create comprehensive PR (see references/pr-templates.md)

Phase 4: Quality Check
- Validate structure (2-5KB, modular)
- Check activation phrases
- Verify documentation complete
- Test no file conflicts
```

### 3. Updating Main README

**When skills added or repository changes:**

```
1. Scan all skills in /skills directory

2. Categorize each skill:
   Read SKILL.md to determine category based on content

3. Generate skill sections:
   For each skill:
   - Icon + name
   - One-line description
   - Feature bullets
   - Activation examples
   - Tool requirements
   - Documentation link

4. Update comparison matrix:
   Table with: Skill, Category, Automation, Setup, Best For

5. Update repository structure:
   Show correct skill count

6. Increment version:
   - 1-2 skills added → Patch (x.x.X)
   - 3-5 skills added → Minor (x.X.0)
   - 6+ skills added → Major (X.0.0)

7. Create branch and PR:
   Branch: feature/update-readme-[version]
   Use comprehensive PR template
```

See references/workflows.md for complete workflow details.

### 4. Version Management

**When releasing:**

```
1. Determine version number:
   See references/version-logic.md for decision tree

2. Update version references:
   - README.md: "Version: X.X.X"
   - README.md: "Last Updated: [date]"

3. Create release:
   - Branch: release/vX.X.X
   - Tag: git tag -a vX.X.X -m "Summary"
   - GitHub release with changelog

4. Offer announcement content
```

### 5. Quality Assurance

**Before any PR or release:**

Run validation checklist from references/quality-checklist.md

Key checks:
- ✅ All skills 2-5KB (modular)
- ✅ Documentation 100% coverage
- ✅ Attribution files present (for external skills)
- ✅ No broken links
- ✅ Consistent naming
- ✅ Version current

### 6. Repository Maintenance

**Periodic tasks:**

```
Weekly/Monthly:
- Check external skills for updates
- Verify all links work
- Clean unnecessary files
- Update dependencies

Cleanup:
- Remove .DS_Store files
- Verify directory consistency
- Update attribution if needed
```

See references/maintenance-schedule.md for complete schedule.

## Tool Requirements

**Required GitHub MCP:**
- github:get_file_contents
- github:create_branch
- github:create_or_update_file
- github:push_files
- github:create_pull_request
- github:list_pull_requests

**Recommended:**
- Memory system (track state)
- Sequential thinking (complex workflows)

## Decision Logic

### When to Update README
- Skill added → Yes
- Skill removed → Yes
- Category changed → Yes
- Version released → Yes

### Version Number Selection
```
1-2 skills? → Patch (x.x.X)
3-5 skills? → Minor (x.X.0)
6+ skills? → Major (X.0.0)
Breaking changes? → Major (X.0.0)
Docs only? → Patch (x.x.X)
```

### Branch Naming
```
Adding skills? → feature/add-[names]
Updating docs? → feature/update-readme-[version]
Releasing? → release/v[version]
Bug fix? → fix/[description]
```

## Best Practices

1. **Always verify license first** - No exceptions
2. **Check status before actions** - Know current state
3. **Use atomic commits** - One logical change per PR
4. **Update attribution immediately** - Don't forget credits
5. **Validate before pushing** - Check structure and links
6. **Quality over quantity** - 10 great skills > 50 mediocre

## Expected Outcomes

**Time Savings:**
- Add skills: 30 min → 3 min (90%)
- Update README: 45 min → 2 min (96%)
- Release version: 15 min → 2 min (87%)
- Status check: 10 min → 30 sec (95%)

**Quality Guarantees:**
- 100% structure compliance
- 100% documentation coverage
- 100% attribution accuracy
- 100% naming consistency

## Error Handling

**Common Issues:**

- **Skill exists** → Check for duplicates first
- **License incompatible** → Don't add, inform user
- **README out of sync** → Run README update workflow
- **Broken links** → Validate and fix
- **File conflicts** → Choose newer/better version

## Integration

Works with:
- **Memory** - Track repository state
- **Weekly Planner** - Schedule maintenance
- **Tech Debt Analyzer** - Assess repo health
- **All GitHub Tools** - Full GitHub integration

## Example Commands

```
"What's the current state of claude-skills-worth-using?"
→ Runs status check, provides health report

"Add codebase-documenter skill from ailabs-393"
→ Downloads, cleans, attributes, pushes, creates PR

"Update README to reflect all current skills"
→ Scans, categorizes, generates sections, creates PR

"Create version 3.1.0 release"
→ Determines version, tags, creates release, offers announcement

"Check all skills for updates"
→ Scans external sources, reports available updates
```

## Success Metrics

Track:
- Time saved per operation (target: 85-95%)
- Documentation coverage (target: 100%)
- Structure compliance (target: 100%)
- Attribution accuracy (target: 100%)

---

**For detailed workflows, templates, and examples:**
- See references/workflows.md - Complete step-by-step procedures
- See references/pr-templates.md - PR and commit templates
- See references/decision-trees.md - All decision logic
- See references/quality-checklist.md - Complete validation checklist
