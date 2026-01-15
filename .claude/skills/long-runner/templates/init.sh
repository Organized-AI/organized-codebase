#!/bin/bash
#===============================================================================
# init.sh - Long-Runner Development Environment Setup
#===============================================================================
# This script sets up the development environment for the project.
# It should be idempotent - safe to run multiple times.
#===============================================================================

set -e  # Exit on error

PROJECT_NAME="${PROJECT_NAME:-my-project}"
DEV_PORT="${DEV_PORT:-3000}"
HEALTH_ENDPOINT="${HEALTH_ENDPOINT:-http://localhost:$DEV_PORT/health}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

log_info "Setting up development environment..."

# Install dependencies
if [ -f "package.json" ]; then
    log_info "Installing npm dependencies..."
    npm install
fi

if [ -f "requirements.txt" ]; then
    log_info "Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Create .env if needed
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    log_info "Created .env from .env.example"
fi

# Start dev server
log_info "Starting development server on port $DEV_PORT..."

if lsof -Pi :$DEV_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    log_warn "Port $DEV_PORT is in use. Killing existing process..."
    kill $(lsof -Pi :$DEV_PORT -sTCP:LISTEN -t) 2>/dev/null || true
    sleep 2
fi

# Customize this for your project:
npm run dev > /dev/null 2>&1 &
DEV_PID=$!
echo $DEV_PID > .dev-server.pid

log_info "Dev server started with PID $DEV_PID"

# Wait for server
log_info "Waiting for server..."
RETRIES=30
until curl -s $HEALTH_ENDPOINT > /dev/null 2>&1; do
    RETRIES=$((RETRIES - 1))
    if [ $RETRIES -eq 0 ]; then
        log_warn "Server not responding to health check (may be expected)"
        break
    fi
    sleep 1
done

log_info "Environment ready! Server at http://localhost:$DEV_PORT"
