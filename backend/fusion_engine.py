import numpy as np
from astropy import units as u
from astropy.coordinates import SkyCoord
from astroquery.simbad import Simbad
from astroquery.mast import Observations

class CosmicFusionEngine:
    def search_object(self, object_name):
        print(f"--- 1. Searching SIMBAD for: {object_name} ---")
        
        try:
            # DIRECT QUERY (No configuration to avoid attribute errors)
            result_table = Simbad.query_object(object_name)
            
            # CASE A: Object Not Found
            if result_table is None:
                return {"error": f"Object '{object_name}' not found."}
            
            # CASE B: Success - Parse Data
            # Simbad returns a table. We get the first row.
            # Default columns are usually 'RA' and 'DEC' in string format (e.g. "00 42 44")
            ra_raw = str(result_table['RA'][0]) 
            dec_raw = str(result_table['DEC'][0])
            official_name = str(result_table['MAIN_ID'][0])
            
            print(f"SIMBAD Success: {official_name} at {ra_raw}, {dec_raw}")

            # Convert coordinates safely
            coord = SkyCoord(f"{ra_raw} {dec_raw}", unit=(u.hourangle, u.deg))
            
            return {
                "name": official_name,
                "coordinates": {
                    "ra": float(coord.ra.degree),
                    "dec": float(coord.dec.degree),
                    "frame": "ICRS"
                },
                "external_links": {
                    "simbad": f"http://simbad.u-strasbg.fr/simbad/sim-basic?Ident={object_name}"
                }
            }

        except Exception as e:
            print(f"SIMBAD FAILED: {e}")
            print("--- ACTIVATING FALLBACK MODE (So you can see the UI) ---")
            # This ensures your frontend doesn't break while we debug the library
            return self.get_mock_data(object_name)

    def fetch_mission_data(self, ra, dec):
        print(f"--- 2. Searching MAST Missions ---")
        try:
            # Query MAST
            obs_table = Observations.query_region(f"{ra} {dec} deg", radius="0.02 deg")
            
            if obs_table is None or len(obs_table) == 0:
                return []

            clean_list = []
            # Limit to 10 results
            for row in obs_table[:10]:
                # Handle potential masking in the wavelength column
                wave_min = row['em_min']
                wave_str = "N/A"
                if not np.ma.is_masked(wave_min):
                     wave_str = f"{wave_min:.2f}"

                clean_list.append({
                    "mission": str(row['obs_collection']),
                    "instrument": str(row['instrument_name']),
                    "wavelength": wave_str, 
                    "target_name": str(row['target_name'])
                })
            return clean_list

        except Exception as e:
            print(f"MAST ERROR: {e}")
            return [] # Return empty list so the page still loads

    def get_mock_data(self, name):
        """
        Returns fake data if the real libraries crash. 
        This is useful for debugging the Frontend UI.
        """
        return {
            "name": f"{name} (MOCK DATA - BACKEND FAILED)",
            "coordinates": {
                "ra": 10.68,
                "dec": 41.26,
                "frame": "ICRS"
            },
            "external_links": {
                "simbad": "#"
            }
        }