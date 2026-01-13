import { X, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CelestialBody } from '../types';
import { CelestialViewer } from './CelestialViewer'; // Import the 3D viewer

interface Props {
  body: CelestialBody;
  isDarkMode: boolean;
  onClose: () => void;
}

export const ComparisonModal = ({ body, isDarkMode, onClose }: Props) => {
  // Mock spectral data 
  const spectralData = [
    { wl: 300, intensity: Math.random() * 100 }, { wl: 400, intensity: Math.random() * 100 }, 
    { wl: 500, intensity: 90 }, { wl: 600, intensity: Math.random() * 80 }, 
    { wl: 700, intensity: Math.random() * 60 }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/80">
      <div className={`w-full max-w-6xl h-[90vh] rounded-3xl border p-0 relative animate-fade-in shadow-2xl overflow-hidden flex flex-col md:flex-row ${isDarkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 bg-black/20 rounded-full hover:bg-white/10 text-white transition-colors">
          <X size={20} />
        </button>

        {/* LEFT COLUMN: 3D VIEWER (Takes up 50% width on desktop) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-black relative border-r border-white/10">
          <CelestialViewer color={body.color} size={body.size_rel} />
          
          <div className="absolute top-6 left-6 max-w-md">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500 mb-2">{body.name}</h2>
            <div className="flex flex-wrap gap-2">
               <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 text-white">
                {body.type}
              </span>
               <span className="px-3 py-1 bg-cyan-500/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-cyan-500/20 text-cyan-400">
                {body.distance}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DATA (Scrollable) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            
            {/* Description Box */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-lg leading-relaxed text-slate-300 font-light">"{body.description}"</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Surface Temp</p>
                <p className="text-2xl font-mono text-orange-400">{body.temp}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Solar Mass</p>
                <p className="text-2xl font-mono text-cyan-400">{body.mass}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Radius (Rel)</p>
                <p className="text-2xl font-mono text-purple-400">{body.size_rel} R☉</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Sector</p>
                <p className="text-2xl font-mono text-emerald-400">{body.location.split(' ')[1]}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Activity size={16} className="text-purple-500" />
                  Spectral Fingerprint
                </h3>
              </div>
              <div className="h-[200px] w-full p-4 rounded-2xl border bg-black/20 border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spectralData}>
                    <defs>
                      <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={body.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={body.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="wl" stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                    <Area type="monotone" dataKey="intensity" stroke={body.color} strokeWidth={2} fill="url(#colorInt)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};