// Онбординг: приветствие → вход по телефону → создание карточки → гео → на карту.
// Все компоненты на уровне модуля (см. CLAUDE.md: локальные пересоздаются и теряют фокус).
// Экспорт: window.OnboardingFlow (+ отдельные экраны для превью).

// ── общие мелочи ─────────────────────────────────────────

function PrimaryBtn({ children, onClick, disabled, accent = T.accent, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:'100%',padding:'15px 16px',borderRadius:14,border:'none',cursor:disabled?'default':'pointer',
      background:accent,color:'#fff',fontFamily:T.sans,fontSize:15,fontWeight:600,
      opacity:disabled?0.35:1,transition:'opacity .2s',...style}}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      width:'100%',padding:'13px 16px',borderRadius:14,border:'none',cursor:'pointer',
      background:'transparent',color:T.soft,fontFamily:T.sans,fontSize:14,...style}}>
      {children}
    </button>
  );
}

function BackChevron({ onClick }) {
  return (
    <button onClick={onClick} aria-label="назад" style={{width:36,height:36,borderRadius:11,border:'none',
      background:'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
      <svg width="8" height="13" viewBox="0 0 8 13"><path d="M7 1L1 6.5 7 12" stroke={T.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
}

function Eyebrow({ children, color = T.soft }) {
  return <div style={{fontFamily:T.mono,fontSize:9,color,letterSpacing:1.8,textTransform:'uppercase'}}>{children}</div>;
}

const onbInput = {
  width:'100%',padding:'13px 14px',borderRadius:12,
  background:T.hi,border:`1px solid ${T.divide}`,
  color:T.ink,fontFamily:T.sans,fontSize:15,outline:'none',
};

// Шапка шага: назад + прогресс из сегментов
function StepHeader({ onBack, step, total, accent = T.accent }) {
  return (
    <div style={{padding:'8px 12px 2px',display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
      <BackChevron onClick={onBack}/>
      <div style={{flex:1,display:'flex',gap:5,paddingRight:36}}>
        {Array.from({length:total}).map((_,i)=>(
          <div key={i} style={{flex:1,height:3,borderRadius:2,
            background: i<step ? accent : T.divide,transition:'background .3s'}}/>
        ))}
      </div>
    </div>
  );
}

// Созвездие — сигнатура онбординга — вынесено в отдельный файл (см.
// app/screens/constellation-v1.js, подключается в affin-map.html/onboarding.html
// до этого файла): ConstellationV1({ accent, me, height }), тот же контракт,
// что был у прежнего локального Constellation.

// ── экран 1: приветствие (3 слайда ценности) ─────────────

const WELCOME_SLIDES = [
  { title:<span>Карта людей<br/>вокруг тебя</span>,
    body:'Affin показывает, кто пришёл на событие — и зачем. Не список бейджей, а живая карта.' },
  { title:<span>Карточка вместо<br/>визитки</span>,
    body:'Расскажи, чем можешь поделиться и что ищешь. Совпадения по смыслу, не по должности.' },
  { title:<span>Взаимно —<br/>значит разговор</span>,
    body:'Отметь «интересно». Если взаимно — открывается чат и удобное место встречи.' },
];

function OnbWelcome({ accent = T.accent, onStart }) {
  const [slide, setSlide] = React.useState(0);
  const last = slide === WELCOME_SLIDES.length - 1;
  const s = WELCOME_SLIDES[slide];
  return (
    <div style={{position:'absolute',inset:0,background:T.canvas,display:'flex',flexDirection:'column',
      paddingTop:'calc(16px + var(--sat))'}}>
      <div style={{padding:'18px 22px 0',display:'flex',alignItems:'baseline',justifyContent:'space-between',flexShrink:0}}>
        <div style={{fontFamily:T.hand,fontWeight:700,fontSize:34,color:T.ink,lineHeight:1}}>Affin</div>
        <button onClick={onStart} style={{border:'none',background:'transparent',cursor:'pointer',
          fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.4,textTransform:'uppercase',padding:'6px 0'}}>пропустить</button>
      </div>

      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',minHeight:0}}>
        <ConstellationV1 accent={accent} height={210}/>
      </div>

      <div style={{padding:'0 24px',flexShrink:0}}>
        <div key={slide} className="onb-fadeup">
          <div style={{fontFamily:T.serif,fontStyle:'italic',fontWeight:700,fontSize:30,
            color:T.ink,lineHeight:1.12}}>{s.title}</div>
          <div style={{fontFamily:T.body,fontSize:15,color:T.mid,lineHeight:1.55,marginTop:12,minHeight:70}}>{s.body}</div>
        </div>
        <div style={{display:'flex',gap:7,margin:'4px 0 18px'}}>
          {WELCOME_SLIDES.map((_,i)=>(
            <button key={i} onClick={()=>setSlide(i)} aria-label={`слайд ${i+1}`} style={{
              width:i===slide?22:7,height:7,borderRadius:4,border:'none',padding:0,cursor:'pointer',
              background:i===slide?accent:T.divide,transition:'all .25s'}}/>
          ))}
        </div>
      </div>

      <div style={{padding:'0 20px calc(18px + var(--sab))',flexShrink:0}}>
        <PrimaryBtn accent={accent} onClick={()=> last ? onStart() : setSlide(slide+1)}>
          {last ? 'Начать' : 'Дальше'}
        </PrimaryBtn>
        <GhostBtn onClick={onStart} style={{marginTop:4}}>у меня уже есть аккаунт</GhostBtn>
      </div>
    </div>
  );
}

// ── экран 2: телефон ─────────────────────────────────────

function fmtPhone(d) {
  // d — только цифры, без 7: XXX XXX-XX-XX
  let out = '';
  if (d.length) out = d.slice(0,3);
  if (d.length > 3) out += ' ' + d.slice(3,6);
  if (d.length > 6) out += '-' + d.slice(6,8);
  if (d.length > 8) out += '-' + d.slice(8,10);
  return out;
}

function OnbPhone({ accent = T.accent, onBack, onNext }) {
  const [digits, setDigits] = React.useState('');
  const ok = digits.length === 10;
  const onChange = e => setDigits(e.target.value.replace(/\D/g,'').replace(/^[78]/,'').slice(0,10));
  return (
    <div style={{position:'absolute',inset:0,background:T.bg,display:'flex',flexDirection:'column',
      paddingTop:'calc(16px + var(--sat))'}}>
      <StepHeader onBack={onBack} step={1} total={5} accent={accent}/>
      <div style={{padding:'26px 24px 0',flex:1}}>
        <Eyebrow>вход · телефон</Eyebrow>
        <div style={{fontFamily:T.serif,fontStyle:'italic',fontWeight:700,fontSize:27,color:T.ink,lineHeight:1.15,marginTop:6}}>
          Какой у тебя номер?
        </div>
        <div style={{fontFamily:T.body,fontSize:14,color:T.mid,lineHeight:1.5,marginTop:10}}>
          пришлём код в SMS — без паролей и почты
        </div>
        <div style={{display:'flex',gap:8,marginTop:22}}>
          <div style={{...onbInput,width:64,flexShrink:0,textAlign:'center',color:T.mid,userSelect:'none'}}>+7</div>
          <input autoFocus type="tel" inputMode="numeric" placeholder="900 000-00-00"
            value={fmtPhone(digits)} onChange={onChange}
            onKeyDown={e=>{ if(e.key==='Enter'&&ok) onNext('+7 '+fmtPhone(digits)); }}
            style={{...onbInput,letterSpacing:0.5,fontSize:16}}/>
        </div>
        <div style={{fontFamily:T.body,fontSize:11.5,color:T.soft,fontStyle:'italic',lineHeight:1.5,marginTop:14}}>
          продолжая, соглашаешься с условиями сервиса и политикой данных
        </div>
      </div>
      <div style={{padding:'0 20px calc(18px + var(--sab))',flexShrink:0}}>
        <PrimaryBtn accent={accent} disabled={!ok} onClick={()=>onNext('+7 '+fmtPhone(digits))}>Получить код</PrimaryBtn>
      </div>
    </div>
  );
}

// ── экран 3: код из SMS ──────────────────────────────────

function OnbCode({ accent = T.accent, phone, onBack, onNext }) {
  const [code, setCode] = React.useState('');
  const inputRef = React.useRef(null);
  const done = code.length === 4;
  React.useEffect(() => {
    if (done) { const t = setTimeout(onNext, 500); return () => clearTimeout(t); }
  }, [done]);
  return (
    <div style={{position:'absolute',inset:0,background:T.bg,display:'flex',flexDirection:'column',
      paddingTop:'calc(16px + var(--sat))'}}>
      <StepHeader onBack={onBack} step={2} total={5} accent={accent}/>
      <div style={{padding:'26px 24px 0',flex:1}}>
        <Eyebrow>вход · код</Eyebrow>
        <div style={{fontFamily:T.serif,fontStyle:'italic',fontWeight:700,fontSize:27,color:T.ink,lineHeight:1.15,marginTop:6}}>
          Код из SMS
        </div>
        <div style={{fontFamily:T.body,fontSize:14,color:T.mid,lineHeight:1.5,marginTop:10}}>
          отправили на {phone} · <button onClick={onBack} style={{border:'none',background:'transparent',padding:0,cursor:'pointer',
            fontFamily:T.body,fontSize:14,color:accent}}>изменить</button>
        </div>
        {/* 4 ячейки поверх невидимого инпута */}
        <div style={{position:'relative',marginTop:22,width:4*52+3*10}}
          onClick={()=>inputRef.current && inputRef.current.focus()}>
          <input ref={inputRef} autoFocus type="tel" inputMode="numeric" value={code}
            onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,4))}
            style={{position:'absolute',inset:0,opacity:0,fontSize:16}}/>
          <div style={{display:'flex',gap:10,pointerEvents:'none'}}>
            {Array.from({length:4}).map((_,i)=>(
              <div key={i} style={{width:52,height:60,borderRadius:13,background:T.hi,
                border:`1.5px solid ${i===code.length&&!done ? accent : done ? 'rgba(120,210,150,0.6)' : T.divide}`,
                display:'flex',alignItems:'center',justifyContent:'center',
                fontFamily:T.mono,fontSize:24,color:T.ink,transition:'border-color .15s'}}>
                {code[i] || ''}
              </div>
            ))}
          </div>
        </div>
        <div style={{fontFamily:T.body,fontSize:12.5,color:T.soft,marginTop:16}}>
          {done ? <span style={{color:'rgba(120,210,150,0.95)'}}>готово ✓</span>
                : <span>в прототипе подойдёт любой код · <span style={{fontStyle:'italic'}}>прислать ещё раз</span></span>}
        </div>
      </div>
    </div>
  );
}

// ── экран 4: имя и фото ──────────────────────────────────

const ONB_PHOTOS = ['marina','p4','p6','p8','p11'];

function OnbName({ accent = T.accent, onBack, name, setName, photo, setPhoto, onNext }) {
  const ok = name.trim().length >= 2 && photo;
  const res = window.__resources || {};
  return (
    <div style={{position:'absolute',inset:0,background:T.bg,display:'flex',flexDirection:'column',
      paddingTop:'calc(16px + var(--sat))'}}>
      <StepHeader onBack={onBack} step={3} total={5} accent={accent}/>
      <div className="noscroll" style={{padding:'26px 24px 0',flex:1,overflowY:'auto'}}>
        <Eyebrow>карточка · 1 из 2</Eyebrow>
        <div style={{fontFamily:T.serif,fontStyle:'italic',fontWeight:700,fontSize:27,color:T.ink,lineHeight:1.15,marginTop:6}}>
          Как тебя зовут?
        </div>
        <div style={{fontFamily:T.body,fontSize:14,color:T.mid,lineHeight:1.5,marginTop:10}}>
          имя и фото увидят люди на карте события
        </div>
        <input autoFocus placeholder="Имя Фамилия" value={name} onChange={e=>setName(e.target.value)}
          style={{...onbInput,marginTop:22,fontSize:16}}/>
        <div style={{marginTop:22}}>
          <Eyebrow>фото</Eyebrow>
          <div style={{display:'flex',gap:10,marginTop:10,flexWrap:'wrap'}}>
            {ONB_PHOTOS.map(id=>(
              <button key={id} onClick={()=>setPhoto(res[id])} style={{
                width:62,height:62,borderRadius:'50%',padding:0,overflow:'hidden',cursor:'pointer',
                border: photo===res[id] ? `2.5px solid ${accent}` : `1.5px solid ${T.divide}`,
                background:T.hi,transition:'border .15s'}}>
                <img src={res[id]} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
              </button>
            ))}
            <div style={{width:62,height:62,borderRadius:'50%',flexShrink:0,
              border:`1.5px dashed ${T.soft}`,display:'flex',flexDirection:'column',
              alignItems:'center',justifyContent:'center',gap:2}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={T.soft} strokeWidth="1.8" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div style={{fontFamily:T.body,fontSize:11.5,color:T.soft,fontStyle:'italic',marginTop:10}}>
            в прототипе — выбери из примеров; в приложении тут камера и галерея
          </div>
        </div>
      </div>
      <div style={{padding:'0 20px calc(18px + var(--sab))',flexShrink:0}}>
        <PrimaryBtn accent={accent} disabled={!ok} onClick={onNext}>Дальше</PrimaryBtn>
      </div>
    </div>
  );
}

// ── экран 5: give / want ─────────────────────────────────

const GIVE_SUGGEST = ['UX-ревью','менторство','код-ревью','брендинг','fundraising','growth','интервью','продуктовая стратегия'];
const WANT_SUGGEST = ['найти кофаундера','дизайн-партнёр','инвестор','дистрибуция','нетворкинг','обмен опытом','pet-проект'];
const GREEN = 'rgba(120,210,150,0.95)';

function SuggestChips({ suggest, selected, setSelected, color }) {
  const [adding, setAdding] = React.useState(false);
  const [val, setVal] = React.useState('');
  const toggle = t => setSelected(selected.includes(t) ? selected.filter(x=>x!==t) : [...selected, t]);
  const commit = () => {
    const v = val.trim();
    if (v && !selected.some(t=>t.toLowerCase()===v.toLowerCase())) setSelected([...selected, v]);
    setVal(''); setAdding(false);
  };
  const all = [...new Set([...suggest, ...selected])];
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:7,marginTop:10}}>
      {all.map((t,i)=>{
        const on = selected.includes(t);
        return (
          <button key={i} onClick={()=>toggle(t)} style={{
            padding:'7px 13px',borderRadius:20,cursor:'pointer',
            background: on ? `${color}1c` : 'transparent',
            border: on ? `1px solid ${color}` : `1px solid ${T.divide}`,
            fontFamily:T.sans,fontSize:13,color: on ? color : T.mid,transition:'all .15s'}}>
            {t}
          </button>
        );
      })}
      {adding ? (
        <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
          <input autoFocus value={val} onChange={e=>setVal(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter') commit(); if(e.key==='Escape'){ setVal(''); setAdding(false); } }}
            placeholder="своё"
            style={{width:110,padding:'7px 12px',borderRadius:20,outline:'none',
              border:`1px dashed ${color}`,background:T.hi,fontFamily:T.sans,fontSize:13,color:T.ink}}/>
          <button onClick={commit} style={{padding:'7px 13px',borderRadius:20,border:'none',cursor:'pointer',
            background:`${color}22`,fontFamily:T.sans,fontSize:13,fontWeight:600,color}}>ок</button>
        </span>
      ) : (
        <button onClick={()=>setAdding(true)} style={{padding:'7px 12px',borderRadius:20,cursor:'pointer',
          border:`1px dashed ${T.soft}`,background:'transparent',fontFamily:T.sans,fontSize:13,color:T.soft}}>+ своё</button>
      )}
    </div>
  );
}

function OnbTags({ accent = T.accent, onBack, give, setGive, want, setWant, onNext }) {
  const ok = give.length >= 1 && want.length >= 1;
  return (
    <div style={{position:'absolute',inset:0,background:T.bg,display:'flex',flexDirection:'column',
      paddingTop:'calc(16px + var(--sat))'}}>
      <StepHeader onBack={onBack} step={4} total={5} accent={accent}/>
      <div className="noscroll" style={{padding:'26px 24px 20px',flex:1,overflowY:'auto'}}>
        <Eyebrow>карточка · 2 из 2</Eyebrow>
        <div style={{fontFamily:T.serif,fontStyle:'italic',fontWeight:700,fontSize:27,color:T.ink,lineHeight:1.15,marginTop:6}}>
          Что даёшь —<br/>и что ищешь?
        </div>
        <div style={{fontFamily:T.body,fontSize:14,color:T.mid,lineHeight:1.5,marginTop:10}}>
          по этим полям Affin находит взаимный интерес. выбери хотя бы по одному
        </div>
        <div style={{marginTop:24}}>
          <Eyebrow color={GREEN}>могу поделиться</Eyebrow>
          <SuggestChips suggest={GIVE_SUGGEST} selected={give} setSelected={setGive} color={GREEN}/>
        </div>
        <div style={{marginTop:24}}>
          <Eyebrow color={accent}>хочу найти</Eyebrow>
          <SuggestChips suggest={WANT_SUGGEST} selected={want} setSelected={setWant} color={accent}/>
        </div>
      </div>
      <div style={{padding:'0 20px calc(18px + var(--sab))',flexShrink:0}}>
        <PrimaryBtn accent={accent} disabled={!ok} onClick={onNext}>Дальше</PrimaryBtn>
        <GhostBtn onClick={onNext} style={{marginTop:4}}>заполню позже</GhostBtn>
      </div>
    </div>
  );
}

// ── экран 6: геолокация ──────────────────────────────────

function OnbGeo({ accent = T.accent, onBack, onNext }) {
  return (
    <div style={{position:'absolute',inset:0,background:T.bg,display:'flex',flexDirection:'column',
      paddingTop:'calc(16px + var(--sat))'}}>
      <StepHeader onBack={onBack} step={5} total={5} accent={accent}/>
      <div style={{padding:'26px 24px 0',flex:1,display:'flex',flexDirection:'column'}}>
        <Eyebrow>последний шаг</Eyebrow>
        <div style={{fontFamily:T.serif,fontStyle:'italic',fontWeight:700,fontSize:27,color:T.ink,lineHeight:1.15,marginTop:6}}>
          Где ты — там<br/>и карта
        </div>
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{position:'relative',width:120,height:120}}>
            <div className="onb-ring" style={{position:'absolute',inset:0,borderRadius:'50%',border:`1px solid ${accent}55`}}/>
            <div className="onb-ring" style={{position:'absolute',inset:18,borderRadius:'50%',border:`1px solid ${accent}77`,animationDelay:'0.6s'}}/>
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s-6.5-5.4-6.5-10A6.5 6.5 0 0 1 12 4.5 6.5 6.5 0 0 1 18.5 11c0 4.6-6.5 10-6.5 10z" stroke={accent} strokeWidth="1.6" fill={`${accent}22`}/>
                <circle cx="12" cy="11" r="2.4" fill={accent}/>
              </svg>
            </div>
          </div>
        </div>
        <div style={{fontFamily:T.body,fontSize:14.5,color:T.mid,lineHeight:1.6,paddingBottom:18}}>
          геопозиция нужна, чтобы показать тебя на карте события и людей рядом.
          <span style={{color:T.soft,fontStyle:'italic'}}> работает только внутри события — по пути домой тебя никто не видит.</span>
        </div>
      </div>
      <div style={{padding:'0 20px calc(18px + var(--sab))',flexShrink:0}}>
        <PrimaryBtn accent={accent} onClick={onNext}>Разрешить геолокацию</PrimaryBtn>
        <GhostBtn onClick={onNext} style={{marginTop:4}}>не сейчас</GhostBtn>
      </div>
    </div>
  );
}

// ── экран 7: готово ──────────────────────────────────────

function OnbDone({ accent = T.accent, name, photo, onFinish }) {
  const first = (name || 'Марина').trim().split(/\s+/)[0];
  return (
    <div style={{position:'absolute',inset:0,background:T.canvas,display:'flex',flexDirection:'column',
      paddingTop:'calc(16px + var(--sat))'}}>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',minHeight:0}}>
        <ConstellationV1 accent={accent} me={photo || (window.__resources||{}).marina} height={250}/>
      </div>
      <div style={{padding:'8px 24px 0',flexShrink:0}} className="onb-fadeup">
        <Eyebrow color={accent}>всё готово</Eyebrow>
        <div style={{fontFamily:T.serif,fontStyle:'italic',fontWeight:700,fontSize:30,color:T.ink,lineHeight:1.12,marginTop:6}}>
          {first}, ты на карте
        </div>
        <div style={{fontFamily:T.body,fontSize:14.5,color:T.mid,lineHeight:1.55,marginTop:12,marginBottom:20}}>
          карточка появится на карте, когда придёшь на событие. осталось найти первое.
        </div>
      </div>
      <div style={{padding:'0 20px calc(18px + var(--sab))',flexShrink:0}}>
        <PrimaryBtn accent={accent} onClick={onFinish}>Открыть карту</PrimaryBtn>
      </div>
    </div>
  );
}

// ── оркестратор ──────────────────────────────────────────
// steps: welcome → phone → code → name → tags → geo → done → onFinish(profile)

const ONB_STEPS = ['welcome','phone','code','name','tags','geo','done'];

function OnboardingFlow({ accent = T.accent, initialStep = 'welcome', onFinish }) {
  const [step, setStep] = React.useState(initialStep);
  const [phone, setPhone] = React.useState('+7 900 123-45-67');
  const [name, setName] = React.useState('');
  const [photo, setPhoto] = React.useState(null);
  const [give, setGive] = React.useState([]);
  const [want, setWant] = React.useState([]);
  const go = s => setStep(s);
  const finish = () => onFinish && onFinish({ name, photo, give, want, phone });

  switch (step) {
    case 'welcome': return <OnbWelcome accent={accent} onStart={()=>go('phone')}/>;
    case 'phone':   return <OnbPhone accent={accent} onBack={()=>go('welcome')} onNext={p=>{ setPhone(p); go('code'); }}/>;
    case 'code':    return <OnbCode accent={accent} phone={phone} onBack={()=>go('phone')} onNext={()=>go('name')}/>;
    case 'name':    return <OnbName accent={accent} onBack={()=>go('code')} name={name} setName={setName}
                             photo={photo} setPhoto={setPhoto} onNext={()=>go('tags')}/>;
    case 'tags':    return <OnbTags accent={accent} onBack={()=>go('name')} give={give} setGive={setGive}
                             want={want} setWant={setWant} onNext={()=>go('geo')}/>;
    case 'geo':     return <OnbGeo accent={accent} onBack={()=>go('tags')} onNext={()=>go('done')}/>;
    case 'done':    return <OnbDone accent={accent} name={name} photo={photo} onFinish={finish}/>;
    default:        return null;
  }
}

window.OnboardingFlow = OnboardingFlow;
window.__ONB_STEPS = ONB_STEPS;
