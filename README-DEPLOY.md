# DriveAtHome Signaling Server - Deployment Guide

## Deploy to Render.com

1. Create a new account on [Render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repository (or deploy from this folder)
4. Configure:
   - **Name**: driveathome-signaling
   - **Environment**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: `server`
5. Set environment variable (optional):
   - `PORT` (Render sets this automatically)
6. Deploy

After deployment, your server will be available at:
`https://driveathome-signaling.onrender.com`

## Verify Deployment

Test the server:
```
https://your-app-name.onrender.com/socket.io/
```

Should return Socket.IO client library.

## Update Clients

After deployment, update:
1. Electron Host app: `host-desktop/renderer.js` - set `SIGNALING_SERVER`
2. Web frontend: `Driveathome-main/session_full.html` - set signaling server URL

