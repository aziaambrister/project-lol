import React, { useState } from 'react';
import { useGame } from './context/GameContext';
import WelcomePage from './components/WelcomePage';
import StartScreen from './components/StartScreen';
import CharacterSelect from './components/CharacterSelect';
import GameWorld from './components/GameWorld';

function App() {
  const { state } = useGame();
  const [gameState, setGameState] = useState<'welcome' | 'start' | 'character-select' | 'playing'>('welcome');

  const handleEnterGame = () => {
    console.log('handleEnterGame called - transitioning to start screen');
    setGameState('start');
  };

  const handleStartGame = () => {
    console.log('handleStartGame called - transitioning to character-select');
    setGameState('character-select');
  };

  const handleCharacterSelected = () => {
    console.log('handleCharacterSelected called - transitioning to playing');
    setGameState('playing');
  };

  console.log('Current game state:', gameState);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {gameState === 'welcome' && (
        <div className="absolute inset-0 z-10">
          <WelcomePage onEnter={handleEnterGame} />
        </div>
      )}

      {gameState === 'start' && (
        <div className="absolute inset-0 z-10">
          <StartScreen onStart={handleStartGame} />
        </div>
      )}

      {gameState === 'character-select' && (
        <div className="absolute inset-0 z-10">
          <CharacterSelect onSelectComplete={handleCharacterSelected} />
        </div>
      )}

      {gameState === 'playing' && (
        <div className="absolute inset-0 z-10">
          {console.log('Rendering character image:', '/imgs_png/ninja.png')}
          <img
            src="/imgs_png/ninja.png"
            alt="Ninja"
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
