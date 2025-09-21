"use client"

import { useState, useEffect } from "react"
import { Search, Globe, Zap, Calendar, Thermometer, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WorkoutGenerator } from "@/components/workout-generator"
import {
  calculateGravityFraction,
  calculateIntensityIndex,
  getIntensityTier,
  type Exoplanet,
} from "@/lib/exoplanet-data"
import { searchExoplanets as searchExoplanetsAPI, getRandomExoplanets } from "@/lib/exoplanet-service"

export function PlanetSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null)
  const [showWorkout, setShowWorkout] = useState(false)
  const [planets, setPlanets] = useState<Exoplanet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial random planets
  useEffect(() => {
    const loadInitialPlanets = async () => {
      try {
        console.log('Loading initial planets...')
        setLoading(true)
        setError(null)
        const randomPlanets = await getRandomExoplanets(100)
        console.log('Loaded planets:', randomPlanets.length, randomPlanets)
        setPlanets(randomPlanets)
        console.log('Planets state updated:', randomPlanets.length)
      } catch (err) {
        console.error('Error loading exoplanets:', err)
        setError('Failed to load exoplanets')
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    loadInitialPlanets()
  }, [])

  // Search planets when query changes
  useEffect(() => {
    const searchPlanets = async () => {
        if (!searchQuery.trim()) {
          // Load random planets when no search query
          try {
            const randomPlanets = await getRandomExoplanets(100)
            setPlanets(randomPlanets)
          } catch (err) {
            console.error('Error loading random planets:', err)
          }
          return
        }

      try {
        setLoading(true)
        const searchResults = await searchExoplanetsAPI(searchQuery)
        setPlanets(searchResults)
      } catch (err) {
        setError('Failed to search exoplanets')
        console.error('Error searching exoplanets:', err)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchPlanets, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handlePlanetSelect = (planet: Exoplanet) => {
    setSelectedPlanet(planet)
  }

  const handleGenerateWorkout = () => {
    if (selectedPlanet) {
      setShowWorkout(true)
    }
  }

  const handleBackToSearch = () => {
    setShowWorkout(false)
    setSelectedPlanet(null)
  }

  if (showWorkout && selectedPlanet) {
    return <WorkoutGenerator planet={selectedPlanet} onBack={handleBackToSearch} />
  }

  return (
    <div className="space-y-8">
      {/* Search Interface */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search exoplanets by name or host star..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg bg-card/50 backdrop-blur-sm border-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading exoplanets from NASA database...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <Globe className="h-16 w-16 text-destructive mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-destructive mb-2">Error loading exoplanets</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      )}

      {/* Planet Results Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planets.map((planet) => {
            // Use real data if available, fallback to calculated values
            const gravityFraction = planet.g_fraction ?? (planet.gravity ? calculateGravityFraction(planet.gravity) : 1)
            const intensityIndex = planet.intensity_index ?? calculateIntensityIndex(gravityFraction)
            const intensityTier = getIntensityTier(intensityIndex)

            return (
              <Card
                key={planet.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 ${
                  selectedPlanet?.id === planet.id
                    ? "border-primary shadow-primary/20 shadow-lg animate-pulse-glow"
                    : "border-border hover:border-primary/50"
                } bg-card/80 backdrop-blur-sm`}
                onClick={() => handlePlanetSelect(planet)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-balance">{planet.name}</CardTitle>
                      <CardDescription className="text-sm">
                        <Globe className="inline h-3 w-3 mr-1" />
                        {planet.hostStar}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        intensityTier === "low" ? "secondary" : intensityTier === "medium" ? "default" : "destructive"
                      }
                      className="animate-float"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      {intensityIndex}/10
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Gravity Info */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Gravity:</span>
                    <span className="font-mono font-medium">
                      {planet.gravity ? `${planet.gravity.toFixed(1)} m/s²` : "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">vs Earth:</span>
                    <span className="font-mono font-medium text-primary">
                      {gravityFraction.toFixed(2)}x
                    </span>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{planet.discoveryYear}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      <span>{planet.temperature ? `${planet.temperature}K` : "Unknown"}</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">Distance: {planet.distance} light years</div>

                  {selectedPlanet?.id === planet.id && (
                    <Button className="w-full mt-4" size="sm" onClick={handleGenerateWorkout}>
                      Generate Workout Program
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {!loading && !error && planets.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No planets found</h3>
          <p className="text-sm text-muted-foreground">Try searching for different planet names or host stars</p>
        </div>
      )}

      {/* Quick Stats */}
      {!loading && !error && (
        <div className="bg-card/30 backdrop-blur-sm rounded-lg p-6 border border-border/50">
          <h3 className="text-lg font-semibold mb-4 text-center">NASA Exoplanet Database Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{planets.length}</div>
              <div className="text-sm text-muted-foreground">Planets Loaded</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {planets.filter((p) => (p.intensity_index ?? 5) <= 3).length}
              </div>
              <div className="text-sm text-muted-foreground">Low Intensity</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-chart-3">
                {planets.filter((p) => {
                  const intensity = p.intensity_index ?? 5
                  return intensity >= 4 && intensity <= 7
                }).length}
              </div>
              <div className="text-sm text-muted-foreground">Medium Intensity</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">
                {planets.filter((p) => (p.intensity_index ?? 5) >= 8).length}
              </div>
              <div className="text-sm text-muted-foreground">High Intensity</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}