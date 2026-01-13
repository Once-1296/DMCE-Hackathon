import { useState, useMemo } from 'react';
import { Maximize, ZoomIn, ZoomOut, Crosshair, Map } from 'lucide-react';
import type { CelestialBody } from '../types';

interface Props {
  data: CelestialBody[];
  onSelect: (body: CelestialBody) => void;
}

export const SkyMapView = ({ data, onSelect }: Props) => {
  const [zoom, setZoom] = useState(1);
  const [hoveredStar, setHoveredStar] = useState<(CelestialBody & { x: number; y: number }) | null>(null);

  // Filter only stars that have valid coordinates for the map
  const mapData = useMemo(() => {
    return data.map(star => {
      // Simulate mapping Mock Data RA/Dec to percentages
      // Real RA is 0-360, Real Dec is -90 to +90
      // We use random fallbacks if the mock string is complex
      const raRaw = parseFloat(star.location.replace(/[^0-9.]/g, '')) || Math.random() * 360;
      const decRaw = parseFloat(star.size_rel.toString()) || Math.random() * 90;
      
      return {
        ...star,
        x: (raRaw % 100), // Simplified mapping for demo 0-100%
        y: (decRaw % 100)
      };
    });
  }, [data]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in relative">
      
      {/* TOOLBAR */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="bg-black/80 backdrop-blur-md border border-white/20 p-2 rounded-lg flex flex-col gap-2">
          <button 
            onClick={() => setZoom(z => Math.min(z + 0.5, 4))}
            className="p-2 hover:bg-white/10 rounded text-cyan-400 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button 
            onClick={() => setZoom(z => Math.max(z - 0.5, 1))}
            className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <div className="h-px bg-white/20 my-1"></div>
          <button 
            onClick={() => setZoom(1)}
            className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"
            title="Reset View"
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>

      {/* INFO PANEL (Top Right) */}
      <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-3">
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
           <span className="text-xs font-mono text-slate-300">LIVE FEED: TESS SECTOR 4</span>
         </div>
         <div className="h-4 w-px bg-white/20"></div>
         <span className="text-xs font-mono text-cyan-400">{data.length} OBJECTS</span>
      </div>

      {/* THE MAP CANVAS */}
      <div className="flex-1 bg-[#050505] relative overflow-hidden rounded-3xl border border-white/10 cursor-crosshair group">
        
        {/* GRID LINES (Scientific Overlay) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{ 
            backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
            backgroundSize: `${100 * zoom}px ${100 * zoom}px`,
            transform: `scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        ></div>

        {/* Central Axis Lines */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-500/30 pointer-events-none"></div>
        <div className="absolute left-1/2 top-0 h-full w-px bg-cyan-500/30 pointer-events-none"></div>

        {/* THE STARS */}
        <div 
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          {mapData.map((star, i) => (
            <button
              key={i}
              onClick={() => onSelect(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(null)}
              className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 hover:z-50 focus:outline-none transition-all duration-300 hover:scale-[5]"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${Math.max(2, star.size_rel / 200)}px`, // Size based on real relative size
                height: `${Math.max(2, star.size_rel / 200)}px`,
                backgroundColor: star.color,
                boxShadow: `0 0 ${star.size_rel / 50}px ${star.color}`
              }}
            >
              {/* Target Reticle (Only appears on hover) */}
              <div className="absolute -inset-4 border border-cyan-500/50 rounded-full opacity-0 hover:opacity-100 scale-0 hover:scale-100 transition-all duration-300"></div>
            </button>
          ))}
        </div>

        {/* HOVER TOOLTIP (Follows Mouse or Fixed Position) */}
        {hoveredStar && (
          <div 
            className="absolute z-50 pointer-events-none bg-black/90 border border-cyan-500/30 p-3 rounded-lg backdrop-blur-xl"
            style={{ 
              left: `${hoveredStar.x}%`, 
              top: `${hoveredStar.y}%`,
              transform: `translate(20px, -20px)` // Offset slightly from the star
            }}
          >
            <h4 className="font-bold text-white text-sm">{hoveredStar.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] bg-white/10 px-1 rounded text-cyan-300">{hoveredStar.type}</span>
              <span className="text-[10px] text-slate-400">{hoveredStar.temp}</span>
            </div>
          </div>
        )}
        
      </div>

      {/* FOOTER LEGEND */}
      <div className="mt-4 flex justify-between items-center text-xs text-slate-500 font-mono">
        <div className="flex gap-4">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_5px_blue]"></div> HOT (O/B)</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_5px_yellow]"></div> AVG (G/F)</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_red]"></div> COOL (M/K)</span>
        </div>
        <div>
          PROJECTION: AITOFF-HAMMER [ICRS J2000]
        </div>
      </div>
    </div>
  );
};