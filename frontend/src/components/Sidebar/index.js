import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Icon from '../Icon';
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

  const isHomeActive = location.pathname === '/';
  const isHobbiesActive = location.pathname === '/hobbies';
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
          <span className="nav-icon">
            <Icon name="home" fallback="🏠" alt="Home" />
          </span>
          Home
        </button>
        <button 
          onClick={() => navigate('/hobbies')} 
          className={`nav-item ${isHobbiesActive ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <Icon name="target" fallback="🎯" alt="Hobbies and Interests" />
          </span>
          Hobbies and Interests
        </button>
        {playlists.map((playlist) => (
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
