import { useState, useMemo } from 'react';
import { Search, Sun, Moon, ChevronRight } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { StatCard } from './components/StatCard';
import { DiscoveryTable } from './components/DiscoveryTable';
import { ComparisonModal } from './components/ComparisonModal';
import type { CelestialBody, FusionResponse } from './types';

// --- MOCK DATA ---
const DISCOVERY_DATA: CelestialBody[] = [
  { name: "Sun", type: "G2V Star", temp: "5,778 K", location: "Solar System", size_rel: 109, description: "The heart of our solar system." },
  { name: "Sirius A", type: "A1V Star", temp: "9,940 K", location: "Canis Major", size_rel: 1.7, description: "The brightest star in the night sky." },
  { name: "Betelgeuse", type: "Red Supergiant", temp: "3,500 K", location: "Orion", size_rel: 764, description: "A massive star nearing the end of its life." },
  { name: "VY Canis Majoris", type: "Hypergiant", temp: "3,490 K", location: "Canis Major", size_rel: 1420, description: "One of the largest known stars." },
  { name: "Earth", type: "Terrestrial", temp: "288 K", location: "Solar System", size_rel: 1, description: "Our home planet." },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<FusionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [error, setError] = useState('');

  const suggestions = useMemo(() => 
    DISCOVERY_DATA.filter(b => b.name.toLowerCase().includes(query.toLowerCase()) && query.length > 1), 
  [query]);

  const handleSearch = async (overrideQuery?: string) => {
    const searchTerm = overrideQuery || query;
    if (!searchTerm) return;
    setLoading(true);
    setError('');
    
    try {
      // Try connecting to real backend
      const response = await fetch(`http://localhost:8000/search/${searchTerm}`);
      const result = await response.json();
      if (result.error) setError(result.error);
      else setData(result);
    } catch (err) {
      console.warn("Backend unavailable, using fallback.", err);
      // Fallback: If backend fails, we simulate a response so the UI still works
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
              <p className="text-slate-500 text-lg">Ingest, harmonize, and visualize multi-mission datasets instantly.</p>
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
          <DiscoveryTable 
            data={DISCOVERY_DATA} 
            isDarkMode={isDarkMode} 
            onSelect={setSelectedBody} 
          />
        )}

        {/* Results View (Real Search Data) */}
        {data && (
          <div className="animate-fade-in space-y-8">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <StatCard label="Object Type" value="CATALOGED" color="text-white" />
               <StatCard label="RA (deg)" value={`${data.overview.coordinates.ra}°`} color="text-cyan-400" />
               <StatCard label="DEC (deg)" value={`${data.overview.coordinates.dec}°`} color="text-purple-400" />
               <StatCard label="Reliability" value="98.2%" color="text-emerald-400" />
             </div>
             
             {error && <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl">{error}</div>}

             <button onClick={() => setData(null)} className="text-slate-500 hover:text-white flex items-center gap-2 text-sm">
               ← Back to Discovery
             </button>
          </div>
        )}
      </main>

      {/* COMPARISON MODAL */}
      {selectedBody && (
        <ComparisonModal 
          body={selectedBody} 
          isDarkMode={isDarkMode} 
          onClose={() => setSelectedBody(null)} 
        />
      )}
    </div>
  );
}