// Screen: Карта конференции — лёгкий план + квест + тап по стенду → детали
const { T, PEOPLE, MARINA } = window;

// ─── контент стендов и зон ───────────────────────────────
const BOOTH_INFO = {
  A01: { name:'РигМастер',     tag:'жёсткие диски', desc:'Хранилища под Filecoin и Chia' },
  A02: { name:'КулТех',        tag:'охлаждение',  desc:'Иммерсионное охлаждение для ASIC' },
  A03: { name:'ХешСтат',       tag:'аналитика',   desc:'Мониторинг ферм и пулов в одном дашборде' },
  A04: { name:'МайнКадры',     tag:'hr',          desc:'Инженеры для дата-центров под ключ' },
  B01: { name:'ВаттЛайн',      tag:'энергетика',  desc:'Подключение к сетям и балансировка нагрузки' },
  B02: { name:'Шумология',     tag:'шумоизоляция',desc:'Тихие контейнеры для домашнего майнинга' },
  B03: { name:'ЛитийПро',      tag:'ИБП',         desc:'Резервное питание для ферм' },
  B04: { name:'КриптоЛогист',  tag:'логистика',   desc:'Доставка и растаможка оборудования из Азии' },
  A12: { name:'HashPoint',     tag:'asic · хостинг', desc:'Поставка ASIC под ключ и размещение от 3,9 ₽/кВт·ч', offer:'Квиз: подбор тарифа + скидка на первый месяц', sponsor:true },
  A13: { name:'Точка Входа',   tag:'обмен',       desc:'OTC-обмен и вывод для майнеров' },
  B10: { name:'ПулМон',        tag:'софт',        desc:'Прошивки и разгон ASIC без потери гарантии' },
  B11: { name:'ГридВольт',     tag:'энергетика',  desc:'Собственная генерация: газопоршневые станции', offer:'Анкета: 3 вопроса — и вы в списке ранних клиентов', sponsor:true },
  A15: { name:'ФермаДизайн',   tag:'инфраструктура', desc:'Проектирование майнинг-отелей' },
  B16: { name:'ГидроВатт',     tag:'зелёная энергия', desc:'Размещение на ГЭС-мощностях Сибири', offer:'Розыгрыш ASIC S21 сегодня в 17:00', sponsor:true },
  C10: { name:'АзикТрейд',     tag:'оборудование', desc:'Новые и б/у ASIC с гарантией', offer:'Живое демо: работающие машины на стенде', sponsor:true },
  C11: { name:'ТермоПоле',     tag:'утилизация тепла', desc:'Отопление теплиц теплом майнинга' },
  C12: { name:'БлокМедиа',     tag:'медиа',       desc:'Подкаст о майнинге и энергетике' },
  C13: { name:'КриптоШкола',   tag:'обучение',    desc:'Курс «Экономика майнинга» для инвесторов' },
};

const ZONE_INFO = {
  stage:   { name:'Главная сцена',  desc:'15:00 — «Экономика хешрейта после халвинга», зал на 200 мест' },
  network: { name:'Нетворкинг',     desc:'Зона знакомств Affin — сейчас здесь 12 человек', sponsor:true },
  lounge:  { name:'Лаунж',          desc:'Тихая зона: поработать и выдохнуть' },
  food:    { name:'Фуд-зона',       desc:'Кофе и снеки до 18:00, обед 13:00–14:30' },
  meet:    { name:'Переговорные',   desc:'M1 и M2 — бронь на стойке регистрации' },
  reg:     { name:'Регистрация',    desc:'Бейджи, программа и подарки за квест' },
};

// точки квеста на плане (% координаты) — чекин: 'qr' или 'quiz'
const QUEST_POINTS = [
  { n:1, x:17,   y:89.5, ref:'reg',  zone:true,  label:'Регистрация',   short:'Рег.',   type:'qr' },
  { n:2, x:30.5, y:64,   ref:'C10',              label:'Стенд C10',     short:'C10',    type:'qr',   sponsor:true },
  { n:3, x:30.5, y:30,   ref:'A12',              label:'Стенд A12',     short:'A12',    type:'quiz', sponsor:true,
    quiz:[
      { q:'С какого тарифа начинается размещение в HashPoint?', options:['От 3,9 ₽/кВт·ч','От 8 ₽/кВт·ч','От 12 ₽/кВт·ч'], correct:0 },
      { q:'Что входит в услугу «ASIC под ключ» от HashPoint?', options:['Только доставка','Поставка + настройка + размещение','Только прошивка'], correct:1 },
      { q:'Что HashPoint дарит за пройденный квиз?', options:['Футболку','Наклейки','Скидку на первый месяц размещения'], correct:2 },
    ] },
  { n:4, x:50,   y:13,   ref:'stage', zone:true, label:'Главная сцена', short:'Сцена',  type:'quiz',
    quiz:[
      { q:'Как называется доклад в 15:00?', options:['Будущее DeFi','Экономика хешрейта после халвинга','NFT для майнеров'], correct:1 },
      { q:'Что происходит с наградой за блок после халвинга?', options:['Удваивается','Не меняется','Сокращается вдвое'], correct:2 },
      { q:'Что важнее всего для окупаемости после халвинга?', options:['Цена электроэнергии','Цвет корпуса','Бренд фермы'], correct:0 },
    ] },
  { n:5, x:84.5, y:10,   ref:'network', zone:true, label:'Нетворкинг',  short:'Нетв.',  type:'qr', sponsor:true },
  { n:6, x:69.5, y:47,   ref:'B16',              label:'Стенд B16',     short:'B16',    type:'quiz', sponsor:true,
    quiz:[
      { q:'Что ГидроВатт разыгрывает на стенде?', options:['Футболку','Видеокарту','ASIC S21'], correct:2 },
      { q:'На чьих мощностях размещает ГидроВатт?', options:['ГЭС Сибири','Солнечные панели','Дизель-генераторы'], correct:0 },
      { q:'Когда розыгрыш приза?', options:['Завтра утром','Сегодня в 17:00','В полдень'], correct:1 },
    ] },
  { n:7, x:13,   y:66,   ref:'food', zone:true,  label:'Фуд-зона',      short:'Фуд',    type:'qr' },
  // анкета-кастдев: компания собирает лидов с контекстом — правильных ответов нет
  { n:8, x:65,   y:27,   ref:'B11',              label:'Стенд B11',     short:'B11',    type:'survey', sponsor:true,
    survey:[
      { q:'Сколько ASIC у вас сейчас в работе?', options:['Пока ни одного','До 10','10–100','Больше 100'] },
      { q:'Что сильнее всего ограничивает ваш рост?', options:['Тариф на электроэнергию','Лимит выделенной мощности','Шум и соседи','Свободный капитал'] },
      { q:'Рассматриваете собственную генерацию?', options:['Уже используем','Считаем экономику','Нет, только сеть'] },
    ] },
];

