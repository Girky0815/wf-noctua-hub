// APIの値を日本語に翻訳するための定数

// ミッションの日本語訳
export const missionTypes: Record<string, string> = {
  // Basic Mission Types
  'Assassination': '抹殺',
  'Assault': '突撃',
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
  'Skirmish': '小戦', // Railjack
  'Volatile': '揮発',
  'Orphix': 'オルフィクス',

  // Open World / Bounty related
  'Bounty': '依頼',
  'Free Roam': '自由行動',

  // Duviri / New Types
  'The Circuit': 'サーキット',
  'Lone Story': 'ローン・ストーリー',
  'The Duviri Experience': 'デュヴィリ・エクスペリエンス',
  'Alchemy': '錬金術',
  'Netracells': 'ネットセル',
  'Deep Archimedea': '深延アルキメデア',
  'Mirror Defense': 'ミラー防衛',
  'Conjunction Survival': '結合耐久',
  'Void Flood': 'フラッド',
  'Corruption': 'フラッド', // 亀裂用
  'Void Cascade': 'カスケード',
  'Void Armageddon': 'アルマゲドン',
};

// リソースアイテムの日本語訳
export const resourceTypes: Record<string, string> = {
  'Marks of Valiance': '剛勇の証',
  'Nitain Extract': 'ニタン抽出物',
  'Orokin Catalyst': 'オロキンカタリスト',
  'Orokin Reactor': 'オロキンリアクター',
  'Exilus Adapter': 'エクシラスアダプター',
  'Forma': 'フォーマ',
  'Detonite Injector': 'デトナイトインジェクター',
  'Fieldron': 'フィールドロン',
  'Mutagen Mass': 'ミュータジェンマス',
  'Alad V Nav Coordinate': 'Alad V ナビ座標',
  'Synthula': 'シンスラ',
  'Kavat Genetic Code': 'キャバット遺伝子コード',
  'Void Traces': 'Void トレース',
  'Kuva': 'クバ',
  'Endo': 'Endo',
  'Credits': 'クレジット',
  // 必要に応じて追加
};

// 敵勢力の日本語訳
export const factionTypes: Record<string, string> = {
  'Orokin': 'オロキン',
  'Grineer': 'グリニア',
  'Corpus': 'コーパス',
  'Infested': '感染体',
  'Narmer': 'ナルメル',
  'Sentient': 'センティエント',
  'Corrupted': 'コラプト',
  'Infestation': '感染体',
  'The Murmur': 'ササヤキ',
  'Scaldra': 'スカルドラ',
  'Techrot': 'テックロット',
  'Anarch': 'アナーク',
};

// 惑星の日本語訳
export const planetNames: Record<string, string> = {
  'Mercury': '水星',
  'Venus': '金星',
  'Earth': '地球',
  'Lua': 'ルア',
  'Mars': '火星',
  'Phobos': 'フォボス',
  'Ceres': 'ケレス',
  'Jupiter': '木星',
  'Europa': 'エウロパ',
  'Saturn': '土星',
  'Uranus': '天王星',
  'Neptune': '海王星',
  'Pluto': '冥王星',
  'Sedna': 'セドナ',
  'Eris': 'エリス',
  'Void': 'Void',
  'Kuva Fortress': 'クバ要塞', // または "Kuva 要塞"
  'Deimos': 'ダイモス', // 旧 Derelict
  'Zariman': 'Zariman',
};

// 侵略ミッション種別
export const invasionDescriptions: Record<string, string> = {
  'Grineer Offensive': 'グリニア 侵攻',
  'Corpus Siege': 'コーパス 進撃',
  'Infested Outbreak': '感染拡大',
  'Phorid Manifestation': 'Phorid 出現',
};

// レリックのティア
export const relicTiers: Record<string, string> = {
  'Lith': 'Lith',
  'Meso': 'Meso',
  'Neo': 'Neo',
  'Axi': 'Axi',
  'Requiem': 'Requiem',
  'Omnia': 'オムニア',
};

export const translateMissionType = (type: string): string => {
  return missionTypes[type] || type;
};

export const translateResource = (type: string): string => {
  return resourceTypes[type] || type;
};

export const translateFaction = (faction: string, node?: string): string => {
  // 特殊な勢力名の上書き
  if (node) {
    if (faction === 'Corpus' && node.includes('Jupiter')) {
      return 'コーパスアマルガム';
    }
    if (faction === 'Grineer' && node.includes('Kuva Fortress')) {
      return 'クバグリニア';
    }
  }
  return factionTypes[faction] || faction;
};

/**
 * ノード名 ("Gut (Saturn)" など) を翻訳する
 * 惑星部分のみ翻訳して "Gut (土星)" のように返す
 */
export const translateNode = (node: string): string => {
  if (!node) return '';
  // "NodeName (Planet)" の形式を想定
  const match = node.match(/^(.+)\s\((.+)\)$/);
  if (match) {
    const [_, name, planet] = match;
    const translatedPlanet = planetNames[planet] || planet;
    return `${name} (${translatedPlanet})`;
  }
  return node;
};

export const translateInvasionDesc = (desc: string): string => {
  return invasionDescriptions[desc] || desc;
};

export const translateTier = (tier: string): string => {
  return relicTiers[tier] || tier;
};
