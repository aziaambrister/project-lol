import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import Player from './Player';
import Enemy from './Enemy';
import Building from './Building';
import GameHUD from './GameHUD';
import Minimap from './Minimap';
import TouchControls from './TouchControls';

const GameWorld: React.FC = () => {
  const { state, movePlayer, stopMoving, performAttack, enterBuilding } = useGame();
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [touchControlActive, setTouchControlActive] = useState(false);

  // Handle keyboard input (WASD + Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Movement keys - both WASD and Arrow Keys
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault(); // Prevent page scrolling with arrow keys
        
        // Map arrow keys to WASD equivalent
        let mappedKey = key;
        if (key === 'arrowup') mappedKey = 'w';
        if (key === 'arrowdown') mappedKey = 's';
        if (key === 'arrowleft') mappedKey = 'a';
        if (key === 'arrowright') mappedKey = 'd';
        
        setKeysPressed(prev => new Set(prev).add(mappedKey));
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
        e.preventDefault();
        performAttack('block');
      }
      
      // Interaction keys
      if (key === 'e') { // E to enter buildings
        e.preventDefault();
        const nearestBuilding = findNearestBuilding();
        if (nearestBuilding && nearestBuilding.enterable) {
          enterBuilding(nearestBuilding.id);
        }
      }
      
      // Special moves
      if (key === '1') {
        e.preventDefault();
        performAttack('basic-punch');
      }
      if (key === '2') {
        e.preventDefault();
        performAttack('basic-kick');
      }
      if (key === '3') {
        e.preventDefault();
        performAttack('dodge-roll');
      }
      if (key === '4') {
        e.preventDefault();
        const specialMove = state.player.character.moveSet.find(m => m.type === 'special');
        if (specialMove) performAttack(specialMove.id);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        
        // Map arrow keys to WASD equivalent
        let mappedKey = key;
        if (key === 'arrowup') mappedKey = 'w';
        if (key === 'arrowdown') mappedKey = 's';
        if (key === 'arrowleft') mappedKey = 'a';
        if (key === 'arrowright') mappedKey = 'd';
        
        setKeysPressed(prev => {
          const newSet = new Set(prev);
          newSet.delete(mappedKey);
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

  // Handle touch controls
  const handleTouchDirectionPress = (direction: 'up' | 'down' | 'left' | 'right') => {
    setTouchControlActive(true);
    
    // Map touch directions to WASD
    const keyMap = {
      'up': 'w',
      'down': 's',
      'left': 'a',
      'right': 'd'
    };
    
    setKeysPressed(prev => new Set(prev).add(keyMap[direction]));
  };

  const handleTouchDirectionRelease = () => {
    setTouchControlActive(false);
    setKeysPressed(new Set()); // Clear all movement keys
  };

  // Movement loop with enhanced smoothness
  useEffect(() => {
    const moveInterval = setInterval(() => {
      const now = Date.now();
      
      // Check if any movement keys are pressed (keyboard or touch)
      const hasMovementInput = keysPressed.size > 0;
      
      if (!hasMovementInput) {
        if (state.player.isMoving) {
          stopMoving();
        }
        return;
      }
      
      // Throttle movement updates for performance
      if (now - lastMoveTime < 16) return; // ~60 FPS
      
      // Determine movement direction with priority system
      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      
      // Vertical movement priority
      if (keysPressed.has('w')) {
        direction = 'up';
      } else if (keysPressed.has('s')) {
        direction = 'down';
      }
      // Horizontal movement priority (if no vertical input)
      else if (keysPressed.has('a')) {
        direction = 'left';
      } else if (keysPressed.has('d')) {
        direction = 'right';
      }
      
      // Handle diagonal movement by alternating directions
      if (keysPressed.has('w') && keysPressed.has('a')) {
        direction = Math.floor(now / 100) % 2 === 0 ? 'up' : 'left';
      } else if (keysPressed.has('w') && keysPressed.has('d')) {
        direction = Math.floor(now / 100) % 2 === 0 ? 'up' : 'right';
      } else if (keysPressed.has('s') && keysPressed.has('a')) {
        direction = Math.floor(now / 100) % 2 === 0 ? 'down' : 'left';
      } else if (keysPressed.has('s') && keysPressed.has('d')) {
        direction = Math.floor(now / 100) % 2 === 0 ? 'down' : 'right';
      }
      
      if (direction) {
        movePlayer(direction);
        setLastMoveTime(now);
      }
    }, 16); // 60 FPS movement updates
    
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
      {/* Scaled RPG-Style Map Background */}
      <div 
        className="absolute inset-0"
        style={{
          left: -cameraX,
          top: -cameraY,
          width: state.currentWorld.size.width,
          height: state.currentWorld.size.height,
          backgroundImage: `
            linear-gradient(45deg, #22c55e 0%, #16a34a 25%, #15803d 50%, #166534 75%, #14532d 100%),
            radial-gradient(circle at 15% 15%, rgba(34, 197, 94, 0.9) 0%, transparent 25%),
            radial-gradient(circle at 85% 85%, rgba(22, 163, 74, 0.7) 0%, transparent 35%),
            radial-gradient(circle at 50% 30%, rgba(21, 128, 61, 0.5) 0%, transparent 40%),
            radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.6) 0%, transparent 30%)
          `,
          backgroundSize: '600px 600px, 1200px 1200px, 900px 900px, 1500px 1500px, 800px 800px'
        }}
      >
        {/* Forest Areas - Scaled and Enhanced */}
        <div 
          className="absolute bg-green-800 opacity-70 rounded-full"
          style={{ left: '8%', top: '12%', width: '450px', height: '375px' }}
        ></div>
        <div 
          className="absolute bg-green-800 opacity-70 rounded-full"
          style={{ left: '68%', top: '8%', width: '375px', height: '300px' }}
        ></div>
        <div 
          className="absolute bg-green-800 opacity-70 rounded-full"
          style={{ left: '12%', top: '68%', width: '300px', height: '270px' }}
        ></div>
        <div 
          className="absolute bg-green-700 opacity-60 rounded-full"
          style={{ left: '5%', top: '45%', width: '200px', height: '180px' }}
        ></div>
        
        {/* Desert/Sandy Areas - Scaled and Enhanced */}
        <div 
          className="absolute bg-yellow-600 opacity-50 rounded-lg"
          style={{ left: '40%', top: '55%', width: '600px', height: '450px' }}
        ></div>
        <div 
          className="absolute bg-yellow-700 opacity-40 rounded-lg"
          style={{ left: '65%', top: '75%', width: '300px', height: '200px' }}
        ></div>
        
        {/* Mountain/Rocky Areas - Scaled and Enhanced */}
        <div 
          className="absolute bg-gray-600 opacity-60 rounded-lg"
          style={{ left: '72%', top: '60%', width: '300px', height: '375px' }}
        ></div>
        <div 
          className="absolute bg-gray-700 opacity-50 rounded-lg"
          style={{ left: '85%', top: '45%', width: '200px', height: '250px' }}
        ></div>
        
        {/* Enhanced Pathways Network */}
        <div 
          className="absolute bg-yellow-700 opacity-70"
          style={{ 
            left: '28%', 
            top: '18%', 
            width: '12px', 
            height: '900px',
            transform: 'rotate(15deg)'
          }}
        ></div>
        <div 
          className="absolute bg-yellow-700 opacity-70"
          style={{ 
            left: '18%', 
            top: '48%', 
            width: '750px', 
            height: '12px'
          }}
        ></div>
        <div 
          className="absolute bg-yellow-700 opacity-70"
          style={{ 
            left: '58%', 
            top: '28%', 
            width: '12px', 
            height: '600px',
            transform: 'rotate(-20deg)'
          }}
        ></div>
        <div 
          className="absolute bg-yellow-700 opacity-70"
          style={{ 
            left: '45%', 
            top: '25%', 
            width: '400px', 
            height: '12px',
            transform: 'rotate(45deg)'
          }}
        ></div>
        <div 
          className="absolute bg-yellow-700 opacity-70"
          style={{ 
            left: '70%', 
            top: '70%', 
            width: '300px', 
            height: '12px',
            transform: 'rotate(-30deg)'
          }}
        ></div>
        
        {/* Enhanced Grass Texture Pattern */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                rgba(34, 197, 94, 0.4) 0px,
                rgba(34, 197, 94, 0.4) 4px,
                transparent 4px,
                transparent 30px
              ),
              repeating-linear-gradient(
                -45deg,
                rgba(22, 163, 74, 0.3) 0px,
                rgba(22, 163, 74, 0.3) 3px,
                transparent 3px,
                transparent 25px
              ),
              repeating-linear-gradient(
                90deg,
                rgba(16, 185, 129, 0.2) 0px,
                rgba(16, 185, 129, 0.2) 2px,
                transparent 2px,
                transparent 40px
              )
            `
          }}
        ></div>
        
        {/* Enhanced Tree Sprites - More scattered and varied */}
        <div className="absolute text-8xl" style={{ left: '12%', top: '18%' }}>🌲</div>
        <div className="absolute text-7xl" style={{ left: '16%', top: '23%' }}>🌳</div>
        <div className="absolute text-8xl" style={{ left: '9%', top: '28%' }}>🌲</div>
        <div className="absolute text-6xl" style={{ left: '20%', top: '15%' }}>🌲</div>
        <div className="absolute text-7xl" style={{ left: '73%', top: '12%' }}>🌲</div>
        <div className="absolute text-8xl" style={{ left: '76%', top: '18%' }}>🌳</div>
        <div className="absolute text-7xl" style={{ left: '70%', top: '22%' }}>🌲</div>
        <div className="absolute text-6xl" style={{ left: '80%', top: '15%' }}>🌲</div>
        <div className="absolute text-8xl" style={{ left: '18%', top: '72%' }}>🌲</div>
        <div className="absolute text-7xl" style={{ left: '15%', top: '78%' }}>🌳</div>
        <div className="absolute text-6xl" style={{ left: '22%', top: '75%' }}>🌲</div>
        <div className="absolute text-7xl" style={{ left: '8%', top: '50%' }}>🌲</div>
        <div className="absolute text-6xl" style={{ left: '11%', top: '55%' }}>🌳</div>
        
        {/* Enhanced Rock formations and mountain details */}
        <div className="absolute text-6xl" style={{ left: '78%', top: '68%' }}>🪨</div>
        <div className="absolute text-7xl" style={{ left: '83%', top: '73%' }}>⛰️</div>
        <div className="absolute text-6xl" style={{ left: '76%', top: '78%' }}>🪨</div>
        <div className="absolute text-5xl" style={{ left: '85%', top: '65%' }}>🪨</div>
        <div className="absolute text-8xl" style={{ left: '88%', top: '50%' }}>⛰️</div>
        <div className="absolute text-6xl" style={{ left: '90%', top: '55%' }}>🪨</div>
        
        {/* Enhanced Flowers and environmental details */}
        <div className="absolute text-3xl" style={{ left: '38%', top: '38%' }}>🌸</div>
        <div className="absolute text-3xl" style={{ left: '53%', top: '33%' }}>🌺</div>
        <div className="absolute text-3xl" style={{ left: '33%', top: '58%' }}>🌻</div>
        <div className="absolute text-3xl" style={{ left: '63%', top: '43%' }}>🌸</div>
        <div className="absolute text-2xl" style={{ left: '45%', top: '50%' }}>🌼</div>
        <div className="absolute text-3xl" style={{ left: '55%', top: '65%' }}>🌺</div>
        <div className="absolute text-2xl" style={{ left: '25%', top: '45%' }}>🌸</div>
        <div className="absolute text-3xl" style={{ left: '65%', top: '35%' }}>🌻</div>
        
        {/* Desert details */}
        <div className="absolute text-4xl" style={{ left: '50%', top: '70%' }}>🌵</div>
        <div className="absolute text-3xl" style={{ left: '60%', top: '75%' }}>🌵</div>
        <div className="absolute text-5xl" style={{ left: '45%', top: '80%' }}>🌵</div>
        <div className="absolute text-3xl" style={{ left: '70%', top: '85%' }}>🌵</div>
        
        {/* Coastal details */}
        <div className="absolute text-4xl" style={{ left: '5%', top: '40%' }}>🐚</div>
        <div className="absolute text-3xl" style={{ left: '8%', top: '60%' }}>🐚</div>
        <div className="absolute text-4xl" style={{ left: '3%', top: '80%' }}>🐚</div>
      </div>

      {/* Enhanced Water Bodies with RPG styling */}
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
            boxShadow: 'inset 0 0 40px rgba(59, 130, 246, 0.7), 0 0 30px rgba(59, 130, 246, 0.4)'
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

      {/* Touch Controls - Bottom Left */}
      <TouchControls
        onDirectionPress={handleTouchDirectionPress}
        onDirectionRelease={handleTouchDirectionRelease}
        isVisible={true}
      />

      {/* Game HUD */}
      <GameHUD />

      {/* Minimap */}
      {state.ui.showMinimap && <Minimap />}

      {/* Enhanced Controls Help - Positioned to not overlap with touch controls */}
      <div className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-sm rounded-xl p-4 text-white text-sm border-2 border-yellow-400/60 shadow-2xl">
        <div className="space-y-2">
          <div className="text-yellow-400 font-bold text-center mb-2">⚔️ CONTROLS ⚔️</div>
          <div>🎮 <span className="text-yellow-300">WASD / Arrow Keys</span> - Move</div>
          <div>📱 <span className="text-yellow-300">Touch Controls</span> - Move (Mobile)</div>
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