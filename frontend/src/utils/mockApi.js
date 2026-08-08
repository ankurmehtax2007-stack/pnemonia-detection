// ============================================================
// mockApi.js
// Real FastAPI integration for Chest X-Ray Detection
// ============================================================

export const DEFAULT_API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  
export const SAMPLE_XRAYS = [
  {
    id: 'sample-1',
    name: 'Normal Chest X-Ray (Sample 1)',
    type: 'Normal',
    description: 'Clear lung fields with no focal consolidation, pneumothorax, or pleural effusion.',
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-2',
    name: 'Pneumonia Case (Sample 2)',
    type: 'Pneumonia',
    description: 'Focal opacity and consolidation observed in lower lobe consistent with viral/bacterial pneumonia.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
  }
];

// ============================================================
// Check FastAPI Health
// ============================================================

export async function checkApiHealth(baseUrl = DEFAULT_API_URL) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${baseUrl}/health`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { online: false };
    }

    const data = await response.json();
    return {
      online: true,
      details: data
    };
  } catch (error) {
    console.error("FastAPI health check failed:", error);
    return { online: false };
  }
}

// ============================================================
// Predict X-ray using REAL FastAPI with Mock Fallback
// ============================================================

export async function predictXray({
  file,
  sampleId,
  isLiveApi = true,
  baseUrl = DEFAULT_API_URL
}) {
  let targetFile = file;

  // If no file provided but a preset sample ID was chosen, try fetching the image as a Blob
  if (!targetFile && sampleId) {
    const sample = SAMPLE_XRAYS.find((s) => s.id === sampleId);
    if (sample) {
      try {
        const resp = await fetch(sample.imageUrl);
        const blob = await resp.blob();
        targetFile = new File([blob], `${sample.id}.jpg`, { type: "image/jpeg" });
      } catch (err) {
        console.warn("Could not fetch sample image blob:", err);
      }
    }
  }

  if (!targetFile && !sampleId) {
    throw new Error("Please select a chest X-ray image.");
  }

  // ----------------------------------------------------------
  // Send image to FastAPI if Live API mode is enabled
  // ----------------------------------------------------------
  if (isLiveApi) {
    const formData = new FormData();
    if (targetFile) {
      formData.append("file", targetFile);
    }

    let response;
    try {
      response = await fetch(`${baseUrl}/predict`, {
        method: "POST",
        body: formData
      });
    } catch (error) {
      throw new Error(
        "Could not connect to FastAPI at " + baseUrl + ". Make sure backend server is running."
      );
    }

    if (!response.ok) {
      let errorMessage = `Server error ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        // Keep default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error("Prediction failed.");
    }

    if (!data.gradcam) {
      throw new Error("FastAPI did not return a Grad-CAM image.");
    }

    return {
      success: true,
      prediction: data.prediction,
      confidence: typeof data.confidence === "number" ? Number(data.confidence.toFixed(1)) : 0,
      probabilities: {
        Normal: Number((data.probabilities.Normal * 100).toFixed(1)),
        Pneumonia: Number((data.probabilities.Pneumonia * 100).toFixed(1))
      },
      gradcamUrl: data.gradcam,
      timestamp: new Date().toISOString(),
      source: "Live FastAPI (MobileNetV3 + Grad-CAM)"
    };
  }

  // ----------------------------------------------------------
  // Fallback Mock Prediction if Live API is explicitly off
  // ----------------------------------------------------------
  const isPneumonia = sampleId === 'sample-2' || Math.random() > 0.5;
  const pProb = isPneumonia ? 85.4 : 12.3;
  const nProb = Number((100 - pProb).toFixed(1));

  return {
    success: true,
    prediction: isPneumonia ? 'Pneumonia' : 'Normal',
    confidence: isPneumonia ? pProb : nProb,
    probabilities: {
      Normal: nProb,
      Pneumonia: pProb
    },
    gradcamUrl: null,
    timestamp: new Date().toISOString(),
    source: 'Mock Diagnostic Engine'
  };
}