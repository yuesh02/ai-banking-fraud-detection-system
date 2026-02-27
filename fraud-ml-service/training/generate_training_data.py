import pandas as pd
import numpy as np

np.random.seed(42)
data = []

for _ in range(50000):

    amount = np.random.exponential(200)
    velocity = np.random.randint(0,10)
    new_device = np.random.choice([0,1], p=[0.8,0.2])
    new_country = np.random.choice([0,1], p=[0.85,0.15])
    high_risk_merchant = np.random.choice([0,1], p=[0.9,0.1])
    rolling_ratio = np.random.uniform(0.5,5)
    time_of_day = np.random.randint(0,24)
    ip_risk_score = np.random.uniform(0,1)

    fraud = 0

    if (rolling_ratio > 3 and velocity > 5) \
       or (new_device and high_risk_merchant) \
       or ip_risk_score > 0.8:
        fraud = 1

    data.append([
        amount, velocity, new_device,
        new_country, high_risk_merchant,
        rolling_ratio, time_of_day,
        ip_risk_score, fraud
    ])

columns = [
    "amount","velocity","new_device",
    "new_country","high_risk_merchant",
    "rolling_avg_ratio","time_of_day",
    "ip_risk_score","fraud"
]

df = pd.DataFrame(data, columns=columns)
df.to_csv("training_data.csv", index=False)

print("Training data generated.")