import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % 4);
    }, 5000);
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

  const stats = [
    { number: '10K+', label: 'Movies & Shows' },
    { number: '100K+', label: 'Happy Users' },
    { number: '50+', label: 'Countries' },
    { number: '24/7', label: 'Support' }
  ];

  const faqs = [
    {
      question: 'What is MFlix?',
      answer: 'MFlix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.'
    },
    {
      question: 'How much does MFlix cost?',
      answer: 'Watch MFlix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $8.99 to $17.99 a month. No extra costs, no contracts.'
    },
    {
      question: 'Where can I watch?',
      answer: 'Watch anywhere, anytime. Sign in with your MFlix account to watch instantly on the web at mflix.com from your personal computer or on any internet-connected device that offers the MFlix app.'
    },
    {
      question: 'How do I cancel?',
      answer: 'MFlix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.'
    },
    {
      question: 'What can I watch on MFlix?',
      answer: 'MFlix has an extensive library of feature films, documentaries, TV shows, anime, award-winning MFlix originals, and more. Watch as much as you want, anytime you want.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section with Parallax Effect */}
      <div className="relative min-h-screen flex flex-col">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transform scale-110 transition-transform duration-[20s] ease-out"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1574267432644-f74131e9fdde?w=1920')",
              animation: 'slowZoom 20s ease-in-out infinite alternate'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/50"></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-netflix-red rounded-full opacity-20 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${10 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Header */}
        <header className="relative z-20 flex items-center justify-between px-6 md:px-16 py-6 backdrop-blur-sm bg-black/20">
          <Link 
            to="/" 
            className="text-netflix-red text-4xl md:text-5xl font-black tracking-tight hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_25px_rgba(229,9,20,0.5)]"
          >
            MFLIX
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login"
              className="px-6 py-2.5 bg-netflix-red text-white rounded-md hover:bg-red-700 transition-all font-semibold shadow-lg hover:shadow-red-500/50 transform hover:scale-105 hover:rotate-1"
            >
              Sign In
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-16 py-20">
          <div className="text-center max-w-5xl space-y-8 animate-fadeInUp">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
              Unlimited <span className="text-netflix-red animate-pulse-slow">Movies</span>,<br />
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                TV Shows & More
              </span>
            </h1>
            
            <div className="flex items-center justify-center space-x-6 text-lg text-gray-300">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">✓</span>
                <span>HD Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">✓</span>
                <span>No Ads</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">✓</span>
                <span>Cancel Anytime</span>
              </div>
            </div>

            <p className="text-2xl md:text-3xl text-gray-200 mb-4 font-light">
              Watch anywhere. Start streaming today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto mt-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="px-6 py-5 w-full sm:flex-1 text-lg rounded-lg bg-black/70 backdrop-blur-md border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/50 transition-all shadow-xl"
              />
              <Link
                to="/signup"
                className="px-10 py-5 bg-gradient-to-r from-netflix-red to-red-700 text-white rounded-lg text-xl font-bold hover:from-red-700 hover:to-netflix-red transition-all whitespace-nowrap shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 flex items-center space-x-3 group"
              >
                <span>Get Started</span>
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
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
            Why Choose <span className="text-netflix-red">MFlix</span>?
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
            <p>&copy; 2025 MFlix. All rights reserved.</p>
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
