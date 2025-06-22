import React, { useState } from 'react';
import { useGame } from './context/GameContext';
import WelcomePage from './components/WelcomePage';
import StartScreen from './components/StartScreen';
import CharacterSelect from './components/CharacterSelect';
import GameWorld from './components/GameWorld';
import SuccessPage from './components/SuccessPage';

function App() {
  const { state } = useGame();
  const [gameState, setGameState] = useState<'welcome' | 'start' | 'character-select' | 'playing' | 'success'>('welcome');

  // Check if we're on the success page
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_id')) {
      setGameState('success');
    }
  }, []);

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

  const handleBackToWelcome = () => {
    setGameState('welcome');
  };

  const handleBackToStart = () => {
    setGameState('start');
  };

  const handleSuccessContinue = () => {
    // Clear the URL parameters and continue to the game
    window.history.replaceState({}, document.title, window.location.pathname);
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
          <StartScreen onStart={handleStartGame} onBack={handleBackToWelcome} />
        </div>
      )}

      {gameState === 'character-select' && (
        <div className="absolute inset-0 z-10">
          <CharacterSelect onSelectComplete={handleCharacterSelected} onBack={handleBackToStart} />
        </div>
      )}

      {gameState === 'playing' && (
        <div className="absolute inset-0 z-10">
          <GameWorld />
        </div>
      )}

      {gameState === 'success' && (
        <div className="absolute inset-0 z-10">
          <SuccessPage onContinue={handleSuccessContinue} />
        </div>
      )}
    </div>
  );
}

export default App;