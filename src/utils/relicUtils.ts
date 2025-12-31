import type { RelicItem, RelicRefinement, RelicState, RelicDrop, VaultTrader, VaultTraderInventoryItem, RelicReward } from '../types/warframe';

// 各精錬度におけるレアリティごとのドロップ確率 (%)
// Intact: Common 76%, Uncommon 22%, Rare 2%
// Exceptional: Common 70%, Uncommon 26%, Rare 4%
// Flawless: Common 60%, Uncommon 34%, Rare 6%
// Radiant: Common 50%, Uncommon 40%, Rare 10%
// 注: 各レアリティ内でのアイテム配分は、Common(3種均等), Uncommon(2種均等), Rare(1種) となる。
// ここではカテゴリ全体への確率を定義する。

export const DROP_RATES: Record<RelicRefinement, Record<'Common' | 'Uncommon' | 'Rare', number>> = {
  Intact: { Common: 0.76, Uncommon: 0.22, Rare: 0.02 },
  Exceptional: { Common: 0.70, Uncommon: 0.26, Rare: 0.04 },
  Flawless: { Common: 0.60, Uncommon: 0.34, Rare: 0.06 },
  Radiant: { Common: 0.50, Uncommon: 0.40, Rare: 0.10 },
};

/**
 * レリックの報酬アイテムのドロップ率を計算する
 * @param rarity アイテムのレアリティ
 * @param refinement レリックの精錬度
 * @returns 確率 (0.0 ~ 1.0)
 */
export const calculateDropRate = (rarity: 'Common' | 'Uncommon' | 'Rare', refinement: RelicRefinement): number => {
  const categoryRate = DROP_RATES[refinement][rarity];

  // カテゴリ内のアイテム数で割る (Common=3, Uncommon=2, Rare=1)
  switch (rarity) {
    case 'Common': return categoryRate / 3;
    case 'Uncommon': return categoryRate / 2;
    case 'Rare': return categoryRate / 1;
    default: return 0;
  }
};

/**
 * レリックの状態 (Active / Vaulted / Resurgence) を判定する
 * 
 * 優先順位:
 * 1. VaultTrader (Varzia) のインベントリにある -> Resurgence
 * 2. drops 情報がある (ドロップ場所がある) -> Active
 * 3. それ以外 -> Vaulted
 * 
 * @param relic レリック情報
 * @param vaultTrader Prime Resurgence (Varzia) のデータ
 * @returns RelicState
 */
export const getRelicState = (relic: RelicItem, vaultTrader?: VaultTrader): RelicState => {
  // レリック名から " (Intact)" などを除去して照合用にする
  // 例: "Lith G1 Intact" -> "Lith G1 Relic" 
  // APIのアイテム名は "Lith G1 Intact" となっているが、VaultTraderのインベントリは "Meso F2 Relic (Intact)" や "Lith G1 Relic (Intact)" のような形式が多い。
  // また、VaultTraderのitemフィールドは "Lith G1 Relic (Intact)" のようになっている。
  // 単純な含む検索で判定するのが良さそう。

  const baseName = relic.name.replace(/ (Intact|Exceptional|Flawless|Radiant)$/, '').trim();

  // 1. Resurgence Check
  if (vaultTrader?.inventory) {
    const isResurgence = vaultTrader.inventory.some((vtItem: VaultTraderInventoryItem) => {
      // インベントリのアイテム名にレリックのベース名が含まれているか確認
      // VaultTrader item: "Lith G1 Relic (Intact)" vs Base: "Lith G1"
      return vtItem.item.includes(baseName);
    });
    if (isResurgence) {
      return 'Resurgence';
    }
  }

  // 2. Active Check
  // drops配列が空でなければActiveとみなす
  if (relic.drops && relic.drops.length > 0) {
    return 'Active';
  }

  // 3. Vaulted
  return 'Vaulted';
};

