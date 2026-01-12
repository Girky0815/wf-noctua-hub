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

// --- アルキメデア (Deep Archimedea) 関連 ---

export const translateArchimedeaType = (typeKey: string): string => {
  if (typeKey.includes('C T_ L A B')) return '深淵アルキメデア';
  if (typeKey.includes('C T_ H E X')) return '次元アルキメデア';
  return typeKey;
};

export const translateArchimedeaFaction = (faction: string): string => {
  if (faction === 'Man in the Wall') return 'ササヤキ';
  return factionTypes[faction] || faction;
};

export const translateArchimedeaMission = (missionType: string, archimedeaType: string): string => {
  // 深淵 (CT_LAB)
  if (archimedeaType.includes('C T_ L A B')) {
    if (missionType === 'Defense') return 'ミラー防衛';
  }
  // 次元 (CT_HEX)
  if (archimedeaType.includes('C T_ H E X')) {
    if (missionType === 'Defense') return 'ステージ防衛';
    if (missionType === 'Survival') return 'ヘルスクラバー 耐久';
    if (missionType === 'Legacyte Harvest') return 'レガサイト収穫';
  }
  return missionTypes[missionType] || missionType;
};

// 既知のモディファイア翻訳 (一部はWikiやユーザー指定に基づく)
// 既知のモディファイア翻訳 (Wikiの情報に基づく)
// 既知のモディファイア翻訳 (Wikiの情報に基づく)
export const archimedeaModifiers: Record<string, { name: string; desc?: string }> = {
  // --- 深淵アルキメデア (Deep Archimedea) 偏差 (Deviations) ---
  'Necramech Influx': { name: 'ネクロメカ流入', desc: 'ネクロメカの出現頻度が増加する。(カルヴァリンによる召喚以外でも出現する可能性あり)' },
  'Fissure Cascade': { name: '亀裂連鎖', desc: 'ミッション中に亀裂が生じ、敵のレベルが10秒ごとに1ずつ上昇する。破壊することでレベル上昇が止まる。' },
  'Damage Link': { name: '損傷リンク', desc: '10メートル以内の敵同士でダメージリンクグループが形成される。一体に与えられたダメージは、繋がっているグループ全体に均等に分配される。' },
  // Sealed Armor は共通で定義
  'Unpowered Capsules': { name: '寄生タワー', desc: '生命維持装置から半径15m内の敵を20体倒すまで装置を発動できない。' },
  'Hostile Support': { name: '敵対的支援', desc: '生命維持装置は無効化される。ネクロメカが90秒ごとに出現し、倒すと6個の生命維持モジュールをドロップする。' },
  'Hazardous Area': { name: '危険エリア', desc: '生命維持装置を起動すると危険エリアを排除できる。' },
  'Hazardous Wares': { name: '危険物資', desc: 'アンフォールは運搬中に関連する属性ダメージを与える。' },
  'Invulnerable Alchemy': { name: '無敵の錬金術', desc: '敵の10%が特定の属性バリア(アンフォールでのみ破壊可)を持つ。(バリア持ちは対応元素のオーラとマークが表示される)' },
  'Eximus Amphors': { name: 'エクシマスアンフォール', desc: 'アンフォールはエクシマスからのみドロップする。(バグでエクシマスが湧かなくなった場合、ホスト移行か未使用アンフォールの処分を推奨)' },
  'Eroding Senses': { name: '感覚麻痺', desc: 'オリクルとビトリウムが時間経過と共にダメージを受ける。必要なボスフェングリフを集めることでダメージが止まり微量の回復を行う。' },
  'Glyph Inflation': { name: 'グリフインフレーション', desc: 'セキュリティシステムの起動には2倍のボスフェングリフが必要。' },
  'Glyph Trap': { name: 'グリフトラップ', desc: '一部のボスフェングリフが触れた者を250m先へテレポートさせる罠となる。ポータルは見つかった後45秒間残る。' },
  'Radioactive Decay': { name: '放射性衰弱', desc: '全ての敵が無敵化し、放射線状態異常が付与されている場合のみダメージを受ける。ミッション中Chyrinka Pillarがランダムに出現し放射線状態異常を付与する。' },
  'Barbed Glyphs': { name: 'バーブグリフ', desc: 'グリフ回収時に少量の火炎ダメージと状態異常を受ける。' },
  'Troop Deployment': { name: '戦力配備', desc: 'エクシマスの敵がフラグメント・タイドと最終形態を支援する。' },
  'Relentless Tide': { name: '容赦ない潮流', desc: 'フラグメント・タイドが攻撃を止めなくなる。' },
  'Angelic Company': { name: '天使の仲間', desc: 'Voidの天使がフラグメントの最終形態と共に戦う。' },
  'Fragment Two': { name: 'フラグメント・ツー', desc: '最終決戦で2体のフラグメント体と対峙する。' },
  'Engorged Gruzzling': { name: '充血グラズリング', desc: '全グラズリングがエクシマスになる。' },
  'Unified Purpose': { name: '統一目的', desc: '敵が起動済みコンジットを標的にし、破壊可能になる。(コンジットには防衛対象としてヘルスが設定される)' },
  'Double Trouble': { name: 'ダブルデモリッシャー', desc: '2体のネクロメカデモリッシャーがコンジットを攻撃するが、ヘルスは低め。' }, // Wiki: Double Demolisher

  // --- 次元アルキメデア (Temporal Archimedea) 偏差 (Deviations) ---
  'Cache Crash': { name: 'キャッシュクラッシュ', desc: '補給品貯蔵庫の自爆タイマー(3分)がミッション開始と同時に作動する。(解錠失敗時、クリアに必要なキル数が2倍に増加)' },
  // Sealed Armor は共通で定義
  'Breathless': { name: '息を止めて', desc: 'エリア全体が毒に覆われ、時間経過でダメージが増加する。(敵がドロップするフィルター(半径5m/10秒)か、ヘルスクラバー付近(半径20m)のみ安全)' },
  'Pile Up': { name: '積み重ね', desc: 'テックロットはヘルスクラバーを近接攻撃し、接触時爆発を起こしヘルスクラバーの汚染率を25％上昇させる。' },
  'Spore Genesis': { name: '胞子形成', desc: 'ヘルスクラバー付近にテックロット腫瘤が発生し、生命維持減少を加速させる。(クラバー消費で発生停止。腫瘤から酸素ドロップあり)' },
  'Timer Shortened': { name: 'タイマー短縮', desc: '定期的に出現するババウを倒すと、生命維持回復の代わりにミッションタイマーを短縮する装置が出現する。' },
  'Mitosis': { name: '有糸分裂', desc: '各ラウンドで2体のレガサイトが出現し、成功するには2倍の捕獲数が必要となる。' },
  'Growth Hormone': { name: '成長ホルモン', desc: 'レガサイトは世代ごとにより強力になる代わり、逃走が遅くなる。' },
  'Parallel Evolution': { name: '並行進化', desc: 'レガサイトが進化すると、マップ上の他の敵も新しいアビリティを得る。' },
  'Reinforcements': { name: '援軍', desc: '戦闘中、最初はスカルドラ、次にテックロットの援軍が登場する。' },
  'Tank Super Toxic': { name: '毒タンク', desc: '戦車は毒のオーラをまとい、毒の軌跡を残し、攻撃は毒ダメージを与える。' },
  'Thermian Plating': { name: 'サーミアンメッキ', desc: '戦車がサーミアンメッキを持ち、専用武器(Thermian RPG)でのみダメージを与えられる(第2形態も同様。敵からRPGを奪って攻撃する必要がある)。' },
  'Noise Suppression': { name: 'ノイズ抑制', desc: 'Flareの上空にドローンが飛び、エフェルボンガスをまき散らす。' },
  'Miasmite Mash': { name: 'ミアズマイト・マッシュ', desc: '敵は倒されるとミアズマイトをドロップし、即座にFlareに襲い掛かる。' },
  'Vampire Rock': { name: 'ヴァンプロック', desc: 'Flareの周囲(10m)にフィールド発生。内部にテンノがいるとアビリティ阻害・エネルギー減少と引き換えにFlareを回復する(テンノ不在時はFlareのヘルスが減少)。' },

  // --- リスクレベル (Risks: Common & Deep/Temporal) ---
  'Hostile Regeneration': { name: '敵性再生', desc: '敵ヘルスが徐々に回復する。(5秒間ダメージを受けないと、毎秒最大ヘルスの10%を回復)' },
  'Vampyric Liminus': { name: 'バンパイヤ・リミナス', desc: '不死身のデュヴィリ・リミナスが出現し、近くの味方からヘルス(150/s, オーバーガード5倍)とエネルギー(25/s)を吸収する。(無敵化でもEN減少は防げないが、CCは有効)' },
  'Adaptive Resistance': { name: '適応抵抗', desc: '敵は与えられた属性ダメージに対する耐性を獲得する。5秒間その属性からダメージを受けなかった場合、耐性は失われる。' }, // API Key要確認
  'Bolstered Belligerents': { name: '戦闘員の増強', desc: 'すべての敵は最大ヘルスの50%分のオーバーガードを持つ。' },
  'Shootout': { name: '射撃戦', desc: '遠距離攻撃を行う敵にのみ遭遇する。' },
  'Melee': { name: '接近戦', desc: '近接攻撃を行う敵にのみ遭遇する。' },
  'Fortified Foes': { name: '要塞化', desc: 'ガーディアン エクシマス ネクロメカを含むガーディアン エクシマス ユニットに遭遇する可能性がある。' },
  'Myopic Munitions': { name: '近視戦闘', desc: '15メートルより遠くの敵にはダメージを与えられない。' },
  'Postmortal Surges': { name: '死後の呪い', desc: '倒した敵がVoidエネルギーで爆発する。' },
  'Elemental Enhancement': { name: '属性強化', desc: '敵は+100%の属性ダメージを与え、属性ダメージに対する+85%の耐性を持つ。' },
  'Eximus Reinforcement': { name: 'エクシマスの増援', desc: '追加のエクシマスユニットが出現する。' },
  'Bold Venture': { name: '乾坤一擲(けんこんいってき)', desc: '敵の与ダメージ-15%・被ダメージ+15%。代わりに移動・攻撃・発射速度が+15%上昇する。' }, // 仮
  'Devil\'s Bargain': { name: '悪魔の取引', desc: '倒された敵の4m内にいる分隊メンバーは発射速度が25％上昇するが、弾薬効率が50％減少する。' },
  'Entanglement': { name: '絡み合い', desc: '倒された敵の4m内にいる分隊メンバーの移動速度とパルクール速度を減少する。' },
  'Commanding Calvarin': { name: '指揮機カルヴァリン', desc: 'ローグ・カルヴァリンが強化され、着弾時に爆発する弾丸を使用する。(オーバーガードとネクロメカに対して5倍のダメージ)' },
  'Explosive Potential': { name: '爆発的可能性', desc: 'シャフリング・フラグメントが、爆発するラプチャリング・フラグメントに置き換わる。' },
  'Alluring Arcocanids': { name: 'いざなうアルコカニド', desc: 'ローグ・アルコカニドが突進攻撃を行うと、WARFRAMEを前方へ引き寄せる' },

  // --- 次元アルキメデア 独自リスク ---
  'Ballonfest': { name: 'バルーンフェスト', desc: 'スカルドラ・ハービンガーの数が増え、攻撃と移動速度が上昇する。' },
  'Artillery Beacon': { name: '砲兵ビーコン', desc: 'スカルドラ兵を倒すと砲兵ビーコンをドロップし、辺りに砲撃を降らせる。' },
  'Rotten Flesh': { name: '腐敗した肉体', desc: 'テックロットが常時ダメージを受け、死亡時にガス爆発を起こす。(全ての敵が死亡時にガスダメージエリア(0.25秒毎ダメージ)を残す)' },
  'Competitiveness': { name: '競争心', desc: 'Amir/Aoi戦のペナルティ(25秒毎)がランダムに発生する。(エネルギーオーブ無効化などに注意)' },
  'Miasmite Swarm': { name: 'ミアズマイト・スウォーム', desc: 'テックロット ミアズマイトがミッション中湧き出る。' },
  'Dense Fog': { name: '濃霧', desc: 'エフェルボンガスがマップを覆う。敵からドロップするフィルターで一時的救済を得られる。' },
  'It\'s Alive': { name: 'イッツアライブ', desc: '地下エリアでプレイヤーが動きを止めると増殖物たちが襲い掛かる。' },
  'Techrot Speedrun': { name: 'テックロット・スピードラン', desc: '全ての敵がテックロットに入れ替わり、移動速度が上昇する。' },
  'Scaldra Speedrun': { name: 'スカルドラ・スピードラン', desc: '全ての敵がスカルドラに入れ替わり、移動速度が上昇する。' },
  'Heavy Weaponry': { name: '重兵器', desc: '敵はヘビー武器(=AW銃)以外から受けるダメージが95%減少する。敵はヘビー弾薬パックをドロップし、ヘビー武器再展開時間が5秒に短縮する。' },
  'Arcade Automate': { name: 'アーケード・オートマタ', desc: '敵の射撃が低速の大きな球体に変化する(出現勢力がスカルドラに置換または優先される)。' },
  'Beyond the Wall': { name: '壁の向こう側', desc: 'スカルドラとテックロットにササヤキたちが加勢する。' },
  'Thick Ice': { name: '厚い氷', desc: 'アークティック エクシマスのバブルの耐久度が30倍になる。' }, // 冬
  'Jade Spirits': { name: 'ジェイドスピリッツ', desc: 'ジェイドウィスプがエリアを徘徊する。近づくとそのプレイヤーを追跡し、ジェイドライトビームに変身する。' }, // 春
  'Excessive Explosives': { name: '過剰な爆発物', desc: '全ての補給コンテナが爆弾タルに入れ替わる。' }, // 夏
  'Foggy Fall': { name: '霧の秋', desc: 'ミッションエリアに霧がかかり視界が制限される。' }, // 秋

  // --- 共通 / その他 (Common / Others) ---
  'Sealed Armor': { name: '封鎖装甲', desc: '弱点以外へのダメージを90%カット。(個々の敵に弱点が強調表示される。弱点のないアナトマイザーは対象外)' },
  // 'Mirror Image': { name: '鏡像', desc: 'グリニアとコーパスの敵が混在する。' }, // Wiki
  // 'Creeping Dark': { name: '忍び寄る闇', desc: '光の届かない場所にいると持続的なダメージを受ける。' },
  'Conductive Current': { name: '導電体質', desc: '数秒ごとに電気ダメージを受ける。' },
  'Terminal Velocity': { name: '終端速度', desc: '移動中、毎秒0ダメージを受ける。静止するとダメージが増加する。' },
  // 'Unpowered Capsules': { name: '無動力カプセル', desc: '生命維持カプセルは起動できず、ネクロメカ召喚でのみ使用可能。' },

  // --- パーソナルモディファイア (Personal Modifiers) ---
  'Gear Embargo': { name: 'ギア制限', desc: 'ギアアイテムが使用不可。' },
  'Powerless': { name: 'アビリティ封印', desc: '50体の敵を倒すまでアビリティ封印。(分隊員・スペクターのキルも加算。転移やスペクターのアビリティは使用可)' },
  'Secondary Wounds': { name: '二次創傷', desc: 'ダメージを受けるたびに、貫通状態異常を1スタック受ける。' }, // Wiki: 二次的創傷
  'Lethargic Shields': { name: '不活性シールド', desc: 'シールドリチャージ遅延が500%増加。(通常6秒、完全枯渇時は24秒まで遅延)' },
  'Ammo Deficit': { name: '弾薬不足(Deficit)', desc: '弾薬回復量が75%減少。(バッテリー武器やアビリティ武器には影響しない)' },
  'Fractured Armor': { name: 'ひび割れ', desc: 'アビリティを使用すると装甲値が10秒間10%減少する。' },
  'Untreatable': { name: '治療不能', desc: 'ヘルスオーブ取得不可、ピックアップによる回復も無効。(Equilibrium等のMOD効果も含め、オーブによるヘルス回復は一切不可)' },
  'Abbreviated Abilities': { name: 'アビリティ短縮', desc: 'アビリティ持続時間が50%減少。(MOD等で計算した最終値に乗算)' },
  'Swooning': { name: '失神消耗', desc: 'ヘルスダメージを受けると、ヒット毎に最大エネルギーの5%が消費される。' },
  'Transference Distortion': { name: '転移障害', desc: 'オペレーター/漂流者への転移不可。(Last Gaspやネクロメカ搭乗も不可。転移不要なフォーカス受動効果は有効)' },
  'Framecurse Syndrome': { name: 'フレームカース・シンドローム', desc: 'アビリティ発動時にヘルスへ直接50ダメージを受ける。(シールド無視)' },
  'Knifestep Syndrome': { name: 'ナイフステップ・シンドローム', desc: '移動中、速度に比例してヘルスが減少する。(ジャンプ中は減少停止)' },
  'Energy Starved': { name: 'エネルギー枯渇', desc: '10メートル以内の敵一体につき、毎秒2エネルギーを失う。' },
  'Ammo Scarcity': { name: '弾薬不足(Scarcity)', desc: '所持弾薬が毎秒約5%消失する。(バッテリー武器はリチャージ速度低下)' },
  'Exposure Curse': { name: '摘発の呪い', desc: 'シールドが破壊されると、無限に持続するステータス効果を受ける。' }, // Wiki: 露出の呪い (内容要確認: シールド消失?) -> "摘発"の方がニュアンス近いか? 原文Exposure
  'Hematic Syndrome': { name: '血紅症候群', desc: 'ダメージを受けるたびに切断状態異常が発生する。' },
  'Vampiric Syndrome': { name: '吸血鬼症候群', desc: '毎秒ヘルスを失う。敵を倒すとヘルスが回復する。' },
  // Conductive Current は上で定義済み
  'Void Energy Overload': { name: 'アビリティ オーバーロード', desc: 'アビリティ使用時に近くでVoidの裂け目が開く。' },
  'Supply Shortage': { name: '供給不足', desc: 'すべての武器の最大弾薬数が75％減少する。' },
  'Constriction': { name: '狭窄', desc: '最大エネルギーが75％減少。' },
  'Hypersensitive': { name: '過敏症', desc: 'ステータス低下効果の持続時間が3倍になる。' },
  'Dull Blade': { name: 'なまくら', desc: '-50％近接コンボ確率。' },
  'Consequences': { name: '後遺症', desc: '被ダメージ毎に最大ヘルスが減少(×0.985)。(12秒間ダメージを受けなければ最大ヘルスの3%ずつ回復)' },
  'Anti Guard': { name: '油断', desc: '自身と仲間のオーバーガード獲得量が75%減少。' },

  // Wikiやその他ソースからの補完 (MD未記載のためコメントアウト)
  // 'Altered Capillaries': { name: '変質した毛細血管', desc: '敵へのステータス効果の持続時間が75%短縮される。' },
  // 'Energy Starved': { name: 'エネルギー飢餓', desc: 'エネルギーオーブから回復するエネルギー量が50%減少する。' },
  // 'Knockout': { name: 'ノックアウト', desc: 'オペレーター/漂流者が倒されると、Warframeも即座にダウンする。' },
  // 'Fragile Guard': { name: '脆弱なガード', desc: 'シールドが破壊されると、Voidダメージを受ける。' },
  // 'Dampened Abilities': { name: '湿ったアビリティ', desc: '分隊が敵を50体倒すまで全てのアビリティが無効化される(重複可能性あり/要確認)。' },
  // 'Shortened Abilities': { name: '短縮化アビリティ', desc: 'アビリティ効果範囲が75%縮小する。' },
  // 'Anti Guard': { name: 'アンチガード', desc: '自身のオーバーガードが無効化され、付与できなくなる。' },
  // 'Void Energy Overload': { name: 'Voidエネルギー過負荷', desc: 'Voidエネルギーが蓄積し、一定量を超えると爆発してダメージを受ける。' },
};

export const translateArchimedeaModifier = (name: string, desc: string, typeKey?: string): { name: string; desc: string } => {
  // Deep (CT_LAB) vs Dimensional (CT_HEX) naming differences
  if (name === 'Sealed Armor') {
    if (typeKey && typeKey.includes('C T_ L A B')) { // Deep
      // Wiki Deep: 封鎖装甲
      return { name: '封鎖装甲', desc: archimedeaModifiers['Sealed Armor']?.desc || desc };
    }
    // Dimensional (CT_HEX): 封鎖された装甲
    return { name: '封印された鎧', desc: '弱点以外の攻撃で敵が受けるダメージが95%減少。' };
  }

  // 完全一致検索
  const entry = archimedeaModifiers[name];
  if (entry) {
    return { name: entry.name, desc: entry.desc || desc };
  }

  // 部分一致ロジックなども必要であればここに追加できるが、現状はexact matchのみ

  return { name, desc };
};
