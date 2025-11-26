import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import "../../css/Heatmap5Fields.css";
import { rainbowColor } from "../utils/color.js";

export default function Heatmap5Fields({ fields }) {
  const navigate = useNavigate();

  if (!fields || fields.length === 0) return <p className="loading-text">Loading...</p>;

  return (
    <div className="fields-preview">
      {fields.map((field) => {
        const count = (field.avg_ndvi < 0.3 ? 1 : 0) + (field.disease_risk > 0.4 ? 1 : 0);
        const plantsPreview = field.plants.slice(0,100); // ensure 100
        return (
          <div key={field.field_id} className="field-card">
            <div className="field-header">
              <div>
                <strong>Field {field.field_id}</strong>
                <div className="crop-type">{field.crop_type}</div>
              </div>

              <div className="header-actions">
                <NotificationBell fieldId={field.field_id} onClick={() => {/* open small popup if you want */}} />
                <button className="btn-view" onClick={() => navigate(`/field/${field.field_id}`)}>Open</button>
              </div>
            </div>

            <div className="pixel-preview-grid">
              {plantsPreview.map((p, idx) => {
                const ndvi = p.ndvi ?? 0;
                const color = rainbowColor(ndvi, -1, 1);
                return <div key={idx} className="pixel-mini" style={{ backgroundColor: color }} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}