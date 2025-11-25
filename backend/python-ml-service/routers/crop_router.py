# from fastapi import APIRouter
# from pydantic import BaseModel
# from utils.model_loader import load_crop_model

# router = APIRouter()

# class CropRequest(BaseModel):
#     agro: dict
#     dataset_url: str | None = None

# @router.post("/crop")
# def predict_crop(req: CropRequest):
#     model = load_crop_model()
#     X = [list(req.agro.values())]
#     pred = model.predict(X)[0]

#     return {
#         "recommended_crop": pred,
#         "dataset_used": req.dataset_url
#     }
