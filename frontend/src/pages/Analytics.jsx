import React, { useEffect, useState } from "react";
import { startSimulation, fetchFieldSimulation } from "../api/analyticsAPI";
import Heatmap5Fields from "../components/analytics/Heatmap5Fields";
import LiveAlerts from "../components/analytics/LiveAlerts";
import "../css/AnalyticsDashboard.css";

const Analytics = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startSimulation();

    const fetchData = async () => {
      try {
        const res = await fetchFieldSimulation();
        if (res.data && res.data.fields) {
          setFields(res.data.fields);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching fields:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, []);

  // Calculate aggregate metrics
  const totalFields = fields.length;
  const avgNDVI = fields.length > 0 
    ? (fields.reduce((sum, f) => sum + f.avg_ndvi, 0) / fields.length).toFixed(3)
    : "0.000";
  const avgHealth = fields.length > 0
    ? (fields.reduce((sum, f) => sum + f.avg_health, 0) / fields.length * 100).toFixed(1)
    : "0.0";
  const avgYield = fields.length > 0
    ? (fields.reduce((sum, f) => sum + f.avg_yield, 0) / fields.length).toFixed(2)
    : "0.00";

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Initializing Digital Twin...</div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {/* Metrics Overview Bar */}
      <div className="metrics-bar">
        <div className="metric-box">
          <h4>🌾 Active Fields</h4>
          <div className="value">{totalFields}</div>
          <div className="trend">↑ All monitored</div>
        </div>
        
        <div className="metric-box">
          <h4>📊 Avg NDVI</h4>
          <div className="value">{avgNDVI}</div>
          <div className="trend">↑ +0.042</div>
        </div>
        
        <div className="metric-box">
          <h4>💚 Crop Health</h4>
          <div className="value">{avgHealth}%</div>
          <div className="trend">↑ Optimal</div>
        </div>
        
        <div className="metric-box">
          <h4>📈 Avg Yield</h4>
          <div className="value">{avgYield}</div>
          <div className="trend">↑ +2.3%</div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Field Map */}
        <div className="dashboard-card main-map-card">
          <div className="card-header">
            <h3>🗺️ Digital Twin Field Map</h3>
            <button className="btn-primary">🔄 Refresh Scan</button>
          </div>
          <Heatmap5Fields fields={fields} />
        </div>

        {/* Alerts Panel */}
        <div className="dashboard-card alerts-card">
          <div className="card-header">
            <h3>🔔 Real-time Alerts</h3>
          </div>
          {fields.length > 0 ? (
            fields.map(field => (
              <LiveAlerts key={field.field_id} fieldId={field.field_id} />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">✓</div>
              <div className="empty-state-title">All Clear</div>
              <div className="empty-state-description">No alerts at this time</div>
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="dashboard-card ai-card">
          <div className="card-header">
            <h3>🤖 AI-Powered Recommendations</h3>
            <button className="btn-secondary">View All</button>
          </div>
          <div className="info-banner">
            <span className="info-banner-icon">💡</span>
            <div className="info-banner-text">
              <strong>Smart Insight:</strong> Weather forecast shows optimal conditions for irrigation in the next 48 hours. Consider scheduling irrigation for Fields 2 and 4.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;