import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const ProfileSelection = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    avatar: 'default1',
    isKids: false
  });

  // Avatar options
  const avatars = [
    { id: 'default1', emoji: '😊', color: 'bg-red-600' },
    { id: 'default2', emoji: '🎬', color: 'bg-blue-600' },
    { id: 'default3', emoji: '🎭', color: 'bg-green-600' },
    { id: 'default4', emoji: '🎪', color: 'bg-yellow-600' },
    { id: 'default5', emoji: '🎨', color: 'bg-purple-600' },
    { id: 'kids1', emoji: '🐻', color: 'bg-pink-500' },
    { id: 'kids2', emoji: '🦄', color: 'bg-indigo-500' },
    { id: 'kids3', emoji: '🌈', color: 'bg-cyan-500' }
  ];

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await api.get('/profiles');
      setProfiles(response.data.profiles || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProfile = (profile) => {
    // Store selected profile in localStorage
    localStorage.setItem('selectedProfile', JSON.stringify(profile));
    navigate('/browse');
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    
    if (!newProfile.name.trim()) {
      alert('Please enter a profile name');
      return;
    }

    try {
      const response = await api.post('/profiles', newProfile);
      setProfiles([...profiles, response.data.profile]);
      setShowAddProfile(false);
      setNewProfile({ name: '', avatar: 'default1', isKids: false });
    } catch (error) {
      console.error('Error creating profile:', error);
      alert(error.response?.data?.message || 'Failed to create profile');
    }
  };

  const handleDeleteProfile = async (profileId, e) => {
    e.stopPropagation();
    
    if (profiles.length === 1) {
      alert('You must have at least one profile');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this profile?')) {
      return;
    }

    try {
      await api.delete(`/profiles/${profileId}`);
      setProfiles(profiles.filter(p => p._id !== profileId));
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile');
    }
  };

  const getAvatarStyle = (avatarId) => {
    return avatars.find(a => a.id === avatarId) || avatars[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 md:p-8">
      {/* Enhanced Logo with 3D effect */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
          <div className="relative">
            {/* Play button icon */}
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-netflix-red via-red-600 to-red-900 rounded-lg md:rounded-xl flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-all duration-300 border-2 border-red-400/30">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
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
            <span className="text-xl md:text-3xl font-black bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl tracking-tight group-hover:tracking-wide transition-all duration-300">
              SCREEN<span className="text-netflix-red">PLEX</span>
            </span>
            <span className="text-[7px] md:text-[10px] font-semibold text-gray-400 tracking-widest uppercase -mt-0.5">
              Premium Streaming
            </span>
          </div>
        </Link>
      </div>

      <div className="max-w-6xl w-full">
        <h1 className="text-4xl md:text-6xl font-semibold text-center mb-12">
          Who's watching?
        </h1>

        {/* Profiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 mb-12">
          {profiles.map((profile) => {
            const avatarStyle = getAvatarStyle(profile.avatar);
            return (
              <div
                key={profile._id}
                onClick={() => handleSelectProfile(profile)}
                className="group cursor-pointer flex flex-col items-center"
              >
                <div className={`relative w-24 h-24 md:w-32 md:h-32 ${avatarStyle.color} rounded-lg flex items-center justify-center text-4xl md:text-6xl transform transition-all duration-300 hover:scale-110 hover:ring-4 hover:ring-white group-hover:opacity-90`}>
                  {avatarStyle.emoji}
                  
                  {/* Kids Badge */}
                  {profile.isKids && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      KIDS
                    </div>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/manage-profiles');
                    }}
                    className="absolute -top-2 -right-2 bg-white text-black rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
                    title="Edit Profile"
                  >
                    ✏️
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteProfile(profile._id, e)}
                    className="absolute -top-2 -left-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    title="Delete Profile"
                  >
                    ✕
                  </button>
                </div>
                <p className="mt-4 text-lg md:text-xl text-gray-400 group-hover:text-white transition-colors">
                  {profile.name}
                </p>
              </div>
            );
          })}

          {/* Add Profile Button */}
          {profiles.length < 5 && (
            <div
              onClick={() => setShowAddProfile(true)}
              className="group cursor-pointer flex flex-col items-center"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-800 rounded-lg flex items-center justify-center text-4xl md:text-6xl transform transition-all duration-300 hover:scale-110 hover:ring-4 hover:ring-white hover:bg-gray-700">
                <span className="text-gray-400 group-hover:text-white">+</span>
              </div>
              <p className="mt-4 text-lg md:text-xl text-gray-400 group-hover:text-white transition-colors">
                Add Profile
              </p>
            </div>
          )}
        </div>

        {/* Manage Profiles Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/manage-profiles')}
            className="px-8 py-3 border-2 border-gray-500 text-gray-400 hover:text-white hover:border-white rounded transition-all duration-300 text-lg"
          >
            Manage Profiles
          </button>
        </div>
      </div>

      {/* Add Profile Modal */}
      {showAddProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">Add Profile</h2>
              <button
                onClick={() => setShowAddProfile(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProfile}>
              {/* Avatar Selection */}
              <div className="mb-6">
                <label className="block text-lg mb-4">Choose Avatar:</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setNewProfile({ ...newProfile, avatar: avatar.id })}
                      className={`w-16 h-16 ${avatar.color} rounded-lg flex items-center justify-center text-3xl transform transition-all ${
                        newProfile.avatar === avatar.id
                          ? 'ring-4 ring-white scale-110'
                          : 'hover:scale-105'
                      }`}
                    >
                      {avatar.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-6">
                <label className="block text-lg mb-2">Name:</label>
                <input
                  type="text"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  placeholder="Enter profile name"
                  maxLength={50}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded border border-gray-700 focus:border-white focus:outline-none"
                />
              </div>

              {/* Kids Mode Toggle */}
              <div className="mb-8">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProfile.isKids}
                    onChange={(e) => setNewProfile({ ...newProfile, isKids: e.target.checked })}
                    className="w-6 h-6 mr-3 accent-red-600"
                  />
                  <div>
                    <span className="text-lg">Kids Mode</span>
                    <p className="text-sm text-gray-400">
                      Only shows age-appropriate content (Rated G, PG, or TV-Y)
                    </p>
                  </div>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
                >
                  Create Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProfile(false)}
                  className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelection;
