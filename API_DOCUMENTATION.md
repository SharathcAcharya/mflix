# 📡 MFlix API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🎬 Movies API

### Get All Movies
```http
GET /movies?page=1&limit=20
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | Number | 1 | Page number |
| limit | Number | 20 | Items per page |

**Response:**
```json
{
  "success": true,
  "movies": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "The Shawshank Redemption",
      "year": 1994,
      "rated": "R",
      "runtime": 142,
      "genres": ["Drama"],
      "plot": "Two imprisoned men bond...",
      "poster": "https://...",
      "imdb": {
        "rating": 9.3,
        "votes": 2500000
      },
      "directors": ["Frank Darabont"],
      "cast": ["Tim Robbins", "Morgan Freeman"],
      "awards": {
        "wins": 7,
        "nominations": 13,
        "text": "Nominated for 7 Oscars"
      }
    }
  ],
  "totalPages": 50,
  "currentPage": 1,
  "totalMovies": 1000
}
```

---

### Get Movie by ID
```http
GET /movies/:id
```

**Response:**
```json
{
  "success": true,
  "movie": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "The Shawshank Redemption",
    "year": 1994,
    "rated": "R",
    "runtime": 142,
    "genres": ["Drama"],
    "plot": "Two imprisoned men bond over a number of years...",
    "fullPlot": "Extended plot description...",
    "poster": "https://...",
    "backdrop": "https://...",
    "imdb": {
      "rating": 9.3,
      "votes": 2500000,
      "id": "tt0111161"
    },
    "directors": ["Frank Darabont"],
    "cast": ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    "writers": ["Stephen King", "Frank Darabont"],
    "awards": {
      "wins": 7,
      "nominations": 13,
      "text": "Nominated for 7 Oscars. Another 19 wins & 26 nominations."
    },
    "countries": ["USA"],
    "languages": ["English"],
    "released": "1994-09-23T00:00:00.000Z",
    "tomatoes": {
      "viewer": {
        "rating": 4.3,
        "numReviews": 1200000
      }
    }
  }
}
```

---

### Search Movies
```http
GET /movies/search?q=shawshank&genre=Drama&year=1994
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| q | String | Search query (title, cast, directors) |
| genre | String | Filter by genre |
| year | Number | Filter by release year |
| minRating | Number | Minimum IMDB rating |
| maxRating | Number | Maximum IMDB rating |

**Response:**
```json
{
  "success": true,
  "movies": [...],
  "count": 5
}
```

---

## 💬 Comments API

### Get Movie Comments
```http
GET /comments/:movieId?page=1&limit=10&sort=newest
```

**Query Parameters:**
| Parameter | Type | Default | Options |
|-----------|------|---------|---------|
| page | Number | 1 | Page number |
| limit | Number | 10 | Items per page |
| sort | String | newest | newest, oldest, topRated, mostLiked |

