import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import roc_auc_score
import joblib
import os

# Get the directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "training_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "fraud_model.pkl")

# Ensure models directory exists
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

print(f"Loading data from {DATA_PATH}...")
df = pd.read_csv(DATA_PATH)

X = df.drop("fraud", axis=1)
y = df["fraud"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("Training Gradient Boosting model...")
model = GradientBoostingClassifier()
model.fit(X_train, y_train)

pred_proba = model.predict_proba(X_test)[:, 1]
print("✅ Training Complete. ROC AUC Score:", roc_auc_score(y_test, pred_proba))

joblib.dump(model, MODEL_PATH)
print(f"✅ Model saved successfully at: {MODEL_PATH}")