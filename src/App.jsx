import React, { useState, useMemo } from "react";
import { useFetriData } from "./useFetriData";

// ── TABLAS DE PUNTOS FETRI 2026 ────────────────────────────────────────────────
const T90 = [90,84,78,72,66,60,54,48,42,36,30,24,18,12,6];
const T60 = [60,56,52,48,44,40,36,32,28,24,20,16,12,8,4];
const T45 = [45,42,39,36,33,30,27,24,21,18,15,12,9,6,3];
const TABLAS = {T90,T60,T45};
const getPts = (tipo, pos) => pos > 0 ? (TABLAS[tipo][pos-1] ?? 0) : 0;

// ── JORNADAS (Circular 1/2026) ─────────────────────────────────────────────────
const JORNADAS_DEF = [
  {id:"j1", nom:"Copa del Rey / Reina",  tipo:"T60", fecha:"9 may",  lugar:"Águilas"},
  {id:"j2", nom:"Triatlón por Relevos",  tipo:"T45", fecha:"10 may", lugar:"Águilas"},
  {id:"j3", nom:"Triatlón por Clubes",   tipo:"T90", fecha:"30 may", lugar:"Roquetas"},
  {id:"j4", nom:"Relevos / Parejas",     tipo:"T60", fecha:"31 may", lugar:"Roquetas"},
  {id:"j5", nom:"SuperSprint por Clubes",tipo:"T60", fecha:"12 sep", lugar:"Elche"},
  {id:"j6", nom:"Relevos Mixtos",        tipo:"T45", fecha:"12 sep", lugar:"Elche"},
  {id:"j7", nom:"Relevos 2x2",           tipo:"T60", fecha:"13 sep", lugar:"Elche"},
];

