// Screens 3, 4, 5: Match, Chat, Meeting
const { T, MARINA, MIKHAIL } = window;

// ═══════════════════════════════════════════════════
// SCREEN 3: Match — calm two-cards converging
// ═══════════════════════════════════════════════════
function MatchScreen({ accent = T.accent, animate = true, onContinue, onLater, onClose }) {
  const [phase, setPhase] = React.useState(animate ? 0 : 2);

  React.useEffect(() => {
    if (!animate) return;
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [animate]);

  const intersect = ['AI в дизайне', 'B2B onboarding', 'дизайн-партнёрство'];

  return (
    <div style={{
      position:'absolute',inset:0,background:T.bg,
      paddingTop:'calc(12px + var(--sat))',
      display:'flex',flexDirection:'column',overflow:'hidden',
    }}>
      {/* Close */}
      <div style={{padding:'10px 16px 0',display:'flex',justifyContent:'flex-end'}}>
        <button onClick={onClose} style={{
          width:36,height:36,borderRadius:11,border:`1px solid ${T.divide}`,
          background:T.surface,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
        }}>
          <svg width="11" height="11" viewBox="0 0 11 11"><path d="M1 1l9 9M10 1l-9 9" stroke={T.mid} strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div className="noscroll" style={{flex:1,minHeight:0,overflowY:'auto',display:'flex',flexDirection:'column'}}>
      {/* Heading */}
      <div style={{padding:'10px 22px 6px',textAlign:'center'}}>
        <div style={{fontFamily:T.mono,fontSize:10,color:accent,letterSpacing:2.4,textTransform:'uppercase',marginBottom:8}}>взаимный интерес</div>
        <div style={{fontFamily:T.serif,fontSize:30,fontWeight:700,color:T.ink,lineHeight:1.1,fontStyle:'italic'}}>Вы оба хотите<br/>поговорить</div>
        <div style={{marginTop:10,fontFamily:T.body,fontSize:15,color:T.mid}}>теперь открыт чат</div>
      </div>

      {/* Two cards converging */}
      <div style={{
        flex:1,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',
        padding:'0 22px',minHeight:200,
      }}>
        {/* connecting line */}
        <div style={{
          position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',
          width: phase >= 2 ? 80 : 0, height:1.5, background:`${accent}80`,
          transition:'width 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s',
        }}>
          <div style={{
            position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',
            width:8,height:8,borderRadius:'50%',background:accent,
            opacity: phase >= 2 ? 1 : 0,
            boxShadow:`0 0 12px ${accent}`,
            transition:'opacity 0.4s 0.7s',
          }}/>
        </div>

        {/* left card — Marina */}
        <div style={{
          width:150,padding:'18px 14px',borderRadius:18,
          background:T.surface,border:`1.5px solid ${accent}50`,
          boxShadow:`0 8px 24px rgba(0,0,0,0.4)`,
          textAlign:'center',
          transform: phase === 0 ? 'translateX(-60px) scale(0.95) rotate(-3deg)' : 'translateX(20px) scale(1) rotate(-2deg)',
          opacity: phase === 0 ? 0 : 1,
          transition:'all 0.7s cubic-bezier(0.34,1.2,0.64,1)',
          zIndex:2,
        }}>
          <div style={{
            width:64,height:64,borderRadius:'50%',margin:'0 auto 10px',
            background:`${accent}1A`,border:`1.5px solid ${accent}60`,
            display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            <span style={{fontFamily:T.hand,fontSize:24,color:accent,fontWeight:700}}>М</span>
          </div>
          <div style={{fontFamily:T.serif,fontSize:13,fontWeight:700,color:T.ink}}>{MARINA.name} {MARINA.last}</div>
          <div style={{fontFamily:T.sans,fontSize:10,color:T.soft,marginTop:2,lineHeight:1.3}}>{MARINA.role}</div>
        </div>

        {/* right card — Mikhail */}
        <div style={{
          width:150,padding:'18px 14px',borderRadius:18,
          background:T.surface,border:`1.5px solid ${accent}50`,
          boxShadow:`0 8px 24px rgba(0,0,0,0.4)`,
          textAlign:'center',
          transform: phase === 0 ? 'translateX(60px) scale(0.95) rotate(3deg)' : 'translateX(-20px) scale(1) rotate(2deg)',
          opacity: phase === 0 ? 0 : 1,
          transition:'all 0.7s cubic-bezier(0.34,1.2,0.64,1)',
          zIndex:1,
        }}>
          <div style={{
            width:64,height:64,borderRadius:'50%',margin:'0 auto 10px',
            background:`${accent}1A`,border:`1.5px solid ${accent}60`,
            display:'flex',alignItems:'center',justifyContent:'center',
          }}>
            <span style={{fontFamily:T.hand,fontSize:24,color:accent,fontWeight:700}}>М</span>
          </div>
          <div style={{fontFamily:T.serif,fontSize:13,fontWeight:700,color:T.ink}}>{MIKHAIL.name} {MIKHAIL.last}</div>
          <div style={{fontFamily:T.sans,fontSize:10,color:T.soft,marginTop:2,lineHeight:1.3}}>{MIKHAIL.role}</div>
        </div>
      </div>

      {/* Common topics — из пересечения интересов */}
      <div style={{padding:'0 22px 4px',textAlign:'center',
        opacity: phase >= 2 ? 1 : 0, transition:'opacity 0.5s 0.9s'}}>
        <div style={{fontFamily:T.mono,fontSize:8.5,color:T.soft,letterSpacing:1.6,textTransform:'uppercase',marginBottom:9}}>общие темы</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',justifyContent:'center'}}>
          {intersect.map((t,i)=>(
            <span key={i} style={{fontFamily:T.sans,fontSize:12,color:T.mid,padding:'6px 13px',
              borderRadius:100,background:T.surface,border:`1px solid ${T.divide}`}}>{t}</span>
          ))}
        </div>
      </div>

      {/* Conversation pull — motivate, not duplicate */}
      <div style={{padding:'8px 22px 0'}}>
        <div style={{
          padding:'16px 18px',borderRadius:16,
          background:T.surface,border:`1px solid ${T.divide}`,
          position:'relative',
        }}>
          <div style={{
            position:'absolute',left:18,top:-9,
            padding:'2px 9px',borderRadius:7,background:T.bg,
            fontFamily:T.mono,fontSize:8.5,color:T.soft,letterSpacing:1.4,textTransform:'uppercase',
          }}>с чего начать</div>

          <div style={{fontFamily:T.serif,fontSize:18,fontStyle:'italic',color:T.ink,lineHeight:1.4,marginBottom:8}}>
            «какой инструмент тебя последний раз удивил?»
          </div>
          <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.2,textTransform:'uppercase',marginBottom:12}}>
            ↑ это вопрос Михаила. ответь — и завяжется
          </div>

          <div style={{
            display:'flex',alignItems:'center',gap:8,
            paddingTop:10,borderTop:`1px solid ${T.divide}`,
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" style={{flexShrink:0}}>
              <circle cx="6.5" cy="6.5" r="5.5" stroke={accent} strokeWidth="1.2" fill="none"/>
              <path d="M6.5 3.5v3l2 1.5" stroke={accent} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <span style={{fontFamily:T.body,fontSize:12.5,color:T.mid,flex:1,fontStyle:'italic'}}>
              матч живёт 3 дня — кто первый напишет, того и день
            </span>
          </div>
        </div>
      </div>

      </div>

      {/* CTAs — всегда видны, середина скроллится при нехватке высоты */}
      <div style={{padding:'14px 22px 28px',flexShrink:0}}>
        <div style={{display:'flex',gap:8}}>
          <button onClick={onLater} style={{
            flex:1,padding:'14px 0',borderRadius:14,border:`1px solid ${T.divide}`,
            background:T.surface,color:T.mid,
            fontFamily:T.sans,fontSize:14,fontWeight:500,cursor:'pointer',
          }}>Позже</button>
          <button onClick={onContinue} style={{
            flex:2,padding:'14px 0',borderRadius:14,border:'none',
            background:accent,color:'#fff',
            fontFamily:T.sans,fontSize:15,fontWeight:600,
            boxShadow:`0 6px 22px ${accent}50`,cursor:'pointer',
          }}>Ответить Михаилу →</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SCREEN 4: Chat with meeting CTA
// ═══════════════════════════════════════════════════
function ChatScreen({ accent = T.accent, stage = 'mid', onStartMeeting, onBack, onOpenProfile, onLeaveMatch }) {
  // stage: 'empty' | 'starter' | 'mid' | 'ready'
  const seed = stage === 'empty' ? []
    : stage === 'starter' ? [
        { from:'me', text:'привет! увидел твой кейс с B2B-онбордингом — у меня сейчас как раз ai-ассистент в эту тему' },
      ]
    : stage === 'mid' ? [
        { from:'me', text:'привет! увидел твой кейс с B2B-онбордингом — у меня сейчас как раз ai-ассистент в эту тему' },
        { from:'them', text:'привет! да, как раз в это копаю. ты на конфе до конца?' },
        { from:'me', text:'до 19:00. кофе?', when:'14:42' },
      ]
    : [ // ready
        { from:'me', text:'привет! увидел твой кейс с B2B-онбордингом — у меня сейчас как раз ai-ассистент в эту тему' },
        { from:'them', text:'привет! да, как раз в это копаю. ты на конфе до конца?' },
        { from:'me', text:'до 19:00. кофе?', when:'14:42' },
        { from:'them', text:'давай через 10 минут, у входа в Hall A' },
        { from:'me', text:'+', when:'14:48' },
      ];

  const [messages, setMessages] = React.useState(seed);
  const [draft, setDraft] = React.useState('');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const scrollRef = React.useRef(null);
  const send = () => { const t = draft.trim(); if (!t) return; setMessages(m => [...m, { from:'me', text:t, when:'сейчас' }]); setDraft(''); };
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  // pinned meeting CTA visible once both engaged
  const showCta = stage === 'mid' || stage === 'ready';

  return (
    <div style={{
      position:'absolute',inset:0,background:T.bg,
      paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column',
    }}>
      {/* Header */}
      <div style={{
        padding:'10px 14px 12px',display:'flex',alignItems:'center',gap:10,
        borderBottom:`1px solid ${T.divide}`,
      }}>
        <button onClick={onBack} style={{
          width:34,height:34,borderRadius:10,border:'none',
          background:'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
        }}>
          <svg width="7" height="12" viewBox="0 0 7 12"><path d="M6 1L1 6l5 5" stroke={T.mid} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{
          width:38,height:38,borderRadius:'50%',flexShrink:0,
          background:`${accent}1A`,border:`1.5px solid ${accent}50`,
          display:'flex',alignItems:'center',justifyContent:'center',
        }}>
          <span style={{fontFamily:T.hand,fontSize:20,color:accent,fontWeight:700}}>М</span>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:T.serif,fontSize:16,fontWeight:700,color:T.ink}}>{MIKHAIL.name} {MIKHAIL.last}</div>
          <div style={{display:'flex',alignItems:'center',gap:5,marginTop:1}}>
            <div style={{width:5,height:5,borderRadius:'50%',background:accent}}/>
            <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1}}>на Mining Expo · {stage === 'empty' ? 'матч 3д' : stage === 'starter' ? 'матч 2д' : 'на связи'}</span>
          </div>
        </div>
        <button onClick={()=>setMenuOpen(true)} style={{
          width:34,height:34,borderRadius:10,border:'none',background:'transparent',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
        }}>
          <svg width="14" height="3" viewBox="0 0 14 3"><circle cx="2" cy="1.5" r="1.3" fill={T.soft}/><circle cx="7" cy="1.5" r="1.3" fill={T.soft}/><circle cx="12" cy="1.5" r="1.3" fill={T.soft}/></svg>
        </button>
      </div>

      {/* Pinned meeting CTA — visible whenever both have engaged */}
      {showCta && (
        <div style={{
          padding:'10px 14px',
          borderBottom:`1px solid ${T.divide}`,
          background:T.bg,
        }}>
          <div style={{
            padding:'12px 14px',borderRadius:14,
            background:`linear-gradient(135deg, ${accent}1A 0%, ${accent}08 100%)`,
            border:`1px solid ${accent}40`,
            display:'flex',gap:11,alignItems:'center',
          }}>
            <div style={{
              width:36,height:36,borderRadius:11,flexShrink:0,
              background:`${accent}25`,border:`1px solid ${accent}50`,
              display:'flex',alignItems:'center',justifyContent:'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke={accent} strokeWidth="1.4"/>
                <path d="M8 4v4l3 2" stroke={accent} strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:T.serif,fontSize:14.5,fontWeight:700,color:T.ink,fontStyle:'italic'}}>Начать встречу</div>
              <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.1,textTransform:'uppercase',marginTop:3}}>
                только когда уже рядом
              </div>
            </div>
            <button onClick={onStartMeeting} style={{
              padding:'8px 14px',borderRadius:11,border:'none',
              background:accent,color:'#fff',
              fontFamily:T.sans,fontSize:12.5,fontWeight:600,cursor:'pointer',
              boxShadow:`0 4px 14px ${accent}40`,
            }}>Начать</button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} style={{
        flex:1,padding:'14px 14px',overflowY:'auto',
        display:'flex',flexDirection:'column',gap:8,
      }} className="noscroll">

        {/* Match note — marginTop:auto прижимает короткую переписку к инпуту */}
        <div style={{textAlign:'center',padding:'8px 0',marginTop:'auto'}}>
          <span style={{
            fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.4,
            padding:'4px 10px',borderRadius:8,background:T.surface,
          }}>матч · сегодня в 14:30</span>
        </div>

        {stage === 'empty' && (
          <div style={{padding:'20px 14px',textAlign:'center'}}>
            <div style={{fontFamily:T.body,fontSize:15,color:T.mid,fontStyle:'italic',marginBottom:14,lineHeight:1.5}}>
              Тишина. Может, начать с того, что М. спросил у тебя в карточке?
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:7}}>
              {MIKHAIL.ice.map((q,i)=>(
                <button key={i} onClick={()=>setMessages(m=>[...m,{from:'me',text:q,when:'сейчас'}])} style={{
                  padding:'10px 14px',borderRadius:12,
                  background:`${accent}10`,border:`1px solid ${accent}30`,
                  fontFamily:T.body,fontSize:14,fontStyle:'italic',color:T.ink,
                  cursor:'pointer',textAlign:'left',
                }}>«{q}»</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m,i)=>(
          <React.Fragment key={i}>
          <div style={{
            alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
            maxWidth:'78%',
          }}>
            <div style={{
              padding:'10px 13px',borderRadius:14,
              background: m.from === 'me' ? accent : T.surface,
              color: m.from === 'me' ? '#fff' : T.ink,
              fontFamily:T.sans,fontSize:14.5,lineHeight:1.4,
              borderTopLeftRadius: m.from === 'me' ? 14 : 4,
              borderTopRightRadius: m.from === 'me' ? 4 : 14,
            }}>{m.text}</div>
            {m.when && <div style={{
              fontFamily:T.mono,fontSize:8.5,color:T.soft,
              textAlign: m.from === 'me' ? 'right' : 'left',
              marginTop:3,paddingRight: m.from === 'me' ? 6 : 0, paddingLeft: m.from === 'me' ? 0 : 6,
            }}>{m.when}</div>}
          </div>
          </React.Fragment>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding:'10px 14px 22px',
        borderTop:`1px solid ${T.divide}`,
        display:'flex',gap:8,alignItems:'flex-end',
      }}>
        <button style={{
          width:38,height:38,borderRadius:11,border:`1px solid ${T.divide}`,
          background:T.surface,display:'flex',alignItems:'center',justifyContent:'center',
          flexShrink:0,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke={T.mid} strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>
        <input
          value={draft}
          onChange={e=>setDraft(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); send(); } }}
          placeholder="сообщение…"
          style={{
            flex:1,minHeight:38,padding:'9px 12px',borderRadius:12,
            background:T.hi,border:`1px solid ${T.divide}`,
            fontFamily:T.body,fontSize:14,color:T.ink,outline:'none',
          }}/>
        <button onClick={send} style={{
          width:38,height:38,borderRadius:11,border:'none',background:accent,
          display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,cursor:'pointer',
          boxShadow:`0 4px 14px ${accent}40`,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 7h12M7 1l6 6-6 6" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {menuOpen && (
        <div style={{position:'absolute',inset:0,zIndex:60}} onClick={()=>setMenuOpen(false)}>
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.4)'}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:92,right:12,minWidth:196,
            background:T.sheet,border:`1px solid ${T.divide}`,borderRadius:14,overflow:'hidden',
            boxShadow:'0 16px 40px rgba(0,0,0,0.6)'}}>
            {[
              {t:'Открыть профиль', act:()=>{ setMenuOpen(false); onOpenProfile && onOpenProfile(); }},
              {t:'Заглушить чат', act:()=>setMenuOpen(false)},
              {t:'Убрать матч', danger:true, act:()=>{ setMenuOpen(false); (onLeaveMatch||onBack) && (onLeaveMatch||onBack)(); }},
              {t:'Пожаловаться', danger:true, act:()=>setMenuOpen(false)},
            ].map((o,i)=>(
              <button key={i} onClick={o.act} style={{width:'100%',textAlign:'left',padding:'12px 15px',border:'none',
                borderTop: i===0?'none':`1px solid ${T.divide2}`,background:'transparent',cursor:'pointer',
                fontFamily:T.sans,fontSize:14,color: o.danger?'#E0674A':T.ink}}>{o.t}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SCREEN 5: Meeting — QR + 15-min timer
// ═══════════════════════════════════════════════════
function StylizedQR({ accent = T.accent, size = 200 }) {
  // Pseudo-random pattern that looks like a QR
  const cells = 21;
  const cell = size / cells;
  const seed = (i,j) => ((i * 73 + j * 41 + i*j*13) % 17) > 8;
  const isFinder = (i,j) => (i < 7 && j < 7) || (i < 7 && j >= cells-7) || (i >= cells-7 && j < 7);

  return (
    <div style={{
      width:size+24, height:size+24, padding:12, borderRadius:18,
      background:T.surface, border:`1px solid ${accent}40`,
      boxShadow:`0 0 0 6px rgba(255,88,32,0.06), 0 16px 48px rgba(0,0,0,0.5)`,
      position:'relative',
    }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Finder squares */}
        {[[0,0],[0,cells-7],[cells-7,0]].map(([fy,fx],k)=>(
          <g key={k}>
            <rect x={fx*cell} y={fy*cell} width={7*cell} height={7*cell} fill={accent}/>
            <rect x={(fx+1)*cell} y={(fy+1)*cell} width={5*cell} height={5*cell} fill={T.surface}/>
            <rect x={(fx+2)*cell} y={(fy+2)*cell} width={3*cell} height={3*cell} fill={accent}/>
          </g>
        ))}
        {/* Data squares */}
        {Array.from({length:cells}).map((_,i)=>
          Array.from({length:cells}).map((__,j)=>{
            if (isFinder(i,j)) return null;
            if (!seed(i,j)) return null;
            return <rect key={`${i}-${j}`} x={j*cell} y={i*cell} width={cell-0.4} height={cell-0.4} fill={accent} rx={cell*0.2}/>;
          })
        )}
        {/* Center logo plate */}
        <rect x={size/2 - 18} y={size/2 - 18} width={36} height={36} rx={10} fill={T.surface} stroke={accent} strokeWidth="1.5"/>
        <text x={size/2} y={size/2 + 8} textAnchor="middle" fontFamily="'Caveat', cursive" fontSize="22" fontWeight="700" fill={accent}>A</text>
      </svg>
      {/* Live indicator */}
      <div style={{
        position:'absolute',top:18,right:18,
        display:'flex',alignItems:'center',gap:5,
        padding:'3px 8px',borderRadius:8,background:T.bg,
        border:`1px solid ${accent}40`,
      }}>
        <div style={{
          width:5,height:5,borderRadius:'50%',background:accent,
          animation:'qrLive 1.5s ease-in-out infinite',
        }}/>
        <span style={{fontFamily:T.mono,fontSize:8,color:accent,letterSpacing:1.2}}>LIVE</span>
      </div>
      <style>{`
        @keyframes qrLive { 0%,100% { opacity:1 } 50% { opacity:0.3 } }
      `}</style>
    </div>
  );
}

// Meeting — pre-scan state (QR view)
function MeetingPreScan({ accent = T.accent, onScanned, onCancel }) {
  return (
    <div style={{
      position:'absolute',inset:0,background:T.bg,
      paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column',
    }}>
      <div style={{padding:'10px 14px 0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <button onClick={onCancel} style={{
          padding:'7px 12px',borderRadius:10,border:`1px solid ${T.divide}`,
          background:T.surface,color:T.mid,
          fontFamily:T.sans,fontSize:12.5,cursor:'pointer',
        }}>Отмена</button>
        <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.6,textTransform:'uppercase'}}>встреча · ожидаем</span>
        <div style={{width:60}}/>
      </div>

      <div style={{padding:'18px 22px 10px',textAlign:'center'}}>
        <div style={{fontFamily:T.serif,fontSize:28,fontWeight:700,color:T.ink,lineHeight:1.1}}>Начните встречу</div>
        <div style={{marginTop:9,fontFamily:T.body,fontSize:15,color:T.mid,lineHeight:1.5,fontStyle:'italic'}}>
          Мы не обещаем магию,<br/>но обещаем 15 минут рядом.
        </div>
      </div>

      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>
          <div onClick={onScanned} style={{cursor: onScanned ? 'pointer' : 'default'}}>
            <StylizedQR accent={accent} size={184}/>
          </div>
          <div style={{marginTop:18,fontFamily:T.mono,fontSize:9.5,color:T.soft,letterSpacing:1.6,textTransform:'uppercase',marginBottom:5}}>
            Михаил · отсканируй
          </div>
          <div style={{fontFamily:T.body,fontSize:14,color:T.mid,maxWidth:260,margin:'0 auto',fontStyle:'italic'}}>
            покажи этот код Михаилу — он отсканирует со своего телефона
          </div>
        </div>
      </div>

      <div style={{padding:'14px 22px 28px'}}>
        <div style={{
          padding:'11px 14px',borderRadius:12,
          background:T.surface,border:`1px solid ${T.divide}`,
          display:'flex',gap:9,alignItems:'flex-start',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" style={{flexShrink:0,marginTop:1}}>
            <circle cx="7" cy="7" r="5.5" stroke={T.soft} strokeWidth="1.2" fill="none"/>
            <path d="M7 4v4M7 10v0.3" stroke={T.soft} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span style={{fontFamily:T.body,fontSize:13,color:T.mid,lineHeight:1.4}}>
            Affin за живые встречи. После скана будет 15 минут — пообщайтесь и не расходитесь.
          </span>
        </div>
      </div>
    </div>
  );
}

// Meeting — running state (timer melting)
function MeetingRunning({ accent = T.accent, secondsLeft = 712, onFinish, onCancel }) {
  // 712s ≈ 11:52 left of 15:00
  const total = 15 * 60;
  const elapsed = total - secondsLeft;
  const pct = elapsed / total;
  const min = Math.floor(secondsLeft / 60);
  const sec = secondsLeft % 60;

  // ring
  const R = 104;
  const C = 2 * Math.PI * R;

  return (
    <div style={{
      position:'absolute',inset:0,background:T.bg,
      paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column',
    }}>
      <div style={{padding:'10px 14px 0',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{
          display:'flex',alignItems:'center',gap:6,
          padding:'5px 11px',borderRadius:9,
          background:`${accent}18`,border:`1px solid ${accent}40`,
        }}>
          <div style={{width:6,height:6,borderRadius:'50%',background:accent,boxShadow:`0 0 6px ${accent}`}}/>
          <span style={{fontFamily:T.mono,fontSize:9.5,color:accent,letterSpacing:1.4,textTransform:'uppercase'}}>встреча идёт</span>
        </div>
        <button onClick={onCancel} style={{
          padding:'7px 11px',borderRadius:10,border:`1px solid ${T.divide}`,
          background:T.surface,color:T.mid,fontFamily:T.sans,fontSize:12,cursor:'pointer',
        }}>Отменить</button>
      </div>

      <div style={{padding:'14px 22px 4px',textAlign:'center'}}>
        <div style={{fontFamily:T.serif,fontSize:24,fontWeight:700,color:T.ink,fontStyle:'italic'}}>с Михаилом</div>
        <div style={{marginTop:5,fontFamily:T.body,fontSize:14,color:T.mid}}>не расходитесь — подтвердите в конце</div>
      </div>

      {/* Timer ring with melting drip */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        <div style={{position:'relative',width:R*2 + 30,height:R*2 + 30}}>
          <svg width={R*2 + 30} height={R*2 + 30} viewBox={`0 0 ${R*2 + 30} ${R*2 + 30}`}>
            <defs>
              <linearGradient id="timerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={accent}/>
                <stop offset="100%" stopColor="#FF8A4D"/>
              </linearGradient>
            </defs>
            {/* track */}
            <circle cx={R+15} cy={R+15} r={R} stroke={T.hi} strokeWidth="3" fill="none"/>
            {/* progress (top → clockwise) */}
            <circle
              cx={R+15} cy={R+15} r={R}
              stroke="url(#timerGrad)" strokeWidth="3" fill="none"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              transform={`rotate(-90 ${R+15} ${R+15})`}
            />
            {/* tick marks every minute */}
            {Array.from({length:15}).map((_,i)=>{
              const ang = (i/15)*2*Math.PI - Math.PI/2;
              const x1 = R+15 + (R-7)*Math.cos(ang);
              const y1 = R+15 + (R-7)*Math.sin(ang);
              const x2 = R+15 + (R-3)*Math.cos(ang);
              const y2 = R+15 + (R-3)*Math.sin(ang);
              const passed = (i/15) < pct;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={passed ? `${accent}80` : T.divide} strokeWidth="1"/>;
            })}
            {/* drip — "time melting" — head of progress, in SVG so positioning is exact */}
            {(() => {
              const ang = (pct)*2*Math.PI - Math.PI/2;
              const cx = R+15 + R*Math.cos(ang);
              const cy = R+15 + R*Math.sin(ang);
              return (
                <g>
                  <circle cx={cx} cy={cy} r="7" fill={accent} opacity="0.25"/>
                  <circle cx={cx} cy={cy} r="4" fill={accent}/>
                </g>
              );
            })()}
          </svg>
          {/* center label */}
          <div style={{
            position:'absolute',inset:0,display:'flex',flexDirection:'column',
            alignItems:'center',justifyContent:'center',pointerEvents:'none',
          }}>
            <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.6,textTransform:'uppercase'}}>осталось</div>
            <div style={{
              fontFamily:T.serif,fontSize:48,fontWeight:700,color:T.ink,
              lineHeight:1,letterSpacing:-1,marginTop:4,
              fontVariantNumeric:'tabular-nums',
            }}>{String(min).padStart(2,'0')}:{String(sec).padStart(2,'0')}</div>
            <div style={{fontFamily:T.body,fontSize:13,color:T.mid,marginTop:4,fontStyle:'italic'}}>из 15 минут</div>
          </div>
        </div>
      </div>

      {/* Icebreaker hint */}
      <div style={{padding:'0 22px 18px'}}>
        <div style={{
          padding:'12px 14px',borderRadius:13,
          background:T.surface,border:`1px solid ${T.divide}`,
        }}>
          <div style={{fontFamily:T.mono,fontSize:8.5,color:T.soft,letterSpacing:1.4,textTransform:'uppercase',marginBottom:6}}>если неловко начать</div>
          <div style={{fontFamily:T.body,fontSize:14.5,color:T.ink,fontStyle:'italic',lineHeight:1.4}}>
            «{MIKHAIL.ice[0]}»
          </div>
        </div>
      </div>

      <div style={{padding:'0 22px 28px'}}>
        {onFinish ? (
          <button onClick={onFinish} style={{
            width:'100%',padding:'13px 0',borderRadius:14,border:`1px solid ${accent}55`,
            background:`${accent}12`,color:accent,
            fontFamily:T.sans,fontSize:14,fontWeight:600,cursor:'pointer',
          }}>Завершить и подтвердить</button>
        ) : (
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
            <span style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.2}}>после таймера — подтверждение завершения</span>
          </div>
        )}
      </div>
    </div>
  );
}

window.MatchScreen = MatchScreen;
window.ChatScreen = ChatScreen;
window.MeetingPreScan = MeetingPreScan;
window.StylizedQR = StylizedQR;
window.MeetingRunning = MeetingRunning;
