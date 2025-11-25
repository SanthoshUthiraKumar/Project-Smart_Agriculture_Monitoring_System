import React from "react";

export default function FieldMetricsBar({ field }) {
  if (!field) return null;

  return (
    <div className="metrics-bar">
      <div>NDVI: {field.avg_ndvi.toFixed(3)}</div>
      <div>Health: {(field.avg_health * 100).toFixed(1)}%</div>
      <div>Yield: {field.avg_yield.toFixed(2)}</div>
    </div>
  );
}
