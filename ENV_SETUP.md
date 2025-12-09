# Environment Variables Setup Guide

## Quick Setup

### Backend

1. Copy the example file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Update `.env` with your values:
   ```env
   PORT=8080
   ALLOWED_ORIGINS=http://localhost:3000
   NODE_ENV=development
   ```

### Frontend

1. Copy the example file:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. Update `.env.local` with your values:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   ```

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `http://localhost:3000,https://your-app.vercel.app` |
| `NODE_ENV` | Node environment | `development` or `production` |

### Frontend (.env.local)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8080/api` (local) or `https://your-backend.railway.app/api` (production) |

## For Vercel Deployment

### Frontend (Vercel Dashboard)

1. Go to your project → Settings → Environment Variables
2. Add:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend.railway.app/api`
3. Redeploy

### Backend (Railway/Render Dashboard)

1. Go to your service → Environment Variables
2. Add:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `https://your-app.vercel.app`
3. Restart service

## Notes

- `.env` and `.env.local` files are gitignored and won't be committed
- `.env.example` files are templates and should be committed
- Never commit actual `.env` files with real values
- For production, set environment variables in your hosting platform's dashboard
