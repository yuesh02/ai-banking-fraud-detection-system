# 🛑 FRAUD SHIELD: FULL STACK TERMINATION SCRIPT
# This script finds and kills all processes running on the project's ports.

Write-Host "--- 🛑 TERMINATING FRAUD SHIELD ECOSYSTEM ---" -ForegroundColor Red

$ports = @(5000, 8080, 8082, 8085, 5173)

foreach ($port in $ports) {
    Write-Host "Cleaning Port $port..." -ForegroundColor Gray
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        $pids = $process.OwningProcess | Select-Object -Unique
        foreach ($pid in $pids) {
            Write-Host " Killing PID $pid..." -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
}

# Optional: Clean up any lingering Java/Python windows specifically
Write-Host "Cleaning lingering terminal windows..." -ForegroundColor Gray
Get-Process | Where-Object { $_.MainWindowTitle -like "*mvn spring-boot:run*" -or $_.MainWindowTitle -like "*python app.py*" } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "--- ✅ ALL SYSTEMS STOPPED ---" -ForegroundColor Green
