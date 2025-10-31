import React from 'react';

/**
 * SkeletonLoader Component
 * Reusable skeleton loading placeholders with shimmer animation
 * Provides different variants for different page layouts
 */

const SkeletonLoader = ({ variant = 'movieCard', count = 1 }) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'movieCard':
        return (
          <div className="skeleton-card">
            <div className="skeleton-image aspect-[2/3] bg-gray-800 rounded-md mb-2"></div>
            <div className="skeleton-title h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
            <div className="skeleton-subtitle h-3 bg-gray-800 rounded w-1/2"></div>
          </div>
        );

      case 'movieGrid':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="skeleton-card">
                <div className="skeleton-image aspect-[2/3] bg-gray-800 rounded-md mb-2"></div>
                <div className="skeleton-title h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="skeleton-subtitle h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        );

      case 'detailHero':
        return (
          <div className="skeleton-detail-hero">
            {/* Backdrop skeleton */}
            <div className="h-[70vh] bg-gray-800 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              
              {/* Content skeleton */}
              <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                <div className="skeleton-title h-12 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="skeleton-badge h-6 bg-gray-700 rounded w-16"></div>
                  <div className="skeleton-badge h-6 bg-gray-700 rounded w-24"></div>
                  <div className="skeleton-badge h-6 bg-gray-700 rounded w-20"></div>
                </div>
                <div className="skeleton-description space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-11/12"></div>
                  <div className="h-4 bg-gray-700 rounded w-10/12"></div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <div className="skeleton-button h-12 bg-gray-700 rounded w-32"></div>
                  <div className="skeleton-button h-12 bg-gray-700 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'listView':
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="skeleton-list-item flex items-center space-x-4 bg-gray-900 p-4 rounded-lg">
                <div className="skeleton-image w-24 h-36 bg-gray-800 rounded flex-shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="skeleton-title h-5 bg-gray-800 rounded w-1/3"></div>
                  <div className="skeleton-subtitle h-3 bg-gray-800 rounded w-1/4"></div>
                  <div className="skeleton-description space-y-2">
                    <div className="h-3 bg-gray-800 rounded w-full"></div>
                    <div className="h-3 bg-gray-800 rounded w-5/6"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="skeleton-badge h-6 bg-gray-800 rounded w-16"></div>
                    <div className="skeleton-badge h-6 bg-gray-800 rounded w-20"></div>
                  </div>
                </div>
                <div className="skeleton-button h-10 w-10 bg-gray-800 rounded-full flex-shrink-0"></div>
              </div>
            ))}
          </div>
        );

      case 'continueWatching':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="skeleton-card">
                <div className="skeleton-image aspect-video bg-gray-800 rounded-md mb-2 relative">
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700"></div>
                </div>
                <div className="skeleton-title h-3 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="skeleton-loader">
      {renderSkeleton()}
      
      {/* Shimmer animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .skeleton-loader :global(.skeleton-image),
        .skeleton-loader :global(.skeleton-title),
        .skeleton-loader :global(.skeleton-subtitle),
        .skeleton-loader :global(.skeleton-description > div),
        .skeleton-loader :global(.skeleton-button),
        .skeleton-loader :global(.skeleton-badge) {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(
            to right,
            #1f2937 0%,
            #374151 20%,
            #1f2937 40%,
            #1f2937 100%
          );
          background-size: 1000px 100%;
        }

        .skeleton-loader :global(.skeleton-card) {
          opacity: 0;
          animation: fadeIn 0.3s ease-in forwards;
        }

        .skeleton-loader :global(.skeleton-card):nth-child(1) { animation-delay: 0.05s; }
        .skeleton-loader :global(.skeleton-card):nth-child(2) { animation-delay: 0.1s; }
        .skeleton-loader :global(.skeleton-card):nth-child(3) { animation-delay: 0.15s; }
        .skeleton-loader :global(.skeleton-card):nth-child(4) { animation-delay: 0.2s; }
        .skeleton-loader :global(.skeleton-card):nth-child(5) { animation-delay: 0.25s; }
        .skeleton-loader :global(.skeleton-card):nth-child(6) { animation-delay: 0.3s; }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoader;
