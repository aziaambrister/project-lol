import { Quest } from '../types/game';
import { allItems } from './items';

export const quests: Quest[] = [
  {
    id: 'forest-wolves',
    name: 'Forest Wolf Problem',
    description: 'The forest has been overrun by wolves. Defeat some to help restore balance.',
    objectives: [
      {
        id: 'kill-wolves',
        description: 'Defeat Forest Wolves',
        completed: false,
        type: 'kill',
        target: 'forest-wolf',
        count: 3,
        progress: 0
      }
    ],
    rewards: {
      experience: 50,
      currency: 100,
      items: [allItems.find(item => item.id === 'health-potion')!]
    },
    completed: false
  },
  {
    id: 'bandit-trouble',
    name: 'Bandit Trouble',
    description: 'Bandits have been harassing travelers on the forest path. Clear them out.',
    objectives: [
      {
        id: 'kill-bandits',
        description: 'Defeat Bandit Scouts',
        completed: false,
        type: 'kill',
        target: 'bandit-scout',
        count: 2,
        progress: 0
      },
      {
        id: 'collect-loot',
        description: 'Collect stolen goods',
        completed: false,
        type: 'collect',
        target: 'stolen-goods',
        count: 1,
        progress: 0
      }
    ],
    rewards: {
      experience: 80,
      currency: 150,
      items: [allItems.find(item => item.id === 'sharp-dagger')!]
    },
    completed: false
  },
  {
    id: 'village-investigation',
    name: 'Village Investigation',
    description: 'Strange things have been happening in the village. Investigate and talk to the villagers.',
    objectives: [
      {
        id: 'talk-innkeeper',
        description: 'Speak with the Innkeeper',
        completed: false,
        type: 'talk',
        target: 'innkeeper',
        count: 1,
        progress: 0
      },
      {
        id: 'talk-farmer',
        description: 'Speak with the Farmer',
        completed: false,
        type: 'talk',
        target: 'farmer',
        count: 1,
        progress: 0
      },
      {
        id: 'defeat-corrupt-guard',
        description: 'Defeat the Corrupt Guard',
        completed: false,
        type: 'kill',
        target: 'corrupt-guard',
        count: 1,
        progress: 0
      }
    ],
    rewards: {
      experience: 100,
      currency: 200,
      items: [allItems.find(item => item.id === 'cave-key')!]
    },
    completed: false
  },
  {
    id: 'cave-exploration',
    name: 'Cave Exploration',
    description: 'Explore the mysterious cave and discover its secrets.',
    objectives: [
      {
        id: 'reach-chamber',
        description: 'Reach the Cave Chamber',
        completed: false,
        type: 'talk',
        target: 'cave-chamber',
        count: 1,
        progress: 0
      },
      {
        id: 'defeat-troll',
        description: 'Defeat the Cave Troll',
        completed: false,
        type: 'kill',
        target: 'cave-troll',
        count: 1,
        progress: 0
      },
      {
        id: 'find-scroll',
        description: 'Find the Ancient Scroll',
        completed: false,
        type: 'collect',
        target: 'ancient-scroll',
        count: 1,
        progress: 0
      }
    ],
    rewards: {
      experience: 150,
      currency: 300,
      items: [allItems.find(item => item.id === 'magic-staff')!]
    },
    completed: false
  }
];