#!/bin/bash

# Deployment script for Friend Lines app
set -e

echo "🚀 Starting deployment process..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t friend-lines:latest .

# Test the image locally
echo "🧪 Testing Docker image..."
docker run --rm -d --name test-deploy -p 3001:3000 friend-lines:latest

# Wait for app to start
echo "⏳ Waiting for app to start..."
sleep 15

# Health check
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    docker stop test-deploy
    exit 1
fi

# Stop test container
docker stop test-deploy

echo "🎉 Local deployment test successful!"
echo "📝 Next steps:"
echo "   1. Push to main branch to trigger GitHub Actions"
echo "   2. Set up Railway account and connect GitHub repo"
echo "   3. Configure environment variables in Railway"
echo "   4. Deploy will happen automatically!"
