import React, { useEffect } from 'react';
import './index.css';

function SpotifyEmbed({ trackId, title }) {
  useEffect(() => {
    console.log('[SpotifyEmbed] Component rendered with trackId:', trackId);
    console.log('[SpotifyEmbed] Title:', title);
    if (!trackId) {
      console.warn('[SpotifyEmbed] No trackId provided!');
    } else {
      const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
      console.log('[SpotifyEmbed] Embed URL:', embedUrl);
    }
  }, [trackId, title]);

  if (!trackId) {
    console.warn('[SpotifyEmbed] Returning null - no trackId');
    return null;
  }

  const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
  console.log('[SpotifyEmbed] Rendering iframe with URL:', embedUrl);

  return (
    <div className="spotify-embed-container">
      <div className="spotify-embed-wrapper">
        <iframe
          src={embedUrl}
          width="100%"
          height="152"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media"
          title={title || 'Spotify Track'}
          className="spotify-iframe"
          onLoad={() => console.log('[SpotifyEmbed] Iframe loaded successfully')}
          onError={(e) => console.error('[SpotifyEmbed] Iframe error:', e)}
        ></iframe>
      </div>
    </div>
  );
}

export default SpotifyEmbed;
