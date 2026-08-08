# ============================================================
# main.py
# FastAPI backend for Chest X-Ray Pneumonia Detection
# ============================================================

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware

from PIL import UnidentifiedImageError

from app.model import (
    model,
    CLASS_NAMES
)

from app.utils import (
    read_image,
    preprocess_image
)

from app.predict import predict

from app.gradcam import generate_gradcam

from app.schemas import PredictionResponse


# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="Chest X-Ray Pneumonia Detection API",
    description=(
        "API for Chest X-Ray Pneumonia Detection "
        "using MobileNetV3 and Grad-CAM"
    ),
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# Root
# ============================================================

@app.get("/")
def root():

    return {
        "status": "running",
        "model_loaded": model is not None,
        "message": (
            "Chest X-Ray Pneumonia Detection API"
        )
    }


# ============================================================
# Health Check
# ============================================================

@app.get("/health")
def health():

    return {
        "success": True,
        "server": "online",
        "model_loaded": model is not None
    }


# ============================================================
# Prediction
# ============================================================

@app.post(
    "/predict",
    response_model=PredictionResponse
)
async def predict_image(
    file: UploadFile = File(...)
):

    try:

        # ----------------------------------------------------
        # Validate upload
        # ----------------------------------------------------

        if file is None:

            raise HTTPException(
                status_code=400,
                detail="No file uploaded."
            )

        # ----------------------------------------------------
        # Validate content type
        # ----------------------------------------------------

        if not file.content_type:

            raise HTTPException(
                status_code=400,
                detail="File type could not be determined."
            )

        if not file.content_type.startswith(
            "image/"
        ):

            raise HTTPException(
                status_code=400,
                detail="Please upload an image file."
            )

        # ----------------------------------------------------
        # Read original image
        # ----------------------------------------------------

        image = await read_image(file)

        # ----------------------------------------------------
        # Preprocess
        # ----------------------------------------------------

        image_tensor = preprocess_image(
            image
        )

        # ----------------------------------------------------
        # Prediction
        # ----------------------------------------------------

        result = predict(
            image_tensor
        )

        # ----------------------------------------------------
        # IMPORTANT:
        # Use the SAME class predicted by the model
        # for Grad-CAM.
        # ----------------------------------------------------

        predicted_label = result[
            "prediction"
        ]

        target_class = CLASS_NAMES.index(
            predicted_label
        )

        # ----------------------------------------------------
        # Grad-CAM
        # ----------------------------------------------------

        gradcam = generate_gradcam(
            image_tensor,
            image,
            target_class=target_class
        )

        # ----------------------------------------------------
        # Final response
        # ----------------------------------------------------

        return PredictionResponse(

            success=True,

            prediction=result[
                "prediction"
            ],

            confidence=result[
                "confidence"
            ],

            probabilities=result[
                "probabilities"
            ],

            gradcam=gradcam
        )

    # ========================================================
    # HTTP errors
    # ========================================================

    except HTTPException:

        raise

    # ========================================================
    # Invalid image
    # ========================================================

    except UnidentifiedImageError:

        raise HTTPException(
            status_code=400,
            detail=(
                "Uploaded file is not a valid "
                "image."
            )
        )

    # ========================================================
    # Model/file errors
    # ========================================================

    except FileNotFoundError:

        raise HTTPException(
            status_code=500,
            detail="Model file not found."
        )

    # ========================================================
    # PyTorch/Grad-CAM errors
    # ========================================================

    except RuntimeError as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Model/Grad-CAM Runtime Error: {str(e)}"
            )
        )

    # ========================================================
    # Other errors
    # ========================================================

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Unexpected Error: {str(e)}"
            )
        )