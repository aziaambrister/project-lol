import React, { useState } from "react";
import { characters } from "../data/characters";

interface CharacterSelectProps {
  onSelectComplete: () => void;
  setSelectedCharacterClass: (characterClass: string) => void;
  selectedCharacterClass: string;
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({
  onSelectComplete,
  setSelectedCharacterClass,
  selectedCharacterClass,
}) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleCharacterClick = (characterClass: string, isUnlocked: boolean) => {
    if (isUnlocked) {
      setSelectedCharacterClass(characterClass);
    }
  };

  const handleStartGame = () => {
    if (!selectedCharacterClass || isStarting) return;
    setIsStarting(true);
    setTimeout(() => {
      onSelectComplete();
      setIsStarting(false);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4">
      <h1 className="text-4xl font-bold mb-4 text-yellow-400">Choose Your Fighter</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl mb-12">
        {characters.map((character) => {
          const isUnlocked = character.unlocked;
          const isSelected = selectedCharacterClass === character.class;
          return (
            <div
              key={character.class}
              className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-yellow-400 scale-105 bg-slate-700"
                  : "border-slate-600 bg-slate-800 hover:bg-slate-700"
              } ${!isUnlocked ? "opacity-60" : ""}`}
              onClick={() => handleCharacterClick(character.class, isUnlocked)}
            >
              <div className="w-full h-40 mb-4 overflow-hidden rounded-lg bg-slate-900 flex items-center justify-center relative">
                <img
                  src={character.portrait}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🔒</div>
                      <div className="text-yellow-400 font-bold">{character.price} coins</div>
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{character.name}</h3>
              <div className="mb-2 text-sm text-gray-300">{character.description}</div>
              {isSelected && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-sm animate-pulse">
                    ✓ SELECTED
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mb-8 text-center">
        <p className="text-xl text-gray-300">
          Selected:{" "}
          <span className="text-yellow-400 font-bold text-2xl">
            {characters.find((c) => c.class === selectedCharacterClass)?.name || "None"}
          </span>
        </p>
      </div>
      <button
        type="button"
        className={`px-12 py-4 bg-yellow-400 text-black font-bold text-2xl rounded-xl transition-all duration-300 ${
          isStarting ? "opacity-50" : "hover:bg-yellow-300"
        }`}
        onClick={handleStartGame}
        disabled={isStarting}
      >
        {isStarting ? "Starting..." : "Start Game"}
      </button>
    </div>
  );
};

export default CharacterSelect;
