import type { Event, Round, ScheduleItem } from '../types';

// Generic data to be added to events that are missing it
const genericBracket: Round[] = [
  {
    title: 'Separuh Akhir',
    matches: [
      { participants: [{ name: 'Pasukan A' }, { name: 'Pasukan B' }] },
      { participants: [{ name: 'Pasukan C' }, { name: 'Pasukan D' }] },
    ],
  },
  {
    title: 'Akhir',
    matches: [
      { participants: [{ name: 'TBD' }, { name: 'TBD' }] },
    ],
  },
];

const genericSchedule: ScheduleItem[] = [
  { time: '08:00', activity: 'Pendaftaran & Taklimat' },
  { time: '09:00', activity: 'Acara Bermula' },
  { time: '12:00', activity: 'Rehat & Makan Tengahari' },
  { time: '14:00', activity: 'Acara Bersambung' },
  { time: '17:00', activity: 'Majlis Penutup & Penyampaian Hadiah' },
];


// Mock Data for Tournament Brackets
const hokiBracket: Round[] = [
  {
    title: 'Suku Akhir',
    matches: [
      { participants: [{ name: 'Selangor', score: 3 }, { name: 'Pahang', score: 2 }] },
      { participants: [{ name: 'Perak', score: 1 }, { name: 'Kedah', score: 0 }] },
      { participants: [{ name: 'Johor', score: 5 }, { name: 'Melaka', score: 1 }] },
      { participants: [{ name: 'Terengganu', score: 2 }, { name: 'Kuala Lumpur', score: 3 }] },
    ],
  },
  {
    title: 'Separuh Akhir',
    matches: [
      { participants: [{ name: 'Selangor', score: 2 }, { name: 'Perak', score: 1 }] },
      { participants: [{ name: 'Johor', score: 4 }, { name: 'Kuala Lumpur', score: 2 }] },
    ],
  },
  {
    title: 'Akhir',
    matches: [
      { participants: [{ name: 'Selangor', score: 2 }, { name: 'Johor', score: 3 }] },
    ],
  },
];

const badmintonBracket: Round[] = [
    {
        title: 'Pusingan Awal',
        matches: [
            { participants: [{ name: 'Pulau Pinang', score: 3 }, { name: 'Perlis', score: 0 }] },
            { participants: [{ name: 'Negeri Sembilan', score: 1 }, { name: 'Sabah', score: 3 }] },
        ]
    },
    {
        title: 'Separuh Akhir',
        matches: [
            { participants: [{ name: 'Kuala Lumpur', score: 3 }, { name: 'Pulau Pinang', score: 2 }] },
            { participants: [{ name: 'Selangor', score: 3 }, { name: 'Sabah', score: 1 }] },
        ]
    },
    {
        title: 'Akhir',
        matches: [
            { participants: [{ name: 'Kuala Lumpur', score: 2 }, { name: 'Selangor', score: 3 }] },
        ]
    }
];

const bolaSepakSeniorBracket: Round[] = [
  {
    title: 'Separuh Akhir',
    matches: [
      { participants: [{ name: 'Kedah', score: 2 }, { name: 'Pahang', score: 1 }] },
      { participants: [{ name: 'Terengganu', score: 0 }, { name: 'Johor', score: 1 }] },
    ],
  },
  {
    title: 'Akhir',
    matches: [
      { participants: [{ name: 'Kedah', score: 1 }, { name: 'Johor', score: 2 }] },
    ],
  },
];

const bolaJaringBracket: Round[] = [
  {
    title: 'Separuh Akhir',
    matches: [
      { participants: [{ name: 'W.P. Kuala Lumpur', score: 45 }, { name: 'Sarawak', score: 38 }] },
      { participants: [{ name: 'Johor', score: 52 }, { name: 'Perak', score: 40 }] },
    ],
  },
  {
    title: 'Akhir',
    matches: [
      { participants: [{ name: 'W.P. Kuala Lumpur', score: 48 }, { name: 'Johor', score: 55 }] },
    ],
  },
];

const sepakTakrawBracket: Round[] = [
  {
    title: 'Separuh Akhir',
    matches: [
      { participants: [{ name: 'Pulau Pinang', score: 2 }, { name: 'Kelantan', score: 1 }] },
      { participants: [{ name: 'Terengganu', score: 2 }, { name: 'Melaka', score: 0 }] },
    ],
  },
  {
    title: 'Akhir',
    matches: [
      { participants: [{ name: 'Pulau Pinang', score: 1 }, { name: 'Terengganu', score: 2 }] },
    ],
  },
];

