# 🚀 FRAUD SHIELD: FULL STACK STARTUP SCRIPT
# This script launches all 4 microservices and the frontend in separate windows.

Write-Host "--- 🛡️ INITIALIZING FRAUD SHIELD ECOSYSTEM ---" -ForegroundColor Cyan

# 1. Start ML Service (Python)
Write-Host "[1/5] Launching AI Neural Engine (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'fraud-ml-service'; python app.py"

# 2. Start Detection Core (Java)
Write-Host "[2/5] Launching Detection Core (Port 8082)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'detection-core'; mvn spring-boot:run"

# 3. Start Transaction Gateway (Java)
Write-Host "[3/5] Launching Transaction Gateway (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'transaction-api-gateway'; mvn spring-boot:run"

# 4. Start Simulation Engine (Java)
Write-Host "[4/5] Launching Traffic Simulator (Port 8085)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'simulation-engine'; mvn spring-boot:run"

# 5. Start Frontend (React)
Write-Host "[5/5] Launching Analyst Dashboard (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'frauddetectionfrontend'; npm run dev"

Write-Host "--- ✅ ALL SYSTEMS DEPLOYED ---" -ForegroundColor Green
Write-Host "Monitor the separate windows for logs." -ForegroundColor Gray
