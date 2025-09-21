from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from app.services.data_loader import get_data_loader

router = APIRouter()

class Exoplanet(BaseModel):
    pl_name: str
    hostname: str
    pl_rade: float  # Earth radii
    pl_bmasse: float  # Earth masses
    g_fraction: float
    intensity_index: int
    pl_orbper: Optional[float] = None  # days
    pl_orbsmax: Optional[float] = None  # AU
    pl_eqt: Optional[float] = None  # Kelvin
    st_teff: Optional[float] = None  # Kelvin
    sy_dist: Optional[float] = None  # parsecs

class ExoplanetSearchResponse(BaseModel):
    exoplanets: List[Exoplanet]
    total: int
    query: str

class ExoplanetStatsResponse(BaseModel):
    total_planets: int
    g_fraction_range: dict
    intensity_index_distribution: dict
    mass_range: dict
    radius_range: dict

@router.get("/exoplanets", response_model=ExoplanetSearchResponse)
async def search_exoplanets(
    q: str = Query("", description="Search query for planet name or host star"),
    limit: int = Query(50, ge=1, le=500, description="Maximum number of results")
):
    """Search exoplanets by name or host star."""
    try:
        data_loader = get_data_loader()
        results = data_loader.search_exoplanets(q, limit)
        
        exoplanets = [Exoplanet(**planet) for planet in results]
        
        return ExoplanetSearchResponse(
            exoplanets=exoplanets,
            total=len(exoplanets),
            query=q
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching exoplanets: {str(e)}")

@router.get("/exoplanets/stats", response_model=ExoplanetStatsResponse)
async def get_exoplanet_stats():
    """Get statistics about the exoplanet dataset."""
    try:
        data_loader = get_data_loader()
        stats = data_loader.get_exoplanet_stats()
        return ExoplanetStatsResponse(**stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")

@router.get("/exoplanets/random", response_model=List[Exoplanet])
async def get_random_exoplanets(limit: int = Query(5, ge=1, le=500)):
    """Get random exoplanets from the dataset."""
    try:
        data_loader = get_data_loader()
        results = data_loader.get_all_exoplanets(limit)
        return [Exoplanet(**planet) for planet in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting random exoplanets: {str(e)}")

@router.get("/exoplanets/{planet_name}", response_model=Exoplanet)
async def get_exoplanet(planet_name: str):
    """Get specific exoplanet by name."""
    try:
        data_loader = get_data_loader()
        planet_data = data_loader.get_exoplanet_by_name(planet_name)
        
        if planet_data is None:
            raise HTTPException(status_code=404, detail=f"Exoplanet '{planet_name}' not found")
        
        return Exoplanet(**planet_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting exoplanet: {str(e)}")
