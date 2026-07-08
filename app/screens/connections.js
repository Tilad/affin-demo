// Screen: Мои связи — граф контактов и запросы о помощи.
// Вход — плитка «7 встреч» на экране «Я» (profile.js). Не отдельный таб:
// живёт как под-экран профиля, как edit/settings/billing.
const { T, MARINA, PEOPLE } = window;

// Кого реально «встретили» на событиях — демо-срез поверх существующего PEOPLE.
// meetings>1 — повторный контакт (крепче связь), остальное — разовое знакомство.
const CONNECTIONS = [
  { id:'p2', event:'Mining Expo',  when:'сегодня', meetings:2 },
  { id:'p1', event:'Mining Expo',  when:'вчера',   meetings:1 },
  { id:'p4', event:'Mining Expo',  when:'сегодня', meetings:1 },
  { id:'p3', event:'Product Sense',when:'март',    meetings:1 },
  { id:'p6', event:'Product Sense',when:'март',    meetings:1 },
];

// Автосведение: пересечение want одного контакта × give другого — оба поля
// реальные, взятые из PEOPLE в tokens.js (Михаил ищет 'дизайн-партнёр', у Ани
// в give — 'UX-ревью'/'айдентика'). Один демо-мостик, не общий алгоритм.
const BROKER_SUGGESTIONS = [
  { askId:'p2', helpId:'p1', tag:'дизайн-партнёр' },
];

const personOf = (id) => PEOPLE.find(p => p.id === id);

function GiveTags({ items }) {
  if (!items || !items.length) return null;
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
      {items.map((t,i)=>(
        <span key={i} style={{
          padding:'3px 9px',borderRadius:11,fontFamily:T.sans,fontSize:11,fontWeight:500,
          background:'rgba(80,180,120,0.12)',color:'rgba(120,210,150,0.95)',
          border:'1px solid rgba(80,180,120,0.26)',
        }}>{t}</span>
      ))}
    </div>
  );
}

function WantTags({ items, accent }) {
  if (!items || !items.length) return null;
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
      {items.map((t,i)=>(
        <span key={i} style={{
          padding:'3px 9px',borderRadius:11,fontFamily:T.sans,fontSize:11,fontWeight:500,
          background:`${accent}14`,color:accent,border:`1px solid ${accent}30`,
        }}>{t}</span>
      ))}
    </div>
  );
}

// ── строка контакта (таб «Контакты») ─────────────────────
function ContactRow({ conn, accent, onOpen }) {
  const p = personOf(conn.id);
  if (!p) return null;
  const strong = conn.meetings > 1;
  return (
    <button onClick={()=>onOpen&&onOpen(p)} style={{
      width:'100%',textAlign:'left',border:'none',cursor:'pointer',
      display:'flex',gap:12,padding:'12px 13px',borderRadius:16,
      background:T.surface,border:`1px solid ${strong ? accent+'40' : T.divide}`,
    }}>
      <div style={{
        width:48,height:48,borderRadius:'50%',overflow:'hidden',flexShrink:0,
        border: strong ? `2px solid ${accent}` : `1.5px solid ${T.divide}`,
      }}>
        <img src={p.photo} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontFamily:T.serif,fontSize:15,fontWeight:700,color:T.ink}}>{p.name}</span>
          {strong && (
            <span style={{fontFamily:T.mono,fontSize:8,color:accent,letterSpacing:0.6,textTransform:'uppercase'}}>★ повторно</span>
          )}
        </div>
        <div style={{fontFamily:T.sans,fontSize:11.5,color:T.mid,marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.role}</div>
        <div style={{display:'flex',alignItems:'center',gap:5,marginTop:5}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:'rgba(80,180,120,0.9)'}}/>
          <span style={{fontFamily:T.mono,fontSize:9,color:'rgba(120,210,150,0.85)'}}>встречались лично · {conn.event}</span>
        </div>
        {p.give && p.give.length > 0 && (
          <div style={{marginTop:7}}><GiveTags items={p.give}/></div>
        )}
      </div>
    </button>
  );
}

