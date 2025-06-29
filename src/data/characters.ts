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
    portrait: '/ninja copy.png',
    sprite: '/ninja copy.png',
    animations: {
      idle: '/ninja copy.png',
      walk: '/ninja copy.png',
      attack: '/ninja copy.png',
      block: '/ninja copy.png',
      hurt: '/ninja copy.png'
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
    attack: 18,
    defense: 12,
    speed: 6,
    unlocked: false,
    price: 800,
    moveSet: [
      {
        id: 'heavy-slam',
        name: 'Ground Slam',
        type: 'special',
        damage: 40,
        staminaCost: 40,
        cooldown: 6,
        currentCooldown: 0,
        range: 50,
        description: 'Devastating area attack that shakes the ground',
        animation: 'slam'
      },
      {
        id: 'power-punch',
        name: 'Crusher Punch',
        type: 'basic-attack',
        damage: 25,
        staminaCost: 20,
        cooldown: 0,
        currentCooldown: 0,
        range: 30,
        description: 'Bone-crushing punch with devastating force',
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
        description: 'Reduces damage by 75% with unbreakable defense',
        animation: 'heavy-block'
      },
      {
        id: 'berserker-rage',
        name: 'Berserker Rage',
        type: 'special',
        damage: 30,
        staminaCost: 35,
        cooldown: 8,
        currentCooldown: 0,
        range: 40,
        description: 'Unleashes crushing fury on all nearby enemies',
        animation: 'rage'
      },
      {
        id: 'earthquake-stomp',
        name: 'Earthquake Stomp',
        type: 'special',
        damage: 35,
        staminaCost: 45,
        cooldown: 10,
        currentCooldown: 0,
        range: 60,
        description: 'Stomps the ground creating devastating shockwaves',
        animation: 'stomp'
      }
    ],
    portrait: '/MAGNUS THE CRUSHER.png',
    sprite: '/MAGNUS THE CRUSHER.png',
    animations: {
      idle: '/MAGNUS THE CRUSHER.png',
      walk: '/MAGNUS THE CRUSHER.png',
      attack: '/MAGNUS THE CRUSHER.png',
      block: '/MAGNUS THE CRUSHER.png',
      hurt: '/MAGNUS THE CRUSHER.png'
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
      },
      {
        id: 'guardian-charge',
        name: 'Guardian Charge',
        type: 'special',
        damage: 18,
        staminaCost: 30,
        cooldown: 5,
        currentCooldown: 0,
        range: 50,
        description: 'Charges forward with shield raised',
        animation: 'charge'
      }
    ],
    portrait: '/ARIA THE GUARDIAN.png',
    sprite: '/ARIA THE GUARDIAN.png',
    animations: {
      idle: '/ARIA THE GUARDIAN.png',
      walk: '/ARIA THE GUARDIAN.png',
      attack: '/ARIA THE GUARDIAN.png',
      block: '/ARIA THE GUARDIAN.png',
      hurt: '/ARIA THE GUARDIAN.png'
    }
  },
  // UPDATED Founder Character - INCREASED ATTACK TO 40
  {
    id: 'founder',
    name: 'The Founder',
    class: 'founder',
    level: 1,
    health: 400,
    maxHealth: 400,
    experience: 0,
    experienceToNextLevel: 100,
    attack: 40, // INCREASED FROM 20 TO 40
    defense: 15,
    speed: 10,
    unlocked: false,
    price: 999, // High price since it's premium
    moveSet: [
      {
        id: 'founder-strike',
        name: 'Founder\'s Strike',
        type: 'basic-attack',
        damage: 45, // Increased to match new attack
        staminaCost: 15,
        cooldown: 0,
        currentCooldown: 0,
        range: 40,
        description: 'A powerful strike befitting a founder',
        animation: 'founder-strike'
      },
      {
        id: 'scepter-blast',
        name: 'Scepter Blast',
        type: 'special',
        damage: 70, // Increased to match new attack
        staminaCost: 30,
        cooldown: 5,
        currentCooldown: 0,
        range: 60,
        description: 'Unleashes the power of the Founder\'s Scepterblade',
        animation: 'scepter-blast'
      },
      {
        id: 'founder-guard',
        name: 'Founder\'s Guard',
        type: 'block',
        damage: 0,
        staminaCost: 10,
        cooldown: 0,
        currentCooldown: 0,
        range: 0,
        description: 'Legendary defensive stance',
        animation: 'founder-guard'
      },
      {
        id: 'royal-dash',
        name: 'Royal Dash',
        type: 'special',
        damage: 50, // Increased to match new attack
        staminaCost: 25,
        cooldown: 3,
        currentCooldown: 0,
        range: 80,
        description: 'Swift movement with devastating impact',
        animation: 'royal-dash'
      }
    ],
    portrait: "/Founder's glory bundle.png",
    sprite: "/Founder's glory bundle.png",
    animations: {
      idle: "/Founder's glory bundle.png",
      walk: "/Founder's glory bundle.png",
      attack: "/Founder's glory bundle.png",
      block: "/Founder's glory bundle.png",
      hurt: "/Founder's glory bundle.png"
    }
  },
  // UPDATED Mystic Alchemist Character - INCREASED HEALTH TO 400 AND ATTACK TO 30
  {
    id: 'mystic-alchemist',
    name: 'Mystic Alchemist',
    class: 'mystic-alchemist',
    level: 1,
    health: 400, // INCREASED FROM 90 TO 400
    maxHealth: 400, // INCREASED FROM 90 TO 400
    experience: 0,
    experienceToNextLevel: 100,
    attack: 30, // INCREASED FROM 12 TO 30
    defense: 8,
    speed: 9,
    unlocked: false,
    price: 999, // High price since it's premium
    moveSet: [
      {
        id: 'vial-throw',
        name: 'Vial Throw',
        type: 'basic-attack',
        damage: 35, // Increased to match new attack
        staminaCost: 12,
        cooldown: 0,
        currentCooldown: 0,
        range: 45,
        description: 'Throws explosive alchemical vials',
        animation: 'vial-throw'
      },
      {
        id: 'poison-cloud',
        name: 'Poison Cloud',
        type: 'special',
        damage: 45, // Increased to match new attack
        staminaCost: 25,
        cooldown: 4,
        currentCooldown: 0,
        range: 60,
        description: 'Creates a toxic cloud that damages enemies over time',
        animation: 'poison-cloud'
      },
      {
        id: 'healing-mist',
        name: 'Healing Mist',
        type: 'special',
        damage: 0,
        staminaCost: 20,
        cooldown: 6,
        currentCooldown: 0,
        range: 0,
        description: 'Restores health with alchemical magic',
        animation: 'healing-mist'
      },
      {
        id: 'staff-strike',
        name: 'Vialborne Staff Strike',
        type: 'basic-attack',
        damage: 40, // Increased to match new attack
        staminaCost: 18,
        cooldown: 0,
        currentCooldown: 0,
        range: 35,
        description: 'Powerful strike with the legendary Vialborne Staff',
        animation: 'staff-strike'
      }
    ],
    portrait: "/MYSTIC ALCHEMIST BUNDLE.PNG",
    sprite: "/MYSTIC ALCHEMIST BUNDLE.PNG",
    animations: {
      idle: "/MYSTIC ALCHEMIST BUNDLE.PNG",
      walk: "/MYSTIC ALCHEMIST BUNDLE.PNG",
      attack: "/MYSTIC ALCHEMIST BUNDLE.PNG",
      block: "/MYSTIC ALCHEMIST BUNDLE.PNG",
      hurt: "/MYSTIC ALCHEMIST BUNDLE.PNG"
    }
  }
];