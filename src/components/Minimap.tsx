import React from 'react';
import { useGame } from '../context/GameContext';

const Minimap: React.FC = () => {
  const { state } = useGame();
  const { player, currentWorld } = state;

  const mapScale = 0.1; // Scale factor for the minimap
  const mapSize = 200; // Size of the minimap in pixels

  return (
    <div className="absolute top-20 right-4 z-30">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-white/20">
        <h3 className="text-white text-sm font-bold mb-2 text-center">Map</h3>
        <div 
          className="relative bg-green-800 rounded border border-green-600 overflow-hidden"
          style={{ width: mapSize, height: mapSize }}
        >
          {/* Map Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/map copy copy.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          
          {/* World Boundaries */}
          <div className="absolute inset-1 border border-green-400 rounded"></div>
          
          {/* Buildings */}
          {currentWorld.buildings.map(building => (
            <div
              key={building.id}
              className="absolute bg-amber-600 rounded"
              style={{
                left: (building.position.x * mapScale),
                top: (building.position.y * mapScale),
                width: Math.max(2, building.size.width * mapScale),
                height: Math.max(2, building.size.height * mapScale)
              }}
            ></div>
          ))}
          
          {/* Enemies */}
          {currentWorld.enemies.filter(e => e.state !== 'dead').map(enemy => (
            <div
              key={enemy.id}
              className={`absolute w-2 h-2 rounded-full ${
                enemy.state === 'chase' ? 'bg-red-500 animate-pulse' : 'bg-red-400'
              }`}
              style={{
                left: (enemy.position.x * mapScale) - 1,
                top: (enemy.position.y * mapScale) - 1
              }}
            ></div>
          ))}
          
          {/* NPCs */}
          {currentWorld.npcs.map(npc => (
            <div
              key={npc.id}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              style={{
                left: (npc.position.x * mapScale) - 1,
                top: (npc.position.y * mapScale) - 1
              }}
            ></div>
          ))}
          
          {/* Player */}
          <div
            className="absolute w-3 h-3 bg-yellow-400 rounded-full border border-white animate-pulse"
            style={{
              left: (player.position.x * mapScale) - 1.5,
              top: (player.position.y * mapScale) - 1.5
            }}
          ></div>
          
          {/* Player Direction Indicator */}
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: (player.position.x * mapScale) - 0.5 + (
                player.direction === 'left' ? -3 :
                player.direction === 'right' ? 3 : 0
              ),
              top: (player.position.y * mapScale) - 0.5 + (
                player.direction === 'up' ? -3 :
                player.direction === 'down' ? 3 : 0
              )
            }}
          ></div>
        </div>
        
        {/* Legend */}
        <div className="mt-2 text-xs text-gray-300 space-y-1">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
            <span>You</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
            <span>Enemies</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-amber-600 rounded mr-2"></div>
            <span>Buildings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minimap;