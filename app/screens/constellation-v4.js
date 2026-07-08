// Constellation V4 — «Полароиды»: слоистая глубина из карточек-фото в пространстве.
// Вместо кружочков-аватарок — маленькие полароиды/бейджи участников на нескольких
// воображаемых глубинных слоях (дальние мельче/тусклее/размыты, ближние крупнее/чётче),
// которые еле заметно покачиваются в 3D (perspective+rotate, чистый CSS). Линии-связи —
// тонкие лучи света между карточками. «Ты» (если есть) — самая крупная и чёткая карточка
// на переднем плане, вокруг которой выстроены остальные.
// Компонент — на уровне модуля (см. CLAUDE.md: не объявлять компоненты внутри компонентов).

// ── данные композиции ────────────────────────────────────
// layer: 1 = дальний план (мельче/тусклее/размыт), 2 = средний, 3 = ближний/«горячий» узел.
const V4_CARDS = [
  { id:'p1', x:10, y:16, layer:1, rot:-9,  tiltx:3,  tilty:-5, dur:9.5, delay:0.0 },
  { id:'p3', x:88, y:12, layer:1, rot:8,   tiltx:-3, tilty:4,  dur:10.5,delay:0.6 },
  { id:'p8', x:94, y:58, layer:1, rot:6,   tiltx:2,  tilty:5,  dur:9.0, delay:1.2 },
  { id:'p9', x:4,  y:64, layer:2, rot:-6,  tiltx:-4, tilty:-3, dur:7.5, delay:0.3 },
  { id:'p4', x:70, y:8,  layer:2, rot:-5,  tiltx:4,  tilty:3,  dur:8.0, delay:0.9 },
  { id:'p6', x:82, y:82, layer:2, rot:7,   tiltx:-3, tilty:-4, dur:7.2, delay:1.5 },
  { id:'p2', x:26, y:80, layer:3, rot:-4,  tiltx:4,  tilty:5,  dur:6.2, delay:0.2, hot:true },
];

// Линии соединяют центры карточек — сами карточки (непрозрачные, со своей тенью)
// перекрывают концы линий, визуально это читается как связь «от угла к углу».
const V4_LINES = [[0,3],[3,6],[6,5],[5,2],[2,4],[4,1],[1,6]];
// Дополнительные лучи к «мне», когда есть фото пользователя.
const V4_ME_LINES = [6,3];

const V4_LAYER_STYLE = {
  1: { w:40, h:50, blur:1.4, brightness:0.72, saturate:0.8,  opacity:0.5,  shadow:'0 4px 14px rgba(0,0,0,0.45)' },
  2: { w:52, h:64, blur:0.5, brightness:0.88, saturate:0.92, opacity:0.82, shadow:'0 6px 18px rgba(0,0,0,0.5)' },
  3: { w:64, h:80, blur:0,   brightness:1,    saturate:1,    opacity:1,    shadow:'0 10px 26px rgba(0,0,0,0.55)' },
};

// Мягкие расфокусированные пятна света на заднем плане — «воздух в комнате».
const V4_BOKEH = [
  { x:20, y:22, s:120, color:'accent', dur:11, delay:0 },
  { x:78, y:30, s:90,  color:'soft',   dur:13, delay:2.4 },
  { x:56, y:78, s:130, color:'accent', dur:14.5, delay:1.1 },
];

function v4Res(id) {
  return ((typeof window !== 'undefined' && window.__resources) || {})[id] || '';
}

