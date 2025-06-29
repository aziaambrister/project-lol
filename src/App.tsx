import React, { useState } from 'react';
import { useGame } from './context/GameContext';
import WelcomePage from './components/WelcomePage';
import StartScreen from './components/StartScreen';
import CharacterSelect from './components/CharacterSelect';
import GameWorld from './components/GameWorld';
import ForestCabinInterior from './components/ForestCabinInterior';
import SuccessPage from './components/SuccessPage';
import GameOverScreen from './components/GameOverScreen';
import SurvivalMode from './components/SurvivalMode';
import SurvivalResults from './components/SurvivalResults';

// ✅ Add these for global WASD handling
const keysHeld: Record<string, boolean> = {};

window.addEventListener("keydown", (e) => {
  keysHeld[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
  keysHeld[e.key.toLowerCase()] = false;
});

function App() {
  const { state, startGame, startSurvival } = useGame();
  const [gameState, setGameState] = useState<
    'welcome' | 'start' | 'character-select' | 'survival-character-select' | 'playing' | 'cabin-interior' | 'success'
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

  const handleStartAdventure = () => {
    setGameState('character-select');
  };

  const handleStartSurvival = () => {
    setGameState('survival-character-select');
  };

  const handleCharacterSelected = () => {
    setGameState('playing');
  };

  const handleSurvivalCharacterSelected = (characterClass: any) => {
    startSurvival(characterClass);
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

  // Handle game mode changes from context
  React.useEffect(() => {
    if (state.gameMode === 'survival-mode') {
      // Already handled by character selection
    } else if (state.gameMode === 'survival-results') {
      // Results will be shown automatically
    }
  }, [state.gameMode]);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {gameState === 'welcome' && (
        <div className="absolute inset-0 z-10">
          <WelcomePage onEnter={handleEnterGame} />
        </div>
      )}

      {gameState === 'start' && (
        <div className="absolute inset-0 z-10">
          <StartScreen 
            onStart={handleStartAdventure} 
            onSurvival={handleStartSurvival}
            onBack={handleBackToWelcome} 
          />
        </div>
      )}

      {gameState === 'character-select' && (
        <div className="absolute inset-0 z-10">
          <CharacterSelect onSelectComplete={handleCharacterSelected} onBack={handleBackToStart} />
        </div>
      )}

      {gameState === 'survival-character-select' && (
        <div className="absolute inset-0 z-10">
          <CharacterSelect 
            onSelectComplete={(characterClass) => {
              handleSurvivalCharacterSelected(characterClass);
            }} 
            onBack={handleBackToStart}
            mode="survival"
          />
        </div>
      )}

      {gameState === 'playing' && state.gameMode === 'world-exploration' && (
        <div className="absolute inset-0 z-10">
          <GameWorld keysHeld={keysHeld} />
        </div>
      )}

      {state.gameMode === 'survival-mode' && (
        <div className="absolute inset-0 z-10">
          <SurvivalMode />
        </div>
      )}

      {state.gameMode === 'survival-results' && (
        <div className="absolute inset-0 z-10">
          <SurvivalResults />
        </div>
      )}

      {gameState === 'cabin-interior' && (
        <div className="absolute inset-0 z-10">
          <ForestCabinInterior keysHeld={keysHeld} />
        </div>
      )}

      {gameState === 'success' && (
        <div className="absolute inset-0 z-10">
          <SuccessPage onContinue={handleSuccessContinue} />
        </div>
      )}

      {/* Game Over Screen */}
      {state.gameMode === 'game-over' && (
        <div className="absolute inset-0 z-50">
          <GameOverScreen />
        </div>
      )}
    </div>
  );
}

export default App;