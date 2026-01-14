// ✅ SHARED DATA MODELS

export interface CelestialBody {
  id: string; // Unique identifier
  name: string;
  type: string;
  temp: string;
  color: string; // Hex color for visualization
  location: string;
  distance: string; // Light years
  mass: string; // Solar masses
  size_rel: number; // Relative size (e.g., to Sun)
  description: string;
  
  // --- NEW FIELDS FOR HARMONIZATION & CONFLICT RESOLUTION ---
  confidence_score: number; // 0.0 to 1.0 (Overall data quality)
  source_weights: {
    hubble: number;
    gaia: number;
    jwst: number;
  };
  has_conflict: boolean; // Flags if sources disagree > 5%
}

export interface CoordinateData { 
  ra: number; 
  dec: number; 
  frame: string; 
}

export interface OverviewData { 
  name: string; 
  coordinates: CoordinateData; 
  external_links: { simbad: string }; 
}

export interface MissionData { 
  mission: string; 
  instrument: string; 
  wavelength: string; 
}

export interface FusionResponse { 
  overview: OverviewData; 
  available_datasets: MissionData[]; 
}

// Define the valid view states for the app
export type View = 'discovery' | 'skymap' | 'analytics' | 'repository' | 'ingestion' | 'ai';