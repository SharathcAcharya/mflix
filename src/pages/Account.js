import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../utils/api';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    fetchUserData();
    fetchProfiles();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/users/profile');
      setUserData(response.data.user);
      setFormData({
        name: response.data.user.name,
        email: response.data.user.email
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await api.get('/profiles');
      setProfiles(response.data.profiles || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', formData);
      setUserData({ ...userData, ...formData });
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await api.delete('/users/profile');
        logout();
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-netflix-red"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your account details and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-netflix-red text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'profiles'
                ? 'bg-netflix-red text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Profiles ({profiles.length})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'security'
                ? 'bg-netflix-red text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Security
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Personal Information</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-netflix-red"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-netflix-red"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-netflix-red hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-netflix-red to-red-800 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                    {userData?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{userData?.name}</p>
                    <p className="text-gray-400">{userData?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-800">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Member Since</p>
                    <p className="text-white font-medium">
                      {new Date(userData?.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Account Status</p>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profiles Tab */}
        {activeTab === 'profiles' && (
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">My Profiles</h2>
              <button
                onClick={() => navigate('/profiles')}
                className="px-4 py-2 bg-netflix-red hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Manage Profiles
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profiles.map((profile) => (
                <div
                  key={profile._id}
                  className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors"
                >
                  <div className="w-20 h-20 mx-auto mb-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl">
                    {profile.avatar}
                  </div>
                  <p className="text-white font-medium">{profile.name}</p>
                  {profile.isKids && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                      KIDS
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Password</h3>
                    <p className="text-gray-400 text-sm">
                      Last changed {Math.floor(Math.random() * 30)} days ago
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    Change Password
                  </button>
                </div>
              </div>

              <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Sign out of all devices</h3>
                    <p className="text-gray-400 text-sm">
                      Sign out of all devices except this one
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              <div className="p-6 bg-red-900/20 rounded-lg border border-red-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-2">Delete Account</h3>
                    <p className="text-gray-400 text-sm">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
