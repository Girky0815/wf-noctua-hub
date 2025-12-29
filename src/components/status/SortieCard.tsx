import React from 'react';
import type { Sortie } from '../../types/warframe';
import { translateMissionType, translateNode, translateFaction } from '../../utils/translations';

interface SortieCardProps {
  sortie?: Sortie;
}

const STAGE_NUMBERS = ['①', '②', '③'];

export const SortieCard: React.FC<SortieCardProps> = ({ sortie }) => {
  if (!sortie) return <div className="h-40 animate-pulse rounded-3xl bg-surface-container-high" />;

  const isArchon = sortie.boss.includes('Archon');
  const title = isArchon ? 'アルコン討伐戦' : '今日のソーティ';

  // データ正規化: variantsがある場合はそれを使用、なければmissionsを使用（アルコン討伐戦）
  const hasVariants = sortie.variants && sortie.variants.length > 0;
  const hasMissions = sortie.missions && sortie.missions.length > 0;

  // 表示用データの構築
  const items = React.useMemo(() => {
    if (hasVariants) {
      return sortie.variants.map(v => ({
        missionType: v.missionType,
        node: v.node,
        description: `${v.modifier}: ${v.modifierDescription}`,
        badge: v.modifier, // 赤字で表示する短いテキスト
        isTranslated: false
      }));
    }
    if (hasMissions && sortie.missions) {
      const levels = ['130-135', '135-140', '145-150'];
      return sortie.missions.map((m, i) => {
        let typeName = translateMissionType(m.type);
        // アルコン討伐戦の3ステージ目(Assassination)は「決戦」
        if (isArchon && i === 2 && m.type === 'Assassination') {
          // "Archon Amar" -> "Amar アルコン"
          const bossName = sortie.boss.replace('Archon ', '');
          typeName = `決戦 (${bossName} アルコン)`;
        }
        return {
          missionType: typeName, // 既に翻訳/置換済みとして扱う
          node: m.node,
          description: `ナルメル ${levels[i]}`, // descriptionエリアにレベルを表示
          badge: `Lv.${levels[i]}`, // badgeエリアにもレベルを表示
          isTranslated: true
        };
      });
    }
    return [];
  }, [sortie, hasVariants, hasMissions, isArchon]);


  // レンダリング
  return (
    <div className="flex flex-col gap-[2px] overflow-hidden rounded-3xl border-[2px] border-surface-container bg-surface-container">
      {items.length === 0 ? (
        <div className="bg-surface-bright px-4 py-8 text-center text-sm text-on-surface-variant">
          ミッション情報がありません
        </div>
      ) : (
        items.map((item, index) => {
          return (
            <div
              key={`${sortie.id}-${index}`}
              className="flex items-center gap-3 bg-surface-bright p-4"
            >
              {/* ステージ番号 */}
              <div className="text-lg font-bold text-primary opacity-80 font-display">
                {STAGE_NUMBERS[index] || (index + 1)}
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-on-surface">
                    {item.isTranslated ? item.missionType : translateMissionType(item.missionType)}
                  </span>
                  <span className="text-xs text-on-surface-variant font-display">{translateNode(item.node)}</span>
                </div>
                <div className="text-sm text-on-surface-variant">
                  {hasVariants ? (
                    // ソーティ: 条件などを表示
                    <>
                      <span className="font-bold text-error">{item.badge}</span>: {item.description.split(': ')[1]}
                    </>
                  ) : (
                    // アルコン: レベルを表示
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-rounded text-base">swords</span>
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        }))}
    </div>
  );
};
