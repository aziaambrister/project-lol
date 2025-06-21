import { Item } from '../types/game';

export const weapons: Item[] = [
  {
    id: 'shadow-gun',
    name: 'Shadow Gun',
    description: 'A mysterious firearm that shoots energy projectiles infused with shadow magic.',
    type: 'weapon',
    value: 100,
    rarity: 'common',
    usable: false,
    effect: {
      type: 'damage',
      value: 12
    },
    icon: '🔫'
  },
  {
    id: 'ninja-katana',
    name: 'Ninja Katana',
    description: 'A perfectly balanced blade forged in shadow.',
    type: 'weapon',
    value: 150,
    rarity: 'uncommon',
    usable: false,
    effect: {
      type: 'damage',
      value: 15
    },
    icon: '⚔️'
  },
  {
    id: 'mystic-bow',
    name: 'Mystic Bow',
    description: 'A bow infused with ancient magic.',
    type: 'weapon',
    value: 200,
    rarity: 'uncommon',
    usable: false,
    effect: {
      type: 'damage',
      value: 18
    },
    icon: '🏹'
  },
  {
    id: 'battle-staff',
    name: 'Battle Staff',
    description: 'A staff crackling with elemental power.',
    type: 'weapon',
    value: 250,
    rarity: 'rare',
    usable: false,
    effect: {
      type: 'damage',
      value: 20
    },
    icon: '🪄'
  },
  {
    id: 'plasma-cannon',
    name: 'Plasma Cannon',
    description: 'An advanced energy weapon that fires concentrated plasma bolts.',
    type: 'weapon',
    value: 400,
    rarity: 'epic',
    usable: false,
    effect: {
      type: 'damage',
      value: 25
    },
    icon: '🔫'
  },
  {
    id: 'legendary-blade',
    name: 'Legendary Blade',
    description: 'A weapon of legend, said to cut through reality itself.',
    type: 'weapon',
    value: 800,
    rarity: 'legendary',
    usable: false,
    effect: {
      type: 'damage',
      value: 35
    },
    icon: '⚔️'
  },
  // Founder's Scepterblade
  {
    id: 'founders-scepterblade',
    name: "Founder's Scepterblade",
    description: 'The legendary weapon of the founder, imbued with incredible power and prestige.',
    type: 'weapon',
    value: 1000,
    rarity: 'legendary',
    usable: false,
    effect: {
      type: 'damage',
      value: 50
    },
    icon: '⚔️'
  }
];

export const armors: Item[] = [
  {
    id: 'ninja-garb',
    name: 'Ninja Garb',
    description: 'Lightweight armor that enhances stealth and mobility.',
    type: 'armor',
    value: 80,
    rarity: 'common',
    usable: false,
    effect: {
      type: 'buff',
      value: 5
    },
    icon: '🥋'
  },
  {
    id: 'archer-cloak',
    name: 'Archer Cloak',
    description: 'A cloak that improves accuracy and mobility.',
    type: 'armor',
    value: 120,
    rarity: 'uncommon',
    usable: false,
    effect: {
      type: 'buff',
      value: 8
    },
    icon: '🧥'
  },
  {
    id: 'mage-robes',
    name: 'Mage Robes',
    description: 'Enchanted robes that amplify magical power.',
    type: 'armor',
    value: 180,
    rarity: 'rare',
    usable: false,
    effect: {
      type: 'buff',
      value: 12
    },
    icon: '👘'
  },
  {
    id: 'knight-armor',
    name: 'Knight Armor',
    description: 'Heavy plate armor that provides excellent protection.',
    type: 'armor',
    value: 250,
    rarity: 'epic',
    usable: false,
    effect: {
      type: 'buff',
      value: 15
    },
    icon: '🛡️'
  },
  {
    id: 'shadow-cloak',
    name: 'Shadow Cloak',
    description: 'A mystical cloak woven from pure shadow energy.',
    type: 'armor',
    value: 500,
    rarity: 'legendary',
    usable: false,
    effect: {
      type: 'buff',
      value: 20
    },
    icon: '🧥'
  }
];

export const consumables: Item[] = [
  {
    id: 'health-potion',
    name: 'Health Potion',
    description: 'Restores 50 health points instantly.',
    type: 'consumable',
    value: 30,
    rarity: 'common',
    usable: true,
    effect: {
      type: 'heal',
      value: 50
    },
    icon: '🧪'
  },
  {
    id: 'greater-health-potion',
    name: 'Greater Health Potion',
    description: 'Restores 100 health points instantly.',
    type: 'consumable',
    value: 60,
    rarity: 'uncommon',
    usable: true,
    effect: {
      type: 'heal',
      value: 100
    },
    icon: '🧪'
  },
  {
    id: 'super-health-potion',
    name: 'Super Health Potion',
    description: 'Restores 200 health points instantly.',
    type: 'consumable',
    value: 120,
    rarity: 'rare',
    usable: true,
    effect: {
      type: 'heal',
      value: 200
    },
    icon: '🧪'
  },
  {
    id: 'energy-drink',
    name: 'Energy Drink',
    description: 'Restores energy and boosts speed temporarily.',
    type: 'consumable',
    value: 50,
    rarity: 'rare',
    usable: true,
    effect: {
      type: 'buff',
      value: 3,
      duration: 5
    },
    icon: '⚡'
  },
  {
    id: 'strength-elixir',
    name: 'Strength Elixir',
    description: 'Temporarily increases attack power.',
    type: 'consumable',
    value: 80,
    rarity: 'epic',
    usable: true,
    effect: {
      type: 'buff',
      value: 10,
      duration: 3
    },
    icon: '💪'
  }
];

export const keyItems: Item[] = [
  {
    id: 'village-key',
    name: 'Village Key',
    description: 'Opens locked doors in the village.',
    type: 'key',
    value: 0,
    rarity: 'uncommon',
    usable: false,
    icon: '🔑'
  },
  {
    id: 'cave-crystal',
    name: 'Cave Crystal',
    description: 'A glowing crystal that illuminates dark passages.',
    type: 'key',
    value: 0,
    rarity: 'rare',
    usable: false,
    icon: '💎'
  },
  {
    id: 'ancient-scroll',
    name: 'Ancient Scroll',
    description: 'Contains mysterious knowledge from ages past.',
    type: 'quest',
    value: 0,
    rarity: 'legendary',
    usable: false,
    icon: '📜'
  },
  {
    id: 'shadow-orb',
    name: 'Shadow Orb',
    description: 'A mysterious orb that pulses with dark energy.',
    type: 'quest',
    value: 0,
    rarity: 'legendary',
    usable: false,
    icon: '🔮'
  }
];

export const allItems = [...weapons, ...armors, ...consumables, ...keyItems];