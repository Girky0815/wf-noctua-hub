import React from 'react';
import type { Fissure } from '../../types/warframe';
import { translateMissionType, translateFaction, translateNode, translateTier } from '../../utils/translations';
import { formatTime } from '../../utils/time';
import { useCountdown } from '../../hooks/useCountdown';
import { SettingsSection, SettingsGroup } from '../settings/SettingsCommon';

interface FissureListProps {
  fissures?: Fissure[];
}

// ティアの表示順序
const TIER_ORDER = ['Lith', 'Meso', 'Neo', 'Axi', 'Requiem', 'Omnia'];

const FissureItem: React.FC<{ fissure: Fissure }> = ({ fissure }) => {
  const timeLeft = useCountdown(fissure.expiry);
  const formattedTime = `あと ${timeLeft || '--'} (${formatTime(fissure.expiry)} 終了)`;

  return (
    <div className="flex items-center justify-between bg-surface-bright p-4 text-on-surface">
      <div className="flex flex-col gap-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="font-medium font-display text-base">
            {translateNode(fissure.node)}
          </span>
          {fissure.isHard && <span className="material-symbols-rounded text-sm text-error" title="Steel Path">mode_standby</span>}
          {fissure.isStorm && <span className="material-symbols-rounded text-sm text-secondary" title="Void Storm">rocket_launch</span>}
        </div>

        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <span className="font-display rounded bg-surface-container-highest px-1.5 py-0.5 text-xs font-medium">
            {translateMissionType(fissure.missionType)}
          </span>
          <span>•</span>
          <span>{translateFaction(fissure.enemy)}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 text-xs text-on-surface-variant">
        <span className="font-display tracking-wide" style={{ fontFeatureSettings: "'tnum'" }}>
          {timeLeft || '--'}
        </span>
      </div>
    </div>
  );
};

export const FissureList: React.FC<FissureListProps> = ({ fissures }) => {
  if (!fissures || fissures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-on-surface-variant opacity-60">
        <span className="material-symbols-rounded text-4xl mb-2">filter_drama</span>
        <p>現在発生している亀裂ミッションはありません</p>
      </div>
    );
  }

  // Group by Tier
  const groupedFissures: Record<string, Fissure[]> = {};
  fissures.forEach(f => {
    const tier = f.tier || 'Unknown';
    if (!groupedFissures[tier]) groupedFissures[tier] = [];
    groupedFissures[tier].push(f);
  });

  // Sort groups based on TIER_ORDER
  const sortedTiers = Object.keys(groupedFissures).sort((a, b) => {
    const indexA = TIER_ORDER.indexOf(a);
    const indexB = TIER_ORDER.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="pb-20">
      {sortedTiers.map(tier => (
        <SettingsSection key={tier} title={translateTier(tier)}>
          <SettingsGroup>
            {groupedFissures[tier]
              .sort((a, b) => a.node.localeCompare(b.node))
              .map(f => (
                <FissureItem key={f.id} fissure={f} />
              ))}
          </SettingsGroup>
        </SettingsSection>
      ))}
    </div>
  );
};