function ConfBooth({ x, y, w = 8, h = 5.5, label, sponsor = false, accent, onTap, selected }) {
  return (
    <div onClick={onTap} style={{
      position:'absolute', left:`${x}%`, top:`${y}%`, width:`${w}%`, height:`${h}%`,
      borderRadius:5, cursor:'pointer',
      background: sponsor ? `${accent}1c` : 'rgba(140,120,90,0.10)',
      boxShadow: selected ? `0 0 0 2px ${accent}` : 'none',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <span style={{fontFamily:T.mono, fontSize:6.5, fontWeight:600, letterSpacing:0.4,
        color: sponsor ? 'rgba(170,70,25,0.9)' : 'rgba(110,95,70,0.6)'}}>{label}</span>
    </div>
  );
}

function ConfZone({ x, y, w, h, bg, color, label, children, dim = false, onTap, selected, accent }) {
  return (
    <div onClick={onTap} style={{
      position:'absolute', left:`${x}%`, top:`${y}%`, width:`${w}%`, height:`${h}%`,
      borderRadius:10, background:bg, cursor: onTap ? 'pointer' : 'default',
      boxShadow: selected ? `0 0 0 2px ${accent}` : 'none',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2,
      opacity: dim ? 0.55 : 1,
    }}>
      <span style={{fontFamily:T.mono, fontSize:7, fontWeight:700, color, letterSpacing:1, textTransform:'uppercase', textAlign:'center'}}>{label}</span>
      {children}
    </div>
  );
}

function ConfAvatars({ ids }) {
  const ppl = ids.map(i => PEOPLE[i]).filter(Boolean);
  return (
    <div style={{display:'flex', justifyContent:'center', marginTop:2}}>
      {ppl.map((p, i) => (
        <div key={i} style={{
          width:22, height:22, borderRadius:'50%', overflow:'hidden',
          border:'1.5px solid rgba(255,255,255,0.9)', marginLeft: i ? -6 : 0,
          boxShadow:'0 1px 3px rgba(0,0,0,0.15)',
        }}>
          <img src={p.photo} alt={p.name} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
        </div>
      ))}
    </div>
  );
}

function QuestMark({ p, accent, onTap, done, active, variant = 'pin' }) {
  const wrap = (child, extra = {}) => (
    <div onClick={onTap} style={{
      position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
      transform:'translate(-50%,-50%)', zIndex: active ? 6 : done ? 4 : 5, cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center', ...extra,
    }}>{child}</div>
  );
  const green = '#3FB87C';
  const num = <span style={{fontFamily:T.mono, fontWeight:700, lineHeight:1}}>{p.n}</span>;
  const check = (s=11) => <svg width={s} height={s} viewBox="0 0 12 12" fill="none"><path d="M2 6.5l3 3 5-6.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const star = (s, c) => <svg width={s} height={s} viewBox="0 0 20 20"><path d="M10 2 L12.2 7 L17.5 7.4 L13.5 11 L14.8 16.2 L10 13.4 L5.2 16.2 L6.5 11 L2.5 7.4 L7.8 7 Z" fill={c}/></svg>;

  // ── PIN — каплевидный маркер (по умолчанию) ──
  if (variant === 'pin') {
    const s = active ? 34 : 27;
    return wrap(
      <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center',
        animation: active ? 'confPulse 1.9s ease-in-out infinite' : 'none'}}>
        <div style={{
          width:s, height:s, borderRadius:'50% 50% 50% 0', transform:'rotate(-45deg)',
          background: done ? green : '#FDFBF6',
          border: done ? '2px solid #fff' : `2px solid ${p.sponsor ? accent : 'rgba(150,130,100,0.6)'}`,
          boxShadow: active ? `0 0 0 5px ${accent}22, 0 4px 10px rgba(0,0,0,0.3)`
                    : p.sponsor && !done ? `0 0 10px ${accent}55, 0 2px 6px rgba(0,0,0,0.25)` : '0 2px 6px rgba(0,0,0,0.25)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <div style={{transform:'rotate(45deg)', display:'flex', alignItems:'center', justifyContent:'center',
            color: p.sponsor ? accent : 'rgba(110,95,70,0.9)', fontSize: active ? 12 : 10.5}}>
            {done ? check(13) : p.sponsor ? star(13, accent) : num}
          </div>
        </div>
      </div>
    );
  }

  // ── DOT — круглая точка ──
  if (variant === 'dot') {
    const s = active ? 28 : 21;
    return wrap(
      <div style={{
        width:s, height:s, borderRadius:'50%',
        background: done ? green : '#FDFBF6',
        border: done ? '2px solid #fff' : `2px solid ${p.sponsor ? accent : 'rgba(150,130,100,0.55)'}`,
        boxShadow: active ? `0 0 0 6px ${accent}26, 0 3px 10px ${accent}55`
                  : p.sponsor && !done ? `0 0 0 4px ${accent}1a, 0 0 12px ${accent}44` : '0 1px 5px rgba(0,0,0,0.2)',
        display:'flex', alignItems:'center', justifyContent:'center',
        color: p.sponsor ? accent : 'rgba(110,95,70,0.85)', fontSize: active ? 12 : 10,
        animation: active ? 'confPulse 1.9s ease-in-out infinite' : (p.sponsor && !done) ? 'confSoftGlow 2.6s ease-in-out infinite' : 'none',
      }}>
        {done ? check(11) : p.sponsor ? star(11, accent) : num}
      </div>
    );
  }

  // ── STAMP — квадрат-штамп «паспорт квеста» ──
  if (variant === 'stamp') {
    const s = active ? 30 : 24;
    return wrap(
      <div style={{
        width:s, height:s, borderRadius:8,
        background: done ? green : 'rgba(253,251,246,0.6)',
        border: done ? '2px solid #fff' : `1.5px dashed ${p.sponsor ? accent : 'rgba(150,130,100,0.7)'}`,
        boxShadow: active ? `0 0 0 5px ${accent}22, 0 3px 9px rgba(0,0,0,0.28)`
                  : done ? '0 2px 7px rgba(63,184,124,0.4)' : 'none',
        display:'flex', alignItems:'center', justifyContent:'center',
        color: p.sponsor ? accent : 'rgba(110,95,70,0.85)', fontSize: active ? 12 : 10.5,
        animation: active ? 'confPulse 1.9s ease-in-out infinite' : 'none',
      }}>
        {done ? check(13) : p.sponsor ? star(12, accent) : num}
      </div>
    );
  }

  // ── RING — тонкое кольцо-прогресс ──
  const s = active ? 30 : 23;
  return wrap(
    <div style={{
      width:s, height:s, borderRadius:'50%',
      background: done ? green : 'rgba(253,251,246,0.92)',
      border: done ? `2px solid ${green}` : `2.5px solid ${p.sponsor ? accent : 'rgba(150,130,100,0.5)'}`,
      boxShadow: active ? `0 0 0 5px ${accent}22, 0 3px 9px rgba(0,0,0,0.25)`
                : p.sponsor && !done ? `0 0 10px ${accent}44` : '0 1px 4px rgba(0,0,0,0.18)',
      display:'flex', alignItems:'center', justifyContent:'center',
      color: done ? '#fff' : p.sponsor ? accent : 'rgba(110,95,70,0.85)', fontSize: active ? 12 : 10,
      animation: active ? 'confPulse 1.9s ease-in-out infinite' : 'none',
    }}>
      {done ? check(12) : p.sponsor ? star(11, accent) : num}
    </div>
  );
}

