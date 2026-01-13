import { Info } from 'lucide-react';
import type { CelestialBody } from '../types';

interface Props {
  data: CelestialBody[];
  isDarkMode: boolean;
  onSelect: (body: CelestialBody) => void;
}

export const DiscoveryTable = ({ data, isDarkMode, onSelect }: Props) => (
  <div className="animate-fade-in">
    <h3 className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-6 font-bold">Standardized Catalog Samples</h3>
    <div className={`rounded-3xl border overflow-hidden backdrop-blur-md ${isDarkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200'}`}>
      <table className="w-full text-left border-collapse">
        <thead className={isDarkMode ? 'bg-white/5' : 'bg-slate-100'}>
          <tr className="text-xs uppercase text-slate-500">
            <th className="p-5">Body Name</th>
            <th className="p-5">Type</th>
            <th className="p-5">Temperature</th>
            <th className="p-5">Location</th>
            <th className="p-5">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((body) => (
            <tr key={body.name} className="border-t border-white/5 hover:bg-cyan-500/5 transition-colors">
              <td className="p-5 font-bold">{body.name}</td>
              <td className="p-5 text-slate-400">{body.type}</td>
              <td className="p-5 font-mono text-cyan-400">{body.temp}</td>
              <td className="p-5 text-slate-400">{body.location}</td>
              <td className="p-5">
                <button 
                  onClick={() => onSelect(body)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300"
                >
                  <Info size={14} /> Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);