import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = (userData) => {
    navigate('/browse');
  };

  const handleGoogleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleLocalLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      const data = response.data;
      
      if (data.success) {
        login(data.user, data.token);
        navigate('/browse');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-netflix-red rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-900 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-16 py-6">
        {/* Enhanced Logo with 3D effect */}
        <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
          <div className="relative">
            {/* Play button icon */}
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-netflix-red via-red-600 to-red-900 rounded-lg md:rounded-xl flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-all duration-300 border-2 border-red-400/30">
              <svg className="w-5 h-5 md:w-7 md:h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-netflix-red rounded-lg md:rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            </div>
            {/* Floating particles around logo */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-2xl md:text-4xl font-black bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl tracking-tight group-hover:tracking-wide transition-all duration-300">
              SCREEN<span className="text-netflix-red">PLEX</span>
            </span>
            <span className="text-[8px] md:text-xs font-semibold text-gray-400 tracking-widest uppercase -mt-1">
              Premium Streaming
            </span>
          </div>
        </Link>
      </header>
      
      {/* Login Card */}
      <div className="relative z-10 bg-black/70 backdrop-blur-xl p-8 md:p-12 rounded-2xl w-full max-w-md border border-gray-800 shadow-2xl">
        <h2 className="text-4xl font-bold text-white mb-8">Welcome Back</h2>
        
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
        
        {/* Traditional Login */}
        <form onSubmit={handleLocalLogin} className="space-y-5">
          <div className="relative">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-900/50 border border-gray-700 text-white rounded-lg focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/50 transition-all placeholder-gray-500"
              required
            />
          </div>
          
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 flex items-center justify-between text-sm">
          <label className="flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors">
            <input type="checkbox" className="mr-2 w-4 h-4 accent-netflix-red" />
            <span>Remember me</span>
          </label>
          <button className="text-gray-400 hover:text-white hover:underline transition-colors">
            Need help?
          </button>
        </div>
        
        <div className="mt-8 text-center text-gray-400">
          <span>New to ScreenPlex? </span>
          <Link to="/signup" className="text-white hover:underline font-semibold hover:text-netflix-red transition-colors">
            Sign up now
          </Link>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
          <button className="text-blue-500 hover:underline">Learn more</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
