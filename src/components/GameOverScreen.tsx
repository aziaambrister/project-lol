import React from 'react';
import { useGame } from '../context/GameContext';
import { RotateCcw, Home, Skull, Trophy, Coins, Target } from 'lucide-react';

interface GameOverScreenProps {
  onTryAgain: () => void;
  onReturnHome: () => void;
  victory?: boolean;
  stats?: {
    enemiesDefeated: number;
    coinsEarned: number;
    timeAlive: number;
  };
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ 
  onTryAgain, 
  onReturnHome, 
  victory = false,
  stats = { enemiesDefeated: 0, coinsEarned: 0, timeAlive: 0 }
}) => {
  const { state } = useGame();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative max-w-2xl w-full mx-4">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-gray-900/40 to-black/60 rounded-3xl blur-xl"></div>
        
        {/* Main Container */}
        <div className={`relative bg-gradient-to-br ${victory ? 'from-yellow-900/80 via-green-900/60' : 'from-red-900/80 via-gray-900/60'} to-black/80 backdrop-blur-lg rounded-3xl border-2 ${victory ? 'border-yellow-400/60' : 'border-red-500/60'} p-8 text-white shadow-2xl`}>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              {victory ? (
                <Trophy className="mx-auto text-yellow-400 animate-bounce" size={80} />
              ) : (
                <Skull className="mx-auto text-red-500 animate-pulse" size={80} />
              )}
            </div>
            
            <h1 className={`text-6xl font-bold mb-4 text-transparent bg-clip-text ${victory ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-red-500 to-red-700'}`}>
              {victory ? 'VICTORY!' : 'GAME OVER'}
            </h1>
            
            <p className="text-xl text-gray-300 mb-6">
              {victory 
                ? 'Congratulations! You have proven yourself as a true warrior!' 
                : 'Your journey ends here, but every defeat makes you stronger.'}
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 text-center">
              <Target className="mx-auto text-red-400 mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-2">{stats.enemiesDefeated}</div>
              <div className="text-gray-300 text-sm">Enemies Defeated</div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 text-center">
              <Coins className="mx-auto text-yellow-400 mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-2">{stats.coinsEarned}</div>
              <div className="text-gray-300 text-sm">Coins Earned</div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 text-center">
              <div className="mx-auto text-blue-400 mb-3 text-3xl">⏱️</div>
              <div className="text-3xl font-bold text-white mb-2">{formatTime(stats.timeAlive)}</div>
              <div className="text-gray-300 text-sm">Time Survived</div>
            </div>
          </div>

          {/* Player Final Stats */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 mb-8">
            <h3 className="text-xl font-bold text-center mb-4 text-yellow-400">Final Character Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{state.player.character.level}</div>
                <div className="text-gray-300 text-sm">Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{state.player.character.attack}</div>
                <div className="text-gray-300 text-sm">Attack</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{state.player.character.defense}</div>
                <div className="text-gray-300 text-sm">Defense</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{state.player.currency}</div>
                <div className="text-gray-300 text-sm">Total Coins</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Try Again Button */}
            <button
              onClick={onTryAgain}
              className="group flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-xl font-bold text-xl text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30 border-2 border-green-500/50"
            >
              <RotateCcw className="mr-3 group-hover:rotate-180 transition-transform duration-500" size={24} />
              <span>TRY AGAIN</span>
            </button>

            {/* Return to Home Button */}
            <button
              onClick={onReturnHome}
              className="group flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl font-bold text-xl text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/30 border-2 border-blue-500/50"
            >
              <Home className="mr-3 group-hover:scale-110 transition-transform duration-300" size={24} />
              <span>RETURN TO HOME</span>
            </button>
          </div>

          {/* Motivational Message */}
          <div className="text-center mt-8 p-4 bg-black/20 rounded-xl border border-gray-600/30">
            <p className="text-gray-300 text-sm italic">
              {victory 
                ? '"Victory belongs to the most persevering." - Napoleon Bonaparte'
                : '"It is not the size of a man but the size of his heart that matters." - Evander Holyfield'}
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        {victory && (
          <>
            <div className="absolute -top-4 -left-4 text-4xl animate-bounce">🎉</div>
            <div className="absolute -top-4 -right-4 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>🏆</div>
            <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce" style={{ animationDelay: '1s' }}>⭐</div>
            <div className="absolute -bottom-4 -right-4 text-4xl animate-bounce" style={{ animationDelay: '1.5s' }}>🎊</div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameOverScreen;