# Subagents

Specialized autonomous agents designed for specific, focused tasks within the Claude Agent SDK ecosystem. Browse and install from **[aitmpl.com](https://aitmpl.com/)**.

## 🤖 What are Subagents?

Subagents are lightweight, purpose-built AI agents that handle specific subtasks within larger workflows. Unlike full agents that manage entire development processes, subagents excel at focused operations like code review, testing, refactoring, or specialized analysis.

## Key Characteristics

- **Focused Scope**: Each subagent has a clear, specific responsibility
- **Composable**: Can be combined and orchestrated by parent agents
- **Efficient**: Optimized for quick execution and minimal token usage
- **Autonomous**: Can complete tasks without human intervention
- **Context-Aware**: Understand their role within larger workflows

## Installation

### 📦 Basic Installation

Install this component locally in your project. Works with your existing Claude Code setup.

```bash
npx claude-code-templates@latest --subagent code-quality/code-reviewer --yes
```

### 🌍 Global Subagent (Claude Code SDK)

Create a global subagent accessible from anywhere with zero configuration. Perfect for automation and CI/CD workflows.

```bash
npx claude-code-templates@latest --create-subagent code-quality/code-reviewer
```

After installation, use from anywhere:

```bash
code-reviewer "Review the authentication module for security issues"
```

✅ Works in scripts, CI/CD, npm tasks
✅ Auto-detects project context
✅ Powered by Claude Code SDK

### ☁️ Run in E2B Sandbox (Cloud Execution)

Execute Claude Code with this component in an isolated cloud environment using E2B. Perfect for testing complex projects without affecting your local system.

#### 🔑 Setup API Keys

Add to your `.env` file:

```bash
ANTHROPIC_API_KEY=your_anthropic_key_here
# Required for Claude Code access
E2B_API_KEY=your_e2b_key_here
```

Get your free E2B API key: **[e2b.dev/dashboard](https://e2b.dev/dashboard)**

#### 🚀 Run Command

```bash
npx claude-code-templates@latest --subagent code-quality/code-reviewer --sandbox --yes
```

The sandbox provides:
- ✅ Isolated cloud environment
- ✅ Pre-configured development tools
- ✅ No local system changes
- ✅ Perfect for testing and CI/CD

## 🎯 Common Subagents

### Code Quality

#### code-reviewer
**Icon**: 🔍
**Description**: Performs comprehensive code reviews focusing on best practices, security vulnerabilities, performance issues, and code maintainability. Uses static analysis patterns and security scanning.

**Use Cases**:
- Pre-commit code review automation
- Pull request quality gates
- Security vulnerability scanning
- Code style enforcement

**Example**:
```bash
code-reviewer "Review src/auth/login.js for security issues"
```

#### refactor-specialist
**Icon**: ♻️
**Description**: Identifies code smells, suggests refactoring opportunities, and implements clean code patterns. Specializes in improving code structure without changing functionality.

**Use Cases**:
- Technical debt reduction
- Code modernization
- Pattern implementation
- Architecture improvement

**Example**:
```bash
refactor-specialist "Suggest refactoring for src/services/payment-processor.js"
```

#### test-generator
**Icon**: 🧪
**Description**: Automatically generates comprehensive test suites including unit tests, integration tests, and edge cases. Supports multiple testing frameworks (Jest, Mocha, Pytest, etc.).

**Use Cases**:
- Test coverage improvement
- Regression test creation
- TDD workflow automation
- CI/CD test generation

**Example**:
```bash
test-generator "Create unit tests for utils/validation.js"
```

### Development

#### dependency-auditor
**Icon**: 📦
**Description**: Analyzes project dependencies for security vulnerabilities, outdated packages, and licensing issues. Suggests safe upgrade paths and alternatives.

**Use Cases**:
- Security auditing
- Dependency updates
- License compliance
- Package optimization

**Example**:
```bash
dependency-auditor "Audit package.json and suggest safe updates"
```

#### performance-analyzer
**Icon**: ⚡
**Description**: Profiles code for performance bottlenecks, memory leaks, and optimization opportunities. Provides specific recommendations with benchmarks.

**Use Cases**:
- Performance optimization
- Resource usage analysis
- Scalability improvements
- Bottleneck identification

**Example**:
```bash
performance-analyzer "Analyze API endpoint response times in src/api/"
```

#### api-documenter
**Icon**: 📚
**Description**: Generates comprehensive API documentation from code, including endpoint descriptions, request/response schemas, and usage examples.

**Use Cases**:
- API documentation generation
- OpenAPI/Swagger spec creation
- Developer documentation
- Integration guides

**Example**:
```bash
api-documenter "Generate API docs for src/routes/users.js"
```

### Debugging

#### error-detective
**Icon**: 🔎
**Description**: Analyzes error logs, stack traces, and runtime behavior to identify root causes and suggest fixes. Uses pattern matching and historical issue analysis.

**Use Cases**:
- Bug investigation
- Error log analysis
- Root cause analysis
- Fix suggestion

**Example**:
```bash
error-detective "Analyze error: TypeError: Cannot read property 'id' of undefined"
```

#### log-analyzer
**Icon**: 📊
**Description**: Parses and analyzes application logs to identify patterns, anomalies, and potential issues. Supports multiple log formats.

**Use Cases**:
- Log pattern analysis
- Anomaly detection
- Performance monitoring
- System health checks

**Example**:
```bash
log-analyzer "Analyze logs/application.log for the past 24 hours"
```

### Security

#### security-scanner
**Icon**: 🛡️
**Description**: Scans code for security vulnerabilities including SQL injection, XSS, CSRF, authentication issues, and insecure dependencies.

**Use Cases**:
- Security auditing
- Vulnerability scanning
- Compliance checking
- Penetration testing prep

**Example**:
```bash
security-scanner "Scan src/auth/ for security vulnerabilities"
```

#### secrets-detector
**Icon**: 🔐
**Description**: Identifies hardcoded secrets, API keys, passwords, and sensitive data in code. Suggests secure alternatives like environment variables or secret managers.

**Use Cases**:
- Secret leak prevention
- Security compliance
- Pre-commit scanning
- Audit preparation

**Example**:
```bash
secrets-detector "Scan codebase for exposed credentials"
```

### Data & Infrastructure

#### database-optimizer
**Icon**: 🗄️
**Description**: Analyzes database queries, schema design, and indexing strategies. Suggests optimizations for better performance and scalability.

**Use Cases**:
- Query optimization
- Index recommendations
- Schema design review
- Performance tuning

**Example**:
```bash
database-optimizer "Review queries in src/models/user.js"
```

#### docker-optimizer
**Icon**: 🐳
**Description**: Analyzes Dockerfiles and container configurations for best practices, security, and optimization opportunities. Reduces image sizes and build times.

**Use Cases**:
- Container optimization
- Security hardening
- Build time reduction
- Multi-stage build implementation

**Example**:
```bash
docker-optimizer "Optimize Dockerfile for production"
```

### Documentation

#### readme-generator
**Icon**: 📝
**Description**: Generates comprehensive README files by analyzing project structure, dependencies, and code. Includes setup instructions, usage examples, and API documentation.

**Use Cases**:
- Project documentation
- Open source preparation
- Onboarding guides
- Quick start creation

**Example**:
```bash
readme-generator "Create README for this project"
```

#### changelog-manager
**Icon**: 📋
**Description**: Analyzes git commits and generates well-structured CHANGELOG.md files following Keep a Changelog format. Categorizes changes and highlights breaking changes.

**Use Cases**:
- Release documentation
- Version tracking
- Change communication
- Semantic versioning

**Example**:
```bash
changelog-manager "Generate changelog for v2.0.0"
```

### AI/ML Specialists

#### prompt-optimizer
**Icon**: 🎯
**Description**: Analyzes and improves prompts for AI models. Tests variations, measures effectiveness, and suggests optimizations for better results.

**Use Cases**:
- Prompt engineering
- AI workflow optimization
- Response quality improvement
- Token usage reduction

**Example**:
```bash
prompt-optimizer "Improve this prompt: 'Write a function to validate email'"
```

#### model-selector
**Icon**: 🤖
**Description**: Recommends the optimal AI model for specific tasks based on requirements like speed, cost, accuracy, and context window needs.

**Use Cases**:
- Model selection
- Cost optimization
- Performance tuning
- Workflow design

**Example**:
```bash
model-selector "Which model for real-time customer support chatbot?"
```

## 🏗️ Creating Custom Subagents

### Subagent Structure

Create a new subagent in `.claude/subagents/`:

```markdown
# Subagent: [Name]

You are a specialized subagent focused on [specific task].

## Core Responsibilities
1. [Primary responsibility]
2. [Secondary responsibility]
3. [Additional responsibilities]

## Constraints
- Focus only on [scope]
- Do not [limitations]
- Always [requirements]

## Output Format
[Expected output structure]

## Example Usage
[Practical examples]
```

### Best Practices

1. **Single Responsibility**: Each subagent should do one thing well
2. **Clear Constraints**: Define what the subagent should and shouldn't do
3. **Consistent Output**: Provide predictable, structured results
4. **Error Handling**: Handle edge cases gracefully
5. **Documentation**: Include usage examples and limitations

### Example Custom Subagent

```markdown
# Subagent: CSS Optimizer

You are a CSS optimization specialist focused on improving stylesheet performance and maintainability.

## Core Responsibilities
1. Identify unused CSS rules
2. Suggest class consolidation opportunities
3. Recommend modern CSS features to replace legacy code
4. Optimize selector specificity
5. Identify potential CSS-in-JS migration opportunities

## Constraints
- Focus only on CSS/styling concerns
- Do not modify HTML structure
- Preserve visual appearance
- Maintain browser compatibility requirements

## Output Format
Provide a structured report with:
- Summary of findings
- Specific recommendations with code examples
- Expected performance impact
- Implementation priority (high/medium/low)

## Example Usage
Input: "Optimize styles/main.css"
Output: Detailed analysis with specific refactoring suggestions
```

## 🔄 Orchestrating Subagents

### Sequential Execution

```javascript
// Example: Code quality workflow
const workflow = [
  { subagent: 'code-reviewer', input: 'src/' },
  { subagent: 'test-generator', input: 'src/' },
  { subagent: 'security-scanner', input: 'src/' }
];

// Each subagent runs after the previous completes
```

### Parallel Execution

```javascript
// Example: Multi-aspect analysis
const parallelTasks = [
  { subagent: 'performance-analyzer', input: 'src/api/' },
  { subagent: 'security-scanner', input: 'src/api/' },
  { subagent: 'dependency-auditor', input: 'package.json' }
];

// All subagents run simultaneously
```

### Conditional Logic

```javascript
// Example: Adaptive workflow
if (hasSecurityIssues) {
  runSubagent('security-scanner');
  if (criticalVulnerabilities) {
    runSubagent('vulnerability-patcher');
  }
}
```

## 💡 Use Cases

### Pre-Commit Workflow

```bash
# .git/hooks/pre-commit
code-reviewer "Review staged changes"
test-generator "Ensure test coverage for new code"
secrets-detector "Check for exposed secrets"
```

### CI/CD Pipeline

```yaml
# .github/workflows/quality.yml
- name: Code Review
  run: code-reviewer "Review PR changes"

- name: Security Scan
  run: security-scanner "Scan for vulnerabilities"

- name: Performance Check
  run: performance-analyzer "Benchmark critical paths"
```

### Development Automation

```json
// package.json
{
  "scripts": {
    "review": "code-reviewer 'Review src/'",
    "test:gen": "test-generator 'Generate missing tests'",
    "docs": "api-documenter 'Update API documentation'",
    "optimize": "refactor-specialist 'Suggest refactorings'"
  }
}
```

## 🎓 Learning Resources

- **[Claude Agent SDK Docs](https://docs.anthropic.com/claude/docs/agents)**: Official agent development guide
- **[AITMPL Component Library](https://aitmpl.com/)**: Browse all available components
- **[Agent Best Practices](https://docs.aitmpl.com/components/agents)**: Design patterns and tips
- **[E2B Sandbox Docs](https://e2b.dev/docs)**: Cloud execution environment

## 🔗 Related Components

- **[Agents](./agents.md)**: Full-featured development specialists
- **[Commands](./commands.md)**: Custom slash commands
- **[Hooks](./hooks.md)**: Event-driven automation
- **[MCPs](./mcps.md)**: External service integrations

## 📊 Performance Considerations

### Token Optimization
- Subagents use focused prompts to minimize token usage
- Haiku model recommended for simple, fast operations
- Sonnet for complex analysis and reasoning
- Opus for critical decisions requiring highest quality

### Execution Time
- Most subagents complete in 5-30 seconds
- Parallel execution reduces total workflow time
- Consider caching results for repeated operations

### Cost Management
- Use appropriate model tiers (Haiku < Sonnet < Opus)
- Batch similar operations when possible
- Monitor token usage with built-in analytics

## 🚀 Getting Started

1. **Install a subagent**:
   ```bash
   npx claude-code-templates@latest --subagent code-quality/code-reviewer --yes
   ```

2. **Test it**:
   ```bash
   code-reviewer "Review src/index.js"
   ```

3. **Integrate into workflow**:
   ```bash
   # Add to package.json scripts or CI/CD pipeline
   ```

4. **Create custom subagents**:
   ```bash
   # Create .claude/subagents/my-specialist.md
   ```

## 🤝 Contributing

Have a useful subagent? Share it with the community!

1. Create your subagent following best practices
2. Test thoroughly in different scenarios
3. Document usage examples and limitations
4. Submit to the AITMPL marketplace

---

**Need Help?**
- 📖 [Documentation](https://docs.aitmpl.com/)
- 💬 [Community Discord](https://discord.gg/aitmpl)
- 🐛 [Report Issues](https://github.com/davila7/claude-code-templates/issues)
