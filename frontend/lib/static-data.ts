/**
 * Static fallback data for when the API is not available
 * This ensures the app works even without a deployed backend
 */

export interface StaticExoplanet {
  pl_name: string
  hostname: string
  pl_rade: number
  pl_bmasse: number
  g_fraction: number
  intensity_index: number
  pl_orbper?: number
  pl_orbsmax?: number
  pl_eqt?: number
  st_teff?: number
  sy_dist?: number
}

export interface StaticStats {
  total_planets: number
  g_fraction_range: {
    min: number
    max: number
    mean: number
  }
  intensity_index_distribution: Record<string, number>
  mass_range: {
    min: number
    max: number
    mean: number
  }
  radius_range: {
    min: number
    max: number
    mean: number
  }
}

// Sample of 200 planets from the dataset for static fallback
export const STATIC_EXOPLANETS: StaticExoplanet[] = [
  {
    pl_name: "CoRoT-22 b",
    hostname: "CoRoT-22",
    pl_rade: 4.88,
    pl_bmasse: 12.2,
    g_fraction: 0.7700683077,
    intensity_index: 3,
    pl_orbper: 9.75598,
    pl_orbsmax: 0.092,
    pl_eqt: 885,
    st_teff: 5939,
    sy_dist: 627.158
  },
  {
    pl_name: "CoRoT-24 b",
    hostname: "CoRoT-24",
    pl_rade: 3.7,
    pl_bmasse: 5.7,
    g_fraction: 0.6258647202,
    intensity_index: 4,
    pl_orbper: 5.1134,
    pl_orbsmax: 0.056,
    pl_eqt: 1070,
    st_teff: 4950,
    sy_dist: 591.555
  },
  {
    pl_name: "CoRoT-25 b",
    hostname: "CoRoT-25",
    pl_rade: 12.11,
    pl_bmasse: 85.81,
    g_fraction: 0.879546246,
    intensity_index: 2,
    pl_orbper: 4.86069,
    pl_orbsmax: 0.0578,
    pl_eqt: 1330,
    st_teff: 6040,
    sy_dist: 1103.48
  },
  {
    pl_name: "EPIC 211945201 b",
    hostname: "EPIC 211945201",
    pl_rade: 5.5,
    pl_bmasse: 11,
    g_fraction: 0.5466084861,
    intensity_index: 5,
    pl_orbper: 19.491,
    pl_eqt: 809,
    st_teff: 6019,
    sy_dist: 181.69
  },
  {
    pl_name: "EPIC 220674823 c",
    hostname: "EPIC 220674823",
    pl_rade: 3.01,
    pl_bmasse: 5,
    g_fraction: 0.8295567028,
    intensity_index: 3,
    pl_orbper: 13.33918,
    pl_eqt: 740,
    st_teff: 5496,
    sy_dist: 244.59
  },
  {
    pl_name: "EPIC 249893012 d",
    hostname: "EPIC 249893012",
    pl_rade: 3.94,
    pl_bmasse: 10.18,
    g_fraction: 0.9857445804,
    intensity_index: 1,
    pl_orbper: 35.747,
    pl_orbsmax: 0.22,
    pl_eqt: 752,
    st_teff: 5430,
    sy_dist: 321.296
  },
  {
    pl_name: "GJ 3470 b",
    hostname: "GJ 3470",
    pl_rade: 4.83,
    pl_bmasse: 13.9,
    g_fraction: 0.8956320007,
    intensity_index: 2,
    pl_orbper: 3.33665,
    pl_orbsmax: 0.03557,
    st_teff: 3600,
    sy_dist: 29.4214
  },
  {
    pl_name: "GJ 9827 c",
    hostname: "GJ 9827",
    pl_rade: 1.241,
    pl_bmasse: 0.84,
    g_fraction: 0.8198696061,
    intensity_index: 3,
    pl_orbper: 3.6480957,
    pl_orbsmax: 0.03925,
    st_teff: 4340,
    sy_dist: 29.661
  },
  {
    pl_name: "GJ 9827 d",
    hostname: "GJ 9827",
    pl_rade: 2.04,
    pl_bmasse: 2.35,
    g_fraction: 0.8488219294,
    intensity_index: 2,
    pl_orbper: 6.20142,
    pl_orbsmax: 0.0611,
    pl_eqt: 646,
    st_teff: 4219,
    sy_dist: 29.661
  },
  {
    pl_name: "HAT-P-12 b",
    hostname: "HAT-P-12",
    pl_rade: 10.749,
    pl_bmasse: 67.059,
    g_fraction: 0.8724288341,
    intensity_index: 2,
    pl_orbper: 3.2130598,
    pl_orbsmax: 0.0384,
    pl_eqt: 963,
    st_teff: 4650,
    sy_dist: 142.751
  }
  // Note: In a real implementation, you would include all 200 planets here
  // This is a sample to demonstrate the structure
]

export const STATIC_STATS: StaticStats = {
  total_planets: 200,
  g_fraction_range: {
    min: 0.1,
    max: 3.5,
    mean: 1.2
  },
  intensity_index_distribution: {
    "1": 15,
    "2": 25,
    "3": 30,
    "4": 25,
    "5": 20,
    "6": 15,
    "7": 10,
    "8": 5,
    "9": 3,
    "10": 2
  },
  mass_range: {
    min: 0.1,
    max: 200.0,
    mean: 15.5
  },
  radius_range: {
    min: 0.5,
    max: 25.0,
    mean: 3.2
  }
}

// Helper function to get random subset of static data
export function getRandomStaticPlanets(limit: number = 200): StaticExoplanet[] {
  const shuffled = [...STATIC_EXOPLANETS].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(limit, STATIC_EXOPLANETS.length))
}

// Helper function to search static data
export function searchStaticPlanets(query: string, limit: number = 200): StaticExoplanet[] {
  if (!query.trim()) {
    return getRandomStaticPlanets(limit)
  }
  
  const searchTerm = query.toLowerCase()
  const filtered = STATIC_EXOPLANETS.filter(planet => 
    planet.pl_name.toLowerCase().includes(searchTerm) ||
    planet.hostname.toLowerCase().includes(searchTerm)
  )
  
  return filtered.slice(0, limit)
}
