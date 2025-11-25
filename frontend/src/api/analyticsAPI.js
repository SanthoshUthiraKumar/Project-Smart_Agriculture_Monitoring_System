import http from "./httpClient";

export const startSimulation = () =>
  http.get("/analytics/start");

export const fetchFieldSimulation = () =>
  http.get("/analytics/fields");


// Fetch all fields (with 100 plant pixels each)
export const getAllFields = async () => {
  const res = await http.get("/analytics/fields");
  return res.data;
};

// Fetch a single field by ID (for FieldView page)
export const getFieldById = async (fieldId) => {
  const res = await http.get(`/analytics/fields/${fieldId}`);
  return res.data;
};

// Adjust field issues (irrigation, moisture, nitrogen, etc.)
export const adjustField = async (fieldId) => {
  const res = await http.post("/analytics/adjust", { fieldId });
  return res.data;
};

// Health stats route (optional, for dashboard)
export const getHealthStats = async () => {
  const res = await http.get("/analytics/health");
  return res.data;
};

// Disease stats route (optional)
export const getDiseaseStats = async () => {
  const res = await http.get("/analytics/disease");
  return res.data;
};