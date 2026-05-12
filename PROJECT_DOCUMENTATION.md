# Fraud Detection System - Project Documentation

A **real-time fraud detection system** built with microservices architecture. Uses hybrid scoring (60% rule-based + 40% ML) to detect fraudulent transactions in real-time.

---

## 📌 Quick Start

### Prerequisites
- Java 21 JDK
- Maven
- Python 3.9+
- MySQL 8.0+
- Node.js 18+, npm

### Setup & Run
```bash
# 1. Create MySQL database
CREATE DATABASE fraud_detection;

# 2. Update database credentials in:
#    - transaction-api-gateway/src/main/resources/application.properties
#    - detection-core/src/main/resources/application.properties

# 3. Start all services
start-services.bat

# 4. Access dashboard at http://localhost:5173
```

**Services will be available at:**
- API Gateway: http://localhost:8080
- Detection Core: http://localhost:8082
- ML Service: http://localhost:5000
- Simulation Engine: http://localhost:8081
- Dashboard: http://localhost:5173

---

## 🏛️ System Architecture

### High-Level Overview
```
Simulation Engine → API Gateway → Detection Core → ML Service
                                      ↓
                                   Database
                                      ↑
                                  Dashboard
```

### 5 Core Microservices

#### 1. **Transaction API Gateway** (Java/Spring Boot) - Port 8080
**Purpose:** Entry point for all transaction requests, persistent storage layer.

- **Key Endpoints:**
  - `POST /api/v1/transactions` - Submit transaction for processing
  - `GET /api/v1/transactions/{transactionId}` - Retrieve transaction details
  - `GET /api/v1/transactions/customer/{customerId}` - Get customer's transactions

- **Key Classes:**
  - `TransactionController.java` - REST endpoints
  - `DetectionClient.java` - Communicates with Detection Core
  - `TransactionRepository.java` - Database operations

- **Responsibilities:**
  - Accept and validate transactions
  - Store raw transaction data in MySQL
  - Call Detection Core for risk assessment
  - Return decision to caller (APPROVE/REVIEW/BLOCK)

---

#### 2. **Detection Core** (Java/Spring Boot) - Port 8082
**Purpose:** Main intelligence hub, orchestrates fraud detection logic.

- **Key Endpoints:**
  - `POST /detect` - Process transaction for fraud risk
  - `GET /api/v1/dashboard/summary` - System overview metrics
  - `GET /api/v1/dashboard/fraud-trend` - Hourly fraud trends
  - `GET /api/v1/dashboard/risk-distribution` - Risk level breakdown
  - `GET /api/v1/dashboard/country-risk` - Geographic risk analysis
  - `GET /api/v1/dashboard/top-merchants` - Merchants with highest fraud

- **Key Classes:**
  - `RiskEngine.java` - Rule-based fraud detection logic
  - `FeatureExtractor.java` - Prepares features for ML model
  - `HybridScoringModel.java` - Combines rule & ML scores (60/40)
  - `MLServiceClient.java` - Calls Python ML service
  - `DashboardController.java` - Provides analytics endpoints

- **Responsibilities:**
  - Query customer transaction history
  - Execute rule-based checks (velocity, amount anomaly, geographic risk)
  - Extract features and call ML service
  - Combine scores using weighted hybrid model
  - Store fraud assessment result

- **Detection Rules:**
  - **Velocity Check:** Multiple transactions within short time window
  - **Geographic Risk:** Transactions from high-risk countries
  - **Amount Anomaly:** Transaction amount deviates from historical average
  - **Device Consistency:** Same device used for suspicious patterns

---

#### 3. **Fraud ML Service** (Python/Flask) - Port 5000
**Purpose:** ML-based probability scoring using pre-trained model.

- **Key Endpoint:**
  - `POST /predict` - Get fraud probability for transaction

