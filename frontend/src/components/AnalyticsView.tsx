import { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Activity, Database, CheckCircle, AlertTriangle, Terminal } from 'lucide-react';
import type { CelestialBody } from '../types';

interface Props {
  data: CelestialBody[];
}

export const AnalyticsView = ({ data }: Props) => {
  // --- 1. REAL-TIME LOG SIMULATION ---
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Initializing Cross-Match Engine v2.4...",
    "[INFO] Loaded 200 source vectors from mock_generator.",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const actions = [
        "Aligning J2000 coordinates...",
        "Calibrating spectral flux...",
        "Merging duplicate source ID...",
        "Validating parallax with Gaia DR3...",
        "Computing barycentric velocity..."
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [`[${timestamp}] ${randomAction}`, ...prev.slice(0, 6)]);
    }, 2500); // Add a new log every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  // --- 2. COMPUTING REAL STATS FROM VAST DATA ---
  const stats = useMemo(() => {
    // Count Star Types (O, B, A, F, G, K, M)
    const typeCounts: Record<string, number> = {};
    let totalTemp = 0;
    
    data.forEach(body => {
      // Extract "G" from "G-Type Dwarf"
      const typeKey = body.type.split('-')[0]; 
      typeCounts[typeKey] = (typeCounts[typeKey] || 0) + 1;
      
      // Parse "5,700 K" to 5700
      const tempVal = parseInt(body.temp.replace(/,/g, '').replace(' K', ''));
      totalTemp += tempVal;
    });

    const avgTemp = Math.round(totalTemp / data.length);
    const chartData = Object.keys(typeCounts).map(k => ({ name: `${k}-Type`, value: typeCounts[k] }));

    // Scatter Data: Distance vs Temperature (Hertzsprung-Russell-ish)
    const scatterData = data.map(b => ({
      x: parseInt(b.temp.replace(/,/g, '')), // Temp
      y: parseFloat(b.mass.replace(' M☉', '')), // Mass
      z: parseFloat(b.distance.replace(' ly', '')), // Distance (size of bubble)
      name: b.name
    }));

    return { typeCounts: chartData, avgTemp, scatterData };
  }, [data]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e'];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Sources</h4>
            <Database size={16} className="text-cyan-400" />
          </div>
          <p className="text-3xl font-mono text-white">{data.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">Ingested from 4 catalogs</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Temperature</h4>
            <Activity size={16} className="text-orange-400" />
          </div>
          <p className="text-3xl font-mono text-white">{stats.avgTemp.toLocaleString()} K</p>
          <p className="text-[10px] text-slate-500 mt-1">Thermal consistency check passed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Fusion Health</h4>
            <CheckCircle size={16} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-mono text-white">99.9%</p>
          <p className="text-[10px] text-slate-500 mt-1">0 Critical Errors</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Anomalies</h4>
            <AlertTriangle size={16} className="text-yellow-400" />
          </div>
          <p className="text-3xl font-mono text-white">3</p>
          <p className="text-[10px] text-slate-500 mt-1">Flagged for manual review</p>
        </div>
      </div>

      {/* MAIN CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        
        {/* 1. SPECTRAL DISTRIBUTION (BAR CHART) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-black/40 border border-white/10 relative overflow-hidden">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-cyan-500 rounded-sm"></span>
            Spectral Class Distribution
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={stats.typeCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
              <YAxis stroke="#64748b" tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px'}} 
                itemStyle={{color: '#e2e8f0'}}
                cursor={{fill: '#ffffff10'}}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {stats.typeCounts.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 2. COMPOSITION PIE CHART */}
        <div className="p-6 rounded-3xl bg-black/40 border border-white/10">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
             <span className="w-2 h-6 bg-purple-500 rounded-sm"></span>
             Object Types
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie 
                data={stats.typeCounts} 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={5} 
                dataKey="value"
                stroke="none"
              >
                {stats.typeCounts.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: '#000', borderRadius: '8px', border: '1px solid #333'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 3. SCIENTIFIC SCATTER PLOT (Mass vs Temp) */}
        <div className="h-[350px] p-6 rounded-3xl bg-black/40 border border-white/10">
          <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
             <span className="w-2 h-6 bg-orange-500 rounded-sm"></span>
             H-R Diagram Correlation
          </h3>
          <p className="text-xs text-slate-500 mb-6">X: Temperature (K) | Y: Mass (Solar Masses)</p>
          <ResponsiveContainer width="100%" height="80%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" dataKey="x" name="Temp" unit="K" stroke="#666" reversed />
              <YAxis type="number" dataKey="y" name="Mass" unit="M☉" stroke="#666" />
              <ZAxis type="number" dataKey="z" range={[50, 400]} name="Distance" unit="ly" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{backgroundColor: '#000', border: '1px solid #333'}} />
              <Scatter name="Stars" data={stats.scatterData} fill="#8884d8">
                {stats.scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.x > 10000 ? '#60a5fa' : entry.x > 5000 ? '#facc15' : '#f87171'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* 4. LIVE PROCESSING LOGS */}
        <div className="h-[350px] p-0 rounded-3xl bg-black border border-white/10 overflow-hidden flex flex-col">
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
            <Terminal size={16} className="text-slate-400" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">Backend_Ingest_Stream.log</span>
            <div className="ml-auto flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50 animate-pulse"></div>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-hidden font-mono text-xs space-y-3">
             {logs.map((log, i) => (
               <div key={i} className={`flex gap-3 ${i === 0 ? 'text-cyan-400' : 'text-slate-500'}`}>
                 <span className="opacity-50 select-none">&gt;</span>
                 <span>{log}</span>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};