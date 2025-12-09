# Vercel Build Configuration

## Quick Fix for Build Issues

If you're getting build errors, configure Vercel in one of two ways:

### Option 1: Use Root Directory (Current Setup)

The `vercel.json` in the root is configured to build from the `frontend` directory. Make sure in Vercel dashboard:

1. Go to Project Settings → General
2. **Root Directory**: Leave as `.` (root)
3. The `vercel.json` will handle the build automatically

### Option 2: Use Frontend as Root Directory (Alternative)

1. Go to Project Settings → General
2. **Root Directory**: Set to `frontend`
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `build` (auto-detected)
5. **Install Command**: `npm install` (auto-detected)

If using Option 2, you can delete the root `vercel.json` file.

## Current Configuration

The root `vercel.json` is configured with:
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/build`
- **Install Command**: `cd frontend && npm install`

This tells Vercel to:
1. Change to the frontend directory
2. Install dependencies
3. Build the React app
4. Output to `frontend/build`

## Troubleshooting

### Build Fails with "Cannot find module"

- Make sure dependencies are installed in the frontend directory
- Check that `frontend/package.json` exists
- Verify the build command is correct

### Build Succeeds but App Doesn't Load

- Check that `outputDirectory` is set to `frontend/build`
- Verify React Router rewrites are configured in `vercel.json`
- Check browser console for errors

### Environment Variables Not Working

- Make sure `REACT_APP_` prefix is used
- Variables must be set in Vercel dashboard (Settings → Environment Variables)
- Redeploy after adding/changing environment variables

