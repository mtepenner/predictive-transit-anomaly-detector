import sys
import json
import pandas as pd
import xgboost as xgb
import warnings
warnings.filterwarnings('ignore') # Keeps stdout clean for Node.js

def main():
    try:
        # 1. Catch the JSON string passed from Node.js
        input_data = json.loads(sys.argv[1])
        
        # 2. Convert to DataFrame (ensure columns match your training data)
        df = pd.DataFrame([input_data])
        
        # 3. Load the pre-trained model (assume train.py already generated this)
        model = xgb.XGBRegressor()
        model.load_model('transit_model.json')
        
        # 4. Generate Anomaly/Delay Prediction
        prediction = model.predict(df)[0]
        
        # 5. Print standard JSON to stdout so Node can read it
        result = {
            "station_id": input_data.get("station_id"),
            "predicted_delay_mins": float(prediction),
            "coordinates": input_data.get("coordinates")
        }
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
