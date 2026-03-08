'use client';

import React, { useState, useRef, useEffect } from 'react';

interface OptimizedVideoProps {
  src: string;
  caption?: string;
  className?: string;
  poster?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  onError?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
}

export default function OptimizedVideo({
  src,
  caption,
  className = "",
  poster,
  loading = "lazy",
  priority = false,
  onError
}: OptimizedVideoProps) {
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setHasError(true);
    setIsLoading(false);
    if (onError) {
      onError(e);
    }
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  // Generate poster image if not provided
  const getDefaultPoster = () => {
    // For static deployment, we'd need to have actual poster images
    // This is a placeholder approach
    return poster || '';
  };

  return (
    <div className="relative">
      {/* Video element */}
      {!hasError ? (
        <video
          ref={videoRef}
          src={src}
          controls
          preload="metadata"
          className={className}
          onError={handleError}
        >
          Your browser does not support the video tag.
        </video>
      ) : null}

      {/* Error fallback */}
      {hasError && (
        <div className={`${className} bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-center p-8`}>
          <div>
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Video not available: {caption || 'Question video'}
            </p>
          </div>
        </div>
      )}

      {/* Caption */}
      {caption && !hasError && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 italic">
          {caption}
        </p>
      )}

      {/* Video info overlay (optional) */}
      {!hasError && !isLoading && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
          Click to play
        </div>
      )}
    </div>
  );
}