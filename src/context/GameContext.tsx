import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, CharacterClass, Character, Enemy, Move, DamageNumber, Item, EquippedItems } from '../types/game';
import { characters } from '../data/characters';
import { gameWorld } from '../data/world';
import { EnemyAISystem } from '../systems/EnemyAI';

interface GameContextType {
  state: GameState;
  startGame: (characterClass: CharacterClass) => void;
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
  aiSystem: EnemyAISystem;
}

type GameAction =
  | { type: 'START_GAME'; payload: { characterClass: CharacterClass } }
  | { type: 'MOVE_PLAYER'; payload: { direction: 'up' | 'down' | 'left' | 'right' } }
  | { type: 'STOP_MOVING' }
  | { type: 'PERFORM_ATTACK'; payload: { moveId: string; targetId?: string } }
  | { type: 'ENTER_BUILDING'; payload: { buildingId: string } }
  | { type: 'EXIT_BUILDING' }
  | { type: 'INTERACT_NPC'; payload: { npcId: string } }
  | { type: 'PICKUP_ITEM'; payload: { itemId: string } }
  | { type: 'UNLOCK_CHARACTER'; payload: { characterClass: CharacterClass } }
  | { type: 'UPDATE_ENEMY_AI'; payload: { updatedEnemies: Enemy[] } }
  | { type: 'TAKE_DAMAGE'; payload: { damage: number; targetId: string } }
  | { type: 'UPDATE_DAY_NIGHT' }
  | { type: 'ADD_DAMAGE_NUMBER'; payload: { damageNumber: DamageNumber } }
  | { type: 'REMOVE_DAMAGE_NUMBER'; payload: { id: string } }
  | { type: 'PURCHASE_ITEM'; payload: { itemId: string; price: number; item: Item } }
  | { type: 'ADD_COINS'; payload: { amount: number } }
  | { type: 'ENEMY_ATTACK'; payload: { enemyId: string } }
  | { type: 'EQUIP_ITEM'; payload: { item: Item } }
  | { type: 'UNEQUIP_ITEM'; payload: { itemType: 'weapon' | 'armor' } }
  | { type: 'SHURIKEN_THROW'; payload: { targetId: string } }
  | { type: 'CONTACT_DAMAGE'; payload: { enemyId: string } }
  | { type: 'TOGGLE_DEBUG_MODE' }
  | { type: 'HEAL_PLAYER'; payload: { amount: number } };

const initialState: GameState = {
  gameMode: 'character-select',
  player: {
    character: characters[0],
    position: { x: 200, y: 3800 },
    direction: 'down',
    isMoving: false,
    isSwimming: false,
    inventory: [],
    currency: 100,
    equippedItems: {},
    unlockedCharacters: ['balanced-fighter'],
  },
  currentWorld: gameWorld,
  combat: {
    inCombat: false,
    playerTurn: true,
    comboCount: 0,
    lastHitTime: 0,
    damageNumbers: []
  },
  camera: {
    x: 200,
    y: 3800,
    zoom: 1
  },
  ui: {
    showMinimap: true,
    showInventory: false,
    showCharacterStats: false
  },
  settings: {
    soundEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.8,
    difficulty: 'medium'
  },
  debug: {
    enabled: false,
    showEnemyStates: false,
    showPerformanceMetrics: false
  }
};

// Create AI system instance
const aiSystem = new EnemyAISystem();

