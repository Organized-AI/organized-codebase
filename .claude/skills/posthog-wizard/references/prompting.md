# Advanced LLM Prompting Techniques

## Core Principle: Deterministic Fence

**Goal**: Create predictable, structured output from non-deterministic LLMs

**Method**: Use temperature: 0 + explicit formatting + validation

## Prompt Engineering Patterns

### Pattern 1: JSON-Only Output

Force JSON responses with explicit constraints:

```typescript
const prompt = `
CRITICAL INSTRUCTIONS:
1. Respond with ONLY valid JSON
2. Do NOT include any text outside the JSON object
3. Do NOT use markdown code blocks
4. Do NOT include explanations

Required JSON format:
{
  "status": "active" | "inactive" | "error",
  "confidence": 0.0-1.0,
  "findings": ["array", "of", "strings"],
  "recommendations": [
    {
      "priority": "high" | "medium" | "low",
      "action": "string",
      "reason": "string"
    }
  ]
}

Data to analyze:
${JSON.stringify(data, null, 2)}
`;
```

**Key Elements**:
- "CRITICAL INSTRUCTIONS" header
- Numbered steps
- Explicit format specification
- "Do NOT" constraints
- Example structure
- Actual data at the end

### Pattern 2: Multi-Step Reasoning

Guide LLM through analysis phases:

```typescript
const prompt = `
Analyze the following data in 3 steps:

STEP 1: CATEGORIZATION
Categorize the data into:
- Category A: [criteria]
- Category B: [criteria]
- Category C: [criteria]

STEP 2: EVALUATION
For each category, evaluate:
- Completeness (0-100)
- Quality (0-100)
- Risk level (low/medium/high)

STEP 3: SYNTHESIS
Based on Steps 1-2, generate:
- Overall score (0-100)
- Top 3 recommendations
- Critical issues (if any)

OUTPUT FORMAT (JSON only):
{
  "categories": { ... },
  "evaluations": { ... },
  "synthesis": { ... }
}

Data:
${JSON.stringify(data)}
`;
```

**Benefits**:
- Structured thinking process
- Intermediate validation points
- Traceable reasoning
- Higher accuracy

### Pattern 3: Constrained Creativity

Allow flexibility within boundaries:

```typescript
const prompt = `
Generate recommendations based on these findings.

CONSTRAINTS:
- Each recommendation must be actionable (starts with a verb)
- Each must include estimated impact (low/medium/high)
- Maximum 5 recommendations
- Prioritize by impact/effort ratio
- Focus on quick wins (< 1 week to implement)

TEMPLATE:
{
  "recommendations": [
    {
      "action": "[Verb] [specific action]",
      "impact": "high" | "medium" | "low",
      "effort": "low" | "medium" | "high",
      "reasoning": "Why this matters",
      "steps": ["Step 1", "Step 2", ...]
    }
  ]
}

Findings:
${JSON.stringify(findings)}
`;
```

### Pattern 4: Few-Shot Learning

Provide examples for complex formats:

```typescript
const prompt = `
Convert events into standard format.

EXAMPLE 1:
Input: {"eventName": "page_view", "url": "/home"}
Output: {
  "event": "PageView",
  "parameters": { "page_path": "/home" },
  "category": "engagement"
}

EXAMPLE 2:
Input: {"eventName": "add_cart", "item": "shoes", "price": 59.99}
Output: {
  "event": "AddToCart",
  "parameters": { "item_name": "shoes", "value": 59.99 },
  "category": "ecommerce"
}

Now convert these events:
${JSON.stringify(events)}

Output as JSON array only.
`;
```

### Pattern 5: Validation Prompts

Create self-checking prompts:

```typescript
const prompt = `
Analyze data and validate your own output.

ANALYSIS TASK:
${analysisInstructions}

SELF-VALIDATION CHECKLIST:
Before submitting, verify:
□ All required fields present
□ No placeholder values (e.g., "TODO", "...")
□ Numeric values in valid ranges
□ Arrays not empty
□ Confidence scores between 0-1
□ At least one recommendation provided

If any validation fails, regenerate the analysis.

OUTPUT (JSON only):
{
  "analysis": { ... },
  "validation": {
    "passed": true,
    "checks": ["list of passed checks"]
  }
}
`;
```

## Response Parsing Strategies

### Strategy 1: Robust JSON Extraction

