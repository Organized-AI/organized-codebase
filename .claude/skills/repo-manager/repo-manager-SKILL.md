# Repository Management Skill for claude-skills-worth-using

## Core Purpose
Automate and streamline all operations for maintaining the claude-skills-worth-using repository, including adding new skills, updating documentation, managing releases, and ensuring quality standards.

## Activation Phrases
- "Update claude-skills-worth-using"
- "Add skill to repository"
- "Update skills repo README"
- "Manage skills repository"
- "Check skills repo status"
- "Release new skills version"

## Core Workflows

### 1. Repository Status Check (First Action)

**ALWAYS start with this workflow to understand current state:**

```
1. Check repository structure:
   - github:get_file_contents owner="Organized-AI" repo="clalude-skills-worth-using" path="skills"
   
2. List all current skills:
   - Parse directory listing
   - Count total skills
   - Identify categories
   
3. Check main README version:
   - github:get_file_contents owner="Organized-AI" repo="clalude-skills-worth-using" path="README.md"
   - Extract current version number
   - Note last update date
   
4. Check for attribution files:
   - Look for AILABS_ATTRIBUTION.md
   - Check AILABS_SKILLS_README.md
   
5. Summarize current state:
   "Repository currently has X skills across Y categories (version Z.Z.Z)"
```

---

### 2. Adding Skills from External Sources

**When adding skills from external repositories (like ailabs-393):**

```markdown
## Phase 1: Source Validation

1. **Identify Source Repository**
   - URL: [provided by user or from memory]
   - License: Verify MIT or compatible
   - Skills available: List all potential skills

2. **Select Skills to Add**
   - Review skill quality and relevance
   - Check for duplicates in existing repo
   - Confirm with user which skills to add

3. **Verify License Compatibility**
   - Read source LICENSE file
   - Confirm MIT or compatible
   - Prepare attribution text

## Phase 2: Skill Integration

For each skill being added:

1. **Download Skill Structure**
   - Get SKILL.md (core file)
   - Get README.md (if exists)
   - Get /references directory (if exists)
   - Get /examples directory (if exists)
   - Get /assets or /scripts (if exists)

2. **Clean and Prepare**
   - Remove unnecessary files (.DS_Store, index.js, package.json)
   - Verify SKILL.md structure
   - Check for required sections:
     * Activation phrases
     * Core workflows
     * Tool requirements
     * Examples

3. **Create GitHub Branch**
   - Name: feature/add-[skill-name]
   - From: main branch

4. **Push Skills to Repository**
   Use github:push_files to upload all files at once:
   - skills/[skill-name]/SKILL.md
   - skills/[skill-name]/README.md
   - skills/[skill-name]/references/[files]
   - skills/[skill-name]/examples/[files]

## Phase 3: Documentation Updates

1. **Create/Update Attribution File**
   If adding external skills, create/update:
   - skills/AILABS_ATTRIBUTION.md (or similar)
   - Include:
     * Source repository URL
     * License type
     * Skills included
     * Date added

2. **Update Main README**
   Automatic workflow - see Workflow #3 below

## Phase 4: Quality Assurance

1. **Verify Skill Structure**
   Each skill must have:
   - ✅ SKILL.md with clear activation phrases
   - ✅ Workflow sections
   - ✅ Tool requirements listed
   - ✅ Size: 2-5KB (modular, not monolithic)

2. **Test Skill Activation**
   - Verify activation phrases are unique
   - Check for conflicts with existing skills
   - Confirm tool dependencies are documented

## Phase 5: Create Pull Request

1. **Commit Message Format**
   ```
   feat: Add [N] production-ready skills from [source]
   
   Skills added:
   - [skill-1]: Brief description
   - [skill-2]: Brief description
   - [skill-3]: Brief description
   
   Each skill includes complete structure with references and assets.
   Source: [source-url] ([License Type])
   ```

2. **PR Body Template**
   Use comprehensive PR template (see reference below)

3. **Create PR**
   - github:create_pull_request
   - Title: "feat: Add [N] production skills from [source]"
   - Assign reviewers if needed
```

---

### 3. Updating Main README (Automatic)

**When skills are added or repository changes, automatically update README:**

