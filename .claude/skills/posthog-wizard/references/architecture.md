# PostHog Wizard Architecture Patterns

## System Design Philosophy

PostHog Wizard demonstrates an **AI-first architecture** where:
1. **Determinism wraps non-determinism**: Structured prompts control LLM chaos
2. **Conventional code participates in AI**: CLI tools become AI agents
3. **Context persists beyond execution**: Rules files enable ongoing support

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│         NPX Entry Point                  │
│      (Single Command Line)               │
└──────────────────┬──────────────────────┘
                   │
       ┌───────────┴────────────┐
       │                        │
┌──────▼─────┐          ┌──────▼──────┐
│   Setup    │          │     MCP     │
│  Wizard    │          │  Commands   │
└──────┬─────┘          └──────┬──────┘
       │                        │
       │                        │
┌──────▼────────────────────────▼──────┐
│      Argument Parser & Router         │
│         (Commander.js)                │
└──────┬───────────────────────────────┘
       │
┌──────▼──────────────────┐
│   Workflow Orchestrator  │ ← State Management
└──────┬──────────────────┘
       │
       ├──→ Gather Input (Questions/Files)
       │
       ├──→ Deterministic Prompts ──→ LLM Query
       │                               │
       │                               ▼
       │                         Parse JSON
       │                               │
       ├──→ Code Modifications ←──────┘
       │
       ├──→ Generate .cursor/rules
       │
       └──→ Track Analytics (PostHog)
```

## Core Components

### 1. Entry Point (`run.ts`)

**Purpose**: CLI orchestration and argument routing

**Key Responsibilities**:
- Parse command-line arguments
- Route to appropriate handler
- Initialize services (analytics, LLM client)
- Handle errors and output

**Pattern**:
```typescript
// Single entry point, multiple commands
program
  .command('setup')
  .option('--integration <type>', 'Framework to integrate')
  .action(handleSetup);

program
  .command('mcp <action>')
  .action(handleMCP);
```

### 2. Prompt Library (`src/lib/prompts.ts`)

**Purpose**: Deterministic LLM prompt templates

**Key Responsibilities**:
- Define structured prompts
- Specify output formats
- Provide examples and constraints
- Maintain consistency across runs

**Pattern**:
```typescript
export const PROMPTS = {
  // Function returns prompt string
  analyze: (context: string) => `
    Analyze this code: ${context}
    
    Output ONLY JSON:
    { "status": "...", "recommendations": [...] }
  `,
  
  // Multiple variants for different contexts
  analyzeReact: (code: string) => `...`,
  analyzeNextJS: (code: string) => `...`
};
```

### 3. Query Interface (`src/utils/query.ts`)

**Purpose**: Centralized LLM communication

**Key Responsibilities**:
- Send prompts to hosted LLM
- Parse and validate responses
- Handle errors and retries
- Control model version

**Architecture Decision**:
- PostHog hosts LLM interface (centralized control)
- Alternative: Direct API (your control, your cost)

**Pattern**:
```typescript
class QueryEngine {
  private endpoint: string;
  
  async query(prompt: string): Promise<any> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
    
    return this.parseResponse(await response.json());
  }
  
  private parseResponse(data: any): any {
    // Remove markdown, validate JSON
    // Error handling, retries
  }
}
```

### 4. Analytics (`src/utils/analytics.ts`)

**Purpose**: Track usage and improve tool

**Key Responsibilities**:
- Capture events (start, complete, error)
- Track properties (duration, choices, errors)
- Enable product analytics
- Support feedback loops

**Pattern**:
```typescript
class Analytics {
  private posthog: PostHog;
  
  trackWizardStart(properties: WizardContext) {
    this.posthog.capture({
      distinctId: properties.projectId,
      event: 'wizard_started',
      properties: {
        integration: properties.integration,
        timestamp: new Date().toISOString()
      }
    });
  }
}
```

### 5. Rules Generator (`src/utils/rules/add-editor-rules.ts`)

**Purpose**: Create agent context files

**Key Responsibilities**:
- Generate `.cursor/rules` markdown files
- Include project-specific context
- Document common pitfalls
- Provide ongoing guidance

**Pattern**:
```typescript
async function generateRules(
  projectPath: string,
  context: ProjectContext
) {
  const rulesPath = path.join(projectPath, '.cursor', 'rules');
  await fs.mkdir(rulesPath, { recursive: true });
  
  const content = `
# Project: ${context.name}

## Setup Complete
PostHog initialized on ${new Date().toLocaleString()}

## Configuration
- Integration: ${context.integration}
- API Key: [Set in environment]

## Common Issues
1. Missing environment variables
2. Incorrect event names
3. ...

## Best Practices
- Always test events in PostHog
- Use feature flags for gradual rollouts
- ...
  `;
  
  await fs.writeFile(
    path.join(rulesPath, 'posthog.md'),
    content
  );
}
```

## Data Flow Patterns

### Pattern 1: Stateless Wizard Flow

Each step is independent, state passed through:

```typescript
async function runWizard() {
  // 1. Gather
  const input = await gatherInput();
  
  // 2. Analyze
  const analysis = await analyzeWithLLM(input);
  
  // 3. Execute
  const result = await executeChanges(analysis);
  
  // 4. Persist
  await generateRules(result);
}
```

### Pattern 2: State Machine

For complex multi-step wizards:

```typescript
type WizardState = {
  step: 'input' | 'analysis' | 'confirmation' | 'execution';
  data: any;
  errors: string[];
};

