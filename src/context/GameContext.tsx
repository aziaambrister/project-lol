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

const GameContext = createContext<GameContextType | undefined>(undefined);

// Game state reducer
type GameAction = 
  | { type: 'START_GAME'; characterClass: CharacterClass }
  | { type: 'START_SURVIVAL'; characterClass: CharacterClass }
  | { type: 'MOVE_PLAYER'; direction: 'up' | 'down' | 'left' | 'right' }
  | { type: 'STOP_MOVING' }
  | { type: 'PERFORM_ATTACK'; moveId: string; targetId?: string }
  | { type: 'ENTER_BUILDING'; buildingId: string }
  | { type: 'EXIT_BUILDING' }
  | { type: 'INTERACT_WITH_NPC'; npcId: string }
  | { type: 'PICKUP_ITEM'; itemId: string }
  | { type: 'UNLOCK_CHARACTER'; characterClass: CharacterClass }
  | { type: 'UPDATE_ENEMY_AI'; enemies: Enemy[] }
  | { type: 'TAKE_DAMAGE'; damage: number; targetId: string }
  | { type: 'PURCHASE_ITEM'; itemId: string; price: number; item: Item }
  | { type: 'ADD_COINS'; amount: number }
  | { type: 'EQUIP_ITEM'; item: Item }
  | { type: 'UNEQUIP_ITEM'; itemType: 'weapon' | 'armor' }
  | { type: 'TOGGLE_DEBUG_MODE' }
  | { type: 'RESTART_GAME' }
  | { type: 'COLLECT_XP_ORB'; orbId: string }
  | { type: 'COLLECT_SURVIVAL_DROP'; dropId: string }
  | { type: 'USE_POWER_UP'; powerUpIndex: number }
  | { type: 'RESTART_SURVIVAL' }
  | { type: 'EXIT_SURVIVAL' }
  | { type: 'UPDATE_CAMERA'; x: number; y: number }
  | { type: 'ADD_DAMAGE_NUMBER'; damageNumber: DamageNumber }
  | { type: 'REMOVE_DAMAGE_NUMBER'; id: string }
  | { type: 'LEVEL_UP' }
  | { type: 'GAME_OVER' };

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
    achievements: [],
    survivalBestScore: 0,
    survivalBestWave: 0
  },
  currentWorld: gameWorld,
  combat: {
    inCombat: false,
    playerTurn: true,
    comboCount: 0,
    lastHitTime: 0,
    damageNumbers: []
  },
  survival: {
    active: false,
    currentWave: {
      waveNumber: 1,
      enemyCount: 5,
      enemyTypes: ['zombie', 'wolf'],
      spawnDelay: 2000,
      bossWave: false,
      completed: false
    },
    nextWaveTimer: 0,
    waveInProgress: false,
    enemiesRemaining: 0,
    drops: [],
    activePowerUps: [],
    stats: {
      survivalTime: 0,
      enemiesDefeated: 0,
      waveReached: 1,
      coinsEarned: 0,
      powerUpsUsed: 0,
      damageDealt: 0,
      damageTaken: 0
    },
    arena: {
      center: { x: 2000, y: 2000 },
      radius: 500,
      shrinking: false,
      shrinkRate: 1
    }
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
    musicVolume: 70,
    sfxVolume: 80,
    difficulty: 'medium'
  },
  debug: {
    enabled: false,
    showEnemyStates: false,
    showPerformanceMetrics: false
  },
  leaderboard: []
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const selectedCharacter = characters.find(c => c.class === action.characterClass) || characters[0];
      return {
        ...state,
        gameMode: 'world-exploration',
        player: {
          ...state.player,
          character: { ...selectedCharacter }
        }
      };
    }

    case 'START_SURVIVAL': {
      const selectedCharacter = characters.find(c => c.class === action.characterClass) || characters[0];
      return {
        ...state,
        gameMode: 'survival-mode',
        player: {
          ...state.player,
          character: { ...selectedCharacter },
          position: { x: 2000, y: 2000 } // Center of survival arena
        },
        survival: {
          ...state.survival,
          active: true,
          waveInProgress: true,
          enemiesRemaining: 5,
          stats: {
            survivalTime: 0,
            enemiesDefeated: 0,
            waveReached: 1,
            coinsEarned: 0,
            powerUpsUsed: 0,
            damageDealt: 0,
            damageTaken: 0
          }
        }
      };
    }

    case 'MOVE_PLAYER': {
      const speed = state.player.character.speed;
      let newX = state.player.position.x;
      let newY = state.player.position.y;

      switch (action.direction) {
        case 'up':
          newY = Math.max(0, newY - speed);
          break;
        case 'down':
          newY = Math.min(state.currentWorld.size.height, newY + speed);
          break;
        case 'left':
          newX = Math.max(0, newX - speed);
          break;
        case 'right':
          newX = Math.min(state.currentWorld.size.width, newX + speed);
          break;
      }

      return {
        ...state,
        player: {
          ...state.player,
          position: { x: newX, y: newY },
          direction: action.direction,
          isMoving: true
        },
        camera: {
          ...state.camera,
          x: newX,
          y: newY
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
      if (action.targetId) {
        const targetEnemy = state.currentWorld.enemies.find(e => e.id === action.targetId);
        if (targetEnemy && targetEnemy.state !== 'dead') {
          const move = state.player.character.moveSet.find(m => m.id === action.moveId);
          const damage = move ? move.damage + state.player.character.attack : state.player.character.attack;
          
          // Calculate distance to target
          const distance = Math.sqrt(
            Math.pow(targetEnemy.position.x - state.player.position.x, 2) +
            Math.pow(targetEnemy.position.y - state.player.position.y, 2)
          );

          // Check if target is in range
          const attackRange = move?.range || 50;
          if (distance <= attackRange) {
            const newHealth = Math.max(0, targetEnemy.health - damage);
            const isDead = newHealth <= 0;

            // Create damage number
            const damageNumber: DamageNumber = {
              id: `damage-${Date.now()}`,
              value: damage,
              position: { ...targetEnemy.position },
              type: 'damage',
              timestamp: Date.now()
            };

            const updatedEnemies = state.currentWorld.enemies.map(enemy => {
              if (enemy.id === action.targetId) {
                return {
                  ...enemy,
                  health: newHealth,
                  state: isDead ? 'dead' as const : enemy.state
                };
              }
              return enemy;
            });

            let newPlayerCurrency = state.player.currency;
            let newPlayerExperience = state.player.character.experience;
            let leveledUp = false;

            if (isDead) {
              newPlayerCurrency += 10; // Coins for killing enemy
              newPlayerExperience += targetEnemy.experience;
              
              // Check for level up
              if (newPlayerExperience >= state.player.character.experienceToNextLevel) {
                leveledUp = true;
                newPlayerExperience -= state.player.character.experienceToNextLevel;
              }
            }

            return {
              ...state,
              currentWorld: {
                ...state.currentWorld,
                enemies: updatedEnemies
              },
              player: {
                ...state.player,
                currency: newPlayerCurrency,
                character: {
                  ...state.player.character,
                  experience: newPlayerExperience,
                  level: leveledUp ? state.player.character.level + 1 : state.player.character.level,
                  maxHealth: leveledUp ? state.player.character.maxHealth + 10 : state.player.character.maxHealth,
                  health: leveledUp ? state.player.character.maxHealth + 10 : state.player.character.health
                }
              },
              combat: {
                ...state.combat,
                damageNumbers: [...state.combat.damageNumbers, damageNumber]
              }
            };
          }
        }
      }
      return state;
    }

    case 'ENTER_BUILDING': {
      const building = state.currentWorld.buildings.find(b => b.id === action.buildingId);
      if (building && building.enterable) {
        return {
          ...state,
          gameMode: 'building-interior',
          player: {
            ...state.player,
            currentBuilding: action.buildingId
          }
        };
      }
      return state;
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

    case 'TAKE_DAMAGE': {
      if (action.targetId === 'player') {
        const newHealth = Math.max(0, state.player.character.health - action.damage);
        const isDead = newHealth <= 0;

        return {
          ...state,
          player: {
            ...state.player,
            character: {
              ...state.player.character,
              health: newHealth
            }
          },
          gameMode: isDead ? 'game-over' : state.gameMode
        };
      }
      return state;
    }

    case 'PURCHASE_ITEM': {
      if (state.player.currency >= action.price) {
        return {
          ...state,
          player: {
            ...state.player,
            currency: state.player.currency - action.price,
            inventory: [...state.player.inventory, action.item]
          }
        };
      }
      return state;
    }

    case 'ADD_COINS': {
      return {
        ...state,
        player: {
          ...state.player,
          currency: state.player.currency + action.amount
        }
      };
    }

    case 'EQUIP_ITEM': {
      const item = action.item;
      let newEquippedItems = { ...state.player.equippedItems };
      
      if (item.type === 'weapon') {
        newEquippedItems.weapon = item;
      } else if (item.type === 'armor') {
        newEquippedItems.armor = item;
      }

      return {
        ...state,
        player: {
          ...state.player,
          equippedItems: newEquippedItems
        }
      };
    }

    case 'UNEQUIP_ITEM': {
      let newEquippedItems = { ...state.player.equippedItems };
      
      if (action.itemType === 'weapon') {
        delete newEquippedItems.weapon;
      } else if (action.itemType === 'armor') {
        delete newEquippedItems.armor;
      }

      return {
        ...state,
        player: {
          ...state.player,
          equippedItems: newEquippedItems
        }
      };
    }

    case 'TOGGLE_DEBUG_MODE': {
      return {
        ...state,
        debug: {
          ...state.debug,
          enabled: !state.debug.enabled
        }
      };
    }

    case 'RESTART_GAME': {
      return {
        ...initialState,
        player: {
          ...initialState.player,
          character: state.player.character,
          unlockedCharacters: state.player.unlockedCharacters,
          currency: state.player.currency
        }
      };
    }

    case 'COLLECT_XP_ORB': {
      const orb = state.currentWorld.xpOrbs.find(o => o.id === action.orbId);
      if (orb && !orb.collected) {
        const newExperience = state.player.character.experience + orb.xpValue;
        let leveledUp = false;
        let finalExperience = newExperience;
        let newLevel = state.player.character.level;
        let newMaxHealth = state.player.character.maxHealth;
        let newHealth = state.player.character.health;

        if (newExperience >= state.player.character.experienceToNextLevel) {
          leveledUp = true;
          finalExperience = newExperience - state.player.character.experienceToNextLevel;
          newLevel = state.player.character.level + 1;
          newMaxHealth = state.player.character.maxHealth + 10;
          newHealth = newMaxHealth; // Full heal on level up
        }

        // Create XP damage number
        const xpNumber: DamageNumber = {
          id: `xp-${Date.now()}`,
          value: orb.xpValue,
          position: { ...orb.position },
          type: 'xp',
          timestamp: Date.now()
        };

        // Create level up damage number if leveled up
        const levelUpNumber: DamageNumber | null = leveledUp ? {
          id: `levelup-${Date.now()}`,
          value: newLevel,
          position: { x: orb.position.x, y: orb.position.y - 30 },
          type: 'critical',
          timestamp: Date.now()
        } : null;

        const updatedOrbs = state.currentWorld.xpOrbs.map(o => 
          o.id === action.orbId ? { ...o, collected: true, lastCollected: Date.now() } : o
        );

        return {
          ...state,
          currentWorld: {
            ...state.currentWorld,
            xpOrbs: updatedOrbs
          },
          player: {
            ...state.player,
            character: {
              ...state.player.character,
              experience: finalExperience,
              level: newLevel,
              maxHealth: newMaxHealth,
              health: newHealth
            }
          },
          combat: {
            ...state.combat,
            damageNumbers: [
              ...state.combat.damageNumbers,
              xpNumber,
              ...(levelUpNumber ? [levelUpNumber] : [])
            ]
          }
        };
      }
      return state;
    }

    case 'UPDATE_ENEMY_AI': {
      return {
        ...state,
        currentWorld: {
          ...state.currentWorld,
          enemies: action.enemies
        }
      };
    }

    case 'ADD_DAMAGE_NUMBER': {
      return {
        ...state,
        combat: {
          ...state.combat,
          damageNumbers: [...state.combat.damageNumbers, action.damageNumber]
        }
      };
    }

    case 'REMOVE_DAMAGE_NUMBER': {
      return {
        ...state,
        combat: {
          ...state.combat,
          damageNumbers: state.combat.damageNumbers.filter(dn => dn.id !== action.id)
        }
      };
    }

    case 'GAME_OVER': {
      return {
        ...state,
        gameMode: 'game-over'
      };
    }

    case 'RESTART_SURVIVAL': {
      return {
        ...state,
        gameMode: 'character-select'
      };
    }

    case 'EXIT_SURVIVAL': {
      return {
        ...state,
        gameMode: 'character-select'
      };
    }

    default:
      return state;
  }
}

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { user } = useAuth();
  
  // Initialize AI system
  const aiSystem = new EnemyAISystem();

  // Add enemies to AI system when they're created
  useEffect(() => {
    state.currentWorld.enemies.forEach(enemy => {
      if (enemy.state !== 'dead') {
        aiSystem.addEnemy(enemy);
      }
    });
  }, [state.currentWorld.enemies]);

  // Update AI system
  useEffect(() => {
    const updateAI = () => {
      if (state.gameMode === 'world-exploration' || state.gameMode === 'survival-mode') {
        const updatedEnemies = aiSystem.updateEnemies(
          state.player.position,
          state.player.character,
          16 // 60fps delta time
        );
        
        dispatch({ type: 'UPDATE_ENEMY_AI', enemies: updatedEnemies });

        // Check for enemy attacks
        updatedEnemies.forEach(enemy => {
          if (enemy.state !== 'dead') {
            const attackCycle = aiSystem.getAttackCycle(enemy.id);
            if (attackCycle?.isAttacking) {
              const distance = Math.sqrt(
                Math.pow(enemy.position.x - state.player.position.x, 2) +
                Math.pow(enemy.position.y - state.player.position.y, 2)
              );
              
              if (distance <= attackCycle.attackRange) {
                dispatch({ type: 'TAKE_DAMAGE', damage: enemy.attack, targetId: 'player' });
              }
            }
          }
        });
      }
    };

    const aiInterval = setInterval(updateAI, 100); // Update AI every 100ms
    return () => clearInterval(aiInterval);
  }, [state.gameMode, state.player.position, state.player.character]);

  // Clean up damage numbers
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      state.combat.damageNumbers.forEach(dn => {
        if (now - dn.timestamp > 2000) { // Remove after 2 seconds
          dispatch({ type: 'REMOVE_DAMAGE_NUMBER', id: dn.id });
        }
      });
    }, 100);

    return () => clearInterval(cleanup);
  }, [state.combat.damageNumbers]);

  // Respawn XP orbs
  useEffect(() => {
    const respawnInterval = setInterval(() => {
      const now = Date.now();
      const updatedOrbs = state.currentWorld.xpOrbs.map(orb => {
        if (orb.collected && orb.lastCollected && orb.respawnTime) {
          if (now - orb.lastCollected >= orb.respawnTime) {
            return { ...orb, collected: false, lastCollected: undefined };
          }
        }
        return orb;
      });

      if (updatedOrbs.some((orb, index) => orb.collected !== state.currentWorld.xpOrbs[index].collected)) {
        dispatch({ 
          type: 'UPDATE_ENEMY_AI', 
          enemies: state.currentWorld.enemies 
        });
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(respawnInterval);
  }, [state.currentWorld.xpOrbs]);

  const startGame = (characterClass: CharacterClass) => {
    dispatch({ type: 'START_GAME', characterClass });
  };

  const startSurvival = (characterClass: CharacterClass) => {
    dispatch({ type: 'START_SURVIVAL', characterClass });
  };

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    dispatch({ type: 'MOVE_PLAYER', direction });
  };

  const stopMoving = () => {
    dispatch({ type: 'STOP_MOVING' });
  };

  const performAttack = (moveId: string, targetId?: string) => {
    dispatch({ type: 'PERFORM_ATTACK', moveId, targetId });
  };

  const enterBuilding = (buildingId: string) => {
    dispatch({ type: 'ENTER_BUILDING', buildingId });
  };

  const exitBuilding = () => {
    dispatch({ type: 'EXIT_BUILDING' });
  };

  const interactWithNPC = (npcId: string) => {
    dispatch({ type: 'INTERACT_WITH_NPC', npcId });
  };

  const pickupItem = (itemId: string) => {
    dispatch({ type: 'PICKUP_ITEM', itemId });
  };

  const unlockCharacter = (characterClass: CharacterClass) => {
    dispatch({ type: 'UNLOCK_CHARACTER', characterClass });
  };

  const updateEnemyAI = () => {
    // This is handled automatically by the useEffect
  };

  const takeDamage = (damage: number, targetId: string) => {
    dispatch({ type: 'TAKE_DAMAGE', damage, targetId });
  };

  const purchaseItem = (itemId: string, price: number, item: Item) => {
    dispatch({ type: 'PURCHASE_ITEM', itemId, price, item });
  };

  const addCoins = (amount: number) => {
    dispatch({ type: 'ADD_COINS', amount });
  };

  const equipItem = (item: Item) => {
    dispatch({ type: 'EQUIP_ITEM', item });
  };

  const unequipItem = (itemType: 'weapon' | 'armor') => {
    dispatch({ type: 'UNEQUIP_ITEM', itemType });
  };

  const toggleDebugMode = () => {
    dispatch({ type: 'TOGGLE_DEBUG_MODE' });
    aiSystem.enableDebugMode(!state.debug.enabled);
  };

  const restartGame = () => {
    dispatch({ type: 'RESTART_GAME' });
  };

  const collectXPOrb = (orbId: string) => {
    dispatch({ type: 'COLLECT_XP_ORB', orbId });
  };

  const collectSurvivalDrop = (dropId: string) => {
    dispatch({ type: 'COLLECT_SURVIVAL_DROP', dropId });
  };

  const usePowerUp = (powerUpIndex: number) => {
    dispatch({ type: 'USE_POWER_UP', powerUpIndex });
  };

  const restartSurvival = () => {
    dispatch({ type: 'RESTART_SURVIVAL' });
  };

  const exitSurvival = () => {
    dispatch({ type: 'EXIT_SURVIVAL' });
  };

  const value: GameContextType = {
    state,
    startGame,
    startSurvival,
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
    restartGame,
    collectXPOrb,
    collectSurvivalDrop,
    usePowerUp,
    restartSurvival,
    exitSurvival,
    aiSystem
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};