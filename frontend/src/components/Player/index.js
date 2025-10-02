import React, { useState, useEffect } from 'react';
import './index.css';

function Player({ selectedSong, onPlayPause, isPlaying }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);

  useEffect(() => {
    // Mock duration for demo purposes
    if (selectedSong) {
      setDuration(180); // 3 minutes
      setCurrentTime(0);
    }
  }, [selectedSong]);

  const handlePlayPause = () => {
    onPlayPause();
  };

  const handleProgressChange = (e) => {
    const clickPosition = e.target.value;
    setCurrentTime(clickPosition);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedSong) {
    return (
      <div className="player">
        <div className="player-left">
          <div className="album-art"></div>
          <div className="song-info">
            <span className="song-name">No song selected</span>
            <span className="artist-name">Choose a song to start playing</span>
          </div>
        </div>
        <div className="player-center">
          <div className="player-controls">
            <button className="control-btn shuffle-btn">🔀</button>
            <button className="control-btn prev-btn">⏮</button>
            <button className="control-btn play-btn">
              ▶
            </button>
            <button className="control-btn next-btn">⏭</button>
            <button className="control-btn repeat-btn">🔁</button>
          </div>
          <div className="progress-bar">
            <span className="current-time">0:00</span>
            <div className="progress-container">
              <input 
                type="range" 
                min="0" 
                max="180" 
                value="0"
                className="progress-slider"
                onChange={handleProgressChange}
              />
            </div>
            <span className="duration">3:00</span>
          </div>
        </div>
        <div className="player-right">
          <button className="control-btn">📄</button>
          <button className="control-btn">🎤</button>
          <button className="control-btn">📋</button>
          <button className="control-btn">📺</button>
          <div className="volume-control">
            <span className="volume-icon">🔊</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value="70"
              className="volume-slider"
              onChange={handleVolumeChange}
            />
          </div>
          <button className="control-btn">📱</button>
          <button className="control-btn">⛶</button>
        </div>
      </div>
    );
  }

  return (
    <div className="player">
      <div className="player-left">
        <div className="album-art">
          <div className="album-image">
            🎵
          </div>
          {selectedSong.description && (
            <button className="up-arrow-btn">↑</button>
          )}
        </div>
        <div className="song-info">
          <span className="song-name">{selectedSong.title}</span>
          <span className="artist-name">{selectedSong.artist}</span>
        </div>
        <button className="like-btn">💚</button>
      </div>
      
      <div className="player-center">
        <div className="player-controls">
          <button className="control-btn shuffle-btn">🔀</button>
          <button className="control-btn prev-btn">⏮</button>
          <button className="control-btn play-btn" onClick={handlePlayPause}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="control-btn next-btn">⏭</button>
          <button className="control-btn repeat-btn">🔁</button>
        </div>
        <div className="progress-bar">
          <span className="current-time">{formatTime(currentTime)}</span>
          <div className="progress-container">
            <input 
              type="range" 
              min="0" 
              max={duration} 
              value={currentTime}
              className="progress-slider"
              onChange={handleProgressChange}
            />
          </div>
          <span className="duration">{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="player-right">
        <button className="control-btn">📄</button>
        <button className="control-btn">🎤</button>
        <button className="control-btn">📋</button>
        <button className="control-btn">📺</button>
        <div className="volume-control">
          <span className="volume-icon">🔊</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume}
            className="volume-slider"
            onChange={handleVolumeChange}
          />
        </div>
        <button className="control-btn">📱</button>
        <button className="control-btn">⛶</button>
      </div>
    </div>
  );
}

export default Player;
