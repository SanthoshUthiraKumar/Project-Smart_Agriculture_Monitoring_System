import React from "react";

export default function FieldAlerts({ field, onFix }) {
  if (!field) return null;

  const alerts = [];

  if (field.avg_ndvi < 0.3) alerts.push({key:"ndvi","text":"Low NDVI (<0.3)"});
  if (field.disease_risk > 0.4) alerts.push({key:"disease","text":"High disease risk (>40%)"});
  if (field.avg_health < 0.5) alerts.push({key:"health","text":"Low average health (<50%)"});
  if (field.avg_yield < 10) alerts.push({key:"yield","text":"Low average yield (<10)"}); 
  // irrigation / moisture / N: inspect plant agro averages
  // we expect the Python fields include `plants` -> agro values aggregated; we'll compute from plants
  const avgIrr = field.plants && field.plants.length ? field.plants.reduce((s,p)=> s + (p?.agro?.Irrigation || p?.agro?.Irrigation || 0),0)/field.plants.length : null;
  const avgMoist = field.plants && field.plants.length ? field.plants.reduce((s,p)=> s + (p?.agro?.SoilMoisture || 0),0)/field.plants.length : null;
  const avgN = field.plants && field.plants.length ? field.plants.reduce((s,p)=> s + (p?.agro?.Soil_N || 0),0)/field.plants.length : null;

  if (avgIrr !== null && avgIrr < 20) alerts.push({key:"irrigation","text":"Low irrigation"});
  if (avgMoist !== null && avgMoist < 30) alerts.push({key:"moisture","text":"Low soil moisture"});
  if (avgN !== null && avgN < 20) alerts.push({key:"nitrogen","text":"Low soil nitrogen (N)"});

  if (alerts.length === 0) return null;

  return (
    <div className="alert-panel">
      <div className="alert-list">
        {alerts.map(a => <div className="alert-item" key={a.key}>{a.text}</div>)}
      </div>
      <div style={{marginTop:8}}>
        <button className="btn-fix" onClick={() => onFix(field.field_id)}>Apply fix</button>
      </div>
    </div>
  );
}
