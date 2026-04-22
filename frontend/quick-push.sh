#!/bin/bash

# Quick Git Push Script for SmartCard Frontend
# Usage: ./quick-push.sh "Your commit message"

cd /c/xampp/htdocs/smartcard/frontend

# Check if commit message is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide a commit message"
    echo "Usage: ./quick-push.sh \"Your commit message\""
    exit 1
fi

echo "📦 Adding all changes..."
git add .

echo "💾 Committing changes..."
git commit -m "$1"

echo "🚀 Pushing to GitHub..."
git push

echo "✅ Done! Changes pushed to GitHub"
