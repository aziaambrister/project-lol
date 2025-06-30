import React, { useState, useEffect, useRef } from 'react';

// TypeScript interfaces
interface Position {
  x: number;
  y: number;
}

interface Entity {
  id: string;
  position: Position;
  type: 'player' | 'enemy';
  sprite: string;
  health: number;
  maxHealth: number;
}

interface TileData {
  id: number;
  type: 'grass' | 'stone' | 'water' | 'tree';
  walkable: boolean;
  sprite: string;
}

// Sample tilemap data (8x6 grid)
const TILEMAP_DATA: TileData[][] = [
  [
    { id: 1, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 2, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 3, type: 'tree', walkable: false, sprite: '🌳' },
    { id: 4, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 5, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 6, type: 'stone', walkable: true, sprite: '🪨' },
    { id: 7, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 8, type: 'grass', walkable: true, sprite: '🌱' }
  ],
  [
    { id: 9, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 10, type: 'stone', walkable: true, sprite: '🪨' },
    { id: 11, type: 'stone', walkable: true, sprite: '🪨' },
    { id: 12, type: 'stone', walkable: true, sprite: '🪨' },
    { id: 13, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 14, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 15, type: 'tree', walkable: false, sprite: '🌳' },
    { id: 16, type: 'grass', walkable: true, sprite: '🌱' }
  ],
  [
    { id: 17, type: 'water', walkable: false, sprite: '🌊' },
    { id: 18, type: 'water', walkable: false, sprite: '🌊' },
    { id: 19, type: 'water', walkable: false, sprite: '🌊' },
    { id: 20, type: 'stone', walkable: true, sprite: '🪨' },
    { id: 21, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 22, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 23, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 24, type: 'grass', walkable: true, sprite: '🌱' }
  ],
  [
    { id: 25, type: 'water', walkable: false, sprite: '🌊' },
    { id: 26, type: 'water', walkable: false, sprite: '🌊' },
    { id: 27, type: 'water', walkable: false, sprite: '🌊' },
    { id: 28, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 29, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 30, type: 'tree', walkable: false, sprite: '🌳' },
    { id: 31, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 32, type: 'grass', walkable: true, sprite: '🌱' }
  ],
  [
    { id: 33, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 34, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 35, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 36, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 37, type: 'stone', walkable: true, sprite: '🪨' },
    { id: 38, type: 'stone', walkable: true, sprite: '🪨' },
    { id: 39, type: 'stone', walkable: true, sprite: '🪨' },
    { id: 40, type: 'grass', walkable: true, sprite: '🌱' }
  ],
  [
    { id: 41, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 42, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 43, type: 'tree', walkable: false, sprite: '🌳' },
    { id: 44, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 45, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 46, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 47, type: 'grass', walkable: true, sprite: '🌱' },
    { id: 48, type: 'grass', walkable: true, sprite: '🌱' }
  ]
];

const TILE_SIZE = 64; // pixels
const MAP_WIDTH = 8; // tiles
const MAP_HEIGHT = 6; // tiles
const VIEWPORT_WIDTH = 640;
const VIEWPORT_HEIGHT = 480;

