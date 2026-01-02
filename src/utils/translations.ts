// APIの値を日本語に翻訳するための定数

// ミッションの日本語訳
export const missionTypes: Record<string, string> = {
  // Basic Mission Types
  'Assassination': '抹殺',
  'Assault': '突撃',
  'Capture': '確保',
  'Defection': '脱出',
  'Hive': '駆除',
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

// ソーティの状況(デバフ)の日本語訳
// プレフィックス付きのmodifierに対応するためのマッピング
// APIからは "Enemy Elemental Enhancement: Electricity" のような形式で返ってくることがある
export const sortieModifiers: Record<string, string> = {
  // 環境異常 (Environmental Effect)
  'Environmental Effect: Extreme Cold': '極寒',
  'Environmental Effect: Dense Fog': '濃霧',
  'Environmental Effect: Cryogenic Leakage': '冷却液漏洩',
  'Environmental Effect: Fire': '火災',
  'Environmental Effect: Electromagnetic Anomalies': '電磁気異常',
  'Environmental Effect: Radiation Hazard': '放射線障害',
  'Environmental Effect: Low Gravity': '低重力',
  'Environmental Effect: Energy Reduction': 'エネルギー減少',

  // 物理強化 (Enemy Physical Enhancement)
  'Enemy Physical Enhancement: Slash': '敵物理強化 (切断)',
  'Enemy Physical Enhancement: Impact': '敵物理強化 (衝撃)',
  'Enemy Physical Enhancement: Puncture': '敵物理強化 (貫通)',

  // 属性強化 (Enemy Elemental Enhancement)
  'Enemy Elemental Enhancement: Heat': '敵属性強化 (火炎)',
  'Enemy Elemental Enhancement: Cold': '敵属性強化 (冷気)',
  'Enemy Elemental Enhancement: Electricity': '敵属性強化 (電気)',
  'Enemy Elemental Enhancement: Toxin': '敵属性強化 (毒)',
  'Enemy Elemental Enhancement: Blast': '敵属性強化 (爆発)',
  'Enemy Elemental Enhancement: Corrosive': '敵属性強化 (腐食)',
  'Enemy Elemental Enhancement: Gas': '敵属性強化 (ガス)',
  'Enemy Elemental Enhancement: Magnetic': '敵属性強化 (磁気)',
  'Enemy Elemental Enhancement: Radiation': '敵属性強化 (放射線)',
  'Enemy Elemental Enhancement: Viral': '敵属性強化 (感染)',

  // 基本的なmodifier (プレフィックスなし、またはその他)
  'Augmented Enemy Armor': '敵装甲強化',
  'Augmented Enemy Shields': '敵シールド増強',
  'Eximus Stronghold': 'エクシマスの要塞',
  'Sniper Only': 'スナイパーのみ',
  'Assault Rifle Only': 'アサルトライフルのみ',
  'Melee Only': '近接のみ',
  'Bow Only': '弓のみ',
  'Pistol Only': 'ピストルのみ',
  'Shotgun Only': 'ショットガンのみ',
  'Weapon Restriction': '武器制限',
};

// ソーティの詳細説明(ヒント)の日本語訳
export const sortieDescriptions: Record<string, string> = {
  // Elemental / Physical Enhancement (Generic pattern often used)
  // 'Enemies deal extra Slash damage and have extra Slash resistance': '敵の切断ダメージが増加し、切断耐性を持つ。',
  // 'Enemies deal extra Impact damage and have extra Impact resistance': '敵の衝撃ダメージが増加し、衝撃耐性を持つ。',
  // 'Enemies deal extra Puncture damage and have extra Puncture resistance': '敵の貫通ダメージが増加し、貫通耐性を持つ。',
  // 'Enemies deal extra Heat damage and have extra Heat resistance': '敵の火炎ダメージが増加し、火炎耐性を持つ。',
  // 'Enemies deal extra Cold damage and have extra Cold resistance': '敵の冷気ダメージが増加し、冷気耐性を持つ。',
  // 'Enemies deal extra Electricity damage and have extra Electricity resistance': '敵の電気ダメージが増加し、電気耐性を持つ。',
  // 'Enemies deal extra Toxin damage and have extra Toxin resistance': '敵の毒ダメージが増加し、毒耐性を持つ。',
  // 'Enemies deal extra Blast damage and have extra Blast resistance': '敵の爆発ダメージが増加し、爆発耐性を持つ。',
  // 'Enemies deal extra Corrosive damage and have extra Corrosive resistance': '敵の腐食ダメージが増加し、腐食耐性を持つ。',
  // 'Enemies deal extra Gas damage and have extra Gas resistance': '敵のガスダメージが増加し、ガス耐性を持つ。',
  // 'Enemies deal extra Magnetic damage and have extra Magnetic resistance': '敵の磁気ダメージが増加し、磁気耐性を持つ。',
  // 'Enemies deal extra Radiation damage and have extra Radiation resistance': '敵の放射線ダメージが増加し、放射線耐性を持つ。',
  // 'Enemies deal extra Viral damage and have extra Viral resistance': '敵のウイルスダメージが増加し、ウイルス耐性を持つ。',

  // Environmental
  'Warframe shields are reduced by 50%': 'Warframeの最大シールドが50%減少する。', // Cryogenic Leakage / Extreme Cold
  'Visibility is reduced': '視界が悪化し、敵の射程と精度が低下する。', // Dense Fog
  'Areas of the level are engulfed in fire': 'エリアの一部が炎に包まれ、炎に触れると火炎状態異常になる。敵の攻撃に50%火炎ダメージが付与される。Warframeの最大ヘルスが半減し、シールドリチャージが大幅に低下する。', // Fire
  'Gravity is reduced': '重力が低下する。', // Low Gravity
  'Clouds of radiation cover the area': '放射線の雲(緑色)が発生し、触れると放射線状態異常になる。', // Radiation Hazard
  'Random locations will be struck by magnetic anomalies': 'エリアが低重力になり、磁気雲(青色)が発生する(電気/磁気/Voidで一時的に除去可)。磁気雲に触れると磁気状態異常になる。', // Electromagnetic Anomalies
  'Max Energy is 25% of normal': 'Warframeの最大エネルギーが通常の25%になる。', // Energy Reduction

  // Buffs
  'Enemies have enhanced Armor': '敵の装甲値が+300%。', // Augmented Enemy Armor
  'Enemies have enhanced shields': '敵のシールドが+300%。', // Augmented Enemy Shields
  'More Eximus units will appear': 'エクシマスユニットの出現率が大幅に上昇する。', // Eximus Stronghold

  // Weapon Restrictions (Simple match)
  'Only Sniper Rifles can be used': 'スナイパーライフルのみ使用可能。',
  'Only Assault Rifles can be used': 'アサルトライフルのみ使用可能。',
  'Only Melee weapons can be used': '近接武器のみ使用可能。',
  'Only Bows can be used': '弓のみ使用可能。',
  'Only Secondary weapons can be used': 'セカンダリ武器のみ使用可能。', // Pistol Only maps to this usually? Or "Only Pistols..."? API varies.
  'Only Shotguns can be used': 'ショットガンのみ使用可能。',

  // Short descriptions from API (fallback mapping)
  //   'Slash': '敵の切断ダメージが増加し、切断耐性を持つ。',
  //   'Impact': '敵の衝撃ダメージが増加し、衝撃耐性を持つ。',
  //   'Puncture': '敵の貫通ダメージが増加し、貫通耐性を持つ。',
  //   'Heat': '敵の火炎ダメージが増加し、火炎耐性を持つ。',
  //   'Cold': '敵の冷気ダメージが増加し、冷気耐性を持つ。',
  //   'Electricity': '敵の電気ダメージが増加し、電気耐性を持つ。',
  //   'Toxin': '敵の毒ダメージが増加し、毒耐性を持つ。',
  //   'Blast': '敵の爆発ダメージが増加し、爆発耐性を持つ。',
  //   'Corrosive': '敵の腐食ダメージが増加し、腐食耐性を持つ。',
  //   'Gas': '敵のガスダメージが増加し、ガス耐性を持つ。',
  //   'Magnetic': '敵の磁気ダメージが増加し、磁気耐性を持つ。',
  //   'Radiation': '敵の放射線ダメージが増加し、放射線耐性を持つ。',
  //   'Viral': '敵のウイルスダメージが増加し、ウイルス耐性を持つ。',
  //   'Extreme Cold': 'Warframeの最大シールドが50%減少する。',
  //   'Dense Fog': '視界が悪化し、敵の射程と精度が低下する。',
  //   'Fire': 'エリアの一部が炎に包まれ、触れると火炎状態異常になる。',
  //   'Low Gravity': '重力が低下する。',
  //   'Radiation Hazard': '放射線の雲が発生し、触れると放射線状態異常になる。',
  //   'Electromagnetic Anomalies': '磁気異常が発生し、HUDの乱れやエネルギー減少を引き起こす。',
  //   'Energy Reduction': 'Warframeの最大エネルギーが通常の25%になる。',
};

export const translateSortieModifier = (modifier: string): string => {
  // 完全一致をトライ
  if (sortieModifiers[modifier]) {
    return sortieModifiers[modifier];
  }

  // もし辞書にない場合、部分的なプレフィックス除去を試みることも可能だが、
  // 現状は辞書を充実させる方針とする。
  // 必要であればここで "Environmental Effect: " などを削除して再検索するロジックを追加する。
  return modifier;
};

export const translateSortieDescription = (description: string): string => {
  // 1. 完全一致 (辞書にある場合)
  if (sortieDescriptions[description]) {
    return sortieDescriptions[description];
  }

  // 2. パターンマッチング (辞書にない場合の柔軟な対応)

  // Physical / Elemental Enhancement Patterns
  // Pattern A: "Enemies deal extra [Type] damage and have extra [Type] resistance"
  // Pattern B: "Enemies deal increased [Type] damage and also have increased Immunity to said damage type"
  // Pattern C: "Enemies can deal enhanced [Type] damage. Finishing damage is not resisted."

  if (description.includes('damage')) {
    // 物理 (Physical)
    if (description.match(/Slash/i)) return '敵の切断ダメージが+100%増加し、85%の物理ダメージ耐性を持つ。';
    if (description.match(/Impact/i)) return '敵の衝撃ダメージが+100%増加し、85%の物理ダメージ耐性を持つ。';
    if (description.match(/Puncture/i)) return '敵の貫通ダメージが+100%増加し、85%の物理ダメージ耐性を持つ。';

    // 属性 (Elemental)
    if (description.match(/Heat|Fire/i)) return '敵の火炎ダメージが+100%増加し、85%の属性ダメージ耐性を持つ。';
    if (description.match(/Cold|Freeze/i)) return '敵の冷気ダメージが+100%増加し、85%の属性ダメージ耐性を持つ。';
    if (description.match(/Electricity|Electric/i)) return '敵の電気ダメージが+100%増加し、85%の属性ダメージ耐性を持つ。';
    if (description.match(/Toxin|Poison/i)) return '敵の毒ダメージが+100%増加し、85%の属性ダメージ耐性を持つ。';
    if (description.match(/Blast/i)) return '敵の爆発ダメージが+100%増加し、85%の属性ダメージ耐性を持つ。';
    if (description.match(/Corrosive/i)) return '敵の腐食ダメージが+100%増加し、85%の属性ダメージ耐性を持つ。';
    if (description.match(/Gas/i)) return '敵のガスダメージが+100%増加し、85%の属性ダメージ耐性を持つ。';
    if (description.match(/Magnetic/i)) return '敵の磁気ダメージが+100%増加し、85%の属性ダメージ耐性を持つ。';
    if (description.match(/Radiation/i)) return '敵の放射線ダメージが+100%増加し、85%の属性ダメージ耐性を持つ。';
    if (description.match(/Viral/i)) return '敵の感染ダメージが+100%増加し、85%の属性ダメージ耐性を持つ。';
  }

  // 環境異常系 (Environmental)
  if (description.includes('Mobility') || description.match(/Fog|Visible/i) || description.match(/Fire|Flame/i) || description.match(/Gravity/i) || description.match(/Radiation/i) || description.match(/Magnetic/i) || description.match(/Energy/i) || description.match(/Shield/i) || description.match(/Health/i)) {
    if (description.match(/Mobility|Cold|Freeze|Ice/i)) return 'Warframeの最大シールドが50%減少する。';
    if (description.match(/Fog|Visible|Mist/i)) return '視界が悪化し、敵の射程と精度が低下する。';
    if (description.match(/Fire|Flame|Heat/i)) return 'エリアの一部が炎に包まれ、炎に触れると火炎状態異常になる。敵の攻撃に50%火炎ダメージが付与される。Warframeの最大ヘルスが半減し、シールドリチャージが大幅に低下する。';
    if (description.match(/Low Gravity|Gravity/i)) return '重力が低下する。';
    if (description.match(/Radiation/i)) return '放射線の雲(緑色)が発生し、触れると放射線状態異常になる。';
    if (description.match(/Magnetic/i)) return 'エリアが低重力になり、磁気雲(青色)が発生する(電気/磁気/Voidで一時的に除去可)。磁気雲に触れると磁気状態異常になる。';
    if (description.match(/Energy/i)) return 'Warframeの最大エネルギーが通常の25%になる。';
  }

  // Weapon Restriction Patterns
  // "Only ... can be used..."
  if (description.includes('Only') && description.includes('can be used')) {
    if (description.match(/Sniper/i)) return 'スナイパーライフルのみ使用可能。';
    if (description.match(/Assault Rifle/i)) return 'アサルトライフルのみ使用可能。';
    if (description.match(/Melee/i)) return '近接武器のみ使用可能。';
    if (description.match(/Bow/i)) return '弓のみ使用可能。';
    if (description.match(/Pistols|Secondary/i)) return 'セカンダリ武器のみ使用可能。';
    if (description.match(/Shotgun/i)) return 'ショットガンのみ使用可能。';
  }

  // フォールバック: 翻訳できなかった場合はそのまま返す
  return description;
};
