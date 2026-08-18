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
