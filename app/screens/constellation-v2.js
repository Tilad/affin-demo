// Constellation V2 — «Ночное небо»
// Художественный вектор: буквальная метафора звёздного неба. Аватарки — звёзды,
// каждая мерцает в своём ритме (не синхронно), линии между людьми «прочерчиваются»
// светом от точки к точке, редкая падающая звезда — намёк на то, что в сети
// появляется что-то новое. «Ты» — новая звезда, ярче остальных, с мягким сиянием.
//
// Компонент на уровне модуля (см. CLAUDE.md — не объявлять компоненты внутри компонентов).
// Все имена префиксованы V2/v2-, чтобы не конфликтовать с тремя другими вариантами,
// загруженными в том же документе.

// ── данные созвездия ─────────────────────────────────────
// x,y — центр звезды в процентах контейнера (совпадает с координатами SVG viewBox 0 0 100 100,
// т.к. preserveAspectRatio="none" растягивает viewBox 1:1 на проценты контейнера).
const V2_POINTS = [
  { id:'p8', x:12, y:18, s:26, dur:3.6, delay:0.2,  dim:true },
  { id:'p1', x:12, y:72, s:42, dur:3.0, delay:0.9 },
  { id:'p2', x:30, y:30, s:56, dur:2.6, delay:0.0,  hot:true },
  { id:'p3', x:48, y:62, s:40, dur:3.8, delay:1.3 },
  { id:'p4', x:66, y:22, s:48, dur:2.9, delay:1.9 },
  { id:'p9', x:87, y:16, s:24, dur:4.1, delay:0.6,  dim:true },
  { id:'p6', x:82, y:58, s:44, dur:3.3, delay:1.5 },
];

function v2Len(a, b) {
  const dx = V2_POINTS[b].x - V2_POINTS[a].x;
  const dy = V2_POINTS[b].y - V2_POINTS[a].y;
  return Math.sqrt(dx * dx + dy * dy);
}

// индексы в V2_POINTS: 0 p8, 1 p1, 2 p2, 3 p3, 4 p4, 5 p9, 6 p6
const V2_LINE_DEFS = [
  { a:1, b:2, primary:true },
  { a:2, b:3, primary:true },
  { a:3, b:4, primary:true },
  { a:4, b:6, primary:true },
  { a:2, b:0, primary:false },
  { a:6, b:5, primary:false },
];
const V2_LINES = V2_LINE_DEFS.map((l, i) => ({ ...l, len: v2Len(l.a, l.b), i }));

const V2_ME_POINT = { x:50, y:90 };
const V2_ME_FROM = 6; // p6 — созвездие «дотягивается» до тебя
const V2_ME_LINE_LEN = Math.sqrt(
  Math.pow(V2_ME_POINT.x - V2_POINTS[V2_ME_FROM].x, 2) +
  Math.pow(V2_ME_POINT.y - V2_POINTS[V2_ME_FROM].y, 2)
);

// мелкие фоновые звёзды — детерминированный псевдо-разброс (без Math.random,
// чтобы разметка была стабильна между релоадами/SSR-подобными пересчётами)
const V2_BG_STARS = Array.from({ length: 24 }).map((_, i) => {
  const seed = i * 137.51; // золотой угол — равномерный на вид разброс
  const x = (seed * 3.73) % 100;
  const y = (seed * 5.17 + i * 11) % 100;
  return {
    x, y,
    size: 1 + (i % 3),
    dur: 2.2 + (i % 5) * 0.5,
    delay: (i % 7) * 0.33,
    dim: i % 3 === 0,
  };
});

// ── суб-визуалы (на уровне модуля, не внутри Comp) ───────

function V2Star({ p }) {
  const res = (typeof window !== 'undefined' && window.__resources) || {};
  const ringColor = p.hot ? 'var(--v2-accent)' : 'rgba(242,235,217,0.32)';
  return (
    <div
      className={p.dim ? 'v2-star v2-star-dim' : 'v2-star'}
      style={{
        position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
        width:p.s, height:p.s, transform:'translate(-50%,-50%)',
        animationDuration:`${p.dur}s`, animationDelay:`${p.delay}s`,
      }}>
      <img src={res[p.id]} alt="" style={{
        width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover', display:'block',
        border:`1.5px solid ${ringColor}`,
        boxShadow: p.hot
          ? `0 0 22px var(--v2-accent), 0 0 44px var(--v2-accent-soft)`
          : '0 2px 12px rgba(0,0,0,0.5)',
      }}/>
      {p.hot && <div className="v2-hot-ring" style={{
        position:'absolute', inset:-7, borderRadius:'50%',
        border:'1px solid var(--v2-accent-soft)',
      }}/>}
    </div>
  );
}