// ── EQUIPOS 2026 (pág 151 Circular 1/2026) ────────────────────────────────────
const DIV1M = [
  {id:1,  d:1,  n:"Cidade de Lugo Fluvial",              a:"LUGO",       c:"#E63946"},
  {id:2,  d:2,  n:"Peñota Dental Alusigma",              a:"ALUSIGMA",   c:"#1D3557"},
  {id:3,  d:3,  n:"Club Triatlón Diablillos de Rivas",   a:"RIVAS",      c:"#457B9D"},
  {id:4,  d:4,  n:"C.E.A. Bétera",                       a:"BÉTERA",     c:"#2A9D8F"},
  {id:5,  d:5,  n:"Club Triatlón Albacete RES",          a:"ALBACETE",   c:"#E9C46A"},
  {id:6,  d:6,  n:"Deporama Triatlón Soriano",           a:"SORIANO",    c:"#F4A261"},
  {id:7,  d:7,  n:"Triatlón Inforhouse Santiago",        a:"SANTIAGO",   c:"#6A0572"},
  {id:8,  d:8,  n:"Saltoki Trikideak",                   a:"SALTOKI",    c:"#52B788"},
  {id:9,  d:9,  n:"Stadium Casablanca Mapei",            a:"CASABLANCA", c:"#C77DFF"},
  {id:10, d:10, n:"C.E. Katoa Barcelona",                a:"KATOA",      c:"#4CC9F0"},
  {id:11, d:11, n:"A.D. Náutico de Narón",               a:"NARÓN",      c:"#F72585"},
  {id:12, d:12, n:"Club Deportivo Delikia",              a:"DELIKIA",    c:"#7209B7"},
  {id:13, d:13, n:"Isbilya – Sloppy Joe's",              a:"ISBILYA",    c:"#3A0CA3"},
  {id:14, d:14, n:"Club Natació Barcelona Fasttriatlon", a:"CNB FAST",   c:"#4361EE"},
  {id:15, d:15, n:"Montilla-Córdoba Triatlón",           a:"MONTILLA",   c:"#4895EF"},
];
const DIV2M = [
  {id:21, d:21, n:"Flor de Triatló Platja Llarga",       a:"PLATJA",     c:"#E63946"},
  {id:22, d:22, n:"Club Triatlón Tritones Rioja",        a:"TRITONES",   c:"#1D3557"},
  {id:23, d:23, n:"Tripuçol",                            a:"TRIPUÇOL",   c:"#2A9D8F"},
  {id:24, d:24, n:"Triatlón Ferrol",                     a:"FERROL",     c:"#E9C46A"},
  {id:25, d:25, n:"Club Triatlón 401 Wodcycling",        a:"401 TRI",    c:"#457B9D"},
  {id:26, d:26, n:"Prat Triatló 1994",                   a:"PRAT",       c:"#F4A261"},
  {id:27, d:27, n:"Tri Infinity Móstoles",               a:"MÓSTOLES",   c:"#6A0572"},
  {id:28, d:28, n:"A.D. Fogar",                          a:"FOGAR",      c:"#52B788"},
  {id:29, d:29, n:"AD Triatlón Ecosport Alcobendas",     a:"ECOSPORT",   c:"#C77DFF"},
  {id:30, d:30, n:"La 208 Triatlón Club de Elche",       a:"LA 208",     c:"#4CC9F0"},
  {id:31, d:31, n:"Club Triatlón Murcia Ailimpo",        a:"MURCIA",     c:"#F72585"},
  {id:32, d:32, n:"C.D.T Resistentia T3",                a:"RESIST.",    c:"#7209B7"},
  {id:33, d:33, n:"Triatlón Vicálvaro",                  a:"VICÁLVARO",  c:"#3A0CA3"},
  {id:34, d:34, n:"C.E.T. Distance Z5",                  a:"Z5",         c:"#4361EE"},
  {id:35, d:35, n:"Marlins Triatlón Madrid",             a:"MARLINS",    c:"#4895EF"},
];
const DIV1F = [
  {id:51, d:51, n:"Cidade de Lugo Fluvial",              a:"LUGO",       c:"#E63946"},
  {id:52, d:52, n:"C.E.A. Bétera",                       a:"BÉTERA",     c:"#2A9D8F"},
  {id:53, d:53, n:"Club Triatlón Diablillos de Rivas",   a:"RIVAS",      c:"#457B9D"},
  {id:54, d:54, n:"A.D. Náutico de Narón",               a:"NARÓN",      c:"#F72585"},
  {id:55, d:55, n:"Deporama Triatlón Soriano",           a:"SORIANO",    c:"#E9C46A"},
  {id:56, d:56, n:"C.E. Katoa Barcelona",                a:"KATOA",      c:"#4CC9F0"},
  {id:57, d:57, n:"Club Triatlón Albacete RES",          a:"ALBACETE",   c:"#1D3557"},
  {id:58, d:58, n:"Stadium Casablanca Mapei",            a:"CASABLANCA", c:"#C77DFF"},
  {id:59, d:59, n:"Isbilya – Sloppy Joe's",              a:"ISBILYA",    c:"#3A0CA3"},
  {id:60, d:60, n:"Prat Triatló 1994",                   a:"PRAT",       c:"#4361EE"},
  {id:61, d:61, n:"Saltoki Trikideak",                   a:"SALTOKI",    c:"#52B788"},
  {id:62, d:62, n:"Club Deportivo Delikia",              a:"DELIKIA",    c:"#7209B7"},
  {id:63, d:63, n:"Montilla-Córdoba Triatlón",           a:"MONTILLA",   c:"#4895EF"},
  {id:64, d:64, n:"AD Triatlón Ecosport Alcobendas",     a:"ECOSPORT",   c:"#6A0572"},
  {id:65, d:65, n:"Triatlón Inforhouse Santiago",        a:"SANTIAGO",   c:"#F4A261"},
];
const DIV2F = [
  {id:71, d:71, n:"Club Triatlón Las Rozas",             a:"LAS ROZAS",  c:"#E63946"},
  {id:72, d:72, n:"Tri Infinity Móstoles",               a:"MÓSTOLES",   c:"#1D3557"},
  {id:73, d:73, n:"C.D. Triatlón Laguna de Duero",       a:"LAGUNA",     c:"#2A9D8F"},
  {id:74, d:74, n:"Triatlón Squali Carabanchel",         a:"SQUALI",     c:"#E9C46A"},
  {id:75, d:75, n:"Club Triatlón Tritones Rioja",        a:"TRITONES",   c:"#457B9D"},
  {id:76, d:76, n:"Tripuçol",                            a:"TRIPUÇOL",   c:"#F4A261"},
  {id:77, d:77, n:"Club Natació Barcelona Fasttriatlon", a:"CNB FAST",   c:"#4CC9F0"},
  {id:78, d:78, n:"Club Triatlón 401 Wodcycling",        a:"401 TRI",    c:"#52B788"},
  {id:79, d:79, n:"C.N. Mataró",                         a:"MATARÓ",     c:"#C77DFF"},
  {id:80, d:80, n:"La 208 Triatlón Club de Elche",       a:"LA 208",     c:"#4361EE"},
  {id:81, d:81, n:"Marlins Triatlón Madrid",             a:"MARLINS",    c:"#F72585"},
  {id:82, d:82, n:"C.D.T Resistentia T3",                a:"RESIST.",    c:"#7209B7"},
  {id:83, d:83, n:"Tenerife – Réactivité",               a:"TENERIFE",   c:"#3A0CA3"},
  {id:84, d:84, n:"Club Natación Las Palmas",            a:"LAS PALMAS", c:"#6A0572"},
  {id:85, d:85, n:"C.E.T. Distance Z5",                  a:"Z5",         c:"#4895EF"},
];

