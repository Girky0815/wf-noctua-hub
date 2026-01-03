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

// ボス名の日本語訳
export const bossNames: Record<string, string> = {
  'Tyl Regor': 'Tyl Regor', // 原文のままが多いため一旦そのまま定義、必要に応じてカタカナ化
  'Hyena Pack': 'Hyena Pack',
  'Ambulas': 'Ambulas',
  'Kela De Thaym': 'Kela De Thaym',
  'Ropalolyst': 'ロパロリスト',
  'Phorid': 'Phorid',
  'Lephantis': 'Lephantis',
  'Vay Hek': 'Vay Hek',
  // 必要に応じて追加
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

export const translateBoss = (boss: string): string => {
  return bossNames[boss] || boss;
};

// ソーティの状況(デバフ)の日本語訳
// プレフィックス付きのmodifierに対応するためのマッピング
// APIからは "Enemy Elemental Enhancement: Electricity" のような形式で返ってくることがある
// ソーティの状況(デバフ)の日本語訳 (基本単語のみ定義)
export const sortieModifiers: Record<string, string> = {
  // 環境異常 (Environmental Effect / Hazard)
  'Extreme Cold': '極寒',
  'Dense Fog': '濃霧',
  'Cryogenic Leakage': '極低温漏出',
  'Fire': '火災',
  'Electromagnetic Anomalies': '電磁変異',
  'Radiation Hazard': '放射線障害',
  'Radiation Pockets': '放射線障害',
  'Low Gravity': '低重力',
  'Energy Reduction': 'エネルギー減少',

  // 物理/属性 (Physical / Elemental)
  'Slash': '切断',
  'Impact': '衝撃',
  'Puncture': '貫通',
  'Heat': '火炎',
  'Cold': '冷気',
  'Electricity': '電気',
  'Toxin': '毒',
  'Blast': '爆発',
  'Corrosive': '腐食',
  'Gas': 'ガス',
  'Magnetic': '磁気',
  'Radiation': '放射線',
  'Viral': '感染',

  // 基本的なmodifier (プレフィックスなし、またはその他)
  'Augmented Enemy Armor': '敵アーマー増強',
  'Augmented Enemy Shields': '敵シールド増強',
  'Eximus Stronghold': 'エクシマスの要塞',

  // 武器制限 (Weapon Restriction)
  'Sniper Only': '精密ライフルのみ',
  'Assault Rifle Only': 'アサルトライフルのみ',
  'Melee Only': '近接のみ',
  'Bow Only': '弓のみ',
  'Pistol Only': 'ピストルのみ',
  'Shotgun Only': 'ショットガンのみ',

  // その他
  'Weapon Restriction': '武器制限',
};

export const translateSortieModifier = (modifier: string): string => {
  // 1. 完全一致
  if (sortieModifiers[modifier]) {
    return sortieModifiers[modifier];
  }

  // 2. プレフィックス処理
  const prefixes = [
    { prefix: 'Environmental Effect: ', template: (s: string) => s }, // そのまま
    { prefix: 'Environmental Hazard: ', template: (s: string) => s }, // そのまま
    { prefix: 'Enemy Physical Enhancement: ', template: (s: string) => `敵物理強化 (${s})` },
    { prefix: 'Enemy Elemental Enhancement: ', template: (s: string) => `敵属性強化 (${s})` },
    { prefix: 'Weapon Restriction: ', template: (s: string) => `武器制限: ${s}` },
  ];

  for (const { prefix, template } of prefixes) {
    if (modifier.startsWith(prefix)) {
      const core = modifier.substring(prefix.length);
      const translatedCore = sortieModifiers[core] || core;
      return template(translatedCore);
    }
  }

  return modifier;
};

// ソーティの詳細説明(ヒント)の日本語訳
// ソーティの詳細説明(ヒント)の日本語訳 (Modifier名から検索)
export const sortieModifierDescriptions: Record<string, string> = {
  // 環境異常
  'Extreme Cold': 'Warframe の機動性が低下する。<br />ダッシュができなくなり、移動/パルクール/近接攻撃/リロード/アビリティ発動速度が低下する。',
  'Dense Fog': '視認性が大幅に制限され、エリアが濃い霧に覆われる。地球森林タイルでのみ発生し、夜固定になる。',
  'Cryogenic Leakage': 'エリアの一部が凍結し、これに触れると冷気異常になる。<br>Warframeのシールドが-50%。敵の攻撃に+25%冷気ダメージ追加。',
  'Fire': 'エリアの一部が炎に包まれ、炎に触れると火炎異常になる。炎は冷気ダメージで除去できる。<br>Warframe の最大ヘルスが-50%。敵の攻撃に+25%火炎ダメージ。',
  'Electromagnetic Anomalies': '低重力状態になり、エリアの各所に青い磁気雲が発生。磁気雲に触れると磁気異常(3秒間 シールドリチャージ停止、シールドへのダメージが+100%、視界が乱れ、90エネルギーを失う)になる。<br />磁気雲は電気/磁気/Voidダメージで一時的に除去できる。',
  // 'Radiation Hazard': 'エリア全体に放射線の状態異常が周期的に発生する。',
  'Radiation Pockets': '緑色の放射線の雲が発生し、触れると放射線異常(4秒間 射撃精度減少、フレンドリーファイア有効、味方蘇生不可)になる。<br>敵への物理ダメージ-75%、放射線ダメージ+100%。',
  'Low Gravity': 'エリアが低重力になる。',
  'Energy Reduction': 'エネルギーの最大値が25%になり、エネルギー継続回復によるエネルギー回復速度が大幅に低下する。',

  // 強化
  'Augmented Enemy Armor': '敵の装甲値+300%。感染体に装甲値+100(除去不可)。<br>オロキンでは元グリニアのみ装甲値が増加する。',
  'Augmented Enemy Shields': '敵勢力コーパスのみ。敵のシールド+300%。',
  'Eximus Stronghold': 'エクシマスユニットが多く出現する。',

  // 物理/属性
  'Slash': '敵の攻撃に+100%切断ダメージ。敵はすべての物理ダメージに対して85%の耐性をもつ(切断異常によるダメージは耐性対象外)。',
  'Impact': '敵の攻撃に+100%衝撃ダメージ。敵はすべての物理ダメージに対して85%の耐性をもつ(切断異常によるダメージは耐性対象外)。',
  'Puncture': '敵の攻撃に+100%貫通ダメージ。敵はすべての物理ダメージに対して85%の耐性をもつ(切断異常によるダメージは耐性対象外)。',
  'Heat': '敵の攻撃に+100%火炎ダメージ。敵はすべての属性ダメージに対して85%の耐性をもつ。',
  'Cold': '敵の攻撃に+100%冷気ダメージ。敵はすべての属性ダメージに対して85%の耐性をもつ。',
  'Electricity': '敵の攻撃に+100%電気ダメージ。敵はすべての属性ダメージに対して85%の耐性をもつ。',
  'Toxin': '敵の攻撃に+100%毒ダメージ。敵はすべての属性ダメージに対して85%の耐性をもつ。',
  'Blast': '敵の攻撃に+100%爆発ダメージ。敵はすべての属性ダメージに対して85%の耐性をもつ。',
  'Corrosive': '敵の攻撃に+100%腐食ダメージ。敵はすべての属性ダメージに対して85%の耐性をもつ。',
  'Gas': '敵の攻撃に+100%ガスダメージ。敵はすべての属性ダメージに対して85%の耐性をもつ。',
  'Magnetic': '敵の攻撃に+100%磁気ダメージ。敵はすべての属性ダメージに対して85%の耐性をもつ。',
  'Radiation': '敵の攻撃に+100%放射線ダメージ。敵はすべての属性ダメージに対して85%の耐性をもつ。',
  'Viral': '敵の攻撃に+100%感染ダメージ。敵はすべての属性ダメージに対して85%の耐性をもつ。',

  // 武器制限
  'Sniper Only': '精密ライフルのみ使用可能。<br>他の武器は使用できないが、例外的にアビリティ武器は使用可能。',
  'Assault Rifle Only': 'アサルトライフルのみ使用可能。<br>他の武器は使用できないが、例外的にアビリティ武器は使用可能。',
  'Melee Only': '近接武器のみ使用可能。<br>他の武器は使用できないが、例外的にアビリティ武器は使用可能。',
  'Bow Only': '弓/クロスボウのみ使用可能。<br>他の武器は使用できないが、例外的にアビリティ武器は使用可能。',
  'Pistol Only': 'セカンダリ武器(=ピストル)のみ使用可能。<br>他の武器は使用できないが、例外的にアビリティ武器は使用可能。',
  'Shotgun Only': 'ショットガンのみ使用可能。<br>他の武器は使用できないが、例外的にアビリティ武器は使用可能。',
  'Weapon Restriction': '特定の武器のみ使用可能。<br>他の武器は使用できないが、例外的にアビリティ武器は使用可能。',
};

export const translateSortieDescription = (modifier: string): string => {
  // 1. 完全一致 (Modifier名から直接検索)
  if (sortieModifierDescriptions[modifier]) {
    return sortieModifierDescriptions[modifier];
  }

  // 2. プレフィックス処理 (Modifier名からコア部分を抽出して再検索)
  // 例: "Environmental Effect: Dense Fog" -> "Dense Fog"
  const prefixes = [
    'Environmental Effect: ',
    'Environmental Hazard: ',
    'Enemy Physical Enhancement: ',
    'Enemy Elemental Enhancement: ',
    'Weapon Restriction: ',
  ];

  for (const prefix of prefixes) {
    if (modifier.startsWith(prefix)) {
      const core = modifier.substring(prefix.length);
      if (sortieModifierDescriptions[core]) {
        return sortieModifierDescriptions[core];
      }
    }
  }

  // 3. フォールバック (何も見つからない場合)
  // ここでAPIのdescriptionを使わないように空文字などを返すか、汎用メッセージを返す
  return '詳細情報なし';
};
