// Global bottom tab bar — shared across all Core Flow screens
const { T: Tt } = window;

function TabIcon({ kind, active, c }) {
  const stroke = c;
  const fill = active ? c : 'none';
  const sw = 1.7;
  if (kind === 'discover') {
    // overlapping circles — поиск (карта+свайп)
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="12" r="5.5" stroke={stroke} strokeWidth={sw} fill={active?`${c}22`:'none'}/>
        <circle cx="15" cy="12" r="5.5" stroke={stroke} strokeWidth={sw} fill={active?`${c}22`:'none'}/>
        {active && <circle cx="12" cy="12" r="1.2" fill={c}/>}
      </svg>
    );
  }
  if (kind === 'inbox') {
    // входящие заявки — двое силуэтов
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8.5" r="3.2" stroke={stroke} strokeWidth={sw} fill={active?`${c}22`:'none'}/>
        <path d="M3 19.5 Q3 14.5 9 14.5 Q15 14.5 15 19.5" stroke={stroke} strokeWidth={sw} fill={active?`${c}22`:'none'} strokeLinecap="round"/>
        <circle cx="16.5" cy="7" r="2.6" stroke={stroke} strokeWidth={sw} fill={active?`${c}22`:'none'}/>
        <path d="M14.5 12.5 Q16.5 12 18 12.3 Q21.5 13 21.5 16.5 L21.5 17.5"
              stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round"/>
      </svg>
    );
  }
  if (kind === 'chats') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M4.5 6.5 Q4.5 4.5 6.5 4.5 L17.5 4.5 Q19.5 4.5 19.5 6.5 L19.5 14.5 Q19.5 16.5 17.5 16.5 L10 16.5 L6.5 19.8 L6.5 16.5 Q4.5 16.5 4.5 14.5 Z"
              stroke={stroke} strokeWidth={sw} fill={active?`${c}22`:'none'} strokeLinejoin="round"/>
        <circle cx="9"  cy="10.5" r="0.9" fill={stroke}/>
        <circle cx="12" cy="10.5" r="0.9" fill={stroke}/>
        <circle cx="15" cy="10.5" r="0.9" fill={stroke}/>
      </svg>
    );
  }
  if (kind === 'me') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="3.8" stroke={stroke} strokeWidth={sw} fill={active?`${c}22`:'none'}/>
        <path d="M5 20 Q5 14.5 12 14.5 Q19 14.5 19 20" stroke={stroke} strokeWidth={sw} fill={active?`${c}22`:'none'} strokeLinecap="round"/>
      </svg>
    );
  }
}

