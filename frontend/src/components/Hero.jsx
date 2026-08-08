import React from 'react';
import { Cpu, Eye, Zap, ShieldCheck, FileSearch, ArrowDown } from 'lucide-react';

export default function Hero({ onScrollToUpload }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50 pt-8 pb-12 border-b border-slate-200/60">
      
      {/* Decorative background glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Clinical Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-900 text-xs font-semibold shadow-xs mb-5">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span>Clinical Computer Vision & Visual Explainability</span>
        </div>

        {/* Hero Main Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight mb-4">
          Chest X-Ray Pneumonia Detection <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-teal-500 bg-clip-text text-transparent">
            using Deep Learning
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Upload chest radiograph images to instantly detect pulmonary opacities and pneumonic consolidation. Powered by fine-tuned <strong className="text-slate-800 font-semibold">MobileNetV3 Large</strong> transfer learning and <strong className="text-slate-800 font-semibold">Grad-CAM</strong> visual saliency maps for transparent AI decision explainability.
        </p>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8 text-left">
          
          <div className="glass-card p-3.5 rounded-xl flex items-center space-x-3 shadow-xs hover:border-sky-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Architecture</div>
              <div className="text-sm font-bold text-slate-900">MobileNetV3</div>
            </div>
          </div>

          <div className="glass-card p-3.5 rounded-xl flex items-center space-x-3 shadow-xs hover:border-teal-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Model ROC-AUC</div>
              <div className="text-sm font-bold text-slate-900">98.4% Accuracy</div>
            </div>
          </div>

          <div className="glass-card p-3.5 rounded-xl flex items-center space-x-3 shadow-xs hover:border-blue-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Visual AI</div>
              <div className="text-sm font-bold text-slate-900">Grad-CAM Heatmap</div>
            </div>
          </div>

          <div className="glass-card p-3.5 rounded-xl flex items-center space-x-3 shadow-xs hover:border-sky-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Inference Speed</div>
              <div className="text-sm font-bold text-slate-900">&lt; 200 ms / scan</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
