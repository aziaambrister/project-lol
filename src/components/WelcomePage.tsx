import React, { useState, useEffect } from 'react';
import { Play, Sword, Shield, Zap, Crown, Star, Gamepad2 } from 'lucide-react';

interface WelcomePageProps {
  onEnter: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleEnterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEnter();
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 via-indigo-900 to-black text-white relative overflow-hidden p-2">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-30`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
        
        <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-yellow-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`w-full text-center relative z-10 transition-all duration-1000 px-2 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Main Title - Compact */}
        <div className="mb-4">
          <div className="flex items-center justify-center mb-2">
            <Crown className="text-yellow-400 mr-2 animate-pulse" size={24} />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
              FIGHTER'S
            </h1>
            <Crown className="text-yellow-400 ml-2 animate-pulse" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 mb-2">
            REALM
          </h2>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-300 mb-3">
            <Sword className="text-red-400 animate-bounce" size={16} />
            <span className="font-semibold">Epic 2D Combat Adventure</span>
            <Shield className="text-blue-400 animate-bounce" size={16} style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Feature Highlights - Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
          <div 
            className="bg-gradient-to-br from-red-900/40 to-red-700/20 backdrop-blur-sm p-3 rounded-xl border border-red-500/30 transition-all duration-300 transform hover:scale-105"
            onMouseEnter={() => setHoveredFeature('combat')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2 relative">
              <Sword size={24} className="text-red-400" />
              {hoveredFeature === 'combat' && (
                <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="text-sm font-bold mb-1 text-red-300">Intense Combat</h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              Master fluid combat mechanics with combos, special moves, and strategic timing.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-blue-900/40 to-blue-700/20 backdrop-blur-sm p-3 rounded-xl border border-blue-500/30 transition-all duration-300 transform hover:scale-105"
            onMouseEnter={() => setHoveredFeature('world')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2 relative">
              <Shield size={24} className="text-blue-400" />
              {hoveredFeature === 'world' && (
                <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="text-sm font-bold mb-1 text-blue-300">Open World</h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              Explore vast landscapes with enterable buildings and dynamic weather.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-purple-900/40 to-purple-700/20 backdrop-blur-sm p-3 rounded-xl border border-purple-500/30 transition-all duration-300 transform hover:scale-105"
            onMouseEnter={() => setHoveredFeature('progression')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2 relative">
              <Star size={24} className="text-purple-400" />
              {hoveredFeature === 'progression' && (
                <div className="absolute inset-0 bg-purple-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="text-sm font-bold mb-1 text-purple-300">Character Growth</h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              Choose from unique fighter classes and unlock powerful abilities.
            </p>
          </div>
        </div>

        {/* Game Stats - Compact */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1 border border-yellow-400/30">
            <div className="text-lg font-bold text-yellow-400">6+</div>
            <div className="text-gray-300 text-xs">Fighter Classes</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1 border border-green-400/30">
            <div className="text-lg font-bold text-green-400">15+</div>
            <div className="text-gray-300 text-xs">Enemy Types</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-400/30">
            <div className="text-lg font-bold text-blue-400">100+</div>
            <div className="text-gray-300 text-xs">Shop Items</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1 border border-purple-400/30">
            <div className="text-lg font-bold text-purple-400">∞</div>
            <div className="text-gray-300 text-xs">Adventure</div>
          </div>
        </div>

        {/* Main Enter Button - Compact */}
        <div className="relative mb-4">
          <button 
            type="button"
            className="group px-12 py-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 rounded-xl font-bold text-lg text-black transition-all duration-500 cursor-pointer select-none transform hover:scale-110 shadow-2xl relative overflow-hidden"
            onClick={handleEnterClick}
            style={{ 
              minWidth: '200px',
              minHeight: '50px',
              zIndex: 1000,
              position: 'relative'
            }}
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            
            {/* Button content */}
            <div className="relative z-10 flex items-center justify-center">
              <Gamepad2 className="mr-2 animate-bounce" size={20} />
              <span>ENTER REALM</span>
              <Play className="ml-2 animate-bounce" size={20} style={{ animationDelay: '0.5s' }} />
            </div>
          </button>
          
          {/* Glowing effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl blur-xl opacity-50 animate-pulse pointer-events-none"></div>
        </div>

        {/* Game Features - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-xs">
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1 border border-gray-600/50">
            <Zap className="text-yellow-400 mr-1" size={12} />
            <span>Real-time Combat</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1 border border-gray-600/50">
            <Crown className="text-purple-400 mr-1" size={12} />
            <span>Character Progression</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1 border border-gray-600/50">
            <Shield className="text-blue-400 mr-1" size={12} />
            <span>Strategic Defense</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1 border border-gray-600/50">
            <Star className="text-green-400 mr-1" size={12} />
            <span>Epic Rewards</span>
          </div>
        </div>

        {/* Controls Preview - Compact */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-gray-600/50 mb-2">
          <h3 className="text-sm font-bold mb-2 text-yellow-400">⚔️ COMBAT CONTROLS ⚔️</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-1 py-0.5 mb-1 font-mono text-xs">WASD</div>
              <div className="text-gray-300">Movement</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-1 py-0.5 mb-1 font-mono text-xs">SPACE</div>
              <div className="text-gray-300">Attack</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-1 py-0.5 mb-1 font-mono text-xs">2</div>
              <div className="text-gray-300">Shuriken</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-1 py-0.5 mb-1 font-mono text-xs">SHIFT</div>
              <div className="text-gray-300">Block</div>
            </div>
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="text-gray-400 text-xs">
          <p className="mb-1">🎮 Immerse yourself in epic battles • 🏆 Become the ultimate fighter</p>
          <p>💰 Earn coins through victory • 🛒 Upgrade your arsenal • ⚡ Master legendary techniques</p>
        </div>

        {/* Built with Bolt badge */}
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-2 inline-block bg-gray-800/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-700/60 transition-all duration-300 border border-gray-600 hover:border-gray-400"
        >
          ⚡ Powered by Bolt.new
        </a>
      </div>
    </div>
  );
};

export default WelcomePage;