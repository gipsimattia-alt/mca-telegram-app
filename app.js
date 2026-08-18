const WA='393714600364';
const TOWNS=[
{name:'Castel Giorgio',distance:5.6},{name:'Allerona',distance:6.8},{name:'Orvieto',distance:10},
{name:'San Lorenzo Nuovo',distance:10.6},{name:'Acquapendente',distance:11},{name:'Ficulle',distance:10.6},
{name:'Porano',distance:11.6},{name:'Bolsena',distance:12.2},{name:'Grotte di Castro',distance:13.5},
{name:'Fabro',distance:13.6},{name:'Proceno',distance:13.8},{name:'Parrano',distance:15.5},
{name:'Bagnoregio',distance:15.7},{name:'Lubriano',distance:15.9},{name:'Onano',distance:16.4},
{name:'San Casciano dei Bagni',distance:16.5},{name:'Gradoli',distance:16.9},{name:'Monteleone d’Orvieto',distance:19.5},
{name:'Latera',distance:19.7},{name:'Baschi',distance:20.1},{name:'Castiglione in Teverina',distance:20.5},
{name:'Civitella d’Agliano',distance:22.7},{name:'Montefiascone',distance:23.7},{name:'Marta',distance:25.2},
{name:'Valentano',distance:25.3},{name:'Montecchio',distance:25.6},{name:'San Venanzo',distance:25.6},
{name:'Capodimonte',distance:28},{name:'Piansano',distance:29.2},{name:'Ischia di Castro',distance:31},
{name:'Celleno',distance:31},{name:'Graffignano',distance:32},{name:'Tuscania',distance:38},
{name:'Farnese',distance:38},{name:'Cellere',distance:38},{name:'Viterbo',distance:39}
];
let selectedTown='';
const $=id=>document.getElementById(id);
const euro=n=>'€'+Number(n).toFixed(0);

function norm(s){return String(s||'').toLocaleLowerCase('it-IT').normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function go(screen){
  document.querySelectorAll('.screen').forEach(x=>x.hidden=x.id!==screen);
  document.querySelectorAll('.bottom-nav button[data-screen]').forEach(b=>b.classList.toggle('active',b.dataset.screen===screen));
  window.scrollTo({top:0,behavior:'smooth'});
}
function whatsapp(text){window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(text),'_blank','noopener')}
function toast(msg){const t=$('toast');t.textContent=msg;t.style.display='block';clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.style.display='none',2600)}

function nextFriday(){
  const now=new Date(), d=new Date(now);
  let add=(5-now.getDay()+7)%7;
  d.setDate(now.getDate()+add); d.setHours(23,0,0,0);
  if(add===0 && now>=d)d.setDate(d.getDate()+7);
  return d;
}
function countdown(){
  const target=nextFriday(), now=new Date();
  let ms=Math.max(0,target-now);
  const days=Math.floor(ms/86400000);ms%=86400000;
  const hours=Math.floor(ms/3600000);ms%=3600000;
  const mins=Math.floor(ms/60000);ms%=60000;
  const secs=Math.floor(ms/1000);
  $('countDays').textContent=String(days).padStart(2,'0');
  $('countHours').textContent=String(hours).padStart(2,'0');
  $('countMinutes').textContent=String(mins).padStart(2,'0');
  $('countSeconds').textContent=String(secs).padStart(2,'0');
  const label=new Intl.DateTimeFormat('it-IT',{weekday:'long',day:'numeric',month:'long'}).format(target);
  $('eventDate').textContent=label.charAt(0).toUpperCase()+label.slice(1)+' • 23:00 • Discoteca Elite';
}

