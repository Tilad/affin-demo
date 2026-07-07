// Screen 6: Meeting result — confirm → exchange → done
// Closes the loop after the 15-min timer ends.
const { T, MIKHAIL } = window;

// ─── small shared bits ───────────────────────────────────
function ResultAvatar({ p = MIKHAIL, accent = T.accent, size = 58 }) {
  return (
    <div style={{
      width:size,height:size,borderRadius:'50%',overflow:'hidden',flexShrink:0,
      background:`${accent}1A`,border:`1.5px solid ${accent}55`,
      display:'flex',alignItems:'center',justifyContent:'center',
    }}>
      {p.photo
        ? <img src={p.photo} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        : <span style={{fontFamily:T.hand,fontSize:size*0.5,color:accent,fontWeight:700}}>{p.name[0]}</span>}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SCREEN 6: Result — stage: 'confirm' | 'exchange' | 'done'
// ═══════════════════════════════════════════════════
function ResultScreen({ accent = T.accent, stage = 'confirm', onMet, onSkip, onExchange, onDone, onBackToMap, onMessage }) {
  const p = MIKHAIL;

  // ── STAGE 1: confirm you actually met ──────────────────
  if (stage === 'confirm') {
    return (
      <div style={{
        position:'absolute',inset:0,background:T.bg,
        paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column',
      }}>
        <div style={{padding:'14px 22px 0',textAlign:'center'}}>
          <div style={{fontFamily:T.mono,fontSize:10,color:accent,letterSpacing:2.4,textTransform:'uppercase'}}>15 минут прошло</div>
        </div>

        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 26px'}}>
          {/* fading ring — time is up */}
          <div style={{position:'relative',width:120,height:120,marginBottom:8}}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" stroke={T.hi} strokeWidth="3" fill="none"/>
              <circle cx="60" cy="60" r="52" stroke={`${accent}40`} strokeWidth="3" fill="none"
                strokeDasharray={2*Math.PI*52} strokeDashoffset={2*Math.PI*52*0.995}
                transform="rotate(-90 60 60)" strokeLinecap="round"/>
            </svg>
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <ResultAvatar p={p} accent={accent} size={68}/>
            </div>
          </div>

          <div style={{fontFamily:T.serif,fontSize:28,fontWeight:700,color:T.ink,lineHeight:1.12,textAlign:'center',fontStyle:'italic',marginTop:10}}>
            Как прошло<br/>с {p.name}?
          </div>
          <div style={{fontFamily:T.body,fontSize:15,color:T.mid,textAlign:'center',marginTop:10,maxWidth:280,lineHeight:1.5}}>
            честно — без этого никто не узнает. это влияет только на то, кого показывать дальше.
          </div>
        </div>

        <div style={{padding:'0 22px max(28px, calc(14px + var(--sab)))',display:'flex',flexDirection:'column',gap:9}}>
          <button onClick={onMet} style={{
            width:'100%',padding:'15px 0',borderRadius:14,border:'none',
            background:accent,color:'#fff',
            fontFamily:T.sans,fontSize:15.5,fontWeight:600,cursor:'pointer',
            boxShadow:`0 6px 22px ${accent}50`,
            display:'flex',alignItems:'center',justifyContent:'center',gap:8,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8.5l4 4 8-9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Познакомились
          </button>
          <button onClick={onSkip} style={{
            width:'100%',padding:'13px 0',borderRadius:14,border:`1px solid ${T.divide}`,
            background:T.surface,color:T.mid,
            fontFamily:T.sans,fontSize:14,fontWeight:500,cursor:'pointer',
          }}>Не сложилось</button>
        </div>
      </div>
    );
  }

  // ── STAGE 2: exchange contact + light feedback ─────────
  if (stage === 'exchange') {
    return <ResultExchange accent={accent} p={p} onExchange={onExchange}/>;
  }

  // ── STAGE 3: done — added to network ───────────────────
  return (
    <div style={{
      position:'absolute',inset:0,background:T.bg,
      paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column',
    }}>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 26px'}}>
        {/* success check */}
        <div style={{
          width:88,height:88,borderRadius:'50%',
          background:`${accent}18`,border:`1.5px solid ${accent}55`,
          display:'flex',alignItems:'center',justifyContent:'center',marginBottom:22,
          boxShadow:`0 0 0 8px ${accent}0A`,
        }}>
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><path d="M9 20l6 6 14-15" stroke={accent} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>

        <div style={{fontFamily:T.serif,fontSize:27,fontWeight:700,color:T.ink,textAlign:'center',lineHeight:1.15,fontStyle:'italic'}}>
          {p.name} теперь<br/>в твоей сети
        </div>
        <div style={{fontFamily:T.body,fontSize:15,color:T.mid,textAlign:'center',marginTop:12,maxWidth:270,lineHeight:1.5}}>
          контакт сохранён. чат остаётся открытым — даже когда ивент закончится.
        </div>

        {/* saved contact chip */}
        <div style={{
          marginTop:24,display:'flex',alignItems:'center',gap:11,
          padding:'12px 16px 12px 12px',borderRadius:16,
          background:T.surface,border:`1px solid ${T.divide}`,
        }}>
          <ResultAvatar p={p} accent={accent} size={44}/>
          <div style={{minWidth:0}}>
            <div style={{fontFamily:T.serif,fontSize:15,fontWeight:700,color:T.ink,lineHeight:1.1}}>{p.name} {p.last}</div>
            <div style={{display:'flex',alignItems:'center',gap:6,marginTop:3}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill={accent}><path d="M9.8 16.6 9.5 20c.4 0 .6-.2.9-.4l2.1-2 4.3 3.1c.8.4 1.4.2 1.6-.7l2.9-13.6c.3-1.1-.4-1.6-1.1-1.3L2.5 10c-1.1.4-1.1 1-.2 1.3l4.4 1.4L17 6.3c.5-.3.9-.1.6.2z"/></svg>
              <span style={{fontFamily:T.mono,fontSize:11,color:accent,letterSpacing:0.3}}>@levitate_m</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{padding:'0 22px max(28px, calc(14px + var(--sab)))',display:'flex',flexDirection:'column',gap:9}}>
        <button onClick={onMessage} style={{
          width:'100%',padding:'15px 0',borderRadius:14,border:'none',
          background:accent,color:'#fff',
          fontFamily:T.sans,fontSize:15,fontWeight:600,cursor:'pointer',
          boxShadow:`0 6px 22px ${accent}50`,
        }}>Написать {p.name}</button>
        <button onClick={onBackToMap} style={{
          width:'100%',padding:'13px 0',borderRadius:14,border:`1px solid ${T.divide}`,
          background:T.surface,color:T.mid,
          fontFamily:T.sans,fontSize:14,fontWeight:500,cursor:'pointer',
        }}>Вернуться к карте</button>
      </div>
    </div>
  );
}

// ── Exchange sub-screen (own state for feedback + contact choice) ──
function ResultExchange({ accent = T.accent, p = MIKHAIL, onExchange }) {
  const [tags, setTags] = React.useState([]);
  const [method, setMethod] = React.useState('network'); // 'network' | 'telegram'
  const FEEDBACK = ['было полезно','приятный человек','хочу продолжить','по делу'];
  const toggle = (t) => setTags(s => s.includes(t) ? s.filter(x=>x!==t) : [...s,t]);

  return (
    <div style={{
      position:'absolute',inset:0,background:T.bg,
      paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column',
    }}>
      <div style={{padding:'14px 22px 4px',textAlign:'center'}}>
        <div style={{fontFamily:T.mono,fontSize:10,color:accent,letterSpacing:2.4,textTransform:'uppercase'}}>рады, что получилось</div>
        <div style={{fontFamily:T.serif,fontSize:25,fontWeight:700,color:T.ink,marginTop:8,fontStyle:'italic',lineHeight:1.15}}>
          Не теряйте связь
        </div>
      </div>

      <div className="noscroll" style={{flex:1,overflowY:'auto',padding:'16px 20px 8px'}}>
        {/* counterpart mini-card */}
        <div style={{
          display:'flex',alignItems:'center',gap:12,
          padding:'13px 14px',borderRadius:16,
          background:T.surface,border:`1px solid ${T.divide}`,marginBottom:18,
        }}>
          <ResultAvatar p={p} accent={accent} size={50}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:T.serif,fontSize:17,fontWeight:700,color:T.ink,lineHeight:1.1}}>{p.name} {p.last}</div>
            <div style={{fontFamily:T.sans,fontSize:12,color:T.mid,marginTop:2}}>{p.role} · {p.company}</div>
          </div>
        </div>

        {/* contact method */}
        <div style={{marginBottom:20}}>
          <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.6,textTransform:'uppercase',marginBottom:10}}>как остаться на связи</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {[
              {k:'network',t:'Добавить в мою сеть',s:'останется в Affin — чат + карточка навсегда'},
              {k:'telegram',t:'Обменяться Telegram',s:'@levitate_m — перейти в личку'},
            ].map(o=>{
              const on = method === o.k;
              return (
                <button key={o.k} onClick={()=>setMethod(o.k)} style={{
                  display:'flex',alignItems:'center',gap:12,textAlign:'left',
                  padding:'13px 14px',borderRadius:14,cursor:'pointer',
                  background: on ? `${accent}14` : T.surface,
                  border: on ? `1.5px solid ${accent}` : `1px solid ${T.divide}`,
                }}>
                  <div style={{
                    width:34,height:34,borderRadius:10,flexShrink:0,
                    background: on ? `${accent}22` : T.hi,
                    display:'flex',alignItems:'center',justifyContent:'center',
                  }}>
                    {o.k==='network'
                      ? <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><circle cx="7" cy="7" r="2.6" stroke={on?accent:T.mid} strokeWidth="1.5"/><path d="M2.5 16q0-4 4.5-4t4.5 4" stroke={on?accent:T.mid} strokeWidth="1.5" strokeLinecap="round"/><path d="M13 5.5q3 .4 3 3.4M13.5 12.5q3.5.4 3.5 3.5" stroke={on?accent:T.mid} strokeWidth="1.5" strokeLinecap="round"/></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill={on?accent:T.mid}><path d="M9.8 16.6 9.5 20c.4 0 .6-.2.9-.4l2.1-2 4.3 3.1c.8.4 1.4.2 1.6-.7l2.9-13.6c.3-1.1-.4-1.6-1.1-1.3L2.5 10c-1.1.4-1.1 1-.2 1.3l4.4 1.4L17 6.3c.5-.3.9-.1.6.2z"/></svg>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:T.sans,fontSize:14,fontWeight:600,color:T.ink,lineHeight:1.2}}>{o.t}</div>
                    <div style={{fontFamily:T.sans,fontSize:11,color:T.soft,marginTop:2,lineHeight:1.3}}>{o.s}</div>
                  </div>
                  <div style={{
                    width:20,height:20,borderRadius:'50%',flexShrink:0,
                    border: on ? `6px solid ${accent}` : `1.5px solid ${T.soft}`,
                    transition:'all 0.15s',
                  }}/>
                </button>
              );
            })}
          </div>
        </div>

        {/* quick feedback */}
        <div style={{marginBottom:8}}>
          <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,letterSpacing:1.6,textTransform:'uppercase',marginBottom:10}}>
            пометь для себя <span style={{textTransform:'none',letterSpacing:0}}>· необязательно</span>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
            {FEEDBACK.map(t=>{
              const on = tags.includes(t);
              return (
                <button key={t} onClick={()=>toggle(t)} style={{
                  padding:'8px 13px',borderRadius:20,cursor:'pointer',
                  background: on ? `${accent}20` : 'transparent',
                  border: on ? `1px solid ${accent}66` : `1px solid ${T.divide}`,
                  fontFamily:T.body,fontSize:14,fontStyle:'italic',
                  color: on ? accent : T.mid,
                }}>{t}</button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{padding:'12px 22px max(28px, calc(14px + var(--sab)))',borderTop:`1px solid ${T.divide}`}}>
        <button onClick={onExchange} style={{
          width:'100%',padding:'15px 0',borderRadius:14,border:'none',
          background:accent,color:'#fff',
          fontFamily:T.sans,fontSize:15,fontWeight:600,cursor:'pointer',
          boxShadow:`0 6px 22px ${accent}50`,
        }}>{method==='telegram' ? 'Открыть Telegram' : 'Добавить в сеть'}</button>
      </div>
    </div>
  );
}

window.ResultScreen = ResultScreen;
