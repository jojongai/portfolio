import React, { useState, useRef, useEffect } from 'react';
import Icon from '../Icon';
import { getAssetUrl } from '../../utils/imageUrl';
import './index.css';

function AudioPlayer({ audioSrc, title, artist, imagePng, onPrevious, onNext, hasPrevious, hasNext }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
  const [isLiked, setIsLiked] = useState(false);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeatMode === 2) {
        // Repeat one - loop the current track
        audio.currentTime = 0;
        audio.play().catch(err => {
          console.error('[AudioPlayer] Loop play error:', err);
        });
      } else if (repeatMode === 1) {
        // Repeat all - would need playlist context, for now just restart
        audio.currentTime = 0;
        audio.play().catch(err => {
          console.error('[AudioPlayer] Repeat play error:', err);
        });
      } else {
        // No repeat - just stop
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode]);

  useEffect(() => {
    console.log('[AudioPlayer] Audio source:', audioSrc);
    if (audioRef.current) {
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
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

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return { name: 'volume-mute', fallback: '🔇' };
    if (volume < 0.5) return { name: 'volume-low', fallback: '🔉' };
    return { name: 'volume-high', fallback: '🔊' };
  };

  const getRepeatIcon = () => {
    if (repeatMode === 0) return '🔁';
    if (repeatMode === 1) return '🔁'; // Repeat all
    return '🔂'; // Repeat one
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isEmpty = !audioSrc || !title;

  return (
    <div className={`audio-player-container ${isEmpty ? 'empty-state' : ''}`}>
      {!isEmpty && (
        <div className="audio-player-left">
          <div className="album-art">
            <div className="album-image">
              {imagePng ? (
                <img src={getAssetUrl(imagePng)} alt={title || 'Album'} className="album-image-img" />
              ) : (
                <Icon name="music" fallback="🎵" alt="Music" className="album-icon" />
              )}
            </div>
          </div>
          <div className="audio-info">
            <button 
              className="audio-title-link"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {title}
            </button>
            {artist && (
              <button 
                className="audio-artist-link"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {artist}
              </button>
            )}
          </div>
        </div>
      )}
      {isEmpty && <div className="audio-player-left"></div>}
      
      <div className="audio-player-center">
        <div className="player-controls">
          <button 
            className={`control-btn shuffle-btn ${isShuffled ? 'active' : ''}`}
            onClick={toggleShuffle}
            aria-label="Shuffle"
            title="Enable shuffle"
            disabled={isEmpty}
          >
            <Icon name="shuffle" fallback="🔀" alt="Shuffle" />
          </button>
          <button 
            className="control-btn prev-btn"
            onClick={onPrevious}
            aria-label="Previous"
            title="Previous"
            disabled={isEmpty}
          >
            <Icon name="previous" fallback="⏮" alt="Previous" />
          </button>
          <button 
            className="play-pause-btn"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
            disabled={isEmpty}
          >
            <Icon name={isPlaying ? "pause" : "play"} fallback={isPlaying ? '⏸' : '▶'} alt={isPlaying ? 'Pause' : 'Play'} />
          </button>
          <button 
            className="control-btn next-btn"
            onClick={onNext}
            aria-label="Next"
            title="Next"
            disabled={isEmpty}
          >
            <Icon name="next" fallback="⏭" alt="Next" />
          </button>
          <button 
            className={`control-btn repeat-btn ${repeatMode > 0 ? 'active' : ''}`}
            onClick={toggleRepeat}
            aria-label="Repeat"
            title={repeatMode === 0 ? 'Enable repeat' : repeatMode === 1 ? 'Repeat all' : 'Repeat one'}
            disabled={isEmpty}
          >
            <Icon 
              name={repeatMode === 2 ? "repeat-one" : "repeat"} 
              fallback={getRepeatIcon()} 
              alt="Repeat" 
            />
          </button>
        </div>
        <div 
          className="progress-section"
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => setIsHoveringProgress(false)}
        >
          <span className="time-display">{formatTime(currentTime)}</span>
          <div 
            className={`progress-bar-container ${isHoveringProgress ? 'hovered' : ''}`}
            style={{ '--progress': `${duration ? (currentTime / duration) * 100 : 0}%` }}
          >
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="progress-slider"
              disabled={isEmpty}
            />
          </div>
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="audio-player-right">
        <div className="volume-section">
          <button 
            className="volume-icon-btn"
            onClick={() => {
              const audio = audioRef.current;
              if (audio) {
                if (volume > 0) {
                  audio.volume = 0;
                  setVolume(0);
                } else {
                  audio.volume = 1;
                  setVolume(1);
                }
              }
            }}
            aria-label={volume > 0 ? 'Mute' : 'Unmute'}
            title={volume > 0 ? 'Mute' : 'Unmute'}
            disabled={isEmpty}
          >
            <Icon {...getVolumeIcon()} alt={volume > 0 ? 'Mute' : 'Unmute'} />
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="volume-slider"
            aria-label="Volume"
            disabled={isEmpty}
          />
        </div>
        <button className="control-btn fullscreen-btn" aria-label="Fullscreen" title="Fullscreen" disabled={isEmpty}>
          <Icon name="fullscreen" fallback="⛶" alt="Fullscreen" />
        </button>
      </div>

      {audioSrc && (
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
      )}
    </div>
  );
}

export default AudioPlayer;