function renderTowns(q=''){
  const box=$('townResults'), empty=$('townEmpty'), query=norm(q);
  const matches=TOWNS.filter(t=>!query||norm(t.name).includes(query)).sort((a,b)=>a.distance-b.distance);
  box.innerHTML=matches.map(t=>`<button class="town-result ${selectedTown===t.name?'selected':''}" data-town="${t.name}" type="button"><span class="town-result-main"><strong>${t.name}</strong><small>📍 circa ${t.distance.toFixed(1).replace('.',',')} km da Elite</small></span><span class="town-result-arrow">›</span></button>`).join('');
  empty.hidden=matches.length>0;
  box.querySelectorAll('[data-town]').forEach(b=>b.addEventListener('click',()=>selectTown(b.dataset.town)));
}
function selectTown(name){
  selectedTown=name;
  $('townSearch').value=name;
  renderTowns(name);
  updateNavette();
}
function updateNavette(){
  const p=Number($('navettePeopleSlider').value);
  $('navettePeopleValue').textContent=p;$('navetteSummaryPeople').textContent=p;$('navetteCost').textContent=euro(p);
  const t=TOWNS.find(x=>x.name===selectedTown);
  $('navetteTownValue').textContent=selectedTown||'Seleziona il paese';
  $('navetteDistance').textContent=t?`📍 circa ${t.distance.toFixed(1).replace('.',',')} km da Elite`:'';
}
function tableUpdate(){
  const p=Number($('peopleSlider').value);
  let total=0,count=0,names=[];
  document.querySelectorAll('.bottle-list input:checked').forEach(x=>{total+=Number(x.dataset.price);count++;names.push(x.dataset.name)});
  $('peopleValue').textContent=p;$('summaryPeople').textContent=p;$('summaryBottles').textContent=count;$('summaryTotal').textContent='€'+total.toFixed(0);$('summaryPerPerson').textContent='€'+(total/p).toFixed(2).replace('.',',');
  window.tableData={people:p,total,count,names};
}
function sendNavette(){
  const name=$('navetteName').value.trim(),phone=$('navettePhone').value.trim();
  if(!selectedTown){toast('Seleziona prima il paese di partenza.');return}
  if(!name||!phone){toast('Inserisci nome e numero di telefono.');return}
  const p=Number($('navettePeopleSlider').value),t=TOWNS.find(x=>x.name===selectedTown);
  const msg=`🚐 RICHIESTA NAVETTA MCA\n\n👤 ${name}\n📞 ${phone}\n📍 Partenza: ${selectedTown}${t?` (${t.distance.toFixed(1).replace('.',',')} km circa)`:''}\n👥 Persone: ${p}\n💰 €${p} (€1/persona)\n🕐 Orario: ${$('navetteTime').value||'Non indicato'}\n${$('navetteNotes').value.trim()?`📝 ${$('navetteNotes').value.trim()}\n`:''}Pagamento: contanti`;
  whatsapp(msg);
}
function sendTable(){
  const name=$('requestName').value.trim(),phone=$('requestPhone').value.trim();
  if(!name||!phone){toast('Inserisci nome e numero di telefono.');return}
  const d=window.tableData||{people:8,total:0,count:0,names:[]};
  const msg=`🍾 RICHIESTA TAVOLO MCA\n\n👤 ${name}\n📞 ${phone}\n👥 Persone: ${d.people}\n🍾 Bottiglie: ${d.count}\n💰 Totale: €${d.total}\n💶 A persona: €${(d.total/d.people).toFixed(2)}\n📋 ${d.names.length?d.names.join(', '):'Nessuna bottiglia selezionata'}\n${$('requestNavetta').checked?'🚐 Interessato anche alla navetta\n':''}Pagamento: contanti`;
  whatsapp(msg);
}
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.screen)));
  $('homeContact').addEventListener('click',()=>whatsapp('Ciao, vorrei informazioni su MCA / Elite.'));
  $('navContact').addEventListener('click',()=>whatsapp('Ciao, vorrei informazioni su MCA / Elite.'));
  $('navettePeopleSlider').addEventListener('input',updateNavette);
  $('townSearch').addEventListener('input',e=>renderTowns(e.target.value));
  $('requestNavetteBtn').addEventListener('click',()=>{$('navetteForm').hidden=false;$('navetteForm').scrollIntoView({behavior:'smooth',block:'center'})});
  $('sendNavetteWhatsApp').addEventListener('click',sendNavette);
  $('peopleSlider').addEventListener('input',tableUpdate);
  document.querySelectorAll('.bottle-list input').forEach(x=>x.addEventListener('change',tableUpdate));
  $('requestTableBtn').addEventListener('click',()=>{$('tableForm').hidden=false;$('tableForm').scrollIntoView({behavior:'smooth',block:'center'})});
  $('sendTableWhatsApp').addEventListener('click',sendTable);
  renderTowns();updateNavette();tableUpdate();countdown();setInterval(countdown,1000);go('home');
});
