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

  const
