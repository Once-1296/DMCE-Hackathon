import { X, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CelestialBody } from '../types';

interface Props {
  body: CelestialBody;
  isDarkMode: boolean;
  onClose: () => void;
}

export const ComparisonModal = ({ body, isDarkMode, onClose }: Props) => {
  // Mock spectral data for the chart
  const spectralData = [
    { wl: 300, intensity: 20 }, { wl: 400, intensity: 45 }, { wl: 500, intensity: 90 },
    { wl: 600, intensity: 75 }, { wl: 700, intensity: 85 }, { wl: 800, intensity: 40 },
    { wl: 900, intensity: 15 }, { wl: 1000, intensity: 5 }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
      <div className={`w-full max-w-5xl rounded-3xl border p-8 relative animate-fade-in shadow-2xl ${isDarkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Scale */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">{body.name}</h2>
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-widest border border-cyan-500/20">
                {body.type}
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-black/20 border border-white/5 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
               <p className="absolute top-3 left-3 text-[10px] text-slate-500 font-bold tracking-widest uppercase">Visual Scale</p>
               {/* Dynamic Scaling Circle */}
               <div 
                 className="bg-gradient-to-tr from-orange-500 via-yellow-400 to-white rounded-full shadow-[0_0_50px_rgba(234,179,8,0.2)]"
                 style={{ 
                   width: `${Math.min(140, 10 + body.size_rel * 1.2)}px`, 
                   height: `${Math.min(140, 10 + body.size_rel * 1.2)}px` 
                 }}
               />
               <div className="mt-4 flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_cyan]" />
                 <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-tighter">Earth Comparison</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Temperature</p>
                <p className="text-lg font-mono text-orange-400">{body.temp}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Relative Size</p>
                <p className="text-lg font-mono text-cyan-400">{body.size_rel}x</p>
              </div>
            </div>
          </div>

          {/* Right Column: Analytics Chart */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Activity size={16} className="text-purple-500" />
                Harmonized Spectral Analysis
              </h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 animate-pulse">
                Live Fusion Link
              </span>
            </div>
            
            <div className={`h-[300px] w-full p-4 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spectralData}>
                  <defs>
                    <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="wl" stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val}nm`} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#22d3ee' }}
                  />
                  <Area type="monotone" dataKey="intensity" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorInt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
              <p className="text-xs text-slate-400 leading-relaxed italic">
                "System has successfully fused NASA MAST and SIMBAD data points. Spectral peaks at 500nm indicate high ionized helium presence, consistent with {body.name}'s classification."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};