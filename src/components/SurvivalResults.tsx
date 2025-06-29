import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Clock, Target, Coins, Star, RotateCcw, Home, Share } from 'lucide-react';

const SurvivalResults: React.FC = () => {
  const { state, restartSurvival, exitSurvival } = useGame();
  const { survival } = state;

  const calculateScore = () => {
    return (
      survival.stats.enemiesDefeated * 100 +
      survival.stats.survivalTime * 10 +
      survival.stats.waveReached * 500 +
      survival.stats.coinsEarned * 2
    );
  };

  const isNewRecord = () => {
    const score = calculateScore();
    return score > state.player.survivalBestScore || 
           survival.stats.waveReached > state.player.survivalBestWave;
  };

  const getRank = () => {
    const score = calculateScore();
    if (score >= 10000) return { rank: 'S', color: 'text-yellow-400' };
    if (score >= 7500) return { rank: 'A', color: 'text-purple-400' };
    if (score >= 5000) return { rank: 'B', color: 'text-blue-400' };
    if (score >= 2500) return { rank: 'C', color: 'text-green-400' };
    return { rank: 'D', color: 'text-gray-400' };
  };

  const rank = getRank();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            {isNewRecord() ? (
              <div className="text-6xl animate-pulse">🏆</div>
            ) : (
              <div className="text-6xl">💀</div>
            )}
          </div>
          
          <h1 className="text-4xl font-bold mb-2">
            {isNewRecord() ? 'NEW RECORD!' : 'GAME OVER'}
          </h1>
          
          <div className={`text-6xl font-bold ${rank.color} mb-2`}>
            {rank.rank}
          </div>
          
          <p className="text-gray-300">
            {isNewRecord() 
              ? 'Congratulations! You set a new personal best!' 
              : 'Better luck next time, fighter!'
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
            <Clock className="text-blue-400 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold">{Math.floor(survival.stats.survivalTime / 60)}:{(survival.stats.survivalTime % 60).toString().padStart(2, '0')}</div>
            <div className="text-gray-400 text-sm">Survival Time</div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
            <Target className="text-red-400 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold">{survival.stats.waveReached}</div>
            <div className="text-gray-400 text-sm">Wave Reached</div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
            <Trophy className="text-orange-400 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold">{survival.stats.enemiesDefeated}</div>
            <div className="text-gray-400 text-sm">Enemies Defeated</div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
            <Coins className="text-yellow-400 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold">{survival.stats.coinsEarned}</div>
            <div className="text-gray-400 text-sm">Coins Earned</div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Star className="text-yellow-400 mr-2" />
            Performance Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Total Score:</span>
                <span className="font-bold text-yellow-400">{calculateScore().toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Damage Dealt:</span>
                <span className="font-bold">{survival.stats.damageDealt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Damage Taken:</span>
                <span className="font-bold">{survival.stats.damageTaken.toLocaleString()}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Power-ups Used:</span>
                <span className="font-bold">{survival.stats.powerUpsUsed}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Character:</span>
                <span className="font-bold">{state.player.character.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Character Level:</span>
                <span className="font-bold">{state.player.character.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Records */}
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold mb-4">Personal Records</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Best Score:</span>
                <span className="font-bold text-yellow-400">
                  {Math.max(calculateScore(), state.player.survivalBestScore).toLocaleString()}
                  {calculateScore() > state.player.survivalBestScore && <span className="text-green-400 ml-2">NEW!</span>}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Best Wave:</span>
                <span className="font-bold text-purple-400">
                  {Math.max(survival.stats.waveReached, state.player.survivalBestWave)}
                  {survival.stats.waveReached > state.player.survivalBestWave && <span className="text-green-400 ml-2">NEW!</span>}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={restartSurvival}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
          >
            <RotateCcw size={20} />
            <span>Play Again</span>
          </button>
          
          <button
            onClick={() => {/* Share functionality */}}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
          >
            <Share size={20} />
            <span>Share Score</span>
          </button>
          
          <button
            onClick={exitSurvival}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
          >
            <Home size={20} />
            <span>Main Menu</span>
          </button>
        </div>

        {/* Rewards */}
        <div className="mt-8 text-center">
          <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4">
            <h4 className="font-bold text-yellow-400 mb-2">Rewards Earned</h4>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <Coins className="text-yellow-400 mr-2" size={20} />
                <span className="font-bold">+{survival.stats.coinsEarned} Coins</span>
              </div>
              {isNewRecord() && (
                <div className="flex items-center">
                  <Trophy className="text-yellow-400 mr-2" size={20} />
                  <span className="font-bold">+100 Bonus Coins</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurvivalResults;