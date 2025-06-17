import React, { useState, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface TouchControlsProps {
  onDirectionPress: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onDirectionRelease: () => void;
  isVisible: boolean;
}

const TouchControls: React.FC<TouchControlsProps> = ({ 
  onDirectionPress, 
  onDirectionRelease, 
  isVisible 
}) => {
  const [activeDirection, setActiveDirection] = useState<string | null>(null);

  const handleDirectionStart = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setActiveDirection(direction);
    onDirectionPress(direction);
  }, [onDirectionPress]);

  const handleDirectionEnd = useCallback(() => {
    setActiveDirection(null);
    onDirectionRelease();
  }, [onDirectionRelease]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      {/* Movement Controls Container */}
      <div className="relative">
        {/* Background Circle */}
        <div className="w-32 h-32 bg-black/60 backdrop-blur-sm rounded-full border-2 border-white/20 shadow-2xl"></div>
        
        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white/30 rounded-full border border-white/50"></div>
        
        {/* Up Button */}
        <button
          className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 ${
            activeDirection === 'up' 
              ? 'bg-blue-500 shadow-lg shadow-blue-500/50 scale-110' 
              : 'bg-white/20 hover:bg-white/30'
          } border border-white/30`}
          onTouchStart={(e) => {
            e.preventDefault();
            handleDirectionStart('up');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleDirectionEnd();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleDirectionStart('up');
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleDirectionEnd();
          }}
          onMouseLeave={handleDirectionEnd}
        >
          <ChevronUp className="text-white" size={20} />
        </button>

        {/* Down Button */}
        <button
          className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 ${
            activeDirection === 'down' 
              ? 'bg-blue-500 shadow-lg shadow-blue-500/50 scale-110' 
              : 'bg-white/20 hover:bg-white/30'
          } border border-white/30`}
          onTouchStart={(e) => {
            e.preventDefault();
            handleDirectionStart('down');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleDirectionEnd();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleDirectionStart('down');
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleDirectionEnd();
          }}
          onMouseLeave={handleDirectionEnd}
        >
          <ChevronDown className="text-white" size={20} />
        </button>

        {/* Left Button */}
        <button
          className={`absolute top-1/2 left-2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 ${
            activeDirection === 'left' 
              ? 'bg-blue-500 shadow-lg shadow-blue-500/50 scale-110' 
              : 'bg-white/20 hover:bg-white/30'
          } border border-white/30`}
          onTouchStart={(e) => {
            e.preventDefault();
            handleDirectionStart('left');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleDirectionEnd();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleDirectionStart('left');
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleDirectionEnd();
          }}
          onMouseLeave={handleDirectionEnd}
        >
          <ChevronLeft className="text-white" size={20} />
        </button>

        {/* Right Button */}
        <button
          className={`absolute top-1/2 right-2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 ${
            activeDirection === 'right' 
              ? 'bg-blue-500 shadow-lg shadow-blue-500/50 scale-110' 
              : 'bg-white/20 hover:bg-white/30'
          } border border-white/30`}
          onTouchStart={(e) => {
            e.preventDefault();
            handleDirectionStart('right');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleDirectionEnd();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleDirectionStart('right');
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleDirectionEnd();
          }}
          onMouseLeave={handleDirectionEnd}
        >
          <ChevronRight className="text-white" size={20} />
        </button>
      </div>

      {/* Control Label */}
      <div className="mt-3 text-center">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
          <span className="text-white text-xs font-medium">Movement</span>
        </div>
      </div>
    </div>
  );
};

export default TouchControls;