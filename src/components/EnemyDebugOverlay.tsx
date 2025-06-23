import React from 'react';
import { Enemy } from '../types/game';
import { EnemyAISystem } from '../systems/EnemyAI';

interface EnemyDebugOverlayProps {
  enemies: Enemy[];
  aiSystem: EnemyAISystem;
  playerPosition: { x: number; y: number };
  cameraX: number;
  cameraY: number;
  debugEnabled: boolean;
}

const EnemyDebugOverlay: React.FC<EnemyDebugOverlayProps> = ({
  enemies,
  aiSystem,
  playerPosition,
  cameraX,
  cameraY,
  debugEnabled
}) => {
  if (!debugEnabled) return null;

  const getStateColor = (state: string) => {
    switch (state) {
      case 'idle': return 'bg-gray-500';
      case 'pursuit': return 'bg-yellow-500';
      case 'attack': return 'bg-red-500';
      case 'retreat': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      {enemies.map(enemy => {
        if (enemy.state === 'dead') return null;
        
        const aiState = aiSystem.getEnemyState(enemy.id);
        const attackCycle = aiSystem.getAttackCycle(enemy.id);
        
        if (!aiState || !attackCycle) return null;

        const screenX = enemy.position.x - cameraX;
        const screenY = enemy.position.y - cameraY;

        // Only show debug info for enemies on screen
        if (screenX < -100 || screenX > window.innerWidth + 100 || 
            screenY < -100 || screenY > window.innerHeight + 100) {
          return null;
        }

        const distanceToPlayer = Math.sqrt(
          Math.pow(enemy.position.x - playerPosition.x, 2) +
          Math.pow(enemy.position.y - playerPosition.y, 2)
        );

        return (
          <div key={enemy.id}>
            {/* State Indicator */}
            <div
              className={`absolute w-4 h-4 rounded-full ${getStateColor(aiState.current)} border-2 border-white`}
              style={{
                left: screenX - 8,
                top: screenY - 40,
                zIndex: 100
              }}
              title={`State: ${aiState.current}`}
            />

            {/* Detection Range */}
            <div
              className="absolute border border-yellow-400 rounded-full opacity-30 pointer-events-none"
              style={{
                left: screenX - enemy.detectionRadius,
                top: screenY - enemy.detectionRadius,
                width: enemy.detectionRadius * 2,
                height: enemy.detectionRadius * 2,
                zIndex: 5
              }}
            />

            {/* Attack Range */}
            <div
              className="absolute border border-red-400 rounded-full opacity-50 pointer-events-none"
              style={{
                left: screenX - attackCycle.attackRange,
                top: screenY - attackCycle.attackRange,
                width: attackCycle.attackRange * 2,
                height: attackCycle.attackRange * 2,
                zIndex: 5
              }}
            />

            {/* Debug Info Panel */}
            <div
              className="absolute bg-black/80 text-white text-xs p-2 rounded pointer-events-none"
              style={{
                left: screenX + 30,
                top: screenY - 60,
                zIndex: 100,
                minWidth: '120px'
              }}
            >
              <div>ID: {enemy.id.slice(-4)}</div>
              <div>State: {aiState.current}</div>
              <div>HP: {enemy.health}/{enemy.maxHealth}</div>
              <div>Dist: {distanceToPlayer.toFixed(0)}</div>
              <div>Attack CD: {Math.max(0, attackCycle.cooldownDuration - (Date.now() - attackCycle.lastAttackTime)).toString().slice(0, 4)}ms</div>
              {attackCycle.isAttacking && <div className="text-red-400">ATTACKING!</div>}
            </div>

            {/* Line to Player */}
            {aiState.current === 'pursuit' || aiState.current === 'attack' ? (
              <svg
                className="absolute pointer-events-none"
                style={{
                  left: 0,
                  top: 0,
                  width: '100vw',
                  height: '100vh',
                  zIndex: 1
                }}
              >
                <line
                  x1={screenX}
                  y1={screenY}
                  x2={playerPosition.x - cameraX}
                  y2={playerPosition.y - cameraY}
                  stroke="rgba(255, 0, 0, 0.5)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            ) : null}
          </div>
        );
      })}

      {/* Performance Metrics */}
      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg text-sm z-50">
        <h3 className="font-bold mb-2">🤖 AI Debug Panel</h3>
        <div>Active Enemies: {enemies.filter(e => e.state !== 'dead').length}</div>
        <div>Update Time: {aiSystem.getPerformanceMetrics().updateTime.toFixed(2)}ms</div>
        <div>Collision Checks: {aiSystem.getPerformanceMetrics().collisionChecks}</div>
        
        <div className="mt-3">
          <div className="text-xs font-bold mb-1">State Legend:</div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>Idle
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>Pursuit
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>Attack
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>Retreat
          </div>
        </div>
      </div>
    </>
  );
};

export default EnemyDebugOverlay;