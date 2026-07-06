// Tokens shared across Core Flow screens
// __R: resolve a resource id to a bundled blob URL (standalone export) or fall back to the live URL.
const __R = (id, url) => (typeof window !== 'undefined' && window.__resources && window.__resources[id]) || url;

const T = {
  bg:        '#18140E',
  canvas:    '#0F0C08',
  surface:   '#221C14',
  surface2:  '#1A1510',
  hi:        '#2C2418',
  ink:       '#F2EBD9',
  mid:       '#C4B49A',
  soft:      '#7A6D55',
  divide:    'rgba(242,235,217,0.09)',
  divide2:   'rgba(242,235,217,0.05)',
  accent:    '#FF5820',
  give:      'rgba(80,180,120,0.9)',
  // — semantic surface tokens (theme-aware): dark values here, overridden in light tokens —
  glass:      'rgba(24,20,14,0.86)',   // translucent panel (headers, chrome)
  glassHi:    'rgba(24,20,14,0.93)',   // stronger translucent panel
  glassSoft:  'rgba(24,20,14,0.78)',   // softer translucent panel / chips
  glassFaint: 'rgba(15,12,8,0.42)',    // faint frosted control
  sheet:      '#1B1610',               // bottom sheets, menus, popovers
  sheet2:     '#100D08',               // deeper sheet surface
  scrim:      'rgba(10,8,5,0.82)',     // modal backdrop dim
  scrimSoft:  'rgba(10,8,5,0.72)',     // lighter backdrop dim
  scrimStrong:'rgba(10,8,5,0.96)',     // near-opaque takeover backdrop
  stripRing:  '#1B1610',               // ring color that matches strip bg (avatar cutouts)
  deviceBg:   '#0A0805',               // backdrop behind the phone screen
  serif:     "'Playfair Display', Georgia, serif",
  body:      "'Kalam', cursive",
  sans:      "'Inter', system-ui, sans-serif",
  mono:      "'JetBrains Mono', monospace",
  hand:      "'Caveat', cursive",
};

// Demo data — Марина К. from Wizard Flow
const MARINA = {
  name: 'Марина', last: 'К.',
  photo: __R('marina', 'https://i.pravatar.cc/240?img=47'),
  photos: [
    __R('marina', 'https://i.pravatar.cc/480?img=47'),
    'https://i.pravatar.cc/480?img=32',
    'https://i.pravatar.cc/480?img=45',
  ],
  role: 'Product Designer', company: 'Nomad Studio',
  bio: 'делаю продуктовый дизайн, пишу в телеге про ремесло. Люблю неочевидные разговоры.',
  workingOn: 'ai-ассистент для B2B онбординга',
  give: ['UX-ревью','системный дизайн','брендинг'],
  want: ['найти инвестора','дистрибуция'],
  goals: ['найти со-автора для side-project','поговорить про AI в дизайне'],
  ice: ['что последнее прочитал(а)?','над чем сейчас залипаешь?'],
  status: 'на Mining Expo',
};

// Михаил — viewer / counterpart for match/chat/meeting screens
const MIKHAIL = {
  name: 'Михаил', last: 'Д.',
  photo: __R('mikhail', 'https://i.pravatar.cc/240?img=12'),
  photos: [
    __R('mikhail', 'https://i.pravatar.cc/480?img=12'),
    'https://i.pravatar.cc/480?img=13',
    'https://i.pravatar.cc/480?img=52',
    'https://i.pravatar.cc/480?img=60',
  ],
  role: 'Founder', company: 'Levitate AI',
  bio: 'строю AI-инструменты для small business. до этого 8 лет в продуктовой аналитике.',
  workingOn: 'B2B SaaS для автоматизации онбординга клиентов',
  give: ['fundraising','growth','выход на рынок'],
  want: ['UX-ревью','дизайн-партнёр','системный дизайн'],
  goals: ['найти дизайн-партнёра для MVP','обсудить B2B-онбординг'],
  ice: ['какой инструмент тебя последний раз удивил?','что в дизайне сейчас переоценено?'],
  status: 'на Mining Expo',
  expectation: 'найти дизайн-партнёра в команду и обкатать идею B2B-онбординга на живых людях',
};

