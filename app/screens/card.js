// Screen 2: Person card (swipe view)
// 3 hierarchy variants + 3 "Interesting" CTA variants + 3 "Very Interesting" treatments
const { T, MARINA, PEOPLE } = window;

// ─── Status pill ─────────────────────────────────────────
function StatusPill({ accent = T.accent, text = 'на Mining Expo · рядом сейчас' }) {
  return (
    <div style={{
      display:'inline-flex',alignItems:'center',gap:6,
      padding:'4px 10px',borderRadius:8,
      background:`${accent}18`,border:`1px solid ${accent}35`,
    }}>
      <div style={{width:5,height:5,borderRadius:'50%',background:accent,boxShadow:`0 0 6px ${accent}`}}/>
      <span style={{fontFamily:T.mono,fontSize:9.5,color:accent,letterSpacing:1.1,textTransform:'uppercase'}}>{text}</span>
    </div>
  );
}

// ─── Event achievements (quest badges) ──────────────────
const CARD_ACH = [
  { title:'Mining Expo 2026', when:'вчера', earned:true },
  { title:'Product Sense', when:'март', earned:true },
  { title:'Design Weekend', when:'февраль', earned:true },
  { title:'Крипто-завтрак', when:'', earned:false },
];

function AchStar({ size = 14, color, dim }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.3 7.2 17.7l.9-5.4L4.2 8.5l5.4-.8L12 2z"
        fill={dim ? 'none' : color} stroke={color} strokeWidth={dim ? 1.6 : 1} strokeLinejoin="round"/>
    </svg>
  );
}

// Compact clickable strip shown on the card — a small subsection, not the whole list
function AchStrip({ ach = CARD_ACH, accent = T.accent, onOpen, compact }) {
  const earned = ach.filter(a => a.earned);
  if (!earned.length) return null;

  const Stars = ({ size, ring }) => (
    <div style={{display:'flex',alignItems:'center'}}>
      {earned.slice(0,3).map((a,i)=>(
        <div key={i} style={{
          width:ring,height:ring,borderRadius:'50%',marginLeft: i===0?0:-(ring*0.32),
          background:`${accent}22`,border:`1.5px solid ${accent}`,
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:`0 0 0 2px ${T.bg}`, zIndex: 3-i,
        }}>
          <AchStar size={size} color={accent}/>
        </div>
      ))}
    </div>
  );

  if (compact) {
    // pill — компактная капсула трек-рекорда
    return (
      <button onClick={onOpen} aria-label="трек-рекорд" style={{
        display:'inline-flex',alignItems:'center',gap:5,cursor:'pointer',flexShrink:0,
        padding:'4px 10px 4px 8px',borderRadius:20,
        background:`${accent}14`,border:`1px solid ${accent}33`,
      }}>
        <AchStar size={12} color={accent}/>
        <span style={{fontFamily:T.mono,fontSize:9.5,fontWeight:700,color:accent,letterSpacing:0.6,textTransform:'uppercase',lineHeight:1}}>трек</span>
      </button>
    );
  }

  return (
    <button onClick={onOpen} style={{
      width:'100%',display:'flex',alignItems:'center',gap:11,textAlign:'left',cursor:'pointer',
      padding:'10px 12px',borderRadius:12,marginBottom:14,
      background:`${accent}0A`,border:`1px solid ${accent}22`,
    }}>
      <Stars size={13} ring={26}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:T.mono,fontSize:8.5,color:T.soft,letterSpacing:1.4,textTransform:'uppercase'}}>ачивки событий</div>
        <div style={{fontFamily:T.sans,fontSize:13,fontWeight:600,color:T.ink,marginTop:1}}>{earned.length} пройденных квеста</div>
      </div>
      <svg width="7" height="12" viewBox="0 0 7 12" style={{flexShrink:0}}><path d="M1 1l5 5-5 5" stroke={T.soft} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
}

