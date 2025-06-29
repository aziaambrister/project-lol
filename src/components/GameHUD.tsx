import React from 'react';
import { useGame } from '../context/GameContext';
import { Heart, Zap, Coins, Clock, Target, Star } from 'lucide-react';

const GameHUD: React.FC = () => {
  const { state } = useGame();
  const { player, currentWorld, combat } = state;

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getTimeOfDay = () => {
    const time = currentWorld.dayNightCycle.currentTime;
    if (time >= 6 && time < 12) return 'Morning';
    if (time >= 12 && time < 18) return 'Afternoon';
    if (time >= 18 && time < 22) return 'Evening';
    return 'Night';
  };

  // Calculate XP percentage for progress bar
  const xpPercentage = (player.character.experience / player.character.experienceToNextLevel) * 100;

  return (
    <>
      {/* Top Left - Character Stats */}
      <div className="absolute top-4 left-4 z-30">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          {/* Character Info */}
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400 mr-3">
              <img 
                src={player.character.portrait}
                alt={player.character.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-white font-bold">{player.character.name}</h3>
              <div className="text-yellow-400 text-sm flex items-center">
                <Star size={12} className="mr-1" />
                Level {player.character.level}
              </div>
            </div>
          </div>
          
          {/* Health */}
          <div className="flex items-center mb-2">
            <Heart className="text-red-500 mr-2" size={16} />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">{player.character.health}</span>
                <span className="text-gray-300">/{player.character.maxHealth}</span>
              </div>
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                  style={{ width: `${(player.character.health / player.character.maxHealth) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="flex items-center mb-2">
            <Zap className="text-blue-500 mr-2" size={16} />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">{player.character.experience}</span>
                <span className="text-gray-300">/{player.character.experienceToNextLevel}</span>
              </div>
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
                  style={{ width: `${xpPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Right - Time, Weather, and Coins */}
      <div className="absolute top-4 right-4 z-30">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center">
              <Clock className="text-yellow-400 mr-2" size={16} />
              <div>
                <div className="text-white font-bold">
                  {formatTime(currentWorld.dayNightCycle.currentTime)}
                </div>
                <div className="text-gray-300 text-xs">{getTimeOfDay()}</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-2xl mr-2">
                {currentWorld.weather.type === 'clear' ? '☀️' :
                 currentWorld.weather.type === 'rain' ? '🌧️' :
                 currentWorld.weather.type === 'storm' ? '⛈️' : '🌫️'}
              </div>
              <div className="text-white text-sm capitalize">{currentWorld.weather.type}</div>
            </div>
          </div>
          
          {/* Coins Display */}
          <div className="flex items-center bg-yellow-500/20 rounded-lg px-3 py-2 border border-yellow-400/50">
            <Coins className="text-yellow-400 mr-2" size={20} />
            <div>
              <div className="text-yellow-400 font-bold text-lg">{player.currency}</div>
              <div className="text-yellow-300 text-xs">Coins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left - Combat Info */}
      {combat.inCombat && (
        <div className="absolute bottom-20 left-4 z-30">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-red-500/50">
            <div className="flex items-center mb-2">
              <Target className="text-red-500 mr-2" size={16} />
              <span className="text-white font-bold">Combat Active</span>
            </div>
            {combat.comboCount > 0 && (
              <div className="text-yellow-400 text-sm">
                Combo: {combat.comboCount}x
              </div>
            )}
          </div>
        </div>
      )}

      {/* XP Collection Hint */}
      <div className="absolute bottom-4 left-4 z-30">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-blue-500/50">
          <div className="text-blue-400 text-sm flex items-center">
            <Zap className="mr-2" size={16} />
            <span>Collect XP orbs to level up!</span>
          </div>
          <div className="text-gray-300 text-xs mt-1">
            Blue: 5-10 XP • Purple: 15-25 XP • Gold: 30-50 XP
          </div>
        </div>
      </div>
    </>
  );
};

export default GameHUD;