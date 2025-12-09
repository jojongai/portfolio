import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import PlaylistDetail from './components/PlaylistDetail';
import SongDetail from './components/SongDetail';
import AudioPlayer from './components/AudioPlayer';
import './index.css';

const API_BASE_URL = 'http://localhost:8080/api';

// Player Context for global state
const PlayerContext = createContext();

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
          <button className="play-button">PLAY</button>
        </div>

        <div className="content-area">
          <h2 className="section-title">Made for Jojo Ngai</h2>
          
          <div className="playlists-grid">
            {playlists.map((playlist) => (
              <div 
                key={playlist.id} 
                className="playlist-card"
                onClick={() => handlePlaylistClick(playlist)}
              >
                <div className="playlist-image">
                  {playlist.imageUrl}
                </div>
                <div className="play-button-overlay">
                  ▶
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

function PlaylistDetailWithContext() {
  const { selectSong } = useContext(PlayerContext);
  return <PlaylistDetail selectSong={selectSong} />;
}

function SongDetailWithContext() {
  const { selectSong } = useContext(PlayerContext);
  return <SongDetail selectSong={selectSong} />;
}

function App() {
  const navigate = useNavigate();
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
    navigate(`/playlist/${currentPlaylist.id}/song/${prevSong.id}`);
    selectSong(prevSong, currentPlaylist, prevSongIndex);
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
    navigate(`/playlist/${currentPlaylist.id}/song/${nextSong.id}`);
    selectSong(nextSong, currentPlaylist, nextSongIndex);
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
          <Route path="/playlist/:playlistId" element={<PlaylistDetailWithContext />} />
          <Route path="/playlist/:playlistId/song/:songId" element={<SongDetailWithContext />} />
        </Routes>
        {selectedSong && selectedSong.mp3Path && (
          <AudioPlayer 
            audioSrc={selectedSong.mp3Path}
            title={selectedSong.title}
            artist={selectedSong.artist}
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={true}
            hasNext={true}
          />
        )}
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
