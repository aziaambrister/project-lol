import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, CharacterClass, Character, Enemy, Move, DamageNumber, Item } from '../types/game';
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
  gameOver: (victory?: boolean) => void;
  restartGame: () => void;
  returnToHome: () => void;
  updateMovement: (deltaTime: number) => void;
}

type GameAction =
  | { type: 'START_GAME'; payload: { characterClass: CharacterClass } }
  | { type: 'MOVE_PLAYER'; payload: { direction: 'up' | 'down' | 'left' | 'right' } }
  | { type: 'STOP_MOVING' }
  | { type: 'UPDATE_MOVEMENT'; payload: { deltaTime: number } }
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
  | { type: 'GAME_OVER'; payload: { victory?: boolean } }
  | { type: 'RESTART_GAME' }
  | { type: 'RETURN_TO_HOME' };

const initialState: GameState = {
  gameMode: 'character-select',
  player: {
    character: characters[0],
    position: { x: 1500, y: 1500 }, // Updated for scaled map
    velocity: { x: 0, y: 0 }, // New velocity system
    direction: 'down',
    isMoving: false,
    isSwimming: false,
    inventory: [],
    currency: 100, // Starting coins
    stats: {
      enemiesDefeated: 0,
      coinsEarned: 0,
      timeAlive: 0,
      startTime: Date.now()
    }
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
    x: 1500, // Updated for scaled map
    y: 1500,
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
  // Enhanced movement system with proper physics values
  movement: {
    speed: 250, // 250 units per second - good balance for exploration
    acceleration: 1000, // 1000 units per second squared - responsive feel
    deceleration: 1500, // 1500 units per second squared - quick stops
    maxSpeed: 350 // 350 maximum speed cap - allows for speed boosts
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
          stats: {
            ...state.player.stats,
            startTime: Date.now()
          }
        }
      };
    }
    
    case 'MOVE_PLAYER': {
      const { direction } = action.payload;
      
      return {
        ...state,
        player: {
          ...state.player,
          direction,
          isMoving: true
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

    case 'UPDATE_MOVEMENT': {
      const { deltaTime } = action.payload;
      const { player, movement } = state;
      
      let newVelocityX = player.velocity.x;
      let newVelocityY = player.velocity.y;
      
      // Apply acceleration based on input
      if (player.isMoving) {
        const accelerationRate = movement.acceleration * deltaTime;
        
        switch (player.direction) {
          case 'up':
            newVelocityY = Math.max(newVelocityY - accelerationRate, -movement.maxSpeed);
            break;
          case 'down':
            newVelocityY = Math.min(newVelocityY + accelerationRate, movement.maxSpeed);
            break;
          case 'left':
            newVelocityX = Math.max(newVelocityX - accelerationRate, -movement.maxSpeed);
            break;
          case 'right':
            newVelocityX = Math.min(newVelocityX + accelerationRate, movement.maxSpeed);
            break;
        }
      } else {
        // Apply deceleration when not moving
        const decelerationRate = movement.deceleration * deltaTime;
        
        if (newVelocityX > 0) {
          newVelocityX = Math.max(0, newVelocityX - decelerationRate);
        } else if (newVelocityX < 0) {
          newVelocityX = Math.min(0, newVelocityX + decelerationRate);
        }
        
        if (newVelocityY > 0) {
          newVelocityY = Math.max(0, newVelocityY - decelerationRate);
        } else if (newVelocityY < 0) {
          newVelocityY = Math.min(0, newVelocityY + decelerationRate);
        }
      }
      
      // Update position based on velocity
      let newX = player.position.x + newVelocityX * deltaTime;
      let newY = player.position.y + newVelocityY * deltaTime;
      
      // Keep within world bounds
      newX = Math.max(0, Math.min(state.currentWorld.size.width, newX));
      newY = Math.max(0, Math.min(state.currentWorld.size.height, newY));
      
      // Check for water collision
      const isInWater = state.currentWorld.waterBodies.some(water => 
        newX >= water.position.x && 
        newX <= water.position.x + water.size.width &&
        newY >= water.position.y && 
        newY <= water.position.y + water.size.height
      );
      
      // Update time alive
      const currentTime = Date.now();
      const timeAlive = Math.floor((currentTime - player.stats.startTime) / 1000);
      
      return {
        ...state,
        player: {
          ...state.player,
          position: { x: newX, y: newY },
          velocity: { x: newVelocityX, y: newVelocityY },
          isSwimming: isInWater,
          stats: {
            ...state.player.stats,
            timeAlive
          }
        },
        camera: {
          ...state.camera,
          x: newX,
          y: newY
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
      let enemiesDefeated = state.player.stats.enemiesDefeated;
      let coinsEarned = state.player.stats.coinsEarned;
      
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
            enemiesDefeated += 1;
            coinsEarned += 10;
            
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
          currency: newCurrency,
          stats: {
            ...state.player.stats,
            enemiesDefeated,
            coinsEarned
          }
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
      
      // Check for game over
      let newGameMode = state.gameMode;
      if (newPlayerHealth <= 0) {
        newGameMode = 'game-over';
      }
      
      return {
        ...state,
        gameMode: newGameMode,
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

    case 'GAME_OVER': {
      return {
        ...state,
        gameMode: 'game-over'
      };
    }

    case 'RESTART_GAME': {
      return {
        ...initialState,
        gameMode: 'character-select'
      };
    }

    case 'RETURN_TO_HOME': {
      return {
        ...initialState,
        gameMode: 'character-select'
      };
    }
    
    case 'UNLOCK_CHARACTER': {
      // Implementation for character unlocking
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

  const updateMovement = (deltaTime: number) => {
    dispatch({ type: 'UPDATE_MOVEMENT', payload: { deltaTime } });
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

  const gameOver = (victory?: boolean) => {
    dispatch({ type: 'GAME_OVER', payload: { victory } });
  };

  const restartGame = () => {
    dispatch({ type: 'RESTART_GAME' });
  };

  const returnToHome = () => {
    dispatch({ type: 'RETURN_TO_HOME' });
  };
  
  // Enhanced game loops with smooth movement
  useEffect(() => {
    let lastTime = performance.now();
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;
      
      // Update movement with delta time for smooth, frame-rate independent movement
      updateMovement(deltaTime);
      
      requestAnimationFrame(gameLoop);
    };
    
    const animationFrame = requestAnimationFrame(gameLoop);
    
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
      cancelAnimationFrame(animationFrame);
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
        updateMovement,
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
        gameOver,
        restartGame,
        returnToHome
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}