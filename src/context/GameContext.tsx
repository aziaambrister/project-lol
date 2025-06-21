import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, CharacterClass, Character, Enemy, Move, DamageNumber, Item, EquippedItems } from '../types/game';
import { characters } from '../data/characters';
import { gameWorld } from '../data/world';

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
  | { type: 'UPDATE_ENEMY_AI' }
  | { type: 'TAKE_DAMAGE'; payload: { damage: number; targetId: string } }
  | { type: 'UPDATE_DAY_NIGHT' }
  | { type: 'ADD_DAMAGE_NUMBER'; payload: { damageNumber: DamageNumber } }
  | { type: 'REMOVE_DAMAGE_NUMBER'; payload: { id: string } }
  | { type: 'PURCHASE_ITEM'; payload: { itemId: string; price: number; item: Item } }
  | { type: 'ADD_COINS'; payload: { amount: number } }
  | { type: 'ENEMY_ATTACK'; payload: { enemyId: string } }
  | { type: 'EQUIP_ITEM'; payload: { item: Item } }
  | { type: 'UNEQUIP_ITEM'; payload: { itemType: 'weapon' | 'armor' } };

const initialState: GameState = {
  gameMode: 'character-select',
  player: {
    character: characters[0],
    position: { x: 200, y: 3800 }, // Bottom left of the 4000x4000 map
    direction: 'down',
    isMoving: false,
    isSwimming: false,
    inventory: [],
    currency: 100, // Starting coins
    equippedItems: {}, // Initialize empty equipped items
    unlockedCharacters: ['balanced-fighter'], // Start with one unlocked character
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
    x: 200, // Start camera at bottom left
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
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const selectedCharacter = characters.find(char => char.class === action.payload.characterClass);
      if (!selectedCharacter) return state;
      
      return {
        ...state,
        gameMode: 'world-exploration',
        player: {
          ...state.player,
          character: { ...selectedCharacter },
          position: { x: 200, y: 3800 }, // Start at bottom left
        },
        camera: {
          ...state.camera,
          x: 200, // Camera follows player to bottom left
          y: 3800
        }
      };
    }
    
    case 'MOVE_PLAYER': {
      const { direction } = action.payload;
      const speed = state.player.character.speed;
      let newX = state.player.position.x;
      let newY = state.player.position.y;
      
      switch (direction) {
        case 'up':
          newY = Math.max(50, newY - speed); // Keep 50px margin from top edge
          break;
        case 'down':
          newY = Math.min(state.currentWorld.size.height - 50, newY + speed); // Keep 50px margin from bottom edge
          break;
        case 'left':
          newX = Math.max(50, newX - speed); // Keep 50px margin from left edge
          break;
        case 'right':
          newX = Math.min(state.currentWorld.size.width - 50, newX + speed); // Keep 50px margin from right edge
          break;
      }
      
      // Check for tree collision
      const isCollidingWithTree = state.currentWorld.buildings.some(building => {
        if (!building.sprite.includes('🌳') && !building.sprite.includes('🌲')) return false;
        
        const playerRadius = 25; // Player collision radius
        const treeLeft = building.position.x;
        const treeRight = building.position.x + building.size.width;
        const treeTop = building.position.y;
        const treeBottom = building.position.y + building.size.height;
        
        return (
          newX + playerRadius > treeLeft &&
          newX - playerRadius < treeRight &&
          newY + playerRadius > treeTop &&
          newY - playerRadius < treeBottom
        );
      });
      
      // If colliding with tree, don't move
      if (isCollidingWithTree) {
        return state;
      }
      
      // Check for water collision
      const isInWater = state.currentWorld.waterBodies.some(water => 
        newX >= water.position.x && 
        newX <= water.position.x + water.size.width &&
        newY >= water.position.y && 
        newY <= water.position.y + water.size.height
      );
      
      // Calculate camera position with boundaries
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const worldWidth = state.currentWorld.size.width;
      const worldHeight = state.currentWorld.size.height;
      
      // Camera boundaries - prevent showing white edges
      let cameraX = newX;
      let cameraY = newY;
      
      // Constrain camera to world boundaries
      cameraX = Math.max(screenWidth / 2, Math.min(worldWidth - screenWidth / 2, cameraX));
      cameraY = Math.max(screenHeight / 2, Math.min(worldHeight - screenHeight / 2, cameraY));
      
      return {
        ...state,
        player: {
          ...state.player,
          position: { x: newX, y: newY },
          direction,
          isMoving: true,
          isSwimming: isInWater
        },
        camera: {
          ...state.camera,
          x: cameraX,
          y: cameraY
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
    
    case 'PERFORM_ATTACK': {
      const { moveId, targetId } = action.payload;
      const move = state.player.character.moveSet.find(m => m.id === moveId);
      
      if (!move || move.currentCooldown > 0 || state.player.character.stamina < move.staminaCost) {
        return state;
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
          
          // Add damage number
          const damageNumber: DamageNumber = {
            id: `damage-${Date.now()}`,
            value: damage,
            position: { x: enemy.position.x, y: enemy.position.y - 20 },
            type: 'damage',
            timestamp: Date.now()
          };
          damageNumbers.push(damageNumber);
          
          // Award coins for defeating enemy
          if (newEnemyHealth <= 0) {
            newCurrency += 10; // 10 coins per defeated enemy
            
            // Add coin notification
            const coinNumber: DamageNumber = {
              id: `coins-${Date.now()}`,
              value: 10,
              position: { x: enemy.position.x + 20, y: enemy.position.y - 40 },
              type: 'critical', // Use critical type for gold color
              timestamp: Date.now()
            };
            damageNumbers.push(coinNumber);
          }
        }
      }
      
      // Update move cooldown and player stamina
      const updatedMoveSet = state.player.character.moveSet.map(m => 
        m.id === moveId ? { ...m, currentCooldown: m.cooldown } : m
      );
      
      return {
        ...state,
        player: {
          ...state.player,
          character: {
            ...state.player.character,
            stamina: Math.max(0, state.player.character.stamina - move.staminaCost),
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
    
    case 'ENEMY_ATTACK': {
      const { enemyId } = action.payload;
      const enemy = state.currentWorld.enemies.find(e => e.id === enemyId);
      
      if (!enemy || enemy.state === 'dead') return state;
      
      // Calculate distance to player
      const distanceToPlayer = Math.sqrt(
        Math.pow(enemy.position.x - state.player.position.x, 2) +
        Math.pow(enemy.position.y - state.player.position.y, 2)
      );
      
      // Only attack if close enough (within attack range)
      if (distanceToPlayer > 50) return state;
      
      // Calculate damage based on enemy type and stats
      let baseDamage = enemy.attack;
      
      // Different damage multipliers based on enemy type
      switch (enemy.type) {
        case 'aggressive':
          baseDamage *= 1.3; // Aggressive enemies deal 30% more damage
          break;
        case 'defensive':
          baseDamage *= 0.8; // Defensive enemies deal 20% less damage
          break;
        case 'patrol':
          baseDamage *= 1.0; // Normal damage
          break;
        default:
          baseDamage *= 1.0;
      }
      
      // Additional damage based on AI difficulty
      switch (enemy.aiDifficulty) {
        case 'easy':
          baseDamage *= 0.7; // Easy enemies deal 30% less damage
          break;
        case 'medium':
          baseDamage *= 1.0; // Normal damage
          break;
        case 'hard':
          baseDamage *= 1.4; // Hard enemies deal 40% more damage
          break;
      }
      
      // Apply player defense
      const finalDamage = Math.max(1, Math.floor(baseDamage - state.player.character.defense / 2));
      const newPlayerHealth = Math.max(0, state.player.character.health - finalDamage);
      
      // Add damage number for player
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
    
    case 'UPDATE_ENEMY_AI': {
      const updatedEnemies = state.currentWorld.enemies.map(enemy => {
        if (enemy.state === 'dead') return enemy;
        
        const distanceToPlayer = Math.sqrt(
          Math.pow(enemy.position.x - state.player.position.x, 2) +
          Math.pow(enemy.position.y - state.player.position.y, 2)
        );
        
        let newState = enemy.state;
        let newX = enemy.position.x;
        let newY = enemy.position.y;
        let lastAction = enemy.lastAction;
        
        // AI Decision Making
        if (distanceToPlayer <= enemy.detectionRadius && enemy.state !== 'chase') {
          newState = 'chase';
        } else if (enemy.state === 'chase' && distanceToPlayer > enemy.detectionRadius * 1.5) {
          newState = 'patrol';
        }
        
        // Movement and Attack AI
        if (newState === 'chase') {
          // Move towards player
          const dx = state.player.position.x - enemy.position.x;
          const dy = state.player.position.y - enemy.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 50) { // Not in attack range - move closer
            const moveSpeed = enemy.speed * 0.8; // Slightly slower when chasing
            newX += (dx / distance) * moveSpeed;
            newY += (dy / distance) * moveSpeed;
          } else {
            // In attack range - attack if enough time has passed
            const now = Date.now();
            const attackCooldown = enemy.aiDifficulty === 'easy' ? 2000 : 
                                 enemy.aiDifficulty === 'medium' ? 1500 : 1000;
            
            if (now - lastAction > attackCooldown) {
              // Trigger enemy attack
              setTimeout(() => {
                // Use a timeout to avoid infinite loops in reducer
                // This will be handled by the enemy attack action
              }, 100);
              lastAction = now;
            }
          }
        } else if (newState === 'patrol') {
          // Random patrol movement
          const angle = Math.random() * Math.PI * 2;
          const moveSpeed = enemy.speed * 0.3; // Slower when patrolling
          newX += Math.cos(angle) * moveSpeed;
          newY += Math.sin(angle) * moveSpeed;
          
          // Keep within patrol radius
          const distanceFromCenter = Math.sqrt(
            Math.pow(newX - enemy.patrolCenter.x, 2) +
            Math.pow(newY - enemy.patrolCenter.y, 2)
          );
          
          if (distanceFromCenter > enemy.patrolRadius) {
            const angleToCenter = Math.atan2(
              enemy.patrolCenter.y - newY,
              enemy.patrolCenter.x - newX
            );
            newX += Math.cos(angleToCenter) * enemy.speed;
            newY += Math.sin(angleToCenter) * enemy.speed;
          }
        }
        
        // Keep enemies within world bounds
        newX = Math.max(0, Math.min(state.currentWorld.size.width, newX));
        newY = Math.max(0, Math.min(state.currentWorld.size.height, newY));
        
        return {
          ...enemy,
          position: { x: newX, y: newY },
          state: newState,
          currentTarget: newState === 'chase' ? state.player.character.id : undefined,
          lastAction
        };
      });
      
      // Check for enemies that should attack
      const now = Date.now();
      updatedEnemies.forEach(enemy => {
        if (enemy.state === 'chase' && enemy.health > 0) {
          const distanceToPlayer = Math.sqrt(
            Math.pow(enemy.position.x - state.player.position.x, 2) +
            Math.pow(enemy.position.y - state.player.position.y, 2)
          );
          
          if (distanceToPlayer <= 50) {
            const attackCooldown = enemy.aiDifficulty === 'easy' ? 2000 : 
                                 enemy.aiDifficulty === 'medium' ? 1500 : 1000;
            
            if (now - enemy.lastAction > attackCooldown) {
              // Dispatch enemy attack action
              setTimeout(() => {
                // This creates a new action to handle the attack
                gameReducer(state, { type: 'ENEMY_ATTACK', payload: { enemyId: enemy.id } });
              }, 100);
            }
          }
        }
      });
      
      return {
        ...state,
        currentWorld: {
          ...state.currentWorld,
          enemies: updatedEnemies
        }
      };
    }
    
    case 'TAKE_DAMAGE': {
      const { damage, targetId } = action.payload;
      
      if (targetId === state.player.character.id) {
        const newHealth = Math.max(0, state.player.character.health - damage);
        
        return {
          ...state,
          player: {
            ...state.player,
            character: {
              ...state.player.character,
              health: newHealth
            }
          }
        };
      }
      
      return state;
    }
    
    case 'UPDATE_DAY_NIGHT': {
      const currentTime = (state.currentWorld.dayNightCycle.currentTime + 0.1) % 24;
      let lightLevel = 1.0;
      
      if (currentTime < 6 || currentTime > 18) {
        lightLevel = 0.3; // Night
      } else if (currentTime < 8 || currentTime > 16) {
        lightLevel = 0.7; // Dawn/Dusk
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
        return state; // Not enough coins
      }
      
      let updatedCharacter = { ...state.player.character };
      let updatedInventory = [...state.player.inventory];
      
      // Apply item effects
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
        // Add to inventory
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
      
      // Remove item from inventory
      const itemIndex = updatedInventory.findIndex(i => i.id === item.id);
      if (itemIndex !== -1) {
        updatedInventory.splice(itemIndex, 1);
      }
      
      // If there's already an item equipped in this slot, return it to inventory
      if (item.type === 'weapon' && updatedEquippedItems.weapon) {
        updatedInventory.push(updatedEquippedItems.weapon);
        // Remove old weapon stats
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
        // Remove old armor stats
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
      
      // Equip new item
      if (item.type === 'weapon') {
        updatedEquippedItems.weapon = item;
      } else if (item.type === 'armor') {
        updatedEquippedItems.armor = item;
      }
      
      // Apply new item stats
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
        // Return item to inventory
        updatedInventory.push(equippedItem);
        
        // Remove item stats
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
        
        // Remove from equipped items
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
    dispatch({ type: 'UPDATE_ENEMY_AI' });
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
  
  // Enhanced game loops with enemy attack handling
  useEffect(() => {
    const aiUpdateInterval = setInterval(() => {
      updateEnemyAI();
    }, 100); // Update AI every 100ms
    
    // Separate interval for enemy attacks
    const enemyAttackInterval = setInterval(() => {
      const now = Date.now();
      state.currentWorld.enemies.forEach(enemy => {
        if (enemy.state === 'chase' && enemy.health > 0) {
          const distanceToPlayer = Math.sqrt(
            Math.pow(enemy.position.x - state.player.position.x, 2) +
            Math.pow(enemy.position.y - state.player.position.y, 2)
          );
          
          if (distanceToPlayer <= 50) {
            const attackCooldown = enemy.aiDifficulty === 'easy' ? 2000 : 
                                 enemy.aiDifficulty === 'medium' ? 1500 : 1000;
            
            if (now - enemy.lastAction > attackCooldown) {
              dispatch({ type: 'ENEMY_ATTACK', payload: { enemyId: enemy.id } });
            }
          }
        }
      });
    }, 500); // Check for attacks every 500ms
    
    const dayNightInterval = setInterval(() => {
      dispatch({ type: 'UPDATE_DAY_NIGHT' });
    }, 1000); // Update day/night every second
    
    const cooldownInterval = setInterval(() => {
      // Update move cooldowns
      // This would need a separate action type for proper implementation
    }, 1000);
    
    const damageNumberCleanup = setInterval(() => {
      const now = Date.now();
      state.combat.damageNumbers.forEach(dn => {
        if (now - dn.timestamp > 2000) { // Remove after 2 seconds
          dispatch({ type: 'REMOVE_DAMAGE_NUMBER', payload: { id: dn.id } });
        }
      });
    }, 100);
    
    return () => {
      clearInterval(aiUpdateInterval);
      clearInterval(enemyAttackInterval);
      clearInterval(dayNightInterval);
      clearInterval(cooldownInterval);
      clearInterval(damageNumberCleanup);
    };
  }, [state.combat.damageNumbers, state.currentWorld.enemies, state.player.position]);
  
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
        unequipItem
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