**Response:**
```json
{
  "success": true,
  "comments": [
    {
      "_id": "60d5ec49eb3e4a1a2c8b4567",
      "movieId": "507f1f77bcf86cd799439011",
      "userId": {
        "_id": "60d5ec49eb3e4a1a2c8b4568",
        "name": "John Doe",
        "avatar": "https://..."
      },
      "text": "Amazing movie! Highly recommend.",
      "rating": 10,
      "likes": [
        "60d5ec49eb3e4a1a2c8b4569"
      ],
      "replies": [
        {
          "userId": {
            "_id": "60d5ec49eb3e4a1a2c8b4570",
            "name": "Jane Smith",
            "avatar": "https://..."
          },
          "text": "I agree! One of the best.",
          "createdAt": "2024-01-15T10:30:00.000Z"
        }
      ],
      "isEdited": false,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "stats": {
    "averageRating": 8.5,
    "totalComments": 150
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 15,
    "totalComments": 150,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### Create Comment
```http
POST /comments
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "movieId": "507f1f77bcf86cd799439011",
  "text": "Incredible movie with outstanding performances!",
  "rating": 10
}
```

**Validation:**
- `movieId`: Required, valid MongoDB ObjectId
- `text`: Required, 1-1000 characters
- `rating`: Required, 0-10

**Response:**
```json
{
  "success": true,
  "comment": {
    "_id": "60d5ec49eb3e4a1a2c8b4567",
    "movieId": "507f1f77bcf86cd799439011",
    "userId": {
      "_id": "60d5ec49eb3e4a1a2c8b4568",
      "name": "John Doe",
      "avatar": "https://..."
    },
    "text": "Incredible movie with outstanding performances!",
    "rating": 10,
    "likes": [],
    "replies": [],
    "isEdited": false,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Errors:**
- `400`: Missing required fields or invalid data
- `400`: User already reviewed this movie
- `401`: Not authenticated

---

### Update Comment
```http
PUT /comments/:commentId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "text": "Updated review text",
  "rating": 9
}
```

**Response:**
```json
{
  "success": true,
  "comment": {
    "_id": "60d5ec49eb3e4a1a2c8b4567",
    "text": "Updated review text",
    "rating": 9,
    "isEdited": true,
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Errors:**
- `403`: Not comment owner
- `404`: Comment not found

---

### Delete Comment
```http
DELETE /comments/:commentId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

**Errors:**
- `403`: Not comment owner
- `404`: Comment not found

---

### Like Comment
```http
POST /comments/:commentId/like
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "isLiked": true,
  "likeCount": 15,
  "message": "Comment liked"
}
```

**Note**: Toggles like/unlike. If already liked, removes like.

---

### Reply to Comment
```http
POST /comments/:commentId/reply
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "text": "Great observation! I felt the same way."
}
```

**Response:**
```json
{
  "success": true,
  "comment": {
    "_id": "60d5ec49eb3e4a1a2c8b4567",
    "replies": [
      {
        "_id": "60d5ec49eb3e4a1a2c8b4571",
        "userId": {
          "_id": "60d5ec49eb3e4a1a2c8b4568",
          "name": "John Doe",
          "avatar": "https://..."
        },
        "text": "Great observation! I felt the same way.",
        "createdAt": "2024-01-15T11:00:00.000Z"
      }
    ]
  }
}
```

---

## 🎯 Recommendations API

### Get Personalized Recommendations
```http
GET /recommendations/personalized
Authorization: Bearer <token>
```

**Algorithm**: Analyzes watch history, watchlist, and favorites with weighted genre scoring.

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "The Green Mile",
      "year": 1999,
      "genres": ["Drama", "Fantasy"],
      "poster": "https://...",
      "imdb": {
        "rating": 8.6
      },
      "score": 8.5
    }
  ],
  "algorithm": "weighted_genre_scoring",
  "userPreferences": {
    "topGenres": ["Drama", "Crime", "Thriller"],
    "watchHistoryCount": 25,
    "watchlistCount": 10
  }
}
```

---

### Get Similar Movies
```http
GET /recommendations/similar/:movieId
```

**Algorithm**: Matches genres, directors, and cast members.

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "The Green Mile",
      "year": 1999,
      "genres": ["Drama", "Fantasy"],
      "directors": ["Frank Darabont"],
      "poster": "https://...",
      "imdb": {
        "rating": 8.6
      },
      "similarity": {
        "genres": ["Drama"],
        "directors": ["Frank Darabont"],
        "cast": []
      }
    }
  ],
  "sourceMovie": "The Shawshank Redemption"
}
```

---

### Get Trending Movies
```http
GET /recommendations/trending
```

