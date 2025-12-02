# Complete Workflows Reference

## Workflow 1: Adding Skills from External Sources - Detailed

### Step-by-Step Execution

#### Phase 1: Source Validation (2 minutes)

**Step 1: Identify Source**
```
User says: "Add codebase-documenter from ailabs-393"

Actions:
1. Identify source repository:
   - Owner: ailabs-393
   - Repo: ai-labs-claude-skills
   - URL: https://github.com/ailabs-393/ai-labs-claude-skills

2. Check license via github:get_file_contents:
   - Path: LICENSE or LICENSE.txt
   - Verify: MIT or compatible
   - If not MIT → STOP and inform user
```

**Step 2: List Available Skills**
```
github:get_file_contents on /dist/skills directory
Parse available skills matching user request
```

**Step 3: Confirm with User**
```
"Found these skills in ailabs-393:
- codebase-documenter
- test-specialist  
- tech-debt-analyzer

Which would you like to add?"
```

#### Phase 2: Download and Prepare (2-3 minutes)

**For each skill to add:**

1. **Download complete structure:**
   ```
   github:get_file_contents for:
   - skills/[name]/SKILL.md
   - skills/[name]/README.md (if exists)
   - skills/[name]/references/ (list and download all)
   - skills/[name]/examples/ (list and download all)
   - skills/[name]/assets/ or scripts/ (if exist)
   ```

2. **Clean files:**
   ```
   Remove from download list:
   - .DS_Store
   - node_modules/
   - package.json
   - index.js
   - .git files
   - Any build artifacts
   ```

3. **Validate SKILL.md:**
   ```
   Check:
   - Has YAML frontmatter with name and description
   - Size is 2-5KB (modular, not monolithic)
   - Has clear activation phrases
   - References any bundled resources properly
   ```

4. **Create attribution:**
   ```
   If AILABS_ATTRIBUTION.md doesn't exist:
     Create with source, license, date, skills list
   Else:
     Update with new skills added
   ```

#### Phase 3: Push to GitHub (1 minute)

1. **Create branch:**
   ```
   Branch name: feature/add-[skill1]-[skill2]-[skill3]
   github:create_branch(
     owner="Organized-AI",
     repo="clalude-skills-worth-using",
     branch="feature/add-codebase-documenter",
     from_branch="main"
   )
   ```

2. **Prepare files for push:**
   ```
   For each skill:
     files_to_push = [
       {path: "skills/[name]/SKILL.md", content: cleaned_content},
       {path: "skills/[name]/README.md", content: cleaned_content},
       {path: "skills/[name]/references/[file]", content: content},
       ...
     ]
   ```

3. **Push all files at once:**
   ```
   github:push_files(
     owner="Organized-AI",
     repo="clalude-skills-worth-using", 
     branch="feature/add-codebase-documenter",
     files=files_to_push,
     message="feat: Add codebase-documenter from ailabs-393\n\nComplete skill structure with references and examples.\nSource: ailabs-393/ai-labs-claude-skills (MIT License)"
   )
   ```

4. **Update attribution:**
   ```
   github:create_or_update_file(
     path="skills/AILABS_ATTRIBUTION.md",
     content=updated_attribution,
     message="docs: Update attribution for new skills"
   )
   ```

#### Phase 4: Create Pull Request (30 seconds)

```
github:create_pull_request(
  title="feat: Add [N] production skills from ailabs-393",
  body="""
## 📦 Add [N] Production-Ready Skills

Skills added:
- **codebase-documenter** - Comprehensive code documentation
- [others if multiple]

### ✅ Quality Checks
- [x] All skills 2-5KB (modular)
- [x] Complete documentation
- [x] License verified (MIT)
- [x] Attribution updated
- [x] No file conflicts

### 🔗 Source
- Repository: https://github.com/ailabs-393/ai-labs-claude-skills
- License: MIT
- Attribution: See skills/AILABS_ATTRIBUTION.md

Ready to merge!
  """,
  head="feature/add-codebase-documenter",
  base="main"
)
```

**Total time: 3-5 minutes**

---

## Workflow 2: README Update - Detailed

### Complete Process

#### Step 1: Scan Repository (30 seconds)

```
1. Get all skills:
   github:get_file_contents("skills")
   Parse directory list, extract skill names

2. For each skill directory:
   Read SKILL.md frontmatter
   Extract: name, description
   Categorize based on description keywords:
     - "productivity", "planning", "time" → Productivity
     - "code", "test", "CI/CD", "documentation" → Development
     - "M&A", "startup", "business", "pitch" → Business
     - "SEO", "content", "marketing" → Marketing
     - "patterns", "knowledge", "framework" → Knowledge
```

#### Step 2: Generate Content (1 minute)