```typescript
function parseJSON(text: string): any {
  // Step 1: Remove markdown code blocks
  text = text.replace(/```(?:json)?\n?([\s\S]*?)\n?```/g, '$1');
  
  // Step 2: Trim whitespace
  text = text.trim();
  
  // Step 3: Try direct parse
  try {
    return JSON.parse(text);
  } catch (error) {
    // Step 4: Extract JSON from mixed content
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (innerError) {
        // Step 5: Try to fix common issues
        const fixed = fixCommonJSONIssues(jsonMatch[0]);
        return JSON.parse(fixed);
      }
    }
  }
  
  throw new Error('Failed to parse JSON from response');
}

function fixCommonJSONIssues(text: string): string {
  return text
    // Fix trailing commas
    .replace(/,(\s*[}\]])/g, '$1')
    // Fix single quotes
    .replace(/'/g, '"')
    // Fix unquoted keys
    .replace(/(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
}
```

### Strategy 2: Partial Response Handling

```typescript
function parsePartialJSON(text: string): any {
  // Handle streaming responses or incomplete JSON
  try {
    return JSON.parse(text);
  } catch (error) {
    // Try to parse what we have
    if (text.trim().startsWith('{')) {
      // Attempt to close incomplete object
      let completed = text;
      const openBraces = (text.match(/\{/g) || []).length;
      const closeBraces = (text.match(/\}/g) || []).length;
      
      // Add missing closing braces
      completed += '}'.repeat(openBraces - closeBraces);
      
      try {
        return JSON.parse(completed);
      } catch {
        // Return null for truly invalid partial
        return null;
      }
    }
  }
}
```

### Strategy 3: Schema Validation

```typescript
import Ajv from 'ajv';

const ajv = new Ajv();

const schema = {
  type: 'object',
  required: ['status', 'score', 'recommendations'],
  properties: {
    status: {
      type: 'string',
      enum: ['active', 'inactive', 'error']
    },
    score: {
      type: 'number',
      minimum: 0,
      maximum: 100
    },
    recommendations: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['action', 'priority'],
        properties: {
          action: { type: 'string' },
          priority: { type: 'string', enum: ['high', 'medium', 'low'] }
        }
      }
    }
  }
};

const validate = ajv.compile(schema);

function parseAndValidate(text: string): any {
  const data = parseJSON(text);
  
  if (!validate(data)) {
    throw new Error(
      `Invalid response format: ${JSON.stringify(validate.errors)}`
    );
  }
  
  return data;
}
```

## Temperature Selection Guide

| Temperature | Use Case | Example |
|------------|----------|---------|
| 0.0 | Structured output, JSON | Data analysis, conversions |
| 0.1-0.3 | Consistent code generation | Boilerplate, templates |
| 0.4-0.7 | Balanced creativity | Documentation, explanations |
| 0.8-1.0 | High creativity | Brainstorming, stories |

**For Wizards**: Always use 0.0 for deterministic operations

## Prompt Optimization Techniques

### Technique 1: Prompt Versioning

```typescript
const PROMPTS = {
  analyze_v1: (data: any) => `Analyze: ${JSON.stringify(data)}`,
  
  analyze_v2: (data: any) => `
    Analyze data and output JSON.
    Data: ${JSON.stringify(data)}
  `,
  
  analyze_v3: (data: any) => `
    CRITICAL: Output ONLY JSON.
    
    Analysis format:
    { "status": "...", "findings": [...] }
    
    Data: ${JSON.stringify(data)}
  `,
  
  // Current production version
  analyze: function(data: any) {
    return this.analyze_v3(data);
  }
};
```

### Technique 2: A/B Testing Prompts

```typescript
class PromptTester {
  private analytics: Analytics;
  
  async testPrompts(
    variantA: string,
    variantB: string,
    data: any
  ): Promise<TestResult> {
    // Run both variants
    const [resultA, resultB] = await Promise.all([
      this.llm.query(variantA),
      this.llm.query(variantB)
    ]);
    
    // Track results
    this.analytics.trackPromptTest({
      variantA: { prompt: variantA, result: resultA },
      variantB: { prompt: variantB, result: resultB }
    });
    
    // Return both for comparison
    return { variantA: resultA, variantB: resultB };
  }
}
```

### Technique 3: Dynamic Prompt Composition

