# Codebase Analysis: AI Banking Fraud Detection System

Based on a direct inspection of the source code across the five microservices, here is a comprehensive breakdown of what this project is actively doing in the backend and frontend.

## 1. The Microservices Architecture

The system is designed as a distributed pipeline of 5 components, built primarily with **Java 21 (Spring Boot)**, **Python (Flask)**, and **React (Vite)**.

### A. Transaction API Gateway (`transaction-api-gateway`)
- **Technology:** Java / Spring Boot (Port 8080)
- **Role:** The entry point.
- **Code Insights:** The `TransactionController.java` exposes a `POST` endpoint to accept raw JSON payloads for banking transactions. It is responsible for immediately storing the raw transaction data into a MySQL database before forwarding it to the `detection-core` for evaluation.

### B. Detection Core (`detection-core`)
- **Technology:** Java / Spring Boot (Port 8082)
- **Role:** The orchestration and rule engine.
- **Code Insights:** 
  - Contains multiple REST controllers (`DetectionController`, `DashboardController`, `AuthController`, `SystemController`).
  - **The Process:** When a transaction arrives from the gateway, it passes through an internal Risk Engine. The engine executes hard-coded heuristic rules (e.g., rapid consecutive transactions, unusual country combinations). 
  - It simultaneously sends a REST call to the Python ML Service, asking for an AI probability score.
  - It combines the Java rule-based score with the Python ML score to output a final enum decision: `APPROVE`, `REVIEW`, or `BLOCK`.
  - The `DashboardController` constantly queries the MySQL database to serve aggregated metrics (like Fraud Rate, Top Risky Merchants, and Risk Distribution) to the frontend.

### C. Fraud ML Service (`fraud-ml-service`)
- **Technology:** Python 3 / Flask / Scikit-Learn (Port 5000)
- **Role:** Pure Artificial Intelligence Inference.
- **Code Insights:** 
  - The `app.py` exposes a single `/predict` endpoint.
  - On startup, it loads a pre-trained `fraud_model.pkl` using `joblib`.
  - It accepts an array of 8 highly specific numerical features exactly in this order:
    1. `amount` (Transaction amount)
    2. `velocity` (Frequency of recent transactions)
    3. `newDevice` (Boolean/Binary flag for unrecognized device)
    4. `newCountry` (Boolean/Binary flag for cross-border anomaly)
    5. `highRiskMerchant` (Score based on merchant category)
    6. `rollingAvgRatio` (Current amount vs. historical average amount)
    7. `timeOfDay` (Timestamp mapped to high-risk night hours)
    8. `ipRiskScore` (Risk score associated with the IP Address)
  - It uses `model.predict_proba()` to calculate the exact mathematical probability (0.0 to 1.0) that the transaction is fraud.

### D. Simulation Engine (`simulation-engine`)
- **Technology:** Java / Spring Boot (Port 8081)
- **Role:** Automated Load Testing / Data Generation.
- **Code Insights:** Runs a scheduled background thread that constantly fires random, synthetically generated transactions to the API Gateway. This ensures the dashboard always has live data moving through the charts. It purposefully spikes the data occasionally to simulate organized "Fraud Attacks."

---

## 2. The Frontend Application (`frauddetectionfrontend`)
- **Technology:** React 19, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Role:** The Real-Time Admin Dashboard.
- **Code Insights:**
  - **Component Structure:** The UI is split into specialized, modular components mapped directly to the `DashboardController` endpoints.
  - **Live Polling:** Uses React `useEffect` hooks with `setInterval` (typically every 10-20 seconds) to constantly pull the latest data from the `detection-core` without needing manual page refreshes.
  - **Visualizations:** Heavily relies on `recharts` for visual data, translating raw numbers into:
    - *FraudTrendChart:* A line chart showing fraud attempts over time.
    - *RiskDistributionChart:* A circular chart breaking down LOW vs MEDIUM vs HIGH risk transactions.
    - *TopRiskyMerchants & RiskByCountry:* Bar charts showing geographical and merchant-based hotspots.
  - **UI/UX Aesthetics:** The frontend relies heavily on modern "Glassmorphism." It uses CSS tokens like `bg-[#1e293b]/50`, `border-white/5`, and `backdrop-blur` to create a translucent, premium dark mode.
  - **Interactivity:** Elements are wrapped in `<motion.div>` (Framer Motion) to provide subtle scaling hover effects and smooth entry animations when new transactions load.

---

## 3. The Full Code Execution Flow
1. **Simulation Engine** builds a mock JSON transaction and POSTs it to `http://localhost:8080/api/v1/transactions`.
2. **API Gateway** saves it to the DB and forwards the object to `http://localhost:8082/detect`.
3. **Detection Core** parses the object, extracts the 8 specific parameters (like velocity and rolling average), and POSTs them to the Python script at `http://localhost:5000/predict`.
4. **Fraud ML Service** evaluates the 8 numbers against its random forest pickle file, replies with `{"probability": 0.85}`.
5. **Detection Core** registers the 0.85 score, merges it with its own rules, determines the transaction is **BLOCK** (Fraud), and logs this result in the `fraud_risks` database table.
6. The **React Frontend**, during its 10-second polling cycle, fetches the updated database numbers and visually injects the new blocked transaction into the `RecentTransactions.jsx` list with a red `FRAUD` badge.
