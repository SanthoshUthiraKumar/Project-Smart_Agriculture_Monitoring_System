# from fastapi import APIRouter
# from pydantic import BaseModel
# from utils.model_loader import load_disease_model
# from utils.spectral_utils import dict_to_spectral_array
# import numpy as np

# router = APIRouter()

# class DiseaseRequest(BaseModel):
#     spectral: dict
#     agro: dict | None = None

# @router.post("/disease")
# def predict_disease(req: DiseaseRequest):
#     model = load_disease_model()

#     spectral_array = dict_to_spectral_array(req.spectral)
#     pred = model.predict([spectral_array])[0]

#     return {
#         "disease_status": pred,
#         "health_score": float(np.random.uniform(0.7, 0.98))
#     }
