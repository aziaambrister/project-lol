import React, { useState, useEffect } from 'react';
import { Play, Sword, Shield, Zap, Crown, Star, Gamepad2, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface WelcomePageProps {
  onEnter: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const { user, loading, signUp, signIn, signOut } = useAuth();

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
    setAuthError('');
    setAuthSuccess('');
  };

  const handleSignupClick = () => {
    setShowSignup(true);
    setAuthError('');
    setAuthSuccess('');
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
    setLoginData({ email: '', password: '' });
    setSignupData({ username: '', email: '', password: '', confirmPassword: '' });
    setAuthError('');
    setAuthSuccess('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);
    
    // Basic validation
    if (!loginData.email || !loginData.password) {
      setAuthError('Please fill in all fields');
      setIsAuthLoading(false);
      return;
    }

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthSuccess('Login successful! Welcome back!');
        setTimeout(() => {
          closeModals();
        }, 1500);
      }
    } catch (error: any) {
      setAuthError('An unexpected error occurred');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);
    
    // Basic validation
    if (!signupData.username || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setAuthError('Please fill in all fields');
      setIsAuthLoading(false);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setAuthError('Passwords do not match');
      setIsAuthLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      setIsAuthLoading(false);
      return;
    }

    if (signupData.username.length < 3) {
      setAuthError('Username must be at least 3 characters long');
      setIsAuthLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setAuthError('Please enter a valid email address');
      setIsAuthLoading(false);
      return;
    }

    try {
      const { error } = await signUp(signupData.email, signupData.password, signupData.username);
      
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthSuccess('Account created successfully! You are now logged in.');
        setTimeout(() => {
          closeModals();
        }, 2000);
      }
    } catch (error: any) {
      setAuthError('An unexpected error occurred');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 via-indigo-900 to-black text-white relative overflow-hidden">
      {/* Login/Signup Buttons */}
      <div className="absolute top-4 right-4 z-50 flex space-x-3">
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="text-sm">
              <div className="text-white font-bold">Welcome, {user.email}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-8 w-96 border border-gray-600">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            
            {authError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-center">
                <div className="text-red-400 text-sm">{authError}</div>
              </div>
            )}
            
            {authSuccess && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 mb-4 text-center">
                <div className="text-green-400 text-sm">{authSuccess}</div>
              </div>
            )}
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                  disabled={isAuthLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                  disabled={isAuthLoading}
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthLoading ? 'Logging in...' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  disabled={isAuthLoading}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
                disabled={isAuthLoading}
                className="text-blue-400 hover:text-blue-300 text-sm disabled:opacity-50"
              >
                Don't have an account? Sign up here
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-8 w-96 border border-gray-600">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
            
            {authError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-center">
                <div className="text-red-400 text-sm">{authError}</div>
              </div>
            )}
            
            {authSuccess && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 mb-4 text-center">
                <div className="text-green-400 text-sm">{authSuccess}</div>
              </div>
            )}
            
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={signupData.username}
                  onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Choose a username (min 3 characters)"
                  required
                  disabled={isAuthLoading}
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
                  disabled={isAuthLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Create a password (min 6 characters)"
                  required
                  disabled={isAuthLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Confirm your password"
                  required
                  disabled={isAuthLoading}
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthLoading ? 'Creating Account...' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  disabled={isAuthLoading}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                }}
                disabled={isAuthLoading}
                className="text-green-400 hover:text-green-300 text-sm disabled:opacity-50"
              >
                Already have an account? Login here
              </button>
            </div>
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

      <div className={`w-full text-center relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Main Title */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <Crown className="text-yellow-400 mr-4 animate-pulse" size={48} />
            <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
              FIGHTER'S
            </h1>
            <Crown className="text-yellow-400 ml-4 animate-pulse" size={48} />
          </div>
          <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 mb-4">
            REALM
          </h2>
          <div className="flex items-center justify-center space-x-4 text-2xl text-gray-300 mb-8">
            <Sword className="text-red-400 animate-bounce" size={28} />
            <span className="font-semibold">Epic 2D Combat Adventure</span>
            <Shield className="text-blue-400 animate-bounce" size={28} style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div 
            className="bg-gradient-to-br from-red-900/40 to-red-700/20 backdrop-blur-sm p-8 rounded-2xl border border-red-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
            onMouseEnter={() => setHoveredFeature('combat')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Sword size={40} className="text-red-400" />
              {hoveredFeature === 'combat' && (
                <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-red-300">Intense Combat</h3>
            <p className="text-gray-300 leading-relaxed">
              Master fluid combat mechanics with combos, special moves, and strategic timing. Face intelligent AI enemies with unique attack patterns.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-blue-900/40 to-blue-700/20 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
            onMouseEnter={() => setHoveredFeature('world')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Shield size={40} className="text-blue-400" />
              {hoveredFeature === 'world' && (
                <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-blue-300">Open World</h3>
            <p className="text-gray-300 leading-relaxed">
              Explore vast landscapes with enterable buildings, dynamic weather, and day/night cycles that affect gameplay.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-purple-900/40 to-purple-700/20 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
            onMouseEnter={() => setHoveredFeature('progression')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Star size={40} className="text-purple-400" />
              {hoveredFeature === 'progression' && (
                <div className="absolute inset-0 bg-purple-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-purple-300">Character Growth</h3>
            <p className="text-gray-300 leading-relaxed">
              Choose from unique fighter classes, earn coins through combat, purchase upgrades, and unlock powerful abilities as you progress.
            </p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-6 py-4 border border-yellow-400/30">
            <div className="text-3xl font-bold text-yellow-400">6+</div>
            <div className="text-gray-300 text-sm">Fighter Classes</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-6 py-4 border border-green-400/30">
            <div className="text-3xl font-bold text-green-400">15+</div>
            <div className="text-gray-300 text-sm">Enemy Types</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-6 py-4 border border-blue-400/30">
            <div className="text-3xl font-bold text-blue-400">100+</div>
            <div className="text-gray-300 text-sm">Shop Items</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-6 py-4 border border-purple-400/30">
            <div className="text-3xl font-bold text-purple-400">∞</div>
            <div className="text-gray-300 text-sm">Adventure</div>
          </div>
        </div>

        {/* Main Enter Button */}
        <div className="relative mb-12">
          <button 
            type="button"
            className="group px-20 py-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 rounded-2xl font-bold text-4xl text-black transition-all duration-500 cursor-pointer select-none transform hover:scale-110 shadow-2xl relative overflow-hidden"
            onClick={handleEnterClick}
            style={{ 
              minWidth: '350px',
              minHeight: '100px',
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
          
          {/* Multiple glowing effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-2xl blur-xl opacity-50 animate-pulse pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl blur-2xl opacity-30 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Game Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 text-sm">
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/50">
            <Zap className="text-yellow-400 mr-2" size={16} />
            <span>Real-time Combat</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/50">
            <Crown className="text-purple-400 mr-2" size={16} />
            <span>Character Progression</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/50">
            <Shield className="text-blue-400 mr-2" size={16} />
            <span>Strategic Defense</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-600/50">
            <Star className="text-green-400 mr-2" size={16} />
            <span>Epic Rewards</span>
          </div>
        </div>

        {/* Controls Preview */}
        <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 mb-8">
          <h3 className="text-xl font-bold mb-4 text-yellow-400">⚔️ COMBAT CONTROLS ⚔️</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-3 py-2 mb-2 font-mono">WASD</div>
              <div className="text-gray-300">Movement</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-3 py-2 mb-2 font-mono">SPACE</div>
              <div className="text-gray-300">Attack</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-3 py-2 mb-2 font-mono">2</div>
              <div className="text-gray-300">Shuriken</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-3 py-2 mb-2 font-mono">SHIFT</div>
              <div className="text-gray-300">Block</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-gray-400 text-sm">
          <p className="mb-2">🎮 Immerse yourself in epic battles • 🏆 Become the ultimate fighter</p>
          <p>💰 Earn coins through victory • 🛒 Upgrade your arsenal • ⚡ Master legendary techniques</p>
        </div>

        {/* Built with Bolt badge */}
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-8 inline-block bg-gray-800/60 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-700/60 transition-all duration-300 border border-gray-600 hover:border-gray-400"
        >
          ⚡ Powered by Bolt.new
        </a>
      </div>
    </div>
  );
};

export default WelcomePage;