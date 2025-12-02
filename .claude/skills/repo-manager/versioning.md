# Version Numbering Rules

## Semantic Versioning

Format: `MAJOR.MINOR.PATCH` (e.g., 3.1.2)

## Decision Tree

### Patch Release (x.x.X)

Increment PATCH for:
- Documentation-only updates
- Fixing typos or broken links
- Small README improvements
- Adding 1-2 skills
- Minor corrections

**Examples:**
- 3.0.0 → 3.0.1 (fixed broken links)
- 3.1.5 → 3.1.6 (updated 1 skill description)

### Minor Release (x.X.0)

Increment MINOR for:
- Adding 3-5 new skills
- Adding new skill categories
- Significant documentation improvements
- New features without breaking changes
- Workflow enhancements

**Examples:**
- 3.0.8 → 3.1.0 (added 4 new skills)
- 3.2.3 → 3.3.0 (added new category)

### Major Release (X.0.0)

Increment MAJOR for:
- Adding 6+ new skills at once
- Breaking changes to skill structure
- Major repository reorganization
- Significant architectural changes
- Removing skills or categories

**Examples:**
- 2.5.3 → 3.0.0 (added 7 skills, new categories)
- 3.8.2 → 4.0.0 (restructured repository)

## Quick Reference Table

| Change Type | Skills Added | Version Change | Example |
|-------------|--------------|----------------|---------|
| Typo fix | 0 | Patch | 3.0.0 → 3.0.1 |
| 1-2 skills | 1-2 | Patch | 3.0.0 → 3.0.1 |
| 3-5 skills | 3-5 | Minor | 3.0.0 → 3.1.0 |
| 6+ skills | 6+ | Major | 3.0.0 → 4.0.0 |
| New category | Any | Minor | 3.0.0 → 3.1.0 |
| Breaking change | Any | Major | 3.0.0 → 4.0.0 |
| Docs only | 0 | Patch | 3.0.0 → 3.0.1 |

## When to Release

### Immediate Release

Release immediately for:
- Major milestone (6+ skills added)
- Security fixes
- Critical bug fixes
- Breaking changes

### Batch Release

Batch together for efficiency:
- Multiple small skill additions
- Documentation improvements
- Minor enhancements

**Best practice:** Release every 1-2 weeks or when 3+ skills are ready

## Version String Format

In README.md footer:

```markdown
**Version:** X.X.X (Brief description)
```

Examples:
- **Version:** 3.0.0 (Complete developer toolkit)
- **Version:** 3.1.0 (Added M&A suite)
- **Version:** 3.1.1 (Documentation fixes)

## Git Tag Format

```bash
git tag -a vX.X.X -m "Version X.X.X: [Brief summary]"
```

Examples:
```bash
git tag -a v3.0.0 -m "Version 3.0.0: Complete developer toolkit + M&A suite"
git tag -a v3.1.0 -m "Version 3.1.0: Added test-specialist and seo-optimizer"
git tag -a v3.0.1 -m "Version 3.0.1: Fixed broken links in documentation"
```

## Release Notes Format

### For Major/Minor Releases

```markdown
# Version X.X.X - [Date]

## 🎯 Highlights
[2-3 key points]

## 📦 New Skills ([N] added)
- **[Skill 1]**: [Brief description]
- **[Skill 2]**: [Brief description]

## 🎨 Improvements
- [Improvement 1]
- [Improvement 2]

## 📚 Documentation
- [Doc update 1]
- [Doc update 2]

## 📊 Statistics
**Total Skills:** [N]  
**Growth:** [X]% increase
```

### For Patch Releases

```markdown
# Version X.X.X - [Date]

## 🔧 Fixes
- [Fix 1]
- [Fix 2]

## 📚 Documentation
- [Update 1]
- [Update 2]
```

## Changelog Maintenance

Update CHANGELOG.md (if exists) with each release:

```markdown
## [X.X.X] - YYYY-MM-DD

### Added
- [What was added]

### Changed
- [What changed]

### Fixed
- [What was fixed]

### Removed
- [What was removed]
```
