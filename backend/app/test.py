# ============================================================
# test.py
# Test prediction + Grad-CAM
# ============================================================

import base64
from io import BytesIO
from pathlib import Path

from PIL import Image

from app.model import (
    model,
    DEVICE,
    CLASS_NAMES
)

from app.utils import preprocess_image

from app.predict import predict

from app.gradcam import generate_gradcam


# ============================================================
# Paths
# ============================================================

APP_DIR = Path(__file__).resolve().parent

IMAGE_PATH = (
    APP_DIR /
    "sample_xray.jpeg"
)

OUTPUT_PATH = (
    APP_DIR /
    "gradcam_overlay.jpg"
)


# ============================================================
# Main Test
# ============================================================

def main():

    print("=" * 60)
    print("CHEST X-RAY PNEUMONIA + GRAD-CAM TEST")
    print("=" * 60)

    print(
        f"Device: {DEVICE}"
    )


    # --------------------------------------------------------
    # Load image
    # --------------------------------------------------------

    if not IMAGE_PATH.exists():

        raise FileNotFoundError(
            f"Image not found: {IMAGE_PATH}"
        )

    image = (
        Image.open(IMAGE_PATH)
        .convert("RGB")
    )

    print(
        f"Original size: {image.size}"
    )


    # --------------------------------------------------------
    # Preprocess
    # --------------------------------------------------------

    image_tensor = (
        preprocess_image(image)
    )

    print(
        f"Tensor shape: {image_tensor.shape}"
    )


    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    result = predict(
        image_tensor
    )

    print("\nPrediction")
    print("-" * 60)

    print(
        f"Class      : {result['prediction']}"
    )

    print(
        f"Confidence : {result['confidence']}%"
    )

    print(
        f"Probabilities: {result['probabilities']}"
    )


    # --------------------------------------------------------
    # Determine target class
    # --------------------------------------------------------

    predicted_class = (
        CLASS_NAMES.index(
            result["prediction"]
        )
    )

    print(
        f"Target class index: {predicted_class}"
    )


    # --------------------------------------------------------
    # Generate Grad-CAM
    # --------------------------------------------------------

    print("\nGenerating Grad-CAM...")

    gradcam_uri = generate_gradcam(
        image_tensor,
        image,
        target_class=predicted_class
    )


    # --------------------------------------------------------
    # Decode Base64
    # --------------------------------------------------------

    header, encoded_data = (
        gradcam_uri.split(",", 1)
    )

    image_bytes = (
        base64.b64decode(
            encoded_data
        )
    )


    # --------------------------------------------------------
    # Save output
    # --------------------------------------------------------

    overlay_image = Image.open(
        BytesIO(image_bytes)
    )

    overlay_image.save(
        OUTPUT_PATH,
        quality=92
    )


    # --------------------------------------------------------
    # Success
    # --------------------------------------------------------

    print(
        f"\nGrad-CAM saved to:"
    )

    print(
        OUTPUT_PATH
    )

    print(
        f"Output size: {overlay_image.size}"
    )

    print("\n" + "=" * 60)
    print("SUCCESS")
    print("=" * 60)


if __name__ == "__main__":
    main()