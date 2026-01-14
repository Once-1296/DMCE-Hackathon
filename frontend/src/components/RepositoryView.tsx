import { useState, useEffect, useRef } from 'react';
import { Database, FileJson, FileSpreadsheet, History, ShieldCheck, Zap, Info, GitBranch, Server, ArrowRight, Terminal, CheckCircle2 } from 'lucide-react';
import type { CelestialBody } from '../types';

interface Props {
  data: CelestialBody[];
  isDarkMode: boolean;
}

export const RepositoryView = ({ data, isDarkMode }: Props) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'provenance' | 'history'>('catalog');
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Define the schema mapping
  const schemaMapping = [
    { target: 'obj_id', source: 'Gaia DR3 / Simbad ID', type: 'String', status: 'Mapped' },
    { target: 'coordinates', source: 'ICRS J2000 (Merged)', type: 'Float64', status: 'Harmonized' },
    { target: 'mag_app', source: 'Apparent Magnitude (V-Band)', type: 'Float', status: 'Calibrated' },
    { target: 'spectral_cl', source: 'MK Classification', type: 'Enum', status: 'Mapped' },
  ];

  // Simulate live terminal logs
  useEffect(() => {
    const messages = [
      "[INFO] Syncing with MAST Archive...",
      "[SUCCESS] Validated 200 records against schema v1.4",
      "[INFO] Calculating photometric redshift variances...",
      "[WARN] M31 flux outlier detected in Band 4 (ignored)",
      "[INFO] Updating provenance metadata...",
      "[SUCCESS] Data fusion complete. Ready for export."
    ];
    let i = 0;
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLogs(prev => [...prev.slice(-4), `> [${time}] ${messages[i % messages.length]}`]);
      i++;
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* HEADER SECTION */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-8 rounded-3xl border backdrop-blur-md ${isDarkMode ? 'bg-[#1a1b23]/80 border-white/10' : 'bg-white/80 border-slate-200'}`}>
        <div>
          <h2 className={`text-3xl font-black flex items-center gap-3 mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Database className="text-cyan-400" size={32} /> 
            Unified Science Archive
          </h2>
          <p className="text-slate-500 font-medium flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             Managing {data.length} harmonized celestial entities
          </p>
        </div>
        <div className="flex gap-3">
          <button className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'}`}>
            <FileJson size={18} /> JSON
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white text-sm font-bold transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-1">
            <FileSpreadsheet size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-8 border-b border-white/10 px-4">
        {['catalog', 'provenance', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab 
                ? 'text-cyan-400' 
                : isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_cyan]"></div>}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[500px]">
        
        {/* === TAB 1: CATALOG === */}
        {activeTab === 'catalog' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            {/* Catalog Info Cards */}
            <div className="md:col-span-2 space-y-6">
               <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200'}`}>
                 <h3 className={`font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                   <ShieldCheck size={20} className="text-emerald-400" /> 
                   Data Quality Assessment
                 </h3>
                 <div className="space-y-6">
                   <div>
                     <div className="flex justify-between text-sm mb-2">
                       <span className="text-slate-500 font-bold">Coordinate Precision</span>
                       <span className="text-emerald-400 font-mono">±0.001 arcsec (ICRS)</span>
                     </div>
                     <div className="w-full bg-slate-700/30 h-2 rounded-full overflow-hidden">
                       <div className="bg-gradient-to-r from-emerald-500 to-green-300 h-full w-[98%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-sm mb-2">
                       <span className="text-slate-500 font-bold">Cross-Match Confidence</span>
                       <span className="text-cyan-400 font-mono">99.4% Match Rate</span>
                     </div>
                     <div className="w-full bg-slate-700/30 h-2 rounded-full overflow-hidden">
                       <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-[94%] shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                     </div>
                   </div>
                 </div>
               </div>

               <div className={`p-0 rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200'}`}>
                 <table className="w-full text-left text-sm">
                   <thead className={`${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                     <tr className="text-slate-500">
                       <th className="p-5 font-bold uppercase text-xs tracking-wider">Standard Field</th>
                       <th className="p-5 font-bold uppercase text-xs tracking-wider">Source Origin</th>
                       <th className="p-5 font-bold uppercase text-xs tracking-wider">Type</th>
                       <th className="p-5 font-bold uppercase text-xs tracking-wider">Status</th>
                     </tr>
                   </thead>
                   <tbody className="font-mono text-xs">
                     {schemaMapping.map((row, i) => (
                       <tr key={i} className={`border-b ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'} transition-colors`}>
                         <td className="p-5 text-cyan-400 font-bold">{row.target}</td>
                         <td className={`p-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{row.source}</td>
                         <td className="p-5 text-slate-500">{row.type}</td>
                         <td className="p-5">
                           <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 flex items-center gap-1 w-fit">
                             <CheckCircle2 size={10} /> {row.status}
                           </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Side Panel: Mission Contributions */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-500/20 to-transparent border border-purple-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Zap size={100} className="text-purple-500" />
                </div>
                <h4 className="text-sm font-bold text-purple-300 mb-6 flex items-center gap-2 relative z-10">
                  <Zap size={18} /> Data Fusion Logic
                </h4>
                <div className="space-y-6 relative z-10">
                  {[
                    "Ingesting raw FITS and VO-Table files from primary mission archives.",
                    "Standardizing flux units to Janskys (Jy) for multi-wavelength comparison.",
                    "Resolving positional conflicts using a 2-arcsecond search radius."
                  ].map((step, idx) => (
                     <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-xs shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                                {idx + 1}
                            </div>
                            {idx !== 2 && <div className="w-0.5 h-full bg-purple-500/20 my-1"></div>}
                        </div>
                        <p className={`text-xs leading-relaxed py-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{step}</p>
                     </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Metadata Compliance</h4>
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-300/80 leading-relaxed font-medium">
                    All datasets comply with IVOA (International Virtual Observatory Alliance) standards for interoperability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === TAB 2: PROVENANCE (LINEAGE) === */}
        {activeTab === 'provenance' && (
          <div className="w-full h-full flex flex-col gap-8 animate-fade-in-up">
            <div className={`p-10 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'}`}>
                {/* Background decoration */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
                
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center gap-4 z-10 group">
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <Server size={32} className="text-slate-400" />
                    </div>
                    <div>
                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Raw Ingestion</h4>
                        <p className="text-xs text-slate-500 mt-1">MAST, Gaia, Chandra</p>
                    </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex flex-1 items-center justify-center relative">
                    <div className="w-full h-0.5 bg-slate-700"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="bg-[#0B0C10] px-2 text-xs text-slate-500 font-mono">ETL Process</div>
                    </div>
                    <div className="absolute right-0 w-2 h-2 bg-cyan-500 rounded-full animate-ping"></div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center gap-4 z-10 group">
                    <div className="w-20 h-20 rounded-2xl bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)] group-hover:scale-110 transition-transform duration-500">
                        <Zap size={32} className="text-cyan-400" />
                    </div>
                    <div>
                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Data Fusion</h4>
                        <p className="text-xs text-slate-500 mt-1">Unit Harmonization</p>
                    </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex flex-1 items-center justify-center relative">
                     <div className="w-full h-0.5 bg-slate-700"></div>
                     <ArrowRight className="absolute right-0 text-slate-700" size={16} />
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center gap-4 z-10 group">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-900/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform duration-500">
                        <Database size={32} className="text-emerald-400" />
                    </div>
                    <div>
                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Unified Lake</h4>
                        <p className="text-xs text-slate-500 mt-1">Parquet / JSON Store</p>
                    </div>
                </div>
            </div>
            
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'} flex items-center gap-4`}>
                <Info className="text-yellow-500" />
                <p className={`text-sm ${isDarkMode ? 'text-yellow-200/80' : 'text-yellow-700'}`}>
                    <strong>Provenance Note:</strong> This dataset was last re-calibrated using the <em>Planck 2018</em> cosmological parameters ($H_0 = 67.4$).
                </p>
            </div>
          </div>
        )}

        {/* === TAB 3: HISTORY === */}
        {activeTab === 'history' && (
          <div className="space-y-4 p-4 animate-fade-in-up">
            {[1, 2, 3].map((v) => (
              <div key={v} className={`flex items-center gap-6 p-6 rounded-2xl border transition-all cursor-pointer group ${isDarkMode ? 'bg-white/5 border-white/10 hover:border-cyan-500/50 hover:bg-white/10' : 'bg-white border-slate-200 hover:border-cyan-400 hover:shadow-lg'}`}>
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-cyan-500 transition-colors">
                  <GitBranch size={20} className="text-slate-400 group-hover:text-cyan-400" />
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Catalog Fusion v1.0.{v}</h4>
                  <p className="text-sm text-slate-500">Processed on Jan {14 - v}, 2026 • 200 Entities • <span className="text-slate-400">SHA: 7a8f9c...</span></p>
                </div>
                <div className="ml-auto text-xs font-mono font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded border border-cyan-400/20">STABLE</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER: LIVE TERMINAL */}
      <div className="fixed bottom-0 left-20 md:left-64 right-0 bg-[#090a0f] border-t border-white/10 p-2 z-40 transition-transform duration-300">
          <div className="flex items-center gap-2 px-4 mb-2 opacity-50">
              <Terminal size={12} className="text-slate-400" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">System Logs</span>
          </div>
          <div ref={scrollRef} className="h-24 overflow-y-auto px-4 font-mono text-xs space-y-1 custom-scrollbar">
              {logs.map((log, i) => (
                  <div key={i} className="text-emerald-500/80 hover:text-emerald-400 transition-colors cursor-default">
                      {log}
                  </div>
              ))}
              <div className="animate-pulse text-emerald-500">_</div>
          </div>
      </div>

    </div>
  );
};