import React, { useState } from 'react';
import { useGame } from './context/GameContext';
import WelcomePage from './components/WelcomePage';
import StartScreen from './components/StartScreen';
import CharacterSelect from './components/CharacterSelect';
import GameWorld from './components/GameWorld';
import ForestCabinInterior from './components/ForestCabinInterior';
import SuccessPage from './components/SuccessPage';

// ✅ Add these for global WASD handling
const keysHeld: Record<string, boolean> = {};

window.addEventListener("keydown", (e) => {
  keysHeld[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  keysHeld[e.key.toLowerCase()] = false;
});

// You can access keysHeld["w"], ["a"], etc. from anywhere (GameWorld, etc)

function App() {
  const { state } = useGame();
  const [gameState, setGameState] = useState<
    'welcome' | 'start' | 'character-select' | 'playing' | 'cabin-interior' | 'success'
  >('welcome');

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_id')) {
      setGameState('success');
    }
  }, []);

  React.useEffect(() => {
    if (
      state.gameMode === 'building-interior' &&
      state.player.currentBuilding === 'forest-cabin-1'
    ) {
      setGameState('cabin-interior');
    } else if (state.gameMode === 'world-exploration' && gameState === 'cabin-interior') {
      setGameState('playing');
    }
  }, [state.gameMode, state.player.currentBuilding, gameState]);

  const handleEnterGame = () => {
    setGameState('start');
  };

  const handleStartGame = () => {
    setGameState('character-select');
  };

  const handleCharacterSelected = () => {
    setGameState('playing');
  };

  const handleBackToWelcome = () => {
    setGameState('welcome');
  };

  const handleBackToStart = () => {
    setGameState('start');
  };

  const handleSuccessContinue = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    setGameState('playing');
  };

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
          <GameWorld keysHeld={keysHeld} /> {/* 👈 pass WASD state */}
        </div>
      )}

      {gameState === 'cabin-interior' && (
        <div className="absolute inset-0 z-10">
          <ForestCabinInterior keysHeld={keysHeld} /> {/* 👈 pass WASD state */}
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
