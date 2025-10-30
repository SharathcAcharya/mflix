# 🛠️ MFlix - Helpful Commands Reference

## Frontend Commands (Root Directory)

### Development
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (irreversible!)
npm run eject

# Install new package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update all packages
npm update

# Check for outdated packages
npm outdated
```

### Debugging
```bash
# Clear React cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Backend Commands (Server Directory)

### Development
```bash
# Navigate to server
cd server

# Start development server (with nodemon)
npm run dev

# Start production server
npm start

# Install dependencies
npm install

# Install new package
npm install package-name
```

### Database Operations
```bash
# Test MongoDB connection
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.error(e))"

# MongoDB shell (if local MongoDB)
mongosh

# Use database
use sample_mflix

# Show collections
show collections

# Find users
db.users.find()

# Find movies
db.movies.find().limit(5)
```

## Git Commands

### Initial Setup
```bash
# Initialize repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MFlix Netflix Clone"

# Add remote
git remote add origin <your-repo-url>

# Push to GitHub
git push -u origin main
```

### Daily Workflow
```bash
# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push changes
git push

# Pull changes
git pull

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout branch-name

# Merge branch
git merge branch-name
```

## Environment Setup

### Create .env files
```bash
# Frontend
cp .env.example .env

# Backend
cp server/.env.example server/.env
```

### Edit .env files
```bash
# Windows
notepad .env
notepad server\.env

# Mac/Linux
nano .env
nano server/.env

# VS Code
code .env
code server/.env
```

## Port Management

### Check what's using a port
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :3000
lsof -i :5000
```

### Kill process on port
```bash
# Using npx kill-port
npx kill-port 3000
npx kill-port 5000

# Windows (after finding PID)
taskkill /PID <PID> /F

# Mac/Linux
kill -9 <PID>
```

## MongoDB Atlas Commands

### Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/sample_mflix?retryWrites=true&w=majority
```

### Test Connection
```bash
# Using Node.js
node -e "const mongoose = require('mongoose'); mongoose.connect('YOUR_URI').then(() => console.log('✅ Connected')).catch(e => console.error('❌ Error:', e.message));"
```

## Google OAuth Testing

### Test Token Verification
```javascript
// In Node.js
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  console.log(payload);
}

verify('YOUR_GOOGLE_TOKEN');
```

## API Testing with cURL

### Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get Current User
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Movies
```bash
# Get all movies
curl http://localhost:5000/api/movies

# Search movies
curl http://localhost:5000/api/movies/search?q=action

# Get movie by ID
curl http://localhost:5000/api/movies/MOVIE_ID

# Get movies by genre
curl http://localhost:5000/api/movies/genre/Action
```

### User Operations
```bash
# Get profile
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update profile
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Get watchlist
curl http://localhost:5000/api/users/watchlist \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add to watchlist
curl -X POST http://localhost:5000/api/users/watchlist/MOVIE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Tailwind CSS Commands

### Generate Tailwind config
```bash
npx tailwindcss init
npx tailwindcss init -p  # with PostCSS
```

### Watch Tailwind (if needed)
```bash
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

## VS Code Shortcuts

### General
- `Ctrl/Cmd + P` - Quick file open
- `Ctrl/Cmd + Shift + P` - Command palette
- `Ctrl/Cmd + B` - Toggle sidebar
- `Ctrl/Cmd + J` - Toggle terminal

### Editing
- `Alt + Up/Down` - Move line up/down
- `Shift + Alt + Up/Down` - Copy line up/down
- `Ctrl/Cmd + D` - Select next occurrence
- `Ctrl/Cmd + /` - Toggle comment

### Terminal
- ``Ctrl/Cmd + ` `` - Toggle terminal
- `Ctrl/Cmd + Shift + 5` - Split terminal
- `Ctrl/Cmd + Shift + C` - Open external terminal

## Browser DevTools

### Console Commands
```javascript
// Check if user is logged in
localStorage.getItem('user')
localStorage.getItem('token')

// Clear auth data
localStorage.clear()

// Check API endpoint
fetch('http://localhost:5000/api/health').then(r => r.json()).then(console.log)

// Test API with auth
fetch('http://localhost:5000/api/users/profile', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}).then(r => r.json()).then(console.log)
```

## Package Management

### Check versions
```bash
# Node version
node --version

# npm version
npm --version

# Check package version
npm list package-name

# Check global packages
npm list -g --depth=0
```

### Update packages
```bash
# Update specific package
npm update package-name

# Update all packages
npm update

# Update to latest (may break)
npm install package-name@latest
```

## Production Build

### Frontend
```bash
# Build
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

### Backend
```bash
# Set NODE_ENV
export NODE_ENV=production  # Mac/Linux
set NODE_ENV=production     # Windows

# Start production server
npm start
```

## Useful npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "react-scripts start",
    "build": "react-scripts build",
    "server": "cd server && npm run dev",
    "both": "concurrently \"npm start\" \"npm run server\"",
    "install-all": "npm install && cd server && npm install"
  }
}
```

## Environment Variables Management

### Show all env variables
```bash
# Windows
set

# Mac/Linux
printenv
env
```

### Set temporary env variable
```bash
# Windows
set REACT_APP_API_URL=http://localhost:5000/api

# Mac/Linux
export REACT_APP_API_URL=http://localhost:5000/api
```

## Docker Commands (Optional)

### Frontend Dockerfile
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Backend Dockerfile
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Docker Compose
```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down

# Rebuild
docker-compose up --build
```

## Quick Troubleshooting

```bash
# Clear everything and restart
rm -rf node_modules package-lock.json
npm install
npm start

# For backend
cd server
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Useful Links

- React: https://react.dev/
- Express: https://expressjs.com/
- MongoDB: https://www.mongodb.com/docs/
- Tailwind CSS: https://tailwindcss.com/docs
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- JWT: https://jwt.io/

---

**Pro Tip**: Add these commands to your shell aliases or VS Code tasks for quick access!
