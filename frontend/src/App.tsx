import { useState, useMemo } from 'react';
import { 
  Search, Rocket, AlertCircle, LayoutDashboard, 
  Database, Settings, Activity, Star, Globe, 
  Sun, Moon, X, Maximize2, Info, ChevronRight 
} from 'lucide-react';

// --- TYPES ---
interface CelestialBody {
  name: string;
  type: string;
  temp: string;
  location: string;
  size_rel: number; // Relative to Earth (1)
  description: string;
}

interface CoordinateData { ra: number; dec: number; frame: string; }
interface OverviewData { name: string; coordinates: CoordinateData; external_links: { simbad: string }; }
interface MissionData { mission: string; instrument: string; wavelength: string; }
interface FusionResponse { overview: OverviewData; available_datasets: MissionData[]; }

// --- MOCK DATA FOR DISCOVERY ---
const DISCOVERY_DATA: CelestialBody[] = [
  { name: "Sun", type: "G2V Star", temp: "5,778 K", location: "Solar System", size_rel: 109, description: "The heart of our solar system." },
  { name: "Sirius A", type: "A1V Star", temp: "9,940 K", location: "Canis Major", size_rel: 1.7, description: "The brightest star in the night sky." },
  { name: "Betelgeuse", type: "Red Supergiant", temp: "3,500 K", location: "Orion", size_rel: 764, description: "A massive star nearing the end of its life." },
  { name: "VY Canis Majoris", type: "Hypergiant", temp: "3,490 K", location: "Canis Major", size_rel: 1420, description: "One of the largest known stars." },
  { name: "Earth", type: "Terrestrial", temp: "288 K", location: "Solar System", size_rel: 1, description: "Our home planet." },
];

// --- COMPONENTS ---

