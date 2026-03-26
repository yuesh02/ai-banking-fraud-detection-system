echo Starting ML Service...
start cmd /k "cd ml-service && python app.py"

timeout /t 5

echo Starting Detection Core...
start cmd /k "cd detection-core && mvn spring-boot:run"

timeout /t 5

echo Starting API Gateway...
start cmd /k "cd transaction-api-gateway && mvn spring-boot:run"

timeout /t 5

echo Starting Simulation Engine...
start cmd /k "cd simulation-engine && mvn spring-boot:run"

timeout /t 5

echo Starting Dashboard...
start cmd /k "cd dashboard && npm start"