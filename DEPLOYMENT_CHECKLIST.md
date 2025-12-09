# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### Frontend (Vercel)
- ✅ React app configured
- ✅ Environment variable support (`REACT_APP_API_URL`)
- ✅ Build script available (`npm run build`)
- ✅ All components use environment variables for API URLs
- ✅ Assets organized in `public/` folder
- ✅ `vercel.json` configuration file exists

### Backend (Separate Service)
- ✅ Express server configured
- ✅ CORS enabled with environment variable support
- ✅ Data persistence via JSON file (`backend/data/playlists.json`)
- ✅ Environment variables: `PORT`, `ALLOWED_ORIGINS`
- ✅ Package.json with start script
- ✅ Data file exists and is committed to git

## 🚀 Deployment Steps

### Step 1: Deploy Backend First

Choose a platform and deploy:

**Railway (Recommended):**
1. Sign up at https://railway.app
2. New Project → Deploy from GitHub
3. Select your repository
4. Configure:
   - Root Directory: `backend`
   - Start Command: `npm start`
5. Set environment variables:
   - `ALLOWED_ORIGINS`: `https://your-app.vercel.app` (update after frontend deploys)
6. Copy the backend URL (e.g., `https://your-app.up.railway.app`)

**Render:**
1. Sign up at https://render.com
2. New Web Service → Connect GitHub
3. Configure:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. Set environment variables
5. Copy the backend URL

### Step 2: Deploy Frontend to Vercel

1. **Connect Repository**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework: Create React App (auto-detected)
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `build` (auto-detected)

3. **Set Environment Variable**
   - Go to Settings → Environment Variables
   - Add: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.com/api` (use the URL from Step 1)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

### Step 3: Update Backend CORS

1. Go to your backend platform dashboard
2. Update environment variable:
   ```
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
3. Restart the backend service

### Step 4: Update Frontend (if needed)

If you need to update the API URL:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Update `REACT_APP_API_URL`
3. Redeploy (or push a new commit)

## 📋 Environment Variables

### Frontend (Vercel Dashboard)
```env
REACT_APP_API_URL=https://your-backend.railway.app/api
```

### Backend (Railway/Render Dashboard)
```env
PORT=8080
ALLOWED_ORIGINS=https://your-app.vercel.app
NODE_ENV=production
```

## ✅ Post-Deployment Verification

- [ ] Backend is accessible at API URL
  - Test: `https://your-backend.com/api/playlists`
- [ ] Frontend is accessible at Vercel URL
  - Test: `https://your-app.vercel.app`
- [ ] Frontend can connect to backend
  - Open browser console, check for errors
  - Verify API calls are successful
- [ ] CORS is working
  - No CORS errors in browser console
- [ ] All assets load correctly
  - Images, icons, and audio files display/play
- [ ] Audio player works
  - Can play songs from playlists
- [ ] Navigation works
  - All routes are accessible
  - Sidebar navigation functions correctly

## 🔧 Troubleshooting

### Build Fails on Vercel
- Check build logs in Vercel dashboard
- Test locally: `cd frontend && npm run build`
- Ensure all dependencies are in `package.json`

### CORS Errors
- Verify `ALLOWED_ORIGINS` includes exact Vercel URL
- Check for trailing slashes in URLs
- Ensure backend service is running

### API Connection Fails
- Verify `REACT_APP_API_URL` is set correctly
- Test backend URL directly in browser
- Check backend logs for errors

### Assets Not Loading
- Verify files are in `frontend/public/` folder
- Check file paths in code
- Ensure files are committed to git

## 📝 Notes

- ✅ Vercel automatically handles HTTPS
- ✅ Automatic deployments on git push
- ✅ No database required - data in JSON files
- ✅ All assets served from `frontend/public/`
- ⚠️ Backend must be deployed separately
- ⚠️ CORS must be configured correctly
- ⚠️ Environment variables must match between services
