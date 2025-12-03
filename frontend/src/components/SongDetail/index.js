import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import AudioPlayer from '../AudioPlayer';
import './index.css';

const API_BASE_URL = 'http://localhost:8080/api';

function SongDetail({ selectSong }) {
  const { playlistId, songId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaylistAndSong();
  }, [playlistId, songId]);

  useEffect(() => {
    if (song) {
      console.log('[SongDetail] Song state updated:', {
        title: song.title,
        mp3Path: song.mp3Path,
        hasMp3: !!song.mp3Path
      });
    }
  }, [song]);

  const fetchPlaylistAndSong = async () => {
    try {
      console.log('[SongDetail] Fetching playlist and song...', { playlistId, songId });
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/playlists/${playlistId}`);
      console.log('[SongDetail] Playlist data received:', response.data);
      setPlaylist(response.data);
      const foundSong = response.data.songs.find(s => s.id === songId);
      console.log('[SongDetail] Looking for song with ID:', songId);
      console.log('[SongDetail] Available songs:', response.data.songs.map(s => ({ id: s.id, title: s.title })));
      if (foundSong) {
        console.log('[SongDetail] Song found:', foundSong);
        console.log('[SongDetail] MP3 Path:', foundSong.mp3Path);
        setSong(foundSong);
        if (selectSong) {
          console.log('[SongDetail] Calling selectSong callback');
          selectSong(foundSong);
        }
      } else {
        console.error('[SongDetail] Song not found in playlist');
        setError('Song not found');
      }
      setError(null);
    } catch (err) {
      console.error('[SongDetail] Error fetching song:', err);
      setError('Failed to fetch song details. Make sure the backend server is running on port 8080.');
    } finally {
      setLoading(false);
      console.log('[SongDetail] Loading complete');
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
          <button className="back-button" onClick={() => navigate(`/playlist/${playlistId}`)}>
            ← Back to {playlist.title}
          </button>
          <div className="song-header-info">
            <div className="song-image-large">
              {playlist.imageUrl}
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
            <h2 className="lyrics-title">Accomplishments</h2>
            {song.accomplishments && song.accomplishments.length > 0 ? (
              <div className="accomplishments-list">
                {song.accomplishments.map((accomplishment, index) => (
                  <div key={index} className="accomplishment-item">
                    <p className="accomplishment-text">{accomplishment}</p>
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

export default SongDetail;
