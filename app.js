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
function openSection(id){
  document.querySelectorAll('.card.hidden').forEach(x=>x.classList.add('hidden'));
  const el=document.getElementById(id);
  if(el){el.classList.remove('hidden');el.scrollIntoView({behavior:'smooth',block:'center'});}
}
function requestTicket(){
  const qty=document.getElementById('ticketQty')?.value || '1';
  window.requestDraft=`MCA / Elite - RICHIESTA ENTRATE\nNome: Cliente Telegram\nEntrate: ${qty}\nPagamento: contanti\nReferente: Mattia Gipsi`;
  document.getElementById('requestContact')?.scrollIntoView({behavior:'smooth',block:'center'});
  toast('Richiesta pronta. Scegli WhatsApp o Telegram.');
}
function requestTable(){
  const p=document.getElementById('people')?.value || '';
  const n=document.getElementById('name')?.value || 'Cliente Telegram';
  window.requestDraft=`MCA / Elite - RICHIESTA TAVOLO\nNome: ${n}\nPersone: ${p}\nPagamento: contanti\nReferente: Mattia Gipsi`;
  document.getElementById('requestContact')?.scrollIntoView({behavior:'smooth',block:'center'});
  toast('Richiesta pronta. Scegli WhatsApp o Telegram.');
}
function sendWhatsApp(){
  const text=encodeURIComponent(window.requestDraft || 'Ciao Mattia, vorrei informazioni per la prossima serata MCA / Elite.');
  window.open('https://wa.me/39371460364?text='+text,'_blank');
}
function sendTelegram(){
  const text=encodeURIComponent(window.requestDraft || 'Ciao Mattia, vorrei informazioni per la prossima serata MCA / Elite.');
  window.open('https://t.me/met_dev?text='+text,'_blank');
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
function scrollTopApp(){window.scrollTo({top:0,behavior:'smooth'});}
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

  const whatsappUrl='https://wa.me/39371460364?text='+encodeURIComponent(message);
  window.open(whatsappUrl,'_blank','noopener');
}

/* v9 — Navette interactions */
function updateNavette(){
  const slider=document.getElementById('navettePeopleSlider');
  if(!slider) return;
  const people=parseInt(slider.value,10)||1;
  const town=document.querySelector('.town-btn.active')?.dataset.town || '';
  const value=document.getElementById('navettePeopleValue');
  const summary=document.getElementById('navetteSummaryPeople');
  const townValue=document.getElementById('navetteTownValue');
  const cost=document.getElementById('navetteCost');
  if(value) value.textContent=people;
  if(summary) summary.textContent=people;
  if(townValue) townValue.textContent=town || 'Seleziona il paese';
  if(cost) cost.textContent=euro(people);
}
function sendNavetteWhatsApp(){
  const town=document.querySelector('.town-btn.active')?.dataset.town || '';
  const people=parseInt(document.getElementById('navettePeopleSlider')?.value||'1',10);
  const name=(document.getElementById('navetteName')?.value||'').trim();
  const phone=(document.getElementById('navettePhone')?.value||'').trim();
  const time=document.getElementById('navetteTime')?.value||'Non indicato';
  const notes=(document.getElementById('navetteNotes')?.value||'').trim();
  if(!town){ toast('Seleziona il paese di partenza.'); return; }
  if(!name || !phone){ toast('Inserisci nome e numero di telefono.'); return; }
  const msg=`🚐 RICHIESTA NAVETTA MCA

👤 Nome: ${name}
📞 Telefono: ${phone}
📍 Partenza: ${town}
👥 Persone: ${people}
🕐 Orario indicativo: ${time}
💰 Servizio: €${people.toFixed(2)} (€1/persona)
${notes ? `📝 Note: ${notes}\n` : ''}
Pagamento: contanti
Referente: Mattia Gipsi`;
  window.open('https://wa.me/39371460364?text='+encodeURIComponent(msg),'_blank','noopener');
}
document.addEventListener('DOMContentLoaded',()=>{
  const slider=document.getElementById('navettePeopleSlider');
  if(slider) slider.addEventListener('input',updateNavette);
  document.querySelectorAll('.town-btn').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.town-btn').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    updateNavette();
  }));
  document.getElementById('requestNavetteBtn')?.addEventListener('click',()=>{
    const box=document.getElementById('navetteForm');
    if(box){box.hidden=false;box.style.display='block';box.scrollIntoView({behavior:'smooth',block:'center'});}
  });
  document.getElementById('sendNavetteWhatsApp')?.addEventListener('click',sendNavetteWhatsApp);
  updateNavette();
});
