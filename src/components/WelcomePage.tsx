import React, { useState, useEffect } from 'react';
import { Play, Sword, Shield, Zap, Crown, Star, Gamepad2, LogIn, UserPlus } from 'lucide-react';

interface WelcomePageProps {
  onEnter: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleEnterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEnter();
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 via-indigo-900 to-black text-white relative overflow-hidden">
      {/* Login/Signup Buttons */}
      <div className="absolute top-4 right-4 z-50 flex space-x-3">
        <button
          onClick={handleLoginClick}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
        >
          <LogIn size={18} className="mr-2" />
          Login
        </button>
        <button
          onClick={handleSignupClick}
          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
        >
          <UserPlus size={18} className="mr-2" />
          Sign Up
        </button>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-8 w-96 border border-gray-600">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-bold transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-8 w-96 border border-gray-600">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Create a password"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded-lg font-bold transition-colors"
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-30`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-40 h-40 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-yellow-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Animated lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/30 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-500/30 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className={`max-w-5xl w-full text-center relative z-10 transition-all duration-1000 px-4 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Main Title - Made smaller */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="text-yellow-400 mr-3 animate-pulse" size={36} />
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
              FIGHTER'S
            </h1>
            <Crown className="text-yellow-400 ml-3 animate-pulse" size={36} />
          </div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 mb-3">
            REALM
          </h2>
          <div className="flex items-center justify-center space-x-3 text-xl text-gray-300 mb-6">
            <Sword className="text-red-400 animate-bounce" size={24} />
            <span className="font-semibold">Epic 2D Combat Adventure</span>
            <Shield className="text-blue-400 animate-bounce" size={24} style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Feature Highlights - Made smaller */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div 
            className="bg-gradient-to-br from-red-900/40 to-red-700/20 backdrop-blur-sm p-6 rounded-2xl border border-red-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
            onMouseEnter={() => setHoveredFeature('combat')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <Sword size={32} className="text-red-400" />
              {hoveredFeature === 'combat' && (
                <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="text-xl font-bold mb-3 text-red-300">Intense Combat</h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              Master fluid combat mechanics with combos, special moves, and strategic timing. Face intelligent AI enemies with unique attack patterns.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-blue-900/40 to-blue-700/20 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
            onMouseEnter={() => setHoveredFeature('world')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <Shield size={32} className="text-blue-400" />
              {hoveredFeature === 'world' && (
                <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="text-xl font-bold mb-3 text-blue-300">Open World</h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              Explore vast landscapes with enterable buildings, swimming mechanics, dynamic weather, and day/night cycles that affect gameplay.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-purple-900/40 to-purple-700/20 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
            onMouseEnter={() => setHoveredFeature('progression')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <Star size={32} className="text-purple-400" />
              {hoveredFeature === 'progression' && (
                <div className="absolute inset-0 bg-purple-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="text-xl font-bold mb-3 text-purple-300">Character Growth</h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              Choose from unique fighter classes, earn coins through combat, purchase upgrades, and unlock powerful abilities as you progress.
            </p>
          </div>
        </div>

        {/* Game Stats - Made smaller */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-yellow-400/30">
            <div className="text-2xl font-bold text-yellow-400">4+</div>
            <div className="text-gray-300 text-xs">Fighter Classes</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-green-400/30">
            <div className="text-2xl font-bold text-green-400">15+</div>
            <div className="text-gray-300 text-xs">Enemy Types</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-blue-400/30">
            <div className="text-2xl font-bold text-blue-400">50+</div>
            <div className="text-gray-300 text-xs">Shop Items</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-purple-400/30">
            <div className="text-2xl font-bold text-purple-400">∞</div>
            <div className="text-gray-300 text-xs">Adventure</div>
          </div>
        </div>

        {/* Main Enter Button - Made smaller */}
        <div className="relative mb-8">
          <button 
            type="button"
            className="group px-16 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 rounded-2xl font-bold text-2xl text-black transition-all duration-500 cursor-pointer select-none transform hover:scale-110 shadow-2xl relative overflow-hidden"
            onClick={handleEnterClick}
            style={{ 
              minWidth: '280px',
              minHeight: '70px',
              zIndex: 1000,
              position: 'relative'
            }}
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            
            {/* Button content */}
            <div className="relative z-10 flex items-center justify-center">
              <Gamepad2 className="mr-3 animate-bounce" size={28} />
              <span>ENTER REALM</span>
              <Play className="ml-3 animate-bounce" size={28} style={{ animationDelay: '0.5s' }} />
            </div>
          </button>
          
          {/* Multiple glowing effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl blur-xl opacity-50 animate-pulse pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl blur-2xl opacity-30 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Game Features - Made smaller */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-600/50">
            <Zap className="text-yellow-400 mr-2" size={14} />
            <span>Real-time Combat</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-600/50">
            <Crown className="text-purple-400 mr-2" size={14} />
            <span>Character Progression</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-600/50">
            <Shield className="text-blue-400 mr-2" size={14} />
            <span>Strategic Defense</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-600/50">
            <Star className="text-green-400 mr-2" size={14} />
            <span>Epic Rewards</span>
          </div>
        </div>

        {/* Controls Preview - Made smaller */}
        <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50 mb-6">
          <h3 className="text-lg font-bold mb-3 text-yellow-400">⚔️ COMBAT CONTROLS ⚔️</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-2 py-1 mb-1 font-mono text-xs">WASD</div>
              <div className="text-gray-300 text-xs">Movement</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-2 py-1 mb-1 font-mono text-xs">SPACE</div>
              <div className="text-gray-300 text-xs">Attack</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-2 py-1 mb-1 font-mono text-xs">SHIFT</div>
              <div className="text-gray-300 text-xs">Block</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-2 py-1 mb-1 font-mono text-xs">1-4</div>
              <div className="text-gray-300 text-xs">Special Moves</div>
            </div>
          </div>
        </div>

        {/* Footer - Made smaller */}
        <div className="text-gray-400 text-sm">
          <p className="mb-1">🎮 Immerse yourself in epic battles • 🏆 Become the ultimate fighter</p>
          <p className="text-xs">💰 Earn coins through victory • 🛒 Upgrade your arsenal • ⚡ Master legendary techniques</p>
        </div>

        {/* Built with Bolt badge */}
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-6 inline-block bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-700/60 transition-all duration-300 border border-gray-600 hover:border-gray-400"
        >
          ⚡ Powered by Bolt.new
        </a>
      </div>
    </div>
  );
};

export default WelcomePage;