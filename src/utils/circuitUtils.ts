
export type CircuitItemCategory = 'Warframe' | 'Primary' | 'Secondary' | 'Melee' | 'Unknown';

// 武器カテゴリ定義 (Incarnon Genesis対象武器)
const PRIMARY_WEAPONS = new Set([
  'BOAR', 'BOLTOR', 'BRATON', 'BURSTON', 'DERA', 'DREAD', 'GORGON', 'LATRON', 'MITER', 'PARIS', 'SOMA', 'STRUN', 'SYBARIS', 'TORID'
]);

const SECONDARY_WEAPONS = new Set([
  'ANGSTRUM', 'ATOMOS', 'BRONCO', 'CESTRA', 'DESPAIR', 'DUAL TOXOCYST', 'FURIS', 'GAMMACOR', 'KUNAI', 'LATO', 'LEX', 'SICARUS', 'VASTO', 'ZYLOK'
]);

const MELEE_WEAPONS = new Set([
  'ACK & BRUNT', 'ANKU', 'BO', 'CERAMIC DAGGER', 'DUAL ICHOR', 'FURAX', 'HATE', 'MAGISTAR', 'NAMI SOLO', 'OKINA', 'SIBEAR', 'SKANA'
]);

/**
 * APIからのアイテム名 ("CeramicDagger" etc) を正規化 ("Ceramic Dagger") する
 */
export const normalizeCircuitItemName = (rawName: string): string => {
  // 基本的にCamelCaseをスペース区切りにする
  // 例: "CeramicDagger" -> "Ceramic Dagger"
  // 例: "Ack&Brunt" -> "Ack & Brunt" (APIがどう返すか不明だが、&周りのスペース確保)

  let name = rawName;

  // "Ack&Brunt" のようなケースへの対応 (もしAPIがそう返すなら)
  name = name.replace(/&/g, ' & ');

  // CamelCase Splitting
  // 大文字の前にスペースを入れる (先頭以外)
  name = name.replace(/([A-Z])/g, ' $1').trim();

  // 連続するスペースを除去
  name = name.replace(/\s+/g, ' ');

  // 特例対応
  // "Dual Toxocyst" などは上記でうまくいくはず
  // User reported "Ack And Brunt" appearing, likely from API returning "AckAndBrunt"
  name = name.replace(/Ack And Brunt/i, 'Ack & Brunt');

  return name;
};

/**
 * アイテム名からカテゴリを判定する
 */
export const getCircuitItemCategory = (normalizedName: string, isSteelPath: boolean): CircuitItemCategory => {
  if (!isSteelPath) {
    return 'Warframe';
  }

  const upperName = normalizedName.toUpperCase();

  if (PRIMARY_WEAPONS.has(upperName)) return 'Primary';
  if (SECONDARY_WEAPONS.has(upperName)) return 'Secondary';
  if (MELEE_WEAPONS.has(upperName)) return 'Melee';

  return 'Unknown';
};


/**
 * Wiki URLを生成する
 */
export const getCircuitWikiUrl = (normalizedName: string, category: CircuitItemCategory): string => {
  let upperName = normalizedName.toUpperCase();

  // Warframe Wiki: &(%26)ではなく、全角の＆を使う必要がある
  upperName = upperName.replace(/&/g, '＆');

  if (category === 'Warframe') {
    // https://wikiwiki.jp/warframe/<NAME>
    return `https://wikiwiki.jp/warframe/${encodeURIComponent(upperName)}`;
  } else {
    // Weapon (Incarnon)
    // https://wikiwiki.jp/warframe/Incarnon/<NAME>
    return `https://wikiwiki.jp/warframe/Incarnon/${encodeURIComponent(upperName)}`;
  }
};

export const getCircuitCategoryIcon = (category: CircuitItemCategory): string => {
  switch (category) {
    case 'Warframe': return 'accessibility_new';
    case 'Primary': return 'my_location'; // ターゲットアイコン的な
    case 'Secondary': return 'filter_center_focus'; // サイトアイコン的な
    case 'Melee': return 'swords'; // 剣
    default: return 'help';
  }
};
