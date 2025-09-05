# 06-single-claude-code-command-generator.md

# 🤖 Single Claude Code Command Generator System

## 📋 Overview

A systematic approach to automatically generate project-specific, copy-paste ready "Single Claude Code Commands" whenever a user mentions 'one prompt'. This system creates autonomous execution blocks for Claude Code with proper context, token estimates, and machine-specific configurations.

## 🎯 Trigger Conditions

The system activates when the user mentions any of these phrases:
- "one prompt"
- "single command"
- "copy paste command"
- "autonomous execution"
- "handoff prompt"

## 🏗️ System Architecture

### Context Detection Engine
Detects project context, machine type, and user environment automatically.

### Template Generation System
Creates project-specific command templates with token estimates and execution phases.

## 🔧 Implementation Plan

### Phase 1: Context Detection & Machine Recognition

#### Machine Detection Algorithm
- Detect MacBook M1 Pro vs M4 Mac Mini based on user path
- Auto-configure user directories and project paths
- Identify existing infrastructure and project type

#### Project Context Extraction
- Analyze project structure (package.json, src/, components/)
- Determine project complexity and estimated token requirements
- Extract objectives from conversation context

### Phase 2: Template System

#### Base Template Structure
Creates standardized Single Claude Code Command format with:
- Session metadata and token tracking
- Project-specific context and objectives
- Autonomous execution phases
- Success criteria and validation

#### Dynamic Template Variables
- PROJECT_NAME: Auto-extracted from directory
- PROJECT_PATH: Current working directory
- MACHINE: Detected machine type
- TOKEN_ESTIMATE: Calculated based on complexity
- EXECUTION_PHASES: Generated based on project type

### Phase 3: Token Estimation Engine

#### Token Calculation Algorithm
- Simple projects: 15,000 tokens
- Moderate projects: 35,000 tokens  
- Complex projects: 65,000 tokens
- Enterprise projects: 100,000 tokens

#### Model Selection Logic
- UI Development: 80% Sonnet 4, 20% Opus 4
- Backend APIs: 70% Sonnet 4, 30% Opus 4
- Full-Stack: 60% Sonnet 4, 40% Opus 4
- Architecture: 40% Sonnet 4, 60% Opus 4

### Phase 4: Execution Phase Generator

#### Phase Template System
Pre-defined templates for common project types:
- Dashboard builds: Monitoring, UI, Analytics, Deployment
- Website rebuilds: Auth fixes, Feature alignment, Optimization
- API development: Architecture, Implementation, Testing
- Full-stack apps: Backend, Frontend, Integration, Deployment

## 📊 Usage Workflow

### Step 1: Trigger Detection
System detects "one prompt" mention and analyzes current project context.

### Step 2: Context Analysis  
Extracts project details, complexity, and objectives from conversation.

### Step 3: Template Generation
Creates complete Single Claude Code Command ready for copy-paste execution.

## 🔄 Template Categories

### Dashboard/Analytics Projects
- Token Range: 45,000 - 75,000
- Duration: 4-6 hours
- Phases: Real-time monitoring, UI components, analytics, deployment

### Website Rebuild Projects
- Token Range: 20,000 - 40,000
- Duration: 2-4 hours  
- Phases: Emergency fixes, feature alignment, optimization

### API Development Projects
- Token Range: 30,000 - 60,000
- Duration: 3-5 hours
- Phases: Architecture, implementation, testing, documentation

### Full-Stack Applications
- Token Range: 60,000 - 100,000
- Duration: 6-8 hours
- Phases: Backend setup, frontend development, integration

## 🎯 Implementation Strategy

### Phase 1: Core System (Week 1)
- Context detection engine
- Basic template generation  
- Machine/user path detection
- Token estimation algorithms

### Phase 2: Advanced Features (Week 2)
- Project type classification
- Dynamic phase generation
- Cache efficiency estimation  
- Success criteria automation

### Phase 3: Integration (Week 3)
- Claude integration for automatic triggering
- Template library expansion
- Performance optimization
- Error handling and validation

## 📋 Success Metrics

### System Performance
- Generate command in <30 seconds
- 95%+ accuracy in context detection
- Token estimates within 15% of actual usage
- 100% copy-paste compatibility with Claude Code

### User Experience  
- Zero manual template editing required
- Automatic machine/path detection
- Project-specific customization
- Comprehensive success criteria included

### Quality Metrics
- Generated commands execute successfully
- All phases complete autonomously
- Production-ready deliverables
- Accurate token tracking for v2 analysis

## 🔧 Technical Implementation

### Command Generation Script
Bash script that:
- Detects current machine and user context
- Analyzes project structure and complexity
- Generates appropriate token estimates
- Creates complete Single Claude Code Command

### Integration with Existing Workflow
- Automatic triggering on "one prompt" mention
- Context-aware template selection
- Machine-specific path configuration
- Project-type optimization

## 🚀 Delivery Timeline

### Week 1: Foundation
- Context detection system
- Basic template generation
- Machine detection algorithm
- Token estimation engine

### Week 2: Enhancement
- Project type classification  
- Dynamic phase generation
- Template library creation
- Success criteria automation

### Week 3: Production
- Claude integration
- Performance optimization
- Error handling
- Documentation and testing

## 📈 Future Enhancements

### v2.0 Features
- AI-powered project complexity analysis
- Historical token usage learning
- Template optimization based on success rates
- Integration with project management systems

### v3.0 Features  
- Natural language to command generation
- Multi-project template orchestration
- Team collaboration features
- Advanced analytics and reporting

## 🎯 Conclusion

This Single Claude Code Command Generator System creates a seamless, automated workflow for generating project-specific, autonomous execution commands. By detecting context, estimating tokens, and creating comprehensive execution plans, it transforms any mention of "one prompt" into a production-ready Claude Code command.

**Key Benefits:**
- ⚡ Instant command generation
- 🎯 Project-specific customization  
- 📊 Accurate token tracking
- 🚀 Autonomous execution
- 💡 Zero manual template editing

**Result:** A systematic approach to Claude Code automation that scales across all project types and complexity levels.
