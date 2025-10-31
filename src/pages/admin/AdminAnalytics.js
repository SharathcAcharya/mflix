import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const adminToken = localStorage.getItem('adminToken');

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/analytics', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completionRate = analytics?.completionRates
    ? ((analytics.completionRates.completed / analytics.completionRates.totalWatches) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-gray-400 mt-1">Insights and statistics about your platform</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium">Avg Completion Rate</p>
              <p className="text-3xl font-bold text-white mt-2">
                {analytics?.completionRates?.avgCompletion?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-medium">Total Watches</p>
              <p className="text-3xl font-bold text-white mt-2">
                {analytics?.completionRates?.totalWatches || 0}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Completed Views</p>
              <p className="text-3xl font-bold text-white mt-2">
                {analytics?.completionRates?.completed || 0}
              </p>
              <p className="text-purple-200 text-sm mt-1">{completionRate}% completion rate</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">User Growth (Last 30 Days)</h2>
          <div className="space-y-3">
            {analytics?.userGrowth && analytics.userGrowth.length > 0 ? (
              <div className="space-y-2">
                {analytics.userGrowth.slice(-10).map((day) => (
                  <div key={day._id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300 text-sm">{day._id}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-600 rounded-full h-2 mr-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min((day.count / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-medium w-8">{day.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No user growth data available</p>
            )}
          </div>
        </div>

        {/* Genre Statistics */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Popular Genres</h2>
          <div className="space-y-3">
            {analytics?.genreStats && analytics.genreStats.length > 0 ? (
              analytics.genreStats.map((genre, index) => {
                const maxCount = analytics.genreStats[0].count;
                const percentage = (genre.count / maxCount) * 100;
                
                return (
                  <div key={genre._id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400 font-bold">#{index + 1}</span>
                        <span className="text-white font-medium">{genre._id}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{genre.count} movies</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center py-8">No genre data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Completion Rate Breakdown */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Watch Completion Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - (analytics?.completionRates?.avgCompletion || 0) / 100)}`}
                  className="text-blue-600"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute">
                <p className="text-3xl font-bold text-white">
                  {analytics?.completionRates?.avgCompletion?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
            <p className="text-gray-400 mt-4">Average Progress</p>
          </div>

          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionRate / 100)}`}
                  className="text-green-600"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute">
                <p className="text-3xl font-bold text-white">{completionRate}%</p>
              </div>
            </div>
            <p className="text-gray-400 mt-4">Completion Rate</p>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <span className="text-gray-300">Total Watches</span>
              <span className="text-white font-bold text-xl">
                {analytics?.completionRates?.totalWatches || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <span className="text-gray-300">Completed</span>
              <span className="text-green-400 font-bold text-xl">
                {analytics?.completionRates?.completed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <span className="text-gray-300">In Progress</span>
              <span className="text-blue-400 font-bold text-xl">
                {(analytics?.completionRates?.totalWatches || 0) - (analytics?.completionRates?.completed || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
