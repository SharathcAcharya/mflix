import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll-based effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate trending movies
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovieIndex((prev) => (prev + 1) % trendingMovies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: 'Unlimited Entertainment',
      description: 'Stream thousands of movies and TV shows on demand',
      icon: '🎬',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Download & Watch Offline',
      description: 'Save your favorites and watch them anywhere, anytime',
      icon: '📥',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      title: 'Create Profiles for Kids',
      description: 'Safe, age-appropriate content for the little ones',
      icon: '👶',
      gradient: 'from-green-600 to-teal-600'
    },
    {
      title: 'Watch on Any Device',
      description: 'Phone, tablet, laptop, or TV - your choice',
      icon: '📱',
      gradient: 'from-orange-600 to-red-600'
    }
  ];

  const trendingMovies = [
    {
      title: 'Action Blockbuster',
      genre: 'Action • Thriller',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
      year: '2024'
    },
    {
      title: 'Sci-Fi Adventure',
      genre: 'Sci-Fi • Adventure',
      rating: '4.6',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
      year: '2024'
    },
    {
      title: 'Romance Drama',
      genre: 'Romance • Drama',
      rating: '4.7',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
      year: '2024'
    },
    {
      title: 'Horror Mystery',
      genre: 'Horror • Mystery',
      rating: '4.5',
      image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800',
      year: '2024'
    }
  ];

  const genres = [
    { name: 'Action', icon: '💥', color: 'from-red-600 to-orange-600' },
    { name: 'Comedy', icon: '😂', color: 'from-yellow-500 to-orange-500' },
    { name: 'Drama', icon: '🎭', color: 'from-purple-600 to-pink-600' },
    { name: 'Horror', icon: '👻', color: 'from-gray-800 to-red-900' },
    { name: 'Romance', icon: '❤️', color: 'from-pink-500 to-red-500' },
    { name: 'Sci-Fi', icon: '🚀', color: 'from-blue-600 to-cyan-500' },
    { name: 'Thriller', icon: '🔪', color: 'from-gray-700 to-gray-900' },
    { name: 'Animation', icon: '🎨', color: 'from-green-500 to-teal-500' }
  ];

  const stats = [
    { number: '10K+', label: 'Movies & Shows' },
    { number: '100K+', label: 'Happy Users' },
    { number: '50+', label: 'Countries' },
    { number: '24/7', label: 'Support' }
  ];

  const faqs = [
    {
      question: 'What is ScreenPlex?',
      answer: 'ScreenPlex is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.'
    },
    {
      question: 'How much does ScreenPlex cost?',
      answer: 'Watch ScreenPlex on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $8.99 to $17.99 a month. No extra costs, no contracts.'
    },
    {
      question: 'Where can I watch?',
      answer: 'Watch anywhere, anytime. Sign in with your ScreenPlex account to watch instantly on the web at screenplex.com from your personal computer or on any internet-connected device that offers the ScreenPlex app.'
    },
    {
      question: 'How do I cancel?',
      answer: 'ScreenPlex is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.'
    },
    {
      question: 'What can I watch on ScreenPlex?',
      answer: 'ScreenPlex has an extensive library of feature films, documentaries, TV shows, anime, award-winning ScreenPlex originals, and more. Watch as much as you want, anytime you want.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section with Parallax Effect */}
      <div className="relative min-h-screen flex flex-col">
        {/* Animated Background with Parallax */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transform scale-110 transition-transform duration-[20s] ease-out"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1574267432644-f74131e9fdde?w=1920')",
              animation: 'slowZoom 20s ease-in-out infinite alternate',
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/50"></div>
          
          {/* Floating particles with glow */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: i % 3 === 0 ? '#e50914' : i % 3 === 1 ? '#ffffff' : '#fbbf24',
                  opacity: Math.random() * 0.3 + 0.1,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${10 + Math.random() * 10}s`,
                  boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`
                }}
              />
            ))}
          </div>
        </div>

        {/* Header with Glassmorphism */}
        <header className="relative z-20 flex items-center justify-between px-4 md:px-16 py-4 md:py-6 backdrop-blur-xl bg-black/30 border-b border-white/10">
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
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <select className="px-3 md:px-4 py-2 bg-black/50 backdrop-blur-md border border-white/20 text-white rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-netflix-red">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
            <Link 
              to="/login"
              className="px-4 md:px-6 py-2 md:py-2.5 bg-netflix-red text-white rounded-md hover:bg-red-700 transition-all font-semibold shadow-lg hover:shadow-red-500/50 transform hover:scale-105 text-sm md:text-base"
            >
              Sign In
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-16 py-12 md:py-20">
          <div className="text-center max-w-6xl space-y-6 md:space-y-8 animate-fadeInUp">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 md:mb-6 leading-tight drop-shadow-2xl px-4">
              Unlimited <span className="text-netflix-red animate-pulse-slow">Movies</span>,<br />
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                TV Shows & More
              </span>
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-sm md:text-lg text-gray-300 px-4">
              <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md px-3 md:px-4 py-2 rounded-full border border-white/10">
                <span className="text-lg md:text-2xl">✓</span>
                <span>HD Quality</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md px-3 md:px-4 py-2 rounded-full border border-white/10">
                <span className="text-lg md:text-2xl">✓</span>
                <span>No Ads</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md px-3 md:px-4 py-2 rounded-full border border-white/10">
                <span className="text-lg md:text-2xl">✓</span>
                <span>Cancel Anytime</span>
              </div>
            </div>

            <p className="text-xl md:text-3xl text-gray-200 mb-4 font-light px-4">
              Watch anywhere. Start streaming today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 max-w-3xl mx-auto mt-6 md:mt-8 px-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="px-4 md:px-6 py-4 md:py-5 w-full sm:flex-1 text-base md:text-lg rounded-lg bg-black/70 backdrop-blur-md border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/50 transition-all shadow-xl"
              />
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-netflix-red to-red-700 text-white rounded-lg text-lg md:text-xl font-bold hover:from-red-700 hover:to-netflix-red transition-all whitespace-nowrap shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 flex items-center justify-center space-x-3 group"
              >
                <span>Get Started</span>
                <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="hidden md:block absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Movies Carousel */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-12 md:py-20 border-y-4 border-netflix-red/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 md:mb-12 text-center">
            🔥 <span className="text-netflix-red">Trending</span> Now
          </h2>
          
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentMovieIndex * 100}%)` }}
              >
                {trendingMovies.map((movie, index) => (
                  <div key={index} className="min-w-full px-2">
                    <div className="relative group cursor-pointer" onClick={() => navigate('/browse')}>
                      <div className="aspect-[21/9] md:aspect-[21/7] rounded-2xl overflow-hidden">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                      </div>
                      
                      <div className="absolute left-4 md:left-12 bottom-4 md:bottom-12 max-w-xl md:max-w-2xl">
                        <h3 className="text-3xl md:text-5xl font-black text-white mb-2 md:mb-4 drop-shadow-2xl">
                          {movie.title}
                        </h3>
                        <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                          <span className="px-2 md:px-3 py-1 bg-netflix-red text-white text-xs md:text-sm font-bold rounded">
                            {movie.year}
                          </span>
                          <span className="text-sm md:text-base text-gray-300">{movie.genre}</span>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-white font-semibold text-sm md:text-base">{movie.rating}</span>
                          </div>
                        </div>
                        <button className="hidden md:flex items-center space-x-2 px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-lg hover:bg-gray-200 transition-all font-bold text-base md:text-lg group-hover:scale-110 transform duration-300">
                          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                          </svg>
                          <span>Play Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {trendingMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMovieIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentMovieIndex === index ? 'w-8 bg-netflix-red' : 'w-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Genres - Interactive Cards */}
      <div className="bg-gray-900 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-12">
            Explore by <span className="text-netflix-red">Genre</span>
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
            {genres.map((genre, index) => (
              <button
                key={index}
                onClick={() => navigate(`/browse/genre/${genre.name.toLowerCase()}`)}
                className={`relative group overflow-hidden rounded-xl md:rounded-2xl p-6 md:p-8 bg-gradient-to-br ${genre.color} hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="text-4xl md:text-6xl mb-2 md:mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    {genre.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white">{genre.name}</h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Features Showcase */}
      <div className="relative bg-black py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 md:mb-16">
            Why Choose <span className="text-netflix-red">ScreenPlex?</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Interactive Feature Display */}
            <div className="order-2 md:order-1">
              <div className="space-y-4">
                {[
                  { icon: '📱', title: 'Watch on Any Device', desc: 'Stream on your phone, tablet, laptop, and TV without paying extra.' },
                  { icon: '⬇️', title: 'Download & Go', desc: 'Save your favorites to watch offline anytime, anywhere.' },
                  { icon: '👨‍👩‍👧‍👦', title: 'Multiple Profiles', desc: 'Create profiles for different family members with personalized recommendations.' },
                  { icon: '🎬', title: 'No Commitments', desc: 'Cancel anytime, no questions asked. No hidden fees.' }
                ].map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`w-full text-left p-4 md:p-6 rounded-xl transition-all duration-300 ${
                      activeFeature === index
                        ? 'bg-gradient-to-r from-netflix-red to-red-700 scale-105 shadow-2xl'
                        : 'bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <span className="text-3xl md:text-4xl">{feature.icon}</span>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-sm md:text-base text-gray-300">{feature.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Preview */}
            <div className="order-1 md:order-2">
              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  {activeFeature === 0 && (
                    <div className="animate-fadeIn flex space-x-4">
                      {['📱', '💻', '📺'].map((device, i) => (
                        <div key={i} className="text-6xl md:text-8xl animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                          {device}
                        </div>
                      ))}
                    </div>
                  )}
                  {activeFeature === 1 && (
                    <div className="animate-fadeIn text-center">
                      <div className="text-7xl md:text-9xl mb-4 animate-bounce">⬇️</div>
                      <div className="text-white font-bold text-xl md:text-2xl">Offline Viewing</div>
                    </div>
                  )}
                  {activeFeature === 2 && (
                    <div className="animate-fadeIn grid grid-cols-2 gap-4">
                      {['👨', '👩', '👧', '👦'].map((profile, i) => (
                        <div key={i} className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-netflix-red to-red-700 rounded-xl flex items-center justify-center text-3xl md:text-5xl transform hover:scale-110 transition-transform">
                          {profile}
                        </div>
                      ))}
                    </div>
                  )}
                  {activeFeature === 3 && (
                    <div className="animate-fadeIn text-center">
                      <div className="text-6xl md:text-8xl mb-4">🎬</div>
                      <div className="text-white font-bold text-xl md:text-2xl mb-2">No Contracts</div>
                      <div className="text-green-400 text-3xl md:text-5xl font-black">✓ FREE</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stats Counter */}
      <div className="bg-gradient-to-r from-netflix-red via-red-700 to-netflix-red py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { number: '10K+', label: 'Movies & Shows', icon: '🎬' },
              { number: '100K+', label: 'Active Users', icon: '👥' },
              { number: '50+', label: 'Countries', icon: '🌍' },
              { number: '4.8★', label: 'User Rating', icon: '⭐' }
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-110 transition-all duration-300"
                style={{
                  animation: `float 3s ease-in-out infinite`,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <div className="text-4xl md:text-6xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-5xl font-black text-white mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-white/90 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Preview Section */}
      <div className="relative bg-black py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Experience Cinema Like Never Before
            </h2>
            <p className="text-lg md:text-xl text-gray-400">
              4K Ultra HD • Dolby Atmos • HDR10+
            </p>
          </div>

          <div className="relative group cursor-pointer" onClick={() => setIsVideoPlaying(!isVideoPlaying)}>
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Fake video thumbnail */}
                <img
                  src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop"
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                
                {/* Play button */}
                {!isVideoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 md:w-32 md:h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-16 h-16 md:w-24 md:h-24 bg-netflix-red rounded-full flex items-center justify-center shadow-2xl">
                        <svg className="w-8 h-8 md:w-12 md:h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quality badges */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs md:text-sm font-bold rounded">4K UHD</span>
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs md:text-sm font-bold rounded">Dolby Vision</span>
                </div>
              </div>
            </div>

            {/* Feature highlights below video */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { icon: '🎥', text: 'Cinema Quality' },
                { icon: '🔊', text: 'Immersive Audio' },
                { icon: '⚡', text: 'Instant Streaming' }
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
                  <div className="text-2xl md:text-3xl mb-2">{item.icon}</div>
                  <div className="text-xs md:text-sm text-gray-300 font-semibold">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 md:mb-16">
            What Our Users Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Movie Enthusiast', rating: 5, text: 'Best streaming service I\'ve ever used! The quality is unmatched and the library is massive.' },
              { name: 'Michael Chen', role: 'Tech Reviewer', rating: 5, text: 'Lightning fast streaming, intuitive interface, and amazing content selection. Highly recommend!' },
              { name: 'Emma Davis', role: 'Family User', rating: 5, text: 'Perfect for family movie nights! The kids profiles and parental controls are excellent.' }
            ].map((review, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-700 hover:border-netflix-red transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm md:text-base mb-6 italic">"{review.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-netflix-red to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{review.name}</div>
                    <div className="text-gray-400 text-sm">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Devices Compatibility Section */}
      <div className="relative bg-black py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(229, 9, 20, 0.3) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Watch Everywhere
            </h2>
            <p className="text-lg md:text-xl text-gray-400">
              Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { device: '📱', name: 'Mobile', desc: 'iOS & Android' },
              { device: '💻', name: 'Computer', desc: 'Mac & Windows' },
              { device: '📺', name: 'Smart TV', desc: 'All Major Brands' },
              { device: '🎮', name: 'Gaming', desc: 'PS5, Xbox, Switch' }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-8 rounded-2xl border border-gray-700 hover:border-netflix-red transition-all duration-300 transform hover:scale-110 hover:-translate-y-2"
              >
                <div className="text-center">
                  <div className="text-5xl md:text-7xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    {item.device}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-netflix-red/0 to-red-900/0 group-hover:from-netflix-red/10 group-hover:to-red-900/10 rounded-2xl transition-all duration-300"></div>
              </div>
            ))}
          </div>

          {/* Compatibility badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 md:mt-16">
            {['4K Ultra HD', 'Dolby Vision', 'HDR10+', 'Dolby Atmos', '5.1 Surround'].map((tech) => (
              <div key={tech} className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full border border-gray-700 text-sm md:text-base text-gray-300 font-semibold hover:border-netflix-red hover:text-white transition-all">
                ✓ {tech}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-b from-black via-gray-900 to-black border-y-4 border-netflix-red/20 py-20" id="stats" data-animate>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 delay-${index * 100} ${
                  isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="text-5xl font-black text-netflix-red mb-3 drop-shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Features Carousel */}
      <div className="bg-black py-20" id="features" data-animate>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            Why Choose <span className="text-netflix-red">ScreenPlex</span>?
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeatureIndex(index)}
                className={`p-6 rounded-xl transition-all duration-500 transform hover:scale-105 ${
                  currentFeatureIndex === index
                    ? `bg-gradient-to-br ${feature.gradient} shadow-2xl`
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </button>
            ))}
          </div>

          {/* Feature Progress Indicator */}
          <div className="flex justify-center space-x-2">
            {features.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-500 ${
                  currentFeatureIndex === index ? 'w-12 bg-netflix-red' : 'w-6 bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content Showcase */}
      <div className="bg-gradient-to-b from-black via-gray-900 to-black py-20 border-t-4 border-netflix-red/20" id="showcase" data-animate>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className={`space-y-6 transform transition-all duration-1000 ${isVisible.showcase ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Enjoy on your <span className="text-netflix-red">TV</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {['Smart TV', 'PlayStation', 'Xbox', 'Apple TV'].map((device) => (
                  <span key={device} className="px-4 py-2 bg-gray-800 rounded-full text-sm border border-gray-700">
                    {device}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative group">
              <div className="text-9xl text-center filter drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                📺
              </div>
              <div className="absolute inset-0 bg-netflix-red/20 blur-3xl group-hover:blur-4xl transition-all duration-500"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group order-2 md:order-1">
              <div className="text-9xl text-center filter drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                📱
              </div>
              <div className="absolute inset-0 bg-blue-600/20 blur-3xl group-hover:blur-4xl transition-all duration-500"></div>
            </div>
            <div className={`space-y-6 order-1 md:order-2 transform transition-all duration-1000 ${isVisible.showcase ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Watch <span className="text-netflix-red">everywhere</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV without paying more.
              </p>
              <ul className="space-y-3 pt-4">
                {['Unlimited streaming', 'Download & watch offline', 'Multiple profiles', 'HD & 4K quality'].map((item) => (
                  <li key={item} className="flex items-center space-x-3 text-lg">
                    <span className="text-netflix-red text-2xl">✓</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-black py-20" id="faq" data-animate>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">
            Frequently Asked <span className="text-netflix-red">Questions</span>
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-800 transition-colors"
                >
                  <span className="text-lg md:text-xl font-semibold text-white pr-8">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-6 h-6 text-white transform transition-transform flex-shrink-0 ${
                      openFaq === index ? 'rotate-45' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-0 text-gray-300 text-lg leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center space-y-6">
            <p className="text-xl text-gray-300">
              Ready to watch? Enter your email to create or restart your membership.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
              <input
                type="email"
                placeholder="Email address"
                className="px-6 py-4 w-full sm:flex-1 text-lg rounded-lg bg-black/70 backdrop-blur-md border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/50 transition-all"
              />
              <Link
                to="/signup"
                className="px-8 py-4 bg-netflix-red text-white rounded-lg text-lg font-bold hover:bg-red-700 transition-all whitespace-nowrap shadow-xl hover:shadow-red-500/50 transform hover:scale-105"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <a
                    key={social}
                    href={`https://${social}.com`}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-netflix-red transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{social}</span>
                    <span className="text-xl">{social[0].toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-900 pt-8 text-center text-gray-500">
            <p>&copy; 2025 ScreenPlex. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
