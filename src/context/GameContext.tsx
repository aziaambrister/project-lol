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
  | { type: 'GAME_OVER' }
  | { type: 'UPDATE_SURVIVAL_TIMER' }
  | { type: 'NEXT_SURVIVAL_WAVE' };

// FIXED: Create survival enemies with proper wave-based spawning
const createSurvivalEnemiesForWave = (waveNumber: number): Enemy[] => {
  console.log(`🎯 Creating enemies for wave ${waveNumber}...`);
  const survivalEnemies: Enemy[] = [];
  const arenaCenter = { x: 2000, y: 2000 };
  const arenaRadius = 400;
  
  // FIXED: Wave-based enemy count and difficulty
  let enemyCount: number;
  let healthMultiplier: number;
  let attackMultiplier: number;
  
  switch (waveNumber) {
    case 1:
      enemyCount = 3; // WAVE 1: 3 ENEMIES - EASY
      healthMultiplier = 0.7; // Reduced health
      attackMultiplier = 0.8; // Reduced attack
      break;
    case 2:
      enemyCount = 5; // WAVE 2: 5 ENEMIES - MEDIUM
      healthMultiplier = 1.0; // Normal health
      attackMultiplier = 1.0; // Normal attack
      break;
    case 3:
      enemyCount = 7; // WAVE 3: 7 ENEMIES - HARD
      healthMultiplier = 1.5; // Increased health
      attackMultiplier = 1.3; // Increased attack
      break;
    default:
      // Waves 4+ scale progressively
      enemyCount = 7 + (waveNumber - 3) * 2;
      healthMultiplier = 1.5 + (waveNumber - 3) * 0.3;
      attackMultiplier = 1.3 + (waveNumber - 3) * 0.2;
      break;
  }
  
  console.log(`📊 Wave ${waveNumber}: ${enemyCount} enemies, health x${healthMultiplier}, attack x${attackMultiplier}`);
  
  // Enemy templates with base stats
  const enemyTemplates = [
    {
      name: 'Mindless Zombie',
      sprite: '/zombie.png',
      baseHealth: 50,
      baseAttack: 8,
      defense: 3,
      speed: 4,
      experience: 25,
      detectionRadius: 120,
      patrolRadius: 100
    },
    {
      name: 'Wild Wolf',
      sprite: '/wolf.png',
      baseHealth: 40,
      baseAttack: 10,
      defense: 2,
      speed: 6,
      experience: 20,
      detectionRadius: 150,
      patrolRadius: 150
    },
    {
      name: 'Ice Bear',
      sprite: '/icebear.png',
      baseHealth: 80,
      baseAttack: 15,
      defense: 8,
      speed: 3,
      experience: 40,
      detectionRadius: 140,
      patrolRadius: 140
    }
  ];

  // Generate enemies for this wave
  for (let i = 0; i < enemyCount; i++) {
    const templateIndex = i % enemyTemplates.length;
    const template = enemyTemplates[templateIndex];
    
    // Calculate position around arena
    const angle = (i / enemyCount) * Math.PI * 2;
    const distance = Math.random() * (arenaRadius - 150) + 100;
    
    // Apply wave difficulty scaling
    const scaledHealth = Math.floor(template.baseHealth * healthMultiplier);
    const scaledAttack = Math.floor(template.baseAttack * attackMultiplier);
    
    const enemy: Enemy = {
      id: `survival-wave${waveNumber}-${template.name.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      name: template.name,
      type: 'aggressive',
      health: scaledHealth,
      maxHealth: scaledHealth,
      attack: scaledAttack,
      defense: template.defense,
      speed: template.speed,
      detectionRadius: template.detectionRadius,
      patrolRadius: template.patrolRadius,
      experience: template.experience + (waveNumber - 1) * 10,
      loot: [
        {
          id: `${template.name.toLowerCase()}-coin-wave${waveNumber}-${i}`,
          name: 'Battle Coin',
          type: 'material',
          rarity: 'common',
          value: 10 + (waveNumber * 5), // More coins in later waves
          icon: '🪙',
          description: 'A coin earned in survival combat'
        }
      ],
      position: {
        x: arenaCenter.x + Math.cos(angle) * distance,
        y: arenaCenter.y + Math.sin(angle) * distance
      },
      patrolCenter: {
        x: arenaCenter.x + Math.cos(angle) * distance,
        y: arenaCenter.y + Math.sin(angle) * distance
      },
      state: 'patrol',
      lastAction: 0,
      sprite: template.sprite,
      aiDifficulty: waveNumber === 1 ? 'easy' : waveNumber === 2 ? 'medium' : 'hard',
      moveSet: [
        {
          id: `${template.name.toLowerCase()}-attack-wave${waveNumber}-${i}`,
          name: `${template.name} Attack`,
          type: 'basic-attack',
          damage: scaledAttack + 3,
          staminaCost: 10,
          cooldown: 0,
          currentCooldown: 0,
          range: 35,
          description: `A fierce attack from ${template.name}`,
          animation: 'attack'
        }
      ]
    };
    
    survivalEnemies.push(enemy);
  }

  console.log(`✅ Created ${survivalEnemies.length} enemies for wave ${waveNumber}`);
  console.log('🎯 Enemy stats:', survivalEnemies.map(e => ({ 
    name: e.name, 
    health: e.health, 
    attack: e.attack,
    state: e.state 
  })));
  
  return survivalEnemies;
};

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
      enemyCount: 3, // Start with 3 enemies
      enemyTypes: ['zombie', 'wolf', 'bear'],
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
      const survivalEnemies = createSurvivalEnemiesForWave(1); // Start with wave 1
      
      console.log('🎮 Starting survival mode with character:', selectedCharacter.name);
      console.log('🎯 Wave 1 enemies:', survivalEnemies.length);
      
      return {
        ...state,
        gameMode: 'survival-mode',
        player: {
          ...state.player,
          character: { 
            ...selectedCharacter,
            health: selectedCharacter.maxHealth
          },
          position: { x: 2000, y: 2000 }
        },
        currentWorld: {
          ...state.currentWorld,
          enemies: survivalEnemies
        },
        survival: {
          ...state.survival,
          active: true,
          waveInProgress: true,
          enemiesRemaining: survivalEnemies.length,
          currentWave: {
            waveNumber: 1,
            enemyCount: survivalEnemies.length,
            enemyTypes: ['zombie', 'wolf', 'bear'],
            spawnDelay: 2000,
            bossWave: false,
            completed: false
          },
          stats: {
            survivalTime: 0,
            enemiesDefeated: 0,
            waveReached: 1,
            coinsEarned: 0,
            powerUpsUsed: 0,
            damageDealt: 0,
            damageTaken: 0
          }
        },
        camera: {
          ...state.camera,
          x: 2000,
          y: 2000
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

      // In survival mode, constrain player to arena
      if (state.gameMode === 'survival-mode') {
        const arenaCenter = state.survival.arena.center;
        const arenaRadius = state.survival.arena.radius;
        const distanceFromCenter = Math.sqrt(
          Math.pow(newX - arenaCenter.x, 2) + Math.pow(newY - arenaCenter.y, 2)
        );
        
        if (distanceFromCenter > arenaRadius) {
          const angle = Math.atan2(newY - arenaCenter.y, newX - arenaCenter.x);
          newX = arenaCenter.x + Math.cos(angle) * arenaRadius;
          newY = arenaCenter.y + Math.sin(angle) * arenaRadius;
        }
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
          const baseDamage = move ? move.damage : state.player.character.attack;
          const weaponBonus = state.player.equippedItems.weapon?.effect?.value || 0;
          const totalDamage = baseDamage + weaponBonus;
          
          const distance = Math.sqrt(
            Math.pow(targetEnemy.position.x - state.player.position.x, 2) +
            Math.pow(targetEnemy.position.y - state.player.position.y, 2)
          );

          const attackRange = move?.range || 50;
          if (distance <= attackRange) {
            const actualDamage = Math.max(1, totalDamage - targetEnemy.defense);
            const newHealth = Math.max(0, targetEnemy.health - actualDamage);
            const isDead = newHealth <= 0;

            console.log(`🗡️ Attack: ${actualDamage} damage to ${targetEnemy.name}, health: ${targetEnemy.health} -> ${newHealth}, isDead: ${isDead}`);

            const damageNumber: DamageNumber = {
              id: `damage-${Date.now()}`,
              value: actualDamage,
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
            let newSurvivalStats = state.survival.stats;

            if (isDead) {
              const coinReward = state.gameMode === 'survival-mode' ? 15 : 10;
              newPlayerCurrency += coinReward;
              newPlayerExperience += targetEnemy.experience;
              
              if (state.gameMode === 'survival-mode') {
                newSurvivalStats = {
                  ...newSurvivalStats,
                  enemiesDefeated: newSurvivalStats.enemiesDefeated + 1,
                  coinsEarned: newSurvivalStats.coinsEarned + coinReward,
                  damageDealt: newSurvivalStats.damageDealt + actualDamage
                };
                console.log(`💀 Enemy killed! Total defeated: ${newSurvivalStats.enemiesDefeated}`);
              }
              
              if (newPlayerExperience >= state.player.character.experienceToNextLevel) {
                leveledUp = true;
                newPlayerExperience -= state.player.character.experienceToNextLevel;
              }
            } else if (state.gameMode === 'survival-mode') {
              newSurvivalStats = {
                ...newSurvivalStats,
                damageDealt: newSurvivalStats.damageDealt + actualDamage
              };
            }

            const aliveEnemies = updatedEnemies.filter(e => e.state !== 'dead').length;
            const newEnemiesRemaining = state.gameMode === 'survival-mode' ? aliveEnemies : state.survival.enemiesRemaining;

            console.log(`🎯 Enemies remaining: ${newEnemiesRemaining} (alive: ${aliveEnemies})`);

            // FIXED: Check for wave completion and progression
            let newGameMode = state.gameMode;
            let newSurvivalState = state.survival;
            
            if (state.gameMode === 'survival-mode' && newEnemiesRemaining === 0 && state.survival.waveInProgress) {
              console.log(`🏆 Wave ${state.survival.currentWave.waveNumber} completed!`);
              
              // Check if this was the final wave (wave 3)
              if (state.survival.currentWave.waveNumber >= 3) {
                console.log('🎉 All waves completed! Going to results...');
                newGameMode = 'survival-results';
                newSurvivalStats = {
                  ...newSurvivalStats,
                  waveReached: state.survival.currentWave.waveNumber
                };
              } else {
                // Prepare for next wave
                const nextWaveNumber = state.survival.currentWave.waveNumber + 1;
                console.log(`🔄 Preparing wave ${nextWaveNumber}...`);
                
                newSurvivalState = {
                  ...newSurvivalState,
                  waveInProgress: false,
                  nextWaveTimer: 5000, // 5 second break between waves
                  currentWave: {
                    ...newSurvivalState.currentWave,
                    completed: true
                  },
                  stats: {
                    ...newSurvivalStats,
                    waveReached: Math.max(newSurvivalStats.waveReached, nextWaveNumber)
                  }
                };
              }
            }

            return {
              ...state,
              gameMode: newGameMode,
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
              survival: newSurvivalState,
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

    case 'NEXT_SURVIVAL_WAVE': {
      if (state.gameMode === 'survival-mode' && !state.survival.waveInProgress) {
        const nextWaveNumber = state.survival.currentWave.waveNumber + 1;
        const newEnemies = createSurvivalEnemiesForWave(nextWaveNumber);
        
        console.log(`🌊 Starting wave ${nextWaveNumber} with ${newEnemies.length} enemies`);
        
        return {
          ...state,
          currentWorld: {
            ...state.currentWorld,
            enemies: newEnemies
          },
          survival: {
            ...state.survival,
            waveInProgress: true,
            enemiesRemaining: newEnemies.length,
            nextWaveTimer: 0,
            currentWave: {
              waveNumber: nextWaveNumber,
              enemyCount: newEnemies.length,
              enemyTypes: ['zombie', 'wolf', 'bear'],
              spawnDelay: 2000,
              bossWave: false,
              completed: false
            }
          }
        };
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
        const actualDamage = Math.max(1, action.damage - (state.player.equippedItems.armor?.effect?.value || 0));
        const newHealth = Math.max(0, state.player.character.health - actualDamage);
        const isDead = newHealth <= 0;

        let newSurvivalStats = state.survival.stats;
        if (state.gameMode === 'survival-mode') {
          newSurvivalStats = {
            ...newSurvivalStats,
            damageTaken: newSurvivalStats.damageTaken + actualDamage
          };
        }

        return {
          ...state,
          player: {
            ...state.player,
            character: {
              ...state.player.character,
              health: newHealth
            }
          },
          survival: {
            ...state.survival,
            stats: newSurvivalStats
          },
          gameMode: isDead ? (state.gameMode === 'survival-mode' ? 'survival-results' : 'game-over') : state.gameMode
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
          newHealth = newMaxHealth;
        }

        const xpNumber: DamageNumber = {
          id: `xp-${Date.now()}`,
          value: orb.xpValue,
          position: { ...orb.position },
          type: 'xp',
          timestamp: Date.now()
        };

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
      // FIXED: Don't update enemies if they're empty - this prevents disappearing
      if (action.enemies.length === 0 && state.currentWorld.enemies.length > 0) {
        console.log('⚠️ Preventing enemy disappearing - keeping current enemies');
        return state;
      }
      
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

    case 'UPDATE_SURVIVAL_TIMER': {
      if (state.gameMode === 'survival-mode' && state.survival.active) {
        let newSurvival = {
          ...state.survival,
          stats: {
            ...state.survival.stats,
            survivalTime: state.survival.stats.survivalTime + 1
          }
        };

        // Handle wave transition timer
        if (!state.survival.waveInProgress && state.survival.nextWaveTimer > 0) {
          newSurvival.nextWaveTimer = Math.max(0, state.survival.nextWaveTimer - 1000);
          
          // Start next wave when timer reaches 0
          if (newSurvival.nextWaveTimer === 0) {
            const nextWaveNumber = state.survival.currentWave.waveNumber + 1;
            const newEnemies = createSurvivalEnemiesForWave(nextWaveNumber);
            
            return {
              ...state,
              currentWorld: {
                ...state.currentWorld,
                enemies: newEnemies
              },
              survival: {
                ...newSurvival,
                waveInProgress: true,
                enemiesRemaining: newEnemies.length,
                nextWaveTimer: 0,
                currentWave: {
                  waveNumber: nextWaveNumber,
                  enemyCount: newEnemies.length,
                  enemyTypes: ['zombie', 'wolf', 'bear'],
                  spawnDelay: 2000,
                  bossWave: false,
                  completed: false
                }
              }
            };
          }
        }

        return {
          ...state,
          survival: newSurvival
        };
      }
      return state;
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
  
  const aiSystem = new EnemyAISystem();

  // FIXED: Properly manage AI system without causing enemy disappearing
  useEffect(() => {
    // Only add enemies to AI system, don't remove them unless they're actually dead
    state.currentWorld.enemies.forEach(enemy => {
      if (enemy.state !== 'dead' && !aiSystem.getEnemyState(enemy.id)) {
        aiSystem.addEnemy(enemy);
      }
    });
  }, [state.currentWorld.enemies.length]); // Only trigger when enemy count changes

  // FIXED: Update AI system - ONLY when in survival mode and game is active
  useEffect(() => {
    if (state.gameMode !== 'survival-mode' || !state.survival.active) {
      return;
    }

    const updateAI = () => {
      try {
        const updatedEnemies = aiSystem.updateEnemies(
          state.player.position,
          state.player.character,
          16 // 60fps delta time
        );
        
        // FIXED: Only update if we have enemies to prevent disappearing
        if (updatedEnemies.length > 0) {
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
      } catch (error) {
        console.error('AI update error:', error);
      }
    };

    const aiInterval = setInterval(updateAI, 100); // Update AI every 100ms
    return () => clearInterval(aiInterval);
  }, [state.gameMode, state.player.position.x, state.player.position.y, state.survival.active]);

  // Clean up damage numbers
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      state.combat.damageNumbers.forEach(dn => {
        if (now - dn.timestamp > 2000) {
          dispatch({ type: 'REMOVE_DAMAGE_NUMBER', id: dn.id });
        }
      });
    }, 100);

    return () => clearInterval(cleanup);
  }, [state.combat.damageNumbers]);

  // FIXED: Survival mode timer
  useEffect(() => {
    if (state.gameMode === 'survival-mode' && state.survival.active) {
      const timer = setInterval(() => {
        dispatch({ type: 'UPDATE_SURVIVAL_TIMER' });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.gameMode, state.survival.active]);

  const startGame = (characterClass: CharacterClass) => {
    dispatch({ type: 'START_GAME', characterClass });
  };

  const startSurvival = (characterClass: CharacterClass) => {
    console.log('🎮 Starting survival mode with character:', characterClass);
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