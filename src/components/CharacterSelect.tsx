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
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-1 left-1 flex items-center px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors z-50"
      >
        <ArrowLeft size={8} className="mr-1" />
        <span className="text-xs">Back</span>
      </button>

      <div className="content-container">
        <h1 className="text-lg font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 text-center">
          Choose Your Fighter
        </h1>
        <p className="text-gray-300 mb-2 text-xs text-center">Select your character to begin your journey</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 w-full max-w-6xl mb-2">
          {characters.map(character => {
            const isUnlocked = character.unlocked;
            const isSelected = selectedClass === character.class;
            const isPremium = character.class === 'founder' || character.class === 'mystic-alchemist';
            
            return (
              <div 
                key={character.id}
                className={`relative border-2 rounded-lg p-2 transition-all duration-300 transform cursor-pointer ${
                  isSelected 
                    ? 'border-yellow-400 scale-105 bg-slate-700 shadow-2xl shadow-yellow-400/30' 
                    : 'border-slate-600 bg-slate-800 hover:bg-slate-700 hover:scale-102'
                } ${!isUnlocked ? 'opacity-60' : ''}`}
                onClick={() => handleCharacterClick(character.class, isUnlocked)}
              >
                {/* Character Portrait - KEEP VISIBLE */}
                <div className="w-full h-16 mb-1 overflow-hidden rounded-lg bg-slate-900 flex items-center justify-center relative">
                  <img 
                    src={character.portrait} 
                    alt={character.name} 
                    className="w-full h-full object-cover"
                  />
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-sm mb-1">🔒</div>
                        {isPremium ? (
                          <div className="text-yellow-400 font-bold text-xs">Premium</div>
                        ) : (
                          <div className="text-yellow-400 font-bold text-xs">{character.price}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <h3 className="text-sm font-bold mb-1">{character.name}</h3>
                <div className="mb-1 text-xs text-gray-300">
                  {character.class === 'balanced-fighter' && 'Balanced stats'}
                  {character.class === 'speed-demon' && 'Fast attacks'}
                  {character.class === 'heavy-hitter' && 'High damage'}
                  {character.class === 'defensive-tank' && 'Strong defense'}
                  {character.class === 'founder' && 'Ultimate power'}
                  {character.class === 'mystic-alchemist' && 'Alchemical arts'}
                </div>
                
                {/* Stats Display - TINY */}
                <div className="grid grid-cols-2 gap-1 mb-1">
                  <div className="flex items-center bg-slate-700 p-1 rounded text-xs">
                    <Heart className="text-red-500 mr-1" size={6} />
                    <span>{character.health}</span>
                  </div>
                  <div className="flex items-center bg-slate-700 p-1 rounded text-xs">
                    <Sword className="text-orange-500 mr-1" size={6} />
                    <span>{character.attack}</span>
                  </div>
                  <div className="flex items-center bg-slate-700 p-1 rounded text-xs">
                    <Shield className="text-blue-500 mr-1" size={6} />
                    <span>{character.defense}</span>
                  </div>
                  <div className="flex items-center bg-slate-700 p-1 rounded text-xs">
                    <Zap className="text-yellow-500 mr-1" size={6} />
                    <span>{character.speed}</span>
                  </div>
                </div>
                
                {/* Move Set Preview - TINY */}
                <div className="text-xs text-gray-400">
                  <h4 className="font-semibold mb-1 text-white text-xs">Moves:</h4>
                  <ul className="space-y-0">
                    {character.moveSet.filter(move => move.type === 'special').slice(0, 1).map(move => (
                      <li key={move.id} className="flex items-center">
                        <div className="w-1 h-1 bg-yellow-400 rounded-full mr-1"></div>
                        <span className="truncate text-xs">{move.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-1 right-1 z-10">
                    <div className="bg-yellow-400 text-black font-bold px-1 py-0.5 rounded-full text-xs animate-pulse">
                      ✓
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Current selection display */}
        <div className="mb-2 text-center">
          <p className="text-sm text-gray-300">
            Selected: <span className="text-yellow-400 font-bold text-base">
              {characters.find(c => c.class === selectedClass)?.name || 'None'}
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Ready to enter the world of combat!
          </p>
        </div>
        
        {/* START GAME BUTTON */}
        <div className="relative text-center">
          <button 
            type="button"
            className={`px-8 py-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 rounded-xl font-bold text-base text-black transition-all duration-300 cursor-pointer select-none transform hover:scale-110 shadow-2xl relative overflow-hidden ${
              isStarting ? 'opacity-75 scale-95' : 'hover:shadow-yellow-500/50'
            }`}
            onClick={handleStartGame}
            disabled={isStarting}
            style={{ 
              minWidth: '120px',
              minHeight: '32px',
              zIndex: 1000,
              position: 'relative'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full hover:translate-x-[-200%] transition-transform duration-1000"></div>
            <div className="relative z-10 flex items-center justify-center">
              {isStarting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black mr-1"></div>
                  Starting...
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
        <div className="mt-2 text-center text-xs text-gray-400">
          <div>🎮 WASD to move • 👊 Space to attack • 🥷 2 to throw shuriken</div>
          <div>🛡️ Shift to block • 🏠 Enter buildings • 💬 Talk to NPCs</div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelect;