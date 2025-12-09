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
  const [useImage, setUseImage] = React.useState(true);
  
  React.useEffect(() => {
    // Check if image exists
    const img = new Image();
    img.onerror = () => setUseImage(false);
    img.onload = () => setUseImage(true);
    img.src = iconPath;
  }, [iconPath]);

  if (useImage) {
    return (
      <img 
        src={iconPath} 
        alt={alt || name}
        className={`icon ${className}`}
        onError={() => setUseImage(false)}
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

