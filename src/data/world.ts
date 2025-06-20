import { GameWorld, Enemy, Building, WaterBody, NPC, Item } from '../types/game';

export const gameWorld: GameWorld = {
  id: 'main-world',
  name: 'Realm of Fighters',
  size: { width: 3000, height: 3000 }, // Scaled up 150% from 2000x2000
  terrain: [], // Will be generated procedurally
  spawnPoint: { x: 1500, y: 1500 }, // Centered in scaled map
  
  buildings: [
    // Central Village Buildings (scaled positions)
    {
      id: 'player-house',
      name: 'Your House',
      type: 'house',
      position: { x: 1425, y: 1425 }, // Scaled from 950,950
      size: { width: 120, height: 90 }, // Scaled from 80x60
      enterable: true,
      sprite: '🏠',
      interior: {
        background: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        npcs: [],
        items: [
          {
            id: 'health-potion',
            name: 'Health Potion',
            type: 'consumable',
            rarity: 'common',
            value: 50,
            effect: { type: 'heal', value: 30 },
            icon: '🧪',
            description: 'Restores 30 health points'
          }
        ],
        exits: [{ x: 60, y: 90, leadsTo: 'main-world' }]
      }
    },
    {
      id: 'weapon-shop',
      name: 'Weapon Shop',
      type: 'shop',
      position: { x: 1200, y: 1800 }, // Scaled from 800,1200
      size: { width: 150, height: 120 }, // Scaled from 100x80
      enterable: true,
      sprite: '⚔️',
      interior: {
        background: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        npcs: [
          {
            id: 'weapon-merchant',
            name: 'Gareth the Blacksmith',
            type: 'merchant',
            position: { x: 75, y: 60 },
            dialogue: ['Welcome to my shop!', 'I have the finest weapons in the realm.'],
            sprite: '👨‍🔧',
            shop: {
              items: [
                {
                  id: 'iron-sword',
                  name: 'Iron Sword',
                  type: 'weapon',
                  rarity: 'common',
                  value: 100,
                  effect: { type: 'boost-attack', value: 5 },
                  icon: '⚔️',
                  description: 'A sturdy iron blade'
                }
              ],
              currency: 1000
            }
          }
        ],
        items: [],
        exits: [{ x: 75, y: 120, leadsTo: 'main-world' }]
      }
    },
    {
      id: 'training-dojo',
      name: 'Training Dojo',
      type: 'temple',
      position: { x: 1800, y: 1200 }, // Scaled from 1200,800
      size: { width: 180, height: 150 }, // Scaled from 120x100
      enterable: true,
      sprite: '🏛️',
      interior: {
        background: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        npcs: [
          {
            id: 'master-trainer',
            name: 'Master Chen',
            type: 'trainer',
            position: { x: 90, y: 75 },
            dialogue: ['Train hard, young warrior.', 'Strength comes from within.'],
            sprite: '🥋'
          }
        ],
        items: [],
        exits: [{ x: 90, y: 150, leadsTo: 'main-world' }]
      }
    },
    // Forest Area Buildings (scaled positions)
    {
      id: 'forest-cabin',
      name: 'Hermit\'s Cabin',
      type: 'house',
      position: { x: 450, y: 600 }, // Scaled from 300,400
      size: { width: 105, height: 75 }, // Scaled from 70x50
      enterable: true,
      sprite: '🛖',
      interior: {
        background: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        npcs: [],
        items: [],
        exits: [{ x: 52, y: 75, leadsTo: 'main-world' }]
      }
    },
    {
      id: 'forest-watchtower',
      name: 'Forest Watchtower',
      type: 'dungeon',
      position: { x: 300, y: 900 },
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
    // Desert Area Buildings (scaled positions)
    {
      id: 'desert-outpost',
      name: 'Desert Outpost',
      type: 'inn',
      position: { x: 1350, y: 2100 }, // Scaled from 900,1400
      size: { width: 135, height: 105 }, // Scaled from 90x70
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
      position: { x: 2400, y: 2250 }, // Scaled from 1600,1500
      size: { width: 90, height: 120 }, // Scaled from 60x80
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
    {
      id: 'fishing-hut',
      name: 'Fishing Hut',
      type: 'house',
      position: { x: 300, y: 1500 },
      size: { width: 90, height: 60 },
      enterable: true,
      sprite: '🛖',
      interior: {
        background: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        npcs: [],
        items: [],
        exits: [{ x: 45, y: 60, leadsTo: 'main-world' }]
      }
    }
  ],
  
  waterBodies: [
    // Central Lake (scaled)
    {
      id: 'central-lake',
      type: 'lake',
      position: { x: 900, y: 900 }, // Scaled from 600,600
      size: { width: 300, height: 225 }, // Scaled from 200x150
      swimmable: true,
      currentStrength: 0.5
    },
    // Northern River (scaled)
    {
      id: 'northern-river',
      type: 'river',
      position: { x: 600, y: 300 }, // Scaled from 400,200
      size: { width: 450, height: 60 }, // Scaled from 300x40
      swimmable: true,
      currentStrength: 1.0
    },
    // Eastern Pond (scaled)
    {
      id: 'eastern-pond',
      type: 'pond',
      position: { x: 2100, y: 1200 }, // Scaled from 1400,800
      size: { width: 180, height: 150 }, // Scaled from 120x100
      swimmable: true,
      currentStrength: 0.3
    },
    // Western Coast (scaled)
    {
      id: 'western-coast',
      type: 'ocean',
      position: { x: 75, y: 600 }, // Scaled from 50,400
      size: { width: 150, height: 1200 }, // Scaled from 100x800
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
    // Forest Area Enemies (50% more enemies - original + additional)
    {
      id: 'forest-bandit-1',
      name: 'Forest Bandit',
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
          id: 'bandit-coin',
          name: 'Stolen Coin',
          type: 'material',
          rarity: 'common',
          value: 10,
          icon: '🪙',
          description: 'A coin stolen by bandits'
        }
      ],
      position: { x: 375, y: 525 }, // Scaled from 250,350
      patrolCenter: { x: 375, y: 525 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7772716/pexels-photo-7772716.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'easy',
      moveSet: [
        {
          id: 'bandit-slash',
          name: 'Rusty Blade',
          type: 'basic-attack',
          damage: 12,
          staminaCost: 10,
          cooldown: 0,
          currentCooldown: 0,
          range: 30,
          description: 'A crude sword attack',
          animation: 'slash'
        }
      ]
    },
    {
      id: 'forest-bandit-2',
      name: 'Forest Bandit',
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
          id: 'bandit-coin',
          name: 'Stolen Coin',
          type: 'material',
          rarity: 'common',
          value: 10,
          icon: '🪙',
          description: 'A coin stolen by bandits'
        }
      ],
      position: { x: 600, y: 750 },
      patrolCenter: { x: 600, y: 750 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7772716/pexels-photo-7772716.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'easy',
      moveSet: [
        {
          id: 'bandit-slash',
          name: 'Rusty Blade',
          type: 'basic-attack',
          damage: 12,
          staminaCost: 10,
          cooldown: 0,
          currentCooldown: 0,
          range: 30,
          description: 'A crude sword attack',
          animation: 'slash'
        }
      ]
    },
    {
      id: 'forest-bandit-3',
      name: 'Forest Bandit Leader',
      type: 'aggressive',
      health: 80,
      maxHealth: 80,
      attack: 12,
      defense: 6,
      speed: 5,
      detectionRadius: 100,
      patrolRadius: 80,
      experience: 40,
      loot: [
        {
          id: 'bandit-sword',
          name: 'Bandit Sword',
          type: 'weapon',
          rarity: 'uncommon',
          value: 75,
          effect: { type: 'boost-attack', value: 6 },
          icon: '⚔️',
          description: 'A well-maintained bandit blade'
        }
      ],
      position: { x: 450, y: 900 },
      patrolCenter: { x: 450, y: 900 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7772716/pexels-photo-7772716.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'medium',
      moveSet: [
        {
          id: 'bandit-slash',
          name: 'Rusty Blade',
          type: 'basic-attack',
          damage: 16,
          staminaCost: 15,
          cooldown: 0,
          currentCooldown: 0,
          range: 35,
          description: 'A skilled sword attack',
          animation: 'slash'
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
      position: { x: 525, y: 675 }, // Scaled from 350,450
      patrolCenter: { x: 525, y: 675 },
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
    {
      id: 'forest-wolf-2',
      name: 'Alpha Wolf',
      type: 'aggressive',
      health: 60,
      maxHealth: 60,
      attack: 14,
      defense: 4,
      speed: 7,
      detectionRadius: 120,
      patrolRadius: 180,
      experience: 35,
      loot: [
        {
          id: 'alpha-pelt',
          name: 'Alpha Wolf Pelt',
          type: 'material',
          rarity: 'uncommon',
          value: 30,
          icon: '🐺',
          description: 'Rare pelt from an alpha wolf'
        }
      ],
      position: { x: 300, y: 600 },
      patrolCenter: { x: 300, y: 600 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/2062324/pexels-photo-2062324.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'medium',
      moveSet: [
        {
          id: 'wolf-bite',
          name: 'Savage Bite',
          type: 'basic-attack',
          damage: 18,
          staminaCost: 20,
          cooldown: 0,
          currentCooldown: 0,
          range: 30,
          description: 'A powerful alpha bite',
          animation: 'bite'
        }
      ]
    },
    {
      id: 'forest-bear',
      name: 'Forest Bear',
      type: 'aggressive',
      health: 100,
      maxHealth: 100,
      attack: 16,
      defense: 8,
      speed: 4,
      detectionRadius: 90,
      patrolRadius: 120,
      experience: 50,
      loot: [
        {
          id: 'bear-claw',
          name: 'Bear Claw',
          type: 'material',
          rarity: 'rare',
          value: 50,
          icon: '🐻',
          description: 'Sharp claw from a forest bear'
        }
      ],
      position: { x: 750, y: 450 },
      patrolCenter: { x: 750, y: 450 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7991139/pexels-photo-7991139.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'hard',
      moveSet: [
        {
          id: 'bear-swipe',
          name: 'Claw Swipe',
          type: 'basic-attack',
          damage: 20,
          staminaCost: 25,
          cooldown: 0,
          currentCooldown: 0,
          range: 35,
          description: 'A powerful claw attack',
          animation: 'swipe'
        }
      ]
    },

    // Desert Area Enemies (50% more)
    {
      id: 'desert-scorpion-1',
      name: 'Giant Scorpion',
      type: 'aggressive',
      health: 80,
      maxHealth: 80,
      attack: 12,
      defense: 6,
      speed: 5,
      detectionRadius: 90,
      patrolRadius: 120,
      experience: 35,
      loot: [
        {
          id: 'scorpion-stinger',
          name: 'Scorpion Stinger',
          type: 'material',
          rarity: 'uncommon',
          value: 25,
          icon: '🦂',
          description: 'A venomous stinger'
        }
      ],
      position: { x: 1275, y: 1950 }, // Scaled from 850,1300
      patrolCenter: { x: 1275, y: 1950 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7991139/pexels-photo-7991139.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'medium',
      moveSet: [
        {
          id: 'scorpion-sting',
          name: 'Poison Sting',
          type: 'basic-attack',
          damage: 16,
          staminaCost: 20,
          cooldown: 0,
          currentCooldown: 0,
          range: 30,
          description: 'A poisonous sting attack',
          animation: 'sting'
        }
      ]
    },
    {
      id: 'desert-scorpion-2',
      name: 'Desert Scorpion',
      type: 'aggressive',
      health: 70,
      maxHealth: 70,
      attack: 10,
      defense: 5,
      speed: 5,
      detectionRadius: 85,
      patrolRadius: 110,
      experience: 30,
      loot: [
        {
          id: 'scorpion-stinger',
          name: 'Scorpion Stinger',
          type: 'material',
          rarity: 'uncommon',
          value: 25,
          icon: '🦂',
          description: 'A venomous stinger'
        }
      ],
      position: { x: 1800, y: 2100 },
      patrolCenter: { x: 1800, y: 2100 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7991139/pexels-photo-7991139.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'medium',
      moveSet: [
        {
          id: 'scorpion-sting',
          name: 'Poison Sting',
          type: 'basic-attack',
          damage: 14,
          staminaCost: 18,
          cooldown: 0,
          currentCooldown: 0,
          range: 28,
          description: 'A poisonous sting attack',
          animation: 'sting'
        }
      ]
    },
    {
      id: 'desert-raider',
      name: 'Desert Raider',
      type: 'patrol',
      health: 90,
      maxHealth: 90,
      attack: 14,
      defense: 7,
      speed: 6,
      detectionRadius: 100,
      patrolRadius: 140,
      experience: 40,
      loot: [
        {
          id: 'desert-scimitar',
          name: 'Desert Scimitar',
          type: 'weapon',
          rarity: 'uncommon',
          value: 85,
          effect: { type: 'boost-attack', value: 7 },
          icon: '🗡️',
          description: 'A curved desert blade'
        }
      ],
      position: { x: 2250, y: 2400 },
      patrolCenter: { x: 2250, y: 2400 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7772716/pexels-photo-7772716.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'medium',
      moveSet: [
        {
          id: 'scimitar-slash',
          name: 'Scimitar Slash',
          type: 'basic-attack',
          damage: 18,
          staminaCost: 22,
          cooldown: 0,
          currentCooldown: 0,
          range: 32,
          description: 'A swift curved blade attack',
          animation: 'slash'
        }
      ]
    },
    {
      id: 'sand-elemental',
      name: 'Sand Elemental',
      type: 'aggressive',
      health: 120,
      maxHealth: 120,
      attack: 16,
      defense: 10,
      speed: 3,
      detectionRadius: 80,
      patrolRadius: 100,
      experience: 60,
      loot: [
        {
          id: 'sand-crystal',
          name: 'Sand Crystal',
          type: 'material',
          rarity: 'rare',
          value: 60,
          icon: '💎',
          description: 'A crystallized essence of sand'
        }
      ],
      position: { x: 1950, y: 2700 },
      patrolCenter: { x: 1950, y: 2700 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7991139/pexels-photo-7991139.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'hard',
      moveSet: [
        {
          id: 'sand-blast',
          name: 'Sand Blast',
          type: 'basic-attack',
          damage: 22,
          staminaCost: 30,
          cooldown: 0,
          currentCooldown: 0,
          range: 40,
          description: 'A powerful sand attack',
          animation: 'blast'
        }
      ]
    },

    // Mountain Area Enemies (50% more)
    {
      id: 'mountain-orc-1',
      name: 'Mountain Orc',
      type: 'aggressive',
      health: 120,
      maxHealth: 120,
      attack: 18,
      defense: 10,
      speed: 3,
      detectionRadius: 110,
      patrolRadius: 80,
      experience: 60,
      loot: [
        {
          id: 'orc-axe',
          name: 'Crude Axe',
          type: 'weapon',
          rarity: 'uncommon',
          value: 75,
          effect: { type: 'boost-attack', value: 8 },
          icon: '🪓',
          description: 'A heavy orcish battle axe'
        }
      ],
      position: { x: 2325, y: 2175 }, // Scaled from 1550,1450
      patrolCenter: { x: 2325, y: 2175 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7991139/pexels-photo-7991139.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'hard',
      moveSet: [
        {
          id: 'orc-chop',
          name: 'Axe Chop',
          type: 'basic-attack',
          damage: 22,
          staminaCost: 25,
          cooldown: 0,
          currentCooldown: 0,
          range: 35,
          description: 'A powerful axe strike',
          animation: 'chop'
        }
      ]
    },
    {
      id: 'mountain-orc-2',
      name: 'Orc Warrior',
      type: 'aggressive',
      health: 140,
      maxHealth: 140,
      attack: 20,
      defense: 12,
      speed: 3,
      detectionRadius: 120,
      patrolRadius: 90,
      experience: 70,
      loot: [
        {
          id: 'orc-hammer',
          name: 'War Hammer',
          type: 'weapon',
          rarity: 'rare',
          value: 120,
          effect: { type: 'boost-attack', value: 12 },
          icon: '🔨',
          description: 'A massive orcish war hammer'
        }
      ],
      position: { x: 2700, y: 1950 },
      patrolCenter: { x: 2700, y: 1950 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7991139/pexels-photo-7991139.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'hard',
      moveSet: [
        {
          id: 'hammer-smash',
          name: 'Hammer Smash',
          type: 'basic-attack',
          damage: 26,
          staminaCost: 30,
          cooldown: 0,
          currentCooldown: 0,
          range: 38,
          description: 'A devastating hammer blow',
          animation: 'smash'
        }
      ]
    },
    {
      id: 'mountain-troll',
      name: 'Mountain Troll',
      type: 'aggressive',
      health: 200,
      maxHealth: 200,
      attack: 25,
      defense: 15,
      speed: 2,
      detectionRadius: 100,
      patrolRadius: 60,
      experience: 100,
      loot: [
        {
          id: 'troll-club',
          name: 'Troll Club',
          type: 'weapon',
          rarity: 'epic',
          value: 200,
          effect: { type: 'boost-attack', value: 15 },
          icon: '🏏',
          description: 'A massive troll war club'
        }
      ],
      position: { x: 2550, y: 1650 },
      patrolCenter: { x: 2550, y: 1650 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7991139/pexels-photo-7991139.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'hard',
      moveSet: [
        {
          id: 'troll-smash',
          name: 'Ground Smash',
          type: 'basic-attack',
          damage: 30,
          staminaCost: 35,
          cooldown: 0,
          currentCooldown: 0,
          range: 45,
          description: 'A earth-shaking attack',
          animation: 'ground-smash'
        }
      ]
    },
    {
      id: 'stone-golem',
      name: 'Stone Golem',
      type: 'defensive',
      health: 180,
      maxHealth: 180,
      attack: 22,
      defense: 18,
      speed: 2,
      detectionRadius: 80,
      patrolRadius: 50,
      experience: 80,
      loot: [
        {
          id: 'stone-core',
          name: 'Stone Core',
          type: 'material',
          rarity: 'rare',
          value: 80,
          icon: '🪨',
          description: 'The magical core of a stone golem'
        }
      ],
      position: { x: 2400, y: 1800 },
      patrolCenter: { x: 2400, y: 1800 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7991139/pexels-photo-7991139.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'hard',
      moveSet: [
        {
          id: 'stone-punch',
          name: 'Stone Fist',
          type: 'basic-attack',
          damage: 24,
          staminaCost: 28,
          cooldown: 0,
          currentCooldown: 0,
          range: 30,
          description: 'A crushing stone fist',
          animation: 'punch'
        }
      ]
    },

    // Central Plains Enemies (50% more)
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
      position: { x: 1650, y: 1650 }, // Scaled from 1100,1100
      patrolCenter: { x: 1650, y: 1650 },
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
      position: { x: 1200, y: 1350 },
      patrolCenter: { x: 1200, y: 1350 },
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
    {
      id: 'plains-goblin-3',
      name: 'Goblin Shaman',
      type: 'aggressive',
      health: 65,
      maxHealth: 65,
      attack: 11,
      defense: 5,
      speed: 5,
      detectionRadius: 90,
      patrolRadius: 100,
      experience: 35,
      loot: [
        {
          id: 'goblin-staff',
          name: 'Shaman Staff',
          type: 'weapon',
          rarity: 'uncommon',
          value: 70,
          effect: { type: 'boost-attack', value: 6 },
          icon: '🪄',
          description: 'A magical goblin staff'
        }
      ],
      position: { x: 1800, y: 1200 },
      patrolCenter: { x: 1800, y: 1200 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7772716/pexels-photo-7772716.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'medium',
      moveSet: [
        {
          id: 'magic-bolt',
          name: 'Magic Bolt',
          type: 'basic-attack',
          damage: 14,
          staminaCost: 15,
          cooldown: 0,
          currentCooldown: 0,
          range: 40,
          description: 'A magical energy bolt',
          animation: 'bolt'
        }
      ]
    },

    // Coastal Area Enemies (new area)
    {
      id: 'sea-raider',
      name: 'Sea Raider',
      type: 'patrol',
      health: 75,
      maxHealth: 75,
      attack: 11,
      defense: 6,
      speed: 5,
      detectionRadius: 85,
      patrolRadius: 110,
      experience: 30,
      loot: [
        {
          id: 'cutlass',
          name: 'Cutlass',
          type: 'weapon',
          rarity: 'uncommon',
          value: 65,
          effect: { type: 'boost-attack', value: 5 },
          icon: '⚔️',
          description: 'A curved pirate blade'
        }
      ],
      position: { x: 450, y: 1200 },
      patrolCenter: { x: 450, y: 1200 },
      state: 'patrol',
      lastAction: 0,
      sprite: 'https://images.pexels.com/photos/7772716/pexels-photo-7772716.jpeg?auto=compress&cs=tinysrgb&w=64',
      aiDifficulty: 'medium',
      moveSet: [
        {
          id: 'cutlass-slash',
          name: 'Cutlass Slash',
          type: 'basic-attack',
          damage: 15,
          staminaCost: 18,
          cooldown: 0,
          currentCooldown: 0,
          range: 30,
          description: 'A swift cutlass attack',
          animation: 'slash'
        }
      ]
    },
    {
      id: 'sea-serpent',
      name: 'Sea Serpent',
      type: 'aggressive',
      health: 110,
      maxHealth: 110,
      attack: 15,
      defense: 8,
      speed: 6,
      detectionRadius: 100,
      patrolRadius: 80,
      experience: 55,
      loot: [
        {
          id: 'serpent-scale',
          name: 'Serpent Scale',
          type: 'material',
          rarity: 'rare',
          value: 45,
          icon: '🐍',
          description: 'A shimmering sea serpent scale'
        }
      ],
      position: { x: 300, y: 1800 },
      patrolCenter: { x: 300, y: 1800 },
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
    {
      id: 'village-elder',
      name: 'Elder Wisdom',
      type: 'quest-giver',
      position: { x: 1575, y: 1575 }, // Scaled from 1050,1050
      dialogue: [
        'Welcome, young fighter.',
        'The realm is in danger from growing darkness.',
        'Train well and become strong.'
      ],
      sprite: '🧙‍♂️'
    },
    {
      id: 'forest-ranger',
      name: 'Ranger Finn',
      type: 'quest-giver',
      position: { x: 420, y: 480 }, // Scaled from 280,320
      dialogue: [
        'The forest has been restless lately.',
        'Strange creatures roam these paths.',
        'Be careful, traveler.'
      ],
      sprite: '🏹'
    },
    {
      id: 'desert-nomad',
      name: 'Nomad Zara',
      type: 'merchant',
      position: { x: 1425, y: 2025 }, // Scaled from 950,1350
      dialogue: [
        'The desert holds many secrets.',
        'I have supplies for brave adventurers.',
        'Water is life in these lands.'
      ],
      sprite: '🧕',
      shop: {
        items: [
          {
            id: 'desert-water',
            name: 'Desert Water',
            type: 'consumable',
            rarity: 'common',
            value: 20,
            effect: { type: 'heal', value: 25 },
            icon: '💧',
            description: 'Refreshing desert spring water'
          }
        ],
        currency: 500
      }
    },
    {
      id: 'mountain-hermit',
      name: 'Hermit Sage',
      type: 'trainer',
      position: { x: 2250, y: 1950 },
      dialogue: [
        'The mountains hold ancient wisdom.',
        'Only the strong survive these peaks.',
        'Seek knowledge, young one.'
      ],
      sprite: '🧙‍♂️'
    },
    {
      id: 'coastal-fisherman',
      name: 'Old Fisherman',
      type: 'quest-giver',
      position: { x: 375, y: 1350 },
      dialogue: [
        'The seas have been rough lately.',
        'Strange creatures emerge from the depths.',
        'The lighthouse keeper might know more.'
      ],
      sprite: '🎣'
    },
    {
      id: 'lighthouse-keeper',
      name: 'Keeper Magnus',
      type: 'quest-giver',
      position: { x: 225, y: 1125 },
      dialogue: [
        'I watch over these waters.',
        'Many ships have been lost recently.',
        'The sea holds dark secrets.'
      ],
      sprite: '👨‍🦳'
    }
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