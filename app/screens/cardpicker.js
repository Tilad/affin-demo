// Reusable card picker — выбор отображаемой карточки + создать новую
// Создание доступно всегда; на free-тарифе onCreate ведёт на оплату.
const { T: TP, MARINA: MARINA_P, MY_CARDS: CARDS_P } = window;

function CardPickerSheet({ accent = TP.accent, cards = CARDS_P, selectedId, title = 'С какой карточкой ты здесь?',
  subtitle, onSelect, onCreate, onClose, dismissable = true }) {
  return (
    <div style={{position:'absolute', inset:0, zIndex:70, background:T.scrim,
      display:'flex', alignItems:'flex-end'}} onClick={dismissable ? onClose : undefined}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%', background:T.sheet, borderRadius:'22px 22px 0 0',
        border:`1px solid ${TP.divide}`, borderBottom:'none', padding:'18px 18px 28px',
      }}>
        <div style={{width:36, height:4, borderRadius:2, background:TP.hi, margin:'0 auto 16px'}}/>
        <div style={{fontFamily:TP.serif, fontSize:20, fontWeight:700, color:TP.ink, fontStyle:'italic', lineHeight:1.2}}>{title}</div>
        {subtitle && <div style={{fontFamily:TP.sans, fontSize:12.5, color:TP.soft, marginTop:5}}>{subtitle}</div>}

        <div style={{display:'flex', flexDirection:'column', gap:9, marginTop:16}}>
          {cards.map(c => {
            const on = selectedId === c.id;
            return (
              <button key={c.id} onClick={() => onSelect && onSelect(c)} style={{
                display:'flex', alignItems:'center', gap:12, textAlign:'left', cursor:'pointer',
                padding:'12px 14px', borderRadius:15,
                background: on ? `${accent}14` : TP.surface,
                border: on ? `1.5px solid ${accent}` : `1px solid ${TP.divide}`,
              }}>
                <div style={{width:44, height:44, borderRadius:'50%', overflow:'hidden', flexShrink:0,
                  border:`1.5px solid ${on ? accent : TP.divide}`}}>
                  <img src={MARINA_P.photo} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:'flex', alignItems:'center', gap:7}}>
                    <span style={{fontFamily:TP.serif, fontSize:15.5, fontWeight:700, color:TP.ink}}>{c.title}</span>
                  </div>
                  <div style={{fontFamily:TP.sans, fontSize:11.5, color:TP.soft, marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{c.context} · {c.tags.join(' · ')}</div>
                </div>
                <div style={{width:20, height:20, borderRadius:'50%', flexShrink:0,
                  border: on ? `6px solid ${accent}` : `1.5px solid ${TP.soft}`}}/>
              </button>
            );
          })}

          {/* создать новую */}
          <button onClick={() => onCreate && onCreate()} style={{
            display:'flex', alignItems:'center', gap:12, textAlign:'left', cursor:'pointer',
            padding:'12px 14px', borderRadius:15, background:'transparent',
            border:`1.5px dashed ${TP.soft}`,
          }}>
            <div style={{width:44, height:44, borderRadius:'50%', flexShrink:0, border:`1.5px dashed ${TP.soft}`,
              display:'flex', alignItems:'center', justifyContent:'center'}}>
              <svg width="15" height="15" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke={TP.soft} strokeWidth="1.6" strokeLinecap="round"/></svg>
            </div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontFamily:TP.sans, fontSize:14.5, fontWeight:600, color:TP.ink}}>Новая карточка</div>
              <div style={{fontFamily:TP.sans, fontSize:11.5, color:TP.soft, marginTop:2}}>отдельная сторона себя под этот контекст</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

window.CardPickerSheet = CardPickerSheet;
