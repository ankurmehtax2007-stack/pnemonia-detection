import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Server, 
  RefreshCw, 
  History, 
  Info, 
  Sparkles, 
  Cpu,
  Menu,
  X,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function Navbar({ 
  apiOnline, 
  checkingApi, 
  onRefreshApi, 
  historyCount, 
  onOpenHistory, 
  onOpenAbout,
  isLiveApi,
  setIsLiveApi
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            
            {/* Animated Brand Emblem */}
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-teal-400 p-0.5 shadow-md shadow-sky-500/20 flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-sky-400 animate-pulse-subtle" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-teal-400 border-2 border-white"></span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-sky-950 to-teal-800 bg-clip-text text-transparent">
                  PneumoVision AI
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-100/80 text-sky-800 border border-sky-200">
                  <Sparkles className="w-3 h-3 mr-1 text-sky-600" /> v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Deep Learning Clinical Diagnostic Assistant
              </p>
            </div>

          </div>

          {/* Desktop Navigation Action Items */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Live API Mode Toggle */}
            <button
              onClick={() => setIsLiveApi(!isLiveApi)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isLiveApi 
                  ? 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100 shadow-2xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title="Toggle between Live FastAPI backend and Simulated Engine"
            >
              <Cpu className={`w-4 h-4 ${isLiveApi ? 'text-sky-600' : 'text-slate-400'}`} />
              <span>{isLiveApi ? 'Backend: FastAPI (Port 8000)' : 'Backend: Mock Engine'}</span>
            </button>

            {/* API Health Status Pill */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-full shadow-2xs">
              <div className="flex items-center space-x-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    apiOnline ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    apiOnline ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}></span>
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {checkingApi ? 'Ping...' : apiOnline ? 'API Online' : 'API Standby'}
                </span>
              </div>
              
              <button 
                onClick={onRefreshApi} 
                disabled={checkingApi}
                className="text-slate-400 hover:text-sky-600 transition-colors p-0.5 rounded-md hover:bg-slate-200/60"
                title="Ping FastAPI Server"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checkingApi ? 'animate-spin text-sky-500' : ''}`} />
              </button>
            </div>

            {/* About Model Modal Button */}
            <button
              onClick={onOpenAbout}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-sky-700 hover:bg-sky-50 border border-slate-200/90 transition-all shadow-2xs"
            >
              <Info className="w-4 h-4 text-sky-600" />
              <span>About Model</span>
            </button>

            {/* History Sidebar Drawer Button */}
            <button
              onClick={onOpenHistory}
              className="relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-950 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10 transition-all hover:-translate-y-0.5"
            >
              <History className="w-4 h-4 text-teal-400" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-teal-400 text-slate-950 font-extrabold rounded-full text-[10px]">
                  {historyCount}
                </span>
              )}
            </button>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenHistory}
              className="relative p-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              title="Open History"
            >
              <History className="w-4 h-4 text-teal-400" />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-teal-400 text-slate-950 font-black rounded-full text-[9px]">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-4 space-y-3 animate-fadeIn">
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${apiOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className="text-xs font-bold text-slate-800">
                {apiOnline ? 'FastAPI Backend Online' : 'FastAPI Standby'}
              </span>
            </div>
            <button onClick={onRefreshApi} className="p-1 text-slate-500 hover:text-sky-600">
              <RefreshCw className={`w-4 h-4 ${checkingApi ? 'animate-spin text-sky-500' : ''}`} />
            </button>
          </div>

          <button
            onClick={() => {
              setIsLiveApi(!isLiveApi);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
          >
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-sky-600" />
              <span>Backend Mode</span>
            </div>
            <span className="text-sky-700 font-extrabold">{isLiveApi ? 'FastAPI' : 'Mock'}</span>
          </button>

          <button
            onClick={() => {
              onOpenAbout();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center space-x-2 p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
          >
            <Info className="w-4 h-4 text-sky-600" />
            <span>About MobileNetV3 Model</span>
          </button>

        </div>
      )}
    </header>
  );
}
