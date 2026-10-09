/* PERMISOS 2D · laboratorio — Analítica de simulación; no lee datos personales reales. */
(function(){
'use strict';
const el=id=>document.getElementById(id);
const weekdays=['Lunes','Martes','Miércoles','Jueves','Viernes'];
const months=['Sep','Oct','Nov','Dic','Ene','Feb','Mar','Abr','May','Jun'];
const monthKeys=['2026-09','2026-10','2026-11','2026-12','2027-01','2027-02','2027-03','2027-04','2027-05','2027-06'];
const periodOf=k=>{const m=Number(k.slice(5,7));return m>=9&&m<=12?1:m<=3?2:3};
const isNonTeaching=k=>typeof off==='function'?off(k):false;
const plus=(k,n)=>{const d=new Date(k+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const nearNonTeaching=k=>!isNonTeaching(k)&&(isNonTeaching(plus(k,-1))||isNonTeaching(plus(k,1)));
const num=(x)=>String(x);
function getRows(){const period=el('analyticsPeriod').value;const base=typeof ledgerEffectiveRows==='function'?ledgerEffectiveRows():entries;return base.filter(r=>period==='all'||periodOf(r.d)===Number(period))}
function drawBars(id,labels,values){const max=Math.max(1,...values);el(id).innerHTML=labels.map((label,i)=>`<div class="a-bar-row"><span>${label}</span><div class="a-track"><div class="a-fill" style="width:${Math.max(0,values[i]/max*100)}%"></div></div><strong>${values[i]}</strong></div>`).join('')}
function compute(){
 const rows=getRows(),byDate={};
 rows.forEach(r=>(byDate[r.d]??=[]).push(r));
 const groups=Object.entries(byDate).sort((a,b)=>b[1].length-a[1].length||a[0].localeCompare(b[0]));
 const granted=rows.filter(r=>r.s==='CONCEDIDO').length,denied=rows.filter(r=>r.s==='DENEGADO').length,pending=rows.filter(r=>r.s==='SOLICITADO').length;
 const conflicts=groups.filter(([,a])=>a.filter(r=>r.s==='SOLICITADO'||r.s==='CONCEDIDO').length>CAP),adjacent=rows.filter(r=>nearNonTeaching(r.d)).length;
 const kpis=[['Solicitudes',rows.length,'Registros del periodo'],['Concedidas',granted,'Concesiones registradas'],['Pendientes',pending,'Sin resolución'],['Concurrencias',conflicts.length,'Fechas con más de '+CAP],['Denegadas',denied,'Motivos en historial cuando consten'],['Próximas a no lectivos',adjacent,'Día anterior o posterior']];
 el('analyticsKpis').innerHTML=kpis.map(([label,n,desc])=>`<div class="a-kpi"><span>${label}</span><strong>${n}</strong><small>${desc}</small></div>`).join('');
 drawBars('analyticsMonths',months,monthKeys.map(m=>rows.filter(r=>r.d.startsWith(m)).length));
 drawBars('analyticsWeekdays',weekdays,weekdays.map((_,i)=>rows.filter(r=>(new Date(r.d+'T12:00:00Z').getUTCDay()+6)%7===i).length));
 el('analyticsTop').innerHTML=groups.length?groups.slice(0,5).map(([d,a],i)=>`<button type="button" class="a-top-item" data-date="${d}"><span>${i+1}.</span><strong>${short(d)}</strong><span>${a.length} solicitudes</span><b>${a.length>CAP?'Revisar':'Consultar'} ↗</b></button>`).join(''):'<p>Sin solicitudes en el periodo.</p>';
 el('analyticsTop').querySelectorAll('button').forEach(b=>b.onclick=()=>{caseDate=b.dataset.date;renderCase();el('case').scrollIntoView({behavior:'smooth'})});
 el('analyticsAdjacent').innerHTML=`<div class="a-adj-number">${adjacent}<small> de ${rows.length} solicitudes</small></div><p>Fechas lectivas inmediatamente anteriores o posteriores a un día no lectivo según el calendario parcial del laboratorio.</p><div class="a-ratio"><i style="width:${rows.length?adjacent/rows.length*100:0}%"></i></div><small>${rows.length?(adjacent/rows.length*100).toFixed(1).replace('.',','):'0'} % del total seleccionado</small>`;
 el('analyticsDecisions').innerHTML=`<div class="a-state-row"><span>Concedidas</span><strong>${granted}</strong></div><div class="a-state-row"><span>Pendientes</span><strong>${pending}</strong></div><div class="a-state-row"><span>Denegadas</span><strong>${denied}</strong></div><p class="a-missing">Motivos de denegación: consultar registro de resoluciones. Disfrute efectivo: sin datos.</p>`;
 el('analyticsNorms').innerHTML=`<div class="a-state-row"><span>Fechas con exceso de cupo</span><strong>${conflicts.length}</strong></div><div class="a-state-row"><span>Desempates acreditados</span><strong>Sin datos</strong></div><div class="a-state-row"><span>Norma o criterio aplicado</span><strong>Sin datos</strong></div><p class="a-missing">La detección de concurrencia no acredita aplicación normativa. Es necesario registrar criterio, fecha y resultado de cada resolución.</p>`;
 return {rows,groups,granted,denied,pending,conflicts,adjacent};
}
function printable(){
 const s=compute(),period=el('analyticsPeriod').selectedOptions[0].textContent;
 const tr=(a,b)=>`<tr><td>${a}</td><td>${b}</td></tr>`;
 const visibleMonths=monthKeys.filter(m=>el('analyticsPeriod').value==='all'||periodOf(m+'-01')===Number(el('analyticsPeriod').value));const mon=visibleMonths.map(m=>tr(months[monthKeys.indexOf(m)],s.rows.filter(r=>r.d.startsWith(m)).length)).join('');
 const top=s.groups.slice(0,8).map(([d,a])=>tr(short(d),a.length)).join('');
 const rate=s.rows.length?(s.adjacent/s.rows.length*100).toFixed(1).replace('.',','):'0';
 const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Memoria de permisos · PERMISOS 2D · DEMOSTRACIÓN</title><style>
 @page{size:A4;margin:17mm}body{font-family:Arial,sans-serif;color:#173b47;font-size:11pt;line-height:1.5}
 h1{font-size:24pt;margin:6px 0;color:#145b69}h2{font-size:15pt;color:#145b69;margin:23px 0 8px}
 .eyebrow{letter-spacing:2px;color:#ac5877;font-size:9pt}.warn{background:#fff0e5;padding:12px;border-left:4px solid #dc917e}
 table{border-collapse:collapse;width:100%;font-size:10pt}td{padding:7px 9px;border-bottom:1px solid #dce8e6}td:last-child{text-align:right;font-weight:bold}
 .cols{display:grid;grid-template-columns:1fr 1fr;gap:22px}.small{color:#57717c;font-size:9pt}
 </style></head><body><div class="eyebrow">PERMISOS 2D · IES VIRGEN DE LA CARIDAD · LOJA</div><h1>Memoria estadística de permisos</h1><p>Curso 2026/2027 · ${period}</p><div class="warn"><strong>DOCUMENTO DE DEMOSTRACIÓN — DATOS FICTICIOS.</strong> No constituye memoria oficial ni refleja las solicitudes reales del centro.</div>
 <h2>1. Resumen ejecutivo</h2><p>En el periodo analizado figuran ${s.rows.length} solicitudes simuladas, de las que ${s.granted} constan como concedidas, ${s.pending} permanecen pendientes y ${s.denied} figuran como denegadas. Se identifican ${s.conflicts.length} fechas con más de ${CAP} solicitudes. Estas cifras describen el laboratorio y no deben extrapolarse al centro.</p>
 <h2>2. Distribución temporal</h2><div class="cols"><table>${mon}</table><table>${top||tr('Sin fechas','0')}</table></div>
 <h2>3. Proximidad a días no lectivos</h2><p>${s.adjacent} solicitudes (${rate} %) recaen en días lectivos inmediatamente adyacentes a un día no lectivo según el calendario parcial configurado. Esta coincidencia no demuestra motivación personal ni causalidad.</p>
 <h2>4. Concurrencias y aplicación normativa</h2><p>${s.conflicts.length} fechas superan el cupo simulado de ${CAP} solicitudes. No constan registros específicos que acrediten la aplicación de un criterio normativo o un desempate. Es necesario documentar las resoluciones antes de elaborar conclusiones institucionales.</p>
 <h2>5. Denegaciones y disfrute</h2><p>Denegaciones registradas: ${s.denied}. Motivos documentados: sin datos. Días efectivamente disfrutados: sin datos. Los estados de concesión no acreditan por sí mismos el disfrute efectivo.</p>
 <h2>6. Limitaciones y propuestas</h2><p>Para una memoria oficial deben validarse el calendario escolar completo, las fechas de registro y resolución, el motivo de cada denegación, el criterio aplicado, la trazabilidad de cambios y el disfrute efectivo. Se recomienda comparar tasas por día lectivo disponible para evitar sesgos entre meses.</p>
 <p class="small">Informe generado en el navegador a partir de datos ficticios de PERMISOS 2D · laboratorio visual. No incluye datos personales en las tablas agregadas.</p></body></html>`;
 const w=window.open('','_blank');
 if(!w){alert('Safari ha bloqueado la ventana del informe. Permite ventanas emergentes para generar el PDF.');return}
 w.document.open();w.document.write(html);w.document.close();w.focus();
 setTimeout(()=>w.print(),450);
}
el('analyticsPeriod').addEventListener('change',compute);
el('analyticsPrint').addEventListener('click',printable);
window.refreshAnalytics=compute;
const priorRender=render;
render=function(){priorRender();compute()};
compute();
})();
