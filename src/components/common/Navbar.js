import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showGenreMenu, setShowGenreMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);
  const navigate = useNavigate();

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror',
    'Romance', 'Sci-Fi', 'Thriller'
  ];

  const getAvatarEmoji = (avatarId) => {
    const avatars = {
      'default1': '😊', 'default2': '🎬', 'default3': '🎭',
      'default4': '🎪', 'default5': '🎨', 'kids1': '🐻',
      'kids2': '🦄', 'kids3': '🌈'
    };
    return avatars[avatarId] || '😊';
  };

  useEffect(() => {
    const profile = localStorage.getItem('selectedProfile');
    if (profile) setCurrentProfile(JSON.parse(profile));

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('selectedProfile');
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-black' : 'bg-gradient-to-b from-black via-black/90 to-transparent'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link to="/browse" className="text-netflix-red text-2xl md:text-3xl font-bold hover:scale-105 transition">
            MFLIX
          </Link>
          
          <div className="hidden lg:flex space-x-6">
            <Link to="/browse" className="text-white hover:text-gray-300 transition text-sm">Movies</Link>
            <Link to="/series" className="text-white hover:text-gray-300 transition text-sm">Web Series</Link>
            
            <div className="relative">
              <button
                onMouseEnter={() => setShowGenreMenu(true)}
                onMouseLeave={() => setShowGenreMenu(false)}
                className="text-white hover:text-gray-300 transition flex items-center space-x-1 text-sm"
              >
                <span>Genres</span>
                <svg className={`w-4 h-4 transition-transform ${showGenreMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showGenreMenu && (
                <div
                  onMouseEnter={() => setShowGenreMenu(true)}
                  onMouseLeave={() => setShowGenreMenu(false)}
                  className="absolute top-full left-0 mt-2 w-56 bg-black/95 border border-gray-700 rounded shadow-lg py-2"
                >
                  {genres.map((genre) => (
                    <Link key={genre} to={`/browse/genre/${genre.toLowerCase()}`} className="block px-4 py-2 text-white hover:bg-gray-800 transition text-sm" onClick={() => setShowGenreMenu(false)}>{genre}</Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link to="/recommendations" className="text-white hover:text-gray-300 transition text-sm">Recommended</Link>
            <Link to="/my-list" className="text-white hover:text-gray-300 transition text-sm">My List</Link>
          </div>

          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden text-white p-2 hover:bg-gray-800 rounded transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="relative">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="bg-black/70 border border-white text-white px-3 py-2 md:px-4 md:py-2 rounded w-32 md:w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red text-sm" autoFocus />
                <button type="button" onClick={() => setShowSearch(false)} className="ml-2 text-white hover:text-gray-300">✕</button>
              </form>
            ) : (
              <button onClick={() => setShowSearch(true)} className="text-white hover:text-gray-300 transition p-2 hover:bg-gray-800 rounded">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          <div className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 focus:outline-none group">
              {currentProfile ? (
                <div className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded flex items-center justify-center text-lg md:text-xl group-hover:ring-2 group-hover:ring-white transition">
                  {getAvatarEmoji(currentProfile.avatar)}
                </div>
              ) : (
                <img src={user?.avatar || 'https://i.pravatar.cc/150?img=68'} alt={user?.name || 'User'} className="w-8 h-8 md:w-10 md:h-10 rounded object-cover group-hover:ring-2 group-hover:ring-white transition" />
              )}
              <svg className={`w-4 h-4 text-white transition-transform hidden md:block ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-black/95 border border-gray-700 rounded shadow-lg z-50">
                  {currentProfile && (
                    <div className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center text-2xl">
                          {getAvatarEmoji(currentProfile.avatar)}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{currentProfile.name}</p>
                          {currentProfile.isKids && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">KIDS</span>}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Link to="/profiles" className="block px-4 py-2.5 text-white hover:bg-gray-800 transition text-sm" onClick={() => setShowUserMenu(false)}>
                    <span className="mr-2">🔄</span> Switch Profile
                  </Link>
                  <Link to="/account" className="block px-4 py-2.5 text-white hover:bg-gray-800 transition text-sm" onClick={() => setShowUserMenu(false)}>
                    <span className="mr-2">⚙️</span> Account
                  </Link>
                  <Link to="/my-list" className="block px-4 py-2.5 text-white hover:bg-gray-800 transition text-sm lg:hidden" onClick={() => setShowUserMenu(false)}>
                    <span className="mr-2">📝</span> My List
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-white hover:bg-gray-800 transition border-t border-gray-700 text-sm">
                    <span className="mr-2">🚪</span> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute top-full left-0 right-0 bg-black/98 border-t border-gray-800 z-50 lg:hidden">
            <div className="px-4 py-4 space-y-3 max-h-[calc(100vh-80px)] overflow-y-auto">
              <Link to="/browse" className="block text-white hover:text-gray-300 transition py-2 text-base font-medium" onClick={() => setShowMobileMenu(false)}>Home</Link>
              
              <div>
                <button onClick={() => setShowGenreMenu(!showGenreMenu)} className="w-full flex items-center justify-between text-white hover:text-gray-300 transition py-2 text-base font-medium">
                  <span>Genres</span>
                  <svg className={`w-5 h-5 transition-transform ${showGenreMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showGenreMenu && (
                  <div className="mt-2 ml-4 space-y-2 max-h-60 overflow-y-auto">
                    {genres.map((genre) => (
                      <Link key={genre} to={`/browse/genre/${genre.toLowerCase()}`} className="block text-gray-400 hover:text-white transition py-1.5 text-sm" onClick={() => { setShowGenreMenu(false); setShowMobileMenu(false); }}>{genre}</Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link to="/recommendations" className="block text-white hover:text-gray-300 transition py-2 text-base font-medium" onClick={() => setShowMobileMenu(false)}>Recommended</Link>
              <Link to="/my-list" className="block text-white hover:text-gray-300 transition py-2 text-base font-medium" onClick={() => setShowMobileMenu(false)}>My List</Link>

              <form onSubmit={(e) => { handleSearch(e); setShowMobileMenu(false); }} className="pt-3 border-t border-gray-800">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search movies..." className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-netflix-red text-base" />
              </form>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
