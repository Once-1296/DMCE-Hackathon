import numpy as np
from astropy.coordinates import SkyCoord
from astroquery.simbad import Simbad
from astroquery.mast import Observations
import astropy.units as u

class CosmicFusionEngine:
    def search_object(self, object_name):
        print(f"--- 1. Resolving Object: {object_name} ---")
        
        try:
            # Step A: Resolve Name to Coordinates (using Astropy Internal Resolver)
            coord = SkyCoord.from_name(object_name)
            
            ra = coord.ra.degree
            dec = coord.dec.degree
            print(f"Target Acquired: RA={ra}, DEC={dec}")

            # Step B: Get Official Name (Optional - keeps working even if this fails)
            official_name = object_name
            try:
                simbad_table = Simbad.query_object(object_name)
                if simbad_table is not None and 'MAIN_ID' in simbad_table.colnames:
                    official_name = str(simbad_table['MAIN_ID'][0])
            except Exception:
                pass

            return {
                "name": official_name,
                "coordinates": {
                    "ra": round(float(ra), 6),
                    "dec": round(float(dec), 6),
                    "frame": "ICRS"
                },
                "external_links": {
                    "simbad": f"http://simbad.u-strasbg.fr/simbad/sim-basic?Ident={object_name}"
                }
            }

        except Exception as e:
            print(f"COORDINATE LOOKUP FAILED: {e}")
            return self.get_mock_data(object_name)

    def fetch_mission_data(self, ra, dec):
        print(f"--- 2. Searching MAST Missions for Coords: {ra:.4f}, {dec:.4f} ---")
        try:
            # FIX: Create a SkyCoord object explicitly.
            # This tells MAST "These are definitely numbers", preventing the "Name Not Found" error.
            target_coord = SkyCoord(ra, dec, unit=(u.deg, u.deg), frame='icrs')

            # Query MAST using the coordinate object
            obs_table = Observations.query_region(target_coord, radius="0.02 deg")
            
            if obs_table is None or len(obs_table) == 0:
                print("MAST: No datasets found.")
                return []

            clean_list = []
            # Limit to 15 results
            for row in obs_table[:15]:
                # Safe wavelength extraction
                wave_min = row['em_min']
                wave_str = "N/A"
                if not np.ma.is_masked(wave_min) and wave_min is not None:
                     try:
                         # Convert to string, assuming nanometers if reasonable, or keep raw
                         wave_str = f"{float(wave_min):.2f} nm"
                     except:
                         wave_str = str(wave_min)

                clean_list.append({
                    "mission": str(row['obs_collection']),
                    "instrument": str(row['instrument_name']),
                    "wavelength": wave_str, 
                    "target_name": str(row['target_name'])
                })
            return clean_list

        except Exception as e:
            print(f"MAST SERVICE ERROR: {e}")
            return []

    def get_mock_data(self, name):
        return {
            "name": f"{name} (OFFLINE/NOT FOUND)",
            "coordinates": { "ra": 0.0, "dec": 0.0, "frame": "ERROR" },
            "external_links": { "simbad": "#" }
        }