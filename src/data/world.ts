import { GameWorld, Enemy, Building, WaterBody, NPC, Item } from '../types/game';

export const gameWorld: GameWorld = {
  id: 'main-world',
  name: 'Realm of Fighters',
  size: { width: 4000, height: 4000 }, // Increased size to ensure full coverage
  terrain: [], // Will be generated procedurally
  spawnPoint: { x: 200, y: 3800 }, // Bottom left of the map
  
  buildings: [
    // Forest Area Buildings - positioned to match the map
    {
      id: 'forest-cabin-1',
      name: 'Forest Cabin',
      type: 'house',
      position: { x: 600, y: 800 }, // Top left house in forest
      size: { width: 120, height: 90 },
      enterable: true,
      sprite: '🏠',
      interior: {
        background: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        npcs: [],
        items: [],
        exits: [{ x: 60, y: 90, leadsTo: 'main-world' }]
      }
    },
    {
      id: 'forest-cabin-2',
      name: 'Forest Cabin',
      type: 'house',
      position: { x: 600, y: 2200 }, // Bottom left house in forest
      size: { width: 120, height: 90 },
      enterable: true,
      sprite: '🏠',
      interior: {
        background: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        npcs: [],
        items: [],
        exits: [{ x: 60, y: 90, leadsTo: 'main-world' }]
      }
    },
    // Snow Area Building - positioned to match the map
    {
      id: 'snow-cabin',
      name: 'Snow Cabin',
      type: 'house',
      position: { x: 2800, y: 1200 }, // Snow area cabin
      size: { width: 120, height: 90 },
      enterable: true,
      sprite: '🏠',
      interior: {
        background: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        npcs: [],
        items: [],
        exits: [{ x: 60, y: 90, leadsTo: 'main-world' }]
      }
    },
    // Desert Area Buildings (scaled positions)
    {
      id: 'desert-outpost',
      name: 'Desert Outpost',
      type: 'inn',
      position: { x: 1350, y: 2100 },
      size: { width: 135, height: 105 },
      enterable: true,
      sprite: '🏜️',
      interior: {
        background: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        npcs: [],
        items: [],
        exits: [{ x: 67, y: 105, leadsTo: 'main-world' }]
      }
    },
    {
      id: 'desert-temple',
      name: 'Ancient Temple',
      type: 'temple',
      position: { x: 2100, y: 2400 },
      size: { width: 150, height: 120 },
      enterable: true,
      sprite: '🏛️',
      interior: {
        background: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        npcs: [],
        items: [],
        exits: [{ x: 75, y: 120, leadsTo: 'main-world' }]
      }
    },
    // Mountain Area Buildings (scaled positions)
    {
      id: 'mountain-tower',
      name: 'Watchtower',
      type: 'dungeon',
      position: { x: 2400, y: 2250 },
      size: { width: 90, height: 120 },
      enterable: true,
      sprite: '🗼',
      interior: {
        background: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        npcs: [],
        items: [],
        exits: [{ x: 45, y: 120, leadsTo: 'main-world' }]
      }
    },
    {
      id: 'mountain-fortress',
      name: 'Mountain Fortress',
      type: 'dungeon',
      position: { x: 2700, y: 1800 },
      size: { width: 180, height: 150 },
      enterable: true,
      sprite: '🏰',
      interior: {
        background: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        npcs: [],
        items: [],
        exits: [{ x: 90, y: 150, leadsTo: 'main-world' }]
      }
    },
    // Coastal Buildings
    {
      id: 'lighthouse',
      name: 'Lighthouse',
      type: 'dungeon',
      position: { x: 150, y: 1200 },
      size: { width: 75, height: 150 },
      enterable: true,
      sprite: '🗼',
      interior: {
        background: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        npcs: [],
        items: [],
        exits: [{ x: 37, y: 150, leadsTo: 'main-world' }]
      }
    },
    // Trees for collision and hiding - positioned throughout the forest areas
    {
      id: 'tree-1',
      name: 'Large Oak Tree',
      type: 'house', // Using house type but not enterable
      position: { x: 800, y: 1200 },
      size: { width: 80, height: 100 },
      enterable: false,
      sprite: '🌳'
    },
    {
      id: 'tree-2',
      name: 'Pine Tree',
      type: 'house',
      position: { x: 1000, y: 1400 },
      size: { width: 60, height: 90 },
      enterable: false,
      sprite: '🌲'
    },
    {
      id: 'tree-3',
      name: 'Ancient Tree',
      type: 'house',
      position: { x: 700, y: 1600 },
      size: { width: 90, height: 110 },
      enterable: false,
      sprite: '🌳'
    },
    {
      id: 'tree-4',
      name: 'Forest Tree',
      type: 'house',
      position: { x: 1200, y: 1100 },
      size: { width: 70, height: 95 },
      enterable: false,
      sprite: '🌲'
    },
    {
      id: 'tree-5',
      name: 'Old Oak',
      type: 'house',
      position: { x: 900, y: 1700 },
      size: { width: 85, height: 105 },
      enterable: false,
      sprite: '🌳'
    },
    {
      id: 'tree-6',
      name: 'Tall Pine',
      type: 'house',
      position: { x: 1100, y: 1800 },
      size: { width: 65, height: 100 },
      enterable: false,
      sprite: '🌲'
    }
  ],
  
  waterBodies: [
    // Large Lake (positioned to match the map's lake)
    {
      id: 'central-lake',
      type: 'lake',
      position: { x: 2400, y: 2800 }, // Bottom right lake from the map
      size: { width: 800, height: 600 },
      swimmable: true,
      currentStrength: 0.5
    },
    // Northern River (scaled)
    {
      id: 'northern-river',
      type: 'river',
      position: { x: 600, y: 300 },
      size: { width: 450, height: 60 },
      swimmable: true,
      currentStrength: 1.0
    },
    // Eastern Pond (scaled)
    {
      id: 'eastern-pond',
      type: 'pond',
      position: { x: 2100, y: 1200 },
      size: { width: 180, height: 150 },
      swimmable: true,
      currentStrength: 0.3
    },
    // Western Coast (scaled)
    {
      id: 'western-coast',
      type: 'ocean',
      position: { x: 75, y: 600 },
      size: { width: 150, height: 1200 },
      swimmable: true,
      currentStrength: 2.0
    },
    // Additional water bodies for expanded map
    {
      id: 'southern-lake',
      type: 'lake',
      position: { x: 1800, y: 2400 },
      size: { width: 240, height: 180 },
      swimmable: true,
      currentStrength: 0.4
    },
    {
      id: 'mountain-stream',
      type: 'river',
      position: { x: 2400, y: 1500 },
      size: { width: 300, height: 45 },
      swimmable: true,
      currentStrength: 1.5
    }
  ],
  
  enemies: [
    // Forest Area Enemies - renamed to Mindless Zombie
    {
      id: 'forest-zombie-1',
      name: 'Mindless Zombie',
      type: 'patrol',
      health: 60,
      maxHealth: 60,
      attack: 8,
      defense: 4,
      speed: 4,
      detectionRadius: 80,
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
      position: { x: 800, y: 1000 }, // Forest area
      patrolCenter: { x: 800, y: 1000 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7991139/pexels-photo-7991139.jpeg?auto=compress&cs=tinysrgb&w=64',
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
      type: 'patrol',
      health: 60,
      maxHealth: 60,
      attack: 8,
      defense: 4,
      speed: 4,
      detectionRadius: 80,
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
      position: { x: 1200, y: 1500 }, // Forest area
      patrolCenter: { x: 1200, y: 1500 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7991139/pexels-photo-7991139.jpeg?auto=compress&cs=tinysrgb&w=64',
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
      id: 'forest-wolf-1',
      name: 'Wild Wolf',
      type: 'aggressive',
      health: 40,
      maxHealth: 40,
      attack: 10,
      defense: 2,
      speed: 6,
      detectionRadius: 100,
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
      position: { x: 900, y: 1800 }, // Forest area
      patrolCenter: { x: 900, y: 1800 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/2062324/pexels-photo-2062324.jpeg?auto=compress&cs=tinysrgb&w=64',
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
      detectionRadius: 110,
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
      position: { x: 2600, y: 800 }, // Snow area
      patrolCenter: { x: 2600, y: 800 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/2062324/pexels-photo-2062324.jpeg?auto=compress&cs=tinysrgb&w=64',
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
      detectionRadius: 100,
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
      position: { x: 3000, y: 1000 }, // Snow area
      patrolCenter: { x: 3000, y: 1000 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7991139/pexels-photo-7991139.jpeg?auto=compress&cs=tinysrgb&w=64',
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
      type: 'patrol',
      health: 45,
      maxHealth: 45,
      attack: 7,
      defense: 3,
      speed: 7,
      detectionRadius: 70,
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
      position: { x: 1800, y: 2000 }, // Open grassland
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
      type: 'patrol',
      health: 55,
      maxHealth: 55,
      attack: 9,
      defense: 4,
      speed: 6,
      detectionRadius: 75,
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
      position: { x: 2000, y: 1600 }, // Open grassland
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
    // Lake/Water Area Enemies
    {
      id: 'water-serpent',
      name: 'Lake Serpent',
      type: 'aggressive',
      health: 80,
      maxHealth: 80,
      attack: 14,
      defense: 6,
      speed: 6,
      detectionRadius: 120,
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
      position: { x: 2600, y: 3000 }, // Near the large lake
      patrolCenter: { x: 2600, y: 3000 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/2062324/pexels-photo-2062324.jpeg?auto=compress&cs=tinysrgb&w=64',
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
    currentTime: 12, // Noon
    dayLength: 300, // 5 minutes real time = 24 hours game time
    lightLevel: 1.0
  },
  
  weather: {
    type: 'clear',
    intensity: 0
  }
};