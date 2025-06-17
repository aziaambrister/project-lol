import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, DollarSign } from 'lucide-react';

const Inventory: React.FC = () => {
  const { state, useItem, equipItem, unequipItem } = useGame();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [tab, setTab] = useState<'inventory' | 'equipped'>('inventory');
  
  const { inventory, equippedItems } = state.player;
  
  const handleUseItem = (itemId: string) => {
    useItem(itemId);
    setSelectedItem(null);
  };
  
  const handleEquipItem = (itemId: string) => {
    equipItem(itemId);
    setSelectedItem(null);
  };
  
  const handleUnequipItem = (slot: 'weapon' | 'armor') => {
    unequipItem(slot);
  };
  
  const getItemsByType = (type: string) => {
    return inventory.filter(item => item.type === type);
  };
  
  const renderItemDetails = () => {
    if (!selectedItem) return null;
    
    const item = inventory.find(i => i.id === selectedItem);
    if (!item) return null;
    
    return (
      <div className="p-4 border-l border-gray-700">
        <div className="flex items-center mb-4">
          <button 
            className="p-1 bg-gray-700 hover:bg-gray-600 rounded-md mr-3"
            onClick={() => setSelectedItem(null)}
          >
            <ArrowLeft size={16} />
          </button>
          <h3 className="text-lg font-bold">{item.name}</h3>
        </div>
        
        <div className="mb-4">
          <div className="text-2xl mb-2">{item.icon}</div>
          <div className="text-sm text-gray-300 mb-2">{item.description}</div>
          <div className="flex items-center text-sm">
            <DollarSign size={12} className="text-yellow-400 mr-1" />
            <span>Value: {item.value}</span>
          </div>
          <div className="text-sm mt-1">
            <span className={`
              px-2 py-0.5 rounded-full text-xs 
              ${item.rarity === 'common' ? 'bg-gray-600' : 
                item.rarity === 'uncommon' ? 'bg-green-700' : 
                item.rarity === 'rare' ? 'bg-blue-700' : 
                item.rarity === 'epic' ? 'bg-purple-700' : 'bg-yellow-700'}
            `}>
              {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
            </span>
          </div>
        </div>
        
        {item.effect && (
          <div className="mb-4 text-sm">
            <h4 className="font-semibold mb-1">Effects:</h4>
            <div>
              {item.effect.type === 'heal' && `Restores ${item.effect.value} health`}
              {item.effect.type === 'damage' && `Adds ${item.effect.value} damage`}
              {item.effect.type === 'buff' && `Increases ${item.effect.type === 'buff' ? 'defense' : 'attack'} by ${item.effect.value}`}
              {item.effect.duration && ` for ${item.effect.duration} turns`}
            </div>
          </div>
        )}
        
        <div className="mt-4 space-y-2">
          {item.usable && (
            <button 
              className="w-full py-2 bg-green-700 hover:bg-green-600 rounded-md"
              onClick={() => handleUseItem(item.id)}
            >
              Use
            </button>
          )}
          
          {(item.type === 'weapon' || item.type === 'armor') && (
            <button 
              className="w-full py-2 bg-blue-700 hover:bg-blue-600 rounded-md"
              onClick={() => handleEquipItem(item.id)}
            >
              Equip
            </button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-90 text-white z-20 overflow-hidden">
      <div className="container mx-auto h-full p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Inventory</h2>
        
        {/* Tabs */}
        <div className="flex mb-4 border-b border-gray-700">
          <button 
            className={`px-4 py-2 ${tab === 'inventory' ? 'bg-gray-700 border-t border-l border-r border-gray-600' : 'bg-transparent'} rounded-t-md`}
            onClick={() => setTab('inventory')}
          >
            Inventory
          </button>
          <button 
            className={`px-4 py-2 ${tab === 'equipped' ? 'bg-gray-700 border-t border-l border-r border-gray-600' : 'bg-transparent'} rounded-t-md`}
            onClick={() => setTab('equipped')}
          >
            Equipped
          </button>
        </div>
        
        {/* Inventory content */}
        <div className="flex-1 overflow-hidden">
          {tab === 'inventory' ? (
            <div className="flex h-full">
              {/* Item list */}
              <div className="w-2/3 pr-4 overflow-y-auto">
                {/* Weapons */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-yellow-400">Weapons</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {getItemsByType('weapon').length > 0 ? (
                      getItemsByType('weapon').map(item => (
                        <div 
                          key={item.id}
                          className={`
                            p-3 bg-gray-800 hover:bg-gray-700 rounded-md cursor-pointer text-center 
                            ${selectedItem === item.id ? 'ring-2 ring-yellow-400' : ''}
                          `}
                          onClick={() => setSelectedItem(item.id)}
                        >
                          <div className="text-2xl mb-1">{item.icon}</div>
                          <div className="text-sm truncate">{item.name}</div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 text-gray-400 text-sm">No weapons in inventory</div>
                    )}
                  </div>
                </div>
                
                {/* Armor */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-blue-400">Armor</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {getItemsByType('armor').length > 0 ? (
                      getItemsByType('armor').map(item => (
                        <div 
                          key={item.id}
                          className={`
                            p-3 bg-gray-800 hover:bg-gray-700 rounded-md cursor-pointer text-center
                            ${selectedItem === item.id ? 'ring-2 ring-yellow-400' : ''}
                          `}
                          onClick={() => setSelectedItem(item.id)}
                        >
                          <div className="text-2xl mb-1">{item.icon}</div>
                          <div className="text-sm truncate">{item.name}</div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 text-gray-400 text-sm">No armor in inventory</div>
                    )}
                  </div>
                </div>
                
                {/* Consumables */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-green-400">Consumables</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {getItemsByType('consumable').length > 0 ? (
                      getItemsByType('consumable').map(item => (
                        <div 
                          key={item.id}
                          className={`
                            p-3 bg-gray-800 hover:bg-gray-700 rounded-md cursor-pointer text-center
                            ${selectedItem === item.id ? 'ring-2 ring-yellow-400' : ''}
                          `}
                          onClick={() => setSelectedItem(item.id)}
                        >
                          <div className="text-2xl mb-1">{item.icon}</div>
                          <div className="text-sm truncate">{item.name}</div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 text-gray-400 text-sm">No consumables in inventory</div>
                    )}
                  </div>
                </div>
                
                {/* Key Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-purple-400">Key Items</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {[...getItemsByType('key'), ...getItemsByType('quest')].length > 0 ? (
                      [...getItemsByType('key'), ...getItemsByType('quest')].map(item => (
                        <div 
                          key={item.id}
                          className={`
                            p-3 bg-gray-800 hover:bg-gray-700 rounded-md cursor-pointer text-center
                            ${selectedItem === item.id ? 'ring-2 ring-yellow-400' : ''}
                          `}
                          onClick={() => setSelectedItem(item.id)}
                        >
                          <div className="text-2xl mb-1">{item.icon}</div>
                          <div className="text-sm truncate">{item.name}</div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 text-gray-400 text-sm">No key items in inventory</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Item details */}
              <div className="w-1/3 bg-gray-800 rounded-md">
                {selectedItem ? renderItemDetails() : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <p>Select an item to view details</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-800 rounded-md">
              <h3 className="text-lg font-semibold mb-4">Currently Equipped</h3>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Weapon slot */}
                <div className="border border-gray-700 rounded-md p-4">
                  <h4 className="text-yellow-400 font-medium mb-3">Weapon</h4>
                  {equippedItems.weapon ? (
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center text-2xl mr-4">
                        {equippedItems.weapon.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold">{equippedItems.weapon.name}</h5>
                        <p className="text-sm text-gray-300 mt-1">{equippedItems.weapon.description}</p>
                        {equippedItems.weapon.effect && (
                          <p className="text-sm text-green-400 mt-2">
                            +{equippedItems.weapon.effect.value} Damage
                          </p>
                        )}
                        <button 
                          className="mt-3 px-3 py-1 bg-red-700 hover:bg-red-600 text-sm rounded-md"
                          onClick={() => handleUnequipItem('weapon')}
                        >
                          Unequip
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">No weapon equipped</div>
                  )}
                </div>
                
                {/* Armor slot */}
                <div className="border border-gray-700 rounded-md p-4">
                  <h4 className="text-blue-400 font-medium mb-3">Armor</h4>
                  {equippedItems.armor ? (
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center text-2xl mr-4">
                        {equippedItems.armor.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold">{equippedItems.armor.name}</h5>
                        <p className="text-sm text-gray-300 mt-1">{equippedItems.armor.description}</p>
                        {equippedItems.armor.effect && (
                          <p className="text-sm text-green-400 mt-2">
                            +{equippedItems.armor.effect.value} Defense
                          </p>
                        )}
                        <button 
                          className="mt-3 px-3 py-1 bg-red-700 hover:bg-red-600 text-sm rounded-md"
                          onClick={() => handleUnequipItem('armor')}
                        >
                          Unequip
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">No armor equipped</div>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Current Stats:</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-700 p-3 rounded-md">
                    <div className="text-gray-300">Strength</div>
                    <div className="text-lg">{state.player.character.strength}</div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-md">
                    <div className="text-gray-300">Defense</div>
                    <div className="text-lg">{state.player.character.defense}</div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-md">
                    <div className="text-gray-300">Speed</div>
                    <div className="text-lg">{state.player.character.speed}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;