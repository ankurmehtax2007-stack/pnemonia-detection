import React, { useState } from 'react';

import {
  History,
  X,
  Search,
  Trash2,
  ArrowRight,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ShieldCheck,
  BarChart3,
  Clock3,
  FileImage,
} from 'lucide-react';


export default function HistorySidebar({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onClearHistory,
}) {

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');


  // ============================================================
  // Filter History
  // ============================================================

  const filteredHistory = history.filter((item) => {

    const term = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !term ||
      item.prediction?.toLowerCase().includes(term) ||
      item.subtype?.toLowerCase().includes(term) ||
      item.source?.toLowerCase().includes(term) ||
      new Date(item.timestamp)
        .toLocaleString()
        .toLowerCase()
        .includes(term);

    if (!matchesSearch) {
      return false;
    }

    if (filterCategory === 'PNEUMONIA') {
      return item.prediction === 'Pneumonia';
    }

    if (filterCategory === 'NORMAL') {
      return item.prediction === 'Normal';
    }

    return true;
  });


  // ============================================================
  // Statistics
  // ============================================================

  const totalScans = history.length;

  const pneumoniaCount = history.filter(
    (item) => item.prediction === 'Pneumonia'
  ).length;

  const normalCount = history.filter(
    (item) => item.prediction === 'Normal'
  ).length;

  const avgConfidence =
    totalScans > 0
      ? (
          history.reduce(
            (acc, item) =>
              acc + (item.confidence || 0),
            0
          ) / totalScans
        ).toFixed(1)
      : '0.0';


  // ============================================================
  // Latest Scan
  // ============================================================

  const latestScan =
    history.length > 0
      ? [...history].sort(
          (a, b) =>
            new Date(b.timestamp) -
            new Date(a.timestamp)
        )[0]
      : null;


  if (!isOpen) {
    return null;
  }


  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">

      {/* ======================================================
          MAIN ARCHIVE PANEL
      ====================================================== */}

      <div className="absolute inset-2 sm:inset-4 lg:inset-6 bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50 flex flex-col">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="px-5 sm:px-7 py-4 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between shrink-0">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 p-[1px] shadow-lg">

              <div className="w-full h-full rounded-[11px] bg-slate-950 flex items-center justify-center">

                <History className="w-5 h-5 text-teal-400" />

              </div>

            </div>


            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-base sm:text-lg font-bold">
                  Diagnostic History
                </h2>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  {totalScans} SCANS
                </span>

              </div>

              <p className="text-[11px] sm:text-xs text-slate-400">
                Chest X-ray analysis & Grad-CAM archive
              </p>

            </div>

          </div>


          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Close history"
          >

            <X className="w-5 h-5" />

          </button>

        </div>


        {/* ====================================================
            MAIN CONTENT
        ==================================================== */}

        <div className="flex-1 min-h-0 flex flex-col lg:flex-row">


          {/* ==================================================
              LEFT SIDE — HISTORY
          ================================================== */}

          <div className="flex-1 min-w-0 flex flex-col bg-slate-50">


            {/* -----------------------------------------------
                Search
            ------------------------------------------------ */}

            <div className="p-4 sm:p-5 border-b border-slate-200 bg-white">

              <div className="flex flex-col sm:flex-row gap-3">

                {/* Search */}

                <div className="relative flex-1">

                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="text"
                    placeholder="Search diagnosis, date, or source..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-sm text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 transition-all"
                  />

                </div>


                {/* Clear */}

                {history.length > 0 && (

                  <button
                    onClick={onClearHistory}
                    className="px-4 py-2.5 rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 transition-all text-xs font-bold flex items-center justify-center gap-2"
                  >

                    <Trash2 className="w-4 h-4" />

                    Clear All

                  </button>

                )}

              </div>

            </div>


            {/* -----------------------------------------------
                History Header
            ------------------------------------------------ */}

            <div className="px-4 sm:px-5 py-3 flex items-center justify-between">

              <div>

                <h3 className="text-sm font-bold text-slate-900">
                  Scan Records
                </h3>

                <p className="text-[11px] text-slate-500 mt-0.5">
                  {filteredHistory.length} record
                  {filteredHistory.length !== 1 ? 's' : ''}
                  {' '}shown
                </p>

              </div>


              <div className="flex items-center gap-2 text-[11px] text-slate-400">

                <Clock3 className="w-3.5 h-3.5" />

                Most recent first

              </div>

            </div>


            {/* -----------------------------------------------
                History List
            ------------------------------------------------ */}

            <div className="flex-1 overflow-y-auto px-4 sm:px-5 pb-5">


              {filteredHistory.length === 0 ? (

                /* ============================================
                   EMPTY STATE
                ============================================ */

                <div className="h-full min-h-[300px] flex items-center justify-center">

                  <div className="max-w-md text-center px-6">

                    <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-5">

                      {history.length === 0 ? (
                        <FileImage className="w-7 h-7" />
                      ) : (
                        <Search className="w-7 h-7" />
                      )}

                    </div>


                    <h3 className="text-base font-bold text-slate-900">

                      {history.length === 0
                        ? 'No Scan History Yet'
                        : 'No Matching Scans'}

                    </h3>


                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">

                      {history.length === 0
                        ? 'Your completed chest X-ray analyses will appear here automatically.'
                        : 'Try a different search term or change the diagnosis filter.'}

                    </p>


                    {history.length === 0 && (

                      <div className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-sm">

                        <Activity className="w-4 h-4 text-sky-500" />

                        Run an analysis to create your first record

                      </div>

                    )}

                  </div>

                </div>

              ) : (

                <div className="space-y-3">

                  {filteredHistory.map((item, idx) => {

                    const isPneumonia =
                      item.prediction === 'Pneumonia';

                    const itemId =
                      item.id || idx;


                    return (

                      <div
                        key={itemId}
                        onClick={() => {
                          onSelectHistoryItem(item);
                          onClose();
                        }}
                        className="group bg-white border border-slate-200 hover:border-sky-400 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md hover:bg-sky-50/30"
                      >

                        <div className="flex items-center gap-4">


                          {/* Thumbnail */}

                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shrink-0">

                            <img
                              src={
                                item.imageUrl ||
                                item.gradcamUrl
                              }
                              alt="Chest X-ray scan"
                              className="w-full h-full object-cover"
                            />

                          </div>


                          {/* Information */}

                          <div className="flex-1 min-w-0">

                            <div className="flex items-center gap-2 flex-wrap">

                              {isPneumonia ? (

                                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />

                              ) : (

                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />

                              )}


                              <span
                                className={`text-sm font-black ${
                                  isPneumonia
                                    ? 'text-rose-700'
                                    : 'text-emerald-700'
                                }`}
                              >

                                {item.prediction}

                              </span>


                              <span className="text-xs font-bold text-slate-500">
                                {item.confidence}%
                              </span>

                            </div>


                            <div className="text-xs text-slate-500 mt-1 truncate">

                              {item.subtype ||
                                item.source ||
                                'Chest X-ray analysis'}

                            </div>


                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">

                              <Calendar className="w-3.5 h-3.5" />

                              {new Date(
                                item.timestamp
                              ).toLocaleString([], {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              })}

                            </div>

                          </div>


                          {/* Actions */}

                          <div className="flex items-center gap-1 shrink-0">

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();

                                if (onDeleteHistoryItem) {
                                  onDeleteHistoryItem(
                                    itemId
                                  );
                                }
                              }}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                              title="Delete scan"
                            >

                              <Trash2 className="w-4 h-4" />

                            </button>


                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-colors" />

                          </div>

                        </div>


                        {/* Confidence */}

                        <div className="mt-3">

                          <div className="flex items-center justify-between mb-1">

                            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              Confidence
                            </span>

                            <span className="text-[10px] font-bold text-slate-500">
                              {item.confidence || 0}%
                            </span>

                          </div>


                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">

                            <div
                              className={`h-full rounded-full ${
                                isPneumonia
                                  ? 'bg-rose-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{
                                width: `${item.confidence || 0}%`
                              }}
                            />

                          </div>

                        </div>

                      </div>

                    );

                  })}

                </div>

              )}

            </div>

          </div>


          {/* ==================================================
              RIGHT SIDE — DASHBOARD
          ================================================== */}

          <aside className="w-full lg:w-[340px] xl:w-[380px] bg-white border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto p-5 sm:p-6">


            {/* -----------------------------------------------
                Overview
            ------------------------------------------------ */}

            <div className="mb-6">

              <div className="flex items-center gap-2 mb-1">

                <BarChart3 className="w-4 h-4 text-sky-600" />

                <h3 className="text-sm font-bold text-slate-900">
                  Archive Overview
                </h3>

              </div>

              <p className="text-xs text-slate-500">
                Summary of your analyzed chest X-rays
              </p>

            </div>


            {/* -----------------------------------------------
                Stat Cards
            ------------------------------------------------ */}

            <div className="grid grid-cols-2 gap-3 mb-6">


              <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200">

                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Total
                </div>

                <div className="text-2xl font-black text-slate-900 mt-1">
                  {totalScans}
                </div>

                <div className="text-[10px] text-slate-500 mt-1">
                  scans analyzed
                </div>

              </div>


              <div className="rounded-2xl p-4 bg-sky-50 border border-sky-100">

                <div className="text-[10px] uppercase tracking-wider font-bold text-sky-600">
                  Avg. Confidence
                </div>

                <div className="text-2xl font-black text-sky-700 mt-1">
                  {avgConfidence}%
                </div>

                <div className="text-[10px] text-sky-600/70 mt-1">
                  across all scans
                </div>

              </div>


              <div className="rounded-2xl p-4 bg-rose-50 border border-rose-100">

                <div className="text-[10px] uppercase tracking-wider font-bold text-rose-600">
                  Pneumonia
                </div>

                <div className="text-2xl font-black text-rose-700 mt-1">
                  {pneumoniaCount}
                </div>

                <div className="text-[10px] text-rose-600/70 mt-1">
                  detected cases
                </div>

              </div>


              <div className="rounded-2xl p-4 bg-emerald-50 border border-emerald-100">

                <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-600">
                  Normal
                </div>

                <div className="text-2xl font-black text-emerald-700 mt-1">
                  {normalCount}
                </div>

                <div className="text-[10px] text-emerald-600/70 mt-1">
                  detected cases
                </div>

              </div>

            </div>


            {/* -----------------------------------------------
                Filters
            ------------------------------------------------ */}

            <div className="mb-6">

              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                Filter Results
              </div>


              <div className="space-y-2">

                <button
                  onClick={() =>
                    setFilterCategory('ALL')
                  }
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    filterCategory === 'ALL'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >

                  <span>All Scans</span>

                  <span>
                    {totalScans}
                  </span>

                </button>


                <button
                  onClick={() =>
                    setFilterCategory('PNEUMONIA')
                  }
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    filterCategory === 'PNEUMONIA'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >

                  <span>Pneumonia</span>

                  <span>
                    {pneumoniaCount}
                  </span>

                </button>


                <button
                  onClick={() =>
                    setFilterCategory('NORMAL')
                  }
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    filterCategory === 'NORMAL'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >

                  <span>Normal</span>

                  <span>
                    {normalCount}
                  </span>

                </button>

              </div>

            </div>


            {/* -----------------------------------------------
                Latest Scan
            ------------------------------------------------ */}

            {latestScan && (

              <div className="mb-6">

                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                  Latest Analysis
                </div>


                <button
                  onClick={() => {
                    onSelectHistoryItem(
                      latestScan
                    );
                    onClose();
                  }}
                  className="w-full text-left rounded-2xl border border-slate-200 bg-slate-50 p-3 hover:border-sky-300 hover:bg-sky-50 transition-all"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0">

                      <img
                        src={
                          latestScan.imageUrl ||
                          latestScan.gradcamUrl
                        }
                        alt="Latest chest X-ray"
                        className="w-full h-full object-cover"
                      />

                    </div>


                    <div className="min-w-0">

                      <div
                        className={`text-xs font-black ${
                          latestScan.prediction === 'Pneumonia'
                            ? 'text-rose-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {latestScan.prediction}
                      </div>

                      <div className="text-[11px] text-slate-500 mt-1">
                        {latestScan.confidence}% confidence
                      </div>

                      <div className="text-[10px] text-slate-400 mt-1 truncate">
                        {new Date(
                          latestScan.timestamp
                        ).toLocaleString()}
                      </div>

                    </div>

                  </div>

                </button>

              </div>

            )}


            {/* -----------------------------------------------
                Local Archive Information
            ------------------------------------------------ */}

            <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4">

              <div className="flex items-start gap-3">

                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">

                  <ShieldCheck className="w-4 h-4 text-sky-600" />

                </div>


                <div>

                  <div className="text-xs font-bold text-sky-900">
                    Local Archive
                  </div>

                  <p className="text-[11px] text-sky-800/70 mt-1 leading-relaxed">
                    Analysis history is maintained locally
                    by the application for quick recall.
                  </p>

                </div>

              </div>

            </div>


            {/* -----------------------------------------------
                Footer Information
            ------------------------------------------------ */}

            <div className="mt-6 pt-5 border-t border-slate-200">

              <div className="flex items-center justify-between text-[10px] text-slate-400">

                <span>
                  Archive Status
                </span>

                <span className="flex items-center gap-1.5 font-bold text-emerald-600">

                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                  Ready

                </span>

              </div>

            </div>

          </aside>

        </div>


        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div className="px-5 sm:px-7 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">

          <span className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">

            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />

            Local archive

          </span>


          <span className="text-[11px] font-mono font-bold text-slate-600">

            Avg. confidence: {avgConfidence}%

          </span>

        </div>

      </div>

    </div>
  );
}