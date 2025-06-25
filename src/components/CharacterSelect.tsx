import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CharacterClass } from '../types/game';
import { characters } from '../data/characters';
import { Shield, Sword, Zap, Heart, ArrowLeft } from 'lucide-react';

interface CharacterSelectProps {
  onSelectComplete: () => void;
  onBack: () => void;
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelectComplete, onBack }) => {
  const { startGame } = useGame();
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('balanced-fighter');
  const [isStarting, setIsStarting] = useState(false);

  const handleStartGame = async () => {
    if (isStarting) return;
    
    setIsStarting(true);
    console.log('Starting game with character:', selectedClass);
    
    startGame(selectedClass);
    
    setTimeout(() => {
      onSelectComplete();
      setIsStarting(false);
    }, 500);
  };

  const handleCharacterClick = (characterClass: CharacterClass, isUnlocked: boolean) => {
    if (isUnlocked) {
      setSelectedClass(characterClass);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-y-auto">
      <div className="flex flex-col items-center justify-start p-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="fixed top-4 left-4 flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors z-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          <span className="text-sm">Back</span>
        </button>

        <div className="w-full max-w-7xl pt-16">
          {/* Title */}
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 text-center">
            Choose Your Fighter
          </h1>
          <p className="text-gray-300 mb-6 text-xl text-center">Select your character to begin your journey</p>
          
          {/* CHARACTER GRID - Now Properly Scrollable */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-8">
            {characters.map(character => {
              const isUnlocked = character.unlocked;
              const isSelected = selectedClass === character.class;
              const isPremium = character.class === 'founder' || character.class === 'mystic-alchemist';
              
              return (
                <div 
                  key={character.id}
                  className={`relative border-2 rounded-lg p-6 transition-all duration-300 transform cursor-pointer min-h-[600px] ${
                    isSelected 
                      ? 'border-yellow-400 scale-105 bg-slate-700 shadow-2xl shadow-yellow-400/30' 
                      : 'border-slate-600 bg-slate-800 hover:bg-slate-700 hover:scale-102'
                  } ${!isUnlocked ? 'opacity-60' : ''}`}
                  onClick={() => handleCharacterClick(character.class, isUnlocked)}
                >
                  {/* Character Portrait - SMALLER to show full body */}
                  <div className="w-full h-32 mb-6 overflow-hidden rounded-lg bg-slate-900 flex items-center justify-center relative">
                    <img 
                      src={character.portrait} 
                      alt={character.name} 
                      className="w-full h-full object-contain"
                    />
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-3">🔒</div>
                          {isPremium ? (
                            <div className="text-yellow-400 font-bold text-xl">Premium Required</div>
                          ) : (
                            <div className="text-yellow-400 font-bold text-xl">{character.price} coins</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{character.name}</h3>
                  <div className="mb-6 text-lg text-gray-300">
                    {character.class === 'balanced-fighter' && 'Well-rounded fighter with balanced stats'}
                    {character.class === 'speed-demon' && 'Lightning-fast attacks and superior mobility'}
                    {character.class === 'heavy-hitter' && 'Devastating power with strong defense'}
                    {character.class === 'defensive-tank' && 'Master of defense and counter-attacks'}
                    {character.class === 'founder' && 'Legendary founder with ultimate power'}
                    {character.class === 'mystic-alchemist' && 'Master of alchemical arts and potions'}
                  </div>
                  
                  {/* Stats Display */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center bg-slate-700 p-4 rounded-lg">
                      <Heart className="text-red-500 mr-3" size={24} />
                      <div>
                        <div className="text-sm text-gray-400">Health</div>
                        <div className="font-bold text-xl">{character.health}</div>
                      </div>
                    </div>
                    <div className="flex items-center bg-slate-700 p-4 rounded-lg">
                      <Sword className="text-orange-500 mr-3" size={24} />
                      <div>
                        <div className="text-sm text-gray-400">Attack</div>
                        <div className="font-bold text-xl">{character.attack}</div>
                      </div>
                    </div>
                    <div className="flex items-center bg-slate-700 p-4 rounded-lg">
                      <Shield className="text-blue-500 mr-3" size={24} />
                      <div>
                        <div className="text-sm text-gray-400">Defense</div>
                        <div className="font-bold text-xl">{character.defense}</div>
                      </div>
                    </div>
                    <div className="flex items-center bg-slate-700 p-4 rounded-lg">
                      <Zap className="text-yellow-500 mr-3" size={24} />
                      <div>
                        <div className="text-sm text-gray-400">Speed</div>
                        <div className="font-bold text-xl">{character.speed}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Move Set Preview */}
                  <div className="text-lg text-gray-400">
                    <h4 className="font-semibold mb-3 text-white">Special Moves:</h4>
                    <ul className="space-y-2">
                      {character.moveSet.filter(move => move.type === 'special').slice(0, 2).map(move => (
                        <li key={move.id} className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                          <span className="truncate">{move.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-6 right-6 z-10">
                      <div className="bg-yellow-400 text-black font-bold px-4 py-3 rounded-full text-xl animate-pulse">
                        ✓ SELECTED
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Current selection display */}
          <div className="mb-8 text-center">
            <p className="text-2xl text-gray-300">
              Selected: <span className="text-yellow-400 font-bold text-3xl">
                {characters.find(c => c.class === selectedClass)?.name || 'None'}
              </span>
            </p>
            <p className="text-xl text-gray-400 mt-3">
              Ready to enter the world of combat!
            </p>
          </div>
          
          {/* START GAME BUTTON */}
          <div className="relative text-center mb-8">
            <button 
              type="button"
              className={`px-24 py-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 rounded-xl font-bold text-3xl text-black transition-all duration-300 cursor-pointer select-none transform hover:scale-110 shadow-2xl relative overflow-hidden ${
                isStarting ? 'opacity-75 scale-95' : 'hover:shadow-yellow-500/50'
              }`}
              onClick={handleStartGame}
              disabled={isStarting}
              style={{ 
                minWidth: '320px',
                minHeight: '80px',
                zIndex: 1000,
                position: 'relative'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full hover:translate-x-[-200%] transition-transform duration-1000"></div>
              <div className="relative z-10 flex items-center justify-center">
                {isStarting ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-4"></div>
                    Starting Game...
                  </>
                ) : (
                  <>
                    ⚔️ START GAME ⚔️
                  </>
                )}
              </div>
            </button>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl blur-xl opacity-40 animate-pulse pointer-events-none"></div>
          </div>
          
          {/* Controls hint */}
          <div className="text-center text-xl text-gray-400 pb-8">
            <div>🎮 WASD to move • 👊 Space to attack • 🥷 2 to throw shuriken</div>
            <div>🛡️ Shift to block • 🏠 Enter buildings • 💬 Talk to NPCs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelect;