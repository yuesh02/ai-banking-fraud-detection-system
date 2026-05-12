import pandas as pd
import numpy as np

np.random.seed(42)
data = []

# Generate 50,000 synthetic transactions
for _ in range(50000):
    amount = np.random.exponential(300)
    velocity = np.random.randint(0, 8)
    new_device = np.random.choice([0, 1], p=[0.8, 0.2])
    new_country = np.random.choice([0, 1], p=[0.9, 0.1])
    high_risk_merchant = np.random.choice([0, 1], p=[0.9, 0.1])
    rolling_ratio = np.random.uniform(0.5, 6)
    time_of_day = np.random.randint(0, 24)
    ip_risk_score = np.random.uniform(0.1, 0.9)

    fraud = 0
    
    # FRAUD LOGIC (Patterned for AI learning)
    # 1. High Velocity + Late Night
    if (velocity > 4 and (time_of_day < 5 or time_of_day > 22)):
        fraud = 1
    # 2. Huge amount spike + New Device
    elif (rolling_ratio > 4 and amount > 500 and new_device):
        fraud = 1
    # 3. High Risk Merchant + High Risk IP
    elif (high_risk_merchant and ip_risk_score > 0.6):
        fraud = 1
    # 4. Global Sanctions (Country) + High Amount
    elif (new_country and amount > 2000):
        fraud = 1

    data.append([
        amount, velocity, new_device,
        new_country, high_risk_merchant,
        rolling_ratio, time_of_day,
        ip_risk_score, fraud
    ])

columns = [
    "amount", "velocity", "new_device",
    "new_country", "high_risk_merchant",
    "rolling_avg_ratio", "time_of_day",
    "ip_risk_score", "fraud"
]

df = pd.DataFrame(data, columns=columns)
df.to_csv("training_data.csv", index=False)

print(f"✅ Training data generated. Fraud rate: {round(df['fraud'].mean()*100, 2)}%")