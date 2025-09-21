"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Pause,
  RotateCcw,
  Timer,
  Target,
  TrendingUp,
  Activity,
  Dumbbell,
  Heart,
  CheckCircle2,
  Circle,
  Zap,
} from "lucide-react"
import type { WorkoutSession } from "@/lib/workout-calculator"

interface SessionDisplayProps {
  session: WorkoutSession
  onComplete?: () => void
}

export function SessionDisplay({ session, onComplete }: SessionDisplayProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set())

  const currentExercise = session.exercises[currentExerciseIndex]
  const progressPercentage = ((currentExerciseIndex + 1) / session.exercises.length) * 100

  const handleStartPause = () => {
    setIsActive(!isActive)
  }

  const handleReset = () => {
    setIsActive(false)
    setTimeElapsed(0)
    setCurrentExerciseIndex(0)
    setCompletedExercises(new Set())
  }

  const handleCompleteExercise = () => {
    const newCompleted = new Set(completedExercises)
    newCompleted.add(currentExerciseIndex)
    setCompletedExercises(newCompleted)

    if (currentExerciseIndex < session.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
    } else {
      setIsActive(false)
      onComplete?.()
    }
  }

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
    }
  }

  const handleNextExercise = () => {
    if (currentExerciseIndex < session.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
    }
  }

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case "strength":
        return <Dumbbell className="h-5 w-5" />
      case "cardio":
        return <Heart className="h-5 w-5" />
      case "flexibility":
        return <Activity className="h-5 w-5" />
      default:
        return <Target className="h-5 w-5" />
    }
  }

  const getIntensityColor = (index: number) => {
    if (index <= 3) return "text-chart-5"
    if (index <= 7) return "text-chart-3"
    return "text-destructive"
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-balance">{session.planetName}</CardTitle>
              <CardDescription className="text-base">
                Gravity-Optimized Training Session • {session.gravityFraction.toFixed(2)}x Earth Gravity
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getIntensityColor(session.intensityIndex)}`}>
                {session.intensityIndex}/10
              </div>
              <div className="text-sm text-muted-foreground">Intensity</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{session.duration}</div>
              <div className="text-sm text-muted-foreground">Total Minutes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{session.exercises.length}</div>
              <div className="text-sm text-muted-foreground">Exercises</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-chart-3">{completedExercises.size}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Session Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>
                Exercise {currentExerciseIndex + 1} of {session.exercises.length}
              </span>
              <span>{progressPercentage.toFixed(0)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>Estimated time remaining: {Math.max(0, session.duration - timeElapsed)} minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Exercise */}
      <Card className="border-2 border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              {getExerciseIcon(currentExercise.type)}
              {currentExercise.name}
              <Badge variant="outline">{currentExercise.type}</Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              {completedExercises.has(currentExerciseIndex) ? (
                <CheckCircle2 className="h-6 w-6 text-chart-5" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>
          <CardDescription>
            Scaling Factor: {(currentExercise.scalingFactor * 100).toFixed(0)}% gravity adjustment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Exercise Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentExercise.type === "cardio" || currentExercise.type === "flexibility" ? (
              <>
                <div className="text-center p-4 bg-card/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{currentExercise.scaledLoad}</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center p-4 bg-card/30 rounded-lg">
                  <div className="text-lg font-medium text-muted-foreground">{currentExercise.baseLoad}</div>
                  <div className="text-sm text-muted-foreground">Base Duration</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center p-4 bg-card/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{currentExercise.scaledLoad}</div>
                  <div className="text-sm text-muted-foreground">kg Load</div>
                </div>
                <div className="text-center p-4 bg-card/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{currentExercise.scaledSets}</div>
                  <div className="text-sm text-muted-foreground">Sets</div>
                </div>
                <div className="text-center p-4 bg-card/50 rounded-lg">
                  <div className="text-2xl font-bold text-chart-3">{currentExercise.scaledReps}</div>
                  <div className="text-sm text-muted-foreground">Reps</div>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold text-primary">{currentExercise.deviceSetPoint}</div>
                  <div className="text-sm text-muted-foreground">Device Setting</div>
                </div>
              </>
            )}
          </div>

          {/* Exercise Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="sm" onClick={handlePreviousExercise} disabled={currentExerciseIndex === 0}>
              Previous
            </Button>
            <Button
              variant={isActive ? "destructive" : "default"}
              size="lg"
              onClick={handleStartPause}
              className="px-8"
            >
              {isActive ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextExercise}
              disabled={currentExerciseIndex === session.exercises.length - 1}
            >
              Next
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="default"
              onClick={handleCompleteExercise}
              disabled={completedExercises.has(currentExerciseIndex)}
              className="px-8"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {completedExercises.has(currentExerciseIndex) ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            All Exercises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {session.exercises.map((exercise, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  index === currentExerciseIndex
                    ? "border-primary bg-primary/10"
                    : completedExercises.has(index)
                      ? "border-chart-5/50 bg-chart-5/5"
                      : "border-border bg-card/30 hover:bg-card/50"
                }`}
                onClick={() => setCurrentExerciseIndex(index)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {completedExercises.has(index) ? (
                      <CheckCircle2 className="h-5 w-5 text-chart-5" />
                    ) : index === currentExerciseIndex ? (
                      <Zap className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {exercise.type === "cardio" || exercise.type === "flexibility"
                        ? `${exercise.scaledLoad} min`
                        : `${exercise.scaledLoad}kg × ${exercise.scaledSets} × ${exercise.scaledReps}`}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {exercise.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Notes */}
      {session.safetyNotes.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Zap className="h-5 w-5" />
              Safety Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {session.safetyNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
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
