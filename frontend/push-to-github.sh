#!/bin/bash

echo "========================================"
echo "  SmartCard Frontend - GitHub Push"
echo "========================================"
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

echo "Step 1: Initializing Git repository..."
git init
echo ""

echo "Step 2: Adding all files..."
git add .
echo ""

echo "Step 3: Creating initial commit..."
git commit -m "Initial commit: SmartCard digital business card platform"
echo ""

echo "Step 4: Setting main branch..."
git branch -M main
echo ""

echo "========================================"
echo "  IMPORTANT: Create GitHub Repository"
echo "========================================"
echo ""
echo "1. Go to: https://github.com/new"
echo "2. Repository name: smartcard-frontend"
echo "3. Description: Digital Business Card Platform - Frontend"
echo "4. Keep it PUBLIC or PRIVATE (your choice)"
echo "5. DO NOT initialize with README, .gitignore, or license"
echo "6. Click 'Create repository'"
echo ""
echo "After creating the repository, copy the repository URL"
echo "Example: https://github.com/yourusername/smartcard-frontend.git"
echo ""
read -p "Paste your GitHub repository URL here: " REPO_URL
echo ""

echo "Step 5: Adding remote origin..."
git remote add origin "$REPO_URL"
echo ""

echo "Step 6: Pushing to GitHub..."
git push -u origin main
echo ""

echo "========================================"
echo "  SUCCESS! Code pushed to GitHub"
echo "========================================"
echo ""
echo "Your repository: $REPO_URL"
echo ""