```markdown
## README Update Workflow

1. **Scan Current Skills**
   - github:get_file_contents for /skills directory
   - Parse all skill directories
   - Count total skills

2. **Categorize Skills**
   Read each SKILL.md to determine category:
   - ⏰ Productivity & Planning
   - 💻 Development Tools
   - 💼 Business & M&A
   - 🔍 Content & Marketing
   - 🧠 Knowledge & Patterns

3. **Generate Skill Sections**
   For each skill, create:
   ```markdown
   ### [Icon] [Skill Name]
   
   **[One-line description]**
   
   [Longer description paragraph]
   
   **Key Features:**
   - [Feature 1]
   - [Feature 2]
   - [Feature 3]
   
   **Activation:**
   ```
   "[activation phrase 1]"
   "[activation phrase 2]"
   ```
   
   **Tools Required:** [List requirements]
   
   [→ View Documentation](./skills/[skill-name])
   ```

4. **Update Skills Comparison Matrix**
   Generate table with:
   - Skill name
   - Category
   - Automation level
   - Setup time
   - Best for

5. **Update Version Number**
   Increment version based on changes:
   - Major (X.0.0): Breaking changes or major new features
   - Minor (x.X.0): New skills added
   - Patch (x.x.X): Documentation fixes only

6. **Update Repository Structure Section**
   Show correct skill count and categories

7. **Update "What's New" Section**
   Document recent additions

8. **Create Branch and PR**
   - Branch: feature/update-readme-[version]
   - Commit: "docs: Update README to v[version] with [N] skills"
   - PR: Comprehensive documentation update

## README Template Structure

```markdown
# Claude Skills Worth Using

[Introduction paragraph]

## 📁 Repository Structure
[Tree showing all skills]

## 🎯 Skills by Category
[Category sections with skill lists]

## 🌟 Featured Skills
[Detailed sections for each skill]

## 🚀 Quick Start
[Setup instructions]

## 📋 Requirements
[Requirements table]

## 💡 Example Workflows
[Workflow diagrams]

## 📊 Skills Comparison Matrix
[Comparison table]

## 🎓 Getting Started Guide
[Beginner to advanced paths]

## 🤝 Contributing
[Guidelines]

## 📚 Documentation
[Structure explanation]

## 🎯 Use Cases by Role
[Role-based sections]

## 🔧 MCP Servers
[Server list]

## 🎉 What's New
[Recent updates]

## 🎭 Design Philosophy
[Principles]

## 📄 License
[License info]

## 🔗 Links
[External links]
```
```

---

### 4. Version Management and Releases

**When releasing a new version:**

```markdown
## Version Release Workflow

1. **Determine Version Number**
   - Major (X.0.0): >5 new skills, breaking changes, major reorganization
   - Minor (x.X.0): 1-5 new skills added, new categories
   - Patch (x.x.X): Documentation fixes, minor updates

2. **Update All Version References**
   - README.md: "Version: X.X.X"
   - README.md: "Last Updated: [date]"
   - Create CHANGELOG.md entry (if exists)

3. **Create Release Branch**
   - Branch: release/vX.X.X
   - Ensure all PRs merged
   - Final documentation review

4. **Tag Release**
   ```bash
   git tag -a vX.X.X -m "Version X.X.X: [Summary]"
   git push origin vX.X.X
   ```

5. **Create GitHub Release**
   - Title: Version X.X.X - [Summary]
   - Description: Changelog with:
     * New skills added
     * Documentation improvements
     * Breaking changes (if any)
     * Attribution credits

6. **Announcement Tasks**
   - Offer to create newsletter content
   - Offer to create LinkedIn post
   - Update any external documentation
```

---

### 5. Quality Assurance Checks

**Run these checks before any PR or release:**

