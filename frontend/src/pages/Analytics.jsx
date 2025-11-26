import React, { useEffect, useState } from "react";
import { startSimulation, fetchFieldSimulation } from "../api/analyticsAPI";
import Heatmap5Fields from "../components/analytics/Heatmap5Fields";
import FieldAlerts from "../components/analytics/FieldAlerts";
import "../css/AnalyticsDashboard.css";
import FieldMetricsBar from "../components/analytics/FieldMetricsBar";
import LiveAlerts from "../components/analytics/LiveAlerts";

const Analytics = () => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    startSimulation(); // automatically start python simulation

    const interval = setInterval(() => {
      fetchFieldSimulation().then((res) => {
        if (res.data && res.data.fields) {
          setFields(res.data.fields);
        }
      });
    }, 60000); // 60 sec


    return () => clearInterval(interval);
  }, []);
  console.log("Rendering LiveAlerts for field:", fields)            
  return (
    <div className="dashboard-grid">
      
      {/* Top Row: Metrics Cards */}
      <div className="dashboard-section full-width">
        {/* Pass your data here */}
        <FieldMetricsBar /> 
      </div>

      {/* Middle Row: Main Map & Alerts */}
      <div className="dashboard-card main-map-card">
        <div className="card-header">
          <h3>Digital Twin Field Map</h3>
          <button className="btn-primary">Refresh Scan</button>
        </div>
        <Heatmap5Fields fields={fields}/>
      </div>

      <div className="dashboard-card alerts-card">
        <div className="card-header">
          <h3>Real-time Alerts</h3>
        </div>
          {
            fields?.map(field => (
              <LiveAlerts key={field.field_id} fieldId={field.field_id} />
            ))
          }
          {/* <LiveAlerts fieldId={fields.field_id} /> */}
        
      </div>


      {/* Bottom Row: AI Insights */}
      <div className="dashboard-card ai-card full-width">
        <div className="card-header">
          <h3>🤖 AI Recommendations</h3>
        </div>
        {/* <RecommendationForm /> goes here */}
      </div>

    </div>
  );
};

export default Analytics;