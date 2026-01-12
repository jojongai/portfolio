import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getAssetUrl } from '../../utils/imageUrl';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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

  const isPlaylistActive = (playlistId) => {
    return location.pathname.startsWith(`/playlist/${playlistId}`);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <h1>Jojo Ngai</h1>
        <p>Portfolio</p>
      </div>
      <nav className="sidebar-nav">
        {playlists
          .filter(playlist => playlist.id !== 'skills-technologies-playlist-id')
          .map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => navigate(`/playlist/${playlist.id}`)}
            className={`nav-item ${isPlaylistActive(playlist.id) ? 'active' : ''}`}
          >
            <span className="nav-icon">
              {playlist.imagePng ? (
                <img src={getAssetUrl(playlist.imagePng)} alt={playlist.title} className="nav-icon-img" />
              ) : (
                playlist.imageUrl
              )}
            </span>
            {playlist.title}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
