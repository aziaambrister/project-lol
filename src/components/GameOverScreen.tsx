import React from 'react';
import { useGame } from '../context/GameContext';
import { Skull, RotateCcw, ShoppingBag, Home, Coins, Heart } from 'lucide-react';

const GameOverScreen: React.FC = () => {
  const { state, restartGame } = useGame();

  const handleRetry = () => {
    restartGame();
  };

  const handleGoToShop = () => {
    // This would navigate to shop - for now we'll restart and let player access shop
    restartGame();
  };

  const handleGoToHomepage = () => {
    // Reload the page to go back to welcome screen
    window.location.reload();
  };

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-red-900 via-gray-900 to-black rounded-2xl border-2 border-red-500/50 shadow-2xl p-8 w-96 max-w-[90vw] text-center">
        
        {/* Skull Animation */}
        <div className="mb-6">
          <div className="relative inline-block">
            <Skull size={80} className="text-red-500 animate-pulse" />
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Game Over Title */}
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
          GAME OVER
        </h1>
        
        <p className="text-xl text-gray-300 mb-6">
          Your journey has come to an end...
        </p>

        {/* Player Stats */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-red-500/30 mb-6">
          <h2 className="text-lg font-bold mb-3 text-red-400">Final Stats</h2>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-gray-400">Character</div>
              <div className="font-bold text-white">{state.player.character.name}</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-gray-400">Level</div>
              <div className="font-bold text-yellow-400">{state.player.character.level}</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3 flex items-center">
              <Coins className="text-yellow-400 mr-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs">Coins</div>
                <div className="font-bold text-yellow-400">{state.player.currency}</div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3 flex items-center">
              <Heart className="text-red-500 mr-1" size={16} />
              <div>
                <div className="text-gray-400 text-xs">Max HP</div>
                <div className="font-bold text-red-400">{state.player.character.maxHealth}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Retry Button */}
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <RotateCcw size={20} />
            <span>Try Again</span>
          </button>

          {/* Shop Button */}
          <button
            onClick={handleGoToShop}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <ShoppingBag size={20} />
            <span>Visit Shop</span>
          </button>

          {/* Homepage Button */}
          <button
            onClick={handleGoToHomepage}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Home size={20} />
            <span>Main Menu</span>
          </button>
        </div>

        {/* Encouragement Message */}
        <div className="mt-6 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
          <p className="text-blue-300 text-sm">
            💡 <strong>Tip:</strong> Visit the shop to upgrade your gear and try different strategies!
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 text-xs text-gray-500">
          Death is not the end, but a new beginning...
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;