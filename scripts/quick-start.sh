#!/bin/bash

# Friend Lines Quick Start Script
# Gets you up and running in minutes

set -e

echo "🚀 Friend Lines Quick Start"
echo "============================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker not found. Please install Docker first:"
        echo "   https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose not found. Please install Docker Compose first:"
        echo "   https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js not found. Please install Node.js first:"
        echo "   https://nodejs.org/"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm not found. Please install npm first:"
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Setup environment
setup_environment() {
    print_step "Setting up environment..."
    
    # Copy environment template if .env doesn't exist
    if [ ! -f .env ]; then
        if [ -f env.production.example ]; then
            cp env.production.example .env
            print_info "Created .env file from template"
            print_info "Please update .env with your actual values"
        else
            print_info "No .env template found. Please create .env manually"
        fi
    else
        print_info ".env file already exists"
    fi
    
    # Install dependencies
    print_step "Installing npm dependencies..."
    npm install
    
    print_success "Environment setup complete"
}

# Start services
start_services() {
    print_step "Starting services..."
    
    # Start with Docker Compose
    docker-compose up -d
    
    print_success "Services started successfully"
    
    # Wait for services to be ready
    print_step "Waiting for services to be ready..."
    sleep 10
    
    # Check health
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_success "API is healthy and responding"
    else
        print_info "API might still be starting up. Please wait a moment."
    fi
}

# Show status
show_status() {
    print_step "Service Status:"
    docker-compose ps
    
    echo ""
    print_step "Quick Access:"
    echo "🌐 API: http://localhost:3000"
    echo "🔍 Health: http://localhost:3000/api/health"
    echo "📚 Docs: http://localhost:3000/api (if available)"
    
    echo ""
    print_step "Useful Commands:"
    echo "📋 View logs: ./scripts/deploy.sh logs"
    echo "🛑 Stop services: ./scripts/deploy.sh stop"
    echo "🏠 Start services: ./scripts/deploy.sh start"
    echo "🧹 Clean up: ./scripts/deploy.sh clean"
}

# Main execution
main() {
    check_prerequisites
    setup_environment
    start_services
    show_status
    
    echo ""
    print_success "🎉 Friend Lines is now running locally!"
    print_info "You can now test the API and develop your mobile app."
    print_info "Check DEPLOYMENT.md for production deployment instructions."
}

# Run main function
main "$@"