const TilemapDemo: React.FC = () => {
  // Player state
  const [player, setPlayer] = useState<Entity>({
    id: 'player',
    position: { x: 128, y: 128 }, // World coordinates (pixels)
    type: 'player',
    sprite: '🧙‍♂️',
    health: 100,
    maxHealth: 100
  });

  // Enemies state
  const [enemies, setEnemies] = useState<Entity[]>([
    {
      id: 'enemy1',
      position: { x: 320, y: 192 },
      type: 'enemy',
      sprite: '👹',
      health: 50,
      maxHealth: 50
    },
    {
      id: 'enemy2',
      position: { x: 448, y: 320 },
      type: 'enemy',
      sprite: '🐺',
      health: 75,
      maxHealth: 75
    }
  ]);

  // Input handling
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const keysPressedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    keysPressedRef.current = keysPressed;
  }, [keysPressed]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        setKeysPressed(prev => new Set(prev).add(key));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
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

  // Movement logic
  useEffect(() => {
    const movePlayer = () => {
      if (keysPressedRef.current.size === 0) return;

      setPlayer(prevPlayer => {
        let newX = prevPlayer.position.x;
        let newY = prevPlayer.position.y;
        const speed = 3; // pixels per frame

        // Handle movement input
        keysPressedRef.current.forEach(key => {
          switch (key) {
            case 'w':
            case 'arrowup':
              newY = Math.max(0, newY - speed);
              break;
            case 's':
            case 'arrowdown':
              newY = Math.min((MAP_HEIGHT * TILE_SIZE) - TILE_SIZE, newY + speed);
              break;
            case 'a':
            case 'arrowleft':
              newX = Math.max(0, newX - speed);
              break;
            case 'd':
            case 'arrowright':
              newX = Math.min((MAP_WIDTH * TILE_SIZE) - TILE_SIZE, newX + speed);
              break;
          }
        });

        // Check collision with tilemap
        const tileX = Math.floor(newX / TILE_SIZE);
        const tileY = Math.floor(newY / TILE_SIZE);
        
        if (tileX >= 0 && tileX < MAP_WIDTH && tileY >= 0 && tileY < MAP_HEIGHT) {
          const tile = TILEMAP_DATA[tileY][tileX];
          if (tile.walkable) {
            return { ...prevPlayer, position: { x: newX, y: newY } };
          }
        }

        return prevPlayer;
      });
    };

    const gameLoop = setInterval(movePlayer, 16); // ~60fps
    return () => clearInterval(gameLoop);
  }, []);

  // Simple enemy AI - move towards player
  useEffect(() => {
    const updateEnemies = () => {
      setEnemies(prevEnemies => 
        prevEnemies.map(enemy => {
          const dx = player.position.x - enemy.position.x;
          const dy = player.position.y - enemy.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 5) { // Don't move if very close
            const speed = 1; // Enemy speed
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

    const aiLoop = setInterval(updateEnemies, 50); // Update AI every 50ms
    return () => clearInterval(aiLoop);
  }, [player.position]);

  // Render tilemap as fixed background
  const renderTilemap = () => {
    return TILEMAP_DATA.map((row, rowIndex) =>
      row.map((tile, colIndex) => (
        <div
          key={tile.id}
          className="tile"
          style={{
            position: 'absolute',
            left: colIndex * TILE_SIZE,
            top: rowIndex * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            backgroundColor: getTileBackgroundColor(tile.type),
            border: '1px solid rgba(0,0,0,0.1)',
            userSelect: 'none'
          }}
        >
          {tile.sprite}
        </div>
      ))
    );
  };

  // Get background color for tile types
  const getTileBackgroundColor = (type: TileData['type']): string => {
    switch (type) {
      case 'grass': return '#90EE90';
      case 'stone': return '#A9A9A9';
      case 'water': return '#87CEEB';
      case 'tree': return '#228B22';
      default: return '#FFFFFF';
    }
  };

  // Render entity (player or enemy)
  const renderEntity = (entity: Entity) => (
    <div
      key={entity.id}
      className="entity"
      style={{
        position: 'absolute',
        left: entity.position.x,
        top: entity.position.y,
        width: TILE_SIZE,
        height: TILE_SIZE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
        zIndex: entity.type === 'player' ? 100 : 50,
        transition: entity.type === 'enemy' ? 'all 0.05s linear' : 'none',
        userSelect: 'none',
        pointerEvents: 'none'
      }}
    >
      {entity.sprite}
      
      {/* Health bar */}
      <div
        style={{
          position: 'absolute',
          top: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 48,
          height: 4,
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${(entity.health / entity.maxHealth) * 100}%`,
            height: '100%',
            backgroundColor: entity.type === 'player' ? '#00FF00' : '#FF0000',
            transition: 'width 0.3s ease'
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="tilemap-demo">
      <h2 style={{ margin: '20px', color: '#333' }}>
        Fixed Tilemap Demo - Use WASD or Arrow Keys to Move
      </h2>
      
      {/* Game viewport container */}
      <div
        className="game-viewport"
        style={{
          position: 'relative',
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
          margin: '20px auto',
          border: '3px solid #333',
          overflow: 'hidden',
          backgroundColor: '#87CEEB'
        }}
      >
        {/* ✅ LAYER 1: STATIC MAP - Never moves */}
        <div
          className="map-layer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: MAP_WIDTH * TILE_SIZE,
            height: MAP_HEIGHT * TILE_SIZE,
            zIndex: 1
          }}
        >
          {renderTilemap()}
        </div>

        {/* ✅ LAYER 2: ENTITIES - Move independently on top of map */}
        <div
          className="entities-layer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: MAP_WIDTH * TILE_SIZE,
            height: MAP_HEIGHT * TILE_SIZE,
            zIndex: 10
          }}
        >
          {/* Render player */}
          {renderEntity(player)}
          
          {/* Render enemies */}
          {enemies.map(enemy => renderEntity(enemy))}
        </div>

        {/* ✅ LAYER 3: UI OVERLAY - Always stays on screen */}
        <div
          className="ui-layer"
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '14px',
            fontFamily: 'monospace'
          }}
        >
          <div>Player Position: ({Math.round(player.position.x)}, {Math.round(player.position.y)})</div>
          <div>Tile: ({Math.floor(player.position.x / TILE_SIZE)}, {Math.floor(player.position.y / TILE_SIZE)})</div>
          <div>Health: {player.health}/{player.maxHealth}</div>
          <div>Enemies: {enemies.length}</div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ margin: '20px', textAlign: 'center', color: '#666' }}>
        <p><strong>Controls:</strong> WASD or Arrow Keys to move</p>
        <p><strong>Features:</strong> Fixed tilemap, collision detection, enemy AI, health bars</p>
        <p><strong>Architecture:</strong> Separate layers for map (static) and entities (dynamic)</p>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .tile {
          box-sizing: border-box;
        }
        
        .entity {
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
        }
        
        .game-viewport {
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default TilemapDemo;