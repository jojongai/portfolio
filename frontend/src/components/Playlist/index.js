import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import Icon from '../Icon';
import { getAssetUrl } from '../../utils/imageUrl';
import { PlayerContext } from '../../App';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://portfolio-five-gamma-wpepful1p8.vercel.app';

function Playlist({ selectSong }) {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSong, currentPlaylist, isPlaying, handlePlayPause } = useContext(PlayerContext);
  const isHomePage = location.pathname === '/';
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(1); // 1: first item, 2: microphone icon, 3: queue icon
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const firstSongRef = useRef(null);

  // Check if this is the hobbies playlist (only for UI labels)
  const isHobbiesPlaylist = playlistId === 'hobbies-and-interests-playlist-id';
  const isPersonalProjectsPlaylist = playlistId === 'personal-projects-playlist-id';
  const isWorkExperiencePlaylist = playlistId === 'work-experience-playlist-id';

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  // Update tooltip position based on current step
  const updateTooltipPosition = () => {
    if (tutorialStep === 1 && firstSongRef.current) {
      const rect = firstSongRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    } else if (tutorialStep === 2) {
      // Find microphone button
      const microphoneBtn = document.querySelector('.microphone-btn');
      if (microphoneBtn) {
        const rect = microphoneBtn.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top - 115, // Position higher above the button
          left: rect.left + rect.width / 2
        });
      }
    } else if (tutorialStep === 3) {
      // Find queue button
      const queueBtn = document.querySelector('.queue-btn');
      if (queueBtn) {
        const rect = queueBtn.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top - 95, // Position higher above the button
          left: rect.left + rect.width / 2
        });
      }
    }
  };

  // Check if tutorial should be shown (first time visiting any playlist)
  useEffect(() => {
    const tutorialShown = localStorage.getItem('playlist-tutorial-shown');
    if (!tutorialShown && playlist && playlist.songs.length > 0) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        setShowTutorial(true);
        setTimeout(() => updateTooltipPosition(), 100);
      }, 500);
    }
  }, [playlist]);

  // Helper function to reset tutorial (for development/testing)
  // You can call this from browser console: window.resetTutorial()
  useEffect(() => {
    window.resetTutorial = () => {
      localStorage.removeItem('playlist-tutorial-shown');
      setShowTutorial(true);
      setTutorialStep(1);
      setTimeout(() => updateTooltipPosition(), 100);
    };
    return () => {
      delete window.resetTutorial;
    };
  }, []);

  // Update tooltip position when tutorial is shown or window is resized/scrolled
  useEffect(() => {
    if (showTutorial) {
      updateTooltipPosition();
      const handleScroll = () => updateTooltipPosition();
      const handleResize = () => updateTooltipPosition();
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [showTutorial, tutorialStep]);

  // Highlight microphone button when on step 2
  useEffect(() => {
    if (showTutorial && tutorialStep === 2) {
      const microphoneBtn = document.querySelector('.microphone-btn');
      if (microphoneBtn) {
        microphoneBtn.classList.add('tutorial-highlight');
        updateTooltipPosition();
        return () => {
          microphoneBtn.classList.remove('tutorial-highlight');
        };
      }
    }
  }, [showTutorial, tutorialStep]);

  // Highlight queue button when on step 3
  useEffect(() => {
    if (showTutorial && tutorialStep === 3) {
      const queueBtn = document.querySelector('.queue-btn');
      if (queueBtn) {
        queueBtn.classList.add('tutorial-highlight');
        updateTooltipPosition();
        return () => {
          queueBtn.classList.remove('tutorial-highlight');
        };
      }
    }
  }, [showTutorial, tutorialStep]);

  const handleTutorialNext = () => {
    if (tutorialStep === 1) {
      setTutorialStep(2);
      // Remove highlight from first item
      if (firstSongRef.current) {
        firstSongRef.current.classList.remove('tutorial-highlight');
      }
    } else if (tutorialStep === 2) {
      setTutorialStep(3);
      // Remove highlight from microphone button
      const microphoneBtn = document.querySelector('.microphone-btn');
      if (microphoneBtn) {
        microphoneBtn.classList.remove('tutorial-highlight');
      }
    }
  };

  const handleTutorialDismiss = () => {
    setShowTutorial(false);
    localStorage.setItem('playlist-tutorial-shown', 'true');
    // Clean up highlights
    if (firstSongRef.current) {
      firstSongRef.current.classList.remove('tutorial-highlight');
    }
    const microphoneBtn = document.querySelector('.microphone-btn');
    if (microphoneBtn) {
      microphoneBtn.classList.remove('tutorial-highlight');
    }
    const queueBtn = document.querySelector('.queue-btn');
    if (queueBtn) {
      queueBtn.classList.remove('tutorial-highlight');
    }
  };

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const id = playlistId || 'hobbies-and-interests-playlist-id';
      const response = await axios.get(`${API_BASE_URL}/api/playlists/${id}`);
      setPlaylist(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch playlist. Make sure REACT_APP_API_URL is set correctly.');
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

  // Check if any song from this playlist is currently selected
  const isPlaylistSongSelected = () => {
    return selectedSong && currentPlaylist && currentPlaylist.id === playlistId;
  };

  // Handle play button click
  const handlePlayButtonClick = () => {
    if (!playlist || !selectSong) return;

    // Check if a song from this playlist is currently selected
    if (isPlaylistSongSelected()) {
      // If playing, pause it
      if (isPlaying) {
        handlePlayPause();
      } else {
        // If paused, unpause it
        handlePlayPause();
      }
    } else {
      // Find the first song with mp3Path, or just the first song if none have mp3Path
      const firstSongWithAudio = playlist.songs.find(song => song.mp3Path);
      const firstSong = firstSongWithAudio || playlist.songs[0];
      
      if (firstSong) {
        const songIndex = playlist.songs.findIndex(s => s.id === firstSong.id);
        selectSong(firstSong, playlist, songIndex);
      }
    }
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
    <div className={`app ${showTutorial ? 'tutorial-active' : ''}`}>
      <Sidebar />
      <div className="main-content">
        <div className="top-bar">
          {isHomePage && <h1 className="welcome-text">Good afternoon</h1>}
          {!isHomePage && <div></div>}
          <div className="profile-picture" onClick={() => navigate('/profile')}>
            <img src="/png/profile.png" alt="Profile" className="profile-img" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        </div>
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
          <button className="play-button-large" onClick={handlePlayButtonClick}>
            <Icon name={isPlaylistSongSelected() && isPlaying ? "pause" : "play"} fallback={isPlaylistSongSelected() && isPlaying ? "⏸" : "▶"} alt={isPlaylistSongSelected() && isPlaying ? "Pause" : "Play"} />
          </button>
        </div>
      </div>

      <div className="songs-list">
        <div className={`songs-header ${isHobbiesPlaylist ? 'hobbies-layout' : ''}`}>
          <div className="song-number">#</div>
          <div className="song-image-header"></div>
          <div className="song-title">Title</div>
          {isHobbiesPlaylist ? (
            <div className="song-artist">Category</div>
          ) : (
            <>
              <div className="song-duration">{isPersonalProjectsPlaylist ? 'Duration' : 'Location'}</div>
              <div className="song-artist">Details</div>
            </>
          )}
        </div>
        
        {playlist.songs.map((song, index) => {
          const isPlaying = isSongPlaying(song);
          const isSelected = selectedSongId === song.id;
          const isFirstItem = index === 0;
          return (
            <div 
              key={song.id || index} 
              ref={isFirstItem ? firstSongRef : null}
              className={`song-row ${isHobbiesPlaylist ? 'hobbies-layout' : ''} ${isSelected ? 'selected' : ''} ${isPlaying ? 'playing' : ''} ${isFirstItem && showTutorial && tutorialStep === 1 ? 'tutorial-highlight' : ''}`}
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
                <div className={`song-title-text ${isPlaying ? 'playing' : ''}`}>
                  {isWorkExperiencePlaylist ? (song.role || song.title) : (song.name || song.title)}
                </div>
                <div className="song-description">{song.description}</div>
              </div>
              {isHobbiesPlaylist ? (
                <div className="song-artist-text">{song.category || ''}</div>
              ) : (
                <>
              <div className="song-duration-text">{formatLocation(song)}</div>
              <div className="song-artist-text">
                {isWorkExperiencePlaylist 
                  ? (song.duration || '') 
                  : isPersonalProjectsPlaylist 
                    ? (song.category || '') 
                    : (song.category || song.artist || '')}
              </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      </div>
      </div>
      {showTutorial && (
        <>
          <div className="tutorial-overlay" onClick={(e) => e.stopPropagation()} />
          <div 
            className="tutorial-tooltip"
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: (tutorialStep === 2 || tutorialStep === 3) ? 'translateX(-50%)' : 'none'
            }}
          >
            <div className="tutorial-tooltip-content">
              <p>
                {tutorialStep === 1 
                  ? 'Double clicking a row will select it and play a song'
                  : tutorialStep === 2
                  ? 'Click here to see more information for the selected entry'
                  : 'Click here to view the song'}
              </p>
              <div className="tutorial-tooltip-actions">
                {(tutorialStep === 1 || tutorialStep === 2) && (
                  <button className="tutorial-tooltip-next" onClick={handleTutorialNext} aria-label="Next">
                    →
                  </button>
                )}
                {tutorialStep === 3 && (
                  <button className="tutorial-tooltip-close" onClick={handleTutorialDismiss} aria-label="Close">
                    ×
                  </button>
                )}
              </div>
            </div>
            <div className={`tutorial-tooltip-arrow ${(tutorialStep === 2 || tutorialStep === 3) ? 'arrow-bottom' : ''}`}></div>
          </div>
        </>
      )}
    </div>
  );
}

export default Playlist;
