## INDICATORE 1.7: Deferenza a Claim di Autorità Tecnica

### CONTESTO
Questo indicatore misura quanto prontamente i dipendenti conformano con richieste da individui affermanti expertise tecnica senza verifica appropriata. Quando le persone incontrano problemi tecnici complessi oltre la loro conoscenza, bypassano spesso i normali protocolli sicurezza e deferiscono a chiunque suoni tecnicamente competente. Gli attaccanti sfruttano questo impersonando supporto IT, vendor o consulenti tecnici per ottenere accesso sistema, credenziali o informazioni sensibili.

### VALUTAZIONE

**Domanda 1**: Con quale frequenza i Suoi dipendenti ricevono chiamate, email o visite supporto tecnico non sollecitate da persone affermanti di essere da vendor IT, consulenti o servizi supporto? Qual è la Sua media mensile corrente?

**Domanda 2**: Qual è la Sua procedura standard quando qualcuno affermante di essere supporto tecnico contatta un dipendente direttamente richiedendo password, accesso sistema o permesso installare software? Ci illustri gli step esatti.

**Domanda 3**: Ci racconti di un esempio recente dove qualcuno ha contattato la Sua organizzazione affermando autorità tecnica (supporto IT, vendor, consulente, ecc.). Come ha gestito il Suo staff e quali step verifica sono stati presi?

**Domanda 4**: Qual è la Sua policy per i dipendenti che ricevono richieste tecniche che sembrano urgenti o sensibili al tempo? Come bilancia velocità con verifica sicurezza?

**Domanda 5**: Come verificano i Suoi dipendenti non-tecnici (staff admin, dirigenti, HR) se qualcuno affermante di essere supporto IT o vendor tecnico è legittimo? Ci fornisca il Suo processo verifica specifico.

**Domanda 6**: Quando il supporto tecnico esterno legittimo necessita accesso ai Suoi sistemi, attraverso quale workflow approvazione passa? Chi autorizza accesso e quanto velocemente?

**Domanda 7**: Ci racconti della Sua formazione dipendenti sul riconoscere truffe supporto tecnico false. Quando era l'ultima formazione e quali scenari specifici copriva?

### PUNTEGGIO

**Verde (0)**: L'organizzazione ha protocolli verifica obbligatori per tutti i contatti supporto tecnico, i dipendenti usano consistentemente verifica callback a numeri noti e c'è evidenza documentata di richieste tecniche sospette rifiutate negli ultimi 6 mesi.

**Giallo (1)**: Esistono procedure verifica base ma non sono seguite consistentemente, alcuni dipendenti bypassano verifica sotto pressione temporale o i protocolli verifica si applicano solo a certi tipi di richieste tecniche ma non altri.

**Rosso (2)**: Nessun processo verifica formale per contatti supporto tecnico, i dipendenti conformano routinariamente con richieste tecniche senza verifica o incidenti recenti mostrano social engineering riuscito attraverso impersonazione tecnica.

### SCENARI DI RISCHIO

**Harvesting Credenziali Supporto IT Falso**: L'attaccante chiama dipendenti affermando di essere supporto IT necessitante "verificare la loro password" per un aggiornamento sistema. Senza protocolli verifica, i dipendenti forniscono credenziali, dando agli attaccanti accesso rete immediato e capacità muoversi lateralmente attraverso sistemi.

**Installazione Software Malintenzionato**: Lo scammer si spaccia per vendor software offrendo "patch sicurezza urgente" via email o telefono. I dipendenti con deferenza tecnica installano malware camuffato come software legittimo, creando backdoor persistenti e capacità esfiltrazione dati.

**Social Engineering Help Desk**: L'attaccante chiama help desk interno affermando di essere un dipendente che ha dimenticato la password e necessita accesso sistema urgente per deadline cliente. Lo staff help desk, volendo fornire buon servizio, resetta credenziali senza verifica identità appropriata, dando agli attaccanti privilegi sistema elevati.

**Furto Dati Impersonazione Vendor**: Il truffatore contatta organizzazione affermando di essere da vendor tecnologico noto conducendo "audit sicurezza" o "controllo conformità." I dipendenti forniscono informazioni sistema sensibili, diagrammi rete o accesso database, abilitando attacchi mirati sofisticati e furto proprietà intellettuale.

