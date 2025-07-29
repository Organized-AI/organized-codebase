# Coding Instructions for AI Agent

## Project Overview
**Project Name**: [Your Project Name]
**Description**: [Brief description of what needs to be built]
**Target Users**: [Who will use this application]
**Core Value Proposition**: [What unique value does this provide]

## Development Environment Setup

### Prerequisites
- **Runtime**: [Node.js 18+, Python 3.9+, Go 1.19+, etc.]
- **Package Manager**: [npm, yarn, pnpm, pip, go mod, etc.]
- **Database**: [PostgreSQL 14+, MongoDB 5+, etc.]
- **Additional Tools**: [Docker, Redis, etc.]

### Initial Setup Commands
```bash
# Example setup commands - customize for your project
git clone [repository-url]
cd [project-directory]
npm install  # or yarn install, pip install -r requirements.txt, etc.
cp .env.example .env
# Update .env with actual values
npm run setup  # or equivalent setup script
npm run dev    # start development server
```

### Environment Variables
```bash
# Required Environment Variables
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-jwt-secret-key"
API_KEY="your-api-key"
PORT=3000

# Optional Environment Variables
DEBUG=true
LOG_LEVEL="info"
REDIS_URL="redis://localhost:6379"
EMAIL_SERVICE_API_KEY="your-email-service-key"
```

## Coding Standards & Guidelines

### Code Style
- **Formatter**: [Prettier, Black, gofmt, etc.]
- **Linter**: [ESLint, pylint, golangci-lint, etc.]
- **Style Guide**: [Airbnb, Google, Standard, etc.]

### Naming Conventions
- **Variables**: camelCase (JavaScript) / snake_case (Python) / camelCase (Go)
- **Functions**: camelCase (JavaScript) / snake_case (Python) / CamelCase (Go)
- **Files**: kebab-case for components, snake_case for utilities
- **Database**: snake_case for table and column names
- **Constants**: UPPER_SNAKE_CASE

### File Organization
```
[Framework-specific structure]
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   └── features/       # Feature-specific components
├── pages/              # Page components or route handlers
├── hooks/              # Custom hooks (React) or utilities
├── services/           # API calls and business logic
├── utils/              # Pure utility functions
├── types/              # Type definitions (TypeScript)
├── styles/             # CSS/SCSS files
└── tests/              # Test files
```

### Comment Requirements
- **File Headers**: Include purpose and main exports
- **Function Comments**: JSDoc format for public APIs
- **Complex Logic**: Explain the "why" not the "what"
- **TODO Comments**: Include ticket number and deadline

```javascript
/**
 * Calculates the user's subscription tier based on usage metrics
 * @param {Object} user - User object with usage data
 * @param {number} currentUsage - Current month's usage
 * @returns {string} Subscription tier (free, pro, enterprise)
 */
function calculateSubscriptionTier(user, currentUsage) {
  // Check enterprise tier first (highest usage threshold)
  if (currentUsage > ENTERPRISE_THRESHOLD) {
    return 'enterprise';
  }
  // TODO: Add premium tier logic (ticket #123, due: 2024-02-15)
  return currentUsage > PRO_THRESHOLD ? 'pro' : 'free';
}
```

## Implementation Priority Order

### Phase 1: Foundation (Build First)
1. **Project Setup**: Initialize framework, configure tools, set up CI/CD
2. **Database Schema**: Create all necessary tables and relationships
3. **Authentication System**: User registration, login, password reset
4. **Basic API Structure**: Core endpoints with proper error handling
5. **UI Foundation**: Layout, navigation, basic components

### Phase 2: Core Features (Build Second)
1. **[Primary Feature 1]**: [Specific implementation details]
2. **[Primary Feature 2]**: [Specific implementation details]
3. **Data Management**: CRUD operations for core entities
4. **User Interface**: Complete UI for core workflows
5. **API Integration**: Connect frontend to backend APIs

### Phase 3: Advanced Features (Build Third)
1. **[Advanced Feature 1]**: [Implementation details]
2. **Third-party Integrations**: Payment, email, analytics
3. **Real-time Features**: WebSocket connections, live updates
4. **Performance Optimization**: Caching, lazy loading, optimization
5. **Admin Features**: Admin dashboard, user management

### Phase 4: Polish (Build Last)
1. **Error Handling**: Comprehensive error states and messages
2. **Loading States**: Proper loading indicators and skeleton screens
3. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
4. **Testing**: Unit tests, integration tests, end-to-end tests
5. **Documentation**: Code comments, API docs, user guides

## Feature Implementation Details

### Feature 1: [Feature Name]
**Purpose**: [What this feature accomplishes]

**Input Requirements**:
- **Data Format**: [JSON, form data, file upload, etc.]
- **Validation Rules**: [Required fields, format requirements, constraints]
- **Authentication**: [Required permissions or roles]

**Processing Logic**:
1. [Step 1: Validate input data]
2. [Step 2: Process business logic]
3. [Step 3: Update database]
4. [Step 4: Return response]

**Output Format**:
```json
{
  "success": true,
  "data": {
    "id": "unique-identifier",
    "field1": "value1",
    "field2": "value2"
  },
  "message": "Success message for user"
}
```

**Error Handling**:
- **Validation Errors**: Return 400 with specific field errors
- **Authentication Errors**: Return 401 with clear message
- **Authorization Errors**: Return 403 with permission info
- **Not Found Errors**: Return 404 with helpful guidance
- **Server Errors**: Return 500 with generic message, log details

