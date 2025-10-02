const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory data store (replace with database in production)
let playlists = [
  {
    id: uuidv4(),
    title: "Work Experience",
    description: "My professional journey through different companies",
    imageUrl: "💼",
    songs: [
      {
        id: uuidv4(),
        title: "Software Engineer at TechCorp",
        artist: "2022 - 2024",
        duration: "2 years",
        description: "Led development of microservices architecture using Node.js and React"
      },
      {
        id: uuidv4(),
        title: "Junior Developer at StartupXYZ",
        artist: "2021 - 2022",
        duration: "1 year",
        description: "Built full-stack web applications and learned agile development practices"
      },
      {
        id: uuidv4(),
        title: "Intern at BigTech Inc",
        artist: "2020 - 2021",
        duration: "6 months",
        description: "Gained experience in Python, data analysis, and team collaboration"
      }
    ]
  },
  {
    id: uuidv4(),
    title: "Personal Projects",
    description: "Side projects and creative coding experiments",
    imageUrl: "🚀",
    songs: [
      {
        id: uuidv4(),
        title: "Portfolio Website",
        artist: "React, Node.js",
        duration: "2 weeks",
        description: "A Spotify-inspired portfolio website with modern design"
      },
      {
        id: uuidv4(),
        title: "Task Management App",
        artist: "Vue.js, Express",
        duration: "1 month",
        description: "Full-stack application for team collaboration and project tracking"
      },
      {
        id: uuidv4(),
        title: "Weather Dashboard",
        artist: "JavaScript, APIs",
        duration: "1 week",
        description: "Real-time weather data visualization with interactive charts"
      }
    ]
  },
  {
    id: uuidv4(),
    title: "Skills & Technologies",
    description: "My technical skills and learning journey",
    imageUrl: "⚡",
    songs: [
      {
        id: uuidv4(),
        title: "Frontend Development",
        artist: "React, Vue.js, TypeScript",
        duration: "3+ years",
        description: "Building responsive and interactive user interfaces"
      },
      {
        id: uuidv4(),
        title: "Backend Development",
        artist: "Node.js, Python, Java",
        duration: "2+ years",
        description: "Server-side development and API design"
      },
      {
        id: uuidv4(),
        title: "Database Management",
        artist: "MongoDB, PostgreSQL",
        duration: "2+ years",
        description: "Data modeling and database optimization"
      }
    ]
  }
];

// Routes
app.get('/api/playlists', (req, res) => {
  res.json(playlists);
});

app.get('/api/playlists/:id', (req, res) => {
  const playlist = playlists.find(p => p.id === req.params.id);
  if (!playlist) {
    return res.status(404).json({ message: 'Playlist not found' });
  }
  res.json(playlist);
});

app.post('/api/playlists', (req, res) => {
  const { title, description, imageUrl, songs } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  
  const newPlaylist = {
    id: uuidv4(),
    title,
    description,
    imageUrl: imageUrl || '🎵',
    songs: songs || []
  };
  
  playlists.push(newPlaylist);
  res.status(201).json(newPlaylist);
});

app.put('/api/playlists/:id', (req, res) => {
  const playlistIndex = playlists.findIndex(p => p.id === req.params.id);
  
  if (playlistIndex === -1) {
    return res.status(404).json({ message: 'Playlist not found' });
  }
  
  const { title, description, imageUrl, songs } = req.body;
  
  playlists[playlistIndex] = {
    ...playlists[playlistIndex],
    title: title || playlists[playlistIndex].title,
    description: description || playlists[playlistIndex].description,
    imageUrl: imageUrl || playlists[playlistIndex].imageUrl,
    songs: songs || playlists[playlistIndex].songs
  };
  
  res.json(playlists[playlistIndex]);
});

app.delete('/api/playlists/:id', (req, res) => {
  const playlistIndex = playlists.findIndex(p => p.id === req.params.id);
  
  if (playlistIndex === -1) {
    return res.status(404).json({ message: 'Playlist not found' });
  }
  
  playlists.splice(playlistIndex, 1);
  res.status(204).send();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
