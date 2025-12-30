import React from 'react';
import type { VaultTrader } from '../../types/warframe';
import { normalizeResurgenceItem, type ResurgenceCategory } from '../../utils/resurgenceMappings';

interface ResurgenceCardProps {
  trader?: VaultTrader;
}

const getCategoryIcon = (category: ResurgenceCategory): string => {
  switch (category) {
    case 'Warframe': return 'accessibility_new';
    case 'Primary': return 'location_searching'; // or similar
    case 'Secondary': return 'filter_center_focus';
    case 'Melee': return 'swords';
    case 'Companion': return 'drone';
    case 'Archwing': return 'flight';
    default: return 'change_history';
  }
};

export const ResurgenceCard: React.FC<ResurgenceCardProps> = ({ trader }) => {
  if (!trader) return null;

  // 1. Filter & Map items
  const processedItems = React.useMemo(() => {
    return trader.inventory
      .filter(r => {
        const type = (r.attributes?.itemType || r.type || '').toLowerCase();
        const name = r.item?.toLowerCase() || '';

        // Basic Keep Logic
        let keep = false;
        if (type.includes('warframe') || type.includes('weapon')) keep = true;

        // Name-based inclusion/exclusion
        if (name.includes('prime')) keep = true;

        if (name.includes('bobblehead')) return false;
        if (name.endsWith('bobble head')) return false;
        if (name.startsWith('m p v')) return false;
        if (name.includes('glyph')) return false;
        if (name.includes('sigil')) return false;
        if (name.includes('skin')) return false;
        if (name.includes('armor')) return false;
        if (name.includes('syandana')) return false;
        if (name.includes('sugatra')) return false;
        if (name.includes('helmet')) return false;
        if (name.includes('dangle')) return false;
        if (name.includes('pack')) return false;
        if (!keep) return false;

        return true;
      })
      .map(item => {
        const { name, category } = normalizeResurgenceItem(item.item);
        return {
          originalItem: item,
          displayName: name,
          category,
          cost: item.cost
        };
      });
  }, [trader.inventory]);

  // 2. Deduplicate
  const uniqueItems = React.useMemo(() => {
    const seen = new Set<string>();
    return processedItems.filter(item => {
      if (seen.has(item.displayName)) return false;
      seen.add(item.displayName);
      return true;
    }).sort((a, b) => {
      // Sort by Category order then Name
      const order = ['Warframe', 'Primary', 'Secondary', 'Melee', 'Companion', 'Archwing', 'Unknown'];
      const catDiff = order.indexOf(a.category) - order.indexOf(b.category);
      if (catDiff !== 0) return catDiff;
      return a.displayName.localeCompare(b.displayName);
    });
  }, [processedItems]);


  return (
    <div className="flex flex-col gap-[2px] overflow-hidden rounded-3xl border-[2px] border-surface-container bg-surface-container">
      {uniqueItems.length > 0 ? (
        uniqueItems.map((item, index) => (
          <div key={`${item.displayName}-${index}`} className="bg-surface-bright p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`material-symbols-rounded text-primary 
                ${item.category === 'Warframe' ? 'text-[24px]' : 'text-[20px]'}
              `}>
                {getCategoryIcon(item.category)}
              </span>
              <span className="font-bold text-on-surface">
                {item.displayName}
              </span>
            </div>
            {item.cost && (
              <div className="flex items-center gap-1 text-sm bg-surface-container-high px-2 py-1 rounded-full text-on-surface-variant">
                <span className="font-bold">{item.cost}</span>
                <span className="text-xs">Aya</span>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-surface-bright p-6 text-center text-on-surface-variant">
          <p className="text-sm">表示可能なPrimeアイテムがありません</p>
        </div>
      )}
    </div>
  );
};
