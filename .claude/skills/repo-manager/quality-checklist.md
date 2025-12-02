# Quality Assurance Checklist

Run before any PR or release.

## Skill Structure Validation

For each skill in `/skills` directory:

### File Structure
- [ ] Has SKILL.md (required)
- [ ] SKILL.md size: 2-5KB (modular, not monolithic)
- [ ] Has README.md (optional but recommended)
- [ ] No .DS_Store files
- [ ] No node_modules directories
- [ ] No unnecessary package.json or index.js

### SKILL.md Content
- [ ] Has YAML frontmatter with `name` and `description`
- [ ] Contains clear activation phrases
- [ ] Documents tool requirements
- [ ] Includes workflow instructions
- [ ] Examples provided (if applicable)

### Directory Structure
- [ ] `references/` (if needed)
- [ ] `examples/` (if needed)
- [ ] `assets/` or `scripts/` (if needed)
- [ ] Proper organization

## Documentation Validation

### Main README
- [ ] All skills listed in repository structure
- [ ] Skills organized by category (5 categories)
- [ ] Each skill has feature section
- [ ] Activation phrases documented
- [ ] Tools Required section complete
- [ ] Skills Comparison Matrix current
- [ ] Example workflows included
- [ ] Getting Started Guide current
- [ ] Use Cases by Role sections complete
- [ ] Version number updated
- [ ] Last Updated date current

### Attribution Files
- [ ] AILABS_ATTRIBUTION.md (if external skills present)
- [ ] Proper source URLs included
- [ ] License types documented
- [ ] Skills list accurate
- [ ] Date added recorded

### Links
- [ ] All internal links work (no 404s)
- [ ] All external links valid
- [ ] Relative paths correct
- [ ] Documentation links functional

## Repository Health

### Git Status
- [ ] No uncommitted changes
- [ ] No merge conflicts
- [ ] Branch up to date with main
- [ ] Clean working directory

### Naming Conventions
- [ ] Skill directories: lowercase-with-hyphens
- [ ] File names consistent
- [ ] Branch names follow convention
- [ ] No special characters in names

### Version Control
- [ ] Version number semantic (X.X.X)
- [ ] Version matches changes (patch/minor/major)
- [ ] Git tags present for releases
- [ ] Commit messages clear

## License Compliance

### External Skills
- [ ] Source licenses verified (MIT or compatible)
- [ ] Attribution files present
- [ ] License terms respected
- [ ] Credit given to original authors

### Internal Skills
- [ ] License information current
- [ ] No proprietary code without permission
- [ ] Open source compliance maintained

## User Experience

### Categories
- [ ] Make logical sense
- [ ] Balanced distribution
- [ ] Clear category names
- [ ] Proper icon usage

### Documentation Quality
- [ ] Getting Started Guide helpful
- [ ] Example workflows relevant
- [ ] Role-based use cases accurate
- [ ] Quick start commands work
- [ ] No jargon without explanation

### Activation Phrases
- [ ] Natural language
- [ ] Unique (no conflicts)
- [ ] Multiple examples provided
- [ ] Cover common use cases

## Testing Checklist

### Functional Testing
- [ ] Skills can be added successfully
- [ ] README updates generate correctly
- [ ] Version releases work
- [ ] Status checks accurate
- [ ] PR creation successful

### Integration Testing
- [ ] GitHub API calls work
- [ ] Tool integrations functional
- [ ] Memory system works (if used)
- [ ] MCP servers connect (if required)

### Validation Testing
- [ ] Skill structure validated
- [ ] Documentation completeness checked
- [ ] Links validated
- [ ] File sizes appropriate

## Pre-Release Checklist

Before creating a release:

### Code Quality
- [ ] All quality checks pass
- [ ] No known bugs
- [ ] Performance acceptable
- [ ] Security reviewed

### Documentation
- [ ] README fully updated
- [ ] All skills documented
- [ ] Changelog current (if exists)
- [ ] Release notes prepared

### Version Control
- [ ] All PRs merged
- [ ] Version number decided
- [ ] Tag message prepared
- [ ] Release notes written

### Communication
- [ ] Announcement drafted (optional)
- [ ] Newsletter prepared (optional)
- [ ] Social media posts ready (optional)

## Continuous Monitoring

### Weekly Checks
- [ ] Check for skill updates (external sources)
- [ ] Verify all links still work
- [ ] Review open issues (if public)
- [ ] Monitor repository health

### Monthly Checks
- [ ] Update dependencies (if applicable)
- [ ] Review skill relevance
- [ ] Archive outdated skills
- [ ] Refresh documentation

### Quarterly Checks
- [ ] Major version planning
- [ ] Community feedback review
- [ ] Category reorganization (if needed)
- [ ] Strategic improvements

## Quick Validation Commands

```bash
# Check for unnecessary files
find skills/ -name ".DS_Store" -o -name "node_modules"

# Count skills
ls -d skills/*/ | wc -l

# Check README version
grep "Version:" README.md

# Check for open PRs
gh pr list --repo Organized-AI/clalude-skills-worth-using

# Verify no uncommitted changes
git status
```

## Automated Checks (Future)

Consider automating:
- [ ] Skill structure validation
- [ ] Link checking
- [ ] Version number validation
- [ ] File size monitoring
- [ ] Documentation completeness
- [ ] License compliance
