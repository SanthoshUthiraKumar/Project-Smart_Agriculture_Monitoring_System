import React, { useState, useMemo } from "react";
import NotificationBell from "./NotificationBell";
import FieldAlerts from "./FieldAlerts";
import PlantDetailPopup from "./PlantDetailPopup";
import { rainbowColor } from "../utils/color";
import "../../css/PixelFieldView.css";
import { adjustField } from "../../api/analyticsAPI";

/**
 * PixelFieldView
 * Props:
 *   - field: the full field object returned by /api/v1/analytics/fields (includes plants array)
 *   - onAdjust(fieldId) - function to call when user clicks "Fix" in alerts
 *   - onClose() - optional close handler for modal or page
 */
export default function PixelFieldView({ field, onAdjust, onClose }) {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [alertsOpen, setAlertsOpen] = useState(false);

  // compute alert count quickly
  const alertCount = useMemo(() => {
    if (!field) return 0;
    let count = 0;
    if (field.avg_ndvi < 0.3) count++;
    if (field.disease_risk > 0.4) count++;
    if (field.avg_health < 0.5) count++;
    if (field.avg_yield < 10) count++;

    // compute plant-level agro averages if available
    if (field.plants && field.plants.length) {
      const avgIrr = field.plants.reduce((s,p) => s + ((p.agro && p.agro.Irrigation) || 0), 0) / field.plants.length;
      const avgMoist = field.plants.reduce((s,p) => s + ((p.agro && p.agro.SoilMoisture) || 0), 0) / field.plants.length;
      const avgN = field.plants.reduce((s,p) => s + ((p.agro && p.agro.Soil_N) || 0), 0) / field.plants.length;
      if (avgIrr < 20) count++;
      if (avgMoist < 30) count++;
      if (avgN < 20) count++;
    }
    return count;
  }, [field]);

  if (!field) return <div className="pixel-empty">No field selected</div>;

  const onPixelClick = (plant) => setSelectedPlant(plant);

  const handleFix = async () => {
    if (onAdjust) {
      await onAdjust(field.field_id);
    } else {
      // fallback: call aggregator directly
      await adjustField(field.field_id);
    }
    setAlertsOpen(false);
  };

  // helper to render each plant pixel
  const renderPixel = (plant, idx) => {
    const ndvi = (plant.ndvi ?? 0);
    const color = rainbowColor(ndvi, -1, 1);
    const title = `Plant ${plant.plant_id} — NDVI ${ndvi.toFixed(3)} — Yield ${((plant.yield ?? 0)).toFixed(2)}`;
    return (
      <div
        key={idx}
        className="pixel-pxy"
        style={{ backgroundColor: color }}
        title={title}
        onClick={() => onPixelClick(plant)}
      />
    );
  };

  // dataset url for reference/download (local path; infra will transform)
  const DATASET_URL = "/mnt/data/enhanced_agri_dataset.csv";

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
          <a className="dataset-link" href={DATASET_URL} target="_blank" rel="noreferrer">Dataset</a>
          <NotificationBell count={alertCount} onClick={() => setAlertsOpen(!alertsOpen)} />
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>

      <div className="pixel-grid-10">
        {field.plants.map((p, i) => renderPixel(p, i))}
      </div>

      <div className="bottom-actions">
        <div className="left">
          <small>Click a pixel to inspect plant details.</small>
        </div>
        <div className="right">
          {alertsOpen && <FieldAlerts field={field} onFix={handleFix} />}
        </div>
      </div>

      {selectedPlant && (
        <PlantDetailPopup plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
      )}
    </div>
  );
}
