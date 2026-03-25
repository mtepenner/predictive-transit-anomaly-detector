import React, { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'YOUR_MAPBOX_ACCESS_TOKEN'; 

function App() {
  const [stationData, setStationData] = useState({});

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const newPrediction = JSON.parse(event.data);
      
      // Update by station ID so map markers update in place rather than duplicating
      setStationData((prev) => ({
        ...prev,
        [newPrediction.station_id]: newPrediction
      }));
    };

    return () => ws.close();
  }, []);

  const anomalies = Object.values(stationData);
  const severeDelays = anomalies.filter(a => a.predicted_delay_mins > 15).length;

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <Map
        initialViewState={{
          longitude: -122.35, 
          latitude: 37.75,
          zoom: 10
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {anomalies.map((anomaly) => {
          const isSevere = anomaly.predicted_delay_mins > 15;
          return (
            <Marker 
              key={anomaly.station_id} 
              longitude={anomaly.coordinates[0]} 
              latitude={anomaly.coordinates[1]} 
            >
              <div style={{
                width: '24px', height: '24px',
                backgroundColor: isSevere ? '#ff3333' : '#ffcc00',
                borderRadius: '50%', border: '2px solid white',
                boxShadow: isSevere ? '0 0 15px #ff3333' : 'none',
                cursor: 'pointer', transition: 'all 0.3s ease'
              }} title={`${anomaly.station_id}: ${anomaly.predicted_delay_mins.toFixed(1)} min delay`} />
            </Marker>
          );
        })}
      </Map>
      
      <div style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(25, 26, 26, 0.9)', color: 'white', padding: '20px', borderRadius: '8px', fontFamily: 'sans-serif' }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Transit Grid Status</h2>
        <p style={{ margin: '0 0 5px 0', color: '#aaa' }}>Active Stations Monitored: {anomalies.length}</p>
        <p style={{ margin: 0, color: severeDelays > 0 ? '#ff3333' : '#00cc66', fontWeight: 'bold' }}>
          Cascading Warnings (>15m): {severeDelays}
        </p>
      </div>
    </div>
  );
}

export default App;
