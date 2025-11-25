import api from "./httpClient";

export async function detectDisease(payload) {
  const res = await api.post("/disease/predict", payload);
  return res.data;
}