class WizardStateMachine {
  private state: WizardState;
  
  async next() {
    switch (this.state.step) {
      case 'input':
        await this.gatherInput();
        this.state.step = 'analysis';
        break;
      case 'analysis':
        await this.analyze();
        this.state.step = 'confirmation';
        break;
      // ...
    }
  }
}
```

## Error Handling Strategies

### 1. LLM Response Errors

```typescript
async function queryWithRetry(
  prompt: string,
  maxRetries: number = 3
): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await llm.query(prompt);
      return parseJSON(response);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

### 2. File System Errors

```typescript
async function safeFileWrite(
  path: string,
  content: string
): Promise<void> {
  try {
    await fs.mkdir(dirname(path), { recursive: true });
    await fs.writeFile(path, content);
  } catch (error) {
    if (error.code === 'EACCES') {
      console.error('Permission denied:', path);
      console.log('Try running with sudo or check permissions');
    }
    throw error;
  }
}
```

### 3. User Input Errors

```typescript
function validateInput(input: UserInput): ValidationResult {
  const errors: string[] = [];
  
  if (!input.projectId) {
    errors.push('Project ID is required');
  }
  
  if (!input.apiKey || !input.apiKey.startsWith('phc_')) {
    errors.push('Invalid API key format');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

## Scalability Considerations

### 1. Framework Detection

Auto-detect framework instead of requiring flag:

```typescript
async function detectFramework(
  projectPath: string
): Promise<Framework> {
  const packageJson = JSON.parse(
    await fs.readFile(
      path.join(projectPath, 'package.json'),
      'utf-8'
    )
  );
  
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  if (deps.next) return 'nextjs';
  if (deps.react) return 'react';
  if (deps.svelte) return 'svelte';
  // ...
}
```

### 2. Plugin Architecture

Support extensibility:

```typescript
interface WizardPlugin {
  name: string;
  detect: (project: Project) => boolean;
  setup: (project: Project) => Promise<void>;
}

class WizardRunner {
  private plugins: WizardPlugin[] = [];
  
  registerPlugin(plugin: WizardPlugin) {
    this.plugins.push(plugin);
  }
  
  async run(project: Project) {
    const applicable = this.plugins.filter(p => 
      p.detect(project)
    );
    
    for (const plugin of applicable) {
      await plugin.setup(project);
    }
  }
}
```

## Testing Strategies

### 1. Mock LLM Responses

```typescript
class MockLLM implements LLMInterface {
  private responses: Map<string, any>;
  
  setResponse(prompt: string, response: any) {
    this.responses.set(prompt, response);
  }
  
  async query(prompt: string): Promise<any> {
    return this.responses.get(prompt) || 
      { error: 'No mock response' };
  }
}
```

### 2. Fixture-Based Testing

```typescript
describe('Wizard', () => {
  it('should handle Next.js project', async () => {
    const projectPath = './test/fixtures/nextjs-app';
    const result = await runWizard(projectPath);
    
    expect(result.integration).toBe('nextjs');
    expect(result.filesModified).toContain('app/layout.tsx');
  });
});
```

## Performance Optimization

### 1. Parallel Operations

```typescript
async function setupProject(project: Project) {
  // Run independent operations in parallel
  const [analysis, dependencies, config] = await Promise.all([
    analyzeProject(project),
    installDependencies(project),
    loadConfig(project)
  ]);
  
  // Use results
  return combineResults(analysis, dependencies, config);
}
```

### 2. Cached Responses

```typescript
class CachedLLM implements LLMInterface {
  private cache: Map<string, any> = new Map();
  
  async query(prompt: string): Promise<any> {
    const key = hashPrompt(prompt);
    
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const response = await this.llm.query(prompt);
    this.cache.set(key, response);
    return response;
  }
}
```

## Security Considerations

### 1. API Key Handling

```typescript
function loadAPIKey(): string {
  // Priority order: CLI flag > env var > config file
  return (
    process.env.POSTHOG_API_KEY ||
    loadFromConfig('.posthogrc') ||
    promptForAPIKey()
  );
}

function validateAPIKey(key: string): boolean {
  // Format validation
  if (!key.startsWith('phc_')) return false;
  
  // Length validation
  if (key.length < 20) return false;
  
  return true;
}
```

### 2. File System Isolation

```typescript
function validatePath(userPath: string, basePath: string): boolean {
  const resolved = path.resolve(userPath);
  const base = path.resolve(basePath);
  
  // Prevent directory traversal
  return resolved.startsWith(base);
}
```

## Deployment Strategies

### NPX Distribution

```json
{
  "name": "@posthog/wizard",
  "bin": {
    "posthog-wizard": "./dist/run.js"
  },
  "files": [
    "dist/",
    "assets/",
    "README.md"
  ]
}
```

Users run: `npx @posthog/wizard`

### Continuous Delivery

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    tags: ['v*']
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v3
      - run: npm publish
```

## Summary

PostHog Wizard's architecture demonstrates:
1. **Deterministic wrappers** around LLM non-determinism
2. **Progressive enhancement** from simple to complex
3. **Context persistence** via generated rules
4. **Analytics-driven improvement** via usage tracking
5. **Conventional code** as AI agent interface

These patterns are applicable to any CLI wizard or setup tool.
