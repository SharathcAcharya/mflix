# 🧪 Testing Guide for Advanced Features

## Quick Test Checklist

### ✅ Prerequisites
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000
- [ ] User logged in

---

## 🎬 1. Test Movie Detail Page

### Steps:
1. Go to http://localhost:3000/browse
2. Click any movie card
3. Should redirect to `/movie/:id`

### Verify:
- [ ] Movie poster/backdrop displays
- [ ] Title, year, rating, runtime shown
- [ ] Plot description visible
- [ ] Cast and directors listed
- [ ] "Add to Watchlist" button works
- [ ] Play button opens video modal
- [ ] Video player loads and can be closed
- [ ] Similar movies section appears
- [ ] Reviews section displays

---

## 💬 2. Test Review System

### Submit Review:
1. On movie detail page, scroll to reviews section
2. Type a review in the text area
3. Select a rating (0-10) using the slider
4. Click "Submit Review"

### Verify:
- [ ] Review appears immediately
- [ ] Your avatar and name shown
- [ ] Rating displayed correctly
- [ ] Timestamp shows
- [ ] Average rating updates
- [ ] Cannot submit duplicate review (try submitting again)

### Like a Review:
1. Click thumbs-up icon on any review
2. Like count should increase
3. Click again to unlike

### Verify:
- [ ] Like count increments
- [ ] Like count decrements on unlike
- [ ] No duplicate likes

### Edit Review:
1. On your own review, click "Edit"
2. Modify text or rating
3. Click "Update"

### Verify:
- [ ] Review text updates
- [ ] "Edited" badge appears
- [ ] Average rating recalculates

### Delete Review:
1. On your own review, click "Delete"
2. Confirm deletion

### Verify:
- [ ] Review removed from list
- [ ] Average rating updates
- [ ] Count decreases

---

## 🎯 3. Test Recommendations

### Personalized Recommendations:
1. Go to http://localhost:3000/browse
2. Scroll down to "Recommended For You" section

### Verify:
- [ ] Section displays (if you have watch history)
- [ ] Shows up to 6 movies
- [ ] "See All →" button appears
- [ ] Movies are relevant to your viewing

### Trending Now:
1. Check "Trending Now" section on browse page

### Verify:
- [ ] Section displays
- [ ] Shows currently popular movies
- [ ] Updates based on recent activity

### Top Picks:
1. Check "Top Picks For You" section

### Verify:
- [ ] Shows high-rated movies (8.0+)
- [ ] Matches your genre preferences
- [ ] Quality selections

### Similar Movies:
1. Go to any movie detail page
2. Scroll to "Similar Movies" section

### Verify:
- [ ] Shows 6 related movies
- [ ] Movies share genres/directors/cast
- [ ] Click navigates to that movie's detail page

---

## 🎪 4. Test Recommendations Page

### Navigate:
1. Click "Recommended" in navbar
   OR
2. Click "See All →" from browse page

### Verify:
- [ ] Redirects to `/recommendations`
- [ ] Three tabs visible: For You, Trending Now, Top Picks
- [ ] "For You" tab active by default

### Tab Switching:
1. Click "Trending Now" tab
2. Click "Top Picks" tab
3. Click "For You" tab

### Verify:
- [ ] Active tab highlighted with red underline
- [ ] Content updates when switching tabs
- [ ] Loading spinner shown during fetch
- [ ] Movies display in grid layout

### Movie Cards:
1. Hover over a movie card

### Verify:
- [ ] Card scales up slightly
- [ ] Play button overlay appears
- [ ] IMDB rating badge visible
- [ ] Genre tags shown

2. Click a movie card

### Verify:
- [ ] Navigates to movie detail page
- [ ] Can go back and forth

---

## 🧭 5. Test Navigation

### Navbar Links:
1. Click "Home" in navbar → Should go to /browse
2. Click "Recommended" → Should go to /recommendations
3. Click "TV Shows" → Currently placeholder
4. Click "Movies" → Currently placeholder
5. Click "My List" → Currently placeholder

### Verify:
- [ ] Active page highlighted
- [ ] Smooth transitions
- [ ] No 404 errors

### Search (if implemented):
1. Click search icon in navbar
2. Type movie title
3. Press Enter

### Verify:
- [ ] Search input expands
- [ ] Can type query
- [ ] Can close search

---

## 🎬 6. Test Video Player

### Open Player:
1. Go to any movie detail page
2. Click "Play" button in hero section

### Verify:
- [ ] Modal opens with video player
- [ ] Video starts loading
- [ ] Controls visible (play, volume, fullscreen)
- [ ] Close button (✕) works
- [ ] Clicking outside modal closes it
- [ ] ESC key closes modal

---

## 💾 7. Test Watchlist

### Add to Watchlist:
1. On movie detail page
2. Click "Add to Watchlist" button

