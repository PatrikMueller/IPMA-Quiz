'use client';

import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  onClick?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  clickable?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  caption,
  className = "",
  loading = "lazy",
  priority = false,
  onClick,
  onError,
  clickable = false
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

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

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Generate responsive src set for different screen sizes
  const generateSrcSet = (originalSrc: string) => {
    // For static export, we assume multiple sizes might be available
    // This would work if you have different sized versions of images
    const baseSrc = originalSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const extension = originalSrc.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
    
    // In a real implementation, you'd have these different sizes generated
    // For now, we'll use the original image but suggest different viewport sizes
    return originalSrc;
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  const handleClick = () => {
    if (onClick && !hasError) {
      onClick();
    }
  };

  // Don't render anything until in view (for lazy loading)
  if (!isInView && !priority) {
    return (
      <div 
        ref={imgRef}
        className={`${className} bg-gray-200 dark:bg-gray-700 animate-pulse`}
        style={{ minHeight: '200px' }}
        aria-label="Loading image..."
      />
    );
  }

  return (
    <div className="relative">
      {/* Blur placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 ${className} bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg`} />
      )}
      
      <img
        ref={imgRef}
        src={src}
        srcSet={generateSrcSet(src)}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        onClick={handleClick}
        className={`
          ${className} 
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${clickable && !hasError ? 'cursor-pointer hover:opacity-90' : ''}
          ${hasError ? 'hidden' : ''}
        `}
        style={{
          // Ensure aspect ratio is maintained during loading
          minHeight: isLoaded ? 'auto' : '200px'
        }}
      />

      {/* Error fallback */}
      {hasError && (
        <div className={`${className} bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-center p-8`}>
          <div>
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Image not available: {alt}
            </p>
          </div>
        </div>
      )}

      {/* Caption */}
      {caption && isLoaded && !hasError && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 italic">
          {caption}
        </p>
      )}
    </div>
  );
}