import torch
import torch.nn as nn
from torchvision.models import mobilenet_v3_large

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

CLASS_NAMES = [
    "Normal",
    "Pneumonia"
]

MODEL_PATH = "models/best_finetuned_model.pth"

def load_model():
    """
    Creates the MobileNetV3 architecture,
    loads trained weights,
    and returns the model.
    """

    # Create MobileNetV3 Architecture
    model = mobilenet_v3_large(weights=None)

    # Replace classifier for binary classification
    in_features = model.classifier[-1].in_features

    model.classifier = nn.Sequential(
        nn.Linear(960, 512),
        nn.Hardswish(),
        nn.Dropout(0.2),
        nn.Linear(512, len(CLASS_NAMES))
    )


    # Load trained weights
    model.load_state_dict(
        torch.load(
            MODEL_PATH,
            map_location=DEVICE
        )
    )

    # Move model to CPU/GPU
    model.to(DEVICE)

    # Inference Mode
    model.eval()

    return model



model = load_model()