#!/bin/bash

# GravityFit Exo Development Startup Script

echo "🚀 Starting GravityFit Exo Development Environment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Start backend in background
echo "🔧 Starting FastAPI backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1

# Copy env file if it doesn't exist
if [ ! -f ".env" ]; then
    cp env.example .env
    echo "📝 Created .env file from template"
fi

# Start backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Next.js frontend..."
cd ../frontend

# Copy env file if it doesn't exist
if [ ! -f ".env.local" ]; then
    cp env.example .env.local
    echo "📝 Created .env.local file from template"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    pnpm install
fi

# Start frontend
pnpm dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development servers started!"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping development servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
