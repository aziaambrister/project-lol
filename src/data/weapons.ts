import { Weapon } from '../types/game';

export const weapons: Weapon[] = [
  // Assault Rifles
  {
    id: 'ar-common',
    name: 'Assault Rifle',
    type: 'assault-rifle',
    rarity: 'common',
    damage: 30,
    fireRate: 5.5,
    accuracy: 75,
    range: 250,
    ammoType: 'medium',
    magazineSize: 30,
    reloadTime: 2.3,
    icon: '🔫',
    sprite: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=64'
  },
  {
    id: 'ar-rare',
    name: 'SCAR Assault Rifle',
    type: 'assault-rifle',
    rarity: 'rare',
    damage: 35,
    fireRate: 5.5,
    accuracy: 80,
    range: 275,
    ammoType: 'medium',
    magazineSize: 30,
    reloadTime: 2.1,
    icon: '🔫',
    sprite: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=64'
  },
  {
    id: 'ar-legendary',
    name: 'Legendary SCAR',
    type: 'assault-rifle',
    rarity: 'legendary',
    damage: 40,
    fireRate: 5.5,
    accuracy: 85,
    range: 300,
    ammoType: 'medium',
    magazineSize: 30,
    reloadTime: 1.9,
    icon: '🔫',
    sprite: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=64'
  },

  // Shotguns
  {
    id: 'shotgun-common',
    name: 'Pump Shotgun',
    type: 'shotgun',
    rarity: 'common',
    damage: 95,
    fireRate: 0.7,
    accuracy: 50,
    range: 50,
    ammoType: 'shells',
    magazineSize: 5,
    reloadTime: 4.8,
    icon: '🔫',
    sprite: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=64'
  },
  {
    id: 'shotgun-epic',
    name: 'Combat Shotgun',
    type: 'shotgun',
    rarity: 'epic',
    damage: 73,
    fireRate: 1.85,
    accuracy: 60,
    range: 75,
    ammoType: 'shells',
    magazineSize: 10,
    reloadTime: 3.2,
    icon: '🔫',
    sprite: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=64'
  },

  // Sniper Rifles
  {
    id: 'sniper-uncommon',
    name: 'Hunting Rifle',
    type: 'sniper-rifle',
    rarity: 'uncommon',
    damage: 86,
    fireRate: 0.33,
    accuracy: 100,
    range: 400,
    ammoType: 'heavy',
    magazineSize: 1,
    reloadTime: 3.6,
    icon: '🎯',
    sprite: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=64'
  },
  {
    id: 'sniper-legendary',
    name: 'Bolt-Action Sniper',
    type: 'sniper-rifle',
    rarity: 'legendary',
    damage: 116,
    fireRate: 0.33,
    accuracy: 100,
    range: 450,
    ammoType: 'heavy',
    magazineSize: 1,
    reloadTime: 3.0,
    icon: '🎯',
    sprite: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=64'
  },

  // SMGs
  {
    id: 'smg-common',
    name: 'Submachine Gun',
    type: 'smg',
    rarity: 'common',
    damage: 17,
    fireRate: 13,
    accuracy: 65,
    range: 120,
    ammoType: 'light',
    magazineSize: 35,
    reloadTime: 2.0,
    icon: '🔫',
    sprite: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=64'
  },
  {
    id: 'smg-epic',
    name: 'Compact SMG',
    type: 'smg',
    rarity: 'epic',
    damage: 21,
    fireRate: 10,
    accuracy: 70,
    range: 140,
    ammoType: 'light',
    magazineSize: 40,
    reloadTime: 1.8,
    icon: '🔫',
    sprite: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=64'
  },

  // Pistols
  {
    id: 'pistol-common',
    name: 'Pistol',
    type: 'pistol',
    rarity: 'common',
    damage: 23,
    fireRate: 6.75,
    accuracy: 85,
    range: 150,
    ammoType: 'light',
    magazineSize: 16,
    reloadTime: 1.5,
    icon: '🔫',
    sprite: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=64'
  },

  // Explosives
  {
    id: 'rocket-launcher',
    name: 'Rocket Launcher',
    type: 'explosive',
    rarity: 'epic',
    damage: 121,
    fireRate: 0.75,
    accuracy: 100,
    range: 300,
    ammoType: 'energy',
    magazineSize: 1,
    reloadTime: 2.8,
    icon: '🚀',
    sprite: 'https://images.pexels.com/photos/8389717/pexels-photo-8389717.jpeg?auto=compress&cs=tinysrgb&w=64'
  }
];