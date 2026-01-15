import { useState } from 'react';
import { 
  X, Activity, Eye, Flame, Zap, ScanLine, 
  Leaf, Droplets, Wind, Thermometer, Orbit 
} from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, YAxis, Cell } from 'recharts';
import type { CelestialBody } from '../types';
import { FusionHarmonizer } from './FusionHarmonizer';

interface Props {
  body: CelestialBody;
  isDarkMode: boolean;
  onClose: () => void;
}

type Wavelength = 'optical' | 'infrared' | 'xray';
type Tab = 'overview' | 'habitat';

export const ComparisonModal = ({ body, isDarkMode, onClose }: Props) => {
  const [activeLayer, setActiveLayer] = useState<Wavelength>('optical');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isScanning, setIsScanning] = useState(false);

  // Trigger scanning effect when switching layers
  const handleLayerChange = (layer: Wavelength) => {
    if (layer === activeLayer) return;
    setIsScanning(true);
    setActiveLayer(layer);
    setTimeout(() => setIsScanning(false), 800);
  };

  // Mock spectral data (unchanged)
  const spectralData = [
    { wl: 300, intensity: Math.random() * 100 }, { wl: 400, intensity: Math.random() * 100 }, 
    { wl: 500, intensity: 90 }, { wl: 600, intensity: Math.random() * 80 }, 
    { wl: 700, intensity: Math.random() * 60 }
  ];

  // Mock Habitat Data (Atmospheric Composition)
  const atmosphereData = [
    { name: 'Nitrogen', value: 45 },
    { name: 'Oxygen', value: 12 },
    { name: 'CO2', value: 35 },
    { name: 'Methane', value: 5 },
    { name: 'Argon', value: 3 },
  ];

  // Dynamic CSS Gradients to simulate different telescope views
  const getVisualLayer = () => {
    switch (activeLayer) {
      case 'infrared': // Heatmap style (JWST)
        return `radial-gradient(circle at 30% 30%, #facc15 0%, #ef4444 40%, #7f1d1d 80%, transparent 100%)`;
      case 'xray': // High energy style (Chandra)
        return `radial-gradient(circle at 50% 50%, #e0f2fe 0%, #38bdf8 20%, #3b0764 70%, transparent 100%)`;
      case 'optical': // Standard visual (Hubble)
      default:
        return `radial-gradient(circle at 40% 40%, ${body.color} 0%, #000 90%, transparent 100%)`;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/90">
      <div className={`w-full max-w-6xl h-[90vh] rounded-3xl border relative animate-fade-in shadow-2xl overflow-hidden flex flex-col md:flex-row ${isDarkMode ? 'bg-[#0f1016] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 text-white transition-all">
          <X size={20} />
        </button>

        {/* --- LEFT COLUMN: MULTI-WAVELENGTH VISUALIZER (UNCHANGED) --- */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-black relative border-r border-white/10 overflow-hidden group">
          
          {/* Background Starfield (Static) */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

          {/* THE CELESTIAL OBJECT SIMULATION */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Glow Halo */}
            <div 
              className={`absolute w-[400px] h-[400px] rounded-full blur-[100px] transition-all duration-1000 ${
                activeLayer === 'infrared' ? 'bg-red-900/40' : 
                activeLayer === 'xray' ? 'bg-blue-900/40' : 'bg-white/10'
              }`} 
            />
            
            {/* The Planet/Star Sphere */}
            <div 
              className={`relative w-[280px] h-[280px] rounded-full transition-all duration-1000 shadow-2xl ${isScanning ? 'scale-95 blur-sm' : 'scale-100 blur-0'}`}
              style={{ background: getVisualLayer(), boxShadow: activeLayer === 'xray' ? '0 0 50px rgba(56, 189, 248, 0.4)' : 'none' }}
            >
              {/* Texture Overlay */}
              <div className="absolute inset-0 rounded-full opacity-60 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
            </div>
          </div>

          {/* Scanning Effect Overlay */}
          {isScanning && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] animate-pulse">
              <ScanLine size={48} className="text-cyan-400 animate-bounce mb-2" />
              <span className="text-cyan-400 font-mono text-xs tracking-widest uppercase">Calibrating Sensor Array...</span>
            </div>
          )}

          {/* Info Overlay Top Left */}
          <div className="absolute top-8 left-8 z-10">
            <h2 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">{body.name}</h2>
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded border border-white/20 text-xs font-bold text-white uppercase tracking-widest">
                {body.type}
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded border border-white/20 text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} /> Live Feed
              </span>
            </div>
          </div>

          {/* Wavelength Controls Bottom */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 p-2 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 z-30">
            <button 
              onClick={() => handleLayerChange('optical')}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all w-24 ${activeLayer === 'optical' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-slate-400 hover:bg-white/10'}`}
            >
              <Eye size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Optical</span>
            </button>
            <button 
              onClick={() => handleLayerChange('infrared')}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all w-24 ${activeLayer === 'infrared' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'text-slate-400 hover:bg-white/10'}`}
            >
              <Flame size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Infrared</span>
            </button>
            <button 
              onClick={() => handleLayerChange('xray')}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all w-24 ${activeLayer === 'xray' ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'text-slate-400 hover:bg-white/10'}`}
            >
              <Zap size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">X-Ray</span>
            </button>
          </div>
        </div>

        {/* --- RIGHT COLUMN: DATA ANALYTICS & HABITAT --- */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col">
          
          {/* TAB NAVIGATION */}
          <div className={`flex border-b ${isDarkMode ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50'}`}>
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                activeTab === 'overview' 
                  ? 'border-b-2 border-cyan-500 text-cyan-500' 
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <ScanLine size={14} /> Analysis Overview
            </button>
            <button 
              onClick={() => setActiveTab('habitat')}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                activeTab === 'habitat' 
                  ? 'border-b-2 border-emerald-500 text-emerald-500' 
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <Leaf size={14} /> Habitat Lab
            </button>
          </div>

          {/* SCROLLABLE CONTENT AREA */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
            
            {/* Background Grid Pattern */}
            <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${isDarkMode ? 'bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]' : 'bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]'}`} />

            {/* === TAB 1: OVERVIEW (EXISTING FUNCTIONALITY) === */}
            {activeTab === 'overview' && (
              <div className="relative space-y-8 animate-fade-in">
                
                {/* Description Box */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
                    <ScanLine size={14} /> Object Classification
                  </h3>
                  <p className={`text-lg leading-relaxed font-light ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    "{body.description}"
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Surface Temp</p>
                    <p className="text-2xl font-mono text-orange-400">{body.temp}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Solar Mass</p>
                    <p className="text-2xl font-mono text-cyan-400">{body.mass}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Radius (Rel)</p>
                    <p className="text-2xl font-mono text-purple-400">{body.size_rel} R☉</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Distance</p>
                    <p className="text-2xl font-mono text-emerald-400">{body.distance}</p>
                  </div>
                </div>

                {/* Spectral Chart */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Activity size={16} className="text-purple-500" />
                      Emission Spectroscopy
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
                      Src: {activeLayer === 'optical' ? 'HST' : activeLayer === 'infrared' ? 'JWST' : 'Chandra'}
                    </span>
                  </div>
                  <div className={`h-[240px] w-full p-4 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={spectralData}>
                        <defs>
                          <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={body.color} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={body.color} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} vertical={false} />
                        <XAxis dataKey="wl" stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val}nm`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#000' : '#fff', 
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: isDarkMode ? '#fff' : '#000'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="intensity" 
                          stroke={body.color} 
                          strokeWidth={3} 
                          fill="url(#colorInt)" 
                          animationDuration={1500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-3">
                   <FusionHarmonizer data={body} isDarkMode={isDarkMode} />
                </div>

                {/* Download/Export Action */}
                <button className="w-full py-4 rounded-xl border border-dashed border-slate-600 text-slate-500 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <ScanLine size={16} /> Export {activeLayer} dataset (.FITS)
                </button>
              </div>
            )}

            {/* === TAB 2: HABITAT LAB (NEW) === */}
            {activeTab === 'habitat' && (
              <div className="relative space-y-8 animate-fade-in">
                
                {/* Habitability Score Card */}
                <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${isDarkMode ? 'bg-gradient-to-r from-emerald-900/20 to-transparent border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div>
                    <h3 className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                      <Leaf size={14} /> Life Support Index
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Estimated probability of supporting carbon-based life forms based on current spectral readings.
                    </p>
                  </div>
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700 opacity-20" />
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - 0.76)} className="text-emerald-500" />
                    </svg>
                    <span className="absolute text-2xl font-black text-emerald-500">0.76</span>
                  </div>
                </div>

                {/* Bio-Signatures Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <Droplets className="text-cyan-400" size={20} />
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Liquid Water</span>
                    </div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Detected (Sub-surface)</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <Wind className="text-slate-400" size={20} />
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Atmosphere</span>
                    </div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Dense (High N2)</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <Thermometer className="text-orange-400" size={20} />
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Surface Temp</span>
                    </div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>-15°C to 20°C</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <Orbit className="text-purple-400" size={20} />
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Goldilocks Zone</span>
                    </div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Within Range</p>
                  </div>
                </div>

                {/* Atmospheric Chart */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Wind size={16} className="text-slate-500" />
                    Atmospheric Composition
                  </h3>
                  <div className={`h-[200px] w-full p-4 rounded-2xl border ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={atmosphereData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} stroke="#64748b" fontSize={10} />
                        <Tooltip 
                          cursor={{fill: 'transparent'}}
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#000' : '#fff', 
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: isDarkMode ? '#fff' : '#000'
                          }} 
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {atmosphereData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 1 ? '#10b981' : isDarkMode ? '#475569' : '#cbd5e1'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border border-dashed ${isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-300 bg-slate-50'}`}>
                  <p className="text-xs text-center text-slate-500 font-mono">
                    Analysis Confidence: 89.4% • Data Source: Kepler/TESS Fusion
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};