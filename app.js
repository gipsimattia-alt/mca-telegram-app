
function showPage(id){
  const pages=['homeSection','navetteSection','tableConfigurator'];
  pages.forEach(pid=>{
    const el=document.getElementById(pid);
    if(el) el.classList.toggle('hidden', pid!==id);
  });
  window.scrollTo({top:0,behavior:'smooth'});
}
function goHome(){ showPage('homeSection'); }

function getTG(){
  return window.Telegram && Telegram.WebApp ? Telegram.WebApp : null;
}
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.style.display='block';
  clearTimeout(window._tt);
  window._tt=setTimeout(()=>t.style.display='none',3500);
}
function shareMCA(){
  const text='Vieni con me alla prossima serata MCA / Elite!';
  const tg=getTG();
  if(tg && tg.switchInlineQuery){
    tg.switchInlineQuery(text,['users','groups','channels']);
  } else if(navigator.share){
    navigator.share({text}).catch(()=>{});
  } else {
    navigator.clipboard?.writeText(text);
    toast('Testo copiato: ora puoi condividerlo.');
  }
}
function scrollTopApp(){showPage('homeSection');}
document.addEventListener('DOMContentLoaded',()=>{
  const tg=getTG();
  if(tg){tg.ready();tg.expand();}
});

function euro(value){
  return new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(value);
}
function updateTableTotal(){
  const peopleEl=document.getElementById('peopleSlider');
  if(!peopleEl) return;
  const people=parseInt(peopleEl.value,10)||1;
  const selected=[...document.querySelectorAll('#tableConfigurator input[type="checkbox"][data-price]:checked')];
  const total=selected.reduce((sum,el)=>sum+(parseFloat(el.dataset.price)||0),0);
  const bottles=selected.length;
  const per=total/people;
  document.getElementById('peopleValue').textContent=people;
  document.getElementById('summaryPeople').textContent=people;
  document.getElementById('summaryBottles').textContent=bottles;
  document.getElementById('summaryTotal').textContent=euro(total);
  document.getElementById('summaryPerPerson').textContent=euro(per);
}
function submitTableRequest(){
  const people=parseInt(document.getElementById('peopleSlider')?.value||'1',10);
  const selected=[...document.querySelectorAll('#tableConfigurator input[type="checkbox"][data-price]:checked')];
  const total=selected.reduce((sum,el)=>sum+(parseFloat(el.dataset.price)||0),0);
  if(selected.length===0){
    toast('Seleziona almeno una bottiglia per comporre il tavolo.');
    return;
  }
  window.tableRequestData={
    people,
    total,
    perPerson: total/people,
    items: selected.map(el=>({name:el.dataset.name,price:parseFloat(el.dataset.price)||0}))
  };
  const box=document.getElementById('requestContact');
  if(box){
    box.hidden=false;
    box.removeAttribute('hidden');
    box.style.display='block';
    requestAnimationFrame(()=>{
      box.scrollIntoView({behavior:'smooth',block:'center'});
      setTimeout(()=>document.getElementById('requestName')?.focus(),300);
    });
  }
}
document.addEventListener('DOMContentLoaded',()=>{
  const slider=document.getElementById('peopleSlider');
  if(slider) slider.addEventListener('input',updateTableTotal);
  document.querySelectorAll('#tableConfigurator input[type="checkbox"]').forEach(x=>x.addEventListener('change',updateTableTotal));
  updateTableTotal();
});

function sendTableRequestWhatsApp(){
  const data=window.tableRequestData;
  if(!data){ submitTableRequest(); return; }
  const name=(document.getElementById('requestName')?.value||'').trim();
  const phone=(document.getElementById('requestPhone')?.value||'').trim();
  const town=document.getElementById('requestTown')?.value||'';
  const navetta=document.getElementById('requestNavetta')?.checked ? 'Sì' : 'No';
  if(!name || !phone){
    toast('Inserisci nome e numero di telefono.');
    return;
  }
  const items=data.items.map(x=>`• ${x.name} — €${x.price.toFixed(2)}`).join('\n');
  const message =
`🔥 NUOVA RICHIESTA TAVOLO MCA

👤 Nome: ${name}
📞 Telefono: ${phone}
👥 Persone: ${data.people}

🥂 BOTTIGLIE
${items}

💰 Totale tavolo: €${data.total.toFixed(2)}
👤 Spesa a persona: €${data.perPerson.toFixed(2)}

📍 Partenza: ${town}
🚐 Navetta: ${navetta}

Pagamento: contanti
Referente: Mattia Gipsi`;

  const whatsappUrl='https://wa.me/393714600364?text='+encodeURIComponent(message);
  window.open(whatsappUrl,'_blank','noopener');
}

