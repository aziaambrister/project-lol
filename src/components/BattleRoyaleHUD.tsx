import React from 'react';
import { useGame } from '../context/GameContext';
import { Shield, Heart, Users, Clock, Target, Zap } from 'lucide-react';

const BattleRoyaleHUD: React.FC = () => {
  const { state } = useGame();
  const { player, storm, playersAlive, gameTimer, killFeed } = state;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getStormPhaseColor = () => {
    switch (storm.phase) {
      case 1: return 'text-blue-400';
      case 2: return 'text-yellow-400';
      case 3: return 'text-orange-400';
      default: return 'text-red-400';
    }
  };
  
  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center space-x-6 bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
          {/* Players Alive */}
          <div className="flex items-center space-x-2">
            <Users className="text-white" size={20} />
            <span className="text-white font-bold text-lg">{playersAlive}</span>
            <span className="text-gray-300 text-sm">alive</span>
          </div>
          
          {/* Storm Timer */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${storm.phase <= 3 ? 'bg-blue-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className={`font-bold ${getStormPhaseColor()}`}>
              Storm {storm.phase}
            </span>
            <span className="text-white font-mono">{formatTime(gameTimer)}</span>
          </div>
          
          {/* Kills */}
          <div className="flex items-center space-x-2">
            <Target className="text-red-400" size={20} />
            <span className="text-white font-bold text-lg">{player.kills}</span>
            <span className="text-gray-300 text-sm">eliminations</span>
          </div>
        </div>
      </div>
      
      {/* Health and Shield */}
      <div className="absolute bottom-20 left-4 z-30">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          {/* Health */}
          <div className="flex items-center mb-3">
            <Heart className="text-red-500 mr-2" size={20} />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white font-bold">{player.character.health}</span>
                <span className="text-gray-300">/{player.character.maxHealth}</span>
              </div>
              <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                  style={{ width: `${(player.character.health / player.character.maxHealth) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Shield */}
          <div className="flex items-center">
            <Shield className="text-blue-500 mr-2" size={20} />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white font-bold">{player.character.shield}</span>
                <span className="text-gray-300">/{player.character.maxShield}</span>
              </div>
              <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
                  style={{ width: `${(player.character.shield / player.character.maxShield) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Weapon Slots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-2">
          {player.inventory.weapons.map((weapon, index) => (
            <div 
              key={index}
              className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                index === player.currentWeapon 
                  ? 'border-yellow-400 bg-yellow-400/20 scale-110' 
                  : 'border-gray-600 bg-black/60'
              }`}
            >
              {weapon ? (
                <div className="text-center">
                  <div className="text-2xl">{weapon.icon}</div>
                  <div className={`text-xs font-bold ${
                    weapon.rarity === 'common' ? 'text-gray-400' :
                    weapon.rarity === 'uncommon' ? 'text-green-400' :
                    weapon.rarity === 'rare' ? 'text-blue-400' :
                    weapon.rarity === 'epic' ? 'text-purple-400' : 'text-yellow-400'
                  }`}>
                    {index + 1}
                  </div>
                </div>
              ) : (
                <div className="text-gray-600 text-xs">{index + 1}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Materials */}
      <div className="absolute bottom-20 right-4 z-30">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <div className="text-white text-sm font-bold mb-2">Materials</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-600">🪵</span>
              <span className="text-white font-mono ml-2">{player.inventory.materials.wood}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">🧱</span>
              <span className="text-white font-mono ml-2">{player.inventory.materials.stone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-400">⚙️</span>
              <span className="text-white font-mono ml-2">{player.inventory.materials.metal}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Kill Feed */}
      <div className="absolute top-20 right-4 z-30 w-80">
        <div className="space-y-1">
          {killFeed.slice(-5).map((entry) => (
            <div 
              key={entry.id}
              className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-sm border border-white/10"
            >
              <span className="text-white font-bold">{entry.killer}</span>
              <span className="text-gray-400 mx-2">eliminated</span>
              <span className="text-white">{entry.victim}</span>
              <span className="text-yellow-400 ml-2">{entry.weapon}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Minimap */}
      <div className="absolute top-4 right-4 z-30">
        <div className="w-48 h-48 bg-black/80 backdrop-blur-sm rounded-lg border border-white/20 p-2">
          <div className="w-full h-full bg-green-900/50 rounded relative overflow-hidden">
            {/* Storm Circle */}
            <div 
              className="absolute border-2 border-purple-500 rounded-full"
              style={{
                width: `${(storm.currentRadius / 1000) * 100}%`,
                height: `${(storm.currentRadius / 1000) * 100}%`,
                left: `${((storm.centerX - storm.currentRadius) / 2000) * 100}%`,
                top: `${((storm.centerY - storm.currentRadius) / 2000) * 100}%`,
              }}
            ></div>
            
            {/* Player Position */}
            <div 
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${(player.position.x / 2000) * 100}%`,
                top: `${(player.position.y / 2000) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            ></div>
            
            {/* Other Players */}
            {state.otherPlayers.filter(p => p.isAlive).map((otherPlayer) => (
              <div 
                key={otherPlayer.id}
                className="absolute w-1.5 h-1.5 bg-red-400 rounded-full"
                style={{
                  left: `${(otherPlayer.position.x / 2000) * 100}%`,
                  top: `${(otherPlayer.position.y / 2000) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Abilities */}
      <div className="absolute bottom-32 left-4 z-30">
        <div className="flex space-x-2">
          {player.character.abilities.map((ability, index) => (
            <div 
              key={ability.id}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${
                ability.currentCooldown > 0 
                  ? 'border-gray-600 bg-gray-800/60' 
                  : 'border-blue-400 bg-blue-400/20 cursor-pointer hover:bg-blue-400/30'
              }`}
              title={ability.name}
            >
              <Zap size={20} className={ability.currentCooldown > 0 ? 'text-gray-500' : 'text-blue-400'} />
              {ability.currentCooldown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{ability.currentCooldown}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BattleRoyaleHUD;