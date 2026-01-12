import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Icon from '../Icon';
import { getAssetUrl } from '../../utils/imageUrl';
import { PlayerContext } from '../../App';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://portfolio-p2emc6nq2-jojos-projects-ee16cea8.vercel.app/api';

function SongRelationship() {
  const { playlistId, songId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSong } = useContext(PlayerContext);
  const isHomePage = location.pathname === '/';
  const [playlist, setPlaylist] = useState(null);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetchPlaylistAndSong();
  }, [playlistId, songId]);

  // Typewriter effect for song relationship text
  useEffect(() => {
    if (!song || !song.songRelationship) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    setDisplayedText('');
    const fullText = song.songRelationship;
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30); // Adjust speed here (milliseconds per character)

    return () => {
      clearInterval(typingInterval);
    };
  }, [song]);

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
      setError('Failed to fetch song details. Make sure REACT_APP_API_URL is set correctly.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="song-relationship">
        <div className="loading">Loading song relationship...</div>
      </div>
    );
  }

  if (error || !song || !playlist) {
    return (
      <div className="song-relationship">
        <div className="error">{error || 'Song not found'}</div>
      </div>
    );
  }

  // Get background color/gradient from song data
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
    <div className="song-relationship" style={backgroundStyle}>
      <button 
        className="home-button"
        onClick={() => navigate('/')}
        aria-label="Home"
        title="Go to home page"
      >
        <Icon name="home" fallback="🏠" alt="Home" />
      </button>
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
          <div className="song-title">{song.title || 'Unknown Title'}</div>
          <div className="song-artist-name">{song.artist || 'Unknown Artist'}</div>
          {/* Temporarily hidden - song relationship description */}
          {/* {song.songRelationship && (
            <div className="song-relationship-description">
              {displayedText}
              {isTyping && <span className="typing-cursor">|</span>}
            </div>
          )} */}
        </div>
    </div>
  );
}

export default SongRelationship;

