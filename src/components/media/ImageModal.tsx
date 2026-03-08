'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  caption?: string;
}

interface Position {
  x: number;
  y: number;
}

interface TouchData {
  distance: number;
  center: Position;
  scale: number;
  position: Position;
}

export default function ImageModal({ isOpen, onClose, src, alt, caption }: ImageModalProps) {
  // Core state
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  
  // Interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [positionStart, setPositionStart] = useState<Position>({ x: 0, y: 0 });
  
  // Touch state
  const [touchData, setTouchData] = useState<TouchData | null>(null);
  const [lastTap, setLastTap] = useState(0);
  
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Constants
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 5;
  const DOUBLE_TAP_DELAY = 300;
  const ZOOM_STEP = 0.3;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsLoading(true);
      setIsDragging(false);
      setTouchData(null);
    }
  }, [isOpen]);

  // Keyboard and body scroll handling
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

  // Utility functions
  const getDistance = (touch1: React.Touch, touch2: React.Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getCenter = (touch1: React.Touch, touch2: React.Touch): Position => ({
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  });

  const constrainScale = (newScale: number): number => {
    return Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
  };

  const zoomToPoint = useCallback((newScale: number, point: Position) => {
    if (!imageRef.current) return;
    
    const constrainedScale = constrainScale(newScale);
    const scaleDiff = constrainedScale - scale;
    
    if (Math.abs(scaleDiff) < 0.01) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const imageCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    
    const deltaX = (point.x - imageCenter.x) * (scaleDiff / scale);
    const deltaY = (point.y - imageCenter.y) * (scaleDiff / scale);
    
    setScale(constrainedScale);
    setPosition(prev => ({
      x: prev.x - deltaX,
      y: prev.y - deltaY,
    }));
  }, [scale]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Event handlers
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && scale === 1) {
      onClose();
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPositionStart(position);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setPosition({
      x: positionStart.x + deltaX,
      y: positionStart.y + deltaY,
    });
  }, [isDragging, dragStart, positionStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    const newScale = scale + delta;
    const point = { x: e.clientX, y: e.clientY };
    
    zoomToPoint(newScale, point);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const point = { x: e.clientX, y: e.clientY };
    const newScale = scale > 1 ? 1 : 2;
    
    if (newScale === 1) {
      resetZoom();
    } else {
      zoomToPoint(newScale, point);
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const now = Date.now();
      
      // Handle double tap
      if (now - lastTap < DOUBLE_TAP_DELAY) {
        const point = { x: touch.clientX, y: touch.clientY };
        const newScale = scale > 1 ? 1 : 2;
        
        if (newScale === 1) {
          resetZoom();
        } else {
          zoomToPoint(newScale, point);
        }
        setLastTap(0);
      } else {
        setLastTap(now);
        setIsDragging(true);
        setDragStart({ x: touch.clientX, y: touch.clientY });
        setPositionStart(position);
      }
    } else if (e.touches.length === 2) {
      // Pinch zoom start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      setTouchData({
        distance: getDistance(touch1, touch2),
        center: getCenter(touch1, touch2),
        scale: scale,
        position: position,
      });
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isDragging) {
      // Single touch drag
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;
      
      setPosition({
        x: positionStart.x + deltaX,
        y: positionStart.y + deltaY,
      });
    } else if (e.touches.length === 2 && touchData) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const currentDistance = getDistance(touch1, touch2);
      const currentCenter = getCenter(touch1, touch2);
      
      const scaleChange = currentDistance / touchData.distance;
      const newScale = constrainScale(touchData.scale * scaleChange);
      
      const centerDeltaX = currentCenter.x - touchData.center.x;
      const centerDeltaY = currentCenter.y - touchData.center.y;
      
      setScale(newScale);
      setPosition({
        x: touchData.position.x + centerDeltaX,
        y: touchData.position.y + centerDeltaY,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      setTouchData(null);
    } else if (e.touches.length === 1) {
      setTouchData(null);
    }
  };

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 bg-black bg-opacity-95 overflow-hidden"
      onClick={handleBackgroundClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white shadow-lg rounded-full p-2 border border-gray-200 hover:bg-gray-50 hover:scale-110 hover:shadow-xl transition-all duration-200 transform"
        aria-label="Close modal"
      >
        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Image */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
        style={{
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          transformOrigin: 'center center',
          touchAction: 'none',
        }}
        draggable={false}
      />
      
      {/* Caption */}
      {caption && !isLoading && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm max-w-[90%] backdrop-blur-sm">
          <p className="text-center">{caption}</p>
        </div>
      )}
    </div>
  );
}
