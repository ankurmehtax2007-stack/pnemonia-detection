import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Percent, Activity, FileText, Download, Share2, Sparkles } from 'lucide-react';

export default function PredictionResultCard({ result, onExportReport }) {
  if (!result) return null;

  const isPneumonia = result.prediction === 'Pneumonia';
  const confidence = result.confidence || 0;
  const probabilities = result.probabilities || { Normal: 50, Pneumonia: 50 };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 transition-all duration-300">
      
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h2 className="text-lg font-bold text-slate-900">Diagnostic Analysis Result</h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Primary Diagnosis Pill */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl border bg-slate-50/50">
          
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              AI Primary Diagnosis
            </span>

            {/* Diagnosis Main Badge */}
            <div className={`mt-3 p-4 rounded-xl border flex items-center space-x-3.5 ${
              isPneumonia 
                ? 'bg-rose-50 border-rose-200 text-rose-950' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                isPneumonia ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
              }`}>
                {isPneumonia ? (
                  <AlertTriangle className="w-7 h-7" />
                ) : (
                  <CheckCircle2 className="w-7 h-7" />
                )}
              </div>
              
              <div>
                <div className={`text-2xl font-black tracking-tight ${
                  isPneumonia ? 'text-rose-700' : 'text-emerald-700'
                }`}>
                  {result.prediction.toUpperCase()}
                </div>
                {result.subtype && (
                  <div className="text-xs font-semibold text-rose-800 mt-0.5">
                    {result.subtype}
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  Status: {isPneumonia ? 'Pneumonic Infiltration Detected' : 'Healthy Lung Parenchyma'}
                </div>
              </div>
            </div>

            {/* Confidence Score Display */}
            <div className="mt-5 p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Percent className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-semibold text-slate-700">Model Confidence</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {confidence}%
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500">
            Source: <strong className="text-slate-700">{result.source || 'MobileNetV3 Deep Learning'}</strong>
          </div>

        </div>

        {/* Right Probability Bars & Clinical Summary */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Class Probability Distribution
            </h3>

            {/* Probability Bars */}
            <div className="space-y-4">
              
              {/* Normal Class Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span>Normal (Healthy)</span>
                  </span>
                  <span>{probabilities.Normal}%</span>
                </div>
                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
                    style={{ width: `${probabilities.Normal}%` }}
                  ></div>
                </div>
              </div>

              {/* Pneumonia Class Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                    <span>Pneumonia (Pathological)</span>
                  </span>
                  <span>{probabilities.Pneumonia}%</span>
                </div>
                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${probabilities.Pneumonia}%` }}
                  ></div>
                </div>
              </div>

            </div>

            {/* Clinical Assessment Box */}
            <div className="mt-5 p-3.5 rounded-xl bg-sky-50/60 border border-sky-100">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-sky-900 mb-1">
                <FileText className="w-3.5 h-3.5 text-sky-600" />
                <span>Clinical Interpretation Note</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {result.description || (isPneumonia 
                  ? 'Focal or diffuse consolidation identified in pulmonary fields. Radiographic follow-up and clinical correlation advised.' 
                  : 'Clear bilateral lung fields without focal consolidation or pleural effusion.')}
              </p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex items-center space-x-3">
            <button
              onClick={() => onExportReport(result)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>Export Diagnostic Summary</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
