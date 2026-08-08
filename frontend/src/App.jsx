import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UploadZone from './components/UploadZone';
import PredictionResultCard from './components/PredictionResultCard';
import GradCAMViewer from './components/GradCAMViewer';
import HistorySidebar from './components/HistorySidebar';
import AboutModel from './components/AboutModel';
import Footer from './components/Footer';
import { checkApiHealth, predictXray, DEFAULT_API_URL } from './utils/mockApi';
import { Activity, Sparkles, RefreshCw, FileText, CheckCircle } from 'lucide-react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  // API Status & Backend Config
  const [apiOnline, setApiOnline] = useState(false);
  const [checkingApi, setCheckingApi] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(true);

  // History & Modals
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('pneumo_xray_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const resultsRef = useRef(null);
  const uploadRef = useRef(null);

  // Check API health on mount
  useEffect(() => {
    handleCheckApi();
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pneumo_xray_history', JSON.stringify(history));
    } catch (e) {
      console.warn("Could not save history to localStorage:", e);
    }
  }, [history]);

  const handleCheckApi = async () => {
    setCheckingApi(true);
    const health = await checkApiHealth(DEFAULT_API_URL);
    setApiOnline(health.online);
    setCheckingApi(false);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setSelectedSampleId(null);
    setPredictionResult(null);

    // Create object URL preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSampleSelect = (sample) => {
    setSelectedFile(null);
    setSelectedSampleId(sample.id);
    setPreviewUrl(sample.imageUrl);
    setPredictionResult(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setSelectedSampleId(null);
    setPreviewUrl(null);
    setPredictionResult(null);
  };

  const handleAnalyze = async () => {
    if (!previewUrl) return;

    setIsAnalyzing(true);
    setPredictionResult(null);

    try {
      const res = await predictXray({
        file: selectedFile,
        sampleId: selectedSampleId,
        isLiveApi: isLiveApi && apiOnline,
        baseUrl: DEFAULT_API_URL
      });

      setPredictionResult(res);

      // Add to history
      const historyItem = {
        ...res,
        imageUrl: previewUrl,
        id: Date.now()
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 19)]); // keep top 20

      // Trigger celebratory confetti if normal or completion effect
      if (res.prediction === 'Normal') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#38bdf8', '#34d399', '#a7f3d0']
        });
      }

      // Scroll smoothly to results card
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      alert(`Analysis error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setPreviewUrl(item.imageUrl || item.gradcamUrl);
    setPredictionResult(item);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDeleteHistoryItem = (itemId) => {
    setHistory(prev => prev.filter(item => item.id !== itemId));
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all past X-Ray scan history?")) {
      setHistory([]);
    }
  };

  const handleExportReport = (res) => {
    const reportText = `PNEUMOVISION AI - CHEST X-RAY DIAGNOSTIC REPORT
---------------------------------------------------
Date: ${new Date(res.timestamp).toLocaleString()}
Diagnosis: ${res.prediction.toUpperCase()}
Confidence: ${res.confidence}%
Class Probabilities:
  - Normal: ${res.probabilities.Normal}%
  - Pneumonia: ${res.probabilities.Pneumonia}%
Clinical Note: ${res.description || 'N/A'}
Inference Engine: ${res.source}
---------------------------------------------------
DISCLAIMER: Research prototype tool. Must be verified by a board-certified radiologist.`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `XRay_Analysis_Report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">

      {/* Top Navbar */}
      <Navbar
        apiOnline={apiOnline}
        checkingApi={checkingApi}
        onRefreshApi={handleCheckApi}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        isLiveApi={isLiveApi}
        setIsLiveApi={setIsLiveApi}
      />

      {/* Hero Banner Section */}
      <Hero onScrollToUpload={() => uploadRef.current?.scrollIntoView({ behavior: 'smooth' })} />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Step 1: Upload & Sample Picker */}
        <div ref={uploadRef}>
          <UploadZone
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            selectedSampleId={selectedSampleId}
            isAnalyzing={isAnalyzing}
            onFileSelect={handleFileSelect}
            onSampleSelect={handleSampleSelect}
            onClear={handleClear}
            onAnalyze={handleAnalyze}
          />
        </div>

        {/* Prediction Output & Grad-CAM Section */}
        {predictionResult && (
          <div ref={resultsRef} className="space-y-8 animate-fadeIn">

            {/* Step 2: Prediction Result Card */}
            <PredictionResultCard
              result={predictionResult}
              onExportReport={handleExportReport}
            />

            {/* Step 3: Grad-CAM Explainability Section */}
            <GradCAMViewer
              originalUrl={previewUrl}
              gradcamUrl={predictionResult.gradcamUrl}
            />

          </div>
        )}

      </main>

      {/* Modals & History Sidebar */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
        onSampleSelect={handleSampleSelect}
      />

      <AboutModel
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
