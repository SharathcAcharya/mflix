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
        e.preventDefault();
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
        className={`bg-gradient-to-b from-black via-black/80 to-transparent absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-300 transition-colors flex items-center space-x-2 bg-black/30 hover:bg-black/50 px-4 py-2 rounded"
            title="Close Player (ESC)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
          <h2 className="text-white text-xl font-semibold truncate max-w-md">{title}</h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-gray-300 px-4 py-2 bg-black/30 hover:bg-black/50 rounded transition-colors flex items-center space-x-2"
            title="Toggle Fullscreen (F)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              )}
            </svg>
            <span className="text-sm font-medium">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center relative bg-black">
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
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-netflix-red mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading video...</p>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div 
        className={`bg-gradient-to-t from-black via-black/90 to-transparent absolute bottom-0 left-0 right-0 p-4 z-10 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-center space-x-4 text-gray-400 text-sm">
          <div className="flex items-center space-x-2">
            <span>💡</span>
            <span>Use Google Drive's built-in player controls for playback</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700 text-xs">F</kbd>
            <span>Fullscreen</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700 text-xs">ESC</kbd>
            <span>Exit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
