import React, { useState } from "react";
import NotificationBell from "./NotificationBell";
import FieldAlerts from "./FieldAlerts";
import PlantDetailPopup from "./PlantDetailPopup";
import { rainbowColor } from "../utils/color";
import { adjustField } from "../../api/analyticsAPI";
import { useAlerts } from "../../context/AlertsContext";

export default function PixelFieldView({ field, onAdjust, onClose }) {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const { alertsMap } = useAlerts();

  if (!field) {
    return (
      <div className="text-hr-text-secondary text-center py-10">
        No field selected
      </div>
    );
  }

  const fieldAlerts = alertsMap[String(field?.field_id)] || {};
  const alertCount = Object.keys(fieldAlerts).length;

  const onPixelClick = (plant) => setSelectedPlant(plant);

  const handleFix = async () => {
    if (onAdjust) await onAdjust(field.field_id);
    else await adjustField(field.field_id);
    setAlertsOpen(false);
  };

  return (
    <div className="bg-hr-card text-hr-text border border-hr-border rounded-xl p-7 shadow-xl">
      {/* Field Header */}
      <div className="flex justify-between items-start mb-6 pb-5 border-b-2 border-hr-border">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-hr-green mb-3 font-inter tracking-tight">
            Field {field.field_id} — {field.crop_type}
          </h2>
          <div className="flex flex-wrap gap-6">
            <span className="text-sm text-hr-text-secondary font-semibold px-4 py-2 bg-hr-dark rounded-lg flex items-center gap-2">
              <span className="text-base">●</span>
              Avg NDVI: <span className="text-hr-green">{field.avg_ndvi.toFixed(3)}</span>
            </span>
            <span className="text-sm text-hr-text-secondary font-semibold px-4 py-2 bg-hr-dark rounded-lg flex items-center gap-2">
              <span className="text-base">●</span>
              Avg Health: <span className="text-hr-green">{(field.avg_health*100).toFixed(1)}%</span>
            </span>
            <span className="text-sm text-hr-text-secondary font-semibold px-4 py-2 bg-hr-dark rounded-lg flex items-center gap-2">
              <span className="text-base">●</span>
              Avg Yield: <span className="text-hr-green">{field.avg_yield.toFixed(2)}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <NotificationBell 
            fieldId={field.field_id} 
            onClick={() => setAlertsOpen(!alertsOpen)} 
          />
          <button 
            onClick={onClose}
            className="bg-transparent border border-hr-border text-hr-text-secondary px-5 py-2 rounded-lg font-semibold transition-all duration-200 hover:bg-hr-hover hover:border-hr-green hover:text-hr-green"
          >
            Close
          </button>
        </div>
      </div>

      {/* Pixel Grid - 10x10 */}
      <div className="grid grid-cols-10 gap-1 bg-hr-dark p-4 rounded-lg shadow-inner max-w-[600px] mx-auto mb-6 border border-hr-border">
        {field.plants.map((p, i) => {
          const ndvi = p.ndvi ?? 0;
          const color = rainbowColor(ndvi, -1, 1);
          return (
            <div
              key={i}
              className="aspect-square rounded cursor-pointer transition-all duration-150 hover:scale-125 hover:z-10 hover:shadow-lg border border-black/20"
              style={{ backgroundColor: color }}
              onClick={() => onPixelClick(p)}
            />
          );
        })}
      </div>

      {/* Alerts Container */}
      {alertsOpen && (
        <div className="mt-6 p-5 bg-hr-green/5 border border-hr-green/20 rounded-lg">
          <FieldAlerts field={field} />
        </div>
      )}

      {/* Plant Detail Popup */}
      {selectedPlant && (
        <PlantDetailPopup 
          plant={selectedPlant} 
          onClose={() => setSelectedPlant(null)} 
        />
      )}
    </div>
  );
}