import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Playlist from './components/Playlist';
import Accomplishments from './components/Accomplishments';
import SongRelationship from './components/SongRelationship';
import Profile from './components/Profile';
import AudioPlayer from './components/AudioPlayer';
import Icon from './components/Icon';
import { getAssetUrl } from './utils/imageUrl';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Player Context for global state
export const PlayerContext = createContext();

function HomePage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const { selectSong } = useContext(PlayerContext);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/playlists`);
      setPlaylists(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch playlists. Make sure the backend server is running on port 8080.');
      console.error('Error fetching playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist.id}`);
  };

  if (loading) {
    return (
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <div className="loading">Loading playlists...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <div className="top-bar">
          <h1 className="welcome-text">Good afternoon</h1>
          <div className="profile-picture" onClick={() => navigate('/profile')}>
            <img src="/png/profile.png" alt="Profile" className="profile-img" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        </div>

        <div className="content-area">
          <div className="intro-section">
            <div className="intro-background"></div>
            <h2 className="intro-headline">
              Hi, I'm Jojo — a 5th-year Management Engineering student at Waterloo with interests in software, data, machine learning, and AI.
            </h2>
            <p className="intro-subline">
              This site is a little about myself, my experiences, and from the theme of the site, my music taste.
            </p>
            <div className="social-links">
              <a href="https://github.com/jojongai" target="_blank" rel="noopener noreferrer" className="social-link">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/joseph-ngai-46a0a3175/" target="_blank" rel="noopener noreferrer" className="social-link">
                LinkedIn
              </a>
            </div>
          </div>
          
          <div className="playlists-grid">
            {playlists.map((playlist) => (
              <div 
                key={playlist.id} 
                className="playlist-card"
                onClick={() => handlePlaylistClick(playlist)}
              >
                <div className="playlist-image">
                  {playlist.imagePng ? (
                    <img src={getAssetUrl(playlist.imagePng)} alt={playlist.title} className="playlist-image-img" />
                  ) : (
                    playlist.imageUrl
                  )}
                </div>
                <div className="play-button-overlay">
                  <Icon name="play" fallback="▶" alt="Play" />
                </div>
                <h3 className="playlist-title">{playlist.title}</h3>
                <p className="playlist-description">{playlist.description}</p>
                <div className="playlist-tech">{playlist.songs.length} songs</div>
              </div>
            ))}
          </div>

          {playlists.length === 0 && (
            <div className="loading">No playlists found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlaylistWithContext() {
  const { selectSong } = useContext(PlayerContext);
  return <Playlist selectSong={selectSong} />;
}

function PlaylistOrHobbies() {
  const { selectSong } = useContext(PlayerContext);
  return <Playlist selectSong={selectSong} />;
}

function AccomplishmentsWithContext() {
  const { selectSong } = useContext(PlayerContext);
  return <Accomplishments selectSong={selectSong} />;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSong, setSelectedSong] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectSong = (song, playlist = null, songIndex = -1) => {
    setSelectedSong(song);
    setCurrentPlaylist(playlist);
    setCurrentSongIndex(songIndex);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (!currentPlaylist || currentSongIndex < 0) return;
    
    // Get all songs with mp3Path
    const songsWithAudio = currentPlaylist.songs
      .map((song, index) => ({ song, index }))
      .filter(({ song }) => song && song.mp3Path);
    
    if (songsWithAudio.length === 0) return;
    
    // Find current song index in the filtered list
    const currentFilteredIndex = songsWithAudio.findIndex(({ index }) => index === currentSongIndex);
    
    // Get previous song (loop to end if at beginning)
    const prevIndex = currentFilteredIndex > 0 
      ? currentFilteredIndex - 1 
      : songsWithAudio.length - 1;
    
    const { song: prevSong, index: prevSongIndex } = songsWithAudio[prevIndex];
    
    // Check if user is on accomplishments or song relationship page
    const isOnAccomplishments = location.pathname.includes(`/playlist/${currentPlaylist.id}/song/`) && 
                                !location.pathname.includes('/relationship');
    const isOnSongRelationship = location.pathname.includes(`/playlist/${currentPlaylist.id}/song/`) && 
                                  location.pathname.includes('/relationship');
    
    // Select the song first
    selectSong(prevSong, currentPlaylist, prevSongIndex);
    
    // Navigate to the appropriate page if on a detail page
    if (isOnAccomplishments) {
      navigate(`/playlist/${currentPlaylist.id}/song/${prevSong.id}`);
    } else if (isOnSongRelationship) {
      navigate(`/playlist/${currentPlaylist.id}/song/${prevSong.id}/relationship`);
    }
  };

  const handleNext = () => {
    if (!currentPlaylist || currentSongIndex < 0) return;
    
    // Get all songs with mp3Path
    const songsWithAudio = currentPlaylist.songs
      .map((song, index) => ({ song, index }))
      .filter(({ song }) => song && song.mp3Path);
    
    if (songsWithAudio.length === 0) return;
    
    // Find current song index in the filtered list
    const currentFilteredIndex = songsWithAudio.findIndex(({ index }) => index === currentSongIndex);
    
    // Get next song (loop to beginning if at end)
    const nextIndex = currentFilteredIndex < songsWithAudio.length - 1 
      ? currentFilteredIndex + 1 
      : 0;
    
    const { song: nextSong, index: nextSongIndex } = songsWithAudio[nextIndex];
    
    // Check if user is on accomplishments or song relationship page
    const isOnAccomplishments = location.pathname.includes(`/playlist/${currentPlaylist.id}/song/`) && 
                                !location.pathname.includes('/relationship');
    const isOnSongRelationship = location.pathname.includes(`/playlist/${currentPlaylist.id}/song/`) && 
                                  location.pathname.includes('/relationship');
    
    // Select the song first
    selectSong(nextSong, currentPlaylist, nextSongIndex);
    
    // Navigate to the appropriate page if on a detail page
    if (isOnAccomplishments) {
      navigate(`/playlist/${currentPlaylist.id}/song/${nextSong.id}`);
    } else if (isOnSongRelationship) {
      navigate(`/playlist/${currentPlaylist.id}/song/${nextSong.id}/relationship`);
    }
  };

  const playerContextValue = {
    selectedSong,
    isPlaying,
    selectSong,
    handlePlayPause,
    currentPlaylist,
    setCurrentPlaylist
  };

  return (
    <PlayerContext.Provider value={playerContextValue}>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/playlist/:playlistId" element={<PlaylistOrHobbies />} />
            <Route path="/playlist/:playlistId/song/:songId" element={<AccomplishmentsWithContext />} />
            <Route path="/playlist/:playlistId/song/:songId/relationship" element={<SongRelationship />} />
          </Routes>
        <AudioPlayer 
          audioSrc={selectedSong && selectedSong.mp3Path ? getAssetUrl(selectedSong.mp3Path) : null}
          title={selectedSong ? (
            currentPlaylist?.id === 'work-experience-playlist-id' 
              ? (selectedSong.role || selectedSong.title)
              : (selectedSong.name || selectedSong.title)
          ) : null}
          artist={selectedSong ? (
            currentPlaylist?.id === 'work-experience-playlist-id'
              ? (selectedSong.duration || selectedSong.artist)
              : (selectedSong.category || selectedSong.artist)
          ) : null}
          imagePng={selectedSong ? selectedSong.imagePng : null}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={true}
          hasNext={true}
          isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
        </div>
    </PlayerContext.Provider>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
