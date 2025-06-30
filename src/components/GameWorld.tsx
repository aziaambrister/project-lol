import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import Player from './Player';
import Enemy from './Enemy';
import Building from './Building';
import GameHUD from './GameHUD';
import Minimap from './Minimap';
import EscapeMenu from './EscapeMenu';
import EnemyDebugOverlay from './EnemyDebugOverlay';

const GameWorld: React.FC = () => {
  const { state, movePlayer, stopMoving, performAttack, enterBuilding, toggleDebugMode, aiSystem, collectXPOrb } = useGame();
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showEscMenu, setShowEscMenu] = useState(false);
  const [shurikens, setShurikens] = useState<Array<{id: number, x: number, y: number, targetX: number, targetY: number, timestamp: number}>>([]);

  const keysPressedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    keysPressedRef.current = keysPressed;
  }, [keysPressed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === 'escape') {
        e.preventDefault();
        setShowEscMenu(!showEscMenu);
        return;
      }

      if (key === 'f3') {
        e.preventDefault();
        toggleDebugMode();
        return;
      }

      if (showEscMenu) return;

      if (['w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        setKeysPressed(prev => new Set(prev).add(key));
        return;
      }

      if (key === ' ') {
        e.preventDefault();
        const nearestEnemy = findNearestEnemy();
        if (nearestEnemy) {
          performAttack('basic-punch', nearestEnemy.id);
        }
      }

      if (key === 'shift') {
        e.preventDefault();
        performAttack('block');
      }

      if (key === 'e') {
        e.preventDefault();
        const nearestBuilding = findNearestBuilding();
        if (nearestBuilding && nearestBuilding.enterable) {
          console.log('Attempting to enter building:', nearestBuilding.id, nearestBuilding.name);
          enterBuilding(nearestBuilding.id);
        } else {
          console.log('No enterable building nearby. Nearest building:', nearestBuilding);
        }
      }

      if (key === '1') {
        e.preventDefault();
        performAttack('basic-punch');
      }

      if (key === '2') {
        e.preventDefault();
        const nearestEnemy = findNearestEnemy();
        if (nearestEnemy) {
          const newShuriken = {
            id: Date.now(),
            x: state.player.position.x,
            y: state.player.position.y,
            targetX: nearestEnemy.position.x,
            targetY: nearestEnemy.position.y,
            timestamp: Date.now()
          };
          setShurikens(prev => [...prev, newShuriken]);

          setTimeout(() => {
            performAttack('shuriken-throw', nearestEnemy.id);
          }, 300);
        }
      }

      if (key === '3') {
        e.preventDefault();
        performAttack('dodge-roll');
      }

      if (key === '4') {
        e.preventDefault();
        const specialMove = state.player.character.moveSet.find(m => m.type === 'special' && m.id !== 'shuriken-throw');
        if (specialMove) performAttack(specialMove.id);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (['w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        setKeysPressed(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [performAttack, enterBuilding, showEscMenu, state.player.position, toggleDebugMode]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setMapLoaded(true);
    };
    img.onerror = () => {
      setMapLoaded(false);
    };
    img.src = '/map.png';
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const moveLoop = () => {
      if (keysPressedRef.current.size === 0 || showEscMenu) {
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

    return () => cancelAnimationFrame(animationFrameId);
  }, [movePlayer, stopMoving, showEscMenu, state.player.isMoving]);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setShurikens(prev => prev.filter(shuriken => now - shuriken.timestamp < 1000));
    }, 100);

    return () => clearInterval(cleanupInterval);
  }, []);

  const findNearestEnemy = () => {
    const playerPos = state.player.position;
    const cameraX = state.camera.x - window.innerWidth / 2;
    const cameraY = state.camera.y - window.innerHeight / 2;
    
    let nearestEnemy = null;
    let minDistance = Infinity;

    state.currentWorld.enemies.forEach(enemy => {
      if (enemy.state === 'dead') return;

      // Check if enemy is visible on screen
      const screenX = enemy.position.x - cameraX;
      const screenY = enemy.position.y - cameraY;
      const isVisible = screenX >= 0 && screenX <= window.innerWidth && 
                       screenY >= 0 && screenY <= window.innerHeight;

      if (!isVisible) return; // Only consider visible enemies

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

  const findNearestBuilding = () => {
    const playerPos = state.player.position;
    let nearestBuilding = null;
    let minDistance = Infinity;

    state.currentWorld.buildings.forEach(building => {
      const distance = Math.sqrt(
        Math.pow(building.position.x - playerPos.x, 2) +
        Math.pow(building.position.y - playerPos.y, 2)
      );

      console.log(`Building ${building.id} (${building.name}): distance=${distance.toFixed(2)}, enterable=${building.enterable}`);

      if (distance < 80 && distance < minDistance) {
        minDistance = distance;
        nearestBuilding = building;
      }
    });

    if (nearestBuilding) {
      console.log(`Nearest building: ${nearestBuilding.id} (${nearestBuilding.name}) at distance ${minDistance.toFixed(2)}`);
    } else {
      console.log('No buildings within range');
    }

    return nearestBuilding;
  };

  const cameraX = state.camera.x - window.innerWidth / 2;
  const cameraY = state.camera.y - window.innerHeight / 2;

  const lightLevel = state.currentWorld.dayNightCycle.lightLevel;
  const overlayOpacity = 1 - lightLevel;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* FIXED: Extended background that covers the entire world bounds */}
      <div
        className="absolute"
        style={{
          left: -cameraX - 500, // Extended beyond camera bounds
          top: -cameraY - 500,
          width: state.currentWorld.size.width + 1000, // Extended width
          height: state.currentWorld.size.height + 1000, // Extended height
          backgroundImage: `url(/map.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
          zIndex: 1
        }}
      >
        {!mapLoaded && (
          <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg z-50">
            Loading map...
          </div>
        )}
      </div>

      {/* FIXED: Additional background layer to prevent purple void */}
      <div
        className="absolute bg-gradient-to-br from-green-800 via-green-700 to-green-900"
        style={{
          left: -cameraX - 1000,
          top: -cameraY - 1000,
          width: state.currentWorld.size.width + 2000,
          height: state.currentWorld.size.height + 2000,
          zIndex: 0
        }}
      ></div>

      {/* XP Orbs */}
      {state.currentWorld.xpOrbs.map(orb => {
        if (orb.collected) return null;
        
        const screenX = orb.position.x - cameraX;
        const screenY = orb.position.y - cameraY;
        
        // Only render orbs that are visible on screen
        if (screenX < -50 || screenX > window.innerWidth + 50 || 
            screenY < -50 || screenY > window.innerHeight + 50) {
          return null;
        }
        
        const getOrbColor = () => {
          switch (orb.type) {
            case 'small': return 'from-blue-400 to-blue-600';
            case 'medium': return 'from-purple-400 to-purple-600';
            case 'large': return 'from-yellow-400 to-yellow-600';
            default: return 'from-blue-400 to-blue-600';
          }
        };
        
        const getOrbSize = () => {
          switch (orb.type) {
            case 'small': return 'w-4 h-4';
            case 'medium': return 'w-6 h-6';
            case 'large': return 'w-8 h-8';
            default: return 'w-4 h-4';
          }
        };
        
        return (
          <div
            key={orb.id}
            className="absolute z-25 cursor-pointer"
            style={{
              left: screenX - (orb.type === 'large' ? 16 : orb.type === 'medium' ? 12 : 8),
              top: screenY - (orb.type === 'large' ? 16 : orb.type === 'medium' ? 12 : 8)
            }}
            onClick={() => collectXPOrb(orb.id)}
          >
            {/* XP Orb */}
            <div className={`${getOrbSize()} rounded-full bg-gradient-to-br ${getOrbColor()} animate-pulse shadow-lg border-2 border-white/50 relative overflow-hidden`}>
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getOrbColor()} animate-ping opacity-75`}></div>
              
              {/* Inner sparkle */}
              <div className="absolute inset-1 rounded-full bg-white/30 animate-pulse"></div>
              
              {/* XP value indicator */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold bg-black/70 px-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                +{orb.xpValue} XP
              </div>
            </div>
          </div>
        );
      })}

      {/* Projectiles */}
      {shurikens.map(shuriken => {
        const progress = Math.min((Date.now() - shuriken.timestamp) / 300, 1);
        const currentX = shuriken.x + (shuriken.targetX - shuriken.x) * progress;
        const currentY = shuriken.y + (shuriken.targetY - shuriken.y) * progress;

        return (
          <div
            key={shuriken.id}
            className="absolute pointer-events-none z-30"
            style={{
              left: currentX - cameraX - 8,
              top: currentY - cameraY - 8,
              transform: `rotate(${progress * 720}deg)`,
              transition: 'none'
            }}
          >
            <img
              src="/shuriken.png"
              alt="Shuriken"
              className="w-4 h-4 object-contain"
            />
          </div>
        );
      })}

      {/* World Entities */}
      {state.currentWorld.buildings.map(building => (
        <Building key={building.id} building={building} cameraX={cameraX} cameraY={cameraY} />
      ))}

      {state.currentWorld.npcs.map(npc => (
        <div
          key={npc.id}
          className="absolute w-18 h-18 flex items-center justify-center"
          style={{
            left: npc.position.x - cameraX - 36,
            top: npc.position.y - cameraY - 36
          }}
        >
          <div className="text-5xl drop-shadow-lg filter brightness-110">{npc.sprite}</div>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap border-2 border-yellow-400/80 shadow-lg">
            {npc.name}
          </div>
        </div>
      ))}

      {/* Only render enemies that are fully visible on screen */}
      {state.currentWorld.enemies.map(enemy => (
        <Enemy key={enemy.id} enemy={enemy} cameraX={cameraX} cameraY={cameraY} />
      ))}

      <Player cameraX={cameraX} cameraY={cameraY} />

      {state.combat.damageNumbers.map(damageNumber => (
        <div
          key={damageNumber.id}
          className={`absolute font-bold text-3xl pointer-events-none animate-bounce ${
            damageNumber.type === 'damage' ? 'text-red-500' :
            damageNumber.type === 'heal' ? 'text-green-500' :
            damageNumber.type === 'xp' ? 'text-blue-400' :
            'text-yellow-500'
          }`}
          style={{
            left: damageNumber.position.x - cameraX,
            top: damageNumber.position.y - cameraY,
            textShadow: '3px 3px 6px rgba(0,0,0,0.9)',
            animation: 'float-up 2s ease-out forwards'
          }}
        >
          {damageNumber.type === 'damage' ? '-' : 
           damageNumber.type === 'xp' ? '+' : 
           damageNumber.type === 'critical' && damageNumber.value > 50 ? 'LEVEL ' : 
           '+'}{damageNumber.value}{damageNumber.type === 'xp' ? ' XP' : 
                                   damageNumber.type === 'critical' && damageNumber.value > 50 ? '!' : ''}
        </div>
      ))}

      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-blue-900 pointer-events-none"
          style={{ opacity: overlayOpacity * 0.7 }}
        />
      )}

      <EnemyDebugOverlay
        enemies={state.currentWorld.enemies}
        aiSystem={aiSystem}
        playerPosition={state.player.position}
        cameraX={cameraX}
        cameraY={cameraY}
        debugEnabled={state.debug?.enabled || false}
      />

      {!showEscMenu && <GameHUD />}
      {/* Minimap is now always shown in top left */}
      {!showEscMenu && <Minimap />}
      {showEscMenu && <EscapeMenu onClose={() => setShowEscMenu(false)} />}

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

export default GameWorld;