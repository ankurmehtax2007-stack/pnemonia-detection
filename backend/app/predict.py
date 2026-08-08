import torch
import torch.nn.functional as F

from app.model import model, DEVICE, CLASS_NAMES


def predict(image_tensor: torch.Tensor):
    """
    Performs model inference and returns
    prediction details.
    """

    # Move tensor to same device as model
    image_tensor = image_tensor.to(DEVICE)

    # Disable gradient computation
    with torch.no_grad():

        # Forward pass
        outputs = model(image_tensor)

        # Convert logits to probabilities
        probabilities = F.softmax(outputs, dim=1)

        # Highest probability
        confidence, predicted_index = torch.max(
            probabilities,
            dim=1
        )

    # Convert tensors to Python values
    predicted_index = predicted_index.item()

    confidence = confidence.item()

    # Probability dictionary
    probability_dict = {
        CLASS_NAMES[i]: round(
            probabilities[0][i].item(),
            4
        )
        for i in range(len(CLASS_NAMES))
    }

    return {
        "prediction": CLASS_NAMES[predicted_index],
        "confidence": round(confidence * 100, 2),
        "probabilities": probability_dict
    }