const golfBracket: Round[] = [
  {
    title: 'Separuh Akhir',
    matches: [
      { participants: [{ name: 'Sarawak', score: 80 }, { name: 'Sabah', score: 75 }] },
      { participants: [{ name: 'Perak', score: 85 }, { name: 'Pahang', score: 82 }] },
    ],
  },
  {
    title: 'Akhir',
    matches: [
      { participants: [{ name: 'Sarawak', score: 88 }, { name: 'Perak', score: 90 }] },
    ],
  },
];

const bolingTenpinBracket: Round[] = [
    {
        title: 'Separuh Akhir',
        matches: [
            { participants: [{ name: 'Pulau Pinang', score: 850 }, { name: 'Kedah', score: 820 }] },
            { participants: [{ name: 'Selangor', score: 880 }, { name: 'Melaka', score: 865 }] },
        ]
    },
    {
        title: 'Akhir',
        matches: [
            { participants: [{ name: 'Pulau Pinang', score: 890 }, { name: 'Selangor', score: 910 }] },
        ]
    }
];

const tenisBracket: Round[] = [
    {
        title: 'Separuh Akhir',
        matches: [
            { participants: [{ name: 'Kuala Lumpur', score: 3 }, { name: 'Johor', score: 2 }] },
            { participants: [{ name: 'Perak', score: 3 }, { name: 'Pahang', score: 1 }] },
        ]
    },
    {
        title: 'Akhir',
        matches: [
            { participants: [{ name: 'Kuala Lumpur', score: 2 }, { name: 'Perak', score: 3 }] },
        ]
    }
];

const petanqueBracket: Round[] = [
    {
        title: 'Separuh Akhir',
        matches: [
            { participants: [{ name: 'Kelantan', score: 13 }, { name: 'Terengganu', score: 11 }] },
            { participants: [{ name: 'Perlis', score: 13 }, { name: 'Kedah', score: 9 }] },
        ]
    },
    {
        title: 'Akhir',
        matches: [
            { participants: [{ name: 'Kelantan', score: 10 }, { name: 'Perlis', score: 13 }] },
        ]
    }
];

const bolaTamparLelakiBracket: Round[] = [
    {
        title: 'Separuh Akhir',
        matches: [
            { participants: [{ name: 'Sarawak', score: 3 }, { name: 'Pahang', score: 2 }] },
            { participants: [{ name: 'Selangor', score: 3 }, { name: 'Johor', score: 1 }] },
        ]
    },
    {
        title: 'Akhir',
        matches: [
            { participants: [{ name: 'Sarawak', score: 2 }, { name: 'Selangor', score: 3 }] },
        ]
    }
];

const softballBracket: Round[] = [
    {
        title: 'Separuh Akhir',
        matches: [
            { participants: [{ name: 'Putrajaya', score: 10 }, { name: 'Labuan', score: 8 }] },
            { participants: [{ name: 'Perak', score: 12 }, { name: 'Negeri Sembilan', score: 7 }] },
        ]
    },
    {
        title: 'Akhir',
        matches: [
            { participants: [{ name: 'Putrajaya', score: 9 }, { name: 'Perak', score: 11 }] },
        ]
    }
];

const pickleballBracket: Round[] = [
    {
        title: 'Separuh Akhir',
        matches: [
            { participants: [{ name: 'VIP Team A', score: 11 }, { name: 'VIP Team B', score: 8 }] },
            { participants: [{ name: 'VIP Team C', score: 9 }, { name: 'VIP Team D', score: 11 }] },
        ]
    },
    {
        title: 'Akhir',
        matches: [
            { participants: [{ name: 'VIP Team A', score: 11 }, { name: 'VIP Team D', score: 7 }] },
        ]
    }
];

const bolaSepakVeteranBracket: Round[] = [
  {
    title: 'Separuh Akhir',
    matches: [
      { participants: [{ name: 'Selangor', score: 2 }, { name: 'Pulau Pinang', score: 1 }] },
      { participants: [{ name: 'Perak', score: 1 }, { name: 'Kuala Lumpur', score: 0 }] },
    ],
  },
  {
    title: 'Akhir',
    matches: [
      { participants: [{ name: 'Selangor', score: 1 }, { name: 'Perak', score: 2 }] },
    ],
  },
];

