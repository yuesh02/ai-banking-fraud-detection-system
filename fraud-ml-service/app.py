from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

# Load model once at startup
MODEL_PATH = os.path.join("models", "fraud_model.pkl")
model = joblib.load(MODEL_PATH)


@app.route("/")
def health():
    return jsonify({"status": "ML Service Running"})


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    features = np.array([[
        data["amount"],
        data["velocity"],
        data["newDevice"],
        data["newCountry"],
        data["highRiskMerchant"],
        data["rollingAvgRatio"],
        data["timeOfDay"],
        data["ipRiskScore"]
    ]])

    probability = model.predict_proba(features)[0][1]

    return jsonify({
        "probability": float(probability)
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)