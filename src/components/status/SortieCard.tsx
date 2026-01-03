import React from 'react';
import type { Sortie } from '../../types/warframe';
import { translateMissionType, translateNode, translateFaction, translateSortieModifier, translateSortieDescription } from '../../utils/translations';
import { ListGroup, ListItem } from '../ui/List';
import { Tooltip } from '../ui/Tooltip';

interface SortieCardProps {
  sortie?: Sortie;
}

const STAGE_NUMBERS = ['1', '2', '3'];

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
        // descriptionも翻訳する (Modifierを渡して特定の翻訳を上書き可能にする)
        description: translateSortieDescription(v.modifier),
        badge: translateSortieModifier(v.modifier), // 赤字で表示する短いテキスト
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
    <ListGroup>
      {items.length === 0 ? (
        <ListItem className="px-4 py-8 text-center text-sm text-on-surface-variant">
          ミッション情報がありません
        </ListItem>
      ) : (
        items.map((item, index) => {
          return (
            <ListItem
              key={`${sortie.id}-${index}`}
              className="flex items-center gap-3 p-4"
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
                {/* ミッションタイプ以外の情報がない場合(アルコンの通常ステージ等)の考慮 */}
                {/* descriptionやbadgeがある場合のみ表示、ただしアルコンのLevels表示はInlineのままにする？ 
                    user request focused on "Description is tooltip".
                    Sortie variants have badges (Modifier Name) and Descriptions.
                */}
                {/* Variants (Sortie Modifiers) */}
                {hasVariants && (
                  <div className="text-sm">
                    <span className="font-bold text-error">{item.badge}</span>
                  </div>
                )}

                {/* Non-Variants (e.g. Archon Hunt levels) */}
                {!hasVariants && (
                  <div className="text-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-rounded text-base">swords</span>
                      {item.description}
                    </span>
                  </div>
                )}
              </div>

              {/* Tooltip for Sortie Modifiers */}
              {hasVariants && (
                <Tooltip
                  title={item.badge} // Translated Modifier Name
                  content={item.description} // Description part only (Already translated)
                >
                  <div className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-surface-container-highest transition-colors text-error cursor-pointer">
                    <span className="material-symbols-rounded">info</span>
                  </div>
                </Tooltip>
              )}
            </ListItem>
          );
        }))}
    </ListGroup>
  );
};
