# Expected File Structure

## Overview
*This document defines the expected file and directory structure for the project. Follow this structure to ensure consistency and maintainability.*

## Root Directory Structure
```
project-name/
├── 📁 src/                     # Source code
├── 📁 public/                  # Static assets (if frontend)
├── 📁 tests/                   # Test files
├── 📁 docs/                    # Additional documentation
├── 📁 scripts/                 # Build and utility scripts
├── 📁 config/                  # Configuration files
├── 📄 package.json             # Dependencies and scripts (Node.js)
├── 📄 requirements.txt         # Dependencies (Python)
├── 📄 go.mod                   # Dependencies (Go)
├── 📄 .env.example             # Environment variables template
├── 📄 .gitignore               # Git ignore rules
├── 📄 README.md                # Project overview
├── 📄 CONTRIBUTING.md          # Contribution guidelines
├── 📄 LICENSE                  # License information
└── 📄 docker-compose.yml       # Docker services (if applicable)
```

## Frontend Structure (React/Vue/Angular)

### React Project Structure
```
src/
├── 📁 components/              # Reusable UI components
│   ├── 📁 common/             # Shared components
│   │   ├── 📁 Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.test.jsx
│   │   │   ├── Button.module.css
│   │   │   └── index.js       # Export file
│   │   ├── 📁 Input/
│   │   ├── 📁 Modal/
│   │   └── 📁 Loading/
│   └── 📁 features/           # Feature-specific components
│       ├── 📁 auth/
│       │   ├── LoginForm.jsx
│       │   ├── RegisterForm.jsx
│       │   └── PasswordReset.jsx
│       ├── 📁 dashboard/
│       └── 📁 profile/
├── 📁 pages/                   # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   └── NotFoundPage.jsx
├── 📁 hooks/                   # Custom React hooks
│   ├── useAuth.js
│   ├── useApi.js
│   └── useLocalStorage.js
├── 📁 services/                # API calls and business logic
│   ├── api.js                 # API configuration
│   ├── authService.js
│   ├── userService.js
│   └── featureService.js
├── 📁 store/                   # State management
│   ├── index.js               # Store configuration
│   ├── authSlice.js           # Auth state
│   └── uiSlice.js             # UI state
├── 📁 utils/                   # Pure utility functions
│   ├── constants.js
│   ├── helpers.js
│   ├── validators.js
│   └── formatters.js
├── 📁 styles/                  # CSS and styling
│   ├── globals.css
│   ├── variables.css
│   └── components.css
├── 📁 types/                   # TypeScript type definitions
│   ├── api.ts
│   ├── user.ts
│   └── common.ts
├── 📁 assets/                  # Images, icons, fonts
│   ├── 📁 images/
│   ├── 📁 icons/
│   └── 📁 fonts/
├── App.jsx                    # Main app component
├── main.jsx                   # App entry point
└── index.css                  # Global styles
```

### Vue Project Structure
```
src/
├── 📁 components/              # Reusable components
│   ├── 📁 base/               # Base components
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   └── BaseModal.vue
│   └── 📁 features/           # Feature components
│       ├── 📁 auth/
│       └── 📁 dashboard/
├── 📁 views/                   # Page components
│   ├── HomeView.vue
│   ├── LoginView.vue
│   └── DashboardView.vue
├── 📁 composables/            # Vue composables
│   ├── useAuth.js
│   └── useApi.js
├── 📁 services/               # API services
├── 📁 stores/                 # Pinia stores
│   ├── auth.js
│   └── user.js
├── 📁 router/                 # Vue Router
│   └── index.js
├── 📁 utils/                  # Utilities
├── 📁 assets/                 # Static assets
├── App.vue                    # Root component
└── main.js                    # Entry point
```

## Backend Structure

