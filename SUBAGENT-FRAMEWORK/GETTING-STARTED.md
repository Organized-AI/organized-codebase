# Getting Started with the Subagent Framework

## Quick Start (5 Minutes)

### 1. Set Up Your First Project
```bash
# Navigate to your projects directory
cd "/Users/jordaaan/Library/Mobile Documents/com~apple~CloudDocs/BHT Promo iCloud/Organized AI/Windsurf"

# Create a new project folder
mkdir my-first-subagent-project
cd my-first-subagent-project

# Copy framework templates
cp -r "../Organized Codebase/SUBAGENT-FRAMEWORK/agents" .
cp -r "../Organized Codebase/SUBAGENT-FRAMEWORK/commands" .
cp -r "../Organized Codebase/SUBAGENT-FRAMEWORK/templates" .
```

### 2. Create Your First PRD
Follow the 3-step process:
```bash
# Step 1: Create initial prompt
echo "I want to build a simple task management app..." > 01-initial-prompt.md

# Step 2: Use Claude to optimize the prompt
claude --dangerously-skip-permissions optimize prompt 01-initial-prompt.md

# Step 3: Generate PRD with specialized subagent
claude --dangerously-skip-permissions create prd optimized-prompt.md
```

### 3. Run the Design Phase
```bash
claude --dangerously-skip-permissions design app final-prd.md
```

### 4. Run the Implementation Phase
```bash
# Initialize your target app folder first
npx create-next-app@latest my-app

# Then implement using design outputs
claude --dangerously-skip-permissions implement app ./design-outputs/ ./my-app/
```

## Understanding the Framework

### Core Philosophy
1. **Orchestrator-Centered**: One agent coordinates all others
2. **Phase Separation**: Design completely before implementing
3. **File-Based Memory**: All state persisted to filesystem
4. **Intelligent Parallelization**: Run subagents in parallel when safe, sequential when dependencies exist

### Key Innovation: Beyond Sequential Implementation
Unlike the original AI Oriented Dev approach that suggested "1-2 subagents maximum at any time" for implementation, this framework enables:

- **Smart Parallel Execution**: Multiple subagents can run simultaneously if their outputs don't conflict
- **Dependency Coordination**: Orchestrator manages which subagents need to wait for others
- **File Location Management**: Each subagent writes to specific, non-overlapping locations

## Framework Components

### 1. Agent Templates (`/agents/`)
```
agents/
├── orchestrator/
│   └── primary-orchestrator.md    # Main coordination logic
├── research/
│   ├── ui-designer.md             # Design system and wireframes
│   ├── api-researcher.md          # External service integration
│   ├── component-architect.md     # Component hierarchy design
│   ├── testing-strategist.md      # Testing approach and coverage
│   └── security-specialist.md     # Security requirements
└── implementation/
    ├── environment-configurator.md    # API setup and environment
    ├── ui-foundation-builder.md      # Base UI components
    ├── backend-api-builder.md        # API routes and data fetching
    ├── component-builder.md          # Feature components
    ├── integration-coordinator.md    # Frontend-backend connection
    ├── testing-implementer.md        # Test suite implementation
    ├── performance-optimizer.md      # Performance and optimization
    ├── security-hardener.md          # Security implementation
    └── deployment-configurator.md    # Build and deployment setup
```

### 2. Custom Commands (`/commands/`)
- **design-app.md**: Orchestrates the complete design phase
- **implement-app.md**: Orchestrates the complete implementation phase

### 3. Templates (`/templates/`)
- **prd-creation-process.md**: The revolutionary prompt-optimization approach to creating PRDs

## Workflow Overview

### Phase 1: PRD Creation (30-45 minutes)
1. **Initial Feature Description** (5 minutes)
2. **Prompt Optimization with Claude** (15 minutes)
3. **Iterative Refinement** (10-15 minutes)
4. **Final PRD Generation** (5-10 minutes)

### Phase 2: Design Phase (45-60 minutes)
**Parallel Execution Block 1:**
- UI Designer + API Researcher (20-25 minutes)

**Parallel Execution Block 2:**
- Component Architect + Testing Strategist + Security Specialist (15-20 minutes)

**Synthesis and Validation:**
- Orchestrator validation and manifest update (5-10 minutes)

### Phase 3: Implementation Phase (90-120 minutes)
**Foundation Block (Parallel):**
- Environment Configurator + UI Foundation Builder + Project Structure Organizer (20-30 minutes)

**Core Implementation Block:**
- Backend API Builder + Component Builder (Parallel, 30-40 minutes)
- Integration Coordinator (Sequential, 15-20 minutes)

**Quality Assurance Block (Parallel):**
- Testing + Performance + Security + Deployment (20-30 minutes)

