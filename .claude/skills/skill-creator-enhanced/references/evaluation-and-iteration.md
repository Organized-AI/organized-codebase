# Evaluation and Iteration

Build evaluations first and develop Skills iteratively with Claude.

## Contents

- [Build Evaluations First](#build-evaluations-first)
- [Develop Skills Iteratively with Claude](#develop-skills-iteratively-with-claude)
- [Observe How Claude Navigates Skills](#observe-how-claude-navigates-skills)
- [Gathering Team Feedback](#gathering-team-feedback)

---

## Build Evaluations First

**Create evaluations BEFORE writing extensive documentation.** This ensures your Skill solves real problems rather than documenting imagined ones.

### Evaluation-Driven Development

1. **Identify gaps**: Run Claude on representative tasks without a Skill. Document specific failures or missing context
2. **Create evaluations**: Build three scenarios that test these gaps
3. **Establish baseline**: Measure Claude's performance without the Skill
4. **Write minimal instructions**: Create just enough content to address the gaps and pass evaluations
5. **Iterate**: Execute evaluations, compare against baseline, and refine

This approach ensures you're solving actual problems rather than anticipating requirements that may never materialize.

### Evaluation Structure

```json
{
  "skills": ["pdf-processing"],
  "query": "Extract all text from this PDF file and save it to output.txt",
  "files": ["test-files/document.pdf"],
  "expected_behavior": [
    "Successfully reads the PDF file using an appropriate library",
    "Extracts text content from all pages without missing any",
    "Saves the extracted text to output.txt in a clear format"
  ]
}
```

**Note:** This demonstrates a data-driven evaluation with a simple testing rubric. Create your own evaluation system based on your needs.

---

## Develop Skills Iteratively with Claude

The most effective Skill development process involves Claude itself. Work with one instance of Claude ("Claude A") to create a Skill that will be used by other instances ("Claude B").

### Creating a New Skill

1. **Complete a task without a Skill**: Work through a problem with Claude A using normal prompting. Notice what information you repeatedly provide.

2. **Identify the reusable pattern**: After completing the task, identify what context you provided that would be useful for similar future tasks.

   **Example**: If you worked through a BigQuery analysis, you might have provided table names, field definitions, filtering rules (like "always exclude test accounts"), and common query patterns.

3. **Ask Claude A to create a Skill**: "Create a Skill that captures this BigQuery analysis pattern we just used. Include the table schemas, naming conventions, and the rule about filtering test accounts."

4. **Review for conciseness**: Check that Claude A hasn't added unnecessary explanations. Ask: "Remove the explanation about what win rate means - Claude already knows that."

5. **Improve information architecture**: Ask Claude A to organize the content more effectively. For example: "Organize this so the table schema is in a separate reference file. We might add more tables later."

6. **Test on similar tasks**: Use the Skill with Claude B (a fresh instance with the Skill loaded) on related use cases. Observe whether Claude B finds the right information, applies rules correctly, and handles the task successfully.

7. **Iterate based on observation**: If Claude B struggles or misses something, return to Claude A with specifics: "When Claude used this Skill, it forgot to filter by date for Q4. Should we add a section about date filtering patterns?"

### Iterating on Existing Skills

Alternate between:
- **Working with Claude A** (the expert who helps refine the Skill)
- **Testing with Claude B** (the agent using the Skill to perform real work)
- **Observing Claude B's behavior** and bringing insights back to Claude A

**Iteration Process:**

1. **Use the Skill in real workflows**: Give Claude B (with the Skill loaded) actual tasks, not test scenarios

2. **Observe Claude B's behavior**: Note where it struggles, succeeds, or makes unexpected choices

   **Example observation**: "When I asked Claude B for a regional sales report, it wrote the query but forgot to filter out test accounts, even though the Skill mentions this rule."

3. **Return to Claude A for improvements**: Share the current SKILL.md and describe what you observed. Ask: "I noticed Claude B forgot to filter test accounts when I asked for a regional report. The Skill mentions filtering, but maybe it's not prominent enough?"

4. **Review Claude A's suggestions**: Claude A might suggest:
   - Reorganizing to make rules more prominent
   - Using stronger language like "MUST filter" instead of "always filter"
   - Restructuring the workflow section

5. **Apply and test changes**: Update the Skill with Claude A's refinements, then test again with Claude B on similar requests

6. **Repeat based on usage**: Continue this observe-refine-test cycle as you encounter new scenarios

**Why this approach works**: Claude A understands agent needs, you provide domain expertise, Claude B reveals gaps through real usage, and iterative refinement improves Skills based on observed behavior rather than assumptions.

---

## Observe How Claude Navigates Skills

As you iterate on Skills, pay attention to how Claude actually uses them in practice. Watch for:

| Observation | What It Might Mean |
|-------------|-------------------|
| **Unexpected exploration paths** | Structure isn't as intuitive as you thought |
| **Missed connections** | Links need to be more explicit or prominent |
| **Overreliance on certain sections** | Content should be in main SKILL.md instead |
| **Ignored content** | Bundled file might be unnecessary or poorly signaled |

**Key insight**: The 'name' and 'description' in your Skill's metadata are particularly critical. Claude uses these when deciding whether to trigger the Skill in response to the current task. Make sure they clearly describe what the Skill does and when it should be used.

---

## Gathering Team Feedback

1. Share Skills with teammates and observe their usage
2. Ask these questions:
   - Does the Skill activate when expected?
   - Are instructions clear?
   - What's missing?
3. Incorporate feedback to address blind spots in your own usage patterns

Team feedback often reveals use cases and edge cases that individual testing misses.
