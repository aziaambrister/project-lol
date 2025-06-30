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

  // FIXED: Larger enemy size for better visibility and hitboxes
  const enemySize = enemy.name === 'Mindless Zombie' ? 100 : // Increased from 80
                   enemy.name === 'Wild Wolf' || enemy.name === 'Snow Wolf' ? 50 : // Increased from 40
                   enemy.name === 'Lake Serpent' ? 45 : // Increased from 35
                   enemy.name === 'Ice Bear' ? 80 : 30; // Increased from 60 and 20

  const enemyWidth = enemySize * 4;
  const enemyHeight = enemySize * 4;

  // FIXED: More generous viewport bounds to ensure enemies are visible
  const isInViewport = 
    screenX >= -enemyWidth && 
    screenX <= window.innerWidth + enemyWidth &&
    screenY >= -enemyHeight && 
    screenY <= window.innerHeight + enemyHeight;

  // Always render enemies that are near the viewport
  if (!isInViewport) {
    return null;
  }

  const handleEnemyClick = () => {
    const distance = Math.sqrt(
      Math.pow(enemy.position.x - state.player.position.x, 2) +
      Math.pow(enemy.position.y - state.player.position.y, 2)
    );
    
    // FIXED: Increased attack range to match bigger hitboxes
    if (distance <= 100) { // Increased from 80
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
      {/* FIXED: Enhanced enemy container with better visibility */}
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
        
        {/* FIXED: Enemy Sprite with multiple fallback layers */}
        <div className="w-full h-full rounded-full overflow-hidden shadow-lg hover:scale-110 transition-all duration-200 border-4 border-red-500/70 hover:border-red-400 relative">
          {/* Layer 1: Solid color fallback */}
          <div className="absolute inset-0 bg-red-800 rounded-full"></div>
          
          {/* Layer 2: Gradient fallback */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-700 to-red-900 rounded-full"></div>
          
          {/* Layer 3: Actual enemy image */}
          <img 
            src={enemy.sprite}
            alt={enemy.name}
            className="absolute inset-0 w-full h-full object-cover brightness-110 contrast-125 z-10"
            onError={(e) => {
              console.error(`Failed to load enemy sprite: ${enemy.sprite}`);
              // Hide the broken image and show fallback
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            onLoad={() => {
              console.log(`✅ Successfully loaded enemy sprite: ${enemy.sprite}`);
            }}
          />
          
          {/* Layer 4: Enemy type indicator as fallback */}
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl z-5">
            {enemy.name.includes('Zombie') ? '🧟' :
             enemy.name.includes('Wolf') ? '🐺' :
             enemy.name.includes('Bear') ? '🐻' :
             enemy.name.includes('Serpent') ? '🐍' :
             enemy.name.includes('Goblin') ? '👹' : '👾'}
          </div>
        </div>
        
        {/* Enhanced glow effect for better visibility */}
        <div className="absolute inset-0 rounded-full border-4 border-red-400/50 animate-pulse scale-110"></div>
        
        {/* Health Bar - Bigger and more visible */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-28"> {/* Increased from w-24 */}
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-600 shadow-lg"> {/* Increased height */}
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
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"> {/* Moved further down */}
          <div className="bg-black/90 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap border-2 border-red-600 shadow-lg"> {/* Increased padding and text */}
            <span className="font-bold">{enemy.name}</span>
          </div>
        </div>
        
        {/* Attack Power Indicator - More visible */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
          <div className="bg-red-600/90 text-white px-3 py-1 rounded-lg text-sm font-bold border border-red-400"> {/* Increased size */}
            ⚔️ {enemy.attack}
          </div>
        </div>

        {/* Targeting reticle when hovering */}
        <div className="absolute inset-0 rounded-full border-4 border-yellow-400/0 hover:border-yellow-400/80 transition-all duration-200 pointer-events-none scale-125"></div>
        
        {/* AI State Indicator for debugging */}
        <div className="absolute -top-8 -right-8 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">
          {enemy.state === 'patrol' ? '👁️' :
           enemy.state === 'chase' ? '🏃' :
           enemy.state === 'attack' ? '⚔️' : '😴'}
        </div>
      </div>
    </div>
  );
};

export default Enemy;