const Sidebar = () => (
  <div className="fixed left-0 top-0 h-full w-20 md:w-64 bg-slate-950/80 backdrop-blur-xl border-r border-white/10 flex flex-col z-50 transition-all duration-300">
    <div className="p-6 flex items-center gap-3 text-cyan-400 mb-6">
      <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
        <Rocket size={24} />
      </div>
      <span className="font-bold text-xl tracking-wider hidden md:block text-white uppercase">Cosmic</span>
    </div>
    <nav className="flex-1 px-4 space-y-2">
      {[
        { icon: LayoutDashboard, label: "Dashboard", active: true },
        { icon: Database, label: "Repository", active: false },
        { icon: Globe, label: "Sky Map", active: false },
        { icon: Activity, label: "Analytics", active: false },
      ].map((item, idx) => (
        <button key={idx} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group ${item.active ? 'bg-cyan-500/20 text-cyan-300 border border-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
          <item.icon size={20} />
          <span className="font-medium hidden md:block">{item.label}</span>
        </button>
      ))}
    </nav>
  </div>
);

const StatCard = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5">
    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-2xl font-mono font-bold ${color}`}>{value}</p>
  </div>
);

export default function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<FusionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);

  const suggestions = useMemo(() => 
    DISCOVERY_DATA.filter(b => b.name.toLowerCase().includes(query.toLowerCase()) && query.length > 1), 
  [query]);

  const handleSearch = async (overrideQuery?: string) => {
    const searchTerm = overrideQuery || query;
    if (!searchTerm) return;
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:8000/search/${searchTerm}`);
      const result = await response.json();
      if (result.error) setError(result.error);
      else setData(result);
    } catch (err) {
      setError("Backend Offline. Showing Discovery Mode data.");
      // Fallback: If backend fails, we simulate a response for the UI prototype
      setData({
        overview: { name: searchTerm, coordinates: { ra: 12.34, dec: -5.67, frame: "ICRS" }, external_links: { simbad: "#" } },
        available_datasets: [{ mission: "Hubble", instrument: "WFC3", wavelength: "Visible" }]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#0B0C10] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] mix-blend-screen animate-pulse ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-200/40'}`} />
        <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000 ${isDarkMode ? 'bg-purple-600/20' : 'bg-purple-200/40'}`} />
        {isDarkMode && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>}
      </div>

      <Sidebar />

      <main className="ml-20 md:ml-64 p-8 relative z-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">COSMIC Data Fusion</h1>
            <p className={`${isDarkMode ? 'text-slate-500' : 'text-slate-600'} mt-1`}>Unified Astronomical Data Processing</p>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-900 border-white/10 text-yellow-400' : 'bg-white border-slate-200 text-slate-600'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Welcome & Search Section */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          {!data && !loading && (
            <div className="mb-10 animate-fade-in">
              <h2 className="text-5xl font-black mb-4">Explore the Universe.</h2>
              <p className="text-slate-500 text-lg">Injest, harmonize, and visualize multi-mission datasets instantly.</p>
            </div>
          )}

          <div className="relative max-w-2xl mx-auto group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000`}></div>
            <div className={`relative flex rounded-2xl border shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <input 
                type="text" 
                placeholder="Search object (M31, Sun, Betelgeuse)..." 
                className="w-full bg-transparent p-5 pl-14 text-lg focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute left-5 top-5 text-slate-500" />
              
              {/* Autocomplete Suggestions */}
              {suggestions.length > 0 && (
                <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border z-50 p-2 shadow-2xl backdrop-blur-xl ${isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-200'}`}>
                  {suggestions.map(s => (
                    <button 
                      key={s.name}
                      onClick={() => { setQuery(s.name); handleSearch(s.name); }}
                      className="w-full text-left p-3 hover:bg-cyan-500/10 rounded-lg flex items-center justify-between group"
                    >
                      <span>{s.name} <span className="text-xs text-slate-500 ml-2">{s.type}</span></span>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Discovery Table (Only shows when no search result) */}
        {!data && (
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
                  {DISCOVERY_DATA.map((body) => (
                    <tr key={body.name} className="border-t border-white/5 hover:bg-cyan-500/5 transition-colors">
                      <td className="p-5 font-bold">{body.name}</td>
                      <td className="p-5 text-slate-400">{body.type}</td>
                      <td className="p-5 font-mono text-cyan-400">{body.temp}</td>
                      <td className="p-5 text-slate-400">{body.location}</td>
                      <td className="p-5">
                        <button 
                          onClick={() => setSelectedBody(body)}
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
        )}

        {/* Results View (Your existing data display) */}
        {data && (
          <div className="animate-fade-in space-y-8">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <StatCard label="Object Type" value="CATALOGED" color="text-white" />
               <StatCard label="RA (deg)" value={`${data.overview.coordinates.ra}°`} color="text-cyan-400" />
               <StatCard label="DEC (deg)" value={`${data.overview.coordinates.dec}°`} color="text-purple-400" />
               <StatCard label="Reliability" value="98.2%" color="text-emerald-400" />
             </div>
             <button onClick={() => setData(null)} className="text-slate-500 hover:text-white flex items-center gap-2 text-sm">
               ← Back to Discovery
             </button>
          </div>
        )}
      </main>

      {/* COMPARISON MODAL */}
      {selectedBody && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
          <div className={`w-full max-w-2xl rounded-3xl border p-8 relative animate-fade-in ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setSelectedBody(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white">
              <X size={24} />
            </button>
            
            <div className="flex gap-8 items-start">
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-2">{selectedBody.name}</h2>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-bold uppercase">{selectedBody.type}</span>
                <p className="mt-6 text-slate-400 leading-relaxed">{selectedBody.description}</p>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-xs text-slate-500 uppercase">Surface Temp</p>
                    <p className="text-xl font-mono">{selectedBody.temp}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-xs text-slate-500 uppercase">Rel. Size (Earth=1)</p>
                    <p className="text-xl font-mono">{selectedBody.size_rel.toLocaleString()}x</p>
                  </div>
                </div>
              </div>

              {/* Visual Comparison Area */}
              <div className="w-48 h-64 bg-black/20 rounded-2xl border border-white/5 flex flex-col items-center justify-end p-4 gap-4 overflow-hidden relative">
                <div className="absolute top-4 left-4 text-[10px] text-slate-600 uppercase font-bold">Scale Comparison</div>
                
                {/* The Celestial Body */}
                <div 
                  className="bg-gradient-to-tr from-orange-500 to-yellow-300 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all duration-700"
                  style={{ 
                    width: `${Math.min(120, selectedBody.size_rel * 2)}px`, 
                    height: `${Math.min(120, selectedBody.size_rel * 2)}px` 
                  }}
                />
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{selectedBody.name}</p>

                <div className="w-full h-[1px] bg-white/10" />

                {/* Earth (The Dot) */}
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_5px_cyan]" />
                <p className="text-[10px] text-cyan-400 font-bold">EARTH</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}