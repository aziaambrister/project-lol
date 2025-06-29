import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, CharacterClass, Character, Enemy, Move, DamageNumber, Item, EquippedItems, XPOrb, SurvivalWave, SurvivalDrop, PowerUp, SurvivalStats, Achievement } from '../types/game';
import { characters } from '../data/characters';
import { gameWorld } from '../data/world';
import { EnemyAISystem } from '../systems/EnemyAI';
import { useAuth } from '../hooks/useAuth';

interface GameContextType {
  state: GameState;
  startGame: (characterClass: CharacterClass) => void;
  startSurvival: (characterClass: CharacterClass) => void;
  movePlayer: (direction: 'up' | 'down' | 'left' | 'right') => void;
  stopMoving: () => void;
  performAttack: (moveId: string, targetId?: string) => void;
  enterBuilding: (buildingId: string) => void;
  exitBuilding: () => void;
  interactWithNPC: (npcId: string) => void;
  pickupItem: (itemId: string) => void;
  unlockCharacter: (characterClass: CharacterClass) => void;
  updateEnemyAI: () => void;
  takeDamage: (damage: number, targetId: string) => void;
  purchaseItem: (itemId: string, price: number, item: Item) => void;
  addCoins: (amount: number) => void;
  equipItem: (item: Item) => void;
  unequipItem: (itemType: 'weapon' | 'armor') => void;
  toggleDebugMode: () => void;
  restartGame: () => void;
  collectXPOrb: (orbId: string) => void;
  collectSurvivalDrop: (dropId: string) => void;
  usePowerUp: (powerUpIndex: number) => void;
  restartSurvival: () => void;
  exitSurvival: () => void;
  aiSystem: EnemyAISystem;
}

[Rest of the file content remains exactly the same as provided]