// ── свайп-колода запросов (таб «Запросы») ────────────────
// Компонент на уровне модуля (не внутри ConnectionsScreen) — см. CLAUDE.md:
// пересоздание жестовых компонентов на каждом рендере рвёт touch на телефоне.
function RequestSwipeCard({ p, k, top, accent }) {
  return (
    <div data-slot={top ? 'top' : 'behind'} style={{
      position:'absolute', left:16, right:16, top:6, bottom:6,
      borderRadius:20, overflow:'hidden', padding:'18px 18px 20px',
      background:T.bg, border:`1px solid ${T.divide}`,
      boxShadow:'0 14px 34px rgba(0,0,0,0.45)',
      transform: top ? 'none' : 'scale(0.95) translateY(10px)',
      filter: top ? 'none' : 'brightness(0.8)',
      touchAction:'none', willChange:'transform',
      display:'flex', flexDirection:'column',
    }}>
      {/* pointerEvents:none — жест всегда достаётся корню колоды, не начинке */}
      <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12, pointerEvents:'none'}}>
        <div style={{width:38,height:38,borderRadius:'50%',overflow:'hidden',flexShrink:0}}>
          <img src={p.photo} alt={p.name} draggable={false} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        </div>
        <div style={{minWidth:0}}>
          <div style={{fontFamily:T.serif,fontSize:15,fontWeight:700,color:T.ink}}>{p.name}</div>
          <div style={{fontFamily:T.mono,fontSize:9,color:T.soft}}>ваш контакт</div>
        </div>
      </div>
      <div style={{pointerEvents:'none', marginBottom:14}}>
        <div style={{fontFamily:T.mono,fontSize:8.5,color:T.soft,letterSpacing:1,textTransform:'uppercase',marginBottom:7}}>ищет</div>
        <WantTags items={p.want} accent={accent}/>
      </div>
      {p.about && (
        <p style={{pointerEvents:'none', fontFamily:T.body, fontSize:14, color:T.mid, lineHeight:1.5, margin:'0 0 10px', fontStyle:'italic'}}>
          {p.about}
        </p>
      )}
      <div style={{flex:1, pointerEvents:'none'}}/>
      {/* подсказки направления свайпа, гаснут/зажигаются драгом через ref-стили */}
      <div data-hint="skip" style={{position:'absolute', top:16, left:16, opacity:0, pointerEvents:'none',
        fontFamily:T.mono, fontSize:10, letterSpacing:1, textTransform:'uppercase', color:T.soft,
        border:`1px solid ${T.soft}`, borderRadius:8, padding:'3px 8px'}}>пропустить</div>
      <div data-hint="help" style={{position:'absolute', top:16, right:16, opacity:0, pointerEvents:'none',
        fontFamily:T.mono, fontSize:10, letterSpacing:1, textTransform:'uppercase', color:accent,
        border:`1px solid ${accent}`, borderRadius:8, padding:'3px 8px'}}>могу помочь</div>
    </div>
  );
}

