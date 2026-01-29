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
  earthCycle: Cycle;
  zarimanCycle: ZarimanCycle;
  duviriCycle: DuviriCycle;
  sorties: Sortie[];
  sortie?: Sortie; // Fallback for singular
  archonHunt: Sortie;
  vaultTrader: VaultTrader;
  archimedeas: Archimedea[];
}

export interface Archimedea {
  id: string;
  activation: string;
  expiry: string;
  type: string; // "C T_ L A B" | "C T_ H E X"
  typeKey: string;
  missions: ArchimedeaMission[];
  personalModifiers: ArchimedeaModifier[];
}

export interface ArchimedeaMission {
  faction: string;
  factionKey: string;
  missionType: string;
  missionTypeKey: string;
  deviation?: ArchimedeaDeviation;
  risks: ArchimedeaRisk[];
}

export interface ArchimedeaDeviation {
  key: string;
  name: string;
  description: string;
}

export interface ArchimedeaRisk {
  key: string;
  name: string;
  description: string;
  isHard: boolean;
}

export interface ArchimedeaModifier {
  key: string;
  name: string;
  description: string;
}

export interface ZarimanCycle {
  id: string;
  activation: string;
  expiry: string;
  isCorpus: boolean;
  state: string;
  timeLeft: string;
  shortString: string;
}

export interface DuviriCycle {
  id: string;
  activation: string;
  expiry: string;
  state: string;
  choices: {
    category: string;
    categoryKey: string;
    choices: string[];
  }[];
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

export interface RelicItem {
  uniqueName: string;
  name: string;
  category: string;
  imageName: string;
  drops?: RelicDrop[]; // Activeな場合は存在、Vaultedの場合はundefined/null/空
  vaulted?: boolean; // APIが返す場合がある
  masterable: boolean;
  tradable: boolean;
  type: string;
}

export interface RelicDrop {
  location: string;
  type: string; // アイテム名 (e.g. "Volt Prime Blueprint")
  rarity: 'Common' | 'Uncommon' | 'Rare';
  chance: number; // 0.0 ~ 1.0 (あるいは % か要確認。API結果の例では 0.2533 とかなので 0.0-1.0)
}

// レリックの状態定義
export type RelicState = 'Active' | 'Vaulted' | 'Resurgence' | 'Unknown';

// 精錬度
export type RelicRefinement = 'Intact' | 'Exceptional' | 'Flawless' | 'Radiant';

export interface RelicReward {
  itemName: string;
  rarity: 'Common' | 'Uncommon' | 'Rare';
  chance: number;
}