/**
 * レリックを指定回数開封するシミュレーション
 * @param relic レリックデータ (報酬リストが必要だが、検索APIの結果には報酬リスト自体が含まれない場合がある...
 *              注: 検索APIの結果には `rewards` フィールドがあるが、空の場合が多い。
 *              `drops` にはドロップ場所が入る。
 *              報酬リストを取得するには、アイテムの詳細が必要か、あるいはdropsから逆引きはできない。
 *              APIの仕様上、レリックの中身（報酬）は `rewards` フィールドに入っているはずだが、
 *              sample data (Lith G1) では `rewards: []` だった。
 *              
 *              もしかして: レリックの「中身」を知るには別のAPIエンドポイントが必要か、
 *              あるいは個々のリワードアイテムの `drops` から "Lith G1" を探す必要がある？（これは非現実的）
 *              
 *              確認: https://api.warframestat.us/items/search/lith%20g1 の結果では rewards が空。
 *              しかし、https://api.warframestat.us/items/lith%20g1%20relic (個別取得) なら入っているかも？
 *              あるいは、drops情報は「このレリックが落ちる場所」であり、「このレリックから落ちるもの」ではない。
 *              
 *              修正: Relicの報酬データを持つAPIレスポンスを見つける必要がある。
 *              Wikiのデータ構造を見ると、`rewards` フィールドがあるべき。
 *              もし `items/search` で空なら、データの取得方法を見直す必要があるかもしれない。
 *              
 *              一旦、シミュレーションロジック自体は「確率に基づいてレアリティを決定する」ものとして実装する。
 *              具体的なアイテム名はUI側でデータが整ってから渡す形にする。
 */
/**
 * レリックを指定回数開封するシミュレーション
 * @param refinement 精錬度
 * @param count 開封回数
 * @param rewards 報酬リスト (各アイテムのレアリティ情報が必要)
 * @returns アイテム名 -> 個数 のマップ
 */
export const simulateOpen = (refinement: RelicRefinement, count: number, rewards: RelicReward[]): Record<string, number> => {
  const result: Record<string, number> = {};

  // 各アイテムをレアリティごとに分類
  const rewardsByRarity = {
    Common: rewards.filter(r => r.rarity === 'Common'),
    Uncommon: rewards.filter(r => r.rarity === 'Uncommon'),
    Rare: rewards.filter(r => r.rarity === 'Rare'),
  };

  const rates = DROP_RATES[refinement];

  for (let i = 0; i < count; i++) {
    const rand = Math.random();
    let selectedRarity: 'Common' | 'Uncommon' | 'Rare';

    if (rand < rates.Common) {
      selectedRarity = 'Common';
    } else if (rand < rates.Common + rates.Uncommon) {
      selectedRarity = 'Uncommon';
    } else {
      selectedRarity = 'Rare';
    }

    // 該当レアリティのアイテム候補を取得
    const candidates = rewardsByRarity[selectedRarity];

    // 候補がない場合（データ不備など）はスキップ、あるいはフォールバック
    if (candidates.length > 0) {
      // 候補の中から等確率で1つ抽選する (Warframeの仕様: 同レアリティ内は均等確率)
      // 注: Common 76%で3種なら各25.33%。Uniform distribution.
      const itemIndex = Math.floor(Math.random() * candidates.length);
      const itemName = candidates[itemIndex].itemName;

      result[itemName] = (result[itemName] || 0) + 1;
    }
  }

  return result;
};

export const translateItemName = (name: string): string => {
  let translated = name;
  const replacements: Record<string, string> = {
    'Blueprint': '設計図',
    'Systems': 'システム',
    'Chassis': 'シャーシ',
    'Neuroptics': 'ニューロティック',
    'Receiver': 'レシーバー',
    'Guard': 'ガード',
    'Barrel': 'バレル',
    'Stock': 'ストック',
    'Handle': 'ハンドル',
    'Blade': 'ブレード',
    'Link': 'リンク',
    'Pouch': 'ポーチ',
    'Stars': 'スター',
    'Hilt': 'ヒルト',
    'Head': 'ヘッド',
    'Motor': 'モーター',
    'Limb': 'リム',
    'Grip': 'グリップ',
    'String': 'ストリング',
    'Carapace': 'キャラペス',
    'Cerebrum': 'セリブラム',
    'Fragment': 'フラグメント',
    'Wings': 'ウィング',
    'Harness': 'ハーネス',
    'Rivet': 'リベット',
    'Subcortex': 'サブコーテックス',
    'Forma': 'フォーマ',
  };

  Object.entries(replacements).forEach(([en, jp]) => {
    translated = translated.replace(en, jp);
  });

  return translated;
};
