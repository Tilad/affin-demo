// Screen: Создание массовой встречи (митапа) — доступно только платным пользователям.
// Форма целиком, одной страницей — по образцу EditProfileScreen (это не первый вход
// новичка, где нужен визард с пошаговыми подсказками, а осознанное действие опытного
// платного пользователя). Поля — ровно те, что уже показывает MeetupScreen для
// демо-встречи «Крипто-завтрак»: ничего сверху не придумано.
const { T, MARINA } = window;

function CMField({ label, children }) {
  return (
    <div style={{marginBottom:18}}>
      <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.4,textTransform:'uppercase',marginBottom:7}}>{label}</div>
      {children}
    </div>
  );
}

// список пунктов формата — не чипы: это целые фразы, а не короткие теги,
// поэтому строки с добавлением/удалением (тот же язык взаимодействия, что EditChips).
function FormatList({ items, setItems, accent }) {
  const [adding, setAdding] = React.useState(false);
  const [val, setVal] = React.useState('');
  const commit = () => {
    const v = val.trim();
    if (v) setItems([...items, v]);
    setVal(''); setAdding(false);
  };
  return (
    <div>
      {items.map((t,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:7,
          padding:'9px 12px',borderRadius:11,background:T.hi,border:`1px solid ${T.divide}`}}>
          <div style={{width:5,height:5,borderRadius:'50%',background:accent,flexShrink:0}}/>
          <span style={{flex:1,fontFamily:T.sans,fontSize:13.5,color:T.ink,lineHeight:1.4}}>{t}</span>
          <button onClick={()=>setItems(items.filter((_,idx)=>idx!==i))} style={{width:20,height:20,borderRadius:'50%',border:'none',
            background:T.surface,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 1l6 6M7 1l-6 6" stroke={T.soft} strokeWidth="1.4" strokeLinecap="round"/></svg>
          </button>
        </div>
      ))}
      {adding ? (
        <div style={{display:'flex',gap:8}}>
          <input autoFocus value={val} onChange={e=>setVal(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter') commit(); if(e.key==='Escape'){ setVal(''); setAdding(false); } }}
            placeholder="например: одна тема, свободный разбор"
            style={{flex:1,padding:'9px 12px',borderRadius:11,outline:'none',
              border:`1px dashed ${accent}`,background:T.hi,fontFamily:T.sans,fontSize:13.5,color:T.ink}}/>
          <button onClick={commit} style={{padding:'8px 14px',borderRadius:11,border:'none',
            background:`${accent}22`,fontFamily:T.sans,fontSize:13,fontWeight:600,color:accent,cursor:'pointer'}}>ок</button>
        </div>
      ) : (
        <button onClick={()=>setAdding(true)} style={{width:'100%',padding:'9px 12px',borderRadius:11,cursor:'pointer',
          border:`1.5px dashed ${T.soft}`,background:'transparent',fontFamily:T.sans,fontSize:13,color:T.soft,textAlign:'center'}}>+ добавить пункт</button>
      )}
    </div>
  );
}

// тумблер — та же визуальная механика, что SettingsToggle в profile.js
// (переиспользовать нельзя, он не экспортирован в window — тот же паттерн:
// у каждого экрана свои локальные под-компоненты).
function CMToggle({ label, sub, value, onChange, accent }) {
  return (
    <button onClick={()=>onChange(!value)} style={{
      width:'100%',display:'flex',alignItems:'center',gap:12,textAlign:'left',
      padding:'12px 13px',border:`1px solid ${T.divide}`,borderRadius:12,background:T.hi,cursor:'pointer',
    }}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:T.sans,fontSize:14,fontWeight:500,color:T.ink,lineHeight:1.2}}>{label}</div>
        {sub && <div style={{fontFamily:T.sans,fontSize:11.5,color:T.soft,marginTop:2,lineHeight:1.3}}>{sub}</div>}
      </div>
      <div style={{width:44,height:26,borderRadius:13,padding:3,flexShrink:0,
        background: value ? accent : T.surface,transition:'background 0.2s'}}>
        <div style={{width:20,height:20,borderRadius:'50%',background:'#fff',
          transform: value ? 'translateX(18px)' : 'translateX(0)',transition:'transform 0.2s'}}/>
      </div>
    </button>
  );
}