### Node.js/Express Structure
```
src/
├── 📁 controllers/             # Request handlers
│   ├── authController.js
│   ├── userController.js
│   └── featureController.js
├── 📁 models/                  # Data models
│   ├── User.js
│   ├── Feature.js
│   └── index.js               # Model exports
├── 📁 routes/                  # API routes
│   ├── auth.js
│   ├── users.js
│   ├── features.js
│   └── index.js               # Route aggregation
├── 📁 middleware/              # Custom middleware
│   ├── auth.js                # Authentication middleware
│   ├── validation.js          # Request validation
│   ├── errorHandler.js        # Error handling
│   └── logger.js              # Logging middleware
├── 📁 services/               # Business logic
│   ├── authService.js
│   ├── userService.js
│   ├── emailService.js
│   └── paymentService.js
├── 📁 utils/                  # Utility functions
│   ├── database.js            # DB connection
│   ├── jwt.js                 # JWT utilities
│   ├── validation.js          # Validation schemas
│   └── constants.js           # App constants
├── 📁 config/                 # Configuration
│   ├── database.js
│   ├── auth.js
│   └── environment.js
├── 📁 migrations/             # Database migrations
│   ├── 001_create_users_table.js
│   └── 002_create_features_table.js
├── 📁 seeders/                # Database seeders
│   └── demo_data.js
├── app.js                     # Express app setup
└── server.js                 # Server entry point
```

### Python/FastAPI Structure
```
app/
├── 📁 api/                    # API endpoints
│   ├── 📁 v1/                # API version 1
│   │   ├── __init__.py
│   │   ├── auth.py           # Auth endpoints
│   │   ├── users.py          # User endpoints
│   │   └── features.py       # Feature endpoints
│   └── deps.py               # Dependencies
├── 📁 core/                   # Core functionality
│   ├── __init__.py
│   ├── config.py             # Configuration
│   ├── security.py           # Security utilities
│   └── database.py           # Database connection
├── 📁 models/                 # Database models
│   ├── __init__.py
│   ├── user.py
│   └── feature.py
├── 📁 schemas/                # Pydantic schemas
│   ├── __init__.py
│   ├── user.py
│   └── feature.py
├── 📁 services/               # Business logic
│   ├── __init__.py
│   ├── auth_service.py
│   ├── user_service.py
│   └── email_service.py
├── 📁 utils/                  # Utilities
│   ├── __init__.py
│   └── helpers.py
├── 📁 migrations/             # Alembic migrations
│   └── versions/
├── main.py                    # FastAPI app
└── __init__.py
```

## Database Structure

### Migration Files Naming
```
migrations/
├── 001_initial_migration.sql
├── 002_add_user_profiles.sql
├── 003_create_features_table.sql
└── 004_add_indexes.sql
```

### Schema Organization
```sql
-- File: 001_create_users_table.sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

## Testing Structure

### Test Organization
```
tests/
├── 📁 unit/                   # Unit tests
│   ├── 📁 components/         # Frontend component tests
│   │   ├── Button.test.jsx
│   │   └── LoginForm.test.jsx
│   ├── 📁 services/           # Service layer tests
│   │   ├── authService.test.js
│   │   └── userService.test.js
│   └── 📁 utils/              # Utility function tests
│       └── helpers.test.js
├── 📁 integration/            # Integration tests
│   ├── 📁 api/                # API endpoint tests
│   │   ├── auth.test.js
│   │   └── users.test.js
│   └── 📁 database/           # Database tests
│       └── models.test.js
├── 📁 e2e/                    # End-to-end tests
│   ├── auth.spec.js
│   ├── user-journey.spec.js
│   └── admin.spec.js
├── 📁 fixtures/               # Test data
│   ├── users.json
│   └── features.json
└── 📁 helpers/                # Test utilities
    ├── setup.js
    └── db-helper.js