// ── суб-компонент: одна карточка-полароид ────────────────
function V4PolaroidCard({ card, accent }) {
  const ls = V4_LAYER_STYLE[card.layer];
  const hot = !!card.hot;
  const cls = 'v4-card' + (hot ? ' v4-hot' : '');
  const strip = hot ? accent : T.soft;
  return (
    <div
      className={cls}
      style={{
        position:'absolute', left:`${card.x}%`, top:`${card.y}%`,
        width:ls.w, height:ls.h,
        '--v4-rot': card.rot, '--v4-tiltx': card.tiltx, '--v4-tilty': card.tilty,
        '--v4-dur': `${card.dur}s`, '--v4-delay': `${card.delay}s`,
        '--v4-accent': accent,
        zIndex: 10 + card.layer,
      }}>
      <div style={{
        width:'100%', height:'100%', borderRadius:7, padding:'4px 4px 7px',
        background:'linear-gradient(160deg,#FBF6E9,#EFE6D2)',
        boxShadow: hot ? `${ls.shadow}, 0 0 0 1px ${accent}55, 0 0 20px ${accent}44` : `${ls.shadow}, 0 0 0 1px rgba(0,0,0,0.06)`,
        opacity: ls.opacity,
        filter: ls.blur ? `blur(${ls.blur}px) brightness(${ls.brightness}) saturate(${ls.saturate})` : `brightness(${ls.brightness}) saturate(${ls.saturate})`,
        boxSizing:'border-box', display:'flex', flexDirection:'column',
      }}>
        <div style={{flex:1, borderRadius:4, overflow:'hidden', background:T.hi}}>
          <img src={v4Res(card.id)} alt="" style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}/>
        </div>
        <div style={{height:5, marginTop:3, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{width:hot?7:4, height:hot?7:4, borderRadius:'50%', background:strip, opacity:hot?1:0.55}}/>
        </div>
      </div>
    </div>
  );
}