**Example Implementation**:
```javascript
// Example for JavaScript/Node.js - adapt for your technology
async function createFeature(req, res) {
  try {
    // Validate input
    const { error, value } = featureSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details
      });
    }
    
    // Process business logic
    const result = await featureService.create(value, req.user.id);
    
    // Return success response
    res.status(201).json({
      success: true,
      data: result,
      message: 'Feature created successfully'
    });
  } catch (error) {
    logger.error('Feature creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
```

### Feature 2: [Feature Name]
**Purpose**: [What this feature accomplishes]

[Follow same structure as Feature 1]

## Database Implementation

### Schema Design
```sql
-- Example schema - adapt for your database
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add other tables following same pattern
```

### Migration Strategy
- Use migration files for all schema changes
- Include both up and down migrations
- Test migrations on sample data before applying to production
- Keep migrations atomic and reversible

### Query Optimization
- Add indexes for frequently queried columns
- Use connection pooling for database connections
- Implement query logging to identify slow queries
- Use prepared statements to prevent SQL injection

## API Design Standards

### REST API Conventions
- **GET /api/resource** - List resources (with pagination)
- **GET /api/resource/:id** - Get specific resource
- **POST /api/resource** - Create new resource
- **PUT /api/resource/:id** - Update entire resource
- **PATCH /api/resource/:id** - Partial update
- **DELETE /api/resource/:id** - Delete resource

### Response Format
```json
{
  "success": boolean,
  "data": object | array | null,
  "message": string,
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  },
  "errors": array
}
```

### Status Codes
- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **422 Unprocessable Entity**: Validation failed
- **500 Internal Server Error**: Server error

## Testing Requirements

### Unit Testing
- **Coverage Target**: Minimum 80% code coverage
- **Test Structure**: Arrange, Act, Assert pattern
- **Mock External Dependencies**: APIs, databases, file systems
- **Test Edge Cases**: Empty inputs, large datasets, error conditions

### Integration Testing
- **API Endpoints**: Test all endpoints with various inputs
- **Database Operations**: Test CRUD operations and constraints
- **Authentication Flow**: Test login, logout, token validation
- **Third-party Integrations**: Mock external services

### End-to-End Testing
- **User Workflows**: Test complete user journeys
- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge
- **Mobile Responsiveness**: Test on various device sizes
- **Performance Testing**: Test with realistic data volumes

### Example Test Structure
```javascript
describe('Feature API', () => {
  beforeEach(async () => {
    // Setup test data
  });

  afterEach(async () => {
    // Cleanup test data
  });

  describe('POST /api/feature', () => {
    it('should create feature with valid data', async () => {
      // Test successful creation
    });

    it('should return validation error for invalid data', async () => {
      // Test validation
    });

    it('should require authentication', async () => {
      // Test authentication requirement
    });
  });
});
```

## Performance Requirements

### Response Time Targets
- **Page Load**: < 3 seconds initial load, < 1 second subsequent
- **API Responses**: < 500ms for simple queries, < 2s for complex
- **Database Queries**: < 100ms for simple, < 500ms for complex
- **File Uploads**: < 30 seconds for files up to 10MB

### Optimization Strategies
- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Database indexing, caching, connection pooling
- **Network**: CDN for static assets, gzip compression
- **Database**: Query optimization, proper indexing, connection pooling

### Monitoring
- Track response times and error rates
- Monitor database query performance
- Set up alerts for performance degradation
- Regular performance testing and optimization

## Security Implementation

### Authentication & Authorization
```javascript
// Example JWT implementation
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}
```

### Input Validation
- Validate all user inputs on both client and server
- Use schema validation libraries (Joi, Yup, Zod)
- Sanitize inputs to prevent XSS attacks
- Implement rate limiting to prevent abuse

### Data Protection
- Hash passwords with bcrypt (minimum 12 rounds)
- Encrypt sensitive data at rest
- Use HTTPS for all communication
- Implement proper CORS policies

## Deployment Instructions

### Build Process
```bash
# Example build commands
npm run test          # Run all tests
npm run lint          # Check code style
npm run build         # Build production assets
npm run start         # Start production server
```

### Environment Configuration
- **Development**: Local database, debug logging, hot reload
- **Staging**: Production-like data, performance monitoring
- **Production**: Optimized builds, error tracking, monitoring

### Health Checks
```javascript
// Example health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await db.ping();
    
    // Check external services
    await Promise.all([
      checkEmailService(),
      checkPaymentService()
    ]);
    
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
```

## Common Patterns & Best Practices

### Error Handling Pattern
```javascript
// Centralized error handling
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Usage
if (!user) {
  throw new AppError('User not found', 404);
}
```

### Logging Pattern
```javascript
const logger = require('./logger');

// Log with context
logger.info('User login attempt', {
  userId: user.id,
  ip: req.ip,
  userAgent: req.get('User-Agent')
});
```

### Validation Pattern
```javascript
const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).required()
});

// Usage
const { error, value } = userSchema.validate(req.body);
```

## Troubleshooting Guide

### Common Issues
1. **Database Connection Errors**: Check connection string and credentials
2. **CORS Issues**: Verify CORS configuration for frontend domain
3. **Authentication Failures**: Check JWT secret and token expiration
4. **Performance Issues**: Use database query analysis and profiling
5. **Memory Leaks**: Monitor memory usage and close connections properly

### Debugging Tools
- Use debugger breakpoints for step-through debugging
- Log HTTP requests and responses for API troubleshooting
- Monitor database queries and execution times
- Use browser developer tools for frontend issues

---

**Document Version**: 1.0
**Technical Lead**: [Name]
**Last Updated**: [Date]
**Next Review**: [Date]

*These instructions should be followed precisely to ensure consistent code quality and architecture. When in doubt, ask for clarification rather than making assumptions.*
