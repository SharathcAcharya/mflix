import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import VideoPlayer from '../components/VideoPlayer';
import api from '../utils/api';

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    fetchSeriesDetails();
  }, [id]);

  const fetchSeriesDetails = async () => {
    try {
      const response = await api.get(`/series/${id}`);
      setSeries(response.data.series);
    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayEpisode = (episode) => {
    if (!episode.streamingUrl) {
      alert('This episode is not available for streaming yet.');
      return;
    }
    setSelectedEpisode(episode);
    setShowPlayer(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Series not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%), url(${series.poster || 'https://via.placeholder.com/1920x1080'})`,
          }}
        >
          <div className="absolute bottom-32 left-8 md:left-16 max-w-2xl">
            <div className="mb-4">
              <span className="bg-blue-600 px-3 py-1 rounded text-sm font-semibold">WEB SERIES</span>
              <span className={`ml-2 px-3 py-1 rounded text-sm font-semibold ${
                series.status === 'ongoing' ? 'bg-green-600' : 
                series.status === 'completed' ? 'bg-gray-600' : 
                'bg-red-600'
              }`}>
                {series.status?.toUpperCase()}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              {series.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-green-500 font-bold text-xl">
                {series.imdb?.rating ? `${series.imdb.rating}/10` : 'N/A'}
              </span>
              <span className="text-gray-300">{series.year}</span>
              <span className="border border-gray-400 px-2 py-1 text-gray-300 text-sm">
                {series.rated || 'NR'}
              </span>
              <span className="text-gray-300">{series.seasons?.length || 0} Seasons</span>
            </div>

            <p className="text-lg text-gray-300 mb-8 line-clamp-3">
              {series.plot || 'No description available.'}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {series.genres?.map((genre, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-800 bg-opacity-70 text-white rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            {series.trailerUrl && (
              <button
                onClick={() => window.open(series.trailerUrl, '_blank')}
                className="px-8 py-4 bg-gray-600 bg-opacity-70 text-white rounded font-semibold hover:bg-opacity-50 transition flex items-center space-x-2"
              >
                <span>🎬</span>
                <span>Watch Trailer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {showPlayer && selectedEpisode && (
        <VideoPlayer
          streamingUrl={selectedEpisode.streamingUrl}
          title={`${series.title} - S${series.seasons[selectedSeason]?.seasonNumber}E${selectedEpisode.episodeNumber}: ${selectedEpisode.title}`}
          onClose={() => {
            setShowPlayer(false);
            setSelectedEpisode(null);
          }}
        />
      )}

      {/* Series Details */}
      <div className="px-8 md:px-16 py-12 space-y-12">
        {/* Cast & Crew */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Cast & Crew</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            {series.cast && series.cast.length > 0 && (
              <div>
                <span className="text-gray-400 font-semibold">Cast:</span> {series.cast.join(', ')}
              </div>
            )}
            {series.directors && series.directors.length > 0 && (
              <div>
                <span className="text-gray-400 font-semibold">Directors:</span> {series.directors.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Seasons & Episodes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Episodes</h2>
          
          {/* Season Selector */}
          {series.seasons && series.seasons.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2 mb-6">
                {series.seasons.map((season, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSeason(index)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      selectedSeason === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Season {season.seasonNumber}
                    {season.title && ` - ${season.title}`}
                  </button>
                ))}
              </div>

              {/* Episodes Grid */}
              <div className="space-y-4">
                {series.seasons[selectedSeason]?.episodes?.length > 0 ? (
                  series.seasons[selectedSeason].episodes.map((episode, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group"
                      onClick={() => handlePlayEpisode(episode)}
                    >
                      <div className="flex items-center gap-4">
                        {/* Episode Number */}
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                          <span className="text-white font-bold text-xl">{episode.episodeNumber}</span>
                        </div>

                        {/* Thumbnail */}
                        {episode.thumbnail && (
                          <div className="flex-shrink-0 w-32 h-20 rounded overflow-hidden">
                            <img
                              src={episode.thumbnail}
                              alt={episode.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Episode Info */}
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-1">
                            {episode.title}
                          </h3>
                          {episode.plot && (
                            <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                              {episode.plot}
                            </p>
                          )}
                          {episode.runtime && (
                            <span className="text-gray-500 text-xs">{episode.runtime} min</span>
                          )}
                        </div>

                        {/* Play Button */}
                        <div className="flex-shrink-0">
                          {episode.streamingUrl ? (
                            <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              ▶
                            </button>
                          ) : (
                            <div className="text-gray-500 text-sm">Coming Soon</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    No episodes available for this season yet.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No seasons available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
