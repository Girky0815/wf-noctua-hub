import React from 'react';
import type { DuviriCycle } from '../../types/warframe';
import { SectionTitle } from '../ui/SectionTitle';
import { ListGroup, ListItem } from '../ui/List';
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
  if (!cycle || !cycle.choices) return null;

  const normalChoices = cycle.choices.find(c => c.category === 'normal')?.choices || [];
  const hardChoices = cycle.choices.find(c => c.category === 'hard')?.choices || [];

  const renderSection = (title: string, rawChoices: string[], isSteelPath: boolean) => {
    // Process items (Normalize name, Determine Category, Generate Wiki URL)
    const items = rawChoices.map(rawName => {
      const name = normalizeCircuitItemName(rawName);
      const category = getCircuitItemCategory(name, isSteelPath);
      const wikiUrl = getCircuitWikiUrl(name, category);
      const icon = getCircuitCategoryIcon(category);

      return { name, category, wikiUrl, icon };
    });

    return (
      <div className="flex flex-col gap-1">
        <SectionTitle title={title} className="mb-0" />
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

  return (
    <div className="flex flex-col gap-4">
      {renderSection('サーキット (通常)', normalChoices, false)}
      {renderSection('サーキット (鋼の道のり)', hardChoices, true)}
    </div>
  );
};