const bolaTamparWanitaBracket: Round[] = [
    {
        title: 'Separuh Akhir',
        matches: [
            { participants: [{ name: 'Johor', score: 3 }, { name: 'Kedah', score: 1 }] },
            { participants: [{ name: 'Pahang', score: 2 }, { name: 'Sabah', score: 3 }] },
        ]
    },
    {
        title: 'Akhir',
        matches: [
            { participants: [{ name: 'Johor', score: 3 }, { name: 'Sabah', score: 3 }] },
        ]
    }
];

const pingPongBracket: Round[] = [
    {
        title: 'Separuh Akhir',
        matches: [
            { participants: [{ name: 'Kuala Lumpur', score: 3 }, { name: 'Melaka', score: 1 }] },
            { participants: [{ name: 'Selangor', score: 3 }, { name: 'Pulau Pinang', score: 2 }] },
        ]
    },
    {
        title: 'Akhir',
        matches: [
            { participants: [{ name: 'Kuala Lumpur', score: 2 }, { name: 'Selangor', score: 3 }] },
        ]
    }
];

const bolaKeranjangBracket: Round[] = [
    {
        title: 'Separuh Akhir',
        matches: [
            { participants: [{ name: 'Negeri Sembilan', score: 88 }, { name: 'Johor', score: 82 }] },
            { participants: [{ name: 'Perak', score: 95 }, { name: 'Kuala Lumpur', score: 90 }] },
        ]
    },
    {
        title: 'Akhir',
        matches: [
            { participants: [{ name: 'Negeri Sembilan', score: 85 }, { name: 'Perak', score: 92 }] },
        ]
    }
];


