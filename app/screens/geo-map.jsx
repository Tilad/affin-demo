// MapVariantGeo — главная карта на живом MapLibre (крем-гамма Affin).
// Заменяет MapVariantA: настоящий пан/пинч-зум, люди в GeoJSON-кластерах
// (сливаются в группы, разлипаются при приближении; сверхплотные остаются группой),
// новые пины-капли для событий. Интерфейс совместим с MapVariantA.
const { T: Tg, PEOPLE: GEO_PEOPLE } = window;

const G_DEPO   = [37.5934, 55.7794];   // Mining Expo
const G_BRKF   = [37.5868, 55.7746];   // Крипто-завтрак
const G_SELF0  = [37.5952, 55.7762];   // ты (по умолчанию)
const G_BASE   = { center:[37.5934, 55.7780], zoom:14.6 };
const G_SPOTS  = {
  p1:[37.5892,55.7772], p2:[37.5988,55.7822], p3:[37.6010,55.7781], p4:[37.5860,55.7815],
  p5:[37.5975,55.7752], p6:[37.6042,55.7822], p7:[37.5905,55.7745], p8:[37.6068,55.7760],
  p9:[37.5836,55.7786], p10:[37.5998,55.7842], p11:[37.6090,55.7800], p12:[37.5870,55.7844],
};
// плотная группа у сцены — на любом зуме остаётся кластером
const G_DENSE = [37.5915, 55.7808];

const G_CREAM = {
  bg:'#F2EDE0', ground:'#EFE9DA', water:'#D9E0E0', waterLine:'#CBD6D8',
  park:'#E3E7CE', wood:'#DBE1C6', sand:'#EDE4CF', building:'#E6DECB', aeroway:'#E9E2D0',
  roadMinor:'#FBF7EC', roadMid:'#F9F2E2', roadMajor:'#F7EEDB', roadCase:'#DDD3BE',
  rail:'#DFD6C3', boundary:'#C9BCA2',
  textMajor:'#4E4433', textMid:'#7A6D55', textSoft:'#9A8C6F', poi:'#A5957A',
  halo:'rgba(242,237,224,0.9)',
};
const G_DARK = {
  bg:'#131009', ground:'#171309', water:'#0C1014', waterLine:'#141B22',
  park:'#161B10', wood:'#12160B', sand:'#1B160C', building:'#1C160C', aeroway:'#1C170D',
  roadMinor:'#211A0E', roadMid:'#2B2213', roadMajor:'#382C17', roadCase:'#0C0A06',
  rail:'#251E12', boundary:'#4A3B24',
  textMajor:'#F2EBD9', textMid:'#C4B49A', textSoft:'#8A7A5E', poi:'#7A6D55',
  halo:'#0F0C08',
};
function gRestyle(src, C) {
  const s = JSON.parse(JSON.stringify(src));
  for (const l of s.layers) {
    const id = l.id; l.paint = l.paint || {};
    if (l.type === 'background') { l.paint['background-color'] = C.bg; continue; }
    if (l.type === 'fill') {
      let c = C.ground;
      if (/water|ocean/.test(id)) c = C.water;
      else if (/park|green|grass|garden|cemet|stadium|pitch|zoo/.test(id)) c = C.park;
      else if (/wood|forest/.test(id)) c = C.wood;
      else if (/sand|beach/.test(id)) c = C.sand;
      else if (/building/.test(id)) c = C.building;
      else if (/aeroway|runway|taxiway/.test(id)) c = C.aeroway;
      l.paint['fill-color'] = c;
      if ('fill-outline-color' in l.paint) l.paint['fill-outline-color'] = C.roadCase;
      continue;
    }
    if (l.type === 'line') {
      let c = C.roadMinor;
      if (/water/.test(id)) c = C.waterLine;
      else if (/boundary|admin/.test(id)) c = C.boundary;
      else if (/rail|transit/.test(id)) c = C.rail;
      else if (/casing|case/.test(id)) c = C.roadCase;
      else if (/motorway|trunk/.test(id)) c = C.roadMajor;
      else if (/major|primary|secondary|street/.test(id)) c = C.roadMid;
      l.paint['line-color'] = c;
      continue;
    }
    if (l.type === 'symbol') {
      let c = C.textMid;
      if (/place|city|town|country|state|capital/.test(id)) c = C.textMajor;
      else if (/poi/.test(id)) c = C.poi;
      else if (/road|highway|water|transport/.test(id)) c = C.textSoft;
      l.paint['text-color'] = c;
      l.paint['text-halo-color'] = C.halo;
      l.paint['icon-opacity'] = 0.4;
      continue;
    }
    if (l.type === 'circle') {
      l.paint['circle-color'] = C.poi;
      if ('circle-stroke-color' in l.paint) l.paint['circle-stroke-color'] = C.halo;
    }
  }
  return s;
}

