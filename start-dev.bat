@echo off
setlocal

set "ROOT=%~dp0"

if not exist "%ROOT%backend\main.py" (
  echo [ERROR] Backend entrypoint not found at "%ROOT%backend\main.py"
  exit /b 1
)

if not exist "%ROOT%frontend\package.json" (
  echo [ERROR] Frontend project not found at "%ROOT%frontend\package.json"
  exit /b 1
)

echo Starting backend and frontend...

start "Movie Ticketing Backend" cmd /k "cd /d ""%ROOT%backend"" && python main.py"
start "Movie Ticketing Frontend" cmd /k "cd /d ""%ROOT%frontend"" && npm run dev"

echo Both services launched in separate windows.
endlocal
