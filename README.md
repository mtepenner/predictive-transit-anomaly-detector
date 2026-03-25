# 🚄 Predictive Transit Anomaly Detector

A full-stack application designed to monitor, predict, and visualize transit delays in real-time. By leveraging machine learning and live data streaming, this tool identifies potential "cascading warnings" and grid anomalies before they impact the entire network.

## 📋 Table of Contents

  - [Features](https://www.google.com/search?q=%23-features)
  - [Technologies Used](https://www.google.com/search?q=%23-technologies-used)
  - [Architecture](https://www.google.com/search?q=%23-architecture)
  - [Installation](https://www.google.com/search?q=%23-installation)
  - [Usage](https://www.google.com/search?q=%23-usage)
  - [Machine Learning Model](https://www.google.com/search?q=%23-machine-learning-model)

## 🚀 Features

  * **Real-Time Predictions**: Continuously processes live transit data to predict station delays.
  * **Interactive Visualization**: Dynamic Mapbox-powered dashboard showing station status across the San Francisco Bay Area.
  * **Anomaly Detection**: Visual indicators for "Severe Delays" (\>15 mins) with automated dashboard alerts.
  * **WebSocket Integration**: Instant data broadcasting from the backend to the frontend for zero-latency updates.

## 🛠️ Technologies Used

  * **Frontend**: React, Mapbox GL, React-Map-GL.
  * **Backend**: Node.js, Express, WebSocket (`ws`).
  * **ML Engine**: Python, XGBoost, Pandas, Scikit-learn.

## 🏗️ Architecture

The system consists of three primary components:

1.  **ML Engine**: A Python-based XGBoost regressor that predicts `actual_delay` based on `hour_of_day`, `temp`, and `prev_delay`.
2.  **Node.js Backend**: Acts as the orchestrator, simulating live data streams and spawning Python processes to run predictions.
3.  **React Frontend**: A real-time map interface that receives updates via WebSockets and renders station health.

## 🔧 Installation

### 1\. Prerequisites

  * Node.js (v16+)
  * Python 3.8+
  * Mapbox Access Token (Free tier)

### 2\. Setup ML Engine

```bash
cd ml-engine
pip install -r requirements.txt
python train.py # Generates the initial transit_model.json
```

### 3\. Setup Backend

```bash
cd ../backend
npm install
```

### 4\. Setup Frontend

```bash
cd ../frontend
npm install
```

## 💻 Usage

1.  **Start the Backend**:
    ```bash
    cd backend
    node server.js
    ```
2.  **Start the Frontend**:
      * Open `frontend/src/App.js` and replace `YOUR_MAPBOX_ACCESS_TOKEN` with your token.
    <!-- end list -->
    ```bash
    cd frontend
    npm start
    ```
3.  **View Results**: Navigate to `http://localhost:3000`. The map will begin updating every 3 seconds with new simulated station predictions.

## 🧠 Machine Learning Model

The underlying model is an **XGBoost Regressor** trained on historical delay patterns. It considers environmental factors (temperature) and temporal factors (hour of day) to calculate the likelihood of a cascading delay.

  * **Input Features**: `hour_of_day`, `temp`, `prev_delay`.
  * **Output**: `predicted_delay_mins`.
