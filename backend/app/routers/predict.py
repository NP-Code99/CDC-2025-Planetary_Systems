from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal
from app.services.planetary_calculator import calculate_g_fraction, calculate_intensity_index

router = APIRouter()

class PredictRequest(BaseModel):
    g_fraction: float = Field(..., ge=0, le=1, description="Gravity fraction clamped to [0,1]")
    alpha: float = Field(default=1.0, ge=0.1, le=2.0, description="Alpha parameter for non-linear mapping")
    mapping: Literal["linear", "nonlinear"] = Field(default="linear", description="Mapping type")

class PredictResponse(BaseModel):
    intensity_index: int = Field(..., ge=1, le=10, description="Intensity index from 1-10")
    details: dict = Field(..., description="Calculation details")

@router.post("/predict", response_model=PredictResponse)
async def predict_intensity(request: PredictRequest):
    try:
        # Calculate intensity index based on mapping type
        if request.mapping == "linear":
            # Linear mapping: I = round(1 + 9 * (1 - g_fraction))
            intensity_index = round(1 + 9 * (1 - request.g_fraction))
        else:
            # Non-linear mapping: I = round(1 + 9 * (1 - g_fraction^alpha))
            intensity_index = round(1 + 9 * (1 - (request.g_fraction ** request.alpha)))
        
        # Ensure intensity index is within bounds [1, 10]
        intensity_index = max(1, min(10, intensity_index))
        
        return PredictResponse(
            intensity_index=intensity_index,
            details={
                "g_fraction": request.g_fraction,
                "alpha_used": request.alpha,
                "mapping": request.mapping,
                "formula": f"I = round(1 + 9 * (1 - g_fraction{'^' + str(request.alpha) if request.mapping == 'nonlinear' else ''}))"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating intensity index: {str(e)}")
