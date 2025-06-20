import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Coins, ShoppingBag, Sword, Shield, Heart, Zap } from 'lucide-react';

interface ShopProps {
  onClose: () => void;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'weapon' | 'armor' | 'consumable' | 'upgrade';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  effect: {
    type: 'damage' | 'defense' | 'health' | 'speed' | 'heal';
    value: number;
  };
  icon: string;
  image: string;
  inStock: boolean;
}

const shopItems: ShopItem[] = [
  // Weapons
  {
    id: 'iron-sword',
    name: 'Iron Sword',
    description: 'A sturdy blade forged from quality iron. Increases attack damage.',
    price: 150,
    type: 'weapon',
    rarity: 'common',
    effect: { type: 'damage', value: 8 },
    icon: '⚔️',
    image: '/sword.png',
    inStock: true
  },
  {
    id: 'steel-blade',
    name: 'Steel Blade',
    description: 'A masterfully crafted steel weapon with superior sharpness.',
    price: 300,
    type: 'weapon',
    rarity: 'uncommon',
    effect: { type: 'damage', value: 15 },
    icon: '⚔️',
    image: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=200',
    inStock: true
  },
  {
    id: 'enchanted-sword',
    name: 'Enchanted Sword',
    description: 'A magical blade infused with ancient power.',
    price: 600,
    type: 'weapon',
    rarity: 'rare',
    effect: { type: 'damage', value: 25 },
    icon: '⚔️',
    image: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=200',
    inStock: true
  },
  {
    id: 'legendary-blade',
    name: 'Legendary Blade',
    description: 'A weapon of legend, said to cut through reality itself.',
    price: 1200,
    type: 'weapon',
    rarity: 'legendary',
    effect: { type: 'damage', value: 40 },
    icon: '⚔️',
    image: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=200',
    inStock: true
  },

  // Armor
  {
    id: 'leather-armor',
    name: 'Leather Armor',
    description: 'Basic protection made from treated leather.',
    price: 120,
    type: 'armor',
    rarity: 'common',
    effect: { type: 'defense', value: 5 },
    icon: '🛡️',
    image: 'https://images.pexels.com/photos/14391128/pexels-photo-14391128.jpeg?auto=compress&cs=tinysrgb&w=200',
    inStock: true
  },
  {
    id: 'chain-mail',
    name: 'Chain Mail',
    description: 'Interlocked metal rings provide excellent protection.',
    price: 250,
    type: 'armor',
    rarity: 'uncommon',
    effect: { type: 'defense', value: 10 },
    icon: '🛡️',
    image: 'https://images.pexels.com/photos/14391128/pexels-photo-14391128.jpeg?auto=compress&cs=tinysrgb&w=200',
    inStock: true
  },
  {
    id: 'plate-armor',
    name: 'Plate Armor',
    description: 'Heavy steel plates offer maximum protection.',
    price: 500,
    type: 'armor',
    rarity: 'rare',
    effect: { type: 'defense', value: 18 },
    icon: '🛡️',
    image: 'https://images.pexels.com/photos/14391128/pexels-photo-14391128.jpeg?auto=compress&cs=tinysrgb&w=200',
    inStock: true
  },

  // Consumables
  {
    id: 'health-potion',
    name: 'Health Potion',
    description: 'Instantly restores health when consumed.',
    price: 50,
    type: 'consumable',
    rarity: 'common',
    effect: { type: 'heal', value: 50 },
    icon: '🧪',
    image: 'https://images.pexels.com/photos/3493731/pexels-photo-3493731.jpeg?auto=compress&cs=tinysrgb&w=200',
    inStock: true
  },
  {
    id: 'greater-health-potion',
    name: 'Greater Health Potion',
    description: 'A powerful healing elixir that restores significant health.',
    price: 100,
    type: 'consumable',
    rarity: 'uncommon',
    effect: { type: 'heal', value: 100 },
    icon: '🧪',
    image: 'https://images.pexels.com/photos/3493731/pexels-photo-3493731.jpeg?auto=compress&cs=tinysrgb&w=200',
    inStock: true
  },
  {
    id: 'super-health-potion',
    name: 'Super Health Potion',
    description: 'The ultimate healing potion, restores massive amounts of health.',
    price: 200,
    type: 'consumable',
    rarity: 'rare',
    effect: { type: 'heal', value: 200 },
    icon: '🧪',
    image: 'https://images.pexels.com/photos/3493731/pexels-photo-3493731.jpeg?auto=compress&cs=tinysrgb&w=200',
    inStock: true
  },

  // Upgrades
  {
    id: 'health-upgrade',
    name: 'Vitality Boost',
    description: 'Permanently increases maximum health.',
    price: 400,
    type: 'upgrade',
    rarity: 'rare',
    effect: { type: 'health', value: 25 },
    icon: '❤️',
    image: 'https://images.pexels.com/photos/6633084/pexels-photo-6633084.jpeg?auto=compress&cs=tinysrgb&w=200',
    inStock: true
  },
  {
    id: 'speed-upgrade',
    name: 'Agility Enhancement',
    description: 'Permanently increases movement speed.',
    price: 350,
    type: 'upgrade',
    rarity: 'rare',
    effect: { type: 'speed', value: 2 },
    icon: '⚡',
    image: 'https://images.pexels.com/photos/6633084/pexels-photo-6633084.jpeg?auto=compress&cs=tinysrgb&w=200',
    inStock: true
  }
];

