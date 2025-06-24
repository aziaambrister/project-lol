import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Package } from 'lucide-react';

const ForestCabinInterior: React.FC = () => {
  const { state, exitBuilding, pickupItem } = useGame();
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

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Forest Cabin Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/forestcabin.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Exit Button */}
      <button
        onClick={handleExitCabin}
        className="absolute top-6 left-6 z-30 flex items-center px-6 py-3 bg-amber-700/90 hover:bg-amber-600/90 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-amber-500"
      >
        <ArrowLeft size={20} className="mr-2" />
        Exit Cabin
      </button>

      {/* Cabin Title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-amber-800/90 backdrop-blur-sm rounded-lg px-6 py-3 border-2 border-amber-500">
          <h1 className="text-2xl font-bold text-amber-100 text-center">🏠 Forest Cabin</h1>
          <p className="text-amber-200 text-sm text-center mt-1">A cozy refuge in the woods</p>
        </div>
      </div>

      {/* Food Items on Table */}
      {foodItems.map((food) => (
        !food.picked && (
          <div
            key={food.id}
            className="absolute z-20 cursor-pointer transform hover:scale-110 transition-all duration-200"
            style={{
              left: food.position.x,
              top: food.position.y
            }}
            onClick={() => handlePickupFood(food.id)}
          >
            {/* Food Item */}
            <div className="relative">
              <div className="w-12 h-12 bg-amber-600/80 rounded-full flex items-center justify-center border-2 border-amber-400 shadow-lg animate-pulse">
                <Package className="text-amber-100" size={24} />
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full animate-ping"></div>
              
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200">
                {food.name} (+{food.healAmount} HP)
              </div>
            </div>
          </div>
        )
      ))}

      {/* Interactive Elements Info */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-amber-500/50">
          <div className="text-center">
            <h3 className="text-amber-400 font-bold mb-2">🍽️ Forest Cabin</h3>
            <div className="text-white text-sm space-y-1">
              <div>🍞 Click on food items to restore health</div>
              <div>🏠 A safe haven for weary travelers</div>
              <div>🔥 Warm fireplace provides comfort</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient Details */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="bg-amber-800/70 backdrop-blur-sm rounded-lg p-3 border border-amber-500/50">
          <div className="text-amber-100 text-xs space-y-1">
            <div>🔥 Fireplace crackling</div>
            <div>🌲 Forest sounds outside</div>
            <div>💤 Peaceful atmosphere</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForestCabinInterior;