#!/bin/bash

echo "🚀 Quick Vercel Deployment"
echo "========================="

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
echo "🎯 Ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Import your GitHub repository"
echo "3. Vercel should auto-detect Next.js in the frontend folder"
echo "4. If not, set Root Directory to 'frontend' in project settings"
echo "5. Deploy!"
echo ""
echo "The vercel.json file is configured to handle the frontend directory structure."
echo "Your app should work at: https://your-app-name.vercel.app"
