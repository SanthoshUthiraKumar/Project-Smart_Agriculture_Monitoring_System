import React, { useEffect, useState } from "react";
import { startSimulation, fetchFieldSimulation } from "../api/analyticsAPI";
import Heatmap5Fields from "../components/analytics/Heatmap5Fields";
import LiveAlerts from "../components/analytics/LiveAlerts";

const Analytics = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startSimulation();

    const fetchData = async () => {
      try {
        const res = await fetchFieldSimulation();
        if (res.data && res.data.fields) {
          setFields(res.data.fields);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching fields:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, []);

  // Calculate aggregate metrics
  const totalFields = fields.length;
  const avgNDVI = fields.length > 0 
    ? (fields.reduce((sum, f) => sum + f.avg_ndvi, 0) / fields.length).toFixed(3)
    : "0.000";
  const avgHealth = fields.length > 0
    ? (fields.reduce((sum, f) => sum + f.avg_health, 0) / fields.length * 100).toFixed(1)
    : "0.0";
  const avgYield = fields.length > 0
    ? (fields.reduce((sum, f) => sum + f.avg_yield, 0) / fields.length).toFixed(2)
    : "0.00";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-hr-text-secondary">
        <div className="w-12 h-12 border-4 border-hr-border border-t-hr-green rounded-full animate-spin"></div>
        <div className="mt-4 text-base">Initializing Digital Twin...</div>
      </div>
    );
  }

  return (
    <div className="text-hr-text">
      {/* Metrics Overview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Metric Card 1 */}
        <div className="bg-hr-card border border-hr-border rounded-lg p-5 transition-all duration-200 hover:border-hr-green hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-hr-green opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <h4 className="text-sm font-medium text-hr-text-secondary mb-3 flex items-center gap-2">
            <span>🌾</span> Active Fields
          </h4>
          <div className="text-3xl font-bold text-hr-green mb-2 font-code">
            {totalFields}
          </div>
          <div className="text-sm text-hr-green flex items-center gap-1">
            <span>↑</span> All monitored
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-hr-card border border-hr-border rounded-lg p-5 transition-all duration-200 hover:border-hr-green hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-hr-green opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <h4 className="text-sm font-medium text-hr-text-secondary mb-3 flex items-center gap-2">
            <span>📊</span> Avg NDVI
          </h4>
          <div className="text-3xl font-bold text-hr-green mb-2 font-code">
            {avgNDVI}
          </div>
          <div className="text-sm text-hr-green flex items-center gap-1">
            <span>↑</span> +0.042
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-hr-card border border-hr-border rounded-lg p-5 transition-all duration-200 hover:border-hr-green hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-hr-green opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <h4 className="text-sm font-medium text-hr-text-secondary mb-3 flex items-center gap-2">
            <span>💚</span> Crop Health
          </h4>
          <div className="text-3xl font-bold text-hr-green mb-2 font-code">
            {avgHealth}%
          </div>
          <div className="text-sm text-hr-green flex items-center gap-1">
            <span>↑</span> Optimal
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-hr-card border border-hr-border rounded-lg p-5 transition-all duration-200 hover:border-hr-green hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-hr-green opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <h4 className="text-sm font-medium text-hr-text-secondary mb-3 flex items-center gap-2">
            <span>📈</span> Avg Yield
          </h4>
          <div className="text-3xl font-bold text-hr-green mb-2 font-code">
            {avgYield}
          </div>
          <div className="text-sm text-hr-green flex items-center gap-1">
            <span>↑</span> +2.3%
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Map - Takes 2 columns */}
        <div className="lg:col-span-2 bg-hr-card border border-hr-border rounded-lg p-6 transition-all duration-200 hover:border-hr-green hover:shadow-xl hover:shadow-black/30 min-h-[500px]">
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-hr-border">
            <h3 className="text-lg font-semibold text-hr-text flex items-center gap-2">
              <span>🗺️</span> Digital Twin Field Map
            </h3>
            <button className="bg-hr-green text-hr-darker font-semibold px-5 py-2 rounded-md transition-all duration-200 hover:bg-hr-green-dark hover:shadow-lg hover:shadow-hr-green/30 hover:-translate-y-0.5 flex items-center gap-2">
              <span>🔄</span> Refresh Scan
            </button>
          </div>
          <Heatmap5Fields fields={fields} />
        </div>

        {/* Alerts Panel - Takes 1 column */}
        <div className="bg-hr-card border border-hr-border rounded-lg p-6 transition-all duration-200 hover:border-hr-green hover:shadow-xl hover:shadow-black/30 max-h-[600px] overflow-y-auto">
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-hr-border">
            <h3 className="text-lg font-semibold text-hr-text flex items-center gap-2">
              <span>🔔</span> Real-time Alerts
            </h3>
          </div>
          {fields.length > 0 ? (
            <div className="space-y-4">
              {fields.map(field => (
                <LiveAlerts key={field.field_id} fieldId={field.field_id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-hr-text-secondary">
              <div className="text-5xl mb-4 opacity-50">✓</div>
              <div className="text-base font-semibold text-hr-text mb-2">All Clear</div>
              <div className="text-sm">No alerts at this time</div>
            </div>
          )}
        </div>

        {/* AI Recommendations - Full Width */}
        <div className="lg:col-span-3 bg-gradient-to-br from-hr-card to-[#1a1f26] border border-hr-border rounded-lg p-6 transition-all duration-200 hover:border-hr-green hover:shadow-xl hover:shadow-black/30">
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-hr-border">
            <h3 className="text-lg font-semibold text-hr-text flex items-center gap-2">
              <span>🤖</span> AI-Powered Recommendations
            </h3>
            <button className="bg-transparent border border-hr-green text-hr-green px-4 py-2 rounded-md font-semibold transition-all duration-200 hover:bg-hr-green/10">
              View All
            </button>
          </div>
          <div className="bg-hr-green/10 border border-hr-green/20 border-l-4 border-l-hr-green rounded-lg p-4 flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div className="flex-1 text-hr-text text-sm leading-relaxed">
              <strong className="text-hr-green font-semibold">Smart Insight:</strong> Weather forecast shows optimal conditions for irrigation in the next 48 hours. Consider scheduling irrigation for Fields 2 and 4.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;