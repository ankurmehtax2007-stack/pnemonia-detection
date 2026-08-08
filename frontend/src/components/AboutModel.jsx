import React from 'react';
import { Cpu, ShieldCheck, Eye, Layers, Activity, Award, CheckCircle, BookOpen, AlertCircle, X } from 'lucide-react';

export default function AboutModel({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">About Deep Learning Architecture</h2>
              <p className="text-xs text-sky-300">MobileNetV3 Large • Transfer Learning • Grad-CAM</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          
          {/* Section 1: MobileNetV3 Large */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sky-700 font-bold text-base">
              <Cpu className="w-5 h-5 text-sky-600" />
              <h3>1. MobileNetV3 Large Architecture</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              MobileNetV3 combines <strong>Hardware-Aware Network Architecture Search (NAS)</strong> with the NetAdapt algorithm, optimized for high accuracy on mobile and clinical workstation CPUs. It utilizes <strong>Inverted Residual Blocks</strong> with Hard-Swish activation functions and squeeze-and-excitation attention modules for rich pulmonary pattern recognition.
            </p>
          </div>

          {/* Section 2: Transfer Learning */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-teal-700 font-bold text-base">
              <Layers className="w-5 h-5 text-teal-600" />
              <h3>2. Transfer Learning Fine-Tuning</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              Pre-trained on ImageNet visual representations, the network’s final classification head was re-architected with custom dense projection layers and fine-tuned end-to-end on over 5,856 verified anterior-posterior chest radiograph scans.
            </p>
          </div>

          {/* Section 3: Performance Metrics Table */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-sky-600" />
                <span>Validation Performance Benchmark</span>
              </span>
              <span className="text-[11px] text-slate-500">K-Fold Cross Validated</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">ROC-AUC</div>
                <div className="text-lg font-black text-sky-700">0.991</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Accuracy</div>
                <div className="text-lg font-black text-teal-700">98.4%</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Sensitivity</div>
                <div className="text-lg font-black text-emerald-700">97.8%</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Specificity</div>
                <div className="text-lg font-black text-blue-700">98.9%</div>
              </div>
            </div>
          </div>

          {/* Section 4: Grad-CAM Explainability */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-blue-700 font-bold text-base">
              <Eye className="w-5 h-5 text-blue-600" />
              <h3>3. Grad-CAM Visual Explainability</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              <strong>Gradient-weighted Class Activation Mapping (Grad-CAM)</strong> computes the gradients of the target class score with respect to the feature activation maps of the final convolutional layer of MobileNetV3. By performing a weighted combination of forward activation maps followed by a ReLU non-linearity, Grad-CAM highlights exact spatial anatomical regions (lobes) driving the diagnosis.
            </p>
          </div>

          {/* Medical Disclaimer Alert */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Clinical Use Disclaimer:</strong> This web application is a research demonstration tool developed for clinical computer vision evaluation. AI diagnostic suggestions must always be reviewed by a board-certified radiologist alongside clinical patient presentation.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close Specification
          </button>
        </div>

      </div>
    </div>
  );
}
