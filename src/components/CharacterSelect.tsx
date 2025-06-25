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
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden p-1">
      {/* Back Button - TINY */}
      <button
        onClick={onBack}
        className="absolute top-0.5 left-0.5 flex items-center px-1 py-0.5 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors z-50"
      >
        <ArrowLeft size={6} className="mr-0.5" />
        <span className="text-xs">Back</span>
      </button>

      <div className="w-full max-w-7xl">
        <h1 className="text-sm font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 text-center">
          Choose Your Fighter
        </h1>
        <p className="text-gray-300 mb-1 text-xs text-center">Select your character</p>
        
        {/* SUPER TINY CHARACTER GRID */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1 w-full mb-1">
          {characters.map(character => {
            const isUnlocked = character.unlocked;
            const isSelected = selectedClass === character.class;
            const isPremium = character.class === 'founder' || character.class === 'mystic-alchemist';
            
            return (
              <div 
                key={character.id}
                className={`relative border rounded p-1 transition-all duration-300 transform cursor-pointer ${
                  isSelected 
                    ? 'border-yellow-400 scale-105 bg-slate-700 shadow-lg shadow-yellow-400/30' 
                    : 'border-slate-600 bg-slate-800 hover:bg-slate-700'
                } ${!isUnlocked ? 'opacity-60' : ''}`}
                onClick={() => handleCharacterClick(character.class, isUnlocked)}
              >
                {/* Character Portrait - KEEP VISIBLE BUT SMALLER */}
                <div className="w-full h-8 mb-0.5 overflow-hidden rounded bg-slate-900 flex items-center justify-center relative">
                  <img 
                    src={character.portrait} 
                    alt={character.name} 
                    className="w-full h-full object-cover"
                  />
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs">🔒</div>
                        {isPremium ? (
                          <div className="text-yellow-400 font-bold text-xs">$</div>
                        ) : (
                          <div className="text-yellow-400 font-bold text-xs">{character.price}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xs font-bold mb-0.5 truncate">{character.name}</h3>
                
                {/* TINY Stats Display */}
                <div className="grid grid-cols-2 gap-0.5 mb-0.5">
                  <div className="flex items-center bg-slate-700 p-0.5 rounded text-xs">
                    <Heart className="text-red-500 mr-0.5" size={4} />
                    <span className="text-xs">{character.health}</span>
                  </div>
                  <div className="flex items-center bg-slate-700 p-0.5 rounded text-xs">
                    <Sword className="text-orange-500 mr-0.5" size={4} />
                    <span className="text-xs">{character.attack}</span>
                  </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-yellow-400 text-black font-bold px-0.5 py-0 rounded text-xs">
                      ✓
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Current selection display - TINY */}
        <div className="mb-1 text-center">
          <p className="text-xs text-gray-300">
            Selected: <span className="text-yellow-400 font-bold text-sm">
              {characters.find(c => c.class === selectedClass)?.name || 'None'}
            </span>
          </p>
        </div>
        
        {/* START GAME BUTTON - VISIBLE */}
        <div className="relative text-center">
          <button 
            type="button"
            className={`px-4 py-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 rounded-lg font-bold text-sm text-black transition-all duration-300 cursor-pointer select-none transform hover:scale-110 shadow-xl relative overflow-hidden ${
              isStarting ? 'opacity-75 scale-95' : 'hover:shadow-yellow-500/50'
            }`}
            onClick={handleStartGame}
            disabled={isStarting}
            style={{ 
              minWidth: '100px',
              minHeight: '28px',
              zIndex: 1000,
              position: 'relative'
            }}
          >
            <div className="relative z-10 flex items-center justify-center">
              {isStarting ? (
                <>
                  <div className="animate-spin rounded-full h-2 w-2 border-b border-black mr-1"></div>
                  Starting...
                </>
              ) : (
                <>
                  ⚔️ START GAME ⚔️
                </>
              )}
            </div>
          </button>
        </div>
        
        {/* Controls hint - TINY */}
        <div className="mt-1 text-center text-xs text-gray-400">
          <div>🎮 WASD move • 👊 Space attack • 🥷 2 shuriken • 🛡️ Shift block</div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelect;