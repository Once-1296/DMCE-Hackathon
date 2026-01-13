import { useState } from 'react';
import { 
  Search, Rocket, AlertCircle, LayoutDashboard, 
  Database, Settings, Activity, Star, Globe 
} from 'lucide-react';

// --- TYPES ---
interface CoordinateData {
  ra: number;
  dec: number;
  frame: string;
}

interface OverviewData {
  name: string;
  coordinates: CoordinateData;
  external_links: { simbad: string };
}

interface MissionData {
  mission: string;
  instrument: string;
  wavelength: string;
}

interface FusionResponse {
  overview: OverviewData;
  available_datasets: MissionData[];
}

// --- COMPONENTS ---

// 1. Sidebar Component
const Sidebar = () => (
  <div className="fixed left-0 top-0 h-full w-20 md:w-64 bg-slate-950/80 backdrop-blur-xl border-r border-white/10 flex flex-col z-50 transition-all duration-300">
    <div className="p-6 flex items-center gap-3 text-cyan-400 mb-6">
      <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
        <Rocket size={24} />
      </div>
      <span className="font-bold text-xl tracking-wider hidden md:block text-white">COSMIC</span>
    </div>
    
    <nav className="flex-1 px-4 space-y-2">
      {[
        { icon: LayoutDashboard, label: "Dashboard", active: true },
        { icon: Database, label: "Data Repository", active: false },
        { icon: Globe, label: "Sky Map", active: false },
        { icon: Activity, label: "Analytics", active: false },
      ].map((item, idx) => (
        <button 
          key={idx}
          className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group
            ${item.active 
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-white/5 shadow-lg shadow-cyan-900/20' 
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
        >
          <item.icon size={20} className={item.active ? "text-cyan-400" : "text-slate-500 group-hover:text-white"} />
          <span className="font-medium hidden md:block">{item.label}</span>
        </button>
      ))}
    </nav>

    <div className="p-4 border-t border-white/10">
      <button className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
        <Settings size={20} />
        <span className="hidden md:block">Settings</span>
      </button>
    </div>
  </div>
);

// 2. Stat Card Component
const StatCard = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-2xl font-mono font-bold ${color}`}>{value}</p>
  </div>
);

export default function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<FusionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch(`http://localhost:8000/search/${query}`);
      const result = await response.json();
      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      console.error(err);
      setError("Fusion Engine Offline. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white selection:bg-cyan-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
      </div>

      <Sidebar />

      {/* Main Content Area */}
      <main className="ml-20 md:ml-64 p-8 relative z-10">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Cosmic Data Fusion
            </h1>
            <p className="text-slate-500 mt-1">Unified Astronomical Data Processing Platform</p>
          </div>
          <div className="flex gap-4">
             {/* Mock Profile Badge */}
             <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 p-[1px]">
               <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold">MH</div>
             </div>
          </div>
        </header>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
              <input 
                type="text" 
                placeholder="Search astronomical object (e.g. M31, Vega)..." 
                className="w-full bg-transparent p-5 pl-14 text-lg text-white placeholder:text-slate-500 focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute left-5 top-5 text-slate-500" />
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="px-8 bg-slate-800 hover:bg-slate-700 border-l border-slate-700 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Search <Rocket size={18} className="text-cyan-400" /></>
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 animate-fade-in">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
        </div>

        {/* Data Display */}
        {data && (
          <div className="animate-fade-in space-y-8">
            
            {/* 1. Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Object Type" value="GALAXY" color="text-white" />
              <StatCard label="Right Ascension" value={`${data.overview.coordinates.ra.toFixed(4)}°`} color="text-cyan-400" />
              <StatCard label="Declination" value={`${data.overview.coordinates.dec.toFixed(4)}°`} color="text-purple-400" />
              <StatCard label="Missions Found" value={data.available_datasets.length.toString()} color="text-emerald-400" />
            </div>

            {/* 2. Main Detail Panels */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left: Overview Card */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    Target Identity
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-slate-500 text-sm">Official Designation</p>
                      <p className="text-2xl font-medium tracking-tight mt-1">{data.overview.name}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Database Reference</p>
                      <a 
                        href={data.overview.external_links.simbad}
                        target="_blank"
                        className="text-cyan-400 hover:text-cyan-300 underline text-sm flex items-center gap-1 mt-1"
                      >
                        SIMBAD Entry <ArrowUpRightIcon />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Mission Table */}
              <div className="lg:col-span-2">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Database size={20} className="text-purple-400" />
                    Available Mission Data
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-white/5">
                          <th className="pb-4 pl-2">Mission</th>
                          <th className="pb-4">Instrument</th>
                          <th className="pb-4">Wavelength (nm)</th>
                          <th className="pb-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {data.available_datasets.length === 0 ? (
                          <tr><td colSpan={4} className="py-8 text-center text-slate-500">No public datasets found in this sector.</td></tr>
                        ) : (
                          data.available_datasets.map((row, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                              <td className="py-4 pl-2 font-medium text-white group-hover:text-cyan-400 transition-colors">{row.mission}</td>
                              <td className="py-4 text-slate-300">{row.instrument}</td>
                              <td className="py-4 font-mono text-slate-400">{row.wavelength}</td>
                              <td className="py-4">
                                <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                                  Archived
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper icon component
const ArrowUpRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M7 7h10v10"/>
  </svg>
);