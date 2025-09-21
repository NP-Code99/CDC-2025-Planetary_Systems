/**
 * Typed API client for GravityFit Exo backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

// Types matching the backend API
export interface PredictRequest {
  g_fraction: number
  alpha?: number
  mapping?: 'linear' | 'nonlinear'
}

export interface PredictResponse {
  intensity_index: number
  details: {
    g_fraction: number
    alpha_used: number
    mapping: string
    formula: string
  }
}

export interface PlanRequest {
  intensity_index: number
  g_fraction?: number
}

export interface Exercise {
  name: string
  type: string
  duration: number
  sets?: number
  reps?: number
  load?: number
  device_setpoint?: number
}

export interface Session {
  day: number
  name: string
  duration: number
  exercises: Exercise[]
}

export interface WeeklyPlan {
  intensity_index: number
  g_fraction?: number
  total_weekly_volume: number
  sessions: Session[]
  device_setpoints: Array<{
    exercise: string
    setpoint: number
    base_load: number
    scaled_load: number
  }>
  safety_notes: string[]
}

export interface HealthResponse {
  ok: boolean
}

export interface Exoplanet {
  pl_name: string
  hostname: string
  pl_rade: number  // Earth radii
  pl_bmasse: number  // Earth masses
  g_fraction: number
  intensity_index: number
  pl_orbper?: number  // days
  pl_orbsmax?: number  // AU
  pl_eqt?: number  // Kelvin
  st_teff?: number  // Kelvin
  sy_dist?: number  // parsecs
}

export interface ExoplanetSearchResponse {
  exoplanets: Exoplanet[]
  total: number
  query: string
}

export interface ExoplanetStatsResponse {
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

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  console.log('API call to:', url)
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  console.log('API response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('API error:', response.status, errorText)
    throw new ApiError(response.status, errorText)
  }

  const data = await response.json()
  console.log('API response data:', data)
  return data
}

export const api = {
  /**
   * Health check endpoint
   */
  async health(): Promise<HealthResponse> {
    return fetchApi<HealthResponse>('/health')
  },

  /**
   * Predict intensity index from gravity fraction
   */
  async predict(request: PredictRequest): Promise<PredictResponse> {
    return fetchApi<PredictResponse>('/predict', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  /**
   * Generate workout plan from intensity index
   */
  async plan(request: PlanRequest): Promise<WeeklyPlan> {
    return fetchApi<WeeklyPlan>('/plan', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  /**
   * Search exoplanets
   */
  async searchExoplanets(query: string = '', limit: number = 20): Promise<ExoplanetSearchResponse> {
    const params = new URLSearchParams({ q: query, limit: limit.toString() })
    return fetchApi<ExoplanetSearchResponse>(`/exoplanets?${params}`)
  },

  /**
   * Get specific exoplanet by name
   */
  async getExoplanet(planetName: string): Promise<Exoplanet> {
    return fetchApi<Exoplanet>(`/exoplanets/${encodeURIComponent(planetName)}`)
  },

  /**
   * Get exoplanet dataset statistics
   */
  async getExoplanetStats(): Promise<ExoplanetStatsResponse> {
    return fetchApi<ExoplanetStatsResponse>('/exoplanets/stats')
  },

  /**
   * Get random exoplanets
   */
  async getRandomExoplanets(limit: number = 5): Promise<Exoplanet[]> {
    const params = new URLSearchParams({ limit: limit.toString() })
    return fetchApi<Exoplanet[]>(`/exoplanets/random?${params}`)
  },
}

export { ApiError }
