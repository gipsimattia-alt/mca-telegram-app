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
  const items=selected.map(el=>`${el.dataset.name} €${el.dataset.price}`).join(', ');
  window.requestDraft=`MCA / ELITE - RICHIESTA TAVOLO\nPersone: ${people}\nBottiglie: ${items}\nTotale tavolo: €${total.toFixed(2)}\nSpesa a persona: €${(total/people).toFixed(2)}\nPagamento: contanti\nReferente: Mattia Gipsi`;
  document.getElementById('requestContact')?.scrollIntoView({behavior:'smooth',block:'center'});
  toast('Tavolo pronto. Scegli come inviare la richiesta.');
}
document.addEventListener('DOMContentLoaded',()=>{
  const slider=document.getElementById('peopleSlider');
  if(slider) slider.addEventListener('input',updateTableTotal);
  document.querySelectorAll('#tableConfigurator input[type="checkbox"]').forEach(x=>x.addEventListener('change',updateTableTotal));
  updateTableTotal();
});