```typescript
class PromptBuilder {
  private parts: string[] = [];
  
  addInstructions(text: string): this {
    this.parts.push(`INSTRUCTIONS:\n${text}\n`);
    return this;
  }
  
  addFormat(schema: any): this {
    this.parts.push(`FORMAT:\n${JSON.stringify(schema, null, 2)}\n`);
    return this;
  }
  
  addData(data: any): this {
    this.parts.push(`DATA:\n${JSON.stringify(data, null, 2)}`);
    return this;
  }
  
  addExamples(examples: any[]): this {
    const exampleText = examples.map((ex, i) => 
      `EXAMPLE ${i + 1}:\n${JSON.stringify(ex, null, 2)}`
    ).join('\n\n');
    this.parts.push(exampleText);
    return this;
  }
  
  build(): string {
    return this.parts.join('\n---\n');
  }
}

// Usage
const prompt = new PromptBuilder()
  .addInstructions('Analyze the data')
  .addFormat({ status: 'string', score: 'number' })
  .addExamples([example1, example2])
  .addData(actualData)
  .build();
```

## Common Pitfalls and Solutions

### Pitfall 1: Assuming Perfect JSON

❌ **Bad**:
```typescript
const result = JSON.parse(response.content[0].text);
```

✅ **Good**:
```typescript
const result = parseJSON(response.content[0].text);
// Uses robust parsing with fallbacks
```

### Pitfall 2: Generic Instructions

❌ **Bad**:
```typescript
const prompt = `Analyze this data: ${data}`;
```

✅ **Good**:
```typescript
const prompt = `
Analyze pixel tracking data for Meta Ads.

Output ONLY JSON in format:
{ "status": "...", "events": [...], "issues": [...] }

Data: ${data}
`;
```

### Pitfall 3: No Validation

❌ **Bad**:
```typescript
const analysis = await llm.query(prompt);
return analysis;
```

✅ **Good**:
```typescript
const analysis = await llm.query(prompt);

// Validate structure
if (!analysis.status || !analysis.events) {
  throw new Error('Invalid analysis format');
}

// Validate values
if (analysis.score < 0 || analysis.score > 100) {
  throw new Error('Invalid score range');
}

return analysis;
```

### Pitfall 4: High Temperature for Structured Tasks

❌ **Bad**:
```typescript
await llm.create({
  temperature: 0.8, // Too creative!
  messages: [{ role: 'user', content: 'Output JSON...' }]
});
```

✅ **Good**:
```typescript
await llm.create({
  temperature: 0, // Deterministic
  messages: [{ role: 'user', content: 'Output JSON...' }]
});
```

## Best Practices Summary

1. **Always use temperature: 0** for structured output
2. **Specify exact format** with examples
3. **Use "CRITICAL" or "IMPORTANT"** for key constraints
4. **Provide examples** for complex formats
5. **Include validation** in prompts when possible
6. **Parse robustly** with multiple fallback strategies
7. **Version prompts** for iterative improvement
8. **Test and measure** prompt performance
9. **Keep prompts focused** - one task per prompt
10. **Document what works** - build prompt library

## Testing Prompts

```typescript
describe('Prompt Testing', () => {
  it('should return valid JSON', async () => {
    const response = await llm.query(PROMPTS.analyze(testData));
    
    // Should parse without error
    const parsed = parseJSON(response);
    
    // Should have required fields
    expect(parsed).toHaveProperty('status');
    expect(parsed).toHaveProperty('score');
    
    // Should have valid values
    expect(parsed.score).toBeGreaterThanOrEqual(0);
    expect(parsed.score).toBeLessThanOrEqual(100);
  });
  
  it('should handle edge cases', async () => {
    const edgeCases = [
      { data: null },
      { data: [] },
      { data: {} },
      { data: { invalid: 'structure' } }
    ];
    
    for (const testCase of edgeCases) {
      const response = await llm.query(PROMPTS.analyze(testCase.data));
      
      // Should not throw
      expect(() => parseJSON(response)).not.toThrow();
    }
  });
});
```

## Advanced: Self-Healing Prompts

```typescript
async function queryWithRetry(
  prompt: string,
  maxRetries: number = 3
): Promise<any> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await llm.query(prompt);
      return parseAndValidate(response);
    } catch (error) {
      lastError = error;
      
      // Enhance prompt with error feedback
      prompt = `
${prompt}

PREVIOUS ATTEMPT FAILED:
Error: ${error.message}

Please correct the issue and try again.
Remember: Output ONLY valid JSON matching the specified format.
      `;
    }
  }
  
  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}
```

This creates a feedback loop where the LLM learns from its mistakes.
