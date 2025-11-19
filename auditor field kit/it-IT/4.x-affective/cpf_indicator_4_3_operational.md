# INDICATORE CPF 4.3: Trasferimento di Fiducia ai Sistemi

## CONTESTO

Il trasferimento di fiducia ai sistemi (trust transference to systems) si verifica quando i dipendenti inconsciamente trattano i sistemi tecnologici come se possedessero giudizio e affidabilità simili a quelli umani, portando a comportamenti di verifica ridotti e eccessivo affidamento sugli output (outputs) automatizzati. Questo meccanismo psicologico crea vulnerabilità (vulnerabilities) di cybersecurity (cybersecurity) perché gli utenti bypassano (bypass) le normali procedure di verifica quando interagiscono con sistemi "fidati", rendendoli suscettibili ad attacchi di impersonificazione del sistema, automazione malevola e infrastruttura compromessa. Le organizzazioni sperimentano questo quando i dipendenti approvano richieste generate dal sistema senza verifica, accettano raccomandazioni AI (AI) senza validazione e mantengono confidenza nei sistemi anche dopo fallimenti documentati.

## VALUTAZIONE

**Domanda 1**: Con quale frequenza i dipendenti verificano indipendentemente gli outputs dai vostri sistemi aziendali principali (ERP, CRM, sistemi finanziari) prima di prendere decisioni importanti basate su quelle informazioni?
- Verificano sempre gli outputs importanti
- A volte verificano, a seconda della situazione
- Raramente verificano a meno che non ci sia un errore ovvio
- Non verificano mai - ci fidiamo dei nostri sistemi
- **Ci racconti il suo esempio specifico**: Descriva una recente decisione aziendale importante e quali passaggi di verifica sono stati presi.

**Domanda 2**: Cosa succede quando un sistema aziendale fidato produce un errore o un risultato inaspettato?
- Investighiamo immediatamente e documentiamo la causa radice
- Aggiriamo l'errore ma assumiamo che sia temporaneo
- Assumiamo che l'errore dell'utente o fattori esterni abbiano causato il problema
- Continuiamo a usare il sistema e speriamo che non accada di nuovo
- **Ci racconti il suo esempio specifico**: Descriva l'ultima volta che un sistema principale ha avuto un errore e come il suo team ha risposto.

**Domanda 3**: Come gestisce la sua organizzazione le richieste di approvazione che sembrano provenire da sistemi automatizzati o strumenti AI?
- Stesso processo di verifica delle richieste umane
- Verifica ridotta per richieste "generate dal sistema"
- Auto-approvazione della maggior parte delle richieste di sistema a meno che non siano segnalate
- Non distinguiamo tra richieste umane e di sistema
- **Ci racconti il suo esempio specifico**: Ci guidi attraverso il suo ultimo workflow (workflow) di approvazione automatizzata.

**Domanda 4**: Quando i dipendenti ricevono alerts (alerts) o notifiche da sistemi di sicurezza, strumenti di monitoraggio o assistenti AI, qual è il processo di risposta standard?
- Verificano sempre l'autenticità dell'alert prima di agire
- Verificano gli alerts durante l'orario di lavoro, agiscono immediatamente fuori orario
- Si fidano e agiscono sugli alerts da sistemi conosciuti
- Sistemi di risposta automatizzata gestiscono la maggior parte degli alerts
- **Ci racconti il suo esempio specifico**: Descriva come il suo team ha gestito l'alert di sicurezza più recente.

**Domanda 5**: Come gestisce le situazioni in cui gli strumenti AI o i sistemi automatizzati fanno raccomandazioni che sono in conflitto con il giudizio umano?
- Il giudizio umano prevale sempre sulle raccomandazioni del sistema
- Investighiamo le discrepanze prima di decidere
- Le raccomandazioni del sistema di solito hanno priorità
- Ci affidiamo a qualunque fonte di cui ci fidiamo di più
- **Ci racconti il suo esempio specifico**: Ci fornisca un caso recente in cui le raccomandazioni umane e di sistema differivano.

**Domanda 6**: Quale addestramento fornisce la sua organizzazione riguardo ai limiti e all'uso appropriato degli strumenti AI e dei sistemi automatizzati?
- Addestramento regolare sui limiti del sistema e sulle procedure di verifica
- Addestramento una tantum durante i rollouts (rollouts) del sistema
- Guida informale dall'IT quando sorgono problemi
- Nessun addestramento specifico - assumiamo che gli utenti imparino attraverso l'esperienza
- **Ci racconti il suo esempio specifico**: Descriva la sua sessione di addestramento del sistema più recente e quali argomenti sono stati coperti.

