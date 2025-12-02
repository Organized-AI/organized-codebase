# Design App Command

## Overview
Custom Claude Code command that orchestrates the design phase of application development using multiple specialized subagents.

## Command Syntax
```bash
claude --dangerously-skip-permissions design app [prd-file-path] [options]
```

## Command Implementation

### Phase 1: Orchestrator Initialization
```markdown
You are the PRIMARY ORCHESTRATOR for the design phase of application development.

INPUTS:
- PRD file: {prd_file_path}
- Output directory: design-outputs/ (auto-created)
- Timestamp: {current_timestamp}

STEP 1: PROJECT SETUP
1. Create timestamped project directory: project-{timestamp}
2. Create manifest.json file with initial structure
3. Create design-outputs/ directory with subdirectories:
   - ui-specifications/
   - api-integrations/  
   - component-architecture/
   - testing-strategy/
   - security-requirements/

STEP 2: MANIFEST INITIALIZATION
Create manifest.json:
```json
{
  "project_id": "project-{timestamp}",
  "prd_source": "{prd_file_path}",
  "phase": "design",
  "created_at": "{timestamp}",
  "subagents": {
    "research": [
      {
        "name": "ui-designer",
        "status": "pending",
        "output_path": "design-outputs/ui-specifications.md",
        "dependencies": [],
        "estimated_duration": "10-15 minutes"
      },
      {
        "name": "api-researcher", 
        "status": "pending",
        "output_path": "design-outputs/api-integrations.md",
        "dependencies": [],
        "estimated_duration": "15-20 minutes"
      },
      {
        "name": "component-architect",
        "status": "pending", 
        "output_path": "design-outputs/component-architecture.md",
        "dependencies": ["ui-designer"],
        "estimated_duration": "10-15 minutes"
      },
      {
        "name": "testing-strategist",
        "status": "pending",
        "output_path": "design-outputs/testing-strategy.md", 
        "dependencies": ["api-researcher"],
        "estimated_duration": "8-12 minutes"
      },
      {
        "name": "security-specialist",
        "status": "pending",
        "output_path": "design-outputs/security-requirements.md",
        "dependencies": ["api-researcher"],
        "estimated_duration": "5-10 minutes"
      }
    ]
  },
  "validation_checklist": {
    "prd_requirements_addressed": false,
    "all_outputs_generated": false,
    "integration_points_validated": false,
    "ready_for_implementation": false
  }
}
```

PROJECT INITIALIZATION COMPLETE. Proceed to Phase 2.
```

### Phase 2: Parallel Subagent Execution
```markdown
STEP 3: LAUNCH PARALLEL SUBAGENTS

Execute the following subagents in PARALLEL (they have no dependencies):

SUBAGENT 1: UI-DESIGNER
Input: PRD file content
Output: design-outputs/ui-specifications.md
Template: /agents/research/ui-designer.md

SUBAGENT 2: API-RESEARCHER  
Input: PRD file content
Output: design-outputs/api-integrations.md
Template: /agents/research/api-researcher.md

PARALLEL EXECUTION: These two subagents can run simultaneously as they have no interdependencies.

Wait for BOTH subagents to complete before proceeding to Phase 3.
```

### Phase 3: Sequential Dependent Subagents
```markdown
STEP 4: LAUNCH DEPENDENT SUBAGENTS

Once ui-designer and api-researcher are complete, launch these subagents in PARALLEL:

SUBAGENT 3: COMPONENT-ARCHITECT
Dependencies: ui-designer output
Input: PRD + ui-specifications.md  
Output: design-outputs/component-architecture.md
Template: /agents/research/component-architect.md

SUBAGENT 4: TESTING-STRATEGIST
Dependencies: api-researcher output
Input: PRD + api-integrations.md
Output: design-outputs/testing-strategy.md
Template: /agents/research/testing-strategist.md

SUBAGENT 5: SECURITY-SPECIALIST  
Dependencies: api-researcher output
Input: PRD + api-integrations.md
Output: design-outputs/security-requirements.md
Template: /agents/research/security-specialist.md

PARALLEL EXECUTION: Subagents 3, 4, and 5 can run simultaneously.

Wait for ALL three subagents to complete before proceeding to Phase 4.
```

### Phase 4: Synthesis and Validation
```markdown
STEP 5: VALIDATION AND SYNTHESIS

VALIDATION CHECKLIST:
1. Verify all expected output files exist:
   - [ ] design-outputs/ui-specifications.md
   - [ ] design-outputs/api-integrations.md  
   - [ ] design-outputs/component-architecture.md
   - [ ] design-outputs/testing-strategy.md
   - [ ] design-outputs/security-requirements.md

2. Content validation:
   - [ ] UI specifications include wireframes and component specs
   - [ ] API integrations include authentication and error handling
   - [ ] Component architecture defines clear component hierarchy
   - [ ] Testing strategy covers unit, integration, and e2e testing
   - [ ] Security requirements address all API integrations

3. PRD requirement mapping:
   - [ ] All PRD features have corresponding design specifications
   - [ ] All external service requirements documented
   - [ ] User experience requirements addressed in UI specs
   - [ ] Technical requirements covered in architecture

STEP 6: UPDATE MANIFEST
Update manifest.json with completion status:
```json
{
  "phase": "design_complete",
  "completed_at": "{timestamp}",
  "validation_checklist": {
    "prd_requirements_addressed": true,
    "all_outputs_generated": true, 
    "integration_points_validated": true,
    "ready_for_implementation": true
  }
}
```

STEP 7: GENERATE IMPLEMENTATION ROADMAP
Create design-outputs/implementation-roadmap.md:

## Implementation Roadmap
### Phase 1: Foundation (Parallel)
- Frontend: Basic component library + UI foundation
- Backend: API client setup + authentication
- DevOps: Development environment setup

### Phase 2: Core Features (Sequential/Parallel)
- Frontend: Feature component implementation
- Backend: API endpoint implementation  
- Integration: Connect frontend to backend

### Phase 3: Polish (Parallel)
- Testing: Comprehensive test suite
- Performance: Optimization and monitoring
- Deployment: Production deployment setup

DESIGN PHASE COMPLETE. Ready for implementation phase.
```

## Usage Examples

### Basic Usage
```bash
claude --dangerously-skip-permissions design app ./prd/youtube-social-proof.md
```

### With Custom Output Directory
```bash  
claude --dangerously-skip-permissions design app ./prd/youtube-social-proof.md --output ./custom-design-outputs/
```

### With Specific Framework Focus
```bash
claude --dangerously-skip-permissions design app ./prd/youtube-social-proof.md --framework next-js-15
```

## Expected Outputs

After successful completion:
```
project-{timestamp}/
├── manifest.json
├── design-outputs/
│   ├── ui-specifications.md
│   ├── api-integrations.md
│   ├── component-architecture.md
│   ├── testing-strategy.md
│   ├── security-requirements.md
│   └── implementation-roadmap.md
└── prd/
    └── {original-prd-file}
```

## Error Handling

### Common Issues:
1. **Subagent timeout**: If a subagent doesn't complete within expected time
2. **Missing dependencies**: If dependent subagent tries to run before dependencies complete
3. **Invalid PRD**: If PRD file is malformed or incomplete
4. **File system errors**: If output directories can't be created

### Recovery Strategies:
- Retry failed subagents with additional context
- Manual intervention prompts for complex issues
- Validation failures trigger specific guidance for manual fixes

## Integration with Implementation Phase
This command's outputs are designed to be consumed by the `implement app` command, ensuring seamless transition from design to implementation.
