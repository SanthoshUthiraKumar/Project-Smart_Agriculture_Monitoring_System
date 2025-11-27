import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { rainbowColor } from "../utils/color.js";

export default function Heatmap5Fields({ fields }) {
  const navigate = useNavigate();

  if (!fields || fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 border-4 border-hr-border border-t-hr-green rounded-full animate-spin"></div>
        <p className="mt-4 text-hr-text-secondary">Loading field data...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
      {fields.map((field) => {
        const plantsPreview = field.plants.slice(0, 100);
        
        return (
          <div 
            key={field.field_id} 
            className="bg-gradient-to-br from-white to-gray-50 dark:from-hr-card dark:to-hr-dark border-2 border-gray-200 dark:border-hr-border rounded-xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/30 hover:border-hr-green/50 relative overflow-hidden group"
          >
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-hr-green via-hr-blue to-hr-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-5 pb-4 border-b-2 border-gray-200 dark:border-hr-border gap-4">
              <div className="flex-1">
                <strong className="text-xl font-bold text-hr-green dark:text-hr-green font-inter tracking-tight block mb-2">
                  Field {field.field_id}
                </strong>
                <div className="inline-block px-3.5 py-1.5 bg-gradient-to-r from-hr-green/10 to-hr-blue/10 dark:from-hr-green/10 dark:to-hr-blue/10 rounded-2xl text-xs font-semibold text-gray-700 dark:text-hr-text-secondary uppercase tracking-wider border border-gray-300 dark:border-hr-border">
                  {field.crop_type}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <NotificationBell fieldId={field.field_id} />
                <button 
                  onClick={() => navigate(`/field/${field.field_id}`)}
                  className="bg-hr-green text-hr-darker font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:bg-hr-green-dark hover:shadow-lg hover:shadow-hr-green/30 hover:-translate-y-0.5 flex items-center gap-1.5 whitespace-nowrap text-sm"
                >
                  <span>Open</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>

            {/* Pixel Preview Grid */}
            <div className="grid grid-cols-10 gap-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-hr-dark dark:to-[#0a0d12] p-4 rounded-lg shadow-inner border border-gray-300 dark:border-hr-border mb-4">
              {plantsPreview.map((p, idx) => {
                const ndvi = p.ndvi ?? 0;
                const color = rainbowColor(ndvi, -1, 1);
                return (
                  <div 
                    key={idx} 
                    className="aspect-square rounded cursor-pointer transition-all duration-150 hover:scale-110 hover:z-10 hover:shadow-md border border-white/30"
                    style={{ backgroundColor: color }}
                    title={`NDVI: ${ndvi.toFixed(3)}`}
                  />
                );
              })}
            </div>

            {/* Field Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-100 dark:bg-hr-dark/40 rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-hr-dark hover:-translate-y-0.5 hover:shadow-md border border-gray-200 dark:border-hr-border">
                <span className="block text-xs font-bold text-gray-500 dark:text-hr-text-secondary uppercase tracking-wider mb-1.5">
                  NDVI
                </span>
                <span className="block text-xl font-bold text-hr-green font-code">
                  {field.avg_ndvi.toFixed(3)}
                </span>
              </div>
              <div className="text-center p-3 bg-gray-100 dark:bg-hr-dark/40 rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-hr-dark hover:-translate-y-0.5 hover:shadow-md border border-gray-200 dark:border-hr-border">
                <span className="block text-xs font-bold text-gray-500 dark:text-hr-text-secondary uppercase tracking-wider mb-1.5">
                  Health
                </span>
                <span className="block text-xl font-bold text-hr-green font-code">
                  {(field.avg_health * 100).toFixed(0)}%
                </span>
              </div>
              <div className="text-center p-3 bg-gray-100 dark:bg-hr-dark/40 rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-hr-dark hover:-translate-y-0.5 hover:shadow-md border border-gray-200 dark:border-hr-border">
                <span className="block text-xs font-bold text-gray-500 dark:text-hr-text-secondary uppercase tracking-wider mb-1.5">
                  Yield
                </span>
                <span className="block text-xl font-bold text-hr-green font-code">
                  {field.avg_yield.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}