import React, { useState, useEffect, useContext, useRef } from 'react';
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
  const [centerIndex, setCenterIndex] = useState(-1);
  const accomplishmentRefs = useRef([]);
  const lyricsContainerRef = useRef(null);

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

  useEffect(() => {
    if (!song || !song.accomplishments || song.accomplishments.length === 0) return;

    const handleScroll = () => {
      const container = lyricsContainerRef.current;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const viewportCenter = containerRect.top + containerRect.height / 2;
      
      let closestIndex = -1;
      let closestDistance = Infinity;
      
      accomplishmentRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - elementCenter);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      if (closestIndex !== -1 && closestIndex !== centerIndex) {
        setCenterIndex(closestIndex);
      }
    };

    // Check initial position after a short delay to ensure refs are set
    setTimeout(handleScroll, 100);
    
    const container = lyricsContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [song, centerIndex]);

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
        <div ref={lyricsContainerRef} className="lyrics-container">
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
                {song.accomplishments.map((accomplishment, index) => {
                  const isCenter = index === centerIndex;
                  return (
                    <p 
                      key={index} 
                      ref={el => accomplishmentRefs.current[index] = el}
                      className={`accomplishment-text ${isCenter ? 'center-highlight' : ''}`}
                    >
                      {accomplishment}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div className="no-accomplishments">
                <p>No accomplishments listed yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="song-info-sidebar">
        <div className="song-info-content">
          <div className="song-info-image">
            {song.imagePng ? (
              <img src={getAssetUrl(song.imagePng)} alt={song.title} className="song-info-image-img" />
            ) : (
              <div className="song-info-image-placeholder">
                {song.title ? song.title.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
          <h1 className="song-info-title">{song.title}</h1>
          <p className="song-info-description">{song.description}</p>
        </div>
      </div>
    </div>
  );
}

export default Accomplishments;
