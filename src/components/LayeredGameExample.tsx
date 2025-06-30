import React, { useState, useEffect } from 'react';

// ✅ PERFECT EXAMPLE: Static Background + Moving Entities
const LayeredGameExample: React.FC = () => {
  const [playerPos, setPlayerPos] = useState({ x: 300, y: 200 });
  const [enemyPos, setEnemyPos] = useState({ x: 100, y: 100 });

  // Player movement with WASD
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const speed = 5;
      setPlayerPos(prev => {
        switch (e.key.toLowerCase()) {
          case 'w': return { ...prev, y: Math.max(0, prev.y - speed) };
          case 's': return { ...prev, y: Math.min(440, prev.y + speed) };
          case 'a': return { ...prev, x: Math.max(0, prev.x - speed) };
          case 'd': return { ...prev, x: Math.min(600, prev.x + speed) };
          default: return prev;
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Enemy follows player
  useEffect(() => {
    const interval = setInterval(() => {
      setEnemyPos(prev => {
        const dx = playerPos.x - prev.x;
        const dy = playerPos.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          const speed = 1;
          return {
            x: prev.x + (dx / distance) * speed,
            y: prev.y + (dy / distance) * speed
          };
        }
        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [playerPos]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>✅ Perfect Layered Game Architecture</h2>
      
      {/* Game Container */}
      <div style={{ 
        position: 'relative', 
        width: 640, 
        height: 480, 
        border: '2px solid #333',
        margin: '20px 0',
        overflow: 'hidden'
      }}>
        
        {/* ✅ LAYER 1: STATIC MAP - Never moves */}
        <div 
          className="map-layer"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%',
            height: '100%',
            zIndex: 1,
            backgroundImage: `
              linear-gradient(45deg, #90EE90 25%, transparent 25%), 
              linear-gradient(-45deg, #90EE90 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #90EE90 75%), 
              linear-gradient(-45deg, transparent 75%, #90EE90 75%)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
          }}
        >
          {/* Static map elements */}
          <div style={{
            position: 'absolute',
            top: 100,
            left: 200,
            width: 80,
            height: 80,
            backgroundColor: '#8B4513',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px'
          }}>🌳</div>
          
          <div style={{
            position: 'absolute',
            top: 300,
            left: 400,
            width: 120,
            height: 60,
            backgroundColor: '#87CEEB',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px'
          }}>🌊</div>
        </div>

        {/* ✅ LAYER 2: ENTITIES - Move independently */}
        <div 
          className="entities-layer"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%',
            height: '100%',
            zIndex: 10 
          }}
        >
          {/* Player */}
          <div
            style={{
              position: 'absolute',
              left: playerPos.x,
              top: playerPos.y,
              width: 40,
              height: 40,
              fontSize: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              transition: 'all 0.1s ease',
              zIndex: 20
            }}
          >
            🧙‍♂️
          </div>

          {/* Enemy */}
          <div
            style={{
              position: 'absolute',
              left: enemyPos.x,
              top: enemyPos.y,
              width: 40,
              height: 40,
              fontSize: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              transition: 'all 0.05s linear',
              zIndex: 15
            }}
          >
            👹
          </div>
        </div>

        {/* ✅ LAYER 3: UI - Always stays on screen */}
        <div 
          className="ui-layer"
          style={{ 
            position: 'absolute', 
            top: 10, 
            left: 10, 
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}
        >
          <div>Player: ({Math.round(playerPos.x)}, {Math.round(playerPos.y)})</div>
          <div>Enemy: ({Math.round(enemyPos.x)}, {Math.round(enemyPos.y)})</div>
          <div>Use WASD to move</div>
        </div>
      </div>

      {/* Code Example */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '14px',
        marginTop: '20px'
      }}>
        <h3>✅ Code Structure:</h3>
        <pre>{`
<div style={{ position: 'relative', width: 640, height: 480 }}>
  {/* ✅ LAYER 1: STATIC MAP - Never moves */}
  <div className="map" style={{ 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    zIndex: 1 
  }}>
    {/* Render fixed tilemap here */}
  </div>
  
  {/* ✅ LAYER 2: ENTITIES - Move independently */}
  <div className="entities" style={{ 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    zIndex: 10 
  }}>
    {/* Render player and enemies here */}
    <Player position={playerPosition} />
    {enemies.map(enemy => 
      <Enemy key={enemy.id} position={enemy.position} />
    )}
  </div>
  
  {/* ✅ LAYER 3: UI - Always on screen */}
  <div className="ui" style={{ 
    position: 'absolute', 
    top: 10, 
    left: 10, 
    zIndex: 100 
  }}>
    {/* HUD elements */}
  </div>
</div>
        `}</pre>
      </div>

      <div style={{ marginTop: '20px', color: '#666' }}>
        <h3>🎯 Key Points:</h3>
        <ul>
          <li>✅ <strong>Map Layer:</strong> Static background, never moves</li>
          <li>✅ <strong>Entity Layer:</strong> Player and enemies move independently</li>
          <li>✅ <strong>UI Layer:</strong> Always stays on screen</li>
          <li>✅ <strong>Z-Index:</strong> Proper layering (map=1, entities=10, ui=100)</li>
          <li>✅ <strong>Position:</strong> All layers use position: absolute</li>
          <li>✅ <strong>Movement:</strong> Only entity positions change, not the map</li>
        </ul>
      </div>
    </div>
  );
};

export default LayeredGameExample;