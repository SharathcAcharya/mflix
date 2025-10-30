# 🏗️ ScreenPlex Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                     http://localhost:3000                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React App)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Home.js    │  │   Login.js   │  │  Signup.js   │        │
│  │  (Landing)   │  │  (Sign In)   │  │ (Register)   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │              Browse.js (Protected)               │         │
│  │          Main Movie Browsing Interface           │         │
│  └──────────────────────────────────────────────────┘         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Components Layer                           │  │
│  │  ┌─────────────────┐  ┌──────────────────────┐        │  │
│  │  │ GoogleLogin     │  │  ProtectedRoute      │        │  │
│  │  │ Button          │  │  (Route Guard)       │        │  │
│  │  └─────────────────┘  └──────────────────────┘        │  │
│  │  ┌──────────────────────────────────────────┐         │  │
│  │  │         Navbar (Navigation)              │         │  │
│  │  └──────────────────────────────────────────┘         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Context & State                            │  │
│  │  ┌──────────────────────────────────────────┐          │  │
│  │  │    AuthContext (Global Auth State)       │          │  │
│  │  │  - user                                   │          │  │
│  │  │  - login()                                │          │  │
│  │  │  - logout()                               │          │  │
│  │  │  - isAuthenticated                        │          │  │
│  │  └──────────────────────────────────────────┘          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Utilities                                  │  │
│  │  ┌──────────────────────────────────────────┐          │  │
│  │  │    API Client (Axios)                    │          │  │
│  │  │  - Interceptors                          │          │  │
│  │  │  - Auth headers                          │          │  │
│  │  │  - Error handling                        │          │  │
│  │  └──────────────────────────────────────────┘          │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              │ (Axios)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BACKEND API (Express Server)                    │
│                    http://localhost:5000/api                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Routes (API Endpoints)                     │  │
│  │                                                         │  │
│  │  ┌────────────────────────────────────────────┐        │  │
│  │  │  Authentication Routes (/api/auth)         │        │  │
│  │  │  • POST /register - User registration      │        │  │
│  │  │  • POST /login    - Email/password login   │        │  │
│  │  │  • POST /google   - Google OAuth login     │        │  │
│  │  │  • GET  /me       - Get current user       │        │  │
│  │  └────────────────────────────────────────────┘        │  │
│  │                                                         │  │
│  │  ┌────────────────────────────────────────────┐        │  │
│  │  │  Movie Routes (/api/movies)                │        │  │
│  │  │  • GET  /          - Get all movies        │        │  │
│  │  │  • GET  /search    - Search movies         │        │  │
│  │  │  • GET  /:id       - Get movie by ID       │        │  │
│  │  │  • GET  /genre/:g  - Get by genre          │        │  │
│  │  └────────────────────────────────────────────┘        │  │
│  │                                                         │  │
│  │  ┌────────────────────────────────────────────┐        │  │
│  │  │  User Routes (/api/users)                  │        │  │
│  │  │  • GET    /profile      - Get profile      │        │  │
│  │  │  • PUT    /profile      - Update profile   │        │  │
│  │  │  • GET    /watchlist    - Get watchlist    │        │  │
│  │  │  • POST   /watchlist/:id - Add to list     │        │  │
│  │  │  • DELETE /watchlist/:id - Remove from list│        │  │
│  │  │  • POST   /watch-history - Update history  │        │  │
│  │  └────────────────────────────────────────────┘        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Middleware                                 │  │
│  │  • CORS                                                 │  │
│  │  • JSON Parser                                          │  │
│  │  • Auth Verification (JWT)                              │  │
│  │  • Error Handler                                        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Models (Mongoose Schemas)                  │  │
│  │                                                         │  │
│  │  ┌──────────────────────────────────────────┐          │  │
│  │  │  User Model                              │          │  │
│  │  │  • name, email, password                 │          │  │
│  │  │  • googleId, avatar                      │          │  │
│  │  │  • watchlist[], watchHistory[]           │          │  │
│  │  │  • preferences{}                         │          │  │
│  │  │  Methods:                                │          │  │
│  │  │  • comparePassword()                     │          │  │
│  │  │  Pre-save: hash password (bcrypt)        │          │  │
│  │  └──────────────────────────────────────────┘          │  │
│  │                                                         │  │
│  │  ┌──────────────────────────────────────────┐          │  │
│  │  │  Movie Model                             │          │  │
│  │  │  • title, plot, genres                   │          │  │
│  │  │  • cast, directors, year                 │          │  │
│  │  │  • poster, imdb{}, tomatoes{}            │          │  │
│  │  └──────────────────────────────────────────┘          │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas (Cloud)                        │
│                     sample_mflix Database                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │     users      │  │    movies      │  │   comments     │  │
│  │   collection   │  │   collection   │  │   collection   │  │
│  └────────────────┘  └────────────────┘  └────────────────┘  │
│                                                                 │
│  • User documents with authentication data                     │
│  • Movie documents from sample_mflix dataset                   │
│  • User watchlist and history                                  │
└─────────────────────────────────────────────────────────────────┘

                              ▲
                              │
