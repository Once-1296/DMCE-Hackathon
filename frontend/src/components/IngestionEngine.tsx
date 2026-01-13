import { useState, useEffect } from 'react';
import { UploadCloud, FileCode, CheckCircle, ArrowRight, RefreshCw, AlertCircle, Cpu } from 'lucide-react';

export const IngestionEngine = () => {
  const [step, setStep] = useState<'upload' | 'processing' | 'review'>('upload');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // Simulated Processing Logic
  useEffect(() => {
    if (step === 'processing') {
      const actions = [
        "Reading header metadata from HST_WFC3.fits...",
        "Detected Source: NASA MAST Archive (Format: FITS v4.0)",
        "WARN: Non-standard unit 'parsecs' found in Col 4. Converting to 'light-years'...",
        "Normalizing RA/Dec to ICRS J2000 epoch...",
        "Cross-referencing object IDs with SIMBAD...",
        "Harmonization Complete. 100% Schema Match."
      ];

      let i = 0;
      const interval = setInterval(() => {
        if (i >= actions.length) {
          clearInterval(interval);
          setTimeout(() => setStep('review'), 1000);
          return;
        }
        setLogs(prev => [...prev, actions[i]]);
        setProgress(((i + 1) / actions.length) * 100);
        i++;
      }, 800);

      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* HEADER */}
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
          Data Ingestion Pipeline
        </h2>
        <p className="text-slate-500">Upload raw dataset fragments for automated harmonization and unit conversion.</p>
      </div>

      {/* STAGE 1: UPLOAD */}
      {step === 'upload' && (
        <div 
          onClick={() => setStep('processing')}
          className="border-2 border-dashed border-slate-700 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all group"
        >
          <div className="p-6 bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-2xl">
            <UploadCloud size={40} className="text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-200">Drop Raw FITS, CSV, or VO-Table files here</h3>
          <p className="text-slate-500 mt-2 text-sm">Supports: NASA MAST, ESA Gaia, Chandra Source Catalog</p>
        </div>
      )}

      {/* STAGE 2: PROCESSING (THE PIPELINE VISUALIZATION) */}
      {step === 'processing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visual Pipeline */}
          <div className="bg-black/40 rounded-3xl p-8 border border-white/10 space-y-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
               <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
             </div>
             
             {/* Step A: Parsing */}
             <div className="flex items-center gap-4 opacity-100">
               <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/50">
                 <FileCode size={20} />
               </div>
               <div>
                 <h4 className="font-bold text-slate-200">1. Header Parsing</h4>
                 <p className="text-xs text-slate-500">Extracting metadata from binary stream</p>
               </div>
               {progress > 30 && <CheckCircle size={18} className="text-emerald-500 ml-auto" />}
             </div>

             {/* Step B: Harmonization (The Core Requirement) */}
             <div className={`flex items-center gap-4 transition-opacity ${progress > 30 ? 'opacity-100' : 'opacity-40'}`}>
               <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/50">
                 <RefreshCw size={20} className={progress > 30 && progress < 70 ? 'animate-spin' : ''} />
               </div>
               <div>
                 <h4 className="font-bold text-slate-200">2. Unit Harmonization</h4>
                 <p className="text-xs text-slate-500">Converting [pc] to [ly]; [deg] to [HMS]</p>
               </div>
               {progress > 70 && <CheckCircle size={18} className="text-emerald-500 ml-auto" />}
             </div>

             {/* Step C: Validation */}
             <div className={`flex items-center gap-4 transition-opacity ${progress > 70 ? 'opacity-100' : 'opacity-40'}`}>
               <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/50">
                 <ShieldCheck size={20} />
               </div>
               <div>
                 <h4 className="font-bold text-slate-200">3. Schema Validation</h4>
                 <p className="text-xs text-slate-500">Checking against IVOA standards</p>
               </div>
             </div>
          </div>

          {/* Terminal Log */}
          <div className="bg-[#050505] rounded-3xl p-6 border border-white/10 font-mono text-xs overflow-y-auto h-[350px]">
            <div className="mb-4 text-slate-500 border-b border-white/10 pb-2">/var/log/cosmic_fusion_d.log</div>
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2 text-emerald-500/80">
                  <span className="opacity-50 text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="animate-pulse text-cyan-500">_</div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: REVIEW (Comparison Table) */}
      {step === 'review' && (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center gap-3">
            <CheckCircle size={20} />
            <span className="font-bold">Ingestion Successful: 45 New Objects Added to Repository.</span>
            <button onClick={() => setStep('upload')} className="ml-auto text-xs underline hover:text-white">Process another batch</button>
          </div>

          {/* The "Harmonization Proof" Table */}
          <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/10">
            <div className="grid grid-cols-2 text-center border-b border-white/10">
              <div className="p-4 bg-red-500/10 text-red-300 font-bold border-r border-white/10">Input (Raw FITS)</div>
              <div className="p-4 bg-emerald-500/10 text-emerald-300 font-bold">Output (Harmonized)</div>
            </div>
            
            <div className="divide-y divide-white/5 text-sm">
              <div className="grid grid-cols-2">
                <div className="p-4 text-slate-400 flex justify-between px-8 bg-red-500/5">
                  <span>dist = 14.5 <span className="text-red-400 font-bold">pc</span></span>
                </div>
                <div className="p-4 text-slate-200 flex justify-between px-8 bg-emerald-500/5">
                  <ArrowRight size={16} className="text-slate-600" />
                  <span>distance = 47.29 <span className="text-emerald-400 font-bold">ly</span></span>
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="p-4 text-slate-400 flex justify-between px-8 bg-red-500/5">
                  <span>temp = 5.2e3</span>
                </div>
                <div className="p-4 text-slate-200 flex justify-between px-8 bg-emerald-500/5">
                  <ArrowRight size={16} className="text-slate-600" />
                  <span>temperature = 5,200 <span className="text-emerald-400 font-bold">K</span></span>
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="p-4 text-slate-400 flex justify-between px-8 bg-red-500/5">
                  <span>coords = 184.2, -5.2</span>
                </div>
                <div className="p-4 text-slate-200 flex justify-between px-8 bg-emerald-500/5">
                  <ArrowRight size={16} className="text-slate-600" />
                  <span>ra: 12h 16m 48s | dec: -05° 12' 00"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
import { ShieldCheck } from 'lucide-react';