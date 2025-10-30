import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/common/Navbar';

const BrowseSeries = () => {
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [top10Series, setTop10Series] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [seriesRes, top10Res] = await Promise.all([
        api.get('/series'),
        api.get('/series/trending/top10').catch(() => ({ data: { top10: [] } }))
      ]);

      setSeries(seriesRes.data.series || []);
      setTop10Series(top10Res.data.top10 || []);
    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
    }
  };

  const SeriesCard = ({ series }) => (
    <div
      onClick={() => navigate(`/series/${series._id}`)}
      className="group cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden relative">
        <img
          src={series.poster || 'https://via.placeholder.com/300x450'}
          alt={series.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-200">
            ▶
          </button>
        </div>
        {series.imdb?.rating && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs">
            <span className="text-yellow-400">⭐ {series.imdb.rating}</span>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-blue-600 px-2 py-1 rounded text-xs font-semibold">
          SERIES
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-white text-sm font-semibold truncate">
          {series.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span>{series.year}</span>
          <span>{series.seasons?.length || 0} Seasons</span>
        </div>
        <div className="mt-1">
          <span className={`text-xs px-2 py-0.5 rounded ${
            series.status === 'ongoing' ? 'bg-green-600' : 
            series.status === 'completed' ? 'bg-blue-600' : 
            'bg-gray-600'
          }`}>
            {series.status}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading web series...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-20 px-4 md:px-8 lg:px-16">
        {/* Hero Banner */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Web Series</h1>
          <p className="text-gray-400 text-lg max-w-3xl">
            Binge-watch your favorite shows. Discover new series across all genres.
          </p>
        </div>

        {/* Top 10 Series */}
        {top10Series.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">🔥 Top 10 Series</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {top10Series.map((s, index) => (
                <div key={s._id} className="relative">
                  <div className="absolute -left-4 -top-4 text-8xl font-black text-gray-800 z-0" style={{
                    textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff'
                  }}>
                    {index + 1}
                  </div>
                  <div className="relative z-10">
                    <SeriesCard series={s} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Series */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">All Web Series</h2>
          {series.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No series available yet. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {series.map((s) => (
                <SeriesCard key={s._id} series={s} />
              ))}
            </div>
          )}
        </div>

        {/* Genres Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Genre</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Horror', 'Romance', 'Documentary', 'Crime', 'Fantasy'].map((genre) => (
              <button
                key={genre}
                onClick={() => navigate(`/browse/genre/${genre}?type=series`)}
                className="bg-gray-800 hover:bg-gray-700 text-white py-8 rounded-lg transition-colors font-semibold text-lg"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseSeries;
