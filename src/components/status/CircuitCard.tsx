import React, { useState } from 'react';
import type { DuviriCycle } from '../../types/warframe';
import { SectionTitle } from '../ui/SectionTitle';
import { ListGroup, ListItem } from '../ui/List';
import { Switch } from '../ui/Switch';
import {
  normalizeCircuitItemName,
  getCircuitItemCategory,
  getCircuitWikiUrl,
  getCircuitCategoryIcon
} from '../../utils/circuitUtils';

interface CircuitCardProps {
  cycle?: DuviriCycle;
}

export const CircuitCard: React.FC<CircuitCardProps> = ({ cycle }) => {
  const [isSteelPath, setIsSteelPath] = useState(false);

  if (!cycle || !cycle.choices) return null;

  const normalChoices = cycle.choices.find(c => c.category === 'normal')?.choices || [];
  const hardChoices = cycle.choices.find(c => c.category === 'hard')?.choices || [];

  const rawChoices = isSteelPath ? hardChoices : normalChoices;
  const title = isSteelPath ? 'サーキット (鋼の道のり)' : 'サーキット (通常)';
  const subtitle = ''; // サブタイトル不要
  // const subtitle = isSteelPath
  //   ? 'インカーノン・ジェネシス (2つ選択)'
  //   : 'Warframe (1つ選択)';

  // Process items (Normalize name, Determine Category, Generate Wiki URL)
  const items = rawChoices.map(rawName => {
    const name = normalizeCircuitItemName(rawName);
    const category = getCircuitItemCategory(name, isSteelPath);
    const wikiUrl = getCircuitWikiUrl(name, category);
    const icon = getCircuitCategoryIcon(category);

    return { name, category, wikiUrl, icon };
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <SectionTitle title={title} />
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold transition-colors ${isSteelPath ? 'text-on-surface' : 'text-on-surface-variant'}`}>
            鋼の道のり
          </span>
          <Switch
            checked={isSteelPath}
            onChange={setIsSteelPath}
          />
        </div>
      </div>

      <div className="px-2 text-xs text-on-surface-variant -mt-1 mb-1">
        {subtitle}
      </div>

      <ListGroup>
        {items.map((item, index) => (
          <ListItem
            key={`${item.name}-${index}`}
            className="flex items-center justify-between p-4"
            onClick={() => window.open(item.wikiUrl, '_blank')}
          >
            <div className="flex items-center gap-3">
              <span className={`material-symbols-rounded text-primary ${isSteelPath ? 'text-xl' : 'text-2xl'}`}>
                {item.icon}
              </span>
              <span className="font-bold text-on-surface">
                {item.name}
              </span>
            </div>
            <span className="material-symbols-rounded text-on-surface-variant/50 text-[20px]">
              chevron_right
            </span>
          </ListItem>
        ))}
        {items.length === 0 && (
          <ListItem className="p-6 text-center text-on-surface-variant">
            <p className="text-sm">情報がありません</p>
          </ListItem>
        )}
      </ListGroup>
    </div>
  );
};
