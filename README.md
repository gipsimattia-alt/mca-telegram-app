# MCA Telegram Mini App — MVP v2

Brand: MCA Production
Bot: @mcaproduction_bot
Locale: Elite
Referente: Mattia Gipsi
Pagamento: contanti.

## Stato
Questo è un frontend MVP: le richieste mostrano una conferma nell'interfaccia, ma NON vengono ancora salvate né inviate a Mattia.
Il backend/admin è il passaggio successivo.

## Pubblicazione
Caricare tutti i file nella root di un hosting HTTPS (GitHub Pages va bene).
L'URL della pagina `index.html` sarà quello da inserire in BotFather > Configure Mini App.

## Importante
Il progetto include il JavaScript ufficiale Telegram Web Apps e inizializza Telegram.WebApp quando viene aperto dentro Telegram.
Non contiene token/API key.

## Prossimo sviluppo
- Backend + database
- Notifica automatica a Mattia
- Conferma/rifiuto richieste
- Eventi configurabili
- QR/biglietto
- Elite Points
- Referral
- Admin dashboard


## Versione v3 — MCA
- "Biglietti" rinominato in "Entrate".
- "Elite Points" rinominato in "MCA Points".
- Tavoli e Invita amici mantenuti.
- Referente: Mattia Gipsi.
- Richiesta con due canali: WhatsApp `+39 371 460 364` oppure Telegram `@met_dev`.
- Le richieste vengono precompilate e l'utente apre il canale scelto per inviarle.

### Nota tecnica
Per l'invio completamente automatico senza che l'utente prema "Invia" serve un backend. Inoltre, un bot Telegram non può avviare una conversazione con un utente solo conoscendo il suo username: occorre che l'utente abbia avviato il bot oppure che sia disponibile il suo `chat_id`. Per WhatsApp, l'invio automatico lato server richiede WhatsApp Business Platform/API o un provider.


## Versione v4 — Configuratore Tavoli
- Barra persone da 1 a 30.
- Listino diviso in Vodka, Gin, Bollicine ed Extra.
- Selezione multipla delle bottiglie.
- Totale tavolo calcolato in tempo reale.
- Spesa per persona calcolata automaticamente.
- Richiesta tavolo con riepilogo completo.


## Versione v5 — Richiesta tavolo WhatsApp
- Dopo "Richiedi tavolo" compare il modulo dati.
- La richiesta viene inviata esclusivamente tramite WhatsApp.
- Il messaggio contiene persone, bottiglie, totale, spesa a persona, paese di partenza e navetta.
- Contatto WhatsApp: Mattia Gipsi.


## Versione v6 — Fix mobile
- Rimosso lo sticky del riepilogo che copriva il pulsante.
- Aggiunto spazio per la barra di navigazione mobile.
- Il modulo richiesta tavolo viene portato in una posizione visibile dopo il click.


## Versione v7 — Fix cache Telegram
- Aggiunto cache-busting a CSS e JavaScript.
- Il modulo richiesta tavolo viene forzato visibile dopo il click.
- Evita che Telegram WebView continui a usare il vecchio app.js.


## Versione v8 — Spazio CTA mobile
- Riservato spazio sufficiente sopra la barra fissa Telegram.
- Il pulsante RICHIEDI TAVOLO e il modulo WhatsApp non vengono più coperti.


## Versione v9 — Navette
- Sostituita la sezione Entrate con Navette.
- Scelta paese: Montefiascone, Marta, Piansano, Valentano, Altro paese.
- Barra persone 1–30.
- Calcolo automatico €1/persona.
- Richiesta navetta con nome, telefono, orario e note.
- Invio richiesta esclusivamente via WhatsApp a Mattia.


## Versione v10 — Navette definitiva
- Rimossi tutti i riferimenti UI a "Entrate".
- La sezione principale è "Navette".
- Menu e testi aggiornati.
- Cache busting v10 per CSS/JS.
