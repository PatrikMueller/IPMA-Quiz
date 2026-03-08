'use client';

import React, { useEffect, useState, useRef } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  caption?: string;
}

export default function ImageModal({ isOpen, onClose, src, alt, caption }: ImageModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startTouch, setStartTouch] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setTranslateX(0);
      setTranslateY(0);
      setIsLoading(true);
    }
  }, [isOpen]);

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Handle background click
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setStartTouch({ x: touch.clientX, y: touch.clientY });
      setIsDragging(true);

      // Handle double tap to zoom
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 300 && tapLength > 0) {
        e.preventDefault();
        if (scale === 1) {
          setScale(2);
        } else {
          setScale(1);
          setTranslateX(0);
          setTranslateY(0);
        }
      }
      setLastTap(currentTime);
    }
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startTouch.x;
    const deltaY = touch.clientY - startTouch.y;

    if (scale > 1) {
      // Pan when zoomed in
      setTranslateX(prev => prev + deltaX * 0.5);
      setTranslateY(prev => prev + deltaY * 0.5);
      setStartTouch({ x: touch.clientX, y: touch.clientY });
    } else {
      // Swipe down to close
      if (deltaY > 100) {
        onClose();
      }
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle pinch zoom
  const handleTouchStartPinch = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      // Store initial distance for pinch zoom calculation
      (e.currentTarget as any).initialDistance = distance;
      (e.currentTarget as any).initialScale = scale;
    }
  };

  const handleTouchMovePinch = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const initialDistance = (e.currentTarget as any).initialDistance;
      const initialScale = (e.currentTarget as any).initialScale || 1;
      
      if (initialDistance) {
        const newScale = Math.max(1, Math.min(3, initialScale * (distance / initialDistance)));
        setScale(newScale);
        
        // Reset translation when scaling back to 1
        if (newScale === 1) {
          setTranslateX(0);
          setTranslateY(0);
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      onClick={handleBackgroundClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
    >
      {/* Close button */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors cursor-pointer"
        aria-label="Close modal"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose();
          }
        }}
      >
        <svg 
          className="w-8 h-8" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Image container */}
      <div className="relative max-w-full max-h-full overflow-hidden">
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchStartCapture={handleTouchStartPinch}
          onTouchMoveCapture={handleTouchMovePinch}
          className={`max-w-full max-h-[85vh] object-contain transition-all duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
            touchAction: 'none'
          }}
          draggable={false}
        />
        
        {/* Caption */}
        {caption && !isLoading && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm max-w-full">
            <p className="text-center">{caption}</p>
          </div>
        )}
      </div>

      {/* Instructions hint for mobile */}
      {!isLoading && (
        <div className="absolute bottom-4 left-4 text-white text-xs opacity-60 md:hidden">
          <p>Double tap to zoom • Swipe down to close</p>
        </div>
      )}
    </div>
  );
}