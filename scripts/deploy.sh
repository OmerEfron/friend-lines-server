#!/bin/bash

# Friend Lines Deployment Script
# This script helps with local testing and manual deployment

set -e

echo "🚀 Friend Lines Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_status "Docker is running"
}

# Build Docker image
build_image() {
    echo "🔨 Building Docker image..."
    docker build -t friend-lines:latest .
    print_status "Docker image built successfully"
}

# Run local tests
run_tests() {
    echo "🧪 Running local tests..."
    if [ -f "package.json" ] && grep -q "test" package.json; then
        npm test || print_warning "Tests failed or not configured"
    else
        print_warning "No test script found in package.json"
    fi
}

# Start local development environment
start_local() {
    echo "🏠 Starting local development environment..."
    docker-compose up -d
    print_status "Local environment started"
    echo "📱 API available at: http://localhost:3000"
    echo "🔍 Health check: http://localhost:3000/api/health"
}

# Stop local development environment
stop_local() {
    echo "🛑 Stopping local development environment..."
    docker-compose down
    print_status "Local environment stopped"
}

# Show logs
show_logs() {
    echo "📋 Showing application logs..."
    docker-compose logs -f app
}

# Clean up
cleanup() {
    echo "🧹 Cleaning up Docker resources..."
    docker system prune -f
    print_status "Cleanup completed"
}

# Show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build     Build Docker image"
    echo "  test      Run tests"
    echo "  start     Start local development environment"
    echo "  stop      Stop local development environment"
    echo "  logs      Show application logs"
    echo "  clean     Clean up Docker resources"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build"
    echo "  $0 start"
    echo "  $0 logs"
}

# Main script logic
case "${1:-help}" in
    build)
        check_docker
        build_image
        ;;
    test)
        run_tests
        ;;
    start)
        check_docker
        start_local
        ;;
    stop)
        stop_local
        ;;
    logs)
        show_logs
        ;;
    clean)
        cleanup
        ;;
    help|*)
        show_help
        ;;
esac
