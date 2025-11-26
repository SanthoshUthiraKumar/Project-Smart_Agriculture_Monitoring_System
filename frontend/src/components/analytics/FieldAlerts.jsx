import React from "react";
import LiveAlerts from "./LiveAlerts";

export default function FieldAlerts({ field }) {
  if (!field) return null;
  return (
    <div className="alert-panel">
      {
        field.map(f => {
          <LiveAlerts fieldId={f.field_id} />
        })
      } 
    </div>
  );
}
