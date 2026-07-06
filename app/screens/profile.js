// Screen 7 & 8: "Я" (own profile) and "Заявки" (incoming interest)
// The account owner is Марина К. (built in Wizard Flow).
const { T, MARINA, PEOPLE, MY_TARIFF } = window;

// ═══════════════════════════════════════════════════
// SCREEN 7: Мой профиль ("Я" tab)
// ═══════════════════════════════════════════════════
function ProfileMeScreen({ accent = T.accent, onEdit, onOpenCard, onSettings, onBilling, onAddCard }) {
  const me = MARINA;
  const cards = window.MY_CARDS;

  const stats = [
    { n:'146', l:'просмотров' },
    { n:'23',  l:'«интересно»' },
    { n:'7',   l:'встреч' },
  ];

  const ACHIEVEMENTS = [
    { title:'Mining Expo 2026', when:'вчера', earned:true },
    { title:'Product Sense', when:'март', earned:true },
    { title:'Крипто-завтрак', when:'', earned:false },
  ];

  return (
    <div style={{position:'absolute',inset:0,background:T.bg,paddingTop:16,display:'flex',flexDirection:'column'}}>
      {/* top bar */}
      <div style={{padding:'10px 18px 6px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{fontFamily:T.hand,fontSize:26,color:accent,fontWeight:700,lineHeight:1}}>Affin</div>
        <button onClick={onSettings} aria-label="настройки" style={{
          width:36,height:36,borderRadius:11,border:`1px solid ${T.divide}`,background:T.surface,
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke={T.mid} strokeWidth="1.6"/>
            <path d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={T.mid} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="noscroll" style={{flex:1,overflowY:'auto',padding:'8px 18px 90px'}}>
        {/* identity */}
        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16}}>
          <div style={{
            width:72,height:72,borderRadius:'50%',overflow:'hidden',flexShrink:0,
            background:`${accent}1A`,border:`2px solid ${accent}`,
          }}>
            <img src={me.photo} alt={me.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:T.serif,fontSize:24,fontWeight:700,color:T.ink,lineHeight:1.05}}>{me.name} {me.last}</div>
            <div style={{fontFamily:T.sans,fontSize:13,color:T.mid,marginTop:3}}>{me.role} · {me.company}</div>
            <button onClick={onBilling} style={{display:'inline-flex',alignItems:'center',gap:5,marginTop:7,cursor:'pointer',
              padding:'3px 9px',borderRadius:8,background:'rgba(80,180,120,0.14)',border:'1px solid rgba(80,180,120,0.3)'}}>
              <div style={{width:11,height:11,borderRadius:'50%',background:'rgba(80,180,120,0.95)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="7" height="5" viewBox="0 0 12 8" fill="none"><path d="M1 4C2.5 1.5 4 1 6 1s3.5.5 5 3c-1.5 2.5-3 3-5 3s-3.5-.5-5-3z" stroke="#fff" strokeWidth="1.4" fill="none"/><circle cx="6" cy="4" r="1.3" fill="#fff"/></svg>
              </div>
              <span style={{fontFamily:T.mono,fontSize:9,color:'rgba(120,210,150,0.95)',letterSpacing:0.8,textTransform:'uppercase'}}>тариф paid</span>
              <svg width="6" height="9" viewBox="0 0 7 12" style={{marginLeft:1}}><path d="M1 1l5 5-5 5" stroke="rgba(120,210,150,0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* stats */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:20}}>
          {stats.map((s,i)=>(
            <div key={i} style={{
              padding:'13px 8px',borderRadius:14,textAlign:'center',
              background:T.surface,border:`1px solid ${T.divide}`,
            }}>
              <div style={{fontFamily:T.serif,fontSize:24,fontWeight:700,color:T.ink,lineHeight:1}}>{s.n}</div>
              <div style={{fontFamily:T.mono,fontSize:8.5,color:T.soft,letterSpacing:0.8,textTransform:'uppercase',marginTop:5}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* карточки — библиотека */}
        <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:9}}>
          <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.6,textTransform:'uppercase'}}>твои карточки · {cards.length}</span>
          <span style={{fontFamily:T.body,fontSize:11.5,color:T.soft,fontStyle:'italic'}}>выбираешь при входе на событие</span>
        </div>
        <div className="noscroll" style={{display:'flex',gap:9,overflowX:'auto',margin:'0 -18px',padding:'2px 18px 4px'}}>
          {cards.map(c => {
            return (
              <div key={c.id} style={{
                flexShrink:0,width:196,padding:'13px 14px',borderRadius:16,position:'relative',
                background: T.surface, border:`1px solid ${T.divide}`,
              }}>
                <div style={{position:'absolute',top:10,right:10,display:'flex',gap:6,zIndex:2}}>
                  <button onClick={onEdit} aria-label="редактировать" style={{
                    width:26,height:26,borderRadius:8,border:`1px solid ${T.divide}`,background:T.hi,cursor:'pointer',
                    display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M11 2.5l2.5 2.5L6 12.5 3 13l.5-3 7.5-7.5z" stroke={T.mid} strokeWidth="1.3" strokeLinejoin="round"/></svg>
                  </button>
                  <button onClick={onAddCard} aria-label="копировать" style={{
                    width:26,height:26,borderRadius:8,border:`1px solid ${T.divide}`,background:T.hi,cursor:'pointer',
                    display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke={T.mid} strokeWidth="1.3"/><path d="M3 10.5V3.5A1 1 0 0 1 4 2.5h7" stroke={T.mid} strokeWidth="1.3" strokeLinecap="round"/></svg>
                  </button>
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:6}}>
                  <span style={{fontFamily:T.mono,fontSize:8,color:T.soft,letterSpacing:1.2,textTransform:'uppercase'}}>{c.context}</span>
                </div>
                <button onClick={onOpenCard} style={{border:'none',background:'transparent',padding:0,textAlign:'left',cursor:'pointer',width:'100%'}}>
                  <div style={{fontFamily:T.serif,fontSize:16,fontWeight:700,color:T.ink,marginTop:6,lineHeight:1.15,paddingRight:60}}>{c.title}</div>
                  <p style={{margin:'6px 0 0',fontFamily:T.body,fontSize:12.5,color:T.mid,lineHeight:1.45,fontStyle:'italic',
                    display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{c.bio}</p>
                </button>
                <div style={{display:'flex',alignItems:'center',marginTop:10}}>
                  <div style={{display:'flex',gap:4,minWidth:0,overflow:'hidden'}}>
                    {c.tags.map((g,i)=>(
                      <span key={i} style={{padding:'2px 8px',borderRadius:9,fontFamily:T.sans,fontSize:10.5,whiteSpace:'nowrap',
                        background:'rgba(80,180,120,0.12)',color:'rgba(120,210,150,0.95)',border:'1px solid rgba(80,180,120,0.26)'}}>{g}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          {/* добавить карточку */}
          <button onClick={onAddCard} style={{
            flexShrink:0,width:120,borderRadius:16,cursor:'pointer',
            border:`1.5px dashed ${T.soft}`,background:'transparent',
            display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,padding:'13px 10px',
          }}>
            <div style={{width:32,height:32,borderRadius:'50%',border:`1.5px dashed ${T.soft}`,
              display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="13" height="13" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke={T.soft} strokeWidth="1.6" strokeLinecap="round"/></svg>
            </div>
            <span style={{fontFamily:T.sans,fontSize:11.5,fontWeight:600,color:T.soft,textAlign:'center',lineHeight:1.3}}>Новая карточка</span>
          </button>
        </div>
        <div style={{fontFamily:T.body,fontSize:11.5,color:T.soft,fontStyle:'italic',margin:'8px 2px 14px'}}>
          карточку выбираешь когда входишь на событие или ставишь метку на карте
        </div>

        {/* ачивки событий */}
        <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:9,marginTop:4}}>
          <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.6,textTransform:'uppercase'}}>ачивки · {ACHIEVEMENTS.filter(a=>a.earned).length}</span>
          <span style={{fontFamily:T.body,fontSize:11.5,color:T.soft,fontStyle:'italic'}}>за пройденные квесты</span>
        </div>
        <div className="noscroll" style={{display:'flex',gap:9,overflowX:'auto',margin:'0 -18px 18px',padding:'2px 18px 4px'}}>
          {ACHIEVEMENTS.map((a,i)=>(
            <div key={i} style={{
              flexShrink:0,width:104,padding:'14px 10px',borderRadius:16,textAlign:'center',
              background: a.earned ? `${accent}0e` : T.surface,
              border: a.earned ? `1px solid ${accent}44` : `1px dashed ${T.divide}`,
              opacity: a.earned ? 1 : 0.5,
            }}>
              <div style={{width:44,height:44,borderRadius:'50%',margin:'0 auto',
                display:'flex',alignItems:'center',justifyContent:'center',
                background: a.earned ? `${accent}22` : T.hi,
                border: a.earned ? `1.5px solid ${accent}` : `1.5px solid ${T.divide}`}}>
                {a.earned ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.3 7.2 17.7l.9-5.4L4.2 8.5l5.4-.8L12 2z" fill={accent} stroke={accent} strokeWidth="1" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="9" rx="2" stroke={T.soft} strokeWidth="1.6"/>
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={T.soft} strokeWidth="1.6"/>
                  </svg>
                )}
              </div>
              <div style={{fontFamily:T.serif,fontSize:12.5,fontWeight:700,color: a.earned ? T.ink : T.soft,marginTop:8,lineHeight:1.15}}>{a.title}</div>
              <div style={{fontFamily:T.mono,fontSize:7.5,color:T.soft,letterSpacing:0.6,textTransform:'uppercase',marginTop:4}}>{a.earned ? a.when : 'не пройдено'}</div>
            </div>
          ))}
        </div>

        <button onClick={onEdit} style={{
          width:'100%',padding:'13px 0',borderRadius:14,border:`1px solid ${T.divide}`,
          background:'transparent',color:T.ink,fontFamily:T.sans,fontSize:14,fontWeight:600,cursor:'pointer',
          display:'flex',alignItems:'center',justifyContent:'center',gap:8,
        }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M11 2.5l2.5 2.5L6 12.5 3 13l.5-3 7.5-7.5z" stroke={T.ink} strokeWidth="1.4" strokeLinejoin="round"/></svg>
          Редактировать профиль
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SCREEN 8: Заявки ("тобой заинтересовались")
// ═══════════════════════════════════════════════════
function InboxScreen({ accent = T.accent, onOpenPerson, onReciprocate }) {
  // build incoming interest from PEOPLE with rich data
  const incoming = [
    { p: PEOPLE.find(x=>x.id==='p1'), kind:'very', when:'12 мин' },
    { p: PEOPLE.find(x=>x.id==='p3'), kind:'interest', when:'40 мин' },
    { p: PEOPLE.find(x=>x.id==='p4'), kind:'interest', when:'1 ч' },
    { p: PEOPLE.find(x=>x.id==='p6'), kind:'interest', when:'2 ч' },
  ];
  const sent = [
    { p: PEOPLE.find(x=>x.id==='p5'), when:'вчера' },
  ];

  const Row = ({ item, mode }) => {
    const p = item.p;
    const very = item.kind === 'very';
    return (
      <div style={{
        display:'flex',alignItems:'center',gap:12,
        padding:'12px 14px',borderRadius:16,
        background:T.surface,border:`1px solid ${mode==='new' && very ? accent+'40' : T.divide}`,
      }}>
        <button onClick={()=>onOpenPerson&&onOpenPerson(p)} style={{
          width:50,height:50,borderRadius:'50%',overflow:'hidden',flexShrink:0,padding:0,cursor:'pointer',
          background:`${accent}1A`,border: very ? `2px solid ${accent}` : `1.5px solid ${T.divide}`,
        }}>
          <img src={p.photo} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        </button>
        <div style={{flex:1,minWidth:0}} onClick={()=>onOpenPerson&&onOpenPerson(p)}>
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <span style={{fontFamily:T.serif,fontSize:16,fontWeight:700,color:T.ink,lineHeight:1.1}}>{p.name}</span>
          </div>
          <div style={{fontFamily:T.sans,fontSize:11.5,color:T.mid,marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.role}</div>
          {mode==='new' ? (
            <div style={{display:'flex',alignItems:'center',gap:5,marginTop:5}}>
              <span style={{fontFamily:T.mono,fontSize:8.5,letterSpacing:0.8,textTransform:'uppercase',
                padding:'2px 7px',borderRadius:6,
                background: very ? accent : `${accent}18`,
                color: very ? '#fff' : accent,
                border: very ? 'none' : `1px solid ${accent}33`}}>
                {very ? 'очень интересно' : 'интересно'}
              </span>
              <span style={{fontFamily:T.mono,fontSize:9,color:T.soft}}>· {item.when}</span>
            </div>
          ) : (
            <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,marginTop:5}}>ты отметил · {item.when} · ждёт ответа</div>
          )}
        </div>
        {mode==='new' && (
          <button onClick={()=>onReciprocate&&onReciprocate(p)} aria-label="взаимно" style={{
            width:44,height:44,borderRadius:13,flexShrink:0,cursor:'pointer',
            background:accent,border:'none',boxShadow:`0 4px 14px ${accent}44`,
            display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M4 11h13M11 5l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={{position:'absolute',inset:0,background:T.bg,paddingTop:16,display:'flex',flexDirection:'column'}}>
      <div style={{padding:'12px 18px 10px',flexShrink:0}}>
        <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.8,textTransform:'uppercase'}}>заявки</div>
        <div style={{fontFamily:T.serif,fontSize:26,fontWeight:700,color:T.ink,lineHeight:1.1,marginTop:2,fontStyle:'italic'}}>Тобой заинтересовались</div>
      </div>

      <div className="noscroll" style={{flex:1,overflowY:'auto',padding:'6px 16px 90px'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,margin:'6px 2px 10px'}}>
          <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.4,textTransform:'uppercase'}}>новые</span>
          <span style={{fontFamily:T.mono,fontSize:9,color:accent,fontWeight:700}}>{incoming.length}</span>
          <div style={{flex:1,height:1,background:T.divide}}/>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:9}}>
          {incoming.map((it,i)=><Row key={i} item={it} mode="new"/>)}
        </div>

        <div style={{display:'flex',alignItems:'center',gap:8,margin:'22px 2px 10px'}}>
          <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.4,textTransform:'uppercase'}}>ждут твоего ответа</span>
          <div style={{flex:1,height:1,background:T.divide}}/>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:9,opacity:0.72}}>
          {sent.map((it,i)=><Row key={i} item={it} mode="sent"/>)}
        </div>

        <div style={{textAlign:'center',padding:'26px 20px 0'}}>
          <span style={{fontFamily:T.body,fontSize:13.5,color:T.soft,fontStyle:'italic',lineHeight:1.5}}>
            заявки живут 3 дня — потом тихо исчезают, без осадка
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SCREEN: Настройки (из шестерёнки профиля)
// ═══════════════════════════════════════════════════
function SettingsRow({ label, sub, value, chevron = true, onClick, danger = false }) {
  return (
    <button onClick={onClick} style={{
      width:'100%',display:'flex',alignItems:'center',gap:12,textAlign:'left',
      padding:'13px 15px',border:'none',background:'transparent',cursor:'pointer',
    }}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:T.sans,fontSize:14,fontWeight:500,color: danger ? '#E0674A' : T.ink,lineHeight:1.2}}>{label}</div>
        {sub && <div style={{fontFamily:T.sans,fontSize:11.5,color:T.soft,marginTop:2,lineHeight:1.3}}>{sub}</div>}
      </div>
      {value && <span style={{fontFamily:T.sans,fontSize:13,color:T.mid,flexShrink:0}}>{value}</span>}
      {chevron && !danger && (
        <svg width="7" height="12" viewBox="0 0 7 12" style={{flexShrink:0}}><path d="M1 1l5 5-5 5" stroke={T.soft} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )}
    </button>
  );
}

function SettingsToggle({ label, sub, value, onChange, accent }) {
  return (
    <button onClick={()=>onChange(!value)} style={{
      width:'100%',display:'flex',alignItems:'center',gap:12,textAlign:'left',
      padding:'13px 15px',border:'none',background:'transparent',cursor:'pointer',
    }}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:T.sans,fontSize:14,fontWeight:500,color:T.ink,lineHeight:1.2}}>{label}</div>
        {sub && <div style={{fontFamily:T.sans,fontSize:11.5,color:T.soft,marginTop:2,lineHeight:1.3}}>{sub}</div>}
      </div>
      <div style={{width:44,height:26,borderRadius:13,padding:3,flexShrink:0,
        background: value ? accent : T.hi,transition:'background 0.2s'}}>
        <div style={{width:20,height:20,borderRadius:'50%',background:'#fff',
          transform: value ? 'translateX(18px)' : 'translateX(0)',transition:'transform 0.2s'}}/>
      </div>
    </button>
  );
}

function SettingsGroup({ title, children }) {
  return (
    <div style={{marginBottom:22}}>
      <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.6,textTransform:'uppercase',margin:'0 4px 8px'}}>{title}</div>
      <div style={{background:T.surface,border:`1px solid ${T.divide}`,borderRadius:16,overflow:'hidden'}}>
        {React.Children.map(children, (c,i)=>(
          <div style={{borderTop: i===0 ? 'none' : `1px solid ${T.divide2}`}}>{c}</div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen({ accent = T.accent, onBack, onBilling }) {
  const [geoHidden, setGeoHidden] = React.useState(true);
  const [showNear, setShowNear]   = React.useState(true);
  const [nNew, setNNew]     = React.useState(true);
  const [nMsg, setNMsg]     = React.useState(true);
  const [nNearby, setNNearby] = React.useState(false);

  return (
    <div style={{position:'absolute',inset:0,background:T.bg,paddingTop:16,display:'flex',flexDirection:'column'}}>
      <div style={{padding:'8px 12px 10px',display:'flex',alignItems:'center',gap:6,flexShrink:0,borderBottom:`1px solid ${T.divide}`}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:11,border:'none',background:'transparent',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="8" height="13" viewBox="0 0 8 13"><path d="M7 1L1 6.5 7 12" stroke={T.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{fontFamily:T.serif,fontSize:19,fontWeight:700,color:T.ink}}>Настройки</div>
      </div>

      <div className="noscroll" style={{flex:1,overflowY:'auto',padding:'16px 16px 40px'}}>
        <SettingsGroup title="аккаунт">
          <SettingsRow label="Марина К." sub="+7 ··· ·· 42"/>
          <SettingsRow label="Тариф" value="Paid" sub="активен до 12 авг" onClick={onBilling}/>
        </SettingsGroup>

        <SettingsGroup title="приватность">
          <SettingsToggle label="Точное гео скрыто" sub="показываем только площадку, не точку" value={geoHidden} onChange={setGeoHidden} accent={accent}/>
          <SettingsToggle label="Показывать статус «рядом»" value={showNear} onChange={setShowNear} accent={accent}/>
          <SettingsRow label="Кто может меня видеть" value="все на событии"/>
        </SettingsGroup>

        <SettingsGroup title="уведомления">
          <SettingsToggle label="Новые заявки" value={nNew} onChange={setNNew} accent={accent}/>
          <SettingsToggle label="Сообщения" value={nMsg} onChange={setNMsg} accent={accent}/>
          <SettingsToggle label="Рядом интересные люди" sub="пуш, когда в радиусе кто-то совпал" value={nNearby} onChange={setNNearby} accent={accent}/>
        </SettingsGroup>

        <SettingsGroup title="о приложении">
          <SettingsRow label="Помощь и поддержка"/>
          <SettingsRow label="О Affin" value="v1.0"/>
        </SettingsGroup>

        <SettingsGroup title="">
          <SettingsRow label="Выйти" chevron={false} danger={true}/>
        </SettingsGroup>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SCREEN: Редактирование профиля
// ═══════════════════════════════════════════════════
function Field({ label, children }) {
  return (
    <div style={{marginBottom:18}}>
      <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.4,textTransform:'uppercase',marginBottom:7}}>{label}</div>
      {children}
    </div>
  );
}

// Чипсы с рабочим добавлением: «+ добавить» → инлайн-ввод (Enter/готово — добавить, Esc — отмена)
function EditChips({ items, setItems, color }) {
  const [adding, setAdding] = React.useState(false);
  const [val, setVal] = React.useState('');
  const commit = () => {
    const v = val.trim();
    if (v && !items.some(t => t.toLowerCase() === v.toLowerCase())) setItems([...items, v]);
    setVal(''); setAdding(false);
  };
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
      {items.map((t,i)=>(
        <span key={i} style={{display:'inline-flex',alignItems:'center',gap:6,
          padding:'6px 8px 6px 11px',borderRadius:20,
          background:`${color}14`,border:`1px solid ${color}33`,
          fontFamily:T.sans,fontSize:12.5,color:color}}>
          {t}
          <button onClick={()=>setItems(items.filter((_,idx)=>idx!==i))} style={{width:16,height:16,borderRadius:'50%',border:'none',
            background:`${color}22`,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
            <svg width="7" height="7" viewBox="0 0 8 8"><path d="M1 1l6 6M7 1l-6 6" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>
          </button>
        </span>
      ))}
      {adding ? (
        <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
          <input autoFocus value={val}
            onChange={e=>setVal(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter') commit(); if(e.key==='Escape'){ setVal(''); setAdding(false); } }}
            placeholder="новый пункт"
            style={{width:130,padding:'6px 11px',borderRadius:20,outline:'none',
              border:`1px dashed ${color}`,background:T.hi,
              fontFamily:T.sans,fontSize:12.5,color:T.ink}}/>
          <button onClick={commit} style={{padding:'6px 12px',borderRadius:20,border:'none',
            background:`${color}22`,fontFamily:T.sans,fontSize:12.5,fontWeight:600,color:color,cursor:'pointer'}}>ок</button>
        </span>
      ) : (
        <button onClick={()=>setAdding(true)} style={{padding:'6px 11px',borderRadius:20,border:`1px dashed ${T.soft}`,background:'transparent',
          fontFamily:T.sans,fontSize:12.5,color:T.soft,cursor:'pointer'}}>+ добавить</button>
      )}
    </div>
  );
}

function EditProfileScreen({ accent = T.accent, onBack, onBilling }) {
  const me = MARINA;
  const [name, setName]   = React.useState(`${me.name} ${me.last}`);
  const [role, setRole]   = React.useState(me.role);
  const [company, setCompany] = React.useState(me.company);
  const [bio, setBio]     = React.useState(me.bio);
  const [working, setWorking] = React.useState(me.workingOn);
  const [give, setGive]   = React.useState(me.give);
  const [want, setWant]   = React.useState(me.want);

  // фото — своё на каждую карточку: Free = 1, Paid = до 6
  const tariff = MY_TARIFF || 'free';
  const MAX_PHOTOS = tariff === 'paid' ? 6 : 1;
  const DEMO_PHOTOS = [
    'https://i.pravatar.cc/240?img=47','https://i.pravatar.cc/240?img=32',
    'https://i.pravatar.cc/240?img=5','https://i.pravatar.cc/240?img=16',
    'https://i.pravatar.cc/240?img=45','https://i.pravatar.cc/240?img=20',
  ];
  const [photos, setPhotos] = React.useState([me.photo]);
  const addPhoto = () => {
    if (photos.length >= MAX_PHOTOS) { if (tariff !== 'paid') onBilling && onBilling(); return; }
    const used = new Set(photos);
    const next = DEMO_PHOTOS.find(p => !used.has(p)) || DEMO_PHOTOS[photos.length % DEMO_PHOTOS.length];
    setPhotos(p => [...p, next]);
  };
  const removePhoto = (i) => setPhotos(p => p.filter((_,idx)=>idx!==i));
  const makePrimary = (i) => setPhotos(p => { const c=[...p]; const [x]=c.splice(i,1); return [x,...c]; });

  const inputStyle = {
    width:'100%',padding:'11px 13px',borderRadius:12,
    background:T.hi,border:`1px solid ${T.divide}`,
    color:T.ink,fontFamily:T.sans,fontSize:14.5,outline:'none',
  };

  const Chips = EditChips; // модульный компонент — см. ниже (локальный пересоздавался и терял фокус инпута)

  return (
    <div style={{position:'absolute',inset:0,background:T.bg,paddingTop:16,display:'flex',flexDirection:'column'}}>
      <div style={{padding:'8px 12px 10px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,borderBottom:`1px solid ${T.divide}`}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:11,border:'none',background:'transparent',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="8" height="13" viewBox="0 0 8 13"><path d="M7 1L1 6.5 7 12" stroke={T.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{fontFamily:T.serif,fontSize:18,fontWeight:700,color:T.ink}}>Профиль</div>
        <button onClick={onBack} style={{padding:'7px 14px',borderRadius:11,border:'none',background:accent,
          color:'#fff',fontFamily:T.sans,fontSize:13,fontWeight:600,cursor:'pointer'}}>Готово</button>
      </div>

      <div className="noscroll" style={{flex:1,overflowY:'auto',padding:'18px 18px 40px'}}>
        {/* фото карточки — Free: 1, Paid: до 6 */}
        <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:9}}>
          <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.4,textTransform:'uppercase'}}>фото карточки · {photos.length}/{MAX_PHOTOS}</span>
          <span style={{fontFamily:T.body,fontSize:11.5,color:T.soft,fontStyle:'italic'}}>первое — главное</span>
        </div>
        <div className="noscroll" style={{display:'flex',gap:9,overflowX:'auto',margin:'0 -18px 6px',padding:'2px 18px 6px'}}>
          {photos.map((src,i)=>(
            <div key={i} style={{position:'relative',flexShrink:0}}>
              <button onClick={()=> i!==0 && makePrimary(i)} style={{
                width:80,height:104,borderRadius:14,overflow:'hidden',padding:0,cursor: i===0?'default':'pointer',
                border: i===0 ? `2px solid ${accent}` : `1px solid ${T.divide}`,background:T.hi,display:'block'}}>
                <img src={src} alt={`фото ${i+1}`} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              </button>
              {i===0 && (
                <div style={{position:'absolute',left:6,top:6,padding:'2px 7px',borderRadius:7,
                  background:accent,fontFamily:T.mono,fontSize:7.5,color:'#fff',letterSpacing:0.8,textTransform:'uppercase'}}>главное</div>
              )}
              <button onClick={()=>removePhoto(i)} aria-label="удалить фото" style={{
                position:'absolute',top:5,right:5,width:22,height:22,borderRadius:'50%',border:'none',cursor:'pointer',
                background:'rgba(10,8,5,0.7)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="9" height="9" viewBox="0 0 10 10"><path d="M1 1l8 8M9 1l-8 8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
          ))}
          {/* добавить фото */}
          {photos.length < MAX_PHOTOS ? (
            <button onClick={addPhoto} aria-label="добавить фото" style={{
              width:80,height:104,borderRadius:14,flexShrink:0,cursor:'pointer',
              background:'transparent',border:`1.5px dashed ${T.soft}`,
              display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={T.soft} strokeWidth="1.8" strokeLinecap="round"/></svg>
              <span style={{fontFamily:T.mono,fontSize:8,color:T.soft,letterSpacing:0.6,textTransform:'uppercase'}}>добавить</span>
            </button>
          ) : tariff !== 'paid' ? (
            <button onClick={()=>onBilling&&onBilling()} aria-label="больше фото на Paid" style={{
              width:80,height:104,borderRadius:14,flexShrink:0,cursor:'pointer',
              background:`${accent}0c`,border:`1.5px dashed ${accent}55`,
              display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6,padding:'0 6px'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke={accent} strokeWidth="1.7"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={accent} strokeWidth="1.7"/></svg>
              <span style={{fontFamily:T.mono,fontSize:7.5,color:accent,letterSpacing:0.5,textTransform:'uppercase',textAlign:'center',lineHeight:1.3}}>до 6 фото<br/>на Paid</span>
            </button>
          ) : null}
        </div>
        <div style={{fontFamily:T.body,fontSize:11.5,color:T.soft,fontStyle:'italic',margin:'0 2px 20px'}}>
          {tariff === 'paid'
            ? 'до 6 фото на карточку — тапни другое, чтобы сделать главным'
            : 'на бесплатном тарифе — 1 фото. Paid открывает до 6 на каждую карточку'}
        </div>

        <Field label="имя"><input style={inputStyle} value={name} onChange={e=>setName(e.target.value)}/></Field>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <Field label="должность"><input style={inputStyle} value={role} onChange={e=>setRole(e.target.value)}/></Field>
          <Field label="компания"><input style={inputStyle} value={company} onChange={e=>setCompany(e.target.value)}/></Field>
        </div>
        <Field label="о себе">
          <textarea style={{...inputStyle,minHeight:80,resize:'none',fontFamily:T.body,fontSize:15,lineHeight:1.5}}
            value={bio} onChange={e=>setBio(e.target.value)}/>
        </Field>
        <Field label="сейчас работаю над">
          <input style={inputStyle} value={working} onChange={e=>setWorking(e.target.value)}/>
        </Field>
        <Field label="могу поделиться"><Chips items={give} setItems={setGive} color="rgba(120,210,150,0.95)"/></Field>
        <Field label="хочу разобраться"><Chips items={want} setItems={setWant} color={accent}/></Field>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SCREEN: Тариф и оплата (биллинг)
// ═══════════════════════════════════════════════════
function BillingScreen({ accent = T.accent, onBack }) {
  const [plan, setPlan] = React.useState('paid'); // free | paid
  const green = 'rgba(120,210,150,0.95)';

  const PLANS = [
    { id:'free', name:'Free', price:'0 ₽', per:'', feats:['1 карточка','5 «интересно» в день','чаты после матча'] },
    { id:'paid', name:'Paid', price:'499 ₽', per:'/ мес', feats:['карточки без лимита','«очень интересно»','режим невидимки','кто смотрел твою карточку'] },
  ];

  return (
    <div style={{position:'absolute',inset:0,background:T.bg,paddingTop:16,display:'flex',flexDirection:'column'}}>
      <div style={{padding:'8px 12px 10px',display:'flex',alignItems:'center',gap:6,flexShrink:0,borderBottom:`1px solid ${T.divide}`}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:11,border:'none',background:'transparent',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="8" height="13" viewBox="0 0 8 13"><path d="M7 1L1 6.5 7 12" stroke={T.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{fontFamily:T.serif,fontSize:19,fontWeight:700,color:T.ink}}>Тариф и оплата</div>
      </div>

      <div className="noscroll" style={{flex:1,overflowY:'auto',padding:'16px 18px 40px'}}>
        {/* текущий статус */}
        <div style={{display:'flex',alignItems:'center',gap:11,padding:'13px 15px',borderRadius:16,marginBottom:18,
          background:'rgba(80,180,120,0.1)',border:'1px solid rgba(80,180,120,0.28)'}}>
          <div style={{width:36,height:36,borderRadius:11,flexShrink:0,background:'rgba(80,180,120,0.16)',
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3 9.5l4 4 8-9" stroke={green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:T.sans,fontSize:14,fontWeight:600,color:T.ink}}>Paid активен</div>
            <div style={{fontFamily:T.sans,fontSize:11.5,color:T.soft,marginTop:1}}>следующее списание — 12 августа · 499 ₽</div>
          </div>
        </div>

        {/* тарифы */}
        <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.6,textTransform:'uppercase',marginBottom:10}}>тарифы</div>
        <div style={{display:'flex',flexDirection:'column',gap:9,marginBottom:20}}>
          {PLANS.map(p => {
            const on = plan === p.id;
            return (
              <button key={p.id} onClick={()=>setPlan(p.id)} style={{
                width:'100%',textAlign:'left',padding:'14px 15px',borderRadius:16,cursor:'pointer',
                background: on ? `${accent}0e` : T.surface,
                border: on ? `1.5px solid ${accent}` : `1px solid ${T.divide}`,
              }}>
                <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',gap:8}}>
                  <span style={{fontFamily:T.serif,fontSize:17,fontWeight:700,color:T.ink}}>{p.name}</span>
                  <span style={{fontFamily:T.serif,fontSize:16,fontWeight:700,color: on ? accent : T.mid}}>
                    {p.price}<span style={{fontFamily:T.sans,fontSize:11,fontWeight:400,color:T.soft}}> {p.per}</span>
                  </span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:4,marginTop:9}}>
                  {p.feats.map((f,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{flexShrink:0}}><path d="M2 6.5l3 3 5-6.5" stroke={on ? accent : T.soft} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{fontFamily:T.sans,fontSize:12.5,color:T.mid}}>{f}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* способ оплаты */}
        <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.6,textTransform:'uppercase',marginBottom:10}}>способ оплаты</div>
        <div style={{display:'flex',alignItems:'center',gap:11,padding:'12px 14px',borderRadius:14,marginBottom:9,
          background:T.surface,border:`1px solid ${T.divide}`}}>
          <div style={{width:38,height:26,borderRadius:6,flexShrink:0,background:T.hi,border:`1px solid ${T.divide}`,
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="20" height="13" viewBox="0 0 22 14"><rect x="0.5" y="0.5" width="21" height="13" rx="2" fill="none"/><circle cx="8.5" cy="7" r="4" fill={accent} opacity="0.85"/><circle cx="13.5" cy="7" r="4" fill="#D6AA3C" opacity="0.85"/></svg>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:T.sans,fontSize:13.5,fontWeight:600,color:T.ink}}>Мир ···· 4217</div>
            <div style={{fontFamily:T.sans,fontSize:11,color:T.soft,marginTop:1}}>основная карта</div>
          </div>
          <button style={{padding:'6px 12px',borderRadius:10,border:`1px solid ${T.divide}`,flexShrink:0,
            background:'transparent',color:T.mid,fontFamily:T.sans,fontSize:12,fontWeight:500,cursor:'pointer'}}>Изменить</button>
        </div>

        {/* история */}
        <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.6,textTransform:'uppercase',margin:'16px 0 8px'}}>история</div>
        {[
          { d:'12 июля', s:'Paid · месяц', v:'499 ₽' },
          { d:'12 июня', s:'Paid · месяц', v:'499 ₽' },
        ].map((r,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,
            padding:'10px 2px',borderBottom:`1px solid ${T.divide2}`}}>
            <div>
              <span style={{fontFamily:T.sans,fontSize:13,color:T.ink}}>{r.s}</span>
              <span style={{fontFamily:T.mono,fontSize:9.5,color:T.soft,marginLeft:8}}>{r.d}</span>
            </div>
            <span style={{fontFamily:T.mono,fontSize:12,color:T.mid}}>{r.v}</span>
          </div>
        ))}

        <button style={{width:'100%',marginTop:20,padding:'12px 0',borderRadius:13,border:'none',
          background:'transparent',color:'#E0674A',fontFamily:T.sans,fontSize:13,fontWeight:500,cursor:'pointer'}}>
          Отменить подписку
        </button>
      </div>
    </div>
  );
}

window.ProfileMeScreen = ProfileMeScreen;
window.InboxScreen = InboxScreen;
window.SettingsScreen = SettingsScreen;
window.EditProfileScreen = EditProfileScreen;
window.BillingScreen = BillingScreen;