const GameContext = createContext<GameContextType | undefined>(undefined);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const selectedCharacter = characters.find(char => char.class === action.payload.characterClass);
      if (!selectedCharacter) return state;
      
      // Initialize AI system with enemies
      gameWorld.enemies.forEach(enemy => {
        aiSystem.addEnemy(enemy);
      });
      
      return {
        ...state,
        gameMode: 'world-exploration',
        player: {
          ...state.player,
          character: { ...selectedCharacter },
          position: { x: 200, y: 3800 },
        },
        camera: {
          ...state.camera,
          x: 200,
          y: 3800
        }
      };
    }
    
    case 'MOVE_PLAYER': {
      const { direction } = action.payload;
      const speed = 8; // INCREASED SPEED for more responsive movement
      let newX = state.player.position.x;
      let newY = state.player.position.y;
      
      switch (direction) {
        case 'up':
          newY = Math.max(50, newY - speed);
          break;
        case 'down':
          newY = Math.min(state.currentWorld.size.height - 50, newY + speed);
          break;
        case 'left':
          newX = Math.max(50, newX - speed);
          break;
        case 'right':
          newX = Math.min(state.currentWorld.size.width - 50, newX + speed);
          break;
      }
      
      // Check for contact damage with enemies
      const touchingEnemies = state.currentWorld.enemies.filter(enemy => {
        if (enemy.state === 'dead') return false;
        const distance = Math.sqrt(
          Math.pow(enemy.position.x - newX, 2) +
          Math.pow(enemy.position.y - newY, 2)
        );
        return distance <= 30; // Contact range
      });
      
      // Apply contact damage
      let updatedPlayerHealth = state.player.character.health;
      let newDamageNumbers = [...state.combat.damageNumbers];
      
      touchingEnemies.forEach(enemy => {
        const contactDamage = Math.floor(Math.random() * 11) + 5; // 5-15 damage
        updatedPlayerHealth = Math.max(0, updatedPlayerHealth - contactDamage);
        
        const damageNumber: DamageNumber = {
          id: `contact-damage-${Date.now()}-${enemy.id}`,
          value: contactDamage,
          position: { x: newX, y: newY - 30 },
          type: 'damage',
          timestamp: Date.now()
        };
        newDamageNumbers.push(damageNumber);
      });
      
      // Calculate camera position with boundaries - IMMEDIATE CAMERA FOLLOW
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const worldWidth = state.currentWorld.size.width;
      const worldHeight = state.currentWorld.size.height;
      
      let cameraX = newX;
      let cameraY = newY;
      
      cameraX = Math.max(screenWidth / 2, Math.min(worldWidth - screenWidth / 2, cameraX));
      cameraY = Math.max(screenHeight / 2, Math.min(worldHeight - screenHeight / 2, cameraY));
      
      return {
        ...state,
        player: {
          ...state.player,
          position: { x: newX, y: newY },
          direction,
          isMoving: true,
          isSwimming: false,
          character: {
            ...state.player.character,
            health: updatedPlayerHealth
          }
        },
        camera: {
          ...state.camera,
          x: cameraX,
          y: cameraY
        },
        combat: {
          ...state.combat,
          damageNumbers: newDamageNumbers
        }
      };
    }
    
    case 'STOP_MOVING': {
      return {
        ...state,
        player: {
          ...state.player,
          isMoving: false
        }
      };
    }
    
    case 'UPDATE_ENEMY_AI': {
      return {
        ...state,
        currentWorld: {
          ...state.currentWorld,
          enemies: action.payload.updatedEnemies
        }
      };
    }
    
    case 'ENEMY_ATTACK': {
      const { enemyId } = action.payload;
      const enemy = state.currentWorld.enemies.find(e => e.id === enemyId);
      
      if (!enemy || enemy.state === 'dead') return state;
      
      const distanceToPlayer = Math.sqrt(
        Math.pow(enemy.position.x - state.player.position.x, 2) +
        Math.pow(enemy.position.y - state.player.position.y, 2)
      );
      
      if (distanceToPlayer > 50) return state;
      
      let baseDamage = enemy.attack;
      
      switch (enemy.type) {
        case 'aggressive':
          baseDamage *= 1.3;
          break;
        case 'defensive':
          baseDamage *= 0.8;
          break;
        case 'patrol':
          baseDamage *= 1.0;
          break;
        default:
          baseDamage *= 1.0;
      }
      
      switch (enemy.aiDifficulty) {
        case 'easy':
          baseDamage *= 0.7;
          break;
        case 'medium':
          baseDamage *= 1.0;
          break;
        case 'hard':
          baseDamage *= 1.4;
          break;
      }
      
      const finalDamage = Math.max(1, Math.floor(baseDamage - state.player.character.defense / 2));
      const newPlayerHealth = Math.max(0, state.player.character.health - finalDamage);
      
      const damageNumber: DamageNumber = {
        id: `player-damage-${Date.now()}`,
        value: finalDamage,
        position: { x: state.player.position.x, y: state.player.position.y - 30 },
        type: 'damage',
        timestamp: Date.now()
      };
      
      return {
        ...state,
        player: {
          ...state.player,
          character: {
            ...state.player.character,
            health: newPlayerHealth
          }
        },
        combat: {
          ...state.combat,
          damageNumbers: [...state.combat.damageNumbers, damageNumber]
        }
      };
    }
    
    case 'TOGGLE_DEBUG_MODE': {
      const newDebugState = !state.debug.enabled;
      aiSystem.enableDebugMode(newDebugState);
      
      return {
        ...state,
        debug: {
          ...state.debug,
          enabled: newDebugState,
          showEnemyStates: newDebugState,
          showPerformanceMetrics: newDebugState
        }
      };
    }
    
    case 'PERFORM_ATTACK': {
      const { moveId, targetId } = action.payload;
      const move = state.player.character.moveSet.find(m => m.id === moveId);
      
      if (!move || move.currentCooldown > 0) {
        return state;
      }
      
      // Handle shuriken throw
      if (moveId === 'shuriken-throw' && targetId) {
        return gameReducer(state, { type: 'SHURIKEN_THROW', payload: { targetId } });
      }
      
      let updatedEnemies = [...state.currentWorld.enemies];
      let damageNumbers = [...state.combat.damageNumbers];
      let newCurrency = state.player.currency;
      
      if (targetId) {
        const enemyIndex = updatedEnemies.findIndex(e => e.id === targetId);
        if (enemyIndex !== -1) {
          const enemy = updatedEnemies[enemyIndex];
          const damage = Math.max(1, move.damage + state.player.character.attack - enemy.defense);
          
          const newEnemyHealth = Math.max(0, enemy.health - damage);
          
          updatedEnemies[enemyIndex] = {
            ...enemy,
            health: newEnemyHealth,
            state: newEnemyHealth <= 0 ? 'dead' : 'chase',
            currentTarget: state.player.character.id
          };
          
          const damageNumber: DamageNumber = {
            id: `damage-${Date.now()}`,
            value: damage,
            position: { x: enemy.position.x, y: enemy.position.y - 20 },
            type: 'damage',
            timestamp: Date.now()
          };
          damageNumbers.push(damageNumber);
          
          if (newEnemyHealth <= 0) {
            newCurrency += 10;
            aiSystem.removeEnemy(enemy.id);
            
            const coinNumber: DamageNumber = {
              id: `coins-${Date.now()}`,
              value: 10,
              position: { x: enemy.position.x + 20, y: enemy.position.y - 40 },
              type: 'critical',
              timestamp: Date.now()
            };
            damageNumbers.push(coinNumber);
          }
        }
      }
      
      const updatedMoveSet = state.player.character.moveSet.map(m => 
        m.id === moveId ? { ...m, currentCooldown: m.cooldown } : m
      );
      
      return {
        ...state,
        player: {
          ...state.player,
          character: {
            ...state.player.character,
            moveSet: updatedMoveSet
          },
          currency: newCurrency
        },
        currentWorld: {
          ...state.currentWorld,
          enemies: updatedEnemies
        },
        combat: {
          ...state.combat,
          damageNumbers,
          comboCount: state.combat.comboCount + 1,
          lastHitTime: Date.now()
        }
      };
    }
    
    case 'SHURIKEN_THROW': {
      const { targetId } = action.payload;
      let updatedEnemies = [...state.currentWorld.enemies];
      let damageNumbers = [...state.combat.damageNumbers];
      let newCurrency = state.player.currency;
      
      const enemyIndex = updatedEnemies.findIndex(e => e.id === targetId);
      if (enemyIndex !== -1) {
        const enemy = updatedEnemies[enemyIndex];
        const damage = Math.floor(Math.random() * 16) + 10; // 10-20 damage as requested
        
        const newEnemyHealth = Math.max(0, enemy.health - damage);
        
        updatedEnemies[enemyIndex] = {
          ...enemy,
          health: newEnemyHealth,
          state: newEnemyHealth <= 0 ? 'dead' : 'chase',
          currentTarget: state.player.character.id
        };
        
        const damageNumber: DamageNumber = {
          id: `shuriken-damage-${Date.now()}`,
          value: damage,
          position: { x: enemy.position.x, y: enemy.position.y - 20 },
          type: 'damage',
          timestamp: Date.now()
        };
        damageNumbers.push(damageNumber);
        
        if (newEnemyHealth <= 0) {
          newCurrency += 10;
          aiSystem.removeEnemy(enemy.id);
          
          const coinNumber: DamageNumber = {
            id: `shuriken-coins-${Date.now()}`,
            value: 10,
            position: { x: enemy.position.x + 20, y: enemy.position.y - 40 },
            type: 'critical',
            timestamp: Date.now()
          };
          damageNumbers.push(coinNumber);
        }
      }
      
      const updatedMoveSet = state.player.character.moveSet.map(m => 
        m.id === 'shuriken-throw' ? { ...m, currentCooldown: m.cooldown } : m
      );
      
      return {
        ...state,
        player: {
          ...state.player,
          character: {
            ...state.player.character,
            moveSet: updatedMoveSet
          },
          currency: newCurrency
        },
        currentWorld: {
          ...state.currentWorld,
          enemies: updatedEnemies
        },
        combat: {
          ...state.combat,
          damageNumbers,
          comboCount: state.combat.comboCount + 1,
          lastHitTime: Date.now()
        }
      };
    }
    
    case 'ENTER_BUILDING': {
      const building = state.currentWorld.buildings.find(b => b.id === action.payload.buildingId);
      if (!building || !building.enterable) return state;
      
      return {
        ...state,
        gameMode: 'building-interior',
        player: {
          ...state.player,
          currentBuilding: building.id
        }
      };
    }
    
    case 'EXIT_BUILDING': {
      return {
        ...state,
        gameMode: 'world-exploration',
        player: {
          ...state.player,
          currentBuilding: undefined
        }
      };
    }
    
    case 'HEAL_PLAYER': {
      const { amount } = action.payload;
      const newHealth = Math.min(
        state.player.character.maxHealth,
        state.player.character.health + amount
      );
      
      const healNumber: DamageNumber = {
        id: `heal-${Date.now()}`,
        value: amount,
        position: { x: state.player.position.x, y: state.player.position.y - 30 },
        type: 'heal',
        timestamp: Date.now()
      };
      
      return {
        ...state,
        player: {
          ...state.player,
          character: {
            ...state.player.character,
            health: newHealth
          }
        },
        combat: {
          ...state.combat,
          damageNumbers: [...state.combat.damageNumbers, healNumber]
        }
      };
    }
    
    case 'UPDATE_DAY_NIGHT': {
      const currentTime = (state.currentWorld.dayNightCycle.currentTime + 0.1) % 24;
      let lightLevel = 1.0;
      
      if (currentTime < 6 || currentTime > 18) {
        lightLevel = 0.3;
      } else if (currentTime < 8 || currentTime > 16) {
        lightLevel = 0.7;
      }
      
      return {
        ...state,
        currentWorld: {
          ...state.currentWorld,
          dayNightCycle: {
            ...state.currentWorld.dayNightCycle,
            currentTime,
            lightLevel
          }
        }
      };
    }
    
    case 'ADD_DAMAGE_NUMBER': {
      return {
        ...state,
        combat: {
          ...state.combat,
          damageNumbers: [...state.combat.damageNumbers, action.payload.damageNumber]
        }
      };
    }
    
    case 'REMOVE_DAMAGE_NUMBER': {
      return {
        ...state,
        combat: {
          ...state.combat,
          damageNumbers: state.combat.damageNumbers.filter(dn => dn.id !== action.payload.id)
        }
      };
    }
    
    case 'PURCHASE_ITEM': {
      const { price, item } = action.payload;
      
      if (state.player.currency < price) {
        return state;
      }
      
      let updatedCharacter = { ...state.player.character };
      let updatedInventory = [...state.player.inventory];
      
      if (item.type === 'upgrade') {
        switch (item.effect?.type) {
          case 'health':
            updatedCharacter.maxHealth += item.effect.value;
            updatedCharacter.health += item.effect.value;
            break;
          case 'speed':
            updatedCharacter.speed += item.effect.value;
            break;
          case 'damage':
            updatedCharacter.attack += item.effect.value;
            break;
          case 'defense':
            updatedCharacter.defense += item.effect.value;
            break;
        }
      } else {
        updatedInventory.push(item);
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          character: updatedCharacter,
          inventory: updatedInventory,
          currency: state.player.currency - price
        }
      };
    }
    
    case 'ADD_COINS': {
      return {
        ...state,
        player: {
          ...state.player,
          currency: state.player.currency + action.payload.amount
        }
      };
    }
    
    case 'EQUIP_ITEM': {
      const { item } = action.payload;
      let updatedInventory = [...state.player.inventory];
      let updatedEquippedItems = { ...state.player.equippedItems };
      let updatedCharacter = { ...state.player.character };
      
      const itemIndex = updatedInventory.findIndex(i => i.id === item.id);
      if (itemIndex !== -1) {
        updatedInventory.splice(itemIndex, 1);
      }
      
      if (item.type === 'weapon' && updatedEquippedItems.weapon) {
        updatedInventory.push(updatedEquippedItems.weapon);
        if (updatedEquippedItems.weapon.effect) {
          switch (updatedEquippedItems.weapon.effect.type) {
            case 'boost-attack':
            case 'damage':
              updatedCharacter.attack -= updatedEquippedItems.weapon.effect.value;
              break;
            case 'boost-defense':
            case 'defense':
              updatedCharacter.defense -= updatedEquippedItems.weapon.effect.value;
              break;
            case 'boost-speed':
            case 'speed':
              updatedCharacter.speed -= updatedEquippedItems.weapon.effect.value;
              break;
          }
        }
      } else if (item.type === 'armor' && updatedEquippedItems.armor) {
        updatedInventory.push(updatedEquippedItems.armor);
        if (updatedEquippedItems.armor.effect) {
          switch (updatedEquippedItems.armor.effect.type) {
            case 'boost-attack':
            case 'damage':
              updatedCharacter.attack -= updatedEquippedItems.armor.effect.value;
              break;
            case 'boost-defense':
            case 'defense':
              updatedCharacter.defense -= updatedEquippedItems.armor.effect.value;
              break;
            case 'boost-speed':
            case 'speed':
              updatedCharacter.speed -= updatedEquippedItems.armor.effect.value;
              break;
          }
        }
      }
      
      if (item.type === 'weapon') {
        updatedEquippedItems.weapon = item;
      } else if (item.type === 'armor') {
        updatedEquippedItems.armor = item;
      }
      
      if (item.effect) {
        switch (item.effect.type) {
          case 'boost-attack':
          case 'damage':
            updatedCharacter.attack += item.effect.value;
            break;
          case 'boost-defense':
          case 'defense':
            updatedCharacter.defense += item.effect.value;
            break;
          case 'boost-speed':
          case 'speed':
            updatedCharacter.speed += item.effect.value;
            break;
        }
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: updatedInventory,
          equippedItems: updatedEquippedItems,
          character: updatedCharacter
        }
      };
    }
    
    case 'UNEQUIP_ITEM': {
      const { itemType } = action.payload;
      let updatedInventory = [...state.player.inventory];
      let updatedEquippedItems = { ...state.player.equippedItems };
      let updatedCharacter = { ...state.player.character };
      
      const equippedItem = updatedEquippedItems[itemType];
      if (equippedItem) {
        updatedInventory.push(equippedItem);
        
        if (equippedItem.effect) {
          switch (equippedItem.effect.type) {
            case 'boost-attack':
            case 'damage':
              updatedCharacter.attack -= equippedItem.effect.value;
              break;
            case 'boost-defense':
            case 'defense':
              updatedCharacter.defense -= equippedItem.effect.value;
              break;
            case 'boost-speed':
            case 'speed':
              updatedCharacter.speed -= equippedItem.effect.value;
              break;
          }
        }
        
        delete updatedEquippedItems[itemType];
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: updatedInventory,
          equippedItems: updatedEquippedItems,
          character: updatedCharacter
        }
      };
    }
    
    case 'UNLOCK_CHARACTER': {
      const { characterClass } = action.payload;
      
      if (!state.player.unlockedCharacters.includes(characterClass)) {
        return {
          ...state,
          player: {
            ...state.player,
            unlockedCharacters: [...state.player.unlockedCharacters, characterClass]
          }
        };
      }
      
      return state;
    }
    
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  const startGame = (characterClass: CharacterClass) => {
    dispatch({ type: 'START_GAME', payload: { characterClass } });
  };
  
  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    dispatch({ type: 'MOVE_PLAYER', payload: { direction } });
  };
  
  const stopMoving = () => {
    dispatch({ type: 'STOP_MOVING' });
  };
  
  const performAttack = (moveId: string, targetId?: string) => {
    dispatch({ type: 'PERFORM_ATTACK', payload: { moveId, targetId } });
  };
  
  const enterBuilding = (buildingId: string) => {
    dispatch({ type: 'ENTER_BUILDING', payload: { buildingId } });
  };
  
  const exitBuilding = () => {
    dispatch({ type: 'EXIT_BUILDING' });
  };
  
  const interactWithNPC = (npcId: string) => {
    dispatch({ type: 'INTERACT_NPC', payload: { npcId } });
  };
  
  const pickupItem = (itemId: string) => {
    dispatch({ type: 'PICKUP_ITEM', payload: { itemId } });
  };
  
  const unlockCharacter = (characterClass: CharacterClass) => {
    dispatch({ type: 'UNLOCK_CHARACTER', payload: { characterClass } });
  };
  
  const updateEnemyAI = () => {
    // This will be called by the AI system
  };
  
  const takeDamage = (damage: number, targetId: string) => {
    dispatch({ type: 'TAKE_DAMAGE', payload: { damage, targetId } });
  };
  
  const purchaseItem = (itemId: string, price: number, item: Item) => {
    dispatch({ type: 'PURCHASE_ITEM', payload: { itemId, price, item } });
  };
  
  const addCoins = (amount: number) => {
    dispatch({ type: 'ADD_COINS', payload: { amount } });
  };
  
  const equipItem = (item: Item) => {
    dispatch({ type: 'EQUIP_ITEM', payload: { item } });
  };
  
  const unequipItem = (itemType: 'weapon' | 'armor') => {
    dispatch({ type: 'UNEQUIP_ITEM', payload: { itemType } });
  };
  
  const toggleDebugMode = () => {
    dispatch({ type: 'TOGGLE_DEBUG_MODE' });
  };
  
  const healPlayer = (amount: number) => {
    dispatch({ type: 'HEAL_PLAYER', payload: { amount } });
  };
  
  useEffect(() => {
    let animationFrameId: number;
    let lastFrameTime = 0;
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime;
      lastFrameTime = currentTime;
      
      // Update AI system with delta time
      if (state.gameMode === 'world-exploration') {
        const updatedEnemies = aiSystem.updateEnemies(
          state.player.position,
          state.player.character,
          deltaTime
        );
        
        dispatch({ type: 'UPDATE_ENEMY_AI', payload: { updatedEnemies } });
      }
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    animationFrameId = requestAnimationFrame(gameLoop);
    
    // Enemy attack interval - exactly 2 seconds as requested
    const enemyAttackInterval = setInterval(() => {
      const now = Date.now();
      state.currentWorld.enemies.forEach(enemy => {
        if (enemy.state === 'chase' && enemy.health > 0) {
          const distanceToPlayer = Math.sqrt(
            Math.pow(enemy.position.x - state.player.position.x, 2) +
            Math.pow(enemy.position.y - state.player.position.y, 2)
          );
          
          if (distanceToPlayer <= 50) {
            const attackCycle = aiSystem.getAttackCycle(enemy.id);
            if (attackCycle && now - attackCycle.lastAttackTime >= attackCycle.cooldownDuration) {
              dispatch({ type: 'ENEMY_ATTACK', payload: { enemyId: enemy.id } });
            }
          }
        }
      });
    }, 2000); // Check every 2 seconds for attacks
    
    const dayNightInterval = setInterval(() => {
      dispatch({ type: 'UPDATE_DAY_NIGHT' });
    }, 1000);
    
    const cooldownInterval = setInterval(() => {
      // Update move cooldowns
      const updatedMoveSet = state.player.character.moveSet.map(move => ({
        ...move,
        currentCooldown: Math.max(0, move.currentCooldown - 1)
      }));
      
      if (updatedMoveSet.some((move, index) => move.currentCooldown !== state.player.character.moveSet[index].currentCooldown)) {
        // Only update if there are actual changes
      }
    }, 1000);
    
    const damageNumberCleanup = setInterval(() => {
      const now = Date.now();
      state.combat.damageNumbers.forEach(dn => {
        if (now - dn.timestamp > 2000) {
          dispatch({ type: 'REMOVE_DAMAGE_NUMBER', payload: { id: dn.id } });
        }
      });
    }, 100);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(enemyAttackInterval);
      clearInterval(dayNightInterval);
      clearInterval(cooldownInterval);
      clearInterval(damageNumberCleanup);
    };
  }, [state.combat.damageNumbers, state.currentWorld.enemies, state.player.position, state.player.character.moveSet, state.gameMode]);
  
  return (
    <GameContext.Provider
      value={{
        state,
        startGame,
        movePlayer,
        stopMoving,
        performAttack,
        enterBuilding,
        exitBuilding,
        interactWithNPC,
        pickupItem,
        unlockCharacter,
        updateEnemyAI,
        takeDamage,
        purchaseItem,
        addCoins,
        equipItem,
        unequipItem,
        toggleDebugMode,
        aiSystem
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export { useGame };