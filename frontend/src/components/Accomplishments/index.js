import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import AudioPlayer from '../AudioPlayer';
import { getAssetUrl } from '../../utils/imageUrl';
import { PlayerContext } from '../../App';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function Accomplishments({ selectSong }) {
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

  useEffect(() => {
    if (song) {
      console.log('[Accomplishments] Song state updated:', {
        title: song.title,
        mp3Path: song.mp3Path,
        hasMp3: !!song.mp3Path
      });
    }
  }, [song]);

  const fetchPlaylistAndSong = async () => {
    try {
      console.log('[Accomplishments] Fetching playlist and song...', { playlistId, songId });
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/playlists/${playlistId}`);
      console.log('[Accomplishments] Playlist data received:', response.data);
      setPlaylist(response.data);
      const foundSong = response.data.songs.find(s => s.id === songId);
      console.log('[Accomplishments] Looking for song with ID:', songId);
      console.log('[Accomplishments] Available songs:', response.data.songs.map(s => ({ id: s.id, title: s.title })));
      if (foundSong) {
        console.log('[Accomplishments] Song found:', foundSong);
        console.log('[Accomplishments] MP3 Path:', foundSong.mp3Path);
        setSong(foundSong);
        // Only call selectSong if this is a different song than what's currently playing
        // This prevents pausing/restarting when navigating to the accomplishments page
        if (selectSong && (!selectedSong || selectedSong.id !== foundSong.id)) {
          console.log('[Accomplishments] Calling selectSong callback');
          const songIndex = response.data.songs.findIndex(s => s.id === songId);
          selectSong(foundSong, response.data, songIndex);
        }
      } else {
        console.error('[Accomplishments] Song not found in playlist');
        setError('Song not found');
      }
      setError(null);
    } catch (err) {
      console.error('[Accomplishments] Error fetching song:', err);
      setError('Failed to fetch song details. Make sure the backend server is running on port 8080.');
    } finally {
      setLoading(false);
      console.log('[Accomplishments] Loading complete');
    }
  };

  if (loading) {
    return (
      <div className="app">
        <Sidebar />
        <div className="song-detail">
          <div className="loading">Loading song details...</div>
        </div>
      </div>
    );
  }

  if (error || !song || !playlist) {
    return (
      <div className="app">
        <Sidebar />
        <div className="song-detail">
          <div className="error">{error || 'Song not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="song-detail">
        <div className="song-header">
          <div className="song-header-info">
            <div className="song-image-large">
              {playlist.imagePng ? (
                <img src={getAssetUrl(playlist.imagePng)} alt={playlist.title} className="song-image-large-img" />
              ) : (
                playlist.imageUrl
              )}
            </div>
            <div className="song-header-details">
              <p className="song-type">Experience</p>
              <h1 className="song-title-large">{song.title}</h1>
              <p className="song-artist-large">{song.artist}</p>
              <p className="song-description-header">{song.description}</p>
            </div>
          </div>
        </div>

        {song.mp3Path ? (
          <div className="audio-player-section">
            <AudioPlayer 
              audioSrc={song.mp3Path} 
              title={song.title}
              artist={song.artist}
            />
          </div>
        ) : (
          <div className="audio-player-section">
            <p style={{ color: '#b3b3b3', textAlign: 'center' }}>
              No audio file available for this experience
            </p>
          </div>
        )}

        <div className="lyrics-container">
          <div className="lyrics-content">
            <div className="lyrics-title-row">
              <h2 className="lyrics-title">Accomplishments</h2>
              {(song.technologies || song.languages) && (
                <div className="song-technologies">
                  {song.technologies && song.languages ? (
                    <p className="tech-content">{song.technologies}, {song.languages}</p>
                  ) : (
                    <p className="tech-content">{song.technologies || song.languages}</p>
                  )}
                </div>
              )}
            </div>
            {song.accomplishments && song.accomplishments.length > 0 ? (
              <div className="accomplishments-list">
                {song.accomplishments.map((accomplishment, index) => (
                  <div key={index} className="accomplishment-item">
                    <div className="accomplishment-bullet"></div>
                    <div className="accomplishment-content">
                      <p className="accomplishment-text">{accomplishment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-accomplishments">
                <p>No accomplishments listed yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accomplishments;
