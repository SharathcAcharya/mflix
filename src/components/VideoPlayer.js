import React, { useState, useEffect, useRef } from 'react';

const VideoPlayer = ({ streamingUrl, title, onClose }) => {
  const [embedUrl, setEmbedUrl] = useState('');
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    if (!streamingUrl) {
      setError('No streaming URL provided');
      return;
    }

    // Convert Google Drive link to embeddable format
    const convertToEmbedUrl = (url) => {
      try {
        // Google Drive share link format: https://drive.google.com/file/d/FILE_ID/view
        // Google Drive embed format: https://drive.google.com/file/d/FILE_ID/preview
        
        if (url.includes('drive.google.com')) {
          const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
          if (fileIdMatch && fileIdMatch[1]) {
            const fileId = fileIdMatch[1];
            return `https://drive.google.com/file/d/${fileId}/preview`;
          }
        }
        
        // If it's already an embed URL or other video URL, use it directly
        return url;
      } catch (err) {
        console.error('Error converting URL:', err);
        return url;
      }
    };

    const converted = convertToEmbedUrl(streamingUrl);
    setEmbedUrl(converted);
  }, [streamingUrl]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    const resetTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    resetTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseMove = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onClose();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        handleClose();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={playerContainerRef}
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onMouseMove={handleMouseMove}
    >
      {/* Header with Controls */}
      <div 
        className={`bg-gradient-to-b from-black/90 to-transparent absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-300 text-2xl font-bold transition-colors"
            title="Close (ESC)"
          >
            ← Back
          </button>
          <h2 className="text-white text-xl font-semibold">{title}</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quality Selector (Visual only for Google Drive) */}
          <div className="relative group">
            <button className="text-white hover:text-gray-300 px-3 py-2 bg-black/50 rounded transition-colors flex items-center space-x-2">
              <span>⚙️</span>
              <span className="text-sm">Auto</span>
            </button>
            <div className="absolute right-0 top-full mt-2 bg-black/95 rounded shadow-lg py-2 min-w-[120px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
              <div className="px-4 py-2 text-white hover:bg-gray-700 cursor-not-allowed opacity-50 text-sm">1080p</div>
              <div className="px-4 py-2 text-white hover:bg-gray-700 cursor-not-allowed opacity-50 text-sm">720p</div>
              <div className="px-4 py-2 text-white hover:bg-gray-700 cursor-not-allowed opacity-50 text-sm">480p</div>
              <div className="px-4 py-2 text-white bg-gray-700 text-sm">Auto ✓</div>
            </div>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-gray-300 px-3 py-2 bg-black/50 rounded transition-colors"
            title="Fullscreen (F)"
          >
            {isFullscreen ? (
              <span className="text-xl">⛶</span>
            ) : (
              <span className="text-xl">⛶</span>
            )}
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            title={title}
            style={{ border: 'none' }}
          />
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading video...</p>
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div 
        className={`bg-gradient-to-t from-black/90 to-transparent absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-gray-400 text-sm text-center space-y-1">
          <p>💡 Quality settings managed by Google Drive</p>
          <p>⌨️ Press <kbd className="px-2 py-1 bg-gray-700 rounded">F</kbd> for fullscreen • <kbd className="px-2 py-1 bg-gray-700 rounded">ESC</kbd> to exit</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
