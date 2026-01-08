import { useState } from 'react';
import { Search, Rocket, AlertCircle } from 'lucide-react';

// Types for our data to keep TypeScript happy
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

function App() {
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

      // DEBUG LOGGING HERE
      console.log("Backend Response:", result); // <--- Check your browser console!

      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to Fusion Engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
            COSMIC Data Fusion
          </h1>
          <p className="text-slate-400">Unified Astronomical Data Processing Platform</p>
        </header>

        {/* Search Bar */}
        <div className="flex gap-4 mb-10 justify-center">
          <div className="relative w-full max-w-lg">
            <input 
              type="text" 
              placeholder="Enter object (e.g., M31, Vega, Kepler-186)" 
              className="w-full p-4 pl-12 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute left-4 top-4.5 text-slate-500" size={20} />
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-8 py-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? "Scanning..." : "Search"}
            {!loading && <Rocket size={18} />}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg flex items-center gap-3 mb-8 text-red-200">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Results Dashboard */}
        {data && (
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            
            {/* Left Panel: Overview */}
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-blue-400 mb-4 border-b border-slate-700 pb-2">Target Overview</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Object Name</span>
                  <span className="font-mono text-lg">{data.overview.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Right Ascension</span>
                  <span className="font-mono text-emerald-400">{data.overview.coordinates.ra.toFixed(5)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Declination</span>
                  <span className="font-mono text-emerald-400">{data.overview.coordinates.dec.toFixed(5)}°</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <a 
                    href={data.overview.external_links.simbad} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 underline"
                  >
                    View on SIMBAD Database &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Right Panel: Mission Data */}
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-purple-400 mb-4 border-b border-slate-700 pb-2">Mission Data (NASA MAST)</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {data.available_datasets.length === 0 ? (
                  <p className="text-slate-500 italic">No public mission data found in this region.</p>
                ) : (
                  data.available_datasets.map((mission, idx) => (
                    <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-700 hover:border-purple-500 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">{mission.mission}</span>
                        <span className="text-xs bg-purple-900 text-purple-200 px-2 py-0.5 rounded-full">{mission.instrument}</span>
                      </div>
                      <div className="text-xs text-slate-400">Range: {mission.wavelength}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default App