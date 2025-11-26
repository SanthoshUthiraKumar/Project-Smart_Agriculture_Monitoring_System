import React from "react";
import { useAlerts } from "../../context/AlertsContext";
import { adjustField, clearAlerts } from "../../api/analyticsAPI";

export default function LiveAlerts({ fieldId }) {
  const { alertsMap, clearFieldAlertsLocal } = useAlerts();
  const fieldAlerts = alertsMap[fieldId] ? Object.entries(alertsMap[fieldId]) : [];

  const handleFix = async () => {
    try {
      await adjustField(fieldId); // java aggregator triggers python adjust
      // clear on success (server also broadcasts clear; do local clear to be instant)
      await clearAlerts(fieldId);  // ensures server clears and broadcasts
      clearFieldAlertsLocal(fieldId);
    } catch (err) {
      console.error("fix failed", err);
    }
  };

  if (fieldAlerts.length === 0) return <div className="alert-item">No alerts for this field</div>;

  return (
    <div className="alert-list">
      {fieldAlerts.map(([type, data]) => (
        <div key={type} className={`alert-item ${data.level}`}>
          <strong>{type}</strong>: {data.message}
        </div>
      ))}

      <button className="btn-fix" onClick={handleFix} style={{ marginTop: "10px" }}>
        Apply Fix
      </button>
    </div>
  );
}
