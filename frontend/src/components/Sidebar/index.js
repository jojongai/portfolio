import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const API_BASE_URL = 'http://localhost:8080/api';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/playlists`);
      setPlaylists(response.data);
    } catch (err) {
      console.error('Error fetching playlists:', err);
    }
  };

  const isHomeActive = location.pathname === '/';
  const isLikedSongsActive = location.pathname === '/liked-songs';
  const isPlaylistActive = (playlistId) => {
    return location.pathname.startsWith(`/playlist/${playlistId}`);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>Jojo Ngai</h1>
        <p>Portfolio</p>
      </div>
      <nav className="sidebar-nav">
        <button 
          onClick={() => navigate('/')} 
          className={`nav-item ${isHomeActive ? 'active' : ''}`}
        >
          <span className="nav-icon">🏠</span>
          Home
        </button>
        <button 
          onClick={() => navigate('/liked-songs')} 
          className={`nav-item ${isLikedSongsActive ? 'active' : ''}`}
        >
          <span className="nav-icon">❤️</span>
          Liked Songs
        </button>
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => navigate(`/playlist/${playlist.id}`)}
            className={`nav-item ${isPlaylistActive(playlist.id) ? 'active' : ''}`}
          >
            <span className="nav-icon">{playlist.imageUrl}</span>
            {playlist.title}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
