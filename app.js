
'use strict';
const $=id=>document.getElementById(id), CAP=4;
const names=['Ana Morales','Patricia Reyes','Jorge Vallejo','M. Carmen Anguita','Tania Padilla','Cristóbal Pérez'];
let records=[
{person:1,date:'2026-10-20',status:'SOLICITADO'},
{person:2,date:'2026-10-20',status:'SOLICITADO'},
{person:3,date:'2026-10-20',status:'SOLICITADO'},
{person:4,date:'2026-10-20',status:'CONCEDIDO'},
{person:5,date:'2026-10-20',status:'CONCEDIDO'},
{person:4,date:'2026-10-13',status:'CONCEDIDO'},
{person:5,date:'2026-10-21',status:'SOLICITADO'},
{person:3,date:'2026-10-21',status:'SOLICITADO'}
];
let month=new Date(2026,9,1),selected='',person=0,page='teacher',caseDate='2026-10-20';
const months=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const holidays=new Set(['2026-10-12','2026-11-02','2026-12-07','2026-12-08','2027-01-06','2027-02-26','2027-03-01','2027-05-03','2027-05-28']);
const key=(y,m,d)=>`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const fmt=d=>d.split('-').reverse().join('/');
const human=d=>new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'long',year:'numeric'}).format(new Date(d+'T12:00:00'));
function off(k){let d=new Date(k+'T12:00:00Z'),w=d.getUTCDay();return w===0||w===6||holidays.has(k)||(k>='2026-12-23'&&k<='2027-01-06')||(k>='2027-03-22'&&k<='2027-03-28')}
function active(k){return records.filter(r=>r.date===k&&r.status!=='DENEGADO')}
function own(){return records.filter(r=>r.person===person&&r.status!=='DENEGADO')}
function countGranted(p){return records.filter(r=>r.person===p&&r.status==='CONCEDIDO').length}
function badge(status){return `<span class="tag ${status.toLowerCase()}">${status}</span>`}
function calendar(id,admin){
 const y=month.getFullYear(),m=month.getMonth(),grid=$(id);grid.replaceChildren();
 $(admin?'amonth':'month').textContent=months[m]+' '+y;
 for(const x of ['L','M','X','J','V','S','D']){let e=document.createElement('div');e.className='weekday';e.textContent=x;grid.append(e)}
 for(let i=0;i<(new Date(y,m,1).getDay()+6)%7;i++)grid.append(document.createElement('div'));
 for(let d=1;d<=new Date(y,m+1,0).getDate();d++){
  let k=key(y,m,d),a=active(k),g=a.filter(r=>r.status==='CONCEDIDO').length;
  let b=document.createElement('button');b.type='button';b.className='day'+(off(k)?' off':'')+(g>=CAP?' full':'')+(a.length>CAP?' conflict':'')+(k===selected&&!admin?' selected':'');
  b.setAttribute('aria-label',`${human(k)}. ${a.length} solicitudes activas`);
  b.innerHTML=`<strong>${d}</strong>`+(a.length?`<div class="occupancy">${a.slice(0,5).map(r=>`<i class="${r.status.toLowerCase()}"></i>`).join('')}</div>`:'');
  b.onclick=()=>{
   if(admin){caseDate=k;renderCase();$('caseDetail').scrollIntoView({behavior:'smooth',block:'start'})}
   else {selected=k;$('chosen').textContent=human(k);$('send').disabled=off(k);$('feedback').textContent=off(k)?'Día no lectivo: no puede solicitarse.':'';render()}
  };grid.append(b)
 }
}
function renderCase(){
 const a=active(caseDate),g=a.filter(r=>r.status==='CONCEDIDO').length;
 $('caseTitle').textContent=`${human(caseDate)} · ${a.length} solicitudes`;
 $('caseTotal').textContent=a.length;$('caseGranted').textContent=g;$('caseRemaining').textContent=Math.max(0,CAP-g);
 $('caseRows').innerHTML=a.length?a.map(r=>`<div class="case-row"><strong>${names[r.person]}</strong>${badge(r.status)}<small>${countGranted(r.person)} día(s) concedido(s)</small></div>`).join(''):'<p class="hint">No hay solicitudes activas para esta fecha.</p>';
}
function render(){
 calendar('cal',false);calendar('acal',true);
 let mine=own(),g=mine.filter(r=>r.status==='CONCEDIDO').length,p=mine.filter(r=>r.status==='SOLICITADO').length;
 $('available').textContent=Math.max(0,2-g);$('balanceFill').style.width=(Math.max(0,2-g)/2*100)+'%';
 $('pending').textContent=p;$('granted').textContent=g;$('committed').textContent=mine.length;
 $('mine').innerHTML=mine.length?mine.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(r=>`<div class="item"><b>${fmt(r.date)}</b>${badge(r.status)}</div>`).join(''):'<p class="hint">No hay solicitudes activas.</p>';
 $('total').textContent=records.length;$('adminGranted').textContent=records.filter(r=>r.status==='CONCEDIDO').length;
 $('waiting').textContent=records.filter(r=>r.status==='SOLICITADO').length;
 let dates=[...new Set(records.map(r=>r.date))].sort(),conf=dates.filter(d=>active(d).length>CAP);
 $('conflicts').textContent=conf.length;
 $('alerts').innerHTML=conf.length?conf.map(d=>`<button class="alert alert-button" data-date="${d}"><strong>${human(d)} · ${active(d).length} solicitudes</strong><p>Exceso de cupo. Abrir expediente →</p></button>`).join(''):'<p class="hint">Sin fechas que superen el cupo.</p>';
 document.querySelectorAll('.alert-button').forEach(b=>b.onclick=()=>{caseDate=b.dataset.date;renderCase();$('caseDetail').scrollIntoView({behavior:'smooth'})});
 let q=$('search').value.trim().toLocaleLowerCase('es'),filter=$('statusFilter').value;
 $('all').innerHTML=records.filter(r=>(filter==='ALL'||r.status===filter)&&(names[r.person].toLocaleLowerCase('es').includes(q)||fmt(r.date).includes(q))).slice().sort((a,b)=>a.date.localeCompare(b.date)).map(r=>`<tr><td>${fmt(r.date)}</td><td>${names[r.person]}</td><td>${badge(r.status)}</td><td><span class="subdued">${r.status==='CONCEDIDO'?'Concesión existente':'Pendiente de revisión'}</span></td></tr>`).join('')||'<tr><td colspan="4">Sin resultados</td></tr>';
 if(selected){let a=active(selected),g2=a.filter(r=>r.status==='CONCEDIDO').length;
 $('dateContext').textContent=off(selected)?'Fecha no lectiva':`${a.length} solicitudes activas · ${Math.max(0,CAP-g2)} plazas sin conceder. Disponibilidad orientativa.`;
 $('send').disabled=off(selected)||own().length>=2||own().some(r=>r.date===selected);
 }
 renderCase()
}
function switchPage(p){page=p;$('teacher').hidden=p!=='teacher';$('admin').hidden=p!=='admin';document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('on',n.dataset.page===p));$('crumb').textContent=p==='teacher'?'Mi espacio':'Centro de control';$('heading').innerHTML=p==='teacher'?'Planifica tus días<span>.</span>':'Lo que requiere atención<span>.</span>';$('subheading').textContent=p==='teacher'?'Elige una fecha, revisa sus condiciones y registra tu solicitud.':'Identifica concurrencias, consulta expedientes y prepara decisiones trazables.';render()}
function closeModal(){$('confirmOverlay').hidden=true}
document.querySelectorAll('.nav').forEach(n=>n.addEventListener('click',()=>switchPage(n.dataset.page)));
$('person').innerHTML=names.map((n,i)=>`<option value="${i}">${n}</option>`).join('');
$('person').onchange=e=>{person=Number(e.target.value);selected='';$('chosen').textContent='Selecciona una fecha';$('send').disabled=true;render()};
for(const [id,delta] of [['prev',-1],['next',1],['aprev',-1],['anext',1]])$(id).onclick=()=>{month=new Date(month.getFullYear(),month.getMonth()+delta,1);render()};
$('statusFilter').onchange=render;$('search').oninput=render;
$('send').onclick=()=>{
 if(!selected||off(selected)||own().length>=2||own().some(r=>r.date===selected))return;
 $('confirmPerson').textContent=names[person];$('confirmDate').textContent=human(selected);
 $('confirmAvailability').textContent=`${active(selected).length} solicitudes · ${Math.max(0,CAP-active(selected).filter(r=>r.status==='CONCEDIDO').length)} plazas sin conceder`;
 $('confirmUsed').textContent=`${own().length} de 2`; $('confirmOverlay').hidden=false;
};
$('cancelConfirm').onclick=closeModal;$('dismissOverlay').onclick=closeModal;
$('acceptConfirm').onclick=()=>{if(!selected||own().length>=2||own().some(r=>r.date===selected)){closeModal();return}records.push({person,date:selected,status:'SOLICITADO'});closeModal();$('feedback').textContent='Solicitud ficticia registrada. Pendiente de revisión.';render()};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
document.querySelectorAll('.admin-metrics .metric').forEach((e,i)=>e.onclick=()=>{if(i===2&&active('2026-10-20').length>CAP){caseDate='2026-10-20';renderCase();$('caseDetail').scrollIntoView({behavior:'smooth'})}else $('registry').scrollIntoView({behavior:'smooth'})});
render();