/* v15 — MCA Navette: searchable nearby towns */
const MCA_TOWNS = [
  {name:'Castel Giorgio', distance:5.6},
  {name:'Allerona', distance:6.8},
  {name:'Orvieto', distance:10.0},
  {name:'Acquapendente', distance:11.0},
  {name:'San Lorenzo Nuovo', distance:10.6},
  {name:'Ficulle', distance:10.6},
  {name:'Porano', distance:11.6},
  {name:'Bolsena', distance:12.2},
  {name:'Grotte di Castro', distance:13.5},
  {name:'Fabro', distance:13.6},
  {name:'Proceno', distance:13.8},
  {name:'Parrano', distance:15.5},
  {name:'Bagnoregio', distance:15.7},
  {name:'Lubriano', distance:15.9},
  {name:'Onano', distance:16.4},
  {name:'San Casciano dei Bagni', distance:16.5},
  {name:'Gradoli', distance:16.9},
  {name:'Monteleone d’Orvieto', distance:19.5},
  {name:'Latera', distance:19.7},
  {name:'Baschi', distance:20.1},
  {name:'Castiglione in Teverina', distance:20.5},
  {name:'Civitella d’Agliano', distance:22.7},
  {name:'Montefiascone', distance:23.7},
  {name:'Sorano', distance:24.6},
  {name:'Montecchio', distance:25.6},
  {name:'San Venanzo', distance:25.6},
  {name:'Marta', distance:25.2},
  {name:'Valentano', distance:25.3},
  {name:'Piansano', distance:29.2},
  {name:'Capodimonte', distance:28.0},
  {name:'Ischia di Castro', distance:31.0},
  {name:'Celleno', distance:31.0},
  {name:'Graffignano', distance:32.0},
  {name:'Tuscania', distance:38.0},
  {name:'Viterbo', distance:39.0},
  {name:'Farnese', distance:38.0},
  {name:'Cellere', distance:38.0}
];

