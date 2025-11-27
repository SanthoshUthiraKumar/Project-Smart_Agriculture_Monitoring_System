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
    return null;
  }

  return (
    <div className="bg-hr-card border border-hr-border rounded-lg p-4">
      <div className="font-semibold text-xs text-hr-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
        <span className="text-base">🔔</span>
        Field {fieldId} Alerts
      </div>
      
      <div className="flex flex-col gap-3">
        {fieldAlerts.map(([type, data]) => {
          const emoji = data.level === 'critical' ? '🚨' : data.level === 'warning' ? '⚠️' : 'ℹ️';
          const bgColor = data.level === 'critical' 
            ? 'bg-hr-red/10' 
            : data.level === 'warning' 
            ? 'bg-yellow-500/10' 
            : 'bg-hr-blue/10';
          const borderColor = data.level === 'critical' 
            ? 'border-hr-red' 
            : data.level === 'warning' 
            ? 'border-yellow-500' 
            : 'border-hr-blue';
          const textColor = data.level === 'critical' 
            ? 'text-hr-red' 
            : data.level === 'warning' 
            ? 'text-yellow-400' 
            : 'text-hr-blue';
          
          return (
            <div 
              key={type} 
              className={`${bgColor} border-l-4 ${borderColor} p-3.5 rounded-md flex items-start gap-2.5 transition-all duration-200 hover:translate-x-1 hover:shadow-md`}
            >
              <span className="text-lg flex-shrink-0">{emoji}</span>
              <div className="flex-1 text-sm">
                <strong className={`${textColor} font-semibold`}>{type}</strong>
                <span className="text-hr-text">: {data.message}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <button 
        onClick={handleFix}
        className="w-full mt-4 bg-hr-green text-hr-darker font-semibold py-2.5 px-4 rounded-md transition-all duration-200 hover:bg-hr-green-dark hover:shadow-lg hover:shadow-hr-green/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        <span>✨</span> Apply Automated Fix
      </button>
    </div>
  );
}