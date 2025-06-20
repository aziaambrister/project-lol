import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import Player from './Player';
import Enemy from './Enemy';
import Building from './Building';
import GameHUD from './GameHUD';
import Minimap from './Minimap';

const GameWorld: React.FC = () => {
  const { state, movePlayer, stopMoving, performAttack, enterBuilding } = useGame();
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Movement keys
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeysPressed(prev => new Set(prev).add(key));
      }
      
      // Combat keys
      if (key === ' ') { // Spacebar for basic attack
        e.preventDefault();
        const nearestEnemy = findNearestEnemy();
        if (nearestEnemy) {
          performAttack('basic-punch', nearestEnemy.id);
        }
      }
      
      if (key === 'shift') { // Shift for block
        performAttack('block');
      }
      
      // Interaction keys
      if (key === 'e') { // E to enter buildings
        const nearestBuilding = findNearestBuilding();
        if (nearestBuilding && nearestBuilding.enterable) {
          enterBuilding(nearestBuilding.id);
        }
      }
      
      // Special moves
      if (key === '1') performAttack('basic-punch');
      if (key === '2') performAttack('basic-kick');
      if (key === '3') performAttack('dodge-roll');
      if (key === '4') {
        const specialMove = state.player.character.moveSet.find(m => m.type === 'special');
        if (specialMove) performAttack(specialMove.id);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeysPressed(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state.player.character.moveSet, performAttack, enterBuilding]);

  // Check if map image loads
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

  // Movement loop
  useEffect(() => {
    const moveInterval = setInterval(() => {
      const now = Date.now();
      if (keysPressed.size === 0) {
        if (state.player.isMoving) {
          stopMoving();
        }
        return;
      }
      
      // Throttle movement updates
      if (now - lastMoveTime < 50) return;
      
      // Determine movement direction
      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      
      if (keysPressed.has('w')) direction = 'up';
      else if (keysPressed.has('s')) direction = 'down';
      else if (keysPressed.has('a')) direction = 'left';
      else if (keysPressed.has('d')) direction = 'right';
      
      if (direction) {
        movePlayer(direction);
        setLastMoveTime(now);
      }
    }, 16); // 60 FPS
    
    return () => clearInterval(moveInterval);
  }, [keysPressed, movePlayer, stopMoving, state.player.isMoving, lastMoveTime]);

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
      
      if (distance < 60 && distance < minDistance) { // Attack range
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
      
      if (distance < 80 && distance < minDistance) { // Interaction range
        minDistance = distance;
        nearestBuilding = building;
      }
    });
    
    return nearestBuilding;
  };

  // Calculate camera offset
  const cameraX = state.camera.x - window.innerWidth / 2;
  const cameraY = state.camera.y - window.innerHeight / 2;

  // Day/night lighting
  const lightLevel = state.currentWorld.dayNightCycle.lightLevel;
  const overlayOpacity = 1 - lightLevel;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map Background - Full Coverage */}
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
          imageRendering: 'pixelated', // Keeps pixel art crisp
          minWidth: '100vw',
          minHeight: '100vh'
        }}
      >
        {/* Show loading indicator if map hasn't loaded */}
        {!mapLoaded && (
          <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg z-50">
            Loading map...
          </div>
        )}

        {/* Fallback background color to prevent white space */}
        <div 
          className="absolute inset-0 bg-green-600"
          style={{ zIndex: -1 }}
        ></div>
      </div>

      {/* Enhanced Water Bodies with RPG styling - positioned to match map */}
      {state.currentWorld.waterBodies.map(water => (
        <div
          key={water.id}
          className="absolute rounded-lg overflow-hidden"
          style={{
            left: water.position.x - cameraX,
            top: water.position.y - cameraY,
            width: water.size.width,
            height: water.size.height,
            background: 'linear-gradient(45deg, #3b82f6, #1d4ed8, #1e40af, #1e3a8a)',
            boxShadow: 'inset 0 0 40px rgba(59, 130, 246, 0.7), 0 0 30px rgba(59, 130, 246, 0.4)',
            opacity: 0.8 // Make water slightly transparent to blend with map
          }}
        >
          {/* Enhanced water animation effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-300/25 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-blue-600/20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Enhanced water surface sparkles */}
          <div className="absolute top-3 left-6 w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-8 right-12 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-6 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '2.5s' }}></div>
          <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
        </div>
      ))}

      {/* Buildings with enhanced RPG styling */}
      {state.currentWorld.buildings.map(building => (
        <Building key={building.id} building={building} cameraX={cameraX} cameraY={cameraY} />
      ))}

      {/* NPCs with enhanced styling */}
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

      {/* Enhanced Damage Numbers */}
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
        ></div>
      )}

      {/* Game HUD */}
      <GameHUD />

      {/* Minimap */}
      {state.ui.showMinimap && <Minimap />}

      {/* Enhanced Controls Help */}
      <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-sm rounded-xl p-4 text-white text-sm border-2 border-yellow-400/60 shadow-2xl">
        <div className="space-y-2">
          <div className="text-yellow-400 font-bold text-center mb-2">⚔️ CONTROLS ⚔️</div>
          <div>🎮 <span className="text-yellow-300">WASD</span> - Move</div>
          <div>👊 <span className="text-yellow-300">Space</span> - Attack</div>
          <div>🛡️ <span className="text-yellow-300">Shift</span> - Block</div>
          <div>🚪 <span className="text-yellow-300">E</span> - Interact</div>
          <div>⚔️ <span className="text-yellow-300">1-4</span> - Special Moves</div>
        </div>
      </div>

      {/* CSS for enhanced animations */}
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