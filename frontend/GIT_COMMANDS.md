# 🚀 Git Commands - Quick Reference

## Your Repository
**GitHub:** https://github.com/albinkairatechnologies-coder/vcardfrontend.git
**Branch:** master

---

## ⚡ Quick Push (One Command)

```bash
cd C:\xampp\htdocs\smartcard\frontend && git add . && git commit -m "Your message here" && git push
```

---

## 📝 Step-by-Step Commands

### 1. Navigate to Frontend Folder
```bash
cd C:\xampp\htdocs\smartcard\frontend
```

### 2. Check Status (See what changed)
```bash
git status
```

### 3. Add All Changes
```bash
git add .
```

### 4. Commit Changes
```bash
git commit -m "Your descriptive message"
```

### 5. Push to GitHub
```bash
git push
```

---

## 🎯 Using the Quick Scripts

### Option 1: Shell Script (Git Bash)
```bash
cd /c/xampp/htdocs/smartcard/frontend
chmod +x quick-push.sh
./quick-push.sh "Your commit message"
```

### Option 2: Batch File (CMD)
```cmd
cd C:\xampp\htdocs\smartcard\frontend
quick-push.bat "Your commit message"
```

---

## 📋 Common Commit Messages

```bash
# Feature additions
git commit -m "Add new card theme selector"
git commit -m "Implement QR code download feature"

# Bug fixes
git commit -m "Fix photo upload issue"
git commit -m "Fix dashboard edit link route"

# UI/UX improvements
git commit -m "Update card preview styling"
git commit -m "Improve mobile responsiveness"

# Code refactoring
git commit -m "Refactor CardBuilder component"
git commit -m "Clean up unused imports"

# Configuration
git commit -m "Update environment variables"
git commit -m "Configure Vercel deployment"

# Documentation
git commit -m "Update README with setup instructions"
git commit -m "Add API documentation"
```

---

## 🔄 Common Workflows

### Daily Work Flow
```bash
cd C:\xampp\htdocs\smartcard\frontend

# Start work - pull latest changes
git pull

# Make your changes in code...

# Check what changed
git status

# Add and commit
git add .
git commit -m "Description of changes"

# Push to GitHub
git push
```

### Quick Fix Flow
```bash
cd C:\xampp\htdocs\smartcard\frontend && git add . && git commit -m "Quick fix: description" && git push
```

---

## 📊 Useful Git Commands

### Check Status
```bash
git status                    # See what files changed
git status -s                 # Short status
```

### View Changes
```bash
git diff                      # See unstaged changes
git diff --staged             # See staged changes
git diff HEAD                 # See all changes
```

### View History
```bash
git log                       # Full commit history
git log --oneline             # Compact history
git log --oneline -5          # Last 5 commits
git log --graph --oneline     # Visual branch history
```

### Undo Changes
```bash
git restore file.js           # Discard changes in file
git restore .                 # Discard all changes
git reset HEAD~1              # Undo last commit (keep changes)
git reset --hard HEAD~1       # Undo last commit (delete changes)
```

### Branch Management
```bash
git branch                    # List branches
git branch feature-name       # Create new branch
git checkout feature-name     # Switch to branch
git checkout -b feature-name  # Create and switch
git merge feature-name        # Merge branch into current
git branch -d feature-name    # Delete branch
```

### Remote Operations
```bash
git remote -v                 # View remote URLs
git pull                      # Pull latest changes
git push                      # Push commits
git push -f                   # Force push (use carefully!)
git fetch                     # Fetch without merging
```

---

## 🎨 Git Aliases (Make Commands Shorter)

Add these to make Git faster:

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.last 'log -1 HEAD'
git config --global alias.unstage 'reset HEAD --'

# Now use:
git st        # instead of git status
git co main   # instead of git checkout main
git br        # instead of git branch
git ci -m     # instead of git commit -m
git last      # see last commit
```

---

## 🐛 Troubleshooting

### Fix Line Ending Warnings (CRLF/LF)
```bash
# Configure Git to handle line endings automatically
git config --global core.autocrlf true
```

### Forgot to Add Files
```bash
git add forgotten-file.js
git commit --amend --no-edit
git push -f
```

### Wrong Commit Message
```bash
git commit --amend -m "Correct message"
git push -f
```

### Accidentally Committed Large Files
```bash
git rm --cached large-file.zip
git commit -m "Remove large file"
git push
```

### Pull Before Push (Conflict Prevention)
```bash
git pull --rebase
git push
```

---

## 📦 .gitignore (Already Set Up)

Your `.gitignore` excludes:
- ✅ `node_modules/`
- ✅ `dist/`
- ✅ `.env.local`
- ✅ Log files
- ✅ Editor files

---

## 🚀 Deploy After Push

### Vercel Auto-Deploy
If connected to Vercel, it auto-deploys on push to master.

### Manual Vercel Deploy
```bash
cd C:\xampp\htdocs\smartcard\frontend
npm run build
vercel --prod
```

---

## 💡 Pro Tips

1. **Commit Often**: Small, frequent commits are better than large ones
2. **Pull Before Push**: Always pull latest changes before pushing
3. **Clear Messages**: Write descriptive commit messages
4. **Check Status**: Use `git status` before committing
5. **Test First**: Test your changes before committing

---

## 📝 Quick Reference Card

| Task | Command |
|------|---------|
| Check status | `git status` |
| Add all files | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push` |
| Pull | `git pull` |
| View history | `git log --oneline` |
| Undo changes | `git restore .` |
| Create branch | `git checkout -b name` |
| Switch branch | `git checkout name` |

---

## 🎯 Your Quick Command

```bash
cd C:\xampp\htdocs\smartcard\frontend && git add . && git commit -m "Update: description" && git push
```

**Just replace "description" with what you changed!**

---

## ✅ Example Workflow

```bash
# 1. Navigate to project
cd C:\xampp\htdocs\smartcard\frontend

# 2. Check what changed
git status

# 3. Add, commit, and push
git add .
git commit -m "Add new feature: card sharing"
git push

# Done! ✨
```

---

**Happy Coding! 🚀**

Your repo: https://github.com/albinkairatechnologies-coder/vcardfrontend
