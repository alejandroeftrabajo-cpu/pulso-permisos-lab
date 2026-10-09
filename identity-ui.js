/* PERMISOS 2D · solo navegación responsive. No modifica permisos, datos ni autenticación. */
(()=>{'use strict';
const toggle=document.getElementById('sidebarToggle');
const backdrop=document.getElementById('sidebarBackdrop');
const sidebar=document.getElementById('portalSidebar');
if(!toggle||!backdrop||!sidebar)return;
const close=()=>{document.body.classList.remove('nav-open');backdrop.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú de navegación')};
const open=()=>{document.body.classList.add('nav-open');backdrop.hidden=false;toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Cerrar menú de navegación')};
toggle.addEventListener('click',()=>document.body.classList.contains('nav-open')?close():open());
backdrop.addEventListener('click',close);
sidebar.querySelectorAll('.nav').forEach(n=>n.addEventListener('click',close));
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
const mq=window.matchMedia('(min-width: 901px)');
const handle=()=>{if(mq.matches)close()};
if(mq.addEventListener)mq.addEventListener('change',handle);else mq.addListener(handle);
})();
