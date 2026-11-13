@echo off
setlocal
cd /d "%~dp0"
for /d %%D in ("%~dp0.runtime\node-*-win-x64") do if exist "%%~fD\node.exe" set "PATH=%%~fD;%PATH%"
call npm %*
