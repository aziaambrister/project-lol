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
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 via-indigo-900 to-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-30`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
        
        <div className="absolute top-1/4 left-1/6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-yellow-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`content-container text-center relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Main Title */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <Crown className="text-yellow-400 mr-4 animate-pulse" size={48} />
            <h1 className="responsive-text-5xl lg:responsive-text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
              FIGHTER'S
            </h1>
            <Crown className="text-yellow-400 ml-4 animate-pulse" size={48} />
          </div>
          <h2 className="responsive-text-4xl lg:responsive-text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 mb-6">
            REALM
          </h2>
          <div className="flex items-center justify-center space-x-4 responsive-text-xl text-gray-300 mb-8">
            <Sword className="text-red-400 animate-bounce" size={32} />
            <span className="font-semibold">Epic 2D Combat Adventure</span>
            <Shield className="text-blue-400 animate-bounce" size={32} style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 responsive-gap-8 mb-16 w-full max-w-6xl">
          <div 
            className="bg-gradient-to-br from-red-900/40 to-red-700/20 backdrop-blur-sm responsive-p-8 rounded-xl border border-red-500/30 transition-all duration-300 transform hover:scale-105"
            onMouseEnter={() => setHoveredFeature('combat')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Sword size={40} className="text-red-400" />
              {hoveredFeature === 'combat' && (
                <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="responsive-text-2xl font-bold mb-4 text-red-300">Intense Combat</h3>
            <p className="text-gray-300 responsive-text-lg leading-relaxed">
              Master fluid combat mechanics with combos, special moves, and strategic timing.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-blue-900/40 to-blue-700/20 backdrop-blur-sm responsive-p-8 rounded-xl border border-blue-500/30 transition-all duration-300 transform hover:scale-105"
            onMouseEnter={() => setHoveredFeature('world')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Shield size={40} className="text-blue-400" />
              {hoveredFeature === 'world' && (
                <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="responsive-text-2xl font-bold mb-4 text-blue-300">Open World</h3>
            <p className="text-gray-300 responsive-text-lg leading-relaxed">
              Explore vast landscapes with enterable buildings and dynamic weather.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-purple-900/40 to-purple-700/20 backdrop-blur-sm responsive-p-8 rounded-xl border border-purple-500/30 transition-all duration-300 transform hover:scale-105"
            onMouseEnter={() => setHoveredFeature('progression')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Star size={40} className="text-purple-400" />
              {hoveredFeature === 'progression' && (
                <div className="absolute inset-0 bg-purple-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="responsive-text-2xl font-bold mb-4 text-purple-300">Character Growth</h3>
            <p className="text-gray-300 responsive-text-lg leading-relaxed">
              Choose from unique fighter classes and unlock powerful abilities.
            </p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="flex flex-wrap justify-center responsive-gap-6 mb-12">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-8 py-4 border border-yellow-400/30">
            <div className="responsive-text-4xl font-bold text-yellow-400">6+</div>
            <div className="text-gray-300 responsive-text-lg">Fighter Classes</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-8 py-4 border border-green-400/30">
            <div className="responsive-text-4xl font-bold text-green-400">15+</div>
            <div className="text-gray-300 responsive-text-lg">Enemy Types</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-8 py-4 border border-blue-400/30">
            <div className="responsive-text-4xl font-bold text-blue-400">100+</div>
            <div className="text-gray-300 responsive-text-lg">Shop Items</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-8 py-4 border border-purple-400/30">
            <div className="responsive-text-4xl font-bold text-purple-400">∞</div>
            <div className="text-gray-300 responsive-text-lg">Adventure</div>
          </div>
        </div>

        {/* Main Enter Button */}
        <div className="relative mb-12">
          <button 
            type="button"
            className="group px-24 py-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 rounded-xl font-bold responsive-text-3xl text-black transition-all duration-500 cursor-pointer select-none transform hover:scale-110 shadow-2xl relative overflow-hidden"
            onClick={handleEnterClick}
            style={{ 
              minWidth: '360px',
              minHeight: '90px',
              zIndex: 1000,
              position: 'relative'
            }}
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            
            {/* Button content */}
            <div className="relative z-10 flex items-center justify-center">
              <Gamepad2 className="mr-4 animate-bounce" size={36} />
              <span>ENTER REALM</span>
              <Play className="ml-4 animate-bounce" size={36} style={{ animationDelay: '0.5s' }} />
            </div>
          </button>
          
          {/* Glowing effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl blur-xl opacity-50 animate-pulse pointer-events-none"></div>
        </div>

        {/* Game Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 responsive-gap-4 mb-10 responsive-text-lg w-full max-w-4xl">
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-6 py-4 border border-gray-600/50">
            <Zap className="text-yellow-400 mr-3" size={20} />
            <span>Real-time Combat</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-6 py-4 border border-gray-600/50">
            <Crown className="text-purple-400 mr-3" size={20} />
            <span>Character Progression</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-6 py-4 border border-gray-600/50">
            <Shield className="text-blue-400 mr-3" size={20} />
            <span>Strategic Defense</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-6 py-4 border border-gray-600/50">
            <Star className="text-green-400 mr-3" size={20} />
            <span>Epic Rewards</span>
          </div>
        </div>

        {/* Controls Preview */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg responsive-p-8 border border-gray-600/50 mb-8 w-full max-w-4xl">
          <h3 className="responsive-text-2xl font-bold mb-6 text-yellow-400">⚔️ COMBAT CONTROLS ⚔️</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 responsive-gap-6 responsive-text-lg">
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-4 py-3 mb-3 font-mono responsive-text-xl">WASD</div>
              <div className="text-gray-300">Movement</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-4 py-3 mb-3 font-mono responsive-text-xl">SPACE</div>
              <div className="text-gray-300">Attack</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-4 py-3 mb-3 font-mono responsive-text-xl">2</div>
              <div className="text-gray-300">Shuriken</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-4 py-3 mb-3 font-mono responsive-text-xl">SHIFT</div>
              <div className="text-gray-300">Block</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-gray-400 responsive-text-lg mb-8">
          <p className="mb-3">🎮 Immerse yourself in epic battles • 🏆 Become the ultimate fighter</p>
          <p>💰 Earn coins through victory • 🛒 Upgrade your arsenal • ⚡ Master legendary techniques</p>
        </div>

        {/* Built with Bolt badge */}
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block bg-gray-800/60 backdrop-blur-sm px-8 py-4 rounded-full responsive-text-lg font-medium hover:bg-gray-700/60 transition-all duration-300 border border-gray-600 hover:border-gray-400"
        >
          ⚡ Powered by Bolt.new
        </a>
      </div>
    </div>
  );
};

export default WelcomePage;