function ConferenceMapScreen({ accent = T.accent, onBack, onPeople, activeCard, onSwitchCard }) {
  const [sel, setSel] = React.useState(null); // {kind:'booth'|'zone', id}
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [doneSet, setDoneSet] = React.useState(() => new Set([1,2]));
  const [task, setTask] = React.useState(null);       // quest point → карточка задания
  const [overlay, setOverlay] = React.useState(null); // {kind:'qr'|'quiz'|'reward', point}
  const [questIntro, setQuestIntro] = React.useState(true); // мягкая продажа квеста при входе
  const doneCount = doneSet.size;
  const isDone = (p) => doneSet.has(p.n);
  const nextPt = QUEST_POINTS.find(p => !doneSet.has(p.n));

  const completePoint = (p) => {
    setDoneSet(prev => {
      const s = new Set(prev); s.add(p.n);
      if (s.size === QUEST_POINTS.length) setTimeout(() => setOverlay({ kind:'reward' }), 600);
      return s;
    });
    setTask(null);
  };

  const chrome = {
    background:T.glassHi, backdropFilter:'blur(14px)',
    WebkitBackdropFilter:'blur(14px)', border:`1px solid ${T.divide}`,
  };

  const pickBooth = (id) => { setTask(null); setSel(s => s && s.kind==='booth' && s.id===id ? null : {kind:'booth', id}); };
  const pickZone  = (id) => { setTask(null); setSel(s => s && s.kind==='zone' && s.id===id ? null : {kind:'zone', id}); };
  const pickQuest = (p) => { setSel(null); setTask(t => t && t.n===p.n ? null : p); };
  const isSel = (kind, id) => sel && sel.kind===kind && sel.id===id;

  // selected info + quest link
  const info = sel ? (sel.kind==='booth' ? BOOTH_INFO[sel.id] : ZONE_INFO[sel.id]) : null;
  const questPt = sel ? QUEST_POINTS.find(p => p.ref === sel.id) : null;

  const booth = (x, y, id) => (
    <ConfBooth key={id} x={x} y={y} label={id} accent={accent}
      sponsor={!!(BOOTH_INFO[id] && BOOTH_INFO[id].sponsor)}
      onTap={() => pickBooth(id)} selected={isSel('booth', id)}/>
  );

  return (
    <div style={{position:'absolute', inset:0, overflow:'hidden',
      background:'radial-gradient(ellipse at 50% 35%, #F6F2EA 0%, #EFE9DD 60%, #E8E0D1 100%)'}}>

      {/* ── план зала (SVG floor plan) ── */}
      <div style={{position:'absolute', left:0, right:0, top:'calc(90px + var(--sat))', bottom:118}}>
        {(() => {
          const px = (v) => +(v * 3.6).toFixed(1);
          const py = (v) => +(v * 5.08).toFixed(1);
          const BW = 8, BH = 5.5;
          const booths = [
            {id:'A01',x:5,y:22},{id:'A02',x:5,y:29.6},{id:'A03',x:5,y:37.2},{id:'A04',x:5,y:44.8},
            {id:'B01',x:86,y:22},{id:'B02',x:86,y:29.6},{id:'B03',x:86,y:37.2},{id:'B04',x:86,y:44.8},
            {id:'A12',x:26,y:27},{id:'A13',x:36,y:27},{id:'B10',x:55,y:27},{id:'B11',x:65,y:27},
            {id:'A15',x:26,y:44},{id:'B16',x:65,y:44},
            {id:'C10',x:26,y:61},{id:'C11',x:36,y:61},{id:'C12',x:55,y:61},{id:'C13',x:65,y:61},
          ];
          const TINT = {
            amber:  {fill:'rgba(214,170,110,0.20)', stroke:'rgba(160,120,70,0.45)', ink:'rgba(130,95,50,0.92)'},
            green:  {fill:'rgba(120,160,125,0.20)', stroke:'rgba(80,120,85,0.45)',  ink:'rgba(70,110,80,0.95)'},
            orange: {fill:'rgba(230,160,80,0.18)',  stroke:'rgba(180,120,50,0.45)', ink:'rgba(155,100,40,0.92)'},
            violet: {fill:'rgba(130,120,175,0.16)', stroke:'rgba(100,90,150,0.45)', ink:'rgba(95,85,140,0.92)'},
            stage:  {fill:'rgba(115,135,170,0.38)', stroke:'rgba(115,135,170,0.6)', ink:'#F4F1EA'},
            dim:    {fill:'rgba(140,120,90,0.07)',  stroke:'rgba(140,120,90,0.22)', ink:'rgba(120,105,80,0.6)'},
          };
          const zones = [
            {id:'stage',   x:30, y:3,  w:40, h:10, tint:'stage',  label:'Сцена'},
            {id:'lounge',  x:5,  y:4,  w:20, h:13, tint:'amber',  label:'Лаунж'},
            {id:'network', x:74, y:4,  w:21, h:13, tint:'green',  label:'Нетворкинг'},
            {id:'food',    x:5,  y:56, w:16, h:20, tint:'orange', label:'Фуд-зона'},
            {id:'meet',    x:77, y:56, w:18, h:20, tint:'violet', label:'Переговорные'},
            {id:'reg',     x:5,  y:84, w:24, h:11, tint:'green',  label:'Регистрация'},
            {id:'wardrobe',x:66, y:86, w:12, h:9,  tint:'dim', dim:true, label:'Гардероб'},
            {id:'wc',      x:80, y:86, w:8,  h:9,  tint:'dim', dim:true, label:'WC'},
          ];
          const doneRefs = new Set(QUEST_POINTS.filter(p => doneSet.has(p.n)).map(p => p.ref));
          const activeRef = nextPt ? nextPt.ref : null;
          const qStatus = (id) => doneRefs.has(id) ? 'done' : (activeRef === id ? 'active' : null);

          const QuestOutline = ({ x, y, w, h, status, rx = 6 }) => {
            if (!status) return null;
            const pad = 2.5;
            const common = { x:x-pad, y:y-pad, width:w+pad*2, height:h+pad*2, rx:rx+pad, fill:'none' };
            return status === 'done'
              ? <rect {...common} stroke="#3FB87C" strokeWidth="2.2" strokeDasharray="6 4" strokeLinecap="round"/>
              : <rect {...common} stroke={accent} strokeWidth="2.4" strokeDasharray="6 4" strokeLinecap="round">
                  <animate attributeName="stroke-opacity" values="1;0.45;1" dur="1.8s" repeatCount="indefinite"/>
                </rect>;
          };
          const DoneBadge = ({ cx, cy }) => (
            <g>
              <circle cx={cx} cy={cy} r="7.5" fill="#3FB87C" stroke="#FBF7EF" strokeWidth="1.5"/>
              <path d={`M${cx-3.4} ${cy} l2.4 2.4 l4.2 -4.8`} stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          );

          return (
            <svg viewBox="0 0 360 508" preserveAspectRatio="none" style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
              {/* корпус зала */}
              <rect x="6" y="8" width="348" height="470" rx="20" fill="#FBF7EF" stroke="rgba(120,105,80,0.5)" strokeWidth="1.6"/>
              {/* проходы — тонкая сетка */}
              <g stroke="rgba(150,130,100,0.14)" strokeWidth="1">
                <line x1="6" y1="230" x2="354" y2="230"/>
                <line x1="180" y1="80" x2="180" y2="300"/>
              </g>
              {/* вход — разрыв в стене снизу */}
              <rect x="150" y="472" width="60" height="12" fill="#FBF7EF"/>
              <line x1="150" y1="478" x2="150" y2="484" stroke="rgba(120,105,80,0.5)" strokeWidth="1.6"/>
              <line x1="210" y1="478" x2="210" y2="484" stroke="rgba(120,105,80,0.5)" strokeWidth="1.6"/>

              {/* зоны */}
              {zones.map(z => {
                const t = TINT[z.tint];
                const X = px(z.x), Y = py(z.y), W = px(z.w), H = py(z.h);
                const st = z.dim ? null : qStatus(z.id);
                const selY = isSel('zone', z.id);
                return (
                  <g key={z.id} onClick={z.dim ? undefined : () => pickZone(z.id)} style={{cursor: z.dim ? 'default' : 'pointer'}}>
                    <rect x={X} y={Y} width={W} height={H} rx={z.id==='stage'?4:10}
                      fill={t.fill} stroke={selY ? 'rgba(60,50,35,0.55)' : t.stroke} strokeWidth={selY ? 1.8 : 1.2}/>
                    <text x={X+W/2} y={Y+H/2} textAnchor="middle" dominantBaseline="central"
                      fontFamily={T.mono} fontSize={z.dim?8:9.5} fontWeight="700" fill={t.ink}
                      letterSpacing="0.6" style={{textTransform:'uppercase'}}>{z.label}</text>
                    <QuestOutline x={X} y={Y} w={W} h={H} status={st} rx={10}/>
                    {st === 'done' && <DoneBadge cx={X+W-3} cy={Y+3}/>}
                  </g>
                );
              })}

              {/* сцена — звуковые дуги */}
              <g fill="none" stroke="rgba(115,135,170,0.5)" strokeWidth="1.4" strokeLinecap="round">
                <path d="M150 92 Q180 86 210 92"/>
                <path d="M156 100 Q180 95 204 100"/>
              </g>

              {/* кофе-поинт */}
              <g>
                <circle cx="180" cy="242" r="24" fill="rgba(190,140,90,0.16)" stroke="rgba(160,120,80,0.4)" strokeWidth="1.2"/>
                <g transform="translate(172,232)" stroke="rgba(150,105,60,0.9)" strokeWidth="1.3" fill="none" strokeLinecap="round">
                  <path d="M0 4h11v4a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4z"/>
                  <path d="M11 5.5h1.6a2 2 0 0 1 0 4h-.6"/>
                  <path d="M3 -0.5c-.4.8-.4 1.4 0 2.2M6.5 -0.5c-.4.8-.4 1.4 0 2.2"/>
                </g>
                <text x="180" y="258" textAnchor="middle" fontFamily={T.mono} fontSize="7.5" fontWeight="700"
                  fill="rgba(150,105,60,0.9)" letterSpacing="0.8" style={{textTransform:'uppercase'}}>Кофе</text>
              </g>

              {/* стенды */}
              {booths.map(b => {
                const X = px(b.x), Y = py(b.y), W = px(BW), H = py(BH);
                const st = qStatus(b.id);
                const selB = isSel('booth', b.id);
                return (
                  <g key={b.id} onClick={() => pickBooth(b.id)} style={{cursor:'pointer'}}>
                    <rect x={X} y={Y} width={W} height={H} rx={5}
                      fill="rgba(150,130,100,0.12)" stroke={selB ? 'rgba(60,50,35,0.55)' : 'rgba(150,130,100,0.35)'} strokeWidth={selB ? 1.8 : 1}/>
                    <text x={X+W/2} y={Y+H/2} textAnchor="middle" dominantBaseline="central"
                      fontFamily={T.mono} fontSize="8.5" fontWeight="600" fill="rgba(110,95,70,0.8)" letterSpacing="0.5">{b.id}</text>
                    <QuestOutline x={X} y={Y} w={W} h={H} status={st} rx={5}/>
                    {st === 'done' && <DoneBadge cx={X+W-1} cy={Y+1}/>}
                  </g>
                );
              })}

              {/* вход */}
              <g>
                <path d="M180 456 v-13 M175 448 l5 -5 5 5" stroke="rgba(110,95,70,0.75)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="180" y="466" textAnchor="middle" fontFamily={T.mono} fontSize="7.5" fontWeight="700"
                  fill="rgba(110,95,70,0.75)" letterSpacing="1.2" style={{textTransform:'uppercase'}}>Вход</text>
              </g>
            </svg>
          );
        })()}
      </div>

      {/* ── header ── */}
      <div style={{position:'absolute', top:'calc(10px + var(--sat))', left:0, right:0, zIndex:10, padding:'8px 14px',
        display:'flex', alignItems:'center', gap:8}}>
        <button onClick={onBack} style={{...chrome, width:40, height:40, borderRadius:14, flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
          <svg width="8" height="13" viewBox="0 0 8 13"><path d="M7 1L1 6.5 7 12" stroke={T.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* участники — в ленту анкет */}
        <button onClick={onPeople} aria-label="участники" style={{...chrome, flex:1, height:40, borderRadius:20, padding:'0 12px',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8, minWidth:0, cursor:'pointer'}}>
          <div style={{display:'flex', flexShrink:0}}>
            {[2,4,5].map((pi, i) => (
              <div key={i} style={{width:22, height:22, borderRadius:'50%', overflow:'hidden',
                border:`1.5px solid ${T.stripRing}`, marginLeft: i ? -7 : 0}}>
                <img src={PEOPLE[pi].photo} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
              </div>
            ))}
          </div>
          <span style={{fontFamily:T.serif, fontSize:13.5, fontWeight:700, color:T.ink, whiteSpace:'nowrap'}}>Участники · 18</span>
        </button>

        {/* бургер */}
        <button onClick={() => setMenuOpen(true)} aria-label="меню события" style={{...chrome, width:40, height:40, borderRadius:14, flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
          <svg width="15" height="12" viewBox="0 0 15 12"><path d="M1 1h13M1 6h13M1 11h13" stroke={T.ink} strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* ── бургер-меню ── */}
      {menuOpen && (
        <div style={{position:'absolute', inset:0, zIndex:40}} onClick={() => setMenuOpen(false)}>
          <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.4)'}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:'absolute', top:104, right:14, minWidth:210,
            background:T.sheet, border:`1px solid ${T.divide}`, borderRadius:16, overflow:'hidden',
            boxShadow:'0 16px 40px rgba(0,0,0,0.6)'}}>
            <div style={{padding:'12px 15px 10px', borderBottom:`1px solid ${T.divide2}`,
              display:'flex', alignItems:'center', gap:7}}>
              <span style={{fontFamily:T.serif, fontSize:14, fontWeight:700, color:T.ink}}>Mining Expo</span>
              <div style={{width:6, height:6, borderRadius:'50%', background:'#3FB87C', boxShadow:'0 0 5px rgba(63,184,124,0.9)'}}/>
            </div>
            {activeCard && (
              <button onClick={() => { setMenuOpen(false); onSwitchCard && onSwitchCard(); }} style={{width:'100%', textAlign:'left',
                padding:'11px 15px', border:'none', borderBottom:`1px solid ${T.divide2}`, background:'transparent', cursor:'pointer',
                display:'flex', alignItems:'center', gap:10}}>
                <div style={{width:30, height:30, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:`1.5px solid ${accent}`}}>
                  <img src={MARINA.photo} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontFamily:T.mono, fontSize:7.5, color:T.soft, letterSpacing:1, textTransform:'uppercase'}}>ты здесь как</div>
                  <div style={{fontFamily:T.serif, fontSize:13.5, fontWeight:700, color:T.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{activeCard.title}</div>
                </div>
                <svg width="7" height="11" viewBox="0 0 7 12" style={{flexShrink:0}}><path d="M1 1l5 5-5 5" stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}
            {[
              {t:'Программа', icon:<path d="M3 4h12M3 8h12M3 12h7" stroke={T.mid} strokeWidth="1.5" strokeLinecap="round"/>},
              {t:'Спикеры', icon:<><circle cx="9" cy="6" r="2.8" stroke={T.mid} strokeWidth="1.5" fill="none"/><path d="M3.5 15q0-4.5 5.5-4.5t5.5 4.5" stroke={T.mid} strokeWidth="1.5" fill="none" strokeLinecap="round"/></>},
              {t:'Информация', icon:<><circle cx="9" cy="9" r="7" stroke={T.mid} strokeWidth="1.5" fill="none"/><path d="M9 8.5V13M9 5.5v.5" stroke={T.mid} strokeWidth="1.6" strokeLinecap="round"/></>},
              {t:'Поддержка', icon:<path d="M9 15c3.9 0 7-2.6 7-6s-3.1-6-7-6-7 2.6-7 6c0 1.6.7 3 1.8 4L3 16l3.3-1.6c.8.4 1.7.6 2.7.6z" stroke={T.mid} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>},
              {t:'Поделиться', icon:<><circle cx="5" cy="9" r="2.2" stroke={T.mid} strokeWidth="1.5" fill="none"/><circle cx="13.5" cy="4.5" r="2.2" stroke={T.mid} strokeWidth="1.5" fill="none"/><circle cx="13.5" cy="13.5" r="2.2" stroke={T.mid} strokeWidth="1.5" fill="none"/><path d="M7 8l4.5-2.5M7 10l4.5 2.5" stroke={T.mid} strokeWidth="1.5"/></>},
            ].map((o,i)=>(
              <button key={i} onClick={() => setMenuOpen(false)} style={{width:'100%', textAlign:'left', padding:'12px 15px', border:'none',
                borderTop: i===0 ? 'none' : `1px solid ${T.divide2}`, background:'transparent', cursor:'pointer',
                display:'flex', alignItems:'center', gap:11}}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">{o.icon}</svg>
                <span style={{fontFamily:T.sans, fontSize:14, color:T.ink}}>{o.t}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── нижняя панель: задание / детали / прогресс ── */}
      <div style={{position:'absolute', left:14, right:14, bottom:16, zIndex:10,
        ...chrome, background:T.glassHi, borderRadius:18, padding:'12px 15px'}}>
        {task ? (
          <div>
            <div style={{display:'flex', alignItems:'flex-start', gap:11}}>
              {/* тип чекина */}
              <div style={{width:38, height:38, borderRadius:12, flexShrink:0,
                background: isDone(task) ? 'rgba(63,184,124,0.15)' : `${accent}1c`,
                border: isDone(task) ? '1px solid rgba(63,184,124,0.4)' : `1px solid ${accent}44`,
                display:'flex', alignItems:'center', justifyContent:'center'}}>
                {isDone(task) ? (
                  <svg width="15" height="15" viewBox="0 0 12 12" fill="none"><path d="M2 6.5l3 3 5-6.5" stroke="#3FB87C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : task.type === 'qr' ? (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M2 6V3.5A1.5 1.5 0 0 1 3.5 2H6M14 2h2.5A1.5 1.5 0 0 1 18 3.5V6M18 14v2.5a1.5 1.5 0 0 1-1.5 1.5H14M6 18H3.5A1.5 1.5 0 0 1 2 16.5V14" stroke={accent} strokeWidth="1.6" strokeLinecap="round"/>
                    <path d="M2 10h16" stroke={accent} strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                ) : task.type === 'survey' ? (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round">
                    <rect x="3" y="2.5" width="14" height="15" rx="2.5"/>
                    <path d="M6.5 7h7M6.5 10.5h7M6.5 14h4"/>
                  </svg>
                ) : (
                  <span style={{fontFamily:T.serif, fontSize:17, fontWeight:700, color:accent}}>?</span>
                )}
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', alignItems:'center', gap:7, flexWrap:'wrap'}}>
                  <span style={{fontFamily:T.serif, fontSize:16, fontWeight:700, color:T.ink}}>{task.label}</span>
                  {task.sponsor && (
                    <svg width="11" height="11" viewBox="0 0 20 20"><path d="M10 2 L12.2 7 L17.5 7.4 L13.5 11 L14.8 16.2 L10 13.4 L5.2 16.2 L6.5 11 L2.5 7.4 L7.8 7 Z" fill={accent}/></svg>
                  )}
                  <span style={{fontFamily:T.mono, fontSize:8, color:T.soft, letterSpacing:1, textTransform:'uppercase'}}>
                    точка {task.n} · {task.type === 'qr' ? 'чекин QR' : task.type === 'survey' ? 'анкета' : 'квиз'}
                  </span>
                </div>
                <div style={{fontFamily:T.sans, fontSize:12.5, color:T.mid, marginTop:3, lineHeight:1.4}}>
                  {isDone(task)
                    ? 'пройдено — засчитано в квесте'
                    : task.type === 'qr'
                      ? 'отсканируй QR-код на точке — он на стойке или у стендиста'
                      : task.type === 'survey'
                        ? 'компания собирает мнения майнеров — займёт минуту, взамен попадёшь в список ранних клиентов'
                        : 'ответ узнаешь только на самой точке — подойди и спроси'}
                </div>
              </div>
              <button onClick={() => setTask(null)} style={{
                width:26, height:26, borderRadius:9, border:'none', background:T.hi,
                display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0,
              }}>
                <svg width="9" height="9" viewBox="0 0 11 11"><path d="M1 1l9 9M10 1l-9 9" stroke={T.soft} strokeWidth="1.6" strokeLinecap="round"/></svg>
              </button>
            </div>
            {!isDone(task) && (
              <button onClick={() => setOverlay({ kind: task.type, point: task })} style={{
                width:'100%', marginTop:11, padding:'12px 0', borderRadius:12, border:'none',
                background:accent, color:'#fff', fontFamily:T.sans, fontSize:14, fontWeight:600,
                cursor:'pointer', boxShadow:`0 5px 16px ${accent}44`,
              }}>{task.type === 'qr' ? 'Сканировать QR' : task.type === 'survey' ? 'Заполнить анкету' : 'Ответить на вопрос'}</button>
            )}
          </div>
        ) : info ? (
          <div>
            <div style={{display:'flex', alignItems:'flex-start', gap:10}}>
              {sel.kind === 'booth' && (
                <span style={{flexShrink:0, marginTop:2, padding:'3px 8px', borderRadius:7,
                  background: info.sponsor ? `${accent}22` : T.hi,
                  border: info.sponsor ? `1px solid ${accent}55` : `1px solid ${T.divide}`,
                  fontFamily:T.mono, fontSize:9.5, fontWeight:700,
                  color: info.sponsor ? accent : T.soft}}>{sel.id}</span>
              )}
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', alignItems:'center', gap:7, flexWrap:'wrap'}}>
                  <span style={{fontFamily:T.serif, fontSize:17, fontWeight:700, color:T.ink}}>{info.name}</span>
                  {info.sponsor && (
                    <svg width="11" height="11" viewBox="0 0 20 20"><path d="M10 2 L12.2 7 L17.5 7.4 L13.5 11 L14.8 16.2 L10 13.4 L5.2 16.2 L6.5 11 L2.5 7.4 L7.8 7 Z" fill={accent}/></svg>
                  )}
                  {info.tag && <span style={{fontFamily:T.mono, fontSize:8, color:T.soft, letterSpacing:1, textTransform:'uppercase'}}>{info.tag}</span>}
                </div>
                <div style={{fontFamily:T.sans, fontSize:12.5, color:T.mid, marginTop:3, lineHeight:1.4}}>{info.desc}</div>
                {info.offer && (
                  <div style={{position:'relative', marginTop:10, border:`1.5px dashed ${accent}66`, borderRadius:12,
                    background:`${accent}0d`, padding:'9px 12px 9px 40px'}}>
                    {/* перфорация купона — вырезы в цвет шита */}
                    <div style={{position:'absolute', left:-7, top:'50%', transform:'translateY(-50%)',
                      width:12, height:12, borderRadius:'50%', background:T.sheet, borderRight:`1.5px dashed ${accent}66`}}/>
                    <div style={{position:'absolute', right:-7, top:'50%', transform:'translateY(-50%)',
                      width:12, height:12, borderRadius:'50%', background:T.sheet, borderLeft:`1.5px dashed ${accent}66`}}/>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
                      style={{position:'absolute', left:13, top:'50%', transform:'translateY(-50%)'}}>
                      <rect x="3.5" y="8.5" width="17" height="4.5" rx="1.4"/>
                      <path d="M5.5 13v6.5a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5V13M12 8.5V21M12 8.5c-1.8 0-4.7-.6-4.7-3a2 2 0 0 1 3.6-1.2c.7 1 .9 2.7 1.1 4.2zm0 0c1.8 0 4.7-.6 4.7-3a2 2 0 0 0-3.6-1.2c-.7 1-.9 2.7-1.1 4.2z"/>
                    </svg>
                    <div style={{fontFamily:T.mono, fontSize:8, letterSpacing:1.4, textTransform:'uppercase', color:accent, marginBottom:2}}>на стенде</div>
                    <div style={{fontFamily:T.sans, fontSize:13, fontWeight:600, color:T.ink, lineHeight:1.35}}>{info.offer}</div>
                  </div>
                )}
                {questPt && (
                  <div style={{marginTop:8}}>
                    <span style={{fontFamily:T.mono, fontSize:8.5, letterSpacing:0.8, textTransform:'uppercase',
                      padding:'3px 8px', borderRadius:7,
                      background: doneSet.has(questPt.n) ? 'rgba(63,184,124,0.15)' : `${accent}1c`,
                      color: doneSet.has(questPt.n) ? '#3FB87C' : accent}}>
                      {doneSet.has(questPt.n) ? 'квест · пройдено ✓' : `квест · точка ${questPt.n}`}
                    </span>
                  </div>
                )}
              </div>
              <button onClick={() => setSel(null)} style={{
                width:26, height:26, borderRadius:9, border:'none', background:T.hi,
                display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0,
              }}>
                <svg width="9" height="9" viewBox="0 0 11 11"><path d="M1 1l9 9M10 1l-9 9" stroke={T.soft} strokeWidth="1.6" strokeLinecap="round"/></svg>
              </button>
            </div>
            {questPt && !doneSet.has(questPt.n) && (
              <button onClick={() => setOverlay({ kind: questPt.type, point: questPt })} style={{
                width:'100%', marginTop:12, padding:'12px 0', borderRadius:12, border:'none',
                background:accent, color:'#fff', fontFamily:T.sans, fontSize:14, fontWeight:600,
                cursor:'pointer', boxShadow:`0 5px 16px ${accent}44`,
              }}>{questPt.type === 'qr' ? 'Сканировать QR' : questPt.type === 'survey' ? 'Заполнить анкету' : 'Ответить на вопрос'}</button>
            )}
          </div>
        ) : (
          <div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <span style={{fontFamily:T.mono, fontSize:8.5, color:T.soft, letterSpacing:1.5, textTransform:'uppercase'}}>квест по точкам</span>
              <span style={{fontFamily:T.serif, fontSize:15, fontWeight:700, color:T.ink}}>
                <span style={{color:accent}}>{doneCount}</span> / {QUEST_POINTS.length}
              </span>
            </div>
            <div style={{display:'flex', gap:5, margin:'9px 0'}}>
              {QUEST_POINTS.map(p => {
                const d = isDone(p);
                const nx = nextPt && nextPt.n === p.n;
                return (
                  <button key={p.n} onClick={() => pickQuest(p)} style={{
                    flex:1, minWidth:0, padding:'5px 2px', borderRadius:9, cursor:'pointer',
                    background: d ? 'rgba(63,184,124,0.13)' : nx ? `${accent}1c` : T.hi,
                    border: nx ? `1px solid ${accent}66` : d ? '1px solid rgba(63,184,124,0.3)' : `1px solid transparent`,
                    display:'flex', flexDirection:'column', alignItems:'center', gap:2,
                  }}>
                    {d ? (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6.5l3 3 5-6.5" stroke="#3FB87C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : p.type === 'qr' ? (
                      <svg width="9" height="9" viewBox="0 0 20 20" fill="none">
                        <path d="M2 6V3.5A1.5 1.5 0 0 1 3.5 2H6M14 2h2.5A1.5 1.5 0 0 1 18 3.5V6M18 14v2.5a1.5 1.5 0 0 1-1.5 1.5H14M6 18H3.5A1.5 1.5 0 0 1 2 16.5V14M2 10h16" stroke={nx ? accent : T.soft} strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <span style={{fontFamily:T.serif, fontSize:9.5, fontWeight:700, lineHeight:'9px', color: nx ? accent : T.soft}}>?</span>
                    )}
                    <span style={{fontFamily:T.mono, fontSize:7, letterSpacing:0.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'100%',
                      color: d ? '#3FB87C' : nx ? accent : T.soft}}>{p.short}</span>
                  </button>
                );
              })}
            </div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8}}>
              {nextPt ? (
                <button onClick={() => pickQuest(nextPt)} style={{
                  border:'none', background:'transparent', padding:0, cursor:'pointer',
                  display:'flex', alignItems:'center', gap:6, minWidth:0,
                }}>
                  <span style={{fontFamily:T.body, fontSize:13, fontStyle:'italic', color:T.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                    дальше — {nextPt.label} · {nextPt.type === 'qr' ? 'скан QR' : nextPt.type === 'survey' ? 'анкета' : 'квиз'}
                  </span>
                  <svg width="11" height="9" viewBox="0 0 14 10" style={{flexShrink:0}}><path d="M1 5h11M8.5 1L12 5l-3.5 4" stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              ) : (
                <span style={{fontFamily:T.body, fontSize:13, fontStyle:'italic', color:'#3FB87C'}}>все точки пройдены!</span>
              )}
              <span style={{fontFamily:T.mono, fontSize:8, color:T.soft, letterSpacing:0.6, flexShrink:0}}>приз + ачивка за все точки</span>
            </div>
          </div>
        )}
      </div>

      {/* ── оверлеи: QR / квиз / награда ── */}
      {overlay && overlay.kind === 'qr' && (
        <QuestQROverlay accent={accent} point={overlay.point}
          onDone={() => { completePoint(overlay.point); setOverlay(o => o && o.kind==='reward' ? o : null); }}
          onClose={() => setOverlay(null)}/>
      )}
      {overlay && overlay.kind === 'quiz' && (
        <QuestQuizOverlay accent={accent} point={overlay.point}
          onDone={() => { completePoint(overlay.point); setOverlay(o => o && o.kind==='reward' ? o : null); }}
          onClose={() => setOverlay(null)}/>
      )}
      {overlay && overlay.kind === 'survey' && (
        <QuestSurveyOverlay accent={accent} point={overlay.point}
          onDone={() => { completePoint(overlay.point); setOverlay(o => o && o.kind==='reward' ? o : null); }}
          onClose={() => setOverlay(null)}/>
      )}
      {overlay && overlay.kind === 'reward' && (
        <QuestRewardOverlay accent={accent} onClose={() => setOverlay(null)}/>
      )}

      {/* ── интро квеста: мягкая продажа при входе ── */}
      {questIntro && !overlay && (
        <div style={{position:'absolute', inset:0, zIndex:55, background:T.scrimSoft,
          display:'flex', alignItems:'flex-end'}} onClick={() => setQuestIntro(false)}>
          <div onClick={e=>e.stopPropagation()} style={{
            width:'100%', background:T.sheet, borderRadius:'22px 22px 0 0',
            border:`1px solid ${T.divide}`, borderBottom:'none', padding:'20px 20px max(26px, calc(12px + var(--sab)))'}}>
            <div style={{width:36, height:4, borderRadius:2, background:T.hi, margin:'0 auto 18px'}}/>
            <div style={{display:'flex', alignItems:'center', gap:13}}>
              <div style={{width:52, height:52, borderRadius:16, flexShrink:0,
                background:`${accent}1c`, border:`1.5px solid ${accent}55`,
                display:'flex', alignItems:'center', justifyContent:'center'}}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.3 7.2 17.7l.9-5.4L4.2 8.5l5.4-.8L12 2z" fill={accent} stroke={accent} strokeWidth="1" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontFamily:T.mono, fontSize:9, color:accent, letterSpacing:1.6, textTransform:'uppercase'}}>квест по стендам</div>
                <div style={{fontFamily:T.serif, fontSize:20, fontWeight:700, color:T.ink, fontStyle:'italic', lineHeight:1.15, marginTop:3}}>Собери {QUEST_POINTS.length} точек</div>
              </div>
            </div>

            <p style={{fontFamily:T.body, fontSize:14.5, color:T.mid, lineHeight:1.5, fontStyle:'italic', margin:'15px 0 0'}}>
              загляни на ключевые стенды и зоны. на каждой — скан QR или мини-квиз из 3 вопросов. пройдёшь все — заберёшь приз на регистрации и получишь ачивку в профиль.
            </p>

            {/* прогресс уже на входе */}
            <div style={{display:'flex', alignItems:'center', gap:10, marginTop:16,
              padding:'11px 13px', borderRadius:13, background:T.surface, border:`1px solid ${T.divide}`}}>
              <div style={{display:'flex', gap:4, flex:1}}>
                {QUEST_POINTS.map(p => (
                  <div key={p.n} style={{flex:1, height:5, borderRadius:3,
                    background: doneSet.has(p.n) ? accent : T.hi}}/>
                ))}
              </div>
              <span style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:0.6, whiteSpace:'nowrap'}}>
                уже <span style={{color:accent, fontWeight:700}}>{doneCount}</span>/{QUEST_POINTS.length} · регистрация ✓
              </span>
            </div>

            <div style={{display:'flex', gap:9, marginTop:18}}>
              <button onClick={() => setQuestIntro(false)} style={{
                flex:'0 0 auto', padding:'0 18px', height:50, borderRadius:15, cursor:'pointer',
                background:'transparent', border:`1px solid ${T.divide}`,
                color:T.soft, fontFamily:T.sans, fontSize:14, fontWeight:500}}>Позже</button>
              <button onClick={() => { setQuestIntro(false); nextPt && pickQuest(nextPt); }} style={{
                flex:1, height:50, borderRadius:15, border:'none', cursor:'pointer',
                background:accent, color:'#fff', fontFamily:T.sans, fontSize:15, fontWeight:600,
                boxShadow:`0 6px 20px ${accent}55`}}>
                {nextPt ? `К точке · ${nextPt.label}` : 'Смотреть карту'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes confPulse { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.1); } }
        @keyframes confSoftGlow { 0%,100% { box-shadow: 0 0 0 4px ${accent}14, 0 0 8px ${accent}33; } 50% { box-shadow: 0 0 0 6px ${accent}22, 0 0 16px ${accent}55; } }
      `}</style>
    </div>
  );
}

// ─── оверлей: скан QR ────────────────────────────────────
function QuestQROverlay({ accent, point, onDone, onClose }) {
  const [scanned, setScanned] = React.useState(false);
  const scan = () => { if (scanned) return; setScanned(true); setTimeout(onDone, 700); };
  return (
    <div style={{position:'absolute', inset:0, zIndex:50, background:T.scrimStrong,
      display:'flex', flexDirection:'column', paddingTop:16}}>
      <div style={{padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:T.mono, fontSize:9, color:'rgba(255,255,255,0.45)', letterSpacing:1.8, textTransform:'uppercase'}}>чекин · {point.label}</div>
          <div style={{fontFamily:T.serif, fontSize:19, fontWeight:700, color:'#fff', marginTop:2}}>Сканируй QR на точке</div>
        </div>
        <button onClick={onClose} style={{width:36, height:36, borderRadius:11, border:'1px solid rgba(255,255,255,0.16)',
          background:'rgba(255,255,255,0.06)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <svg width="11" height="11" viewBox="0 0 11 11"><path d="M1 1l9 9M10 1l-9 9" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20}}>
        <div onClick={scan} style={{position:'relative', width:200, height:200, cursor:'pointer'}}>
          {[[0,0,0],[1,0,90],[1,1,180],[0,1,270]].map(([rx,ry,rot],i)=>(
            <svg key={i} width="32" height="32" viewBox="0 0 34 34" style={{
              position:'absolute', left: rx? 'auto':0, right: rx?0:'auto', top: ry?'auto':0, bottom: ry?0:'auto',
              transform:`rotate(${rot}deg)`,
            }}><path d="M2 12 V6 Q2 2 6 2 H12" stroke={scanned ? '#3FB87C' : accent} strokeWidth="3.5" fill="none" strokeLinecap="round"/></svg>
          ))}
          {!scanned ? (
            <div style={{position:'absolute', left:13, right:13, top:0, height:2, borderRadius:1,
              background:`linear-gradient(90deg, transparent, ${accent}, transparent)`,
              boxShadow:`0 0 12px ${accent}`, animation:'questScanLine 2.1s ease-in-out infinite'}}/>
          ) : (
            <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <div style={{width:68, height:68, borderRadius:'50%', background:'rgba(63,184,124,0.16)',
                border:'1.5px solid rgba(63,184,124,0.6)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <svg width="28" height="28" viewBox="0 0 30 30" fill="none"><path d="M7 16l5 5 11-12" stroke="#3FB87C" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          )}
        </div>
        <div style={{fontFamily:T.body, fontSize:15, color:'rgba(255,255,255,0.8)', fontStyle:'italic'}}>
          {scanned ? 'точка засчитана!' : 'код у стендиста или на стойке'}
        </div>
      </div>
      <div style={{padding:'0 22px max(26px, calc(12px + var(--sab)))', textAlign:'center', fontFamily:T.mono, fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:1.1}}>
        тап по рамке — симуляция скана
      </div>
      <style>{`@keyframes questScanLine { 0%,100% { top: 10px; } 50% { top: 186px; } }`}</style>
    </div>
  );
}

// ─── оверлей: квиз (3 вопроса × 3 ответа, результат — только в конце) ──
// Кастдев-анкета на стенде: компания собирает лидов с контекстом.
// Правильных ответов нет — в финале ответы + карточка Affin «улетают» компании.
function QuestSurveyOverlay({ accent, point, onDone, onClose }) {
  const survey = point.survey;
  const company = (BOOTH_INFO[point.ref] && BOOTH_INFO[point.ref].name) || 'компании';
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState(survey.map(() => null));
  const [phase, setPhase] = React.useState('form');   // form | send | sent

  const pick = (i) => {
    if (phase !== 'form') return;
    const a = [...answers]; a[step] = i; setAnswers(a);
    setTimeout(() => {
      if (step < survey.length - 1) setStep(step + 1);
      else setPhase('send');
    }, 260);
  };
  const submit = () => { setPhase('sent'); setTimeout(onDone, 1500); };
  const q = survey[step];

  return (
    <div style={{position:'absolute', inset:0, zIndex:50, background:T.scrim,
      display:'flex', alignItems:'flex-end'}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', background:T.sheet, borderRadius:'22px 22px 0 0',
        border:`1px solid ${T.divide}`, borderBottom:'none', padding:'20px 20px max(30px, calc(14px + var(--sab)))',
      }}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{fontFamily:T.mono, fontSize:9, color:accent, letterSpacing:1.8, textTransform:'uppercase'}}>анкета · {company}</div>
          {phase === 'form' && (
            <div style={{display:'flex', gap:4}}>
              {survey.map((_, i) => (
                <div key={i} style={{width:16, height:4, borderRadius:2,
                  background: i < step || answers[i] !== null ? accent : i === step ? `${accent}55` : T.hi}}/>
              ))}
            </div>
          )}
        </div>

        {phase === 'form' && (
          <div>
            <div style={{fontFamily:T.mono, fontSize:8.5, color:T.soft, letterSpacing:1.2, textTransform:'uppercase', marginTop:12}}>
              вопрос {step + 1} из {survey.length} · нет правильных ответов
            </div>
            <div style={{fontFamily:T.serif, fontSize:19, fontWeight:700, color:T.ink, marginTop:6, lineHeight:1.25, fontStyle:'italic'}}>
              {q.q}
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:14}}>
              {q.options.map((o, i) => {
                const picked = answers[step] === i;
                return (
                  <button key={i} onClick={() => pick(i)} style={{
                    width:'100%', textAlign:'left', padding:'13px 15px', borderRadius:13, cursor:'pointer',
                    background: picked ? `${accent}16` : T.surface,
                    border: picked ? `1.5px solid ${accent}` : `1px solid ${T.divide}`,
                    fontFamily:T.sans, fontSize:14.5, fontWeight:500, color:T.ink,
                  }}>{o}</button>
                );
              })}
            </div>
            <div style={{marginTop:12, textAlign:'center', fontFamily:T.body, fontSize:12.5, fontStyle:'italic', color:T.soft}}>
              {company} собирает мнения для исследования рынка
            </div>
          </div>
        )}

        {phase === 'send' && (
          <div style={{marginTop:14}}>
            {survey.map((qq, qi) => (
              <div key={qi} style={{display:'flex', alignItems:'center', gap:10, padding:'9px 0',
                borderBottom: qi < survey.length - 1 ? `1px solid ${T.divide2}` : 'none'}}>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{flexShrink:0}}><path d="M2 6.5l3 3 5-6.5" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:T.sans, fontSize:12, color:T.soft}}>{qq.q}</div>
                  <div style={{fontFamily:T.sans, fontSize:13.5, fontWeight:600, color:T.ink, marginTop:1}}>{qq.options[answers[qi]]}</div>
                </div>
              </div>
            ))}
            <div style={{marginTop:14, padding:'11px 13px', borderRadius:12,
              background:`${accent}0e`, border:`1px solid ${accent}2e`,
              fontFamily:T.body, fontSize:13, color:T.mid, lineHeight:1.45, fontStyle:'italic'}}>
              вместе с ответами {company} получит твою карточку Affin — попадёшь в список ранних клиентов
            </div>
            <button onClick={submit} style={{
              width:'100%', marginTop:14, padding:'14px 0', borderRadius:13, border:'none',
              background:accent, color:'#fff', fontFamily:T.sans, fontSize:14.5, fontWeight:700,
              cursor:'pointer', boxShadow:`0 6px 18px ${accent}44`,
            }}>Отправить ответы и карточку</button>
            <button onClick={onClose} style={{
              width:'100%', marginTop:8, padding:'9px 0', border:'none', background:'transparent',
              fontFamily:T.sans, fontSize:13, color:T.soft, cursor:'pointer',
            }}>Не сейчас</button>
          </div>
        )}

        {phase === 'sent' && (
          <div style={{padding:'26px 0 12px', textAlign:'center'}}>
            <div style={{width:54, height:54, borderRadius:'50%', margin:'0 auto',
              background:'rgba(63,184,124,0.15)', border:'1.5px solid rgba(63,184,124,0.5)',
              display:'flex', alignItems:'center', justifyContent:'center'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#3FB87C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{fontFamily:T.serif, fontSize:19, fontWeight:700, color:T.ink, fontStyle:'italic', marginTop:12}}>Отправлено!</div>
            <div style={{fontFamily:T.body, fontSize:13.5, color:T.mid, marginTop:6, lineHeight:1.45}}>
              {company} свяжется через Affin — карточка и чат уже открыты
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestQuizOverlay({ accent, point, onDone, onClose }) {
  const quiz = point.quiz; // [{q, options, correct} ×3]
  const [step, setStep] = React.useState(0);            // 0..2
  const [answers, setAnswers] = React.useState([null, null, null]);
  const [phase, setPhase] = React.useState('quiz');     // quiz | success | fail

  const pick = (i) => {
    if (phase !== 'quiz') return;
    const a = [...answers]; a[step] = i; setAnswers(a);
    setTimeout(() => {
      if (step < 2) setStep(step + 1);
      else {
        const allCorrect = quiz.every((qq, qi) => a[qi] === qq.correct);
        setPhase(allCorrect ? 'success' : 'fail');
        if (allCorrect) setTimeout(onDone, 1600);
      }
    }, 280);
  };

  const retry = () => { setAnswers([null, null, null]); setStep(0); setPhase('quiz'); };
  const q = quiz[step];

  return (
    <div style={{position:'absolute', inset:0, zIndex:50, background:T.scrim,
      display:'flex', alignItems:'flex-end'}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', background:T.sheet, borderRadius:'22px 22px 0 0',
        border:`1px solid ${T.divide}`, borderBottom:'none', padding:'20px 20px max(30px, calc(14px + var(--sab)))',
      }}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{fontFamily:T.mono, fontSize:9, color:accent, letterSpacing:1.8, textTransform:'uppercase'}}>квиз · {point.label}</div>
          {phase === 'quiz' && (
            <div style={{display:'flex', gap:4}}>
              {quiz.map((_, i) => (
                <div key={i} style={{width:16, height:4, borderRadius:2,
                  background: i < step || answers[i] !== null ? accent : i === step ? `${accent}55` : T.hi}}/>
              ))}
            </div>
          )}
        </div>

        {phase === 'quiz' && (
          <div>
            <div style={{fontFamily:T.mono, fontSize:8.5, color:T.soft, letterSpacing:1.2, textTransform:'uppercase', marginTop:12}}>
              вопрос {step + 1} из 3
            </div>
            <div style={{fontFamily:T.serif, fontSize:19, fontWeight:700, color:T.ink, marginTop:6, lineHeight:1.25, fontStyle:'italic'}}>
              {q.q}
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:14}}>
              {q.options.map((o, i) => {
                const picked = answers[step] === i;
                return (
                  <button key={i} onClick={() => pick(i)} style={{
                    width:'100%', textAlign:'left', padding:'13px 15px', borderRadius:13, cursor:'pointer',
                    background: picked ? `${accent}16` : T.surface,
                    border: picked ? `1.5px solid ${accent}` : `1px solid ${T.divide}`,
                    fontFamily:T.sans, fontSize:14.5, fontWeight:500, color:T.ink,
                  }}>{o}</button>
                );
              })}
            </div>
            <div style={{marginTop:12, textAlign:'center', fontFamily:T.body, fontSize:12.5, fontStyle:'italic', color:T.soft}}>
              результат узнаешь после всех трёх ответов
            </div>
          </div>
        )}

        {phase === 'success' && (
          <div style={{marginTop:14}}>
            {quiz.map((qq, qi) => (
              <div key={qi} style={{display:'flex', alignItems:'center', gap:10, padding:'9px 0',
                borderBottom: qi < 2 ? `1px solid ${T.divide2}` : 'none'}}>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{flexShrink:0}}><path d="M2 6.5l3 3 5-6.5" stroke="#3FB87C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:T.sans, fontSize:12, color:T.soft}}>{qq.q}</div>
                  <div style={{fontFamily:T.sans, fontSize:13.5, fontWeight:600, color:'#3FB87C', marginTop:1}}>{qq.options[qq.correct]}</div>
                </div>
              </div>
            ))}
            <div style={{marginTop:14, textAlign:'center', fontFamily:T.body, fontSize:14, fontStyle:'italic', color:'#3FB87C'}}>
              все три верно — точка засчитана!
            </div>
          </div>
        )}

        {phase === 'fail' && (
          <div style={{marginTop:16, textAlign:'center'}}>
            <div style={{width:52, height:52, borderRadius:'50%', margin:'0 auto',
              background:'rgba(224,103,74,0.13)', border:'1.5px solid rgba(224,103,74,0.4)',
              display:'flex', alignItems:'center', justifyContent:'center'}}>
              <svg width="18" height="18" viewBox="0 0 11 11"><path d="M1 1l9 9M10 1l-9 9" stroke="#E0674A" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </div>
            <div style={{fontFamily:T.serif, fontSize:19, fontWeight:700, color:T.ink, fontStyle:'italic', marginTop:12}}>
              Не всё верно
            </div>
            <div style={{fontFamily:T.body, fontSize:14, color:T.mid, marginTop:8, lineHeight:1.5, padding:'0 10px'}}>
              где ошибка — не скажем. ответы знают на точке — подойди и спроси
            </div>
            <button onClick={retry} style={{
              width:'100%', marginTop:16, padding:'13px 0', borderRadius:13, border:'none',
              background:accent, color:'#fff', fontFamily:T.sans, fontSize:14, fontWeight:600,
              cursor:'pointer', boxShadow:`0 5px 16px ${accent}44`,
            }}>Попробовать снова</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── оверлей: награда за квест ───────────────────────────
function QuestRewardOverlay({ accent, onClose }) {
  return (
    <div style={{position:'absolute', inset:0, zIndex:60, background:T.scrim,
      display:'flex', alignItems:'center', justifyContent:'center', padding:'0 24px'}}>
      <div style={{width:'100%', background:T.sheet, borderRadius:22, border:`1px solid ${accent}44`,
        padding:'26px 22px 22px', textAlign:'center', boxShadow:`0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${accent}22`}}>
        <div style={{width:64, height:64, borderRadius:'50%', margin:'0 auto',
          background:`linear-gradient(135deg, ${accent}, #D6AA3C)`,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`0 8px 24px ${accent}55`}}>
          <svg width="28" height="28" viewBox="0 0 20 20"><path d="M10 2 L12.2 7 L17.5 7.4 L13.5 11 L14.8 16.2 L10 13.4 L5.2 16.2 L6.5 11 L2.5 7.4 L7.8 7 Z" fill="#fff"/></svg>
        </div>
        <div style={{fontFamily:T.serif, fontSize:24, fontWeight:700, color:T.ink, fontStyle:'italic', marginTop:16, lineHeight:1.15}}>
          Квест пройден!
        </div>
        <div style={{fontFamily:T.body, fontSize:14.5, color:T.mid, marginTop:8, lineHeight:1.5}}>
          все 7 точек — собрано
        </div>

        {/* приз 1: материальный */}
        <div style={{display:'flex', alignItems:'center', gap:12, textAlign:'left', marginTop:18,
          padding:'12px 14px', borderRadius:14, background:T.surface, border:`1px solid ${T.divide}`}}>
          <div style={{width:36, height:36, borderRadius:11, flexShrink:0, background:`${accent}1c`,
            display:'flex', alignItems:'center', justifyContent:'center'}}>
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="8" width="14" height="9" rx="1.5" stroke={accent} strokeWidth="1.4"/>
              <path d="M3 11.5h14M10 8v9M10 8 C7 8 5.5 6.5 5.5 5 C5.5 3.6 6.6 3 7.6 3 C9 3 10 4.5 10 8 C10 4.5 11 3 12.4 3 C13.4 3 14.5 3.6 14.5 5 C14.5 6.5 13 8 10 8 Z" stroke={accent} strokeWidth="1.4"/>
            </svg>
          </div>
          <div>
            <div style={{fontFamily:T.sans, fontSize:13.5, fontWeight:600, color:T.ink}}>Приз от Mining Expo и партнёров</div>
            <div style={{fontFamily:T.sans, fontSize:11.5, color:T.soft, marginTop:1}}>забери на стойке регистрации — покажи этот экран</div>
          </div>
        </div>

        {/* приз 2: ачивка в Affin */}
        <div style={{display:'flex', alignItems:'center', gap:12, textAlign:'left', marginTop:8,
          padding:'12px 14px', borderRadius:14, background:T.surface, border:`1px solid ${T.divide}`}}>
          <div style={{width:36, height:36, borderRadius:'50%', flexShrink:0,
            background:`${accent}1c`, border:`1.5px solid ${accent}55`,
            display:'flex', alignItems:'center', justifyContent:'center'}}>
            <span style={{fontFamily:T.hand, fontSize:17, fontWeight:700, color:accent, lineHeight:1}}>A</span>
          </div>
          <div>
            <div style={{fontFamily:T.sans, fontSize:13.5, fontWeight:600, color:T.ink}}>Ачивка «Mining Expo 2026»</div>
            <div style={{fontFamily:T.sans, fontSize:11.5, color:T.soft, marginTop:1}}>появилась в твоём профиле Affin</div>
          </div>
        </div>

        <button onClick={onClose} style={{
          width:'100%', marginTop:18, padding:'14px 0', borderRadius:13, border:'none',
          background:accent, color:'#fff', fontFamily:T.sans, fontSize:14.5, fontWeight:600,
          cursor:'pointer', boxShadow:`0 6px 20px ${accent}50`,
        }}>Отлично</button>
      </div>
    </div>
  );
}

// ─── Встреча без площадки — текстовое описание, без плана ──
function MeetupScreen({ accent = T.accent, onBack, onPeople, onOpenPerson, activeCard, onSwitchCard }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const TOTAL = 52;
  const [visibleCount, setVisibleCount] = React.useState(12);
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef(null);

  // подгрузка при скролле к низу
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el || loading || visibleCount >= TOTAL) return;
    if (el.scrollTop + el.clientHeight > el.scrollHeight - 220) {
      setLoading(true);
      setTimeout(() => { setVisibleCount(c => Math.min(c + 12, TOTAL)); setLoading(false); }, 600);
    }
  };

  const chrome = {
    background:T.glassHi, backdropFilter:'blur(14px)',
    WebkitBackdropFilter:'blur(14px)', border:`1px solid ${T.divide}`,
  };
  const org = PEOPLE[3];

  return (
    <div style={{position:'absolute', inset:0, background:T.bg, paddingTop:'calc(16px + var(--sat))', display:'flex', flexDirection:'column'}}>
      {/* header — как на карте конференции */}
      <div style={{padding:'8px 14px', display:'flex', alignItems:'center', gap:8, flexShrink:0}}>
        <button onClick={onBack} style={{...chrome, width:40, height:40, borderRadius:14, flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
          <svg width="8" height="13" viewBox="0 0 8 13"><path d="M7 1L1 6.5 7 12" stroke={T.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button onClick={onPeople} aria-label="участники" style={{...chrome, flex:1, height:40, borderRadius:20, padding:'0 12px',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8, minWidth:0, cursor:'pointer'}}>
          <div style={{display:'flex', flexShrink:0}}>
            {[0,3,5].map((pi, i) => (
              <div key={i} style={{width:22, height:22, borderRadius:'50%', overflow:'hidden',
                border:`1.5px solid ${T.stripRing}`, marginLeft: i ? -7 : 0}}>
                <img src={PEOPLE[pi].photo} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
              </div>
            ))}
          </div>
          <span style={{fontFamily:T.serif, fontSize:13.5, fontWeight:700, color:T.ink, whiteSpace:'nowrap'}}>Участники · 52</span>
        </button>
        <button onClick={() => setMenuOpen(true)} aria-label="меню встречи" style={{...chrome, width:40, height:40, borderRadius:14, flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'}}>
          <svg width="15" height="12" viewBox="0 0 15 12"><path d="M1 1h13M1 6h13M1 11h13" stroke={T.ink} strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      {menuOpen && (
        <div style={{position:'absolute', inset:0, zIndex:40}} onClick={() => setMenuOpen(false)}>
          <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.4)'}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:'absolute', top:104, right:14, minWidth:210,
            background:T.sheet, border:`1px solid ${T.divide}`, borderRadius:16, overflow:'hidden',
            boxShadow:'0 16px 40px rgba(0,0,0,0.6)'}}>
            <div style={{padding:'12px 15px 10px', borderBottom:`1px solid ${T.divide2}`,
              display:'flex', alignItems:'center', gap:7}}>
              <span style={{fontFamily:T.serif, fontSize:14, fontWeight:700, color:T.ink}}>Крипто-завтрак</span>
              <div style={{width:6, height:6, borderRadius:'50%', background:'#3FB87C', boxShadow:'0 0 5px rgba(63,184,124,0.9)'}}/>
            </div>
            {[
              {t:'Информация', icon:<><circle cx="9" cy="9" r="7" stroke={T.mid} strokeWidth="1.5" fill="none"/><path d="M9 8.5V13M9 5.5v.5" stroke={T.mid} strokeWidth="1.6" strokeLinecap="round"/></>},
              {t:'Поддержка', icon:<path d="M9 15c3.9 0 7-2.6 7-6s-3.1-6-7-6-7 2.6-7 6c0 1.6.7 3 1.8 4L3 16l3.3-1.6c.8.4 1.7.6 2.7.6z" stroke={T.mid} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>},
              {t:'Поделиться', icon:<><circle cx="5" cy="9" r="2.2" stroke={T.mid} strokeWidth="1.5" fill="none"/><circle cx="13.5" cy="4.5" r="2.2" stroke={T.mid} strokeWidth="1.5" fill="none"/><circle cx="13.5" cy="13.5" r="2.2" stroke={T.mid} strokeWidth="1.5" fill="none"/><path d="M7 8l4.5-2.5M7 10l4.5 2.5" stroke={T.mid} strokeWidth="1.5"/></>},
            ].map((o,i)=>(
              <button key={i} onClick={() => setMenuOpen(false)} style={{width:'100%', textAlign:'left', padding:'12px 15px', border:'none',
                borderTop: i===0 ? 'none' : `1px solid ${T.divide2}`, background:'transparent', cursor:'pointer',
                display:'flex', alignItems:'center', gap:11}}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">{o.icon}</svg>
                <span style={{fontFamily:T.sans, fontSize:14, color:T.ink}}>{o.t}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={scrollRef} onScroll={onScroll} className="noscroll" style={{flex:1, overflowY:'auto', padding:'16px 20px 30px'}}>
        {/* чип активной карточки */}
        {activeCard && (
          <button onClick={onSwitchCard} style={{
            width:'100%', marginBottom:16, padding:'9px 12px', borderRadius:13, cursor:'pointer',
            background:T.surface, border:`1px solid ${T.divide}`,
            display:'flex', alignItems:'center', gap:10}}>
            <div style={{width:26, height:26, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:`1px solid ${accent}66`}}>
              <img src={MARINA.photo} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
            </div>
            <div style={{flex:1, minWidth:0, textAlign:'left'}}>
              <div style={{fontFamily:T.mono, fontSize:7.5, color:T.soft, letterSpacing:1, textTransform:'uppercase'}}>ты здесь как</div>
              <div style={{fontFamily:T.serif, fontSize:13.5, fontWeight:700, color:T.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{activeCard.title}</div>
            </div>
            <span style={{fontFamily:T.sans, fontSize:12, fontWeight:600, color:accent, flexShrink:0}}>сменить</span>
          </button>
        )}

        {/* заголовок */}
        <div style={{fontFamily:T.mono, fontSize:9, color:accent, letterSpacing:1.8, textTransform:'uppercase'}}>встреча</div>
        <div style={{display:'flex', alignItems:'center', gap:8, marginTop:6}}>
          <span style={{fontFamily:T.serif, fontSize:27, fontWeight:700, color:T.ink, fontStyle:'italic', lineHeight:1.1}}>Крипто-завтрак</span>
          <div style={{width:7, height:7, borderRadius:'50%', background:'#3FB87C', boxShadow:'0 0 6px rgba(63,184,124,0.9)', flexShrink:0}}/>
        </div>

        {/* факты — две компактные строки */}
        <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:16}}>
          {[
            { icon:<><circle cx="9" cy="9" r="7" stroke={accent} strokeWidth="1.5" fill="none"/><path d="M9 5.5V9l2.5 2" stroke={accent} strokeWidth="1.5" strokeLinecap="round"/></>,
              main:'завтра · 10:00 – 12:00', sub:'сбор с 9:45' },
            { icon:<><path d="M9 16.5C9 16.5 15 11.5 15 7.5a6 6 0 1 0-12 0C3 11.5 9 16.5 9 16.5z" stroke={accent} strokeWidth="1.5" fill="none"/><circle cx="9" cy="7.5" r="2" stroke={accent} strokeWidth="1.5" fill="none"/></>,
              main:'кафе «Юность»', sub:'Лесная 12' },
          ].map((r,i)=>(
            <div key={i} style={{display:'flex', alignItems:'center', gap:11,
              padding:'11px 13px', borderRadius:13, background:T.surface, border:`1px solid ${T.divide}`}}>
              <div style={{width:34, height:34, borderRadius:10, flexShrink:0, background:`${accent}14`,
                display:'flex', alignItems:'center', justifyContent:'center'}}>
                <svg width="17" height="17" viewBox="0 0 18 18" fill="none">{r.icon}</svg>
              </div>
              <div style={{minWidth:0}}>
                <div style={{fontFamily:T.sans, fontSize:14, fontWeight:600, color:T.ink, lineHeight:1.2}}>{r.main}</div>
                <div style={{fontFamily:T.sans, fontSize:11.5, color:T.soft, marginTop:1}}>{r.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* о встрече — коротко */}
        <div style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:1.6, textTransform:'uppercase', margin:'22px 0 8px'}}>о встрече</div>
        <p style={{fontFamily:T.body, fontSize:15, color:T.mid, lineHeight:1.55, fontStyle:'italic', margin:0}}>
          неформальный завтрак дизайнеров и продактов. без докладов — общий стол, знакомства и разбор работ друг друга. приноси один свой проект: живой, провальный или странный.
        </p>

        {/* формат — три пункта */}
        <div style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:1.6, textTransform:'uppercase', margin:'20px 0 4px'}}>формат</div>
        {[
          'общий стол — кто пришёл, тот и в разговоре',
          'участники видны в Affin — отмечай «интересно» за столом',
          'одна тема, свободный разбор',
        ].map((t,i)=>(
          <div key={i} style={{display:'flex', gap:10, padding:'6px 0', alignItems:'flex-start'}}>
            <div style={{width:5, height:5, borderRadius:'50%', background:accent, marginTop:7, flexShrink:0}}/>
            <span style={{fontFamily:T.sans, fontSize:13.5, color:T.mid, lineHeight:1.45}}>{t}</span>
          </div>
        ))}

        {/* участники — в конце, с подгрузкой при скролле */}
        <div style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:1.6, textTransform:'uppercase', margin:'24px 0 10px'}}>
          кто будет · {TOTAL}
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'14px 8px'}}>
          {Array.from({length: visibleCount}, (_, i) => {
            const p = PEOPLE[[3,0,2,4,5,1,6,7,8,9,10,11][i % 12] % PEOPLE.length];
            const isOrg = i === 0;
            return (
              <button key={i} onClick={() => onOpenPerson && onOpenPerson(p)} style={{
                border:'none', background:'transparent', padding:0, cursor:'pointer',
                display:'flex', flexDirection:'column', alignItems:'center', gap:5, minWidth:0,
              }}>
                <div style={{position:'relative'}}>
                  <div style={{width:56, height:56, borderRadius:'50%', overflow:'hidden',
                    border: isOrg ? `2px solid ${accent}` : `1.5px solid ${T.divide}`}}>
                    <img src={p.photo} alt={p.name} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                  </div>
                  {isOrg && (
                    <div style={{position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%)',
                      padding:'2px 6px', borderRadius:6, background:accent, whiteSpace:'nowrap',
                      border:`1.5px solid ${T.bg}`, lineHeight:1}}>
                      <span style={{fontFamily:T.mono, fontSize:7.5, fontWeight:700, color:'#fff', letterSpacing:0.4, textTransform:'uppercase', lineHeight:1, display:'block'}}>орг</span>
                    </div>
                  )}
                </div>
                <div style={{minWidth:0, textAlign:'center', marginTop: isOrg ? 3 : 0}}>
                  <div style={{fontFamily:T.serif, fontSize:13.5, fontWeight:700, color:T.ink, lineHeight:1.1,
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:96}}>{p.name}</div>
                  <div style={{fontFamily:T.sans, fontSize:10, color:T.soft, marginTop:2,
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:96}}>{p.role.split(' · ')[0]}</div>
                </div>
              </button>
            );
          })}
        </div>
        {/* индикатор подгрузки / конец списка */}
        <div style={{textAlign:'center', padding:'16px 0 4px'}}>
          {loading ? (
            <div style={{display:'inline-flex', alignItems:'center', gap:8}}>
              <div style={{width:14, height:14, borderRadius:'50%', border:`2px solid ${T.hi}`,
                borderTopColor:accent, animation:'meetupSpin 0.8s linear infinite'}}/>
              <span style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:1.2, textTransform:'uppercase'}}>ещё люди…</span>
            </div>
          ) : visibleCount < TOTAL ? (
            <span style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:1.2, textTransform:'uppercase'}}>показано {visibleCount} из {TOTAL} · листай</span>
          ) : (
            <span style={{fontFamily:T.body, fontSize:12.5, color:T.soft, fontStyle:'italic'}}>все {TOTAL} — тапни человека, чтобы открыть карточку</span>
          )}
        </div>
        <style>{`@keyframes meetupSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

window.ConferenceMapScreen = ConferenceMapScreen;
window.MeetupScreen = MeetupScreen;
