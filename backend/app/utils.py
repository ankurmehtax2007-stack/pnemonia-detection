from io import BytesIO

import torch
from PIL import Image
from fastapi import UploadFile
from torchvision import transforms


image_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

async def read_image(file: UploadFile) -> Image.Image:
    """
    Reads the uploaded image
    and converts it into RGB format.
    """

    image_bytes = await file.read()

    image = Image.open(
        BytesIO(image_bytes)
    ).convert("RGB")

    return image


def preprocess_image(image: Image.Image) -> torch.Tensor:
    """
    Converts a PIL image into a tensor
    ready for model inference.
    """

    image_tensor = image_transform(image)

    # Add batch dimension

    image_tensor = image_tensor.unsqueeze(0)

    return image_tensor