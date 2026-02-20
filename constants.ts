import { Star, Category } from './types';

// Common
const img5051 = 'star-images/IMG_5051.png'; // s1
const img5049 = 'star-images/IMG_5049.png'; // s2
const img5146 = 'star-images/IMG_5146.png'; // s3, s12
const img5030 = 'star-images/IMG_5030.png'; // s4
const img5029 = 'star-images/IMG_5029.png'; // s5
const img5027 = 'star-images/IMG_5027.png'; // s6
const img5043 = 'star-images/IMG_5043.png'; // s7 (New)
const img5026 = 'star-images/IMG_5026.png'; // s12 (New - resolved duplication)

// ... (existing definitions)


const img5148 = 'star-images/IMG_5148.png'; // s8

// Rare
const img5045 = 'star-images/IMG_5045.png'; // s10
const img5033 = 'star-images/IMG_5033.png'; // s13
const img5023 = 'star-images/IMG_5023.png'; // s14
const img5022 = 'star-images/IMG_5022.png'; // s15

// Legendary
const img5024 = 'star-images/IMG_5024.png'; // s16
const img5032 = 'star-images/IMG_5032.png'; // s17

export const STAR_DATABASE: Star[] = [
  // 星1 (Common) - 9個 (No.1 - No.9)
  {
    id: 's1',
    name: 'No.1',
    description: '乾いた土と砂だけが地平線まで続く、ひび割れた荒地の惑星。',
    imageUrl: img5051,
    rarity: 'common',
  },
  {
    id: 's2',
    name: 'No.2',
    description: '淡い光の粒がゆっくり舞い、薄い膜の内側で星屑のような渦がきらめいている。',
    imageUrl: img5049,
    rarity: 'common',
  },
  {
    id: 's3',
    name: 'No.3',
    description: '灼熱の渦がゆるやかに踊り、星の鼓動のように光が脈打っている。',
    imageUrl: img5146,
    rarity: 'common',
  },
  {
    id: 's4',
    name: 'No.4',
    description: '淡い光の層がゆっくりと揺れ、周囲の闇にやさしく滲むように輝いている。',
    imageUrl: img5030,
    rarity: 'common',
  },
  {
    id: 's5',
    name: 'No.5',
    description: '青い層が内部でせわしなく揺れ、表面には微細な光の粒が絶えず走り続けている。',
    imageUrl: img5029,
    rarity: 'common',
  },
  {
    id: 's6',
    name: 'No.6',
    description: '乾いた砂の層の下で、微細な根が静かに広がる',
    imageUrl: img5027,
    rarity: 'common',
  },
  {
    id: 's7',
    name: 'No.7',
    description: '',
    imageUrl: img5043,
    rarity: 'common',
  },
  {
    id: 's8',
    name: 'No.8',
    description: '強い磁場を持つ青い恒星。',
    imageUrl: img5148,
    rarity: 'common',
  },
  // s9 (No.9) Removed due to missing image (IMG_5168)

  // 星2 (Rare) - 5個 (No.10, 12, 13, 14, 15)
  {
    id: 's10',
    name: 'No.10',
    description: '美しい黄金の環を持つ惑星。',
    imageUrl: img5045,
    rarity: 'rare',
  },
  // s11 (No.11) Removed due to missing image (IMG_5168)

  {
    id: 's12',
    name: 'No.12',
    description: '氷の尾を引いて駆け抜ける彗星。',
    imageUrl: img5026,
    rarity: 'rare',
  },
  {
    id: 's13',
    name: 'No.13',
    description: 'プラズマの嵐が吹き荒れる巨星。',
    imageUrl: img5033,
    rarity: 'rare',
  },
  {
    id: 's14',
    name: 'No.14',
    description: '液体のダイヤモンドの海を持つ星。',
    imageUrl: img5023,
    rarity: 'rare',
  },
  {
    id: 's15',
    name: 'No.15',
    description: '双子の太陽を持つ砂漠の惑星。',
    imageUrl: img5022,
    rarity: 'rare',
  },
  // 星3 (Legendary) - 2個 (No.16 - No.17)
  {
    id: 's16',
    name: 'No.16',
    description: '星々が生まれる神秘的な紫の星雲。',
    imageUrl: img5024,
    rarity: 'legendary',
  },
  {
    id: 's17',
    name: 'No.17',
    description: '光さえも吸い込む暗黒の特異点。',
    imageUrl: img5032,
    rarity: 'legendary',
  },
];

export const CATEGORIES: Category[] = [
  { id: 'housework', label: '家事', count: 0 },
  { id: 'study', label: '勉強', count: 0 },
  { id: 'school', label: '学校', count: 0 },
];
