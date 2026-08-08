import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  Layers, 
  Columns, 
  Split, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  Download, 
  Info, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  ZoomIn, 
  RotateCcw 
} from 'lucide-react';

export default function GradCAMViewer({ originalUrl, gradcamUrl }) {
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' | 'slider' | 'overlay' | 'heat-only'
  const [overlayOpacity, setOverlayOpacity] = useState(0.75);
  const [sliderPos, setSliderPos] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  const containerRef = useRef(null);
  const displayGradcam = gradcamUrl || originalUrl;
  const displayOriginal = originalUrl || gradcamUrl;

  if (!displayGradcam) {
    return null;
  }

  // Handle Dragging for Interactive Image Split Slider
  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    if (!isDraggingSlider) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingSlider) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDraggingSlider(false);
  };

  useEffect(() => {
    if (isDraggingSlider) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingSlider]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = displayGradcam;
    a.download = `GradCAM_Heatmap_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto bg-slate-950 text-white p-6' : ''
    }`}>
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-200/80 gap-4 mb-6">
        
        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-sky-500/20">
            3
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className={`text-lg font-extrabold tracking-tight ${isFullscreen ? 'text-white' : 'text-slate-900'}`}>
                Grad-CAM Visual Explainability
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                <Sparkles className="w-3 h-3 mr-1 text-teal-600" /> Active Attention Map
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isFullscreen ? 'text-slate-400' : 'text-slate-500'}`}>
              Visualizes neural network saliency across the chest radiograph
            </p>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80">
            
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Compare Original and Grad-CAM side-by-side"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>

            <button
              onClick={() => setViewMode('slider')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'slider'
                  ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Interactive Drag Split Slider"
            >
              <Split className="w-3.5 h-3.5" />
              <span>Interactive Split</span>
            </button>

            <button
              onClick={() => setViewMode('overlay')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'overlay'
                  ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Opacity Adjustable Layered Overlay"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layer Blend</span>
            </button>

            <button
              onClick={() => setViewMode('heat-only')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'heat-only'
                  ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Heatmap Focus View"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Heatmap Only</span>
            </button>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 border border-slate-200 text-xs font-semibold transition-all"
              title="Download Grad-CAM Heatmap Image"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 border border-slate-800 text-xs font-semibold transition-all"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewer"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

        </div>

      </div>

      {/* Opacity Control Bar (Visible when Layer Blend mode is active) */}
      {viewMode === 'overlay' && (
        <div className="mb-5 p-3.5 rounded-xl bg-sky-50/80 border border-sky-100 flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-900">
            <Sliders className="w-4 h-4 text-sky-600" />
            <span>Heatmap Overlay Transparency:</span>
          </div>
          <div className="flex items-center space-x-3 flex-1 max-w-xs">
            <span className="text-[11px] font-semibold text-slate-500">0%</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <span className="text-xs font-bold text-sky-800 min-w-8">
              {Math.round(overlayOpacity * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Main Image Display Area */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl p-4">
        
        {/* Radiology HUD Header overlay */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-3 px-2 border-b border-slate-800/80 pb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PACS VIEWER • DICOM MATRIX [512×512]</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-[10px] text-slate-400">
            <span>MODALITY: CXR</span>
            <span>MODEL: MOBILENETV3</span>
            <span>METHOD: GRAD-CAM</span>
          </div>
        </div>

        {/* 1. SIDE-BY-SIDE MODE */}
        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Original X-Ray */}
            <div className="relative group rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
              <img
                src={displayOriginal}
                alt="Original Chest Radiograph"
                className="w-full h-auto max-h-[500px] object-contain"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 text-white text-[11px] font-bold tracking-wider uppercase border border-slate-700 backdrop-blur-xs">
                Original Radiograph
              </div>
            </div>

            {/* Grad-CAM Overlay */}
            <div className="relative group rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
              <img
                src={displayGradcam}
                alt="Grad-CAM Saliency Overlay"
                className="w-full h-auto max-h-[500px] object-contain"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-teal-950/90 text-teal-300 text-[11px] font-bold tracking-wider uppercase border border-teal-800/80 backdrop-blur-xs flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-teal-400" />
                <span>Grad-CAM Activation</span>
              </div>
            </div>

          </div>
        )}

        {/* 2. INTERACTIVE SPLIT SLIDER MODE */}
        {viewMode === 'slider' && (
          <div
            ref={containerRef}
            onMouseDown={() => setIsDraggingSlider(true)}
            onTouchStart={() => setIsDraggingSlider(true)}
            className="relative w-full max-h-[550px] aspect-square sm:aspect-4/3 max-w-4xl mx-auto rounded-xl overflow-hidden bg-black border border-slate-800 select-none cursor-ew-resize flex items-center justify-center"
          >
            {/* Background: Grad-CAM heatmap */}
            <img
              src={displayGradcam}
              alt="Grad-CAM heatmap"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* Foreground Clip: Original image */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={displayOriginal}
                alt="Original X-ray"
                className="absolute inset-0 w-full h-full object-contain max-w-none"
                style={{ width: containerRef.current ? containerRef.current.clientWidth : '100%' }}
              />
            </div>

            {/* Vertical Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-sky-400 shadow-lg shadow-sky-500/50 z-20 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-sky-400 text-sky-400 flex items-center justify-center shadow-xl">
                <Split className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 text-white text-[11px] font-bold border border-slate-700 pointer-events-none">
              Original X-Ray
            </div>
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-teal-950/90 text-teal-300 text-[11px] font-bold border border-teal-800 pointer-events-none">
              Grad-CAM Overlay
            </div>
          </div>
        )}

        {/* 3. LAYER BLEND MODE */}
        {viewMode === 'overlay' && (
          <div className="relative w-full max-h-[550px] aspect-square sm:aspect-4/3 max-w-4xl mx-auto rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
            {/* Base Original */}
            <img
              src={displayOriginal}
              alt="Original X-Ray"
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* Overlaid Grad-CAM with variable opacity */}
            <img
              src={displayGradcam}
              alt="Grad-CAM Heatmap"
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-150"
              style={{ opacity: overlayOpacity }}
            />

            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 text-slate-200 text-[11px] font-bold border border-slate-700 flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Blending: {Math.round(overlayOpacity * 100)}% Heatmap</span>
            </div>
          </div>
        )}

        {/* 4. HEATMAP ONLY MODE */}
        {viewMode === 'heat-only' && (
          <div className="relative w-full max-h-[550px] aspect-square sm:aspect-4/3 max-w-4xl mx-auto rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
            <img
              src={displayGradcam}
              alt="Pure Grad-CAM Visual Attention Map"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-teal-950/90 text-teal-300 text-[11px] font-bold border border-teal-800 flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>Pure Activation Map</span>
            </div>
          </div>
        )}

      </div>

      {/* Saliency Legend Bar */}
      <div className={`mt-6 p-4 rounded-xl border ${isFullscreen ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="flex items-center space-x-1.5">
            <Activity className="w-4 h-4 text-sky-600" />
            <span>Grad-CAM Neural Saliency Gradient</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            JET COLORMAP (0.0 → 1.0)
          </span>
        </div>

        {/* Gradient Bar */}
        <div className="h-3.5 w-full rounded-full bg-gradient-to-r from-blue-700 via-cyan-400 via-yellow-400 via-orange-500 to-red-600 mb-2.5 border border-slate-300/80 shadow-xs" />

        <div className="grid grid-cols-3 text-[11px] font-semibold text-slate-500">
          <div>
            <div className="text-slate-700 font-bold">Deep Blue (0.0 - 0.2)</div>
            <div className="text-[10px]">Minimal neural weight</div>
          </div>
          <div className="text-center">
            <div className="text-amber-700 font-bold">Yellow/Orange (0.4 - 0.7)</div>
            <div className="text-[10px]">Moderate feature saliency</div>
          </div>
          <div className="text-right">
            <div className="text-rose-700 font-bold">Deep Red (0.8 - 1.0)</div>
            <div className="text-[10px]">Peak diagnostic decision driver</div>
          </div>
        </div>
      </div>

      {/* Explanatory Clinical Footnote */}
      <div className="mt-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start space-x-2.5">
        <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Clinical Explainability Note:</strong> Grad-CAM computes gradients of the predicted class score with respect to feature maps in MobileNetV3's final convolutional layer. High saliency (red regions) highlights key image textures (e.g. lung consolidation or opacities) that guided the neural network's diagnosis.
        </div>
      </div>

    </div>
  );
}