function CreateMeetupScreen({ accent = T.accent, onBack, onCreate }) {
  const [name, setName] = React.useState('');
  const [when, setWhen] = React.useState('');
  const [gather, setGather] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [about, setAbout] = React.useState('');
  const [format, setFormat] = React.useState([]);
  const [onMap, setOnMap] = React.useState(true); // приватность: показывать на карте или только по ссылке

  const inputStyle = {
    width:'100%',padding:'11px 13px',borderRadius:12,
    background:T.hi,border:`1px solid ${T.divide}`,
    color:T.ink,fontFamily:T.sans,fontSize:14.5,outline:'none',
  };

  const ready = name.trim() && when.trim() && place.trim();

  const submit = () => {
    if (!ready) return;
    onCreate({
      name: name.trim(), live: true,
      when: when.trim(), gather: gather.trim() || null,
      place: place.trim(), address: address.trim(),
      about: about.trim() || 'без описания — просто приходи.',
      format, onMap,
      total: 1, justCreated: true,
    });
  };

  return (
    <div style={{position:'absolute',inset:0,background:T.bg,paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'8px 12px 10px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,borderBottom:`1px solid ${T.divide}`}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:11,border:'none',background:'transparent',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="8" height="13" viewBox="0 0 8 13"><path d="M7 1L1 6.5 7 12" stroke={T.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{fontFamily:T.serif,fontSize:18,fontWeight:700,color:T.ink}}>Новая встреча</div>
        <button onClick={submit} disabled={!ready} style={{padding:'7px 14px',borderRadius:11,border:'none',
          background: ready ? accent : T.hi, color: ready ? '#fff' : T.soft,
          fontFamily:T.sans,fontSize:13,fontWeight:600,cursor: ready ? 'pointer' : 'default'}}>Создать</button>
      </div>

      <div className="noscroll" style={{flex:1,overflowY:'auto',padding:'18px 18px 40px'}}>
        <CMField label="название"><input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder="Крипто-завтрак"/></CMField>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <CMField label="когда"><input style={inputStyle} value={when} onChange={e=>setWhen(e.target.value)} placeholder="завтра · 10:00 – 12:00"/></CMField>
          <CMField label="сбор (необязательно)"><input style={inputStyle} value={gather} onChange={e=>setGather(e.target.value)} placeholder="сбор с 9:45"/></CMField>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <CMField label="место"><input style={inputStyle} value={place} onChange={e=>setPlace(e.target.value)} placeholder="кафе «Юность»"/></CMField>
          <CMField label="адрес"><input style={inputStyle} value={address} onChange={e=>setAddress(e.target.value)} placeholder="Лесная 12"/></CMField>
        </div>

        <CMField label="о встрече">
          <textarea style={{...inputStyle,minHeight:80,resize:'none',fontFamily:T.body,fontSize:15,lineHeight:1.5}}
            value={about} onChange={e=>setAbout(e.target.value)} placeholder="неформальный завтрак дизайнеров и продактов..."/>
        </CMField>

        <CMField label="формат">
          <FormatList items={format} setItems={setFormat} accent={accent}/>
        </CMField>

        <CMField label="приватность">
          <CMToggle label="Показывать на карте" sub="выключишь — найти встречу можно будет только по ссылке из «Поделиться»"
            value={onMap} onChange={setOnMap} accent={accent}/>
        </CMField>

        <div style={{marginTop:8,padding:'11px 13px',borderRadius:12,background:`${accent}0c`,border:`1px solid ${accent}30`}}>
          <span style={{fontFamily:T.body,fontSize:12.5,color:T.mid,fontStyle:'italic',lineHeight:1.5}}>
            число участников не ограничиваем — растёт само по чекинам. {onMap
              ? 'Встреча появится на карте и будет доступна по ссылке из меню «Поделиться».'
              : 'На карте её не будет — только по ссылке из меню «Поделиться».'}
          </span>
        </div>
      </div>
    </div>
  );
}

window.CreateMeetupScreen = CreateMeetupScreen;
