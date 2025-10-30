# ✅ ScreenPlex Setup Checklist

## Pre-Setup Requirements

- [ ] Node.js v16+ installed
- [ ] npm or yarn installed
- [ ] Git installed (optional)
- [ ] Code editor (VS Code recommended)

## 1️⃣ Google Cloud Console Setup

- [ ] Visit [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create new project "ScreenPlex"
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 Client ID
- [ ] Add authorized origins: `http://localhost:3000`
- [ ] Add redirect URIs: `http://localhost:3000`
- [ ] Copy Client ID: ___________________________
- [ ] Copy Client Secret: ___________________________

## 2️⃣ MongoDB Atlas Setup

- [ ] Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create free cluster
- [ ] Load sample dataset: `sample_mflix`
- [ ] Whitelist your IP address (or allow from anywhere: 0.0.0.0/0)
- [ ] Create database user
- [ ] Get connection string: ___________________________
- [ ] Replace `<password>` with your password

## 3️⃣ Backend Setup

- [ ] Navigate to server directory: `cd server`
- [ ] Install dependencies: `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in `MONGODB_URI`
- [ ] Fill in `JWT_SECRET` (any random string)
- [ ] Fill in `GOOGLE_CLIENT_ID`
- [ ] Fill in `GOOGLE_CLIENT_SECRET`
- [ ] Save `.env` file
- [ ] Start server: `npm run dev`
- [ ] Verify: Server running on http://localhost:5000
- [ ] Test health endpoint: http://localhost:5000/api/health

## 4️⃣ Frontend Setup

- [ ] Navigate to root directory: `cd ..` (if in server folder)
- [ ] Dependencies already installed ✓
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in `REACT_APP_GOOGLE_CLIENT_ID`
- [ ] Fill in `REACT_APP_API_URL=http://localhost:5000/api`
- [ ] Save `.env` file
- [ ] Start frontend: `npm start`
- [ ] Browser opens automatically to http://localhost:3000

## 5️⃣ Testing

### Test Landing Page
- [ ] Visit http://localhost:3000
- [ ] See ScreenPlex landing page
- [ ] Click "Sign In" button

### Test Traditional Signup
- [ ] Go to Signup page
- [ ] Enter name, email, password
- [ ] Click "Sign Up"
- [ ] Redirected to /browse

### Test Traditional Login
- [ ] Go to Login page
- [ ] Enter email and password
- [ ] Click "Sign In"
- [ ] Redirected to /browse

### Test Google OAuth
- [ ] Go to Login or Signup page
- [ ] Click "Continue with Google" button
- [ ] Select Google account
- [ ] Redirected to /browse

### Test Browse Page
- [ ] See movie grid
- [ ] Hover over movie cards
- [ ] See user profile dropdown
- [ ] Click user menu
- [ ] See profile options

### Test Protected Routes
- [ ] Logout
- [ ] Try to access http://localhost:3000/browse
- [ ] Should redirect to /login

## 6️⃣ Backend API Testing

### Test with cURL or Postman

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```
- [ ] Returns success with token

#### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
- [ ] Returns success with token

#### Get Movies
```bash
curl http://localhost:5000/api/movies
```
- [ ] Returns array of movies

#### Search Movies
```bash
curl http://localhost:5000/api/movies/search?q=action
```
- [ ] Returns filtered movies

## 7️⃣ Common Issues Resolution

### MongoDB Connection Error
- [ ] Check IP whitelist in MongoDB Atlas
- [ ] Verify connection string format
- [ ] Check username and password
- [ ] Ensure database exists

### Google OAuth Not Working
- [ ] Verify Client ID in `.env`
- [ ] Check authorized origins in Google Console
- [ ] Clear browser cache
- [ ] Check browser console for errors

### CORS Errors
- [ ] Verify `FRONTEND_URL` in backend `.env`
- [ ] Check both servers are running
- [ ] Verify ports (3000 and 5000)

### Module Not Found Errors
- [ ] Run `npm install` in root directory
- [ ] Run `npm install` in server directory
- [ ] Delete `node_modules` and reinstall

### Port Already in Use
- [ ] Kill process on port 3000: `npx kill-port 3000`
- [ ] Kill process on port 5000: `npx kill-port 5000`
- [ ] Or change ports in `.env` files

## 8️⃣ Production Deployment (Optional)

### Frontend (Vercel/Netlify)
- [ ] Run `npm run build`
- [ ] Deploy `build` folder
- [ ] Set environment variables
- [ ] Update Google OAuth origins

### Backend (Heroku/Railway/Render)
- [ ] Push server folder to Git
- [ ] Create new app
- [ ] Set environment variables
- [ ] Deploy
- [ ] Update frontend API URL

## 9️⃣ Documentation Review

- [ ] Read `README.md` - Full documentation
- [ ] Read `SETUP.md` - Quick setup guide
- [ ] Read `PROJECT_SUMMARY.md` - Implementation details
- [ ] Read `FILE_STRUCTURE.md` - File organization

## 🎉 Success Criteria

✅ **Setup Complete When:**
- Both servers running without errors
- Can register new user
- Can login with email/password
- Can login with Google
- Can see movies on browse page
- Can search for movies
- Protected routes working
- User menu functioning

## 📞 Need Help?

Check these files:
- `README.md` - Comprehensive guide
- `SETUP.md` - Quick setup
- `PROJECT_SUMMARY.md` - Technical details

Check logs:
- Backend terminal for server errors
- Browser console (F12) for frontend errors
- Network tab for API requests

## 🚀 You're All Set!

Once all items are checked, your ScreenPlex application is ready to use!

Enjoy building your Netflix clone! 🎬🍿