function RequestSwipeDeck({ items, accent, onSkip, onHelp }) {
  const [idx, setIdx] = React.useState(0);
  const rootRef = React.useRef(null);
  const g = React.useRef({ active:false, committing:false, x0:0, dx:0 });

  const len = items.length;
  const cur = len ? items[idx % len] : null;
  const behind = len ? items[(idx + 1) % len] : null;

  const setTop = (dx, animMs) => {
    const r = rootRef.current; if (!r) return;
    const top = r.querySelector('[data-slot="top"]');
    if (!top) return;
    top.style.transition = animMs ? `transform ${animMs}ms cubic-bezier(0.22,0.9,0.32,1)` : 'none';
    top.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
    const hSkip = top.querySelector('[data-hint="skip"]');
    const hHelp = top.querySelector('[data-hint="help"]');
    if (hSkip) hSkip.style.opacity = Math.max(0, Math.min(1, -dx / 70));
    if (hHelp) hHelp.style.opacity = Math.max(0, Math.min(1, dx / 70));
  };

  const advance = (dir) => {
    const p = cur;
    setIdx(i => (i + 1) % len);
    requestAnimationFrame(() => { setTop(0, 0); g.current.committing = false; });
    if (dir === 'help') onHelp && onHelp(p); else onSkip && onSkip(p);
  };

  const commit = (dir) => {
    g.current.committing = true; g.current.active = false;
    const W = (rootRef.current ? rootRef.current.offsetWidth : 400) + 120;
    setTop(dir === 'help' ? W : -W, 260);
    setTimeout(() => advance(dir), 280);
  };

  const onDown = (e) => {
    if (g.current.committing || !len) return;
    const t = e.touches ? e.touches[0] : e;
    g.current = { active:true, committing:false, x0:t.clientX, dx:0 };
  };
  const onMove = (e) => {
    const G = g.current;
    if (!G.active || G.committing) return;
    const t = e.touches ? e.touches[0] : e;
    G.dx = t.clientX - G.x0;
    setTop(G.dx, 0);
  };
  const onUp = () => {
    const G = g.current;
    if (!G.active || G.committing) return;
    G.active = false;
    if (G.dx > 90) return commit('help');
    if (G.dx < -90) return commit('skip');
    setTop(0, 220);
  };

  if (!len) {
    return (
      <div style={{textAlign:'center',padding:'40px 14px',fontFamily:T.body,fontSize:13,color:T.soft,fontStyle:'italic'}}>
        пока никто из контактов не оставил запрос
      </div>
    );
  }

  return (
    <div>
      <div ref={rootRef} style={{position:'relative', height:260, touchAction:'none'}}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp} onTouchCancel={onUp}>
        {behind && behind !== cur && <RequestSwipeCard key={'b-'+behind.id} p={behind} top={false} accent={accent}/>}
        {cur && <RequestSwipeCard key={'t-'+cur.id+idx} p={cur} top accent={accent}/>}
      </div>
      <div style={{display:'flex', justifyContent:'center', gap:22, marginTop:14}}>
        <button onClick={()=>commit('skip')} aria-label="пропустить" style={{
          width:52,height:52,borderRadius:'50%',border:`1px solid ${T.divide}`,background:T.surface,
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke={T.soft} strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <button onClick={()=>commit('help')} aria-label="могу помочь" style={{
          width:60,height:60,borderRadius:'50%',border:'none',background:accent,
          boxShadow:`0 8px 20px ${accent}55`,
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
        }}>
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none"><path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8.5L5 16v-3a2 2 0 0 1-2-2V5z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div style={{textAlign:'center',marginTop:9,fontFamily:T.mono,fontSize:9,color:T.soft}}>
        ← пропустить · свайп/тап · могу помочь →
      </div>
    </div>
  );
}

// ── автосведение: банер + разворот ───────────────────────
function BrokerBanner({ s, accent, onOpen }) {
  const ask = personOf(s.askId), help = personOf(s.helpId);
  if (!ask || !help) return null;
  return (
    <button onClick={()=>onOpen(s)} style={{
      width:'100%',textAlign:'left',border:`1px solid ${accent}40`,cursor:'pointer',
      borderRadius:16,padding:'12px 13px',marginBottom:16,background:`${accent}0c`,
      display:'flex',alignItems:'center',gap:11,
    }}>
      <div style={{display:'flex',alignItems:'center',flexShrink:0}}>
        <img src={ask.photo} alt={ask.name} style={{width:32,height:32,borderRadius:'50%',objectFit:'cover',border:`1.5px solid ${T.divide}`}}/>
        <img src={help.photo} alt={help.name} style={{width:32,height:32,borderRadius:'50%',objectFit:'cover',marginLeft:-10,border:`1.5px solid ${accent}`}}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:T.mono,fontSize:8.5,color:accent,letterSpacing:1,textTransform:'uppercase'}}>можете свести</div>
        <div style={{fontFamily:T.sans,fontSize:12.5,color:T.mid,marginTop:2}}>{ask.name} ищет {s.tag} · у вас есть {help.name}</div>
      </div>
      <svg width="7" height="12" viewBox="0 0 7 12" style={{flexShrink:0}}><path d="M1 1l5 5-5 5" stroke={T.soft} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
}

