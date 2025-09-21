# GravityFit Exo Backend

FastAPI backend for planetary gravity-based fitness training calculations.

## Features

- **Planetary Gravity Calculations**: Extract logic from Planetary Systems.ipynb
- **Intensity Index Mapping**: Linear and non-linear mapping from g_fraction to intensity (1-10)
- **Workout Planning**: Generate 7-day training plans with device setpoints
- **CORS Support**: Configured for frontend integration

## API Endpoints

### Health Check
```
GET /health
```
Returns: `{"ok": true}`

### Predict Intensity Index
```
POST /predict
```
Body:
```json
{
  "g_fraction": 0.8,
  "alpha": 1.0,
  "mapping": "linear"
}
```
Response:
```json
{
  "intensity_index": 3,
  "details": {
    "g_fraction": 0.8,
    "alpha_used": 1.0,
    "mapping": "linear",
    "formula": "I = round(1 + 9 * (1 - g_fraction))"
  }
}
```

### Generate Workout Plan
```
POST /plan
```
Body:
```json
{
  "intensity_index": 5,
  "g_fraction": 0.8
}
```
Response: Complete 7-day workout plan with exercises, device setpoints, and safety notes.

## Installation

1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your settings
   ```

4. Run the server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Environment Variables

- `FRONTEND_ORIGIN`: CORS origin (default: http://localhost:3000)

## Deployment

For production deployment on Render/Railway:

1. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. Set environment variable: `FRONTEND_ORIGIN=https://your-frontend.vercel.app`

## Planetary Systems Logic

This backend implements the core calculations from the Planetary Systems.ipynb notebook:

1. **g_fraction calculation**: `g_fraction = pl_bmasse / (pl_rade**2)` in Earth units, clamped to [0,1]
2. **Intensity Index mapping**:
   - Linear: `I = round(1 + 9 * (1 - g_fraction))`
   - Non-linear: `I = round(1 + 9 * (1 - g_fraction^alpha))`
3. **Final clamping**: Intensity index is always clipped to [1,10]

The Earth-anchored system means:
- Earth (g_fraction = 1) returns intensity index 1
- Micro-gravity (g_fraction → 0) trends toward intensity index 10
