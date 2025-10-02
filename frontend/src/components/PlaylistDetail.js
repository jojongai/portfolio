import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlaylistDetail.css';

const API_BASE_URL = 'http://localhost:8080/api';

function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/playlists/${id}`);
      setPlaylist(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch playlist. Make sure the backend server is running on port 8080.');
      console.error('Error fetching playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration) => {
    return duration;
  };

  if (loading) {
    return (
      <div className="playlist-detail">
        <div className="playlist-header">
          <div className="loading">Loading playlist...</div>
        </div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="playlist-detail">
        <div className="playlist-header">
          <div className="error">{error || 'Playlist not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="playlist-detail">
      <div className="playlist-header">
        <div className="playlist-info">
          <div className="playlist-image-large">
            {playlist.imageUrl}
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
          <button className="play-button-large">▶</button>
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </div>

      <div className="songs-list">
        <div className="songs-header">
          <div className="song-number">#</div>
          <div className="song-title">Title</div>
          <div className="song-artist">Details</div>
          <div className="song-duration">Duration</div>
        </div>
        
        {playlist.songs.map((song, index) => (
          <div key={song.id} className="song-row">
            <div className="song-number">{index + 1}</div>
            <div className="song-info">
              <div className="song-title-text">{song.title}</div>
              <div className="song-description">{song.description}</div>
            </div>
            <div className="song-artist-text">{song.artist}</div>
            <div className="song-duration-text">{formatDuration(song.duration)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistDetail;
