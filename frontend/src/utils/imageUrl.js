/**
 * Get the URL for an image or audio file from the frontend public folder
 * Paths starting with / are served from the public folder in React
 */
export function getAssetUrl(path) {
  if (!path) return null;
  
  // Paths starting with / are served from public folder in React
  // No need to modify - React serves /png/file.png from public/png/file.png
  return path;
}