// ── HTML маркеров (визуально повторяют PersonMarker/ClusterMarker/SelfMarker) ──
function gPersonEl(p, accent, onClick) {
  const color = p.highlight ? accent : (p.color || '#8C7E66');
  const size = p.highlight ? 56 : 44;
  const el = document.createElement('div');
  el.style.cssText = `cursor:pointer;-webkit-tap-highlight-color:transparent;z-index:${p.highlight?5:3};`;
  el.innerHTML =
    `<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${size+26}px;height:${size+26}px;border-radius:50%;`+
      `background:radial-gradient(circle, ${color}26 0%, ${color}00 70%);pointer-events:none;"></div>`+
    `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${Tg.surface};border:1.5px solid ${color};overflow:hidden;`+
      `box-shadow:${p.highlight ? `0 0 0 3px rgba(255,88,32,0.18), 0 4px 14px rgba(0,0,0,0.35)` : '0 2px 6px rgba(0,0,0,0.3)'};">`+
      (p.photo ? `<img src="${p.photo}" style="width:100%;height:100%;object-fit:cover;display:block;"/>`
               : `<span style="font-family:${Tg.hand};font-size:19px;font-weight:700;color:${color};display:flex;align-items:center;justify-content:center;height:100%;">${p.n||''}</span>`) +
    `</div>`;
  el.addEventListener('click', e => { e.stopPropagation(); onClick && onClick(); });
  return el;
}

function gClusterEl(count, accent, onClick) {
  const el = document.createElement('div');
  el.style.cssText = 'cursor:pointer;-webkit-tap-highlight-color:transparent;z-index:4;';
  el.innerHTML =
    `<div style="width:44px;height:44px;border-radius:50%;background:${Tg.surface};border:1.5px solid ${accent}55;`+
      `box-shadow:0 0 0 6px rgba(255,88,32,0.08), 0 4px 12px rgba(0,0,0,0.35);`+
      `display:flex;flex-direction:column;align-items:center;justify-content:center;">`+
      `<span style="font-family:${Tg.serif};font-size:15px;font-weight:700;color:${Tg.ink};line-height:1;">${count}</span>`+
      `<span style="font-family:${Tg.mono};font-size:6.5px;color:${Tg.soft};letter-spacing:0.8px;margin-top:1px;">людей</span>`+
    `</div>`;
  el.addEventListener('click', e => { e.stopPropagation(); onClick && onClick(); });
  return el;
}

// пины событий: конфа — круг с лого «A» и пульсирующим кольцом (как первый маркер на карте);
// митап — круг с нетворкинг-глифом (люди вокруг диалога) в стиле Affin
function gEventEl({ accent, label, kind, onClick }) {
  if (!document.getElementById('gEventPulseKf')) {
    const st = document.createElement('style'); st.id = 'gEventPulseKf';
    st.textContent = '@keyframes gEventPulse{0%{width:56px;height:56px;opacity:.6;}100%{width:130px;height:130px;opacity:0;}}' +
      '@media (prefers-reduced-motion: reduce){.gev-pulse{animation:none !important;display:none;}}';
    document.head.appendChild(st);
  }
  const core = kind === 'conf'
    ? `<div style="position:relative;width:56px;height:56px;">
        <div class="gev-pulse" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
          width:56px;height:56px;border-radius:50%;border:2px solid ${accent};opacity:.6;
          animation:gEventPulse 2.4s ease-out infinite;pointer-events:none;"></div>
        <div style="width:56px;height:56px;border-radius:50%;background:#FFFFFF;border:1.5px solid rgba(40,20,5,0.08);
          display:flex;align-items:center;justify-content:center;overflow:hidden;
          box-shadow:0 5px 16px rgba(40,20,5,0.35);">
          <img src="app/avatars/expo-logo.png" alt="Mining Expo" draggable="false"
            style="width:64%;height:64%;object-fit:contain;pointer-events:none;"/>
        </div>
      </div>`
    : `<div style="width:56px;height:56px;border-radius:50%;background:${Tg.surface};border:1.5px solid #F6EFDF;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 5px 14px rgba(40,20,5,0.35);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12.6" r="6.6" stroke="${accent}" stroke-width="1.5"/>
          <rect x="8.2" y="9.9" width="5.2" height="3.4" rx="1.1" fill="${accent}"/>
          <path d="M9.6 13.3v1.5l1.6-1.5z" fill="${accent}"/>
          <rect x="11.4" y="12.6" width="4.4" height="2.9" rx="1" fill="none" stroke="${accent}" stroke-width="1.1"/>
          <circle cx="12" cy="2.9" r="1.7" fill="${accent}"/>
          <path d="M9.4 6.3a3.1 3.1 0 0 1 5.2 0" stroke="${accent}" stroke-width="1.4" stroke-linecap="round"/>
          <circle cx="3.4" cy="16.4" r="1.7" fill="${accent}"/>
          <path d="M1 20.6a3.1 3.1 0 0 1 4.9-.6" stroke="${accent}" stroke-width="1.4" stroke-linecap="round"/>
          <circle cx="20.6" cy="16.4" r="1.7" fill="${accent}"/>
          <path d="M23 20.6a3.1 3.1 0 0 0-4.9-.6" stroke="${accent}" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </div>`;
  const el = document.createElement('div');
  el.style.cssText = 'cursor:pointer;-webkit-tap-highlight-color:transparent;z-index:6;display:flex;flex-direction:column;align-items:center;';
  el.innerHTML = core +
    `<div style="margin-top:5px;padding:3px 9px;border-radius:8px;background:${Tg.glass};`+
      `backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid ${Tg.divide};display:flex;align-items:center;gap:6px;white-space:nowrap;">`+
      `<span style="font-family:${Tg.serif};font-size:11px;font-weight:600;color:${Tg.ink};line-height:1;">${label}</span>`+
      `<span style="width:6px;height:6px;border-radius:50%;background:#3FB87C;box-shadow:0 0 5px rgba(63,184,124,0.9);"></span>`+
    `</div>`;
  el.addEventListener('click', e => { e.stopPropagation(); onClick && onClick(); });
  return el;
}

