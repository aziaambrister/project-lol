import React, { useState, useEffect, useRef } from 'react';

// ✅ FIXED VERSION: Proper layered architecture for survival mode
interface Position {
  x: number;
  y: number;
}

interface Entity {
  id: string;
  position: Position;
  health: number;
  maxHealth: number;
  sprite: string;
}

const GameWorldFixed: React.FC = () => {
  // Game state
  const [player, setPlayer] = useState<Entity>({
    id: 'player',
    position: { x: 2000, y: 2000 }, // World coordinates
    health: 100,
    maxHealth: 100,
    sprite: '🧙‍♂️'
  });

  const [enemies, setEnemies] = useState<Entity[]>([
    {
      id: 'enemy1',
      position: { x: 1800, y: 1800 },
      health: 50,
      maxHealth: 50,
      sprite: '👹'
    },
    {
      id: 'enemy2',
      position: { x: 2200, y: 1900 },
      health: 75,
      maxHealth: 75,
      sprite: '🐺'
    },
    {
      id: 'enemy3',
      position: { x: 2100, y: 2200 },
      health: 60,
      maxHealth: 60,
      sprite: '💀'
    }
  ]);

  // Input handling
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const keysPressedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    keysPressedRef.current = keysPressed;
  }, [keysPressed]);

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        setKeysPressed(prev => new Set(prev).add(key));
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
  }, []);

  // Player movement
  useEffect(() => {
    const movePlayer = () => {
      if (keysPressedRef.current.size === 0) return;

      setPlayer(prev => {
        let newX = prev.position.x;
        let newY = prev.position.y;
        const speed = 5;

        keysPressedRef.current.forEach(key => {
          switch (key) {
            case 'w':
              newY = Math.max(1500, newY - speed); // Arena bounds
              break;
            case 's':
              newY = Math.min(2500, newY + speed);
              break;
            case 'a':
              newX = Math.max(1500, newX - speed);
              break;
            case 'd':
              newX = Math.min(2500, newX + speed);
              break;
          }
        });

        return { ...prev, position: { x: newX, y: newY } };
      });
    };

    const gameLoop = setInterval(movePlayer, 16); // 60fps
    return () => clearInterval(gameLoop);
  }, []);

  // Enemy AI - move towards player
  useEffect(() => {
    const updateEnemies = () => {
      setEnemies(prevEnemies =>
        prevEnemies.map(enemy => {
          const dx = player.position.x - enemy.position.x;
          const dy = player.position.y - enemy.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 10) {
            const speed = 1.5;
            const moveX = (dx / distance) * speed;
            const moveY = (dy / distance) * speed;

            return {
              ...enemy,
              position: {
                x: enemy.position.x + moveX,
                y: enemy.position.y + moveY
              }
            };
          }

          return enemy;
        })
      );
    };

    const aiLoop = setInterval(updateEnemies, 50);
    return () => clearInterval(aiLoop);
  }, [player.position]);

  // ✅ CAMERA CALCULATION - Only for entities, NOT for background
  const cameraX = player.position.x - window.innerWidth / 2;
  const cameraY = player.position.y - window.innerHeight / 2;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <h2 className="absolute top-2 left-2 z-50 text-white bg-black/50 px-2 py-1 rounded text-sm">
        ✅ FIXED: Static Background + Moving Entities
      </h2>

      {/* ✅ LAYER 1: STATIC BACKGROUND - Never moves */}
      <div 
        className="background-layer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(/the-forgotten-courtyard.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1
        }}
      />

      {/* ✅ LAYER 2: ENTITIES - Move with camera offset */}
      <div 
        className="entities-layer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 10
        }}
      >
        {/* Arena boundary */}
        <div 
          className="arena-boundary"
          style={{
            position: 'absolute',
            left: `${2000 - 500 - cameraX}px`,
            top: `${2000 - 500 - cameraY}px`,
            width: '1000px',
            height: '1000px',
            border: '4px solid rgba(255, 0, 0, 0.7)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />

        {/* Enemies */}
        {enemies.map(enemy => (
          <div
            key={enemy.id}
            style={{
              position: 'absolute',
              left: `${enemy.position.x - cameraX - 25}px`,
              top: `${enemy.position.y - cameraY - 25}px`,
              width: '50px',
              height: '50px',
              fontSize: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))',
              zIndex: 15
            }}
          >
            {enemy.sprite}
            
            {/* Enemy health bar */}
            <div
              style={{
                position: 'absolute',
                top: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 40,
                height: 4,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${(enemy.health / enemy.maxHealth) * 100}%`,
                  height: '100%',
                  backgroundColor: '#ff4444',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        ))}

        {/* Player - Always centered */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50px',
            height: '50px',
            fontSize: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))',
            zIndex: 20
          }}
        >
          {player.sprite}
          
          {/* Player health bar */}
          <div
            style={{
              position: 'absolute',
              top: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 40,
              height: 4,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${(player.health / player.maxHealth) * 100}%`,
                height: '100%',
                backgroundColor: '#44ff44',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* ✅ LAYER 3: UI - Always stays on screen */}
      <div 
        className="ui-layer"
        style={{ zIndex: 100 }}
      >
        {/* Game stats */}
        <div className="absolute top-4 left-4 bg-black/80 text-white p-3 rounded-lg">
          <div className="text-sm space-y-1">
            <div>Player: ({Math.round(player.position.x)}, {Math.round(player.position.y)})</div>
            <div>Health: {player.health}/{player.maxHealth}</div>
            <div>Enemies: {enemies.length}</div>
            <div>Camera: ({Math.round(cameraX)}, {Math.round(cameraY)})</div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg">
          <div className="text-sm space-y-1">
            <div>WASD - Move</div>
            <div>Background: FIXED ✅</div>
            <div>Entities: MOVING ✅</div>
          </div>
        </div>

        {/* Wave info */}
        <div className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold">🏛️ The Forgotten Courtyard</div>
            <div className="text-sm text-gray-300">Wave 1 - Enemies: {enemies.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameWorldFixed;