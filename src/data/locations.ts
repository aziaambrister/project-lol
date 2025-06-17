import { Location } from '../types/game';
import { forestEnemies, villageEnemies, caveEnemies } from './enemies';

export const locations: Location[] = [
  {
    id: 'forest',
    name: 'Mystic Forest',
    type: 'forest',
    description: 'A dense forest with towering ancient trees, babbling brooks, and mysterious shadows. Wildlife roams freely among the undergrowth.',
    background: 'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg?auto=compress&cs=tinysrgb&w=1200',
    enemies: forestEnemies,
    npcs: [],
    connections: ['village', 'cave']
  },
  {
    id: 'village',
    name: 'Ancient Village',
    type: 'village',
    description: 'A traditional village with wooden houses, bustling markets, and peaceful farms. Lanterns illuminate the stone pathways at dusk.',
    background: 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=1200',
    enemies: villageEnemies,
    npcs: [],
    connections: ['forest', 'cave']
  },
  {
    id: 'cave',
    name: 'Shadow Cave',
    type: 'cave',
    description: 'Dark caverns illuminated by glowing crystals. Water drips from stalactites as mysterious sounds echo through the tunnels.',
    background: 'https://images.pexels.com/photos/2437297/pexels-photo-2437297.jpeg?auto=compress&cs=tinysrgb&w=1200',
    enemies: caveEnemies,
    npcs: [],
    connections: ['forest', 'village']
  }
];