function gSelfEl(accent, photo, onClick) {
  if (!document.getElementById('gSelfPulseKf')) {
    const st = document.createElement('style'); st.id = 'gSelfPulseKf';
    st.textContent = '@keyframes gSelfPulse{0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1);}50%{opacity:1;transform:translate(-50%,-50%) scale(1.25);}}';
    document.head.appendChild(st);
  }
  const el = document.createElement('div');
  el.style.cssText = 'cursor:pointer;-webkit-tap-highlight-color:transparent;width:64px;height:64px;z-index:6;position:relative;';
  el.innerHTML =
    `<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:62px;height:62px;border-radius:50%;`+
      `background:radial-gradient(circle, ${accent}55 0%, ${accent}00 70%);animation:gSelfPulse 2.4s ease-in-out infinite;pointer-events:none;"></div>`+
    `<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:32px;height:32px;border-radius:50%;overflow:hidden;`+
      `border:2.5px solid #fff;box-shadow:0 4px 12px ${accent}88;background:linear-gradient(135deg,${accent},${accent}b0);">`+
      (photo ? `<img src="${photo}" style="width:100%;height:100%;object-fit:cover;display:block;"/>` : '') +
    `</div>`;
  el.addEventListener('click', e => { e.stopPropagation(); onClick && onClick(); });
  return el;
}