- **Model Details:**
  - **Algorithm:** RandomForestClassifier (Scikit-learn)
  - **Input Features (8 total):**
    - Transaction amount
    - Customer velocity (transactions in last 24h)
    - Device velocity
    - IP velocity
    - Rolling average of transaction amounts
    - Amount ratio to historical average
    - Merchant risk level
    - Geographic risk score
  - **Output:** Fraud probability (0.0 - 1.0)

- **Key Files:**
  - `app.py` - Flask REST API
  - `models/fraud_model.pkl` - Trained model (pre-trained, ready to use)
  - `requirements.txt` - Python dependencies (Pandas, Scikit-learn, Flask)

- **Responsibilities:**
  - Load pre-trained fraud model on startup
  - Accept feature vectors from Detection Core
  - Return fraud probability

---

#### 4. **Simulation Engine** (Java/Spring Boot) - Port 8081
**Purpose:** Generate synthetic transaction traffic for testing & demo.

- **Behavior:**
  - Runs scheduled task every 3 seconds
  - Generates 1-3 random transactions per cycle
  - Creates mix of Normal, Suspicious, and Fraud transactions
  - Includes velocity fraud scenarios (burst attacks)

- **Key Classes:**
  - `SimulationService.java` - Transaction generation logic
  - `SimulationScheduler.java` - Scheduled execution (3-second interval)
  - `TransactionGenerator.java` - Creates realistic test data

- **Transaction Types:**
  - **Normal (70%):** Standard, low-risk transactions
  - **Suspicious (20%):** Higher amounts, geographic anomalies
  - **Fraud (10%):** Velocity attacks, unusual patterns, high-risk merchants

- **Responsibilities:**
  - Generate synthetic but realistic transaction data
  - Submit to API Gateway
  - Support demo and load testing

---

#### 5. **Fraud Detection Frontend** (React + Vite) - Port 5173
**Purpose:** Real-time monitoring dashboard for fraud trends.

- **Key Pages/Components:**
  - **Dashboard Summary:** Total transactions, fraud rate, alert count
  - **Fraud Trends:** Line charts showing hourly/daily patterns
  - **Risk Distribution:** Pie/doughnut charts for risk levels (LOW/MEDIUM/HIGH)
  - **Geographic Risk:** Heatmap-style visualization of fraud by country
  - **Top Risky Merchants:** Table of merchants with highest fraud rates
  - **Live Transaction Feed:** Real-time transaction stream
  - **Transaction Search:** Lookup individual transactions by ID

- **Tech Stack:**
  - React 19 with Vite (fast build tool)
  - Tailwind CSS (styling)
  - Recharts (data visualization)
  - Lucide React (icons)
  - Axios (HTTP client)

- **Key Features:**
  - Auto-refresh dashboard metrics (5-10 second intervals)
  - Color-coded risk levels (Green/Yellow/Red)
  - Responsive design for mobile & desktop
  - Error boundaries for graceful failure handling

- **Responsibilities:**
  - Fetch and display fraud metrics from Detection Core
  - Provide real-time system monitoring
  - Enable fraud investigation & analysis

---

## 🔄 Transaction Flow (Detailed)

```
1. SIMULATION ENGINE (port 8081)
   └─> Generates random transaction
       
2. API GATEWAY (port 8080)
   ├─> Receives POST /api/v1/transactions
   ├─> Validates transaction format
   ├─> Stores in MySQL (transactions table)
   └─> Calls Detection Core

3. DETECTION CORE (port 8082)
   ├─> Queries transaction history (customer's last N transactions)
   ├─> RULE ENGINE CHECKS:
   │   ├─> Velocity: Transactions in last 1 hour
   │   ├─> Geography: Check if merchant_country is high-risk
   │   ├─> Amount: Compare to customer's historical average
   │   └─> Device: Check device consistency
   ├─> Extracts 8 features
   ├─> Calls ML Service (port 5000)
   │   └─> Gets fraud probability (0.0-1.0)
   ├─> SCORING (Hybrid Model):
   │   ├─> Rule Score = (sum of rule violations) / (total rules)
   │   ├─> ML Score = fraud_probability from model
   │   └─> Final Score = (Rule Score × 0.60) + (ML Score × 0.40)
   ├─> DECISION:
   │   ├─> Score < 0.3    → APPROVE (Low Risk)
   │   ├─> 0.3 ≤ Score < 0.7 → REVIEW (Medium Risk)
   │   └─> Score ≥ 0.7    → BLOCK (High Risk)
   └─> Stores result in fraud_risks table

4. FRONTEND DASHBOARD (port 5173)
   ├─> Polls Detection Core every 5-10 seconds
   ├─> Updates real-time metrics
   └─> Displays risk trends & alerts

5. DATABASE (MySQL)
   ├─> transactions table (raw data)
   └─> fraud_risks table (assessment results)
```

