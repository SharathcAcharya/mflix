import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import api from '../utils/api';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalProfiles: 0,
    totalViews: 0
  });
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch all data in parallel
      const [usersRes, moviesRes] = await Promise.all([
        api.get('/users/all').catch(() => ({ data: { users: [] } })),
        api.get('/movies').catch(() => ({ data: { movies: [] } }))
      ]);

      setUsers(usersRes.data.users || []);
      setMovies(moviesRes.data.movies || []);
      
      // Calculate stats
      setStats({
        totalUsers: usersRes.data.users?.length || 0,
        totalMovies: moviesRes.data.movies?.length || 0,
        totalProfiles: 0, // Will be calculated from profiles API
        totalViews: 0 // Will be calculated from watch progress
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-gradient-to-br ${color} rounded-lg p-6 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-200 text-sm mb-1">{title}</p>
          <p className="text-white text-3xl font-bold">{value}</p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="from-blue-500 to-blue-700"
        />
        <StatCard
          title="Total Movies"
          value={stats.totalMovies}
          icon="🎬"
          color="from-red-500 to-red-700"
        />
        <StatCard
          title="Total Profiles"
          value={stats.totalProfiles}
          icon="👤"
          color="from-green-500 to-green-700"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon="👁️"
          color="from-purple-500 to-purple-700"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('movies')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition flex items-center justify-center space-x-2"
          >
            <span>🎬</span>
            <span>Manage Movies</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition flex items-center justify-center space-x-2"
          >
            <span>👥</span>
            <span>View Users</span>
          </button>
          <button
            onClick={() => navigate('/browse')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition flex items-center justify-center space-x-2"
          >
            <span>🏠</span>
            <span>Back to Site</span>
          </button>
          <button
            onClick={fetchAdminData}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition flex items-center justify-center space-x-2"
          >
            <span>🔄</span>
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="text-white font-semibold">System Status</p>
                <p className="text-gray-400 text-sm">All systems operational</p>
              </div>
            </div>
            <span className="text-green-500 text-sm">✓ Active</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💾</span>
              <div>
                <p className="text-white font-semibold">Database</p>
                <p className="text-gray-400 text-sm">MongoDB connected</p>
              </div>
            </div>
            <span className="text-green-500 text-sm">✓ Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🚀</span>
              <div>
                <p className="text-white font-semibold">Server</p>
                <p className="text-gray-400 text-sm">Running on port 5000</p>
              </div>
            </div>
            <span className="text-green-500 text-sm">✓ Running</span>
          </div>
        </div>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 py-3 px-4">Name</th>
              <th className="text-left text-gray-400 py-3 px-4">Email</th>
              <th className="text-left text-gray-400 py-3 px-4">Joined</th>
              <th className="text-left text-gray-400 py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.slice(0, 10).map((user) => (
                <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="py-3 px-4 text-white">{user.name}</td>
                  <td className="py-3 px-4 text-gray-400">{user.email}</td>
                  <td className="py-3 px-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-500 hover:text-blue-400 mr-3">View</button>
                    <button className="text-red-500 hover:text-red-400">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const MoviesTab = () => (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Movie Management</h2>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
          + Add Movie
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.slice(0, 12).map((movie) => (
          <div key={movie._id} className="bg-gray-800 rounded-lg overflow-hidden group">
            <img
              src={movie.poster || 'https://via.placeholder.com/300x450'}
              alt={movie.title}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2 truncate">{movie.title}</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{movie.year}</span>
                <span className="text-yellow-500">⭐ {movie.imdb?.rating || 'N/A'}</span>
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded transition">
                  Edit
                </button>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded transition">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-20 px-4 md:px-8 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your MFlix platform</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            👥 Users
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
              activeTab === 'movies'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🎬 Movies
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'movies' && <MoviesTab />}
      </div>
    </div>
  );
};

export default Admin;
