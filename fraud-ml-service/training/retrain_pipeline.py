"""
retrain_pipeline.py
────────────────────────────────────────────────────────────────
Automated model retraining using admin-verified fraud decisions
pulled directly from the MySQL database.

Usage:
    python training/retrain_pipeline.py

Schedule this (e.g., weekly) via Windows Task Scheduler:
    python "C:\\path\\to\\fraud-ml-service\\training\\retrain_pipeline.py"
"""

import os
import sys
import json
import joblib
import requests
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

# ── MySQL connection (requires: pip install mysql-connector-python) ────────────
try:
    import mysql.connector
    MYSQL_AVAILABLE = True
except ImportError:
    MYSQL_AVAILABLE = False
    print("⚠️  mysql-connector-python not installed. Run: pip install mysql-connector-python")
    print("   Falling back to mock data for demonstration.\n")

# ── Config ────────────────────────────────────────────────────────────────────
BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH   = os.path.join(BASE_DIR, "..", "models", "fraud_model.pkl")
DATA_PATH    = os.path.join(BASE_DIR, "..", "data", "synthetic_transactions.csv")
METRICS_PATH = os.path.join(BASE_DIR, "..", "logs", "retrain_metrics.jsonl")
ML_SERVICE_URL = "http://localhost:5000"

DB_CONFIG = {
    "host":     "localhost",
    "port":     3306,
    "database": "fraud_detection",
    "user":     "root",
    "password": "shyam123"
}

# These are the 8 features our model was trained on
FEATURE_COLS = ["amount", "velocity", "newDevice", "newCountry",
                "highRiskMerchant", "rollingAvgRatio", "timeOfDay", "ipRiskScore"]

os.makedirs(os.path.join(BASE_DIR, "..", "logs"), exist_ok=True)


# ── Helpers ───────────────────────────────────────────────────────────────────

