import { useState } from 'react';
import { Database, FileJson, FileSpreadsheet, History, ShieldCheck, Zap, Info } from 'lucide-react';
import type { CelestialBody } from '../types';

interface Props {
  data: CelestialBody[];
}

export const RepositoryView = ({ data }: Props) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'provenance' | 'history'>('catalog');

  // Define the schema mapping for the "Abstract" PS requirements
  const schemaMapping = [
    { target: 'obj_id', source: 'Gaia DR3 / Simbad ID', type: 'String', status: 'Mapped' },
    { target: 'coordinates', source: 'ICRS J2000 (Merged)', type: 'Float64', status: 'Harmonized' },
    { target: 'mag_app', source: 'Apparent Magnitude (V-Band)', type: 'Float', status: 'Calibrated' },
    { target: 'spectral_cl', source: 'MK Classification', type: 'Enum', status: 'Mapped' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="text-cyan-400" /> 
            Unified Science Archive
          </h2>
          <p className="text-slate-500 text-sm">Managing {data.length} harmonized celestial entities</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-all">
            <FileJson size={16} /> JSON
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20">
            <FileSpreadsheet size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-6 border-b border-white/10 px-2">
        {['catalog', 'provenance', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 text-sm font-bold capitalize transition-all relative ${
              activeTab === tab ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_8px_cyan]"></div>}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[500px]">
        {activeTab === 'catalog' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Catalog Info Cards */}
            <div className="md:col-span-2 space-y-4">
               <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                 <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-300">
                   <ShieldCheck size={18} className="text-emerald-400" /> 
                   Data Quality Assessment
                 </h3>
                 <div className="space-y-3">
                   <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Coordinate Precision</span>
                     <span className="text-emerald-400 font-mono">±0.001 arcsec</span>
                   </div>
                   <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-emerald-500 h-full w-[98%]"></div>
                   </div>
                   <div className="flex justify-between text-sm mt-4">
                     <span className="text-slate-500">Cross-Match Confidence</span>
                     <span className="text-cyan-400 font-mono">99.4% Match Rate</span>
                   </div>
                   <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                     <div className="bg-cyan-500 h-full w-[94%]"></div>
                   </div>
                 </div>
               </div>

               <div className="p-6 rounded-2xl bg-black/40 border border-white/5 overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead>
                     <tr className="text-slate-500 border-b border-white/10">
                       <th className="pb-3 font-medium">Standard Field</th>
                       <th className="pb-3 font-medium">Source Origin</th>
                       <th className="pb-3 font-medium">Data Type</th>
                       <th className="pb-3 font-medium">Status</th>
                     </tr>
                   </thead>
                   <tbody className="font-mono">
                     {schemaMapping.map((row, i) => (
                       <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                         <td className="py-4 text-cyan-400">{row.target}</td>
                         <td className="py-4 text-slate-300">{row.source}</td>
                         <td className="py-4 text-slate-500">{row.type}</td>
                         <td className="py-4">
                           <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] uppercase font-bold border border-emerald-500/20">
                             {row.status}
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
              <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20">
                <h4 className="text-sm font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <Zap size={16} /> Data Fusion Logic
                </h4>
                <div className="text-xs text-slate-400 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center shrink-0">1</div>
                    <p>Ingesting raw FITS and VO-Table files from primary mission archives.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center shrink-0">2</div>
                    <p>Standardizing flux units to Janskys (Jy) for multi-wavelength comparison.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center shrink-0">3</div>
                    <p>Resolving positional conflicts using a 2-arcsecond search radius.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Metadata Info</h4>
                <div className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    All datasets comply with IVOA (International Virtual Observatory Alliance) standards for interoperability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4 p-4">
            {[1, 2, 3].map((v) => (
              <div key={v} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <History size={20} className="text-slate-400" />
                </div>
                <div>
                  <h4 className="font-bold">Catalog Fusion v1.0.{v}</h4>
                  <p className="text-xs text-slate-500">Processed on Jan {14 - v}, 2026 • 200 Entities</p>
                </div>
                <div className="ml-auto text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">STABLE</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};