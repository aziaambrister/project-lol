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
  const { state, movePlayer, stopMoving, performAttack, enterBuilding, toggleDebugMode, aiSystem } = useGame();
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showEscMenu, setShowEscMenu] = useState(false);
  const [shurikens, setShurikens] = useState<Array<{id: number, x: number, y: number, targetX: number, targetY: number, timestamp: number}>>([]);

  // Keep keysPressed in a ref to avoid stale closures in animation frame
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
          enterBuilding(nearestBuilding.id);
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
      console.log('Map loaded successfully');
      setMapLoaded(true);
    };
    img.onerror = () => {
      console.error('Failed to load map.png');
      setMapLoaded(false);
    };
    img.src = '/map.png';
  }, []);

  // --- REPLACED MOVEMENT LOOP USING requestAnimationFrame ---
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

  const findNearestBuilding = () => {
    const playerPos = state.player.position;
    let nearestBuilding = null;
    let minDistance = Infinity;

    state.currentWorld.buildings.forEach(building => {
      const distance = Math.sqrt(
        Math.pow(building.position.x - playerPos.x, 2) +
        Math.pow(building.position.y - playerPos.y, 2)
      );

      if (distance < 80 && distance < minDistance) {
        minDistance = distance;
        nearestBuilding = building;
      }
    });

    return nearestBuilding;
  };

  const cameraX = state.camera.x - window.innerWidth / 2;
  const cameraY = state.camera.y - window.innerHeight / 2;

  const lightLevel = state.currentWorld.dayNightCycle.lightLevel;
  const overlayOpacity = 1 - lightLevel;

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ margin: 0, padding: 0 }}>
      {/* Map Background */}
      <div
        className="absolute"
        style={{
          left: -cameraX,
          top: -cameraY,
          width: state.currentWorld.size.width,
          height: state.currentWorld.size.height,
          backgroundImage: `url(/map.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
          minWidth: '100vw',
          minHeight: '100vh'
        }}
      >
        {!mapLoaded && (
          <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg z-50">
            Loading map...
          </div>
        )}

        <div
          className="absolute inset-0 bg-green-600"
          style={{ zIndex: -1 }}
        ></div>
      </div>

      {/* Shuriken Animation */}
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

      {/* Buildings */}
      {state.currentWorld.buildings.map(building => (
        <Building key={building.id} building={building} cameraX={cameraX} cameraY={cameraY} />
      ))}

      {/* NPCs */}
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

      {/* Enemies */}
      {state.currentWorld.enemies.map(enemy => (
        <Enemy key={enemy.id} enemy={enemy} cameraX={cameraX} cameraY={cameraY} />
      ))}

      {/* Player */}
      <Player cameraX={cameraX} cameraY={cameraY} />

      {/* Damage Numbers */}
      {state.combat.damageNumbers.map(damageNumber => (
        <div
          key={damageNumber.id}
          className={`absolute font-bold text-3xl pointer-events-none animate-bounce ${
            damageNumber.type === 'damage' ? 'text-red-500' :
            damageNumber.type === 'heal' ? 'text-green-500' :
            'text-yellow-500'
          }`}
          style={{
            left: damageNumber.position.x - cameraX,
            top: damageNumber.position.y - cameraY,
            textShadow: '3px 3px 6px rgba(0,0,0,0.9)',
            animation: 'float-up 2s ease-out forwards'
          }}
        >
          {damageNumber.type === 'damage' ? '-' : '+'}{damageNumber.value}
        </div>
      ))}

      {/* Day/Night Overlay */}
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-blue-900 pointer-events-none"
          style={{ opacity: overlayOpacity * 0.7 }}
        />
      )}

      {/* Enemy Debug Overlay */}
      <EnemyDebugOverlay
        enemies={state.currentWorld.enemies}
        aiSystem={aiSystem}
        playerPosition={state.player.position}
        cameraX={cameraX}
        cameraY={cameraY}
        debugEnabled={state.debug?.enabled || false}
      />

      {/* Game HUD */}
      {!showEscMenu && <GameHUD />}

      {/* Minimap */}
      {state.ui.showMinimap && !showEscMenu && <Minimap />}

      {/* Controls Help */}
      {!showEscMenu && (
        <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-sm rounded-xl p-4 text-white text-sm border-2 border-yellow-400/60 shadow-2xl">
          <div className="space-y-2">
            <div className="text-yellow-400 font-bold text-center mb-2">⚔️ CONTROLS ⚔️</div>
            <div>🎮 <span className="text-yellow-300 font-bold">W</span> - Move Up</div>
            <div>🎮 <span className="text-yellow-300 font-bold">A</span> - Move Left</div>
            <div>🎮 <span className="text-yellow-300 font-bold">S</span> - Move Down</div>
            <div>🎮 <span className="text-yellow-300 font-bold">D</span> - Move Right</div>
            <div>👊 <span className="text-yellow-300">Space</span> - Attack</div>
            <div>🥷 <span className="text-yellow-300">2</span> - Throw Shuriken</div>
            <div>🛡️ <span className="text-yellow-300">Shift</span> - Block</div>
            <div>🚪 <span className="text-yellow-300">E</span> - Interact</div>
            <div>⚔️ <span className="text-yellow-300">1-4</span> - Special Moves</div>
            <div>⚙️ <span className="text-yellow-300">ESC</span> - Menu</div>
            <div>🐛 <span className="text-yellow-300">F3</span> - Debug Mode</div>
          </div>
        </div>
      )}

      {/* ESC Menu */}
      {showEscMenu && (
        <EscapeMenu onClose={() => setShowEscMenu(false)} />
      )}

      {/* CSS for animations */}
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
