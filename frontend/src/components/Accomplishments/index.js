import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import AudioPlayer from '../AudioPlayer';
import { getAssetUrl } from '../../utils/imageUrl';
import { PlayerContext } from '../../App';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://portfolio-five-gamma-wpepful1p8.vercel.app';

function Accomplishments({ selectSong }) {
  const { playlistId, songId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSong } = useContext(PlayerContext);
  const isHomePage = location.pathname === '/';
  const isWorkExperiencePlaylist = playlistId === 'work-experience-playlist-id';
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
      const response = await axios.get(`${API_BASE_URL}/api/playlists/${playlistId}`);
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
      setError('Failed to fetch song details. Make sure REACT_APP_API_URL is set correctly.');
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

  // Get background color/gradient from song data (supports both camelCase and kebab-case)
  const backgroundAccomplishment = song?.backgroundAccomplishment || song?.['background-accomplishment'] || null;
  
  // Parse gradient colors if provided (array format: ["color1", "color2"])
  let backgroundStyle = {};
  if (Array.isArray(backgroundAccomplishment) && backgroundAccomplishment.length > 0) {
    if (backgroundAccomplishment.length === 2) {
      // Two colors = gradient
      backgroundStyle.background = `linear-gradient(to bottom, ${backgroundAccomplishment[0]}, ${backgroundAccomplishment[1]})`;
    } else if (backgroundAccomplishment.length === 1) {
      // Single color = solid background
      backgroundStyle.backgroundColor = backgroundAccomplishment[0];
    }
  } else if (backgroundAccomplishment && typeof backgroundAccomplishment === 'string') {
    // Backward compatibility: handle string format (legacy)
    if (backgroundAccomplishment.includes(',')) {
      const colors = backgroundAccomplishment.split(',').map(c => c.trim());
      if (colors.length === 2) {
        backgroundStyle.background = `linear-gradient(to bottom, ${colors[0]}, ${colors[1]})`;
      }
    } else {
      backgroundStyle.backgroundColor = backgroundAccomplishment;
    }
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content accomplishments-page">
        <div 
          className="song-detail"
          style={backgroundStyle}
        >
        <div ref={lyricsContainerRef} className="lyrics-container">
          <div className="lyrics-content">
            {song.accomplishments && song.accomplishments.length > 0 ? (
              <div className="accomplishments-list">
                {song.technologies && (
                  <p 
                    ref={el => accomplishmentRefs.current[0] = el}
                    className={`accomplishment-text accomplishment-label ${0 === centerIndex ? 'center-highlight' : ''}`}
                  >
                    Technologies: {song.technologies}
                  </p>
                )}
                {song.languages && (
                  <p 
                    ref={el => accomplishmentRefs.current[song.technologies ? 1 : 0] = el}
                    className={`accomplishment-text accomplishment-label ${(song.technologies ? 1 : 0) === centerIndex ? 'center-highlight' : ''}`}
                  >
                    Languages: {song.languages}
                  </p>
                )}
                {song.accomplishments.map((accomplishment, index) => {
                  // Calculate header offset: technologies (0 or 1) + languages (0 or 1)
                  const headerOffset = (song.technologies ? 1 : 0) + (song.languages ? 1 : 0);
                  const actualIndex = index + headerOffset;
                  const isCenter = actualIndex === centerIndex;
                  return (
                    <p 
                      key={index} 
                      ref={el => accomplishmentRefs.current[actualIndex] = el}
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
              <img 
                src={getAssetUrl(song.imagePng)} 
                alt={isWorkExperiencePlaylist ? (song.role || song.title) : (song.name || song.title)} 
                className="song-info-image-img" 
              />
            ) : (
              <div className="song-info-image-placeholder">
                {isWorkExperiencePlaylist 
                  ? (song.role || song.title || '?').charAt(0).toUpperCase()
                  : (song.name || song.title || '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="song-info-title">
            {isWorkExperiencePlaylist ? (song.role || song.title) : (song.name || song.title)}
          </h1>
          <p className="song-info-description">{song.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accomplishments;
