---
name: posthog-wizard
description: "Access and apply patterns from PostHog Wizard (https://github.com/PostHog/wizard) - an AI-first CLI tool for adding PostHog to projects. Use when: (1) building CLI wizards or setup tools, (2) implementing deterministic LLM prompting patterns, (3) creating MCP server management features, (4) generating .cursor/rules for agent context, (5) designing AI-first architecture, (6) understanding wizard-based onboarding flows, or (7) needing analytics integration for CLI tools. Triggers: PostHog Wizard, CLI wizard patterns, deterministic prompting, MCP management, agent rules generation, AI-first CLI."
---

# PostHog Wizard Patterns

## Overview

PostHog Wizard is an NPX-based CLI tool that demonstrates proven patterns for building AI-first developer tools. This skill provides access to its architecture, code patterns, and best practices for creating similar tools.

**Repository**: https://github.com/PostHog/wizard  
**Key Innovation**: Deterministic prompting system that controls LLM non-determinism

## Core Capabilities

### 1. Deterministic LLM Prompting

Create structured prompts that ensure consistent JSON output:

```typescript
export const PROMPTS = {
  analyze: (data: any) => `
    CRITICAL: Respond with ONLY valid JSON in this format:
    
    {
      "status": "active|inactive|misconfigured",
      "score": 0-100,
      "recommendations": ["array", "of", "actions"],
      "findings": { ... }
    }
    
    DO NOT include text outside JSON.
    DO NOT use markdown code blocks.
    
    Data: ${JSON.stringify(data, null, 2)}
  `.trim()
};
```

**Key Principles**:
- Specify exact output format with examples
- Use temperature: 0 for determinism
- Strip markdown code blocks from responses
- Validate JSON before parsing

### 2. LLM Query Wrapper

Centralize LLM interactions with consistent model and error handling:

```typescript
class QueryEngine {
  private anthropic: Anthropic;
  
  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }
  
  async query(prompt: string, data: any): Promise<any> {
    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', // Fixed model
      max_tokens: 4096,
      temperature: 0, // Deterministic
      messages: [{
        role: 'user',
        content: `${prompt}\n\n${JSON.stringify(data, null, 2)}`
      }]
    });
    
    // Parse and validate JSON
    const text = response.content[0].text;
    const cleaned = text.replace(/```(?:json)?\n?([\s\S]*?)\n?```/g, '$1');
    return JSON.parse(cleaned.trim());
  }
}
```

### 3. Agent Rules Generation

Generate `.cursor/rules` files for ongoing AI context:

```typescript
async function generateProjectRules(projectPath: string, analysis: any) {
  const rulesDir = path.join(projectPath, '.cursor', 'rules');
  await fs.mkdir(rulesDir, { recursive: true });
  
  const rules = `# Project Context

## Current Status
- Score: ${analysis.score}/100
- Last Updated: ${new Date().toISOString()}

## Recommendations
${analysis.recommendations.map((r: string) => `- ${r}`).join('\n')}

## Common Pitfalls
1. [List specific issues to avoid]
2. [Based on analysis findings]

## Architecture
\`\`\`
[Visual diagram of system architecture]
\`\`\`
  `;
  
  await fs.writeFile(
    path.join(rulesDir, 'project-context.md'),
    rules
  );
}
```

### 4. MCP Server Management

Programmatically install/remove MCP servers:

```typescript
async function manageMCP(action: 'add' | 'remove', serverConfig: any) {
  const configPath = path.join(
    os.homedir(),
    'Library/Application Support/Claude/claude_desktop_config.json'
  );
  
  const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
  
  if (action === 'add') {
    config.mcpServers = config.mcpServers || {};
    config.mcpServers[serverConfig.name] = {
      command: serverConfig.command,
      args: serverConfig.args,
      env: serverConfig.env
    };
  } else {
    delete config.mcpServers?.[serverConfig.name];
  }
  
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
}
```

### 5. CLI Tool Analytics

Track usage with PostHog:

```typescript
import { PostHog } from 'posthog-node';

class ToolAnalytics {
  private posthog: PostHog;
  
  constructor(apiKey: string) {
    this.posthog = new PostHog(apiKey, {
      host: 'https://app.posthog.com'
    });
  }
  
