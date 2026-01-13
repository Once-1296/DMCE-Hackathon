export interface CelestialBody {
  name: string;
  type: string;
  temp: string;
  location: string;
  size_rel: number; // Relative to Earth (1)
  description: string;
}

export interface CoordinateData { ra: number; dec: number; frame: string; }
export interface OverviewData { name: string; coordinates: CoordinateData; external_links: { simbad: string }; }
export interface MissionData { mission: string; instrument: string; wavelength: string; }

export interface FusionResponse { 
  overview: OverviewData; 
  available_datasets: MissionData[]; 
}