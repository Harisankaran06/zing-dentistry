'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title = 'Smile Transformation',
  category = 'Cosmetic Dentistry',
  description = 'Painless procedure with natural aesthetics.',
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback(
    (clientX) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-pink-100/80 transition-all hover:shadow-xl group">
      {/* Slider Visual Container */}
      <div
        ref={containerRef}
        className="relative h-64 sm:h-80 w-full overflow-hidden select-none cursor-ew-resize touch-none"
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
      >
        {/* AFTER IMAGE (Bottom layer, full width) */}
        <img
          src={afterImage}
          alt="After treatment"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-3 right-3 bg-[#3D1F5C]/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm z-10">
          AFTER
        </div>

        {/* BEFORE IMAGE (Top layer, clipped by width) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Before treatment"
            className="absolute top-0 left-0 max-w-none h-full object-cover"
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
          />
          <div className="absolute bottom-3 left-3 bg-[#F0507B]/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm z-10">
            BEFORE
          </div>
        </div>

        {/* DRAG HANDLE BAR */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-[#3D1F5C] shadow-lg flex items-center justify-center border-2 border-[#F0507B] text-xs transition-transform active:scale-110">
            <MoveHorizontal className="w-4 h-4 text-[#F0507B]" />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="p-5 bg-gradient-to-b from-white to-[#FBF7F5]">
        {category && (
          <span className="inline-block bg-[#F0507B]/10 text-[#F0507B] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2 border border-[#F0507B]/20">
            {category}
          </span>
        )}
        <h3 className="text-lg font-serif font-bold text-[#3D1F5C] mb-1">{title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
