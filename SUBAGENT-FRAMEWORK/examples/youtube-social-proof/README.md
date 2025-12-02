# Example Project: YouTube Social Proof Widget

This example demonstrates the complete subagent framework workflow for building a YouTube social proof widget application.

## Project Overview
Build a web application that:
- Takes YouTube video URLs as input
- Fetches video data and comments via YouTube Data API
- Performs sentiment analysis using OpenAI API
- Generates embeddable social proof widgets
- Provides iframe embed codes for other websites

## Framework Application

### Phase 1: PRD Creation
Following the optimized prompt methodology:

1. **Initial Feature Request** → `01-initial-prompt.md`
2. **Prompt Optimization** → `02-optimized-prompt.md`
3. **Iterative Refinement** → `03-refined-prompt.md`
4. **Final PRD Generation** → `04-final-prd.md`

### Phase 2: Design Phase
```bash
claude --dangerously-skip-permissions design app ./04-final-prd.md
```

**Parallel Subagent Execution:**
- UI Designer: Creates widget wireframes and design system
- API Researcher: Documents YouTube Data API and OpenAI API integration
- Component Architect: Defines component hierarchy and reusable patterns
- Testing Strategist: Plans testing approach for API integrations
- Security Specialist: Addresses iframe security and API key management

**Expected Duration:** 45-60 minutes for complete design phase

### Phase 3: Implementation Phase
```bash
claude --dangerously-skip-permissions implement app ./design-outputs/ ./youtube-widget-app/
```

**Parallel Implementation Strategy:**

**Foundation (Parallel):**
- Environment Configurator: API client setup, environment variables
- UI Foundation Builder: Base components, styling system
- Project Structure Organizer: Folder organization, import/export setup

**Core Implementation (Mixed):**
- Backend API Builder: YouTube/OpenAI API integration (parallel with Component Builder)
- Component Builder: Widget components, forms, displays (parallel with Backend)
- Integration Coordinator: Connect frontend to backend (sequential after both)

**Quality Assurance (Parallel):**
- Testing Implementer: Unit, integration, e2e tests
- Performance Optimizer: Bundle optimization, lazy loading
- Security Hardener: API key protection, iframe security
- Deployment Configurator: Build scripts, deployment setup

**Expected Duration:** 90-120 minutes for complete implementation

## Directory Structure

```
youtube-social-proof/
├── prd-creation/
│   ├── 01-initial-prompt.md
│   ├── 02-optimized-prompt.md
│   ├── 03-refined-prompt.md
│   └── 04-final-prd.md
├── design-outputs/
│   ├── manifest.json
│   ├── ui-specifications.md
│   ├── api-integrations.md
│   ├── component-architecture.md
│   ├── testing-strategy.md
│   ├── security-requirements.md
│   └── implementation-roadmap.md
└── youtube-widget-app/
    ├── package.json
    ├── .env.example
    ├── src/
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── Button.tsx
    │   │   │   ├── Input.tsx
    │   │   │   └── Card.tsx
    │   │   ├── features/
    │   │   │   ├── VideoAnalyzer.tsx
    │   │   │   ├── SentimentDisplay.tsx
    │   │   │   └── CommentCarousel.tsx
    │   │   └── layout/
    │   │       ├── Header.tsx
    │   │       └── Footer.tsx
    │   ├── hooks/
    │   │   ├── useVideoData.ts
    │   │   └── useSentimentAnalysis.ts
    │   ├── lib/
    │   │   ├── api-clients/
    │   │   │   ├── youtube.ts
    │   │   │   └── openai.ts
    │   │   └── utils/
    │   │       ├── validation.ts
    │   │       └── formatting.ts
    │   └── types/
    │       ├── youtube.ts
    │       └── sentiment.ts
    ├── pages/
    │   ├── api/
    │   │   ├── youtube/
    │   │   │   └── [videoId].ts
    │   │   └── sentiment/
    │   │       └── analyze.ts
    │   ├── widget/
    │   │   └── [id].tsx
    │   └── index.tsx
    └── __tests__/
        ├── components/
        ├── api/
        └── integration/
```

## Key Innovations Demonstrated

### 1. Intelligent Parallel Execution
- Design subagents run in parallel (no dependencies)
- Implementation subagents coordinate based on actual dependencies
- Quality assurance subagents run in parallel on completed code

### 2. File-Based Coordination
- Each subagent writes to specific, non-conflicting locations
- Orchestrator manages dependencies and validates outputs
- Persistent memory across all subagent executions

### 3. Production-Ready Architecture
- Environment configuration from the start
- Security considerations built into the design
- Performance optimization as part of the workflow
- Comprehensive testing strategy

### 4. Realistic Expectations
- Plans for 1-2 manual intervention prompts
- Common issues identified and solutions provided
- Clear distinction between MVP and production-ready

## Expected Manual Interventions

Based on the video insights, expect these common issues:

1. **API Integration Wiring**: Components may render mock data instead of real API calls
   - **Solution**: One prompt to wire up the API calls to component logic

2. **Route Configuration**: Widget embed routes may not be properly configured
   - **Solution**: One prompt to set up the widget serving endpoints

3. **Environment Variables**: API keys and configuration may need manual setup
   - **Solution**: Follow the generated `.env.example` file

## Success Metrics

### MVP Completion Indicators:
- ✅ YouTube URL input with validation
- ✅ Video data fetching and display
- ✅ Comment sentiment analysis working
- ✅ Widget generation and display
- ✅ Embed code generation
- ✅ Basic responsive design

### Production Readiness Indicators:
- ✅ Error handling for all API failures
- ✅ Rate limiting and caching implemented
- ✅ Security hardening complete
- ✅ Performance optimization applied
- ✅ Comprehensive test coverage
- ✅ Deployment configuration ready

## Lessons Learned

### From AI Oriented Dev's Experience:
1. **Orchestrator is critical** for managing complex multi-subagent workflows
2. **File-based persistence** solves the context window limitations
3. **Parallel execution** dramatically reduces development time when done safely
4. **Iterative prompt improvement** leads to better subagent performance over time
5. **Realistic expectations** for manual interventions lead to better planning

### Framework Improvements:
1. **Enhanced parallel execution** beyond the original 1-2 sequential limitation
2. **Dependency management** for coordinating complex implementation workflows
3. **Quality assurance integration** as part of the standard workflow
4. **Production readiness focus** from the design phase forward

This example serves as a template for applying the subagent framework to any web application development project.
