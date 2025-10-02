# Portfolio Website

A full-stack portfolio website built with Node.js/Express backend and React frontend.

## Features

- RESTful API for managing projects
- Modern React frontend with responsive design
- CORS enabled for cross-origin requests
- In-memory data storage (easily replaceable with a database)

## Project Structure

```
portfolio/
├── backend/          # Node.js/Express API server
│   ├── package.json
│   └── server.js
├── frontend/         # React application
│   ├── package.json
│   ├── public/
│   └── src/
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Applications

#### Option 1: Install dependencies and run both applications

1. Install all dependencies (root, backend, and frontend):
   ```bash
   npm run install:all
   ```

2. Start both applications simultaneously:
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

#### Option 2: Run separately

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Start the backend server (runs on port 8080):
   ```bash
   npm run start:backend
   # or for development with auto-restart:
   npm run dev:backend
   ```

3. Start the React frontend (runs on port 3000):
   ```bash
   npm run start:frontend
   ```


### API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `GET /api/health` - Health check

### Sample Project Data

The backend comes with sample project data that will be displayed on the frontend.

## Development

- Backend: Express.js with CORS enabled
- Frontend: React with modern CSS styling
- Data: In-memory storage (replace with database for production)

## Production Deployment

For production deployment:

1. Replace in-memory storage with a proper database (MongoDB, PostgreSQL, etc.)
2. Add environment variables for configuration
3. Add authentication and authorization
4. Build the React app: `npm run build`
5. Serve the built files with a web server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request