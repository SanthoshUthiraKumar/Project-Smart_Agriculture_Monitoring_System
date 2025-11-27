import React from "react";

export default function FieldMetricsBar({ field }) {
  if (!field) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-3 divide-x divide-gray-200">
        {/* NDVI Metric */}
        <div className="p-6 text-center transition-all duration-300 hover:bg-gray-50">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            NDVI
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {field.avg_ndvi.toFixed(3)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Vegetation Index
          </div>
        </div>

        {/* Health Metric */}
        <div className="p-6 text-center transition-all duration-300 hover:bg-gray-50">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Health
          </div>
          <div className="text-3xl font-bold text-green-600">
            {(field.avg_health * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Overall Status
          </div>
        </div>

        {/* Yield Metric */}
        <div className="p-6 text-center transition-all duration-300 hover:bg-gray-50">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Yield
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {field.avg_yield.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Expected Output
          </div>
        </div>
      </div>
    </div>
  );
}