## PUNTEGGIO

**Verde (0): Forte Scetticismo del Sistema**
- I dipendenti verificano sempre indipendentemente gli outputs importanti del sistema
- Gli errori del sistema innescano investigazione e documentazione immediate
- Procedure di verifica identiche per richieste umane e automatizzate
- Gli alerts di sicurezza richiedono verifica dell'autenticazione prima dell'azione
- La supervisione umana è sempre disponibile per le raccomandazioni del sistema
- L'addestramento regolare enfatizza i limiti del sistema e le procedure di verifica

**Giallo (1): Fiducia Selettiva del Sistema**
- Le procedure di verifica variano in base al tipo di sistema o situazione
- Gli errori del sistema a volte vengono attribuiti a fattori esterni
- Alcune richieste automatizzate ricevono verifica ridotta
- La risposta agli alerts varia in base al tempo/contesto
- I conflitti sistema vs umano vengono gestiti caso per caso
- Addestramento limitato o datato sui limiti del sistema

**Rosso (2): Alta Fiducia del Sistema**
- Rara verifica degli outputs dei sistemi fidati
- Gli errori del sistema vengono attribuiti a errore dell'utente o fattori esterni
- Le richieste automatizzate tipicamente auto-approvate o minimamente verificate
- Gli alerts di sicurezza da sistemi fidati vengono seguiti senza verifica
- Le raccomandazioni del sistema sovrascrivono routinariamente il giudizio umano
- Nessun addestramento formale sui limiti del sistema o procedure di verifica

## SCENARI DI RISCHIO

**Attacchi di Impersonificazione del Sistema**: Gli attaccanti creano notifiche false o interfacce che sembrano provenire da sistemi interni fidati. I dipendenti con alta fiducia del sistema agiscono immediatamente su queste richieste malevole senza verifica, portando a furto di credenziali, accesso non autorizzato o esfiltrazione di dati. L'hack (hack) di Twitter del 2020 ha sfruttato fiducia simile negli strumenti amministrativi interni.

**Manipolazione dell'Assistente AI**: Strumenti AI compromessi o avvelenati forniscono raccomandazioni malevole che i dipendenti seguono senza domande a causa della fiducia nelle capacità AI. Questo potrebbe risultare nell'approvazione di transazioni fraudolente, condivisione di dati sensibili o esecuzione di codice malevolo. Il rischio aumenta man mano che le organizzazioni integrano più strumenti AI nei workflows (workflows) decisionali.

**Compromissione dell'Infrastruttura Fidata**: Quando gli attaccanti ottengono il controllo di sistemi legittimi ma fidati (come server di aggiornamento software (software) o strumenti di monitoraggio), i dipendenti continuano a fidarsi e ad agire sulle comunicazioni da questi sistemi compromessi. L'attacco SolarWinds (SolarWinds) ha avuto successo in parte perché le organizzazioni si fidavano degli aggiornamenti software da un vendor (vendor) verificato.

**Social Engineering (Social Engineering) Automatizzato**: Gli attaccanti sfruttano la fiducia nei sistemi automatizzati per bypassare i processi di verifica umani, come usare email false generate dal sistema per richiedere azioni urgenti o usare chatbots (chatbots) compromessi per estrarre informazioni sensibili. Gli attacchi Business Email Compromise (Business Email Compromise) spesso hanno successo quando le email sembrano provenire da sistemi automatizzati fidati.

## CATALOGO DELLE SOLUZIONI

**Soluzione 1: Protocolli di Verifica Obbligatoria**
Implementare controlli tecnici che richiedono verifica umana per tutte le azioni generate dal sistema ad alto impatto. Creare workflows di approvazione che non possono essere bypassati anche per sistemi "fidati", con chiari percorsi di escalation (escalation) e audit trails (audit trails). Distribuire autenticazione multi-fattore (multi-factor authentication) specificamente per richieste generate dal sistema sopra soglie di rischio definite.

**Soluzione 2: Strumenti di Validazione degli Outputs del Sistema**
Distribuire strumenti automatizzati che verificano indipendentemente gli outputs dai sistemi aziendali critici contro fonti di dati alternative o algoritmi di sanity-check (sanity-check). Implementare sistemi di cross-referencing (cross-referencing) che segnalano discrepanze tra diversi sistemi fidati. Creare alerts (alerts) di dashboard (dashboard) quando gli outputs del sistema deviano dai pattern (patterns) storici o range (ranges) attesi.

