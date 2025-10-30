# 🚀 Quick Setup Guide

## Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

## Step 2: Create Environment Files

### Frontend .env
Copy `.env.example` to `.env` in the root directory and fill in:
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend .env
Copy `server/.env.example` to `server/.env` and fill in:
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Step 3: Start the Application

### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend
```bash
npm start
```

## 🔑 Getting Google OAuth Credentials

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project "MFlix"
3. Go to "APIs & Services" → "Credentials"
4. Create "OAuth 2.0 Client ID"
5. Add authorized JavaScript origins: `http://localhost:3000`
6. Add authorized redirect URIs: `http://localhost:3000`
7. Copy Client ID and Client Secret

## 📊 MongoDB Setup

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Load sample dataset: `sample_mflix`
4. Get connection string from "Connect" → "Connect your application"
5. Replace `<password>` with your database password

## ✅ Verify Setup

- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api/health

## 🐛 Troubleshooting

**Problem**: MongoDB connection error
- Check your IP is whitelisted in MongoDB Atlas
- Verify connection string is correct

**Problem**: Google OAuth not working
- Ensure REACT_APP_GOOGLE_CLIENT_ID is set correctly
- Check authorized origins in Google Console

**Problem**: CORS errors
- Verify FRONTEND_URL in backend .env
- Check backend is running on port 5000
