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
