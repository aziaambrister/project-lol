import { Enemy } from '../types/game';

// Forest Enemies
export const forestEnemies: Enemy[] = [
  {
    id: 'shadow-wolf',
    name: 'Shadow Wolf',
    health: 35,
    maxHealth: 35,
    strength: 8,
    defense: 3,
    experience: 25,
    currency: 15,
    abilities: [
      {
        id: 'shadow-bite',
        name: 'Shadow Bite',
        description: 'A vicious bite that emerges from the darkness.',
        damage: 10,
        manaCost: 0,
        unlockLevel: 1,
        cooldown: 0,
        currentCooldown: 0,
        type: 'attack'
      },
      {
        id: 'haunting-howl',
        name: 'Haunting Howl',
        description: 'A terrifying howl that chills to the bone.',
        damage: 0,
        manaCost: 5,
        unlockLevel: 1,
        cooldown: 3,
        currentCooldown: 0,
        type: 'special',
        effect: 'fear'
      }
    ],
    loot: [],
    sprite: 'https://images.pexels.com/photos/2062324/pexels-photo-2062324.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'forest-bandit',
    name: 'Forest Bandit',
    health: 30,
    maxHealth: 30,
    strength: 6,
    defense: 4,
    experience: 20,
    currency: 12,
    abilities: [
      {
        id: 'dagger-slash',
        name: 'Dagger Slash',
        description: 'A quick slash with a rusty dagger.',
        damage: 8,
        manaCost: 0,
        unlockLevel: 1,
        cooldown: 0,
        currentCooldown: 0,
        type: 'attack'
      }
    ],
    loot: [],
    sprite: 'https://images.pexels.com/photos/7772716/pexels-photo-7772716.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

// Village Enemies
export const villageEnemies: Enemy[] = [
  {
    id: 'mounted-knight',
    name: 'Mounted Knight',
    health: 50,
    maxHealth: 50,
    strength: 12,
    defense: 8,
    experience: 35,
    currency: 25,
    abilities: [
      {
        id: 'lance-charge',
        name: 'Lance Charge',
        description: 'A powerful cavalry charge with a steel lance.',
        damage: 15,
        manaCost: 0,
        unlockLevel: 1,
        cooldown: 0,
        currentCooldown: 0,
        type: 'attack'
      },
      {
        id: 'shield-bash',
        name: 'Shield Bash',
        description: 'A stunning blow with a heavy shield.',
        damage: 8,
        manaCost: 10,
        unlockLevel: 1,
        cooldown: 3,
        currentCooldown: 0,
        type: 'special',
        effect: 'stun'
      }
    ],
    loot: [],
    sprite: 'https://images.pexels.com/photos/6231816/pexels-photo-6231816.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'corrupt-guard',
    name: 'Corrupt Guard',
    health: 45,
    maxHealth: 45,
    strength: 10,
    defense: 6,
    experience: 30,
    currency: 20,
    abilities: [
      {
        id: 'sword-strike',
        name: 'Sword Strike',
        description: 'A heavy blow with a steel sword.',
        damage: 12,
        manaCost: 0,
        unlockLevel: 1,
        cooldown: 0,
        currentCooldown: 0,
        type: 'attack'
      }
    ],
    loot: [],
    sprite: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

// Cave Enemies
export const caveEnemies: Enemy[] = [
  {
    id: 'cave-zombie',
    name: 'Cave Zombie',
    health: 60,
    maxHealth: 60,
    strength: 14,
    defense: 5,
    experience: 40,
    currency: 18,
    abilities: [
      {
        id: 'rotten-claw',
        name: 'Rotten Claw',
        description: 'A diseased claw attack that may poison.',
        damage: 12,
        manaCost: 0,
        unlockLevel: 1,
        cooldown: 0,
        currentCooldown: 0,
        type: 'attack'
      },
      {
        id: 'infectious-bite',
        name: 'Infectious Bite',
        description: 'A bite that spreads decay.',
        damage: 10,
        manaCost: 8,
        unlockLevel: 1,
        cooldown: 3,
        currentCooldown: 0,
        type: 'special',
        effect: 'poison'
      }
    ],
    loot: [],
    sprite: 'https://images.pexels.com/photos/7991139/pexels-photo-7991139.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'cave-troll',
    name: 'Cave Troll',
    health: 80,
    maxHealth: 80,
    strength: 18,
    defense: 10,
    experience: 60,
    currency: 35,
    abilities: [
      {
        id: 'club-smash',
        name: 'Club Smash',
        description: 'A devastating blow with a massive club.',
        damage: 20,
        manaCost: 0,
        unlockLevel: 1,
        cooldown: 0,
        currentCooldown: 0,
        type: 'attack'
      },
      {
        id: 'ground-pound',
        name: 'Ground Pound',
        description: 'Shakes the ground with tremendous force.',
        damage: 15,
        manaCost: 15,
        unlockLevel: 1,
        cooldown: 4,
        currentCooldown: 0,
        type: 'special',
        effect: 'stun'
      }
    ],
    loot: [],
    sprite: 'https://images.pexels.com/photos/7514414/pexels-photo-7514414.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const allEnemies = [...forestEnemies, ...villageEnemies, ...caveEnemies];