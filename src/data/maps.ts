import { GameMap, NamedLocation } from '../types/game';

export const battleRoyaleMaps: GameMap[] = [
  {
    id: 'apollo-island',
    name: 'Apollo Island',
    size: { width: 2000, height: 2000 },
    terrain: [], // Will be generated procedurally
    lootSpawns: [
      // High-tier loot spawns
      { x: 200, y: 200, tier: 3 },
      { x: 1800, y: 200, tier: 3 },
      { x: 1000, y: 1000, tier: 3 },
      { x: 200, y: 1800, tier: 3 },
      { x: 1800, y: 1800, tier: 3 },
      
      // Medium-tier loot spawns
      { x: 600, y: 400, tier: 2 },
      { x: 1400, y: 400, tier: 2 },
      { x: 400, y: 1000, tier: 2 },
      { x: 1600, y: 1000, tier: 2 },
      { x: 600, y: 1600, tier: 2 },
      { x: 1400, y: 1600, tier: 2 },
      
      // Low-tier loot spawns (scattered)
      ...Array.from({ length: 50 }, (_, i) => ({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        tier: 1
      }))
    ],
    namedLocations: [
      {
        id: 'tilted-towers',
        name: 'Tilted Towers',
        position: { x: 1000, y: 800 },
        radius: 150,
        lootDensity: 0.8,
        description: 'A bustling urban area with tall buildings and intense combat.'
      },
      {
        id: 'pleasant-park',
        name: 'Pleasant Park',
        position: { x: 400, y: 300 },
        radius: 120,
        lootDensity: 0.6,
        description: 'A peaceful suburban neighborhood with scattered houses.'
      },
      {
        id: 'retail-row',
        name: 'Retail Row',
        position: { x: 1600, y: 1200 },
        radius: 100,
        lootDensity: 0.7,
        description: 'A commercial district with shops and warehouses.'
      },
      {
        id: 'salty-springs',
        name: 'Salty Springs',
        position: { x: 800, y: 1400 },
        radius: 80,
        lootDensity: 0.5,
        description: 'A small town with a few buildings and open areas.'
      },
      {
        id: 'dusty-depot',
        name: 'Dusty Depot',
        position: { x: 1000, y: 1000 },
        radius: 90,
        lootDensity: 0.6,
        description: 'An industrial area with large warehouses and factories.'
      },
      {
        id: 'lonely-lodge',
        name: 'Lonely Lodge',
        position: { x: 1700, y: 400 },
        radius: 70,
        lootDensity: 0.4,
        description: 'A remote camping area surrounded by dense forest.'
      },
      {
        id: 'loot-lake',
        name: 'Loot Lake',
        position: { x: 600, y: 1000 },
        radius: 110,
        lootDensity: 0.5,
        description: 'A large lake with a house in the center and boats around the shore.'
      },
      {
        id: 'greasy-grove',
        name: 'Greasy Grove',
        position: { x: 300, y: 1600 },
        radius: 85,
        lootDensity: 0.6,
        description: 'A fast-food themed area with restaurants and parking lots.'
      }
    ],
    background: 'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg?auto=compress&cs=tinysrgb&w=1200'
  }
];

export const defaultMap = battleRoyaleMaps[0];