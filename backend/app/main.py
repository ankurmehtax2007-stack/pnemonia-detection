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


app = FastAPI(
    title="Chest X-Ray Pneumonia Detection API",
    description=(
        "API for Chest X-Ray Pneumonia Detection "
        "using MobileNetV3 and Grad-CAM"
    ),
    version="1.0.0"
)



app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)



@app.get("/")
def root():

    return {
        "status": "running",
        "model_loaded": model is not None,
        "message": (
            "Chest X-Ray Pneumonia Detection API"
        )
    }



@app.get("/health")
def health():

    return {
        "success": True,
        "server": "online",
        "model_loaded": model is not None
    }



@app.post(
    "/predict",
    response_model=PredictionResponse
)
async def predict_image(
    file: UploadFile = File(...)
):

    try:

        
        if file is None:

            raise HTTPException(
                status_code=400,
                detail="No file uploaded."
            )

        
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

        
        image = await read_image(file)

        
        image_tensor = preprocess_image(
            image
        )

        
        result = predict(
            image_tensor
        )

        
        predicted_label = result[
            "prediction"
        ]

        target_class = CLASS_NAMES.index(
            predicted_label
        )

        
        gradcam = generate_gradcam(
            image_tensor,
            image,
            target_class=target_class
        )

        
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

    
    except HTTPException:

        raise

    
    except UnidentifiedImageError:

        raise HTTPException(
            status_code=400,
            detail=(
                "Uploaded file is not a valid "
                "image."
            )
        )

    
    except FileNotFoundError:

        raise HTTPException(
            status_code=500,
            detail="Model file not found."
        )

   
    except RuntimeError as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Model/Grad-CAM Runtime Error: {str(e)}"
            )
        )

    
    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Unexpected Error: {str(e)}"
            )
        )