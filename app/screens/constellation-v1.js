// Constellation V1 — «Орбиты»: орбитальная глубина / параллакс.
// Люди распределены по трём орбитальным слоям вокруг невидимого гравитационного
// центра: ближний слой — крупнее, резче, вращается быстрее; дальний — мельче,
// туманнее (blur+opacity), вращается медленнее. Появление «тебя» смещает центр
// тяготения вниз — орбиты перестраиваются вокруг нового центра. Линии связи
// от ближнего слоя к центру пульсируют энергией.
//
// Компонент на уровне модуля (см. CLAUDE.md). Позиции считаются процедурно через
// rAF и пишутся напрямую в DOM через transform (без setState на кадр) — transform
// не триггерит layout (в отличие от left/top), браузер только композитит на GPU,
// поэтому дёшево даже на телефоне. prefers-reduced-motion: вращение замирает на
// стартовой позе, CSS-пульсации отключаются через media-query в том же <style>.

const V1_NEAR = [
  { id:'p2', angle:25 },
  { id:'p6', angle:205 },
];
const V1_MID = [
  { id:'p1', angle:350, link:'near-p2' },
  { id:'p9', angle:120, link:'near-p6' },
  { id:'p4', angle:240, link:'near-p2' },
];
const V1_FAR = [
  { id:'p3',  angle:70 },
  { id:'p8',  angle:160 },
  { id:'p11', angle:300 },
];

// rx/ry — радиус орбиты в % координатной сетки 0..100 (эллипс, наклон «в перспективе»).
const V1_RINGS = {
  near: { items:V1_NEAR, rx:14, ry:9,  size:56, speed:18,  dir:1,  opacity:1,    blur:0,   z:3 },
  mid:  { items:V1_MID,  rx:27, ry:16, size:40, speed:9,   dir:-1, opacity:0.82, blur:0.4, z:2 },
  far:  { items:V1_FAR,  rx:40, ry:23, size:26, speed:3.2, dir:1,  opacity:0.46, blur:1.6, z:1 },
};

// связи «с тобой» — отдельный пул и отдельная (более частая) ротация, чтобы
// пользователь гарантированно видел, как связи с ним заводятся/пропадают, а не
// ждал редкого случайного попадания в общем гуле сети (см. V1_NET_POOL ниже).
const V1_HUB_POOL = [
  { key:'hub-near-p2', from:'hub', to:'near-p2', strong:true },
  { key:'hub-near-p6', from:'hub', to:'near-p6', strong:true },
  { key:'hub-mid-p1',  from:'hub', to:'mid-p1',  strong:true },
  { key:'hub-mid-p9',  from:'hub', to:'mid-p9',  strong:true },
  { key:'hub-mid-p4',  from:'hub', to:'mid-p4',  strong:true },
];
// фоновая сеть между самими спутниками — знакомятся независимо от тебя
const V1_NET_POOL = [
  { key:'near-p2~mid-p1',   from:'near-p2', to:'mid-p1',  strong:false },
  { key:'near-p2~mid-p4',   from:'near-p2', to:'mid-p4',  strong:false },
  { key:'near-p6~mid-p9',   from:'near-p6', to:'mid-p9',  strong:false },
  { key:'near-p6~mid-p4',   from:'near-p6', to:'mid-p4',  strong:false },
  { key:'mid-p1~far-p3',    from:'mid-p1',  to:'far-p3',  strong:false },
  { key:'mid-p9~far-p8',    from:'mid-p9',  to:'far-p8',  strong:false },
  { key:'mid-p4~far-p11',   from:'mid-p4',  to:'far-p11', strong:false },
  { key:'mid-p1~mid-p9',    from:'mid-p1',  to:'mid-p9',  strong:false },
  { key:'far-p3~far-p8',    from:'far-p3',  to:'far-p8',  strong:false },
  { key:'near-p2~far-p3',   from:'near-p2', to:'far-p3',  strong:false },
];
const V1_INITIAL_HUB_KEYS = ['hub-near-p2','hub-near-p6'];
const V1_INITIAL_NET_KEYS = ['near-p2~mid-p1','near-p6~mid-p9','near-p2~mid-p4'];

function v1InitialLinks() {
  const hub = V1_HUB_POOL.filter(l => V1_INITIAL_HUB_KEYS.includes(l.key));
  const net = V1_NET_POOL.filter(l => V1_INITIAL_NET_KEYS.includes(l.key));
  return [...hub, ...net].map(l => ({ ...l, phase:'active' }));
}

