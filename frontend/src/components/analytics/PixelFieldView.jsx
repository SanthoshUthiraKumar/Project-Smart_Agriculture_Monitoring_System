import React, { useState } from "react";
import NotificationBell from "./NotificationBell";
import FieldAlerts from "./FieldAlerts";
import PlantDetailPopup from "./PlantDetailPopup";
import { rainbowColor } from "../utils/color";
import "../../css/PixelFieldView.css";
import { adjustField } from "../../api/analyticsAPI";
import { useAlerts } from "../../context/AlertsContext";

export default function PixelFieldView({ field, onAdjust, onClose }) {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [alertsOpen, setAlertsOpen] = useState(false);

  const { alertsMap } = useAlerts();

  const fieldAlerts = alertsMap[String(field?.field_id)] || {};
  const alertCount = Object.keys(fieldAlerts).length;

  if (!field) return <div className="pixel-empty">No field selected</div>;

  const onPixelClick = (plant) => setSelectedPlant(plant);

  const handleFix = async () => {
    if (onAdjust) await onAdjust(field.field_id);
    else await adjustField(field.field_id);
    setAlertsOpen(false);
  };

  const renderPixel = (plant, idx) => {
    const ndvi = plant.ndvi ?? 0;
    const color = rainbowColor(ndvi, -1, 1);
    return (
      <div
        key={idx}
        className="pixel-pxy"
        style={{ backgroundColor: color }}
        onClick={() => onPixelClick(plant)}
      />
    );
  };

  return (
    <div className="pixel-field-wrap">
      <div className="pixel-field-header">
        <div className="left">
          <h2>Field {field.field_id} — {field.crop_type}</h2>
          <div className="meta">
            <span>Avg NDVI: {field.avg_ndvi.toFixed(3)}</span>
            <span>Avg Health: {(field.avg_health*100).toFixed(1)}%</span>
            <span>Avg Yield: {field.avg_yield.toFixed(2)}</span>
          </div>
        </div>
        <div className="right">
          <NotificationBell fieldId={field.field_id} onClick={() => setAlertsOpen(!alertsOpen)} />
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>

      <div className="pixel-grid-10">
        {field.plants.map((p, i) => renderPixel(p, i))}
      </div>

      {alertsOpen && (
        <div className="alert-container">
          <FieldAlerts field={field} />
        </div>
      )}

      {selectedPlant && (
        <PlantDetailPopup plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
      )}
    </div>
  );
}
