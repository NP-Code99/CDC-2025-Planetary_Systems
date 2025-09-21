#!/bin/bash

echo "🔍 GravityFit Exo - Setup Verification"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to check URL response
check_url() {
    local url=$1
    local expected_status=$2
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅${NC} $url (Status: $response)"
        return 0
    else
        echo -e "${RED}❌${NC} $url (Status: $response, Expected: $expected_status)"
        return 1
    fi
}

echo "📋 Checking Prerequisites..."
echo "----------------------------"

# Check Python
if command_exists python3; then
    python_version=$(python3 --version 2>&1 | cut -d' ' -f2)
    echo -e "${GREEN}✅${NC} Python 3: $python_version"
else
    echo -e "${RED}❌${NC} Python 3 not found"
    exit 1
fi

# Check Node.js
if command_exists node; then
    node_version=$(node --version)
    echo -e "${GREEN}✅${NC} Node.js: $node_version"
else
    echo -e "${RED}❌${NC} Node.js not found"
    exit 1
fi

# Check npm
if command_exists npm; then
    npm_version=$(npm --version)
    echo -e "${GREEN}✅${NC} npm: $npm_version"
else
    echo -e "${RED}❌${NC} npm not found"
    exit 1
fi

echo ""
echo "🔧 Checking Project Structure..."
echo "-------------------------------"

# Check if we're in the right directory
if [ -f "start-dev.sh" ] && [ -d "backend" ] && [ -d "frontend" ]; then
    echo -e "${GREEN}✅${NC} Project structure looks good"
else
    echo -e "${RED}❌${NC} Please run this script from the project root directory"
    exit 1
fi

# Check backend files
if [ -f "backend/requirements.txt" ] && [ -f "backend/app/main.py" ]; then
    echo -e "${GREEN}✅${NC} Backend files present"
else
    echo -e "${RED}❌${NC} Backend files missing"
    exit 1
fi

# Check frontend files
if [ -f "frontend/package.json" ] && [ -d "frontend/app" ]; then
    echo -e "${GREEN}✅${NC} Frontend files present"
else
    echo -e "${RED}❌${NC} Frontend files missing"
    exit 1
fi

echo ""
echo "🚀 Checking Running Services..."
echo "------------------------------"

# Check if backend is running
if port_in_use 8000; then
    echo -e "${GREEN}✅${NC} Backend server is running on port 8000"
    backend_running=true
else
    echo -e "${YELLOW}⚠️${NC} Backend server not running on port 8000"
    backend_running=false
fi

# Check if frontend is running
if port_in_use 3000; then
    echo -e "${GREEN}✅${NC} Frontend server is running on port 3000"
    frontend_running=true
else
    echo -e "${YELLOW}⚠️${NC} Frontend server not running on port 3000"
    frontend_running=false
fi

echo ""
echo "🌐 Testing URLs..."
echo "------------------"

# Test backend health
if [ "$backend_running" = true ]; then
    if check_url "http://localhost:8000/health" "200"; then
        echo -e "${GREEN}✅${NC} Backend health check passed"
    else
        echo -e "${RED}❌${NC} Backend health check failed"
    fi
else
    echo -e "${YELLOW}⚠️${NC} Skipping backend tests (server not running)"
fi

# Test frontend
if [ "$frontend_running" = true ]; then
    if check_url "http://localhost:3000" "200"; then
        echo -e "${GREEN}✅${NC} Frontend is accessible"
    else
        echo -e "${RED}❌${NC} Frontend is not accessible"
    fi
else
    echo -e "${YELLOW}⚠️${NC} Skipping frontend tests (server not running)"
fi

echo ""
echo "📊 Summary"
echo "----------"

if [ "$backend_running" = true ] && [ "$frontend_running" = true ]; then
    echo -e "${GREEN}🎉 All systems are running!${NC}"
    echo ""
    echo "🌐 Access your application:"
    echo "   • Main App: http://localhost:3000"
    echo "   • Backend API: http://localhost:8000"
    echo "   • API Docs: http://localhost:8000/docs"
    echo ""
    echo "💡 If you need to start the servers:"
    echo "   ./start-dev.sh"
elif [ "$backend_running" = false ] && [ "$frontend_running" = false ]; then
    echo -e "${YELLOW}⚠️ No servers are running${NC}"
    echo ""
    echo "🚀 To start the application:"
    echo "   ./start-dev.sh"
    echo ""
    echo "📋 Or manually:"
    echo "   Backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    echo "   Frontend: cd frontend && npm run dev"
else
    echo -e "${YELLOW}⚠️ Some servers are running, but not all${NC}"
    echo ""
    echo "🔄 To restart all servers:"
    echo "   ./start-dev.sh"
fi

echo ""
echo "📚 For detailed setup instructions, see LOCALHOST_SETUP.md"
