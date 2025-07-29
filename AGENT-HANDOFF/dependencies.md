# Project Dependencies

## Overview
*This document outlines all the dependencies, external services, and environment requirements needed for the project. Use this as a checklist to ensure everything is properly configured.*

## Core Dependencies

### Frontend Dependencies (package.json)
```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.0.0",
    "react-hook-form": "^7.43.0",
    "react-query": "^3.39.0",
    "tailwindcss": "^3.2.0",
    "lucide-react": "^0.220.0"
  },
  "devDependencies": {
    "vite": "^4.1.0",
    "@vitejs/plugin-react": "^3.1.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^4.9.0",
    "eslint": "^8.35.0",
    "prettier": "^2.8.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "vitest": "^0.28.0"
  }
}
```

### Backend Dependencies

#### Node.js (package.json)
```json
{
  "name": "your-project-api",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^6.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "joi": "^17.7.0",
    "pg": "^8.9.0",
    "redis": "^4.6.0",
    "nodemailer": "^6.9.0",
    "multer": "^1.4.5",
    "winston": "^3.8.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "jest": "^29.4.0",
    "supertest": "^6.3.0",
    "@types/express": "^4.17.0",
    "@types/node": "^18.14.0",
    "ts-node": "^10.9.0",
    "typescript": "^4.9.0"
  }
}
```

#### Python (requirements.txt)
```txt
# Core Framework
fastapi==0.95.0
uvicorn[standard]==0.21.0
pydantic==1.10.0

# Database
sqlalchemy==2.0.0
alembic==1.10.0
psycopg2-binary==2.9.5
redis==4.5.0

# Authentication & Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# HTTP & API
httpx==0.24.0
requests==2.28.0

# Email & Communication  
emails==0.6.0
celery==5.2.0

# Development & Testing
pytest==7.2.0
pytest-asyncio==0.21.0
black==23.1.0
flake8==6.0.0
mypy==1.1.0

# Environment & Config
python-dotenv==1.0.0
pydantic-settings==2.0.0
```

#### Go (go.mod)
```go
module your-project

go 1.19

require (
    github.com/gin-gonic/gin v1.9.0
    github.com/golang-jwt/jwt/v4 v4.5.0
    github.com/lib/pq v1.10.7
    github.com/redis/go-redis/v9 v9.0.3
    github.com/joho/godotenv v1.5.1
    github.com/go-playground/validator/v10 v10.11.2
    golang.org/x/crypto v0.7.0
    gorm.io/gorm v1.25.0
    gorm.io/driver/postgres v1.5.0
)

require (
    // Testing
    github.com/stretchr/testify v1.8.2
    github.com/DATA-DOG/go-sqlmock v1.5.0
)
```

## Database Dependencies

### PostgreSQL Setup
**Version Required**: PostgreSQL 13+
**Installation**:
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql-15 postgresql-contrib

# Docker
docker run --name postgres-db -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:15
```

**Required Extensions**:
```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search (if needed)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable PostGIS (if using geolocation)
CREATE EXTENSION IF NOT EXISTS "postgis";
```

### Redis Setup
**Version Required**: Redis 6+
**Installation**:
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt install redis-server

# Docker
docker run --name redis-cache -p 6379:6379 -d redis:7-alpine
```

## External Services & APIs

### Required Third-Party Services

#### Email Service
**Recommended**: SendGrid, AWS SES, or Mailgun
**Configuration**:
```bash
EMAIL_SERVICE_API_KEY=your-api-key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_FROM_NAME="Your App Name"
```

**Integration Example**:
```javascript
// Using SendGrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'user@example.com',
  from: 'noreply@yourdomain.com',
  subject: 'Welcome to Your App',
  html: '<p>Welcome to our platform!</p>',
};
```

#### Payment Processing (if applicable)
**Recommended**: Stripe
**Configuration**:
```bash
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Authentication Providers (if using OAuth)
**Google OAuth**:
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**GitHub OAuth**:
```bash
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### File Storage (if needed)
**AWS S3**:
```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=us-west-2
```