def fetch_admin_verified_cases():
    """
    Pull transactions that a human analyst explicitly overrode via the dashboard.
    These are ground-truth labels we can trust for retraining.
    """
    if not MYSQL_AVAILABLE:
        return _mock_admin_cases()

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        # Fetch cases where admin manually overrode the system decision
        query = """
            SELECT
                fr.risk_score        AS amount,
                1                    AS velocity,
                0                    AS newDevice,
                0                    AS newCountry,
                0                    AS highRiskMerchant,
                1.0                  AS rollingAvgRatio,
                12                   AS timeOfDay,
                fr.risk_score / 100  AS ipRiskScore,
                CASE WHEN fr.action = 'BLOCK' THEN 1 ELSE 0 END AS fraud
            FROM fraud_risks fr
            WHERE fr.reason LIKE '%Manually overridden%'
            ORDER BY fr.timestamp DESC
            LIMIT 1000
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        if rows:
            print(f"📥 Fetched {len(rows)} admin-verified cases from MySQL.")
            return pd.DataFrame(rows)
        else:
            print("ℹ️  No admin-verified cases found yet. Using mock data.")
            return _mock_admin_cases()

    except Exception as e:
        print(f"⚠️  MySQL connection failed: {e}")
        print("   Falling back to mock data.")
        return _mock_admin_cases()


def _mock_admin_cases():
    """Simulated cases used when DB is not reachable (for local testing)."""
    return pd.DataFrame([
        # Fraudulent cases the model missed, admin blocked
        {"amount": 1250.50, "velocity": 5, "newDevice": 1, "newCountry": 1,
         "highRiskMerchant": 1, "rollingAvgRatio": 4.5, "timeOfDay": 2, "ipRiskScore": 0.9, "fraud": 1},
        {"amount": 380.00, "velocity": 4, "newDevice": 1, "newCountry": 0,
         "highRiskMerchant": 1, "rollingAvgRatio": 2.1, "timeOfDay": 3, "ipRiskScore": 0.8, "fraud": 1},
        {"amount": 80.00, "velocity": 8, "newDevice": 0, "newCountry": 1,
         "highRiskMerchant": 0, "rollingAvgRatio": 0.8, "timeOfDay": 23, "ipRiskScore": 0.7, "fraud": 1},
        # Safe cases the model mis-flagged, admin approved
        {"amount": 5.00, "velocity": 1, "newDevice": 0, "newCountry": 0,
         "highRiskMerchant": 0, "rollingAvgRatio": 0.1, "timeOfDay": 14, "ipRiskScore": 0.1, "fraud": 0},
        {"amount": 25.00, "velocity": 1, "newDevice": 0, "newCountry": 0,
         "highRiskMerchant": 0, "rollingAvgRatio": 0.9, "timeOfDay": 10, "ipRiskScore": 0.05, "fraud": 0},
    ])


def hot_reload_model():
    """Tells the running Flask ML service to reload the new pkl without restarting."""
    try:
        res = requests.post(f"{ML_SERVICE_URL}/reload-model", timeout=5)
        if res.status_code == 200:
            print(f"🔄 ML Service acknowledged model reload: {res.json()['loaded_at']}")
        else:
            print(f"⚠️  Reload returned HTTP {res.status_code}: {res.text}")
    except requests.exceptions.ConnectionError:
        print("ℹ️  ML Service not running. Model saved; it will load next time Flask starts.")


# ── Main pipeline ─────────────────────────────────────────────────────────────

def run_retraining_pipeline():
    print("\n" + "="*60)
    print("🚀 FRAUD MODEL RETRAINING PIPELINE")
    print(f"   Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60 + "\n")

    # 1. Load original training dataset
    print("📊 Loading historical training data...")
    if not os.path.exists(DATA_PATH):
        print(f"❌ Error: Base data not found at {DATA_PATH}")
        sys.exit(1)

    base_df = pd.read_csv(DATA_PATH)
    print(f"   Base dataset: {len(base_df)} rows, {base_df['fraud'].sum()} fraud cases")

    # 2. Fetch admin-reviewed cases from DB
    print("\n🔍 Fetching admin-verified cases...")
    new_df = fetch_admin_verified_cases()
    print(f"   New cases: {len(new_df)} rows, {new_df['fraud'].sum()} fraud labels")

    # 3. Combine datasets
    combined_df = pd.concat([base_df, new_df], ignore_index=True)
    print(f"\n📦 Combined dataset: {len(combined_df)} rows total")

    # 4. Train/test split for evaluation
    X = combined_df[FEATURE_COLS]
    y = combined_df["fraud"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 5. Retrain model
    print("\n🧠 Retraining RandomForestClassifier...")
    model = RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    # 6. Evaluate on hold-out set
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    roc_auc = roc_auc_score(y_test, y_proba)
    report = classification_report(y_test, y_pred, output_dict=True)

    print(f"\n📈 Evaluation on hold-out test set:")
    print(f"   ROC-AUC Score:  {roc_auc:.4f}")
    print(f"   Precision (fraud): {report.get('1', {}).get('precision', 0):.4f}")
    print(f"   Recall    (fraud): {report.get('1', {}).get('recall', 0):.4f}")
    print(f"   F1-Score  (fraud): {report.get('1', {}).get('f1-score', 0):.4f}")

    # 7. Save model
    print(f"\n💾 Saving new model to {MODEL_PATH}...")
    joblib.dump(model, MODEL_PATH)
    print("   ✅ Model saved.")

    # 8. Log metrics for drift tracking
    metrics_entry = {
        "timestamp": datetime.now().isoformat(),
        "training_rows": len(combined_df),
        "new_cases_added": len(new_df),
        "roc_auc": round(roc_auc, 4),
        "precision_fraud": round(report.get("1", {}).get("precision", 0), 4),
        "recall_fraud": round(report.get("1", {}).get("recall", 0), 4),
        "f1_fraud": round(report.get("1", {}).get("f1-score", 0), 4)
    }
    with open(METRICS_PATH, "a") as f:
        f.write(json.dumps(metrics_entry) + "\n")
    print(f"   📝 Metrics logged to {METRICS_PATH}")

    # 9. Hot-reload the running ML service
    print("\n🔄 Notifying ML Service to reload model...")
    hot_reload_model()

    print("\n" + "="*60)
    print("🎉 Retraining Pipeline Complete!")
    print("="*60 + "\n")


if __name__ == "__main__":
    run_retraining_pipeline()
