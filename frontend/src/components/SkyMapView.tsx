import { useState, useRef, useMemo, useEffect } from 'react';
import { Maximize, ZoomIn, ZoomOut, Move, Compass, Loader2, Sparkles } from 'lucide-react';
import type { CelestialBody } from '../types';

interface Props {
  data: CelestialBody[];
  onSelect: (body: CelestialBody) => void;
  isDarkMode: boolean;
}

// --- UTILITY: SEEDED RANDOM GENERATOR ---
// This ensures the stars are random BUT stay in the same place every time you load the app.
// We avoid "grouping" by using a high-quality pseudo-random algorithm.
const mulberry32 = (a: number) => {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// --- VISUAL ASSETS ---
const GALAXY_SVG = (color: string) => (
  <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow opacity-90">
    <defs>
      <radialGradient id={`grad-${color}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    <path d="M50 50 m-45 0 a 45 45 0 1 0 90 0 a 45 45 0 1 0 -90 0" fill="none" stroke={`url(#grad-${color})`} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3"/>
    <path d="M50 50 m-30 0 a 30 30 0 1 1 60 0 a 30 30 0 1 1 -60 0" fill="none" stroke={color} strokeWidth="2" strokeDasharray="10 20" />
    <circle cx="50" cy="50" r="8" fill="white" className="blur-[2px]" />
  </svg>
);

export const SkyMapView = ({ data, onSelect, isDarkMode }: Props) => {
  // --- STATE ---
  // Start at a very low scale (0.08) to see the WHOLE map initially
  const [scale, setScale] = useState(0.08); 
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // System State
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- ENGINE: GENERATE THE UNIVERSE ---
  // We map the data onto a massive 100,000px x 80,000px canvas
  const universe = useMemo(() => {
    // Initialize our seeded random generator
    const seed = 12345; // Fixed seed = consistent universe
    const rand = mulberry32(seed);

    const CANVAS_WIDTH = 60000;
    const CANVAS_HEIGHT = 40000;

    return data.map((star) => {
      // Generate truly random positions using the seeded generator
      // We subtract half width/height to center the universe at (0,0)
      const x = (rand() * CANVAS_WIDTH) - (CANVAS_WIDTH / 2);
      const y = (rand() * CANVAS_HEIGHT) - (CANVAS_HEIGHT / 2);

      // Determine visual identity based on data attributes
      let visualType = 'star';
      if (star.size_rel > 150) visualType = 'galaxy';
      else if (star.temp.includes('2,') || star.size_rel < 0.8) visualType = 'planet';

      return { ...star, x, y, visualType };
    });
  }, [data]);

  // Generate filler stars (background noise) just once
  const backgroundStars = useMemo(() => {
    const rand = mulberry32(9999); // Different seed for background
    return Array.from({ length: 2000 }).map((_, i) => ({
      id: `bg-${i}`,
      x: (rand() * 80000) - 40000,
      y: (rand() * 60000) - 30000,
      size: rand() * 3,
      opacity: rand() * 0.4
    }));
  }, []);

  useEffect(() => {
    // Quick boot sequence
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // --- CONTROLS: MOUSE & ZOOM PHYSICS ---
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    // Smoother Zoom Logic
    const zoomSensitivity = 0.001; 
    const delta = -e.deltaY * zoomSensitivity * scale; // Scale factor makes zoom faster when zoomed out
    
    // Limits: 0.02 (See Galaxy) to 4.0 (See Planet Surface)
    const newScale = Math.min(Math.max(0.02, scale + delta), 4);
    setScale(newScale);
  };

  return (
    <div className={`relative h-[calc(100vh-140px)] w-full rounded-3xl overflow-hidden border shadow-2xl transition-colors select-none ${isDarkMode ? 'bg-[#000000] border-slate-800' : 'bg-[#02040a] border-slate-700'}`}>
      
      {/* LOADING OVERLAY */}
      {!isReady && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <Loader2 className="animate-spin text-cyan-500 mb-4" size={40} />
          <p className="text-cyan-500 font-mono text-sm tracking-[0.2em] animate-pulse">BOOTING NAV-SYSTEM...</p>
        </div>
      )}

      {/* --- HUD CONTROLS --- */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-2 rounded-xl flex flex-col shadow-2xl">
          <button onClick={() => setScale(s => Math.min(s * 1.5, 4))} className="p-3 hover:bg-white/10 rounded-lg text-cyan-400 active:scale-95 transition-all"><ZoomIn size={20} /></button>
          <button onClick={() => setScale(s => Math.max(s / 1.5, 0.02))} className="p-3 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white active:scale-95 transition-all"><ZoomOut size={20} /></button>
          <div className="h-px bg-white/10 my-1"></div>
          <button onClick={() => { setPosition({x:0,y:0}); setScale(0.08); }} className="p-3 hover:bg-white/10 rounded-lg text-white active:scale-95 transition-all" title="Reset Universe"><Maximize size={20} /></button>
        </div>
      </div>

      {/* --- HUD INFO --- */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
         <h1 className="text-4xl font-black text-white/10 tracking-tighter select-none">SECTOR 7G</h1>
      </div>

      <div className="absolute top-6 right-6 z-20 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-4 text-[10px] font-mono tracking-widest uppercase">
           <span className="text-slate-400 flex items-center gap-2"><Move size={10} /> POS: {Math.round(position.x)},{Math.round(position.y)}</span>
           <span className="w-px h-3 bg-white/20"></span>
           <span className={scale > 1 ? "text-red-400" : "text-cyan-400"}>ZOOM: {(scale * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* --- THE INFINITE CANVAS --- */}
      <div 
        ref={containerRef}
        className="w-full h-full cursor-move relative overflow-hidden bg-black"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        
        {/* PARALLAX GRID (Moves slightly slower for depth) */}
        <div 
           className="absolute inset-0 pointer-events-none opacity-20"
           style={{ 
             backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
             backgroundSize: `${100 * scale}px ${100 * scale}px`,
             backgroundPosition: `${position.x}px ${position.y}px`
           }}
        />

        {/* --- VIEWPORT CONTAINER --- */}
        {/* This div applies the Pan/Zoom Transform to everything inside */}
        <div 
          className="absolute left-1/2 top-1/2 w-0 h-0 will-change-transform transform-gpu"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
          }}
        >

            {/* 1. BACKGROUND STARS (Static Filler) */}
            {isReady && backgroundStars.map((star) => (
               <div 
                  key={star.id}
                  className="absolute bg-white rounded-full pointer-events-none"
                  style={{
                    left: star.x,
                    top: star.y,
                    width: `${star.size * 5}px`, // Make them big enough to see when zoomed out
                    height: `${star.size * 5}px`,
                    opacity: star.opacity
                  }}
               />
            ))}

            {/* 2. MAIN DATA OBJECTS */}
            {isReady && universe.map((obj) => {
              // --- DYNAMIC LOD CALCULATION ---
              // Determine size based on zoom to keep them visible at 0 zoom
              // At low zoom (scale < 0.1), size is fixed so they don't disappear
              const displaySize = scale < 0.1 
                ? (obj.visualType === 'galaxy' ? 400 : 150) // Giant dots when zoomed out
                : (obj.visualType === 'galaxy' ? 80 : Math.max(10, obj.size_rel * 2)); // Normal size when zoomed in

              return (
                <div
                  key={obj.id}
                  onClick={(e) => { e.stopPropagation(); onSelect(obj); }}
                  className="absolute flex flex-col items-center justify-center group hover:z-[100] cursor-pointer"
                  style={{
                    transform: `translate(${obj.x}px, ${obj.y}px)`,
                  }}
                >
                  
                  {/* GRAPHIC RENDERER */}
                  <div 
                     className="transition-transform duration-300 hover:scale-[2]"
                     style={{
                       width: `${displaySize}px`,
                       height: `${displaySize}px`,
                     }}
                  >
                     {obj.visualType === 'galaxy' ? (
                       GALAXY_SVG(obj.color)
                     ) : obj.visualType === 'planet' ? (
                       <div className="w-full h-full rounded-full border-2 border-white/20 relative" style={{background: obj.color}}>
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/60 to-transparent"></div>
                       </div>
                     ) : (
                       // Standard Star
                       <div className="relative w-full h-full flex items-center justify-center">
                          {/* Glow (Visible at distance) */}
                          <div className="absolute inset-0 rounded-full blur-xl opacity-50" style={{backgroundColor: obj.color}}></div>
                          {/* Core */}
                          <div className="w-[40%] h-[40%] rounded-full bg-white shadow-[0_0_20px_white]"></div>
                       </div>
                     )}
                  </div>

                  {/* LABEL (Only visible when Scale > 0.4) */}
                  <div className={`mt-4 pointer-events-none transition-all duration-300 flex flex-col items-center 
                    ${scale > 0.4 ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100'}`}>
                    
                    <span className="text-[20px] font-black text-white whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {obj.name}
                    </span>
                    
                    {scale > 1.0 && (
                      <span className="text-[10px] font-mono text-cyan-300 bg-black/50 px-2 rounded border border-cyan-500/30 mt-1">
                        {obj.distance} • {obj.temp}
                      </span>
                    )}
                  </div>

                </div>
              );
            })}

        </div>
      </div>
    </div>
  );
};