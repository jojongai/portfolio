import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Icon from '../Icon';
import { getAssetUrl } from '../../utils/imageUrl';
import { PlayerContext } from '../../App';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function Playlist({ selectSong }) {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { selectedSong, currentPlaylist } = useContext(PlayerContext);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSongId, setSelectedSongId] = useState(null);

  // Check if this is the hobbies playlist (only for UI labels)
  const isHobbiesPlaylist = playlistId === 'hobbies-and-interests-playlist-id';
  const isPersonalProjectsPlaylist = playlistId === 'personal-projects-playlist-id';

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
      setError('Failed to fetch playlist. Make sure the backend server is running on port 8080.');
      console.error('Error fetching playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatLocation = (song) => {
    return song.location || song.duration || '';
  };

  const handleSongClick = (song, index, e) => {
    if (!selectSong) return;
    // Single click - just select (grey highlight)
    setSelectedSongId(song.id);
  };

  const handleSongDoubleClick = (song, index, e) => {
    if (!selectSong) return;
    e.preventDefault();
    e.stopPropagation();
    // Double click - select the song and highlight in green (works even without mp3Path)
    selectSong(song, playlist, index);
    // Clear selected state since song is now playing/selected
    setSelectedSongId(null);
  };

  // Check if song is currently playing
  const isSongPlaying = (song) => {
    return selectedSong && selectedSong.id === song.id && currentPlaylist && currentPlaylist.id === playlistId;
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
            <p className="playlist-type">{isHobbiesPlaylist ? 'Collection' : 'Playlist'}</p>
            <h1 className="playlist-title-large">{playlist.title}</h1>
            <p className="playlist-description-large">{playlist.description}</p>
            <div className="playlist-meta">
              <span className="playlist-author">Jojo Ngai</span>
              <span className="playlist-song-count">{playlist.songs.length} {isHobbiesPlaylist ? 'items' : 'songs'}</span>
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
          <div className="song-image-header"></div>
          <div className="song-title">Title</div>
          <div className="song-duration">{isHobbiesPlaylist ? 'Category' : isPersonalProjectsPlaylist ? 'Duration' : 'Location'}</div>
          <div className="song-artist">{isHobbiesPlaylist ? 'Description' : 'Details'}</div>
        </div>
        
        {playlist.songs.map((song, index) => {
          const isPlaying = isSongPlaying(song);
          const isSelected = selectedSongId === song.id;
          return (
            <div 
              key={song.id || index} 
              className={`song-row ${isSelected ? 'selected' : ''} ${isPlaying ? 'playing' : ''}`}
              onClick={(e) => handleSongClick(song, index, e)}
              onDoubleClick={(e) => handleSongDoubleClick(song, index, e)}
            >
              <div className={`song-number ${isPlaying ? 'playing' : ''}`}>{index + 1}</div>
              <div className="song-image">
                {song.imagePng ? (
                  <img src={getAssetUrl(song.imagePng)} alt={song.title} className="song-image-img" />
                ) : null}
              </div>
              <div className="song-info">
                <div className={`song-title-text ${isPlaying ? 'playing' : ''}`}>{song.title}</div>
                <div className="song-description">{song.description}</div>
              </div>
              <div className="song-duration-text">{formatLocation(song)}</div>
              <div className="song-artist-text">{song.artist || ''}</div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

export default Playlist;
