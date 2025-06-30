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

  // FIXED: Increased enemy size for bigger hitboxes
  const enemySize = enemy.name === 'Mindless Zombie' ? 80 : // Increased from 67.5
                   enemy.name === 'Wild Wolf' || enemy.name === 'Snow Wolf' ? 40 : // Increased from 30
                   enemy.name === 'Lake Serpent' ? 35 : // Increased from 24
                   enemy.name === 'Ice Bear' ? 60 : 20; // Increased from 48 and 12

  const enemyWidth = enemySize * 4;
  const enemyHeight = enemySize * 4;

  // Check if enemy is FULLY within viewport bounds
  const isFullyInViewport = 
    screenX >= 0 && 
    screenX + enemyWidth <= window.innerWidth &&
    screenY >= 0 && 
    screenY + enemyHeight <= window.innerHeight;

  // Don't render if not fully in viewport
  if (!isFullyInViewport) {
    return null;
  }

  const handleEnemyClick = () => {
    const distance = Math.sqrt(
      Math.pow(enemy.position.x - state.player.position.x, 2) +
      Math.pow(enemy.position.y - state.player.position.y, 2)
    );
    
    // FIXED: Increased attack range to match bigger hitboxes
    if (distance <= 80) { // Increased from 60
      performAttack('basic-punch', enemy.id);
    }
  };

  const getHealthBarColor = () => {
    const healthPercent = (enemy.health / enemy.maxHealth) * 100;
    if (healthPercent > 60) return 'from-green-600 to-green-400';
    if (healthPercent > 30) return 'from-yellow-600 to-yellow-400';
    return 'from-red-600 to-red-400';
  };

  return (
    <div 
      className="absolute z-15 cursor-pointer transition-all duration-200 hover:scale-110"
      style={{
        left: screenX - (enemySize * 2),
        top: screenY - (enemySize * 2)
      }}
      onClick={handleEnemyClick}
    >
      {/* FIXED: Bigger enemy hitbox with enhanced visual feedback */}
      <div className="relative" style={{ width: `${enemySize * 4}px`, height: `${enemySize * 4}px` }}>
        {/* Invisible larger hitbox for easier clicking */}
        <div 
          className="absolute inset-0 cursor-pointer"
          style={{
            width: `${enemySize * 5}px`, // 25% larger hitbox
            height: `${enemySize * 5}px`,
            left: `-${enemySize * 0.5}px`,
            top: `-${enemySize * 0.5}px`,
            zIndex: 1
          }}
          onClick={handleEnemyClick}
        />
        
        {/* Enemy Sprite */}
        <div className="w-full h-full rounded-full overflow-hidden shadow-lg hover:scale-110 transition-all duration-200 border-2 border-red-500/50 hover:border-red-400">
          <img 
            src={enemy.sprite}
            alt={enemy.name}
            className="w-full h-full object-cover brightness-110 contrast-125"
          />
        </div>
        
        {/* Enhanced glow effect for better visibility */}
        <div className="absolute inset-0 rounded-full border-2 border-red-400/30 animate-pulse"></div>
        
        {/* Health Bar - Bigger and more visible */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24"> {/* Increased from w-20 */}
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-600 shadow-lg"> {/* Increased height */}
            <div 
              className={`h-full bg-gradient-to-r ${getHealthBarColor()} transition-all duration-500`}
              style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
            ></div>
          </div>
          <div className="text-center text-white text-sm mt-1 font-bold drop-shadow-lg"> {/* Increased text size */}
            {enemy.health}/{enemy.maxHealth}
          </div>
        </div>
        
        {/* Enemy Name - More prominent */}
        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 text-center"> {/* Moved further down */}
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap border-2 border-red-600 shadow-lg"> {/* Increased padding and text */}
            <span className="font-bold">{enemy.name}</span>
          </div>
        </div>
        
        {/* Attack Power Indicator - More visible */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3">
          <div className="bg-red-600/90 text-white px-2 py-1 rounded-lg text-sm font-bold border border-red-400"> {/* Increased size */}
            {enemy.attack}⚔️
          </div>
        </div>

        {/* Targeting reticle when hovering */}
        <div className="absolute inset-0 rounded-full border-4 border-yellow-400/0 hover:border-yellow-400/60 transition-all duration-200 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Enemy;