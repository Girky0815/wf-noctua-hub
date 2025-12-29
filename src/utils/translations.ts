export const missionTypes: Record<string, string> = {
  // Basic Mission Types
  'Assassination': '暗殺',
  'Assault': '強襲',
  'Capture': '確保',
  'Defection': '脱出',
  'Defense': '防衛',
  'Disruption': '分裂',
  'Excavation': '発掘',
  'Extermination': '掃滅',
  'Hijack': 'ハイジャック',
  'Infested Salvage': '感染回収',
  'Interception': '傍受',
  'Mobile Defense': '機動防衛',
  'Rescue': '救出',
  'Rush': 'ラッシュ',
  'Sabotage': '妨害',
  'Spy': '潜入',
  'Survival': '耐久',
  'Archwing': 'アークウイング',
  'Arena': 'アリーナ',
  'Skirmish': '深宇宙', // Railjack
  'Volatile': 'オルフィクス', // Railjack/Event? Check Wiki
  'Orphix': 'オルフィクス',

  // Open World / Bounty related
  'Bounty': '依頼',
  'Free Roam': '探検',

  // Duviri / New Types
  'The Circuit': 'サーキット',
  'Lone Story': 'ストーリーのみ',
  'The Duviri Experience': 'デュヴィリ・エクスペリエンス',
  'Alchemy': '錬金術',
  'Netracells': 'ネットセル',
  'Deep Archimedea': '深延アルキメデア',
  'Mirror Defense': 'ミラー防衛',
  'Conjunction Survival': '結合耐久',
  'Void Flood': 'Void フラッド',
  'Void Armageddon': 'Void アルマゲドン',
};

export const resourceTypes: Record<string, string> = {
  'Marks of Valiance': '剛勇の証',
  'Nitain Extract': 'ニタン抽出物',
  'Orokin Catalyst': 'オロキンカタリスト',
  'Orokin Reactor': 'オロキンリアクター',
  'Exilus Adapter': 'エクシラスアダプター',
  'Forma': 'フォーマ',
  // 必要に応じて追加
};

export const translateMissionType = (type: string): string => {
  return missionTypes[type] || type;
};

export const translateResource = (type: string): string => {
  return resourceTypes[type] || type;
};