```markdown
## QA Checklist

### Skill Structure Validation
For each skill in /skills directory:

- [ ] Has SKILL.md (2-5KB size)
- [ ] SKILL.md contains activation phrases
- [ ] Has README.md with usage guide
- [ ] References directory (if applicable)
- [ ] Examples directory (if applicable)
- [ ] No unnecessary files (.DS_Store, node_modules, etc.)
- [ ] Follows modular architecture (not super skill)

### Documentation Validation

- [ ] Main README lists all skills
- [ ] Skills organized by category
- [ ] Each skill has feature section
- [ ] Activation phrases documented
- [ ] Requirements table accurate
- [ ] Skills comparison matrix current
- [ ] Version number updated
- [ ] Attribution files present (for external skills)
- [ ] Links work (no 404s)

### Repository Health

- [ ] No merge conflicts
- [ ] All branches up to date
- [ ] GitHub Actions passing (if configured)
- [ ] No duplicate skill names
- [ ] Consistent naming conventions
- [ ] License compliance verified

### User Experience

- [ ] Categories make sense
- [ ] Getting Started Guide current
- [ ] Example workflows relevant
- [ ] Role-based use cases helpful
- [ ] Quick start commands work
```

---

### 6. Automated Skill Discovery

**When user mentions adding skills without specifics:**

```markdown
## Skill Discovery Workflow

1. **Search for Skill Repositories**
   Use github:search_repositories with queries:
   - "claude skills"
   - "claude agent skills"
   - "anthropic claude"
   - Topic-specific: "claude [domain] skills"

2. **Evaluate Repositories**
   For each found:
   - Check license (must be MIT or compatible)
   - Review skill quality
   - Check last update date
   - Count available skills
   - Check documentation quality

3. **Present Options**
   ```
   Found [N] skill repositories:
   
   1. [repo-name] by [author]
      - License: MIT
      - Skills: [X]
      - Quality: ⭐⭐⭐⭐⭐
      - Categories: [list]
      - Recommendation: [add/skip/review]
   
   2. [repo-name] by [author]
      ...
   ```

4. **Get User Confirmation**
   "Which skills would you like to add to claude-skills-worth-using?"

5. **Proceed with Addition Workflow**
   Execute Workflow #2 for confirmed skills
```

---

### 7. Repository Maintenance

**Periodic maintenance tasks:**

```markdown
## Maintenance Workflow

### Weekly/Monthly Tasks

1. **Check for Skill Updates**
   For skills sourced externally:
   - Check source repository for updates
   - Compare versions
   - Evaluate if update needed

2. **Documentation Review**
   - Verify all links work
   - Check for outdated information
   - Update examples if needed
   - Refresh screenshots/images

3. **Community Engagement**
   - Review issues (if public)
   - Check for PR submissions
   - Update based on feedback

4. **Archive Stale Skills**
   If a skill becomes outdated:
   - Move to /archived directory
   - Update README to remove
   - Document reason for archival

### Cleanup Tasks

1. **Remove Unnecessary Files**
   ```bash
   find skills/ -name ".DS_Store" -delete
   find skills/ -name "node_modules" -type d -exec rm -rf {} +
   find skills/ -name "*.log" -delete
   ```

2. **Verify Consistency**
   - All skills follow naming conventions
   - Directory structures match
   - Attribution files current

3. **Update Dependencies**
   - Check Python requirements
   - Check MCP server versions
   - Update tool requirements
```

---

## Tool Requirements

**Required GitHub MCP Tools:**
- github:get_file_contents
- github:create_branch
- github:create_or_update_file
- github:push_files
- github:create_pull_request
- github:search_repositories
- github:list_commits

**Optional but Recommended:**
- Memory system (to track repository state)
- Sequential thinking (for complex workflows)
- Conversation search (to reference past updates)

---

## Reference Templates

### PR Template for Adding Skills

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
- ✅ Updated AILABS_ATTRIBUTION.md (if applicable)
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

**New Categories:** [list any new categories added]

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

### PR Template for README Updates

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

---

## Decision Trees

### When to Update README

```
New skill added? → Yes → Update README (add to category section)
Skill removed? → Yes → Update README (remove from all sections)
Category changed? → Yes → Update README (reorganize sections)
Requirements changed? → Yes → Update requirements table
Version released? → Yes → Update version number
Documentation improved? → Yes → Update relevant sections
Links changed? → Yes → Update links
```

### When to Create New Version

```
Added 1-2 skills? → Patch (x.x.X)
Added 3-5 skills? → Minor (x.X.0)
Added 6+ skills? → Major (X.0.0)
Restructured categories? → Major (X.0.0)
Breaking changes? → Major (X.0.0)
Documentation only? → Patch (x.x.X)
Fixed links/typos? → Patch (x.x.X)
```

### When to Create Branch

