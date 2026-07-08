// Clickable end-to-end prototype orchestrator.
// Threads all Core Flow screens into one navigable iPhone flow.
// Narrative: ты (Марина) → карта → карточка Михаила → интересно → матч → чат → встреча → итог.
const { T, MARINA, MIKHAIL, PEOPLE, MY_CARDS, MY_TARIFF,
        MapScreen, CardScreen, MatchScreen, ChatScreen,
        MeetupScreen, ConferenceMapScreen,
        MeetingPreScan, MeetingRunning, ResultScreen,
        ProfileMeScreen, InboxScreen, SettingsScreen, EditProfileScreen, BillingScreen,
        TabBar, SwipeStack, CardPickerSheet, OnboardingFlow } = window;

const ONBOARDED_KEY = 'affin-onboarded';

// ── minimal Chats-list tab ───────────────────────────────
function ChatsList({ accent = T.accent, threads, onOpen }) {
  return (
    <div style={{position:'absolute',inset:0,background:T.bg,paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'12px 18px 10px',flexShrink:0}}>
        <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.8,textTransform:'uppercase'}}>чаты</div>
        <div style={{fontFamily:T.serif,fontSize:26,fontWeight:700,color:T.ink,lineHeight:1.1,marginTop:2,fontStyle:'italic'}}>Разговоры</div>
      </div>
      <div className="noscroll" style={{flex:1,overflowY:'auto',padding:'6px 14px 90px'}}>
        {threads.length === 0 && (
          <div style={{padding:'40px 20px',textAlign:'center',fontFamily:T.body,fontSize:15,color:T.soft,fontStyle:'italic',lineHeight:1.5}}>
            пока пусто. отметь кого-то «интересно» на карте — и если взаимно, тут появится чат.
          </div>
        )}
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          {threads.map((t,i)=>(
            <button key={i} onClick={()=>onOpen&&onOpen(t)} style={{
              display:'flex',alignItems:'center',gap:12,textAlign:'left',cursor:'pointer',
              padding:'12px 12px',borderRadius:14,border:'none',background:'transparent',
            }}>
              <div style={{width:52,height:52,borderRadius:'50%',overflow:'hidden',flexShrink:0,border:`1.5px solid ${accent}44`}}>
                <img src={t.photo} alt={t.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              </div>
              <div style={{flex:1,minWidth:0,borderBottom:`1px solid ${T.divide2}`,paddingBottom:12}}>
                <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',gap:8}}>
                  <span style={{fontFamily:T.serif,fontSize:16,fontWeight:700,color:T.ink}}>{t.name}</span>
                  <span style={{fontFamily:T.mono,fontSize:9,color:T.soft}}>{t.when}</span>
                </div>
                <div style={{fontFamily:T.sans,fontSize:13,color:T.mid,marginTop:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.last}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── QR scanner — camera viewfinder to enter the event ───────
function QRScanScreen({ accent = T.accent, onScanned, onCancel, eventName = 'Mining Expo' }) {
  const [scanned, setScanned] = React.useState(false);
  const [codeMode, setCodeMode] = React.useState(false);
  const [code, setCode] = React.useState('');
  const submitCode = () => {
    if (code.trim().length < 4 || scanned) return;
    setScanned(true);
    setTimeout(() => onScanned && onScanned(), 650);
  };
  const doScan = () => {
    if (scanned) return;
    setScanned(true);
    setTimeout(() => onScanned && onScanned(), 650);
  };
  return (
    <div style={{position:'absolute',inset:0,background:T.deviceBg,display:'flex',flexDirection:'column'}}>
      {/* mock camera feed */}
      <div style={{position:'absolute',inset:0,
        background:'radial-gradient(ellipse at 50% 35%, #2A241A 0%, #14100A 60%, #0A0805 100%)'}}/>
      <div style={{position:'absolute',inset:0,opacity:0.25,
        background:'repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,0.02) 3px 4px)'}}/>

      {/* header */}
      <div style={{position:'relative',zIndex:5,paddingTop:16}}>
        <div style={{padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontFamily:T.mono,fontSize:9,color:'rgba(255,255,255,0.45)',letterSpacing:1.8,textTransform:'uppercase'}}>вход на событие</div>
            <div style={{fontFamily:T.serif,fontSize:20,fontWeight:700,color:'#fff',marginTop:2}}>{eventName}</div>
          </div>
          <button onClick={onCancel} style={{
            width:36,height:36,borderRadius:11,border:'1px solid rgba(255,255,255,0.16)',
            background:'rgba(255,255,255,0.06)',cursor:'pointer',
            display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11"><path d="M1 1l9 9M10 1l-9 9" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* viewfinder */}
      <div style={{position:'relative',zIndex:5,flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:22}}>
        <div onClick={doScan} style={{position:'relative',width:216,height:216,cursor:'pointer'}}>
          {/* corner brackets */}
          {[[0,0,0],[1,0,90],[1,1,180],[0,1,270]].map(([rx,ry,rot],i)=>(
            <svg key={i} width="34" height="34" viewBox="0 0 34 34" style={{
              position:'absolute', left: rx? 'auto':0, right: rx?0:'auto', top: ry?'auto':0, bottom: ry?0:'auto',
              transform:`rotate(${rot}deg)`,
            }}><path d="M2 12 V6 Q2 2 6 2 H12" stroke={scanned ? '#3FB87C' : accent} strokeWidth="3.5" fill="none" strokeLinecap="round"/></svg>
          ))}
          {/* scan line */}
          {!scanned && (
            <div style={{position:'absolute',left:14,right:14,top:0,height:2,borderRadius:1,
              background:`linear-gradient(90deg, transparent, ${accent}, transparent)`,
              boxShadow:`0 0 12px ${accent}`,
              animation:'qrScanLine 2.1s ease-in-out infinite'}}/>
          )}
          {/* success check */}
          {scanned && (
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:74,height:74,borderRadius:'50%',background:'rgba(63,184,124,0.16)',
                border:'1.5px solid rgba(63,184,124,0.6)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path d="M7 16l5 5 11-12" stroke="#3FB87C" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          )}
          <style>{`@keyframes qrScanLine { 0%,100% { top: 10px; } 50% { top: 202px; } }`}</style>
        </div>
        <div style={{textAlign:'center',padding:'0 40px'}}>
          <div style={{fontFamily:T.body,fontSize:15.5,color:'rgba(255,255,255,0.85)',fontStyle:'italic',lineHeight:1.45}}>
            {scanned ? 'готово!' : codeMode ? 'отсканируй код события' : 'наведи камеру на QR-код у входа'}
          </div>
          {!scanned && <div style={{fontFamily:T.mono,fontSize:9,color:'rgba(255,255,255,0.35)',letterSpacing:1.2,textTransform:'uppercase',marginTop:8}}>код на стойке регистрации</div>}
        </div>

        {/* ввод кода — альтернатива QR */}
        {!scanned && (codeMode ? (
          <div style={{display:'flex', gap:8, width:'100%', maxWidth:270, padding:'0 10px'}}>
            <input
              autoFocus
              value={code}
              onChange={e=>setCode(e.target.value.toUpperCase())}
              onKeyDown={e=>{ if(e.key==='Enter') submitCode(); }}
              placeholder="напр. EXPO-2026"
              style={{
                flex:1, minWidth:0, padding:'12px 14px', borderRadius:13,
                background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.18)',
                color:'#fff', fontFamily:T.mono, fontSize:14, letterSpacing:2,
                textAlign:'center', outline:'none', textTransform:'uppercase',
              }}/>
            <button onClick={submitCode} style={{
              padding:'0 16px', borderRadius:13, border:'none', flexShrink:0,
              background: code.trim().length >= 4 ? accent : 'rgba(255,255,255,0.1)',
              color: code.trim().length >= 4 ? '#fff' : 'rgba(255,255,255,0.35)',
              fontFamily:T.sans, fontSize:14, fontWeight:600, cursor:'pointer',
            }}>Войти</button>
          </div>
        ) : (
          <button onClick={()=>setCodeMode(true)} style={{
            border:'none', background:'transparent', cursor:'pointer',
            fontFamily:T.sans, fontSize:13.5, fontWeight:600, color:'rgba(255,255,255,0.65)',
            textDecoration:'underline', textUnderlineOffset:3,
          }}>ввести код вручную</button>
        ))}
        {codeMode && !scanned && (
          <button onClick={()=>{setCodeMode(false); setCode('');}} style={{
            border:'none', background:'transparent', cursor:'pointer', marginTop:-6,
            fontFamily:T.mono, fontSize:9, color:'rgba(255,255,255,0.35)', letterSpacing:1.1, textTransform:'uppercase',
          }}>← вернуться к сканеру</button>
        )}
      </div>

      <div style={{position:'relative',zIndex:5,padding:'0 22px 30px'}}>
        <div style={{textAlign:'center',fontFamily:T.mono,fontSize:9,color:'rgba(255,255,255,0.3)',letterSpacing:1.1}}></div>
      </div>
    </div>
  );
}

// ── Event page — placeholder until described ──────────────
function EventPageScreen({ accent = T.accent, onBack, onToMap }) {
  return (
    <div style={{position:'absolute',inset:0,background:T.bg,paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'8px 12px 10px',display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:11,border:'none',background:'transparent',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="8" height="13" viewBox="0 0 8 13"><path d="M7 1L1 6.5 7 12" stroke={T.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 32px',textAlign:'center'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'5px 12px',borderRadius:16,
          background:'rgba(63,184,124,0.12)',border:'1px solid rgba(63,184,124,0.3)',marginBottom:18}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:'#3FB87C',boxShadow:'0 0 6px rgba(63,184,124,0.9)'}}/>
          <span style={{fontFamily:T.mono,fontSize:9,color:'rgba(120,210,150,0.95)',letterSpacing:1.4,textTransform:'uppercase'}}>ты на событии</span>
        </div>
        <div style={{fontFamily:T.serif,fontSize:30,fontWeight:700,color:T.ink,fontStyle:'italic',lineHeight:1.1}}>Mining Expo</div>
        <div style={{fontFamily:T.body,fontSize:15,color:T.mid,marginTop:12,lineHeight:1.5,maxWidth:260}}>
          страница ивента — наполним, когда опишешь, что здесь должно быть
        </div>
      </div>
      <div style={{padding:'0 22px 28px'}}>
        <button onClick={onToMap} style={{
          width:'100%',padding:'15px 0',borderRadius:14,border:'none',
          background:accent,color:'#fff',
          fontFamily:T.sans,fontSize:15,fontWeight:600,cursor:'pointer',
          boxShadow:`0 6px 22px ${accent}50`,
        }}>К карте участников</button>
      </div>
    </div>
  );
}

// ── Expectations step — after choosing a card on event entry ──
function ExpectationsStep({ accent = T.accent, eventName = 'Mining Expo', value, onChange, onContinue, onSkip }) {
  const text = value.text || '';
  const show = value.show !== false;
  const suggestions = ['найти со-основателя','нанять в команду','обменяться опытом','найти клиентов','просто пообщаться'];
  const addSug = (s) => {
    if (text.toLowerCase().includes(s.toLowerCase())) return;
    onChange({ ...value, text: text.trim() ? `${text.replace(/[,\s]*$/,'')}, ${s}` : s });
  };
  return (
    <div style={{position:'absolute',inset:0,background:T.bg,paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'14px 20px 6px',flexShrink:0}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'4px 11px',borderRadius:16,
          background:'rgba(63,184,124,0.12)',border:'1px solid rgba(63,184,124,0.3)',marginBottom:14}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:'#3FB87C',boxShadow:'0 0 6px rgba(63,184,124,0.9)'}}/>
          <span style={{fontFamily:T.mono,fontSize:8.5,color:'rgba(120,210,150,0.95)',letterSpacing:1.4,textTransform:'uppercase'}}>вход · {eventName}</span>
        </div>
        <div style={{fontFamily:T.serif,fontSize:26,fontWeight:700,color:T.ink,lineHeight:1.12,fontStyle:'italic'}}>Чего ждёшь от мероприятия?</div>
        <div style={{fontFamily:T.body,fontSize:14.5,color:T.mid,marginTop:8,lineHeight:1.5}}>
          коротко — что хочешь получить. поможем свести с нужными людьми
        </div>
      </div>

      <div className="noscroll" style={{flex:1,overflowY:'auto',padding:'14px 20px 20px'}}>
        <textarea value={text} onChange={e=>onChange({ ...value, text:e.target.value })}
          placeholder="напр. найти дизайн-партнёра для MVP и обсудить B2B-онбординг"
          style={{width:'100%',minHeight:96,padding:'13px 14px',borderRadius:14,resize:'none',
            background:T.hi,border:`1px solid ${T.divide}`,color:T.ink,
            fontFamily:T.body,fontSize:15.5,lineHeight:1.5,outline:'none'}}/>

        <div style={{display:'flex',flexWrap:'wrap',gap:7,marginTop:12}}>
          {suggestions.map(s=>(
            <button key={s} onClick={()=>addSug(s)} style={{
              padding:'6px 12px',borderRadius:20,cursor:'pointer',
              background:'transparent',border:`1px dashed ${T.soft}`,
              fontFamily:T.sans,fontSize:12.5,color:T.mid}}>+ {s}</button>
          ))}
        </div>

        {/* toggle — показать в карточке */}
        <button onClick={()=>onChange({ ...value, show: !show })} style={{
          width:'100%',display:'flex',alignItems:'center',gap:12,textAlign:'left',cursor:'pointer',
          padding:'14px 15px',borderRadius:16,marginTop:22,
          background: show ? `${accent}10` : T.surface,
          border: show ? `1px solid ${accent}40` : `1px solid ${T.divide}`}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:T.sans,fontSize:14,fontWeight:600,color:T.ink,lineHeight:1.2}}>Показать в карточке на событии</div>
            <div style={{fontFamily:T.sans,fontSize:11.5,color:T.soft,marginTop:2,lineHeight:1.35}}>
              в твоей карточке появится блок «Ожидаю от мероприятия» — его увидят другие
            </div>
          </div>
          <div style={{width:44,height:26,borderRadius:13,padding:3,flexShrink:0,
            background: show ? accent : T.hi,transition:'background 0.2s'}}>
            <div style={{width:20,height:20,borderRadius:'50%',background:'#fff',
              transform: show ? 'translateX(18px)' : 'translateX(0)',transition:'transform 0.2s'}}/>
          </div>
        </button>
      </div>

      <div style={{padding:'0 20px 28px',flexShrink:0}}>
        <button onClick={onContinue} style={{
          width:'100%',padding:'15px 0',borderRadius:14,border:'none',
          background:accent,color:'#fff',fontFamily:T.sans,fontSize:15,fontWeight:600,cursor:'pointer',
          boxShadow:`0 6px 22px ${accent}50`}}>Войти на событие →</button>
        <button onClick={onSkip} style={{
          width:'100%',marginTop:10,padding:'10px 0',border:'none',background:'transparent',cursor:'pointer',
          fontFamily:T.sans,fontSize:13.5,fontWeight:500,color:T.soft}}>Пропустить</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// The prototype app
// ═══════════════════════════════════════════════════
function PrototypeApp({ accent = T.accent, eventStyle = 'building' }) {
  const [screen, setScreen]   = React.useState('map');   // map|card|match|chat|meet-qr|meet-run|result|inbox|chats|me
  const [resStage, setResStage] = React.useState('confirm');
  const [threshold, setThreshold] = React.useState(0);
  const [matched, setMatched] = React.useState(false);   // has a match happened
  const [addedContact, setAddedContact] = React.useState(false);
  const [discoverMode, setDiscoverMode] = React.useState('map'); // map|swipe
  const [pendingEvent, setPendingEvent] = React.useState('conf'); // conf|meetup
  const [cardFrom, setCardFrom] = React.useState('map'); // откуда открыта карточка
  const openCard = (from) => { setCardFrom(from); setScreen('card'); };
  const [billingFrom, setBillingFrom] = React.useState('me');
  const openBilling = (from) => { setBillingFrom(from); setScreen('billing'); };
  // мультикарточность
  const [eventCardId, setEventCardId] = React.useState('c1'); // карточка на текущем событии
  const [picker, setPicker] = React.useState(null); // null | 'enter' | 'switch'
  const [myExp, setMyExp] = React.useState({ text:'', show:true }); // ожидания от мероприятия
  const eventCard = MY_CARDS.find(c => c.id === eventCardId) || MY_CARDS[0];
  const handleCreateCard = () => { setPicker(null); if (MY_TARIFF === 'free') { openBilling('me'); } else { setScreen('edit'); } };

  const restart = () => { setScreen('map'); setResStage('confirm'); setMatched(false); setAddedContact(false); setDiscoverMode('map'); setMyExp({ text:'', show:true }); };
  window.__protoRestart = restart;

  // системный «назад» (свайп с края на Android) — шаг назад по экранам вместо закрытия PWA
  const backRef = React.useRef(null);
  backRef.current = () => {
    if (picker) { if (picker === 'switch') setPicker(null); return; }
    switch (screen) {
      case 'card':      setScreen(cardFrom); break;
      case 'match':     setScreen('map'); break;
      case 'chat':      setScreen(matched ? 'chats' : 'map'); break;
      case 'meet-qr':   setScreen('chat'); break;
      case 'meet-run':  setScreen('chat'); break;
      case 'result':    setScreen('map'); break;
      case 'qr-scan':   setScreen('map'); break;
      case 'expectations': setScreen('map'); break;
      case 'event-page':   setScreen('map'); break;
      case 'meetup-page':  setScreen('map'); break;
      case 'settings':  setScreen('me'); break;
      case 'edit':      setScreen('me'); break;
      case 'billing':   setScreen(billingFrom); break;
      case 'inbox': case 'chats': case 'me': setScreen('map'); break;
      case 'map': default:
        if (discoverMode === 'swipe') setDiscoverMode('map');
        break; // с карты не выходим
    }
  };
  React.useEffect(() => {
    history.pushState({ affin: 1 }, '');
    const onPop = () => {
      backRef.current && backRef.current();
      history.pushState({ affin: 1 }, ''); // снова взводим ловушку
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // chat threads visible in Чаты tab
  const threads = [];
  if (matched) threads.push({ name:`${MIKHAIL.name} ${MIKHAIL.last}`, photo:MIKHAIL.photo, when:'сейчас', last: addedContact ? 'в твоей сети' : 'давай через 10 минут, у входа…' });

  // which tab is active in the bottom bar
  const tabFor = { map:'discover', inbox:'inbox', chats:'chats', me:'me' };
  const showTabBar = ['map','inbox','chats','me'].includes(screen);
  const badges = { inbox:4, chats: matched ? 1 : 0 };

  const goTab = (id) => {
    if (id === 'discover') setScreen('map');
    else if (id === 'inbox') setScreen('inbox');
    else if (id === 'chats') setScreen('chats');
    else if (id === 'me') setScreen('me');
  };

  const onDiscoverToggle = () => {
    if (screen !== 'map') { setScreen('map'); return; }
    setDiscoverMode(m => m === 'map' ? 'swipe' : 'map');
  };

  let body;
  switch (screen) {
    case 'map':
      body = (
        <div style={{position:'absolute',inset:'0 0 76px 0'}}>
          {discoverMode === 'swipe' ? (
            <div style={{position:'absolute',inset:0,background:T.canvas}}>
              <SwipeStack accent={accent}/>
            </div>
          ) : (
            <MapScreen variant="A" threshold={threshold} setThreshold={setThreshold}
              accent={accent} showSlider={false} district="depo" eventStyle={eventStyle}
              onPersonTap={() => openCard('map')}
              onClusterTap={() => setDiscoverMode('swipe')}
              onEventViewPeople={() => { setPendingEvent('conf'); setScreen('qr-scan'); }}
              onMeetupEnter={() => { setPendingEvent('meetup'); setScreen('qr-scan'); }}
              onCreateCard={handleCreateCard}/>
          )}
        </div>
      );
      break;

    case 'qr-scan':
      body = (
        <QRScanScreen accent={accent} eventName={pendingEvent === 'meetup' ? 'Крипто-завтрак' : 'Mining Expo'}
          onScanned={() => setPicker('enter')}
          onCancel={() => setScreen('map')}/>
      );
      break;

    case 'meetup-page':
      body = (
        <MeetupScreen accent={accent} activeCard={eventCard} onSwitchCard={() => setPicker('switch')}
          onBack={() => setScreen('map')}
          onOpenPerson={() => openCard('meetup-page')}
          onPeople={() => { setDiscoverMode('swipe'); setScreen('map'); }}/>
      );
      break;

    case 'event-page':
      body = (
        <ConferenceMapScreen accent={accent} activeCard={eventCard} onSwitchCard={() => setPicker('switch')}
          onBack={() => setScreen('map')}
          onPeople={() => { setDiscoverMode('swipe'); setScreen('map'); }}/>
      );
      break;

    case 'expectations':
      body = (
        <ExpectationsStep accent={accent} eventName={pendingEvent === 'meetup' ? 'Крипто-завтрак' : 'Mining Expo'}
          value={myExp} onChange={setMyExp}
          onContinue={() => setScreen(pendingEvent === 'meetup' ? 'meetup-page' : 'event-page')}
          onSkip={() => { setMyExp(v => ({ ...v, show:false })); setScreen(pendingEvent === 'meetup' ? 'meetup-page' : 'event-page'); }}/>
      );
      break;

    case 'card':
      body = (
        <CardScreen accent={accent} hierarchy="B" ctaVariant="A" tier="paid" iconSet="arrow"
          person={MIKHAIL}
          expectation={cardFrom === 'me' ? (myExp.show ? myExp.text : null) : MIKHAIL.expectation}
          onBack={() => setScreen(cardFrom)}
          onSkip={() => setScreen(cardFrom)}
          onInterest={() => { setMatched(true); setScreen('match'); }}
          onMessage={() => { setMatched(true); setScreen('chat'); }}/>
      );
      break;

    case 'match':
      body = (
        <MatchScreen accent={accent} animate={true}
          onContinue={() => setScreen('chat')}
          onClose={() => setScreen('map')}
          onLater={() => setScreen('map')}/>
      );
      break;

    case 'chat':
      body = (
        <ChatScreen accent={accent} stage="mid"
          onBack={() => setScreen(matched ? 'chats' : 'map')}
          onOpenProfile={() => openCard('chat')}
          onLeaveMatch={() => { setMatched(false); setScreen('chats'); }}
          onStartMeeting={() => setScreen('meet-qr')}/>
      );
      break;

    case 'meet-qr':
      body = (
        <MeetingPreScan accent={accent}
          onScanned={() => setScreen('meet-run')}
          onCancel={() => setScreen('chat')}/>
      );
      break;

    case 'meet-run':
      body = (
        <MeetingRunning accent={accent} secondsLeft={1*60+48}
          onCancel={() => setScreen('chat')}
          onFinish={() => { setResStage('confirm'); setScreen('result'); }}/>
      );
      break;

    case 'result':
      body = (
        <ResultScreen accent={accent} stage={resStage}
          onMet={() => setResStage('exchange')}
          onSkip={() => setScreen('map')}
          onExchange={() => { setAddedContact(true); setResStage('done'); }}
          onMessage={() => setScreen('chat')}
          onBackToMap={() => setScreen('map')}/>
      );
      break;

    case 'inbox':
      body = (
        <InboxScreen accent={accent}
          onOpenPerson={() => openCard('inbox')}
          onReciprocate={() => { setMatched(true); setScreen('match'); }}/>
      );
      break;

    case 'chats':
      body = <ChatsList accent={accent} threads={threads} onOpen={() => setScreen('chat')}/>;
      break;

    case 'me':
      body = (
        <ProfileMeScreen accent={accent}
          onOpenCard={() => openCard('me')}
          onEdit={() => setScreen('edit')}
          onAddCard={() => setScreen('edit')}
          onBilling={() => openBilling('me')}
          onSettings={() => setScreen('settings')}/>
      );
      break;

    case 'billing':
      body = <BillingScreen accent={accent} onBack={() => setScreen(billingFrom)}/>;
      break;

    case 'settings':
      body = <SettingsScreen accent={accent} onBack={() => setScreen('me')} onBilling={() => openBilling('settings')}/>;
      break;

    case 'edit':
      body = <EditProfileScreen accent={accent} onBack={() => setScreen('me')} onBilling={() => openBilling('edit')}/>;
      break;

    default:
      body = null;
  }

  return (
    <div style={{position:'absolute',inset:0}}>
      {body}
      {showTabBar && (
        <TabBar variant="fab" active={tabFor[screen]} accent={accent} badges={badges} onChange={goTab}
          discoverMode={discoverMode} onDiscoverToggle={onDiscoverToggle}/>
      )}
      {picker && (
        <CardPickerSheet accent={accent} cards={MY_CARDS} selectedId={eventCardId}
          title={picker === 'enter' ? 'С какой карточкой ты здесь?' : 'Показывать карточку'}
          subtitle={picker === 'enter'
            ? (pendingEvent === 'meetup' ? 'Крипто-завтрак — тебя увидят именно так' : 'Mining Expo — тебя увидят именно так')
            : 'меняется везде на этом событии — карта, лента, встреча'}
          dismissable={picker === 'switch'}
          onSelect={(c) => {
            setEventCardId(c.id);
            if (picker === 'enter') setScreen('expectations');
            setPicker(null);
          }}
          onCreate={handleCreateCard}
          onClose={() => setPicker(null)}/>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Корень приложения: первый вход показывает онбординг,
// дальше — сразу основной прототип (флаг в localStorage)
// ═══════════════════════════════════════════════════
function AppRoot({ accent = T.accent }) {
  const [onboarded, setOnboarded] = React.useState(() => {
    try { return localStorage.getItem(ONBOARDED_KEY) === '1'; } catch (e) { return false; }
  });
  // хук для демо/отладки — показать онбординг заново без очистки данных
  window.__protoShowOnboarding = () => setOnboarded(false);

  if (!onboarded) {
    return (
      <OnboardingFlow accent={accent} onFinish={() => {
        try { localStorage.setItem(ONBOARDED_KEY, '1'); } catch (e) {}
        setOnboarded(true);
      }}/>
    );
  }
  return <PrototypeApp accent={accent}/>;
}

window.PrototypeApp = PrototypeApp;
window.ChatsList = ChatsList;
window.AppRoot = AppRoot;
