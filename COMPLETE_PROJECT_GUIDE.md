# 🛡️ Fraud Shield: AI-Powered Banking Fraud Detection
## The Ultimate Developer & User Guide

Welcome to the **Fraud Shield** ecosystem. This project is a production-grade, real-time fraud detection platform designed to protect financial transactions using a hybrid intelligence model.

---

## 📖 Table of Contents
1. [System Vision](#-system-vision)
2. [Architecture Deep Dive](#-architecture-deep-dive)
3. [The Data Journey (Data Flow)](#-the-data-journey-data-flow)
4. [Module Roles & Responsibilities](#-module-roles--responsibilities)
5. [Installation & Setup Guide](#-installation--setup-guide)
6. [Why This Architecture? (Design Rationale)](#-why-this-architecture-design-rationale)
7. [Running the System](#-running-the-system)
8. [API Reference](#-api-reference)

---

## 🎯 System Vision
Modern fraud detection must be **instant, explainable, and adaptive**. 
- **Instant**: Analysis happens in <100ms.
- **Explainable**: We use heuristic rules so analysts know *why* a transaction was flagged.
- **Adaptive**: We use Machine Learning to detect evolving patterns that rules might miss.

---

## 🏛️ Architecture Deep Dive
The system is built on a **Microservices Architecture**. This allows us to scale the "heavy" AI components independently from the "fast" transaction ingestion components.

### Component Map
- **Frontend**: React 19 + Vite + Tailwind (Analyst Dashboard)
- **API Gateway**: Spring Boot (Transaction Ingestion & Persistence)
- **Detection Core**: Spring Boot (The "Brain" - Hybrid Scoring & Rule Engine)
- **ML Service**: Python + Flask + Scikit-Learn (AI Neural Engine)
- **Traffic Simulator**: Spring Boot (Synthetic Transaction Generator)
- **Database**: MySQL 8.0 (Persistent Storage)

---

## 🔄 The Data Journey (Data Flow)
How a single transaction travels through the system:

1. **Ingestion**: An external system (or our **Simulator**) sends a `POST` request to the **API Gateway**.
2. **Persistence**: The Gateway saves the raw transaction to the `transactions` table.
3. **Trigger**: The Gateway forwards the data to the **Detection Core** for immediate analysis.
4. **Heuristic Check**: The Core executes **Velocity**, **Amount Anomaly**, and **Geographic** rules.
5. **AI Inference**: The Core extracts features (e.g., `amount_ratio`, `rolling_avg`) and calls the **Python ML Service**.
6. **Decisioning**:
   - **Rule Score** (60%) + **ML Score** (40%) = **Final Risk Score**.
   - **Result**: `APPROVE`, `REVIEW`, or `BLOCK`.
7. **Reporting**: The result is stored in the `fraud_risks` table and instantly appears on the **React Dashboard**.

---

## 📦 Module Roles & Responsibilities

### 1. ⚡ Transaction API Gateway (Port 8080)
- **Role**: The Entry Point.
- **Why**: Protects the internal network. If the Core is busy, the Gateway still ensures the transaction is safely recorded in the database.

### 2. 🧠 Detection Core (Port 8082)
- **Role**: Orchestrator.
- **Why**: It holds the business logic. It knows how to talk to both the database (for history) and the AI (for predictions).

### 3. 🤖 AI Neural Engine (Port 5000)
- **Role**: Pattern Recognition.
- **Why**: Uses a **Random Forest Classifier** trained on millions of data points to catch "non-obvious" fraud (e.g., a slow-drip attack).

### 4. 📊 Analyst Dashboard (Port 5173)
- **Role**: Visualization & Command Center.
- **Why**: Gives human operators a real-time "bird's eye view" of system health and critical alerts.

### 5. 🚦 Traffic Simulator (Port 8085)
- **Role**: Test Environment.
- **Why**: Allows developers to stress-test the system without needing real bank data.

---

## 🛠️ Installation & Setup Guide

### Prerequisites
- **Java 21 JDK** (Required for Spring Boot services)
- **Maven 3.9+** (Build tool)
- **Python 3.11+** (For AI Service)
- **Node.js 20+** (For Frontend)
- **MySQL 8.0** (Database)

### Step 1: Database Configuration
1. Open MySQL and run:
   ```sql
   CREATE DATABASE fraud_detection;
   ```
2. The system uses default credentials (`root` / `shyam123`). If yours are different, update them in:
   - `detection-core/src/main/resources/application.properties`
   - `transaction-api-gateway/src/main/resources/application.properties`

### Step 2: Python Dependencies
Navigate to `fraud-ml-service` and run:
```bash
pip install -r requirements.txt
```

### Step 3: Frontend Dependencies
Navigate to `frauddetectionfrontend` and run:
```bash
npm install
```

---

## 💡 Why This Architecture? (Design Rationale)

1. **Why Microservices?** 
   - Fraud patterns change weekly. By separating the **ML Service**, we can swap or retrain the AI model without ever touching the **API Gateway** code that handles money.
2. **Why Hybrid Scoring (60/40)?** 
   - Regulators require "Explainability". If we only used AI, we couldn't explain *why* a customer was blocked. Heuristic rules (60%) provide the explanation, while AI (40%) provides the edge.
3. **Why Java for the Core?** 
   - Banking requires strong typing and thread safety. Spring Boot provides the most robust environment for high-stakes financial logic.

---

## 🚀 Running the System

The easiest way to start is using the master PowerShell script:

```powershell
.\run_system.ps1
```

This will launch 5 separate windows. You can then access:
- **Dashboard**: `http://localhost:5173`
- **Core APIs**: `http://localhost:8082/api/v1/dashboard/summary`
- **Gateway**: `http://localhost:8080/api/v1/transactions`

---

## 🛠️ API Reference

### Submit Transaction
`POST http://localhost:8080/api/v1/transactions`
```json
{
  "customer_id": "USER_001",
  "amount": 4500.00,
  "currency": "USD",
  "merchant_id": "M_99",
  "merchant_country": "UK",
  "ip_address": "1.1.1.1"
}
```

### Get Dashboard Stats
`GET http://localhost:8082/api/v1/dashboard/summary`

---

**Last Updated**: May 2026
**Project Lead**: Fraud Shield Development Team