// Other people on the map
const PEOPLE = [
  { id:'p1', n:'А', name:'Аня',     role:'Brand designer · Studio Index',    score: 92, x: 28, y: 36, color:'#FF5820', photo:__R('p1','https://i.pravatar.cc/400?img=47'), about:'делаю бренды для ранних стартапов, топлю за смысл в визуале', tags:['брендинг','иллюстрация','#театр'], give:['UX-ревью','айдентика'], want:['со-автор проекта'] },
  { id:'p2', n:'М', name:'Михаил',  role:'Founder · Levitate AI',            score: 88, x: 52, y: 22, color:'#FF8A4D', highlight:true, photo:__R('p2','https://i.pravatar.cc/400?img=12'), about:'строю AI-инструменты для малого бизнеса, ищу дизайн-партнёра', tags:['AI','B2B','#бег'], give:['fundraising','growth'], want:['дизайн-партнёр'] },
  { id:'p3', n:'К', name:'Костя',   role:'iOS engineer · Yandex',            score: 81, x: 70, y: 44, color:'#E8A87C', photo:__R('p3','https://i.pravatar.cc/400?img=33'), about:'пишу под iOS 9 лет, по выходным вожусь с синтезаторами', tags:['iOS','музыка','железо'], give:['менторство','код-ревью'], want:['pet-проект'] },
  { id:'p4', n:'Е', name:'Елена',   role:'PM · Avito',                       score: 76, x: 18, y: 62, color:'#D4856A', photo:__R('p4','https://i.pravatar.cc/400?img=44'), about:'продуктовый менеджер, люблю данные и разговоры за кофе', tags:['продукт','данные','#кофе'], give:['продуктовая стратегия'], want:['нетворкинг'] },
  { id:'p5', n:'Д', name:'Дима',    role:'CTO · Notion-clone',               score: 74, x: 60, y: 70, color:'#FF5820', photo:__R('p5','https://i.pravatar.cc/400?img=68'), about:'технарь-фаундер, строю инструменты для мышления', tags:['стартап','инструменты'], give:['архитектура','найм'], want:['co-founder'] },
  { id:'p6', n:'С', name:'Соня',    role:'Researcher · IDEO',                score: 71, x: 82, y: 28, color:'#E8A87C', photo:__R('p6','https://i.pravatar.cc/400?img=23'), about:'исследую людей и продукты, коллекционирую вопросы', tags:['research','#книги'], give:['интервью','инсайты'], want:['обмен опытом'] },
  { id:'p7', n:'Р', name:'Рома',    role:'Founder · early stage',            score: 67, x: 38, y: 78, color:'#D4856A', photo:__R('p7','https://i.pravatar.cc/400?img=8') },
  { id:'p8', n:'Н', name:'Наташа',  role:'Designer · freelance',             score: 64, x: 72, y: 78, color:'#FF8A4D', photo:__R('p8','https://i.pravatar.cc/400?img=49') },
  { id:'p9', n:'И', name:'Иван',    role:'Marketing · B2B',                  score: 58, x: 48, y: 50, color:'#C4B49A', photo:__R('p9','https://i.pravatar.cc/400?img=15') },
  { id:'p10',n:'О', name:'Олег',    role:'Engineer',                         score: 52, x: 14, y: 82, color:'#7A6D55', photo:__R('p10','https://i.pravatar.cc/400?img=60') },
  { id:'p11',n:'Т', name:'Таня',    role:'Content',                          score: 48, x: 88, y: 60, color:'#7A6D55', photo:__R('p11','https://i.pravatar.cc/400?img=26') },
  { id:'p12',n:'В', name:'Влад',    role:'Sales',                            score: 42, x: 30, y: 14, color:'#7A6D55', photo:__R('p12','https://i.pravatar.cc/400?img=11') },
];

window.T = T;
window.MARINA = MARINA;
window.MIKHAIL = MIKHAIL;
window.PEOPLE = PEOPLE;

// Мои карточки (мультикарточность) — общие для профиля, пикера, событий
const MY_CARDS = [
  { id:'c1', title:'Продукт и дизайн', context:'работа',
    bio:'продуктовый дизайнер, 6 лет. люблю наводить порядок в сложных интерфейсах и спорить о деталях',
    tags:['UX-ревью','айдентика'] },
  { id:'c2', title:'Ищу кофаундера', context:'стартап', primary:false,
    bio:'собираю команду вокруг ai-инструмента для дизайн-ревью. нужен технарь, который горит темой',
    tags:['питч','ml'] },
];
window.MY_CARDS = MY_CARDS;
// Тариф пользователя (для гейта создания карточек): 'free' | 'paid'
window.MY_TARIFF = 'paid';