```
For each category:
  Generate category section:
    ### [Icon] [Category Name]
    
    [Category description]
    
    - **[Skill 1]** - [Brief description]
    - **[Skill 2]** - [Brief description]

For each skill:
  Generate detailed section:
    ### [Icon] [Skill Name]
    
    **[One-line tagline]**
    
    [Paragraph description]
    
    **Key Features:**
    - [Feature 1]
    - [Feature 2]
    - [Feature 3]
    
    **Activation:**
    ```
    "[phrase 1]"
    "[phrase 2]"
    ```
    
    **Tools Required:** [List]
    
    [→ View Documentation](./skills/[name])
```

#### Step 3: Update Matrices (30 seconds)

```
Skills Comparison Matrix:
| Skill | Category | Automation | Setup | Best For |
|-------|----------|------------|-------|----------|
[Generate row for each skill based on category and description]

Requirements Table:
| Skill | Memory | Python | macOS | MCP Servers |
|-------|--------|--------|-------|-------------|
[Generate row for each skill based on tool requirements]
```

#### Step 4: Version and Commit (30 seconds)

```
1. Determine version increment:
   Count skills added since last version:
   - 1-2 → Patch (3.0.1)
   - 3-5 → Minor (3.1.0)
   - 6+ → Major (4.0.0)

2. Update version strings in README:
   - "Version: X.X.X"
   - "Last Updated: [today's date]"
   - "Total Skills: [N]"

3. Create branch:
   feature/update-readme-[version]

4. Push updated README:
   github:create_or_update_file(
     path="README.md",
     content=updated_readme,
     message="docs: Update README to v[version] with [N] skills"
   )

5. Create PR with comprehensive description
```

**Total time: 2-3 minutes**

---

## Workflow 3: Version Release - Detailed

### Complete Process

#### Step 1: Determine Version (30 seconds)

```
Review changes since last version:

1. Count new skills added
2. Check for documentation changes
3. Look for breaking changes

Decision tree:
- 1-2 skills added → Patch (x.x.X)
- 3-5 skills added → Minor (x.X.0)  
- 6+ skills added → Major (X.0.0)
- Breaking changes → Major (X.0.0)
- Docs only → Patch (x.x.X)
- Reorganization → Major (X.0.0)
```

#### Step 2: Update References (30 seconds)

```
Files to update with new version:
1. README.md:
   - Version: X.X.X
   - Last Updated: [date]
   - "Version X.X.X" in What's New section

2. Add What's New entry:
   ### Version X.X.X - [Date]
   
   **[Summary]**
   
   - ✨ Added [N] new skills
   - 🔧 [Category] toolkit complete
   - 📚 Enhanced documentation
   
   **Skills Added:**
   - [Skill 1]
   - [Skill 2]
```

#### Step 3: Create Release (1 minute)

```
1. Create release branch:
   release/vX.X.X

2. Tag the commit:
   github:create_tag(
     tag="vX.X.X",
     message="Version X.X.X: [Summary]",
     sha=[commit_sha]
   )

3. Create GitHub release:
   github:create_release(
     tag_name="vX.X.X",
     name="Version X.X.X - [Summary]",
     body="""
# Version X.X.X - [Date]

## New Skills
- **[Skill 1]** - [Description]
- **[Skill 2]** - [Description]

## Improvements
- [Improvement 1]
- [Improvement 2]

## Attribution
[N] skills from [source] (MIT License)

---

**Total Skills:** [N] production-ready skills
**Categories:** [N] categories
**Documentation:** 100% coverage
     """
   )
```

#### Step 4: Announce (optional)

```
Offer to create:
1. Newsletter content
2. LinkedIn post
3. Twitter thread
4. Blog post draft
```

**Total time: 2 minutes**

---

## Workflow 4: Repository Maintenance

### Weekly Tasks (5 minutes)

```
1. Check external skills for updates:
   For each skill from external source:
     - Visit source repository
     - Check last commit date
     - Compare versions if available
     - Note any significant changes

2. Verify links:
   Scan README for all links
   Test each link:
     - Internal links to skills
     - External attribution links
     - Documentation references
   Report broken links

3. Check repository health:
   - Open issues (if any)
   - Open PRs status
   - Branch cleanup needed
   - File size check
```

### Monthly Tasks (15 minutes)

```
1. Comprehensive documentation review:
   - All skills still have complete docs
   - Examples still work
   - Activation phrases still relevant
   - Categories still appropriate

2. Quality audit:
   - All skills 2-5KB (modular)
   - No monolithic skills crept in
   - Attribution current
   - Licenses verified

3. Community engagement:
   - Review any feedback
   - Update based on usage
   - Consider new skill requests

4. Archive outdated:
   - If skill no longer useful
   - Move to /archived directory
   - Update README to remove
   - Document reason
```

### Cleanup Commands

```bash
# Remove unnecessary files
find skills/ -name ".DS_Store" -delete
find skills/ -name "node_modules" -type d -exec rm -rf {} +
find skills/ -name "*.log" -delete

# Verify structure
for dir in skills/*/; do
  # Check each skill has SKILL.md
  # Check size is appropriate
  # Report any issues
done
```