┌─────────────────────────────────────────────────────────────────┐
│                   External Services                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────┐                  │
│  │     Google OAuth 2.0 Service             │                  │
│  │  • User authentication                   │                  │
│  │  • Token verification                    │                  │
│  │  • Profile information                   │                  │
│  └──────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Clicks "Continue with Google"
       ▼
┌─────────────────────────┐
│  Google OAuth Popup     │
└──────┬──────────────────┘
       │
       │ 2. User selects Google account
       ▼
┌─────────────────────────┐
│  Google Identity Server │
│  Verifies credentials   │
└──────┬──────────────────┘
       │
       │ 3. Returns credential token
       ▼
┌─────────────────────────┐
│  React Frontend         │
│  GoogleLoginButton      │
└──────┬──────────────────┘
       │
       │ 4. POST /api/auth/google { token }
       ▼
┌─────────────────────────┐
│  Backend API            │
│  auth.js route          │
└──────┬──────────────────┘
       │
       │ 5. Verify token with Google
       ▼
┌─────────────────────────┐
│  google-auth-library    │
│  verifyIdToken()        │
└──────┬──────────────────┘
       │
       │ 6. Extract user info (email, name, picture)
       ▼
┌─────────────────────────┐
│  MongoDB                │
│  Find or create user    │
└──────┬──────────────────┘
       │
       │ 7. Generate JWT token
       ▼
┌─────────────────────────┐
│  Backend Response       │
│  { token, user }        │
└──────┬──────────────────┘
       │
       │ 8. Store in localStorage
       ▼
┌─────────────────────────┐
│  Frontend               │
│  AuthContext updates    │
└──────┬──────────────────┘
       │
       │ 9. Redirect to /browse
       ▼
┌─────────────────────────┐
│  Browse Page            │
│  (Protected Route)      │
└─────────────────────────┘
```

## Data Flow

```
Frontend Component
        │
        │ User Action (e.g., search movies)
        ▼
┌──────────────────┐
│  API Client      │
│  (utils/api.js)  │
└────────┬─────────┘
         │
         │ HTTP Request + JWT Token
         │ GET /api/movies/search?q=action
         ▼
┌────────────────────────┐
│  Express Route         │
│  /api/movies/search    │
└────────┬───────────────┘
         │
         │ Query parameters
         ▼
┌────────────────────────┐
│  MongoDB Query         │
│  Movie.find({ ... })   │
└────────┬───────────────┘
         │
         │ Result set
         ▼
┌────────────────────────┐
│  JSON Response         │
│  { success, movies }   │
└────────┬───────────────┘
         │
         │ HTTP Response
         ▼
┌────────────────────────┐
│  Frontend Component    │
│  Updates state         │
│  Renders UI            │
└────────────────────────┘
```

## Component Hierarchy

```
App.js
├── GoogleOAuthProvider
│   └── AuthProvider (AuthContext)
│       └── Router
│           ├── Home (/)
│           ├── Login (/login)
│           │   └── GoogleLoginButton
│           ├── Signup (/signup)
│           │   └── GoogleLoginButton
│           └── Browse (/browse) [Protected]
│               ├── Navbar
│               │   ├── Search
│               │   └── UserMenu
│               └── MovieGrid
│                   └── MovieCard []
```

## Security Layers

```
┌─────────────────────────────────────────┐
│     1. CORS (Backend)                   │
│     Allows only localhost:3000          │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│     2. JWT Token Verification           │
│     Middleware checks Authorization     │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│     3. Protected Routes (Frontend)      │
│     ProtectedRoute component            │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│     4. Password Hashing (bcrypt)        │
│     10 salt rounds                      │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│     5. Google OAuth Verification        │
│     Token verified with Google          │
└─────────────────────────────────────────┘
```

## Technology Stack Layers

```
┌──────────────────────────────────────────────┐
│          Presentation Layer                  │
│  • React 19.2.0                              │
│  • Tailwind CSS                              │
│  • React Router                              │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│          Application Layer                   │
│  • React Components                          │
│  • Context API (State Management)            │
│  • Custom Hooks                              │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│          API Layer                           │
│  • Axios (HTTP Client)                       │
│  • Interceptors                              │
│  • Error Handling                            │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│          Server Layer                        │
│  • Express.js                                │
│  • Routes & Controllers                      │
│  • Middleware                                │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│          Business Logic Layer                │
│  • Authentication (JWT + Google OAuth)       │
│  • Authorization                             │
│  • Data Validation                           │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│          Data Access Layer                   │
│  • Mongoose ODM                              │
│  • Models & Schemas                          │
│  • Database Queries                          │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│          Database Layer                      │
│  • MongoDB Atlas                             │
│  • sample_mflix Database                     │
│  • Collections (users, movies)               │
└──────────────────────────────────────────────┘
```

---

**Legend:**
- `│` `▼` `└` - Data/Control Flow
- `[]` - Array/Multiple instances
- `{}` - Object/Configuration
- `()` - Parameters/Arguments
