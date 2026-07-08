// Constellation v3 — «Пульс»: живая нейросеть контактов.
// Люди — узлы, которые тихо дышат светом; связи между ними — нервные пути,
// по которым бегут искры. Когда появляется «ты» — сеть подключается к тебе:
// импульсы начинают течь именно ОТ тебя наружу, будто ты запустил её в движение.
// Компонент на уровне модуля (см. CLAUDE.md — не вкладывать компоненты друг в друга).

// ── данные сети ──────────────────────────────────────────
// узлы: id из window.__resources, x/y — центр в % (viewBox 0..100), s — размер аватарки в px
const V3_NODES = [
  { id: 'p2',     x: 58, y: 16, s: 52 }, // 0
  { id: 'p6',     x: 84, y: 40, s: 40 }, // 1
  { id: 'p4',     x: 18, y: 28, s: 38 }, // 2
  { id: 'marina', x: 40, y: 56, s: 48 }, // 3 — хаб сети
  { id: 'p8',     x: 12, y: 74, s: 34 }, // 4
  { id: 'p9',     x: 70, y: 70, s: 44 }, // 5
  { id: 'p11',    x: 92, y: 86, s: 28 }, // 6
];
// рёбра сети (индексы в V3_NODES) — уже существующие связи между людьми
const V3_EDGES = [[2,0],[2,3],[3,5],[3,4],[0,1],[1,5],[5,6]];
// узел «я», встроенный в композицию снизу-по-центру
const V3_ME = { x: 50, y: 92, s: 56 };
// с кем «я» соединяюсь напрямую — точки первого контакта, откуда сеть «загорается»
const V3_ME_EDGES = [3, 5];

// ── утилиты ──────────────────────────────────────────────

function v3Alpha(hex, opacity) {
  // hex вида '#FF5820' → тот же цвет с альфа-суффиксом, как принято в токенах Affin
  const a = Math.max(0, Math.min(255, Math.round(opacity * 255)))
    .toString(16).padStart(2, '0');
  return typeof hex === 'string' && hex[0] === '#' ? hex + a : hex;
}

// BFS-расстояние (в хопах) от «я» до каждого узла — через прямые me-рёбра и остальную сеть.
// Используется, чтобы импульс «разгорался» ярче и быстрее ближе к тебе и затухал дальше.
function v3Distances(nodesCount, edges, meEdges) {
  const ME = nodesCount; // виртуальный индекс «я»
  const all = edges.concat(meEdges.map(i => [ME, i]));
  const dist = new Array(nodesCount + 1).fill(Infinity);
  dist[ME] = 0;
  const q = [ME];
  while (q.length) {
    const cur = q.shift();
    for (const [a, b] of all) {
      let nb = null;
      if (a === cur) nb = b; else if (b === cur) nb = a;
      if (nb !== null && dist[nb] === Infinity) { dist[nb] = dist[cur] + 1; q.push(nb); }
    }
  }
  return dist.slice(0, nodesCount);
}

function v3UseReducedMotion() {
  const [reduced, setReduced] = React.useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange); };
  }, []);
  return reduced;
}

// ── саб-компоненты (на уровне модуля, не внутри Comp) ────

// Бегущая искра вдоль ребра сети — обычные рёбра «дышат» туда-обратно (диалог),
// рёбра от «я» текут в одну сторону непрерывным потоком (сеть распространяется от тебя).
function V3EdgePulse({ a, b, color, dur, delayS, oneWay, r }) {
  const path = oneWay
    ? `M${a.x},${a.y} L${b.x},${b.y}`
    : `M${a.x},${a.y} L${b.x},${b.y} L${a.x},${a.y}`;
  return (
    <circle r={r} fill={color} style={{ filter: `drop-shadow(0 0 2.4px ${color})` }}>
      <animateMotion path={path} dur={`${dur}s`} begin={`-${delayS}s`} repeatCount="indefinite" rotate="0"/>
    </circle>
  );
}

function V3Node({ n, borderColor, glowColor, breatheDur, breatheDelay, ringDur, ringDelay }) {
  const src = (window.__resources || {})[n.id];
  return (
    <div style={{ position: 'absolute', left: `${n.x}%`, top: `${n.y}%`, width: n.s, height: n.s,
      transform: 'translate(-50%,-50%)' }}>
      <div className="v3-glowring" style={{ position: 'absolute', inset: -7, borderRadius: '50%',
        boxShadow: `0 0 16px 2px ${glowColor}`, animationDuration: `${ringDur}s`, animationDelay: `${ringDelay}s` }}/>
      <img src={src} alt="" className="v3-breathe" style={{ position: 'relative', zIndex: 1,
        width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block',
        border: `1.5px solid ${borderColor}`, boxShadow: '0 2px 12px rgba(0,0,0,0.45)',
        animationDuration: `${breatheDur}s`, animationDelay: `${breatheDelay}s` }}/>
    </div>
  );
}

// ── главный компонент ────────────────────────────────────