---

## 📊 Database Schema

### Table: `transactions`
```sql
CREATE TABLE transactions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  transaction_id VARCHAR(50) UNIQUE,
  customer_id VARCHAR(50),
  amount DECIMAL(10,2),
  currency VARCHAR(3),
  merchant_id VARCHAR(50),
  merchant_category VARCHAR(100),
  merchant_country VARCHAR(50),
  customer_country VARCHAR(50),
  ip_address VARCHAR(45),
  device_id VARCHAR(50),
  timestamp DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `fraud_risks`
```sql
CREATE TABLE fraud_risks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  transaction_id VARCHAR(50) FOREIGN KEY,
  rule_score DECIMAL(3,2),
  ml_score DECIMAL(3,2),
  final_score DECIMAL(3,2),
  risk_level ENUM('LOW', 'MEDIUM', 'HIGH'),
  action ENUM('APPROVE', 'REVIEW', 'BLOCK'),
  reason TEXT,
  is_fraud BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛠️ API Reference

### Transaction API Gateway (8080)

**Submit Transaction**
```
POST /api/v1/transactions
Content-Type: application/json

{
  "customer_id": "CUST123",
  "amount": 150.00,
  "currency": "USD",
  "merchant_id": "MERCH456",
  "merchant_category": "Electronics",
  "merchant_country": "US",
  "customer_country": "US",
  "ip_address": "192.168.1.1",
  "device_id": "DEVICE789"
}

Response (200):
{
  "transaction_id": "TXN-UUID-123",
  "status": "APPROVED",
  "risk_level": "LOW",
  "risk_score": 0.25
}
```

### Detection Core (8082)

**Get Summary**
```
GET /api/v1/dashboard/summary

Response:
{
  "total_transactions": 5432,
  "total_fraud_count": 128,
  "fraud_rate": 2.36,
  "high_risk_alerts": 45,
  "timestamp": "2026-04-05T15:20:00Z"
}
```

**Get Fraud Trends**
```
GET /api/v1/dashboard/fraud-trend?timeframe=24h

Response:
[
  { "hour": "2026-04-05 14:00", "count": 12, "fraud_count": 2 },
  { "hour": "2026-04-05 15:00", "count": 18, "fraud_count": 4 }
]
```

### Fraud ML Service (5000)

**Predict Fraud Probability**
```
POST /predict
Content-Type: application/json

{
  "amount": 150.00,
  "velocity": 3,
  "device_velocity": 2,
  "ip_velocity": 1,
  "avg_amount": 100.00,
  "amount_ratio": 1.5,
  "merchant_risk": 0.3,
  "geo_risk": 0.2
}

Response:
{
  "fraud_probability": 0.35,
  "confidence": 0.92
}
```

---

## ⚙️ Configuration

