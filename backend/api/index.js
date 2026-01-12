const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
const allowedOrigins = [
  'https://portfolio-live-eqgl.vercel.app',
  'https://portfolio-live.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Allow all origins in development, or restrict as needed
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load data from JSON file
// In Vercel, __dirname points to the api/ directory, so we go up one level to backend root
const dataPath = path.join(__dirname, '..', 'data', 'playlists.json');

// Helper function to read playlists from file
function loadPlaylists() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading playlists:', error);
    return [];
  }
}

// Helper function to save playlists to file
function savePlaylists(playlists) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(playlists, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving playlists:', error);
    return false;
  }
}

// In-memory data store (loaded from JSON file)
let playlists = loadPlaylists();

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
  savePlaylists(playlists);
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
  
  savePlaylists(playlists);
  res.json(playlists[playlistIndex]);
});

app.delete('/api/playlists/:id', (req, res) => {
  const playlistIndex = playlists.findIndex(p => p.id === req.params.id);
  
  if (playlistIndex === -1) {
    return res.status(404).json({ message: 'Playlist not found' });
  }
  
  playlists.splice(playlistIndex, 1);
  savePlaylists(playlists);
  res.status(204).send();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Export the Express app for Vercel
module.exports = app;

