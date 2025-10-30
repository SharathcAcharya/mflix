import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminSeries = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEpisodeModal, setShowEpisodeModal] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const adminToken = localStorage.getItem('adminToken');

  const [formData, setFormData] = useState({
    title: '',
    plot: '',
    genres: '',
    year: '',
    rated: '',
    poster: '',
    trailerUrl: '',
    cast: '',
    directors: '',
    status: 'ongoing',
    imdb: { rating: '', votes: '' }
  });

  const [seasonData, setSeasonData] = useState({
    seasonNumber: '',
    title: '',
    releaseYear: ''
  });

  const [episodeData, setEpisodeData] = useState({
    episodeNumber: '',
    title: '',
    plot: '',
    runtime: '',
    streamingUrl: '',
    thumbnail: ''
  });

  useEffect(() => {
    fetchSeries();
  }, [page, searchTerm]);

  const fetchSeries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/series`, {
        params: { page, search: searchTerm, limit: 12 },
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setSeries(response.data.series);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('imdb.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        imdb: { ...prev.imdb, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSeries = async (e) => {
    e.preventDefault();
    try {
      const seriesData = {
        ...formData,
        genres: formData.genres.split(',').map(g => g.trim()).filter(g => g),
        cast: formData.cast.split(',').map(c => c.trim()).filter(c => c),
        directors: formData.directors.split(',').map(d => d.trim()).filter(d => d),
        imdb: {
          rating: parseFloat(formData.imdb.rating) || 0,
          votes: parseInt(formData.imdb.votes) || 0
        },
        seasons: []
      };

      await axios.post('http://localhost:5000/api/admin/series', seriesData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      alert('Series added successfully!');
      setShowAddModal(false);
      resetForm();
      fetchSeries();
    } catch (error) {
      console.error('Error adding series:', error);
      alert('Failed to add series');
    }
  };

  const handleEditSeries = async (e) => {
    e.preventDefault();
    try {
      const seriesData = {
        ...formData,
        genres: formData.genres.split(',').map(g => g.trim()).filter(g => g),
        cast: formData.cast.split(',').map(c => c.trim()).filter(c => c),
        directors: formData.directors.split(',').map(d => d.trim()).filter(d => d),
        imdb: {
          rating: parseFloat(formData.imdb.rating) || 0,
          votes: parseInt(formData.imdb.votes) || 0
        }
      };

      await axios.put(`http://localhost:5000/api/admin/series/${selectedSeries._id}`, seriesData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      alert('Series updated successfully!');
      setShowEditModal(false);
      resetForm();
      fetchSeries();
    } catch (error) {
      console.error('Error updating series:', error);
      alert('Failed to update series');
    }
  };

  const handleDeleteSeries = async (seriesId) => {
    if (!window.confirm('Are you sure you want to delete this series?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/series/${seriesId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      alert('Series deleted successfully!');
      fetchSeries();
    } catch (error) {
      console.error('Error deleting series:', error);
      alert('Failed to delete series');
    }
  };

  const handleAddSeason = async () => {
    if (!selectedSeries) return;

    try {
      const newSeason = {
        seasonNumber: parseInt(seasonData.seasonNumber),
        title: seasonData.title,
        releaseYear: parseInt(seasonData.releaseYear),
        episodes: []
      };

      const updatedSeasons = [...(selectedSeries.seasons || []), newSeason];

      await axios.put(`http://localhost:5000/api/admin/series/${selectedSeries._id}`, {
        ...selectedSeries,
        seasons: updatedSeasons
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      alert('Season added successfully!');
      setSeasonData({ seasonNumber: '', title: '', releaseYear: '' });
      fetchSeries();
    } catch (error) {
      console.error('Error adding season:', error);
      alert('Failed to add season');
    }
  };

  const handleAddEpisode = async () => {
    if (!selectedSeries || selectedSeason === null) return;

    try {
      const newEpisode = {
        episodeNumber: parseInt(episodeData.episodeNumber),
        title: episodeData.title,
        plot: episodeData.plot,
        runtime: parseInt(episodeData.runtime),
        streamingUrl: episodeData.streamingUrl,
        thumbnail: episodeData.thumbnail
      };

      const updatedSeasons = [...selectedSeries.seasons];
      updatedSeasons[selectedSeason].episodes.push(newEpisode);

      await axios.put(`http://localhost:5000/api/admin/series/${selectedSeries._id}`, {
        ...selectedSeries,
        seasons: updatedSeasons
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      alert('Episode added successfully!');
      setEpisodeData({ episodeNumber: '', title: '', plot: '', runtime: '', streamingUrl: '', thumbnail: '' });
      setShowEpisodeModal(false);
      fetchSeries();
    } catch (error) {
      console.error('Error adding episode:', error);
      alert('Failed to add episode');
    }
  };

  const openEditModal = (series) => {
    setSelectedSeries(series);
    setFormData({
      title: series.title || '',
      plot: series.plot || '',
      genres: Array.isArray(series.genres) ? series.genres.join(', ') : '',
      year: series.year || '',
      rated: series.rated || '',
      poster: series.poster || '',
      trailerUrl: series.trailerUrl || '',
      cast: Array.isArray(series.cast) ? series.cast.join(', ') : '',
      directors: Array.isArray(series.directors) ? series.directors.join(', ') : '',
      status: series.status || 'ongoing',
      imdb: {
        rating: series.imdb?.rating || '',
        votes: series.imdb?.votes || ''
      }
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      plot: '',
      genres: '',
      year: '',
      rated: '',
      poster: '',
      trailerUrl: '',
      cast: '',
      directors: '',
      status: 'ongoing',
      imdb: { rating: '', votes: '' }
    });
    setSelectedSeries(null);
  };

  const SeriesForm = ({ onSubmit, buttonText }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Year *</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Plot *</label>
        <textarea
          name="plot"
          value={formData.plot}
          onChange={handleInputChange}
          required
          rows="3"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Genres (comma separated) *</label>
          <input
            type="text"
            name="genres"
            value={formData.genres}
            onChange={handleInputChange}
            required
            placeholder="Action, Drama, Thriller"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Rated</label>
          <input
            type="text"
            name="rated"
            value={formData.rated}
            onChange={handleInputChange}
            placeholder="TV-MA"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Poster URL</label>
          <input
            type="text"
            name="poster"
            value={formData.poster}
            onChange={handleInputChange}
            placeholder="https://..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          🎥 Trailer URL (Optional)
        </label>
        <input
          type="text"
          name="trailerUrl"
          value={formData.trailerUrl}
          onChange={handleInputChange}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Cast (comma separated)</label>
        <input
          type="text"
          name="cast"
          value={formData.cast}
          onChange={handleInputChange}
          placeholder="Actor 1, Actor 2, Actor 3"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Directors (comma separated)</label>
        <input
          type="text"
          name="directors"
          value={formData.directors}
          onChange={handleInputChange}
          placeholder="Director 1, Director 2"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">IMDB Rating</label>
          <input
            type="number"
            step="0.1"
            name="imdb.rating"
            value={formData.imdb.rating}
            onChange={handleInputChange}
            placeholder="8.5"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">IMDB Votes</label>
          <input
            type="number"
            name="imdb.votes"
            value={formData.imdb.votes}
            onChange={handleInputChange}
            placeholder="250000"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            resetForm();
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Web Series Management</h1>
          <p className="text-gray-400 mt-1">Manage your web series library</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Add Series</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search series..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
      </div>

      {/* Series Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : series.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No series found. Add your first series!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {series.map((s) => (
            <div key={s._id} className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-600 transition-all">
              <div className="relative h-64 bg-gray-700">
                {s.poster ? (
                  <img
                    src={s.poster}
                    alt={s.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Poster
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                  {s.status}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-1 truncate">{s.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{s.year} • {s.seasons?.length || 0} Seasons</p>
                {s.imdb?.rating && (
                  <p className="text-yellow-500 text-sm mb-3">⭐ {s.imdb.rating}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  {s.genres?.slice(0, 2).map((genre, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      {genre}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedSeries(s);
                      setSelectedSeason(null);
                    }}
                    className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                  >
                    Seasons/Episodes
                  </button>
                  <button
                    onClick={() => openEditModal(s)}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSeries(s._id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-800 text-white rounded-lg">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Series Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Add New Series</h2>
            <SeriesForm onSubmit={handleAddSeries} buttonText="Add Series" />
          </div>
        </div>
      )}

      {/* Edit Series Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Series</h2>
            <SeriesForm onSubmit={handleEditSeries} buttonText="Update Series" />
          </div>
        </div>
      )}

      {/* Seasons/Episodes Management Modal */}
      {selectedSeries && !showEpisodeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedSeries.title} - Seasons</h2>
              <button
                onClick={() => setSelectedSeries(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Add Season Form */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Add New Season</h3>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Season Number"
                  value={seasonData.seasonNumber}
                  onChange={(e) => setSeasonData({...seasonData, seasonNumber: e.target.value})}
                  className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                />
                <input
                  type="text"
                  placeholder="Season Title"
                  value={seasonData.title}
                  onChange={(e) => setSeasonData({...seasonData, title: e.target.value})}
                  className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                />
                <input
                  type="number"
                  placeholder="Release Year"
                  value={seasonData.releaseYear}
                  onChange={(e) => setSeasonData({...seasonData, releaseYear: e.target.value})}
                  className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                />
              </div>
              <button
                onClick={handleAddSeason}
                className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Add Season
              </button>
            </div>

            {/* Seasons List */}
            <div className="space-y-4">
              {selectedSeries.seasons?.map((season, seasonIdx) => (
                <div key={seasonIdx} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Season {season.seasonNumber}: {season.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{season.episodes?.length || 0} Episodes</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSeason(seasonIdx);
                        setShowEpisodeModal(true);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      Add Episode
                    </button>
                  </div>

                  {/* Episodes */}
                  <div className="space-y-2">
                    {season.episodes?.map((episode, epIdx) => (
                      <div key={epIdx} className="bg-gray-600 rounded p-3 flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">
                            E{episode.episodeNumber}: {episode.title}
                          </p>
                          <p className="text-gray-400 text-sm">{episode.runtime} min</p>
                        </div>
                        {episode.streamingUrl && (
                          <span className="text-green-500 text-sm">✓ Video</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Episode Modal */}
      {showEpisodeModal && selectedSeries && selectedSeason !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Add Episode - Season {selectedSeries.seasons[selectedSeason].seasonNumber}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Episode Number *</label>
                  <input
                    type="number"
                    value={episodeData.episodeNumber}
                    onChange={(e) => setEpisodeData({...episodeData, episodeNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Runtime (minutes) *</label>
                  <input
                    type="number"
                    value={episodeData.runtime}
                    onChange={(e) => setEpisodeData({...episodeData, runtime: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Episode Title *</label>
                <input
                  type="text"
                  value={episodeData.title}
                  onChange={(e) => setEpisodeData({...episodeData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Plot</label>
                <textarea
                  value={episodeData.plot}
                  onChange={(e) => setEpisodeData({...episodeData, plot: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🎬 Streaming URL (Google Drive Link) *
                </label>
                <input
                  type="text"
                  value={episodeData.streamingUrl}
                  onChange={(e) => setEpisodeData({...episodeData, streamingUrl: e.target.value})}
                  placeholder="https://drive.google.com/file/d/your-file-id/view"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Make sure the file is set to "Anyone with the link can view"
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail URL</label>
                <input
                  type="text"
                  value={episodeData.thumbnail}
                  onChange={(e) => setEpisodeData({...episodeData, thumbnail: e.target.value})}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowEpisodeModal(false);
                    setEpisodeData({ episodeNumber: '', title: '', plot: '', runtime: '', streamingUrl: '', thumbnail: '' });
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEpisode}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  Add Episode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSeries;
