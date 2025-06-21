import React from 'react';
import { useGame } from '../context/GameContext';

interface PlayerProps {
  cameraX: number;
  cameraY: number;
}

const Player: React.FC<PlayerProps> = ({ cameraX, cameraY }) => {
  const { state } = useGame();
  const { player } = state;

  return (
    <div 
      className="absolute z-20 transition-all duration-100"
      style={{
        left: player.position.x - cameraX - 32,
        top: player.position.y - cameraY - 32,
        transform: `scaleX(${player.direction === 'left' ? -1 : 1})`
      }}
    >
      {/* Player Character */}
      <div className="relative w-16 h-16">
        {/* Character Sprite */}
        <div className="w-full h-full rounded-full overflow-hidden border-3 border-yellow-400 shadow-lg">
          <img 
            src={player.character.sprite}
            alt={player.character.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Movement Effect */}
        {player.isMoving && (
          <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-ping"></div>
        )}
        
        {/* Swimming Effect */}
        {player.isSwimming && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-10 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
          </div>
        )}
        
        {/* Health Bar */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
              style={{ width: `${(player.character.health / player.character.maxHealth) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Character Name */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          {player.character.name}
        </div>
        
        {/* Level Badge */}
        <div className="absolute -top-3 -right-3 bg-yellow-500 text-black rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
          {player.character.level}
        </div>
        
        {/* Direction Indicator */}
        <div className={`absolute w-2 h-2 bg-yellow-400 rounded-full transition-all duration-200 ${
          player.direction === 'up' ? 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-2' :
          player.direction === 'down' ? 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2' :
          player.direction === 'left' ? 'left-0 top-1/2 transform -translate-x-2 -translate-y-1/2' :
          'right-0 top-1/2 transform translate-x-2 -translate-y-1/2'
        }`}>
          <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
        </div>
        
        {/* Equipped Shuriken Indicator */}
        <div className="absolute -top-6 -left-6 w-6 h-6 bg-gray-800 rounded-full border-2 border-yellow-400 flex items-center justify-center">
          <img 
            src="/shuriken.png" 
            alt="Shuriken" 
            className="w-4 h-4 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;