import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ManageProfiles = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    ageRestriction: 'Adult'
  });

  // Netflix-style avatar options - memoized to prevent recreation on every render
  const avatarOptions = useMemo(() => [
    { id: 1, url: 'https://i.pravatar.cc/150?img=1', color: '#E50914' },
    { id: 2, url: 'https://i.pravatar.cc/150?img=2', color: '#564d4d' },
    { id: 3, url: 'https://i.pravatar.cc/150?img=3', color: '#0080ff' },
    { id: 4, url: 'https://i.pravatar.cc/150?img=5', color: '#00a86b' },
    { id: 5, url: 'https://i.pravatar.cc/150?img=7', color: '#ffa500' },
    { id: 6, url: 'https://i.pravatar.cc/150?img=8', color: '#9b59b6' },
    { id: 7, url: 'https://i.pravatar.cc/150?img=9', color: '#e91e63' },
    { id: 8, url: 'https://i.pravatar.cc/150?img=11', color: '#00bcd4' },
    { id: 9, url: 'https://i.pravatar.cc/150?img=12', color: '#ffeb3b' },
    { id: 10, url: 'https://i.pravatar.cc/150?img=13', color: '#8bc34a' },
    { id: 11, url: 'https://i.pravatar.cc/150?img=14', color: '#ff5722' },
    { id: 12, url: 'https://i.pravatar.cc/150?img=15', color: '#795548' },
    { id: 13, url: 'https://i.pravatar.cc/150?img=16', color: '#607d8b' },
    { id: 14, url: 'https://i.pravatar.cc/150?img=17', color: '#3f51b5' },
    { id: 15, url: 'https://i.pravatar.cc/150?img=18', color: '#009688' },
    { id: 16, url: 'https://i.pravatar.cc/150?img=20', color: '#ff9800' },
    { id: 17, url: 'https://i.pravatar.cc/150?img=22', color: '#4caf50' },
    { id: 18, url: 'https://i.pravatar.cc/150?img=24', color: '#f44336' },
    { id: 19, url: 'https://i.pravatar.cc/150?img=26', color: '#2196f3' },
    { id: 20, url: 'https://i.pravatar.cc/150?img=28', color: '#9c27b0' },
  ], []);

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      // For now, we'll use the user's existing profiles or create a mock structure
      // In production, this would be: const response = await api.get('/users/profiles');
      const mockProfiles = [
        {
          _id: '1',
          name: user?.name || 'User',
          avatar: avatarOptions[0].url,
          ageRestriction: 'Adult',
          isPrimary: true
        }
      ];
      setProfiles(mockProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  }, [avatarOptions, user?.name]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleCreateProfile = () => {
    if (profiles.length >= 5) {
      alert('You can only have up to 5 profiles.');
      return;
    }
    setIsCreatingNew(true);
    setFormData({
      name: '',
      avatar: avatarOptions[profiles.length % avatarOptions.length].url,
      ageRestriction: 'Adult'
    });
    setShowEditModal(true);
  };

  const handleEditProfile = (profile) => {
    setIsCreatingNew(false);
    setSelectedProfile(profile);
    setFormData({
      name: profile.name,
      avatar: profile.avatar,
      ageRestriction: profile.ageRestriction || 'Adult'
    });
    setShowEditModal(true);
  };

  const handleDeleteProfile = (profile) => {
    if (profile.isPrimary) {
      alert('Cannot delete the primary profile.');
      return;
    }
    if (profiles.length === 1) {
      alert('Cannot delete the last profile.');
      return;
    }
    setSelectedProfile(profile);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      // In production: await api.delete(`/users/profiles/${selectedProfile._id}`);
      setProfiles(profiles.filter(p => p._id !== selectedProfile._id));
      setShowDeleteConfirm(false);
      setSelectedProfile(null);
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a profile name.');
      return;
    }

    try {
      if (isCreatingNew) {
        // In production: const response = await api.post('/users/profiles', formData);
        const newProfile = {
          _id: Date.now().toString(),
          ...formData,
          isPrimary: false
        };
        setProfiles([...profiles, newProfile]);
      } else {
        // In production: await api.put(`/users/profiles/${selectedProfile._id}`, formData);
        setProfiles(profiles.map(p => 
          p._id === selectedProfile._id ? { ...p, ...formData } : p
        ));
      }
      setShowEditModal(false);
      setSelectedProfile(null);
      setIsCreatingNew(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const AvatarPicker = () => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Choose an Avatar</h2>
          <button
            onClick={() => setShowAvatarPicker(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
          {avatarOptions.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => {
                setFormData({ ...formData, avatar: avatar.url });
                setShowAvatarPicker(false);
              }}
              className={`relative group ${
                formData.avatar === avatar.url ? 'ring-4 ring-netflix-red' : ''
              }`}
            >
              <img
                src={avatar.url}
                alt={`Avatar ${avatar.id}`}
                className="w-full aspect-square rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
                style={{ borderColor: avatar.color, borderWidth: '2px' }}
              />
              {formData.avatar === avatar.url && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <svg className="w-8 h-8 text-netflix-red" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const EditProfileModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          {isCreatingNew ? 'Add Profile' : 'Edit Profile'}
        </h2>

        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="relative group"
            >
              <img
                src={formData.avatar || avatarOptions[0].url}
                alt="Profile Avatar"
                className="w-32 h-32 rounded-lg object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-white text-sm mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter profile name"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:border-netflix-red transition-colors"
              maxLength={20}
            />
          </div>

          {/* Age Restriction */}
          <div>
            <label className="block text-white text-sm mb-2">Age Restriction</label>
            <select
              value={formData.ageRestriction}
              onChange={(e) => setFormData({ ...formData, ageRestriction: e.target.value })}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:outline-none focus:border-netflix-red transition-colors"
            >
              <option value="Kids">Kids (7+)</option>
              <option value="Teen">Teen (13+)</option>
              <option value="Adult">Adult (18+)</option>
            </select>
            <p className="text-gray-400 text-xs mt-2">
              {formData.ageRestriction === 'Kids' && 'Only show content suitable for children'}
              {formData.ageRestriction === 'Teen' && 'Show content suitable for teenagers'}
              {formData.ageRestriction === 'Adult' && 'Show all content'}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleSaveProfile}
              className="flex-1 bg-netflix-red hover:bg-red-700 text-white py-3 rounded font-semibold transition-colors duration-300"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedProfile(null);
                setIsCreatingNew(false);
              }}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-semibold transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-white mb-4">Delete Profile?</h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the profile "{selectedProfile?.name}"? This action cannot be undone.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={confirmDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold transition-colors duration-300"
          >
            Delete
          </button>
          <button
            onClick={() => {
              setShowDeleteConfirm(false);
              setSelectedProfile(null);
            }}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-semibold transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-semibold text-white text-center mb-12">
          Manage Profiles
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
          {profiles.map((profile) => (
            <div key={profile._id} className="flex flex-col items-center group">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover group-hover:ring-4 group-hover:ring-white transition-all duration-200"
                />
                {profile.isPrimary && (
                  <div className="absolute top-2 right-2 bg-netflix-red text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleEditProfile(profile)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-200 text-black rounded-full w-10 h-10 flex items-center justify-center"
                    title="Edit Profile"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  {!profile.isPrimary && profiles.length > 1 && (
                    <button
                      onClick={() => handleDeleteProfile(profile)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center"
                      title="Delete Profile"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-white text-center mt-3 text-lg font-medium">{profile.name}</p>
              <p className="text-gray-400 text-sm">{profile.ageRestriction}</p>
            </div>
          ))}

          {/* Add Profile Button */}
          {profiles.length < 5 && (
            <button
              onClick={handleCreateProfile}
              className="flex flex-col items-center group"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-400 group-hover:text-white transition-colors text-center mt-3 text-lg font-medium">
                Add Profile
              </p>
            </button>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/browse')}
            className="bg-white hover:bg-gray-200 text-black px-8 py-3 rounded font-semibold transition-colors duration-300 text-lg"
          >
            Done
          </button>
        </div>
      </div>

      {showEditModal && <EditProfileModal />}
      {showDeleteConfirm && <DeleteConfirmModal />}
      {showAvatarPicker && <AvatarPicker />}
    </div>
  );
};

export default ManageProfiles;
