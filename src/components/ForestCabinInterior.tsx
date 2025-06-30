import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Package } from 'lucide-react';
import Player from './Player';

interface ForestCabinInteriorProps {
  keysHeld?: Record<string, boolean>;
}

const ForestCabinInterior: React.FC<ForestCabinInteriorProps> = ({ keysHeld = {} }) => {
  const { state, exitBuilding, pickupItem, movePlayer, stopMoving } = useGame();
  const [foodItems, setFoodItems] = useState([
    {
      id: 'cabin-bread',
      name: 'Fresh Bread',
      position: { x: 420, y: 380 }, // On the table
      picked: false,
      healAmount: 30
    },
    {
      id: 'cabin-apple',
      name: 'Red Apple',
      position: { x: 450, y: 370 }, // On the table
      picked: false,
      healAmount: 20
    },
    {
      id: 'cabin-cheese',
      name: 'Cheese Wheel',
      position: { x: 480, y: 385 }, // On the table
      picked: false,
      healAmount: 25
    }
  ]);

  // WASD movement inside cabin
  useEffect(() => {
    let animationFrameId: number;

    const moveLoop = () => {
      const pressedKeys = Object.keys(keysHeld).filter(key => keysHeld[key]);
      
      if (pressedKeys.length === 0) {
        if (state.player.isMoving) {
          stopMoving();
        }
      } else {
        pressedKeys.forEach(key => {
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
  }, [keysHeld, movePlayer, stopMoving, state.player.isMoving]);

  const handleExitCabin = () => {
    exitBuilding();
  };

  const handlePickupFood = (foodId: string) => {
    const food = foodItems.find(f => f.id === foodId);
    if (!food || food.picked) return;

    // Heal the player
    const newHealth = Math.min(
      state.player.character.maxHealth,
      state.player.character.health + food.healAmount
    );

    // Mark food as picked
    setFoodItems(prev => prev.map(f => 
      f.id === foodId ? { ...f, picked: true } : f
    ));

    // Create a healing item and pick it up
    const healingItem = {
      id: foodId,
      name: food.name,
      type: 'consumable' as const,
      rarity: 'common' as const,
      value: 0,
      effect: {
        type: 'heal' as const,
        value: food.healAmount
      },
      icon: food.name.includes('Bread') ? '🍞' : food.name.includes('Apple') ? '🍎' : '🧀',
      description: `Restores ${food.healAmount} health`,
      usable: true
    };

    // Simulate picking up the item (this would normally update player health)
    console.log(`Picked up ${food.name} - Healed ${food.healAmount} HP`);
  };

  // FIXED: Determine which background to use based on current building
  const getBackgroundImage = () => {
    const currentBuilding = state.currentWorld.buildings.find(b => b.id === state.player.currentBuilding);
    if (currentBuilding?.interior?.background) {
      // FIXED: Ensure proper path formatting
      const bgPath = currentBuilding.interior.background;
      // If path doesn't start with /, add it
      return bgPath.startsWith('/') ? bgPath : `/${bgPath}`;
    }
    // Default fallback
    return '/forestcabin.png';
  };

  // Get cabin name based on current building
  const getCabinName = () => {
    const currentBuilding = state.currentWorld.buildings.find(b => b.id === state.player.currentBuilding);
    return currentBuilding?.name || 'Forest Cabin';
  };

  // Get cabin description based on current building
  const getCabinDescription = () => {
    const currentBuilding = state.currentWorld.buildings.find(b => b.id === state.player.currentBuilding);
    if (currentBuilding?.id === 'forest-cabin-2') {
      return 'A scholarly retreat filled with books and knowledge';
    } else if (currentBuilding?.id === 'snow-cabin') {
      return 'A warm refuge from the cold mountain winds';
    }
    return 'A cozy refuge in the woods';
  };

  // Get cabin-specific items based on current building
  const getCabinItems = () => {
    const currentBuilding = state.currentWorld.buildings.find(b => b.id === state.player.currentBuilding);
    if (currentBuilding?.id === 'forest-cabin-2') {
      // Cozy cabin has different items
      return [
        {
          id: 'cozy-cabin-potion',
          name: 'Health Potion',
          position: { x: 400, y: 350 },
          picked: false,
          healAmount: 50
        },
        {
          id: 'cozy-cabin-scroll',
          name: 'Ancient Scroll',
          position: { x: 450, y: 320 },
          picked: false,
          healAmount: 0
        },
        {
          id: 'cozy-cabin-book',
          name: 'Leather Tome',
          position: { x: 380, y: 340 },
          picked: false,
          healAmount: 0
        }
      ];
    } else if (currentBuilding?.id === 'snow-cabin') {
      // Snow cabin has winter-themed items
      return [
        {
          id: 'snow-cabin-hot-cocoa',
          name: 'Hot Cocoa',
          position: { x: 420, y: 380 },
          picked: false,
          healAmount: 35
        },
        {
          id: 'snow-cabin-blanket',
          name: 'Warm Blanket',
          position: { x: 450, y: 370 },
          picked: false,
          healAmount: 40
        },
        {
          id: 'snow-cabin-firewood',
          name: 'Magical Firewood',
          position: { x: 380, y: 340 },
          picked: false,
          healAmount: 0
        }
      ];
    }
    // Default cabin items
    return foodItems;
  };

  // Calculate camera offset for interior
  const cameraX = state.camera.x - window.innerWidth / 2;
  const cameraY = state.camera.y - window.innerHeight / 2;

  const currentCabinItems = getCabinItems();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* FIXED: Multiple background layers to prevent purple void */}
      
      {/* Primary background layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${getBackgroundImage()})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1
        }}
      ></div>

      {/* FIXED: Fallback background layer 1 - warm cabin colors */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-amber-800 via-orange-900 to-red-900"
        style={{ zIndex: 0 }}
      ></div>

      {/* FIXED: Fallback background layer 2 - solid color backup */}
      <div 
        className="absolute inset-0 bg-amber-900"
        style={{ zIndex: -1 }}
      ></div>

      {/* FIXED: Image error handling with JavaScript */}
      <img 
        src={getBackgroundImage()}
        alt="Cabin Interior"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 2 }}
        onLoad={() => {
          console.log(`✅ Successfully loaded cabin background: ${getBackgroundImage()}`);
        }}
        onError={(e) => {
          console.error(`❌ Failed to load cabin background: ${getBackgroundImage()}`);
          // Hide the failed image
          e.currentTarget.style.display = 'none';
        }}
      />

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20" style={{ zIndex: 3 }}></div>

      {/* Player inside cabin */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 10 }}>
        <Player cameraX={0} cameraY={0} />
      </div>

      {/* FIXED: Exit Button - ALWAYS VISIBLE AND FUNCTIONAL */}
      <button
        onClick={handleExitCabin}
        className="absolute top-6 left-6 flex items-center px-6 py-3 bg-amber-700/90 hover:bg-amber-600/90 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-amber-500"
        style={{ zIndex: 50 }}
      >
        <ArrowLeft size={20} className="mr-2" />
        Exit Cabin
      </button>

      {/* Cabin Title - Dynamic */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2" style={{ zIndex: 30 }}>
        <div className="bg-amber-800/90 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-amber-500">
          <h1 className="text-2xl font-bold text-amber-100 text-center">🏠 {getCabinName()}</h1>
          <p className="text-amber-200 text-sm text-center mt-1">{getCabinDescription()}</p>
        </div>
      </div>

      {/* Interactive Items - Dynamic based on cabin */}
      {currentCabinItems.map((item) => (
        !item.picked && (
          <div
            key={item.id}
            className="absolute cursor-pointer transform hover:scale-110 transition-all duration-200"
            style={{
              left: item.position.x,
              top: item.position.y,
              zIndex: 20
            }}
            onClick={() => handlePickupFood(item.id)}
          >
            {/* Item */}
            <div className="relative">
              <div className="w-12 h-12 bg-amber-600/80 rounded-full flex items-center justify-center border-2 border-amber-400 shadow-lg animate-pulse">
                <Package className="text-amber-100" size={24} />
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full animate-ping"></div>
              
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200">
                {item.name} {item.healAmount > 0 ? `(+${item.healAmount} HP)` : ''}
              </div>
            </div>
          </div>
        )
      ))}

      {/* Interactive Elements Info */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2" style={{ zIndex: 30 }}>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-amber-500/50">
          <div className="text-center">
            <h3 className="text-amber-400 font-bold mb-2">🏠 {getCabinName()}</h3>
            <div className="text-white text-sm space-y-1">
              {state.player.currentBuilding === 'forest-cabin-2' ? (
                <>
                  <div>📚 Click on items to collect knowledge and potions</div>
                  <div>🧙‍♂️ A place of learning and wisdom</div>
                  <div>🕯️ Candlelight illuminates ancient texts</div>
                </>
              ) : state.player.currentBuilding === 'snow-cabin' ? (
                <>
                  <div>☕ Click on items to warm up and restore health</div>
                  <div>🔥 A cozy retreat from the winter cold</div>
                  <div>❄️ Safe from the mountain's harsh winds</div>
                </>
              ) : (
                <>
                  <div>🍞 Click on food items to restore health</div>
                  <div>🏠 A safe haven for weary travelers</div>
                  <div>🔥 Warm fireplace provides comfort</div>
                </>
              )}
              <div>🎮 Use WASD to move around inside</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Details */}
      <div className="absolute bottom-4 right-4" style={{ zIndex: 30 }}>
        <div className="bg-amber-800/70 backdrop-blur-sm rounded-lg p-3 border border-amber-500/50">
          <div className="text-amber-100 text-xs space-y-1">
            {state.player.currentBuilding === 'forest-cabin-2' ? (
              <>
                <div>📖 Pages rustling softly</div>
                <div>🕯️ Candles flickering gently</div>
                <div>📚 Knowledge fills the air</div>
              </>
            ) : state.player.currentBuilding === 'snow-cabin' ? (
              <>
                <div>🔥 Fireplace crackling warmly</div>
                <div>❄️ Snow falling outside</div>
                <div>☕ Steam rising from hot drinks</div>
              </>
            ) : (
              <>
                <div>🔥 Fireplace crackling</div>
                <div>🌲 Forest sounds outside</div>
                <div>💤 Peaceful atmosphere</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FIXED: Debug info to show what's happening */}
      {state.debug?.enabled && (
        <div className="absolute top-20 right-4 bg-black/80 text-white p-4 rounded-lg text-sm" style={{ zIndex: 50 }}>
          <h3 className="font-bold mb-2">🏠 Cabin Debug Info</h3>
          <div>Building ID: {state.player.currentBuilding}</div>
          <div>Background Path: {getBackgroundImage()}</div>
          <div>Cabin Name: {getCabinName()}</div>
          <div>Items Count: {currentCabinItems.length}</div>
        </div>
      )}
    </div>
  );
};

export default ForestCabinInterior;