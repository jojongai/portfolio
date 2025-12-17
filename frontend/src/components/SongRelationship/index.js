import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import { getAssetUrl } from '../../utils/imageUrl';
import { PlayerContext } from '../../App';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function SongRelationship() {
  const { playlistId, songId } = useParams();
  const navigate = useNavigate();
  const { selectedSong } = useContext(PlayerContext);
  const [playlist, setPlaylist] = useState(null);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaylistAndSong();
  }, [playlistId, songId]);

  const fetchPlaylistAndSong = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/playlists/${playlistId}`);
      setPlaylist(response.data);
      const foundSong = response.data.songs.find(s => s.id === songId);
      if (foundSong) {
        setSong(foundSong);
      } else {
        setError('Song not found');
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching song:', err);
      setError('Failed to fetch song details. Make sure the backend server is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <Sidebar />
        <div className="song-relationship">
          <div className="loading">Loading song relationship...</div>
        </div>
      </div>
    );
  }

  if (error || !song || !playlist) {
    return (
      <div className="app">
        <Sidebar />
        <div className="song-relationship">
          <div className="error">{error || 'Song not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="song-relationship">
        <div className="song-relationship-content">
          <div className="song-cover-container">
            {song.songCover ? (
              <img 
                src={getAssetUrl(song.songCover)} 
                alt={song.title} 
                className="song-cover-image" 
              />
            ) : (
              <div className="song-cover-placeholder">No Image</div>
            )}
          </div>
          <div className="song-artist-name">{song.artist || 'Unknown Artist'}</div>
          {song.songRelationship && (
            <div className="song-relationship-description">{song.songRelationship}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SongRelationship;