### Transaction API Gateway
**File:** `transaction-api-gateway/src/main/resources/application.properties`
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/fraud_detection
spring.datasource.username=root
spring.datasource.password=your_password
detection.service.url=http://localhost:8082
```

### Detection Core
**File:** `detection-core/src/main/resources/application.properties`
```properties
server.port=8082
spring.datasource.url=jdbc:mysql://localhost:3306/fraud_detection
spring.datasource.username=root
spring.datasource.password=your_password
ml.service.url=http://localhost:5000
```

### Fraud ML Service
**File:** `fraud-ml-service/config.py`
```python
ML_SERVICE_PORT = 5000
MODEL_PATH = "models/fraud_model.pkl"
DEBUG_MODE = False
```

### Frontend
**File:** `frauddetectionfrontend/.env`
```
VITE_API_GATEWAY_URL=http://localhost:8080
VITE_DETECTION_CORE_URL=http://localhost:8082
VITE_DASHBOARD_REFRESH_INTERVAL=5000
```

---

## 🚀 Deployment & Operations

### Production Considerations
- Use environment variables instead of hardcoded credentials
- Configure connection pools for database connections
- Set up monitoring & alerting for service health
- Implement request rate limiting
- Enable HTTPS for API communication
- Use message queue (RabbitMQ/Kafka) for async processing at scale
- Implement caching (Redis) for frequently accessed data

### Scaling Strategy
- **Horizontal Scaling:** Run multiple instances behind load balancer
- **Database:** Consider read replicas for high-query volume
- **Cache Layer:** Redis for dashboard metrics
- **Message Queue:** Async processing for non-critical operations
- **ML Service:** GPU acceleration for model inference at scale

---

## 📝 Development Guide

### Adding New Detection Rules
1. Edit `detection-core/src/main/java/com/fraud/engine/RiskEngine.java`
2. Add new rule method following existing pattern
3. Update scoring logic in `HybridScoringModel.java`
4. Test with simulation engine

### Retraining ML Model
1. Collect labeled fraud data
2. Update `fraud-ml-service/training/train_model.py`
3. Run training script: `python train_model.py`
4. Test model with `test_model.py`
5. Replace `models/fraud_model.pkl` with new model
6. Restart ML service

### Adding Dashboard Widgets
1. Create new component in `frauddetectionfrontend/src/components/`
2. Add corresponding endpoint in Detection Core
3. Fetch data using `useEffect` hook
4. Add widget to dashboard layout

---

## 🔒 Security Notes

- Transactions contain sensitive data - implement proper access controls
- ML model inputs should be validated to prevent injection attacks
- Use HTTPS in production
- Implement role-based access control (RBAC) for dashboard
- Sanitize user inputs at all API boundaries
- Log all fraud detections for audit trails
- Encrypt sensitive data at rest and in transit

---

## 📈 Performance Metrics

- **Transaction Processing Time:** <100ms (end-to-end)
- **ML Inference Time:** ~20-30ms per transaction
- **Dashboard Refresh:** 5-10 second intervals
- **Database Query Time:** <50ms for typical queries
- **Throughput:** Designed for 100+ transactions/second

---

## 🐛 Troubleshooting

### Services Won't Start
- Check all required services are running (Java, Python, MySQL)
- Verify ports 8080, 8081, 8082, 5000, 5173 are available
- Check database credentials in `application.properties`

### ML Service Returns Errors
- Verify model file exists at `models/fraud_model.pkl`
- Check Python dependencies: `pip install -r requirements.txt`
- Ensure feature order matches training data

### Dashboard Not Showing Data
- Check Detection Core is running on port 8082
- Verify database has transactions
- Check browser console for CORS errors
- Ensure frontend is running on port 5173

### Slow Transaction Processing
- Check database connection pool size
- Monitor ML service response times
- Review RiskEngine rule complexity
- Scale horizontally if needed

---

## 📚 Additional Resources

- **Agile Documentation:** See `Agile_Document_Fraud_Detection.xlsx`
- **System Workflow:** See `workflow.pdf`
- **Architecture Details:** See `architecture.txt`
- **License:** See `LICENSE`

---

## 👥 Support & Contribution

For issues, improvements, or feature requests, please refer to the project's issue tracker or contact the development team.

**Last Updated:** April 2026
