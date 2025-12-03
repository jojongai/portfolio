# Audio Files

Place your MP3 files in this folder for each work experience/song.

## File Structure

```
public/
  audio/
    techcorp-experience.mp3
    startupxyz-experience.mp3
    bigtech-intern-experience.mp3
    ... (your other MP3 files)
```

## How to Add Audio Files

1. **Convert your audio to MP3 format** (if needed)
   - Use tools like Audacity, VLC, or online converters
   - Recommended: 128-192 kbps bitrate for good quality/size balance

2. **Name your files** according to your backend data:
   - Check `backend/server.js` for the `mp3Path` values
   - Example: If `mp3Path: "/audio/techcorp-experience.mp3"`, name your file `techcorp-experience.mp3`

3. **Place files in this folder** (`frontend/public/audio/`)

4. **Update backend data** if you use different filenames:
   - Edit `backend/server.js`
   - Update the `mp3Path` field for each song

## File Paths

In your backend data, use paths starting with `/audio/`:
```javascript
{
  title: "Software Engineer at TechCorp",
  mp3Path: "/audio/techcorp-experience.mp3",
  // ...
}
```

The `/audio/` path maps to the `public/audio/` folder in your React app.

## Supported Formats

- **MP3** (recommended) - Best browser support
- **WAV** - Also supported but larger file sizes
- **OGG** - Supported in most modern browsers

## Tips

- Keep file sizes reasonable (under 5MB per file recommended)
- Use consistent naming conventions
- Test playback in different browsers
