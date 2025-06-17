import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import BattleRoyaleHUD from './BattleRoyaleHUD';
import Player from './Player';

const BattleRoyaleWorld: React.FC = () => {
  const { state, movePlayer, useAbility, switchWeapon, buildStructure } = useGame();
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [isBuilding, setIsBuilding] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<'wall' | 'floor' | 'ramp' | 'roof'>('wall');
  const [selectedMaterial, setSelectedMaterial] = useState<'wood' | 'stone' | 'metal'>('wood');
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Movement keys
      if (['w', 'a', 's', 'd'].includes(key)) {
        setKeysPressed(prev => new Set(prev).add(key));
      }
      
      // Weapon switching
      if (['1', '2', '3', '4', '5'].includes(key)) {
        const weaponIndex = parseInt(key) - 1;
        switchWeapon(weaponIndex);
      }
      
      // Building toggle
      if (key === 'q') {
        setIsBuilding(!isBuilding);
      }
      
      // Structure selection
      if (isBuilding) {
        if (key === 'z') setSelectedStructure('wall');
        if (key === 'x') setSelectedStructure('floor');
        if (key === 'c') setSelectedStructure('ramp');
        if (key === 'v') setSelectedStructure('roof');
      }
      
      // Material selection
      if (key === 'r') {
        const materials: ('wood' | 'stone' | 'metal')[] = ['wood', 'stone', 'metal'];
        const currentIndex = materials.indexOf(selectedMaterial);
        setSelectedMaterial(materials[(currentIndex + 1) % materials.length]);
      }
      
      // Abilities
      if (key === 'e') {
        useAbility(0);
      }
      if (key === 'f') {
        useAbility(1);
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
    
    const handleMouseClick = (e: MouseEvent) => {
      if (isBuilding) {
        // Build structure at mouse position
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2000;
        const y = ((e.clientY - rect.top) / rect.height) * 2000;
        buildStructure(selectedStructure, selectedMaterial, { x, y });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('click', handleMouseClick);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('click', handleMouseClick);
    };
  }, [isBuilding, selectedStructure, selectedMaterial, switchWeapon, useAbility, buildStructure]);
  
  // Movement loop
  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (keysPressed.size === 0) return;
      
      let deltaX = 0;
      let deltaY = 0;
      const speed = 5;
      
      if (keysPressed.has('w')) deltaY -= speed;
      if (keysPressed.has('s')) deltaY += speed;
      if (keysPressed.has('a')) deltaX -= speed;
      if (keysPressed.has('d')) deltaX += speed;
      
      if (deltaX !== 0 || deltaY !== 0) {
        movePlayer(deltaX, deltaY);
      }
    }, 16); // 60 FPS
    
    return () => clearInterval(moveInterval);
  }, [keysPressed, movePlayer]);
  
  // Storm damage
  useEffect(() => {
    const stormInterval = setInterval(() => {
      const { player, storm } = state;
      const distanceFromCenter = Math.sqrt(
        Math.pow(player.position.x - storm.centerX, 2) + 
        Math.pow(player.position.y - storm.centerY, 2)
      );
      
      if (distanceFromCenter > storm.currentRadius) {
        // Player is in storm, take damage
        // This would be handled by the game context
      }
    }, 1000);
    
    return () => clearInterval(stormInterval);
  }, [state]);
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-400 via-green-400 to-green-600">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${state.currentMap.background})`,
          transform: `translate(${-state.player.position.x / 10}px, ${-state.player.position.y / 10}px)`
        }}
      ></div>
      
      {/* Storm Visual Effect */}
      <div 
        className="absolute border-4 border-purple-500 rounded-full pointer-events-none"
        style={{
          width: `${storm.currentRadius * 2}px`,
          height: `${storm.currentRadius * 2}px`,
          left: `${storm.centerX - storm.currentRadius - state.player.position.x / 10}px`,
          top: `${storm.centerY - storm.currentRadius - state.player.position.y / 10}px`,
          boxShadow: `inset 0 0 100px rgba(147, 51, 234, 0.3), 0 0 100px rgba(147, 51, 234, 0.3)`
        }}
      ></div>
      
      {/* Named Locations */}
      {state.currentMap.namedLocations.map((location) => (
        <div
          key={location.id}
          className="absolute pointer-events-none"
          style={{
            left: `${location.position.x - state.player.position.x / 10}px`,
            top: `${location.position.y - state.player.position.y / 10}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <h3 className="text-white font-bold text-lg">{location.name}</h3>
          </div>
        </div>
      ))}
      
      {/* Structures */}
      {state.structures.map((structure) => (
        <div
          key={structure.id}
          className={`absolute w-16 h-16 border-2 ${
            structure.material === 'wood' ? 'bg-amber-600 border-amber-800' :
            structure.material === 'stone' ? 'bg-gray-600 border-gray-800' :
            'bg-blue-600 border-blue-800'
          }`}
          style={{
            left: `${structure.position.x - state.player.position.x / 10}px`,
            top: `${structure.position.y - state.player.position.y / 10}px`,
            transform: `translate(-50%, -50%) rotate(${structure.rotation}deg)`,
            opacity: structure.health / structure.maxHealth
          }}
        >
          <div className="w-full h-1 bg-black/50 absolute bottom-0">
            <div 
              className="h-full bg-green-500"
              style={{ width: `${(structure.health / structure.maxHealth) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
      
      {/* Loot Items */}
      {state.lootItems.map((item) => (
        <div
          key={item.id}
          className={`absolute w-8 h-8 rounded-full flex items-center justify-center animate-bounce cursor-pointer ${
            item.rarity === 'common' ? 'bg-gray-500' :
            item.rarity === 'uncommon' ? 'bg-green-500' :
            item.rarity === 'rare' ? 'bg-blue-500' :
            item.rarity === 'epic' ? 'bg-purple-500' : 'bg-yellow-500'
          }`}
          style={{
            left: `${item.position.x - state.player.position.x / 10}px`,
            top: `${item.position.y - state.player.position.y / 10}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <span className="text-white text-sm">{item.icon}</span>
        </div>
      ))}
      
      {/* Other Players */}
      {state.otherPlayers.filter(p => p.isAlive).map((otherPlayer) => (
        <div
          key={otherPlayer.id}
          className="absolute w-12 h-12"
          style={{
            left: `${otherPlayer.position.x - state.player.position.x / 10}px`,
            top: `${otherPlayer.position.y - state.player.position.y / 10}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-red-500">
            <img 
              src={otherPlayer.character.sprite}
              alt={otherPlayer.character.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 px-2 py-1 rounded text-white text-xs">
            {otherPlayer.character.name}
          </div>
        </div>
      ))}
      
      {/* Player */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Player />
      </div>
      
      {/* Building Mode Overlay */}
      {isBuilding && (
        <div className="absolute inset-0 bg-blue-500/10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`w-16 h-16 border-4 border-dashed ${
              selectedMaterial === 'wood' ? 'border-amber-400' :
              selectedMaterial === 'stone' ? 'border-gray-400' :
              'border-blue-400'
            }`}>
              <div className="w-full h-full flex items-center justify-center text-white font-bold">
                {selectedStructure === 'wall' ? '🧱' :
                 selectedStructure === 'floor' ? '⬜' :
                 selectedStructure === 'ramp' ? '📐' : '🔺'}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Building Instructions */}
      {isBuilding && (
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-40">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h3 className="text-white font-bold mb-2">Building Mode</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <div>Z - Wall</div>
              <div>X - Floor</div>
              <div>C - Ramp</div>
              <div>V - Roof</div>
              <div>R - Switch Material</div>
              <div>Q - Exit Building</div>
            </div>
            <div className="mt-3">
              <div className="text-white font-bold">Material: {selectedMaterial}</div>
              <div className="text-white font-bold">Structure: {selectedStructure}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <div className="text-white text-sm space-y-1">
            <div>WASD - Move</div>
            <div>1-5 - Switch Weapons</div>
            <div>Q - Build Mode</div>
            <div>E/F - Abilities</div>
            <div>R - Switch Material</div>
          </div>
        </div>
      </div>
      
      {/* HUD */}
      <BattleRoyaleHUD />
    </div>
  );
};

export default BattleRoyaleWorld;