// ── DATOS REALES J1+J2 ─────────────────────────────────────────────────────────
const DATOS_REALES = {
  "2M": {
    21:[27,12], 22:[40,30], 23:[48,24], 24:[6,0],  25:[56,33],
    26:[36,0],  27:[24,21], 28:[39,36], 29:[20,9],  30:[60,45],
    31:[16,15], 32:[44,18], 33:[52,42], 34:[32,12], 35:[28,3],
  },
  "1F": {
    51:[40,27], 52:[48,42], 53:[36,30], 54:[56,45], 55:[44,39],
    56:[52,33], 57:[24,0],  58:[28,18], 59:[21,0],  60:[16,6],
    61:[12,3],  62:[60,36], 63:[20,9],  64:[32,12], 65:[24,15],
  },
};

// ── INIT ───────────────────────────────────────────────────────────────────────
function initJornadas(equipos, divKey) {
  const datos = DATOS_REALES[divKey];
  return JORNADAS_DEF.map((jDef, idx) => {
    const res = {};
    equipos.forEach(e => { res[e.id] = 0; });
    return {...jDef, res, disputada: datos ? idx < 2 : false};
  });
}

// ── CLASIFICACIÓN ──────────────────────────────────────────────────────────────
function calcClasificacion(equipos, jornadas, divKey, liveData) {
  const datos = liveData?.[divKey] ?? DATOS_REALES[divKey];
  return equipos.map(eq => {
    const ptsJ = JORNADAS_DEF.map((_, idx) => {
            // Solo usar datos reales si algún equipo tiene >0 pts en esa jornada
      const jornadaJugada = datos && Object.values(datos).some(arr => (arr[idx] ?? 0) > 0);
      if (jornadaJugada && datos?.[eq.id]?.[idx] !== undefined) return datos[eq.id][idx] ?? 0;
      const pos = jornadas[idx].res[eq.id] ?? 0;
      return getPts(jornadas[idx].tipo, pos);
    });
    const total  = ptsJ.reduce((s, p) => s + p, 0);
    const conPts = ptsJ.filter(p => p > 0);
    const menor  = conPts.length > 0 ? Math.min(...conPts) : 0;
    const netos  = total - menor;
    return {...eq, ptsJ, total, netos, menor, jugadas: conPts.length};
  })
  .sort((a, b) => b.total - a.total)
  .map((e, i) => ({...e, pos: i + 1}));
}

