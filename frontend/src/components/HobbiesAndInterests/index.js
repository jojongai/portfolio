import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Icon from '../Icon';
import { getAssetUrl } from '../../utils/imageUrl';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function HobbiesAndInterests() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const id = playlistId || 'hobbies-and-interests-playlist-id';
      const response = await axios.get(`${API_BASE_URL}/playlists/${id}`);
      setPlaylist(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch hobbies. Make sure the backend server is running on port 8080.');
      console.error('Error fetching playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <Sidebar />
        <div className="hobbies-content">
          <div className="loading">Loading hobbies...</div>
        </div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="app">
        <Sidebar />
        <div className="hobbies-content">
          <div className="error">{error || 'Hobbies not found'}</div>
        </div>
      </div>
    );
  }

  const hobbies = playlist.songs || [];

  return (
    <div className="app">
      <Sidebar />
      <div className="hobbies-content">
        <div className="hobbies-header">
          <div className="hobbies-header-content">
            <div className="hobbies-icon-large">
              {playlist.imagePng ? (
                <img src={getAssetUrl(playlist.imagePng)} alt={playlist.title} className="hobbies-header-icon-img" />
              ) : (
                <Icon name="target" fallback={playlist.imageUrl || "🎯"} alt="Hobbies and Interests" className="hobbies-header-icon" />
              )}
            </div>
            <div className="hobbies-header-details">
              <p className="hobbies-type">Collection</p>
              <h1 className="hobbies-title-large">{playlist.title}</h1>
              <p className="hobbies-description">{playlist.description}</p>
            </div>
          </div>
        </div>

        <div className="hobbies-grid">
          {hobbies.map((hobby, index) => {
            const iconMap = {
              '📷': { name: 'photography', fallback: '📷' },
              '📚': { name: 'reading', fallback: '📚' },
              '⛰️': { name: 'hiking', fallback: '⛰️' },
              '👨‍🍳': { name: 'cooking', fallback: '👨‍🍳' },
              '🎮': { name: 'gaming', fallback: '🎮' },
              '💻': { name: 'coding', fallback: '💻' }
            };
            const iconInfo = iconMap[hobby.icon] || { name: `hobby-${index}`, fallback: hobby.icon || '🎯' };
            
            return (
              <div key={hobby.id || index} className="hobby-card">
                <div className="hobby-icon">
                  {hobby.imagePng ? (
                    <img src={getAssetUrl(hobby.imagePng)} alt={hobby.title} className="hobby-icon-img" />
                  ) : (
                    <Icon {...iconInfo} alt={hobby.title} className="hobby-icon-img" />
                  )}
                </div>
                <h3 className="hobby-title">{hobby.title}</h3>
                <p className="hobby-description">{hobby.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HobbiesAndInterests;

