# Backend Deployment Guide - Render.com

## Steps to Deploy Backend on Render.com (FREE)

### 1. Prepare Your Backend for Deployment

#### Add start script to `server/package.json`
Make sure your `server/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

#### Create `render.yaml` in project root (optional but recommended)
```yaml
services:
  - type: web
    name: screenplex-api
    runtime: node
    plan: free
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: FRONTEND_URL
        value: https://screenplex.netlify.app
```

### 2. Deploy on Render.com

1. **Sign up**: Go to https://render.com and sign up (use GitHub)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `SharathcAcharya/mflix`
   - Give it a name: `screenplex-api`

3. **Configure Settings**:
   ```
   Name: screenplex-api
   Region: Choose closest to your users
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

4. **Add Environment Variables**:
   Click "Environment" and add:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret-key>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://screenplex.netlify.app
   ```
   
   ⚠️ **Important**: Copy these values from your local `server/.env` file. Never commit actual secrets to GitHub!

5. **Deploy**: Click "Create Web Service"

6. **Get Your Backend URL**: After deployment, you'll get a URL like:
   ```
   https://screenplex-api.onrender.com
   ```

### 3. Update Netlify Environment Variables

Go to Netlify → Site Settings → Environment Variables and update:

```
REACT_APP_API_URL=https://screenplex-api.onrender.com/api
```

### 4. Redeploy Frontend on Netlify

After updating the environment variable, trigger a new deployment on Netlify.

---

## Alternative: Railway.app

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `SharathcAcharya/mflix`
5. Add a "Service" → Root directory: `server`
6. Add all environment variables
7. Railway will give you a URL like: `https://screenplex-api.up.railway.app`

---

## Alternative: Quick Test with ngrok (Temporary)

For **temporary testing only** (not for production):

1. Install ngrok: https://ngrok.com/download
2. Run your backend locally: `cd server && npm start`
3. In another terminal: `ngrok http 5000`
4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
5. Update Netlify env var: `REACT_APP_API_URL=https://abc123.ngrok.io/api`

**Note**: ngrok URLs change on every restart, so this is only for testing!

---

## Important: Update CORS After Backend Deployment

Once you have your backend URL, update `server/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://screenplex.netlify.app',
  'https://your-backend-url.onrender.com',  // Add your backend URL
  process.env.FRONTEND_URL
].filter(Boolean);
```

---

## Summary

**Current Problem**: Your frontend (Netlify) can't reach your backend (localhost)

**Solution**: Deploy backend to Render.com/Railway, then update `REACT_APP_API_URL` in Netlify

**Result**: Both frontend and backend will be accessible from the internet! 🚀