const Shop: React.FC<ShopProps> = ({ onClose }) => {
  const { state, purchaseItem } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'weapon' | 'armor' | 'consumable' | 'upgrade'>('all');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.type === selectedCategory);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-100';
      case 'uncommon': return 'border-green-400 bg-green-100';
      case 'rare': return 'border-blue-400 bg-blue-100';
      case 'epic': return 'border-purple-400 bg-purple-100';
      case 'legendary': return 'border-yellow-400 bg-yellow-100';
      default: return 'border-gray-400 bg-gray-100';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-700';
      case 'uncommon': return 'text-green-700';
      case 'rare': return 'text-blue-700';
      case 'epic': return 'text-purple-700';
      case 'legendary': return 'text-yellow-700';
      default: return 'text-gray-700';
    }
  };

  const handlePurchase = (item: ShopItem) => {
    if (state.player.currency >= item.price) {
      purchaseItem(item.id, item.price, {
        id: item.id,
        name: item.name,
        type: item.type as any,
        rarity: item.rarity as any,
        value: item.price,
        effect: item.effect as any,
        icon: item.icon,
        description: item.description
      });
      setSelectedItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="mr-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center">
              <ShoppingBag className="mr-3 text-yellow-400" size={32} />
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Merchant's Shop
              </h1>
            </div>
          </div>
          
          {/* Coin Display */}
          <div className="flex items-center bg-black/60 backdrop-blur-sm rounded-xl px-6 py-3 border-2 border-yellow-400/60">
            <Coins className="text-yellow-400 mr-3" size={28} />
            <div>
              <div className="text-yellow-400 font-bold text-2xl">{state.player.currency}</div>
              <div className="text-gray-300 text-sm">Coins</div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { key: 'all', label: 'All Items', icon: '🛒' },
            { key: 'weapon', label: 'Weapons', icon: '⚔️' },
            { key: 'armor', label: 'Armor', icon: '🛡️' },
            { key: 'consumable', label: 'Potions', icon: '🧪' },
            { key: 'upgrade', label: 'Upgrades', icon: '⭐' }
          ].map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === category.key
                  ? 'bg-yellow-500 text-black shadow-lg transform scale-105'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${getRarityColor(item.rarity)}`}
              onClick={() => setSelectedItem(item)}
            >
              {/* Item Image */}
              <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-gray-700">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Info */}
              <div className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                <div className={`text-sm font-semibold mb-3 ${getRarityTextColor(item.rarity)}`}>
                  {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                </div>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{item.description}</p>
                
                {/* Effect Display */}
                <div className="flex items-center justify-center mb-4">
                  {item.effect.type === 'damage' && <Sword className="text-red-400 mr-2" size={16} />}
                  {item.effect.type === 'defense' && <Shield className="text-blue-400 mr-2" size={16} />}
                  {item.effect.type === 'heal' && <Heart className="text-green-400 mr-2" size={16} />}
                  {item.effect.type === 'health' && <Heart className="text-red-400 mr-2" size={16} />}
                  {item.effect.type === 'speed' && <Zap className="text-yellow-400 mr-2" size={16} />}
                  <span className="text-white text-sm">
                    +{item.effect.value} {item.effect.type}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-center mb-4">
                  <Coins className="text-yellow-400 mr-2" size={20} />
                  <span className="text-yellow-400 font-bold text-xl">{item.price}</span>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchase(item);
                  }}
                  disabled={state.player.currency < item.price}
                  className={`w-full py-2 px-4 rounded-lg font-bold transition-all duration-300 ${
                    state.player.currency >= item.price
                      ? 'bg-green-600 hover:bg-green-500 text-white transform hover:scale-105'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {state.player.currency >= item.price ? 'Purchase' : 'Insufficient Coins'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border-2 border-yellow-400/60">
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedItem.icon}</div>
                <h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
                <div className={`text-lg font-semibold mb-4 ${getRarityTextColor(selectedItem.rarity)}`}>
                  {selectedItem.rarity.charAt(0).toUpperCase() + selectedItem.rarity.slice(1)}
                </div>
                <p className="text-gray-300 mb-6">{selectedItem.description}</p>
                
                <div className="flex items-center justify-center mb-6">
                  <Coins className="text-yellow-400 mr-2" size={24} />
                  <span className="text-yellow-400 font-bold text-2xl">{selectedItem.price}</span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-500 rounded-lg font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePurchase(selectedItem)}
                    disabled={state.player.currency < selectedItem.price}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-300 ${
                      state.player.currency >= selectedItem.price
                        ? 'bg-green-600 hover:bg-green-500 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shop Info */}
        <div className="mt-12 text-center text-gray-400">
          <p>💰 Defeat enemies to earn coins • 🛒 Purchase upgrades to become stronger</p>
          <p className="mt-2">⚔️ Each enemy defeated rewards 10 coins</p>
        </div>
      </div>
    </div>
  );
};

export default Shop;