**Cloudinary** (for image optimization):
```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Monitoring & Analytics Services

#### Error Tracking
**Sentry**:
```bash
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

#### Application Monitoring
**New Relic** or **DataDog**:
```bash
NEW_RELIC_LICENSE_KEY=your-license-key
NEW_RELIC_APP_NAME=your-app-name
```

#### Analytics
**Google Analytics**:
```bash
GOOGLE_ANALYTICS_ID=GA-MEASUREMENT-ID
```

## Development Tools

### Code Quality Tools

#### ESLint Configuration (.eslintrc.js)
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-unused-vars': 'error',
    'no-console': 'warn',
  },
};
```

#### Prettier Configuration (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### Git Hooks (using Husky)
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### Testing Dependencies

#### Frontend Testing
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "@testing-library/user-event": "^14.4.0",
    "vitest": "^0.28.0",
    "@vitest/ui": "^0.28.0",
    "jsdom": "^21.1.0"
  }
}
```

#### Backend Testing
```json
{
  "devDependencies": {
    "jest": "^29.4.0",
    "supertest": "^6.3.0",
    "@types/jest": "^29.4.0",
    "ts-jest": "^29.0.0"
  }
}
```

#### E2E Testing
```json
{
  "devDependencies": {
    "@playwright/test": "^1.31.0",
    "cypress": "^12.7.0"
  }
}
```

## Environment Requirements

### Environment Variables Template
```bash
# Application
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000/api
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# Email Service
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf

# Rate Limiting
RATE_LIMIT_WINDOW=15  # minutes
RATE_LIMIT_MAX_REQUESTS=100

# External APIs
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
LOG_LEVEL=info

# Development Only
DEBUG=true
MOCK_EXTERNAL_APIS=true
```

### System Requirements

#### Development Environment
- **Node.js**: 18.x or higher
- **Python**: 3.9+ (if using Python)
- **Go**: 1.19+ (if using Go)
- **PostgreSQL**: 13+
- **Redis**: 6+
- **Git**: 2.30+

#### Recommended Development Tools
- **IDE**: VS Code, WebStorm, or similar
- **API Testing**: Postman, Insomnia, or REST Client
- **Database GUI**: pgAdmin, TablePlus, or DBeaver
- **Redis GUI**: RedisInsight or Redis Commander

### Docker Configuration (Optional)

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/appdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=appdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Installation & Setup Scripts

### Automated Setup Script (setup.sh)
```bash
#!/bin/bash

echo "Setting up development environment..."

# Install dependencies
if [ -f "package.json" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

if [ -f "requirements.txt" ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Copy environment file
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please update .env with your configuration"
fi

# Database setup
echo "Setting up database..."
createdb your_project_db 2>/dev/null || echo "Database already exists"

# Run migrations
if [ -f "package.json" ]; then
    npm run migrate
elif [ -f "alembic.ini" ]; then
    alembic upgrade head
fi

# Install git hooks
if [ -d ".git" ]; then
    echo "Installing git hooks..."
    npx husky install
fi

echo "Setup complete! Run 'npm run dev' to start development server."
```

### Package Scripts

#### Frontend (package.json scripts)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext js,jsx,ts,tsx",
    "lint:fix": "eslint src --ext js,jsx,ts,tsx --fix",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx,css,md}",
    "type-check": "tsc --noEmit"
  }
}
```

#### Backend (package.json scripts)
```json
{
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "migrate": "npm run build && node dist/migrate.js",
    "seed": "npm run build && node dist/seed.js",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

## Troubleshooting Common Issues

### Dependency Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For Python virtual environment issues
deactivate
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check Redis is running
redis-cli ping

# Reset database
dropdb your_project_db
createdb your_project_db
npm run migrate
```

### Environment Variable Issues
```bash
# Verify environment variables are loaded
node -e "console.log(process.env.DATABASE_URL)"

# Check .env file exists and has correct format
cat .env | grep -v '^#' | grep -v '^$'
```

---

**Document Version**: 1.0
**Last Updated**: [Date]
**Maintained By**: [Team/Person]

*Keep this document updated as dependencies change. Always test dependency updates in a development environment first.*
