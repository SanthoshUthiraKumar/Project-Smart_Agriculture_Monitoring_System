import React from "react";
import LiveAlerts from "./LiveAlerts";

export default function FieldAlerts({ field }) {
  if (!field) return null;
  const fields = Object.values(field);
  return (
    <div className="alert-panel">
      {
        <LiveAlerts fieldId={f.field_id} />
      }
    </div>
  );
}