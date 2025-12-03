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
// Using fixed UUIDs so IDs don't change on server restart
let playlists = [
  {
    id: "work-experience-playlist-id",
    title: "Work Experience",
    description: "My professional journey through different companies",
    imageUrl: "💼",
    songs: [
      {
        id: "techcorp-song-id",
        title: "Software Engineer at TechCorp",
        artist: "2022 - 2024",
        duration: "2 years",
        description: "Led development of microservices architecture using Node.js and React",
        mp3Path: "/audio/every_summertime.mp3", // Path to MP3 file in public/audio folder
        accomplishments: [
          "Architected and implemented a scalable microservices system serving 1M+ daily active users",
          "Reduced API response time by 40% through database optimization and caching strategies",
          "Mentored a team of 3 junior developers, improving code quality and deployment frequency",
          "Led migration from monolithic architecture to microservices, reducing deployment time by 60%",
          "Implemented CI/CD pipelines that increased deployment frequency from weekly to daily"
        ]
      },
      {
        id: "startupxyz-song-id",
        title: "Junior Developer at StartupXYZ",
        artist: "2021 - 2022",
        duration: "1 year",
        description: "Built full-stack web applications and learned agile development practices",
        mp3Path: "/audio/startupxyz-experience.mp3", // Path to MP3 file in public/audio folder
        accomplishments: [
          "Developed 5+ production features using React and Node.js",
          "Participated in daily standups and sprint planning sessions",
          "Fixed 50+ bugs and improved application performance",
          "Collaborated with designers to implement pixel-perfect UI components"
        ]
      },
      {
        id: "bigtech-song-id",
        title: "Intern at BigTech Inc",
        artist: "2020 - 2021",
        duration: "6 months",
        description: "Gained experience in Python, data analysis, and team collaboration",
        mp3Path: "/audio/bigtech-intern-experience.mp3", // Path to MP3 file in public/audio folder
        accomplishments: [
          "Analyzed large datasets using Python and pandas",
          "Created data visualizations and reports for stakeholders",
          "Participated in code reviews and learned best practices",
          "Contributed to internal tools and documentation"
        ]
      }
    ]
  },
  {
    id: "personal-projects-playlist-id",
    title: "Personal Projects",
    description: "Side projects and creative coding experiments",
    imageUrl: "🚀",
    songs: [
      {
        id: "portfolio-website-song-id",
        title: "Portfolio Website",
        artist: "React, Node.js",
        duration: "2 weeks",
        description: "A Spotify-inspired portfolio website with modern design"
      },
      {
        id: "task-management-song-id",
        title: "Task Management App",
        artist: "Vue.js, Express",
        duration: "1 month",
        description: "Full-stack application for team collaboration and project tracking"
      },
      {
        id: "weather-dashboard-song-id",
        title: "Weather Dashboard",
        artist: "JavaScript, APIs",
        duration: "1 week",
        description: "Real-time weather data visualization with interactive charts"
      }
    ]
  },
  {
    id: "skills-technologies-playlist-id",
    title: "Skills & Technologies",
    description: "My technical skills and learning journey",
    imageUrl: "⚡",
    songs: [
      {
        id: "frontend-dev-song-id",
        title: "Frontend Development",
        artist: "React, Vue.js, TypeScript",
        duration: "3+ years",
        description: "Building responsive and interactive user interfaces"
      },
      {
        id: "backend-dev-song-id",
        title: "Backend Development",
        artist: "Node.js, Python, Java",
        duration: "2+ years",
        description: "Server-side development and API design"
      },
      {
        id: "database-mgmt-song-id",
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
  console.log('[Backend] Fetching playlist:', req.params.id);
  const playlist = playlists.find(p => p.id === req.params.id);
  if (!playlist) {
    console.log('[Backend] Playlist not found');
    return res.status(404).json({ message: 'Playlist not found' });
  }
  console.log('[Backend] Playlist found:', playlist.title);
  console.log('[Backend] Songs in playlist:', playlist.songs.map(s => ({
    id: s.id,
    title: s.title,
    hasMp3: !!s.mp3Path,
    mp3Path: s.mp3Path
  })));
  console.log('[Backend] Full first song object:', JSON.stringify(playlist.songs[0], null, 2));
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