// ── суб-компонент: карточка «ты» ─────────────────────────
function V4MeCard({ photo, accent }) {
  return (
    <div className="v4-card v4-me" style={{
      position:'absolute', left:'52%', top:'90%',
      width:76, height:96, zIndex:30,
      '--v4-dur':'10s', '--v4-delay':'0s',
    }}>
      <div style={{
        width:'100%', height:'100%', borderRadius:8, padding:'5px 5px 9px',
        background:'linear-gradient(160deg,#FFFBF1,#F3EAD6)',
        boxShadow:`0 14px 32px rgba(0,0,0,0.6), 0 0 0 1.5px ${accent}, 0 0 28px ${accent}66`,
        boxSizing:'border-box', display:'flex', flexDirection:'column',
      }}>
        <div style={{flex:1, borderRadius:5, overflow:'hidden', background:T.hi}}>
          <img src={photo} alt="ты" style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}/>
        </div>
        <div style={{height:9, marginTop:4, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <span style={{fontFamily:T.hand, fontSize:12.5, fontWeight:700, color:accent, lineHeight:1}}>ты</span>
        </div>
      </div>
    </div>
  );
}

// ── главный компонент ────────────────────────────────────
function ConstellationV4({ accent, me, height }) {
  const acc = accent || T.accent;
  const h = height || 200;
  const cards = V4_CARDS;

  return (
    <div style={{ position:'relative', width:'100%', height:h, pointerEvents:'none' }}>
      <style>{`
        @keyframes v4-drift {
          0%   { transform: translate(-50%,-50%) perspective(650px) rotateX(calc(var(--v4-tiltx) * 1deg)) rotateY(calc(var(--v4-tilty) * 1deg)) rotateZ(calc(var(--v4-rot) * 1deg)) translateY(0px); }
          50%  { transform: translate(-50%,-50%) perspective(650px) rotateX(calc(var(--v4-tiltx) * -1deg)) rotateY(calc(var(--v4-tilty) * -1deg)) rotateZ(calc(var(--v4-rot) * 1deg)) translateY(-5px); }
          100% { transform: translate(-50%,-50%) perspective(650px) rotateX(calc(var(--v4-tiltx) * 1deg)) rotateY(calc(var(--v4-tilty) * 1deg)) rotateZ(calc(var(--v4-rot) * 1deg)) translateY(0px); }
        }
        @keyframes v4-drift-me {
          0%,100% { transform: translate(-50%,-50%) perspective(700px) rotateX(1.5deg) rotateY(-2deg) translateY(0px) scale(1); }
          50%     { transform: translate(-50%,-50%) perspective(700px) rotateX(-1.5deg) rotateY(2deg) translateY(-2px) scale(1.015); }
        }
        @keyframes v4-pulse {
          0%,100% { filter: brightness(1); }
          50%     { filter: brightness(1.08); }
        }
        @keyframes v4-pulse-me {
          0%,100% { filter: drop-shadow(0 0 0px transparent); }
          50%     { filter: drop-shadow(0 0 6px ${acc}55); }
        }
        @keyframes v4-beam-flow { to { stroke-dashoffset: -16; } }
        @keyframes v4-beam-glow { 0%,100% { opacity: 0.35; } 50% { opacity: 0.85; } }
        @keyframes v4-bokeh-pulse { 0%,100% { opacity: 0.16; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 0.34; transform: translate(-50%,-50%) scale(1.12); } }

        .v4-card { animation: v4-drift var(--v4-dur, 8s) ease-in-out infinite; animation-delay: var(--v4-delay, 0s); will-change: transform; transform-origin: 50% 50%; }
        .v4-card.v4-hot { animation: v4-drift var(--v4-dur, 8s) ease-in-out infinite, v4-pulse 3.4s ease-in-out infinite; animation-delay: var(--v4-delay, 0s), 0s; }
        .v4-card.v4-me { animation: v4-drift-me 9s ease-in-out infinite, v4-pulse-me 4s ease-in-out infinite; }
        .v4-beam { animation: v4-beam-flow 3.2s linear infinite; }
        .v4-beam-acc { animation: v4-beam-flow 2.6s linear infinite, v4-beam-glow 2.8s ease-in-out infinite; }
        .v4-bokeh { animation: v4-bokeh-pulse ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .v4-card, .v4-card.v4-hot, .v4-card.v4-me, .v4-beam, .v4-beam-acc, .v4-bokeh {
            animation: none !important;
          }
        }
      `}</style>

      {/* воздух в комнате: мягкие расфокусированные пятна света */}
      {V4_BOKEH.map((b,i)=>(
        <div key={i} className="v4-bokeh" style={{
          position:'absolute', left:`${b.x}%`, top:`${b.y}%`, width:b.s, height:b.s,
          borderRadius:'50%', transform:'translate(-50%,-50%)',
          background: b.color==='accent'
            ? `radial-gradient(circle, ${acc}55 0%, transparent 70%)`
            : `radial-gradient(circle, ${T.soft}40 0%, transparent 70%)`,
          filter:'blur(6px)', opacity:0.2, animationDuration:`${b.dur}s`, animationDelay:`${b.delay}s`,
          zIndex:0,
        }}/>
      ))}

      {/* лучи-связи между карточками */}
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{position:'absolute', inset:0, zIndex:5}}>
        <defs>
          <linearGradient id="v4-beam-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={T.soft} stopOpacity="0"/>
            <stop offset="50%" stopColor={T.soft} stopOpacity="0.55"/>
            <stop offset="100%" stopColor={T.soft} stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="v4-beam-grad-acc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={acc} stopOpacity="0"/>
            <stop offset="50%" stopColor={acc} stopOpacity="0.9"/>
            <stop offset="100%" stopColor={acc} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {V4_LINES.map(([a,b],i)=>(
          <line key={i} className="v4-beam"
            x1={cards[a].x} y1={cards[a].y} x2={cards[b].x} y2={cards[b].y}
            stroke="url(#v4-beam-grad)" strokeWidth="0.4" strokeDasharray="2.4 3"/>
        ))}
        {me && V4_ME_LINES.map((idx,i)=>(
          <line key={'me'+i} className="v4-beam-acc"
            x1="52" y1="90" x2={cards[idx].x} y2={cards[idx].y}
            stroke="url(#v4-beam-grad-acc)" strokeWidth="0.55" strokeDasharray="2 2.6"/>
        ))}
      </svg>

      {cards.map((c,i)=>(<V4PolaroidCard key={i} card={c} accent={acc}/>))}

      {me && <V4MeCard photo={me} accent={acc}/>}
    </div>
  );
}

window.__CONSTEL_VARIANTS = window.__CONSTEL_VARIANTS || [];
window.__CONSTEL_VARIANTS.push({
  id: 'v4',
  title: 'Полароиды',
  note: 'Карточки-фото на трёх глубинных слоях (дальние мельче/тусклее/размыты, ближние чётче), еле заметно покачиваются через perspective+rotate — как воздух в комнате; лучи света соединяют углы карточек, «ты» — самая крупная и резкая, вокруг которой собраны остальные.',
  Comp: ConstellationV4,
});
