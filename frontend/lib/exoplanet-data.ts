export interface Exoplanet {
  id: string
  name: string
  hostStar: string
  mass?: number // Earth masses
  radius?: number // Earth radii
  gravity?: number // m/s²
  distance: number // light years
  discoveryYear: number
  temperature?: number // Kelvin
  orbitalPeriod?: number // days
  g_fraction?: number
  intensity_index?: number
}

// Mock data representing a subset of exoplanets with known gravity data
export const mockExoplanets: Exoplanet[] = [
  {
    id: "kepler-452b",
    name: "Kepler-452b",
    hostStar: "Kepler-452",
    mass: 5.0,
    radius: 1.6,
    gravity: 19.3, // ~2x Earth gravity
    distance: 1402,
    discoveryYear: 2015,
    temperature: 265,
    orbitalPeriod: 385,
  },
  {
    id: "proxima-centauri-b",
    name: "Proxima Centauri b",
    hostStar: "Proxima Centauri",
    mass: 1.17,
    radius: 1.1,
    gravity: 9.7, // ~1x Earth gravity
    distance: 4.24,
    discoveryYear: 2016,
    temperature: 234,
    orbitalPeriod: 11.2,
  },
  {
    id: "trappist-1e",
    name: "TRAPPIST-1e",
    hostStar: "TRAPPIST-1",
    mass: 0.77,
    radius: 0.92,
    gravity: 9.1, // ~0.93x Earth gravity
    distance: 40.7,
    discoveryYear: 2017,
    temperature: 251,
    orbitalPeriod: 6.1,
  },
  {
    id: "gliese-667cc",
    name: "Gliese 667Cc",
    hostStar: "Gliese 667C",
    mass: 3.8,
    radius: 1.5,
    gravity: 16.9, // ~1.72x Earth gravity
    distance: 23.6,
    discoveryYear: 2011,
    temperature: 277,
    orbitalPeriod: 28.1,
  },
  {
    id: "k2-18b",
    name: "K2-18b",
    hostStar: "K2-18",
    mass: 8.6,
    radius: 2.3,
    gravity: 16.3, // ~1.66x Earth gravity
    distance: 124,
    discoveryYear: 2015,
    temperature: 265,
    orbitalPeriod: 33,
  },
  {
    id: "hd-40307g",
    name: "HD 40307g",
    hostStar: "HD 40307",
    mass: 7.1,
    radius: 1.9,
    gravity: 19.5, // ~1.99x Earth gravity
    distance: 42,
    discoveryYear: 2012,
    temperature: 227,
    orbitalPeriod: 197.8,
  },
  {
    id: "kepler-186f",
    name: "Kepler-186f",
    hostStar: "Kepler-186",
    mass: 1.4,
    radius: 1.1,
    gravity: 11.2, // ~1.14x Earth gravity
    distance: 582,
    discoveryYear: 2014,
    temperature: 188,
    orbitalPeriod: 129.9,
  },
  {
    id: "wolf-1061c",
    name: "Wolf 1061c",
    hostStar: "Wolf 1061",
    mass: 4.3,
    radius: 1.6,
    gravity: 16.7, // ~1.70x Earth gravity
    distance: 13.8,
    discoveryYear: 2015,
    temperature: 223,
    orbitalPeriod: 17.9,
  },
]

// Calculate gravity fraction compared to Earth (9.81 m/s²)
export function calculateGravityFraction(gravity: number): number {
  return gravity / 9.81
}

// Convert gravity fraction to Intensity Index (1-10 scale)
export function calculateIntensityIndex(gravityFraction: number): number {
  // Scale: 0-0.5g = 1-3, 0.5-1.5g = 4-7, 1.5g+ = 8-10
  if (gravityFraction <= 0.5) {
    return Math.max(1, Math.round(gravityFraction * 6))
  } else if (gravityFraction <= 1.5) {
    return Math.round(3 + (gravityFraction - 0.5) * 4)
  } else {
    return Math.min(10, Math.round(7 + (gravityFraction - 1.5) * 2))
  }
}

// Get intensity tier for visualization
export function getIntensityTier(intensityIndex: number): "low" | "medium" | "high" {
  if (intensityIndex <= 3) return "low"
  if (intensityIndex <= 7) return "medium"
  return "high"
}

// Search and filter exoplanets
export function searchExoplanets(query: string): Exoplanet[] {
  if (!query.trim()) return mockExoplanets

  const searchTerm = query.toLowerCase()
  return mockExoplanets.filter(
    (planet) => planet.name.toLowerCase().includes(searchTerm) || planet.hostStar.toLowerCase().includes(searchTerm),
  )
}
