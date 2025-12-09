import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Icon from '../Icon';
import { getAssetUrl } from '../../utils/imageUrl';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function PlaylistDetail({ selectSong }) {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/playlists/${playlistId}`);
      setPlaylist(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch playlist. Make sure the backend server is running on port 8080.');
      console.error('Error fetching playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatLocation = (song) => {
    return song.location || song.duration || '';
  };

  if (loading) {
    return (
      <div className="app">
        <Sidebar />
        <div className="playlist-detail">
          <div className="playlist-header">
            <div className="loading">Loading playlist...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="app">
        <Sidebar />
        <div className="playlist-detail">
          <div className="playlist-header">
            <div className="error">{error || 'Playlist not found'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="playlist-detail">
      <div className="playlist-header">
        <div className="playlist-info">
          <div className="playlist-image-large">
            {playlist.imagePng ? (
              <img src={getAssetUrl(playlist.imagePng)} alt={playlist.title} className="playlist-image-large-img" />
            ) : (
              playlist.imageUrl
            )}
          </div>
          <div className="playlist-details">
            <p className="playlist-type">Playlist</p>
            <h1 className="playlist-title-large">{playlist.title}</h1>
            <p className="playlist-description-large">{playlist.description}</p>
            <div className="playlist-meta">
              <span className="playlist-author">Jojo Ngai</span>
              <span className="playlist-song-count">{playlist.songs.length} songs</span>
            </div>
          </div>
        </div>
        <div className="playlist-actions">
          <button className="play-button-large">
            <Icon name="play" fallback="▶" alt="Play" />
          </button>
        </div>
      </div>

      <div className="songs-list">
        <div className="songs-header">
          <div className="song-number">#</div>
          <div className="song-title">Title</div>
          <div className="song-artist">Details</div>
          <div className="song-duration">Location</div>
        </div>
        
        {playlist.songs.map((song, index) => (
          <div 
            key={song.id} 
            className="song-row"
            onClick={() => navigate(`/playlist/${playlistId}/song/${song.id}`)}
          >
            <div className="song-number">{index + 1}</div>
            <div className="song-info">
              <div className="song-title-text">{song.title}</div>
              <div className="song-description">{song.description}</div>
            </div>
            <div className="song-artist-text">{song.artist}</div>
            <div className="song-duration-text">{formatLocation(song)}</div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default PlaylistDetail;
