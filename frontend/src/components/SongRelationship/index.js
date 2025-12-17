import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getAssetUrl } from '../../utils/imageUrl';
import { PlayerContext } from '../../App';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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
      setError('Failed to fetch song details. Make sure the backend server is running on port 8080.');
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

  return (
    <div className="song-relationship">
      <div className="top-bar top-bar-full-width">
        {isHomePage && <h1 className="welcome-text">Good afternoon</h1>}
        {!isHomePage && <div></div>}
        <div className="profile-picture">
          <img src="/png/profile.png" alt="Profile" className="profile-img" onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
      </div>
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
            <div className="song-relationship-description">
              {displayedText}
              {isTyping && <span className="typing-cursor">|</span>}
            </div>
          )}
        </div>
    </div>
  );
}

export default SongRelationship;

