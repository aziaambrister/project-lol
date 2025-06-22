import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Coins, ShoppingCart, Star, CreditCard, Crown, Zap } from 'lucide-react';
import { allItems } from '../data/items';
import { stripeProducts } from '../stripe-config';
import { useAuth } from '../hooks/useAuth';

interface ShopProps {
  onClose: () => void;
}

const Shop: React.FC<ShopProps> = ({ onClose }) => {
  const { state, purchaseItem } = useGame();
  const { user, supabase } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'weapons' | 'armor' | 'consumables' | 'upgrades' | 'premium'>('weapons');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  
  const { player } = state;
  
  // Shop inventory with prices
  const shopItems = {
    weapons: [
      { ...allItems.find(item => item.id === 'ninja-katana')!, price: 150 },
      { ...allItems.find(item => item.id === 'mystic-bow')!, price: 200 },
      { ...allItems.find(item => item.id === 'battle-staff')!, price: 250 },
      { ...allItems.find(item => item.id === 'plasma-cannon')!, price: 400 },
      { ...allItems.find(item => item.id === 'legendary-blade')!, price: 800 }
    ],
    armor: [
      { ...allItems.find(item => item.id === 'ninja-garb')!, price: 80 },
      { ...allItems.find(item => item.id === 'archer-cloak')!, price: 120 },
      { ...allItems.find(item => item.id === 'mage-robes')!, price: 180 },
      { ...allItems.find(item => item.id === 'knight-armor')!, price: 250 },
      { ...allItems.find(item => item.id === 'shadow-cloak')!, price: 500 }
    ],
    consumables: [
      { ...allItems.find(item => item.id === 'health-potion')!, price: 30 },
      { ...allItems.find(item => item.id === 'greater-health-potion')!, price: 60 },
      { ...allItems.find(item => item.id === 'super-health-potion')!, price: 120 },
      { ...allItems.find(item => item.id === 'energy-drink')!, price: 50 },
      { ...allItems.find(item => item.id === 'strength-elixir')!, price: 80 }
    ],
    upgrades: [
      {
        id: 'health-upgrade',
        name: 'Health Boost',
        description: 'Permanently increases maximum health by 25 points.',
        type: 'upgrade' as const,
        value: 0,
        rarity: 'uncommon' as const,
        usable: false,
        effect: { type: 'health' as const, value: 25 },
        icon: '❤️',
        price: 200
      },
      {
        id: 'speed-upgrade',
        name: 'Speed Boost',
        description: 'Permanently increases movement speed by 2 points.',
        type: 'upgrade' as const,
        value: 0,
        rarity: 'uncommon' as const,
        usable: false,
        effect: { type: 'speed' as const, value: 2 },
        icon: '💨',
        price: 150
      },
      {
        id: 'damage-upgrade',
        name: 'Damage Boost',
        description: 'Permanently increases attack damage by 3 points.',
        type: 'upgrade' as const,
        value: 0,
        rarity: 'uncommon' as const,
        usable: false,
        effect: { type: 'damage' as const, value: 3 },
        icon: '⚔️',
        price: 180
      },
      {
        id: 'defense-upgrade',
        name: 'Defense Boost',
        description: 'Permanently increases defense by 2 points.',
        type: 'upgrade' as const,
        value: 0,
        rarity: 'uncommon' as const,
        usable: false,
        effect: { type: 'defense' as const, value: 2 },
        icon: '🛡️',
        price: 160
      }
    ],
    premium: stripeProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      type: 'premium' as const,
      value: product.coins || 0,
      rarity: product.bundle ? 'legendary' as const : 'rare' as const,
      usable: true,
      icon: product.bundle ? '👑' : '🪙',
      realPrice: product.price,
      coins: product.coins,
      bundle: product.bundle,
      includes: product.includes,
      priceId: product.priceId,
      mode: product.mode
    }))
  };
  
  const currentItems = shopItems[selectedCategory];
  
  const handlePurchase = (item: any, price: number) => {
    if (player.currency >= price) {
      purchaseItem(item.id, price, item);
      setSelectedItem(null);
    }
  };

  const handlePremiumPurchase = async (item: any) => {
    if (!user) {
      setCheckoutError('Please log in to make purchases');
      return;
    }

    setIsLoading(true);
    setCheckoutError(null);

    try {
      // Get the current user's session to obtain the access token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        throw new Error('Failed to authenticate user');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: item.priceId,
          mode: item.mode,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/shop`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setCheckoutError(error.message || 'Failed to start checkout process');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'uncommon': return 'text-green-400 border-green-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="mr-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Fighter's Shop
              </h1>
              <p className="text-gray-300 mt-2">Upgrade your arsenal and abilities</p>
            </div>
          </div>
          
          {/* Currency Display */}
          <div className="flex items-center bg-yellow-500/20 rounded-lg px-6 py-3 border border-yellow-400/50">
            <Coins className="text-yellow-400 mr-3" size={24} />
            <div>
              <div className="text-yellow-400 font-bold text-xl">{player.currency}</div>
              <div className="text-yellow-300 text-sm">Coins</div>
            </div>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          {Object.keys(shopItems).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as any)}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 whitespace-nowrap flex items-center ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {category === 'premium' && <CreditCard className="mr-2" size={18} />}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Premium Section Header */}
        {selectedCategory === 'premium' && (
          <div className="mb-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-purple-500/50">
            <div className="flex items-center mb-4">
              <Crown className="text-yellow-400 mr-3" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-yellow-400">Premium Store</h2>
                <p className="text-gray-300">Purchase with real money for instant rewards</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Zap className="text-blue-400 mr-2" size={16} />
                <span>Instant delivery</span>
              </div>
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-2" size={16} />
                <span>Exclusive content</span>
              </div>
              <div className="flex items-center">
                <Crown className="text-purple-400 mr-2" size={16} />
                <span>Support development</span>
              </div>
            </div>
            {!user && (
              <div className="mt-4 bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3">
                <div className="text-yellow-400 font-bold text-sm">⚠️ Login Required</div>
                <div className="text-white text-xs">Please log in to purchase premium items</div>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {checkoutError && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <div className="text-red-400 font-bold">Payment Error</div>
            <div className="text-white text-sm">{checkoutError}</div>
          </div>
        )}
        
        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentItems.map((item) => {
            const canAfford = selectedCategory === 'premium' ? !!user : player.currency >= item.price;
            const isSelected = selectedItem === item.id;
            const isPremium = selectedCategory === 'premium';
            
            return (
              <div
                key={item.id}
                className={`bg-gray-800 rounded-lg p-6 border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 relative ${
                  isSelected ? 'border-yellow-400 shadow-lg shadow-yellow-400/30' : 
                  canAfford ? 'border-gray-600 hover:border-gray-500' : 'border-red-600 opacity-60'
                } ${isPremium ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30' : ''}`}
                onClick={() => setSelectedItem(isSelected ? null : item.id)}
              >
                {/* Premium Badge */}
                {isPremium && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                    PREMIUM
                  </div>
                )}

                {/* Bundle Badge */}
                {item.bundle && (
                  <div className="absolute -top-2 -left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    BUNDLE
                  </div>
                )}
                
                {/* Item Icon */}
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{item.icon}</div>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <div className={`text-sm px-2 py-1 rounded-full inline-block mt-2 border ${getRarityColor(item.rarity)}`}>
                    {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                  </div>
                </div>
                
                {/* Item Description */}
                <p className="text-gray-300 text-sm mb-4 text-center">{item.description}</p>

                {/* Bundle Contents */}
                {item.includes && (
                  <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                    <div className="text-yellow-400 text-sm font-bold mb-2">Bundle Includes:</div>
                    {item.includes.map((bundleItem: any, index: number) => (
                      <div key={index} className="flex items-center text-sm mb-1">
                        <span className="mr-2">{bundleItem.icon}</span>
                        <div>
                          <div className="font-medium">{bundleItem.name}</div>
                          <div className="text-gray-400 text-xs">{bundleItem.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Item Effect */}
                {item.effect && (
                  <div className="bg-gray-700 rounded-lg p-3 mb-4">
                    <div className="text-green-400 text-sm font-bold">Effect:</div>
                    <div className="text-white text-sm">
                      {item.effect.type === 'heal' && `Restores ${item.effect.value} health`}
                      {item.effect.type === 'damage' && `+${item.effect.value} Attack Damage`}
                      {item.effect.type === 'buff' && `+${item.effect.value} Defense`}
                      {item.effect.type === 'health' && `+${item.effect.value} Max Health`}
                      {item.effect.type === 'speed' && `+${item.effect.value} Movement Speed`}
                      {item.effect.type === 'defense' && `+${item.effect.value} Defense`}
                      {item.effect.duration && ` for ${item.effect.duration} turns`}
                    </div>
                  </div>
                )}
                
                {/* Price and Purchase */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isPremium ? (
                      <>
                        <CreditCard className="text-green-400 mr-2" size={16} />
                        <span className="text-green-400 font-bold">{item.realPrice}</span>
                      </>
                    ) : (
                      <>
                        <Coins className="text-yellow-400 mr-2" size={16} />
                        <span className="text-yellow-400 font-bold">{item.price}</span>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPremium) {
                        handlePremiumPurchase(item);
                      } else {
                        handlePurchase(item, item.price);
                      }
                    }}
                    disabled={(!canAfford && !isPremium) || (isPremium && isLoading)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 flex items-center ${
                      isPremium
                        ? canAfford
                          ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : canAfford
                        ? 'bg-green-600 hover:bg-green-500 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    {isLoading && isPremium ? 'Processing...' : 
                     isPremium ? (canAfford ? 'Buy Now' : 'Login Required') : 
                     canAfford ? 'Buy' : 'Too Expensive'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Shop Info */}
        <div className="mt-12 bg-gray-800/50 rounded-lg p-6 border border-gray-600">
          <div className="flex items-center mb-4">
            <Star className="text-yellow-400 mr-2" size={24} />
            <h3 className="text-xl font-bold">Shop Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
            <div>
              <h4 className="font-bold text-white mb-2">💰 Earning Coins:</h4>
              <ul className="space-y-1">
                <li>• Defeat enemies to earn coins</li>
                <li>• Each enemy drops 10 coins</li>
                <li>• Stronger enemies may drop more</li>
                <li>• Complete quests for bonus rewards</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">🛡️ Equipment:</h4>
              <ul className="space-y-1">
                <li>• Weapons increase attack damage</li>
                <li>• Armor provides defense bonuses</li>
                <li>• Upgrades are permanent improvements</li>
                <li>• Higher rarity = better stats</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">💳 Premium Store:</h4>
              <ul className="space-y-1">
                <li>• Instant coin packages available</li>
                <li>• Exclusive founder character bundle</li>
                <li>• Support game development</li>
                <li>• Secure payment processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;