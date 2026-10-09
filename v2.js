(()=>{'use strict';
const $=id=>document.getElementById(id),names=['Ana Morales','Patricia Reyes','Jorge Vallejo','M. Carmen Anguita','Tania Padilla','Cristóbal Pérez'];
let rows=[['2026-10-13','Tania Padilla','CONCEDIDO'],['2026-10-13','Ana Morales','SOLICITADO'],['2026-10-20','Patricia Reyes','SOLICITADO'],['2026-10-20','Jorge Vallejo','SOLICITADO'],['2026-10-20','M. Carmen Anguita','SOLICITADO'],['2026-10-20','Tania Padilla','CONCEDIDO'],['2026-10-20','Cristóbal Pérez','CONCEDIDO'],['2026-10-21','Cristóbal Pérez','SOLICITADO'],['2026-10-21','M. Carmen Anguita','SOLICITADO'],['2026-11-27','Ana Morales','SOLICITADO']];
let page='prof',person=names[0],date=null,month=9,year=2026;
const fmt=d=>new Date(d+'T12:00:00Z').toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
const short=d=>d.split('-').reverse().join('/');
const count=d=>rows.filter(r=>r[0]===d);
const own=()=>rows.filter(r=>r[1]===person);
const nonWorking=d=>{let x=new Date(d+'T12:00:00Z');return [0,6].includes(x.getUTCDay())};
function calendar(){
 $('month').textContent=new Date(Date.UTC(year,month,1)).toLocaleDateString('es-ES',{month:'long',year:'numeric',timeZone:'UTC'});
 let offset=(new Date(Date.UTC(year,month,1)).getUTCDay()+6)%7,days=new Date(Date.UTC(year,month+1,0)).getUTCDate(),html='';
 for(let i=0;i<offset;i++)html+='<span></span>';
 for(let d=1;d<=days;d++){let k=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,r=count(k),off=nonWorking(k),dots=r.slice(0,5).map(x=>`<i class="${x[2]==='CONCEDIDO'?'g':''}"></i>`).join('');
 html+=`<button class="day ${r.length>4?'conflict':''} ${date===k?'selected':''}" data-date="${k}" ${off?'disabled':''} aria-label="${fmt(k)}; ${r.length} solicitudes">${d}<span class="dots">${dots}</span></button>`}
 $('days').innerHTML=html;$('days').querySelectorAll('button:not(:disabled)').forEach(b=>b.onclick=()=>{date=b.dataset.date;render()});
}
function render(){
 let my=own(),granted=my.filter(r=>r[2]==='CONCEDIDO').length,pending=my.filter(r=>r[2]==='SOLICITADO').length;
 $('crumb').textContent=page==='prof'?'Mi espacio':'Dirección';
 $('eyebrow').textContent=page==='prof'?'PROFESORADO · CURSO 2026/2027':'DIRECCIÓN · CENTRO DE DECISIONES';
 $('heading').innerHTML=page==='prof'?'Mis permisos<span>.</span>':'Centro de control<span>.</span>';
 $('subtitle').textContent=page==='prof'?'Planifica, solicita y consulta tus días de asuntos particulares.':'Supervisa concurrencias y consulta expedientes simulados.';
 $('person').textContent=person;$('who').value=person;
 let conflictDates=new Set(rows.map(r=>r[0]).filter(d=>count(d).length>4));
 let values=page==='prof'?[['DÍAS SIN CONCEDER',Math.max(0,2-granted),'No equivale a días libres para solicitar'],['PENDIENTES',pending,'En revisión'],['CONCEDIDOS',granted,'Registrados'],['COMPROMETIDOS',pending+granted,'Pendientes + concedidos']]:[['SOLICITUDES',rows.length,'Registros de prueba'],['PENDIENTES',rows.filter(r=>r[2]==='SOLICITADO').length,'Sin resolver'],['CONCURRENCIAS',conflictDates.size,'Fechas con más de 4'],['CONCEDIDOS',rows.filter(r=>r[2]==='CONCEDIDO').length,'Registrados']];
 $('stats').innerHTML=values.map(v=>`<div class="stat"><span>${v[0]}</span><strong>${v[1]}</strong><small>${v[2]}</small></div>`).join('');
 $('calendarTitle').textContent=page==='prof'?'Calendario de permisos':'Ocupación y concurrencias';
 $('detailTitle').textContent=page==='prof'?'Solicitar permiso':'Expediente por fecha';
 $('detailText').textContent=page==='prof'?'Elige una fecha para revisar tu solicitud.':'Selecciona un día para consultar solicitudes y concesiones.';
 $('chosen').textContent=date?fmt(date):'Ninguna';
 $('occupation').textContent=date?`${count(date).length} solicitudes · ${count(date).filter(r=>r[2]==='CONCEDIDO').length} concedidas`:'Sin selección';
 $('action').disabled=!date||(page==='prof'&&(pending+granted>=2||my.some(r=>r[0]===date)));
 $('action').textContent=page==='prof'?'Revisar solicitud →':'Ver expediente →';
 $('reqTitle').textContent=page==='prof'?'Mis solicitudes':'Solicitudes del día';
 let list=page==='prof'?my:date?count(date):[];
 $('myRequests').innerHTML=list.length?list.map(r=>`<div class="request"><span>${short(r[0])}${page==='dir'?' · '+r[1]:''}</span><b>${r[2]}</b></div>`).join(''):'<p>Sin registros.</p>';
 let q=$('filter').value.toLowerCase();
 $('records').innerHTML=rows.filter(r=>r.join(' ').toLowerCase().includes(q)).map(r=>`<tr><td>${short(r[0])}</td><td>${r[1]}</td><td><span class="pill ${r[2]}">${r[2]}</span></td><td>${r[2]==='CONCEDIDO'?'Concesión de demostración':'Pendiente de revisión'}</td></tr>`).join('');
 document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 calendar();
}
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{page=b.dataset.page;$('nav').classList.remove('open');render()});
$('who').onchange=e=>{person=e.target.value;render()};
$('prev').onclick=()=>{month--;if(month<0){month=11;year--}date=null;render()};
$('next').onclick=()=>{month++;if(month>11){month=0;year++}date=null;render()};
$('filter').oninput=render;
$('menu').onclick=()=>$('nav').classList.toggle('open');
$('action').onclick=()=>{if(!date)return;$('confirmation').textContent=page==='prof'?`${person} · ${fmt(date)}. Este registro es ficticio y no implica concesión.`:`${fmt(date)} · ${count(date).length} solicitudes. La resolución administrativa está desactivada.`;$('confirm').hidden=page==='dir';$('modal').hidden=false};
$('cancel').onclick=()=>$('modal').hidden=true;
$('confirm').onclick=()=>{if(!date||page!=='prof')return;rows.push([date,person,'SOLICITADO']);$('modal').hidden=true;render()};
$('modal').onclick=e=>{if(e.target===$('modal'))$('modal').hidden=true};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('modal').hidden=true;$('nav').classList.remove('open')}});
render();
})();