import React from 'react';
import { useGame } from '../context/GameContext';
import { Enemy as EnemyType } from '../types/game';

interface EnemyProps {
  enemy: EnemyType;
  cameraX: number;
  cameraY: number;
}

const Enemy: React.FC<EnemyProps> = ({ enemy, cameraX, cameraY }) => {
  const { state, performAttack } = useGame();

  if (enemy.state === 'dead') {
    return null;
  }

  // Calculate screen position
  const screenX = enemy.position.x - cameraX;
  const screenY = enemy.position.y - cameraY;

  // Simple viewport check - only render if enemy is within camera view
  // No buffer zone to prevent flickering
  const isInViewport = 
    screenX >= -100 && 
    screenX <= window.innerWidth + 100 &&
    screenY >= -100 && 
    screenY <= window.innerHeight + 100;

  // Don't render if outside viewport - this prevents flickering
  if (!isInViewport) {
    return null;
  }

  const handleEnemyClick = () => {
    const distance = Math.sqrt(
      Math.pow(enemy.position.x - state.player.position.x, 2) +
      Math.pow(enemy.position.y - state.player.position.y, 2)
    );
    
    if (distance <= 60) { // Attack range
      performAttack('basic-punch', enemy.id);
    }
  };

  const getHealthBarColor = () => {
    const healthPercent = (enemy.health / enemy.maxHealth) * 100;
    if (healthPercent > 60) return 'from-green-600 to-green-400';
    if (healthPercent > 30) return 'from-yellow-600 to-yellow-400';
    return 'from-red-600 to-red-400';
  };

  // Check enemy type for special sizing
  const isMindlessZombie = enemy.name === 'Mindless Zombie';
  const isWildWolf = enemy.name === 'Wild Wolf' || enemy.name === 'Snow Wolf';
  const isLakeSerpent = enemy.name === 'Lake Serpent';
  const isIceBear = enemy.name === 'Ice Bear';
  
  // Enemy sizes - Ice Bear is 100% bigger as requested
  const enemySize = isMindlessZombie ? 67.5 : 
                   isWildWolf ? 30 : 
                   isLakeSerpent ? 24 : 
                   isIceBear ? 48 : 12; // Ice Bear is 100% bigger (24 * 2 = 48)

  return (
    <div 
      className="absolute z-15 cursor-pointer transition-all duration-200"
      style={{
        left: screenX - (enemySize * 2),
        top: screenY - (enemySize * 2)
      }}
      onClick={handleEnemyClick}
    >
      {/* Enemy Character */}
      <div className="relative" style={{ width: `${enemySize * 4}px`, height: `${enemySize * 4}px` }}>
        {/* Enemy Sprite */}
        <div className="w-full h-full rounded-full overflow-hidden shadow-lg hover:scale-110 transition-all duration-200">
          <img 
            src={enemy.sprite}
            alt={enemy.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Health Bar */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-600 shadow-sm">
            <div 
              className={`h-full bg-gradient-to-r ${getHealthBarColor()} transition-all duration-500`}
              style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
            ></div>
          </div>
          <div className="text-center text-white text-xs mt-1 font-bold drop-shadow-lg">
            {enemy.health}/{enemy.maxHealth}
          </div>
        </div>
        
        {/* Enemy Name */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-black/90 text-white px-2 py-1 rounded-lg text-xs whitespace-nowrap border border-gray-600 shadow-lg">
            <span className="font-bold">{enemy.name}</span>
          </div>
        </div>
        
        {/* Damage Type Indicator */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="bg-black/80 text-white px-1 py-0.5 rounded text-xs font-bold">
            {enemy.attack}⚔️
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enemy;