**Total Development Time: 3-4 hours from idea to working MVP**

## Advanced Usage Patterns

### 1. Custom Subagent Creation
To create a specialized subagent for your domain:

```markdown
# My Custom Subagent Template

## Role
You are a specialized [DOMAIN] subagent focused on [SPECIFIC OBJECTIVE].

## Objectives
1. [Primary objective]
2. [Secondary objective]
3. [Quality objective]

## Input Requirements
- [Required input files]
- [Dependencies from other subagents]

## Output Deliverables
- [Specific file outputs]
- [Expected content structure]

## Integration Points
- [How this subagent coordinates with others]
- [File locations and naming conventions]

## Quality Standards
- [Validation criteria]
- [Success metrics]
```

### 2. Framework Customization for Different Tech Stacks

#### For Vue.js Projects:
- Modify `ui-foundation-builder.md` for Vue component patterns
- Update `component-builder.md` for Vue composition API
- Adjust `testing-implementer.md` for Vue Test Utils

#### For Python/FastAPI Projects:
- Replace `backend-api-builder.md` with FastAPI-specific patterns
- Update `testing-implementer.md` for pytest
- Modify `deployment-configurator.md` for Python deployment

#### For Mobile Development:
- Replace `ui-designer.md` with mobile-first design patterns
- Update `component-architect.md` for React Native or Flutter
- Modify `performance-optimizer.md` for mobile performance

### 3. Integration with Existing Projects
To use the framework with an existing codebase:

```bash
# Analyze existing project structure
claude --dangerously-skip-permissions analyze project ./existing-app/

# Generate integration plan
claude --dangerously-skip-permissions plan integration ./design-outputs/ ./existing-app/

# Apply changes incrementally
claude --dangerously-skip-permissions implement incremental ./integration-plan.md ./existing-app/
```

## Best Practices

### 1. PRD Quality
- **Invest time in prompt optimization** - it saves hours later
- **Be specific about external integrations** - include API documentation links
- **Define error handling requirements** - not just happy path scenarios
- **Include performance and security requirements** - don't leave them for later

### 2. Subagent Coordination
- **Trust the orchestrator** - let it manage dependencies
- **Don't override parallel execution** - the framework knows what can run together
- **Monitor file outputs** - ensure subagents are writing to expected locations
- **Validate intermediate outputs** - catch issues before they compound

### 3. Manual Intervention Planning
- **Plan for 1-2 additional prompts** - this is normal and expected
- **Common issues**: API wiring, route configuration, environment variables
- **Keep solutions simple** - prefer configuration over complex fixes
- **Document recurring issues** - improve subagent prompts for next time

### 4. Framework Evolution
- **Update subagent prompts regularly** - based on encountered edge cases
- **Add specialized subagents** - for recurring patterns in your domain
- **Share improvements** - contribute back to the framework
- **Version control your customizations** - track what works for your team

## Troubleshooting

### Common Issues and Solutions

#### "Subagent didn't complete properly"
- Check if required input files exist
- Verify dependencies were satisfied
- Look for error messages in output
- Re-run with additional context

#### "Outputs aren't integrating correctly"
- Verify file locations match expectations
- Check for naming convention conflicts
- Ensure all dependencies completed successfully
- Use integration-coordinator to fix connections

#### "Performance is slower than expected"
- Check if too many subagents running in parallel
- Verify system resources aren't constrained
- Consider breaking large subagents into smaller ones
- Monitor file I/O for bottlenecks

#### "Generated code doesn't match requirements"
- Review PRD quality and specificity
- Check if design specs were comprehensive
- Verify subagent prompts include all requirements
- Use iterative refinement for complex features

## Next Steps

### 1. Practice with Simple Projects
Start with basic applications to understand the workflow:
- Todo list app
- Weather dashboard
- Simple blog
- Contact form

### 2. Customize for Your Domain
Adapt the framework for your specific needs:
- Add domain-specific subagents
- Customize technology stack templates
- Create organization-specific best practices
- Build reusable component libraries

### 3. Scale to Complex Projects
Apply to larger applications:
- Multi-service architectures
- Complex data integration
- Advanced user interfaces
- Enterprise-level applications

### 4. Contribute Improvements
Help evolve the framework:
- Document new patterns you discover
- Share specialized subagent templates
- Contribute bug fixes and optimizations
- Create examples for different domains

## Support and Community

### Getting Help
- Review the example projects in `/examples/`
- Check troubleshooting guides for common issues
- Examine successful project patterns
- Reference the original AI Oriented Dev methodology

### Contributing
- Create new subagent templates for different domains
- Document successful patterns and workflows
- Share performance optimizations
- Report issues and suggest improvements

The subagent framework is designed to evolve with your needs. Start simple, learn the patterns, then customize for your specific use cases.
