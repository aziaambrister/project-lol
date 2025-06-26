import React, { useState, useEffect } from 'react';
import { Play, Sword, Shield, Zap, Crown, Star, Gamepad2, LogIn, UserPlus, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface WelcomePageProps {
  onEnter: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    displayName: ''
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const { user, signIn, signUp, signOut } = useAuth();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleEnterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEnter();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'login') {
        const { error } = await signIn(authForm.email, authForm.password);
        if (error) {
          let errorMessage = error.message || 'An error occurred during sign in';
          
          if (error.message?.includes('email_not_confirmed') || error.message?.includes('Email not confirmed')) {
            errorMessage = 'Please check your email and click the confirmation link before signing in.';
          } else if (error.message?.includes('invalid_credentials') || error.message?.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          } else if (error.message?.includes('too_many_requests')) {
            errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
          } else if (error.message?.includes('signup_disabled')) {
            errorMessage = 'New user registration is currently disabled.';
          }
          
          setAuthError(errorMessage);
        } else {
          setShowAuthModal(false);
          setAuthForm({ email: '', password: '', displayName: '' });
        }
      } else {
        if (!authForm.displayName.trim()) {
          setAuthError('Display name is required');
          return;
        }
        const { error } = await signUp(authForm.email, authForm.password, authForm.displayName);
        if (error) {
          let errorMessage = error.message || 'An error occurred during sign up';
          
          if (error.message?.includes('already_registered') || error.message?.includes('already registered')) {
            errorMessage = 'An account with this email already exists. Please try signing in instead.';
          } else if (error.message?.includes('weak_password') || error.message?.includes('Password should be')) {
            errorMessage = 'Password is too weak. Please use at least 6 characters.';
          } else if (error.message?.includes('invalid_email')) {
            errorMessage = 'Please enter a valid email address.';
          } else if (error.message?.includes('signup_disabled')) {
            errorMessage = 'New user registration is currently disabled.';
          }
          
          setAuthError(errorMessage);
        } else {
          setShowAuthModal(false);
          setAuthForm({ email: '', password: '', displayName: '' });
          setAuthError(null);
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error?.message) {
        if (error.message.includes('email_not_confirmed') || error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('invalid_credentials') || error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        }
      }
      
      setAuthError(errorMessage);
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
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 via-indigo-900 to-black text-white relative overflow-hidden">
      {/* Auth Button - SMALLER SIGN OUT BUTTON */}
      <div className="absolute top-4 right-4 z-50">
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="text-white font-bold">Welcome, {user.username || user.email}!</div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg font-bold text-xs transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-sm transition-colors"
          >
            <LogIn size={16} className="mr-2" />
            Login / Sign Up
          </button>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border-2 border-yellow-400/50 shadow-2xl p-8 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                {authMode === 'login' ? 'Welcome Back' : 'Join the Realm'}
              </h2>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError(null);
                  setAuthForm({ email: '', password: '', displayName: '' });
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={authForm.displayName}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                    placeholder="Enter your display name"
                    required={authMode === 'signup'}
                    disabled={isAuthLoading}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                  placeholder="Enter your email"
                  required
                  disabled={isAuthLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  disabled={isAuthLoading}
                />
              </div>

              {authError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <div className="text-red-400 text-sm">{authError}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAuthLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    {authMode === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  authMode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'signup' : 'login');
                  setAuthError(null);
                  setAuthForm({ email: '', password: '', displayName: '' });
                }}
                className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                disabled={isAuthLoading}
              >
                {authMode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
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
        
        <div className="absolute top-1/4 left-1/6 w-12 h-12 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-yellow-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`content-container text-center relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Main Title */}
        <div className="mb-4">
          <div className="flex items-center justify-center mb-2">
            <Crown className="text-yellow-400 mr-2 animate-pulse" size={16} />
            <h1 className="responsive-text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
              FIGHTER'S
            </h1>
            <Crown className="text-yellow-400 ml-2 animate-pulse" size={16} />
          </div>
          <h2 className="responsive-text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 mb-2">
            REALM
          </h2>
          <div className="flex items-center justify-center space-x-2 responsive-text-sm text-gray-300 mb-3">
            <Sword className="text-red-400 animate-bounce" size={12} />
            <span className="font-semibold">Epic 2D Combat Adventure</span>
            <Shield className="text-blue-400 animate-bounce" size={12} style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 responsive-gap-3 mb-6 w-full max-w-4xl">
          <div 
            className="bg-gradient-to-br from-red-900/40 to-red-700/20 backdrop-blur-sm responsive-p-3 rounded-lg border border-red-500/30 transition-all duration-300 transform hover:scale-105"
            onMouseEnter={() => setHoveredFeature('combat')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2 relative">
              <Sword size={16} className="text-red-400" />
              {hoveredFeature === 'combat' && (
                <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="responsive-text-lg font-bold mb-1 text-red-300">Intense Combat</h3>
            <p className="text-gray-300 responsive-text-xs leading-relaxed">
              Master fluid combat mechanics with combos, special moves, and strategic timing.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-blue-900/40 to-blue-700/20 backdrop-blur-sm responsive-p-3 rounded-lg border border-blue-500/30 transition-all duration-300 transform hover:scale-105"
            onMouseEnter={() => setHoveredFeature('world')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2 relative">
              <Shield size={16} className="text-blue-400" />
              {hoveredFeature === 'world' && (
                <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="responsive-text-lg font-bold mb-1 text-blue-300">Open World</h3>
            <p className="text-gray-300 responsive-text-xs leading-relaxed">
              Explore vast landscapes with enterable buildings and dynamic weather.
            </p>
          </div>

          <div 
            className="bg-gradient-to-br from-purple-900/40 to-purple-700/20 backdrop-blur-sm responsive-p-3 rounded-lg border border-purple-500/30 transition-all duration-300 transform hover:scale-105"
            onMouseEnter={() => setHoveredFeature('progression')}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2 relative">
              <Star size={16} className="text-purple-400" />
              {hoveredFeature === 'progression' && (
                <div className="absolute inset-0 bg-purple-500/30 rounded-full animate-ping"></div>
              )}
            </div>
            <h3 className="responsive-text-lg font-bold mb-1 text-purple-300">Character Growth</h3>
            <p className="text-gray-300 responsive-text-xs leading-relaxed">
              Choose from unique fighter classes and unlock powerful abilities.
            </p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="flex flex-wrap justify-center responsive-gap-2 mb-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-yellow-400/30">
            <div className="responsive-text-xl font-bold text-yellow-400">5+</div>
            <div className="text-gray-300 responsive-text-xs">Fighter Classes</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-400/30">
            <div className="responsive-text-xl font-bold text-green-400">15+</div>
            <div className="text-gray-300 responsive-text-xs">Enemy Types</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-blue-400/30">
            <div className="responsive-text-xl font-bold text-blue-400">100+</div>
            <div className="text-gray-300 responsive-text-xs">Shop Items</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-400/30">
            <div className="responsive-text-xl font-bold text-purple-400">∞</div>
            <div className="text-gray-300 responsive-text-xs">Adventure</div>
          </div>
        </div>

        {/* Main Enter Button */}
        <div className="relative mb-4">
          <button 
            type="button"
            className="group px-8 py-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 rounded-lg font-bold responsive-text-lg text-black transition-all duration-500 cursor-pointer select-none transform hover:scale-110 shadow-2xl relative overflow-hidden"
            onClick={handleEnterClick}
            style={{ 
              minWidth: '180px',
              minHeight: '45px',
              zIndex: 1000,
              position: 'relative'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            
            <div className="relative z-10 flex items-center justify-center">
              <Gamepad2 className="mr-2 animate-bounce" size={16} />
              <span>ENTER REALM</span>
              <Play className="ml-2 animate-bounce" size={16} style={{ animationDelay: '0.5s' }} />
            </div>
          </button>
          
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-lg blur-xl opacity-50 animate-pulse pointer-events-none"></div>
        </div>

        {/* Game Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 responsive-gap-2 mb-4 responsive-text-xs w-full max-w-3xl">
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-2 py-2 border border-gray-600/50">
            <Zap className="text-yellow-400 mr-1" size={10} />
            <span>Real-time Combat</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-2 py-2 border border-gray-600/50">
            <Crown className="text-purple-400 mr-1" size={10} />
            <span>Character Progression</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-2 py-2 border border-gray-600/50">
            <Shield className="text-blue-400 mr-1" size={10} />
            <span>Strategic Defense</span>
          </div>
          <div className="flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg px-2 py-2 border border-gray-600/50">
            <Star className="text-green-400 mr-1" size={10} />
            <span>Epic Rewards</span>
          </div>
        </div>

        {/* Controls Preview */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg responsive-p-3 border border-gray-600/50 mb-3 w-full max-w-3xl">
          <h3 className="responsive-text-lg font-bold mb-2 text-yellow-400">⚔️ COMBAT CONTROLS ⚔️</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 responsive-gap-2 responsive-text-xs">
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-2 py-1 mb-1 font-mono responsive-text-sm">WASD</div>
              <div className="text-gray-300">Movement</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-2 py-1 mb-1 font-mono responsive-text-sm">SPACE</div>
              <div className="text-gray-300">Attack</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-2 py-1 mb-1 font-mono responsive-text-sm">2</div>
              <div className="text-gray-300">Shuriken</div>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 rounded-lg px-2 py-1 mb-1 font-mono responsive-text-sm">SHIFT</div>
              <div className="text-gray-300">Block</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-gray-400 responsive-text-xs mb-3">
          <p className="mb-1">🎮 Immerse yourself in epic battles • 🏆 Become the ultimate fighter</p>
          <p>💰 Earn coins through victory • 🛒 Upgrade your arsenal • ⚡ Master legendary techniques</p>
        </div>

        {/* Built with Bolt badge */}
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full responsive-text-xs font-medium hover:bg-gray-700/60 transition-all duration-300 border border-gray-600 hover:border-gray-400"
        >
          ⚡ Powered by Bolt.new
        </a>
      </div>
    </div>
  );
};

export default WelcomePage;