import { useState, useMemo } from 'react';
import { Search, Sun, Moon, ChevronRight, AlertTriangle } from 'lucide-react';

// Component Imports
import { Sidebar } from './components/Sidebar';
import { DiscoveryTable } from './components/DiscoveryTable';
import { ComparisonModal } from './components/ComparisonModal';
import { AnalyticsView } from './components/AnalyticsView';
import { SkyMapView } from './components/SkyMapView';
import { RepositoryView } from './components/RepositoryView';
import { IngestionEngine } from './components/IngestionEngine';
import { AIInsights } from './components/AIInsights';
import { MissionControl } from './components/MissionControl';

// Data & Types
// Note: Using 'import type' ensures these are stripped out during compilation, 
// preventing "value never used" errors in some bundlers.
import { generateCosmicData } from './utils/mockDataGenerator';
import type { CelestialBody, FusionResponse, View } from './types';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [currentView, setCurrentView] = useState<View>('discovery');
  const [query, setQuery] = useState('');
  const [data, setData] = useState<FusionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [error, setError] = useState('');

  // 1. GENERATE MOCK DATA (Memoized to prevent regeneration on render)
  const vastData = useMemo(() => generateCosmicData(200), []);

  // 2. SEARCH SUGGESTIONS LOGIC
  const suggestions = useMemo(() => 
    vastData.filter(b => b.name.toLowerCase().includes(query.toLowerCase()) && query.length > 1), 
  [query, vastData]);

  // 3. SEARCH HANDLER
  const handleSearch = async (overrideQuery?: string) => {
    const searchTerm = overrideQuery || query;
    if (!searchTerm) return;
    setLoading(true);
    setError('');
    
    try {
      // Simulating an API call
      const response = await fetch(`http://localhost:8000/search/${searchTerm}`);
      const result = await response.json();
      if (result.error) setError(result.error);
      else setData(result);
    } catch (err) {
      console.warn("Backend unavailable, using fallback mock data.");
      // Fallback for demo purposes
      setData({
        overview: { name: searchTerm, coordinates: { ra: 12.34, dec: -5.67, frame: "ICRS" }, external_links: { simbad: "#" } },
        available_datasets: [{ mission: "Hubble", instrument: "WFC3", wavelength: "Visible" }]
      });
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-[#0B0C10] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] mix-blend-screen animate-pulse ${isDarkMode ? 'bg-blue-600/10' : 'bg-blue-200/40'}`} />
        <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000 ${isDarkMode ? 'bg-purple-600/10' : 'bg-purple-200/40'}`} />
      </div>

      {/* Navigation Sidebar */}
      <Sidebar activeView={currentView} onViewChange={setCurrentView} />

      <main className="ml-20 md:ml-64 p-8 relative z-10">
        
        {/* HEADER SECTION */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                COSMIC Data Fusion
              </h1>
              <span className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-mono tracking-tighter uppercase">
                v1.0.4-beta
              </span>
              {/* Conflict Warning Indicator */}
              {vastData.some(d => d.has_conflict) && (
                 <span className="flex items-center gap-1 px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-400 font-mono uppercase font-bold animate-pulse">
                   <AlertTriangle size={10} /> Conflict Detected
                 </span>
              )}
            </div>
            <p className={`${isDarkMode ? 'text-slate-500' : 'text-slate-600'} mt-1 font-medium`}>
              {currentView === 'discovery' && "Unified Astronomical Data Processing"}
              {currentView === 'analytics' && "Cross-Mission Statistical Analysis"}
              {currentView === 'skymap' && "Spatial Coordinate Projection"}
              {currentView === 'repository' && "Fused Dataset Archive & Provenance"}
              {currentView === 'ingestion' && "Raw Data Intake & Harmonization Pipeline"}
              {currentView === 'ai' && "Predictive Anomaly Detection Engine"}
            </p>
          </div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-slate-900 border-white/10 text-yellow-400 shadow-lg shadow-black/50' : 'bg-white border-slate-200 text-slate-600 shadow-md'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* --- VIEW ROUTER --- */}

        {/* 1. MISSION CONTROL (DASHBOARD) */}
        {['repository', 'ingestion', 'ai'].includes(currentView) && (
            <div className="mb-8">
              <MissionControl isDarkMode={isDarkMode} />
            </div>
        )}

        {/* 2. INGESTION ENGINE */}
        {currentView === 'ingestion' && <IngestionEngine />}

        {/* 3. AI INSIGHTS */}
        {currentView === 'ai' && (
          <AIInsights data={vastData} isDarkMode={isDarkMode} />
        )}

        {/* 4. DISCOVERY (HOME) */}
        {currentView === 'discovery' && (
          <div className="animate-fade-in">
            <div className="max-w-4xl mx-auto mb-16 text-center">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in">{error}</div>
              )}
              {!data && !loading && (
                <div className="mb-10 animate-fade-in">
                  <h2 className={`text-5xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Explore the <span className="text-cyan-500">Cosmos.</span>
                  </h2>
                  <p className="text-slate-500 text-lg">Ingest, harmonize, and visualize multi-mission datasets instantly.</p>
                </div>
              )}

              <div className="relative max-w-2xl mx-auto group z-50">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
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
                  
                  {suggestions.length > 0 && (
                    <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border p-2 shadow-2xl backdrop-blur-xl ${isDarkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'}`}>
                      {suggestions.slice(0, 6).map(s => (
                        <button 
                          key={s.id}
                          onClick={() => { setQuery(s.name); handleSearch(s.name); }}
                          className="w-full text-left p-3 hover:bg-cyan-500/10 rounded-lg flex items-center justify-between group transition-colors"
                        >
                          <span className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                            {s.name} <span className="text-xs text-slate-500 ml-2">{s.type}</span>
                          </span>
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DiscoveryTable 
              data={vastData} 
              isDarkMode={isDarkMode} 
              onSelect={setSelectedBody} 
            />
          </div>
        )}

        {/* 5. ANALYTICS */}
        {currentView === 'analytics' && <AnalyticsView data={vastData} isDarkMode={isDarkMode} />}

        {/* 6. SKY MAP */}
        {currentView === 'skymap' && <SkyMapView data={vastData} onSelect={setSelectedBody} />}

        {/* 7. REPOSITORY */}
        {currentView === 'repository' && <RepositoryView data={vastData} isDarkMode={isDarkMode} />}

      </main>

      {/* GLOBAL MODAL */}
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