import React from "react";
import "../../css/PixelFieldView.css";

export default function PlantDetailPopup({ plant, onClose }) {
  if (!plant) return null;

  const agro = plant.agro || {};
  return (
    <div className="plant-popup-backdrop" onClick={onClose}>
      <div className="plant-popup" onClick={(e) => e.stopPropagation()}>
        <div className="plant-popup-header">
          <h3>Plant {plant.plant_id} details</h3>
          <button className="btn-close-small" onClick={onClose}>X</button>
        </div>

        <div className="plant-grid">
          <div><strong>NDVI</strong></div><div>{(plant.ndvi ?? 0).toFixed(3)}</div>
          <div><strong>Yield</strong></div><div>{((plant.yield ?? 0)).toFixed(2)}</div>
          <div><strong>Health</strong></div><div>{((plant.health ?? 0)*100).toFixed(1)}%</div>
          <div><strong>Disease Prob</strong></div><div>{((plant.disease_prob ?? 0)).toFixed(3)}</div>
        </div>

        <h4>Agronomy</h4>
        <div className="agro-grid">
          <div>Soil_N: {agro.Soil_N ?? "—"}</div>
          <div>Soil_P: {agro.Soil_P ?? "—"}</div>
          <div>Soil_K: {agro.Soil_K ?? "—"}</div>
          <div>pH: {agro.Soil_pH ?? "—"}</div>
          <div>Irrigation: {agro.Irrigation ?? "—"}</div>
          <div>SoilMoisture: {agro.SoilMoisture ?? "—"}</div>
          <div>Temperature: {agro.Temperature ?? "—"}</div>
          <div>Fertilizer: {agro.Fertilizer ?? "—"}</div>
        </div>

        <div style={{marginTop:12, textAlign:"right"}}>
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
