import pandas as pd
import numpy as np
import xgboost as xgb

# 1. Generate Dummy Historical Data
np.random.seed(42)
n_samples = 5000

data = {
    'hour_of_day': np.random.randint(0, 24, n_samples),
    'temp': np.random.uniform(30, 100, n_samples),
    'prev_delay': np.random.uniform(0, 30, n_samples)
}
df = pd.DataFrame(data)

# Target: actual_delay (simulate a realistic relationship)
# e.g., higher prev_delay + rush hour causes worse actual delays
df['actual_delay'] = (df['prev_delay'] * 1.5) + (df['hour_of_day'] * 0.2) + np.random.normal(0, 2, n_samples)

X = df.drop('actual_delay', axis=1)
y = df['actual_delay']

# 2. Train the Model
print("Training XGBoost model...")
model = xgb.XGBRegressor(n_estimators=100, max_depth=4, learning_rate=0.1)
model.fit(X, y)

# 3. Save the Model for the Node server to use
model_path = 'transit_model.json'
model.save_model(model_path)
print(f"Model saved successfully to {model_path}")
