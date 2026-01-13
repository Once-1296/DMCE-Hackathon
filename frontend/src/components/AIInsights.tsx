import { useState } from 'react';
import { BrainCircuit, Fingerprint, Activity, Zap, Sparkles, Filter } from 'lucide-react';
import type { CelestialBody } from '../types';
interface Props {
  data: CelestialBody[];
  
}

export const AIInsights = ({ data }: Props) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
    }, 2000);
  };

  const anomalies = data.slice(5, 8); // Simulate 3 detected anomalies

  return (
    <div className="space-y-8 animate-fade-in">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-8 rounded-3xl border border-purple-500/30 backdrop-blur-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black flex items-center gap-3">
              <BrainCircuit className="text-purple-400" />
              Cosmic Neural Engine
            </h2>
            <p className="text-slate-400 max-w-md">
              Running isolation forests and neural clustering on fused datasets to identify non-standard celestial signatures.
            </p>
          </div>
          <button 
            onClick={startScan}
            disabled={isScanning}
            className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${
              isScanning ? 'bg-slate-800 text-slate-500' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
            }`}
          >
            {isScanning ? <Activity className="animate-spin" /> : <Sparkles />}
            {isScanning ? "Analyzing Clusters..." : "Run Anomaly Detection"}
          </button>
        </div>
        
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] -z-0"></div>
      </div>

      {!showResults && !isScanning && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-600 italic">
          <Fingerprint size={48} className="mb-4 opacity-20" />
          <p>Ready to analyze {data.length} objects for scientific anomalies.</p>
        </div>
      )}

      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          {anomalies.map((body, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-purple-500/20 text-purple-400 uppercase tracking-widest">
                  {i === 0 ? 'High Velocity' : i === 1 ? 'Spectral Outlier' : 'Unknown Class'}
                </span>
                <span className="text-xs font-mono text-slate-500">Confidence: 94.2%</span>
              </div>
              <h3 className="text-xl font-bold mb-1">{body.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{body.type}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Deviation Score</span>
                  <span className="text-purple-400">σ +4.2</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full">
                  <div className="h-full bg-purple-500 w-[85%] rounded-full"></div>
                </div>
              </div>

              <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/5">
                Review Signal Source
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pattern Clustering Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-black/40 border border-white/10">
          <h4 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2">
            <Filter size={16} /> Latent Space Mapping
          </h4>
          <div className="h-48 flex items-end justify-between gap-2">
            {[40, 70, 45, 90, 65, 30, 85, 50, 75, 40].map((h, i) => (
              <div 
                key={i} 
                className="w-full bg-gradient-to-t from-purple-600/20 to-cyan-400/40 rounded-t-sm" 
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-4 text-center italic">Distribution of cross-mission feature vectors (Normalized)</p>
        </div>

        <div className="p-6 rounded-2xl bg-black/40 border border-white/10">
          <h4 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
            <Zap size={16} className="text-yellow-400" /> AI Insights Log
          </h4>
          <div className="space-y-3 font-mono text-[11px]">
            <div className="text-emerald-500">✓ Training data synchronized with Repository v1.0.4</div>
            <div className="text-slate-400 text-opacity-60">→ Clustering algorithm: HDBSCAN</div>
            <div className="text-slate-400 text-opacity-60">→ Features: Distance, Magnitude, Flux Ratio</div>
            <div className="text-purple-400">! Detected clustering deviation in Sector 7G</div>
            <div className="animate-pulse">_</div>
          </div>
        </div>
      </div>
    </div>
  );
};