export const events: Event[] = [
  {
    id: 'jogathon-berpasukan',
    imageUrl: 'https://picsum.photos/400/300?random=30',
    title: 'Jogathon (Berpasukan)',
    category: 'Sukan',
    categoryIcon: 'running',
    gameStatus: 'Teras Perak',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'KOMPLEKS RAKAN MUDA KAMUNTING',
    isFeatured: true,
    description: 'Acara larian berpasukan untuk memupuk semangat kerjasama dan gaya hidup sihat di kalangan warga pendidik.',
    bracketData: genericBracket,
    schedule: [
      { time: '08:00', activity: 'Pendaftaran Peserta' },
      { time: '08:30', activity: 'Sesi Memanaskan Badan' },
      { time: '09:00', activity: 'Pelepasan Peserta' },
      { time: '11:00', activity: 'Peserta Mula Tiba di Garisan Penamat' },
      { time: '12:00', activity: 'Majlis Penyampaian Hadiah' },
    ]
  },
  {
    id: 'hoki-l',
    imageUrl: 'https://picsum.photos/400/300?random=31',
    title: 'Hoki (L)',
    category: 'Sukan',
    categoryIcon: 'hockey',
    gameStatus: 'Teras Perak',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'SEKOLAH KEBANGSAAN SELAMA',
    isFeatured: true,
    description: 'Saksikan perlawanan sengit antara pasukan hoki lelaki dari seluruh negara merebut kejuaraan.',
    bracketData: hokiBracket,
    schedule: [
      { time: '09:00', activity: 'Perlawanan Kumpulan A' },
      { time: '11:00', activity: 'Perlawanan Kumpulan B' },
      { time: '14:00', activity: 'Pusingan Suku Akhir' },
      { time: '16:00', activity: 'Pusingan Separuh Akhir' },
    ]
  },
  {
    id: 'golf-berpasukan',
    imageUrl: 'https://picsum.photos/400/300?random=32',
    title: 'Golf (Berpasukan)',
    category: 'Sukan',
    categoryIcon: 'golf',
    gameStatus: 'Teras Kebangsaan',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'ROYAL PERAK GOLF CLUB IPOH',
    description: 'Kejohanan golf berpasukan yang menguji strategi dan kemahiran di padang golf bertaraf antarabangsa.',
    bracketData: golfBracket,
    schedule: genericSchedule,
  },
  {
    id: 'boling-tenpin-berpasukan',
    imageUrl: 'https://picsum.photos/400/300?random=33',
    title: 'Boling Tenpin (Berpasukan)',
    category: 'Sukan',
    categoryIcon: 'bowling',
    gameStatus: 'Teras Kebangsaan',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'WINNERS BOWL TAIPING',
    description: 'Pertandingan boling tenpin berpasukan yang penuh keseronokan dan memerlukan ketepatan balingan.',
    bracketData: bolingTenpinBracket,
    schedule: genericSchedule,
  },
  {
    id: 'tenis-berpasukan',
    imageUrl: 'https://picsum.photos/400/300?random=34',
    title: 'Tenis (Berpasukan)',
    category: 'Sukan',
    categoryIcon: 'tennis',
    gameStatus: 'Teras Perak',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'DEWAN CRC TAIPING/GELANGGANG MPT',
    description: 'Aksi hebat di gelanggang tenis dalam acara berpasukan yang menampilkan pemain-pemain berbakat.',
    bracketData: tenisBracket,
    schedule: genericSchedule,
  },
  {
    id: 'badminton-berpasukan',
    imageUrl: 'https://picsum.photos/400/300?random=35',
    title: 'Badminton (Berpasukan)',
    category: 'Sukan',
    categoryIcon: 'badminton',
    gameStatus: 'Teras Perak',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'DEWAN BADMINTON KAWASAKI TAIPING',
    description: 'Kejohanan badminton berpasukan yang dinanti-nantikan, menampilkan perlawanan yang pantas dan menarik.',
    bracketData: badmintonBracket,
    schedule: genericSchedule,
  },
  {
    id: 'petanque-berpasukan',
    imageUrl: 'https://picsum.photos/400/300?random=36',
    title: 'Petanque (Berpasukan)',
    category: 'Sukan',
    categoryIcon: 'petanque',
    gameStatus: 'Teras Perak',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'PUSAT KOREKSIONAL (KEMTA) KAMUNTING',
    description: 'Uji kemahiran membaling dan strategi dalam sukan petanque yang memerlukan fokus dan ketenangan.',
    bracketData: petanqueBracket,
    schedule: genericSchedule,
  },
  {
    id: 'bola-tampar-l',
    imageUrl: 'https://picsum.photos/400/300?random=37',
    title: 'Bola Tampar (L)',
    category: 'Sukan',
    categoryIcon: 'volleyball',
    gameStatus: 'Pilihan Tuan Rumah',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'SJKC AULONG TAIPING',
    description: 'Saksikan rejaman padu dan pertahanan kental dalam pertandingan bola tampar kategori lelaki.',
    bracketData: bolaTamparLelakiBracket,
    schedule: genericSchedule,
  },
  {
    id: 'slowpitch-softball-berpasukan',
    imageUrl: 'https://picsum.photos/400/300?random=38',
    title: 'Slowpitch Softball (Berpasukan)',
    category: 'Sukan',
    categoryIcon: 'softball',
    gameStatus: 'Pilihan Kebangsaan',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'SMK BUKIT JANA',
    description: 'Permainan sofbol yang menarik dan strategik, memerlukan kerjasama sepasukan yang jitu.',
    bracketData: softballBracket,
    schedule: genericSchedule,
  },
  {
    id: 'orienteering-berpasukan',
    imageUrl: 'https://picsum.photos/400/300?random=39',
    title: 'Orienteering (Berpasukan)',
    category: 'Sukan',
    categoryIcon: 'running',
    gameStatus: 'Pilihan Kebangsaan',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'KOMPLEKS RAKAN MUDA KAMUNTING',
    description: 'Cabaran navigasi dan ketahanan fizikal dalam acara orienteering merentasi landskap alam semula jadi.',
    bracketData: genericBracket,
    schedule: genericSchedule,
  },
  {
    id: 'pickleball-vip',
    imageUrl: 'https://picsum.photos/400/300?random=40',
    title: 'Pickleball (VIP)',
    category: 'Sukan',
    categoryIcon: 'tennis',
    gameStatus: 'VIP',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'SK SULTAN YUSSUF AMDR TAIPING',
    description: 'Acara khas pickleball untuk tetamu VIP, memperkenalkan sukan yang semakin popular di Malaysia.',
    bracketData: pickleballBracket,
    schedule: genericSchedule,
  },
  {
    id: 'bola-sepak-senior-l',
    imageUrl: 'https://picsum.photos/400/300?random=41',
    title: 'Bola Sepak Senior (L)',
    category: 'Sukan',
    categoryIcon: 'football',
    gameStatus: 'Teras Kebangsaan',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'SMK TENGKU MENTERI, SMK PENGKALAN AUR, SMK SIMPANG, SK MATANG',
    description: 'Kejohanan bola sepak kategori senior yang menampilkan bakat-bakat bola sepak dari perkhidmatan pendidikan.',
    bracketData: bolaSepakSeniorBracket,
    schedule: genericSchedule,
  },
  {
    id: 'bola-sepak-veteran-l',
    imageUrl: 'https://picsum.photos/400/300?random=42',
    title: 'Bola Sepak Veteran (L)',
    category: 'Sukan',
    categoryIcon: 'football',
    gameStatus: 'Teras Kebangsaan',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'SMK TAMAN TASIK, SMK HUA LIAN, KOLEJ VOKASIONAL TAIPING, SK ST GEORGE',
    description: 'Pemain-pemain berpengalaman beraksi dalam kategori veteran, membuktikan semangat kesukanan tiada batasan usia.',
    bracketData: bolaSepakVeteranBracket,
    schedule: genericSchedule,
  },
  {
    id: 'bola-jaring-w',
    imageUrl: 'https://picsum.photos/400/300?random=43',
    title: 'Bola Jaring (W)',
    category: 'Sukan',
    categoryIcon: 'basketball', // Using basketball as a close alternative
    gameStatus: 'Teras Kebangsaan',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'SJKC HUA LIAN 3',
    description: 'Saksikan kepantasan dan ketangkasan pemain-pemain bola jaring wanita bersaing untuk gelaran juara.',
    bracketData: bolaJaringBracket,
    schedule: genericSchedule,
  },
  {
    id: 'sepak-takraw-l',
    imageUrl: 'https://picsum.photos/400/300?random=44',
    title: 'Sepak Takraw (L)',
    category: 'Sukan',
    categoryIcon: 'sepak-takraw',
    gameStatus: 'Teras Kebangsaan',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'SMK DATO HAJI HUSSEIN SELAMA',
    description: 'Aksi lincah dan rejaman akrobatik dalam sukan warisan, sepak takraw kategori lelaki.',
    bracketData: sepakTakrawBracket,
    schedule: genericSchedule,
  },
  {
    id: 'bola-tampar-w',
    imageUrl: 'https://picsum.photos/400/300?random=45',
    title: 'Bola Tampar (W)',
    category: 'Sukan',
    categoryIcon: 'volleyball',
    gameStatus: 'Teras Kebangsaan',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'SJKC POKOK ASSAM TAIPING',
    description: 'Pertandingan bola tampar kategori wanita yang menjanjikan aksi sengit dan semangat berpasukan.',
    bracketData: bolaTamparWanitaBracket,
    schedule: genericSchedule,
  },
  {
    id: 'malam-kebudayaan',
    imageUrl: 'https://picsum.photos/400/300?random=46',
    title: 'Malam Kebudayaan',
    category: 'Kebudayaan',
    categoryIcon: 'culture',
    gameStatus: 'Teras Kebangsaan',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'SMK DOKTOR BURHANUDDIN',
    description: 'Malam yang mempamerkan kekayaan seni dan budaya Malaysia melalui persembahan tarian, nyanyian, dan teater.',
    bracketData: genericBracket,
    schedule: [
      { time: '20:00', activity: 'Ketibaan Tetamu Jemputan' },
      { time: '20:30', activity: 'Ucapan Perasmian' },
      { time: '21:00', activity: 'Persembahan Tarian Tradisional' },
      { time: '21:45', activity: 'Persembahan Nyanyian' },
      { time: '22:30', activity: 'Jamuan Makan dan Bersurai' },
    ]
  },
  {
    id: 'ping-pong-berpasukan',
    imageUrl: 'https://picsum.photos/400/300?random=47',
    title: 'Ping Pong (Berpasukan)',
    category: 'Sukan',
    categoryIcon: 'ping-pong',
    gameStatus: 'Pilihan Tuan Rumah',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'DEWAN CRC TAIPING',
    description: 'Kejohanan ping pong berpasukan yang pantas, memerlukan refleks dan strategi yang tajam.',
    bracketData: pingPongBracket,
    schedule: genericSchedule,
  },
  {
    id: 'bola-keranjang-berpasukan',
    imageUrl: 'https://picsum.photos/400/300?random=48',
    title: 'Bola Keranjang (Berpasukan)',
    category: 'Sukan',
    categoryIcon: 'basketball',
    gameStatus: 'Pilihan Tuan Rumah',
    date: '25 September 2025',
    endDate: '28 September 2025',
    startTime: '08:00',
    endTime: '19:00',
    location: 'DEWAN KOMUNITI POKOK ASSAM',
    description: 'Saksikan aksi balingan jitu dan kerjasama berpasukan dalam pertandingan bola keranjang yang mendebarkan.',
    bracketData: bolaKeranjangBracket,
    schedule: genericSchedule,
  }
];