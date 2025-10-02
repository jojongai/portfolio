import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PlaylistDetail from './components/PlaylistDetail';
import Player from './components/Player';
import './index.css';

const API_BASE_URL = 'http://localhost:8080/api';

// Player Context for global state
const PlayerContext = createContext();

function HomePage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const { selectSong } = useContext(PlayerContext);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/playlists`);
      setPlaylists(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch playlists. Make sure the backend server is running on port 8080.');
      console.error('Error fetching playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist.id}`);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-logo">
            <h1>Jojo Ngai</h1>
            <p>Portfolio</p>
          </div>
        </div>
        <div className="main-content">
          <div className="loading">Loading playlists...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-logo">
            <h1>Jojo Ngai</h1>
            <p>Portfolio</p>
          </div>
        </div>
        <div className="main-content">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-logo">
          <h1>Jojo Ngai</h1>
          <p>Portfolio</p>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <span className="nav-icon">🏠</span>
            Home
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🔍</span>
            Search
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">📚</span>
            Your Library
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">➕</span>
            Create Playlist
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">❤️</span>
            Liked Songs
          </a>
        </nav>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <h1 className="welcome-text">Good afternoon</h1>
          <button className="play-button">PLAY</button>
        </div>

        <div className="content-area">
          <h2 className="section-title">Made for Jojo Ngai</h2>
          
          <div className="playlists-grid">
            {playlists.map((playlist) => (
              <div 
                key={playlist.id} 
                className="playlist-card"
                onClick={() => handlePlaylistClick(playlist)}
              >
                <div className="playlist-image">
                  {playlist.imageUrl}
                </div>
                <div className="play-button-overlay">
                  ▶
                </div>
                <h3 className="playlist-title">{playlist.title}</h3>
                <p className="playlist-description">{playlist.description}</p>
                <div className="playlist-tech">{playlist.songs.length} songs</div>
              </div>
            ))}
          </div>

          {playlists.length === 0 && (
            <div className="loading">No playlists found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlaylistDetailWithContext() {
  const { selectSong } = useContext(PlayerContext);
  return <PlaylistDetail selectSong={selectSong} />;
}

function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectSong = (song) => {
    setSelectedSong(song);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playerContextValue = {
    selectedSong,
    isPlaying,
    selectSong,
    handlePlayPause
  };

  return (
    <PlayerContext.Provider value={playerContextValue}>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/playlist/:id" element={<PlaylistDetailWithContext />} />
          </Routes>
          <Player 
            selectedSong={selectedSong} 
            onPlayPause={handlePlayPause}
            isPlaying={isPlaying}
          />
        </div>
      </Router>
    </PlayerContext.Provider>
  );
}

export default App;
