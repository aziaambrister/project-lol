import React from 'react';
import { useGame } from '../context/GameContext';
import WelcomePage from './WelcomePage';
import CharacterSelect from './CharacterSelect';
import GameWorld from './GameWorld';
import Shop from './Shop';
import Inventory from './Inventory';
import CharacterStats from './CharacterStats';
import QuestLog from './QuestLog';
import SuccessPage from './SuccessPage';
import ForestCabinInterior from './ForestCabinInterior';
import BattleRoyaleWorld from './BattleRoyaleWorld';

const GameApp: React.FC = () => {
  const { gameState } = useGame();

  const renderCurrentScreen = () => {
    switch (gameState.gameMode) {
      case 'welcome':
        return <WelcomePage />;
      case 'character-select':
        return <CharacterSelect />;
      case 'world':
        return <GameWorld />;
      case 'shop':
        return <Shop />;
      case 'inventory':
        return <Inventory />;
      case 'character-stats':
        return <CharacterStats />;
      case 'quest-log':
        return <QuestLog />;
      case 'success':
        return <SuccessPage />;
      case 'forest-cabin':
        return <ForestCabinInterior />;
      case 'battle-royale':
        return <BattleRoyaleWorld />;
      default:
        return <WelcomePage />;
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {renderCurrentScreen()}
    </div>
  );
};

export default GameApp;