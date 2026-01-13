import type { CelestialBody } from '../types';

const GREEK_LETTERS = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
const CONSTELLATIONS = ['Andromedae', 'Antliae', 'Apodis', 'Aquarii', 'Aquilae', 'Arae', 'Arietis', 'Aurigae', 'Bootis', 'Caeli', 'Camelopardalis', 'Cancri', 'Canum', 'Majoris', 'Minoris', 'Carinae', 'Cassiopeiae', 'Centauri', 'Cephei', 'Ceti', 'Chamaeleontis', 'Circini', 'Columbae', 'Comae Berenices', 'Coronae'];
const SPECTRAL_CLASSES = [
  { type: 'O', color: '#9bb0ff', minTemp: 30000, maxTemp: 50000, desc: 'Blue Hypergiant' },
  { type: 'B', color: '#aabfff', minTemp: 10000, maxTemp: 30000, desc: 'Blue-White Supergiant' },
  { type: 'A', color: '#cad7ff', minTemp: 7500, maxTemp: 10000, desc: 'White Main Sequence' },
  { type: 'F', color: '#f8f7ff', minTemp: 6000, maxTemp: 7500, desc: 'Yellow-White Dwarf' },
  { type: 'G', color: '#fff4ea', minTemp: 5200, maxTemp: 6000, desc: 'Yellow Dwarf (Sol-like)' },
  { type: 'K', color: '#ffd2a1', minTemp: 3700, maxTemp: 5200, desc: 'Orange Dwarf' },
  { type: 'M', color: '#ffcc6f', minTemp: 2400, maxTemp: 3700, desc: 'Red Dwarf/Giant' },
];

// Helper to get random number in range
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max));
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateCosmicData = (count: number): CelestialBody[] => {
  return Array.from({ length: count }).map((_, i) => {
    const spectral = pick(SPECTRAL_CLASSES);
    // Generate realistic physics based on spectral class
    const temp = Math.floor(rand(spectral.minTemp, spectral.maxTemp));
    // Hotter stars are usually bigger and massive (simplified relation)
    const mass = parseFloat(rand(0.1, 50).toFixed(2)); 
    const size = parseFloat((mass * rand(0.8, 1.2)).toFixed(2)); // Rough correlation for demo
    
    return {
      id: `COS-${10000 + i}`,
      name: `${pick(GREEK_LETTERS)} ${pick(CONSTELLATIONS)}`,
      type: `${spectral.type}-Type ${spectral.desc.split(' ')[1]}`, // e.g. "G-Type Dwarf"
      temp: `${temp.toLocaleString()} K`,
      color: spectral.color, // We use this for the 3D model color
      location: `Sector ${randInt(1, 99)}-${randInt(1, 999)}`,
      distance: `${rand(4, 5000).toFixed(1)} ly`,
      mass: `${mass} M☉`,
      size_rel: size,
      description: `A distinct ${spectral.desc.toLowerCase()} located in the deep field. Spectral analysis indicates high metallicity and potential exoplanetary debris disks.`,
    };
  });
};