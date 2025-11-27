import React from "react";

export default function PlantDetailPopup({ plant, onClose }) {
  if (!plant) return null;

  const agro = plant.agro || {};
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-hr-card text-hr-text border border-hr-border p-7 rounded-xl w-[90%] max-w-[520px] shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-hr-border">
          <h3 className="text-2xl font-bold text-hr-green font-inter">
            Plant {plant.plant_id} Details
          </h3>
          <button 
            onClick={onClose}
            className="bg-transparent border-none text-hr-text-secondary cursor-pointer text-2xl w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-hr-green/10 hover:text-hr-green hover:rotate-90"
          >
            ×
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-hr-dark rounded-lg">
          <div className="flex justify-between py-2 text-sm">
            <strong className="text-hr-text-secondary font-semibold">NDVI</strong>
            <span className="text-hr-green font-code">{(plant.ndvi ?? 0).toFixed(3)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <strong className="text-hr-text-secondary font-semibold">Yield</strong>
            <span className="text-hr-green font-code">{((plant.yield ?? 0)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <strong className="text-hr-text-secondary font-semibold">Health</strong>
            <span className="text-hr-green font-code">{((plant.health ?? 0)*100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <strong className="text-hr-text-secondary font-semibold">Disease Prob</strong>
            <span className="text-hr-green font-code">{((plant.disease_prob ?? 0)).toFixed(3)}</span>
          </div>
        </div>

        {/* Agronomy Section */}
        <h4 className="text-lg font-semibold text-hr-green mb-3 pb-2 border-b border-hr-border">
          Agronomy Data
        </h4>
        <div className="grid grid-cols-2 gap-3 p-4 bg-hr-dark rounded-lg">
          <div className="px-3 py-2.5 bg-white dark:bg-hr-card rounded text-sm text-hr-text-secondary font-medium shadow-sm border border-hr-border">
            Soil_N: <span className="text-hr-text font-semibold">{agro.Soil_N ?? "—"}</span>
          </div>
          <div className="px-3 py-2.5 bg-white dark:bg-hr-card rounded text-sm text-hr-text-secondary font-medium shadow-sm border border-hr-border">
            Soil_P: <span className="text-hr-text font-semibold">{agro.Soil_P ?? "—"}</span>
          </div>
          <div className="px-3 py-2.5 bg-white dark:bg-hr-card rounded text-sm text-hr-text-secondary font-medium shadow-sm border border-hr-border">
            Soil_K: <span className="text-hr-text font-semibold">{agro.Soil_K ?? "—"}</span>
          </div>
          <div className="px-3 py-2.5 bg-white dark:bg-hr-card rounded text-sm text-hr-text-secondary font-medium shadow-sm border border-hr-border">
            pH: <span className="text-hr-text font-semibold">{agro.Soil_pH ?? "—"}</span>
          </div>
          <div className="px-3 py-2.5 bg-white dark:bg-hr-card rounded text-sm text-hr-text-secondary font-medium shadow-sm border border-hr-border">
            Irrigation: <span className="text-hr-text font-semibold">{agro.Irrigation ?? "—"}</span>
          </div>
          <div className="px-3 py-2.5 bg-white dark:bg-hr-card rounded text-sm text-hr-text-secondary font-medium shadow-sm border border-hr-border">
            Moisture: <span className="text-hr-text font-semibold">{agro.SoilMoisture ?? "—"}</span>
          </div>
          <div className="px-3 py-2.5 bg-white dark:bg-hr-card rounded text-sm text-hr-text-secondary font-medium shadow-sm border border-hr-border">
            Temp: <span className="text-hr-text font-semibold">{agro.Temperature ?? "—"}</span>
          </div>
          <div className="px-3 py-2.5 bg-white dark:bg-hr-card rounded text-sm text-hr-text-secondary font-medium shadow-sm border border-hr-border">
            Fertilizer: <span className="text-hr-text font-semibold">{agro.Fertilizer ?? "—"}</span>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-right">
          <button 
            onClick={onClose}
            className="bg-hr-green text-hr-darker font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 hover:bg-hr-green-dark hover:shadow-lg hover:shadow-hr-green/30 hover:-translate-y-0.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}