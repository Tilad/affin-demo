// Screen 1: Map of event — two dark-map variants
// Variant A: Topographic / contour lines
// Variant B: Soft "safe zones" with gradient blobs

const { T, PEOPLE } = window;

// ─── Shared map chrome ───────────────────────────────────
// style: 'context' (A) — single row: avatar + place + filters
//        'layered' (C) — context row + scrollable filter-chips row below
function MapHeader({ accent = T.accent, style = 'context', onFilters, visible: visibleProp, onToggleVisible, onEventTap, selfPlaced = false, onAddSelf, onQr, myCard }) {
  const place = { name: 'Депо', when: 'сегодня' };

  const surface = {
    background:T.glass,
    backdropFilter:'blur(14px)',
    WebkitBackdropFilter:'blur(14px)',
    border:`1px solid ${T.divide}`,
  };

  const StatusAvatar = (
    <button
      onClick={onAddSelf}
      aria-label={selfPlaced ? 'переставить метку' : 'добавить себя на карту'}
      style={{
        border:'none', background:'transparent', padding:0,
        cursor:'pointer',
        display:'flex', alignItems:'center', gap:8,
        flexShrink:0, minWidth:0,
      }}
    >
      {selfPlaced ? (
        <>
          <div style={{width:32, height:32, borderRadius:'50%', overflow:'hidden', flexShrink:0,
            border:`1.5px solid ${accent}`}}>
            <img src={__R('self5','https://i.pravatar.cc/120?img=5')} alt="я" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start', gap:1, lineHeight:1, minWidth:0}}>
            <span style={{fontFamily:T.mono, fontSize:8, color:T.soft, letterSpacing:1, textTransform:'uppercase'}}>ты на карте</span>
            <span style={{fontFamily:T.sans, fontSize:11.5, color:T.ink, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:110}}>{myCard ? myCard.title : 'моя карточка'}</span>
          </div>
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M9 16.5C9 16.5 15 11.5 15 7.5a6 6 0 1 0-12 0C3 11.5 9 16.5 9 16.5z" stroke={accent} strokeWidth="1.6" fill="none"/>
            <path d="M9 5.5v4M7 7.5h4" stroke={accent} strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span style={{fontFamily:T.sans, fontSize:13.5, fontWeight:600, color:T.ink, whiteSpace:'nowrap'}}>На карту</span>
        </>
      )}
    </button>
  );

  const FiltersBtn = (
    <div style={{
      ...surface,
      height:40, padding:'0 4px 0 12px', borderRadius:20,
      display:'flex', alignItems:'center', gap:8,
      flexShrink:0, minWidth:0,
    }}>
      {/* event — tap flies to it */}
      <button
        onClick={onEventTap}
        aria-label="к событию"
        style={{
          border:'none', background:'transparent', padding:0,
          cursor: onEventTap ? 'pointer' : 'default',
          display:'flex', alignItems:'center', gap:6, minWidth:0,
        }}
      >
        <span style={{fontFamily:T.serif, fontSize:12.5, fontWeight:700, color:T.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>Mining Expo</span>
        <div style={{width:6, height:6, borderRadius:'50%', background:'#3FB87C', boxShadow:'0 0 5px rgba(63,184,124,0.9)', flexShrink:0}}/>
      </button>

      {/* divider */}
      <div style={{width:1, height:20, background:T.divide, flexShrink:0}}/>

      {/* filters */}
      <button onClick={onFilters} aria-label="фильтры" style={{
        border:'none', background:'transparent', cursor:'pointer',
        width:32, height:32, borderRadius:12,
        display:'flex', alignItems:'center', justifyContent:'center',
        position:'relative', flexShrink:0, padding:0,
      }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M1 3h13M3 7.5h9M5 12h5" stroke={T.ink} strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <div style={{
          position:'absolute', top:-1, right:-1,
          minWidth:15, height:15, padding:'0 3px', borderRadius:7.5,
          background:accent, color:'#fff',
          fontFamily:T.mono, fontSize:9, fontWeight:700,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`0 0 0 2px ${T.canvas}`,
        }}>2</div>
      </button>
    </div>
  );

  const chips = [
    {label:'20–30',  active:true},
    {label:'ж',      active:true},
    {label:'#театр', active:false},
    {label:'#книги', active:false},
    {label:'#бег',   active:false},
  ];

  return (
    <div style={{position:'absolute', top:14, left:0, right:0, zIndex:10}}>
      <div style={{padding:'8px 14px', display:'flex', alignItems:'center', gap:8}}>
        {/* одна пилюля: «На карту | QR» — зеркально правой «событие | фильтр» */}
        <div style={{
          ...surface,
          height:40, padding: selfPlaced ? '0 4px' : '0 4px 0 14px', borderRadius:20,
          display:'flex', alignItems:'center', gap:8,
          flexShrink:0, minWidth:0,
        }}>
          {StatusAvatar}
          <div style={{width:1, height:20, background:T.divide, flexShrink:0}}/>
          <button onClick={onQr} aria-label="мой QR и сканер" style={{
            border:'none', background:'transparent', cursor:'pointer',
            width:32, height:32, borderRadius:12, padding:0, flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <path d="M14 14h3v3M21 14v7h-7"/>
            </svg>
          </button>
        </div>
        <div style={{flex:1}}/>
        {FiltersBtn}
      </div>

      {style === 'layered' && (
        <div style={{
          display:'flex', gap:6, padding:'4px 14px 0',
          overflowX:'auto', scrollbarWidth:'none',
        }}>
          <style>{`.fchips::-webkit-scrollbar{display:none}`}</style>
          <div className="fchips" style={{display:'flex', gap:6, paddingBottom:2}}>
            {chips.map(c => (
              <div key={c.label} style={{
                display:'flex', alignItems:'center', gap:5,
                padding:'4px 9px', borderRadius:9,
                background: c.active ? `${accent}22` : T.glassSoft,
                backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
                border: c.active ? `1px solid ${accent}55` : `1px solid ${T.divide2}`,
                whiteSpace:'nowrap', flexShrink:0,
              }}>
                <span style={{fontFamily:T.mono, fontSize:10, fontWeight:500, color: c.active ? accent : T.mid, letterSpacing:0.3}}>{c.label}</span>
                {c.active ? (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 1.5 L6.5 6.5 M6.5 1.5 L1.5 6.5" stroke={accent} strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M4 1.5 L4 6.5 M1.5 4 L6.5 4" stroke={T.soft} strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Compatibility slider (bottom, collapsible) ──────────
function CompatibilitySlider({ value = 65, count = 18, accent = T.accent, onChange, hidden = false }) {
  const [open, setOpen] = React.useState(true);
  const pct = value;

  if (hidden) return null;

  if (!open) {
    // Collapsed: a slim pill with progress underline + count + expand chevron
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position:'absolute', left:14, right:14, bottom:18, zIndex:10,
          padding:'9px 14px',
          borderRadius:14,
          background:T.glass,
          backdropFilter:'blur(14px)',
          border:`1px solid ${T.divide}`,
          display:'flex', alignItems:'center', gap:10,
          cursor:'pointer', overflow:'hidden', textAlign:'left',
        }}
      >
        <div style={{display:'flex',alignItems:'baseline',gap:4,minWidth:0}}>
          <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.2,textTransform:'uppercase'}}>от</span>
          <span style={{fontFamily:T.serif,fontSize:15,fontWeight:700,color:T.ink,lineHeight:1}}>{value}%</span>
        </div>
        <div style={{
          flex:1, height:3, borderRadius:2, background:T.hi, position:'relative', overflow:'hidden',
        }}>
          <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${pct}%`,background:accent,borderRadius:2}}/>
        </div>
        <div style={{display:'flex',alignItems:'baseline',gap:3}}>
          <span style={{fontFamily:T.serif,fontSize:15,fontWeight:700,color:accent,lineHeight:1}}>{count}</span>
          <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.2,textTransform:'uppercase'}}>в рад.</span>
        </div>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{flexShrink:0}}>
          <path d="M2 4 L5 1.5 L8 4" stroke={T.mid} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {/* privacy chip pinned above pill */}
        <div style={{
          position:'absolute', left:'50%', top:-12, transform:'translate(-50%,-100%)',
          display:'flex', alignItems:'center', gap:5,
          padding:'4px 9px', borderRadius:9,
          background:T.glassSoft, backdropFilter:'blur(8px)',
          border:`1px solid ${T.divide2}`,
          whiteSpace:'nowrap', pointerEvents:'none',
        }}>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <circle cx="4.5" cy="4.5" r="3.5" stroke={T.soft} strokeWidth="1"/>
            <path d="M4.5 4v2M4.5 3v0.3" stroke={T.soft} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span style={{fontFamily:T.mono,fontSize:8.5,color:T.soft,letterSpacing:0.6}}>точное гео скрыто</span>
        </div>
      </button>
    );
  }

  return (
    <div style={{
      position:'absolute', left:14, right:14, bottom:18, zIndex:10,
      padding:'14px 16px',
      borderRadius:18,
      background:T.glass,
      backdropFilter:'blur(14px)',
      border:`1px solid ${T.divide}`,
    }}>
      {/* collapse chevron */}
      <button
        onClick={() => setOpen(false)}
        aria-label="свернуть"
        style={{
          position:'absolute', top:8, right:8,
          width:24, height:24, borderRadius:8, border:'none',
          background:'transparent', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
          <path d="M2 3.5 L5 6 L8 3.5" stroke={T.soft} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:9,paddingRight:24}}>
        <div>
          <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.4,textTransform:'uppercase'}}>совместимость от</span>
          <div style={{display:'flex',alignItems:'baseline',gap:4,marginTop:2}}>
            <span style={{fontFamily:T.serif,fontSize:22,fontWeight:700,color:T.ink,lineHeight:1}}>{value}</span>
            <span style={{fontFamily:T.serif,fontSize:14,color:T.mid}}>%</span>
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.4,textTransform:'uppercase'}}>в радиусе</span>
          <div style={{display:'flex',alignItems:'baseline',gap:4,marginTop:2,justifyContent:'flex-end'}}>
            <span style={{fontFamily:T.serif,fontSize:22,fontWeight:700,color:accent,lineHeight:1}}>{count}</span>
            <span style={{fontFamily:T.body,fontSize:13,color:T.mid}}>{count === 1 ? 'человек' : 'людей'}</span>
          </div>
        </div>
      </div>

      <div style={{position:'relative',height:24,display:'flex',alignItems:'center'}}>
        <div style={{position:'absolute',left:0,right:0,height:3,borderRadius:2,background:T.hi,overflow:'hidden'}}>
          <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${pct}%`,background:accent,borderRadius:2}}/>
        </div>
        {/* tick marks */}
        {[0,25,50,75,100].map(p=>(
          <div key={p} style={{
            position:'absolute', left:`${p}%`, top:'50%',
            transform:'translate(-50%,-50%)',
            width: p === pct ? 0 : 1, height: 6,
            background: p <= pct ? `${accent}60` : T.divide,
          }}/>
        ))}
        <input
          type="range" min="0" max="100" value={value}
          onChange={e => onChange && onChange(+e.target.value)}
          style={{
            position:'absolute', left:0, right:0, width:'100%',
            opacity:0, height:24, cursor:'pointer', margin:0,
          }}
        />
        <div style={{
          position:'absolute', left:`${pct}%`, top:'50%',
          transform:'translate(-50%,-50%)',
          width:18, height:18, borderRadius:'50%',
          background:accent,
          boxShadow:`0 0 0 4px rgba(255,88,32,0.18), 0 4px 12px rgba(255,88,32,0.5)`,
          pointerEvents:'none',
        }}/>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',marginTop:7}}>
        <span style={{fontFamily:T.mono,fontSize:8.5,color:T.soft,letterSpacing:1}}>0%</span>
        <span style={{fontFamily:T.mono,fontSize:8.5,color:T.soft,letterSpacing:1}}>100%</span>
      </div>

      {/* privacy hint pinned to top of slider card */}
      <div style={{
        position:'absolute', left:'50%', top:-12, transform:'translate(-50%,-100%)',
        display:'flex', alignItems:'center', gap:5,
        padding:'4px 9px', borderRadius:9,
        background:T.glassSoft, backdropFilter:'blur(8px)',
        border:`1px solid ${T.divide2}`,
        whiteSpace:'nowrap',
      }}>
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <circle cx="4.5" cy="4.5" r="3.5" stroke={T.soft} strokeWidth="1"/>
          <path d="M4.5 4v2M4.5 3v0.3" stroke={T.soft} strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span style={{fontFamily:T.mono,fontSize:8.5,color:T.soft,letterSpacing:0.6}}>точное гео скрыто</span>
      </div>
    </div>
  );
}

// ─── Bottom toolbar ──────────────────────────────────────
function MapToolbar({ mode = 'map', onMode, onFilters, accent = T.accent }) {
  return (
    <div style={{
      position:'absolute', left:14, right:14, bottom:54, zIndex:10,
      display:'flex', alignItems:'center', gap:10,
    }}>
      {/* mode toggle */}
      <div style={{
        display:'flex', padding:3, borderRadius:14,
        background:T.glass, backdropFilter:'blur(14px)',
        border:`1px solid ${T.divide}`,
      }}>
        {[
          {k:'map',label:'карта',icon:(c)=>(<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 3l4-1.5 3 1.5 4-1.5v8.5L8 11.5 5 10 1 11.5V3z" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/><path d="M5 1.5v8.5M8 3v8.5" stroke={c} strokeWidth="1.3"/></svg>)},
          {k:'swipe',label:'свайп',icon:(c)=>(<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="1.5" width="9" height="10" rx="1.5" stroke={c} strokeWidth="1.3"/><path d="M4 5h5M4 7h3" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>)},
        ].map(b=>{
          const on = mode === b.k;
          return (
            <button key={b.k} onClick={()=>onMode&&onMode(b.k)} style={{
              display:'flex',alignItems:'center',gap:5,
              padding:'7px 12px',borderRadius:11,border:'none',
              background: on ? accent : 'transparent',
              cursor:'pointer',
            }}>
              {b.icon(on ? '#fff' : T.mid)}
              <span style={{fontFamily:T.sans,fontSize:12,fontWeight:on?600:500,color:on?'#fff':T.mid}}>{b.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{flex:1}}/>

      <button onClick={onFilters} style={{
        display:'flex',alignItems:'center',gap:6,
        padding:'10px 14px',borderRadius:14,border:'none',
        background:T.glass, backdropFilter:'blur(14px)',
        outline:`1px solid ${T.divide}`,cursor:'pointer',
      }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 2h10M3 6h6M5 10h2" stroke={T.mid} strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <span style={{fontFamily:T.sans,fontSize:12,fontWeight:500,color:T.mid}}>Фильтры</span>
        <span style={{
          padding:'1px 6px',borderRadius:8,fontFamily:T.mono,fontSize:9,
          background:`${accent}25`,color:accent,
        }}>2</span>
      </button>
    </div>
  );
}

// ─── Privacy disclaimer (now pinned inside CompatibilitySlider) ───
function PrivacyHint() { return null; }

// ─── Filter chips preview ────────────────────────────────
function FilterChips({ chips = ['Дизайн · продукт', 'Сейчас на месте'], accent = T.accent }) {
  return (
    <div style={{
      position:'absolute', top:108, left:14, right:14, zIndex:9,
      display:'flex', gap:6, alignItems:'center', flexWrap:'wrap',
    }}>
      {chips.map((c,i)=>(
        <div key={i} style={{
          display:'flex', alignItems:'center', gap:5,
          padding:'4px 9px', borderRadius:8,
          background:T.glassSoft, backdropFilter:'blur(10px)',
          border:`1px solid ${accent}30`,
        }}>
          <span style={{fontFamily:T.mono,fontSize:9,color:T.ink,letterSpacing:0.4}}>{c}</span>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M2 2 L6 6 M6 2 L2 6" stroke={T.soft} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
      ))}
    </div>
  );
}

// ─── Recenter FAB ────────────────────────────────────────
// QR-шит: «Сканировать» (карточка человека, стенд, регистрация) и «Поделиться» —
// карусель своих карточек: слайд = название + QR, свайпаются вместе.
function QRShareSheet({ accent = T.accent, onClose, onScanned }) {
  const cards = window.MY_CARDS || [];
  const [mode, setMode] = React.useState('scan');   // scan | share
  const [idx, setIdx] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const QR = window.StylizedQR;
  const card = cards[idx] || cards[0];
  const link = `affin.app/c/marina-${card ? card.id : 'c1'}`;
  const copy = () => {
    try { navigator.clipboard && navigator.clipboard.writeText('https://' + link); } catch(e) {}
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };
  const onSlide = (e) => {
    const el = e.target;
    const i = Math.max(0, Math.min(cards.length - 1, Math.round(el.scrollLeft / el.clientWidth)));
    if (i !== idx) { setIdx(i); setCopied(false); }
  };

  return (
    <div style={{position:'absolute', inset:0, zIndex:55, animation:'fadeIn 0.2s ease-out'}}>
      <div onClick={onClose} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.5)'}}/>
      <div style={{
        position:'absolute', left:0, right:0, bottom:0,
        background:T.sheet, borderTop:`1px solid ${T.divide}`,
        borderRadius:'22px 22px 0 0', boxShadow:'0 -16px 48px rgba(0,0,0,0.6)',
        padding:'14px 18px 26px',
        animation:'sheetUp 0.32s cubic-bezier(0.2,0.9,0.3,1)',
      }}>
        <div style={{width:36, height:4, borderRadius:2, background:T.divide, margin:'0 auto 12px'}}/>

        {/* сегмент-переключатель */}
        <div style={{display:'flex', gap:4, padding:4, borderRadius:14, background:T.hi}}>
          {[['scan','Сканировать'],['share','Поделиться']].map(([k, label]) => (
            <button key={k} onClick={() => setMode(k)} style={{
              flex:1, padding:'9px 0', borderRadius:11, border:'none', cursor:'pointer',
              background: mode === k ? T.surface : 'transparent',
              boxShadow: mode === k ? '0 2px 8px rgba(0,0,0,0.35)' : 'none',
              fontFamily:T.sans, fontSize:13.5, fontWeight:600,
              color: mode === k ? T.ink : T.soft,
            }}>{label}</button>
          ))}
        </div>

        {mode === 'share' ? (
          <div style={{textAlign:'center'}}>
            {/* карусель карточек: слайд = название + QR */}
            <div className="noscroll" onScroll={onSlide} style={{
              display:'flex', overflowX:'auto', scrollSnapType:'x mandatory',
              margin:'12px -18px 0',
            }}>
              {cards.map(c => (
                <div key={c.id} style={{
                  flex:'0 0 100%', scrollSnapAlign:'center',
                  display:'flex', flexDirection:'column', alignItems:'center', padding:'2px 18px 0',
                }}>
                  <div style={{fontFamily:T.serif, fontSize:19, fontWeight:700, color:T.ink, fontStyle:'italic'}}>{c.title}</div>
                  <div style={{fontFamily:T.mono, fontSize:8.5, color:T.soft, letterSpacing:1.4, textTransform:'uppercase', marginTop:3}}>{c.context}</div>
                  <div style={{marginTop:12}}>
                    {QR ? <QR accent={accent} size={182}/> : <div style={{width:182, height:182, borderRadius:16, background:T.hi}}/>}
                  </div>
                </div>
              ))}
            </div>

            {/* точки-индикатор */}
            <div style={{display:'flex', gap:5, justifyContent:'center', marginTop:10}}>
              {cards.map((c, i) => (
                <div key={c.id} style={{
                  width: i === idx ? 18 : 6, height:6, borderRadius:3,
                  background: i === idx ? accent : T.hi, transition:'width 0.25s, background 0.25s',
                }}/>
              ))}
            </div>

            <div style={{marginTop:10, fontFamily:T.body, fontSize:13, color:T.mid, fontStyle:'italic'}}>
              покажи собеседнику — он попадёт на эту карточку в своём Affin
            </div>
            <button onClick={copy} style={{
              marginTop:10, padding:'10px 18px', borderRadius:12, cursor:'pointer',
              border:`1px solid ${copied ? 'rgba(63,184,124,0.5)' : T.divide}`,
              background: copied ? 'rgba(63,184,124,0.12)' : T.surface,
              fontFamily:T.mono, fontSize:11, letterSpacing:0.5,
              color: copied ? '#3FB87C' : T.ink,
            }}>{copied ? 'скопировано ✓' : link + '  ·  копировать'}</button>
          </div>
        ) : (
          <div style={{textAlign:'center'}}>
            {/* видоискатель: тап — симуляция скана в прототипе */}
            <div onClick={() => { onClose(); onScanned && onScanned(); }} style={{
              position:'relative', width:210, height:210, margin:'18px auto 0', cursor:'pointer',
              background:'radial-gradient(ellipse at 50% 40%, #2A241A 0%, #14100A 80%)', borderRadius:18,
            }}>
              {[[0,0,0],[1,0,90],[1,1,180],[0,1,270]].map(([rx, ry, rot], i) => (
                <svg key={i} width="30" height="30" viewBox="0 0 34 34" style={{
                  position:'absolute', left: rx ? 'auto' : 8, right: rx ? 8 : 'auto',
                  top: ry ? 'auto' : 8, bottom: ry ? 8 : 'auto', transform:`rotate(${rot}deg)`,
                }}><path d="M2 12 V6 Q2 2 6 2 H12" stroke={accent} strokeWidth="3.5" fill="none" strokeLinecap="round"/></svg>
              ))}
              <div style={{position:'absolute', left:22, right:22, top:0, height:2, borderRadius:1,
                background:`linear-gradient(90deg, transparent, ${accent}, transparent)`,
                boxShadow:`0 0 12px ${accent}`, animation:'qrShareLine 2.1s ease-in-out infinite'}}/>
              <style>{`@keyframes qrShareLine { 0%,100% { top: 14px; } 50% { top: 194px; } }`}</style>
            </div>
            <div style={{marginTop:12, fontFamily:T.body, fontSize:13.5, color:T.mid, fontStyle:'italic', lineHeight:1.45}}>
              наведи на QR — карточка человека,<br/>стенд или стойка регистрации
            </div>
            <div style={{marginTop:6, fontFamily:T.mono, fontSize:8.5, color:T.soft, letterSpacing:1.2, textTransform:'uppercase'}}>
              в прототипе — тапни по видоискателю
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RecenterFab({ accent = T.accent, onClick, pulsing = false }) {
  return (
    <button onClick={onClick} aria-label="вернуть на меня" style={{
      position:'absolute', right:14, bottom:200, zIndex:9,
      width:40, height:40, borderRadius:14, border:'none',
      background:T.glass, backdropFilter:'blur(14px)',
      outline:`1px solid ${pulsing ? accent : T.divide}`, cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow: pulsing ? `0 0 0 4px ${accent}25, 0 6px 16px ${accent}55` : 'none',
      transition:'box-shadow 0.3s, outline 0.3s',
    }}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={T.mid} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="7"/>
        <circle cx="12" cy="12" r="1.6" fill={T.mid}/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
      </svg>
    </button>
  );
}

// ─── Place pin — центральная метка в режиме постановки (кольцо) ──
function PlacePin({ accent = T.accent }) {
  const photo = window.MARINA.photo;
  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <div style={{padding:3, borderRadius:'50%', background:accent, boxShadow:`0 6px 16px rgba(0,0,0,0.4)`}}>
        <div style={{width:40, height:40, borderRadius:'50%', overflow:'hidden', border:'2px solid #fff'}}>
          <img src={photo} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
        </div>
      </div>
      <div style={{width:0, height:0, marginTop:-2,
        borderLeft:'6px solid transparent', borderRight:'6px solid transparent',
        borderTop:`9px solid ${accent}`}}/>
      <div style={{width:8, height:8, borderRadius:'50%', background:'rgba(0,0,0,0.28)', marginTop:3, filter:'blur(1.5px)'}}/>
    </div>
  );
}
window.PlacePin = PlacePin;

// ─── Self marker — tap to open geo-picker ───────────────
function SelfMarker({ x = 48, y = 62, accent = T.accent, onClick, label = 'ты' }) {
  return (
    <button onClick={onClick} aria-label="моя геометка" style={{
      position:'absolute', left:`${x}%`, top:`${y}%`, transform:'translate(-50%,-50%)',
      width:64, height:64, borderRadius:'50%', border:'none', background:'transparent',
      cursor:'pointer', padding:0, zIndex:6,
    }}>
      {/* outer pulse */}
      <div style={{
        position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
        width:62, height:62, borderRadius:'50%',
        background:`radial-gradient(circle, ${accent}55 0%, ${accent}00 70%)`,
        animation:'selfPulse 2.4s ease-in-out infinite', pointerEvents:'none',
      }}/>
      {/* avatar */}
      <div style={{
        position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
        width:32, height:32, borderRadius:'50%', overflow:'hidden',
        border:`2.5px solid #fff`, boxShadow:`0 4px 12px ${accent}88`,
        background:`linear-gradient(135deg, ${accent}, ${accent}b0)`,
      }}>
        <img src={__R('self5','https://i.pravatar.cc/120?img=5')} alt="я" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
      </div>
      <style>{`@keyframes selfPulse { 0%,100% { opacity:0.6; transform:translate(-50%,-50%) scale(1); } 50% { opacity:1; transform:translate(-50%,-50%) scale(1.25); } }`}</style>
    </button>
  );
}

// ─── Avatar marker ───────────────────────────────────────
function PersonMarker({ p, accent = T.accent, dim = false, highlight = false, colorMode = 'category', onClick }) {
  // resolve color by mode
  let color = p.color;
  if (colorMode === 'neutral') color = '#8C7E66';
  else if (colorMode === 'score') {
    color = p.score >= 80 ? '#50B478' : p.score >= 60 ? '#E8A87C' : '#A0856B';
  }
  if (highlight) color = accent;
  return (
    <div onClick={onClick} style={{
      position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
      transform:'translate(-50%,-50%)',
      opacity: dim ? 0.32 : 1,
      transition:'opacity 0.3s',
      zIndex: highlight ? 5 : 3,
      cursor: onClick ? 'pointer' : 'default',
    }}>
      {/* safety halo */}
      <div style={{
        position:'absolute', left:'50%', top:'50%',
        transform:'translate(-50%,-50%)',
        width: highlight ? 64 : 44, height: highlight ? 64 : 44,
        borderRadius:'50%',
        background:`radial-gradient(circle, ${color}26 0%, ${color}00 70%)`,
        pointerEvents:'none',
      }}/>
      <div style={{
        width: highlight ? 38 : 30, height: highlight ? 38 : 30,
        borderRadius:'50%',
        background: T.surface,
        border: `1.5px solid ${color}`,
        boxShadow: highlight ? `0 0 0 3px rgba(255,88,32,0.18), 0 4px 14px rgba(0,0,0,0.4)` : `0 2px 6px rgba(0,0,0,0.4)`,
        display:'flex',alignItems:'center',justifyContent:'center',
        position:'relative', overflow:'hidden',
      }}>
        {p.photo ? (
          <img src={p.photo} alt={p.name||p.n} style={{
            width:'100%', height:'100%', objectFit:'cover',
            filter: colorMode === 'neutral' ? 'grayscale(0.55) saturate(0.7) brightness(0.95)' : 'none',
          }}/>
        ) : (
          <span style={{
            fontFamily:T.hand,
            fontSize: highlight ? 18 : 14,
            fontWeight:700,
            color,
          }}>{p.n}</span>
        )}
      </div>
    </div>
  );
}

// ─── Event marker (user-style point on the map) ─────────
function EventMarker({ x = 50, y = 40, accent = T.accent, label = 'Mining Expo', status = 'идёт сейчас', style = 'circle', labelStyle = 'tag', onClick }) {
  // Бейдж-здание — единственный стиль маркера события
  const body = (
    <div style={{position:'relative', filter:'drop-shadow(0 4px 10px rgba(0,0,0,0.45))'}}>
      <div style={{
        width:44, height:44, borderRadius:13,
        background:accent, border:'1.5px solid #fff',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 21V6l7-3 7 3v15" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M3 21h18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
          <rect x="8" y="9" width="2.3" height="2.3" fill="#fff"/>
          <rect x="13" y="9" width="2.3" height="2.3" fill="#fff"/>
          <rect x="8" y="13.5" width="2.3" height="2.3" fill="#fff"/>
          <rect x="13" y="13.5" width="2.3" height="2.3" fill="#fff"/>
        </svg>
      </div>
    </div>
  );

  // Label below
  let labelEl = null;
  const labelTop = 50;
  if (labelStyle === 'tag') {
    labelEl = (
      <div style={{
        position:'absolute', left:'50%', top:labelTop, transform:'translateX(-50%)',
        whiteSpace:'nowrap',
      }}>
        <div style={{
          padding:'3px 8px', borderRadius:8,
          background:T.glass,
          backdropFilter:'blur(10px)',
          border:`1px solid ${T.divide}`,
          display:'flex', alignItems:'center', gap:6,
        }}>
          <span style={{fontFamily:T.serif, fontSize:11, fontWeight:600, color:T.ink, lineHeight:1}}>{label}</span>
          <div style={{width:6, height:6, borderRadius:'50%', background:'#3FB87C', boxShadow:'0 0 5px rgba(63,184,124,0.9)', flexShrink:0}}/>
        </div>
      </div>
    );
  } else if (labelStyle === 'pill') {
    labelEl = (
      <div style={{
        position:'absolute', left:'50%', top:labelTop, transform:'translateX(-50%)',
        padding:'2px 7px', borderRadius:6,
        background:`${accent}22`, border:`1px solid ${accent}55`,
        whiteSpace:'nowrap',
      }}>
        <span style={{fontFamily:T.mono, fontSize:8, color:accent, letterSpacing:1.2, textTransform:'uppercase', lineHeight:1}}>{label}</span>
      </div>
    );
  }
  // 'on-tap' → no label

  return (
    <div onClick={onClick} style={{
      position:'absolute', left:`${x}%`, top:`${y}%`,
      transform:'translate(-50%,-50%)',
      zIndex: 4, cursor: onClick ? 'pointer' : 'default',
    }}>
      {/* outer pulse ring */}
      <div style={{
        position:'absolute', left:'50%', top:'50%',
        transform:'translate(-50%,-50%)',
        width:84, height:84, borderRadius:'50%',
        background:`radial-gradient(circle, ${accent}30 0%, ${accent}00 70%)`,
        animation:'pulseEvent 3s ease-in-out infinite',
        pointerEvents:'none',
      }}/>
      {body}
      {labelEl}
    </div>
  );
}

// ─── Cluster marker ──────────────────────────────────────
function ClusterMarker({ x, y, count, accent = T.accent, onClick }) {
  return (
    <div onClick={onClick} style={{
      position:'absolute', left:`${x}%`, top:`${y}%`,
      transform:'translate(-50%,-50%)',
      width:42, height:42, borderRadius:'50%',
      cursor: onClick ? 'pointer' : 'default',
      background: T.surface,
      border: `1.5px solid ${accent}55`,
      boxShadow:`0 0 0 6px rgba(255,88,32,0.08), 0 4px 12px rgba(0,0,0,0.4)`,
      display:'flex',alignItems:'center',justifyContent:'center',
      flexDirection:'column', gap:0,
    }}>
      <span style={{fontFamily:T.serif,fontSize:14,fontWeight:700,color:T.ink,lineHeight:1}}>{count}</span>
      <span style={{fontFamily:T.mono,fontSize:6.5,color:T.soft,letterSpacing:0.8,marginTop:1}}>людей</span>
    </div>
  );
}

// ─── Map artwork — switchable district ───────────────────
function MapArtwork({ district = 'center', accent = T.accent }) {
  if (district === 'depo') {
    // «Депо» — прибрежный индустриальный район: ж/д веер, набережная, кварталы-сетка
    return (
      <svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
        <defs>
          <radialGradient id="mapVignetteDepo" cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="#FF5820" stopOpacity="0.06"/>
            <stop offset="60%" stopColor="#FF5820" stopOpacity="0.015"/>
            <stop offset="100%" stopColor="#FF5820" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100" height="140" fill="url(#mapVignetteDepo)"/>

        {/* Река / затон — по нижней части, широкий изгиб */}
        <path d="M-5 96 Q20 90 42 96 Q64 102 88 94 Q98 91 105 92 L105 145 L-5 145 Z"
              fill="#C4D6DE" opacity="0.9"/>
        {/* набережная */}
        <path d="M-5 96 Q20 90 42 96 Q64 102 88 94 Q98 91 105 92"
              stroke="#A9BDC6" strokeWidth="0.5" fill="none" opacity="0.8"/>

        {/* Зелёный сквер у депо */}
        <path d="M6 20 L26 18 L30 34 L22 44 L8 42 L4 30 Z" fill="#D6DEC7" opacity="0.85"/>

        {/* Кварталы — прямоугольная сетка */}
        {[
          [40,14,16,12],[60,14,16,12],[80,16,14,12],
          [40,30,16,12],[60,30,16,12],[80,32,14,12],
          [6,52,15,12],[24,52,14,12],
          [66,52,16,12],[84,54,12,12],
        ].map(([x,y,w,h],i)=>(
          <rect key={i} x={x} y={y} width={w} height={h} fill="#E0D6C4" stroke="#CDBFA8" strokeWidth="0.25" opacity="0.8" rx="0.5"/>
        ))}

        {/* Улицы-сетка */}
        {['M-5 12 L105 12','M-5 28 L105 28','M-5 46 L105 46','M-5 68 L105 70'].map((d,i)=>(
          <path key={'h'+i} d={d} stroke="#CDBFA8" strokeWidth={i===2?0.5:0.35} fill="none" opacity="0.75"/>
        ))}
        {['M20 -5 L20 88','M38 -5 L38 92','M58 -5 L58 96','M78 -5 L78 90'].map((d,i)=>(
          <path key={'v'+i} d={d} stroke="#CDBFA8" strokeWidth={i===1?0.5:0.35} fill="none" opacity="0.75"/>
        ))}

        {/* Ж/д веер депо — сходящиеся пути */}
        {[58,62,66,70,74].map((sx,i)=>(
          <path key={'rail'+i} d={`M${sx} 74 Q${52+i*2} 60 46 48`} stroke="#B7A489" strokeWidth="0.4" fill="none" opacity="0.85" strokeDasharray="0.8 0.8"/>
        ))}
        {/* здание депо — акцентный контур */}
        <rect x="44" y="46" width="12" height="7" rx="0.8" fill={accent} opacity="0.16" stroke={accent} strokeWidth="0.24"/>

        {/* Подписи */}
        <text x="45" y="44" fill="#B07A54" fontSize="2" opacity="0.8" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="0.14">ДЕПО</text>
        <text x="8" y="27" fill="#7E9066" fontSize="1.9" opacity="0.8" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="0.16">СКВЕР</text>
        <text x="14" y="112" fill="#6E92A6" fontSize="2.1" opacity="0.8" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="0.2" fontStyle="italic">набережная</text>
        <text x="62" y="26" fill="#9A8A70" fontSize="1.8" opacity="0.66" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="0.14">ЗАВОДСКАЯ</text>
      </svg>
    );
  }

  // 'center' — центр Москвы (радиально-кольцевая)
  return (
    <svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <defs>
        <radialGradient id="mapVignette" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#FF5820" stopOpacity="0.06"/>
          <stop offset="60%" stopColor="#FF5820" stopOpacity="0.015"/>
          <stop offset="100%" stopColor="#FF5820" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100" height="140" fill="url(#mapVignette)"/>
      <path d="M74 6 L94 4 L98 16 L95 30 L83 34 L75 27 L71 15 Z" fill="#D6DEC7" opacity="0.85"/>
      <path d="M-5 30 Q18 34 30 44 Q40 52 38 62 Q36 74 48 78 Q62 82 66 70 Q69 60 62 54 Q56 49 60 42 Q65 33 80 34 Q95 35 105 30 L105 40 Q94 44 80 43 Q70 42 68 49 Q66 55 72 61 Q78 70 68 82 Q54 94 40 86 Q28 80 30 66 Q31 58 24 52 Q14 43 -5 40 Z" fill="#C4D6DE" opacity="0.9"/>
      {['M50 44 L50 -6','M50 44 L106 40','M50 44 L54 146','M50 44 L-6 46'].map((d,i)=>(
        <path key={'r'+i} d={d} stroke="#CDBFA8" strokeWidth="0.4" fill="none" opacity="0.8"/>
      ))}
      <path d="M47 40 L53 39.5 L54.5 43 L50 46 L45.5 43.2 Z" fill={accent} opacity="0.22" stroke={accent} strokeWidth="0.22"/>
      <text x="51" y="16" fill="#9A8A70" fontSize="2.1" opacity="0.7" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="0.18">ТВЕРСКАЯ</text>
      <text x="79" y="20" fill="#7E9066" fontSize="1.9" opacity="0.8" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="0.18">ПАРК</text>
      <text x="40" y="90" fill="#6E92A6" fontSize="2.1" opacity="0.8" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="0.2" fontStyle="italic">Москва-река</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// VARIANT A: Topographic dark-map
// ═══════════════════════════════════════════════════
function MapVariantA({ threshold = 65, accent = T.accent, setThreshold, eventStyle='circle', labelStyle='tag', colorMode='category', onPerson, onCluster, clusterCount = 4, onSelfTap, hideEvent = false, district = 'center', onEventTap, onEvent2Tap, selfHidden = false, panApi }) {
  const visible = PEOPLE.filter(p => p.score >= threshold);
  const dimmed  = PEOPLE.filter(p => p.score < threshold);

  // ── pannable world ──────────────────────────────────────
  const rootRef = React.useRef(null);
  const [pan, setPan] = React.useState({ x:0, y:0 });
  const [panAnim, setPanAnim] = React.useState(false);
  const dragRef = React.useRef(null);
  const movedRef = React.useRef(0);

  const recenter = () => { setPanAnim(true); setPan({ x:0, y:0 }); setTimeout(() => setPanAnim(false), 620); };
  if (panApi) panApi.current = { recenter };

  const clampV = (v, lim) => Math.max(-lim, Math.min(lim, v));
  const onDown = (e) => {
    const t = e.touches ? e.touches[0] : e;
    dragRef.current = { sx:t.clientX, sy:t.clientY, px:pan.x, py:pan.y };
    movedRef.current = 0;
  };
  const onMove = (e) => {
    if (!dragRef.current || !rootRef.current) return;
    const t = e.touches ? e.touches[0] : e;
    const dx = t.clientX - dragRef.current.sx, dy = t.clientY - dragRef.current.sy;
    movedRef.current = Math.max(movedRef.current, Math.abs(dx), Math.abs(dy));
    const r = rootRef.current.getBoundingClientRect();
    setPan({ x: clampV(dragRef.current.px + dx, r.width * 0.45), y: clampV(dragRef.current.py + dy, r.height * 0.45) });
  };
  const onUp = () => { dragRef.current = null; };
  const onClickCapture = (e) => { if (movedRef.current > 8) { e.stopPropagation(); movedRef.current = 0; } };

  // event position in viewport → edge indicator when out of view
  const rct = rootRef.current ? rootRef.current.getBoundingClientRect() : null;
  let edge = null;
  if (rct && !hideEvent) {
    const ev = { x: rct.width * 0.5 + pan.x, y: rct.height * 0.40 + pan.y };
    const out = ev.x < 30 || ev.x > rct.width - 30 || ev.y < 116 || ev.y > rct.height - 96;
    if (out) {
      const cx = Math.max(34, Math.min(rct.width - 78, ev.x - 22));
      const cy = Math.max(120, Math.min(rct.height - 170, ev.y - 22));
      const ang = Math.atan2(ev.y - (cy + 22), ev.x - (cx + 22)) * 180 / Math.PI;
      edge = { cx, cy, ang };
    }
  }

  return (
    <div ref={rootRef}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      onClickCapture={onClickCapture}
      style={{
      position:'absolute', inset:0,
      background: `radial-gradient(ellipse at 50% 40%, #F4F0E8 0%, #ECE5D9 55%, #E3DACB 100%)`,
      overflow:'hidden',
      cursor: dragRef.current ? 'grabbing' : 'grab',
    }}>
      {/* world layer — artwork + markers pan as one piece */}
      <div style={{
        position:'absolute', left:'-50%', top:'-50%', width:'200%', height:'200%',
        transform:`translate(${pan.x}px, ${pan.y}px)`,
        transition: panAnim ? 'transform 0.6s cubic-bezier(0.22,1,0.36,1)' : 'none',
      }}>
        {/* City map — stretched across the world */}
        <MapArtwork district={district} accent={accent}/>

        {/* view box = original viewport coordinate space */}
        <div style={{position:'absolute', left:'25%', top:'25%', width:'50%', height:'50%'}}>
          {/* Event marker (user-style point) */}
          {!hideEvent && <EventMarker x={50} y={40} accent={accent} style={eventStyle} labelStyle={labelStyle} onClick={onEventTap}/>}
          {!hideEvent && <EventMarker x={16} y={49} accent={accent} style={eventStyle} labelStyle={labelStyle} label="Крипто-завтрак" onClick={onEvent2Tap}/>}

          {/* Markers */}
          {!hideEvent && visible.map(p => <PersonMarker key={p.id} p={p} accent={accent} highlight={p.highlight} colorMode={colorMode} onClick={onPerson?()=>onPerson(p):null}/>)}
          {!hideEvent && dimmed.map(p => <PersonMarker key={p.id} p={p} accent={accent} dim colorMode={colorMode}/>)}

          {/* Self */}
          {!selfHidden && <SelfMarker x={48} y={62} accent={accent} onClick={onSelfTap}/>}

          {/* Cluster */}
          {!hideEvent && <ClusterMarker x={40} y={30} count={clusterCount} accent={accent} onClick={onCluster?()=>onCluster({x:40,y:30,count:clusterCount}):null}/>}
        </div>
      </div>

      {/* edge indicator — event is off-screen, tap to fly back */}
      {edge && (
        <button onClick={recenter} aria-label="вернуться к событию" style={{
          position:'absolute', left:edge.cx, top:edge.cy, zIndex:9,
          width:44, height:44, borderRadius:'50%',
          border:'1.5px solid #fff', background:accent, cursor:'pointer', padding:0,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`0 0 0 5px ${accent}22, 0 6px 18px ${accent}66`,
          animation:'edgeGlow 1.8s ease-in-out infinite',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 21V6l7-3 7 3v15" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M3 21h18" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <style>{`@keyframes edgeGlow { 0%,100% { box-shadow:0 0 0 4px ${accent}18, 0 6px 18px ${accent}55; } 50% { box-shadow:0 0 0 9px ${accent}28, 0 6px 22px ${accent}77; } }`}</style>
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// VARIANT B: Soft "safe zones" — ambient gradient blobs
// ═══════════════════════════════════════════════════
function MapVariantB({ threshold = 65, accent = T.accent, setThreshold, eventStyle='circle', labelStyle='tag', colorMode='category', onPerson, onCluster, clusterCount = 4, onSelfTap, hideEvent = false, district = 'center', onEventTap, selfHidden = false }) {
  const visible = PEOPLE.filter(p => p.score >= threshold);
  const dimmed  = PEOPLE.filter(p => p.score < threshold);
  return (
    <div style={{
      position:'absolute', inset:0,
      background:T.deviceBg,
      overflow:'hidden',
    }}>
      {/* City map base — same geometry as A but warmer, lower contrast */}
      <svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice" style={{
        position:'absolute',inset:0,width:'100%',height:'100%',
      }}>
        <defs>
          <linearGradient id="riverGradB" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A2530"/>
            <stop offset="100%" stopColor="#0F1820"/>
          </linearGradient>
          <pattern id="parkHatchB" width="1.4" height="1.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="1.4" stroke="#3A4730" strokeWidth="0.10"/>
          </pattern>
        </defs>

        {/* River */}
        <path d="M-5 95 Q15 88 30 92 Q50 98 70 90 Q88 84 105 88 L105 110 Q88 105 70 110 Q50 116 30 112 Q15 108 -5 113 Z"
              fill="url(#riverGradB)" opacity="0.65"/>

        {/* Park */}
        <path d="M72 8 L92 6 L96 18 L94 32 L82 36 L74 30 L70 18 Z"
              fill="url(#parkHatchB)" opacity="0.6"/>
        <path d="M72 8 L92 6 L96 18 L94 32 L82 36 L74 30 L70 18 Z"
              fill="#1F2818" opacity="0.4"/>

        {/* Soft blocks */}
        {[
          [5,18,18,12],[27,18,16,12],[50,18,16,14],
          [5,35,18,16],[27,35,16,16],[50,36,16,18],
          [5,56,18,16],[27,56,16,16],[50,60,16,14],
          [5,78,14,12],[22,78,14,10],[40,80,12,8],
          [72,42,18,14],[72,60,18,14],
          [5,118,18,18],[27,118,16,18],[50,122,16,14],[72,122,18,14],
        ].map(([x,y,w,h],i)=>(
          <rect key={i} x={x} y={y} width={w} height={h} fill="#1A140C" opacity="0.4" rx="0.6"/>
        ))}

        {/* Streets — softer than A */}
        {[
          'M-5 17 L70 17 Q73 17 75 18 L97 8',
          'M-5 33 L105 33',
          'M-5 53 L96 53',
          'M-5 74 L70 74 Q72 74 74 75 L82 78',
          'M-5 117 L105 117',
        ].map((d,i)=>(
          <path key={'h'+i} d={d} stroke="#5C4A38" strokeWidth={i===2 ? 0.45 : 0.25} fill="none" opacity="0.45"/>
        ))}
        {[
          'M5 -5 L5 90 L4 92 L-2 113 L5 137',
          'M25 -5 L25 90',
          'M46 -5 L46 90 L48 91 L52 113 L52 137',
          'M70 36 L70 90 L70 117 L70 137',
        ].map((d,i)=>(
          <path key={'v'+i} d={d} stroke={i===2 ? '#5C4A38' : '#4A3D2E'} strokeWidth={i===2 ? 0.45 : 0.25} fill="none" opacity="0.45"/>
        ))}

        {/* Diagonal */}
        <path d="M-5 5 L40 50 L60 53 L105 70" stroke="#6B5740" strokeWidth="0.35" fill="none" opacity="0.4"/>

        {/* Street labels — sparse */}
        <text x="9" y="51" fill="#9A8666" fontSize="2.2" opacity="0.5" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="0.22">5TH AVENUE</text>
        <text x="79" y="22" fill="#5A6A48" fontSize="1.8" opacity="0.6" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="0.18">PARK</text>
        <text x="20" y="106" fill="#4A6678" fontSize="1.9" opacity="0.55" fontFamily="ui-monospace, Menlo, monospace" letterSpacing="0.20" fontStyle="italic">river</text>
      </svg>

      {/* soft warm zones — overlay on top of map */}
      <div style={{position:'absolute',inset:0,opacity:0.95,mixBlendMode:'screen'}}>
        {[
          {x:'50%',y:'40%',r:200,c:'rgba(255,88,32,0.22)'},
          {x:'25%',y:'60%',r:160,c:'rgba(255,138,77,0.10)'},
          {x:'78%',y:'30%',r:140,c:'rgba(232,168,124,0.09)'},
          {x:'60%',y:'78%',r:130,c:'rgba(255,88,32,0.07)'},
        ].map((b,i)=>(
          <div key={i} style={{
            position:'absolute', left:b.x, top:b.y, transform:'translate(-50%,-50%)',
            width:b.r, height:b.r, borderRadius:'50%',
            background:`radial-gradient(circle, ${b.c} 0%, transparent 65%)`,
            filter:'blur(8px)',
          }}/>
        ))}
      </div>

      {/* Event marker (user-style point) */}
      {!hideEvent && <EventMarker x={50} y={40} accent={accent} style={eventStyle} labelStyle={labelStyle} onClick={onEventTap}/>}

      {!hideEvent && visible.map(p => <PersonMarker key={p.id} p={p} accent={accent} highlight={p.highlight} colorMode={colorMode} onClick={onPerson?()=>onPerson(p):null}/>)}
      {!hideEvent && dimmed.map(p => <PersonMarker key={p.id} p={p} accent={accent} dim colorMode={colorMode}/>)}
      {!selfHidden && <SelfMarker x={48} y={62} accent={accent} onClick={onSelfTap}/>}
      {!hideEvent && <ClusterMarker x={40} y={30} count={clusterCount} accent={accent} onClick={onCluster?()=>onCluster({x:40,y:30,count:clusterCount}):null}/>}

      <style>{`
        @keyframes pulseRing {
          0%,100% { opacity: 0.5; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%,-50%) scale(1.15); }
        }
        @keyframes pulseEvent {
          0%,100% { opacity: 0.6; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%,-50%) scale(1.18); }
        }
      `}</style>
    </div>
  );
}

// ─── Profile overlay (full-screen card on person tap) ─────
function ProfileOverlay({ person, accent, onClose }) {
  const ref = React.useRef(null);
  const g = React.useRef({ active:false, x0:0, y0:0, dx:0, horiz:false });
  if (!person) return null;
  const CardScreen = window.CardScreen;

  // обратный слайд: тянешь анкету вправо — возвращаешься в ленту на то же место
  const down = (e) => { const t = e.touches ? e.touches[0] : e;
    g.current = { active:true, x0:t.clientX, y0:t.clientY, dx:0, horiz:false }; };
  const move = (e) => {
    const G = g.current; if (!G.active || !ref.current) return;
    const t = e.touches ? e.touches[0] : e;
    const dx = t.clientX - G.x0, dy = t.clientY - G.y0;
    if (!G.horiz && Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.2 && dx > 0) G.horiz = true;
    if (G.horiz) {
      G.dx = Math.max(0, dx);
      ref.current.style.transition = 'none';
      ref.current.style.transform = `translateX(${G.dx}px)`;
    }
  };
  const up = () => {
    const G = g.current; if (!G.active) return;
    G.active = false;
    if (!ref.current) return;
    if (G.horiz && G.dx > 90) {
      ref.current.style.transition = 'transform 0.26s cubic-bezier(0.22, 0.9, 0.32, 1)';
      ref.current.style.transform = 'translateX(105%)';
      setTimeout(onClose, 250);
    } else {
      ref.current.style.transition = 'transform 0.24s cubic-bezier(0.22, 0.9, 0.32, 1)';
      ref.current.style.transform = 'translateX(0)';
    }
  };

  // портал в body: анкета покрывает весь экран, включая нижнее меню
  return ReactDOM.createPortal(
    <div ref={ref}
      onTouchStart={down} onTouchMove={move} onTouchEnd={up} onTouchCancel={up}
      onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={up}
      style={{
        position:'fixed', inset:0, zIndex:120,
        background:T.bg, animation:'profileSlideIn 0.3s cubic-bezier(0.22, 0.9, 0.32, 1)',
        touchAction:'pan-y', willChange:'transform',
        boxShadow:'-20px 0 60px rgba(0,0,0,0.45)',
      }}>
      {CardScreen ? <CardScreen accent={accent} hierarchy="B" ctaVariant="A" viVariant="C" iconSet="arrow" tier="paid" onBack={onClose} onSkip={onClose} onInterest={onClose} onMessage={onClose}/> : (
        <div style={{padding:80,color:T.ink}}>профиль · {person.name}</div>
      )}
      <style>{`@keyframes profileSlideIn { from { transform:translateX(60%); opacity:0.5; } to { transform:none; opacity:1; } }`}</style>
    </div>,
    document.body
  );
}

// ─── Swipe-mode banner (for large clusters) ───────────────
function SwipeBanner({ count, accent, onDismiss }) {
  return (
    <div style={{
      position:'absolute', top:14, left:14, right:14, zIndex:60,
      padding:'12px 14px', borderRadius:14,
      background:T.glassHi, backdropFilter:'blur(14px)',
      border:`1px solid ${accent}55`,
      boxShadow:'0 12px 32px rgba(0,0,0,0.55)',
      display:'flex', alignItems:'flex-start', gap:10,
      animation:'bannerDrop 0.32s ease-out',
    }}>
      <div style={{
        width:30, height:30, borderRadius:9, background:`${accent}1f`,
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2" y="1.5" width="10" height="11" rx="1.8" stroke={accent} strokeWidth="1.4"/>
          <path d="M7 4.5l2 2-2 2" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontFamily:T.serif, fontSize:13, fontWeight:600, color:T.ink, lineHeight:1.3}}>
          В этой группе {count} людей
        </div>
        <div style={{fontFamily:T.sans, fontSize:11, color:T.soft, lineHeight:1.4, marginTop:2}}>
          Слишком плотно для карты — переключили на свайп. Листай по одному.
        </div>
      </div>
      <button onClick={onDismiss} aria-label="закрыть" style={{
        width:24, height:24, borderRadius:7, border:'none', background:'transparent',
        display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0,
      }}>
        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 1l8 8M9 1l-8 8" stroke={T.soft} strokeWidth="1.4" strokeLinecap="round"/></svg>
      </button>
      <style>{`@keyframes bannerDrop { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

// ─── Filters sheet (bottom drawer) ───────────────────────
function FiltersSheet({ accent = T.accent, onClose, onApply, initial = {} }) {
  const [age, setAge]       = React.useState(initial.age || [20, 30]);
  const [gender, setGender] = React.useState(initial.gender || 'ж');
  const [tags, setTags]     = React.useState(initial.tags || ['театр', 'книги']);
  const [hereNow, setHereNow] = React.useState(initial.hereNow ?? true);

  const ALL_TAGS = [
    'театр', 'книги', 'бег', 'кино', 'музыка',
    'кофе', 'спорт', 'искусство', 'путешествия', 'программирование',
    'настолки', 'йога', 'вино', 'фото',
  ];

  const toggleTag = (t) => setTags(s => s.includes(t) ? s.filter(x=>x!==t) : [...s, t]);
  const activeCount = (gender !== 'все' ? 1 : 0) + (tags.length > 0 ? 1 : 0) + (hereNow ? 1 : 0)
                    + ((age[0] !== 18 || age[1] !== 60) ? 1 : 0);

  return (
    <div style={{position:'absolute', inset:0, zIndex:55, animation:'fadeIn 0.2s ease-out'}}>
      {/* dim */}
      <div onClick={onClose} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.55)'}}/>

      {/* sheet */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0,
        maxHeight:'82%',
        background:T.sheet,
        borderTop:`1px solid ${T.divide}`,
        borderRadius:'22px 22px 0 0',
        boxShadow:'0 -16px 48px rgba(0,0,0,0.6)',
        display:'flex', flexDirection:'column',
        animation:'sheetUp 0.32s cubic-bezier(0.2, 0.9, 0.3, 1)',
        overflow:'hidden',
      }}>
        {/* drag handle */}
        <div style={{display:'flex', justifyContent:'center', paddingTop:8, paddingBottom:4}}>
          <div style={{width:36, height:4, borderRadius:2, background:T.divide}}/>
        </div>

        {/* header */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'8px 18px 14px',
        }}>
          <div>
            <div style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:1.4, textTransform:'uppercase'}}>фильтры</div>
            <div style={{fontFamily:T.serif, fontSize:22, fontWeight:700, color:T.ink, lineHeight:1.1, marginTop:3}}>
              кого показывать на карте
            </div>
          </div>
          <button onClick={onClose} aria-label="закрыть" style={{
            width:32, height:32, borderRadius:10, border:`1px solid ${T.divide}`,
            background:'transparent', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11"><path d="M1 1l9 9M10 1l-9 9" stroke={T.soft} strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* body — scrollable */}
        <div className="noscroll" style={{
          flex:1, overflowY:'auto', padding:'2px 18px 18px',
          display:'flex', flexDirection:'column', gap:22,
        }}>
          {/* AGE */}
          <FilterBlock
            label="возраст"
            value={<><span style={{fontFamily:T.serif, fontSize:18, fontWeight:700, color:T.ink}}>{age[0]}–{age[1]}</span><span style={{fontFamily:T.sans, fontSize:11, color:T.soft, marginLeft:5}}>лет</span></>}
            count={(age[0] !== 18 || age[1] !== 60) ? 1 : 0}
            accent={accent}
          >
            <DualRangeSlider min={18} max={60} value={age} onChange={setAge} accent={accent}/>
          </FilterBlock>

          {/* GENDER */}
          <FilterBlock label="кто" count={gender !== 'все' ? 1 : 0} accent={accent}>
            <div style={{display:'flex', gap:6}}>
              {[
                {k:'ж', label:'женщины'},
                {k:'м', label:'мужчины'},
                {k:'все', label:'все'},
              ].map(g => {
                const on = gender === g.k;
                return (
                  <button key={g.k} onClick={()=>setGender(g.k)} style={{
                    flex:1, padding:'11px 10px', borderRadius:12,
                    background: on ? `${accent}1f` : 'transparent',
                    border: on ? `1.5px solid ${accent}` : `1px solid ${T.divide2}`,
                    fontFamily:T.sans, fontSize:13, fontWeight: on ? 600 : 500,
                    color: on ? T.ink : T.mid, cursor:'pointer',
                  }}>{g.label}</button>
                );
              })}
            </div>
          </FilterBlock>

          {/* INTERESTS */}
          <FilterBlock label="интересы" count={tags.length} accent={accent}>
            <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
              {ALL_TAGS.map(t => {
                const on = tags.includes(t);
                return (
                  <button key={t} onClick={()=>toggleTag(t)} style={{
                    display:'flex', alignItems:'center', gap:5,
                    padding:'7px 11px', borderRadius:11,
                    background: on ? `${accent}25` : 'transparent',
                    border: on ? `1px solid ${accent}66` : `1px solid ${T.divide2}`,
                    fontFamily:T.mono, fontSize:11, color: on ? accent : T.mid,
                    letterSpacing:0.3, cursor:'pointer', whiteSpace:'nowrap',
                  }}>
                    <span style={{fontWeight: on ? 600 : 500}}>#{t}</span>
                    {on && (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                        <path d="M1.5 4.5 L3.8 6.8 L7.5 2.2" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </FilterBlock>

          {/* HERE NOW */}
          <FilterBlock label="присутствие" accent={accent}>
            <button onClick={()=>setHereNow(v=>!v)} style={{
              width:'100%', padding:'12px 14px', borderRadius:14,
              background: hereNow ? `${accent}14` : 'transparent',
              border: hereNow ? `1.5px solid ${accent}66` : `1px solid ${T.divide2}`,
              display:'flex', alignItems:'center', gap:12, cursor:'pointer', textAlign:'left',
            }}>
              <div style={{
                width:36, height:22, borderRadius:11, padding:2,
                background: hereNow ? accent : T.hi,
                transition:'background 0.2s',
                flexShrink:0,
              }}>
                <div style={{
                  width:18, height:18, borderRadius:'50%', background:'#fff',
                  transform: hereNow ? 'translateX(14px)' : 'translateX(0)',
                  transition:'transform 0.2s',
                }}/>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontFamily:T.sans, fontSize:13, fontWeight:600, color:T.ink, lineHeight:1.2}}>Сейчас на месте</div>
                <div style={{fontFamily:T.sans, fontSize:11, color:T.soft, lineHeight:1.3, marginTop:2}}>
                  Только те, кто отметился здесь в последние 4 часа
                </div>
              </div>
            </button>
          </FilterBlock>

          <div style={{height:6}}/>
        </div>

        {/* footer — actions */}
        <div style={{
          padding:'12px 18px 22px',
          borderTop:`1px solid ${T.divide2}`,
          background:T.sheet2,
          display:'flex', gap:10, alignItems:'stretch',
        }}>
          <button onClick={()=>{ setAge([18,60]); setGender('все'); setTags([]); setHereNow(false); }}
            style={{
              padding:'0 18px', height:50, borderRadius:14,
              background:'transparent', border:`1px solid ${T.divide}`,
              fontFamily:T.sans, fontSize:13, fontWeight:600, color:T.mid,
              cursor:'pointer', whiteSpace:'nowrap',
            }}>Сбросить</button>
          <button onClick={()=>onApply && onApply({age, gender, tags, hereNow})} style={{
            flex:1, height:50, borderRadius:14,
            background:`linear-gradient(135deg, ${accent}, ${accent}d0)`,
            border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:7,
            boxShadow:`0 8px 22px ${accent}55`,
          }}>
            <span style={{fontFamily:T.sans, fontSize:14, fontWeight:700, color:'#fff'}}>Показать</span>
            <span style={{fontFamily:T.sans, fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.6)'}}>·</span>
            <span style={{fontFamily:T.sans, fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.82)'}}>{Math.max(0, 47 - activeCount * 6)}</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      `}</style>
    </div>
  );
}

function FilterBlock({ label, value, count = 0, children, accent }) {
  return (
    <div>
      <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:10}}>
        <span style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:1.4, textTransform:'uppercase'}}>{label}</span>
        {value && <div style={{display:'flex', alignItems:'baseline'}}>{value}</div>}
      </div>
      {children}
    </div>
  );
}

function DualRangeSlider({ min = 18, max = 60, value = [20, 30], onChange, accent }) {
  const [lo, hi] = value;
  const [dragging, setDragging] = React.useState(null); // 'lo' | 'hi' | null
  const trackRef = React.useRef(null);
  const pctLo = ((lo - min) / (max - min)) * 100;
  const pctHi = ((hi - min) / (max - min)) * 100;

  const valueAt = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(min + pct * (max - min));
  };

  React.useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const v = valueAt(cx);
      if (dragging === 'lo') onChange && onChange([Math.min(v, hi - 1), hi]);
      else onChange && onChange([lo, Math.max(v, lo + 1)]);
    };
    const onUp = () => setDragging(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [dragging, lo, hi]);

  const onTrackPointerDown = (e) => {
    if (!trackRef.current) return;
    const v = valueAt(e.clientX);
    const distLo = Math.abs(v - lo);
    const distHi = Math.abs(v - hi);
    // tie-break: if at edge, pick the one that has room to move
    let which;
    if (distLo === distHi) which = v < (lo + hi) / 2 ? 'lo' : 'hi';
    else which = distLo < distHi ? 'lo' : 'hi';
    if (which === 'lo') onChange && onChange([Math.min(v, hi - 1), hi]);
    else onChange && onChange([lo, Math.max(v, lo + 1)]);
    setDragging(which);
  };

  return (
    <div style={{position:'relative', userSelect:'none'}}>
      {/* slider row */}
      <div style={{position:'relative', height:24}}>
        {/* hit area + track */}
        <div ref={trackRef}
          onPointerDown={onTrackPointerDown}
          style={{position:'absolute', left:2, right:2, top:0, height:24, cursor:'pointer', touchAction:'none'}}>
          <div style={{position:'absolute', left:0, right:0, top:'50%', transform:'translateY(-50%)', height:4, borderRadius:3, background:T.hi}}/>
          <div style={{position:'absolute', left:`${pctLo}%`, width:`${pctHi-pctLo}%`, top:'50%', transform:'translateY(-50%)', height:4, borderRadius:3, background:accent}}/>
        </div>
        {/* handles */}
        {[
          {p:pctLo, val:lo, k:'lo'},
          {p:pctHi, val:hi, k:'hi'},
        ].map(h => {
          const active = dragging === h.k;
          return (
            <div key={h.k}
              onPointerDown={(e) => { e.stopPropagation(); setDragging(h.k); }}
              style={{
                position:'absolute', left:`calc(2px + ${h.p}% * (100% - 4px) / 100%)`, top:'50%',
                transform:`translate(-50%, -50%) scale(${active ? 1.25 : 1})`,
                width:14, height:14, borderRadius:'50%', background:'#fff',
                boxShadow: active
                  ? `0 0 0 3px ${accent}, 0 0 0 6px ${accent}30, 0 5px 12px rgba(0,0,0,0.5)`
                  : `0 0 0 2.5px ${accent}, 0 2px 6px rgba(0,0,0,0.45)`,
                cursor:'grab', touchAction:'none',
                transition: active ? 'none' : 'transform 0.14s, box-shadow 0.14s',
                zIndex: active ? 4 : 2,
              }}>
              {active && (
                <div style={{
                  position:'absolute', bottom:'calc(100% + 8px)', left:'50%', transform:'translateX(-50%)',
                  padding:'3px 9px', borderRadius:8,
                  background:accent, color:'#fff',
                  fontFamily:T.mono, fontSize:11, fontWeight:700,
                  whiteSpace:'nowrap', pointerEvents:'none',
                  boxShadow:'0 4px 10px rgba(0,0,0,0.45)',
                }}>{h.val}{h.k === 'hi' && hi === max ? '+' : ''}</div>
              )}
            </div>
          );
        })}
      </div>
      {/* endpoint labels */}
      <div style={{display:'flex', justifyContent:'space-between', marginTop:9}}>
        <span style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:0.6}}>{min}</span>
        <span style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:0.6}}>{max}+</span>
      </div>
    </div>
  );
}

// ─── Composite map screen ────────────────────────────────
function MapScreen({ variant = 'A', threshold, setThreshold, visible = true, accent = T.accent, eventStyle='circle', labelStyle='tag', colorMode='category', clusterCount = 4, swipeThreshold = 6, headerStyle = 'context', geoPicker = false, onGeoPickerToggle, filtersOpen = false, onFiltersToggle, showSlider = false, hideEvent = false, district = 'center', onPersonTap, onClusterTap, onEventViewPeople, onMeetupEnter, onCreateCard }) {
  const Map = variant === 'B' ? MapVariantB : (window.MapVariantGeo || MapVariantA);
  const count = PEOPLE.filter(p => p.score >= threshold).length + clusterCount;
  const [selectedPerson, setSelectedPerson] = React.useState(null);
  const [swipeMode, setSwipeMode] = React.useState(false);
  const [pulsing, setPulsing] = React.useState(false);
  const [eventOpen, setEventOpen] = React.useState(false);
  const [event2Open, setEvent2Open] = React.useState(false);
  const [selfVisible, setSelfVisible] = React.useState(visible !== false);
  React.useEffect(() => { setSelfVisible(visible !== false); }, [visible]);
  const [filtersInternal, setFiltersInternal] = React.useState(false);
  const panApi = React.useRef(null);
  const recenterToEvent = () => { panApi.current && panApi.current.recenter(); };
  const filtersOn = onFiltersToggle ? filtersOpen : filtersInternal;
  const setFilters = (v) => { onFiltersToggle ? onFiltersToggle(v) : setFiltersInternal(v); };
  // ── постановка своей метки ──
  const [selfPlaced, setSelfPlaced] = React.useState(false);
  const [placing, setPlacing] = React.useState(false);
  const [placePicker, setPlacePicker] = React.useState(false);
  const [qrShare, setQrShare] = React.useState(false);
  const [myCard, setMyCard] = React.useState(null);
  const Picker = window.CardPickerSheet;
  const myCards = window.MY_CARDS || [];
  const onCluster = (c) => {
    if (onClusterTap) { onClusterTap(c); return; }
    if (clusterCount > swipeThreshold) setSwipeMode(true);
  };
  return (
    <div style={{position:'absolute',inset:0,background:T.canvas,overflow:'hidden'}}>
      <Map threshold={threshold} accent={accent} setThreshold={setThreshold} eventStyle={eventStyle} labelStyle={labelStyle} colorMode={colorMode} onPerson={onPersonTap || setSelectedPerson} onCluster={onCluster} clusterCount={clusterCount} onSelfTap={onGeoPickerToggle} hideEvent={hideEvent || geoPicker} district={district} onEventTap={() => setEventOpen(true)} onEvent2Tap={() => setEvent2Open(true)} selfHidden={!selfVisible || !selfPlaced} panApi={panApi}/>
      <MapHeader accent={accent} style={headerStyle} onFilters={() => setFilters(true)} onEventTap={() => { recenterToEvent(); setEventOpen(true); }}
        selfPlaced={selfPlaced} myCard={myCard} onAddSelf={() => setPlacing(true)} onQr={() => setQrShare(true)}/>
      <RecenterFab accent={accent} pulsing={pulsing} onClick={() => { recenterToEvent(); setPulsing(true); setTimeout(()=>setPulsing(false), 700); }}/>
      {qrShare && (
        <QRShareSheet accent={accent} onClose={() => setQrShare(false)}
          onScanned={() => onPersonTap && onPersonTap((PEOPLE || []).find(p => p.highlight))}/>
      )}

      {/* обязательная атрибуция OSM — максимально тихо, в самом углу */}
      <div style={{position:'absolute', left:6, bottom:2, zIndex:8, pointerEvents:'none',
        fontFamily:T.mono, fontSize:7, color:'rgba(140,124,98,0.5)', letterSpacing:0.3}}>
        © OpenStreetMap · OpenFreeMap
      </div>

      {/* режим постановки: центральная зафиксированная метка + панель */}
      {placing && (
        <>
          {/* центральный пин — двигаешь карту под ним */}
          <div style={{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-100%)', zIndex:13, pointerEvents:'none',
            display:'flex', flexDirection:'column', alignItems:'center'}}>
            <PlacePin accent={accent}/>
          </div>

          {/* подсказка сверху */}
          <div style={{position:'absolute', top:64, left:'50%', transform:'translateX(-50%)', zIndex:13,
            padding:'7px 14px', borderRadius:14, pointerEvents:'none',
            background:T.glass, backdropFilter:'blur(10px)', border:`1px solid ${T.divide}`}}>
            <span style={{fontFamily:T.body, fontSize:13.5, color:T.ink, fontStyle:'italic'}}>двигай карту — поставь себя, где хочешь</span>
          </div>

          {/* нижняя панель */}
          <div style={{position:'absolute', left:14, right:14, bottom:20, zIndex:14,
            display:'flex', gap:9}}>
            <button onClick={() => setPlacing(false)} style={{
              flex:'0 0 auto', padding:'0 18px', height:50, borderRadius:15, cursor:'pointer',
              background:T.glassHi, backdropFilter:'blur(14px)', border:`1px solid ${T.divide}`,
              color:T.mid, fontFamily:T.sans, fontSize:14, fontWeight:500,
            }}>Отмена</button>
            <button onClick={() => setPlacePicker(true)} style={{
              flex:1, height:50, borderRadius:15, border:'none', cursor:'pointer',
              background:accent, color:'#fff', fontFamily:T.sans, fontSize:15, fontWeight:600,
              boxShadow:`0 6px 20px ${accent}55`,
            }}>Разместить здесь</button>
          </div>
        </>
      )}

      {/* пикер карточки при подтверждении */}
      {placePicker && Picker && (
        <Picker accent={accent} cards={myCards} selectedId={myCard && myCard.id}
          title="Какой карточкой тебя видят здесь?"
          subtitle="люди рядом увидят именно эту карточку"
          onSelect={(c) => { setMyCard(c); setSelfPlaced(true); setPlacing(false); setPlacePicker(false); }}
          onCreate={() => { setPlacePicker(false); onCreateCard && onCreateCard(); }}
          onClose={() => setPlacePicker(false)}/>
      )}
      <CompatibilitySlider value={threshold} count={count} accent={accent} onChange={setThreshold} hidden={!showSlider}/>
      {swipeMode && <SwipeBanner count={clusterCount} accent={accent} onDismiss={()=>setSwipeMode(false)}/>}
      <ProfileOverlay person={selectedPerson} accent={accent} onClose={()=>setSelectedPerson(null)}/>
      {filtersOn && <FiltersSheet accent={accent} onClose={() => setFilters(false)} onApply={() => setFilters(false)}/>}
      {eventOpen && <EventInfoSheet accent={accent} count={count} onClose={() => setEventOpen(false)} onViewPeople={onEventViewPeople}/>}
      {event2Open && <EventInfoSheet accent={accent} onClose={() => setEvent2Open(false)} onViewPeople={onMeetupEnter}
        kicker="встреча" name="Крипто-завтрак"
        rows={[
          {ic:'clock', main:'Завтра · 10:00 – 12:00', sub:'сбор с 9:45'},
          {ic:'pin',   main:'Кафе «Юность»', sub:'Лесная 12 · без сцены и стендов'},
          {ic:'people', main:'12 человек идут', sub:'дизайнеры и продакты'},
        ]}/>}
    </div>
  );
}

window.MapScreen = MapScreen;
window.MapVariantA = MapVariantA;
window.MapVariantB = MapVariantB;

// ─── Swipe stack — card deck over the map ────────────────
// Карточка свайп-ленты — стабильный модульный компонент (тач-таргет живёт весь жест).
// transform задаёт React только в состоянии покоя; во время жеста им управляет
// SwipeStack напрямую через DOM (без ре-рендеров в кадре — плавные 60fps).
function SwipeCardView({ p, k, top = false, dimmed = false, accent }) {
  return (
    <div data-slot={top ? 'top' : k < 0 ? 'prev' : 'next'} style={{
      position:'absolute', left:16, right:16, top:88, bottom:64,
      borderRadius:24, overflow:'hidden',
      background:T.surface, border:`1px solid ${T.divide}`,
      boxShadow:'0 18px 44px rgba(0,0,0,0.5)',
      transform:`translateY(calc(${k*100}% + ${k*160}px)) translateX(0px)`,
      willChange:'transform',
      filter: dimmed ? 'brightness(0.72)' : 'none',
      cursor: top ? 'grab' : 'default',
      touchAction:'none',
    }}>
      {/* pointerEvents:none — жест всегда достаётся корню стека, а не начинке карточки */}
      <img src={p.photo} alt={p.name} draggable={false} style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', pointerEvents:'none'}}/>
      <div style={{position:'absolute', inset:0, pointerEvents:'none', background:'linear-gradient(to top, rgba(10,8,5,0.94) 0%, rgba(10,8,5,0.55) 38%, rgba(10,8,5,0) 62%)'}}/>

      {top && (
        <div data-hint="profile" style={{
          position:'absolute', top:'50%', right:16, transform:'translateY(-50%)',
          opacity:0, pointerEvents:'none',
          display:'flex', flexDirection:'column', alignItems:'center', gap:6,
        }}>
          <div style={{
            width:44, height:44, borderRadius:'50%',
            background:`${accent}e0`, display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:`0 6px 18px ${accent}70`,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{fontFamily:T.mono, fontSize:8.5, color:'#fff', letterSpacing:1, textTransform:'uppercase'}}>анкета</span>
        </div>
      )}

      {/* info */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'0 20px 22px', pointerEvents:'none'}}>
        <div style={{display:'flex', alignItems:'baseline', gap:8}}>
          <span style={{fontFamily:T.serif, fontSize:28, fontWeight:700, color:'#fff', lineHeight:1.1}}>{p.name}</span>
          <span style={{fontFamily:T.mono, fontSize:9, color:'rgba(255,255,255,0.6)', letterSpacing:0.5}}>рядом · Депо</span>
        </div>
        <div style={{fontFamily:T.sans, fontSize:13.5, color:'rgba(255,255,255,0.82)', marginTop:4}}>{p.role}</div>
        {p.about && <div style={{fontFamily:T.body, fontSize:15, color:'rgba(255,255,255,0.92)', marginTop:12, lineHeight:1.4}}>{p.about}</div>}
        {p.tags && (
          <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:14}}>
            {p.tags.map(t => (
              <span key={t} style={{
                fontFamily:T.mono, fontSize:10.5, color:'#fff', letterSpacing:0.3,
                padding:'4px 9px', borderRadius:8,
                background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.18)',
              }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SwipeStack({ accent = T.accent, onOpenProfile }) {
  const deck = PEOPLE.filter(p => p.about); // only rich cards
  const [idx, setIdx] = React.useState(0);
  const [profile, setProfile] = React.useState(null);
  const rootRef = React.useRef(null);
  // всё состояние жеста — в ref: ни одного ре-рендера, пока палец на экране
  const g = React.useRef({ active:false, committing:false, x0:0, y0:0, dx:0, dy:0, lastY:0, lastT:0, vy:0 });

  const person = deck[idx % deck.length];
  const nextP  = deck[(idx + 1) % deck.length];
  const prevP  = deck[(idx - 1 + deck.length) % deck.length];

  const stripT = (k, dy, dx) => `translateY(calc(${k*100}% + ${k*160 + dy}px)) translateX(${dx}px)`;
  const setStrip = (dy, dx, animMs) => {
    const r = rootRef.current; if (!r) return;
    const tr = animMs ? `transform ${animMs}ms cubic-bezier(0.22, 0.9, 0.32, 1)` : 'none';
    const prev = r.querySelector('[data-slot="prev"]');
    const next = r.querySelector('[data-slot="next"]');
    const topC = r.querySelector('[data-slot="top"]');
    if (prev) { prev.style.transition = tr; prev.style.transform = stripT(-1, dy, 0); }
    if (next) { next.style.transition = tr; next.style.transform = stripT(1, dy, 0); }
    if (topC) {
      topC.style.transition = tr;
      topC.style.transform = `${stripT(0, dy, dx)} rotate(${dx / 42}deg)`;
      const hint = topC.querySelector('[data-hint]');
      if (hint) hint.style.opacity = Math.max(0, Math.min(1, -dx / 80));
    }
  };

  const commit = (dir, speed) => {
    const G = g.current;
    G.committing = true; G.active = false;
    const r = rootRef.current;
    const topC = r && r.querySelector('[data-slot="top"]');
    const H = (topC ? topC.offsetHeight : innerHeight * 0.75) + 160;
    // длительность от скорости пальца — карточка «долетает» с инерцией
    const rest = Math.max(40, H - Math.abs(G.dy));
    const ms = Math.round(Math.max(180, Math.min(380, speed > 0.2 ? rest / speed : 340)));
    setStrip(dir === 'up' ? -H : H, 0, ms);
    setTimeout(() => {
      setIdx(i => dir === 'up' ? (i + 1) % deck.length : (i - 1 + deck.length) % deck.length);
      requestAnimationFrame(() => { setStrip(0, 0, 0); g.current.committing = false; });
    }, ms + 20);
  };

  const onDown = (e) => {
    if (g.current.committing) return;
    const t = e.touches ? e.touches[0] : e;
    g.current = { active:true, committing:false, x0:t.clientX, y0:t.clientY, dx:0, dy:0,
      lastY:t.clientY, lastT:performance.now(), vy:0 };
  };
  const onMove = (e) => {
    const G = g.current;
    if (!G.active || G.committing) return;
    const t = e.touches ? e.touches[0] : e;
    G.dx = t.clientX - G.x0; G.dy = t.clientY - G.y0;
    const now = performance.now();
    if (now - G.lastT > 12) {
      G.vy = (t.clientY - G.lastY) / (now - G.lastT);
      G.lastY = t.clientY; G.lastT = now;
    }
    setStrip(G.dy, G.dx < 0 ? G.dx : G.dx * 0.18, 0);   // вправо — упругое сопротивление
  };
  const onUp = () => {
    const G = g.current;
    if (!G.active || G.committing) return;
    G.active = false;
    const moved = Math.max(Math.abs(G.dx), Math.abs(G.dy));
    if (moved < 8) { setProfile(person); return; }                 // тап → анкета
    const flick = Math.abs(G.vy) > 0.55;                            // быстрый бросок
    if (Math.abs(G.dy) >= Math.abs(G.dx)) {
      if (G.dy < -70 || (flick && G.vy < 0 && G.dy < -24)) return commit('up', -G.vy);
      if (G.dy > 70  || (flick && G.vy > 0 && G.dy > 24))  return commit('down', G.vy);
    } else if (G.dx < -70) {
      setProfile(person);
    }
    setStrip(0, 0, 260);                                            // упругий возврат
  };

  return (
    <div ref={rootRef} style={{position:'absolute', inset:0, overflow:'hidden', touchAction:'none'}}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp} onTouchCancel={onUp}>

      {/* header */}
      <div style={{position:'absolute', top:14, left:0, right:0, zIndex:10, padding:'8px 18px', textAlign:'center'}}>
        <div style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:1.6, textTransform:'uppercase'}}>рядом на Депо</div>
        <div style={{fontFamily:T.serif, fontSize:17, fontWeight:600, color:T.ink, marginTop:1}}>{(idx % deck.length) + 1} / {deck.length} · листай вверх</div>
      </div>

      {/* vertical strip: prev above, next below, current in the middle */}
      <SwipeCardView key={'prev-' + prevP.id} p={prevP} k={-1} dimmed accent={accent}/>
      <SwipeCardView key={'next-' + nextP.id} p={nextP} k={1} dimmed accent={accent}/>
      <SwipeCardView key={'top-' + person.id} p={person} k={0} top accent={accent}/>

      {/* gesture hints */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:26, zIndex:11,
        display:'flex', alignItems:'center', justifyContent:'center', gap:16,
        pointerEvents:'none',
      }}>
        <div style={{display:'flex', alignItems:'center', gap:6, opacity:0.7}}>
          <svg width="14" height="14" viewBox="0 0 20 20"><path d="M10 14V6M6 9l4-4 4 4" stroke={T.soft} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          <span style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:1.1, textTransform:'uppercase'}}>следующий</span>
        </div>
        <div style={{width:1, height:12, background:T.divide}}/>
        <div style={{display:'flex', alignItems:'center', gap:6}}>
          <svg width="14" height="14" viewBox="0 0 20 20"><path d="M12 5l-5 5 5 5" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          <span style={{fontFamily:T.mono, fontSize:9, color:accent, letterSpacing:1.1, textTransform:'uppercase'}}>анкета</span>
        </div>
      </div>

      {/* full profile on swipe-left / tap */}
      <ProfileOverlay person={profile} accent={accent} onClose={() => setProfile(null)}/>
    </div>
  );
}

window.SwipeStack = SwipeStack;

// ─── Event info sheet — tap event marker to see what it is ──────
function EventInfoSheet({ accent = T.accent, count = 18, onClose, onViewPeople,
  kicker = 'конференция · майнинг и крипта', name = 'Mining Expo', ticketUrl = 'https://timepad.ru',
  rows = [
    {ic:'clock', main:'Сегодня · 18:00 – 23:00', sub:'до конца ещё 3 часа'},
    {ic:'pin',   main:'Депо · площадка', sub:'Лесная 20, 2 этаж'},
    {ic:'people', main:'18 человек рядом', sub:'отметились за последние 4 часа'},
  ] }) {
  return (
    <div style={{position:'absolute', inset:0, zIndex:55, animation:'fadeIn 0.2s ease-out'}}>
      <div onClick={onClose} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.5)'}}/>
      <div style={{
        position:'absolute', left:0, right:0, bottom:0,
        background:T.sheet, borderTop:`1px solid ${T.divide}`,
        borderRadius:'22px 22px 0 0', boxShadow:'0 -16px 48px rgba(0,0,0,0.6)',
        padding:'0 0 24px', overflow:'hidden',
        animation:'sheetUp 0.32s cubic-bezier(0.2,0.9,0.3,1)',
      }}>
        {/* cover */}
        <div style={{
          height:118, position:'relative',
          background:`linear-gradient(135deg, ${accent} 0%, ${accent}b0 100%)`,
          display:'flex', alignItems:'flex-end', padding:'0 18px 12px',
        }}>
          <div style={{position:'absolute', inset:0, opacity:0.16, backgroundImage:'radial-gradient(circle at 20% 30%, #fff 0, transparent 40%), radial-gradient(circle at 80% 60%, #fff 0, transparent 45%)'}}/>
          <div style={{
            position:'absolute', top:12, right:12,
            display:'flex', alignItems:'center', gap:5,
            padding:'4px 9px', borderRadius:20,
            background:T.glassFaint, backdropFilter:'blur(8px)',
          }}>
            <div style={{width:6, height:6, borderRadius:'50%', background:'#7DEBA8', boxShadow:'0 0 6px #7DEBA8'}}/>
            <span style={{fontFamily:T.mono, fontSize:8.5, color:'#fff', letterSpacing:1.2, textTransform:'uppercase', fontWeight:600}}>идёт сейчас</span>
          </div>
          <button onClick={onClose} aria-label="закрыть" style={{
            position:'absolute', top:10, left:12, width:30, height:30, borderRadius:9,
            border:'none', background:T.glassFaint, backdropFilter:'blur(8px)',
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11"><path d="M1 1l9 9M10 1l-9 9" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
          <div style={{position:'relative', zIndex:1}}>
            <div style={{fontFamily:T.mono, fontSize:9, color:'rgba(255,255,255,0.8)', letterSpacing:1.4, textTransform:'uppercase'}}>{kicker}</div>
            <div style={{fontFamily:T.serif, fontSize:24, fontWeight:700, color:'#fff', lineHeight:1.1, marginTop:2}}>{name}</div>
          </div>
        </div>

        {/* body */}
        <div style={{padding:'16px 18px 4px', display:'flex', flexDirection:'column', gap:14}}>
          {rows.map((r,i)=>(
            <div key={i} style={{display:'flex', alignItems:'center', gap:12}}>
              <div style={{
                width:38, height:38, borderRadius:11, flexShrink:0,
                background:`${accent}18`, border:`1px solid ${accent}33`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                {r.ic==='clock' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke={accent} strokeWidth="1.4"/><path d="M8 4.5V8l2.5 1.5" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                {r.ic==='pin' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 14s5-4.5 5-8A5 5 0 0 0 3 6c0 3.5 5 8 5 8Z" stroke={accent} strokeWidth="1.4" strokeLinejoin="round"/><circle cx="8" cy="6" r="1.8" fill={accent}/></svg>}
                {r.ic==='people' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="2.4" stroke={accent} strokeWidth="1.4"/><path d="M2 13q0-3.5 4-3.5t4 3.5" stroke={accent} strokeWidth="1.4" strokeLinecap="round"/><path d="M10.5 4.2q2.5.3 2.5 2.8" stroke={accent} strokeWidth="1.4" strokeLinecap="round"/></svg>}
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontFamily:T.sans, fontSize:13.5, fontWeight:600, color:T.ink, lineHeight:1.2}}>{r.main}</div>
                <div style={{fontFamily:T.sans, fontSize:11, color:T.soft, lineHeight:1.3, marginTop:1}}>{r.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* actions: билеты (сайт события) + войти */}
        <div style={{padding:'16px 18px 0', display:'flex', gap:8}}>
          <button onClick={()=>window.open(ticketUrl, '_blank')} style={{
            flex:1, height:50, borderRadius:14,
            border:`1px solid ${T.divide}`, background:T.surface,
            fontFamily:T.sans, fontSize:14, fontWeight:600, color:T.ink,
            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7,
          }}>
            Билеты
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M4.5 2H10v5.5M10 2L2 10" stroke={T.soft} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={()=>{ onClose && onClose(); onViewPeople && onViewPeople(); }} style={{
            flex:1.5, height:50, borderRadius:14, border:'none',
            background:`linear-gradient(135deg, ${accent}, ${accent}d0)`,
            fontFamily:T.sans, fontSize:14, fontWeight:700, color:'#fff',
            cursor:'pointer', boxShadow:`0 8px 22px ${accent}55`,
          }}>Войти</button>
        </div>
      </div>
      <style>{`@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } } @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`}</style>
    </div>
  );
}

// ─── GeoPicker overlay — user picks where to drop their pin ──────
function GeoPicker({ accent = T.accent, onConfirm, onCancel, snapped = { name:'Депо', dist:'15 м', tag:'площадка' } }) {
  const [duration, setDuration] = React.useState('2ч');
  return (
    <div style={{position:'absolute', inset:0, zIndex:45}}>
      {/* dim layer */}
      <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.42)', pointerEvents:'none'}}/>

      {/* subtle target ring */}
      <div style={{position:'absolute', left:'50%', top:'42%', transform:'translate(-50%,-50%)', width:72, height:72, pointerEvents:'none'}}>
        <div style={{
          position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
          width:72, height:72, borderRadius:'50%',
          border:'1px dashed rgba(255,255,255,0.14)',
        }}/>
      </div>

      {/* central pin + snapped venue label */}
      <div style={{position:'absolute', left:'50%', top:'42%', transform:'translate(-50%, -100%)', display:'flex', flexDirection:'column', alignItems:'center', gap:5, pointerEvents:'none'}}>
        <svg width="34" height="44" viewBox="0 0 42 54" fill="none" style={{filter:'drop-shadow(0 5px 9px rgba(0,0,0,0.4))'}}>
          <path d="M21 52 C21 52 5 30 5 18 A16 16 0 0 1 37 18 C37 30 21 52 21 52 Z"
                fill={`${accent}30`} stroke={accent} strokeWidth="1.6" strokeLinejoin="round"/>
          <circle cx="21" cy="18" r="4" fill={accent}/>
        </svg>
        <div style={{width:6, height:6, borderRadius:'50%', background:'#fff', boxShadow:`0 0 0 2px ${accent}`, marginTop:-4}}/>
      </div>

      {/* bottom action sheet */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0,
        padding:'18px 16px 26px',
        background:T.glassHi, backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
        borderTop:`1px solid ${T.divide}`,
        display:'flex', flexDirection:'column', gap:14,
      }}>
        <div>
          <div style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:1.4, textTransform:'uppercase', marginBottom:4}}>где ты будешь видим</div>
          <div style={{display:'flex', alignItems:'baseline', gap:8}}>
            <span style={{fontFamily:T.serif, fontSize:20, fontWeight:700, color:T.ink, lineHeight:1}}>{snapped.name}</span>
            <span style={{fontFamily:T.sans, fontSize:11, color:T.mid}}>{snapped.tag}</span>
            <span style={{fontFamily:T.mono, fontSize:10, color:T.soft, letterSpacing:0.4, marginLeft:'auto'}}>{snapped.dist} от тебя</span>
          </div>
        </div>

        <div style={{display:'flex', gap:6, alignItems:'center'}}>
          <span style={{fontFamily:T.mono, fontSize:9, color:T.soft, letterSpacing:1.3, textTransform:'uppercase'}}>на</span>
          {['1ч','2ч','весь вечер','постоянно'].map(d => {
            const on = duration === d;
            return (
              <button key={d} onClick={()=>setDuration(d)} style={{
                padding:'5px 10px', borderRadius:9,
                background: on ? `${accent}25` : 'transparent',
                border: on ? `1px solid ${accent}66` : `1px solid ${T.divide2}`,
                fontFamily:T.sans, fontSize:11, fontWeight:on?600:500,
                color: on ? accent : T.mid, cursor:'pointer',
              }}>{d}</button>
            );
          })}
        </div>

        <div style={{display:'flex', gap:8}}>
          <button onClick={onCancel} style={{
            padding:'13px 18px', borderRadius:14,
            background:'transparent', border:`1px solid ${T.divide}`,
            fontFamily:T.sans, fontSize:13, fontWeight:600, color:T.mid,
            cursor:'pointer',
          }}>Отмена</button>
          <button onClick={onConfirm} style={{
            flex:1, padding:'13px 18px', borderRadius:14,
            background:`linear-gradient(135deg, ${accent}, ${accent}d0)`,
            border:'none',
            fontFamily:T.sans, fontSize:13, fontWeight:700, color:'#fff',
            cursor:'pointer',
            boxShadow:`0 8px 22px ${accent}55`,
          }}>Поставить здесь</button>
        </div>
      </div>
    </div>
  );
}

window.GeoPicker = GeoPicker;