  trackOperation(operation: string, properties: Record<string, any>) {
    this.posthog.capture({
      distinctId: properties.userId || 'anonymous',
      event: operation,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        tool: 'your-cli-tool'
      }
    });
  }
  
  async shutdown() {
    await this.posthog.shutdown();
  }
}
```

## When to Use This Skill

Trigger this skill for:
- **Building CLI wizards**: Setup tools, onboarding flows, configuration generators
- **LLM integration**: Deterministic prompting, structured output, JSON parsing
- **MCP features**: Server installation, configuration management, discovery
- **Agent support**: Rules generation, context preservation, ongoing guidance
- **Analytics**: Usage tracking, improvement feedback loops
- **AI-first architecture**: Designing tools that work with AI assistants

## Key Design Patterns

### Pattern 1: Structured Prompt Templates

Store prompts as functions that accept parameters:

```typescript
const PROMPTS = {
  audit: (id: string, type: string) => `
    Analyze ${type} with ID ${id}.
    Output format: { status, score, issues[], recommendations[] }
  `,
  
  report: (findings: any) => `
    Generate report from findings.
    Format: Markdown with sections.
  `
};
```

### Pattern 2: Progressive Enhancement

Start simple, add features incrementally:

```typescript
// Phase 1: Basic CLI
program.command('analyze').action(basicAnalysis);

// Phase 2: Add LLM
program.command('analyze').option('--ai').action(aiAnalysis);

// Phase 3: Add MCP
program.command('mcp <action>').action(manageMCP);

// Phase 4: Add rules
program.command('init').action(generateRules);
```

### Pattern 3: Error-Resilient Parsing

Handle LLM output variations:

```typescript
function parseJSON(text: string): any {
  // Remove markdown code blocks
  text = text.replace(/```(?:json)?\n?([\s\S]*?)\n?```/g, '$1');
  
  // Remove leading/trailing whitespace
  text = text.trim();
  
  try {
    return JSON.parse(text);
  } catch (error) {
    // Try to extract JSON from mixed content
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse JSON response');
  }
}
```

## Reference Files

For detailed information on specific aspects:

- **Architecture**: See `references/architecture.md` for system design patterns
- **Prompting**: See `references/prompting.md` for advanced LLM techniques  
- **MCP Integration**: See `references/mcp.md` for server management details
- **Code Examples**: See `references/examples.md` for complete implementations

## Quick Start Template

Basic CLI wizard structure:

```typescript
#!/usr/bin/env node
import { Command } from 'commander';
import { Anthropic } from '@anthropic-ai/sdk';

const program = new Command();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

program
  .name('my-wizard')
  .command('setup')
  .action(async () => {
    console.log('🚀 Starting setup...');
    
    // 1. Gather information
    const data = await gatherData();
    
    // 2. Analyze with LLM
    const analysis = await analyzeWithLLM(data);
    
    // 3. Generate output
    await generateOutput(analysis);
    
    // 4. Create rules
    await generateRules(analysis);
    
    console.log('✅ Setup complete!');
  });

program.parse();
```

## Best Practices

1. **Always use temperature: 0** for deterministic operations
2. **Specify exact output format** in prompts with examples
3. **Validate LLM responses** before using them
4. **Generate .cursor/rules** for post-wizard context
5. **Track usage** with analytics to improve prompts
6. **Test with edge cases** to ensure robustness
7. **Provide clear error messages** for better DX

## Common Pitfalls to Avoid

- ❌ Expecting perfect JSON without format specification
- ❌ Using high temperature for structured output
- ❌ Not handling markdown code blocks in responses
- ❌ Forgetting to restart Claude after MCP changes
- ❌ Skipping agent rules generation
- ❌ Not tracking usage for improvements
- ❌ Overcomplicating the initial implementation

## Resources

### Repository Structure
```
posthog-wizard/
├── src/
│   ├── run.ts              # Entry point
│   ├── lib/
│   │   └── prompts.ts      # Deterministic prompts
│   ├── utils/
│   │   ├── query.ts        # LLM interface
│   │   ├── analytics.ts    # Usage tracking
│   │   └── rules/
│   │       └── add-editor-rules.ts
│   └── commands/
│       ├── setup.ts
│       └── mcp.ts
├── bin/
│   ├── build               # Build script
│   └── test                # Test runner
└── package.json
```

### External Links
- **Repository**: https://github.com/PostHog/wizard
- **NPM Package**: https://www.npmjs.com/package/@posthog/wizard
- **PostHog Docs**: https://posthog.com/docs
- **MCP Specification**: https://modelcontextprotocol.io
