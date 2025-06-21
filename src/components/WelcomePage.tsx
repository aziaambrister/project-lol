import React, { useState, useEffect } from 'react';
import { Play, Sword, Shield, Zap, Crown, Star, Gamepad2, LogIn, UserPlus, Mail, Check } from 'lucide-react';

interface WelcomePageProps {
  onEnter: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
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
    setShowVerification(false);
    setSignupData({ username: '', email: '', password: '' });
    setVerificationCode('');
    setIsVerified(false);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating account for:', signupData);
    
    setShowSignup(false);
    setShowVerification(true);
    
    // Simulate sending verification email with proper demo message
    setTimeout(() => {
      alert(`✅ Verification email sent to ${signupData.email}!\n\n📧 Check your email for the verification code.\n\n🎮 Demo: Use code "123456" to verify and get 100 bonus coins!`);
    }, 500);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode === '123456' || verificationCode.length >= 6) {
      setIsVerified(true);
      
      alert('🎉 Email verified successfully!\n\n💰 You received 100 bonus coins!\n\nWelcome to Fighter\'s Realm!');
      
      setTimeout(() => {
        closeModals();
      }, 2000);
    } else {
      alert('❌ Invalid verification code.\n\n💡 Try "123456" for demo.');
    }
  };

  const skipVerification = () => {
    alert('✅ Account created successfully!\n\n📧 You can verify your email later in settings to get bonus coins.');
    closeModals();
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
            <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={signupData.username}
                  onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Create a password"
                  required
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded-lg font-bold transition-colors"
                >
                  Create Account
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

      {/* Email Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-8 w-96 border border-gray-600">
            {!isVerified ? (
              <>
                <div className="text-center mb-6">
                  <Mail className="mx-auto mb-4 text-blue-400" size={48} />
                  <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
                  <p className="text-gray-300 text-sm">
                    We sent a verification code to<br />
                    <span className="text-blue-400 font-bold">{signupData.email}</span>
                  </p>
                </div>
                
                <form onSubmit={handleVerificationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Verification Code</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-center text-lg tracking-widest"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">Demo: Use "123456" to verify</p>
                  </div>
                  
                  <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3 text-center">
                    <div className="text-yellow-400 font-bold text-sm">🎁 Verification Bonus</div>
                    <div className="text-white text-xs">Get 100 free coins when you verify!</div>
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-bold transition-colors"
                    >
                      Verify Email
                    </button>
                    <button
                      type="button"
                      onClick={skipVerification}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg font-bold transition-colors"
                    >
                      Skip for Now
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center">
                <Check className="mx-auto mb-4 text-green-400" size={48} />
                <h2 className="text-2xl font-bold mb-2 text-green-400">Email Verified!</h2>
                <p className="text-gray-300 mb-4">
                  Welcome to Fighter's Realm, <span className="text-yellow-400 font-bold">{signupData.username}</span>!
                </p>
                <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-3 mb-4">
                  <div className="text-green-400 font-bold">🎉 Bonus Awarded!</div>
                  <div className="text-white">+100 coins added to your account</div>
                </div>
                <div className="text-sm text-gray-400">Redirecting to game...</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
        
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-40 h-40 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-yellow-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/30 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-500/30 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className={`max-w-4xl w-full text-center relative z-10 transition-all duration-1000 px-4 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Main Title - Made smaller */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-3">
            <Crown className="text-yellow-400 mr-3 animate-pulse" size={32} />
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
              FIGHTER'S
            </h1>
            <Crown className="text-yellow-400 ml-3 animate-pulse" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 mb-2">
            REALM
          </h2>
          <div className="flex items-center justify-center space-x-3 text-lg text-gray-300 mb-4">
            <Sword className="text-red-400 animate-bounce" size={20} />
            <span className="font-semibold">Epic 2D Combat Adventure</span>
            <Shield className="text-blue-400 animate-bounce" size={20} style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Feature Highlights - Made smaller */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div 
            className="bg-gradient-to-br from-red-900/40 to-red-700/20 backdrop-blur-sm p-4 rounded-2xl border border-red-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
            onMouseEnter={() => setHoveredFeature('combat')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 relative">
              <Sword size={24} className="text-red-400" />
              {hoveredFeature === 'combat' && (
                <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="text-lg font-bold mb-2 text-red-300">Intense Combat</h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              Master fluid combat mechanics with combos, special moves, and strategic timing. Face intelligent AI enemies with unique attack patterns.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-blue-900/40 to-blue-700/20 backdrop-blur-sm p-4 rounded-2xl border border-blue-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
            onMouseEnter={() => setHoveredFeature('world')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 relative">
              <Shield size={24} className="text-blue-400" />
              {hoveredFeature === 'world' && (
                <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="text-lg font-bold mb-2 text-blue-300">Open World</h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              Explore vast landscapes with enterable buildings, dynamic weather, and day/night cycles that affect gameplay.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-purple-900/40 to-purple-700/20 backdrop-blur-sm p-4 rounded-2xl border border-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
            onMouseEnter={() => setHoveredFeature('progression')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 relative">
              <Star size={24} className="text-purple-400" />
              {hoveredFeature === 'progression' && (
                <div className="absolute inset-0 bg-purple-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="text-lg font-bold mb-2 text-purple-300">Character Growth</h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              Choose from unique fighter classes, earn coins through combat, purchase upgrades, and unlock powerful abilities as you progress.
            </p>
          </div>
        </div>

        {/* Game Stats - Made smaller */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-yellow-400/30">
            <div className="text-xl font-bold text-yellow-400">4+</div>
            <div className="text-gray-300 text-xs">Fighter Classes</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-green-400/30">
            <div className="text-xl font-bold text-green-400">15+</div>
            <div className="text-gray-300 text-xs">Enemy Types</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-blue-400/30">
            <div className="text-xl font-bold text-blue-400">50+</div>
            <div className="text-gray-300 text-xs">Shop Items</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-purple-400/30">
            <div className="text-xl font-bold text-purple-400">∞</div>
            <div className="text-gray-300 text-xs">Adventure</div>
          </div>
        </div>

        {/* Main Enter Button - Made smaller */}
        <div className="relative mb-6">
          <button 
            type="button"
            className="group px-12 py-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 rounded-2xl font-bold text-xl text-black transition-all duration-500 cursor-pointer select-none transform hover:scale-110 shadow-2xl relative overflow-hidden"
            onClick={handleEnterClick}
            style={{ 
              minWidth: '220px',
              minHeight: '60px',
              zIndex: 1000,
              position: 'relative'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            
            <div className="relative z-10 flex items-center justify-center">
              <Gamepad2 className="mr-2 animate-bounce" size={24} />
              <span>ENTER REALM</span>
              <Play className="ml-2 animate-bounce" size={24} style={{ animationDelay: '0.5s' }} />
            </div>
          </button>
          
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl blur-xl opacity-50 animate-pulse pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl blur-2xl opacity-30 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Game Features - Made smaller */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-sm">
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-2 py-2 border border-gray-600/50">
            <Zap className="text-yellow-400 mr-1" size={12} />
            <span className="text-xs">Real-time Combat</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-2 py-2 border border-gray-600/50">
            <Crown className="text-purple-400 mr-1" size={12} />
            <span className="text-xs">Character Progression</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-2 py-2 border border-gray-600/50">
            <Shield className="text-blue-400 mr-1" size={12} />
            <span className="text-xs">Strategic Defense</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-2 py-2 border border-gray-600/50">
            <Star className="text-green-400 mr-1" size={12} />
            <span className="text-xs">Epic Rewards</span>
          </div>
        </div>

        {/* Controls Preview - Made smaller */}
        <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3 border border-gray-600/50 mb-4">
          <h3 className="text-md font-bold mb-2 text-yellow-400">⚔️ COMBAT CONTROLS ⚔️</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-2 py-1 mb-1 font-mono text-xs">WASD</div>
              <div className="text-gray-300 text-xs">Movement</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-2 py-1 mb-1 font-mono text-xs">SPACE</div>
              <div className="text-gray-300 text-xs">Attack</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-2 py-1 mb-1 font-mono text-xs">2</div>
              <div className="text-gray-300 text-xs">Shuriken</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-2 py-1 mb-1 font-mono text-xs">SHIFT</div>
              <div className="text-gray-300 text-xs">Block</div>
            </div>
          </div>
        </div>

        {/* Footer - Made smaller */}
        <div className="text-gray-400 text-sm">
          <p className="mb-1 text-xs">🎮 Immerse yourself in epic battles • 🏆 Become the ultimate fighter</p>
          <p className="text-xs">💰 Earn coins through victory • 🛒 Upgrade your arsenal • ⚡ Master legendary techniques</p>
        </div>

        {/* Built with Bolt badge */}
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-4 inline-block bg-gray-800/60 backdrop-blur-sm px-3 py-2 rounded-full text-xs font-medium hover:bg-gray-700/60 transition-all duration-300 border border-gray-600 hover:border-gray-400"
        >
          ⚡ Powered by Bolt.new
        </a>
      </div>
    </div>
  );
};

export default WelcomePage;