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
  },
  // New Weapons
  {
    id: 'crystal-sword',
    name: 'Crystal Sword',
    description: 'A blade made from pure crystal that gleams with inner light.',
    type: 'weapon',
    value: 300,
    rarity: 'rare',
    usable: false,
    effect: {
      type: 'damage',
      value: 22
    },
    icon: '⚔️'
  },
  {
    id: 'flame-spear',
    name: 'Flame Spear',
    description: 'A spear that burns with eternal fire.',
    type: 'weapon',
    value: 350,
    rarity: 'rare',
    usable: false,
    effect: {
      type: 'damage',
      value: 24
    },
    icon: '🔥'
  },
  {
    id: 'ice-hammer',
    name: 'Ice Hammer',
    description: 'A massive hammer that freezes enemies on impact.',
    type: 'weapon',
    value: 450,
    rarity: 'epic',
    usable: false,
    effect: {
      type: 'damage',
      value: 28
    },
    icon: '🔨'
  },
  {
    id: 'void-dagger',
    name: 'Void Dagger',
    description: 'A dagger that seems to absorb light itself.',
    type: 'weapon',
    value: 280,
    rarity: 'rare',
    usable: false,
    effect: {
      type: 'damage',
      value: 19
    },
    icon: '🗡️'
  },
  {
    id: 'thunder-axe',
    name: 'Thunder Axe',
    description: 'An axe that crackles with lightning energy.',
    type: 'weapon',
    value: 380,
    rarity: 'epic',
    usable: false,
    effect: {
      type: 'damage',
      value: 26
    },
    icon: '⚡'
  },
  {
    id: 'vialborne-staff',
    name: 'Vialborne Staff',
    description: 'The legendary staff of the Mystic Alchemist, filled with powerful potions.',
    type: 'weapon',
    value: 900,
    rarity: 'legendary',
    usable: false,
    effect: {
      type: 'damage',
      value: 40
    },
    icon: '🧪'
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
  },
  // New Armor
  {
    id: 'crystal-mail',
    name: 'Crystal Mail',
    description: 'Armor made from crystallized magic that deflects spells.',
    type: 'armor',
    value: 200,
    rarity: 'rare',
    usable: false,
    effect: {
      type: 'buff',
      value: 10
    },
    icon: '💎'
  },
  {
    id: 'flame-guard',
    name: 'Flame Guard',
    description: 'Armor that burns enemies who dare to strike you.',
    type: 'armor',
    value: 220,
    rarity: 'rare',
    usable: false,
    effect: {
      type: 'buff',
      value: 11
    },
    icon: '🔥'
  },
  {
    id: 'ice-plate',
    name: 'Ice Plate',
    description: 'Frozen armor that slows attackers.',
    type: 'armor',
    value: 280,
    rarity: 'epic',
    usable: false,
    effect: {
      type: 'buff',
      value: 13
    },
    icon: '❄️'
  },
  {
    id: 'void-shroud',
    name: 'Void Shroud',
    description: 'A shroud that makes you partially invisible.',
    type: 'armor',
    value: 320,
    rarity: 'epic',
    usable: false,
    effect: {
      type: 'buff',
      value: 14
    },
    icon: '🌑'
  },
  {
    id: 'thunder-vest',
    name: 'Thunder Vest',
    description: 'A vest that electrifies attackers.',
    type: 'armor',
    value: 240,
    rarity: 'rare',
    usable: false,
    effect: {
      type: 'buff',
      value: 12
    },
    icon: '⚡'
  },
  {
    id: 'alchemist-robes',
    name: 'Alchemist Robes',
    description: 'Robes infused with protective alchemical compounds.',
    type: 'armor',
    value: 350,
    rarity: 'epic',
    usable: false,
    effect: {
      type: 'buff',
      value: 16
    },
    icon: '🧪'
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
  },
  // New Consumables
  {
    id: 'mana-potion',
    name: 'Mana Potion',
    description: 'Restores magical energy for special abilities.',
    type: 'consumable',
    value: 40,
    rarity: 'common',
    usable: true,
    effect: {
      type: 'heal',
      value: 30
    },
    icon: '🔮'
  },
  {
    id: 'defense-tonic',
    name: 'Defense Tonic',
    description: 'Temporarily increases defense against attacks.',
    type: 'consumable',
    value: 70,
    rarity: 'uncommon',
    usable: true,
    effect: {
      type: 'buff',
      value: 8,
      duration: 4
    },
    icon: '🛡️'
  },
  {
    id: 'speed-serum',
    name: 'Speed Serum',
    description: 'Dramatically increases movement speed.',
    type: 'consumable',
    value: 90,
    rarity: 'rare',
    usable: true,
    effect: {
      type: 'buff',
      value: 5,
      duration: 6
    },
    icon: '💨'
  },
  {
    id: 'berserker-brew',
    name: 'Berserker Brew',
    description: 'Increases attack but reduces defense.',
    type: 'consumable',
    value: 100,
    rarity: 'epic',
    usable: true,
    effect: {
      type: 'buff',
      value: 15,
      duration: 3
    },
    icon: '🍺'
  },
  {
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    description: 'Revives you with full health when defeated.',
    type: 'consumable',
    value: 200,
    rarity: 'legendary',
    usable: true,
    effect: {
      type: 'heal',
      value: 999
    },
    icon: '🪶'
  },
  {
    id: 'invisibility-potion',
    name: 'Invisibility Potion',
    description: 'Makes you invisible to enemies for a short time.',
    type: 'consumable',
    value: 150,
    rarity: 'epic',
    usable: true,
    effect: {
      type: 'buff',
      value: 0,
      duration: 5
    },
    icon: '👻'
  },
  {
    id: 'alchemist-elixir',
    name: 'Alchemist Elixir',
    description: 'A powerful mixture that enhances all abilities.',
    type: 'consumable',
    value: 180,
    rarity: 'legendary',
    usable: true,
    effect: {
      type: 'buff',
      value: 12,
      duration: 8
    },
    icon: '🧪'
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