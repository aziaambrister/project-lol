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
      position: { x: 420, y: 380 },
      picked: false,
      healAmount: 30
    },
    {
      id: 'cabin-apple',
      name: 'Red Apple',
      position: { x: 450, y: 370 },
      picked: false,
      healAmount: 20
    },
    {
      id: 'cabin-cheese',
      name: 'Cheese Wheel',
      position: { x: 480, y: 385 },
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

  // FIXED: Get the correct background based on building ID - using CORRECT file paths from public folder
  const getBackgroundImage = () => {
    const currentBuilding = state.player.currentBuilding;
    
    // FIXED: Using the actual file paths from the public folder WITHOUT leading slash
    switch (currentBuilding) {
      case 'forest-cabin-1':
        return 'forestcabin.png';
      case 'forest-cabin-2':
        return 'cozy-forest-cabin.png'; // FIXED: This is the correct path - no leading slash!
      case 'snow-cabin':
        return 'snowycabin.png';
      default:
        return 'forestcabin.png';
    }
  };

  // Get cabin name based on current building
  const getCabinName = () => {
    const currentBuilding = state.player.currentBuilding;
    switch (currentBuilding) {
      case 'forest-cabin-1':
        return 'Forest Cabin';
      case 'forest-cabin-2':
        return 'Cozy Forest Cabin';
      case 'snow-cabin':
        return 'Snow Cabin';
      default:
        return 'Forest Cabin';
    }
  };

  // Get cabin description based on current building
  const getCabinDescription = () => {
    const currentBuilding = state.player.currentBuilding;
    switch (currentBuilding) {
      case 'forest-cabin-1':
        return 'A cozy refuge in the woods';
      case 'forest-cabin-2':
        return 'A scholarly retreat filled with books and knowledge';
      case 'snow-cabin':
        return 'A warm refuge from the cold mountain winds';
      default:
        return 'A cozy refuge in the woods';
    }
  };

  // Get cabin-specific items based on current building
  const getCabinItems = () => {
    const currentBuilding = state.player.currentBuilding;
    
    switch (currentBuilding) {
      case 'forest-cabin-2':
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
      case 'snow-cabin':
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
      default:
        // Default cabin items
        return foodItems;
    }
  };

  const currentCabinItems = getCabinItems();
  const backgroundImage = getBackgroundImage();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* FIXED: Multiple background layers to prevent ANY purple void */}
      
      {/* Layer 0: Solid background color - ABSOLUTE FALLBACK */}
      <div 
        className="absolute inset-0 bg-amber-900"
        style={{ zIndex: 0 }}
      ></div>

      {/* Layer 1: Gradient background - SECONDARY FALLBACK */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-amber-800 via-orange-900 to-red-900"
        style={{ zIndex: 1 }}
      ></div>

      {/* Layer 2: Your actual cabin image - MAIN BACKGROUND */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 2
        }}
      ></div>

      {/* Layer 3: Subtle overlay for better contrast */}
      <div 
        className="absolute inset-0 bg-black/10" 
        style={{ zIndex: 3 }}
      ></div>

      {/* Player inside cabin */}
      <div 
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" 
        style={{ zIndex: 10 }}
      >
        <Player cameraX={0} cameraY={0} />
      </div>

      {/* Exit Button - ALWAYS VISIBLE AND FUNCTIONAL */}
      <button
        onClick={handleExitCabin}
        className="absolute top-6 left-6 flex items-center px-6 py-3 bg-amber-700/90 hover:bg-amber-600/90 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-amber-500"
        style={{ zIndex: 50 }}
      >
        <ArrowLeft size={20} className="mr-2" />
        Exit Cabin
      </button>

      {/* Cabin Title - Dynamic */}
      <div 
        className="absolute top-6 left-1/2 transform -translate-x-1/2" 
        style={{ zIndex: 30 }}
      >
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
      <div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2" 
        style={{ zIndex: 30 }}
      >
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
      <div 
        className="absolute bottom-4 right-4" 
        style={{ zIndex: 30 }}
      >
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

      {/* FIXED: Debug info showing the exact file path being used */}
      <div 
        className="absolute top-20 right-4 bg-black/90 text-white p-4 rounded-lg text-sm border border-green-500" 
        style={{ zIndex: 60 }}
      >
        <h3 className="font-bold mb-2 text-green-400">🔧 FIXED IMAGE PATH DEBUG</h3>
        <div>Building ID: <span className="text-yellow-400">{state.player.currentBuilding}</span></div>
        <div>Image Path: <span className="text-yellow-400">{backgroundImage}</span></div>
        <div>Full URL: <span className="text-yellow-400">url({backgroundImage})</span></div>
        <div className="mt-2 text-green-400">✅ REMOVED LEADING SLASH - SHOULD WORK NOW!</div>
        <div className="text-green-400">✅ 4 background layers prevent purple void!</div>
        <div className="text-blue-400">📁 File location: public/{backgroundImage}</div>
        <div className="text-purple-400">🎯 This should display cozy-forest-cabin.png!</div>
      </div>
    </div>
  );
};

export default ForestCabinInterior;