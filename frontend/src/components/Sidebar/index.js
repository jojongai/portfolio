import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getAssetUrl } from '../../utils/imageUrl';
import Icon from '../Icon';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://portfolio-five-gamma-wpepful1p8.vercel.app';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/playlists`);
      setPlaylists(response.data);
    } catch (err) {
      console.error('Error fetching playlists:', err);
    }
  };

  const isPlaylistActive = (playlistId) => {
    return location.pathname.startsWith(`/playlist/${playlistId}`);
  };

  const isHome = location.pathname === '/';

  return (
    <div className="sidebar">
      <div className="sidebar-top-panel">
        <button className={`sidebar-home-btn ${isHome ? 'active' : ''}`} onClick={() => navigate('/')}>
          <Icon name="home" fallback="🏠" alt="Home" />
          Home
        </button>
      </div>
      <div className="sidebar-library-panel">
        <div className="sidebar-library-header">
          <span className="sidebar-library-title">
            <span className="sidebar-library-icon">📚</span>
            Your Library
          </span>
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
              <span className="nav-item-text">
                <span className="nav-item-title">{playlist.title}</span>
                <span className="nav-item-subtitle">Playlist · Jojo Ngai</span>
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
