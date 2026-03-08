'use client';

import React, { useState } from 'react';
import ImageModal from './ImageModal';

interface ImageViewerProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export default function ImageViewer({ 
  src, 
  alt, 
  caption, 
  className = "", 
  loading = "lazy",
  onError 
}: ImageViewerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageClick = () => {
    if (!imageError) {
      setIsModalOpen(true);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    if (onError) {
      onError(e);
    }
  };

  return (
    <>
      <div 
        className="relative group"
        onClick={(e) => {
          e.stopPropagation(); // Prevent parent button from triggering
          handleImageClick();
        }}
        aria-label={`Click to view full size: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          loading={loading}
          onClick={handleImageClick}
          onError={handleImageError}
          className={`${className} cursor-pointer hover:opacity-90 transition-opacity`}
        />
        
        {/* Hover overlay with expand icon - positioned in corner */}
        {!imageError && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-white shadow-lg rounded-full p-2 border border-gray-200">
              <svg 
                className="w-4 h-4 text-gray-700" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        src={src}
        alt={alt}
        caption={caption}
      />
    </>
  );
}