```
Adding skills? → Yes → feature/add-[skill-names]
Updating README? → Yes → feature/update-readme-[version]
Releasing version? → Yes → release/v[version]
Fixing bug? → Yes → fix/[issue-description]
Improving docs? → Yes → docs/[improvement-description]
Small typo? → No → Commit directly to main (if contributor)
```

---

## Best Practices

### Skill Addition
1. **Always verify license first** - No exceptions
2. **Clean files before pushing** - Remove .DS_Store, node_modules, etc.
3. **Test activation phrases** - Ensure they don't conflict
4. **Use atomic commits** - One PR per logical change
5. **Write clear commit messages** - Follow conventional commits

### Documentation
1. **Keep README current** - Update immediately after skill changes
2. **Maintain consistency** - Use same format for all skills
3. **Link properly** - Use relative links within repo
4. **Version everything** - Track all major changes
5. **Provide examples** - Show don't just tell

### Repository Health
1. **Regular maintenance** - Weekly/monthly cleanup
2. **Monitor updates** - Check source repos for improvements
3. **Archive gracefully** - Don't delete, move to /archived
4. **Respond to feedback** - Update based on usage
5. **Quality over quantity** - Better to have 10 great skills than 50 mediocre ones

---

## Automation Opportunities

### Future Enhancements
1. **GitHub Actions** - Automatic README regeneration
2. **Version Bot** - Auto-increment version numbers
3. **Link Checker** - Validate all links in docs
4. **Skill Validator** - Check structure compliance
5. **Attribution Updater** - Auto-update external skill credits
6. **Release Automation** - Auto-create releases on version tags

---

## Memory Integration

### What to Remember
- Repository structure and current state
- Recent additions and updates
- Attribution sources and licenses
- Version history
- Pending improvements
- User preferences for skill organization

### When to Update Memory
- After adding skills
- After releasing versions
- After major documentation updates
- When discovering new skill sources
- When user provides feedback

---

## Error Handling

### Common Issues and Solutions

**Issue: Skill already exists**
- Check for duplicates before adding
- Compare functionality
- Decide: skip, replace, or rename

**Issue: License incompatible**
- Do NOT add skill
- Inform user
- Suggest alternatives

**Issue: README out of sync**
- Run README update workflow
- Verify all skills listed
- Fix inconsistencies

**Issue: Broken links**
- Use web_fetch to verify
- Update or remove broken links
- Check for moved content

**Issue: File conflicts**
- Review conflicting files
- Choose newer/better version
- Document decision

---

## Success Metrics

Track these for repository health:

- **Skill Count**: Total production-ready skills
- **Category Distribution**: Skills per category
- **Documentation Coverage**: % skills with complete docs
- **Update Frequency**: Commits per week/month
- **Quality Score**: Average skill size, completion
- **User Engagement**: Stars, forks, issues, PRs
- **Maintenance Health**: Time since last update

---

## Example Commands

### Check Repository Status
```
"What's the current state of claude-skills-worth-using?"
"How many skills do we have?"
"Which skills need documentation updates?"
```

### Add Skills
```
"Add the codebase-documenter skill from ailabs-393"
"I want to add skills from [repo-url]"
"Find and add SEO skills to the repository"
```

### Update Documentation
```
"Update the README to reflect all current skills"
"Refresh the skills comparison matrix"
"Update version to 3.1.0"
```

### Release Management
```
"Create version 3.0.0 release"
"Tag current state as v3.0.0"
"What should the next version number be?"
```

### Maintenance
```
"Check all skills for updates"
"Clean up the repository"
"Verify all documentation links work"
```

---

## Integration with Other Skills

This skill works well with:

- **Memory System** - Track repository state and history
- **GitHub Skills** - Already leverages GitHub MCP
- **Weekly Planner** - Schedule repository maintenance
- **Tech Debt Analyzer** - Assess repository health
- **Codebase Documenter** - Generate skill documentation

---

## Version History

**v1.0.0** - Initial repository management skill
- Core workflows defined
- Automation templates created
- Quality checks established
- Best practices documented

---

**Last Updated:** November 20, 2025  
**Skill Size:** ~8KB (comprehensive management skill)  
**Complexity:** High (multi-workflow orchestration)  
**Maintenance:** Active (updated with each repository evolution)