```

### Test File Naming Conventions
- **Unit tests**: `ComponentName.test.js` or `functionName.test.js`
- **Integration tests**: `endpoint.test.js` or `feature.integration.test.js`
- **E2E tests**: `user-flow.spec.js` or `feature.e2e.test.js`

## Configuration Files

### Environment Configuration
```
config/
├── development.js             # Dev environment config
├── staging.js                 # Staging environment config
├── production.js              # Production environment config
└── database.js                # Database configurations
```

### Environment Variables Template (.env.example)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# External Services
EMAIL_SERVICE_API_KEY=your-email-service-key
PAYMENT_SERVICE_KEY=your-payment-service-key

# Application
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Frontend URLs (for CORS)
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

## Static Assets Organization

### Public Assets Structure
```
public/
├── 📁 images/                 # Images
│   ├── 📁 logos/              # Brand logos
│   ├── 📁 icons/              # App icons
│   ├── 📁 avatars/            # Default avatars
│   └── 📁 backgrounds/        # Background images
├── 📁 fonts/                  # Custom fonts
├── 📁 favicons/               # Favicon files
├── index.html                 # Main HTML template
├── manifest.json              # PWA manifest
└── robots.txt                 # SEO robots file
```

## Documentation Structure

### Project Documentation
```
docs/
├── 📁 api/                    # API documentation
│   ├── authentication.md
│   ├── users.md
│   └── features.md
├── 📁 guides/                 # User guides
│   ├── getting-started.md
│   ├── admin-guide.md
│   └── troubleshooting.md
├── 📁 development/            # Development docs
│   ├── setup.md
│   ├── coding-standards.md
│   └── deployment.md
└── 📁 architecture/           # Technical architecture
    ├── database-design.md
    ├── system-overview.md
    └── security.md
```

## Build and Deployment Files

### Build Configuration
```
scripts/
├── build.sh                  # Production build script
├── deploy.sh                 # Deployment script
├── test.sh                   # Test runner script
├── db-migrate.sh             # Database migration script
└── setup-dev.sh              # Development setup script
```

### Docker Structure (if applicable)
```
docker/
├── Dockerfile                # Main application container
├── Dockerfile.dev            # Development container
├── nginx.conf                # Nginx configuration
└── docker-compose.yml        # Multi-container setup
```

## Naming Conventions

### Files and Directories
- **Directories**: lowercase with hyphens (`user-profile`, `api-docs`)
- **Components**: PascalCase (`UserProfile.jsx`, `LoginForm.vue`)
- **Utilities**: camelCase (`userHelpers.js`, `dateUtils.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`, `ERROR_CODES.js`)
- **Tests**: match source file with `.test.` or `.spec.` suffix

### Code Organization
- **One component per file** for React/Vue components
- **Barrel exports** using `index.js` files for cleaner imports
- **Feature-based organization** for larger applications
- **Shared utilities** in common directories

## Import/Export Patterns

### Component Exports
```javascript
// Button/Button.jsx
export default function Button({ children, onClick, variant = 'primary' }) {
  // Component implementation
}

// Button/index.js
export { default } from './Button';

// Usage
import Button from 'components/common/Button';
```

### Service Exports
```javascript
// services/userService.js
export const createUser = async (userData) => {
  // Implementation
};

export const getUserById = async (id) => {
  // Implementation
};

// services/index.js
export * from './userService';
export * from './authService';

// Usage
import { createUser, getUserById } from 'services';
```

## File Size Guidelines
- **Components**: Keep under 300 lines, split large components
- **Services**: Keep focused on single responsibility
- **Utilities**: Small, pure functions
- **Configuration**: Separate by environment and concern

## Code Organization Principles
1. **Separation of Concerns**: Each file has a single responsibility
2. **Colocation**: Keep related files close together
3. **Consistent Structure**: Follow established patterns throughout
4. **Clear Dependencies**: Avoid circular dependencies
5. **Testable Structure**: Easy to unit test individual pieces

---

**Document Version**: 1.0
**Last Updated**: [Date]
**Architecture Team**: [Names]

*This structure should be followed consistently across the entire project to ensure maintainability and developer experience.*
