import React from 'react';
import type { Fissure } from '../../types/warframe';
import { translateMissionType, translateFaction, translateNode, translateTier } from '../../utils/translations';
import { useCountdown } from '../../hooks/useCountdown';
import { SectionTitle } from '../ui/SectionTitle';
import { ListGroup, ListItem, ListTile } from '../ui/List';

const FissureItem: React.FC<{ fissure: Fissure }> = ({ fissure }) => {
  const timeLeft = useCountdown(fissure.expiry);
  const faction = translateFaction(fissure.enemy);
  const missionType = translateMissionType(fissure.missionType);
  const node = translateNode(fissure.node);

  return (
    <ListTile
      title={missionType}
      subtitle={
        <span className="flex items-center gap-1">
          {node} • {faction}
        </span>
      }
      trailing={
        <div className="flex items-center gap-2">
          <span
            className="text-sm bg-surface-container-highest px-2 py-0.5 rounded text-on-surface-variant"
            style={{
              fontFamily: "'Google Sans Flex', sans-serif",
              fontFeatureSettings: "'tnum' 1"
            }}
          >
            {timeLeft}
          </span>
        </div>
      }
    />
  );
};

const TIER_ORDER = ['Lith', 'Meso', 'Neo', 'Axi', 'Requiem', 'Omnia'];

interface FissureListProps {
  fissures: Fissure[];
  isStale?: boolean;
}


export const FissureList: React.FC<FissureListProps> = ({ fissures, isStale }) => {
  if (!fissures || fissures.length === 0) {
    return (
      <ListGroup>
        <ListItem className="p-6 text-center text-on-surface-variant">
          <div className="mb-2">
            <span className="material-symbols-rounded text-3xl opacity-50">
              {isStale ? 'manage_history' : 'filter_drama'}
            </span>
          </div>
          <p className="text-sm">
            {isStale
              ? 'APIデータ更新待ち (有効な亀裂なし)'
              : '現在発生している亀裂ミッションはありません'}
          </p>
        </ListItem>
      </ListGroup>
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
        <div key={tier} className="mb-6">
          <SectionTitle title={translateTier(tier)} />
          <ListGroup>
            {groupedFissures[tier]
              .sort((a, b) => a.node.localeCompare(b.node))
              .map(f => (
                <FissureItem key={f.id} fissure={f} />
              ))}
          </ListGroup>
        </div>
      ))}
    </div>
  );
};