function V2BgStar({ b, i }) {
  return (
    <div key={i} className={b.dim ? 'v2-bgstar v2-bgstar-dim' : 'v2-bgstar'} style={{
      position:'absolute', left:`${b.x}%`, top:`${b.y}%`,
      width:b.size, height:b.size, borderRadius:'50%',
      background:T.ink, animationDuration:`${b.dur}s`, animationDelay:`${b.delay}s`,
    }}/>
  );
}

function V2Line({ l }) {
  const a = V2_POINTS[l.a], b = V2_POINTS[l.b];
  return (
    <line
      className="v2-line"
      x1={a.x} y1={a.y} x2={b.x} y2={b.y}
      stroke={l.primary ? 'var(--v2-line-primary)' : 'var(--v2-line-soft)'}
      strokeWidth={l.primary ? 0.4 : 0.28}
      strokeLinecap="round"
      strokeDasharray={l.len}
      strokeDashoffset={0}
      style={{ '--v2-len': l.len, animationDelay:`${0.25 + l.i * 0.28}s` }}
    />
  );
}

function V2ShootingStars({ accent }) {
  return (
    <div style={{position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none'}}>
      <div className="v2-shoot v2-shoot-a" style={{
        position:'absolute', left:'6%', top:'8%', width:110, height:2, borderRadius:2,
        background:`linear-gradient(90deg, transparent, ${accent}, #fff, transparent)`,
        opacity:0, transform:'rotate(28deg)',
      }}/>
      <div className="v2-shoot v2-shoot-b" style={{
        position:'absolute', right:'10%', top:'4%', width:86, height:2, borderRadius:2,
        background:`linear-gradient(90deg, transparent, #fff, ${accent}, transparent)`,
        opacity:0, transform:'rotate(-32deg)',
      }}/>
    </div>
  );
}

function V2Style() {
  return (
    <style>{`
      @keyframes v2-twinkle {
        0%, 100% { opacity:0.6;  filter:brightness(0.82) saturate(0.9); transform:translate(-50%,-50%) translateY(0px); }
        50%      { opacity:1;    filter:brightness(1.18) saturate(1.08); transform:translate(-50%,-50%) translateY(-4px); }
      }
      @keyframes v2-twinkle-dim {
        0%, 100% { opacity:0.34; transform:translate(-50%,-50%) translateY(0px); }
        50%      { opacity:0.72; transform:translate(-50%,-50%) translateY(-2px); }
      }
      @keyframes v2-hot-ring-pulse {
        0%   { transform:scale(0.94); opacity:0.85; }
        70%  { transform:scale(1.24); opacity:0; }
        100% { transform:scale(1.24); opacity:0; }
      }
      @keyframes v2-bg-twinkle {
        0%, 100% { opacity:0.15; }
        50%      { opacity:0.9; }
      }
      @keyframes v2-draw-line {
        0%   { stroke-dashoffset: var(--v2-len); opacity:0; }
        35%  { opacity:1; }
        100% { stroke-dashoffset:0; opacity:1; }
      }
      @keyframes v2-line-glow {
        0%, 100% { opacity:0.55; }
        50%      { opacity:1; }
      }
      @keyframes v2-shoot-a {
        0%, 78%   { opacity:0; transform:translate(0px,0px) rotate(28deg); }
        80%       { opacity:1; }
        88%       { opacity:1; transform:translate(150px,86px) rotate(28deg); }
        92%, 100% { opacity:0; transform:translate(178px,104px) rotate(28deg); }
      }
      @keyframes v2-shoot-b {
        0%, 40%   { opacity:0; transform:translate(0px,0px) rotate(-32deg); }
        42%       { opacity:1; }
        49%       { opacity:1; transform:translate(-120px,96px) rotate(-32deg); }
        53%, 100% { opacity:0; transform:translate(-142px,116px) rotate(-32deg); }
      }
      @keyframes v2-me-halo {
        0%, 100% { transform:scale(1);    opacity:0.55; }
        50%      { transform:scale(1.35); opacity:0.15; }
      }
      @keyframes v2-me-glow {
        0%, 100% { box-shadow:0 0 20px var(--v2-accent), 0 0 46px var(--v2-accent-soft); }
        50%      { box-shadow:0 0 32px var(--v2-accent), 0 0 70px var(--v2-accent-soft); }
      }

      .v2-star        { animation: v2-twinkle 3.2s ease-in-out infinite; will-change:opacity,transform,filter; }
      .v2-star-dim    { animation: v2-twinkle-dim 3.6s ease-in-out infinite; }
      .v2-hot-ring    { animation: v2-hot-ring-pulse 2.4s ease-out infinite; }
      .v2-bgstar      { animation: v2-bg-twinkle 3s ease-in-out infinite; }
      .v2-bgstar-dim  { opacity:0.5; }
      .v2-line        { animation: v2-draw-line 1.1s ease-out forwards, v2-line-glow 5s ease-in-out infinite; }
      .v2-shoot-a     { animation: v2-shoot-a 6.5s linear infinite; animation-delay:1.1s; }
      .v2-shoot-b     { animation: v2-shoot-b 8s linear infinite; animation-delay:3.4s; }
      .v2-me-halo     { animation: v2-me-halo 3.4s ease-in-out infinite; }
      .v2-me-avatar   { animation: v2-me-glow 3.4s ease-in-out infinite; }

      @media (prefers-reduced-motion: reduce) {
        .v2-star, .v2-star-dim, .v2-hot-ring, .v2-bgstar, .v2-line,
        .v2-shoot-a, .v2-shoot-b, .v2-me-halo, .v2-me-avatar {
          animation: none !important;
        }
      }
    `}</style>
  );
}

// ── главный компонент ─────────────────────────────────────

function ConstellationV2({ accent, me, height }) {
  const acc = accent || T.accent;
  const h = height || 220;
  const meLen = V2_ME_LINE_LEN;
  const accentSoft = acc + '55';

  return (
    <div style={{
      position:'relative', width:'100%', height:h, overflow:'hidden', borderRadius:18,
      background:`radial-gradient(120% 90% at 24% 12%, rgba(94,74,150,0.16), transparent 55%),
                  radial-gradient(90% 70% at 82% 88%, ${acc}14, transparent 60%),
                  ${T.canvas}`,
      '--v2-accent': acc,
      '--v2-accent-soft': accentSoft,
      '--v2-line-primary': 'rgba(242,235,217,0.55)',
      '--v2-line-soft': 'rgba(242,235,217,0.28)',
    }}>
      <V2Style/>

      {/* фоновая звёздная пыль */}
      {V2_BG_STARS.map((b, i) => <V2BgStar key={i} b={b} i={i}/>)}

      {/* падающие звёзды — редкий сигнатурный акцент */}
      <V2ShootingStars accent={acc}/>

      {/* линии созвездия — рисуются светом от точки к точке */}
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{position:'absolute', inset:0}}>
        {V2_LINES.map(l => <V2Line key={l.i} l={l}/>)}
        {me && (
          <line className="v2-line"
            x1={V2_POINTS[V2_ME_FROM].x} y1={V2_POINTS[V2_ME_FROM].y}
            x2={V2_ME_POINT.x} y2={V2_ME_POINT.y}
            stroke={acc} strokeWidth="0.55" strokeLinecap="round"
            strokeDasharray={meLen} strokeDashoffset={0}
            style={{ '--v2-len': meLen, animationDelay:'1.9s', opacity:0.9 }}/>
        )}
      </svg>

      {/* звёзды-люди */}
      {V2_POINTS.map((p, i) => <V2Star key={p.id + i} p={p}/>)}

      {/* «ты» — новая звезда на этом небе */}
      {me && (
        <div style={{
          position:'absolute', left:`${V2_ME_POINT.x}%`, top:`${V2_ME_POINT.y}%`,
          transform:'translate(-50%,-50%)',
        }}>
          <div className="v2-me-halo" style={{
            position:'absolute', inset:-22, borderRadius:'50%',
            background:`radial-gradient(circle, ${accentSoft}, transparent 70%)`,
            filter:'blur(2px)',
          }}/>
          <div className="v2-me-avatar" style={{
            position:'relative', width:58, height:58, borderRadius:'50%', overflow:'hidden',
            border:`2px solid ${acc}`,
          }}>
            <img src={me} alt="ты" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
          </div>
          <div style={{
            position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)',
            padding:'2px 8px', borderRadius:7, background:acc, whiteSpace:'nowrap',
            fontFamily:T.mono, fontSize:7.5, color:'#fff', letterSpacing:0.8, textTransform:'uppercase',
          }}>ты</div>
        </div>
      )}
    </div>
  );
}

window.__CONSTEL_VARIANTS = window.__CONSTEL_VARIANTS || [];
window.__CONSTEL_VARIANTS.push({
  id: 'v2',
  title: 'Ночное небо',
  note: 'Аватарки как звёзды с несинхронным мерцанием, созвездие «прочерчивается» светом от точки к точке, редкая падающая звезда — намёк на новое в сети; «ты» горишь ярче всех с мягким ореолом.',
  Comp: ConstellationV2,
});
