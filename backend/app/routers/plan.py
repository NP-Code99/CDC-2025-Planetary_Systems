from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from app.services.workout_planner import generate_workout_plan

router = APIRouter()

class PlanRequest(BaseModel):
    intensity_index: int = Field(..., ge=1, le=10, description="Intensity index from 1-10")
    g_fraction: Optional[float] = Field(None, ge=0, le=1, description="Optional gravity fraction for context")

class Exercise(BaseModel):
    name: str
    type: str
    duration: int  # minutes
    sets: Optional[int] = None
    reps: Optional[int] = None
    load: Optional[float] = None  # kg
    device_setpoint: Optional[float] = None  # kg

class Session(BaseModel):
    day: int
    name: str
    duration: int  # minutes
    exercises: List[Exercise]

class WeeklyPlan(BaseModel):
    intensity_index: int
    g_fraction: Optional[float]
    total_weekly_volume: int  # minutes
    sessions: List[Session]
    device_setpoints: List[dict]
    safety_notes: List[str]

@router.post("/plan", response_model=WeeklyPlan)
async def generate_plan(request: PlanRequest):
    try:
        plan = generate_workout_plan(request.intensity_index, request.g_fraction)
        
        # Convert to response format
        sessions = []
        for i, session in enumerate(plan["sessions"]):
            exercises = []
            for exercise in session["exercises"]:
                exercises.append(Exercise(
                    name=exercise["name"],
                    type=exercise["type"],
                    duration=exercise["duration"],
                    sets=exercise.get("sets"),
                    reps=exercise.get("reps"),
                    load=exercise.get("load"),
                    device_setpoint=exercise.get("device_setpoint")
                ))
            
            sessions.append(Session(
                day=i + 1,
                name=session["name"],
                duration=session["duration"],
                exercises=exercises
            ))
        
        return WeeklyPlan(
            intensity_index=plan["intensity_index"],
            g_fraction=plan.get("g_fraction"),
            total_weekly_volume=plan["total_weekly_volume"],
            sessions=sessions,
            device_setpoints=plan["device_setpoints"],
            safety_notes=plan["safety_notes"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error generating workout plan: {str(e)}")
