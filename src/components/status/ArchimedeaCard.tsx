import React, { useState } from 'react';
import type { Archimedea } from '../../types/warframe';
import {
  translateArchimedeaType,
  translateArchimedeaFaction,
  translateArchimedeaMission,
  translateArchimedeaModifier,
} from '../../utils/translations';
import { ListGroup, ListItem } from '../ui/List';
import { Switch } from '../ui/Switch';
import { Tooltip } from '../ui/Tooltip';
import { getMissionIconName } from '../../utils/missionIcons';

interface ArchimedeaCardProps {
  archimedea: Archimedea;
}

export const ArchimedeaCard: React.FC<ArchimedeaCardProps> = ({ archimedea }) => {
  const [isElite, setIsElite] = useState(false);

  if (!archimedea) return null;

  const title = translateArchimedeaType(archimedea.typeKey);

  // Calculate Time Left Short String
  const expiryDate = new Date(archimedea.expiry);
  const now = new Date();
  const diff = expiryDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const expiryString = days > 0 ? `あと ${days}日` : new Date(diff).toISOString().substr(11, 8); // Simple fallback

  // Personal Modifiers
  const personalModifiers = archimedea.personalModifiers ? archimedea.personalModifiers.map(mod => {
    const { name, desc } = translateArchimedeaModifier(mod.name, mod.description, archimedea.typeKey);
    return { ...mod, translatedName: name, translatedDesc: desc };
  }) : [];

  return (
    <div className="flex flex-col gap-2">
      <ListGroup>
        {/* Header Row */}
        <ListItem className="px-4 py-3 flex items-center justify-between bg-surface-container-high">
          <div className="flex flex-col">
            <span className="font-bold text-on-surface">{title}</span>
            <span className="text-xs text-on-surface-variant font-display">
              {expiryString}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isElite ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
              上級
            </span>
            <Switch checked={isElite} onChange={setIsElite} />
          </div>
        </ListItem>

        {/* Personal Modifiers Row */}
        {personalModifiers.length > 0 && (
          <ListItem className="px-4 py-3 flex flex-col gap-2">
            <span className="text-xs font-bold text-on-surface-variant">パーソナルモディファイア</span>
            <div className="flex flex-wrap gap-2">
              {personalModifiers.map((mod, idx) => (
                <Tooltip key={idx} title={mod.translatedName} content={mod.translatedDesc} placement="left">
                  <div className="px-2 py-1 rounded bg-error-container/30 border border-error/20 text-xs text-on-surface cursor-help transition-colors hover:bg-error-container/50">
                    {mod.translatedName}
                  </div>
                </Tooltip>
              ))}
            </div>
          </ListItem>
        )}

        {/* Missions */}
        {archimedea.missions && archimedea.missions.map((mission, idx) => {
          const missionName = translateArchimedeaMission(mission.missionType, archimedea.typeKey);
          const factionName = translateArchimedeaFaction(mission.faction);

          // Deviation
          const devTrans = translateArchimedeaModifier(mission.diviation.name, mission.diviation.description, archimedea.typeKey);

          // Risks
          const visibleRisks = mission.risks ? mission.risks.filter(risk => {
            if (isElite) return true; // Show all
            return !risk.isHard; // Show only normal
          }) : [];

          return (
            <ListItem key={idx} className="p-4 flex gap-3">
              {/* Icon & Number */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container">
                  <span className="material-symbols-rounded text-on-surface-variant opacity-80 select-none">
                    {getMissionIconName(mission.missionType)}
                  </span>
                </div>
                <span className="text-xl font-bold text-primary font-display">
                  {idx + 1}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-1">
                {/* Mission Type & Faction */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-on-surface">{missionName}</span>
                  <span className="text-xs text-on-surface-variant font-display">
                    {factionName}
                  </span>
                </div>

                {/* Deviation (Red) */}
                <div className="mt-1">
                  <Tooltip title={devTrans.name} content={devTrans.desc} placement="left">
                    <span className="text-sm font-bold text-error cursor-help border-b border-dotted border-error/50 inline-block">
                      {devTrans.name}
                    </span>
                  </Tooltip>
                </div>

                {/* Risks (Normal Color, Tooltip) */}
                {visibleRisks.length > 0 && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                    {visibleRisks.map((risk, rIdx) => {
                      const riskTrans = translateArchimedeaModifier(risk.name, risk.description, archimedea.typeKey);
                      return (
                        <Tooltip key={rIdx} title={riskTrans.name} content={riskTrans.desc} placement="left">
                          <span className={`text-sm cursor-help border-b border-dotted border-on-surface-variant/50 inline-block
                             ${risk.isHard ? 'text-primary font-medium' : 'text-on-surface'}
                           `}>
                            {riskTrans.name} {risk.isHard && <span className="text-[10px] bg-primary text-on-primary px-1 rounded ml-1 align-middle">上級</span>}
                          </span>
                        </Tooltip>
                      );
                    })}
                  </div>
                )}
              </div>
            </ListItem>
          );
        })}
      </ListGroup>
    </div>
  );
};
