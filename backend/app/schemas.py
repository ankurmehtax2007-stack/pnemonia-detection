from typing import Dict

from pydantic import BaseModel

class PredictionResponse(BaseModel):
    """
    Response returned after prediction.
    """

    success: bool

    prediction: str

    confidence: float

    probabilities: Dict[str, float]

    gradcam: str


class ErrorResponse(BaseModel):
    """
    Error response.
    """

    success: bool

    error: str