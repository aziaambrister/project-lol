import React, { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import StartScreen from './components/StartScreen';
import CharacterSelect from './components/CharacterSelect';
import GameWorld from './components/GameWorld';
import { characters } from './data/characters';

function App() {
  const [gameState, setGameState] = useState<'welcome' | 'start' | 'character-select' | 'playing'>('welcome');
  const [selectedCharacterClass, setSelectedCharacterClass] = useState<string>('balanced-fighter');

  const handleEnterGame = () => setGameState('start');
  const handleStartGame = () => setGameState('character-select');
  const handleCharacterSelected = () => setGameState('playing');

  // Find the selected character object by class
  const selectedCharacter = characters.find(c => c.class === selectedCharacterClass);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {gameState === 'welcome' && (
        <WelcomePage onEnter={handleEnterGame} />
      )}
      {gameState === 'start' && (
        <StartScreen onStart={handleStartGame} />
      )}
      {gameState === 'character-select' && (
        <CharacterSelect
          onSelectComplete={handleCharacterSelected}
          setSelectedCharacterClass={setSelectedCharacterClass}
          selectedCharacterClass={selectedCharacterClass}
        />
      )}
      {gameState === 'playing' && selectedCharacter && (
        <div className="absolute inset-0 z-10">
          <img
            src={selectedCharacter.portrait}
            alt={selectedCharacter.name}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100px',
              height: '100px',
              zIndex: 20,
            }}
          />
          <GameWorld />
        </div>
      )}
    </div>
  );
}

export default App;
