import React, { useState } from 'react';
import { useGame } from './context/GameContext';
import WelcomePage from './components/WelcomePage';
import StartScreen from './components/StartScreen';
import CharacterSelect from './components/CharacterSelect';
import GameWorld from './components/GameWorld';
import GameOverScreen from './components/GameOverScreen';

function App() {
  const { state, restartGame, returnToHome } = useGame();
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

  const handleTryAgain = () => {
    restartGame();
    setGameState('character-select');
  };

  const handleReturnHome = () => {
    returnToHome();
    setGameState('welcome');
  };
  
  console.log('Current game state:', gameState);
  console.log('Game mode:', state.gameMode);
  
  // Show game over screen if player died
  if (state.gameMode === 'game-over') {
    return (
      <div className="min-h-screen bg-gray-100 relative">
        <GameOverScreen 
          onTryAgain={handleTryAgain}
          onReturnHome={handleReturnHome}
          victory={false}
          stats={{
            enemiesDefeated: state.player.stats.enemiesDefeated,
            coinsEarned: state.player.stats.coinsEarned,
            timeAlive: state.player.stats.timeAlive
          }}
        />
      </div>
    );
  }
  
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
          <GameWorld />
        </div>
      )}
    </div>
  );
}

export default App;