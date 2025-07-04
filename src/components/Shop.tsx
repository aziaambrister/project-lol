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
  
  // Shop inventory with prices - Expanded items (REMOVED vialborne-staff)
  const shopItems = {
    weapons: [
      { ...allItems.find(item => item.id === 'ninja-katana')!, price: 150 },
      { ...allItems.find(item => item.id === 'mystic-bow')!, price: 200 },
      { ...allItems.find(item => item.id === 'battle-staff')!, price: 250 },
      { ...allItems.find(item => item.id === 'crystal-sword')!, price: 300 },
      { ...allItems.find(item => item.id === 'flame-spear')!, price: 350 },
      { ...allItems.find(item => item.id === 'thunder-axe')!, price: 380 },
      { ...allItems.find(item => item.id === 'plasma-cannon')!, price: 400 },
      { ...allItems.find(item => item.id === 'ice-hammer')!, price: 450 },
      { ...allItems.find(item => item.id === 'legendary-blade')!, price: 800 }
      // REMOVED vialborne-staff as it's exclusive to mystic alchemist
    ],
    armor: [
      { ...allItems.find(item => item.id === 'ninja-garb')!, price: 80 },
      { ...allItems.find(item => item.id === 'archer-cloak')!, price: 120 },
      { ...allItems.find(item => item.id === 'mage-robes')!, price: 180 },
      { ...allItems.find(item => item.id === 'crystal-mail')!, price: 200 },
      { ...allItems.find(item => item.id === 'flame-guard')!, price: 220 },
      { ...allItems.find(item => item.id === 'thunder-vest')!, price: 240 },
      { ...allItems.find(item => item.id === 'knight-armor')!, price: 250 },
      { ...allItems.find(item => item.id === 'ice-plate')!, price: 280 },
      { ...allItems.find(item => item.id === 'void-shroud')!, price: 320 },
      { ...allItems.find(item => item.id === 'alchemist-robes')!, price: 350 },
      { ...allItems.find(item => item.id === 'shadow-cloak')!, price: 500 }
    ],
    consumables: [
      { ...allItems.find(item => item.id === 'health-potion')!, price: 30 },
      { ...allItems.find(item => item.id === 'mana-potion')!, price: 40 },
      { ...allItems.find(item => item.id === 'energy-drink')!, price: 50 },
      { ...allItems.find(item => item.id === 'greater-health-potion')!, price: 60 },
      { ...allItems.find(item => item.id === 'defense-tonic')!, price: 70 },
      { ...allItems.find(item => item.id === 'strength-elixir')!, price: 80 },
      { ...allItems.find(item => item.id === 'speed-serum')!, price: 90 },
      { ...allItems.find(item => item.id === 'berserker-brew')!, price: 100 },
      { ...allItems.find(item => item.id === 'super-health-potion')!, price: 120 },
      { ...allItems.find(item => item.id === 'invisibility-potion')!, price: 150 },
      { ...allItems.find(item => item.id === 'alchemist-elixir')!, price: 180 },
      { ...allItems.find(item => item.id === 'phoenix-feather')!, price: 200 }
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
    premium: [
      ...stripeProducts.map(product => ({
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
    ]
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
      console.log('🔐 Starting premium purchase for user:', user.email);
      
      // FIXED: Improved session handling with better error recovery
      const getValidSession = async (maxRetries = 3) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`🔄 Session attempt ${attempt}/${maxRetries}`);
            
            // First try to get the current session
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              console.error(`❌ Session error (attempt ${attempt}):`, sessionError);
              
              if (attempt === maxRetries) {
                throw new Error(`Session retrieval failed: ${sessionError.message}`);
              }
              
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            
            if (!sessionData?.session) {
              console.error(`❌ No session found (attempt ${attempt})`);
              
              if (attempt === maxRetries) {
                throw new Error('No active session found. Please log out and log back in.');
              }
              
              // Try to refresh the session
              console.log('🔄 Attempting to refresh session...');
              const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
              
              if (refreshError || !refreshData?.session) {
                console.error('❌ Session refresh failed:', refreshError);
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
              }
              
              return refreshData.session;
            }
            
            if (!sessionData.session.access_token) {
              console.error(`❌ No access token (attempt ${attempt})`);
              
              if (attempt === maxRetries) {
                throw new Error('No valid access token found. Please log out and log back in.');
              }
              
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            
            console.log('✅ Valid session obtained');
            return sessionData.session;
            
          } catch (error: any) {
            console.error(`❌ Session attempt ${attempt} failed:`, error);
            
            if (attempt === maxRetries) {
              throw error;
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        throw new Error('Failed to obtain valid session after all attempts');
      };

      const session = await getValidSession();
      
      // FIXED: Better API call with comprehensive error handling
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`;
      const requestBody = {
        price_id: item.priceId,
        mode: item.mode,
        success_url: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}`,
      };
      
      console.log('🚀 Making checkout request to:', apiUrl);
      console.log('📦 Request body:', requestBody);
      console.log('🔑 Using access token:', session.access_token.substring(0, 20) + '...');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        
        let errorMessage = 'Failed to create checkout session';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        // Handle specific error cases
        if (response.status === 401) {
          errorMessage = 'Authentication failed. Please log out and log back in.';
        } else if (response.status === 403) {
          errorMessage = 'Access denied. Please check your account permissions.';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('✅ Checkout response:', responseData);
      
      if (responseData.url) {
        console.log('🔗 Redirecting to checkout:', responseData.url);
        window.location.href = responseData.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
      
    } catch (error: any) {
      console.error('💥 Premium purchase error:', error);
      
      // Provide user-friendly error messages
      let userMessage = 'Failed to start checkout process. Please try again.';
      
      if (error.message?.includes('Session') || error.message?.includes('session') || error.message?.includes('log out and log back in')) {
        userMessage = 'Session expired. Please log out and log back in to continue.';
      } else if (error.message?.includes('Authentication failed')) {
        userMessage = 'Authentication failed. Please log out and log back in.';
      } else if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        userMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message?.includes('Server error')) {
        userMessage = 'Server error. Please try again in a few moments.';
      } else if (error.message?.includes('Access denied')) {
        userMessage = 'Access denied. Please check your account permissions.';
      } else if (error.message?.includes('No active session')) {
        userMessage = 'Your session has expired. Please log out and log back in.';
      }
      
      setCheckoutError(userMessage);
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
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black text-white p-1 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header - TINY */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="mr-1 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              <ArrowLeft size={8} />
            </button>
            <div>
              <h1 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Fighter's Shop
              </h1>
              <p className="text-gray-300 text-xs">Upgrade your arsenal</p>
            </div>
          </div>
          
          {/* Currency Display - TINY */}
          <div className="flex items-center bg-yellow-500/20 rounded px-2 py-1 border border-yellow-400/50">
            <Coins className="text-yellow-400 mr-1" size={8} />
            <div>
              <div className="text-yellow-400 font-bold text-xs">{player.currency}</div>
              <div className="text-yellow-300 text-xs">Coins</div>
            </div>
          </div>
        </div>
        
        {/* Category Tabs - TINY */}
        <div className="flex space-x-1 mb-1 overflow-x-auto">
          {Object.keys(shopItems).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as any)}
              className={`px-2 py-1 rounded font-bold transition-all duration-300 whitespace-nowrap flex items-center text-xs ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {category === 'premium' && <CreditCard className="mr-1" size={6} />}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Premium Section Header - TINY */}
        {selectedCategory === 'premium' && (
          <div className="mb-1 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded p-1 border border-purple-500/50">
            <div className="flex items-center mb-1">
              <Crown className="text-yellow-400 mr-1" size={8} />
              <div>
                <h2 className="text-sm font-bold text-yellow-400">Premium Store</h2>
                <p className="text-gray-300 text-xs">Purchase with real money</p>
              </div>
            </div>
            {!user && (
              <div className="bg-yellow-500/20 border border-yellow-400/50 rounded p-1">
                <div className="text-yellow-400 font-bold text-xs">⚠️ Login Required</div>
              </div>
            )}
          </div>
        )}

        {/* Error Message - TINY */}
        {checkoutError && (
          <div className="mb-1 bg-red-500/20 border border-red-500/50 rounded p-1">
            <div className="text-red-400 font-bold text-xs">Payment Error</div>
            <div className="text-white text-xs">{checkoutError}</div>
            <button 
              onClick={() => setCheckoutError(null)}
              className="text-red-300 hover:text-red-200 text-xs underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Items Grid - LARGER PREMIUM ITEMS */}
        <div className={`grid gap-1 max-h-64 overflow-y-auto ${
          selectedCategory === 'premium' 
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' // 50% larger grid for premium
            : 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
        }`}>
          {currentItems.map((item) => {
            const canAfford = selectedCategory === 'premium' ? !!user : player.currency >= item.price;
            const isSelected = selectedItem === item.id;
            const isPremium = selectedCategory === 'premium';
            
            return (
              <div
                key={item.id}
                className={`bg-gray-800 rounded border transition-all duration-300 cursor-pointer transform hover:scale-105 relative ${
                  isPremium ? 'p-3' : 'p-1' // Larger padding for premium items
                } ${
                  isSelected ? 'border-yellow-400 shadow-lg shadow-yellow-400/30' : 
                  canAfford ? 'border-gray-600 hover:border-gray-500' : 'border-red-600 opacity-60'
                } ${isPremium ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30' : ''}`}
                onClick={() => setSelectedItem(isSelected ? null : item.id)}
              >
                {/* Premium Badge */}
                {isPremium && (
                  <div className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-1 rounded-full text-xs font-bold">
                    $
                  </div>
                )}
                
                {/* Item Icon */}
                <div className="text-center mb-1">
                  <div className={`${isPremium ? 'text-3xl mb-1' : 'text-lg mb-0.5'}`}>{item.icon}</div>
                  <h3 className={`${isPremium ? 'text-sm' : 'text-xs'} font-bold truncate`}>{item.name}</h3>
                  <div className={`${isPremium ? 'text-xs' : 'text-xs'} px-1 rounded-full inline-block border ${getRarityColor(item.rarity)}`}>
                    {item.rarity.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                {/* Price and Purchase */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isPremium ? (
                      <>
                        <CreditCard className="text-green-400 mr-0.5" size={4} />
                        <span className="text-green-400 font-bold text-xs">{item.realPrice}</span>
                      </>
                    ) : (
                      <>
                        <Coins className="text-yellow-400 mr-0.5" size={4} />
                        <span className="text-yellow-400 font-bold text-xs">{item.price}</span>
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
                    className={`px-1 py-0.5 rounded font-bold transition-all duration-300 flex items-center text-xs ${
                      isPremium
                        ? canAfford
                          ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : canAfford
                        ? 'bg-green-600 hover:bg-green-500 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={4} className="mr-0.5" />
                    {isLoading && isPremium ? '...' : 
                     isPremium ? (canAfford ? 'Buy' : 'Login') : 
                     canAfford ? 'Buy' : 'X'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Item Details Panel - Show descriptions for premium items */}
        {selectedItem && (
          <div className="mt-1 bg-gray-800/50 rounded p-2 border border-gray-600">
            {(() => {
              const item = currentItems.find(i => i.id === selectedItem);
              if (!item) return null;
              
              return (
                <div>
                  <h3 className="text-sm font-bold text-yellow-400 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-300 mb-2">{item.description}</p>
                  
                  {/* Show bundle contents for premium bundles */}
                  {selectedCategory === 'premium' && item.bundle && item.includes && (
                    <div className="mb-2">
                      <h4 className="text-xs font-bold text-white mb-1">Bundle Includes:</h4>
                      <div className="space-y-1">
                        {item.includes.map((include, index) => (
                          <div key={index} className="flex items-center text-xs">
                            <span className="mr-2">{include.icon}</span>
                            <div>
                              <div className="font-bold text-yellow-400">{include.name}</div>
                              <div className="text-gray-300">{include.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Show coin amount for coin packages */}
                  {selectedCategory === 'premium' && item.coins && (
                    <div className="text-xs">
                      <span className="text-yellow-400 font-bold">Coins: {item.coins.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
        
        {/* Shop Info - TINY */}
        <div className="mt-1 bg-gray-800/50 rounded p-1 border border-gray-600">
          <div className="flex items-center mb-1">
            <Star className="text-yellow-400 mr-1" size={8} />
            <h3 className="text-xs font-bold">Shop Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-xs text-gray-300">
            <div>
              <h4 className="font-bold text-white mb-0.5 text-xs">💰 Earning Coins:</h4>
              <ul className="space-y-0 text-xs">
                <li>• Defeat enemies to earn coins</li>
                <li>• Each enemy drops 10 coins</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5 text-xs">🛡️ Equipment:</h4>
              <ul className="space-y-0 text-xs">
                <li>• Higher price = more damage</li>
                <li>• Armor provides defense bonuses</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5 text-xs">💳 Premium Store:</h4>
              <ul className="space-y-0 text-xs">
                <li>• Instant coin packages available</li>
                <li>• Exclusive character bundles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;