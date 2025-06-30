import React from 'react';
import { useGame } from '../context/GameContext';

interface PlayerProps {
  cameraX?: number;
  cameraY?: number;
}

const Player: React.FC<PlayerProps> = ({ cameraX = 0, cameraY = 0 }) => {
  const { state } = useGame();
  const { player } = state;

  return (
    <div 
      className="relative z-50 transition-all duration-100"
      style={{
        width: '64px',
        height: '64px'
      }}
    >
      {/* Player Character - ALWAYS VISIBLE */}
      <div className="relative w-16 h-16">
        {/* Character Sprite with high contrast border */}
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl bg-black/20">
          <img 
            src={player.character.sprite}
            alt={player.character.name}
            className="w-full h-full object-cover brightness-110 contrast-125"
          />
        </div>

        {/* Glowing effect to make player more visible */}
        <div className="absolute inset-0 rounded-full border-2 border-yellow-300 animate-pulse opacity-60"></div>

        {/* Movement Effect */}
        {player.isMoving && (
          <div className="absolute inset-0 rounded-full border-2 border-white animate-ping"></div>
        )}

        {/* Health Bar - Always visible */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-20">
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-600 shadow-lg">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
              style={{ width: `${(player.character.health / player.character.maxHealth) * 100}%` }}
            ></div>
          </div>
          <div className="text-center text-white text-xs mt-1 font-bold drop-shadow-lg">
            {player.character.health}/{player.character.maxHealth}
          </div>
        </div>

        {/* Character Name */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap border-2 border-yellow-400 shadow-lg">
          <span className="font-bold">{player.character.name}</span>
        </div>

        {/* Level Badge */}
        <div className="absolute -top-3 -right-3 bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">
          {player.character.level}
        </div>

        {/* Direction Indicator */}
        <div className={`absolute w-3 h-3 bg-yellow-400 rounded-full transition-all duration-200 border border-white shadow-lg ${
          player.direction === 'up' ? 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-3' :
          player.direction === 'down' ? 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3' :
          player.direction === 'left' ? 'left-0 top-1/2 transform -translate-x-3 -translate-y-1/2' :
          'right-0 top-1/2 transform translate-x-3 -translate-y-1/2'
        }`}>
          <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
        </div>

        {/* Equipped Weapon Indicator */}
        <div className="absolute -top-6 -left-6 w-6 h-6 bg-gray-800 rounded-full border-2 border-yellow-400 flex items-center justify-center shadow-lg">
          <img 
            src="/shuriken.png" 
            alt="Weapon" 
            className="w-4 h-4 object-contain"
          />
        </div>

        {/* Visibility Enhancement Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-yellow-400/30 animate-pulse scale-125"></div>
      </div>
    </div>
  );
};

export default Player;