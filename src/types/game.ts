// 2D Fighting Game Types
export type CharacterClass = 'balanced-fighter' | 'speed-demon' | 'heavy-hitter' | 'defensive-tank' | 'founder' | 'mystic-alchemist';

export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  health: number;
  maxHealth: number;
  experience: number;
  experienceToNextLevel: number;
  attack: number;
  defense: number;
  speed: number;
  unlocked: boolean;
  price?: number;
  moveSet: Move[];
  portrait: string;
  sprite: string;
  animations: {
    idle: string;
    walk: string;
    attack: string;
    block: string;
    hurt: string;
  };
}

export interface Move {
  id: string;
  name: string;
  type: 'basic-attack' | 'combo' | 'special' | 'block' | 'dodge';
  damage: number;
  staminaCost: number;
  cooldown: number;
  currentCooldown: number;
  range: number;
  description: string;
  animation: string;
  comboChain?: string[];
}

export interface Enemy {
  id: string;
  name: string;
  type: 'patrol' | 'aggressive' | 'defensive' | 'boss';
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  detectionRadius: number;
  patrolRadius: number;
  experience: number;
  loot: Item[];
  position: { x: number; y: number };
  patrolCenter: { x: number; y: number };
  currentTarget?: string;
  state: 'idle' | 'patrol' | 'chase' | 'attack' | 'retreat' | 'dead';
  lastAction: number;
  sprite: string;
  moveSet: Move[];
  aiDifficulty: 'easy' | 'medium' | 'hard';
}

export interface Building {
  id: string;
  name: string;
  type: 'house' | 'shop' | 'inn' | 'temple' | 'dungeon';
  position: { x: number; y: number };
  size: { width: number; height: number };
  enterable: boolean;
  interior?: {
    background: string;
    npcs: NPC[];
    items: Item[];
    exits: { x: number; y: number; leadsTo: string }[];
  };
  sprite: string;
}

export interface WaterBody {
  id: string;
  type: 'lake' | 'river' | 'ocean' | 'pond';
  position: { x: number; y: number };
  size: { width: number; height: number };
  swimmable: boolean;
  currentStrength: number;
}

export interface TerrainTile {
  type: 'grass' | 'dirt' | 'stone' | 'water' | 'forest' | 'mountain' | 'sand';
  walkable: boolean;
  speedModifier: number;
  sprite: string;
}

export interface GameWorld {
  id: string;
  name: string;
  size: { width: number; height: number };
  terrain: TerrainTile[][];
  buildings: Building[];
  waterBodies: WaterBody[];
  enemies: Enemy[];
  npcs: NPC[];
  items: Item[];
  spawnPoint: { x: number; y: number };
  dayNightCycle: {
    currentTime: number; // 0-24 hours
    dayLength: number; // in seconds
    lightLevel: number; // 0-1
  };
  weather: {
    type: 'clear' | 'rain' | 'storm' | 'fog';
    intensity: number;
  };
}

export interface NPC {
  id: string;
  name: string;
  type: 'merchant' | 'trainer' | 'quest-giver' | 'guard';
  position: { x: number; y: number };
  dialogue: string[];
  shop?: {
    items: Item[];
    currency: number;
  };
  sprite: string;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'key' | 'material' | 'upgrade';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  value: number;
  effect?: {
    type: 'heal' | 'boost-attack' | 'boost-defense' | 'boost-speed' | 'health' | 'speed' | 'damage' | 'defense';
    value: number;
    duration?: number;
  };
  icon: string;
  description: string;
  usable?: boolean;
}

export interface EquippedItems {
  weapon?: Item;
  armor?: Item;
}

export interface Combat {
  inCombat: boolean;
  target?: Enemy;
  playerTurn: boolean;
  comboCount: number;
  lastHitTime: number;
  damageNumbers: DamageNumber[];
}

export interface DamageNumber {
  id: string;
  value: number;
  position: { x: number; y: number };
  type: 'damage' | 'heal' | 'critical';
  timestamp: number;
}

export interface DebugState {
  enabled: boolean;
  showEnemyStates: boolean;
  showPerformanceMetrics: boolean;
}

export interface GameState {
  gameMode: 'character-select' | 'world-exploration' | 'combat' | 'building-interior' | 'menu';
  player: {
    character: Character;
    position: { x: number; y: number };
    direction: 'up' | 'down' | 'left' | 'right';
    isMoving: boolean;
    isSwimming: boolean;
    inventory: Item[];
    currency: number;
    currentBuilding?: string;
    equippedItems: EquippedItems;
    unlockedCharacters: CharacterClass[];
  };
  currentWorld: GameWorld;
  combat: Combat;
  camera: {
    x: number;
    y: number;
    zoom: number;
  };
  ui: {
    showMinimap: boolean;
    showInventory: boolean;
    showCharacterStats: boolean;
    selectedEnemy?: string;
  };
  settings: {
    soundEnabled: boolean;
    musicVolume: number;
    sfxVolume: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  debug: DebugState;
}