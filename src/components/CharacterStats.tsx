import React from 'react';
import { useGame } from '../context/GameContext';
import { 
  Swords, Shield, Zap, Heart, User, 
  Award, TrendingUp, ArrowUp, Gauge
} from 'lucide-react';

const CharacterStats: React.FC = () => {
  const { state, switchCharacter } = useGame();
  const { character, unlockedCharacters } = state.player;
  
  // Calculate XP percentage
  const xpPercentage = (character.experience / character.experienceToNextLevel) * 100;
  
  // Get other unlocked characters
  const otherCharacters = unlockedCharacters
    .filter(charClass => charClass !== character.class)
    .map(charClass => {
      return state.characters.find(c => c.class === charClass);
    })
    .filter(Boolean);
  
  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-90 text-white z-20 overflow-hidden">
      <div className="container mx-auto h-full p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Character Sheet</h2>
        
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Character info */}
            <div className="lg:w-1/3">
              <div className="bg-gray-800 rounded-lg p-4 h-full">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-500 mb-4">
                    <img 
                      src={character.portrait}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold">{character.name}</h3>
                  <div className="flex items-center mt-1">
                    <Award className="text-yellow-400 mr-1" size={16} />
                    <span className="text-sm">Level {character.level}</span>
                  </div>
                </div>
                
                {/* XP Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span>XP: {character.experience}/{character.experienceToNextLevel}</span>
                    <span>{Math.round(xpPercentage)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500"
                      style={{ width: `${xpPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Base Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700 p-3 rounded-md flex items-center">
                    <Heart className="text-red-500 mr-3" size={20} />
                    <div>
                      <div className="text-xs text-gray-300">Health</div>
                      <div className="font-medium">{character.health}/{character.maxHealth}</div>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-md flex items-center">
                    <Swords className="text-orange-500 mr-3" size={20} />
                    <div>
                      <div className="text-xs text-gray-300">Strength</div>
                      <div className="font-medium">{character.strength}</div>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-md flex items-center">
                    <Shield className="text-blue-500 mr-3" size={20} />
                    <div>
                      <div className="text-xs text-gray-300">Defense</div>
                      <div className="font-medium">{character.defense}</div>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-md flex items-center">
                    <Gauge className="text-green-500 mr-3" size={20} />
                    <div>
                      <div className="text-xs text-gray-300">Speed</div>
                      <div className="font-medium">{character.speed}</div>
                    </div>
                  </div>
                </div>
                
                {/* Class description */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <User className="mr-2" size={16} />
                    Class: {character.class.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {character.class === 'shadow-ninja' && "A master of stealth and agility, the Shadow Ninja excels at quick strikes and evasion."}
                    {character.class === 'mystic-archer' && "The Mystic Archer combines ranged attacks with magical abilities to strike from a distance."}
                    {character.class === 'battle-mage' && "Battle Mages harness arcane energy to enhance their combat abilities and devastate enemies."}
                    {character.class === 'rogue-knight' && "A Rogue Knight balances heavy attacks with mobility, making them versatile fighters."}
                  </p>
                </div>
                
                {/* Other characters */}
                {otherCharacters.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Switch Character:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {otherCharacters.map(char => (
                        <button
                          key={char?.id}
                          className="flex items-center p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
                          onClick={() => switchCharacter(char?.class)}
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                            <img 
                              src={char?.portrait}
                              alt={char?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{char?.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Abilities & Progress */}
            <div className="lg:w-2/3">
              <div className="bg-gray-800 rounded-lg p-4 h-full">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Zap className="text-yellow-400 mr-2" size={20} />
                  Abilities
                </h3>
                
                {/* Abilities list */}
                <div className="space-y-4 mb-6">
                  {character.abilities.map(ability => {
                    const isUnlocked = character.level >= ability.unlockLevel;
                    
                    return (
                      <div 
                        key={ability.id}
                        className={`p-3 rounded-md border ${
                          isUnlocked 
                            ? 'border-gray-600 bg-gray-700' 
                            : 'border-gray-700 bg-gray-800 opacity-60'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">
                              {ability.name}
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                ability.type === 'attack' ? 'bg-red-700' :
                                ability.type === 'defense' ? 'bg-blue-700' : 'bg-purple-700'
                              }`}>
                                {ability.type.charAt(0).toUpperCase() + ability.type.slice(1)}
                              </span>
                            </h4>
                            <p className="text-sm text-gray-300 mt-1">{ability.description}</p>
                          </div>
                          
                          {!isUnlocked && (
                            <div className="text-xs bg-gray-900 px-2 py-1 rounded flex items-center">
                              <TrendingUp size={12} className="mr-1" />
                              Unlocks at level {ability.unlockLevel}
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                          {ability.damage > 0 && (
                            <div className="bg-gray-600 p-2 rounded flex items-center">
                              <Swords size={12} className="text-red-400 mr-1" />
                              <span>Damage: {ability.damage}</span>
                            </div>
                          )}
                          {ability.manaCost > 0 && (
                            <div className="bg-gray-600 p-2 rounded flex items-center">
                              <Zap size={12} className="text-blue-400 mr-1" />
                              <span>Cost: {ability.manaCost}</span>
                            </div>
                          )}
                          {ability.cooldown > 0 && (
                            <div className="bg-gray-600 p-2 rounded flex items-center">
                              <span>Cooldown: {ability.cooldown} turns</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Next level preview */}
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <ArrowUp className="text-green-400 mr-2" size={20} />
                    Next Level
                  </h3>
                  
                  <div className="p-4 border border-dashed border-green-500 rounded-md bg-green-900 bg-opacity-10">
                    <h4 className="font-semibold mb-2">Level {character.level + 1} Rewards:</h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-700 p-2 rounded-md flex items-center">
                        <Heart className="text-red-500 mr-2" size={16} />
                        <div>
                          <div className="text-xs text-gray-300">Health</div>
                          <div className="flex items-center">
                            <span className="mr-2">{character.maxHealth}</span>
                            <span className="text-green-400">+10</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-700 p-2 rounded-md flex items-center">
                        <Swords className="text-orange-500 mr-2" size={16} />
                        <div>
                          <div className="text-xs text-gray-300">Strength</div>
                          <div className="flex items-center">
                            <span className="mr-2">{character.strength}</span>
                            <span className="text-green-400">+1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Unlock preview */}
                    {character.abilities.some(a => a.unlockLevel === character.level + 1) && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">New Ability Unlocked:</h5>
                        {character.abilities
                          .filter(a => a.unlockLevel === character.level + 1)
                          .map(ability => (
                            <div key={ability.id} className="bg-gray-700 p-2 rounded-md text-sm">
                              <div className="font-medium">{ability.name}</div>
                              <div className="text-xs text-gray-300">{ability.description}</div>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterStats;