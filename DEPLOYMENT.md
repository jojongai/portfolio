# Vercel Deployment Guide

This application is configured for deployment on **Vercel** for the frontend, with a separate backend service.

## Deployment Architecture

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway, Render, or similar Node.js hosting service

## Frontend Deployment (Vercel)

### Prerequisites

1. GitHub account with your code pushed to a repository
2. Vercel account (free tier available): https://vercel.com

### Step-by-Step Deployment

1. **Connect Repository to Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project Settings**
   
   **Option A: Use Root Directory (Recommended)**
   - **Root Directory**: Leave as root (`.`)
   - The `vercel.json` in the root will handle the build configuration automatically
   
   **Option B: Use Frontend Directory**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend-url.com/api
     ```
   - Replace `your-backend-url.com` with your actual backend URL

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your frontend
   - Your app will be available at `https://your-project.vercel.app`

### Vercel Configuration

The `vercel.json` file in the root directory is configured with:
- Build command: `cd frontend && npm install && npm run build`
- Output directory: `frontend/build`
- React Router rewrites for SPA routing
- Framework: Create React App

## Backend Deployment

Since Vercel is optimized for frontend and serverless functions, deploy your Express backend separately.

### Option 1: Railway (Recommended)

1. **Sign up**: https://railway.app
2. **Create New Project** → Deploy from GitHub
3. **Add Service** → Select your repository
4. **Configure**:
   - Root Directory: `backend`
   - Start Command: `npm start`
5. **Set Environment Variables**:
   ```
   PORT=8080
   ALLOWED_ORIGINS=https://your-app.vercel.app
   NODE_ENV=production
   ```
6. **Deploy** - Railway will provide a URL like `https://your-app.up.railway.app`

### Option 2: Render

1. **Sign up**: https://render.com
2. **Create New Web Service**
3. **Connect GitHub repository**
4. **Configure**:
   - Name: `portfolio-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. **Set Environment Variables**:
   ```
   PORT=8080
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
6. **Deploy**

### Option 3: Fly.io

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Login**: `fly auth login`
3. **Initialize**: `cd backend && fly launch`
4. **Set secrets**:
   ```bash
   fly secrets set ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
5. **Deploy**: `fly deploy`

## Post-Deployment Configuration

### 1. Update Frontend Environment Variable

After backend deploys, update your Vercel environment variable:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `REACT_APP_API_URL` with your backend URL
3. Redeploy (Vercel will auto-redeploy on next push, or trigger manually)

### 2. Update Backend CORS

After frontend deploys, update backend `ALLOWED_ORIGINS`:
1. Go to your backend hosting platform
2. Update environment variable:
   ```
   ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
   ```
3. Restart the backend service

## Environment Variables Summary

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend.railway.app/api
```

### Backend (Railway/Render/Fly.io)
```env
PORT=8080
ALLOWED_ORIGINS=https://your-app.vercel.app
NODE_ENV=production
```

## Custom Domain Setup

### Vercel Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update backend `ALLOWED_ORIGINS` to include your custom domain

## File Structure for Deployment

```
portfolio/
├── backend/
│   ├── data/
│   │   └── playlists.json    # Your data file (committed to git)
│   ├── server.js
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── public/
│   │   ├── icons/
│   │   ├── png/
│   │   └── audio/
│   ├── src/
│   ├── package.json
│   └── vercel.json           # Vercel configuration
└── README.md
```

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:
1. Check that `ALLOWED_ORIGINS` includes your exact Vercel URL
2. Ensure the backend service is running
3. Verify the frontend `REACT_APP_API_URL` is correct

### Build Failures

If Vercel build fails:
1. Check build logs in Vercel dashboard
2. Test build locally: `cd frontend && npm run build`
3. Ensure all dependencies are in `package.json`

### API Connection Issues

If frontend can't connect to backend:
1. Verify backend is deployed and accessible
2. Check `REACT_APP_API_URL` environment variable
3. Test backend URL directly in browser: `https://your-backend.com/api/playlists`

## Notes

- ✅ No database required - data stored in JSON files
- ✅ All assets (icons, PNGs, audio) are in `frontend/public/`
- ✅ Vercel automatically handles HTTPS and CDN
- ✅ Automatic deployments on git push
- ⚠️ Remember to update CORS after frontend deployment
- ⚠️ Environment variables must be set in both Vercel and backend platform
