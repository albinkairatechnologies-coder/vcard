@echo off
REM Quick Git Push Script for SmartCard Frontend
REM Usage: quick-push.bat "Your commit message"

cd /d C:\xampp\htdocs\smartcard\frontend

if "%~1"=="" (
    echo Error: Please provide a commit message
    echo Usage: quick-push.bat "Your commit message"
    exit /b 1
)

echo Adding all changes...
git add .

echo Committing changes...
git commit -m "%~1"

echo Pushing to GitHub...
git push

echo Done! Changes pushed to GitHub
