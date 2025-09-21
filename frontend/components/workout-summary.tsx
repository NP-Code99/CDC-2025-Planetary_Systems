"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Trophy, Target, TrendingUp, Calendar, RotateCcw, CheckCircle2, Zap } from "lucide-react"
import { ExportDialog } from "@/components/export-dialog"
import { generateWeeklySchedule } from "@/lib/workout-calculator"
import { calculateGravityFraction, calculateIntensityIndex } from "@/lib/exoplanet-data"
import type { WorkoutSession } from "@/lib/workout-calculator"
import type { Exoplanet } from "@/lib/exoplanet-data"

interface WorkoutSummaryProps {
  session: WorkoutSession
  completedExercises: number
  totalTime: number
  planet: Exoplanet
  onRestart?: () => void
  onShare?: () => void
  onExport?: () => void
}

export function WorkoutSummary({
  session,
  completedExercises,
  totalTime,
  planet,
  onRestart,
  onShare,
  onExport,
}: WorkoutSummaryProps) {
  const completionRate = (completedExercises / session.exercises.length) * 100
  const isFullyCompleted = completedExercises === session.exercises.length

  // Generate weekly schedule for export
  const gravityFraction = planet.gravity ? calculateGravityFraction(planet.gravity) : 1
  const intensityIndex = calculateIntensityIndex(gravityFraction)
  const weeklySchedule = generateWeeklySchedule(planet.name, gravityFraction, intensityIndex)

  const getIntensityColor = (index: number) => {
    if (index <= 3) return "text-chart-5"
    if (index <= 7) return "text-chart-3"
    return "text-destructive"
  }

  return (
    <div className="space-y-6">
      {/* Completion Header */}
      <Card
        className={`${isFullyCompleted ? "bg-gradient-to-r from-chart-5/20 to-primary/20 border-chart-5/30" : "bg-gradient-to-r from-chart-3/20 to-accent/20 border-chart-3/30"}`}
      >
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {isFullyCompleted ? (
              <Trophy className="h-16 w-16 text-chart-5 animate-bounce" />
            ) : (
              <Target className="h-16 w-16 text-chart-3" />
            )}
          </div>
          <CardTitle className="text-3xl text-balance">
            {isFullyCompleted ? "Workout Complete!" : "Session Summary"}
          </CardTitle>
          <CardDescription className="text-lg">
            {session.planetName} • {session.gravityFraction.toFixed(2)}x Earth Gravity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{completedExercises}</div>
              <div className="text-sm text-muted-foreground">Exercises Done</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{totalTime}</div>
              <div className="text-sm text-muted-foreground">Minutes Trained</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${getIntensityColor(session.intensityIndex)}`}>
                {session.intensityIndex}/10
              </div>
              <div className="text-sm text-muted-foreground">Intensity Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-chart-2">{completionRate.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Gravity Adaptation:</span>
              <Badge variant="outline" className="font-mono">
                {session.gravityFraction.toFixed(2)}x Earth
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Training Efficiency:</span>
              <Badge variant={completionRate >= 80 ? "default" : "secondary"}>
                {completionRate >= 80 ? "Excellent" : completionRate >= 60 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Intensity Handled:</span>
              <Badge
                variant={
                  session.intensityIndex <= 3 ? "secondary" : session.intensityIndex <= 7 ? "default" : "destructive"
                }
              >
                {session.intensityIndex <= 3 ? "Low" : session.intensityIndex <= 7 ? "Medium" : "High"} Intensity
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated Calories:</span>
              <span className="font-mono font-medium">{Math.round(totalTime * 8 * session.gravityFraction)} kcal</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Exercise Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {session.exercises.map((exercise, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-chart-5" />
                  {exercise.name}
                </span>
                <span className="font-mono text-muted-foreground">
                  {exercise.type === "cardio" || exercise.type === "flexibility"
                    ? `${exercise.scaledLoad}min`
                    : `${exercise.scaledLoad}kg`}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Achievements & Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Training Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Gravity Adaptations Made:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Load scaling: {((session.gravityFraction - 1) * 100).toFixed(0)}% adjustment</li>
                <li>• Rep modifications for gravity conditions</li>
                <li>• Duration optimized for {session.gravityFraction.toFixed(2)}x gravity</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Next Session Recommendations:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {session.gravityFraction > 1.5 ? "Allow 48-72h recovery" : "Standard 24-48h recovery"}</li>
                <li>• Monitor adaptation to gravity conditions</li>
                <li>• Consider progressive overload adjustments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onRestart} variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
          <RotateCcw className="h-4 w-4" />
          Restart Session
        </Button>

        <ExportDialog
          session={session}
          weeklySchedule={weeklySchedule}
          planet={planet}
          completedExercises={completedExercises}
          totalTime={totalTime}
        />
      </div>

      {/* Recovery Notes */}
      {session.safetyNotes.length > 0 && (
        <Card className="border-chart-3/20 bg-chart-3/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-chart-3">
              <Calendar className="h-5 w-5" />
              Recovery Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {session.safetyNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-2 flex-shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
