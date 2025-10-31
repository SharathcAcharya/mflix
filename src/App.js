import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSelection from './pages/ProfileSelection';
import Browse from './pages/Browse';
import BrowseSeries from './pages/BrowseSeries';
import MovieDetail from './pages/MovieDetail';
import SeriesDetail from './pages/SeriesDetail';
import Recommendations from './pages/Recommendations';
import GenreBrowse from './pages/GenreBrowse';
import Search from './pages/Search';
import MyList from './pages/MyList';
import ManageProfiles from './pages/ManageProfiles';
import Account from './pages/Account';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import AdminSeries from './pages/admin/AdminSeries';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import './App.css';

function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/profiles" 
              element={
                <ProtectedRoute>
                  <ProfileSelection />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/browse" 
              element={
                <ProtectedRoute>
                  <Browse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/series" 
              element={
                <ProtectedRoute>
                  <BrowseSeries />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/movie/:id" 
              element={
                <ProtectedRoute>
                  <MovieDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/series/:id" 
              element={
                <ProtectedRoute>
                  <SeriesDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recommendations" 
              element={
                <ProtectedRoute>
                  <Recommendations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/browse/genre/:genre" 
              element={
                <ProtectedRoute>
                  <GenreBrowse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-list" 
              element={
                <ProtectedRoute>
                  <MyList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manage-profiles" 
              element={
                <ProtectedRoute>
                  <ManageProfiles />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/account" 
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Panel Routes */}
            <Route path="/admin-panel/login" element={<AdminLogin />} />
            <Route 
              path="/admin-panel" 
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="movies" element={<AdminMovies />} />
              <Route path="series" element={<AdminSeries />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