// раз в minMs–maxMs одна активная связь из своего среза (isMine) угасает и
// пропадает, взамен из pool заводится другая — «старые связи отпадают,
// приходят новые». Хаб и фоновая сеть крутятся независимо (разные вызовы),
// чтобы события «с тобой» не размывались в общем шуме сети.
function useV1LinkRotation(setLinks, { pool, isMine, minMs, maxMs, fadeOutMs, fadeInMs }) {
  React.useEffect(() => {
    const reduced = typeof window !== 'undefined' && window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    let alive = true;
    const timers = [];
    const after = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };

    function tick() {
      if (!alive) return;
      setLinks(prev => {
        const activeOnes = prev.filter(l => isMine(l) && l.phase === 'active');
        if (!activeOnes.length) return prev;
        const victim = activeOnes[Math.floor(Math.random() * activeOnes.length)];
        return prev.map(l => (l.key === victim.key ? { ...l, phase:'out' } : l));
      });
      after(() => {
        if (!alive) return;
        setLinks(prev => {
          const kept = prev.filter(l => !(isMine(l) && l.phase === 'out'));
          const keptKeys = new Set(kept.filter(isMine).map(l => l.key));
          const candidates = pool.filter(l => !keptKeys.has(l.key));
          if (!candidates.length) return kept;
          const chosen = candidates[Math.floor(Math.random() * candidates.length)];
          return [...kept, { ...chosen, phase:'in' }];
        });
        after(() => {
          if (!alive) return;
          setLinks(prev => prev.map(l => (isMine(l) && l.phase === 'in' ? { ...l, phase:'active' } : l)));
        }, fadeInMs);
      }, fadeOutMs);
      after(tick, minMs + Math.random() * (maxMs - minMs));
    }
    after(tick, minMs + Math.random() * (maxMs - minMs));
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, []); // eslint-disable-line -- pool/isMine стабильны по смыслу, re-run не нужен
}

function v1Satellites() {
  const list = [];
  Object.keys(V1_RINGS).forEach(ringKey => {
    const cfg = V1_RINGS[ringKey];
    cfg.items.forEach(it => {
      list.push({
        key: `${ringKey}-${it.id}`, id: it.id, ring: ringKey, hot: !!it.hot,
        angle: it.angle, rx: cfg.rx, ry: cfg.ry, size: cfg.size,
        speed: cfg.speed, dir: cfg.dir, opacity: cfg.opacity, blur: cfg.blur, z: cfg.z,
      });
    });
  });
  return list;
}

