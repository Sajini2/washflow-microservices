@echo off
echo Starting WashFlow project (Backend and Frontend)...

docker-compose --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo "docker-compose" not found. Trying "docker compose"...
    docker compose up --build
) ELSE (
    docker-compose up --build
)