**Algorithm**: Analyzes last 7 days of user activity (watches, watchlist adds, favorites).

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Oppenheimer",
      "year": 2023,
      "genres": ["Biography", "Drama", "History"],
      "poster": "https://...",
      "imdb": {
        "rating": 8.5
      },
      "trendScore": 156,
      "activityCount": {
        "watches": 89,
        "watchlistAdds": 45,
        "favorites": 22
      }
    }
  ],
  "period": "last_7_days",
  "generatedAt": "2024-01-15T10:00:00.000Z"
}
```

---

### Get "Because You Watched" Recommendations
```http
GET /recommendations/because-you-watched/:movieId
```

**Algorithm**: Contextual recommendations based on specific movie (genres, directors, year proximity, rating proximity).

**Response:**
```json
{
  "success": true,
  "recommendations": [...],
  "sourceMovie": "The Shawshank Redemption",
  "criteria": {
    "matchGenres": ["Drama"],
    "matchDirectors": ["Frank Darabont"],
    "yearRange": [1989, 1999],
    "ratingRange": [7.8, 10.8]
  }
}
```

---

### Get Top Picks
```http
GET /recommendations/top-picks
Authorization: Bearer <token>
```

**Algorithm**: High-rated movies (8.0+) matching user's favorite genres.

**Response:**
```json
{
  "success": true,
  "recommendations": [...],
  "criteria": {
    "minRating": 8.0,
    "favoriteGenres": ["Drama", "Crime", "Thriller"]
  }
}
```

---

## 👤 Users API

### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "60d5ec49eb3e4a1a2c8b4568",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "watchHistory": [
      {
        "movieId": "507f1f77bcf86cd799439011",
        "watchedAt": "2024-01-15T10:00:00.000Z",
        "progress": 100
      }
    ],
    "watchlist": [
      "507f1f77bcf86cd799439012"
    ],
    "favoriteMovies": [
      "507f1f77bcf86cd799439011"
    ],
    "favoriteGenres": ["Drama", "Thriller"],
    "createdAt": "2023-12-01T00:00:00.000Z"
  }
}
```

---

### Add to Watchlist
```http
PUT /users/watchlist
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "movieId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Movie added to watchlist",
  "watchlist": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012"
  ]
}
```

---

### Remove from Watchlist
```http
DELETE /users/watchlist/:movieId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Movie removed from watchlist",
  "watchlist": [
    "507f1f77bcf86cd799439012"
  ]
}
```

---

### Add to Watch History
```http
POST /users/watch-history
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "movieId": "507f1f77bcf86cd799439011",
  "progress": 75
}
```

**Response:**
```json
{
  "success": true,
  "message": "Watch history updated"
}
```

---

## 🔐 Authentication API

### Register
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49eb3e4a1a2c8b4568",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://..."
  }
}
```

---

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49eb3e4a1a2c8b4568",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://..."
  }
}
```

---

### Google OAuth Login
```http
POST /auth/google
```

**Request Body:**
```json
{
  "token": "google_oauth_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49eb3e4a1a2c8b4568",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://lh3.googleusercontent.com/..."
  }
}
```

---

## 🚨 Error Responses

### Standard Error Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

### HTTP Status Codes
| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry (e.g., review already exists) |
| 500 | Server Error | Internal server error |

---

## 🔧 Rate Limiting

**Current Limits**: None (development)

**Recommended Production Limits**:
- Authentication endpoints: 5 requests/minute
- Read operations: 100 requests/minute
- Write operations: 30 requests/minute

---

## 📊 Data Models

### Movie Schema
```javascript
{
  title: String,
  year: Number,
  rated: String,
  runtime: Number,
  genres: [String],
  plot: String,
  fullPlot: String,
  poster: String,
  backdrop: String,
  imdb: {
    rating: Number,
    votes: Number,
    id: String
  },
  directors: [String],
  cast: [String],
  writers: [String],
  awards: {
    wins: Number,
    nominations: Number,
    text: String
  }
}
```

### Comment Schema
```javascript
{
  movieId: ObjectId,
  userId: ObjectId,
  text: String (max 1000),
  rating: Number (0-10),
  likes: [ObjectId],
  replies: [{
    userId: ObjectId,
    text: String,
    createdAt: Date
  }],
  isEdited: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  googleId: String,
  watchHistory: [{
    movieId: ObjectId,
    watchedAt: Date,
    progress: Number
  }],
  watchlist: [ObjectId],
  favoriteMovies: [ObjectId],
  favoriteGenres: [String],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛠️ Development Tools

### Testing with cURL

**Get Movies:**
```bash
curl http://localhost:5000/api/movies
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Create Review (with auth):**
```bash
curl -X POST http://localhost:5000/api/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"movieId":"507f1f77bcf86cd799439011","text":"Great movie!","rating":9}'
```

---

## 📚 Postman Collection

Import this collection for testing:
```json
{
  "info": {
    "name": "MFlix API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    // Collection items here
  ]
}
```

---

## 🔄 Versioning

**Current Version**: v1

**API Versioning Strategy**: URL-based
```
/api/v1/movies
/api/v2/movies (future)
```

---

**Last Updated**: January 2024
**API Version**: 1.0.0