function ConstellationV1({ accent, me, height }) {
  const acc = accent || (typeof T !== 'undefined' ? T.accent : '#FF5820');
  const h = height || 200;

  const cx = 50;
  const cy = me ? 60 : 44;

  const sats = React.useMemo(v1Satellites, []);
  const [links, setLinks] = React.useState(v1InitialLinks);
  const res = (typeof window !== 'undefined' && window.__resources) || {};

  const avatarRefs = React.useRef({});
  const lineRefs = React.useRef({});
  const posRef = React.useRef({}); // key -> {x,y}, включая 'hub'
  const linksRef = React.useRef(links);
  React.useEffect(() => { linksRef.current = links; }, [links]);

  // позиционный rAF — не зависит от состава связей (иначе смена связей на лету
  // рестартовала бы таймер орбит и спутники дёргались бы). Текущий состав связей
  // читается из linksRef, а не из замыкания.
  React.useEffect(() => {
    posRef.current.hub = { x: cx, y: cy };
    const reduced = typeof window !== 'undefined' && window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = null;
    const start = (typeof performance !== 'undefined' ? performance.now() : Date.now());

    function frame(now) {
      const t = reduced ? 0 : (now - start) / 1000;
      for (let i = 0; i < sats.length; i++) {
        const s = sats[i];
        const a = (s.angle + t * s.speed * s.dir) * Math.PI / 180;
        const dx = Math.cos(a) * s.rx;
        const dy = Math.sin(a) * s.ry;
        posRef.current[s.key] = { x: cx + dx, y: cy + dy };
        const el = avatarRefs.current[s.key];
        if (el) el.style.transform = `translate(${dx}%, ${dy}%)`;
      }
      const currentLinks = linksRef.current;
      for (let i = 0; i < currentLinks.length; i++) {
        const l = currentLinks[i];
        const from = posRef.current[l.from];
        const to = posRef.current[l.to];
        const ln = lineRefs.current[l.key];
        if (ln && from && to) {
          ln.setAttribute('x1', from.x); ln.setAttribute('y1', from.y);
          ln.setAttribute('x2', to.x);   ln.setAttribute('y2', to.y);
        }
      }
      if (!reduced) raf = requestAnimationFrame(frame);
    }
    frame(start);
    if (!reduced) raf = requestAnimationFrame(frame);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [sats, cx, cy]);

  // связи «с тобой» — быстрее и гарантированно (каждые 2.6–4с одна точно
  // сменится), чтобы это было заметно, а не тонуло в общем гуле сети
  useV1LinkRotation(setLinks, {
    pool: V1_HUB_POOL, isMine: l => l.from === 'hub',
    minMs: 2600, maxMs: 4000, fadeOutMs: 900, fadeInMs: 650,
  });
  // фоновая сеть между спутниками — медленнее, для общего ощущения жизни
  useV1LinkRotation(setLinks, {
    pool: V1_NET_POOL, isMine: l => l.from !== 'hub',
    minMs: 2200, maxMs: 4000, fadeOutMs: 900, fadeInMs: 650,
  });

  return (
    <div style={{ position:'relative', width:'100%', height:h, margin:'0 0', pointerEvents:'none' }}>
      <style>{`
        @keyframes v1-hub-breathe {
          0%,100% { box-shadow: 0 0 18px 2px var(--v1-acc-glow, rgba(255,88,32,0.5)); transform: scale(1); }
          50%     { box-shadow: 0 0 30px 8px var(--v1-acc-glow, rgba(255,88,32,0.5)); transform: scale(1.04); }
        }
        @keyframes v1-seed-pulse {
          0%,100% { opacity:0.35; transform: scale(1); }
          50%     { opacity:0.85; transform: scale(1.6); }
        }
        @keyframes v1-line-strong {
          0%,100% { opacity:0.28; stroke-width:0.5; }
          50%     { opacity:0.95; stroke-width:0.9; }
        }
        @keyframes v1-line-soft {
          0%,100% { opacity:0.12; }
          50%     { opacity:0.4; }
        }
        @keyframes v1-link-fade-in {
          from { opacity:0; stroke-dashoffset:6; }
          to   { opacity:var(--v1-target-op, 0.4); stroke-dashoffset:0; }
        }
        @keyframes v1-link-flash-in {
          0%   { opacity:0;    stroke-width:0.4; stroke:#fff; }
          30%  { opacity:1;    stroke-width:1.7; stroke:#fff; }
          60%  { opacity:0.9;  stroke-width:0.9; stroke:${acc}; }
          100% { opacity:var(--v1-target-op, 0.28); stroke-width:0.5; stroke:${acc}; }
        }
        @keyframes v1-link-fade-out {
          from { opacity:var(--v1-target-op, 0.4); }
          to   { opacity:0; }
        }
        @keyframes v1-far-twinkle {
          0%,100% { opacity: var(--v1-op, 0.46); }
          50%     { opacity: calc(var(--v1-op, 0.46) * 0.55); }
        }
        @keyframes v1-hot-ring {
          0%   { transform: scale(0.85); opacity:0.9; }
          70%  { transform: scale(1.5); opacity:0; }
          100% { transform: scale(1.5); opacity:0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .v1-hub, .v1-seed, .v1-link-strong, .v1-link-soft, .v1-far, .v1-hot-ring {
            animation: none !important;
          }
        }
      `}</style>

      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position:'absolute', inset:0, overflow:'visible' }}>
        {/* orbit path guides — декоративные направляющие эллипсы */}
        {Object.keys(V1_RINGS).map(ringKey => {
          const cfg = V1_RINGS[ringKey];
          return (
            <ellipse key={ringKey} cx={cx} cy={cy} rx={cfg.rx} ry={cfg.ry}
              fill="none" stroke={T.soft} strokeWidth="0.22" strokeDasharray="0.6 2.4"
              opacity={ringKey === 'near' ? 0.35 : ringKey === 'mid' ? 0.22 : 0.12} />
          );
        })}
        {/* динамические связи (позиции пишутся в рефы в rAF); phase управляет
            появлением/исчезновением — новые связи заводятся, старые отпадают */}
        {links.map(l => {
          const targetOp = l.strong ? 0.28 : 0.12;
          const touchesMe = me && (l.from === 'hub' || l.to === 'hub');
          const anim = l.phase === 'in'
            ? (touchesMe
              ? 'v1-link-flash-in 750ms cubic-bezier(.15,.8,.25,1) forwards'
              : 'v1-link-fade-in 650ms cubic-bezier(.2,.7,.3,1) forwards')
            : l.phase === 'out'
              ? 'v1-link-fade-out 850ms ease-in forwards'
              : l.strong ? 'v1-line-strong 2.6s ease-in-out infinite' : 'v1-line-soft 3.6s ease-in-out infinite';
          return (
            <line key={l.key} ref={el => { if (el) lineRefs.current[l.key] = el; else delete lineRefs.current[l.key]; }}
              className={l.strong ? 'v1-link-strong' : 'v1-link-soft'}
              x1={cx} y1={cy} x2={cx} y2={cy}
              stroke={l.strong ? acc : T.soft}
              strokeWidth={l.strong ? 0.6 : 0.3}
              strokeLinecap="round"
              style={{ '--v1-target-op': targetOp, animation: anim,
                animationDelay: l.phase === 'active' && l.strong === false ? '0.6s' : '0s' }} />
          );
        })}
      </svg>

      {sats.map(s => {
        const photo = res[s.id];
        const ring = s.hot ? acc : (s.ring === 'near' ? 'rgba(242,235,217,0.32)' : 'rgba(242,235,217,0.18)');
        return (
          <div key={s.key} ref={el => { if (el) avatarRefs.current[s.key] = el; }}
            style={{ position:'absolute', inset:0, willChange:'transform', pointerEvents:'none' }}
          >
            <div style={{
                position:'absolute', left:`${cx}%`, top:`${cy}%`,
                width:s.size, height:s.size, marginLeft:-s.size/2, marginTop:-s.size/2,
                zIndex:s.z, opacity:s.opacity,
                filter: s.blur ? `blur(${s.blur}px)` : 'none',
              }}
            >
              <div className={s.ring === 'far' ? 'v1-far' : undefined}
                style={{ position:'relative', width:'100%', height:'100%',
                '--v1-op': s.opacity,
                animationDelay: s.ring === 'far' ? `${(s.angle % 5)}s` : undefined }}>
                <img src={photo} alt="" style={{
                  width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover', display:'block',
                  border:`1.5px solid ${ring}`,
                  boxShadow: s.hot ? `0 0 16px ${acc}66` : (s.ring === 'near' ? '0 2px 10px rgba(0,0,0,0.45)' : 'none'),
                }} />
                {s.hot && (
                  <div className="v1-hot-ring" style={{
                    position:'absolute', inset:-6, borderRadius:'50%',
                    border:`1px solid ${acc}88`,
                    animation:'v1-hot-ring 2.4s ease-out infinite' }} />
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* гравитационный центр: "ты" (финал онбординга) либо тихий зародыш (приветствие) */}
      {me ? (
        <div style={{ position:'absolute', left:`${cx}%`, top:`${cy}%`, transform:'translate(-50%,-50%)', zIndex:5 }}>
          <div className="v1-hub" style={{
            width:58, height:58, borderRadius:'50%', overflow:'hidden',
            border:`2px solid ${acc}`, '--v1-acc-glow': `${acc}80`,
            animation:'v1-hub-breathe 3.2s ease-in-out infinite' }}>
            <img src={me} alt="ты" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          </div>
          {/* "ты" — единственный, кто теперь получает hot-кольцо (раньше было у p2) */}
          <div className="v1-hot-ring" style={{
            position:'absolute', inset:-6, borderRadius:'50%',
            border:`1px solid ${acc}88`,
            animation:'v1-hot-ring 2.4s ease-out infinite' }} />
        </div>
      ) : (
        <div className="v1-seed" style={{ position:'absolute', left:`${cx}%`, top:`${cy}%`,
          width:8, height:8, marginLeft:-4, marginTop:-4, borderRadius:'50%',
          background:acc, animation:'v1-seed-pulse 2.8s ease-in-out infinite', zIndex:5 }} />
      )}
    </div>
  );
}

window.__CONSTEL_VARIANTS = window.__CONSTEL_VARIANTS || [];
window.__CONSTEL_VARIANTS.push({
  id: 'v1',
  title: 'Орбиты',
  note: 'Три орбитальных слоя вокруг гравитационного центра: ближний — крупнее и быстрее, дальний — мельче, туманнее и медленнее (parallax глубины); появление «тебя» смещает центр тяготения вниз, а линии связи к ближнему кругу пульсируют энергией.',
  Comp: ConstellationV1,
});
