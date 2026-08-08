# ============================================================
# gradcam.py
# Real Grad-CAM implementation for MobileNetV3
# ============================================================

import base64
import io

import cv2
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image

from app.model import model, DEVICE


class GradCAM:
    """
    Grad-CAM implementation for PyTorch CNN models.

    The heatmap is generated from the last convolutional
    layer and represents regions that contributed positively
    to the selected class prediction.
    """

    def __init__(self, model, target_layer=None):

        self.model = model

        # Automatically find the last Conv2d layer
        self.target_layer = (
            target_layer
            if target_layer is not None
            else self._find_target_layer()
        )

        self.activations = None
        self.gradients = None

        self.forward_handle = None
        self.gradient_handle = None

        self._register_hooks()

    # --------------------------------------------------------
    # Find last convolutional layer
    # --------------------------------------------------------

    def _find_target_layer(self):

        for layer in reversed(list(self.model.modules())):

            if isinstance(layer, torch.nn.Conv2d):
                return layer

        raise ValueError(
            "No Conv2d layer found in the model."
        )

    # --------------------------------------------------------
    # Register hooks
    # --------------------------------------------------------

    def _register_hooks(self):

        def forward_hook(module, input, output):

            self.activations = output

            # Register gradient hook on activation tensor
            if output.requires_grad:

                self.gradient_handle = (
                    output.register_hook(
                        self._save_gradient
                    )
                )

        self.forward_handle = (
            self.target_layer.register_forward_hook(
                forward_hook
            )
        )

    # --------------------------------------------------------
    # Save gradients
    # --------------------------------------------------------

    def _save_gradient(self, gradient):

        self.gradients = gradient

    # --------------------------------------------------------
    # Remove hooks
    # --------------------------------------------------------

    def remove_hooks(self):

        if self.forward_handle is not None:
            self.forward_handle.remove()
            self.forward_handle = None

        if self.gradient_handle is not None:
            self.gradient_handle.remove()
            self.gradient_handle = None

    # --------------------------------------------------------
    # Compute Grad-CAM heatmap
    # --------------------------------------------------------

    def compute_heatmap(
        self,
        image_tensor,
        target_class=None
    ):

        self.model.eval()

        # Make sure tensor is on same device as model
        tensor = (
            image_tensor
            .to(DEVICE)
            .clone()
            .detach()
            .requires_grad_(True)
        )

        # Clear old model gradients
        self.model.zero_grad(set_to_none=True)

        # Forward pass
        output = self.model(tensor)

        # If target class is not provided,
        # use the model's predicted class
        if target_class is None:

            target_class = torch.argmax(
                output,
                dim=1
            ).item()

        # Score of target class
        score = output[0, target_class]

        # Backward pass
        score.backward()

        # Make sure hooks captured required information
        if self.activations is None:
            raise RuntimeError(
                "Grad-CAM failed: activations were not captured."
            )

        if self.gradients is None:
            raise RuntimeError(
                "Grad-CAM failed: gradients were not captured."
            )

        # ----------------------------------------------------
        # Grad-CAM calculation
        # ----------------------------------------------------

        # Activations:
        # [1, C, H, W]
        activations = self.activations

        # Gradients:
        # [1, C, H, W]
        gradients = self.gradients

        # Global average pooling over H and W
        # Result:
        # [1, C, 1, 1]
        weights = gradients.mean(
            dim=(2, 3),
            keepdim=True
        )

        # Weighted combination of feature maps
        cam = (
            weights * activations
        ).sum(
            dim=1,
            keepdim=True
        )

        # Keep only positive contributions
        cam = F.relu(cam)

        # Convert to NumPy
        cam = cam.squeeze().detach().cpu().numpy()

        # ----------------------------------------------------
        # Normalize heatmap
        # ----------------------------------------------------

        cam_min = cam.min()
        cam_max = cam.max()

        if cam_max > cam_min:

            cam = (
                cam - cam_min
            ) / (
                cam_max - cam_min
            )

        else:

            cam = np.zeros_like(cam)

        # Safety
        cam = np.clip(
            cam,
            0.0,
            1.0
        )

        return cam

    # --------------------------------------------------------
    # Create overlay
    # --------------------------------------------------------

    def overlay_heatmap(
        self,
        heatmap,
        original_image,
        alpha=0.40
    ):
        """
        Creates:

        Original X-ray
                 +
        Grad-CAM heatmap

        and returns a Base64 JPEG data URI.
        """

        # Always use RGB
        original_image = (
            original_image
            .convert("RGB")
        )

        # Original dimensions
        width, height = original_image.size

        # Resize heatmap to original X-ray size
        heatmap_resized = cv2.resize(
            heatmap,
            (width, height),
            interpolation=cv2.INTER_LINEAR
        )

        # Convert 0-1 → 0-255
        heatmap_uint8 = np.uint8(
            heatmap_resized * 255
        )

        # Apply JET colormap
        heatmap_color = cv2.applyColorMap(
            heatmap_uint8,
            cv2.COLORMAP_JET
        )

        # OpenCV BGR → RGB
        heatmap_color = cv2.cvtColor(
            heatmap_color,
            cv2.COLOR_BGR2RGB
        )

        # Original image → NumPy
        original_np = np.array(
            original_image
        )

        # ----------------------------------------------------
        # Blend
        # ----------------------------------------------------

        overlay = cv2.addWeighted(
            original_np,
            1.0 - alpha,
            heatmap_color,
            alpha,
            0
        )

        # Convert back to PIL
        overlay_image = Image.fromarray(
            overlay
        )

        # ----------------------------------------------------
        # Encode as JPEG
        # ----------------------------------------------------

        buffer = io.BytesIO()

        overlay_image.save(
            buffer,
            format="JPEG",
            quality=92
        )

        encoded = base64.b64encode(
            buffer.getvalue()
        ).decode("utf-8")

        return (
            "data:image/jpeg;base64,"
            + encoded
        )


# ============================================================
# Public function used by FastAPI
# ============================================================

def generate_gradcam(
    image_tensor,
    original_image,
    target_class=None
):

    with torch.enable_grad():

        gradcam = GradCAM(model)

        try:

            heatmap = gradcam.compute_heatmap(
                image_tensor,
                target_class=target_class
            )

            result = gradcam.overlay_heatmap(
                heatmap,
                original_image,
                alpha=0.40
            )

            return result

        finally:

            gradcam.remove_hooks()