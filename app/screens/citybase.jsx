// CityBasemap — живая Москва (MapLibre + OpenFreeMap Positron) в светлой крем-гамме Affin.
// Рендерится ВНУТРИ панорамируемого «мира» MapVariantA (слой 200%×200%): канвас статичен,
// interactive:false, и ездит вместе с пинами через CSS-transform мира — синхронизация не нужна.
// Депо привязано к точке события мира (50%, 45%) — т.е. на 5% высоты мира выше его центра.
const DEPO_LL = [37.5934, 55.7794];

const CREAM = {
  bg:'#F2EDE0', ground:'#EFE9DA',
  water:'#D9E0E0', waterLine:'#CBD6D8',
  park:'#E3E7CE', wood:'#DBE1C6', sand:'#EDE4CF',
  building:'#E6DECB', aeroway:'#E9E2D0',
  roadMinor:'#FBF7EC', roadMid:'#F9F2E2', roadMajor:'#F7EEDB', roadCase:'#DDD3BE',
  rail:'#DFD6C3', boundary:'#C9BCA2',
  textMajor:'#4E4433', textMid:'#7A6D55', textSoft:'#9A8C6F', poi:'#A5957A',
  halo:'rgba(242,237,224,0.9)',
};

function creamify(src) {
  const s = JSON.parse(JSON.stringify(src)), C = CREAM;
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

function CityBasemap() {
  const boxRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (typeof maplibregl === 'undefined') return;
    let map = null, ro = null, dead = false;
    fetch('https://tiles.openfreemap.org/styles/positron')
      .then(r => r.json())
      .then(style => {
        if (dead || !boxRef.current) return;
        map = new maplibregl.Map({
          container: boxRef.current,
          style: creamify(style),
          center: DEPO_LL, zoom: 14.6,
          interactive: false, attributionControl: false, fadeDuration: 0,
        });
        map.on('load', () => {
          if (dead) return;
          // событие мира лежит на 5% высоты канваса выше его центра
          map.panBy([0, Math.round(boxRef.current.clientHeight * 0.05)], { animate: false });
          setReady(true);
        });
        ro = new ResizeObserver(() => map && map.resize());
        ro.observe(boxRef.current);
      })
      .catch(() => {});
    return () => { dead = true; if (ro) ro.disconnect(); if (map) map.remove(); };
  }, []);

  return (
    <div ref={boxRef} style={{
      position:'absolute', inset:0,
      opacity: ready ? 1 : 0, transition:'opacity 0.6s',
      pointerEvents:'none',
    }}/>
  );
}

window.CityBasemap = CityBasemap;