function BrokerDetail({ s, accent, onBack, onOpenPerson }) {
  const [done, setDone] = React.useState(false);
  const ask = personOf(s.askId), help = personOf(s.helpId);
  return (
    <div style={{position:'absolute',inset:0,background:T.bg,paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'8px 12px 10px',display:'flex',alignItems:'center',gap:6,flexShrink:0,borderBottom:`1px solid ${T.divide}`}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:11,border:'none',background:'transparent',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="8" height="13" viewBox="0 0 8 13"><path d="M7 1L1 6.5 7 12" stroke={T.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{fontFamily:T.serif,fontSize:19,fontWeight:700,color:T.ink}}>Можете свести</div>
      </div>
      <div style={{flex:1,padding:'20px 20px 40px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,margin:'6px 0 20px'}}>
          <div style={{textAlign:'center'}}>
            <img src={ask.photo} alt={ask.name} style={{width:52,height:52,borderRadius:'50%',objectFit:'cover',border:`1.5px solid ${T.divide}`}}/>
            <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,marginTop:5}}>{ask.name}</div>
          </div>
          <div style={{flex:1,height:1.5,background:T.divide,maxWidth:34}}/>
          <div style={{textAlign:'center'}}>
            <img src={MARINA.photo} alt="вы" style={{width:60,height:60,borderRadius:'50%',objectFit:'cover',border:`2px solid ${accent}`}}/>
            <div style={{fontFamily:T.mono,fontSize:9,color:accent,marginTop:5}}>вы</div>
          </div>
          <div style={{flex:1,height:1.5,background:T.divide,maxWidth:34}}/>
          <div style={{textAlign:'center'}}>
            <img src={help.photo} alt={help.name} style={{width:52,height:52,borderRadius:'50%',objectFit:'cover',border:`1.5px solid ${T.divide}`}}/>
            <div style={{fontFamily:T.mono,fontSize:9,color:T.soft,marginTop:5}}>{help.name}</div>
          </div>
        </div>

        <p style={{fontFamily:T.sans,fontSize:14,color:T.mid,textAlign:'center',lineHeight:1.5,margin:'0 0 6px'}}>
          {ask.name} ищет <span style={{color:T.ink,fontWeight:600}}>{s.tag}</span>.<br/>
          У вас в контактах <span style={{color:T.ink,fontWeight:600}}>{help.name}</span> — даёт <span style={{color:'rgba(120,210,150,0.95)'}}>{help.give.join(', ')}</span>.
        </p>
        <p style={{fontFamily:T.serif,fontStyle:'italic',fontSize:17,color:T.ink,textAlign:'center',margin:'14px 0 22px'}}>Возьмётесь свести?</p>

        {done ? (
          <div>
            <div style={{textAlign:'center',padding:'13px 14px',borderRadius:13,marginBottom:12,background:'rgba(80,180,120,0.12)',
              border:'1px solid rgba(80,180,120,0.32)',color:'rgba(120,210,150,0.95)',fontFamily:T.sans,fontSize:13,fontWeight:600,lineHeight:1.45}}>
              ✓ Отмечено. Affin не пишет за вас — напишите обоим сами, вот их карточки:
            </div>
            <div style={{display:'flex',gap:9}}>
              <button onClick={()=>onOpenPerson&&onOpenPerson(ask)} style={{flex:1,padding:'12px 0',borderRadius:13,border:`1px solid ${T.divide}`,
                background:'transparent',color:T.ink,fontFamily:T.sans,fontSize:13,fontWeight:600,cursor:'pointer'}}>{ask.name} →</button>
              <button onClick={()=>onOpenPerson&&onOpenPerson(help)} style={{flex:1,padding:'12px 0',borderRadius:13,border:`1px solid ${T.divide}`,
                background:'transparent',color:T.ink,fontFamily:T.sans,fontSize:13,fontWeight:600,cursor:'pointer'}}>{help.name} →</button>
            </div>
          </div>
        ) : (
          <div style={{display:'flex',gap:9}}>
            <button onClick={onBack} style={{flex:1,padding:'12px 0',borderRadius:13,border:`1px solid ${T.divide}`,
              background:'transparent',color:T.mid,fontFamily:T.sans,fontSize:13.5,fontWeight:500,cursor:'pointer'}}>Не сейчас</button>
            <button onClick={()=>setDone(true)} style={{flex:1.3,padding:'12px 0',borderRadius:13,border:'none',
              background:accent,color:'#fff',fontFamily:T.sans,fontSize:13.5,fontWeight:700,cursor:'pointer'}}>Сведу сам →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── чат по запросу: открывается на конкретного человека с закреплённой
// цитатой его запроса — получатель сразу видит повод. Сообщение печатает
// и отправляет сам пользователь (см. BrokerDetail — тот же принцип: Affin
// не говорит от чьего-то лица, только даёт контекст под рукой).
// компактная полоска цитаты — как reply-preview в Telegram: кружок-превью
// с рингом + две строки. Используется и над полем ввода (до отправки),
// и приклеенной к самому сообщению (после) — та же разметка, два места.
function QuoteStrip({ photo, name, quote, accent, onClose, rounded }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 10px 7px',
      borderRadius: rounded || '14px 14px 4px 4px', background:T.hi}}>
      <div style={{width:30,height:30,borderRadius:'50%',padding:2,flexShrink:0,
        border:`1.5px solid ${accent}`}}>
        <img src={photo} alt={name} style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover',display:'block'}}/>
      </div>
      <div style={{minWidth:0,flex:1}}>
        <div style={{fontFamily:T.sans,fontSize:11,fontWeight:700,color:accent,lineHeight:1.25}}>Ответ на запрос</div>
        <div style={{fontFamily:T.sans,fontSize:11.5,color:T.mid,lineHeight:1.25,
          whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>«{quote}»</div>
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="убрать цитату" style={{width:22,height:22,borderRadius:'50%',border:'none',
          background:T.surface,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="9" height="9" viewBox="0 0 10 10"><path d="M1 1l8 8M9 1l-8 8" stroke={T.soft} strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      )}
    </div>
  );
}

function RequestChatScreen({ person, accent, onBack }) {
  const want = person.want && person.want[0];
  const conn = CONNECTIONS.find(c => c.id === person.id);
  const isLive = conn && conn.when === 'сегодня'; // тот же ивент ещё идёт — не просто «когда-то виделись»
  const [messages, setMessages] = React.useState([]);
  const [draft, setDraft] = React.useState(want ? `По твоему запросу «${want}» — ` : '');
  const [quoteDismissed, setQuoteDismissed] = React.useState(false);
  const replyPending = !!want && !messages.length && !quoteDismissed; // цитата ещё не отправлена — видна над полем ввода
  const scrollRef = React.useRef(null);
  const send = () => {
    const t = draft.trim(); if (!t) return;
    setMessages(m => [...m, { from:'me', text:t, when:'сейчас', quote: replyPending && m.length===0 ? want : null }]);
    setDraft('');
  };
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  return (
    <div style={{position:'absolute',inset:0,background:T.bg,paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'10px 14px 12px',display:'flex',alignItems:'center',gap:10,borderBottom:`1px solid ${T.divide}`,flexShrink:0}}>
        <button onClick={onBack} style={{width:34,height:34,borderRadius:10,border:'none',background:'transparent',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="7" height="12" viewBox="0 0 7 12"><path d="M6 1L1 6l5 5" stroke={T.mid} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{width:36,height:36,borderRadius:'50%',overflow:'hidden',flexShrink:0}}>
          <img src={person.photo} alt={person.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:T.serif,fontSize:16,fontWeight:700,color:T.ink}}>{person.name}</div>
          {isLive && (
            <div style={{display:'flex',alignItems:'center',gap:5,marginTop:1}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:'rgba(80,180,120,0.9)'}}/>
              <span style={{fontFamily:T.mono,fontSize:9,color:'rgba(120,210,150,0.9)',letterSpacing:0.5}}>сейчас на {conn.event}</span>
            </div>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="noscroll" style={{flex:1,padding:'14px',overflowY:'auto',display:'flex',flexDirection:'column',gap:8}}>
        <div style={{marginTop:'auto'}}/>
        {!messages.length && (
          <div style={{textAlign:'center',padding:'10px 14px',fontFamily:T.body,fontSize:13,color:T.soft,fontStyle:'italic'}}>
            напиши первым — он увидит, по какому запросу ты откликнулась
          </div>
        )}
        {messages.map((m,i)=>(
          <div key={i} style={{alignSelf:'flex-end',maxWidth:'80%'}}>
            {m.quote && (
              <div style={{marginBottom:1}}>
                <QuoteStrip photo={person.photo} name={person.name} quote={m.quote} accent={accent}/>
              </div>
            )}
            <div style={{padding:'10px 13px',borderRadius:14,borderTopRightRadius: m.quote ? 4 : 14, ...(m.quote?{borderTopLeftRadius:4}:{}),
              background:accent,color:'#fff',fontFamily:T.sans,fontSize:14.5,lineHeight:1.4}}>{m.text}</div>
          </div>
        ))}
      </div>

      {/* reply-preview над полем ввода, пока сообщение ещё не отправлено — как в Telegram */}
      {replyPending && (
        <div style={{padding:'8px 14px 0',flexShrink:0}}>
          <QuoteStrip photo={person.photo} name={person.name} quote={want} accent={accent}
            rounded="14px" onClose={()=>setQuoteDismissed(true)}/>
        </div>
      )}

      <div style={{display:'flex',gap:8,padding:'10px 14px max(14px, calc(10px + var(--sab)))',borderTop: replyPending ? 'none' : `1px solid ${T.divide}`,flexShrink:0}}>
        <input value={draft} onChange={e=>setDraft(e.target.value)}
          onKeyDown={e=>{ if (e.key==='Enter') send(); }}
          placeholder="сообщение..." style={{
          flex:1,padding:'11px 14px',borderRadius:14,border:`1px solid ${T.divide}`,
          background:T.surface,color:T.ink,fontFamily:T.sans,fontSize:14,outline:'none',
        }}/>
        <button onClick={send} style={{width:44,height:44,borderRadius:14,border:'none',background:accent,
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3 10h13M11 4l6 6-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

function ConnectionsScreen({ accent = T.accent, onBack, onOpenPerson, onOpenBroker, onOpenChat }) {
  const [tab, setTab] = React.useState('list'); // list | requests
  const me = MARINA;
  const requestPeople = CONNECTIONS
    .map(c => personOf(c.id))
    .filter(p => p && p.want && p.want.length);

  return (
    <div style={{position:'absolute',inset:0,background:T.bg,paddingTop:'calc(16px + var(--sat))',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'8px 12px 10px',display:'flex',alignItems:'center',gap:6,flexShrink:0,borderBottom:`1px solid ${T.divide}`}}>
        <button onClick={onBack} style={{width:36,height:36,borderRadius:11,border:'none',background:'transparent',
          display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="8" height="13" viewBox="0 0 8 13"><path d="M7 1L1 6.5 7 12" stroke={T.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{fontFamily:T.serif,fontSize:19,fontWeight:700,color:T.ink}}>Связи</div>
      </div>

      <div className="noscroll" style={{flex:1,overflowY:'auto',padding:'14px 16px 40px'}}>
        {/* автосведение — проактивная подсказка, видна независимо от таба */}
        {BROKER_SUGGESTIONS.map((s,i)=><BrokerBanner key={i} s={s} accent={accent} onOpen={onOpenBroker}/>)}

        {/* твой открытый запрос */}
        <div style={{padding:'12px 13px',borderRadius:16,marginBottom:16,
          background:`${accent}0c`,border:`1px solid ${accent}30`}}>
          <div style={{fontFamily:T.mono,fontSize:8.5,color:accent,letterSpacing:1,textTransform:'uppercase',marginBottom:6}}>твой открытый запрос</div>
          <WantTags items={me.want} accent={accent}/>
        </div>

        {/* сегменты */}
        <div style={{display:'flex',background:T.surface2,border:`1px solid ${T.divide}`,borderRadius:12,padding:3,marginBottom:14}}>
          {[
            {k:'list', l:`Контакты · ${CONNECTIONS.length}`},
            {k:'requests', l:`Запросы · ${requestPeople.length}`},
          ].map(o=>(
            <button key={o.k} onClick={()=>setTab(o.k)} style={{
              flex:1,textAlign:'center',padding:'8px 4px',borderRadius:9,border:'none',cursor:'pointer',
              background: tab===o.k ? T.hi : 'transparent',
              color: tab===o.k ? T.ink : T.soft,
              fontFamily:T.sans,fontSize:12,fontWeight: tab===o.k ? 600 : 500,
            }}>{o.l}</button>
          ))}
        </div>

        {tab === 'list' ? (
          <div style={{display:'flex',flexDirection:'column',gap:9}}>
            {CONNECTIONS.map((c,i)=><ContactRow key={i} conn={c} accent={accent} onOpen={onOpenPerson}/>)}
          </div>
        ) : (
          <RequestSwipeDeck items={requestPeople} accent={accent}
            onSkip={()=>{}} onHelp={(p)=>onOpenChat&&onOpenChat(p)}/>
        )}

        <div style={{textAlign:'center',padding:'22px 14px 0'}}>
          <span style={{fontFamily:T.body,fontSize:12.5,color:T.soft,fontStyle:'italic',lineHeight:1.5}}>
            главный сигнал доверия — «встречались лично», а не число общих знакомых
          </span>
        </div>
      </div>
    </div>
  );
}

window.ConnectionsScreen = ConnectionsScreen;
window.BrokerDetail = BrokerDetail;
window.RequestChatScreen = RequestChatScreen;
