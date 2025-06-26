import { GameWorld, Enemy, Building, WaterBody, NPC, Item } from '../types/game';

export const gameWorld: GameWorld = {
  id: 'main-world',
  name: 'Realm of Fighters',
  size: { width: 4000, height: 4000 },
  terrain: [],
  spawnPoint: { x: 200, y: 3800 },
  
  buildings: [
    // Forest Area Buildings - positioned to match the map
    {
      id: 'forest-cabin-1',
      name: 'Forest Cabin',
      type: 'house',
      position: { x: 600, y: 800 },
      size: { width: 120, height: 90 },
      enterable: true,
      sprite: '🏠',
      interior: {
        background: '/forestcabin.png',
        npcs: [],
        items: [
          {
            id: 'cabin-bread',
            name: 'Fresh Bread',
            type: 'consumable',
            rarity: 'common',
            value: 0,
            effect: { type: 'heal', value: 30 },
            icon: '🍞',
            description: 'Freshly baked bread that restores 30 health',
            usable: true
          },
          {
            id: 'cabin-apple',
            name: 'Red Apple',
            type: 'consumable',
            rarity: 'common',
            value: 0,
            effect: { type: 'heal', value: 20 },
            icon: '🍎',
            description: 'A crisp red apple that restores 20 health',
            usable: true
          },
          {
            id: 'cabin-cheese',
            name: 'Cheese Wheel',
            type: 'consumable',
            rarity: 'common',
            value: 0,
            effect: { type: 'heal', value: 25 },
            icon: '🧀',
            description: 'Aged cheese that restores 25 health',
            usable: true
          }
        ],
        exits: [{ x: 60, y: 90, leadsTo: 'main-world' }]
      }
    },
    {
      id: 'forest-cabin-2',
      name: 'Cozy Forest Cabin',
      type: 'house',
      position: { x: 600, y: 2200 },
      size: { width: 120, height: 90 },
      enterable: true,
      sprite: '🏠',
      interior: {
        background: '/snowy cabin.png', // Using the new snowy cabin background
        npcs: [],
        items: [
          {
            id: 'cabin2-potion',
            name: 'Health Potion',
            type: 'consumable',
            rarity: 'uncommon',
            value: 0,
            effect: { type: 'heal', value: 50 },
            icon: '🧪',
            description: 'A magical potion that restores 50 health',
            usable: true
          },
          {
            id: 'cabin2-scroll',
            name: 'Ancient Scroll',
            type: 'key',
            rarity: 'rare',
            value: 0,
            icon: '📜',
            description: 'An ancient scroll with mysterious writings',
            usable: false
          }
        ],
        exits: [{ x: 60, y: 90, leadsTo: 'main-world' }]
      }
    },
    // Snow Area Building - positioned to match the map
    {
      id: 'snow-cabin',
      name: 'Snow Cabin',
      type: 'house',
      position: { x: 2800, y: 1200 },
      size: { width: 120, height: 90 },
      enterable: true,
      sprite: '🏠',
      interior: {
        background: '/snowy cabin.png', // Using the new snowy cabin background
        npcs: [],
        items: [],
        exits: [{ x: 60, y: 90, leadsTo: 'main-world' }]
      }
    }
    // REMOVED: desert-temple, mountain-tower, mountain-fortress, lighthouse as requested
  ],
  
  waterBodies: [
    // All water bodies removed as requested
  ],
  
  enemies: [
    // Forest Area Enemies - Mindless Zombies with correct sprite path
    {
      id: 'forest-zombie-1',
      name: 'Mindless Zombie',
      type: 'aggressive',
      health: 60,
      maxHealth: 60,
      attack: 8,
      defense: 4,
      speed: 4,
      detectionRadius: 120,
      patrolRadius: 100,
      experience: 25,
      loot: [
        {
          id: 'zombie-coin',
          name: 'Rotting Coin',
          type: 'material',
          rarity: 'common',
          value: 10,
          icon: '🪙',
          description: 'A coin found on a zombie'
        }
      ],
      position: { x: 800, y: 1000 },
      patrolCenter: { x: 800, y: 1000 },
      state: 'patrol',
      lastAction: 0,
      sprite: '/zombie.png',
      aiDifficulty: 'easy',
      moveSet: [
        {
          id: 'zombie-claw',
          name: 'Rotting Claw',
          type: 'basic-attack',
          damage: 12,
          staminaCost: 10,
          cooldown: 0,
          currentCooldown: 0,
          range: 30,
          description: 'A diseased claw attack',
          animation: 'claw'
        }
      ]
    },
    {
      id: 'forest-zombie-2',
      name: 'Mindless Zombie',
      type: 'aggressive',
      health: 60,
      maxHealth: 60,
      attack: 8,
      defense: 4,
      speed: 4,
      detectionRadius: 120,
      patrolRadius: 100,
      experience: 25,
      loot: [
        {
          id: 'zombie-coin-2',
          name: 'Rotting Coin',
          type: 'material',
          rarity: 'common',
          value: 10,
          icon: '🪙',
          description: 'A coin found on a zombie'
        }
      ],
      position: { x: 1200, y: 1500 },
      patrolCenter: { x: 1200, y: 1500 },
      state: 'patrol',
      lastAction: 0,
      sprite: '/zombie.png',
      aiDifficulty: 'easy',
      moveSet: [
        {
          id: 'zombie-claw-2',
          name: 'Rotting Claw',
          type: 'basic-attack',
          damage: 12,
          staminaCost: 10,
          cooldown: 0,
          currentCooldown: 0,
          range: 30,
          description: 'A diseased claw attack',
          animation: 'claw'
        }
      ]
    },
    {
      id: 'forest-wolf-1',
      name: 'Wild Wolf',
      type: 'aggressive',
      health: 40,
      maxHealth: 40,
      attack: 10,
      defense: 2,
      speed: 6,
      detectionRadius: 150,
      patrolRadius: 150,
      experience: 20,
      loot: [
        {
          id: 'wolf-pelt',
          name: 'Wolf Pelt',
          type: 'material',
          rarity: 'common',
          value: 15,
          icon: '🐺',
          description: 'Thick fur from a wild wolf'
        }
      ],
      position: { x: 900, y: 1800 },
      patrolCenter: { x: 900, y: 1800 },
      state: 'patrol',
      lastAction: 0,
      sprite: '/wolf.png',
      aiDifficulty: 'medium',
      moveSet: [
        {
          id: 'wolf-bite',
          name: 'Savage Bite',
          type: 'basic-attack',
          damage: 15,
          staminaCost: 15,
          cooldown: 0,
          currentCooldown: 0,
          range: 25,
          description: 'A vicious bite attack',
          animation: 'bite'
        }
      ]
    },
    // Snow Area Enemies
    {
      id: 'snow-wolf',
      name: 'Snow Wolf',
      type: 'aggressive',
      health: 50,
      maxHealth: 50,
      attack: 12,
      defense: 4,
      speed: 7,
      detectionRadius: 160,
      patrolRadius: 160,
      experience: 30,
      loot: [
        {
          id: 'snow-pelt',
          name: 'Snow Wolf Pelt',
          type: 'material',
          rarity: 'uncommon',
          value: 25,
          icon: '🐺',
          description: 'Thick white fur from a snow wolf'
        }
      ],
      position: { x: 2600, y: 800 },
      patrolCenter: { x: 2600, y: 800 },
      state: 'patrol',
      lastAction: 0,
      sprite: '/wolf.png',
      aiDifficulty: 'medium',
      moveSet: [
        {
          id: 'frost-bite',
          name: 'Frost Bite',
          type: 'basic-attack',
          damage: 16,
          staminaCost: 18,
          cooldown: 0,
          currentCooldown: 0,
          range: 28,
          description: 'A freezing bite attack',
          animation: 'bite'
        }
      ]
    },
    {
      id: 'ice-bear',
      name: 'Ice Bear',
      type: 'aggressive',
      health: 120,
      maxHealth: 120,
      attack: 18,
      defense: 10,
      speed: 4,
      detectionRadius: 140,
      patrolRadius: 140,
      experience: 60,
      loot: [
        {
          id: 'ice-claw',
          name: 'Ice Bear Claw',
          type: 'material',
          rarity: 'rare',
          value: 60,
          icon: '🐻',
          description: 'Sharp claw from an ice bear'
        }
      ],
      position: { x: 3000, y: 1000 },
      patrolCenter: { x: 3000, y: 1000 },
      state: 'patrol',
      lastAction: 0,
      sprite: '/ice bear.png', // Using the new ice bear image
      aiDifficulty: 'hard',
      moveSet: [
        {
          id: 'ice-swipe',
          name: 'Ice Claw Swipe',
          type: 'basic-attack',
          damage: 22,
          staminaCost: 28,
          cooldown: 0,
          currentCooldown: 0,
          range: 38,
          description: 'A powerful icy claw attack',
          animation: 'swipe'
        }
      ]
    },
    // Plains/Grassland Enemies - positioned in open areas
    {
      id: 'plains-goblin-1',
      name: 'Goblin Scout',
      type: 'aggressive',
      health: 45,
      maxHealth: 45,
      attack: 7,
      defense: 3,
      speed: 7,
      detectionRadius: 100,
      patrolRadius: 140,
      experience: 18,
      loot: [
        {
          id: 'goblin-dagger',
          name: 'Rusty Dagger',
          type: 'weapon',
          rarity: 'common',
          value: 30,
          effect: { type: 'boost-attack', value: 3 },
          icon: '🗡️',
          description: 'A small, rusty blade'
        }
      ],
      position: { x: 1800, y: 2000 },
      patrolCenter: { x: 1800, y: 2000 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7772716/pexels-photo-7772716.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'easy',
      moveSet: [
        {
          id: 'goblin-stab',
          name: 'Quick Stab',
          type: 'basic-attack',
          damage: 10,
          staminaCost: 8,
          cooldown: 0,
          currentCooldown: 0,
          range: 25,
          description: 'A quick dagger thrust',
          animation: 'stab'
        }
      ]
    },
    {
      id: 'plains-goblin-2',
      name: 'Goblin Warrior',
      type: 'aggressive',
      health: 55,
      maxHealth: 55,
      attack: 9,
      defense: 4,
      speed: 6,
      detectionRadius: 110,
      patrolRadius: 120,
      experience: 25,
      loot: [
        {
          id: 'goblin-sword',
          name: 'Goblin Sword',
          type: 'weapon',
          rarity: 'common',
          value: 45,
          effect: { type: 'boost-attack', value: 4 },
          icon: '⚔️',
          description: 'A crude goblin blade'
        }
      ],
      position: { x: 2000, y: 1600 },
      patrolCenter: { x: 2000, y: 1600 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7772716/pexels-photo-7772716.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'easy',
      moveSet: [
        {
          id: 'goblin-slash',
          name: 'Sword Slash',
          type: 'basic-attack',
          damage: 12,
          staminaCost: 12,
          cooldown: 0,
          currentCooldown: 0,
          range: 28,
          description: 'A crude sword attack',
          animation: 'slash'
        }
      ]
    },
    // Lake/Water Area Enemies - Lake Serpent with updated dragon snake image
    {
      id: 'water-serpent',
      name: 'Lake Serpent',
      type: 'aggressive',
      health: 80,
      maxHealth: 80,
      attack: 14,
      defense: 6,
      speed: 6,
      detectionRadius: 150,
      patrolRadius: 100,
      experience: 45,
      loot: [
        {
          id: 'serpent-scale',
          name: 'Lake Serpent Scale',
          type: 'material',
          rarity: 'rare',
          value: 40,
          icon: '🐍',
          description: 'A shimmering scale from a lake serpent'
        }
      ],
      position: { x: 2600, y: 3000 },
      patrolCenter: { x: 2600, y: 3000 },
      state: 'patrol',
      lastAction: 0,
      sprite: '/dragonsnake.png', // Updated to use the new dragon snake image
      aiDifficulty: 'medium',
      moveSet: [
        {
          id: 'serpent-bite',
          name: 'Venomous Bite',
          type: 'basic-attack',
          damage: 18,
          staminaCost: 22,
          cooldown: 0,
          currentCooldown: 0,
          range: 35,
          description: 'A poisonous serpent bite',
          animation: 'bite'
        }
      ]
    }
  ],
  
  npcs: [
    // All NPCs removed - only enemies remain
  ],
  
  items: [
    {
      id: 'health-herb',
      name: 'Healing Herb',
      type: 'consumable',
      rarity: 'common',
      value: 20,
      effect: { type: 'heal', value: 20 },
      icon: '🌿',
      description: 'A natural healing plant'
    }
  ],
  
  dayNightCycle: {
    currentTime: 12,
    dayLength: 300,
    lightLevel: 1.0
  },
  
  weather: {
    type: 'clear', // CHANGED FROM 'rain' TO 'clear' - NO MORE RAIN!
    intensity: 0
  }
};