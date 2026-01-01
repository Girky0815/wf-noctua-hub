import { useState, useCallback } from 'react';
import type { RelicItem, RelicState, RelicReward } from '../types/warframe';
import { getRelicState } from '../utils/relicUtils';
import { useWarframeData } from './useWarframeData';

interface RelicSearchResult extends RelicItem {
  state: RelicState;
  rewards: RelicReward[];
}

interface DropItem {
  place: string;
  item: string;
  rarity: string;
  chance: number;
}

export const useRelicSearch = () => {
  const [results, setResults] = useState<RelicSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { worldState, isError: isWorldStateError } = useWarframeData();
  const vaultTrader = worldState?.vaultTrader;

  const searchRelics = useCallback(async (query: string) => {
    if (!query || query.length < 2) return;

    // 既存の結果をクリアせず、ローディング状態のみ更新する
    // これにより、入力中のちらつきを防ぐ
    setLoading(true);
    setError(null);

    try {
      // 1. レリック基本情報の取得
      const itemsRes = await fetch(`https://api.warframestat.us/items/search/${encodeURIComponent(query)}`);

      // 404などエラー時は空配列にして終了
      if (!itemsRes.ok) {
        setResults([]);
        setLoading(false);
        return;
      }

      const itemsData: RelicItem[] = await itemsRes.json();

      // "Relic" カテゴリでフィルタリング
      const relicItems = itemsData.filter(item =>
        item.category === 'Relics' &&
        item.name.includes('Intact')
      );

      if (relicItems.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }

      // 2. ドロップテーブル(報酬)の取得
      const dropsRes = await fetch(`https://api.warframestat.us/drops/search/${encodeURIComponent(query)}`);

      let dropsData: DropItem[] = [];
      if (dropsRes.ok) {
        dropsData = await dropsRes.json();
      }

      // 各レリックに対して報酬リストとステータスを結合
      const enrichedResults = relicItems.map(relic => {
        const state = getRelicState(relic, vaultTrader);

        // レリック名: "Lith G1 Intact" -> Base: "Lith G1"
        const baseName = relic.name.replace(/ (Intact|Exceptional|Flawless|Radiant)$/, '').trim();

        // 優先的にIntactのデータを取得する
        // APIでは "Lith G1 Relic" または "Lith G1 Relic (Intact)" と表記される
        const exactPlace = `${baseName} Relic`;
        const intactPlace = `${baseName} Relic (Intact)`;

        let targetDrops = dropsData.filter(d => d.place === exactPlace || d.place === intactPlace);

        // Intactが見つからない場合（名称の揺れなど）、緩い検索でフォールバックし、Intact/Radiantなどが混ざらないように除外を試みる
        if (targetDrops.length === 0) {
          targetDrops = dropsData.filter(d =>
            d.place.includes(baseName) &&
            d.place.includes('Relic') &&
            !d.place.includes('Exceptional') &&
            !d.place.includes('Flawless') &&
            !d.place.includes('Radiant')
          );
        }

        const rewards = targetDrops
          .reduce<RelicReward[]>((acc, drop) => {
            if (!acc.some(r => r.itemName === drop.item)) {
              let rarity: 'Common' | 'Uncommon' | 'Rare' = 'Common';

              // APIのrarity文字列は"Uncommon"などを返すことがあるため(CommonアイテムでもUncommonと表記される)、
              // 確率(chance)に基づいて判定する (Intact基準)
              // Common: ~25.33% (> 20%)
              // Uncommon: ~11%   (> 5% && <= 20%)
              // Rare: ~2%        (<= 5%)
              if (drop.chance > 22) {
                rarity = 'Common';
              } else if (drop.chance > 5) {
                rarity = 'Uncommon';
              } else {
                rarity = 'Rare';
              }

              acc.push({
                itemName: drop.item,
                rarity,
                chance: drop.chance,
              });
            }
            return acc;
          }, [])
          .sort((a, b) => {
            const priority = { Common: 0, Uncommon: 1, Rare: 2 };
            return priority[b.rarity] - priority[a.rarity]; // Use b - a for descending priority if we want Rare first?
            // User requested Common -> Uncommon -> Rare.
            // So Common(0) should be first. 
            // a - b is ascending. 0, 1, 2. Correct.
            // Wait, previous sort was chance - chance (ascending).
            // Common has highest chance (25%), Rare lowest (2%).
            // Ascending chance order: Rare (2%) -> Uncommon (11%) -> Common (25%).
            // So chance - chance puts Rare first.
            // User wants Common first.
            // Let's use strict rarity comparison.
            return priority[a.rarity] - priority[b.rarity];
          });

        return {
          ...relic,
          state,
          rewards
        };
      });

      setResults(enrichedResults);

    } catch (err) {
      console.error(err);
      setError('Failed to search relics');
      setResults([]); // エラー時はクリア
    } finally {
      setLoading(false);
    }
  }, [vaultTrader]);

  return { searchRelics, results, loading, error, isWorldStateError };
};
