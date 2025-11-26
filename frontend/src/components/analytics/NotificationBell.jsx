import React from "react";
import { useAlerts } from "../../context/AlertsContext";

export default function NotificationBell({ fieldId, onClick }) {
  const { alertsMap } = useAlerts();
  const count = alertsMap[String(fieldId)] ? Object.keys(alertsMap[String(fieldId)]).length : 0;

  return (
    <div className="notif-bell" onClick={onClick}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 22c1.104 0 2-.895 ..." />
      </svg>
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  );
}
