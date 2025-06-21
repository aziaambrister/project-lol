import React, { useState } from 'react';
import { Sword, Shield, Zap, Users, Play, Target, ShoppingBag, ArrowLeft } from 'lucide-react';
import Shop from './Shop';

interface StartScreenProps {
  onStart: () => void;
  onBack: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onBack }) => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [showShop, setShowShop] = useState(false);
  
  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Start button clicked');
    onStart();
  };

  const handleShopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShop(true);
  };

  const handleCloseShop = () => {
    setShowShop(false);
  };
  
  if (showShop) {
    return <Shop onClose={handleCloseShop} />;
  }
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-purple-900 to-black text-white p-4 relative overflow-hidden max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-25"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-20"></div>
      </div>
      
      <div className="max-w-4xl w-full text-center relative z-10">
        <div className="mb-6">
          <h1 className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
            Fighter's Realm
          </h1>
          <div className="flex items-center justify-center space-x-2 text-lg text-gray-300 mb-6">
            <Sword className="text-yellow-400" size={20} />
            <span>Epic 2D Fighting Adventure</span>
            <Shield className="text-blue-400" size={20} />
          </div>
        </div>
        
        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div 
            className="bg-gray-800 bg-opacity-60 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-opacity-80 border border-red-500/20"
            onMouseEnter={() => setHoveredFeature('combat')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-12 h-12 bg-red-900 bg-opacity-60 rounded-full flex items-center justify-center mx-auto mb-3 relative">
              <Target size={24} className="text-red-400" />
              {hoveredFeature === 'combat' && (
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
              )}
            </div>
            <h3 className="text-md font-bold mb-2">Fluid Combat</h3>
            <p className={`text-xs text-gray-300 transition-all duration-300 ${hoveredFeature === 'combat' ? 'opacity-100' : 'opacity-70'}`}>
              Master combo attacks, blocks, dodges, and special moves with responsive combat mechanics
            </p>
          </div>
          
          <div 
            className="bg-gray-800 bg-opacity-60 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-opacity-80 border border-blue-500/20"
            onMouseEnter={() => setHoveredFeature('world')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-12 h-12 bg-blue-900 bg-opacity-60 rounded-full flex items-center justify-center mx-auto mb-3 relative">
              <Shield size={24} className="text-blue-400" />
              {hoveredFeature === 'world' && (
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30"></div>
              )}
            </div>
            <h3 className="text-md font-bold mb-2">Open World</h3>
            <p className={`text-xs text-gray-300 transition-all duration-300 ${hoveredFeature === 'world' ? 'opacity-100' : 'opacity-70'}`}>
              Explore vast landscapes with enterable buildings and dynamic day/night cycles
            </p>
          </div>
          
          <div 
            className="bg-gray-800 bg-opacity-60 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-opacity-80 border border-purple-500/20"
            onMouseEnter={() => setHoveredFeature('ai')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-12 h-12 bg-purple-900 bg-opacity-60 rounded-full flex items-center justify-center mx-auto mb-3 relative">
              <Zap size={24} className="text-purple-400" />
              {hoveredFeature === 'ai' && (
                <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-30"></div>
              )}
            </div>
            <h3 className="text-md font-bold mb-2">Smart AI</h3>
            <p className={`text-xs text-gray-300 transition-all duration-300 ${hoveredFeature === 'ai' ? 'opacity-100' : 'opacity-70'}`}>
              Face intelligent enemies that patrol, detect, chase, and adapt their combat strategies
            </p>
          </div>
          
          <div 
            className="bg-gray-800 bg-opacity-60 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-opacity-80 border border-green-500/20"
            onMouseEnter={() => setHoveredFeature('characters')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-12 h-12 bg-green-900 bg-opacity-60 rounded-full flex items-center justify-center mx-auto mb-3 relative">
              <Users size={24} className="text-green-400" />
              {hoveredFeature === 'characters' && (
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>
              )}
            </div>
            <h3 className="text-md font-bold mb-2">Unique Fighters</h3>
            <p className={`text-xs text-gray-300 transition-all duration-300 ${hoveredFeature === 'characters' ? 'opacity-100' : 'opacity-70'}`}>
              Choose from balanced fighters, speed demons, heavy hitters, and defensive tanks
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          {/* Shop Button */}
          <div className="relative">
            <button 
              type="button"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 rounded-xl font-bold text-lg text-white transition-all duration-300 cursor-pointer select-none transform hover:scale-110 shadow-2xl relative overflow-hidden"
              onClick={handleShopClick}
              style={{ 
                minWidth: '160px',
                minHeight: '50px',
                zIndex: 1000,
                position: 'relative'
              }}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full hover:translate-x-[-200%] transition-transform duration-1000"></div>
              
              {/* Button content */}
              <div className="relative z-10 flex items-center justify-center">
                <ShoppingBag className="mr-2" size={20} />
                <span>🛒 SHOP</span>
              </div>
            </button>
            
            {/* Glowing effect around button */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-xl blur-xl opacity-40 animate-pulse pointer-events-none"></div>
          </div>

          {/* START GAME BUTTON */}
          <div className="relative">
            <button 
              type="button"
              className="px-12 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 rounded-2xl font-bold text-xl text-black transition-all duration-300 cursor-pointer select-none transform hover:scale-110 shadow-2xl relative overflow-hidden hover:shadow-yellow-500/50"
              onClick={handleStartClick}
              style={{ 
                minWidth: '220px',
                minHeight: '60px',
                zIndex: 1000,
                position: 'relative'
              }}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full hover:translate-x-[-200%] transition-transform duration-1000"></div>
              
              {/* Button content */}
              <div className="relative z-10 flex items-center justify-center">
                <Play className="mr-2" size={24} />
                <span>⚔️ BEGIN YOUR JOURNEY ⚔️</span>
              </div>
            </button>
            
            {/* Glowing effect around button */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl blur-xl opacity-40 animate-pulse pointer-events-none"></div>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-400 space-y-1">
          <div>🎮 WASD to move • 👊 Space to attack • 🥷 2 to throw shuriken</div>
          <div>🛡️ Shift to block • 🏠 Enter buildings • 💬 Talk to NPCs</div>
          <div>💰 Earn coins by defeating enemies • 🛒 Buy upgrades in the shop</div>
        </div>
        
        {/* Built with Bolt badge */}
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-6 inline-block bg-gray-800 bg-opacity-60 px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-80 transition-all duration-300 border border-gray-600 hover:border-gray-400"
        >
          ⚡ Built with Bolt.new
        </a>
      </div>
    </div>
  );
};

export default StartScreen;