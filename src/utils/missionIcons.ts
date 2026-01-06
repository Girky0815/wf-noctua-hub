export const getMissionIconName = (missionType: string): string => {
  const lower = missionType.toLowerCase();
  if (lower.includes('defense')) return 'shield';
  if (lower.includes('survival')) return 'timer';
  if (lower.includes('exterminat')) return 'swords'; // 'skull' not reliable in all fonts
  if (lower.includes('assassinat')) return 'adjust'; // target-like
  if (lower.includes('disruption')) return 'key';
  if (lower.includes('alchemy')) return 'science'; // or 'experiment'
  if (lower.includes('void flood')) return 'water_drop';
  if (lower.includes('void cascade')) return 'waves';
  if (lower.includes('void armageddon')) return 'priority_high';
  if (lower.includes('spy')) return 'visibility';
  if (lower.includes('rescue')) return 'lock_open';
  if (lower.includes('capture')) return 'person_search'; // or 'run_circle'
  if (lower.includes('mobile defense')) return 'security';
  if (lower.includes('sabotage')) return 'build';
  if (lower.includes('hive')) return 'bug_report';
  if (lower.includes('hijack')) return 'directions_car';

  // Archimedea specifics
  if (lower.includes('legacyte')) return 'diamond'; // Legacyte Harvest

  return 'swords'; // Default
};
