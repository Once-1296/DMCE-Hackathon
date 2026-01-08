# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fusion_engine import CosmicFusionEngine

app = FastAPI()
engine = CosmicFusionEngine()

# ALLOW FRONTEND CONNECTION (CORS)
# This allows your localhost React app to talk to this Python script
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your website URL
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Cosmic Data Fusion Platform Active"}

@app.get("/search/{object_name}")
def search_universe(object_name: str):
    # 1. Get Basic Data & Coords
    basic_info = engine.search_object(object_name)
    
    if "error" in basic_info:
        return basic_info

    # 2. Use Coords to find Mission Data (NASA MAST)
    ra = basic_info['coordinates']['ra']
    dec = basic_info['coordinates']['dec']
    mission_data = engine.fetch_mission_data(ra, dec)
    
    # 3. Fuse and Return
    return {
        "overview": basic_info,
        "available_datasets": mission_data
    }

# Run with: uvicorn main:app --reload