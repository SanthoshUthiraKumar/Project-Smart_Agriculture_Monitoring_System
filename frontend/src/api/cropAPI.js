import api from "./httpClient";

export async function recommendCrop(payload) {
  const res = await api.post("/crop/predict", payload);
  return res.data;
}
