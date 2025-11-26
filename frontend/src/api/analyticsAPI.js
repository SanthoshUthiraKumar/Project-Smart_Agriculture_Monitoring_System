import http from "./httpClient";

export const startSimulation = () =>
  http.get("/analytics/start");

export const fetchFieldSimulation = () =>
  http.get("/analytics/fields");

export const ALERTS_SSE_URL = "http://localhost:8080/api/v1/analytics/alerts/sse";

// fields
export const getAllFields = () => http.get("/analytics/fields").then(r => r.data);
export const getFieldById = (id) => http.get(`/analytics/fields/${id}`).then(r => r.data);

// adjust (calls Java aggregator which forwards to python)
export const adjustField = (fieldId) => http.post("/analytics/adjust", { fieldId }).then(r => r.data);

// clear alerts for a field (post-fix)
export const clearAlerts = (fieldId) => http.post("/alerts/clear", { fieldId }).then(r => r.data);
