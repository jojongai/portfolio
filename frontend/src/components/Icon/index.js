import React from 'react';

/**
 * Icon component that uses icon files from /icons folder
 * Falls back to emoji if icon file doesn't exist
 * 
 * @param {string} name - Icon name (without extension, e.g., 'home', 'play')
 * @param {string} fallback - Emoji fallback (e.g., '🏠', '▶')
 * @param {string} className - Additional CSS classes
 * @param {string} alt - Alt text for accessibility
 */
function Icon({ name, fallback, className = '', alt = '', ...props }) {
  const iconPath = `/icons/${name}.svg`;
  
  // Try to load the icon, fallback to emoji if it fails
  const [svgContent, setSvgContent] = React.useState(null);
  const [useImage, setUseImage] = React.useState(true);
  
  React.useEffect(() => {
    // Try to fetch SVG as text to inline it (so currentColor works)
    fetch(iconPath)
      .then(response => {
        if (!response.ok) throw new Error('Not found');
        return response.text();
      })
      .then(text => {
        setSvgContent(text);
        setUseImage(true);
      })
      .catch(() => {
        setSvgContent(null);
        setUseImage(false);
      });
  }, [iconPath]);

  if (useImage && svgContent) {
    // Inline SVG so currentColor works
    return (
      <span 
        className={`icon icon-svg ${className}`}
        aria-label={alt || name}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        {...props}
      />
    );
  }

  if (useImage) {
    // Fallback to img tag if fetch fails
    return (
      <img 
        src={iconPath} 
        alt={alt || name}
        className={`icon ${className}`}
        onError={() => setUseImage(false)}
        style={{ filter: 'brightness(0) saturate(100%) invert(73%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(95%)' }}
        {...props}
      />
    );
  }

  // Fallback to emoji
  return (
    <span className={`icon-emoji ${className}`} aria-label={alt || name} {...props}>
      {fallback}
    </span>
  );
}

export default Icon;

