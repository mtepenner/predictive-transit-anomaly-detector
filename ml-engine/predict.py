import sys
import json
import pandas as pd
import xgboost as xgb
import warnings
import os

# Suppress warnings to keep standard output clean for Node.js
warnings.filterwarnings('ignore')

def main():
    try:
        # Catch JSON string passed from Node
        raw_input = sys.argv[1]
        input_data = json.loads(raw_input)
        
        # Extract features (must match the columns in train.py exactly)
        features = {
            'hour_of_day': [input_data.get('hour_of_day', 12)],
            'temp': [input_data.get('temp', 65)],
            'prev_delay': [input_data.get('prev_delay', 0)]
        }
        
        df = pd.DataFrame(features)
        
        # Load the pre-trained model
        model_path = os.path.join(os.path.dirname(__file__), 'transit_model.json')
        model = xgb.XGBRegressor()
        model.load_model(model_path)
        
        # Generate prediction
        prediction = model.predict(df)[0]
        
        # Format output as JSON
        result = {
            "station_id": input_data.get("station_id", "UNKNOWN"),
            "predicted_delay_mins": float(prediction),
            "coordinates": input_data.get("coordinates", [0, 0])
        }
        
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
