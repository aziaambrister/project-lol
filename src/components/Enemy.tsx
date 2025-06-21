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

  const handleEnemyClick = () => {
    const distance = Math.sqrt(
      Math.pow(enemy.position.x - state.player.position.x, 2) +
      Math.pow(enemy.position.y - state.player.position.y, 2)
    );
    
    if (distance <= 60) { // Attack range
      performAttack('basic-punch', enemy.id);
    }
  };

  const getStateColor = () => {
    switch (enemy.state) {
      case 'chase': return 'border-red-500 shadow-red-500/50';
      case 'attack': return 'border-orange-500 shadow-orange-500/50';
      case 'patrol': return 'border-yellow-500 shadow-yellow-500/30';
      default: return 'border-gray-500';
    }
  };

  const getDifficultyColor = () => {
    switch (enemy.aiDifficulty) {
      case 'easy': return 'bg-green-600 text-white';
      case 'medium': return 'bg-yellow-600 text-black';
      case 'hard': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getTypeIcon = () => {
    switch (enemy.type) {
      case 'aggressive': return '⚔️';
      case 'defensive': return '🛡️';
      case 'patrol': return '👁️';
      default: return '❓';
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
  const isWildWolf = enemy.name === 'Wild Wolf';
  
  // Zombie: 50% bigger than before (30 * 1.5 = 45)
  // Wolf: Large size to match the image
  const enemySize = isMindlessZombie ? 45 : isWildWolf ? 20 : 12;

  return (
    <div 
      className="absolute z-15 cursor-pointer transition-all duration-200"
      style={{
        left: enemy.position.x - cameraX - (enemySize * 2),
        top: enemy.position.y - cameraY - (enemySize * 2)
      }}
      onClick={handleEnemyClick}
    >
      {/* Enemy Character */}
      <div className="relative" style={{ width: `${enemySize * 4}px`, height: `${enemySize * 4}px` }}>
        {/* Enemy Sprite */}
        <div className={`w-full h-full rounded-full overflow-hidden shadow-lg hover:scale-110 transition-all duration-200 ${
          isMindlessZombie ? '' : `border-2 ${getStateColor()}`
        }`}>
          <img 
            src={enemy.sprite}
            alt={enemy.name}
            className="w-full h-full object-cover"
          />
          
          {/* Combat State Overlay - only for non-zombies */}
          {!isMindlessZombie && enemy.state === 'chase' && (
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
          )}
          {!isMindlessZombie && enemy.state === 'attack' && (
            <div className="absolute inset-0 bg-orange-500/30 rounded-full animate-ping"></div>
          )}
        </div>
        
        {/* Detection Radius (visible when chasing) - only for non-zombies */}
        {!isMindlessZombie && enemy.state === 'chase' && (
          <div 
            className="absolute border border-red-500/20 rounded-full pointer-events-none animate-pulse"
            style={{
              width: enemy.detectionRadius * 2,
              height: enemy.detectionRadius * 2,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          ></div>
        )}
        
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
        
        {/* Enemy Name and Type */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-black/90 text-white px-2 py-1 rounded-lg text-xs whitespace-nowrap border border-gray-600 shadow-lg">
            <div className="flex items-center justify-center">
              <span className="mr-1">{getTypeIcon()}</span>
              <span className="font-bold">{enemy.name}</span>
            </div>
          </div>
        </div>
        
        {/* Difficulty Badge - only for non-zombies */}
        {!isMindlessZombie && (
          <div className={`absolute -top-3 -right-3 ${getDifficultyColor()} rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg border border-white/20`}>
            {enemy.aiDifficulty === 'easy' ? 'E' : enemy.aiDifficulty === 'medium' ? 'M' : 'H'}
          </div>
        )}
        
        {/* State Indicator - only for non-zombies */}
        {!isMindlessZombie && (
          <div className={`absolute -top-3 -left-3 w-4 h-4 rounded-full border-2 border-white shadow-lg ${
            enemy.state === 'chase' ? 'bg-red-500 animate-pulse' :
            enemy.state === 'attack' ? 'bg-orange-500 animate-ping' :
            enemy.state === 'patrol' ? 'bg-yellow-500' :
            'bg-gray-500'
          }`}></div>
        )}
        
        {/* Attack Range Indicator - only for non-zombies */}
        {!isMindlessZombie && enemy.state === 'chase' && (
          <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-pulse opacity-60"></div>
        )}
        
        {/* Movement Trail Effect - only for non-zombies */}
        {!isMindlessZombie && enemy.state === 'chase' && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3">
            <div className="w-6 h-3 bg-red-400/40 rounded-full animate-pulse blur-sm"></div>
          </div>
        )}
        
        {/* Damage Type Indicator */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="bg-black/80 text-white px-1 py-0.5 rounded text-xs font-bold">
            {enemy.attack}⚔️
          </div>
        </div>
        
        {/* Combat Status Effects - only for non-zombies */}
        {!isMindlessZombie && enemy.state === 'chase' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute bottom-1 left-1 w-2 h-2 bg-orange-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enemy;