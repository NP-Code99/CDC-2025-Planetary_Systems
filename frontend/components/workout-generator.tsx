"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Clock,
  Dumbbell,
  Heart,
  Zap,
  AlertTriangle,
  Calendar,
  Target,
  Settings,
  TrendingUp,
  Play,
  Loader2,
} from "lucide-react"
import { SessionDisplay } from "@/components/session-display"
import { WorkoutSummary } from "@/components/workout-summary"
import { calculateWorkoutSession, generateWeeklySchedule } from "@/lib/workout-calculator"
import { calculateGravityFraction, calculateIntensityIndex, type Exoplanet } from "@/lib/exoplanet-data"
import { api, type WeeklyPlan, type PredictResponse, ApiError } from "@/lib/api"

interface WorkoutGeneratorProps {
  planet: Exoplanet
  onBack: () => void
}

export function WorkoutGenerator({ planet, onBack }: WorkoutGeneratorProps) {
  const [activeTab, setActiveTab] = useState("session")
  const [showLiveSession, setShowLiveSession] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [sessionStats, setSessionStats] = useState({ completedExercises: 0, totalTime: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [backendData, setBackendData] = useState<{
    intensityIndex: number
    weeklyPlan: WeeklyPlan | null
  } | null>(null)

  const gravityFraction = planet.gravity ? calculateGravityFraction(planet.gravity) : 1
  const intensityIndex = backendData?.intensityIndex ?? calculateIntensityIndex(gravityFraction)

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchBackendData = async () => {
      if (!planet.gravity) return
      
      setLoading(true)
      setError(null)
      
      try {
        // Calculate g_fraction from planet data
        const gFraction = Math.max(0, Math.min(1, (planet.mass || 1) / ((planet.radius || 1) ** 2)))
        
        // Get intensity index from backend
        const predictResponse = await api.predict({
          g_fraction: gFraction,
          alpha: 1.0,
          mapping: "linear"
        })
        
        // Get workout plan from backend
        const weeklyPlan = await api.plan({
          intensity_index: predictResponse.intensity_index,
          g_fraction: gFraction
        })
        
        setBackendData({
          intensityIndex: predictResponse.intensity_index,
          weeklyPlan
        })
      } catch (err) {
        console.error('Failed to fetch backend data:', err)
        setError(err instanceof ApiError ? err.message : 'Failed to load workout data')
      } finally {
        setLoading(false)
      }
    }

    fetchBackendData()
  }, [planet])

  const workoutSession = calculateWorkoutSession(planet.name, gravityFraction, intensityIndex)
  const weeklySchedule = generateWeeklySchedule(planet.name, gravityFraction, intensityIndex)

  const getIntensityColor = (index: number) => {
    if (index <= 3) return "text-chart-5"
    if (index <= 7) return "text-chart-3"
    return "text-destructive"
  }

  const getExerciseTypeIcon = (type: string) => {
    switch (type) {
      case "strength":
        return <Dumbbell className="h-4 w-4" />
      case "cardio":
        return <Heart className="h-4 w-4" />
      case "flexibility":
        return <Activity className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const handleStartLiveSession = () => {
    setShowLiveSession(true)
  }

  const handleSessionComplete = () => {
    setShowLiveSession(false)
    setShowSummary(true)
    setSessionStats({
      completedExercises: workoutSession.exercises.length,
      totalTime: workoutSession.duration,
    })
  }

  const handleBackToOverview = () => {
    setShowLiveSession(false)
    setShowSummary(false)
  }

  if (showLiveSession) {
    return <SessionDisplay session={workoutSession} onComplete={handleSessionComplete} />
  }

  if (showSummary) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBackToOverview} size="sm">
            ← Back to Overview
          </Button>
          <Button variant="outline" onClick={onBack} size="sm">
            ← Back to Planet Search
          </Button>
        </div>
        <WorkoutSummary
          session={workoutSession}
          completedExercises={sessionStats.completedExercises}
          totalTime={sessionStats.totalTime}
          onRestart={handleBackToOverview}
          onShare={() => console.log("Share functionality")}
          onExport={() => console.log("Export functionality")}
        />
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} size="sm">
            ← Back to Planet Search
          </Button>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-balance">{planet.name}</h2>
            <p className="text-sm text-muted-foreground">Gravity-Optimized Training Program</p>
          </div>
        </div>
        <Card className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border-primary/20">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Calculating gravity-optimized workout...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} size="sm">
            ← Back to Planet Search
          </Button>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-balance">{planet.name}</h2>
            <p className="text-sm text-muted-foreground">Gravity-Optimized Training Program</p>
          </div>
        </div>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Error Loading Workout Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              size="sm"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} size="sm">
          ← Back to Planet Search
        </Button>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-balance">{planet.name}</h2>
          <p className="text-sm text-muted-foreground">Gravity-Optimized Training Program</p>
        </div>
      </div>

      {/* Planet Stats Overview */}
      <Card className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Planetary Training Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{planet.gravity?.toFixed(1) || "Unknown"}</div>
              <div className="text-xs text-muted-foreground">Surface Gravity (m/s²)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{gravityFraction.toFixed(2)}x</div>
              <div className="text-xs text-muted-foreground">Earth Gravity Ratio</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getIntensityColor(intensityIndex)}`}>{intensityIndex}/10</div>
              <div className="text-xs text-muted-foreground">Intensity Index</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-2">{workoutSession.duration}</div>
              <div className="text-xs text-muted-foreground">Session Duration (min)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Ready to Train?
          </CardTitle>
          <CardDescription>Start your gravity-optimized workout session for {planet.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleStartLiveSession} size="lg" className="w-full">
            <Play className="h-5 w-5 mr-2" />
            Start Live Session
          </Button>
        </CardContent>
      </Card>

      {/* Workout Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="session" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Today's Session
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            7-Day Schedule
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Device Settings
          </TabsTrigger>
        </TabsList>

        {/* Today's Session */}
        <TabsContent value="session" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Gravity-Scaled Workout Session
              </CardTitle>
              <CardDescription>
                Exercises automatically adjusted for {planet.name}'s {gravityFraction.toFixed(2)}x Earth gravity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {workoutSession.exercises.map((exercise, index) => (
                <div key={index} className="border border-border/50 rounded-lg p-4 bg-card/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getExerciseTypeIcon(exercise.type)}
                      <h4 className="font-semibold">{exercise.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {exercise.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Scaling: {(exercise.scalingFactor * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {exercise.type === "cardio" || exercise.type === "flexibility" ? (
                      <>
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <div className="font-mono font-medium">{exercise.scaledLoad} min</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Base Duration:</span>
                          <div className="font-mono text-muted-foreground">{exercise.baseLoad} min</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-muted-foreground">Load:</span>
                          <div className="font-mono font-medium">{exercise.scaledLoad} kg</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sets:</span>
                          <div className="font-mono font-medium">{exercise.scaledSets}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Reps:</span>
                          <div className="font-mono font-medium">{exercise.scaledReps}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Device:</span>
                          <div className="font-mono text-primary">{exercise.deviceSetPoint} kg</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Safety Notes */}
          {workoutSession.safetyNotes.length > 0 && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Safety Considerations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {workoutSession.safetyNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Weekly Schedule */}
        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                7-Day Training Schedule
                {backendData?.weeklyPlan && (
                  <Badge variant="outline" className="ml-2">
                    Backend Generated
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Total weekly volume: {backendData?.weeklyPlan?.total_weekly_volume ?? weeklySchedule.totalWeeklyVolume} minutes across {backendData?.weeklyPlan?.sessions.length ?? weeklySchedule.sessions.length}{" "}
                sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(backendData?.weeklyPlan?.sessions ?? weeklySchedule.sessions).map((session, index) => (
                  <div key={index} className="border border-border/50 rounded-lg p-4 bg-card/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{session.name}</h4>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">{session.duration} min</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Intensity: {session.intensityIndex || intensityIndex}/10</span>
                      <span>Exercises: {session.exercises.length}</span>
                      <span>Gravity: {session.gravityFraction?.toFixed(2) ?? gravityFraction.toFixed(2)}x</span>
                    </div>
                    <Progress value={(session.duration / 60) * 100} className="mt-2 h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recovery Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recovery Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {(backendData?.weeklyPlan?.safety_notes ?? weeklySchedule.recoveryRecommendations).map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Device Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Equipment Set-Points
                {backendData?.weeklyPlan && (
                  <Badge variant="outline" className="ml-2">
                    Backend Generated
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Recommended device configurations for {planet.name} gravity conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(backendData?.weeklyPlan?.device_setpoints ?? workoutSession.exercises
                  .filter((ex) => ex.deviceSetPoint)
                  .map((ex) => ({
                    exercise: ex.name,
                    setpoint: ex.deviceSetPoint!,
                    base_load: ex.baseLoad,
                    scaled_load: ex.scaledLoad
                  }))).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getExerciseTypeIcon("strength")}
                        <span className="font-medium">{item.exercise}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-primary">{item.setpoint} kg</div>
                        <div className="text-xs text-muted-foreground">
                          Base: {item.base_load} kg → Scaled: {item.scaled_load} kg
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Safety Caps */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Safety Caps & Limits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Max Load Multiplier:</span>
                  <div className="font-mono font-medium">{Math.min(gravityFraction * 1.2, 3.0).toFixed(2)}x</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Heart Rate Limit:</span>
                  <div className="font-mono font-medium">{Math.round(180 - (gravityFraction > 1.5 ? 20 : 0))} BPM</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Session Duration Cap:</span>
                  <div className="font-mono font-medium">{Math.min(workoutSession.duration * 1.5, 90)} min</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Recovery Time:</span>
                  <div className="font-mono font-medium">
                    {gravityFraction > 1.5 ? "48-72h" : gravityFraction < 0.5 ? "12-24h" : "24-48h"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