function TabBar({ active = 'discover', accent = Tt.accent, badges = {}, onChange, variant = 'default' }) {
  const items = [
    { id:'discover', label:'Поиск',   kind:'discover' },
    { id:'inbox',    label:'Заявки',  kind:'inbox'    },
    { id:'chats',    label:'Чаты',    kind:'chats'    },
    { id:'me',       label:'Я',       kind:'me'       },
  ];

  // ─── Variant: capsule (floating, icons-only, pill on active) ─────
  if (variant === 'capsule') {
    return (
      <div style={{
        position:'absolute', left:'50%', bottom:18, transform:'translateX(-50%)',
        padding:'8px 10px',
        borderRadius:28,
        background:T.glass,
        backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
        border:`1px solid ${Tt.divide}`,
        boxShadow:'0 14px 36px rgba(0,0,0,0.55)',
        display:'flex', alignItems:'center', gap:6,
        zIndex:30,
      }}>
        {items.map(it => {
          const isActive = it.id === active;
          const c = isActive ? '#fff' : Tt.soft;
          const badge = badges[it.id];
          return (
            <button key={it.id} onClick={() => onChange && onChange(it.id)} aria-label={it.label}
              style={{
                background: isActive ? accent : 'transparent',
                border:'none', cursor: onChange ? 'pointer' : 'default',
                width:42, height:42, borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                position:'relative',
                boxShadow: isActive ? `0 0 0 3px rgba(255,88,32,0.18)` : 'none',
                transition:'background 0.18s',
              }}>
              <TabIcon kind={it.kind} active={isActive} c={c}/>
              {badge ? (
                <div style={{
                  position:'absolute', top:0, right:0,
                  minWidth:14, height:14, padding:'0 3px',
                  borderRadius:7, background: isActive ? '#fff' : accent,
                  color: isActive ? accent : '#fff',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:Tt.mono, fontSize:9, fontWeight:700,
                  boxShadow:`0 0 0 2px ${Tt.glass}`,
                }}>{badge}</div>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  }

  // ─── Variant: FAB-center (icons-only, FAB toggles map ↔ swipe) ──
  if (variant === 'fab') {
    const discoverMode = arguments[0].discoverMode || 'map';
    const onDiscoverToggle = arguments[0].onDiscoverToggle;
    const isMap = discoverMode === 'map';

    const SideBtn = ({ it }) => {
      const isActive = it.id === active;
      const c = isActive ? accent : Tt.soft;
      const badge = badges[it.id];
      return (
        <button key={it.id} onClick={() => onChange && onChange(it.id)} aria-label={it.label} style={{
          background:'transparent', border:'none', cursor: onChange ? 'pointer' : 'default',
          padding:'8px 14px',
          display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative', flex:1,
        }}>
          <div style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <TabIcon kind={it.kind} active={isActive} c={c}/>
            {badge ? (
              <div style={{
                position:'absolute', top:-4, right:-8,
                minWidth:16, height:16, padding:'0 4px',
                borderRadius:8, background:accent,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:Tt.mono, fontSize:9.5, fontWeight:700, color:'#fff',
                boxShadow:`0 0 0 2px ${Tt.glass}`,
              }}>{badge}</div>
            ) : null}
            {isActive && (
              <div style={{
                position:'absolute', bottom:-12, left:'50%', transform:'translateX(-50%)',
                width:4, height:4, borderRadius:'50%', background:accent,
              }}/>
            )}
          </div>
        </button>
      );
    };

    return (
      <div style={{
        position:'absolute', left:0, right:0, bottom:0,
        paddingTop:14, paddingBottom:'var(--tbb, max(26px, calc(12px + var(--sab))))',
        background:T.glassHi,
        backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
        borderTop:`1px solid ${Tt.divide}`,
        display:'flex', alignItems:'center',
        zIndex:60,
      }}>
        <SideBtn it={{id:'inbox', label:'Заявки', kind:'inbox'}}/>
        <SideBtn it={{id:'chats', label:'Чаты',   kind:'chats'}}/>

        {/* Accent FAB — toggles map ↔ swipe */}
        <div style={{flex:'0 0 78px', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <button onClick={onDiscoverToggle} aria-label={isMap ? 'переключить на свайп' : 'переключить на карту'} style={{
            width:62, height:62, borderRadius:'50%', border:'none', cursor:'pointer',
            background:`linear-gradient(140deg, ${accent} 0%, ${accent}d8 100%)`,
            boxShadow:`0 10px 24px rgba(255,88,32,0.45), 0 0 0 4px ${Tt.glass}, 0 0 0 5px ${accent}40`,
            display:'flex', alignItems:'center', justifyContent:'center',
            marginTop:-30, position:'relative',
            transition:'transform 0.22s',
          }}>
            {/* current-mode icon */}
            <div key={discoverMode} style={{
              animation:'fabSwap 0.32s ease-out',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {isMap ? (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M3 8 L10 5.5 L18 8 L25 5.5 L25 22 L18 24.5 L10 22 L3 24.5 Z"
                        stroke="#fff" strokeWidth="1.8" fill="rgba(255,255,255,0.12)" strokeLinejoin="round"/>
                  <line x1="10" y1="5.5" x2="10" y2="22" stroke="#fff" strokeWidth="1.4" opacity="0.7"/>
                  <line x1="18" y1="8"   x2="18" y2="24.5" stroke="#fff" strokeWidth="1.4" opacity="0.7"/>
                  <circle cx="14" cy="13.5" r="2.2" fill="#fff"/>
                </svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <rect x="5" y="3" width="13" height="16" rx="2.5" stroke="#fff" strokeWidth="1.8" transform="rotate(-8 11.5 11)" fill="none"/>
                  <rect x="8" y="6" width="13" height="16" rx="2.5" stroke="#fff" strokeWidth="1.8" transform="rotate(8 14.5 14)" fill="rgba(255,255,255,0.14)"/>
                </svg>
              )}
            </div>

            {/* next-state hint pip */}
            <div style={{
              position:'absolute', bottom:-3, right:-3,
              width:22, height:22, borderRadius:'50%',
              background:'#fff', border:`2px solid ${accent}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 2px 6px rgba(0,0,0,0.4)',
            }}>
              {isMap ? (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <rect x="1.8" y="2.6" width="5.8" height="7.6" rx="1.4" stroke={accent} strokeWidth="1.3" fill="none"/>
                  <path d="M4.6 1.6h4a1.6 1.6 0 0 1 1.6 1.6v5" stroke={accent} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M1.5 3.4 L4.4 2.2 L7.6 3.4 L10.5 2.2 V8.6 L7.6 9.8 L4.4 8.6 L1.5 9.8 Z"
                        stroke={accent} strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                  <path d="M4.4 2.2v6.4M7.6 3.4v6.4" stroke={accent} strokeWidth="1" opacity="0.75"/>
                </svg>
              )}
            </div>
          </button>
        </div>

        <SideBtn it={{id:'me', label:'Я', kind:'me'}}/>

        <style>{`@keyframes fabSwap { from { opacity:0; transform:scale(0.7) rotate(-12deg); } to { opacity:1; transform:none; } }`}</style>
      </div>
    );
  }

  // ─── Variant: shelf (CTA card + small icons on sides) ────────────
  if (variant === 'shelf') {
    return (
      <div style={{
        position:'absolute', left:0, right:0, bottom:0,
        padding:'10px 14px 22px',
        background:T.glassHi,
        backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
        borderTop:`1px solid ${Tt.divide}`,
        display:'flex', alignItems:'center', gap:10,
        zIndex:30,
      }}>
        {/* left: discover icon */}
        <button onClick={() => onChange && onChange('discover')} style={{
          background: active==='discover' ? `${accent}1f` : 'transparent',
          border: active==='discover' ? `1px solid ${accent}55` : `1px solid ${Tt.divide}`,
          width:44, height:44, borderRadius:13, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <TabIcon kind="discover" active={active==='discover'} c={active==='discover'?accent:Tt.soft}/>
        </button>
        {/* CTA card — current opportunity */}
        <button onClick={() => onChange && onChange('discover')} style={{
          flex:1, padding:'9px 12px', borderRadius:14,
          background:`linear-gradient(135deg, ${accent} 0%, ${accent}d0 100%)`,
          border:'none', cursor:'pointer', textAlign:'left',
          display:'flex', alignItems:'center', gap:10,
          boxShadow:`0 6px 18px rgba(255,88,32,0.32)`,
        }}>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontFamily:Tt.mono, fontSize:8.5, color:'rgba(255,255,255,0.78)', letterSpacing:1.4, textTransform:'uppercase', lineHeight:1}}>сейчас рядом</div>
            <div style={{fontFamily:Tt.serif, fontSize:14, fontWeight:700, color:'#fff', lineHeight:1.2, marginTop:3}}>18 совместимых · смотреть</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8M7 3l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        </button>
        {/* right: chats with badge */}
        <button onClick={() => onChange && onChange('chats')} style={{
          background: active==='chats' ? `${accent}1f` : 'transparent',
          border: active==='chats' ? `1px solid ${accent}55` : `1px solid ${Tt.divide}`,
          width:44, height:44, borderRadius:13, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          position:'relative',
        }}>
          <TabIcon kind="chats" active={active==='chats'} c={active==='chats'?accent:Tt.soft}/>
          {(badges.chats || badges.inbox) ? (
            <div style={{
              position:'absolute', top:4, right:4,
              minWidth:15, height:15, padding:'0 3px',
              borderRadius:7.5, background:accent,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:Tt.mono, fontSize:9, fontWeight:700, color:'#fff',
              boxShadow:`0 0 0 2px ${Tt.glass}`,
            }}>{(badges.chats||0)+(badges.inbox||0)}</div>
          ) : null}
        </button>
      </div>
    );
  }

  // ─── Default (current) ──────────────────────────────────────────
  return (
    <div style={{
      position:'absolute', left:0, right:0, bottom:0,
      paddingTop:10, paddingBottom:'var(--tbb, max(24px, calc(10px + var(--sab))))',
      background:T.glassHi,
      backdropFilter:'blur(14px)',
      WebkitBackdropFilter:'blur(14px)',
      borderTop:`1px solid ${Tt.divide}`,
      display:'flex', alignItems:'center', justifyContent:'space-around',
      zIndex:30,
    }}>
      {items.map(it => {
        const isActive = it.id === active;
        const c = isActive ? accent : Tt.soft;
        const badge = badges[it.id];
        return (
          <button
            key={it.id}
            onClick={() => onChange && onChange(it.id)}
            style={{
              background:'transparent', border:'none', cursor: onChange ? 'pointer' : 'default',
              padding:'4px 10px',
              display:'flex', flexDirection:'column', alignItems:'center', gap:3,
              position:'relative',
              minWidth:54,
            }}
          >
            <div style={{position:'relative'}}>
              <TabIcon kind={it.kind} active={isActive} c={c}/>
              {badge ? (
                <div style={{
                  position:'absolute', top:-3, right:-7,
                  minWidth:16, height:16, padding:'0 4px',
                  borderRadius:8, background:accent,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:Tt.mono, fontSize:9.5, fontWeight:700, color:'#fff',
                  boxShadow:`0 0 0 2px ${Tt.glass}`,
                  letterSpacing:0,
                }}>{badge}</div>
              ) : null}
            </div>
            <div style={{
              fontFamily:Tt.sans, fontSize:10.5, fontWeight: isActive ? 600 : 500,
              color: c, letterSpacing:0.1,
            }}>{it.label}</div>
          </button>
        );
      })}
    </div>
  );
}

window.TabBar = TabBar;