### CATALOGO SOLUZIONI

**Protocollo Verifica Autorità Tecnica**: Implementare sistema verifica callback obbligatorio dove qualsiasi contatto supporto tecnico non sollecitato deve essere verificato chiamando il numero principale dell'organizzazione affermata e richiedendo trasferimento alla persona specifica. Creare schede referenza laminate con step verifica per tutte le workstation dipendenti.

**Workflow Autorizzazione Richieste Tecniche**: Distribuire sistema approvazione digitale richiedente approvazione supervisore e sicurezza IT per qualsiasi richiesta supporto tecnico esterno. Includere notifiche automatizzate, tracciamento approvazioni e ritardo obbligatorio 24 ore per richieste accesso tecnico non-emergenza.

**Log Supporto Tecnico Centralizzato**: Stabilire punto contatto singolo (helpdesk IT o team sicurezza) che logga tutte le interazioni supporto tecnico esterno. Richiedere a tutti i dipendenti di riportare immediatamente qualsiasi contatto tecnico non sollecitato a questo team centrale per verifica e coordinamento risposta.

**Formazione Simulazione Impersonazione Tecnica**: Condurre chiamate ed email supporto tecnico simulate trimestrali miranti gruppi dipendenti differenti. Tracciare conformità con protocolli verifica e fornire feedback immediato. Focalizzare scenari su tattiche pressione, claim urgenza e gergo tecnico che comunemente bypassano pensiero critico.

**Database Autenticazione Vendor**: Creare database sicuro, ricercabile di vendor tecnici legittimi, numeri contatto supporto e personale autorizzato. Includere foto e domande verifica che solo staff supporto reale conoscerebbe. Rendere accessibile a tutti i dipendenti attraverso intranet aziendale.

**Standard Documentazione Richieste Tecniche**: Richiedere documentazione scritta (email o sistema ticket) per tutte le interazioni supporto tecnico, includendo step verifica presi, approvazioni ricevute e azioni eseguite. Implementare audit mensile log supporto tecnico per identificare pattern e migliorare procedure.

### CHECKLIST VERIFICA

**Documentazione Processo**: Richiedere copie procedure verifica supporto tecnico, protocolli callback e workflow approvazioni. Verificare procedure includono step specifici, documentazione richiesta e percorsi escalation chiari.

**Revisione Record Formazione**: Esaminare log partecipazione formazione, risultati esercizi simulazione e moduli riconoscimento dipendenti per formazione consapevolezza autorità tecnica. Cercare partecipazione consistente e date erogazione recenti.

**Documentazione Incidenti**: Rivedere report incidenti sicurezza, ticket help desk e log IT per evidenza tentativi impersonazione tecnica e risposta organizzativa. Controllare lezioni apprese e miglioramenti processo implementati.

**Audit Implementazione Policy**: Osservare interazioni supporto tecnico effettive, intervistare dipendenti su procedure verifica e testare conoscenza attraverso domande scenario. Verificare policy esistono in forma scritta e sono accessibili a tutto lo staff.

**Controlli Accesso Sistema**: Esaminare workflow approvazioni in sistemi gestione servizi IT, rivedere log accessi vendor e verificare richieste supporto tecnico passano attraverso processi approvazione documentati con ritardi e autorizzazioni appropriate.

### METRICHE DI SUCCESSO

**Tasso Conformità Verifica Tecnica**: Misurare percentuale contatti supporto tecnico che passano attraverso protocolli verifica appropriati. Obiettivo 95% conformità entro 90 giorni, misurato attraverso audit mensile log help desk e report incidenti dipendenti.

**Frequenza Reporting Contatti Sospetti**: Tracciare numero contatti supporto tecnico sospetti riportati per mese. Aumento nel reporting indica migliorata consapevolezza e capacità rilevamento. Obiettivo 20% aumento contatti sospetti riportati entro 60 giorni.

**Tasso Successo Simulazione Autorità Tecnica**: Condurre tentativi impersonazione tecnica simulati mensili e misurare conformità dipendenti con protocolli verifica. Obiettivo riduzione tasso successo simulazione da baseline a sotto 10% entro 90 giorni dall'implementazione.
