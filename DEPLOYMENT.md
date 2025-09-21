# Deployment Guide

## Frontend (Vercel) - FIXED! ✅

### Quick Deploy (Recommended)

1. **Test deployment readiness**:
   ```bash
   ./quick-deploy.sh
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Vercel should auto-detect Next.js in the `frontend` folder
   - If not, set **Root Directory** to `frontend` in project settings
   - Deploy!

### Manual Configuration (if needed)

If Vercel doesn't auto-detect:
- **Root Directory**: `frontend`
- **Framework Preset**: `Next.js`
- **Build Command**: `npm run build` (or leave empty)
- **Output Directory**: `.next` (or leave empty)
- **Install Command**: `npm install` (or leave empty)

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# When prompted:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - What's your project's name? cdc-2025-planetary-systems
# - In which directory is your code located? frontend
```

### Environment Variables for Frontend

In Vercel dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_API_BASE` = `http://localhost:8000` (for development)
- `NEXT_PUBLIC_API_BASE` = `https://your-backend-url.com` (for production)

## Backend (Railway - Recommended)

### Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Python and install dependencies
5. Set environment variables:
   - `FRONTEND_ORIGIN` = `https://your-vercel-app.vercel.app`

### Alternative: Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables:
   - `FRONTEND_ORIGIN` = `https://your-vercel-app.vercel.app`

## Deployment Order

1. **Deploy Backend First** → Get backend URL
2. **Deploy Frontend** → Set `NEXT_PUBLIC_API_BASE` to backend URL
3. **Update Backend CORS** → Set `FRONTEND_ORIGIN` to frontend URL

## Testing

After deployment:
1. Frontend should load at your Vercel URL
2. Backend should be accessible at your backend URL
3. API calls should work between frontend and backend
4. Test the `/health` endpoint: `https://your-backend-url.com/health`

## Troubleshooting

- **Build fails**: Check that all dependencies are in `package.json`
- **API calls fail**: Verify `NEXT_PUBLIC_API_BASE` is set correctly
- **CORS errors**: Check `FRONTEND_ORIGIN` in backend environment variables
- **Planets not loading**: Check backend logs for data loading issues
