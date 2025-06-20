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
        left: player.position.x - cameraX - 32, // Increased from 24 to 32 for bigger character
        top: player.position.y - cameraY - 32, // Increased from 24 to 32 for bigger character
        transform: `scaleX(${player.direction === 'left' ? -1 : 1})`
      }}
    >
      {/* Player Character - Made bigger */}
      <div className="relative w-16 h-16"> {/* Increased from w-12 h-12 to w-16 h-16 */}
        {/* Character Sprite - Removed purple background */}
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
            <div className="w-10 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse"></div> {/* Scaled up for bigger character */}
          </div>
        )}
        
        {/* Health Bar */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20"> {/* Increased width from 16 to 20 */}
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
              style={{ width: `${(player.character.health / player.character.maxHealth) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Stamina Bar */}
        <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 w-20"> {/* Increased width from 16 to 20 */}
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
              style={{ width: `${(player.character.stamina / player.character.maxStamina) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Character Name */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          {player.character.name}
        </div>
        
        {/* Level Badge */}
        <div className="absolute -top-3 -right-3 bg-yellow-500 text-black rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold"> {/* Increased from w-6 h-6 to w-7 h-7 */}
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
      </div>
    </div>
  );
};

export default Player;