function normalizeTown(value){
  return (value||'').toLocaleLowerCase('it-IT')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .trim();
}
function townMatches(town, query){
  const q=normalizeTown(query);
  if(!q) return true;
  return normalizeTown(town.name).includes(q);
}
function renderTownResults(query=''){
  const box=document.getElementById('townResults');
  const empty=document.getElementById('townEmpty');
  if(!box) return;

  const matches=MCA_TOWNS
    .filter(t=>townMatches(t,query))
    .sort((a,b)=>a.distance-b.distance);

  box.innerHTML=matches.map(t=>`
    <button class="town-result" type="button" data-town="${t.name}">
      <span class="town-result-main">
        <strong>${t.name}</strong>
        <small>📍 circa ${t.distance.toFixed(1).replace('.',',')} km da Elite</small>
      </span>
      <span class="town-result-arrow">›</span>
    </button>
  `).join('');

  if(empty) empty.classList.toggle('hidden', matches.length>0);
  box.querySelectorAll('.town-result').forEach(btn=>{
    btn.addEventListener('click',()=>{
      selectTown(btn.dataset.town);
    });
  });
}
function selectTown(townName){
  const town=MCA_TOWNS.find(t=>t.name===townName);
  document.querySelectorAll('.town-result').forEach(x=>x.classList.remove('active'));
  const search=document.getElementById('townSearch');
  if(search) search.value=townName;
  if(town){
    const chosen=document.querySelector(`.town-result[data-town="${CSS.escape(townName)}"]`);
    chosen?.classList.add('active');
  }
  window.selectedNavetteTown=townName;
  updateNavette();
}
function updateNavette(){
  const slider=document.getElementById('navettePeopleSlider');
  if(!slider) return;
  const people=parseInt(slider.value,10)||1;
  const townName=window.selectedNavetteTown || '';
  const value=document.getElementById('navettePeopleValue');
  const summary=document.getElementById('navetteSummaryPeople');
  const townValue=document.getElementById('navetteTownValue');
  const cost=document.getElementById('navetteCost');
  const distanceEl=document.getElementById('navetteTownDistance');
  const town=MCA_TOWNS.find(t=>t.name===townName);

  if(value) value.textContent=people;
  if(summary) summary.textContent=people;
  if(townValue) townValue.textContent=townName || 'Seleziona il paese';
  if(cost) cost.textContent=euro(people);
  if(distanceEl) distanceEl.textContent=town ? `📍 circa ${town.distance.toFixed(1).replace('.',',')} km da Elite` : '';
}
function sendNavetteWhatsApp(){
  const town=window.selectedNavetteTown || '';
  const people=parseInt(document.getElementById('navettePeopleSlider')?.value||'1',10);
  const name=(document.getElementById('navetteName')?.value||'').trim();
  const phone=(document.getElementById('navettePhone')?.value||'').trim();
  const time=document.getElementById('navetteTime')?.value||'Non indicato';
  const notes=(document.getElementById('navetteNotes')?.value||'').trim();
  if(!town){ toast('Cerca e seleziona il paese di partenza.'); return; }
  if(!name || !phone){ toast('Inserisci nome e numero di telefono.'); return; }
  const townData=MCA_TOWNS.find(t=>t.name===town);
  const msg=`🚐 RICHIESTA NAVETTA MCA

👤 Nome: ${name}
📞 Telefono: ${phone}
📍 Partenza: ${town}${townData ? ` (${townData.distance.toFixed(1).replace('.',',')} km circa da Elite)` : ''}
👥 Persone: ${people}
🕐 Orario indicativo: ${time}
💰 Servizio: €${people.toFixed(2)} (€1/persona)
${notes ? `📝 Note: ${notes}\n` : ''}
Pagamento: contanti
Referente: Mattia Gipsi`;
  window.open('https://wa.me/393714600364?text='+encodeURIComponent(msg),'_blank','noopener');
}
document.addEventListener('DOMContentLoaded',()=>{
  const slider=document.getElementById('navettePeopleSlider');
  if(slider) slider.addEventListener('input',updateNavette);

  const search=document.getElementById('townSearch');
  if(search){
    renderTownResults('');
    search.addEventListener('input',()=>renderTownResults(search.value));
    search.addEventListener('focus',()=>renderTownResults(search.value));
  }

  document.getElementById('requestNavetteBtn')?.addEventListener('click',()=>{
    const box=document.getElementById('navetteForm');
    if(box){
      box.hidden=false;
      box.style.display='block';
      box.scrollIntoView({behavior:'smooth',block:'center'});
    }
  });
  document.getElementById('sendNavetteWhatsApp')?.addEventListener('click',sendNavetteWhatsApp);
  updateNavette();
});

/* v14 — Next Elite Friday countdown */
function getNextEliteFriday(){
  const now = new Date();
  const target = new Date(now);
  const day = now.getDay(); // 0 Sun ... 5 Fri
  let daysUntil = (5 - day + 7) % 7;
  target.setDate(now.getDate() + daysUntil);
  target.setHours(23,0,0,0);

  // If it is already Friday after 23:00, use next Friday.
  if(daysUntil === 0 && now >= target){
    target.setDate(target.getDate() + 7);
  }
  return target;
}
function updateEliteCountdown(){
  const target = getNextEliteFriday();
  const now = new Date();
  let diff = Math.max(0, target - now);

  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const pad = n => String(n).padStart(2,'0');
  const set = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=pad(v); };

  set('countDays', days);
  set('countHours', hours);
  set('countMinutes', minutes);
  set('countSeconds', seconds);

  const dateEl=document.getElementById('nextEventDate');
  if(dateEl){
    const label=new Intl.DateTimeFormat('it-IT',{
      weekday:'long',day:'numeric',month:'long'
    }).format(target);
    dateEl.textContent=`${label.charAt(0).toUpperCase()+label.slice(1)} • 23:00 • Discoteca Elite`;
  }
}
document.addEventListener('DOMContentLoaded',()=>{
  updateEliteCountdown();
  setInterval(updateEliteCountdown,1000);
});

/* FINAL — Home CTA affordance + navigation */
function openMCAContact(){
  window.open('https://wa.me/393714600364?text='+encodeURIComponent('Ciao, vorrei informazioni su MCA / Elite.'),'_blank','noopener');
}
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.home-action[data-target]').forEach(card=>{
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    const go=()=>goTo(card.dataset.target);
    card.addEventListener('click',go);
    card.addEventListener('keydown',e=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); go(); }
    });
  });
  document.querySelectorAll('.home-action.contact').forEach(card=>{
    card.addEventListener('click',openMCAContact);
    card.addEventListener('keydown',e=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openMCAContact(); }
    });
  });
});
