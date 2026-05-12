from flask import Flask, request, jsonify
import joblib
import numpy as np
import os
import logging
import json
from datetime import datetime

# ── Setup structured logging ──────────────────────────────────────────────────
os.makedirs("logs", exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("logs/prediction_log.jsonl", mode="a")
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# ── Model loading ─────────────────────────────────────────────────────────────
MODEL_PATH = os.path.join("models", "fraud_model.pkl")
model = joblib.load(MODEL_PATH)
model_loaded_at = datetime.now().isoformat()
print(f"✅ Model loaded from {MODEL_PATH} at {model_loaded_at}")

# ── In-memory drift tracker ───────────────────────────────────────────────────
# Stores recent probability values for drift detection in /metrics
prediction_log = []
DRIFT_WINDOW = 500  # number of recent predictions to analyze

# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def health():
    return jsonify({
        "status": "ML Service Running",
        "model_loaded_at": model_loaded_at,
        "predictions_served": len(prediction_log)
    })


@app.route("/health")
def detailed_health():
    """Structured health-check endpoint for monitoring systems."""
    return jsonify({
        "status": "UP",
        "model_path": MODEL_PATH,
        "model_loaded_at": model_loaded_at,
        "total_predictions": len(prediction_log)
    })


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    features = np.array([[
        float(data.get("amount", 0)),
        float(data.get("velocity", 0)),
        float(data.get("newDevice", 0)),
        float(data.get("newCountry", 0)),
        float(data.get("highRiskMerchant", 0)),
        float(data.get("rollingAvgRatio", 1)),
        float(data.get("timeOfDay", 12)),
        float(data.get("ipRiskScore", 0))
    ]])

    probability = float(model.predict_proba(features)[0][1])
    predicted_class = int(probability >= 0.5)

    # ── Structured prediction log (written to logs/prediction_log.jsonl) ──────
    log_entry = {
        "transaction_id": data.get("transactionId", "unknown"),
        "probability": round(probability, 4),
        "predicted_fraud": predicted_class,
        "features": {
            "amount": data.get("amount"),
            "velocity": data.get("velocity"),
            "newDevice": data.get("newDevice"),
            "newCountry": data.get("newCountry"),
            "highRiskMerchant": data.get("highRiskMerchant"),
            "rollingAvgRatio": data.get("rollingAvgRatio"),
            "timeOfDay": data.get("timeOfDay"),
            "ipRiskScore": data.get("ipRiskScore")
        },
        "timestamp": datetime.now().isoformat()
    }
    logger.info(json.dumps(log_entry))

    # Keep an in-memory window for /metrics endpoint
    prediction_log.append({"probability": probability, "timestamp": datetime.now().isoformat()})
    if len(prediction_log) > DRIFT_WINDOW * 2:
        prediction_log.pop(0)

    return jsonify({
        "probability": probability,
        "predicted_fraud": predicted_class
    })


@app.route("/metrics")
def metrics():
    """Returns live drift metrics over the last DRIFT_WINDOW predictions."""
    if not prediction_log:
        return jsonify({"error": "No predictions logged yet. Submit some transactions first."})

    window = prediction_log[-DRIFT_WINDOW:]
    probs = [p["probability"] for p in window]
    high_risk_rate = sum(1 for p in probs if p >= 0.5) / len(probs)
    avg_confidence = sum(probs) / len(probs)

    return jsonify({
        "window_size": len(window),
        "avg_confidence": round(avg_confidence, 4),
        "high_risk_rate": round(high_risk_rate, 4),
        "min_confidence": round(min(probs), 4),
        "max_confidence": round(max(probs), 4),
        "drift_alert": "⚠️ Possible drift detected! Retrain recommended." if high_risk_rate > 0.4 else "✅ Model behavior looks stable"
    })


@app.route("/reload-model", methods=["POST"])
def reload_model():
    """Hot-reloads the model pkl after retrain_pipeline.py runs. No service restart needed."""
    global model, model_loaded_at
    try:
        model = joblib.load(MODEL_PATH)
        model_loaded_at = datetime.now().isoformat()
        print(f"🔄 Model hot-reloaded at {model_loaded_at}")
        return jsonify({"status": "Model reloaded successfully", "loaded_at": model_loaded_at})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)