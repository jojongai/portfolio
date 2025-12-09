# Portfolio Website

A full-stack portfolio website built with Node.js/Express backend and React frontend, deployed on Vercel.

## Features

- RESTful API for managing playlists and songs
- Modern React frontend with responsive design
- CORS enabled for cross-origin requests
- JSON file-based data storage (no database required)
- Spotify-inspired UI with audio player

## Project Structure

```
portfolio/
├── backend/          # Node.js/Express API server
│   ├── data/
│   │   └── playlists.json    # Data storage
│   ├── package.json
│   └── server.js
├── frontend/         # React application
│   ├── public/
│   │   ├── icons/
│   │   ├── png/
│   │   └── audio/
│   ├── src/
│   ├── package.json
│   └── vercel.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your values
   
   # Frontend
   cd ../frontend
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

   See `ENV_SETUP.md` for detailed environment variable configuration.

### Running Locally

1. Start the backend server (runs on port 8080):
   ```bash
   npm run start:backend
   # or for development with auto-restart:
   npm run dev:backend
   ```

2. Start the React frontend (runs on port 3000):
   ```bash
   npm run start:frontend
   ```

Or run both simultaneously:
```bash
npm start
# or for development:
npm run dev
```

### API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get a specific playlist
- `POST /api/playlists` - Create a new playlist
- `PUT /api/playlists/:id` - Update a playlist
- `DELETE /api/playlists/:id` - Delete a playlist

## Deployment

This application is configured for deployment on **Vercel** (frontend) with a separate backend service.

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure the project:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Set environment variable:
   - `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-backend.railway.app/api`)
5. Deploy!

### Backend Deployment

The backend needs to be deployed separately. Recommended platforms:
- **Railway**: https://railway.app (recommended)
- **Render**: https://render.com
- **Fly.io**: https://fly.io

See `DEPLOYMENT.md` for detailed backend deployment instructions.

### Environment Variables

**Frontend (Vercel):**
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

**Backend:**
```env
PORT=8080
ALLOWED_ORIGINS=https://your-app.vercel.app
NODE_ENV=production
```

## Development

- Backend: Express.js with CORS enabled
- Frontend: React with modern CSS styling
- Data: JSON file storage in `backend/data/playlists.json`
- Assets: Icons, images, and audio files in `frontend/public/`

## Notes

- No database required - all data persists in JSON files
- Easy to edit: update `backend/data/playlists.json` and restart the server
- All assets are served from `frontend/public/` folder
- CORS must be configured to allow your Vercel frontend URL
