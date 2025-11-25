import React from "react";

export default function FieldYieldPopup({ field, onClose }) {
  const yields = field.plants.map(p => p.yield ?? 0);

  const avg = field.avg_yield.toFixed(2);
  const max = Math.max(...yields).toFixed(2);
  const min = Math.min(...yields).toFixed(2);
    
  return (
    <div className="popup">
      <div className="popup-box">
        <h2>Field {field.field_id} — Yield Details</h2>

        <p>Average Yield: {avg}</p>
        <p>Max Yield: {max}</p>
        <p>Min Yield: {min}</p>

        <div className="popup-grid">
          {yields.map((y, i) => (
            <div key={i}
              className="popup-pixel"
              style={{ backgroundColor: `rgb(${255-y*5},${y*5},80)` }}
            ></div>
          ))}
        </div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