const DIVISIONES = [
  {key:"1M", label:"1ª Masc", equipos:DIV1M},
  {key:"2M", label:"2ª Masc", equipos:DIV2M},
  {key:"1F", label:"1ª Fem",  equipos:DIV1F},
  {key:"2F", label:"2ª Fem",  equipos:DIV2F},
];

const TC = {T90:"#E63946", T60:"#2A9D8F", T45:"#E9C46A"};

export default function App() {
  const [divKey, setDivKey] = useState("1F");
  const [tab, setTab]       = useState("clasificacion");
  const [jornadasState, setJornadasState] = useState(() => {
    const s = {};
    DIVISIONES.forEach(d => { s[d.key] = initJornadas(d.equipos, d.key); });
    return s;
  });
  const [editando, setEditando] = useState(null);
  const { data: liveData, loading: liveLoading, ts: liveTs } = useFetriData();

  const divActual = DIVISIONES.find(d => d.key === divKey);
  const equipos   = divActual.equipos;
  const jornadas  = jornadasState[divKey];
  const hayReales = !!(liveData?.[divKey] ?? DATOS_REALES[divKey]);

  const clas = useMemo(
    () => calcClasificacion(equipos, jornadas, divKey, liveData),
    [equipos, jornadas, divKey, liveData]
  );

  const colsJ = JORNADAS_DEF.map((_, i) => i).filter(i => {
    const datos = liveData?.[divKey] ?? DATOS_REALES[divKey];
    if (datos && Object.values(datos).some(arr => (arr[i] ?? 0) > 0)) return true;
    return jornadas[i] && (Object.values(jornadas[i].res).some(v => v > 0) || jornadas[i].disputada);
  });

  const updatePos = (jIdx, eId, val) => {
    setJornadasState(prev => ({
      ...prev,
      [divKey]: prev[divKey].map((j, i) =>
        i === jIdx ? {...j, res:{...j.res, [eId]: Number(val)}} : j
      ),
    }));
  };

  const toggleDisputada = (jIdx) => {
    setJornadasState(prev => ({
      ...prev,
      [divKey]: prev[divKey].map((j, i) =>
        i === jIdx ? {...j, disputada: !j.disputada} : j
      ),
    }));
  };

  const S = {
    app:  {fontFamily:"'DM Mono','Courier New',monospace", background:"#070707", minHeight:"100vh", color:"#e0e0e0"},
    hdr:  {background:"#0d0d0d", borderBottom:"1px solid #1c1c1c", padding:"22px 24px 0"},
    body: {padding:"20px 24px", maxWidth:1100, margin:"0 auto"},
    lbl:  {fontSize:9, letterSpacing:4, color:"#444", marginBottom:12, display:"block"},
    card: {background:"#0d0d0d", border:"1px solid #1c1c1c", borderRadius:6, overflow:"hidden"},
    inp:  {width:40, background:"#111", border:"1px solid #222", color:"#fff", textAlign:"center", padding:"3px", fontSize:12, fontFamily:"inherit", borderRadius:3, fontWeight:700},
    tabB: (a) => ({background:"none", border:"none", cursor:"pointer", padding:"10px 14px", fontSize:10, letterSpacing:3, fontWeight:700, fontFamily:"inherit", color:a?"#E63946":"#444", borderBottom:a?"2px solid #E63946":"2px solid transparent"}),
  };

  const zonaBg = (pos) => {
    if (divKey.startsWith("1") && pos >= 12) return "#0f0606";
    if (divKey.startsWith("2") && pos <= 4)  return "#060f06";
    if (divKey.startsWith("2") && pos >= 12) return "#0f0606";
    return null;
  };

  return (
    <div style={S.app}>

      {/* ── HEADER ── */}
      <div style={S.hdr}>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:9, letterSpacing:5, color:"#E63946", marginBottom:2}}>LIGA NACIONAL DE TRIATLÓN</div>
          <h1 style={{fontSize:24, fontWeight:700, margin:0, color:"#fff", letterSpacing:-1}}>FETRI 2026</h1>
          <div style={{fontSize:9, color:"#2a2a2a", marginTop:3, letterSpacing:2}}>Águilas · Roquetas · Elche — 7 jornadas · Top 6 puntúan · descuento mínimo</div>
        </div>

        <div style={{display:"flex", gap:6, marginBottom:12, flexWrap:"wrap"}}>
          {DIVISIONES.map(d => (
            <button key={d.key} onClick={() => {setDivKey(d.key); setEditando(null);}}
              style={{background:divKey===d.key?"#E63946":"#111", border:`1px solid ${divKey===d.key?"#E63946":"#1c1c1c"}`, color:divKey===d.key?"#fff":"#444", fontSize:10, letterSpacing:2, padding:"4px 12px", cursor:"pointer", borderRadius:3, fontFamily:"inherit", fontWeight:700, display:"flex", alignItems:"center", gap:5}}>
              {d.label}
              {!!(liveData?.[d.key] ?? DATOS_REALES[d.key]) && <span style={{fontSize:8, background:"#2A9D8F", color:"#000", padding:"1px 4px", borderRadius:2}}>LIVE</span>}
            </button>
          ))}
        </div>

        <div style={{display:"flex"}}>
          {[["clasificacion","Clasificación"],["jornadas","Jornadas"],["calendario","Calendario"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={S.tabB(tab===k)}>{l}</button>
          ))}
        </div>
      </div>

      <div style={S.body}>

        {/* ── CLASIFICACIÓN ── */}
        {tab === "clasificacion" && (
          <>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14}}>
              <span style={S.lbl}>{divActual.label.toUpperCase()} — ordenado por Total</span>
              {hayReales && <div style={{background:"#0a1f1a", border:"1px solid #1a4a3a", borderRadius:3, padding:"3px 8px", fontSize:9, color:"#2A9D8F", letterSpacing:2}}>{liveLoading ? "CARGANDO..." : `LIVE · ${liveTs ?? ""}`.trim()}</div>}
            </div>

            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%", borderCollapse:"collapse", minWidth:550}}>
                <thead>
                  <tr style={{borderBottom:"1px solid #1a1a1a"}}>
                    <th style={{textAlign:"center", fontSize:9, color:"#333", padding:"7px 8px", fontWeight:700, width:38}}>#</th>
                    <th style={{textAlign:"left", fontSize:9, color:"#333", padding:"7px 8px", fontWeight:700}}>Club</th>
                    {colsJ.map(i => (
                      <th key={i} style={{textAlign:"center", fontSize:8, color:TC[JORNADAS_DEF[i].tipo], padding:"7px 6px", fontWeight:700, width:42}}>
                        J{i+1}
                        <div style={{fontSize:7, color:"#333", fontWeight:400}}>{JORNADAS_DEF[i].tipo}</div>
                      </th>
                    ))}
                    <th style={{textAlign:"center", fontSize:9, color:"#888", padding:"7px 8px", fontWeight:700, width:54}}>Total</th>
                    <th style={{textAlign:"center", fontSize:9, color:"#555", padding:"7px 8px", fontWeight:700, width:54}}>
                      –Menor
                      <div style={{fontSize:7, color:"#333", fontWeight:400}}>al final</div>
                    </th>
                    <th style={{textAlign:"center", fontSize:9, color:"#fff", padding:"7px 8px", fontWeight:700, width:54}}>Netos</th>
                  </tr>
                </thead>
                <tbody>
                  {clas.map((eq, i) => {
                    const menorIdx = eq.ptsJ.reduce((minI, p, idx) =>
                      (p > 0 && (minI === -1 || p < eq.ptsJ[minI])) ? idx : minI, -1);
                    const bg = zonaBg(eq.pos);
                    return (
                      <tr key={eq.id} style={{borderBottom:"1px solid #0e0e0e", background: bg || (i%2===0 ? "#0b0b0b" : "transparent")}}>
                        <td style={{textAlign:"center", padding:"10px 8px"}}>
                          <span style={{display:"inline-flex", alignItems:"center", justifyContent:"center", width:24, height:24, borderRadius:"50%", background:eq.pos<=3?eq.c:"#161616", color:eq.pos<=3?"#fff":"#555", fontSize:10, fontWeight:700}}>{eq.pos}</span>
                        </td>
                        <td style={{padding:"10px 8px"}}>
                          <div style={{display:"flex", alignItems:"center", gap:7}}>
                            <div style={{width:3, height:22, borderRadius:2, background:eq.c, flexShrink:0}}/>
                            <div>
                              <div style={{fontSize:11, fontWeight:600, color:"#d5d5d5", whiteSpace:"nowrap"}}>{eq.n}</div>
                              <div style={{fontSize:8, color:"#333", letterSpacing:2}}>#{eq.d}</div>
                            </div>
                          </div>
                        </td>
                        {colsJ.map(jIdx => {
                          const p = eq.ptsJ[jIdx];
                          const esMenor = jIdx === menorIdx && eq.jugadas >= 2;
                          return (
                            <td key={jIdx} style={{textAlign:"center", padding:"10px 6px"}}>
                              {p > 0 ? (
                                <span style={{fontSize:12, fontWeight:700, color:esMenor?"#555":"#ccc", background:esMenor?"#1a1a1a":"transparent", borderRadius:3, padding:"1px 4px", border:esMenor?"1px solid #2a2a2a":"none"}}>
                                  {p}
                                </span>
                              ) : (
                                <span style={{fontSize:10, color:"#222"}}>—</span>
                              )}
                            </td>
                          );
                        })}
                        <td style={{textAlign:"center", padding:"10px 8px"}}>
                          <span style={{fontSize:15, fontWeight:700, color:"#aaa"}}>{eq.total}</span>
                        </td>
                        <td style={{textAlign:"center", padding:"10px 8px"}}>
                          {eq.menor > 0
                            ? <span style={{fontSize:12, color:"#E63946", fontWeight:700}}>–{eq.menor}</span>
                            : <span style={{color:"#2a2a2a"}}>—</span>}
                        </td>
                        <td style={{textAlign:"center", padding:"10px 8px"}}>
                          <span style={{fontSize:17, fontWeight:700, color:"#fff"}}>{eq.netos}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{marginTop:10, display:"flex", gap:16, flexWrap:"wrap", fontSize:9, color:"#444", letterSpacing:1}}>
              <span>Valor <span style={{color:"#666", fontWeight:700, border:"1px solid #2a2a2a", padding:"0 3px", borderRadius:2}}>enmarcado</span> = se descartará al completar las 7 jornadas</span>
              {divKey.startsWith("1") && <span style={{color:"#E63946"}}>● Puestos 12–15 descienden</span>}
              {divKey.startsWith("2") && <><span style={{color:"#2A9D8F"}}>● Puestos 1–4 ascienden</span><span style={{color:"#E63946"}}>● Puestos 12–15 pierden categoría</span></>}
            </div>
          </>
        )}

        {/* ── JORNADAS ── */}
        {tab === "jornadas" && (
          <>
            {hayReales && (
              <div style={{background:"#0a1f1a", border:"1px solid #1a4a3a", borderRadius:4, padding:"9px 12px", marginBottom:16, fontSize:10, color:"#2A9D8F", letterSpacing:1}}>
                ✓ J1 y J2 con datos reales. Las jornadas 3–7 son editables.
              </div>
            )}
            <span style={S.lbl}>JORNADAS — {divActual.label}</span>
            {jornadas.map((jornada, idx) => {
              const esReal = hayReales && idx < 2;
              const isOpen = editando === idx;
              return (
                <div key={jornada.id} style={{...S.card, marginBottom:9, borderColor:esReal?"#1a4a3a":jornada.disputada?"#1c3a1c":"#1c1c1c"}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", cursor:esReal?undefined:"pointer"}}
                    onClick={() => !esReal && setEditando(isOpen ? null : idx)}>
                    <div>
                      <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:2}}>
                        <span style={{fontSize:9, color:"#444", fontWeight:700}}>J{idx+1}</span>
                        <span style={{fontWeight:700, fontSize:12, color:esReal?"#2A9D8F":jornada.disputada?"#d0d0d0":"#555"}}>{jornada.nom}</span>
                        <span style={{fontSize:8, fontWeight:700, letterSpacing:1, color:TC[jornada.tipo], background:"#111", padding:"1px 5px", borderRadius:2}}>{jornada.tipo}</span>
                        {esReal && <span style={{fontSize:8, color:"#2A9D8F", letterSpacing:2}}>DATOS REALES</span>}
                        {!esReal && jornada.disputada && <span style={{fontSize:8, color:"#2A9D8F"}}>✓</span>}
                      </div>
                      <div style={{fontSize:8, color:"#333", letterSpacing:1}}>{jornada.fecha} · {jornada.lugar}</div>
                    </div>
                    <div style={{display:"flex", alignItems:"center", gap:8}}>
                      {!esReal && (
                        <button onClick={e => {e.stopPropagation(); toggleDisputada(idx);}}
                          style={{background:jornada.disputada?"#1a2e1a":"#111", border:`1px solid ${jornada.disputada?"#2a5a2a":"#1c1c1c"}`, color:jornada.disputada?"#2A9D8F":"#444", fontSize:8, letterSpacing:1, padding:"3px 7px", cursor:"pointer", borderRadius:3, fontFamily:"inherit"}}>
                          {jornada.disputada ? "✓ ACTIVA" : "ACTIVAR"}
                        </button>
                      )}
                      {!esReal && <span style={{color:"#2a2a2a", fontSize:13}}>{isOpen ? "▲" : "▼"}</span>}
                    </div>
                  </div>

                  {isOpen && !esReal && (
                    <div style={{padding:"0 16px 16px", borderTop:"1px solid #161616"}}>
                      <div style={{display:"flex", justifyContent:"space-between", marginTop:12, marginBottom:10}}>
                        <span style={{...S.lbl, margin:0}}>POSICIÓN (0 = no puntúa)</span>
                        <span style={{fontSize:8, color:"#333"}}>1º={getPts(jornada.tipo,1)}p · 5º={getPts(jornada.tipo,5)}p · 15º={getPts(jornada.tipo,15)}p</span>
                      </div>
                      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:5}}>
                        {equipos.map(eq => {
                          const pos = jornada.res[eq.id] ?? 0;
                          const pts = getPts(jornada.tipo, pos);
                          return (
                            <div key={eq.id} style={{display:"flex", alignItems:"center", gap:7, background:"#0a0a0a", borderRadius:4, padding:"7px 9px"}}>
                              <div style={{width:3, height:18, borderRadius:2, background:eq.c, flexShrink:0}}/>
                              <span style={{fontSize:10, flex:1, color:"#777"}}>{eq.a}</span>
                              <input type="number" min={0} max={15} value={pos||""} placeholder="—"
                                onChange={e => updatePos(idx, eq.id, e.target.value||0)} style={S.inp}/>
                              <span style={{fontSize:10, width:28, textAlign:"right", color:pts>0?"#E63946":"#222", fontWeight:pts>0?700:400}}>{pts>0?`+${pts}`:"—"}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {esReal && (
                    <div style={{padding:"0 16px 14px", borderTop:"1px solid #161616"}}>
                      <div style={{fontSize:8, color:"#333", letterSpacing:2, margin:"10px 0 8px"}}>PUNTOS J{idx+1} POR EQUIPO</div>
                      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:3}}>
                        {equipos
                          .map(eq => ({eq, pts: (liveData?.[divKey] ?? DATOS_REALES[divKey])?.[eq.id]?.[idx] ?? 0}))
                          .sort((a, b) => b.pts - a.pts)
                          .map(({eq, pts}) => (
                            <div key={eq.id} style={{display:"flex", alignItems:"center", gap:7, padding:"4px 7px", background:"#0a0a0a", borderRadius:3}}>
                              <div style={{width:3, height:14, borderRadius:2, background:eq.c, flexShrink:0}}/>
                              <span style={{fontSize:9, flex:1, color:"#666"}}>{eq.a}</span>
                              <span style={{fontSize:11, fontWeight:700, color:pts>0?"#ccc":"#333"}}>{pts>0?pts:"—"}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── CALENDARIO ── */}
        {tab === "calendario" && (
          <>
            <span style={S.lbl}>CALENDARIO LIGA 2026</span>
            {[
              {lugar:"Águilas",        fecha:"9–10 mayo 2026",  color:"#E63946", idxs:[0,1], hecho:true},
              {lugar:"Roquetas de Mar", fecha:"30–31 mayo 2026", color:"#2A9D8F", idxs:[2,3], hecho:false},
              {lugar:"Arenales, Elche", fecha:"12–13 sep 2026",  color:"#E9C46A", idxs:[4,5,6], hecho:false},
            ].map(sede => (
              <div key={sede.lugar} style={{...S.card, marginBottom:10, borderColor:sede.hecho?"#1a4a3a":"#1c1c1c"}}>
                <div style={{display:"flex"}}>
                  <div style={{width:4, background:sede.color, flexShrink:0}}/>
                  <div style={{padding:"14px 18px", flex:1}}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10}}>
                      <div>
                        <div style={{fontWeight:700, fontSize:13, color:"#d8d8d8"}}>{sede.lugar}</div>
                        <div style={{fontSize:9, color:"#444", marginTop:2}}>{sede.fecha}</div>
                      </div>
                      {sede.hecho && <span style={{fontSize:8, color:"#2A9D8F", letterSpacing:2, fontWeight:700}}>✓ DISPUTADO</span>}
                    </div>
                    {sede.idxs.map(i => {
                      const j = JORNADAS_DEF[i];
                      return (
                        <div key={i} style={{display:"flex", alignItems:"center", gap:10, marginBottom:6}}>
                          <span style={{fontSize:9, color:"#444", fontWeight:700, width:18}}>J{i+1}</span>
                          <span style={{fontSize:11, color:"#aaa", flex:1}}>{j.nom}</span>
                          <span style={{fontSize:8, color:TC[j.tipo], fontWeight:700}}>{j.tipo} · max {getPts(j.tipo,1)}p</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            <div style={{...S.card, padding:"14px 18px", marginTop:4}}>
              <span style={{...S.lbl, margin:"0 0 12px"}}>TABLAS DE PUNTUACIÓN</span>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14}}>
                {[
                  ["T90","Tri. Clubes",[90,84,78,72,66,6]],
                  ["T60","Copa Rey / SS / Rel-Par / 2x2",[60,56,52,48,44,4]],
                  ["T45","Relevos",[45,42,39,36,33,3]],
                ].map(([t,d,v]) => (
                  <div key={t}>
                    <div style={{fontSize:8, fontWeight:700, letterSpacing:2, color:TC[t], marginBottom:6}}>{t} — {d}</div>
                    {v.map((p, i) => (
                      <div key={i} style={{display:"flex", justifyContent:"space-between", padding:"2px 0", borderBottom:"1px solid #111"}}>
                        <span style={{fontSize:9, color:"#444"}}>{i<5?`${i+1}º`:"15º"}</span>
                        <span style={{fontSize:9, fontWeight:700, color:i===0?TC[t]:"#777"}}>{p}p</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{marginTop:12, padding:"7px 10px", background:"#0a0a0a", borderRadius:3, fontSize:8, color:"#555", letterSpacing:1}}>
                Puntúan las <span style={{color:"#fff", fontWeight:700}}>6 mejores</span> de 7 jornadas (se descuenta la peor) · 4 últimos de 1ª descienden · 4 primeros de 2ª ascienden · 4 últimos de 2ª pierden categoría
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