function MapVariantGeo({ threshold = 0, accent = Tg.accent, onPerson, onCluster, clusterCount = 4,
  onSelfTap, hideEvent = false, onEventTap, onEvent2Tap, selfHidden = false, panApi }) {
  const boxRef = React.useRef(null);
  const mapRef = React.useRef(null);
  const markersRef = React.useRef(new Map());   // key → maplibregl.Marker (люди/кластеры)
  const staticRef  = React.useRef([]);          // события/self
  const [edge, setEdge] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  const selfLLRef = React.useRef(null);
  const [theme, setTheme] = React.useState(() => {
    try { return localStorage.getItem('affin-map-theme') === 'dark' ? 'dark' : 'light'; } catch(e) { return 'light'; }
  });
  const stylesRef = React.useRef(null);
  const themeRef = React.useRef('light');
  themeRef.current = theme;
  const addPeopleRef = React.useRef(null);

  const propsRef = React.useRef({});
  propsRef.current = { onPerson, onCluster, onEventTap, onEvent2Tap, onSelfTap, hideEvent, selfHidden, accent, threshold, clusterCount };

  if (panApi) panApi.current = { recenter: () => {
    const m = mapRef.current; if (m) m.easeTo({ center: G_BASE.center, zoom: G_BASE.zoom, duration: 600 });
  }};

  React.useEffect(() => {
    if (typeof maplibregl === 'undefined' || !boxRef.current) return;
    let dead = false, map = null;

    fetch('https://tiles.openfreemap.org/styles/positron')
      .then(r => r.json())
      .then(style => {
        if (dead || !boxRef.current) return;
        stylesRef.current = { light: gRestyle(style, G_CREAM), dark: gRestyle(style, G_DARK) };
        map = new maplibregl.Map({
          container: boxRef.current, style: stylesRef.current[themeRef.current],
          center: G_BASE.center, zoom: G_BASE.zoom,
          minZoom: 13, maxZoom: 17,
          attributionControl: false, fadeDuration: 0,
          dragRotate: false, pitchWithRotate: false,
        });
        map.touchZoomRotate.disableRotation();
        mapRef.current = map;

        map.on('load', () => {
          if (dead) return;
          const P = propsRef.current;

          // люди → GeoJSON с кластеризацией; clusterMaxZoom = maxZoom:
          // рассеянные разлипаются при приближении сами, сверхплотные остаются группой
          const feats = GEO_PEOPLE.filter(p => G_SPOTS[p.id]).map(p => ({
            type:'Feature', geometry:{ type:'Point', coordinates: G_SPOTS[p.id] },
            properties:{ id: p.id },
          }));
          for (let i = 0; i < (P.clusterCount || 4); i++) {
            feats.push({ type:'Feature', geometry:{ type:'Point', coordinates: G_DENSE }, properties:{ id:'dense'+i } });
          }
          const addPeople = () => {
            if (map.getSource('people')) return;
            map.addSource('people', { type:'geojson',
              data:{ type:'FeatureCollection', features: feats },
              cluster: true, clusterRadius: 56, clusterMaxZoom: 17 });
            // невидимый слой — заставляет source грузить тайлы для querySourceFeatures
            map.addLayer({ id:'people-ghost', type:'circle', source:'people',
              paint:{ 'circle-radius': 0, 'circle-opacity': 0 } });
          };
          addPeople();
          addPeopleRef.current = addPeople;

          // статичные маркеры: события + self
          if (!P.hideEvent) {
            staticRef.current.push(
              new maplibregl.Marker({ element: gEventEl({ accent: P.accent, label:'Mining Expo', kind:'conf',
                onClick: () => propsRef.current.onEventTap && propsRef.current.onEventTap() }), anchor:'top' })
                .setLngLat(G_DEPO).addTo(map),
              new maplibregl.Marker({ element: gEventEl({ accent: P.accent, label:'Крипто-завтрак', kind:'meetup',
                onClick: () => propsRef.current.onEvent2Tap && propsRef.current.onEvent2Tap() }), anchor:'top' })
                .setLngLat(G_BRKF).addTo(map),
            );
            // капля указывает точкой вниз — якорь по острию
            staticRef.current.forEach(mk => { mk.setOffset([0, -28]); });
          }

          const sync = () => {
            if (dead) return;
            const P2 = propsRef.current;
            const seen = new Set();
            const fs = map.querySourceFeatures('people');
            for (const f of fs) {
              const isC = f.properties.cluster;
              const key = isC ? 'c' + f.properties.cluster_id : 'p' + f.properties.id;
              if (seen.has(key)) continue;
              seen.add(key);
              const ll = f.geometry.coordinates;
              let mk = markersRef.current.get(key);
              if (!mk) {
                let el;
                if (isC) {
                  const cid = f.properties.cluster_id, cnt = f.properties.point_count;
                  el = gClusterEl(cnt, P2.accent, () => {
                    const m2 = mapRef.current; if (!m2) return;
                    const src = m2.getSource('people');
                    src.getClusterLeaves(cid, 100, 0).then(leaves => {
                      const [x0, y0] = leaves[0].geometry.coordinates;
                      const dense = leaves.every(l =>
                        Math.abs(l.geometry.coordinates[0] - x0) < 1e-6 && Math.abs(l.geometry.coordinates[1] - y0) < 1e-6);
                      if (dense || m2.getZoom() >= 16.2) {
                        propsRef.current.onCluster && propsRef.current.onCluster({ count: leaves.length });
                      } else {
                        m2.easeTo({ center: ll, zoom: Math.min(17, m2.getZoom() + 1.7), duration: 550 });
                      }
                    }).catch(() => {});
                  });
                } else {
                  const p = GEO_PEOPLE.find(q => q.id === f.properties.id);
                  if (!p) { // синтетические плотные точки — не рисуем поодиночке
                    continue;
                  }
                  el = gPersonEl(p, P2.accent, () => propsRef.current.onPerson && propsRef.current.onPerson(p));
                  if (P2.threshold && p.score < P2.threshold) el.style.opacity = 0.32;
                }
                mk = new maplibregl.Marker({ element: el, anchor:'center' }).setLngLat(ll).addTo(map);
                markersRef.current.set(key, mk);
              } else {
                mk.setLngLat(ll);
              }
            }
            for (const [key, mk] of markersRef.current) {
              if (!seen.has(key)) { mk.remove(); markersRef.current.delete(key); }
            }
            // edge-индикатор события
            if (!propsRef.current.hideEvent) {
              const pt = map.project(G_DEPO);
              const w = map.getContainer().clientWidth, h = map.getContainer().clientHeight;
              const out = pt.x < 30 || pt.x > w - 30 || pt.y < 116 || pt.y > h - 96;
              if (out) {
                const cx = Math.max(34, Math.min(w - 78, pt.x - 22));
                const cy = Math.max(120, Math.min(h - 170, pt.y - 22));
                setEdge({ cx, cy });
              } else setEdge(null);
            }
          };

          map.on('move', sync);
          map.on('moveend', sync);
          map.on('sourcedata', e => { if (e.sourceId === 'people' && e.isSourceLoaded) sync(); });
          sync();
          setReady(true);
          window.__geoMap = map; // отладка/тесты
        });
      })
      .catch(() => {});

    return () => {
      dead = true;
      for (const [, mk] of markersRef.current) mk.remove();
      markersRef.current.clear();
      staticRef.current.forEach(mk => mk.remove());
      staticRef.current = [];
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // self-маркер: появляется в центре карты в момент подтверждения («Готово» в режиме постановки)
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    if (!selfHidden) {
      if (!selfLLRef.current) {
        const c = map.getCenter();
        // если карта у базового вида — ставим в дефолтную точку, иначе под центральным пином
        const drifted = Math.abs(c.lng - G_BASE.center[0]) > 1e-4 || Math.abs(c.lat - G_BASE.center[1]) > 1e-4;
        selfLLRef.current = drifted ? [c.lng, c.lat] : G_SELF0;
      }
      const el = gSelfEl(accent, window.__resources && window.__resources.self5, () => propsRef.current.onSelfTap && propsRef.current.onSelfTap());
      const mk = new maplibregl.Marker({ element: el, anchor:'center' }).setLngLat(selfLLRef.current).addTo(map);
      return () => mk.remove();
    }
  }, [selfHidden, ready]);

  const toggleTheme = () => {
    const m = mapRef.current;
    if (!m || !stylesRef.current) return;
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try { localStorage.setItem('affin-map-theme', next); } catch(e) {}
    m.setStyle(stylesRef.current[next], { diff:false });
    m.once('style.load', () => { addPeopleRef.current && addPeopleRef.current(); });
  };

  return (
    <div style={{ position:'absolute', inset:0, background: theme === 'light' ? G_CREAM.bg : G_DARK.bg, overflow:'hidden' }}>
      <div ref={boxRef} style={{ position:'absolute', inset:0 }}/>
      {/* переключатель светлая/тёмная — над кнопкой центровки */}
      {ready && (
        <button onClick={toggleTheme} aria-label="переключить тему карты" style={{
          position:'absolute', right:14, bottom:248, zIndex:9,
          width:40, height:40, borderRadius:14, border:'none',
          background:Tg.glass, backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
          outline:`1px solid ${Tg.divide}`, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          {theme === 'light' ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={Tg.mid} strokeWidth="2" strokeLinecap="round">
              <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={Tg.mid} strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
            </svg>
          )}
        </button>
      )}
      {edge && (
        <button onClick={() => panApi && panApi.current && panApi.current.recenter()} aria-label="вернуться к событию" style={{
          position:'absolute', left:edge.cx, top:edge.cy, zIndex:9,
          width:44, height:44, borderRadius:'50%',
          border:'1.5px solid #fff', background:accent, cursor:'pointer', padding:0,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`0 0 0 5px ${accent}22, 0 6px 18px ${accent}66`,
        }}>
          <svg width="17" height="20" viewBox="0 0 32 38">
            <path d="M16 36.5C16 36.5 3.5 24.5 3.5 14.5A12.5 12.5 0 1 1 28.5 14.5C28.5 24.5 16 36.5 16 36.5Z" fill="none" stroke="#fff" strokeWidth="2.6"/>
            <circle cx="16" cy="14.5" r="4" fill="#fff"/>
          </svg>
        </button>
      )}
    </div>
  );
}

window.MapVariantGeo = MapVariantGeo;