### Verify:
- [ ] Button text changes to "Remove from Watchlist"
- [ ] Button style updates (red to gray)
- [ ] Success message shows (if implemented)

### Remove from Watchlist:
1. Click "Remove from Watchlist"

### Verify:
- [ ] Button text changes back
- [ ] Button style reverts

---

## 🔍 8. Test Edge Cases

### Empty States:
1. New user with no watch history
2. Go to /recommendations

### Verify:
- [ ] Shows empty state message
- [ ] "Start watching movies to get personalized recommendations"
- [ ] No errors in console

### No Reviews:
1. Go to movie with no reviews

### Verify:
- [ ] Shows "No reviews yet"
- [ ] Encourages user to be first
- [ ] Review form still available

### Loading States:
1. Clear browser cache
2. Reload pages

### Verify:
- [ ] Loading spinners show
- [ ] Content doesn't flash
- [ ] Smooth transitions

### Error Handling:
1. Disconnect from internet temporarily
2. Try to load recommendations

### Verify:
- [ ] Error handled gracefully
- [ ] User-friendly message
- [ ] No app crash

---

## 🔒 9. Test Authentication

### Protected Routes:
1. Log out
2. Try to access /browse directly

### Verify:
- [ ] Redirects to /login
- [ ] After login, redirects back to /browse

2. Try /movie/:id when logged out

### Verify:
- [ ] Redirects to /login
- [ ] Protected routes work correctly

### JWT Token:
1. Open DevTools → Network tab
2. Make any API request (browse movies, submit review)

### Verify:
- [ ] Authorization header includes Bearer token
- [ ] API responds with 200 OK
- [ ] No 401 Unauthorized errors

---

## 📊 10. Test API Endpoints

### Using Browser DevTools:

1. Open DevTools → Network tab
2. Filter by "XHR" or "Fetch"
3. Perform actions and watch API calls

### Expected Endpoints:

#### Movies:
```
GET /api/movies → Should return movie list
GET /api/movies/:id → Should return movie details
GET /api/movies/search?q=query → Should return search results
```

#### Comments:
```
GET /api/comments/:movieId → Should return reviews
POST /api/comments → Should create review
PUT /api/comments/:commentId → Should update review
DELETE /api/comments/:commentId → Should delete review
POST /api/comments/:commentId/like → Should toggle like
```

#### Recommendations:
```
GET /api/recommendations/personalized → Personalized movies
GET /api/recommendations/trending → Trending movies
GET /api/recommendations/top-picks → Top picks
GET /api/recommendations/similar/:movieId → Similar movies
GET /api/recommendations/because-you-watched/:movieId → Contextual recs
```

#### Users:
```
PUT /api/users/watchlist → Add to watchlist
DELETE /api/users/watchlist/:movieId → Remove from watchlist
GET /api/users/profile → Get user profile
```

### Verify Each:
- [ ] Status code 200 or 201
- [ ] Response has expected structure
- [ ] Error responses have status 400/401/404/500
- [ ] Error messages are clear

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'mongoose'"
**Solution**: 
```bash
cd server
npm install
```

### Issue: "EADDRINUSE: port 5000 already in use"
**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: Recommendations not showing
**Solution**:
- User needs watch history first
- Watch some movies
- Add to watchlist
- Then check recommendations

### Issue: Reviews not submitting
**Solution**:
- Check if logged in
- Verify JWT token in localStorage
- Check network tab for errors
- Ensure MongoDB connected

### Issue: Video not playing
**Solution**:
- Check video URL is valid
- Try different video source
- Check ReactPlayer props
- Look for CORS errors

---

## ✅ Success Criteria

All advanced features working if:
- [ ] Can browse movies with recommendations
- [ ] Can view movie details with video player
- [ ] Can submit, edit, delete reviews
- [ ] Can like reviews
- [ ] Recommendations are personalized
- [ ] Similar movies appear
- [ ] Trending section updates
- [ ] Navigation works smoothly
- [ ] Watchlist functions correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Fast load times

---

## 📸 Screenshots to Take

For documentation:
1. Browse page with recommendation sections
2. Movie detail page with video player
3. Reviews section with ratings
4. Recommendations page with tabs
5. Similar movies section
6. Watchlist button states
7. Mobile responsive views

---

## 🎓 Testing Best Practices

1. **Clear Cache**: Test with clean cache
2. **Multiple Users**: Test with different accounts
3. **Different Browsers**: Chrome, Firefox, Edge
4. **Mobile Devices**: Test on phone/tablet
5. **Network Throttling**: Test on slow connection
6. **Incognito Mode**: Test without extensions
7. **Console Logs**: Check for errors/warnings
8. **DevTools**: Monitor network requests

---

## 📝 Report Bugs

If you find issues:
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Check network tab for failed requests
4. Note browser and OS version
5. Take screenshots
6. Check server logs

---

**Happy Testing! 🧪**
