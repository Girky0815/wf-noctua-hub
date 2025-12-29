import React from 'react';
import type { Invasion } from '../../types/warframe';
import { translateResource, translateNode, translateFaction } from '../../utils/translations';
import { useCountdown } from '../../hooks/useCountdown';

interface InvasionListProps {
  invasions?: Invasion[];
}

const InvasionItem: React.FC<{ invasion: Invasion }> = ({ invasion }) => {
  // invasion.completion (float -100 to 100 usually, or 0 to 100)
  // invasion.completion (float -100 to 100 usually, or 0 to 100)
  // warframestat.us: completion: 55.5 (meaning 55.5% usually towards attacker?) 
  // construction progress etc varies.
  // Assuming completion > 0 means Defender is winning properly? Or Attacker?
  // Usually: < 0 (Corpus/Attacker wins), > 0 (Grineer/Defender wins).
  // API details: completion is percentage. positive -> defender winning?
  // Let's simplify: Show attacker and defender rewards.

  // 報酬
  const attackerReward = invasion.attacker.reward?.asString
    ? invasion.attacker.reward.items.map(translateResource).join(' + ') || invasion.attacker.reward.asString
    : '';
  const defenderReward = invasion.defender.reward?.asString
    ? invasion.defender.reward.items.map(translateResource).join(' + ') || invasion.defender.reward.asString
    : '';

  // 勢力
  const attackerFaction = translateFaction(invasion.attacker.faction);
  const defenderFaction = translateFaction(invasion.defender.faction);

  return (
    <div className="bg-surface-bright p-4 first:rounded-t-3xl last:rounded-b-3xl">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-on-surface-variant font-display">{translateNode(invasion.node)}</span>
        <span className="text-xs text-on-surface-variant">{invasion.desc}</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Attacker Info */}
        <div className="flex flex-1 flex-col items-start overflow-hidden">
          <span className="text-xs font-bold text-on-surface">{attackerFaction}</span>
          <span className="truncate text-sm font-medium text-secondary">{attackerReward || '-'}</span>
        </div>

        {/* VS / Progress */}
        <div className="flex flex-col items-center px-2">
          <span className="text-xs font-bold opacity-50">VS</span>
        </div>

        {/* Defender Info */}
        <div className="flex flex-1 flex-col items-end overflow-hidden">
          <span className="text-xs font-bold text-on-surface">{defenderFaction}</span>
          <span className="truncate text-sm font-medium text-primary text-right">{defenderReward || '-'}</span>
        </div>
      </div>

      {/* Progress Bar (Mock visual) */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
        {/* If we strictly parsed completion we could show a bar. For now, static base is fine or we parse later. */}
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${Math.max(0, Math.min(100, invasion.completion))}%` }}
        />
      </div>
    </div>
  );
};

export const InvasionList: React.FC<InvasionListProps> = ({ invasions }) => {
  // 完了していない侵略のみ表示
  const activeInvasions = invasions?.filter(i => !i.completed && !i.msg); // msg property often used for Outbreak text if separate

  if (!activeInvasions || activeInvasions.length === 0) return null;

  return (
    <div className="rounded-3xl bg-surface-bright p-5">
      <h3 className="mb-4 text-lg font-bold text-on-surface font-display">侵略ミッション</h3>
      <div className="flex flex-col gap-[2px] overflow-hidden rounded-3xl border-[2px] border-surface-container bg-surface-container">
        {activeInvasions.map(invasion => (
          <InvasionItem key={invasion.id} invasion={invasion} />
        ))}
      </div>
    </div>
  );
};
