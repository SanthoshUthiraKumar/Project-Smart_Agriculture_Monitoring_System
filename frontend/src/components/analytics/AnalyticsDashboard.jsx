import React, { useEffect, useState } from "react";
import { startSimulation, fetchFieldSimulation } from "../api/analyticsAPI";
import Heatmap5Fields from "../components/analytics/Heatmap5Fields";
import "../css/AnalyticsDashboard.css";

export default function Analytics() {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    startSimulation(); // automatically start python simulation

    const interval = setInterval(() => {
      fetchFieldSimulation().then((res) => {
        if (res.data && res.data.fields) {
          setFields(res.data.fields);
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analytics-page">
      <h1>Field Analytics</h1>

      <div className="analytics-section">
        <Heatmap5Fields fields={fields} />
      </div>
    </div>
  );
}
