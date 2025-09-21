# 🚀 GravityFit Exo - Local Development Setup

## 📋 Prerequisites

Before running the application locally, ensure you have the following installed:

- **Python 3.12+** - [Download here](https://www.python.org/downloads/)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

## 🛠️ Installation & Setup

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd CDC-2025-Planetary_Systems
```

### Step 2: Backend Setup (Python/FastAPI)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - **On macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```
   - **On Windows:**
     ```bash
     venv\Scripts\activate
     ```

4. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Verify backend setup:**
   ```bash
   python -c "import fastapi, uvicorn, pandas; print('Backend dependencies installed successfully!')"
   ```

### Step 3: Frontend Setup (Next.js/React)

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Verify frontend setup:**
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Method 1: Using the Development Script (Recommended)

1. **From the project root directory:**
   ```bash
   chmod +x start-dev.sh
   ./start-dev.sh
   ```

   This script will automatically:
   - Start the FastAPI backend on port 8000
   - Start the Next.js frontend on port 3000
   - Display both URLs for easy access

### Method 2: Manual Setup (Alternative)

#### Start Backend Server

1. **Open Terminal 1:**
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   **Expected Output:**
   ```
   INFO:     Will watch for changes in these directories: ['/path/to/backend']
   INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
   INFO:     Started reloader process [XXXXX] using WatchFiles
   INFO:     Started server process [XXXXX]
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   Loaded 429 exoplanets from /path/to/CDC_CH2.csv
   ```

#### Start Frontend Server

2. **Open Terminal 2:**
   ```bash
   cd frontend
   npm run dev
   ```

   **Expected Output:**
   ```
   ▲ Next.js 14.2.16
   - Local:        http://localhost:3000
   - Environments: .env.local
   ✓ Starting...
   ✓ Ready in 1229ms
   ```

## 🌐 Access the Application

### Primary URLs:
- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

### Health Check:
- **Backend Health:** [http://localhost:8000/health](http://localhost:8000/health)

## 🔍 Verification Steps

### 1. Backend Verification
Visit [http://localhost:8000/health](http://localhost:8000/health) - you should see:
```json
{"status": "healthy", "message": "GravityFit Exo API is running"}
```

### 2. Frontend Verification
Visit [http://localhost:3000](http://localhost:3000) - you should see:
- The GravityFit Exo homepage
- A list of exoplanets (200 planets displayed)
- Search functionality
- Planet details and gravity calculations

### 3. API Integration Test
Visit [http://localhost:8000/docs](http://localhost:8000/docs) to see the interactive API documentation and test endpoints.

## 🛠️ Troubleshooting

### Common Issues:

#### Port Already in Use
If you get "Port 3000 is in use" or "Port 8000 is in use":
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9  # For frontend
lsof -ti:8000 | xargs kill -9  # For backend
```

#### Python Virtual Environment Issues
```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Node.js Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Frontend Build Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📊 Application Features

Once running, the application provides:

- **🌌 Exoplanet Database:** Browse 429+ exoplanets with detailed information
- **🔍 Search Functionality:** Search planets by name or host star
- **⚖️ Gravity Calculations:** Calculate gravity fractions and fitness metrics
- **🏃‍♂️ Workout Planning:** Generate personalized workout plans based on planetary gravity
- **📈 Statistics:** View comprehensive exoplanet statistics
- **📱 Responsive Design:** Works on desktop, tablet, and mobile devices

## 🔧 Development Commands

### Backend Commands:
```bash
# Start backend with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run backend tests
python -m pytest

# Check backend health
curl http://localhost:8000/health
```

### Frontend Commands:
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📝 Environment Variables

The application uses the following environment variables:

### Backend (.env):
```
FRONTEND_ORIGIN=http://localhost:3000
```

### Frontend (.env.local):
```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

## 🎯 Quick Start Summary

1. **Clone repository**
2. **Setup backend:** `cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`
3. **Setup frontend:** `cd frontend && npm install`
4. **Start both servers:** `./start-dev.sh` (from project root)
5. **Open browser:** [http://localhost:3000](http://localhost:3000)

## 📞 Support

If you encounter any issues:
1. Check the terminal output for error messages
2. Verify all prerequisites are installed
3. Ensure ports 3000 and 8000 are available
4. Check that both servers are running simultaneously

---

**🎉 You're all set! The GravityFit Exo application should now be running locally.**
