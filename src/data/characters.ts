import { Character } from '../types/game';

export const characters: Character[] = [
  {
    id: 'balanced-fighter',
    name: 'Ninja',
    class: 'balanced-fighter',
    level: 1,
    health: 50,
    maxHealth: 50,
    experience: 0,
    experienceToNextLevel: 100,
    attack: 10,
    defense: 8,
    speed: 12,
    unlocked: true,
    moveSet: [
      {
        id: 'basic-punch',
        name: 'Basic Punch',
        type: 'basic-attack',
        damage: 12,
        staminaCost: 10,
        cooldown: 0,
        currentCooldown: 0,
        range: 30,
        description: 'A quick jab that can start combos',
        animation: 'punch',
        comboChain: ['basic-kick', 'uppercut']
      },
      {
        id: 'shuriken-throw',
        name: 'Shuriken Throw',
        type: 'special',
        damage: 10,
        staminaCost: 15,
        cooldown: 2,
        currentCooldown: 0,
        range: 150,
        description: 'Throws a shuriken at enemies',
        animation: 'throw'
      },
      {
        id: 'basic-kick',
        name: 'Basic Kick',
        type: 'basic-attack',
        damage: 15,
        staminaCost: 15,
        cooldown: 0,
        currentCooldown: 0,
        range: 35,
        description: 'A powerful kick with good range',
        animation: 'kick'
      },
      {
        id: 'block',
        name: 'Block',
        type: 'block',
        damage: 0,
        staminaCost: 5,
        cooldown: 0,
        currentCooldown: 0,
        range: 0,
        description: 'Reduces incoming damage by 50%',
        animation: 'block'
      },
      {
        id: 'dodge-roll',
        name: 'Dodge Roll',
        type: 'dodge',
        damage: 0,
        staminaCost: 20,
        cooldown: 2,
        currentCooldown: 0,
        range: 0,
        description: 'Quick evasive maneuver',
        animation: 'dodge'
      },
      {
        id: 'uppercut',
        name: 'Rising Uppercut',
        type: 'special',
        damage: 25,
        staminaCost: 30,
        cooldown: 5,
        currentCooldown: 0,
        range: 25,
        description: 'Powerful upward strike',
        animation: 'uppercut'
      }
    ],
    portrait: '/ninja.png',
    sprite: '/ninja.png',
    animations: {
      idle: '/ninja.png',
      walk: '/ninja.png',
      attack: '/ninja.png',
      block: '/ninja.png',
      hurt: '/ninja.png'
    }
  },
  {
    id: 'speed-demon',
    name: 'Knight',
    class: 'speed-demon',
    level: 1,
    health: 80,
    maxHealth: 80,
    experience: 0,
    experienceToNextLevel: 100,
    attack: 8,
    defense: 6,
    speed: 14,
    unlocked: false,
    price: 500,
    moveSet: [
      {
        id: 'rapid-strikes',
        name: 'Rapid Strikes',
        type: 'combo',
        damage: 8,
        staminaCost: 15,
        cooldown: 0,
        currentCooldown: 0,
        range: 25,
        description: 'Fast multi-hit combo',
        animation: 'rapid-punch',
        comboChain: ['spinning-kick']
      },
      {
        id: 'dash-attack',
        name: 'Dash Attack',
        type: 'special',
        damage: 18,
        staminaCost: 25,
        cooldown: 3,
        currentCooldown: 0,
        range: 60,
        description: 'Quick dash with strike',
        animation: 'dash'
      },
      {
        id: 'evasion',
        name: 'Shadow Step',
        type: 'dodge',
        damage: 0,
        staminaCost: 15,
        cooldown: 1,
        currentCooldown: 0,
        range: 0,
        description: 'Instant teleport dodge',
        animation: 'shadow-step'
      }
    ],
    portrait: '/knight.png',
    sprite: '/knight.png',
    animations: {
      idle: '/knight.png',
      walk: '/knight.png',
      attack: '/knight.png',
      block: '/knight.png',
      hurt: '/knight.png'
    }
  },
  {
    id: 'heavy-hitter',
    name: 'Magnus the Crusher',
    class: 'heavy-hitter',
    level: 1,
    health: 150,
    maxHealth: 150,
    experience: 0,
    experienceToNextLevel: 100,
    attack: 15,
    defense: 12,
    speed: 6,
    unlocked: false,
    price: 800,
    moveSet: [
      {
        id: 'heavy-slam',
        name: 'Ground Slam',
        type: 'special',
        damage: 35,
        staminaCost: 40,
        cooldown: 6,
        currentCooldown: 0,
        range: 50,
        description: 'Devastating area attack',
        animation: 'slam'
      },
      {
        id: 'power-punch',
        name: 'Power Punch',
        type: 'basic-attack',
        damage: 20,
        staminaCost: 20,
        cooldown: 0,
        currentCooldown: 0,
        range: 30,
        description: 'Slow but powerful strike',
        animation: 'heavy-punch'
      },
      {
        id: 'iron-guard',
        name: 'Iron Guard',
        type: 'block',
        damage: 0,
        staminaCost: 10,
        cooldown: 0,
        currentCooldown: 0,
        range: 0,
        description: 'Reduces damage by 75%',
        animation: 'heavy-block'
      }
    ],
    portrait: 'https://images.pexels.com/photos/6633084/pexels-photo-6633084.jpeg?auto=compress&cs=tinysrgb&w=128',
    sprite: 'https://images.pexels.com/photos/6633084/pexels-photo-6633084.jpeg?auto=compress&cs=tinysrgb&w=64',
    animations: {
      idle: 'https://images.pexels.com/photos/6633084/pexels-photo-6633084.jpeg?auto=compress&cs=tinysrgb&w=64',
      walk: 'https://images.pexels.com/photos/6633084/pexels-photo-6633084.jpeg?auto=compress&cs=tinysrgb&w=64',
      attack: 'https://images.pexels.com/photos/6633084/pexels-photo-6633084.jpeg?auto=compress&cs=tinysrgb&w=64',
      block: 'https://images.pexels.com/photos/6633084/pexels-photo-6633084.jpeg?auto=compress&cs=tinysrgb&w=64',
      hurt: 'https://images.pexels.com/photos/6633084/pexels-photo-6633084.jpeg?auto=compress&cs=tinysrgb&w=64'
    }
  },
  {
    id: 'defensive-tank',
    name: 'Aria the Guardian',
    class: 'defensive-tank',
    level: 1,
    health: 120,
    maxHealth: 120,
    experience: 0,
    experienceToNextLevel: 100,
    attack: 9,
    defense: 15,
    speed: 7,
    unlocked: false,
    price: 600,
    moveSet: [
      {
        id: 'shield-bash',
        name: 'Shield Bash',
        type: 'basic-attack',
        damage: 14,
        staminaCost: 15,
        cooldown: 0,
        currentCooldown: 0,
        range: 25,
        description: 'Attack that can stun enemies',
        animation: 'shield-bash'
      },
      {
        id: 'fortress-stance',
        name: 'Fortress Stance',
        type: 'block',
        damage: 0,
        staminaCost: 5,
        cooldown: 0,
        currentCooldown: 0,
        range: 0,
        description: 'Reduces damage by 80% but cannot move',
        animation: 'fortress'
      },
      {
        id: 'counter-attack',
        name: 'Counter Strike',
        type: 'special',
        damage: 22,
        staminaCost: 25,
        cooldown: 4,
        currentCooldown: 0,
        range: 30,
        description: 'Automatic counter after blocking',
        animation: 'counter'
      }
    ],
    portrait: 'https://images.pexels.com/photos/14391128/pexels-photo-14391128.jpeg?auto=compress&cs=tinysrgb&w=128',
    sprite: 'https://images.pexels.com/photos/14391128/pexels-photo-14391128.jpeg?auto=compress&cs=tinysrgb&w=64',
    animations: {
      idle: 'https://images.pexels.com/photos/14391128/pexels-photo-14391128.jpeg?auto=compress&cs=tinysrgb&w=64',
      walk: 'https://images.pexels.com/photos/14391128/pexels-photo-14391128.jpeg?auto=compress&cs=tinysrgb&w=64',
      attack: 'https://images.pexels.com/photos/14391128/pexels-photo-14391128.jpeg?auto=compress&cs=tinysrgb&w=64',
      block: 'https://images.pexels.com/photos/14391128/pexels-photo-14391128.jpeg?auto=compress&cs=tinysrgb&w=64',
      hurt: 'https://images.pexels.com/photos/14391128/pexels-photo-14391128.jpeg?auto=compress&cs=tinysrgb&w=64'
    }
  }
];