#!/bin/bash

# Server Deployment Script for React CM App
# This script ensures the server gets the latest build with proper CSS

echo "🚀 Starting server deployment..."

# 1. Build the project with memory optimization
echo "📦 Building project with memory optimization..."
export NODE_OPTIONS="--max-old-space-size=4096"
GENERATE_SOURCEMAP=false npm run build

# 2. Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# 3. Verify CSS files exist and contain custom styles
echo "🔍 Verifying CSS files..."
if grep -q "custom-ant-table-header\|ctp-root" build/static/css/main.*.css; then
    echo "✅ Custom CSS styles found in build!"
else
    echo "❌ Custom CSS styles not found in build!"
    exit 1
fi

# 4. Create a backup of current build
echo "💾 Creating backup..."
cp -r build build_backup_$(date +%Y%m%d_%H%M%S)

# 5. Commit and push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy: Update build with table and pagination CSS fixes - $(date)"
git push origin main

# 6. Instructions for server deployment
echo ""
echo "🎯 Next steps for server deployment:"
echo "1. SSH into your server"
echo "2. Navigate to your project directory"
echo "3. Run: git pull origin main"
echo "4. Run: npm install (if needed)"
echo "5. Restart your web server (nginx/apache)"
echo "6. Clear any CDN/server cache if applicable"
echo ""
echo "🔧 Server commands:"
echo "cd /var/www/alenture-cm"
echo "git pull origin main"
echo "sudo systemctl reload nginx  # or restart apache2"
echo ""
echo "✅ Deployment script completed!"
