export interface WorkoutExercise {
  name: string
  type: "strength" | "cardio" | "flexibility"
  baseLoad: number // kg or minutes
  baseSets?: number
  baseReps?: number
  scalingFactor: number // How much this exercise scales with gravity
}

export interface WorkoutSession {
  planetName: string
  gravityFraction: number
  intensityIndex: number
  duration: number // minutes
  exercises: ScaledExercise[]
  safetyNotes: string[]
}

export interface ScaledExercise extends WorkoutExercise {
  scaledLoad: number
  scaledSets?: number
  scaledReps?: number
  deviceSetPoint?: number
}

export interface WeeklySchedule {
  planetName: string
  sessions: WorkoutSession[]
  totalWeeklyVolume: number
  recoveryRecommendations: string[]
}

// Base exercise library
const baseExercises: WorkoutExercise[] = [
  {
    name: "Squats",
    type: "strength",
    baseLoad: 60, // kg
    baseSets: 3,
    baseReps: 12,
    scalingFactor: 0.8, // Highly affected by gravity
  },
  {
    name: "Push-ups",
    type: "strength",
    baseLoad: 0, // bodyweight
    baseSets: 3,
    baseReps: 15,
    scalingFactor: 0.7,
  },
  {
    name: "Deadlifts",
    type: "strength",
    baseLoad: 80, // kg
    baseSets: 3,
    baseReps: 8,
    scalingFactor: 0.9, // Very gravity dependent
  },
  {
    name: "Cardio Run",
    type: "cardio",
    baseLoad: 30, // minutes
    scalingFactor: 0.6, // Moderately affected
  },
  {
    name: "Resistance Band",
    type: "strength",
    baseLoad: 25, // kg equivalent
    baseSets: 3,
    baseReps: 15,
    scalingFactor: 0.3, // Less affected by gravity
  },
  {
    name: "Yoga Flow",
    type: "flexibility",
    baseLoad: 20, // minutes
    scalingFactor: 0.2, // Minimally affected
  },
]

export function calculateWorkoutSession(
  planetName: string,
  gravityFraction: number,
  intensityIndex: number,
): WorkoutSession {
  const scaledExercises: ScaledExercise[] = baseExercises.map((exercise) => {
    const gravityMultiplier = 1 + (gravityFraction - 1) * exercise.scalingFactor

    let scaledLoad: number
    let scaledSets: number | undefined
    let scaledReps: number | undefined
    let deviceSetPoint: number | undefined

    if (exercise.type === "cardio" || exercise.type === "flexibility") {
      // For cardio/flexibility, adjust duration
      scaledLoad = Math.round(exercise.baseLoad * gravityMultiplier)
    } else {
      // For strength, adjust load and reps
      scaledLoad = Math.round(exercise.baseLoad * gravityMultiplier)
      scaledSets = exercise.baseSets
      scaledReps = Math.round((exercise.baseReps || 0) / Math.sqrt(gravityMultiplier))
      deviceSetPoint = scaledLoad
    }

    return {
      ...exercise,
      scaledLoad,
      scaledSets,
      scaledReps,
      deviceSetPoint,
    }
  })

  // Calculate session duration based on intensity
  const baseDuration = 45 // minutes
  const duration = Math.round(baseDuration * (0.8 + intensityIndex * 0.04))

  // Generate safety notes based on gravity conditions
  const safetyNotes: string[] = []
  if (gravityFraction < 0.5) {
    safetyNotes.push("Low gravity: Focus on resistance training to maintain bone density")
    safetyNotes.push("Increase repetitions to compensate for reduced load")
  } else if (gravityFraction > 1.5) {
    safetyNotes.push("High gravity: Reduce impact exercises to prevent injury")
    safetyNotes.push("Monitor heart rate closely during cardio activities")
    safetyNotes.push("Allow extra recovery time between sets")
  }

  return {
    planetName,
    gravityFraction,
    intensityIndex,
    duration,
    exercises: scaledExercises,
    safetyNotes,
  }
}

export function generateWeeklySchedule(
  planetName: string,
  gravityFraction: number,
  intensityIndex: number,
): WeeklySchedule {
  const sessions: WorkoutSession[] = []

  // Generate 7 days of varied workouts
  const sessionTypes = [
    "Full Body Strength",
    "Cardio Focus",
    "Upper Body",
    "Active Recovery",
    "Lower Body",
    "HIIT Training",
    "Flexibility & Recovery",
  ]

  sessionTypes.forEach((type, index) => {
    const session = calculateWorkoutSession(planetName, gravityFraction, intensityIndex)
    session.planetName = `${planetName} - Day ${index + 1} (${type})`
    sessions.push(session)
  })

  const totalWeeklyVolume = sessions.reduce((total, session) => total + session.duration, 0)

  const recoveryRecommendations: string[] = [
    `Total weekly volume: ${totalWeeklyVolume} minutes`,
    gravityFraction > 1.2 ? "Extra sleep recommended due to high gravity stress" : "Standard recovery protocols apply",
    "Hydration needs may vary based on planetary conditions",
    "Monitor for unusual fatigue patterns in altered gravity",
  ]

  return {
    planetName,
    sessions,
    totalWeeklyVolume,
    recoveryRecommendations,
  }
}
