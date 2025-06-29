import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Clock, Shield, Zap, Target, Heart, Coins, Trophy, Users } from 'lucide-react';
import Player from './Player';
import Enemy from './Enemy';

const SurvivalMode: React.FC = () => {
  const { state, movePlayer, stopMoving, performAttack, collectSurvivalDrop, usePowerUp } = useGame();
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [gameStarted, setGameStarted] = useState(false);
  const keysPressedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    keysPressedRef.current = keysPressed;
  }, [keysPressed]);

  // Handle keyboard input - ONLY when game has started
  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (['w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        setKeysPressed(prev => new Set(prev).add(key));
      }
      
      if (key === ' ') {
        e.preventDefault();
        const nearestEnemy = findNearestEnemy();
        if (nearestEnemy) {
          performAttack('basic-punch', nearestEnemy.id);
        }
      }
      
      if (key === '2') {
        e.preventDefault();
        const nearestEnemy = findNearestEnemy();
        if (nearestEnemy) {
          performAttack('shuriken-throw', nearestEnemy.id);
        }
      }
      
      if (['1', '3', '4', '5'].includes(key)) {
        e.preventDefault();
        const powerUpIndex = parseInt(key) - 1;
        usePowerUp(powerUpIndex);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        setKeysPressed(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [performAttack, usePowerUp, gameStarted]);

  // Movement loop - ONLY when game has started
  useEffect(() => {
    if (!gameStarted) return;

    let animationFrameId: number;

    const moveLoop = () => {
      if (keysPressedRef.current.size === 0) {
        if (state.player.isMoving) {
          stopMoving();
        }
      } else {
        keysPressedRef.current.forEach(key => {
          switch (key) {
            case 'w':
              movePlayer('up');
              break;
            case 'a':
              movePlayer('left');
              break;
            case 's':
              movePlayer('down');
              break;
            case 'd':
              movePlayer('right');
              break;
          }
        });
      }

      animationFrameId = requestAnimationFrame(moveLoop);
    };

    animationFrameId = requestAnimationFrame(moveLoop);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [movePlayer, stopMoving, gameStarted, state.player.isMoving]);

  const findNearestEnemy = () => {
    if (!gameStarted) return null;

    const playerPos = state.player.position;
    let nearestEnemy = null;
    let minDistance = Infinity;

    state.currentWorld.enemies.forEach(enemy => {
      if (enemy.state === 'dead') return;

      const distance = Math.sqrt(
        Math.pow(enemy.position.x - playerPos.x, 2) +
        Math.pow(enemy.position.y - playerPos.y, 2)
      );

      if (distance < 150 && distance < minDistance) {
        minDistance = distance;
        nearestEnemy = enemy;
      }
    });

    return nearestEnemy;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const cameraX = state.camera.x - window.innerWidth / 2;
  const cameraY = state.camera.y - window.innerHeight / 2;

  // FIXED: Count alive enemies properly
  const aliveEnemies = state.currentWorld.enemies.filter(e => e.state !== 'dead').length;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* FIXED: The Forgotten Courtyard Background - Using correct image path */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(/The forgotten courtyard.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated'
        }}
      ></div>
      
      {/* Fallback background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black opacity-20"></div>

      {/* Arena Boundary */}
      <div 
        className="absolute border-4 border-red-500/70 rounded-full pointer-events-none"
        style={{
          width: `${state.survival.arena.radius * 2}px`,
          height: `${state.survival.arena.radius * 2}px`,
          left: `${state.survival.arena.center.x - state.survival.arena.radius - cameraX}px`,
          top: `${state.survival.arena.center.y - state.survival.arena.radius - cameraY}px`,
          boxShadow: `inset 0 0 50px rgba(239, 68, 68, 0.5), 0 0 50px rgba(239, 68, 68, 0.3)`
        }}
      ></div>

      {/* Enemies - ONLY render when game started */}
      {gameStarted && state.currentWorld.enemies.map(enemy => (
        <Enemy key={enemy.id} enemy={enemy} cameraX={cameraX} cameraY={cameraY} />
      ))}

      {/* Survival Drops */}
      {gameStarted && state.survival.drops.map(drop => {
        if (drop.collected) return null;
        
        const screenX = drop.position.x - cameraX;
        const screenY = drop.position.y - cameraY;
        
        if (screenX < -50 || screenX > window.innerWidth + 50 || 
            screenY < -50 || screenY > window.innerHeight + 50) {
          return null;
        }
        
        const getDropColor = () => {
          switch (drop.type) {
            case 'currency': return 'from-yellow-400 to-yellow-600';
            case 'health': return 'from-red-400 to-red-600';
            case 'power-up': return 'from-purple-400 to-purple-600';
            case 'special-attack': return 'from-blue-400 to-blue-600';
            default: return 'from-gray-400 to-gray-600';
          }
        };
        
        return (
          <div
            key={drop.id}
            className="absolute z-25 cursor-pointer"
            style={{
              left: screenX - 12,
              top: screenY - 12
            }}
            onClick={() => collectSurvivalDrop(drop.id)}
          >
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getDropColor()} animate-bounce shadow-lg border-2 border-white/50 flex items-center justify-center text-white text-xs font-bold`}>
              {drop.icon}
            </div>
          </div>
        );
      })}

      {/* Player */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Player cameraX={0} cameraY={0} />
      </div>

      {/* Damage Numbers */}
      {gameStarted && state.combat.damageNumbers.map(damageNumber => (
        <div
          key={damageNumber.id}
          className={`absolute font-bold text-2xl pointer-events-none animate-bounce ${
            damageNumber.type === 'damage' ? 'text-red-500' :
            damageNumber.type === 'heal' ? 'text-green-500' :
            'text-yellow-500'
          }`}
          style={{
            left: damageNumber.position.x - cameraX,
            top: damageNumber.position.y - cameraY,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            animation: 'float-up 2s ease-out forwards'
          }}
        >
          {damageNumber.type === 'damage' ? '-' : '+'}{damageNumber.value}
        </div>
      ))}

      {/* Survival HUD - ONLY when game started */}
      {gameStarted && (
        <>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-red-500/50">
              <div className="flex items-center space-x-6 text-white">
                {/* Wave Info */}
                <div className="flex items-center space-x-2">
                  <Target className="text-red-400" size={20} />
                  <span className="font-bold">Wave {state.survival.currentWave.waveNumber}</span>
                </div>
                
                {/* Survival Time */}
                <div className="flex items-center space-x-2">
                  <Clock className="text-blue-400" size={20} />
                  <span className="font-mono">{formatTime(state.survival.stats.survivalTime)}</span>
                </div>
                
                {/* Enemies Remaining - FIXED */}
                <div className="flex items-center space-x-2">
                  <Users className="text-orange-400" size={20} />
                  <span>{aliveEnemies} left</span>
                </div>
                
                {/* Score */}
                <div className="flex items-center space-x-2">
                  <Trophy className="text-yellow-400" size={20} />
                  <span>{state.survival.stats.enemiesDefeated * 100 + state.survival.stats.survivalTime * 10}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Title */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-orange-500/50">
              <h2 className="text-orange-400 font-bold text-lg text-center">🏛️ The Forgotten Courtyard</h2>
              <p className="text-gray-300 text-sm text-center">Ancient arena of eternal combat</p>
            </div>
          </div>

          {/* Player Stats */}
          <div className="absolute top-4 left-4 z-30">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center mb-3">
                <Heart className="text-red-500 mr-2" size={20} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white font-bold">{state.player.character.health}</span>
                    <span className="text-gray-300">/{state.player.character.maxHealth}</span>
                  </div>
                  <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                      style={{ width: `${(state.player.character.health / state.player.character.maxHealth) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-400 mr-3">
                  <img 
                    src={state.player.character.portrait}
                    alt={state.player.character.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{state.player.character.name}</h3>
                  <div className="text-yellow-400 text-xs">Level {state.player.character.level}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Power-ups */}
          <div className="absolute top-4 right-4 z-30">
            <div className="space-y-2">
              {state.survival.activePowerUps.map((activePowerUp, index) => {
                const timeLeft = Math.max(0, activePowerUp.endTime - Date.now());
                const progress = (timeLeft / activePowerUp.powerUp.duration) * 100;
                
                return (
                  <div key={index} className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-purple-500/50">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{activePowerUp.powerUp.icon}</span>
                      <div>
                        <div className="text-white font-bold text-sm">{activePowerUp.powerUp.name}</div>
                        <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 transition-all duration-100"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wave Progress */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-blue-500/50">
              <div className="text-center">
                {state.survival.waveInProgress ? (
                  <div className="text-white">
                    <div className="text-sm">Enemies Remaining</div>
                    <div className="text-2xl font-bold text-red-400">{aliveEnemies}</div>
                  </div>
                ) : (
                  <div className="text-white">
                    <div className="text-sm">Next Wave In</div>
                    <div className="text-2xl font-bold text-blue-400">{Math.ceil(state.survival.nextWaveTimer / 1000)}s</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 right-4 z-30">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-white text-xs space-y-1">
                <div>WASD - Move</div>
                <div>Space - Attack</div>
                <div>2 - Shuriken</div>
                <div>1,3,4,5 - Power-ups</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Start Game Overlay */}
      {!gameStarted && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-white mb-4">🏛️ The Forgotten Courtyard</h1>
            <p className="text-gray-300 mb-6">
              Enter the ancient arena where warriors once fought for glory. Survive waves of enemies in this mystical courtyard lit by eternal flames.
            </p>
            <div className="mb-6 p-4 bg-orange-900/30 rounded-lg border border-orange-500/50">
              <h3 className="text-orange-400 font-bold mb-2">Wave Structure:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• <strong>Wave 1:</strong> 3 enemies (Easy)</li>
                <li>• <strong>Wave 2:</strong> 5 enemies (Medium)</li>
                <li>• <strong>Wave 3:</strong> 7 enemies (Hard)</li>
                <li>• Defeat all waves to complete survival!</li>
              </ul>
            </div>
            <button
              onClick={() => setGameStarted(true)}
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              ⚔️ Enter the Arena ⚔️
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-60px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SurvivalMode;