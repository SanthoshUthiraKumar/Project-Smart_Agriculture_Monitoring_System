import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import "../../css/Heatmap5Fields.css";
import { rainbowColor } from "../utils/color.js";

export default function Heatmap5Fields({ fields }) {
  const navigate = useNavigate();

  if (!fields || fields.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading field data...</p>
      </div>
    );
  }

  return (
    <div className="fields-preview">
      {fields.map((field) => {
        const plantsPreview = field.plants.slice(0, 100);
        
        return (
          <div key={field.field_id} className="field-card">
            <div className="field-header">
              <div>
                <strong>Field {field.field_id}</strong>
                <div className="crop-type">{field.crop_type}</div>
              </div>

              <div className="field-actions">
                <NotificationBell fieldId={field.field_id} />
                <button 
                  className="open-btn" 
                  onClick={() => navigate(`/field/${field.field_id}`)}
                >
                  Open
                </button>
              </div>
            </div>

            <div className="pixel-preview-grid">
              {plantsPreview.map((p, idx) => {
                const ndvi = p.ndvi ?? 0;
                const color = rainbowColor(ndvi, -1, 1);
                return (
                  <div 
                    key={idx} 
                    className="pixel-mini" 
                    style={{ backgroundColor: color }}
                    title={`NDVI: ${ndvi.toFixed(3)}`}
                  />
                );
              })}
            </div>

            <div className="field-stats">
              <div className="field-stat">
                <span className="field-stat-label">NDVI</span>
                <span className="field-stat-value">{field.avg_ndvi.toFixed(3)}</span>
              </div>
              <div className="field-stat">
                <span className="field-stat-label">Health</span>
                <span className="field-stat-value">{(field.avg_health * 100).toFixed(0)}%</span>
              </div>
              <div className="field-stat">
                <span className="field-stat-label">Yield</span>
                <span className="field-stat-value">{field.avg_yield.toFixed(1)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}