// Full achievements page — opened from the card strip
function AchievementsPanel({ ach = CARD_ACH, person = MARINA, accent = T.accent, onClose }) {
  const earned = ach.filter(a => a.earned).length;
  return (
    <div style={{position:'absolute',inset:0,zIndex:80,background:T.bg,paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'10px 16px 10px',display:'flex',alignItems:'center',gap:12,flexShrink:0,borderBottom:`1px solid ${T.divide}`}}>
        <button onClick={onClose} style={{
          width:36,height:36,borderRadius:11,border:`1px solid ${T.divide}`,
          background:T.surface,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0,
        }}>
          <svg width="7" height="12" viewBox="0 0 7 12"><path d="M6 1L1 6l5 5" stroke={T.soft} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{minWidth:0}}>
          <div style={{fontFamily:T.mono,fontSize:8.5,color:T.soft,letterSpacing:1.6,textTransform:'uppercase'}}>трек-рекорд</div>
          <div style={{fontFamily:T.serif,fontSize:19,fontWeight:700,color:T.ink,lineHeight:1.1,fontStyle:'italic'}}>{person.name} на событиях</div>
        </div>
      </div>

      <div className="noscroll" style={{flex:1,overflowY:'auto',padding:'16px 16px 40px'}}>
        {/* сводка: живые встречи · как давно с нами · КУС */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:16}}>
          {[
            {n:'7', l:'живых встреч'},
            {n:'4 мес', l:'с нами'},
          ].map((s,i)=>(
            <div key={i} style={{
              padding:'13px 8px',borderRadius:14,textAlign:'center',
              background:T.surface,border:`1px solid ${T.divide}`,
            }}>
              <div style={{fontFamily:T.serif,fontSize:22,fontWeight:700,color:T.ink,lineHeight:1}}>{s.n}</div>
              <div style={{fontFamily:T.mono,fontSize:8,color:T.soft,letterSpacing:0.7,textTransform:'uppercase',marginTop:5}}>{s.l}</div>
            </div>
          ))}
          {/* КУС — статус проверки */}
          <div style={{
            padding:'13px 8px',borderRadius:14,textAlign:'center',
            background:'rgba(80,180,120,0.10)',border:'1px solid rgba(80,180,120,0.3)',
          }}>
            <div style={{width:24,height:24,borderRadius:'50%',margin:'0 auto',
              background:'rgba(80,180,120,0.95)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.2 3.2L13 4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{fontFamily:T.mono,fontSize:8,color:'rgba(120,210,150,0.95)',letterSpacing:0.7,textTransform:'uppercase',marginTop:6}}>КУС пройден</div>
          </div>
        </div>

        {/* с кем встречался */}
        {PEOPLE && PEOPLE.length > 0 && (
          <div style={{marginBottom:20}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:9}}>
              <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.6,textTransform:'uppercase'}}>с кем встречался</span>
              <div style={{flex:1,height:1,background:T.divide}}/>
            </div>
            <div className="noscroll" style={{display:'flex',gap:12,overflowX:'auto',margin:'0 -16px',padding:'2px 16px 4px'}}>
              {PEOPLE.slice(0,6).map(m=>(
                <div key={m.id} style={{flexShrink:0,width:56,textAlign:'center'}}>
                  <div style={{width:48,height:48,borderRadius:'50%',overflow:'hidden',margin:'0 auto',
                    background:`${accent}1A`,border:`1.5px solid ${T.divide}`}}>
                    <img src={m.photo} alt={m.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                  <div style={{fontFamily:T.sans,fontSize:11,color:T.mid,marginTop:5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{m.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ачивки событий */}
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
          <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.6,textTransform:'uppercase'}}>ачивки событий</span>
          <div style={{flex:1,height:1,background:T.divide}}/>
        </div>
        <p style={{margin:'0 0 14px',fontFamily:T.body,fontSize:13.5,color:T.mid,lineHeight:1.5,fontStyle:'italic'}}>
          бейджи за пройденные квесты на событиях — остаются в профиле навсегда
        </p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {ach.map((a,i)=>(
            <div key={i} style={{
              padding:'18px 12px',borderRadius:16,textAlign:'center',
              background: a.earned ? `${accent}0e` : T.surface,
              border: a.earned ? `1px solid ${accent}44` : `1px dashed ${T.divide}`,
              opacity: a.earned ? 1 : 0.5,
            }}>
              <div style={{width:52,height:52,borderRadius:'50%',margin:'0 auto',
                display:'flex',alignItems:'center',justifyContent:'center',
                background: a.earned ? `${accent}22` : T.hi,
                border: a.earned ? `1.5px solid ${accent}` : `1.5px solid ${T.divide}`}}>
                {a.earned
                  ? <AchStar size={26} color={accent}/>
                  : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="11" width="14" height="9" rx="2" stroke={T.soft} strokeWidth="1.6"/>
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={T.soft} strokeWidth="1.6"/>
                    </svg>
                  )}
              </div>
              <div style={{fontFamily:T.serif,fontSize:14,fontWeight:700,color: a.earned ? T.ink : T.soft,marginTop:10,lineHeight:1.15}}>{a.title}</div>
              <div style={{fontFamily:T.mono,fontSize:8,color:T.soft,letterSpacing:0.6,textTransform:'uppercase',marginTop:5}}>{a.earned ? a.when : 'не пройдено'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Photos on a person's card (multi-photo gallery) ─────
function personPhotos(p) {
  return (p && p.photos && p.photos.length) ? p.photos : (p && p.photo ? [p.photo] : []);
}

// Fullscreen swipeable photo viewer — opened by tapping the card avatar
function PhotoViewer({ photos = [], start = 0, name, accent = T.accent, onClose }) {
  const [i, setI] = React.useState(start);
  const [dx, setDx] = React.useState(0);
  const startX = React.useRef(null);
  const n = photos.length;
  const go = (d) => setI(v => Math.max(0, Math.min(n - 1, v + d)));
  const onDown = (e) => { const t = e.touches ? e.touches[0] : e; startX.current = t.clientX; };
  const onMove = (e) => { if (startX.current == null) return; const t = e.touches ? e.touches[0] : e; setDx(t.clientX - startX.current); };
  const onUp = () => {
    if (startX.current == null) return;
    if (dx < -60) go(1); else if (dx > 60) go(-1);
    setDx(0); startX.current = null;
  };
  return (
    <div style={{position:'absolute',inset:0,zIndex:90,background:'#0A0805',
      display:'flex',flexDirection:'column',animation:'fadeIn 0.2s ease-out'}}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
      {/* top bar */}
      <div style={{position:'absolute',top:0,left:0,right:0,zIndex:3,paddingTop:'calc(16px + var(--sat))',
        display:'flex',alignItems:'center',justifyContent:'space-between',padding:'54px 14px 0'}}>
        <div style={{fontFamily:T.mono,fontSize:11,fontWeight:700,color:'#fff',letterSpacing:1,
          padding:'5px 11px',borderRadius:20,background:'rgba(0,0,0,0.4)',backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)'}}>{i+1} / {n}</div>
        <button onClick={onClose} aria-label="закрыть" style={{width:36,height:36,borderRadius:11,border:'none',cursor:'pointer',
          background:'rgba(0,0,0,0.4)',backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* photo track */}
      <div style={{flex:1,position:'relative',overflow:'hidden'}}>
        <div style={{display:'flex',height:'100%',
          transform:`translateX(calc(${-i*100}% + ${dx}px))`,
          transition: startX.current == null ? 'transform 0.3s ease-out' : 'none'}}>
          {photos.map((src,k)=>(
            <div key={k} style={{flex:'0 0 100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <img src={src} alt={`${name||''} ${k+1}`} draggable={false} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            </div>
          ))}
        </div>
        {/* tap zones */}
        {i > 0 && <div onClick={()=>go(-1)} style={{position:'absolute',left:0,top:0,bottom:0,width:'32%',cursor:'pointer'}}/>}
        {i < n-1 && <div onClick={()=>go(1)} style={{position:'absolute',right:0,top:0,bottom:0,width:'32%',cursor:'pointer'}}/>}
      </div>

      {/* name + dots */}
      <div style={{position:'absolute',left:0,right:0,bottom:0,zIndex:3,padding:'0 20px max(30px, calc(16px + var(--sab)))',
        background:'linear-gradient(to top, rgba(10,8,5,0.85), transparent)'}}>
        {name && <div style={{fontFamily:T.serif,fontSize:22,fontWeight:700,color:'#fff',marginBottom:12}}>{name}</div>}
        <div style={{display:'flex',gap:6,justifyContent:'center'}}>
          {photos.map((_,k)=>(
            <button key={k} onClick={()=>setI(k)} aria-label={`фото ${k+1}`} style={{
              width: k===i?22:6, height:6, borderRadius:3, border:'none', cursor:'pointer', padding:0,
              background: k===i ? accent : 'rgba(255,255,255,0.4)', transition:'all 0.25s'}}/>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`}</style>
    </div>
  );
}

// ─── Card body sections (shared) ─────────────────────────
function CardSection({ label, children, accent = T.accent }) {
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
        <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.8,textTransform:'uppercase'}}>{label}</span>
        <div style={{flex:1,height:1,background:T.divide}}/>
      </div>
      {children}
    </div>
  );
}

function GiveChips({ items, color = 'rgba(80,180,120,0.9)' }) {
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
      {items.map((t,i)=>(
        <span key={i} style={{
          padding:'4px 11px',borderRadius:13,
          background:'rgba(80,180,120,0.12)',
          color:'rgba(120,210,150,0.95)',
          fontFamily:T.sans,fontSize:12.5,fontWeight:500,
          border:'1px solid rgba(80,180,120,0.28)',
        }}>{t}</span>
      ))}
    </div>
  );
}
function WantChips({ items, accent = T.accent }) {
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
      {items.map((t,i)=>(
        <span key={i} style={{
          padding:'4px 11px',borderRadius:13,
          background:`${accent}14`, color:accent,
          fontFamily:T.sans,fontSize:12.5,fontWeight:500,
          border:`1px solid ${accent}30`,
        }}>{t}</span>
      ))}
    </div>
  );
}

// ─── Icon helpers (symbolic-only action bar) ─────────────
function IconSkip({ c, size=20 }) {
  // ✕ — pass / not now
  return <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M5 5l10 10M15 5L5 15" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>;
}
function IconMessage({ c, size=20 }) {
  return <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8.5L5 16v-3a2 2 0 0 1-2-2V5z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>;
}

// ─── Icon vocabulary for "интересно / очень интересно" ───
// Each pair: regular (= интересно) → emphasized (= очень интересно)
// "очень" is the SAME concept dialed up — visually evolved, not a different idea.
const IconSets = {
  bookmark: {
    label:'Закладка',
    note:'tap = заложить · удерж. = пометить ярко',
    Regular: ({c, size=22, fill=false}) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M5.5 3.5h11v15l-5.5-3.8-5.5 3.8v-15z" stroke={c} strokeWidth="1.7" strokeLinejoin="round" fill={fill?c:'none'}/>
    </svg>,
    Strong: ({c, size=22}) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M5.5 3.5h11v15l-5.5-3.8-5.5 3.8v-15z" fill={c} stroke={c} strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="M11 7v4M11 14v.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>,
  },
  pin: {
    label:'Булавка',
    note:'tap = приколоть · удерж. = подсветить',
    Regular: ({c, size=22, fill=false}) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M14 3l5 5-3.5 1L11 13l1 5-2 1-3-5-4-1 4-4.5 1-3.5L14 3z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" fill={fill?c:'none'}/>
    </svg>,
    Strong: ({c, size=22}) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M14 3l5 5-3.5 1L11 13l1 5-2 1-3-5-4-1 4-4.5 1-3.5L14 3z" fill={c} stroke={c} strokeWidth="1.6" strokeLinejoin="round"/>
      <circle cx="17" cy="5" r="2.2" fill={c} stroke="#fff" strokeWidth="1.4"/>
    </svg>,
  },
  spark: {
    label:'Искра',
    note:'tap = заметил · удерж. = выделил',
    Regular: ({c, size=22}) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M11 3v6M11 13v6M3 11h6M13 11h6" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M5.5 5.5l3 3M16.5 5.5l-3 3M5.5 16.5l3-3M16.5 16.5l-3-3" stroke={c} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
    </svg>,
    Strong: ({c, size=22}) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M11 1.5v8M11 12.5v8M1.5 11h8M12.5 11h8" stroke={c} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M4 4l3.5 3.5M18 4l-3.5 3.5M4 18l3.5-3.5M18 18l-3.5-3.5" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>,
  },
  arrow: {
    label:'Стрелка',
    note:'tap = к нему · удерж. = срочно',
    Regular: ({c, size=22}) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M4 11h13M11 5l6 6-6 6" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    Strong: ({c, size=22}) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M2 11h15M11 4l7 7-7 7" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 7h6M2 15h6" stroke={c} strokeWidth="1.6" strokeLinecap="round" opacity="0.55"/>
    </svg>,
  },
  underline: {
    label:'Подчёркивание',
    note:'tap = подчеркнул · удерж. = двойное',
    Regular: ({c, size=22}) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M5 8c2 5 10 5 12 0" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M4 14h14" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>,
    Strong: ({c, size=22}) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M5 6c2 5 10 5 12 0" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M4 12h14M4 16h14" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>,
  },
  dot: {
    label:'Точка',
    note:'tap = отметка · удерж. = жирная',
    Regular: ({c, size=22}) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="3.5" fill={c}/>
    </svg>,
    Strong: ({c, size=22}) => <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="6" fill={c}/>
      <circle cx="11" cy="11" r="9.5" stroke={c} strokeWidth="1.4" strokeDasharray="2 2"/>
    </svg>,
  },
};

// Backward-compat aliases
const IconInterest = ({c, size=22}) => IconSets.bookmark.Regular({c, size, fill:false});
const IconInterestFilled = ({c, size=22}) => IconSets.bookmark.Regular({c, size, fill:true});
function IconStar({ c, size=18 }) {
  return IconSets.spark.Strong({c, size});
}

// ─── Action bar variants — symbolic, no text on buttons ──
// All three: 3 icon affordances. Layout, weight & "очень" treatment differ.

// Variant A — Even row in one container. Two adjacent affordances:
//             "интересно" (Regular glyph) and "очень" (Strong glyph + counter).
//             Both visible simultaneously — no hidden long-press.
function ActionBarA({ accent, tier, iconSet='bookmark', onSkip, onInterest, onVery, onMessage }) {
  const paid = tier === 'paid';
  const Set = IconSets[iconSet] || IconSets.bookmark;

  return (
    <div style={{
      display:'flex',alignItems:'center',gap:6,
      padding:6,borderRadius:18,
      background:T.surface,border:`1px solid ${T.divide}`,
      position:'relative',
    }}>
      <button onClick={onSkip} title="Пропустить" style={{
        flex:0.9,height:52,borderRadius:13,border:'none',
        background:'transparent',cursor:'pointer',
        display:'flex',alignItems:'center',justifyContent:'center',
      }}><IconSkip c={T.soft}/></button>

      <button onClick={onInterest} title="Интересно" style={{
        flex:1.2,height:52,borderRadius:13,border:'none',
        background:`${accent}1a`,
        cursor:'pointer',position:'relative',
        display:'flex',alignItems:'center',justifyContent:'center',
        transition:'all 160ms ease',
      }}>
        <Set.Regular c={accent} fill={true} size={22}/>
      </button>

      {paid && (
        <button onClick={onVery} title="Очень интересно" style={{
          flex:1.2,height:52,borderRadius:13,border:'none',
          background:accent,boxShadow:`0 6px 18px ${accent}55`,
          cursor:'pointer',position:'relative',
          display:'flex',alignItems:'center',justifyContent:'center',gap:6,
          transition:'all 160ms ease',
        }}>
          <Set.Strong c="#fff" size={24}/>
          <span style={{
            fontFamily:T.mono,fontSize:10.5,fontWeight:700,color:'#fff',
            letterSpacing:0.5,opacity:0.9,
          }}>5</span>
        </button>
      )}

      <button onClick={onMessage} title="Написать сообщение" style={{
        flex:0.9,height:52,borderRadius:13,border:'none',
        background:'transparent',cursor:'pointer',
        display:'flex',alignItems:'center',justifyContent:'center',
      }}><IconMessage c={T.mid}/></button>
    </div>
  );
}

// Variant B — Floating circles, "dock" feel. Primary larger.
function ActionBarB({ accent, tier, iconSet='spark', onSkip, onInterest, onMessage }) {
  const paid = tier === 'paid';
  const Set = IconSets[iconSet] || IconSets.spark;
  const [strong, setStrong] = React.useState(false);
  const Glyph = strong ? Set.Strong : Set.Regular;
  const press = () => { if (paid) { setStrong(true); setTimeout(()=>setStrong(false), 1100); } };
  return (
    <div style={{
      display:'flex',alignItems:'center',justifyContent:'center',gap:14,
    }}>
      <button onClick={onSkip} title="Пропустить" style={{
        width:54,height:54,borderRadius:'50%',border:`1px solid ${T.divide}`,
        background:T.surface,cursor:'pointer',
        display:'flex',alignItems:'center',justifyContent:'center',
      }}><IconSkip c={T.soft}/></button>

      <div style={{position:'relative'}}>
        <button title={strong ? 'Очень интересно' : 'Интересно (удерж. = очень)'}
          onClick={onInterest}
          onPointerDown={press}
          style={{
            width: strong ? 76 : 68, height: strong ? 76 : 68,
            borderRadius:'50%',border:'none',
            background:accent,
            boxShadow: strong
              ? `0 0 0 6px ${accent}33, 0 14px 36px ${accent}77, inset 0 -2px 0 rgba(0,0,0,0.12)`
              : `0 10px 28px ${accent}55, inset 0 -2px 0 rgba(0,0,0,0.12)`,
            transition:'all 220ms cubic-bezier(.2,.7,.2,1.4)',
            cursor:'pointer',
            display:'flex',alignItems:'center',justifyContent:'center',
        }}><Glyph c="#fff" size={26} fill={true}/></button>
        {paid && (
          <span style={{
            position:'absolute',top:-4,right:-4,
            minWidth:22,height:22,padding:'0 6px',borderRadius:11,
            background:T.bg,border:`1.5px solid ${accent}`,color:accent,
            display:'flex',alignItems:'center',justifyContent:'center',gap:3,
            fontFamily:T.mono,fontSize:9.5,fontWeight:700,
            pointerEvents:'none',
          }}><Set.Strong c={accent} size={10}/>5</span>
        )}
      </div>

      <button onClick={onMessage} title="Написать сообщение" style={{
        width:54,height:54,borderRadius:'50%',border:`1px solid ${T.divide}`,
        background:T.surface,cursor:'pointer',
        display:'flex',alignItems:'center',justifyContent:'center',
      }}><IconMessage c={T.mid}/></button>
    </div>
  );
}

// Variant C — Bare row, no chrome. Primary distinguished by accent stroke.
function ActionBarC({ accent, tier, iconSet='underline', onSkip, onInterest, onMessage }) {
  const paid = tier === 'paid';
  const Set = IconSets[iconSet] || IconSets.underline;
  const [strong, setStrong] = React.useState(false);
  const Glyph = strong ? Set.Strong : Set.Regular;
  const press = () => { if (paid) { setStrong(true); setTimeout(()=>setStrong(false), 1100); } };
  return (
    <div style={{
      display:'flex',alignItems:'center',justifyContent:'space-around',
      padding:'4px 0',
    }}>
      <button onClick={onSkip} title="Пропустить" style={{
        width:56,height:56,borderRadius:14,border:'none',
        background:'transparent',cursor:'pointer',
        display:'flex',alignItems:'center',justifyContent:'center',
      }}><IconSkip c={T.soft} size={22}/></button>

      <div style={{position:'relative'}}>
        <button title={strong ? 'Очень интересно' : 'Интересно (удерж. = очень)'}
          onClick={onInterest}
          onPointerDown={press}
          style={{
            width:60,height:60,borderRadius:16,
            background: strong ? `${accent}22` : 'transparent',
            cursor:'pointer',
            border: strong ? `2px solid ${accent}` : `1.5px solid ${accent}`,
            transition:'all 200ms ease',
            display:'flex',alignItems:'center',justifyContent:'center',
        }}><Glyph c={accent} size={24}/></button>
        {paid && (
          <span style={{
            position:'absolute',bottom:-13,left:'50%',transform:'translateX(-50%)',
            fontFamily:T.mono,fontSize:8.5,color:T.soft,letterSpacing:1.2,textTransform:'uppercase',
            whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:3,
          }}>удерж. <Set.Strong c={T.soft} size={9}/> 5</span>
        )}
      </div>

      <button onClick={onMessage} title="Написать сообщение" style={{
        width:56,height:56,borderRadius:14,border:'none',
        background:'transparent',cursor:'pointer',
        display:'flex',alignItems:'center',justifyContent:'center',
      }}><IconMessage c={T.mid} size={22}/></button>
    </div>
  );
}

// Backward-compat exports — InterestCTA_X / VeryInterested_X are now embedded within ActionBars,
// but the variant-row card on the canvas needs standalone previews.
function InterestCTA_A({ accent }) { return <div style={{flex:1}}><ActionBarA accent={accent} tier="free"/></div>; }
function InterestCTA_B({ accent }) { return <div style={{flex:1}}><ActionBarB accent={accent} tier="free"/></div>; }
function InterestCTA_C({ accent }) { return <div style={{flex:1}}><ActionBarC accent={accent} tier="free"/></div>; }
function VeryInterested_A({ accent }) { return <div style={{flex:1,fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.2,textAlign:'center',padding:'14px 0'}}>встроено в bar A</div>; }
function VeryInterested_B({ accent }) { return <div style={{flex:1,fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.2,textAlign:'center',padding:'14px 0'}}>встроено в bar B</div>; }
function VeryInterested_C({ accent }) { return <div style={{flex:1,fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.2,textAlign:'center',padding:'14px 0'}}>встроено в bar C</div>; }

// ─── Card hierarchy variants ─────────────────────────────
// Variant A — Editorial: large serif name, photo block, classic hierarchy
function CardHierarchyA({ p = MARINA, accent = T.accent }) {
  return (
    <>
      {/* hero photo block */}
      <div style={{
        height:240, position:'relative',
        background:`linear-gradient(180deg, ${accent}28 0%, ${T.surface} 100%)`,
        borderBottom:`1px solid ${T.divide}`,
        display:'flex',alignItems:'flex-end',padding:18,
      }}>
        <div style={{
          position:'absolute',top:18,left:18,
          width:70,height:70,borderRadius:'50%',overflow:'hidden',
          background:`${accent}22`,border:`2px solid ${accent}`,
          display:'flex',alignItems:'center',justifyContent:'center',
        }}>
          {p.photo
            ? <img src={p.photo} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            : <span style={{fontFamily:T.hand,fontSize:34,color:accent,fontWeight:700}}>{p.name[0]}</span>}
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:T.serif,fontSize:30,fontWeight:700,color:T.ink,lineHeight:1.05,letterSpacing:-0.5}}>
            {p.name} {p.last}
          </div>
          <div style={{fontFamily:T.sans,fontSize:13,color:T.mid,marginTop:4}}>{p.role} · {p.company}</div>
          <div style={{marginTop:8}}><StatusPill accent={accent} text="на Mining Expo · рядом сейчас"/></div>
        </div>
      </div>
      <div style={{padding:'16px 18px 0'}}>
        <CardSection label="о себе">
          <p style={{margin:0,fontFamily:T.body,fontSize:15.5,color:T.mid,lineHeight:1.55}}>{p.bio}</p>
        </CardSection>
        <CardSection label="зачем здесь">
          <div style={{display:'flex',flexDirection:'column',gap:7}}>
            {p.goals.map((g,i)=>(
              <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{width:4,height:4,borderRadius:'50%',background:accent,flexShrink:0,marginTop:9}}/>
                <span style={{fontFamily:T.body,fontSize:15,color:T.ink}}>{g}</span>
              </div>
            ))}
          </div>
        </CardSection>
        <CardSection label="сейчас работаю над">
          <div style={{padding:'10px 13px',borderRadius:11,background:T.hi,border:`1px solid ${T.divide}`}}>
            <span style={{fontFamily:T.body,fontSize:15,color:T.ink}}>«{p.workingOn}»</span>
          </div>
        </CardSection>
        <CardSection label="могу поделиться">
          <GiveChips items={p.give}/>
        </CardSection>
        <CardSection label="хочу разобраться">
          <WantChips items={p.want} accent={accent}/>
        </CardSection>
        <CardSection label="вопросы от меня">
          <div style={{display:'flex',flexDirection:'column',gap:7}}>
            {p.ice.map((q,i)=>(
              <div key={i} style={{
                padding:'10px 13px',borderRadius:11,
                background:`${accent}10`,border:`1px solid ${accent}25`,
              }}>
                <span style={{fontFamily:T.body,fontSize:15,fontStyle:'italic',color:T.ink}}>«{q}»</span>
              </div>
            ))}
          </div>
        </CardSection>
        <div style={{height:96}}/>
      </div>
    </>
  );
}

// Variant B — Compact, info-dense, minimal hero
function CardHierarchyB({ p = MARINA, accent = T.accent, ach, onAchievements, onViewPhotos, expectation }) {
  const photos = personPhotos(p);
  const [viewer, setViewer] = React.useState(false);
  const openPhotos = () => { if (!photos.length) return; if (onViewPhotos) onViewPhotos(photos, `${p.name} ${p.last||''}`); else setViewer(true); };
  return (
    <div style={{padding:'18px 18px calc(132px + var(--sab))',minHeight:'100%',boxSizing:'border-box',
      display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
      <div style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:14}}>
        <button onClick={openPhotos} aria-label="фото" style={{
          position:'relative',width:54,height:54,borderRadius:14,flexShrink:0,overflow:'hidden',padding:0,
          background:`${accent}1A`,border:`1px solid ${accent}40`,cursor: photos.length ? 'pointer' : 'default',
          display:'flex',alignItems:'center',justifyContent:'center',
        }}>
          {p.photo
            ? <img src={p.photo} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            : <span style={{fontFamily:T.hand,fontSize:26,color:accent,fontWeight:700}}>{p.name[0]}</span>}
          {photos.length > 1 && (
            <div style={{position:'absolute',right:3,bottom:3,
              display:'flex',alignItems:'center',gap:3,padding:'2px 5px',borderRadius:7,
              background:'rgba(10,8,5,0.72)'}}>
              <svg width="9" height="9" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="2.5" stroke="#fff" strokeWidth="1.3"/><path d="M2 9.5l3-2.5 3 2 2-1.5 2 2" stroke="#fff" strokeWidth="1.2" fill="none"/></svg>
              <span style={{fontFamily:T.mono,fontSize:8.5,fontWeight:700,color:'#fff',lineHeight:1}}>{photos.length}</span>
            </div>
          )}
        </button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:T.serif,fontSize:22,fontWeight:700,color:T.ink,lineHeight:1.1}}>{p.name} {p.last}</div>
          <div style={{fontFamily:T.sans,fontSize:12.5,color:T.mid,marginTop:2}}>{p.role}</div>
          <div style={{fontFamily:T.sans,fontSize:12,color:T.soft,marginTop:1}}>{p.company}</div>
        </div>
        <AchStrip ach={ach} accent={accent} onOpen={onAchievements} compact/>
      </div>

      <p style={{margin:'0 0 14px',fontFamily:T.body,fontSize:15,color:T.mid,lineHeight:1.5,fontStyle:'italic'}}>
        {p.bio}
      </p>

      {/* «зачем здесь» — один блок: ожидания с входа на событие (если заданы) вместо дубля с целями */}
      {expectation ? (
        <div style={{padding:'11px 13px',borderRadius:12,marginBottom:14,
          background:`${accent}0e`,border:`1px solid ${accent}2e`}}>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={accent} strokeWidth="1.7"/><circle cx="12" cy="12" r="4.5" stroke={accent} strokeWidth="1.7"/><circle cx="12" cy="12" r="1.4" fill={accent}/></svg>
            <span style={{fontFamily:T.mono,fontSize:8.5,color:accent,letterSpacing:1.3,textTransform:'uppercase'}}>зачем здесь</span>
          </div>
          <div style={{fontFamily:T.body,fontSize:14.5,color:T.ink,lineHeight:1.45}}>{expectation}</div>
        </div>
      ) : (
        <CardSection label="зачем здесь">
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            {p.goals.map((g,i)=>(
              <span key={i} style={{fontFamily:T.body,fontSize:14.5,color:T.ink,lineHeight:1.4}}>— {g}</span>
            ))}
          </div>
        </CardSection>
      )}

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
        <div>
          <span style={{fontFamily:T.mono,fontSize:8.5,color:'rgba(120,210,150,0.8)',letterSpacing:1.4,textTransform:'uppercase'}}>могу</span>
          <div style={{marginTop:6}}><GiveChips items={p.give.slice(0,3)}/></div>
        </div>
        <div>
          <span style={{fontFamily:T.mono,fontSize:8.5,color:accent,letterSpacing:1.4,textTransform:'uppercase'}}>хочу</span>
          <div style={{marginTop:6}}><WantChips items={p.want.slice(0,3)} accent={accent}/></div>
        </div>
      </div>

      <CardSection label="спросить можно">
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {p.ice.map((q,i)=>(
            <div key={i} style={{padding:'8px 12px',borderRadius:10,background:`${accent}0E`,border:`1px solid ${accent}22`}}>
              <span style={{fontFamily:T.body,fontSize:14,fontStyle:'italic',color:T.ink}}>«{q}»</span>
            </div>
          ))}
        </div>
      </CardSection>
      <div style={{height:96}}/>
      {viewer && <PhotoViewer photos={photos} name={`${p.name} ${p.last||''}`} accent={accent} onClose={()=>setViewer(false)}/>}
    </div>
  );
}

// Variant C — Conversational / handwritten voice
function CardHierarchyC({ p = MARINA, accent = T.accent }) {
  return (
    <div style={{padding:'22px 20px 0'}}>
      <div style={{textAlign:'center',marginBottom:14}}>
        <div style={{
          width:80,height:80,borderRadius:'50%',
          background:`${accent}1A`,border:`1.5px solid ${accent}50`,
          display:'inline-flex',alignItems:'center',justifyContent:'center',
          marginBottom:10,overflow:'hidden',
        }}>
          {p.photo
            ? <img src={p.photo} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            : <span style={{fontFamily:T.hand,fontSize:42,color:accent,fontWeight:700}}>{p.name[0]}</span>}
        </div>
        <div style={{fontFamily:T.serif,fontSize:24,fontWeight:700,color:T.ink}}>{p.name} {p.last}</div>
        <div style={{fontFamily:T.body,fontSize:14,color:T.mid,marginTop:2,fontStyle:'italic'}}>{p.role} · {p.company}</div>
        <div style={{marginTop:9}}><StatusPill accent={accent} text="на Mining Expo"/></div>
      </div>

      <div style={{
        padding:'14px 16px',borderRadius:14,background:T.hi,
        border:`1px solid ${T.divide}`,marginBottom:16,
        position:'relative',
      }}>
        <span style={{
          position:'absolute',top:-10,left:14,
          fontFamily:T.serif,fontSize:36,color:`${accent}50`,lineHeight:1,
        }}>"</span>
        <p style={{margin:0,fontFamily:T.body,fontSize:16,color:T.ink,lineHeight:1.55,fontStyle:'italic'}}>
          {p.bio}
        </p>
      </div>

      {/* Goals as conversational chips */}
      <div style={{marginBottom:16}}>
        <div style={{fontFamily:T.hand,fontSize:18,color:T.mid,marginBottom:8}}>Я здесь чтобы…</div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {p.goals.map((g,i)=>(
            <div key={i} style={{
              padding:'10px 14px',borderRadius:14,
              background:`${accent}10`,border:`1px solid ${accent}30`,
              display:'flex',gap:10,alignItems:'center',
            }}>
              <span style={{fontFamily:T.serif,fontSize:18,color:accent,fontStyle:'italic'}}>{i+1}.</span>
              <span style={{fontFamily:T.body,fontSize:15,color:T.ink}}>{g}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding:'12px 14px',borderRadius:13,
        background:'rgba(80,180,120,0.08)',
        border:'1px solid rgba(80,180,120,0.22)',
        marginBottom:12,
      }}>
        <div style={{fontFamily:T.hand,fontSize:17,color:'rgba(120,210,150,0.95)',marginBottom:6}}>Могу поделиться:</div>
        <GiveChips items={p.give}/>
      </div>
      <div style={{
        padding:'12px 14px',borderRadius:13,
        background:`${accent}0C`,border:`1px solid ${accent}22`,
        marginBottom:14,
      }}>
        <div style={{fontFamily:T.hand,fontSize:17,color:accent,marginBottom:6}}>Хочу разобраться:</div>
        <WantChips items={p.want} accent={accent}/>
      </div>

      <div style={{marginBottom:14}}>
        <div style={{fontFamily:T.hand,fontSize:18,color:T.mid,marginBottom:8}}>Спроси меня:</div>
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {p.ice.map((q,i)=>(
            <div key={i} style={{
              fontFamily:T.body,fontSize:16,color:T.ink,fontStyle:'italic',
              paddingLeft:14,borderLeft:`2px solid ${accent}55`,
            }}>{q}</div>
          ))}
        </div>
      </div>
      <div style={{height:96}}/>
    </div>
  );
}

// ─── Action bar (sticky bottom) ──────────────────────────
function CardActionBar({ accent = T.accent, ctaVariant = 'A', viVariant = 'A', tier = 'paid', iconSet, onSkip, onInterest, onMessage }) {
  const Bar = ctaVariant === 'B' ? ActionBarB : ctaVariant === 'C' ? ActionBarC : ActionBarA;
  return (
    <div style={{
      position:'absolute',left:0,right:0,bottom:0,
      padding:'14px 16px max(28px, calc(14px + var(--sab)))',
      background:`linear-gradient(to top, ${T.bg} 60%, ${T.bg}f0 85%, transparent)`,
    }}>
      <Bar accent={accent} tier={tier} iconSet={iconSet} onSkip={onSkip} onInterest={onInterest} onVery={onInterest} onMessage={onMessage}/>
      <div style={{textAlign:'center',marginTop:10}}>
        <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.2}}>
          {tier==='paid'
            ? '✕ пропустить · → интересно · ⇉ очень — 5 в неделю'
            : '«очень интересно» — для платного тарифа'}
        </span>
      </div>
    </div>
  );
}

// ─── Composite card screen ───────────────────────────────
function CardScreen({ hierarchy = 'B', ctaVariant = 'A', viVariant = 'C', tier = 'paid', accent = T.accent, iconSet = 'arrow', person, expectation, onBack, onSkip, onInterest, onMessage }) {
  const Hier = hierarchy === 'B' ? CardHierarchyB : hierarchy === 'C' ? CardHierarchyC : CardHierarchyA;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [achOpen, setAchOpen] = React.useState(false);
  const [photoView, setPhotoView] = React.useState(null); // {photos, name} | null
  const personAch = (person && person.ach) || CARD_ACH;
  return (
    <div style={{
      position:'absolute',inset:0,background:T.bg,
      paddingTop:'calc(20px + var(--sat))',
      display:'flex',flexDirection:'column',
    }}>
      {/* Top bar */}
      <div style={{
        padding:'10px 16px 8px',display:'flex',alignItems:'center',justifyContent:'space-between',
        flexShrink:0, position:'relative',zIndex:5,
      }}>
        <button onClick={onBack} style={{
          width:36,height:36,borderRadius:11,border:`1px solid ${T.divide}`,
          background:T.surface,display:'flex',alignItems:'center',justifyContent:'center',
        }}>
          <svg width="7" height="12" viewBox="0 0 7 12"><path d="M6 1L1 6l5 5" stroke={T.soft} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{textAlign:'center'}}>
          <div style={{fontFamily:T.mono,fontSize:8.5,color:T.soft,letterSpacing:1.6,textTransform:'uppercase'}}>карточка · 3 из 18</div>
        </div>
        <button onClick={()=>setMenuOpen(true)} style={{
          width:36,height:36,borderRadius:11,border:`1px solid ${T.divide}`,
          background:T.surface,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
        }}>
          <svg width="14" height="3" viewBox="0 0 14 3"><circle cx="2" cy="1.5" r="1.3" fill={T.soft}/><circle cx="7" cy="1.5" r="1.3" fill={T.soft}/><circle cx="12" cy="1.5" r="1.3" fill={T.soft}/></svg>
        </button>
      </div>

      <div style={{flex:1,overflowY:'auto',position:'relative'}} className="noscroll">
        <Hier accent={accent} p={person} ach={personAch} expectation={expectation ?? (person && person.expectation)} onAchievements={()=>setAchOpen(true)} onViewPhotos={(ph,nm)=>setPhotoView({photos:ph,name:nm})}/>
      </div>

      <CardActionBar accent={accent} ctaVariant={ctaVariant} viVariant={viVariant} tier={tier} iconSet={iconSet} onSkip={onSkip} onInterest={onInterest} onMessage={onMessage}/>

      {menuOpen && (
        <div style={{position:'absolute',inset:0,zIndex:70}} onClick={()=>setMenuOpen(false)}>
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.4)'}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:92,right:14,minWidth:200,
            background:T.sheet,border:`1px solid ${T.divide}`,borderRadius:14,overflow:'hidden',
            boxShadow:'0 16px 40px rgba(0,0,0,0.6)'}}>
            {[
              {t:'Поделиться карточкой', act:()=>setMenuOpen(false)},
              {t:'Скрыть из выдачи', act:()=>{ setMenuOpen(false); onSkip && onSkip(); }},
              {t:'Пожаловаться', danger:true, act:()=>setMenuOpen(false)},
            ].map((o,i)=>(
              <button key={i} onClick={o.act} style={{width:'100%',textAlign:'left',padding:'12px 15px',border:'none',
                borderTop: i===0?'none':`1px solid ${T.divide2}`,background:'transparent',cursor:'pointer',
                fontFamily:T.sans,fontSize:14,color: o.danger?'#E0674A':T.ink}}>{o.t}</button>
            ))}
          </div>
        </div>
      )}

      {achOpen && (
        <AchievementsPanel ach={personAch} person={person || MARINA} accent={accent} onClose={()=>setAchOpen(false)}/>
      )}

      {photoView && (
        <PhotoViewer photos={photoView.photos} name={photoView.name} accent={accent} onClose={()=>setPhotoView(null)}/>
      )}
    </div>
  );
}

window.CardScreen = CardScreen;
window.IconSets = IconSets;
window.IconSkip = IconSkip;
window.IconMessage = IconMessage;
window.ActionBarA = ActionBarA;
window.ActionBarB = ActionBarB;
window.ActionBarC = ActionBarC;
window.InterestCTA_A = InterestCTA_A;
window.InterestCTA_B = InterestCTA_B;
window.InterestCTA_C = InterestCTA_C;
window.VeryInterested_A = VeryInterested_A;
window.VeryInterested_B = VeryInterested_B;
window.VeryInterested_C = VeryInterested_C;
window.CardHierarchyA = CardHierarchyA;
window.CardHierarchyB = CardHierarchyB;
window.CardHierarchyC = CardHierarchyC;
