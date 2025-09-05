# PRD Creation Process

## The Revolutionary Approach: Prompt Optimization First

Based on AI Oriented Dev's methodology, this is the **correct way** to create PRDs that lead to successful implementations.

## ❌ The Wrong Way
```
"Create a PRD for an app that does X, Y, Z features..."
```
**Problems with this approach:**
- Results in generic, non-implementable PRDs
- Missing critical technical details
- Lacks specific feature specifications
- No consideration for integration complexities

## ✅ The Right Way: 3-Step Process

### Step 1: Prompt Optimization Request
```markdown
I want you to optimize a prompt for me that will be used for generating a PRD for building a web app.

The app should have these core features:
- [List your core features specifically]
- [Include any external service integrations] 
- [Mention specific user interactions]
- [Include any special requirements like embedding, widgets, etc.]

Please create an optimized prompt that I can pass to a specialized PRD creator to get a comprehensive, implementable product requirements document.
```

### Step 2: Iterative Prompt Refinement
Take the optimized prompt and refine it through conversation:

```markdown
Consider the prompt in the text file and help me improve it to include:
- [Any missing features you thought of]
- [Specific technical requirements]  
- [Integration requirements]
- [User experience details]
- [Performance or scalability needs]

Example refinements:
- "How can I include the ability for my app to provide an embeddable widget on other websites?"
- "What about handling rate limiting for external APIs?"
- "Should we include user authentication and data persistence?"
```

**Key principle:** Iterate on the PROMPT, not the PRD itself.

### Step 3: Specialized PRD Generation
Use the optimized prompt with a specialized PRD subagent:

```bash
claude --dangerously-skip-permissions create prd [optimized-prompt-file]
```

## Example: YouTube Social Proof Widget

### Step 1: Initial Feature Request
```markdown
I want you to optimize a prompt for me that will be used for generating a PRD for building a web app.

The app should:
- Take a YouTube video URL as input
- Fetch video details and comments using YouTube Data API
- Perform sentiment analysis on comments using OpenAI API
- Create a social proof widget showing video stats and positive sentiment
- Generate an embeddable iframe widget that can be used on other websites
- Display a carousel of positive comments from the video

Please create an optimized prompt for a PRD creator.
```

### Step 2: Prompt Refinement
```markdown
Consider the prompt and help me improve it to include:
- Error handling for invalid YouTube URLs
- Rate limiting considerations for both APIs
- Caching strategy for expensive API calls
- Responsive design for the widget
- Customization options for the embed widget
- Security considerations for iframe embedding
- Analytics tracking for widget usage
```

### Step 3: Final Optimized Prompt
```markdown
Create a comprehensive PRD for a YouTube Social Proof Widget web application with the following specifications:

CORE FUNCTIONALITY:
- URL Input System: Accept YouTube video URLs with validation and error handling
- YouTube Data Integration: Fetch video metadata, statistics, and comments using YouTube Data API v3
- AI-Powered Analysis: Use OpenAI API for sentiment analysis of video comments
- Widget Generation: Create responsive social proof widgets displaying video stats and sentiment
- Embed System: Generate iframe embed codes for external website integration

TECHNICAL REQUIREMENTS:
- API Management: Rate limiting, error handling, and caching for both YouTube and OpenAI APIs
- Responsive Design: Mobile-first widget design that works across all screen sizes
- Performance: Fast loading times with optimized API calls and data caching
- Security: Secure iframe embedding with proper CSP headers and XSS protection

USER EXPERIENCE:
- Simple URL input interface with real-time validation
- Loading states during API processing
- Error handling with user-friendly messages
- One-click copy for embed codes
- Preview functionality for generated widgets

WIDGET FEATURES:
- Video metadata display (title, channel, view count, likes)
- Sentiment analysis summary with visual indicators
- Carousel of positive comments with author attribution
- Customizable styling options for different website themes
- Analytics tracking for widget performance

INFRASTRUCTURE:
- Scalable architecture to handle multiple concurrent requests
- Database integration for caching and analytics
- Environment configuration for API keys and secrets
- Deployment strategy for production readiness

Create a PRD that provides clear specifications for each feature, technical architecture, user flows, and implementation priorities suitable for development with Claude Code subagents.
```

## PRD Subagent Template

### Creating a Specialized PRD Writer
```markdown
# PRD Writer Subagent

## Role
You are a specialized Product Requirements Document writer focused on creating comprehensive, implementable specifications for web applications.

## Objectives
1. Transform feature descriptions into detailed technical specifications
2. Create clear user stories and acceptance criteria
3. Define technical architecture and integration requirements
4. Establish implementation priorities and development phases

## Output Structure

### 1. Executive Summary
- Project overview and objectives
- Target users and use cases
- Key success metrics

### 2. Detailed Feature Specifications
For each feature:
- User story format
- Acceptance criteria
- Technical requirements
- API dependencies
- Error handling requirements

### 3. Technical Architecture
- System components and data flow
- External service integrations
- Database schema requirements
- Security and performance considerations

### 4. User Experience Requirements
- User interface specifications
- User flow diagrams
- Responsive design requirements
- Accessibility considerations

### 5. Implementation Roadmap
- MVP feature prioritization
- Development phases
- Dependencies and blockers
- Testing requirements

## Quality Standards
- All features must be implementable with clear technical specifications
- Include error handling and edge cases for every feature
- Specify performance requirements and constraints
- Address security implications of each feature
- Provide clear acceptance criteria for testing
```

## File Organization for PRD Process

```
prd-creation/
├── 01-initial-prompt.md          # Your first feature description
├── 02-optimized-prompt.md        # Claude's optimized prompt
├── 03-refined-prompt.md          # Your iterative improvements
├── 04-final-prompt.md            # Final prompt for PRD subagent
└── 05-generated-prd.md           # Final PRD output
```

## Common PRD Improvement Patterns

### Technical Depth
Add specifications for:
- Error handling strategies
- Performance requirements
- Security considerations
- Scalability needs
- Integration patterns

### User Experience
Add specifications for:
- Loading states and feedback
- Error messaging and recovery
- Responsive design requirements
- Accessibility compliance
- User onboarding flows

### External Integrations
Add specifications for:
- API rate limiting and quotas
- Authentication and authorization
- Webhook handling (if applicable)
- Third-party service dependencies
- Fallback strategies for service outages

## Validation Checklist

Before using your PRD with the subagent framework:

- [ ] All features have clear acceptance criteria
- [ ] External APIs are specifically identified with documentation links
- [ ] Error handling is specified for each user interaction
- [ ] Performance requirements are quantified
- [ ] Security requirements are explicit
- [ ] MVP vs. future features are clearly distinguished
- [ ] Technical architecture is feasible with specified technology stack

## Integration with Subagent Framework

A well-created PRD using this process will:
1. Provide clear specifications for the UI Designer subagent
2. Give specific API requirements for the API Researcher subagent
3. Include technical constraints for the Component Architect
4. Specify testing requirements for the Testing Strategist
5. Enable successful implementation with minimal manual intervention

**Remember:** The quality of your PRD directly impacts the success of the entire subagent development process. Invest time in the prompt optimization phase to save hours in the implementation phase.
