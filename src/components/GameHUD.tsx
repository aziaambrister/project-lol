import React from 'react';
import { useGame } from '../context/GameContext';
import { Heart, Zap, Coins, Clock, Target } from 'lucide-react';

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
              <div className="text-yellow-400 text-sm">Level {player.character.level}</div>
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

      {/* Bottom Center - Move Set */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-2">
          {player.character.moveSet.slice(0, 4).map((move, index) => (
            <div 
              key={move.id}
              className={`w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200 ${
                move.currentCooldown > 0 
                  ? 'border-gray-600 bg-gray-800/60' 
                  : 'border-blue-400 bg-blue-400/20 cursor-pointer hover:bg-blue-400/30'
              }`}
              title={move.name}
            >
              <div className="text-xs text-white font-bold">{index + 1}</div>
              <div className="text-2xl">
                {move.id === 'shuriken-throw' ? (
                  <img src="/shuriken.png" alt="Shuriken" className="w-6 h-6" />
                ) : (
                  move.type === 'basic-attack' ? '👊' :
                  move.type === 'special' ? '⚡' :
                  move.type === 'block' ? '🛡️' :
                  move.type === 'dodge' ? '💨' : '⚔️'
                )}
              </div>
              {move.currentCooldown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{move.currentCooldown}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Right - XP Progress */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <div className="text-white text-sm mb-2">
            XP: {player.character.experience}/{player.character.experienceToNextLevel}
          </div>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-300"
              style={{ width: `${(player.character.experience / player.character.experienceToNextLevel) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameHUD;