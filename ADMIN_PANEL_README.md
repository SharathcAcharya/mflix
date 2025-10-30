# ScreenPlex Admin Panel

A separate, secure admin panel for managing the ScreenPlex platform with role-based access control.

## 🚀 Features

### Authentication & Security
- Separate admin authentication (independent from user authentication)
- Role-based access control (Super Admin, Admin, Moderator)
- Account locking after failed login attempts (5 attempts = 30 min lockout)
- JWT token-based authentication
- Secure password hashing with bcrypt

### Admin Roles & Permissions

#### Super Admin
- Full system access
- Can create and manage other admins
- Access to all features

#### Admin
- Can manage movies (add, edit, delete)
- Can manage users (view, delete)
- Can view analytics
- Cannot manage other admins

#### Moderator
- Can view analytics
- Limited modification rights

### Dashboard Features

#### 📊 Dashboard
- Real-time platform statistics
- Total users, movies, profiles, views
- Recent user registrations
- Most watched movies
- Quick actions and insights

#### 🎬 Movies Management
- **Add Movies**: Create new movies with full details
  - Title, plot, year, genres
  - Cast, directors, runtime
  - IMDB rating and votes
  - Poster URL
- **Edit Movies**: Update existing movie information
- **Delete Movies**: Remove movies with cascade deletion of related data
- **Search**: Find movies by title
- **Pagination**: Navigate through large movie collections

#### 👥 Users Management
- View all registered users
- Search users by name or email
- View detailed user information
- Delete users (cascades to profiles and watch progress)
- User statistics and activity

#### 📈 Analytics
- User growth tracking (last 30 days)
- Genre popularity statistics
- Watch completion rates
- Average viewing progress
- Interactive data visualizations

## 🔐 Access & Security

### Default Admin Credentials

```
URL:      http://localhost:3000/admin-panel/login
Username: superadmin
Password: Admin@123
Email:    admin@screenplex.com
Role:     super-admin
```

**⚠️ IMPORTANT: Change the default password after first login!**

### Creating Additional Admins

Only Super Admins can create new admin accounts. Use the admin registration endpoint:

```javascript
POST /api/admin/auth/register
Headers: {
  Authorization: Bearer <super-admin-token>
}
Body: {
  username: string,
  email: string,
  password: string,
  fullName: string,
  role: "super-admin" | "admin" | "moderator",
  permissions: {
    canManageMovies: boolean,
    canManageUsers: boolean,
    canViewAnalytics: boolean,
    canManageAdmins: boolean
  }
}
```

## 🛠️ Technical Architecture

### Backend Routes

#### Authentication
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/register` - Create new admin (Super Admin only)
- `GET /api/admin/profile` - Get admin profile

#### Dashboard
- `GET /api/admin/dashboard/stats` - Get platform statistics

#### Movies Management
- `GET /api/admin/movies` - Get all movies (paginated)
- `POST /api/admin/movies` - Add new movie
- `PUT /api/admin/movies/:id` - Update movie
- `DELETE /api/admin/movies/:id` - Delete movie

#### Users Management
- `GET /api/admin/users` - Get all users (paginated)
- `DELETE /api/admin/users/:id` - Delete user

#### Analytics
- `GET /api/admin/analytics` - Get analytics data

### Frontend Routes

```
/admin-panel/login       - Admin login page
/admin-panel/dashboard   - Main dashboard
/admin-panel/movies      - Movies management
/admin-panel/users       - Users management
/admin-panel/analytics   - Analytics dashboard
```

### Database Models

#### Admin Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  fullName: String,
  role: "super-admin" | "admin" | "moderator",
  permissions: {
    canManageMovies: Boolean,
    canManageUsers: Boolean,
    canViewAnalytics: Boolean,
    canManageAdmins: Boolean
  },
  isActive: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date
}
```

## 🔒 Security Features

1. **Separate Authentication**: Admin panel uses separate JWT tokens from user authentication
2. **Permission Checks**: All routes verify admin permissions before execution
3. **Account Locking**: Automatic lockout after 5 failed login attempts
4. **Role-Based Access**: Different permissions for different admin roles
5. **Secure Password Storage**: bcrypt hashing with salt rounds
6. **Token Expiration**: JWT tokens expire after 8 hours

## 🎨 UI/UX Features

- Modern, professional dark theme design
- Fully responsive layout
- Real-time data updates
- Interactive forms with validation
- Confirmation dialogs for destructive actions
- Loading states and error handling
- Intuitive navigation
- Search and filter capabilities
- Pagination for large datasets

## 📝 Data Management

### Movie Data Structure
All movie data is stored in MongoDB with the following structure:

```javascript
{
  title: String,
  plot: String,
  genres: [String],
  year: Number,
  rated: String,
  runtime: Number,
  poster: String (URL),
  cast: [String],
  directors: [String],
  imdb: {
    rating: Number,
    votes: Number
  }
}
```

### Cascade Deletion
- Deleting a user removes all their profiles and watch progress
- Deleting a movie removes all associated watch progress records

## 🚦 Setup Instructions

### 1. Create Super Admin

Run the seed script to create the initial super admin:

```bash
cd server
node seedAdmin.js
```

### 2. Start Backend Server

```bash
cd server
node server.js
```

Server will run on `http://localhost:5000`

### 3. Start Frontend

```bash
npm start
```

Frontend will run on `http://localhost:3000`

### 4. Access Admin Panel

Navigate to `http://localhost:3000/admin-panel/login` and use the default credentials.

## 🔄 Workflow

1. **Login**: Access admin panel at `/admin-panel/login`
2. **Dashboard**: View platform overview and statistics
3. **Manage Movies**: Add, edit, or delete movies
4. **Manage Users**: View and manage user accounts
5. **View Analytics**: Monitor platform performance
6. **Logout**: Secure logout clears all tokens

## 📊 Analytics Metrics

- **User Growth**: Daily user registrations over the last 30 days
- **Genre Distribution**: Most popular movie genres
- **Completion Rates**: Average viewing progress and completion percentages
- **Top Content**: Most watched movies and trending content

## 🛡️ Best Practices

1. **Change Default Password**: Always change the default super admin password
2. **Limited Access**: Only grant admin access to trusted individuals
3. **Regular Monitoring**: Review admin activity logs regularly
4. **Permission Management**: Assign minimal required permissions
5. **Secure Credentials**: Never share admin credentials
6. **Regular Backups**: Backup database before bulk operations

## 🔧 Troubleshooting

### Cannot Login
- Verify credentials are correct
- Check if account is locked (wait 30 minutes)
- Ensure backend server is running
- Check browser console for errors

### Data Not Loading
- Verify admin token is valid
- Check backend API responses
- Ensure proper permissions for the admin role

### Movies Not Saving
- Verify all required fields are filled
- Check image URL validity
- Ensure proper data types (numbers for year, rating, etc.)

## 📚 API Authentication

All admin API requests require JWT authentication:

```javascript
headers: {
  Authorization: 'Bearer <admin-token>'
}
```

The token is automatically included by the frontend after login.

## 🌟 Future Enhancements

- Admin activity logging
- Email notifications for admin actions
- Bulk movie import/export
- Advanced user management (suspend/activate)
- Content moderation tools
- Custom admin roles
- Two-factor authentication
- Admin dashboard customization

---

**Built with:** React, Node.js, Express, MongoDB, JWT, Tailwind CSS
