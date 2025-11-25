from fastapi import APIRouter, Body
from simulation.field_sim import FieldSimulation
from utils.model_loader import load_yield_model
import numpy as np
import asyncio
from typing import Optional

router = APIRouter()

sim = FieldSimulation()

model, scaler = load_yield_model()

def yield_predict_batch(spec_batch, agro_batch):
    agro_scaled = scaler.transform(agro_batch)
    preds = model.predict({
        "spectral_input": spec_batch,
        "agro_input": agro_scaled
    }, verbose=0)
    return preds.reshape(-1)

@router.get("/start")
async def start_sim():
    asyncio.create_task(sim.start(yield_predict_batch))
    return {"status": "simulation_running"}

@router.get("/fields")
async def get_fields():
    if not sim.fields:
        sim.create_fields()

    return {
        "status": "ok",
        "fields": [f.to_dict(include_plants=True) for f in sim.fields]
    }

@router.post("/adjust")
async def adjust_field(payload: dict = Body(...)):
    """
    payload: {"fieldId": <int>, "actions": Optional[dict]}
    If actions is not provided, simulator will choose fixes automatically.
    """
    field_id = payload.get("fieldId")
    if not field_id:
        return {"status": "error", "message": "fieldId required"}

    # find the field
    matched = None
    for f in sim.fields:
        if f.field_id == int(field_id):
            matched = f
            break

    if not matched:
        return {"status": "error", "message": "field not found"}

    # compute per-field averages (already computed on sim tick)
    avg_irrigation = float(np.mean([p.agro.get("Irrigation", 0.0) for p in matched.plants]))
    avg_moisture = float(np.mean([p.agro.get("SoilMoisture", 0.0) for p in matched.plants]))
    avg_temp = float(np.mean([p.agro.get("Temperature", 0.0) for p in matched.plants]))
    avg_n = float(np.mean([p.agro.get("Soil_N", 0.0) for p in matched.plants]))
    avg_yield = float(matched.avg_yield)
    avg_disease = float(matched.disease_risk)
    avg_ndvi = float(matched.avg_ndvi)

    # thresholds (same as frontend)
    LOW_IRR = 20.0
    LOW_MOIST = 30.0
    HIGH_TEMP = 35.0
    LOW_N = 20.0
    LOW_YIELD = 10.0
    HIGH_DISEASE = 0.4
    LOW_NDVI = 0.3

    # Decide actions automatically (Option D)
    # We'll apply conservative but effective changes:
    # - If low irrigation or low moisture -> increase irrigation + moisture
    # - If low nitrogen -> small fertilizer/nitrogen increment
    # - If high temperature -> increase irrigation a bit (cooling effect)
    # - If high disease risk -> apply pesticide (reduces disease_prob) and small fertilizer
    # - If low NDVI -> combined irrigation + N
    # Compose action summary to return

    actions = {
        "Irrigation_delta": 0.0,
        "SoilMoisture_delta": 0.0,
        "Soil_N_delta": 0.0,
        "Fertilizer_delta": 0.0,
        "disease_treatment": False
    }

    # irrigation / moisture fix
    if avg_irrigation < LOW_IRR or avg_moisture < LOW_MOIST:
        actions["Irrigation_delta"] += 25.0   # apply irrigation units
        actions["SoilMoisture_delta"] += 15.0

    # temperature too high -> add irrigation small bump
    if avg_temp > HIGH_TEMP:
        actions["Irrigation_delta"] += 10.0
        actions["SoilMoisture_delta"] += 5.0

    # low nitrogen
    if avg_n < LOW_N:
        actions["Soil_N_delta"] += 5.0
        actions["Fertilizer_delta"] += 10.0

    # low yield or low NDVI
    if avg_yield < LOW_YIELD or avg_ndvi < LOW_NDVI:
        actions["Irrigation_delta"] += 10.0
        actions["SoilMoisture_delta"] += 8.0
        actions["Soil_N_delta"] += 3.0

    # disease risk high
    if avg_disease > HIGH_DISEASE:
        actions["disease_treatment"] = True
        # disease treatment reduces disease_prob slightly across plants
        # also add small fertilizer to help recovery
        actions["Fertilizer_delta"] += 15.0

    # Apply actions to all plants in field
    for p in matched.plants:
        if actions["Irrigation_delta"]:
            p.agro["Irrigation"] = float(p.agro.get("Irrigation", 0.0) + actions["Irrigation_delta"])
        if actions["SoilMoisture_delta"]:
            p.agro["SoilMoisture"] = float(min(100.0, p.agro.get("SoilMoisture", 0.0) + actions["SoilMoisture_delta"]))
        if actions["Soil_N_delta"]:
            p.agro["Soil_N"] = float(p.agro.get("Soil_N", 0.0) + actions["Soil_N_delta"])
        if actions["Fertilizer_delta"]:
            p.agro["Fertilizer"] = float(p.agro.get("Fertilizer", 0.0) + actions["Fertilizer_delta"])
        if actions["disease_treatment"]:
            # reduce disease_prob by a fraction (simulate pesticide)
            p.disease_prob = float(max(0.0, p.disease_prob - 0.15))
            p.health = 1.0 - p.disease_prob

    matched.compute_aggregates()

    return {
        "status": "adjusted",
        "field_id": matched.field_id,
        "actions": actions
    }