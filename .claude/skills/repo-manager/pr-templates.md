# PR and Commit Templates

## Template 1: Adding New Skills

### PR Title Format
```
feat: Add [N] production-ready skills from [source]
```

### PR Body Template
```markdown
## 📦 Add [N] Production-Ready Skills

This PR adds [N] new skills to expand our [category] capabilities.

### 🎯 Skills Added

**[Category Name]:**
1. **[Skill 1]** - [Brief description]
2. **[Skill 2]** - [Brief description]
3. **[Skill 3]** - [Brief description]

### 📋 Changes

- ✅ Added [N] complete skill directories
- ✅ Included SKILL.md for each
- ✅ Added reference materials
- ✅ Created examples
- ✅ Updated AILABS_ATTRIBUTION.md (if external source)
- ✅ Cleaned unnecessary files

### 🔍 Quality Checks

- [x] All skills 2-5KB (modular)
- [x] Clear activation phrases
- [x] Complete documentation
- [x] License compliance verified
- [x] No file conflicts
- [x] Tested activation

### 📊 Impact

**Before:** [X] skills  
**After:** [Y] skills  
**Growth:** [Z]% increase

**New Categories:** [list any new categories]

### 🔗 Source

- **Repository:** [source-url]
- **License:** MIT (verified)
- **Attribution:** See skills/AILABS_ATTRIBUTION.md

### ✅ Ready to Merge

All quality checks passed. Skills ready for immediate use.

---

**Next Steps After Merge:**
- [ ] Update main README (separate PR)
- [ ] Tag new version
- [ ] Announce additions
```

### Commit Message Format
```
feat: Add [skill-name] from [source]

Complete skill structure with:
- SKILL.md (core instructions)
- README.md (usage guide)
- references/ (templates and guides)
- examples/ (sample outputs)

Source: [source-repo-url] (MIT License)
```

---

## Template 2: README Updates

### PR Title Format
```
docs: Update README to v[X.X.X] with [N] skills documented
```

### PR Body Template
```markdown
## 📚 Documentation Update - Version [X.X.X]

Comprehensive README update to document all [N] skills.

### 🎯 What's Changed

**Documentation Updates:**
- ✅ Added [X] new skill sections
- ✅ Updated category organization
- ✅ Enhanced Skills Comparison Matrix
- ✅ Refreshed Getting Started Guide
- ✅ Added workflow examples
- ✅ Updated version to [X.X.X]

### 📦 Documentation Coverage

**Skills by Category:**
- ⏰ Productivity & Planning: [N] skills
- 💻 Development Tools: [N] skills
- 💼 Business & M&A: [N] skills
- 🔍 Content & Marketing: [N] skills
- 🧠 Knowledge & Patterns: [N] skills

**Total:** [N] production-ready skills

### 🎨 Improvements

- Enhanced feature descriptions
- Added activation phrase examples
- Updated requirements table
- Improved role-based use cases
- Added workflow diagrams

### 📊 Impact

**Before:** [X] skills documented  
**After:** [Y] skills documented  
**Coverage:** 100% complete

### ✅ Quality Checks

- [x] All skills documented
- [x] Categories organized
- [x] Links verified
- [x] Version updated
- [x] Examples current
- [x] No broken links

---

**Ready to merge!** Complete documentation for all skills.
```

### Commit Message Format
```
docs: Update README to v[X.X.X] with [N] skills

Major documentation update:
- Added [X] new skill sections
- Updated category organization
- Enhanced comparison matrices
- Refreshed all tables and diagrams

Total: [N] production-ready skills (100% coverage)
```

---

## Template 3: Version Releases

### Release Title Format
```
Version [X.X.X] - [Brief Summary]
```

### Release Body Template
```markdown
# Version [X.X.X] - [Date]

**[One sentence summary of this release]**

## ✨ New Skills

**[Category]:**
- **[Skill 1]** - [Description]
- **[Skill 2]** - [Description]

**[Another Category]:**
- **[Skill 3]** - [Description]

## 📈 Improvements

- [Improvement 1]
- [Improvement 2]
- [Improvement 3]

## 🏗️ Changes

- [Change 1]
- [Change 2]

## 📊 Statistics

- **Total Skills:** [N] production-ready skills
- **Categories:** [N] categories
- **Documentation:** 100% coverage
- **Growth:** +[N] skills since last version

## 🎯 Attribution

**External Skills:**
[N] skills adapted from [source-repo](url) (MIT License)
See [AILABS_ATTRIBUTION.md](./skills/AILABS_ATTRIBUTION.md) for details.

## 🚀 Getting Started

Clone the repository:
```bash
git clone https://github.com/Organized-AI/clalude-skills-worth-using.git
cd clalude-skills-worth-using
```

Browse skills by category in the README.

---

**Previous Version:** [X.X.X]  
**Release Date:** [Date]  
**Maintained By:** Organized AI Team
```

### Git Tag Message Format
```
Version [X.X.X]: [Brief summary]

Changes:
- [Change 1]
- [Change 2]
- [Change 3]

Total: [N] production skills
```

---

## Template 4: Bug Fixes

### PR Title Format
```
fix: [Brief description of fix]
```

### PR Body Template
```markdown
## 🐛 Bug Fix

### Issue
[Describe the problem]

### Solution
[Describe what was fixed]

### Changes
- [Change 1]
- [Change 2]

### Testing
- [x] Tested locally
- [x] Verified fix works
- [x] No new issues introduced

### Impact
[Describe impact of fix]
```

---

## Template 5: Maintenance

### PR Title Format
```
chore: [Brief description of maintenance]
```

### PR Body Template
```markdown
## 🧹 Repository Maintenance

### Tasks Completed
- [x] [Task 1]
- [x] [Task 2]
- [x] [Task 3]

### Files Changed
- [File 1]: [What changed]
- [File 2]: [What changed]

### Impact
[Describe impact]

### Notes
[Any additional context]
```

---

## Quick Reference

### Commit Message Prefixes
- `feat:` - New features or skills
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `style:` - Formatting changes

### PR Labels (if using)
- `enhancement` - New features
- `documentation` - Docs updates
- `bug` - Bug fixes
- `maintenance` - Repo maintenance
- `ready-to-merge` - Approved PRs

### Branch Naming
- `feature/add-[skill-names]` - Adding skills
- `feature/update-readme-[version]` - README updates
- `release/v[version]` - Version releases
- `fix/[description]` - Bug fixes
- `chore/[description]` - Maintenance
