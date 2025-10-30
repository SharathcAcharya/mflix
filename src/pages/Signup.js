import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSuccess = (userData) => {
    navigate('/browse');
  };

  const handleGoogleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      const data = response.data;
      
      if (data.success) {
        login(data.user, data.token);
        navigate('/browse');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 bg-netflix-red rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-red-900 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-16 py-6">
        <Link to="/" className="text-netflix-red text-4xl md:text-5xl font-black tracking-tight hover:scale-105 transition-transform">
          SCREENPLEX
        </Link>
      </header>
      
      {/* Signup Card */}
      <div className="relative z-10 bg-black/70 backdrop-blur-xl p-8 md:p-12 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl mt-16">
        <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400 mb-8">Join ScreenPlex today and start streaming</p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6 flex items-center space-x-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {/* Google Login - Hidden for now */}
        {false && (
          <>
            <div className="mb-6">
              <GoogleLoginButton 
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>
            
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-700"></div>
              <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
              <div className="flex-1 border-t border-gray-700"></div>
            </div>
          </>
        )}
        
        {/* Traditional Signup */}
        <form onSubmit={handleSignup} className="space-y-5">
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/50 transition-all placeholder-gray-500"
              required
            />
          </div>
          
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/50 transition-all placeholder-gray-500"
              required
            />
          </div>
          
          
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/50 transition-all placeholder-gray-500"
              required
            />
          </div>
          
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-4 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/50 transition-all placeholder-gray-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-netflix-red to-red-700 text-white p-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-netflix-red/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-gray-400">
          <span>Already have an account? </span>
          <Link to="/login" className="text-white hover:underline font-semibold hover:text-netflix-red transition-colors">
            Sign in
          </Link>
        </div>
        
        <div className="mt-6 text-xs text-center text-gray-500 leading-relaxed">
          By signing up, you agree to our{' '}
          <button className="text-gray-400 hover:text-white hover:underline transition-colors">Terms of Service</button>
          {' '}and{' '}
          <button className="text-gray-400 hover:text-white hover:underline transition-colors">Privacy Policy</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
