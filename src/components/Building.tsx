import React from 'react';
import { useGame } from '../context/GameContext';
import { Building as BuildingType } from '../types/game';

interface BuildingProps {
  building: BuildingType;
  cameraX: number;
  cameraY: number;
}

const Building: React.FC<BuildingProps> = ({ building, cameraX, cameraY }) => {
  const { state, enterBuilding } = useGame();

  const handleBuildingClick = () => {
    if (building.enterable) {
      const distance = Math.sqrt(
        Math.pow(building.position.x - state.player.position.x, 2) +
        Math.pow(building.position.y - state.player.position.y, 2)
      );
      
      if (distance <= 80) { // Interaction range
        enterBuilding(building.id);
      }
    }
  };

  const getBuildingColor = () => {
    // Trees get special styling
    if (building.sprite.includes('🌳') || building.sprite.includes('🌲')) {
      return 'bg-transparent border-transparent';
    }
    
    switch (building.type) {
      case 'house': return 'bg-amber-700 border-amber-800';
      case 'shop': return 'bg-blue-700 border-blue-800';
      case 'inn': return 'bg-green-700 border-green-800';
      case 'temple': return 'bg-purple-700 border-purple-800';
      case 'dungeon': return 'bg-gray-700 border-gray-800';
      default: return 'bg-gray-600 border-gray-700';
    }
  };

  const isPlayerNear = () => {
    const distance = Math.sqrt(
      Math.pow(building.position.x - state.player.position.x, 2) +
      Math.pow(building.position.y - state.player.position.y, 2)
    );
    return distance <= 80;
  };

  const isTree = building.sprite.includes('🌳') || building.sprite.includes('🌲');
  
  // Check if player is behind the tree (for hiding effect)
  const isPlayerBehindTree = isTree && state.player.position.y > building.position.y + building.size.height / 2;

  return (
    <div 
      className={`absolute border-2 rounded-lg shadow-lg transition-all duration-200 ${getBuildingColor()} ${
        building.enterable ? 'cursor-pointer hover:scale-105' : ''
      } ${isPlayerNear() && building.enterable ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''} ${
        isTree ? 'z-20' : 'z-10'
      }`}
      style={{
        left: building.position.x - cameraX,
        top: building.position.y - cameraY,
        width: building.size.width,
        height: building.size.height
      }}
      onClick={handleBuildingClick}
    >
      {/* Building Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`${isTree ? 'text-8xl' : 'text-6xl'} opacity-80`}>{building.sprite}</div>
      </div>
      
      {/* Building Name - only for non-trees */}
      {!isTree && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
          {building.name}
        </div>
      )}
      
      {/* Entrance Indicator - only for enterable buildings */}
      {building.enterable && !isTree && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-2 bg-yellow-400 rounded-full opacity-60"></div>
        </div>
      )}
      
      {/* Interaction Prompt - only for enterable buildings */}
      {isPlayerNear() && building.enterable && !isTree && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold animate-bounce">
          Press E to Enter
        </div>
      )}
      
      {/* Building Type Badge - only for non-trees */}
      {!isTree && (
        <div className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
          {building.type === 'house' ? '🏠' :
           building.type === 'shop' ? '🏪' :
           building.type === 'inn' ? '🏨' :
           building.type === 'temple' ? '⛪' :
           building.type === 'dungeon' ? '🏰' : '🏢'}
        </div>
      )}
      
      {/* Player hiding effect for trees */}
      {isPlayerBehindTree && (
        <div className="absolute inset-0 bg-black/20 rounded-lg pointer-events-none">
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black/50 px-2 py-1 rounded">
            Hidden
          </div>
        </div>
      )}
    </div>
  );
};

export default Building;