**Soluzione 3: Addestramento di Consapevolezza della Sicurezza Attento alla Fiducia**
Sviluppare moduli di addestramento specifici che affrontano le tendenze psicologiche a fidarsi eccessivamente dei sistemi, includendo esempi di incidenti reali ed esercizi pratici con alerts di sistema falsi. Addestrare i dipendenti a riconoscere il linguaggio antropomorfico riguardo ai sistemi e implementare esercizi di "calibrazione della fiducia" che dimostrano i limiti del sistema.

**Soluzione 4: Protocollo di Risposta agli Incidenti per la Fiducia del Sistema**
Creare procedure specifiche di risposta agli incidenti per attacchi che sfruttano la fiducia del sistema, includendo isolamento immediato dei sistemi compromessi e protocolli di comunicazione che non si affidano a canali potenzialmente compromessi. Stabilire procedure di verifica out-of-band (out-of-band) per tutti gli alerts di sicurezza generati dal sistema.

**Soluzione 5: Trasparenza dell'Affidabilità del Sistema**
Implementare sistemi di monitoraggio e reporting che tracciano e comunicano tassi di errore del sistema, limiti e modalità di fallimento a tutti gli utenti. Creare "report cards (report cards) del sistema" che forniscono valutazioni realistiche delle capacità del sistema e mantenere registri storici dei fallimenti del sistema e dei loro impatti.

**Soluzione 6: Controlli Tecnici Human-in-the-Loop (Human-in-the-Loop)**
Distribuire soluzioni tecniche che richiedono conferma umana per azioni critiche del sistema, con meccanismi di timeout (timeout) che escalano ai supervisori se non viene ricevuta risposta umana. Implementare "circuit breakers (circuit breakers) di fiducia" che richiedono automaticamente verifica aggiuntiva quando i livelli di confidenza del sistema scendono o vengono rilevati pattern insoliti.

## CHECKLIST DI VERIFICA

**Per Protocolli di Verifica Obbligatoria:**
- Richiedere documentazione dei workflows di approvazione che mostrano i requisiti di verifica umana
- Rivedere i logs (logs) di audit che mostrano i passaggi di verifica per azioni recenti del sistema ad alto impatto
- Testare tentativi di bypass per confermare che la verifica non può essere aggirata
- Intervistare i dipendenti per confermare che comprendono quando è richiesta la verifica

**Per Strumenti di Validazione degli Outputs del Sistema:**
- Esaminare le configurazioni degli strumenti di validazione e la logica di cross-referencing
- Rivedere i logs di alert che mostrano discrepanze segnalate e azioni di risoluzione
- Testare i sistemi di validazione con inputs (inputs) noti incorretti per verificare il rilevamento
- Confermare che i risultati di validazione siano visualizzati in modo prominente ai decisori

**Per Addestramento Attento alla Fiducia:**
- Rivedere i materiali di addestramento per contenuti che affrontano la fiducia psicologica nei sistemi
- Verificare i registri di completamento dell'addestramento e i punteggi di valutazione
- Intervistare i partecipanti recenti dell'addestramento riguardo ai concetti di calibrazione della fiducia
- Osservare le risposte dei dipendenti a scenari di impersonificazione del sistema simulati

**Per Trasparenza dell'Affidabilità del Sistema:**
- Rivedere i report di monitoraggio del sistema e la documentazione del tracciamento degli errori
- Esaminare come i limiti del sistema vengono comunicati agli utenti finali
- Verificare i registri storici dei fallimenti e le valutazioni di impatto
- Verificare che i dipendenti possano accedere e comprendere le informazioni sull'affidabilità del sistema

## METRICHE DI SUCCESSO

**Tasso di Conformità della Verifica**: Misurare la percentuale di outputs del sistema ad alto impatto che ricevono verifica indipendente entro tempi definiti. Target (Target): Tasso di verifica del 95% per azioni critiche entro 90 giorni. Monitorare attraverso logs di audit e tracciamento del sistema di approvazione.

**Accuratezza dell'Attribuzione degli Errori del Sistema**: Tracciare come gli errori del sistema vengono classificati e attribuiti (limite del sistema vs fattori esterni vs errore dell'utente). Target: 80% degli errori del sistema correttamente attribuiti ai limiti del sistema piuttosto che a fattori esterni entro 90 giorni. Misurare attraverso report di incidenti e sistemi di tracciamento degli errori.

**Punteggi di Valutazione della Calibrazione della Fiducia**: Misurare le prestazioni dei dipendenti sugli esercizi di calibrazione della fiducia e sulle valutazioni della conoscenza dei limiti del sistema. Target: 90% di punteggi di superamento sulle valutazioni di consapevolezza della fiducia entro 90 giorni dall'implementazione. Tracciare attraverso analytics (analytics) del sistema di addestramento e valutazioni periodiche delle competenze.