function ConstellationV3({ accent, me, height }) {
  const acc = accent || (typeof T !== 'undefined' ? T.accent : '#FF5820');
  const reduced = v3UseReducedMotion();
  const dist = v3Distances(V3_NODES.length, V3_EDGES, V3_ME_EDGES);

  return (
    <div style={{ position: 'relative', width: '100%', height, pointerEvents: 'none' }}>
      <style>{`
        @keyframes v3-breathe {
          0%, 100% { transform: scale(1); filter: brightness(1) saturate(1); }
          50%      { transform: scale(1.05); filter: brightness(1.12) saturate(1.15); }
        }
        @keyframes v3-glowring {
          0%, 100% { opacity: .32; transform: scale(.92); }
          50%      { opacity: .88; transform: scale(1.1); }
        }
        @keyframes v3-sonar {
          0%   { transform: scale(.55); opacity: .55; }
          70%  { opacity: .1; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes v3-aura {
          0%, 100% { opacity: .28; transform: scale(1); }
          50%      { opacity: .5; transform: scale(1.06); }
        }
        @keyframes v3-fadein {
          from { opacity: 0; transform: translateY(6px) scale(.92); }
          to   { opacity: 1; transform: none; }
        }
        .v3-breathe   { animation: v3-breathe 4.2s ease-in-out infinite; }
        .v3-glowring  { animation: v3-glowring 4.2s ease-in-out infinite; }
        .v3-sonar     { animation: v3-sonar 2.6s cubic-bezier(.2,.6,.4,1) infinite; }
        .v3-aura      { animation: v3-aura 5s ease-in-out infinite; }
        .v3-me-in     { animation: v3-fadein .5s cubic-bezier(.2,.7,.3,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .v3-breathe, .v3-glowring, .v3-sonar, .v3-aura { animation: none !important; }
        }
      `}</style>

      {/* тёплое сияние сети — тише без тебя, теплее и живее, когда сеть подключена к тебе */}
      <div className="v3-aura" style={{ position: 'absolute', left: '50%', top: '58%', width: '78%', height: '78%',
        transform: 'translate(-50%,-50%)', borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(circle, ${v3Alpha(acc, me ? 0.16 : 0.08)} 0%, transparent 68%)` }}/>

      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {V3_EDGES.map(([ai, bi], i) => {
          const a = V3_NODES[ai], b = V3_NODES[bi];
          const d = Math.min(dist[ai], dist[bi]);
          const activated = !!me && isFinite(d);
          const t = activated ? Math.min(d, 4) / 4 : 1;
          const strokeColor = activated ? v3Alpha(acc, 0.5 - t * 0.28) : v3Alpha(T.soft, 0.5);
          const pulseColor = activated ? v3Alpha(acc, 0.95 - t * 0.35) : 'rgba(255,158,102,0.55)';
          const dur = activated ? Math.max(1.7, 3.6 - d * 0.55) : 3.9 + (i % 3) * 0.5;
          return (
            <React.Fragment key={`e${i}`}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={strokeColor} strokeWidth="0.35"
                strokeDasharray="1.5 2.3"/>
              {!reduced && (
                <V3EdgePulse a={a} b={b} color={pulseColor} dur={dur} delayS={(i * 0.83) % dur} r={0.9} oneWay={false}/>
              )}
            </React.Fragment>
          );
        })}

        {me && V3_ME_EDGES.map((ni, i) => {
          const n = V3_NODES[ni];
          return (
            <React.Fragment key={`m${i}`}>
              <line x1={V3_ME.x} y1={V3_ME.y} x2={n.x} y2={n.y} stroke={v3Alpha(acc, 0.68)} strokeWidth="0.55"/>
              {!reduced && (
                <>
                  <V3EdgePulse a={V3_ME} b={n} color={v3Alpha(acc, 0.98)} dur={1.55} delayS={0} r={1.15} oneWay/>
                  <V3EdgePulse a={V3_ME} b={n} color={v3Alpha(acc, 0.7)} dur={1.55} delayS={0.78} r={0.95} oneWay/>
                </>
              )}
            </React.Fragment>
          );
        })}
      </svg>

      {V3_NODES.map((n, i) => {
        const d = dist[i];
        const activated = !!me && isFinite(d);
        const t = activated ? Math.min(d, 4) / 4 : 1;
        const borderColor = activated ? v3Alpha(acc, 0.9 - t * 0.35) : 'rgba(242,235,217,0.28)';
        const glowColor = activated ? v3Alpha(acc, 0.5 - t * 0.28) : v3Alpha(acc, 0.18);
        const breatheDur = 3.6 + (i % 4) * 0.5;
        const breatheDelay = (i * 0.43) % breatheDur;
        return (
          <V3Node key={n.id} n={n} borderColor={borderColor} glowColor={glowColor}
            breatheDur={breatheDur} breatheDelay={breatheDelay}
            ringDur={breatheDur} ringDelay={breatheDelay}/>
        );
      })}

      {me && (
        <div className="v3-me-in" style={{ position: 'absolute', left: `${V3_ME.x}%`, top: `${V3_ME.y}%`,
          transform: 'translate(-50%,-50%)' }}>
          {!reduced && [0, 0.75, 1.5].map(dl => (
            <div key={dl} className="v3-sonar" style={{ position: 'absolute', inset: -10, borderRadius: '50%',
              border: `1px solid ${v3Alpha(acc, 0.6)}`, animationDelay: `${dl}s` }}/>
          ))}
          <div style={{ position: 'relative', width: V3_ME.s, height: V3_ME.s, borderRadius: '50%', overflow: 'hidden',
            border: `2px solid ${acc}`, boxShadow: `0 0 24px ${v3Alpha(acc, 0.55)}` }}>
            <img src={me} alt="ты" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
          </div>
          <div style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)',
            padding: '2px 8px', borderRadius: 7, background: acc, whiteSpace: 'nowrap',
            fontFamily: T.mono, fontSize: 7.5, color: '#fff', letterSpacing: 0.8, textTransform: 'uppercase' }}>ты</div>
        </div>
      )}
    </div>
  );
}

window.__CONSTEL_VARIANTS = window.__CONSTEL_VARIANTS || [];
window.__CONSTEL_VARIANTS.push({
  id: 'v3',
  title: 'Пульс',
  note: 'Живая нейросеть: связи — нервные пути с бегущими искрами, аватарки тихо дышат светом; когда появляется «ты» — импульсы начинают течь именно от тебя наружу (BFS-градиент яркости/скорости по хопам), будто сеть запустилась в движение.',
  Comp: ConstellationV3,
});
