# Deployment Guide

This application can be deployed without a database. All data is stored in JSON files in the backend folder.

## Deployment Options

### Option 1: Deploy Backend + Frontend Separately (Recommended)

#### Backend Deployment (Node.js)
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com
- **Fly.io**: https://fly.io
- **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform

**Steps:**
1. Push backend code to GitHub
2. Connect repository to deployment platform
3. Set environment variables:
   - `PORT` (usually auto-set)
   - `ALLOWED_ORIGINS` (your frontend URL, e.g., `https://yourdomain.com`)
4. Deploy

#### Frontend Deployment (React)
- **Vercel**: https://vercel.com (recommended for React)
- **Netlify**: https://netlify.com
- **GitHub Pages**: https://pages.github.com

**Steps:**
1. Update frontend API URL in `App.js`:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
   ```
2. Build frontend: `npm run build`
3. Deploy build folder or connect GitHub repo

### Option 2: Deploy Everything Together

**Platforms that support full-stack:**
- **Railway**: Can deploy both in one project
- **Render**: Can deploy both services
- **Vercel**: Can deploy API routes + frontend

### Option 3: Static JSON Files (No Backend)

If you want a completely static site:
1. Export your data to static JSON files
2. Place them in `public/api/` folder
3. Update frontend to fetch from `/api/playlists.json`
4. Deploy frontend only (Vercel, Netlify, etc.)

## Environment Variables

### Backend
```env
PORT=8080
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
NODE_ENV=production
```

### Frontend
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

## File Structure for Deployment

```
portfolio/
├── backend/
│   ├── data/
│   │   └── playlists.json    # Your data file
│   ├── server.js
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── public/
│   │   ├── icons/
│   │   ├── png/
│   │   └── audio/
│   ├── src/
│   └── package.json
```

## Notes

- Data is stored in `backend/data/playlists.json`
- No database required - all data persists in the JSON file
- Easy to edit: just update the JSON file and restart the server
- For production, consider adding authentication if you need to protect write endpoints

