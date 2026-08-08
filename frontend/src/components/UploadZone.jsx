import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, X, Sparkles, AlertCircle, Play, FileCode } from 'lucide-react';
import { SAMPLE_XRAYS } from '../utils/mockApi';

export default function UploadZone({ 
  selectedFile, 
  previewUrl, 
  selectedSampleId,
  isAnalyzing, 
  onFileSelect, 
  onSampleSelect, 
  onClear, 
  onAnalyze 
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    setErrorMsg(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid DICOM / JPEG / PNG image file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('File size exceeds 20MB maximum limit.');
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h2 className="text-lg font-bold text-slate-900">Upload Chest X-Ray</h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">Supports JPEG, PNG, DICOM (.dcm)</span>
      </div>

      {/* Preset Quick Select Samples
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Quick Test: Choose Sample X-Ray
          </span>
          <span className="text-xs text-sky-600 font-medium">1-Click Analysis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_XRAYS.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  onSampleSelect(sample);
                }}
                className={`flex items-center space-x-3 p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/80 shadow-xs ring-2 ring-sky-400/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-700 flex items-center justify-center">
                  <img 
                    src={sample.imageUrl} 
                    alt={sample.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 truncate">{sample.name}</div>
                  <div className={`text-[11px] font-semibold mt-0.5 ${
                    sample.type === 'Pneumonia' ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {sample.type}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div> */}

      {/* Drag & Drop Main Box */}
      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-sky-500 bg-sky-50/70 scale-[1.005]'
              : 'border-slate-300 bg-slate-50/40 hover:bg-slate-100/60 hover:border-sky-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-slate-800 mb-1">
            Drag & Drop your Chest X-Ray image here
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            or <span className="text-sky-600 font-semibold underline">browse files</span> from your computer
          </p>

          <div className="inline-flex items-center space-x-3 text-[11px] text-slate-400 font-medium bg-white px-3 py-1 rounded-md border border-slate-200">
            <span>Recommended resolution: 512×512+</span>
            <span>•</span>
            <span>Grayscale 8/16-bit</span>
          </div>
        </div>
      ) : (
        /* Image Preview State */
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative">
          <div className="flex flex-col md:flex-row items-center gap-4">
            
            {/* Image Thumbnail */}
            <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
              <img
                src={previewUrl}
                alt="Uploaded X-ray preview"
                className="w-full h-full object-contain"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono">
                PREVIEW
              </span>
            </div>

            {/* File Details */}
            <div className="flex-1 w-full">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 mb-1">
                    <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" /> Ready for Scan
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {selectedFile ? selectedFile.name : selectedSampleId ? SAMPLE_XRAYS.find(s => s.id === selectedSampleId)?.name : 'X-Ray Scan'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedFile 
                      ? `${(selectedFile.size / 1024).toFixed(1)} KB • ${selectedFile.type || 'Image'}`
                      : 'Preset Medical Sample Dataset'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClear}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Patient/Sample note if preset */}
              {selectedSampleId && (
                <div className="mt-3 p-2.5 rounded-lg bg-sky-50 border border-sky-100 text-xs text-sky-900">
                  <strong>Clinical Note:</strong> {SAMPLE_XRAYS.find(s => s.id === selectedSampleId)?.description}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!previewUrl || isAnalyzing}
          className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
            !previewUrl || isAnalyzing
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white shadow-sky-600/25 hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing X-Ray with MobileNetV3...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Analyze X-Ray</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
