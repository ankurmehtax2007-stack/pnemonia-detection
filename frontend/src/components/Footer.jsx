import React from 'react';
import { Activity, ShieldCheck, Heart, Code, ExternalLink } from 'lucide-react';


export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-10 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-teal-400 p-0.5 shadow-md shadow-sky-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Activity className="w-4.5 h-4.5 text-sky-400 animate-pulse-subtle" />
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                PneumoVision AI Dashboard
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              A clinical decision support prototype for Chest X-Ray Pneumonia Detection utilizing MobileNetV3 transfer learning and Grad-CAM visual attention mapping.
            </p>
            <div className="flex items-center space-x-2 pt-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>HIPAA Compliant UI Design System • Zero Local Image Storage</span>
            </div>
          </div>

          {/* Col 2: Technologies */}
          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">
              Technology Stack
            </h4>
            <ul className="space-y-1.5 font-medium">
              <li className="hover:text-white transition-colors">React.js & Vite</li>
              <li className="hover:text-white transition-colors">Tailwind CSS (Vanilla Styling)</li>
              <li className="hover:text-white transition-colors">PyTorch / MobileNetV3 Large</li>
              <li className="hover:text-white transition-colors">FastAPI Backend Integration</li>
              <li className="hover:text-white transition-colors">Grad-CAM Explainability</li>
            </ul>
          </div>

          {/* Col 3: Research & Citation */}
          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">
              Clinical Citation
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed mb-2">
              Kermany, Daniel et al. "Identifying Medical Diagnoses and Treatable Diseases by Image-Based Deep Learning." Cell 172.5 (2018).
            </p>
            <span className="inline-flex items-center text-[11px] text-sky-400 font-semibold hover:underline cursor-pointer">
              <span>View NIH Research Paper</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </span>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} PneumoVision AI. Created for Medical Deep Learning Demonstrations.
          </div>
          <div className="flex items-center space-x-1">
            <span>Engineered with precision for Healthcare AI</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
