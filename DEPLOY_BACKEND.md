# Backend Deployment Guide - Render.com

## Steps to Deploy Backend on Render.com (FREE)

### 1. Prepare Your Backend for Deployment

#### **IMPORTANT: Configure MongoDB Atlas Network Access**

Before deploying, you must whitelist Render.com's IP addresses in MongoDB Atlas:

1. Go to https://cloud.mongodb.com
2. Select your cluster → Click **"Network Access"** in the left sidebar
3. Click **"+ ADD IP ADDRESS"**
4. Choose one option:
   - **Option A (Easiest)**: Click **"ALLOW ACCESS FROM ANYWHERE"** → Add `0.0.0.0/0`
   - **Option B (More Secure)**: Add your deployment platform's IP ranges
5. Click **"Confirm"** and wait 1-2 minutes for changes to apply

⚠️ **Without this step, your backend will fail to connect to MongoDB!**

---

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

---

## Troubleshooting

### MongoDB Connection Error: "IP that isn't whitelisted"

**Error**: `Could not connect to any servers in your MongoDB Atlas cluster`

**Solution**:
1. Go to MongoDB Atlas → Network Access
2. Add `0.0.0.0/0` to allow access from anywhere
3. Wait 1-2 minutes for changes to propagate
4. Restart your Render service (Settings → Manual Deploy → Deploy latest commit)

### CORS Errors After Deployment

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Make sure your backend's `FRONTEND_URL` env var is set to your Netlify URL
2. Verify `server/server.js` includes your Netlify URL in `allowedOrigins`
3. Redeploy backend after changes

### Environment Variables Not Working

**Solution**:
1. Check that all env vars are set in Render dashboard
2. Don't include quotes around values in Render
3. After changing env vars, redeploy the service

### Backend URL Not Working

**Error**: `ERR_CONNECTION_REFUSED` or `404 Not Found`

**Solution**:
1. Check Render dashboard - service should show "Live" status
2. Test backend directly: `https://your-app.onrender.com/api/health`
3. Make sure you're using HTTPS (not HTTP) in your Netlify env vars

---

## Current Status

After following this guide:
- ✅ Backend CORS configured for Netlify
- ✅ Deployment guide created
- ❌ **Backend needs to be deployed** (follow steps above)
- ❌ **MongoDB Atlas needs IP whitelist updated** (critical!)
- ❌ **Netlify env vars need backend URL** (after deployment)

