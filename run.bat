@echo off
IF "%1"=="docker-up" (
    docker compose up -d
) ELSE IF "%1"=="docker-down" (
    docker compose down
) ELSE IF "%1"=="backend-run" (
    cd apps\backend && go run cmd\api\main.go
) ELSE IF "%1"=="backend-worker" (
    cd apps\backend && go run cmd\worker\main.go
) ELSE IF "%1"=="test" (
    cd apps\backend && go test -v -race .\...
) ELSE (
    echo Usage: run.bat [docker-up ^| docker-down ^| backend-run ^| backend-worker ^| test]
)
