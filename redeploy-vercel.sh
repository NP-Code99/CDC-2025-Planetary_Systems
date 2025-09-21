#!/bin/bash

echo "🚀 Redeploying to Vercel..."
echo "=========================="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "If you still get 404 errors:"
echo "1. Go to your Vercel dashboard"
echo "2. Go to Project Settings"
echo "3. Set Root Directory to 'frontend'"
echo "4. Redeploy"
