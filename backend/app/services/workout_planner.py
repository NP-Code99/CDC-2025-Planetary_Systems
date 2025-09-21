"""
Workout planning service that generates 7-day training plans
based on intensity index and gravity fraction.
"""

def generate_workout_plan(intensity_index: int, g_fraction: float = None) -> dict:
    """
    Generate a 7-day workout plan based on intensity index.
    
    Args:
        intensity_index: Intensity level (1-10)
        g_fraction: Optional gravity fraction for context
        
    Returns:
        Dictionary containing the complete workout plan
    """
    
    # Base exercise library
    base_exercises = [
        {
            "name": "Squats",
            "type": "strength",
            "base_load": 60,  # kg
            "base_sets": 3,
            "base_reps": 12,
            "scaling_factor": 0.8,
        },
        {
            "name": "Push-ups",
            "type": "strength",
            "base_load": 0,  # bodyweight
            "base_sets": 3,
            "base_reps": 15,
            "scaling_factor": 0.7,
        },
        {
            "name": "Deadlifts",
            "type": "strength",
            "base_load": 80,  # kg
            "base_sets": 3,
            "base_reps": 8,
            "scaling_factor": 0.9,
        },
        {
            "name": "Cardio Run",
            "type": "cardio",
            "base_load": 30,  # minutes
            "scaling_factor": 0.6,
        },
        {
            "name": "Resistance Band",
            "type": "strength",
            "base_load": 25,  # kg equivalent
            "base_sets": 3,
            "base_reps": 15,
            "scaling_factor": 0.3,
        },
        {
            "name": "Yoga Flow",
            "type": "flexibility",
            "base_load": 20,  # minutes
            "scaling_factor": 0.2,
        },
    ]
    
    # Session types for the week
    session_types = [
        "Full Body Strength",
        "Cardio Focus", 
        "Upper Body",
        "Active Recovery",
        "Lower Body",
        "HIIT Training",
        "Flexibility & Recovery",
    ]
    
    sessions = []
    device_setpoints = []
    safety_notes = []
    
    # Calculate gravity scaling if g_fraction provided
    gravity_multiplier = 1.0
    if g_fraction is not None:
        gravity_multiplier = 1 + (g_fraction - 1) * 0.5  # Moderate scaling
    
    # Generate 7 sessions
    for i, session_type in enumerate(session_types):
        session_exercises = []
        
        # Select exercises based on session type
        if "Strength" in session_type:
            selected_exercises = [ex for ex in base_exercises if ex["type"] == "strength"][:3]
        elif "Cardio" in session_type:
            selected_exercises = [ex for ex in base_exercises if ex["type"] == "cardio"][:2]
        elif "Recovery" in session_type:
            selected_exercises = [ex for ex in base_exercises if ex["type"] == "flexibility"][:2]
        else:
            selected_exercises = base_exercises[:4]
        
        # Scale exercises based on intensity and gravity
        for exercise in selected_exercises:
            # Scale based on intensity (1-10)
            intensity_scale = 0.5 + (intensity_index * 0.05)
            
            # Scale based on gravity if provided
            gravity_scale = gravity_multiplier if g_fraction is not None else 1.0
            
            if exercise["type"] in ["cardio", "flexibility"]:
                duration = int(exercise["base_load"] * intensity_scale * gravity_scale)
                scaled_exercise = {
                    "name": exercise["name"],
                    "type": exercise["type"],
                    "duration": duration,
                }
            else:
                load = int(exercise["base_load"] * intensity_scale * gravity_scale)
                sets = exercise["base_sets"]
                reps = int(exercise["base_reps"] / (intensity_scale ** 0.5))
                
                scaled_exercise = {
                    "name": exercise["name"],
                    "type": exercise["type"],
                    "duration": 0,
                    "sets": sets,
                    "reps": reps,
                    "load": load,
                    "device_setpoint": load,
                }
                
                # Add to device setpoints
                device_setpoints.append({
                    "exercise": exercise["name"],
                    "setpoint": load,
                    "base_load": exercise["base_load"],
                    "scaled_load": load,
                })
            
            session_exercises.append(scaled_exercise)
        
        # Calculate session duration
        base_duration = 30 + (intensity_index * 3)  # 33-60 minutes
        session_duration = int(base_duration * gravity_scale)
        
        sessions.append({
            "name": f"Day {i+1}: {session_type}",
            "duration": session_duration,
            "exercises": session_exercises,
        })
    
    # Generate safety notes
    if g_fraction is not None:
        if g_fraction < 0.5:
            safety_notes.extend([
                "Low gravity: Focus on resistance training to maintain bone density",
                "Increase repetitions to compensate for reduced load",
            ])
        elif g_fraction > 1.5:
            safety_notes.extend([
                "High gravity: Reduce impact exercises to prevent injury",
                "Monitor heart rate closely during cardio activities",
                "Allow extra recovery time between sets",
            ])
    
    # Add intensity-based safety notes
    if intensity_index >= 8:
        safety_notes.append("High intensity: Ensure proper warm-up and cool-down")
    elif intensity_index <= 3:
        safety_notes.append("Low intensity: Focus on form and technique")
    
    # Calculate total weekly volume
    total_weekly_volume = sum(session["duration"] for session in sessions)
    
    return {
        "intensity_index": intensity_index,
        "g_fraction": g_fraction,
        "total_weekly_volume": total_weekly_volume,
        "sessions": sessions,
        "device_setpoints": device_setpoints,
        "safety_notes": safety_notes,
    }
