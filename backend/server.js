const express = require('express');
const { spawn } = require('child_process');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
const PORT = 3001;

const wss = new WebSocket.Server({ port: 8080 });

// Helper function to call Python
function runPrediction(transitData) {
    const pythonScriptPath = path.join(__dirname, '../ml_engine/predict.py');
    const pythonProcess = spawn('python3', [pythonScriptPath, JSON.stringify(transitData)]);

    pythonProcess.stdout.on('data', (data) => {
        try {
            const resultJson = JSON.parse(data.toString().trim());
            
            if (resultJson.error) {
                console.error("Python Error:", resultJson.error);
                return;
            }

            console.log(`Predicted ${resultJson.predicted_delay_mins.toFixed(1)}m delay at ${resultJson.station_id}`);

            // Broadcast prediction to React frontend
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(resultJson));
                }
            });
        } catch (e) {
            console.error("Failed to parse Python output:", data.toString());
        }
    });
}

// Simulate a live data stream every 3 seconds
setInterval(() => {
    const mockStations = [
        { id: "SF_EMBARCADERO", coords: [-122.3967, 37.7929] },
        { id: "OAK_12TH_ST", coords: [-122.2716, 37.8036] },
        { id: "BERKELEY_DT", coords: [-122.2681, 37.8701] },
        { id: "DALY_CITY", coords: [-122.4690, 37.7061] }
    ];
    
    const randomStation = mockStations[Math.floor(Math.random() * mockStations.length)];
    
    const liveData = { 
        station_id: randomStation.id, 
        hour_of_day: new Date().getHours(), 
        temp: 50 + Math.random() * 30, 
        prev_delay: Math.random() * 12, // Simulate current lag
        coordinates: randomStation.coords
    };

    runPrediction(liveData);
}, 3000);

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log('WebSocket server listening on ws://localhost:8080');
});
