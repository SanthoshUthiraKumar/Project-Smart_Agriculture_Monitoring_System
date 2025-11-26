import React from "react";
import { useAlerts } from "../../context/AlertsContext";
import { adjustField, clearAlerts } from "../../api/analyticsAPI";

export default function LiveAlerts({ fieldId }) {
  const { alertsMap, clearFieldAlertsLocal } = useAlerts();
  const fieldAlerts = alertsMap[String(fieldId)] ? Object.entries(alertsMap[String(fieldId)]) : [];

  const handleFix = async () => {
    try {
      await adjustField(fieldId);
      await clearAlerts(fieldId);
      clearFieldAlertsLocal(fieldId);
    } catch (err) {
      console.error("Fix failed", err);
    }
  };

  if (fieldAlerts.length === 0) {
    return null; // Don't show anything if no alerts
  }

  return (
    <div className="alert-panel">
      <div style={{ 
        fontWeight: 600, 
        fontSize: '0.85rem', 
        color: 'var(--text-secondary)',
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '1.2rem' }}>🔔</span>
        Field {fieldId} Alerts
      </div>
      
      <div className="alert-list">
        {fieldAlerts.map(([type, data]) => {
          const emoji = data.level === 'critical' ? '🚨' : data.level === 'warning' ? '⚠️' : 'ℹ️';
          
          return (
            <div key={type} className={`alert-item ${data.level}`}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{emoji}</span>
              <div style={{ flex: 1 }}>
                <strong>{type}</strong>: {data.message}
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="btn-fix" onClick={handleFix}>
        ✨ Apply Automated Fix
      </button>
    </div>
  );
}