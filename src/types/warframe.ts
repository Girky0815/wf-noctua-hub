// Warframe World State Type Definitions

export interface WorldState {
  timestamp: string;
  alerts: Alert[];
  invasions: Invasion[];
  fissures: Fissure[];
  voidTrader: VoidTrader;
  cetusCycle: Cycle;
  vallisCycle: Cycle;
  cambionCycle: Cycle;
  sorties: Sortie[];
  archonHunt: Sortie;
  vaultTrader: VaultTrader;
}

export interface VaultTrader {
  id: string;
  activation: string;
  expiry: string;
  active?: boolean;
  startString: string;
  eta: string;
  inventory: VaultTraderInventoryItem[];
  character?: string; // "Varzia"
}

export interface VaultTraderInventoryItem {
  item: string;
  type?: string;
  cost?: number; // Crystal/Aya cost
  attributes?: {
    itemType?: string;
  };
}

export interface Alert {
  id: string;
  activation: string;
  expiry: string;
  mission: Mission;
  expired: boolean;
  eta: string;
}

export interface Mission {
  node: string;
  faction: string;
  type: string;
  nightmare: boolean;
  archwingRequired: boolean;
  isSharkwing: boolean;
  reward: Reward;
  minEnemyLevel: number;
  maxEnemyLevel: number;
}

export interface Reward {
  items: string[];
  countedItems: CountedItem[];
  credits: number;
  asString: string;
  thumbnail: string;
}

export interface CountedItem {
  count: number;
  type: string;
  key: string;
}

export interface Invasion {
  id: string;
  activation: string;
  startString: string;
  node: string;
  desc: string;
  attacker: InvasionFactionInfo;
  defender: InvasionFactionInfo;
  eta: string;
  completed: boolean;
  vsInfestation: boolean;
  completion: number;
  msg?: string; // e.g. "Outbreak"
}

export interface InvasionFactionInfo {
  reward: Reward;
  faction: string;
  factionKey: string;
}

export interface Fissure {
  id: string;
  activation: string;
  startString: string;
  expiry: string;
  active: boolean;
  node: string;
  missionType: string;
  missionKey: string;
  enemy: string;
  enemyKey: string;
  tier: string;
  tierNum: number;
  expired: boolean;
  eta: string;
  isStorm: boolean;
  isHard: boolean; // Steel Path
}

export interface VoidTrader {
  id: string;
  activation: string;
  startString: string;
  expiry: string;
  active: boolean;
  character: string;
  location: string;
  inventory: VoidTraderItem[];
  ps4?: { startString: string; active: boolean }; // Data mismatch handling if needed
}

export interface VoidTraderItem {
  item: string;
  ducats: number;
  credits: number;
}

export interface Cycle {
  id: string;
  expiry: string;
  activation: string;
  isDay: boolean; // Cetus specific usually
  state: string; // "day", "night", "warm", "cold", "fass", "vome"
  timeLeft: string;
  shortString: string;
}

export interface Sortie {
  id: string;
  activation: string;
  startString: string;
  expiry: string;
  active: boolean;
  rewardPool: string;
  variants: SortieVariant[];
  missions?: SortieMission[];
  boss: string;
  faction: string;
  expired: boolean;
  eta: string;
}

export interface SortieVariant {
  missionType: string;
  modifier: string;
  modifierDescription: string;
  node: string;
}

export interface SortieMission {
  node: string;
  type: string;
  nightmare: boolean;
  archwingRequired: boolean;
  isSharkwing: boolean;
}
