#!/bin/bash

echo "🚀 CDC-2025-Planetary-Systems Deployment Helper"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure looks good"

# Test frontend build
echo "🔨 Testing frontend build..."
cd frontend
if npm run build; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..

echo ""
echo "🎯 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Deploy backend to Railway or Render"
echo "2. Deploy frontend to Vercel"
echo "3. Set environment variables"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
