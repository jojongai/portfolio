import React, { useState, useRef, useEffect } from 'react';
import './index.css';

function AudioPlayer({ audioSrc, title, artist }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    console.log('[AudioPlayer] Audio source:', audioSrc);
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioSrc]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      console.log('[AudioPlayer] Paused');
    } else {
      audio.play().catch(err => {
        console.error('[AudioPlayer] Play error:', err);
      });
      setIsPlaying(true);
      console.log('[AudioPlayer] Playing');
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = (e.target.value / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = e.target.value / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!audioSrc) {
    console.warn('[AudioPlayer] No audio source provided');
    return (
      <div className="audio-player-container">
        <p className="no-audio-message">No audio file available</p>
      </div>
    );
  }

  return (
    <div className="audio-player-container">
      <div className="audio-player-header">
        <div className="audio-info">
          <h4 className="audio-title">{title}</h4>
          {artist && <p className="audio-artist">{artist}</p>}
        </div>
      </div>
      
      <div className="audio-controls">
        <button 
          className="play-pause-btn"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <div className="progress-section">
          <span className="time-display">{formatTime(currentTime)}</span>
          <div className="progress-bar-container">
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="progress-slider"
            />
          </div>
          <span className="time-display">{formatTime(duration)}</span>
        </div>

        <div className="volume-section">
          <span className="volume-icon">🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onError={(e) => {
          console.error('[AudioPlayer] Audio load error:', e);
          console.error('[AudioPlayer] Failed to load:', audioSrc);
        }}
        onLoadedData={() => {
          console.log('[AudioPlayer] Audio loaded successfully');
        }}
      />
    </div>
  );
}

export default AudioPlayer;
