import React, { useState } from 'react';
import type { RelicItem, RelicReward, RelicState, RelicRefinement } from '../../types/warframe';
import { calculateDropRate, simulateOpen, translateItemName } from '../../utils/relicUtils';

interface ExtendedRelicItem extends RelicItem {
  state: RelicState;
  rewards: RelicReward[];
}

interface RelicCardProps {
  relic: ExtendedRelicItem;
}

const REFINEMENTS: { label: string; value: RelicRefinement; }[] = [
  { label: '無傷', value: 'Intact' },
  { label: '特別', value: 'Exceptional' },
  { label: '完璧', value: 'Flawless' },
  { label: '光輝', value: 'Radiant' },
];

export const RelicCard: React.FC<RelicCardProps> = ({ relic }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [refinement, setRefinement] = useState<RelicRefinement>('Intact');
  const [simResults, setSimResults] = useState<Record<string, number> | null>(null);

  const getStatusBadge = (state: RelicState) => {
    switch (state) {
      case 'Active':
        return <span className="px-2 py-1 rounded text-xs bg-primary-container text-on-primary-container border border-primary">入手可能</span>;
      case 'Vaulted':
        return <span className="px-2 py-1 rounded text-xs bg-error-container text-on-error-container border border-error">Vault保管中</span>;
      case 'Resurgence':
        return <span className="px-2 py-1 rounded text-xs bg-tertiary-container text-on-tertiary-container border border-tertiary">Prime Resurgence</span>;
      default:
        return null;
    }
  };

  const runSimulation = (count: number) => {
    const results = simulateOpen(refinement, count, relic.rewards);
    setSimResults(results);
  };

  return (
    <div className="flex flex-col gap-[2px] overflow-hidden rounded-3xl border-[2px] border-surface-container bg-surface-container transition-all duration-300">
      {/* Header */}
      <div
        className="flex items-center justify-between bg-surface-bright px-4 py-4 cursor-pointer hover:bg-surface-container-high transition-colors text-on-surface"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <img
            src={`https://cdn.warframestat.us/img/${relic.imageName}`}
            alt={relic.name}
            className="w-12 h-12 object-contain"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <div>
            <h3 className="text-lg font-bold font-display" style={{ fontVariationSettings: "'ROND' 100" }}>
              {/* レリック名は英語のままで良いが、Intactなどは削除済み */}
              {relic.name.replace(/ (Intact|Exceptional|Flawless|Radiant)$/, '')}
            </h3>
            <div className="mt-1 flex gap-2">
              {getStatusBadge(relic.state)}
            </div>
          </div>
        </div>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <span className="material-symbols-rounded text-on-surface-variant">expand_more</span>
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-4 bg-surface-bright animate-fade-in">
          {/* Refinement Selector */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 p-1 bg-surface-container rounded-full w-fit">
              {REFINEMENTS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRefinement(r.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                    ${refinement === r.value
                      ? 'bg-primary-container text-on-primary-container shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5'
                    }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Loot Table */}
            <div>
              <h4 className="text-sm font-bold text-primary font-display mb-3 border-b border-outline-variant/10 pb-2" style={{ fontVariationSettings: "'ROND' 100" }}>
                ドロップ確率
              </h4>
              <div className="space-y-2">
                {relic.rewards.length > 0 ? (
                  [...relic.rewards]
                    .sort((a, b) => {
                      const priority = { Common: 0, Uncommon: 1, Rare: 2 };
                      return priority[a.rarity] - priority[b.rarity];
                    })
                    .map((reward, idx) => {
                      const rate = calculateDropRate(reward.rarity, refinement);
                      const percent = (rate * 100).toFixed(2);

                      let rarityColor = 'text-amber-700 dark:text-amber-600'; // Common (Bronze)
                      if (reward.rarity === 'Uncommon') rarityColor = 'text-slate-600 dark:text-slate-300 font-medium'; // Uncommon (Silver) - Darker for Light Mode
                      if (reward.rarity === 'Rare') rarityColor = 'text-yellow-600 dark:text-yellow-400 font-bold'; // Rare (Gold)

                      return (
                        <div key={`${reward.itemName}-${idx}`} className="flex justify-between items-center text-sm py-2 hover:bg-on-surface/5 px-2 rounded transition-colors">
                          <span className={rarityColor}>{translateItemName(reward.itemName)}</span>
                          <div className="text-right flex flex-col items-end shrink-0 ml-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded bg-surface-container ${rarityColor} mb-0.5 whitespace-nowrap`}>
                              {reward.rarity === 'Rare' ? 'レア' : reward.rarity === 'Uncommon' ? 'アンコモン' : 'コモン'}
                            </span>
                            <span className="font-mono text-on-surface-variant text-xs">{percent}%</span>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-on-surface-variant/60 text-sm italic">報酬データが見つかりません</p>
                )}
              </div>
            </div>

            {/* Simulation */}
            <div>
              <h4 className="text-sm font-bold text-primary font-display mb-3 border-b border-outline-variant/10 pb-2" style={{ fontVariationSettings: "'ROND' 100" }}>
                開封シミュレーター
              </h4>
              <div className="flex gap-2 mb-4">
                {[1, 10, 50, 100].map(count => (
                  <button
                    key={count}
                    onClick={() => runSimulation(count)}
                    className="flex-1 bg-surface-container hover:bg-surface-container-highest text-on-surface text-sm py-2 rounded-xl transition-colors font-medium border border-transparent hover:border-outline-variant/20"
                  >
                    {count}個
                  </button>
                ))}
              </div>

              {simResults && (
                <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/10">
                  <p className="text-xs text-center text-on-surface-variant mb-3 font-bold">シミュレーション結果</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(simResults)
                      .sort(([itemA], [itemB]) => {
                        // Sort by rarity first? Or count? User likely wants to see Rare items at top or most abundant?
                        // Let's sort by rarity priority (Rare -> Uncommon -> Common) for visibility of good drops,
                        // then by count desc?
                        // We need rarity info for that. We can find it in rewards list.
                        const getRarity = (name: string) => relic.rewards.find(r => r.itemName === name)?.rarity || 'Common';
                        const priority = { Rare: 3, Uncommon: 2, Common: 1 };
                        const rA = getRarity(itemA);
                        const rB = getRarity(itemB);
                        if (priority[rA] !== priority[rB]) return priority[rB] - priority[rA];
                        return simResults[itemB] - simResults[itemA]; // Then by count desc
                      })
                      .map(([itemName, count]) => {
                        const reward = relic.rewards.find(r => r.itemName === itemName);
                        const rarity = reward?.rarity || 'Common';

                        let rarityColor = 'text-amber-700 dark:text-amber-500';
                        let bgClass = 'bg-orange-100/50 dark:bg-orange-900/20'; // Common (Bronze) - distinct orange-ish
                        if (rarity === 'Uncommon') {
                          rarityColor = 'text-slate-700 dark:text-slate-300 font-medium';
                          bgClass = 'bg-slate-200/50 dark:bg-slate-700/40'; // Uncommon (Silver) - distinct grey
                        }
                        if (rarity === 'Rare') {
                          rarityColor = 'text-yellow-700 dark:text-yellow-400 font-bold';
                          bgClass = 'bg-yellow-200/50 dark:bg-yellow-700/30'; // Rare (Gold) - distinct yellow
                        }

                        return (
                          <div key={itemName} className={`flex justify-between items-center p-2 rounded-lg ${bgClass}`}>
                            <span className={`text-sm ${rarityColor}`}>{translateItemName(itemName)}</span>
                            <span className="text-sm font-bold bg-surface px-2 py-0.5 rounded-md shadow-sm">
                              x{count}
                            </span>
                          </div>
                        );
                      })}
                    {Object.keys(simResults).length === 0 && (
                      <p className="text-center text-sm text-on-surface-variant py-4">結果なし</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-error-container text-on-error-container rounded-lg text-xs flex items-start gap-2">
                <span className="material-symbols-rounded text-sm">info</span>
                <p>シミュレーションは確率に基づくランダムな結果であり、実際のゲーム内でのドロップを保証するものではありません。</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

