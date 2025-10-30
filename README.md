# 🎬 ScreenPlex - Netflix Clone with Google Authentication

A full-stack Netflix clone built with React, Node.js, Express, MongoDB, and Google OAuth 2.0 authentication.

![ScreenPlex](https://img.shields.io/badge/ScreenPlex-Netflix%20Clone-red)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-sample__mflix-brightgreen)

## ✨ Features

### Core Features
- 🔐 **Dual Authentication**: Traditional email/password + Google OAuth 2.0
- 🎥 **Movie Browsing**: Browse extensive movie collection from MongoDB sample_mflix database
- 🔍 **Search Functionality**: Search movies by title, genre, cast, and plot
- 📱 **Responsive Design**: Beautiful Netflix-like UI with Tailwind CSS
- 👤 **User Profiles**: Personalized user profiles with avatars
- 📝 **Watchlist**: Save favorite movies to watchlist
- 📊 **Watch History**: Track viewing progress
- 🎯 **Genre Filtering**: Browse movies by genre
- ⚡ **Protected Routes**: JWT-based authentication for secure access

### 🚀 Advanced Features (Production-Ready)
- 🎬 **Movie Detail Pages**: Full movie information with video player integration (ReactPlayer)
- ⭐ **Review System**: Submit reviews with 0-10 ratings, like reviews, reply to comments
- 🤖 **ML-Style Recommendations**: 5 different recommendation algorithms
  - **Personalized**: Weighted genre scoring based on watch history, watchlist, favorites
  - **Similar Movies**: Genre, director, and cast matching
  - **Trending**: Last 7 days user activity analysis
  - **Because You Watched**: Contextual recommendations
  - **Top Picks**: Curated high-rated selections (8.0+)
- 🎪 **Dedicated Recommendations Page**: Tabbed interface for exploring recommendations
- 💬 **Social Features**: Like, reply, edit reviews with ownership validation
- 📺 **Video Player**: Modal video player with ReactPlayer component
- 🎭 **Enhanced Browse**: Multiple recommendation sections on homepage
- 🔄 **Real-time Updates**: Live like counts, review submissions, watchlist changes

## 🛠️ Tech Stack

### Frontend
- **React.js** 19.2.0
- **React Router** 6.x - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **@react-oauth/google** - Google authentication
- **React Player** - Video playback

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** - Database (sample_mflix)
- **Mongoose** - ODM
- **JWT** - Authentication tokens
- **bcrypt.js** - Password hashing
- **google-auth-library** - Google OAuth verification

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Google Cloud Console account for OAuth setup

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd screenplex
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project named "ScreenPlex"
3. Enable **Google+ API**
4. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `http://localhost:3000/auth/google/callback`
7. Copy your **Client ID** and **Client Secret**

### 3. MongoDB Setup

1. Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Load the **sample_mflix** sample dataset:
   - Go to **Collections** → **Load Sample Dataset**
4. Get your connection string:
   - Click **Connect** → **Connect your application**
   - Copy the connection string

### 4. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your credentials
# REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
# REACT_APP_API_URL=http://localhost:5000/api

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

### 5. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your credentials:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
# PORT=5000
# FRONTEND_URL=http://localhost:3000

# Start server
npm run dev
```

Backend will run on `http://localhost:5000`

## 📁 Project Structure

```
screenplex/
├── public/                 # Static files
├── src/
│   ├── components/
│   │   └── auth/
│   │       ├── GoogleLoginButton.js
│   │       └── ProtectedRoute.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── Browse.js
│   ├── utils/
│   │   └── api.js
│   ├── App.js
│   └── index.js
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Movie.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── movies.js
│   │   └── users.js
│   ├── server.js
│   └── package.json
├── .env.example
└── package.json
```

## 🔑 Environment Variables

### Frontend (.env)
```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - Get all movies (paginated)
- `GET /api/movies/search?q=query` - Search movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/movies/genre/:genre` - Get movies by genre

### Comments/Reviews (NEW ⭐)
- `GET /api/comments/:movieId` - Get all reviews for a movie
- `POST /api/comments` - Submit a review with rating
- `PUT /api/comments/:commentId` - Update own review
- `DELETE /api/comments/:commentId` - Delete own review
- `POST /api/comments/:commentId/like` - Like/unlike a review
- `POST /api/comments/:commentId/reply` - Reply to a review

### Recommendations (NEW 🤖)
- `GET /api/recommendations/personalized` - Get personalized recommendations
- `GET /api/recommendations/similar/:movieId` - Get similar movies
- `GET /api/recommendations/trending` - Get trending movies (last 7 days)
- `GET /api/recommendations/because-you-watched/:movieId` - Get contextual recommendations
- `GET /api/recommendations/top-picks` - Get curated top picks (8.0+ rated)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/watchlist/:movieId` - Add to watchlist
- `DELETE /api/users/watchlist/:movieId` - Remove from watchlist
- `GET /api/users/watchlist` - Get user watchlist
- `POST /api/users/watch-history` - Update watch history

## 📚 Documentation

This project includes comprehensive documentation:

- **[ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)** - Detailed documentation of all advanced features including review system, recommendation algorithms, and video player
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference with request/response examples for all endpoints
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Summary of new features, before/after comparison, and usage instructions
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Comprehensive testing checklist for all features with expected behaviors
- **[SETUP.md](SETUP.md)** - Detailed setup instructions for development environment
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design decisions
- **[CHECKLIST.md](CHECKLIST.md)** - Development checklist and progress tracking

## 🎨 Features Implementation

### Google Authentication Flow

1. User clicks "Continue with Google"
2. Google OAuth popup appears
3. User selects Google account
4. Google returns JWT token
5. Frontend sends token to backend `/api/auth/google`
6. Backend verifies token with Google
7. Backend creates/finds user in MongoDB
8. Backend generates JWT token
9. Frontend stores token and redirects to browse page

### Traditional Authentication

1. User enters email and password
2. Frontend sends credentials to `/api/auth/login` or `/api/auth/register`
3. Backend validates and hashes password (for register)
4. Backend generates JWT token
5. Frontend stores token and redirects to browse page

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Google OAuth 2.0 verification
- CORS configuration
- Environment variable protection

## 🚧 Development

### Run Frontend
```bash
npm start
```

### Run Backend
```bash
cd server
npm run dev
```

### Build for Production
```bash
# Frontend
npm run build

# Backend
cd server
npm start
```

## 📱 Screenshots

### Landing Page
Beautiful Netflix-like landing page with hero section

### Login/Signup
Dual authentication with Google OAuth and traditional login

### Browse Movies
Grid layout with movie posters and ratings

### Movie Details
Detailed movie information with cast, plot, and ratings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with ❤️ for learning purposes

## 🙏 Acknowledgments

- MongoDB for sample_mflix database
- Netflix for design inspiration
- Google for OAuth services
- React and Node.js communities

## 📞 Support

If you encounter any issues:

1. Check `.env` files are configured correctly
2. Ensure MongoDB connection string is valid
3. Verify Google OAuth credentials
4. Check that both frontend and backend are running
5. Review browser console and server logs for errors

---

**Note**: This is an educational project and is not affiliated with Netflix.


### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
