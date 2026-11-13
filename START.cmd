@echo off
setlocal
cd /d "%~dp0"
for /d %%D in ("%~dp0.runtime\node-*-win-x64") do if exist "%%~fD\node.exe" set "PATH=%%~fD;%PATH%"
if not exist "node_modules\vite\bin\vite.js" (
  call npm ci
  if errorlevel 1 goto end
)
call npm run dev
:end
pause
