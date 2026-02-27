import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import roc_auc_score
import joblib

df = pd.read_csv("training_data.csv")

X = df.drop("fraud", axis=1)
y = df["fraud"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = GradientBoostingClassifier()
model.fit(X_train, y_train)

pred_proba = model.predict_proba(X_test)[:,1]
print("ROC AUC:", roc_auc_score(y_test, pred_proba))

joblib.dump(model, "../models/fraud_model.pkl")
print("Model saved.")