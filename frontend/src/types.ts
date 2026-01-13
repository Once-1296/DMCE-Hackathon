export interface CelestialBody {
  id: string; // Added ID for keys
  name: string;
  type: string;
  temp: string;
  color: string; // Hex color for the 3D model
  location: string;
  distance: string; // Light years
  mass: string; // Solar masses
  size_rel: number; // Relative to Earth (1) or Sun (1) depending on context
  description: string;
}

export interface CoordinateData { ra: number; dec: number; frame: string; }
export interface OverviewData { name: string; coordinates: CoordinateData; external_links: { simbad: string }; }
export interface MissionData { mission: string; instrument: string; wavelength: string; }

export interface FusionResponse { 
  overview: OverviewData; 
  available_datasets: MissionData[]; 
}