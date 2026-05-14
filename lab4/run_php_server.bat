@echo off
cd /d "%~dp0"
echo Server PHP (port 8080). Deschide: http://127.0.0.1:8080/
echo Opreste cu Ctrl+C.
php -S 127.0.0.1:8080 -t .
if errorlevel 1 echo Instaleaza PHP si adauga-l la PATH.
pause
