import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const adminToken = localStorage.getItem('adminToken');

  const [formData, setFormData] = useState({
    title: '',
    plot: '',
    genres: '',
    year: '',
    rated: '',
    runtime: '',
    poster: '',
    streamingUrl: '',
    trailerUrl: '',
    cast: '',
    directors: '',
    imdb: { rating: '', votes: '' }
  });

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/movies`, {
        params: { page, search: searchTerm, limit: 12 },
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setMovies(response.data.movies);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name.startsWith('imdb.')) {
      const imdbField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        imdb: { ...prev.imdb, [imdbField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const movieData = {
        ...formData,
        genres: formData.genres.split(',').map(g => g.trim()),
        cast: formData.cast.split(',').map(c => c.trim()),
        directors: formData.directors.split(',').map(d => d.trim()),
        year: parseInt(formData.year),
        runtime: parseInt(formData.runtime),
        imdb: {
          rating: parseFloat(formData.imdb.rating),
          votes: parseInt(formData.imdb.votes)
        }
      };

      await axios.post('http://localhost:5000/api/admin/movies', movieData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      setShowAddModal(false);
      fetchMovies();
      resetForm();
      alert('Movie added successfully!');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Failed to add movie');
    }
  };

  const handleEditMovie = async (e) => {
    e.preventDefault();
    try {
      const movieData = {
        ...formData,
        genres: typeof formData.genres === 'string' 
          ? formData.genres.split(',').map(g => g.trim())
          : formData.genres,
        cast: typeof formData.cast === 'string'
          ? formData.cast.split(',').map(c => c.trim())
          : formData.cast,
        directors: typeof formData.directors === 'string'
          ? formData.directors.split(',').map(d => d.trim())
          : formData.directors,
        year: parseInt(formData.year),
        runtime: parseInt(formData.runtime),
        imdb: {
          rating: parseFloat(formData.imdb.rating),
          votes: parseInt(formData.imdb.votes)
        }
      };

      await axios.put(`http://localhost:5000/api/admin/movies/${selectedMovie._id}`, movieData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      setShowEditModal(false);
      fetchMovies();
      resetForm();
      alert('Movie updated successfully!');
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('Failed to update movie');
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      fetchMovies();
      alert('Movie deleted successfully!');
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Failed to delete movie');
    }
  };

  const openEditModal = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title || '',
      plot: movie.plot || '',
      genres: Array.isArray(movie.genres) ? movie.genres.join(', ') : '',
      year: movie.year || '',
      rated: movie.rated || '',
      runtime: movie.runtime || '',
      poster: movie.poster || '',
      streamingUrl: movie.streamingUrl || '',
      trailerUrl: movie.trailerUrl || '',
      cast: Array.isArray(movie.cast) ? movie.cast.join(', ') : '',
      directors: Array.isArray(movie.directors) ? movie.directors.join(', ') : '',
      imdb: {
        rating: movie.imdb?.rating || '',
        votes: movie.imdb?.votes || ''
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
      runtime: '',
      poster: '',
      streamingUrl: '',
      trailerUrl: '',
      cast: '',
      directors: '',
      imdb: { rating: '', votes: '' }
    });
    setSelectedMovie(null);
  };

  // Render form fields as memoized component
  const renderFormFields = useMemo(() => (
    <>
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
            placeholder="PG-13"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Runtime (minutes)</label>
          <input
            type="number"
            name="runtime"
            value={formData.runtime}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
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
          🎬 Streaming URL (Google Drive Link) *
        </label>
        <input
          type="text"
          name="streamingUrl"
          value={formData.streamingUrl}
          onChange={handleInputChange}
          required
          placeholder="https://drive.google.com/file/d/your-file-id/view"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
        />
        <p className="text-xs text-gray-400 mt-1">
          Paste your Google Drive video link here. Make sure the file is set to "Anyone with the link can view"
        </p>
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
            placeholder="7.5"
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
            placeholder="150000"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>
    </>
  ), [formData, handleInputChange]);

  const MovieForm = ({ onSubmit, buttonText }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {renderFormFields}
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
          <h1 className="text-3xl font-bold text-white">Movies Management</h1>
          <p className="text-gray-400 mt-1">Manage your movie library</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Movie
        </button>
      </div>

      {/* Search */}
      <div className="bg-gray-800 rounded-lg p-4">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div key={movie._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gray-700 relative">
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">No Image</div>';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg truncate">{movie.title}</h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                    <span>{movie.year}</span>
                    {movie.imdb?.rating && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {movie.imdb.rating}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => openEditModal(movie)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(movie._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Add New Movie</h2>
            <MovieForm onSubmit={handleAddMovie} buttonText="Add Movie" />
          </div>
        </div>
      )}

      {/* Edit Movie Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Movie</h2>
            <MovieForm onSubmit={handleEditMovie} buttonText="Update Movie" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;
