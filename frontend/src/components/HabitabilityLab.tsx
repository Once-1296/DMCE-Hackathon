import { Scale } from 'lucide-react';
import { Scale as Weight } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Thermometer, Wind, Droplets, AlertTriangle, CheckCircle2, FlaskConical, Atom } from 'lucide-react';

export const HabitabilityLab = () => {
  // --- SIMULATION STATE ---
  const [distance, setDistance] = useState(1.0); // AU (Astronomical Units)
  const [mass, setMass] = useState(1.0); // Earth Mass
  const [atmosphere, setAtmosphere] = useState(1.0); // ATM
  const [water, setWater] = useState(70); // Percentage

  // --- PHYSICS ENGINE ---
  const stats = useMemo(() => {
    // 1. Surface Temp Calculation (Simplified Stefan-Boltzmann)
    // Base temp at 1 AU is ~255K (-18C).
    // Greenhouse effect adds temp based on atmosphere density.
    const baseTempK = 278 / Math.sqrt(distance); 
    const greenhouseEffect = atmosphere * 35; // Each ATM adds ~35K (Earth-like approximation)
    const surfaceTempK = baseTempK + greenhouseEffect;
    const surfaceTempC = surfaceTempK - 273.15;

    // 2. Gravity Calculation (g = M/r^2, assuming density is constant-ish)
    // Simplified: Gravity scales roughly with Mass^(1/3) if density is Earth-like
    const gravityG = Math.pow(mass, 0.4); 

    // 3. Habitability Score (0 to 100)
    let score = 100;
    
    // Penalize for Temperature (Ideal: 15C, Limits: 0 to 50)
    const tempDiff = Math.abs(surfaceTempC - 15);
    if (tempDiff > 50) score -= 100; // Dead zone
    else score -= tempDiff * 2;

    // Penalize for Gravity (Ideal: 1G, Limits: 0.5 to 2.0)
    const gravDiff = Math.abs(gravityG - 1);
    if (gravDiff > 1.5) score -= 50;
    else score -= gravDiff * 20;

    // Penalize for Atmosphere (Ideal: 1 ATM)
    if (atmosphere < 0.1 || atmosphere > 5) score -= 40;

    // Penalize for Water (Ideal: 70%)
    if (water < 10) score -= 50; // Too dry
    if (water > 95) score -= 20; // Ocean world (mostly okay but hard for land life)

    return {
      temp: Math.round(surfaceTempC),
      gravity: gravityG.toFixed(2),
      score: Math.max(0, Math.round(score)),
      state: surfaceTempC > 100 ? 'STEAM' : surfaceTempC < -10 ? 'ICE' : 'LIQUID'
    };
  }, [distance, mass, atmosphere, water]);

  // --- VISUAL FEEDBACK COLORS ---
  const planetColor = useMemo(() => {
    if (stats.temp > 100) return 'from-red-600 via-orange-500 to-yellow-500'; // Magma/Venus
    if (stats.temp > 40) return 'from-orange-400 via-yellow-300 to-amber-600'; // Desert/Dune
    if (stats.temp < -20) return 'from-cyan-200 via-blue-300 to-white'; // Iceball/Hoth
    if (water < 10) return 'from-stone-600 via-stone-500 to-stone-400'; // Mars-like Rock
    if (atmosphere > 4) return 'from-purple-400 via-indigo-400 to-gray-400'; // Gas Giant-ish
    return 'from-green-500 via-cyan-500 to-blue-600'; // Earth-like
  }, [stats.temp, water, atmosphere]);

  return (
    <div className="w-full h-[600px] flex gap-6 p-6 bg-[#050505] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* --- LEFT: CONTROLS --- */}
      <div className="w-1/3 flex flex-col gap-6 z-10">
        <div className="flex items-center gap-3 mb-2">
           <FlaskConical className="text-cyan-400" />
           <h2 className="text-2xl font-bold text-white tracking-wider">GENESIS <span className="text-cyan-400">LAB</span></h2>
        </div>

        {/* SLIDER 1: DISTANCE */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2"><Atom size={14}/> ORBIT DISTANCE</span>
            <span className="text-cyan-300">{distance} AU</span>
          </div>
          <input 
            type="range" min="0.3" max="3.0" step="0.1" 
            value={distance} onChange={(e) => setDistance(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
          />
        </div>

        {/* SLIDER 2: MASS */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2"><Weight size={14}/> PLANETARY MASS</span>
            <span className="text-cyan-300">{mass} x Earth</span>
          </div>
          <input 
            type="range" min="0.1" max="5.0" step="0.1" 
            value={mass} onChange={(e) => setMass(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
          />
        </div>

        {/* SLIDER 3: ATMOSPHERE */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2"><Wind size={14}/> ATMOSPHERE</span>
            <span className="text-cyan-300">{atmosphere} ATM</span>
          </div>
          <input 
            type="range" min="0.0" max="5.0" step="0.1" 
            value={atmosphere} onChange={(e) => setAtmosphere(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
          />
        </div>

        {/* SLIDER 4: WATER */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2"><Droplets size={14}/> SURFACE WATER</span>
            <span className="text-cyan-300">{water}%</span>
          </div>
          <input 
            type="range" min="0" max="100" step="5" 
            value={water} onChange={(e) => setWater(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
          />
        </div>

        {/* RESULTS PANEL */}
        <div className="mt-auto bg-slate-900/50 p-4 rounded-xl border border-slate-700 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-4">
             <div>
                <p className="text-[10px] text-slate-500 uppercase">Surface Temp</p>
                <p className={`text-xl font-mono font-bold ${stats.temp > 50 ? 'text-red-400' : stats.temp < 0 ? 'text-blue-300' : 'text-green-400'}`}>
                   {stats.temp}°C
                </p>
             </div>
             <div>
                <p className="text-[10px] text-slate-500 uppercase">Gravity</p>
                <p className={`text-xl font-mono font-bold ${parseFloat(stats.gravity) > 2 ? 'text-red-400' : 'text-white'}`}>
                   {stats.gravity} G
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT: SIMULATOR VISUALIZER --- */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-black/40 rounded-2xl border border-white/5 shadow-inner">
        
        {/* THE PLANET (CSS GEN) */}
        <div className="relative group cursor-help transition-all duration-1000">
           {/* Atmosphere Glow */}
           <div className={`absolute -inset-4 rounded-full blur-xl opacity-40 transition-colors duration-1000 ${atmosphere < 0.2 ? 'bg-transparent' : 'bg-cyan-400'}`}></div>
           
           {/* The Planet Body */}
           <div 
             className={`w-64 h-64 rounded-full shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.9)] bg-gradient-to-br ${planetColor} transition-colors duration-1000 relative overflow-hidden`}
           >
              {/* Cloud Layer (CSS Animation) */}
              {atmosphere > 0.5 && (
                <div className="absolute inset-0 opacity-60 animate-spin-slow" 
                     style={{ 
                       backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_Map_Blank.svg/2000px-World_Map_Blank.svg.png")',
                       backgroundSize: '200%',
                       filter: 'blur(2px) contrast(200%) grayscale(100%) invert(1)'
                     }}
                />
              )}
              
              {/* Shadow/Terminator Line */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none"></div>
           </div>
        </div>

        {/* ESI SCORE CARD (Floating) */}
        <div className="absolute bottom-8 flex flex-col items-center animate-fade-in-up">
           <div className="text-[10px] tracking-[0.3em] text-slate-400 mb-2">HABITABILITY INDEX</div>
           <div className="flex items-center gap-4">
              <div className={`text-5xl font-black ${stats.score > 80 ? 'text-green-400' : stats.score > 40 ? 'text-yellow-400' : 'text-red-500'}`}>
                {stats.score}%
              </div>
              <div className="flex flex-col gap-1 text-xs font-mono text-slate-400">
                 <span className={`flex items-center gap-1 ${stats.temp > 0 && stats.temp < 50 ? 'text-green-400' : 'text-slate-600'}`}>
                    {stats.temp > 0 && stats.temp < 50 ? <CheckCircle2 size={10}/> : <AlertTriangle size={10}/>} TEMP
                 </span>
                 <span className={`flex items-center gap-1 ${atmosphere > 0.5 && atmosphere < 2 ? 'text-green-400' : 'text-slate-600'}`}>
                    {atmosphere > 0.5 && atmosphere < 2 ? <CheckCircle2 size={10}/> : <AlertTriangle size={10}/>} ATMOS
                 </span>
                 <span className={`flex items-center gap-1 ${stats.state === 'LIQUID' ? 'text-green-400' : 'text-slate-600'}`}>
                    {stats.state === 'LIQUID' ? <CheckCircle2 size={10}/> : <AlertTriangle size={10}/>} WATER
                 </span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};