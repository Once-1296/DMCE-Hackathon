import { useState, useEffect } from 'react';
import { Sliders, AlertTriangle, CheckCircle, Activity, Info } from 'lucide-react';
import type { CelestialBody } from '../types';
interface Props {
  data: CelestialBody;
  isDarkMode: boolean;
}

export const FusionHarmonizer = ({ data, isDarkMode }: Props) => {
  // Parse base distance to a number
  const baseDistance = parseFloat(data.distance.replace(/[^0-9.]/g, ''));

  // SIMULATION: Create diverging values if there is a conflict
  // If has_conflict is true, Hubble sees it closer, Gaia sees it further.
  const [missionValues] = useState({
    hubble: data.has_conflict ? baseDistance * 0.94 : baseDistance * 0.99,
    gaia: data.has_conflict ? baseDistance * 1.06 : baseDistance * 1.01,
    jwst: baseDistance // JWST is our baseline anchor
  });

  const [weights, setWeights] = useState(data.source_weights);
  const [fusedValue, setFusedValue] = useState(baseDistance);

  // Recalculate the "Fused" value whenever weights change
  useEffect(() => {
    const totalWeight = weights.hubble + weights.gaia + weights.jwst;
    // Prevent divide by zero
    const divisor = totalWeight === 0 ? 1 : totalWeight;
    
    const calculated = (
      (missionValues.hubble * weights.hubble) + 
      (missionValues.gaia * weights.gaia) + 
      (missionValues.jwst * weights.jwst)
    ) / divisor;

    setFusedValue(calculated);
  }, [weights, missionValues]);

  return (
    <div className={`mt-6 p-6 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>
            <Sliders size={20} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Data Harmonization Lab</h3>
            <p className="text-xs text-slate-500">Manual resolution of cross-mission conflicts</p>
          </div>
        </div>
        
        {data.has_conflict ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 animate-pulse">
            <AlertTriangle size={14} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-500 uppercase">Conflict Detected</span>
          </div>
        ) : (
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle size={14} className="text-emerald-500" />
            <span className="text-xs font-bold text-emerald-500 uppercase">Signal Clean</span>
          </div>
        )}
      </div>

      {/* GRAPHIC VISUALIZATION */}
      <div className="relative h-40 mb-8 pt-8 pb-2 px-4 border-b border-slate-700/50 flex items-end justify-between gap-4">
        {/* Baseline Dashed Line */}
        <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-slate-500/30 z-0">
            <span className="absolute right-0 -top-5 text-[10px] text-slate-500">Baseline Mean</span>
        </div>

        {/* BARS */}
        {[
          { key: 'hubble', label: 'HUBBLE', color: 'bg-blue-500', val: missionValues.hubble },
          { key: 'gaia', label: 'GAIA', color: 'bg-purple-500', val: missionValues.gaia },
          { key: 'jwst', label: 'JWST', color: 'bg-yellow-500', val: missionValues.jwst },
        ].map((m) => {
            // Calculate height relative to max deviation for visual effect
            const variance = m.val - baseDistance;
            // Visual scaling logic
            const height = 50 + (variance / baseDistance) * 400; 
            const clampedHeight = Math.min(Math.max(height, 20), 100);

            return (
                <div key={m.key} className="flex-1 flex flex-col items-center gap-2 relative z-10 group cursor-help">
                    <div 
                        style={{ height: `${clampedHeight}%` }} 
                        className={`w-full max-w-[60px] rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-500 ${m.color}`}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-[10px] px-2 py-1 rounded transition-opacity whitespace-nowrap">
                            {m.val.toFixed(2)} ly
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider">{m.label}</span>
                </div>
            )
        })}
      </div>

      {/* CONTROLS */}
      <div className="space-y-4 mb-8">
        {Object.keys(weights).map((mission) => (
          <div key={mission} className="flex items-center gap-4">
            <span className={`w-16 text-xs font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{mission}</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={weights[mission as keyof typeof weights]}
              onChange={(e) => setWeights({...weights, [mission]: parseInt(e.target.value)})}
              className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
            />
            <span className="w-10 text-right font-mono text-cyan-500 text-sm">{weights[mission as keyof typeof weights]}%</span>
          </div>
        ))}
      </div>

      {/* FINAL RESULT BOX */}
      <div className={`p-5 rounded-xl flex items-center justify-between border ${isDarkMode ? 'bg-black/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <Activity className="text-cyan-500" size={24} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Fused Distance Estimate</div>
            <div className={`text-3xl font-mono font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {fusedValue.toFixed(2)} <span className="text-sm font-normal text-slate-500">ly</span>
            </div>
          </div>
        </div>
        <button className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm rounded-lg transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          Apply Fusion
        </button>
      </div>
    </div>
  );
};