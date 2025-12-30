export type ResurgenceCategory = 'Warframe' | 'Primary' | 'Secondary' | 'Melee' | 'Companion' | 'Archwing' | 'Unknown';

interface ResurgenceItemDef {
  name: string;
  category: ResurgenceCategory;
}

// APIから返ってくる「生のアイテム名（小文字、パーツ名除去済み）」をキーにします。
// 値には、表示したい「正しい名前」と「カテゴリ」を指定します。
// カテゴリ: 'Warframe' | 'Primary' | 'Secondary' | 'Melee' | 'Companion' | 'Archwing' | 'Unknown'
// 
// 例: APIが "prime panthera" を返すが、表示は "Panthera Prime" (Primary) にしたい場合:
// 'prime panthera': { name: 'Panthera Prime', category: 'Primary' },
const RESURGENCE_FIXES: Record<string, ResurgenceItemDef> = {

  // 書き方
  // 'APIの値': {name: '正式名', category: 'カテゴリ'}
  // カテゴリは Warframe/Primary/Secondary/Melee/Companion

  // --- Warframes ---
  // ※アークウィングは1個しかない(Odonata Primeのみ)ため便宜的にWarframe扱いとする
  'chroma prime': { name: 'Chroma Prime', category: 'Warframe' },
  'ember prime': { name: 'Ember Prime', category: 'Warframe' },
  'frost prime': { name: 'Frost Prime', category: 'Warframe' },
  'limbo prime': { name: 'Limbo Prime', category: 'Warframe' },
  'loki prime': { name: 'Loki Prime', category: 'Warframe' },
  'mag prime': { name: 'Mag Prime', category: 'Warframe' },
  'mesa prime': { name: 'Mesa Prime', category: 'Warframe' },
  'nova prime': { name: 'Nova Prime', category: 'Warframe' },
  'odonata prime': { name: 'Odonata Prime', category: 'Warframe' },
  'rhino prime': { name: 'Rhino Prime', category: 'Warframe' },
  'trinity prime': { name: 'Trinity Prime', category: 'Warframe' },
  'volt prime': { name: 'Volt Prime', category: 'Warframe' },
  'zephyr prime': { name: 'Zephyr Prime', category: 'Warframe' },

  // --- Primary ---
  'boar prime': { name: 'Boar Prime', category: 'Primary' },
  'latron prime': { name: 'Latron Prime', category: 'Primary' },
  'prime panthera': { name: 'Panthera Prime', category: 'Primary' },
  'rubico prime': { name: 'Rubico Prime', category: 'Primary' },
  'soma prime': { name: 'Soma Prime', category: 'Primary' },
  'tiberon prime': { name: 'Tiberon Prime', category: 'Primary' },
  'vectis prime': { name: 'Vectis Prime', category: 'Primary' },

  // --- Secondary ---
  'ak jagara prime': { name: 'Akjagara Prime', category: 'Secondary' },
  'prime ballistica': { name: 'Ballistica Prime', category: 'Secondary' },
  'pyrana prime': { name: 'Pyrana Prime', category: 'Secondary' },
  'sicarus prime': { name: 'Sicarus Prime', category: 'Secondary' },

  // --- Melee ---
  'bo prime': { name: 'Bo Prime', category: 'Melee' },
  'dakra prime': { name: 'Dakra Prime', category: 'Melee' },
  'destreza prime': { name: 'Destreza Prime', category: 'Melee' },
  'glaive prime': { name: 'Glaive Prime', category: 'Melee' },
  'gram prime': { name: 'Gram Prime', category: 'Melee' },
  'kronen prime': { name: 'Kronen Prime', category: 'Melee' },
  'prime kris dagger': { name: 'Karyst Prime', category: 'Melee' },
  'prime nami skyla': { name: 'Nami Skyla Prime', category: 'Melee' },
  'prime redeemer': { name: 'Redeemer Prime', category: 'Melee' },
  'reaper prime': { name: 'Reaper Prime', category: 'Melee' },
  'redeemer prime wep': { name: 'Redeemer Prime', category: 'Melee' },


  // --- Companion / Others ---
  'carrier prime': { name: 'Carrier Prime', category: 'Companion' },
  'wyrm prime': { name: 'Wyrm Prime', category: 'Companion' },
};

export const normalizeResurgenceItem = (rawName: string): ResurgenceItemDef => {
  const lowerName = rawName.toLowerCase()
    .replace(' blueprint', '')
    .replace(' receiver', '')
    .replace(' stock', '')
    .replace(' barrel', '')
    .replace(' blade', '')
    .replace(' handle', '')
    .replace(' hilt', '')
    .replace(' pouch', '')
    .replace(' stars', '')
    .replace(' link', '')
    .replace(' systems', '')
    .replace(' chassis', '')
    .replace(' neuroptics', '')
    .replace(' harness', '')
    .replace(' wings', '')
    .replace(' cerebrum', '')
    .replace(' carapace', '')
    .trim();

  // 1. Check direct fix map
  if (RESURGENCE_FIXES[lowerName]) {
    return RESURGENCE_FIXES[lowerName];
  }

  // 2. Heuristic Guessing

  // Convert "Prime Name" -> "Name Prime" if it looks inverted
  // e.g. "Prime Somati" -> "Somati Prime"
  let correctedName = rawName.replace(' Blueprint', '').replace(' レリック', '').trim();
  if (correctedName.toLowerCase().startsWith('prime ') && !correctedName.toLowerCase().includes('pack')) {
    const parts = correctedName.split(' ');
    correctedName = [...parts.slice(1), parts[0]].join(' ');
  }

  // Guess Category
  let category: ResurgenceCategory = 'Unknown';
  const ln = correctedName.toLowerCase();

  if (itemIsWarframe(ln)) category = 'Warframe';
  else if (ln.includes('rifle') || ln.includes('bow') || ln.includes('launcher')) category = 'Primary';
  else if (ln.includes('pistol') || ln.includes('ak')) category = 'Secondary';
  else if (ln.includes('sword') || ln.includes('dagger') || ln.includes('glaive') || ln.includes('staff') || ln.includes('axe') || ln.includes('scythe')) category = 'Melee';
  else if (ln.includes('carrier') || ln.includes('wyrm') || ln.includes('helios') || ln.includes('dethcube') || ln.includes('shade')) category = 'Companion';

  return { name: correctedName, category };
};

// Simple list of known Warframes to help heuristic categorization
const WARFRAMES = [
  'ash', 'atlas', 'banshee', 'baruuk', 'chroma', 'ember', 'equinox', 'excalibur', 'frost', 'gara', 'garuda',
  'gauss', 'grendel', 'harrow', 'hildryn', 'hydroid', 'inaros', 'ivara', 'khora', 'limbo', 'loki', 'mag',
  'mesa', 'mirage', 'nekros', 'nezha', 'nidus', 'nova', 'nyx', 'oberon', 'octavia', 'revenant', 'rhino',
  'saryn', 'titania', 'trinity', 'valkyr', 'vauban', 'volt', 'wukong', 'zephyr', 'xaku', 'lavos', 'sevagoth',
  'yareli', 'caliban', 'gyre', 'styanax', 'voruna', 'citrine', 'dagath', 'qorvex', 'dante', 'jade'
];

function itemIsWarframe(name: string): boolean {
  return WARFRAMES.some(wf => name.toLowerCase().includes(wf));
}
