from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, predict, plan, exoplanets
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="GravityFit Exo API",
    description="Planetary gravity-based fitness training API",
    version="1.0.0"
)

# CORS configuration
frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(predict.router)
app.include_router(plan.router)
app.include_router(exoplanets.router)
