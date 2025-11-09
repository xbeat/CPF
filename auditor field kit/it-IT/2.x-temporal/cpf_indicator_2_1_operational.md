# INDICATORE CPF 2.1: Bypass di Sicurezza Indotto dall'Urgenza

## CONTESTO

Il bypass di sicurezza indotto dall'urgenza si verifica quando la pressione temporale induce i dipendenti a eludere i protocolli di sicurezza per rispettare le scadenze. Sotto stress, le persone danno priorità agli obiettivi immediati (rispettare le scadenze) rispetto ai rischi futuri (incidenti di sicurezza), portando a scorciatoie pericolose come condividere password, saltare approvazioni o utilizzare strumenti non autorizzati. Questa vulnerabilità viene sfruttata dagli attaccanti che creano urgenza artificiale per spingere le vittime a bypassare le normali procedure di sicurezza.

## VALUTAZIONE

**Domanda 1**: Con quale frequenza i dipendenti richiedono accesso di emergenza o eccezioni di sicurezza durante i Suoi periodi più intensi (fine trimestre, fine anno, scadenze importanti)?
- Ci racconti il Suo esempio specifico: Descriva una situazione recente in cui qualcuno aveva bisogno di accesso urgente o ha chiesto di bypassare le procedure normali.

**Domanda 2**: Cosa succede quando un dirigente senior afferma di aver bisogno di accesso immediato a un sistema o file che normalmente richiede approvazione o passaggi di sicurezza aggiuntivi?
- Ci racconti il Suo esempio specifico: Ci illustri l'ultima volta che è successo e quale processo è stato seguito.

**Domanda 3**: Durante i periodi ad alta pressione (come interruzioni di sistema, scadenze importanti o crisi), quali procedure di sicurezza vengono tipicamente accorciate o saltate?
- Ci racconti il Suo esempio specifico: Descriva come il Suo ultimo cambiamento urgente o risposta di emergenza differiva dalle normali procedure di sicurezza.

**Domanda 4**: Con quale frequenza i dipendenti condividono le credenziali di accesso, utilizzano dispositivi personali o scaricano software non autorizzato quando affrontano scadenze strette?
- Ci racconti il Suo esempio specifico: Ci fornisca un'istanza recente in cui qualcuno ha utilizzato una "soluzione alternativa" per completare un lavoro urgente più velocemente.

**Domanda 5**: Qual è la politica della Sua organizzazione quando qualcuno afferma di aver ricevuto un'email urgente dalla leadership che richiede azione immediata, accesso a file o condivisione di credenziali?
- Ci racconti il Suo esempio specifico: Descriva come il Suo team ha gestito l'ultima email di "richiesta urgente" che sembrava provenire dall'alta dirigenza.

**Domanda 6**: Come gestisce le revisioni e le approvazioni di sicurezza quando c'è pressione per distribuire modifiche o concedere accesso immediatamente?
- Ci racconti il Suo esempio specifico: Ci racconti di una volta recente in cui c'era pressione per saltare o accelerare le revisioni di sicurezza.

**Domanda 7**: Quale percentuale dei Suoi incidenti di sicurezza si verifica durante i periodi di massima pressione della Sua organizzazione (fine trimestre, scadenze di progetti importanti, risposta alle crisi)?
- Ci racconti il Suo esempio specifico: Descriva il Suo incidente di sicurezza più recente avvenuto durante un periodo stressante o guidato dalle scadenze.

## PUNTEGGIO

**Verde (0)**: L'organizzazione ha procedure di emergenza documentate che mantengono i controlli di sicurezza, la leadership senior modella costantemente un comportamento orientato alla sicurezza durante l'urgenza, e le metriche di sicurezza non mostrano correlazione tra i periodi di scadenza e gli incidenti di sicurezza.

**Giallo (1)**: Esistono procedure di emergenza ma vengono talvolta bypassate durante pressione estrema, la leadership occasionalmente sovrascrive la sicurezza per esigenze urgenti, oppure c'è una certa correlazione tra i periodi ad alta pressione e le richieste di eccezione di sicurezza.

**Rosso (2)**: Non esistono procedure di emergenza formali o vengono regolarmente bypassate, la leadership senior richiede frequentemente override (sostituzione) di sicurezza per questioni urgenti, condividere credenziali o utilizzare strumenti non autorizzati è comune durante le scadenze, oppure c'è un chiaro pattern di aumento degli incidenti di sicurezza durante i periodi di scadenza.

## SCENARI DI RISCHIO

**Ingegneria Sociale (Social Engineering) Guidata dalle Scadenze**: Gli attaccanti si spacciano per dirigenti durante periodi ad alta pressione noti (fine trimestre, fine anno) con richieste urgenti di accesso a file, trasferimenti bancari o condivisione di credenziali. Il tasso di successo aumenta del 40% durante i periodi di scadenza quando i dipendenti sono stressati e sotto pressione temporale.

**Attacchi di Sfruttamento delle Crisi**: Durante interruzioni di sistema o crisi aziendali, gli attaccanti offrono "soluzioni di emergenza" tramite email di phishing (posta elettronica fraudolenta) o telefonate, sapendo che il personale IT stressato potrebbe bypassare le normali procedure di verifica per ripristinare rapidamente le operazioni.

**Impersonazione di Fornitori Durante le Scadenze**: Gli attaccanti si spacciano per fornitori o service provider offrendo assistenza urgente con aggiornamenti o correzioni "critiche" durante i periodi di scadenza, sfruttando il desiderio della vittima di risolvere rapidamente i problemi senza adeguata verifica.

**Targeting di Scadenze Normative**: Gli attaccanti mirano specificamente alle organizzazioni durante i periodi di rendicontazione di conformità (compliance reporting), sapendo che il personale sotto pressione normativa potrebbe condividere dati sensibili o bypassare i controlli di accesso per rispettare le scadenze di presentazione.

## CATALOGO SOLUZIONI

**Sistemi di Accesso di Emergenza Automatizzati**: Implementare procedure di accesso di emergenza pre-approvate con limiti di tempo automatici e registrazione (logging). Il sistema concede accesso temporaneo elevato basato su criteri predefiniti senza richiedere approvazione manuale, ma revoca automaticamente l'accesso e avvisa i team di sicurezza. Riduce la tentazione di bypass mantenendo la supervisione della sicurezza.

**Implementazione di Buffer Temporali**: Inserire tempo di buffer di sicurezza obbligatorio in tutte le scadenze di progetto e i requisiti normativi. Stabilire una politica organizzativa per cui tutte le scadenze includono finestre minime di revisione di sicurezza di 48 ore che non possono essere compresse. Previene la pressione di sicurezza dell'ultimo minuto e normalizza la sicurezza come parte della pianificazione temporale.

**Potenziamento del Monitoraggio nei Periodi di Stress**: Implementare monitoraggio di sicurezza aggiuntivo durante i periodi ad alta pressione identificati (fine trimestre, fine anno, progetti importanti). Aumentare la sensibilità degli avvisi (alert) per condivisione di credenziali, tentativi di accesso non autorizzato ed eccezioni alle politiche durante queste finestre. Includere notifiche automatizzate ai team di sicurezza quando le procedure di emergenza vengono attivate.

**Prevenzione del Bypass di Sicurezza da Parte dei Dirigenti**: Stabilire procedure di verifica per tutte le richieste urgenti dalla leadership senior, inclusi canali di conferma secondari e periodi di ritardo obbligatori per azioni ad alto rischio. Formare i dirigenti sul comportamento modello di sicurezza e fornire loro procedure "fast track" sicure che mantengono la sicurezza apparendo reattive.

**Integrazione della Sicurezza nella Risposta alle Crisi**: Sviluppare procedure di risposta agli incidenti che includono esplicitamente considerazioni di sicurezza e non possono essere bypassate nemmeno durante le emergenze. Creare liste di fornitori pre-approvati, canali di comunicazione di emergenza con verifica integrata e team di sicurezza a risposta rapida formati per supportare in modo sicuro le esigenze aziendali urgenti.

**Formazione sul Riconoscimento dell'Urgenza**: Fornire formazione specifica sul riconoscimento delle tattiche di urgenza artificiale utilizzate dagli ingegneri sociali (social engineer). Includere campagne di phishing simulate che testano la capacità dei dipendenti di verificare richieste urgenti, specialmente durante i periodi ad alto stress. Concentrarsi sulle risposte "pausa e verifica" alle richieste urgenti inaspettate.

## CHECKLIST DI VERIFICA

**Procedure di Accesso di Emergenza**:
- [ ] Richiedere documentazione delle politiche e procedure di accesso di emergenza
- [ ] Rivedere i log (registri) di utilizzo dell'accesso di emergenza degli ultimi 12 mesi
- [ ] Verificare che i limiti di tempo automatici e i meccanismi di allerta siano funzionali
- [ ] Controllare la correlazione tra calendario aziendale e picchi di accesso di emergenza

**Controlli sul Bypass della Leadership**:
- [ ] Intervistare il team di sicurezza sulle richieste di override dei dirigenti e la frequenza
- [ ] Rivedere le eccezioni documentate concesse alla leadership senior nell'ultimo trimestre
- [ ] Testare le procedure di verifica per richieste urgenti della leadership
- [ ] Osservare la comunicazione dei dirigenti durante uno scenario urgente simulato

**Documentazione della Pressione delle Scadenze**:
- [ ] Esaminare le tempistiche dei progetti per periodi di revisione di sicurezza integrati
- [ ] Rivedere i log di gestione del cambiamento (change management) durante i recenti periodi di scadenza
- [ ] Intervistare il personale sulla pressione a bypassare la sicurezza durante situazioni urgenti
- [ ] Analizzare la tempistica degli incidenti di sicurezza rispetto alle scadenze organizzative

**Integrazione della Sicurezza nella Risposta alle Crisi**:
- [ ] Rivedere le procedure di risposta agli incidenti per la preservazione dei requisiti di sicurezza
- [ ] Testare i canali di comunicazione di crisi per i meccanismi di verifica
- [ ] Verificare che esistano liste di fornitori e service provider pre-approvati e che siano aggiornate
- [ ] Osservare un'esercitazione tabletop includendo considerazioni di sicurezza durante la simulazione di crisi

## METRICHE DI SUCCESSO

**Rapporto di Accesso di Emergenza**: Misurare il rapporto tra richieste di accesso di emergenza e richieste di accesso totali durante i periodi ad alta pressione rispetto ai periodi normali. Obiettivo: Non più del 15% di aumento durante i periodi di scadenza (misurazione di base su 12 mesi). Monitorare mensilmente e riportare alla leadership di sicurezza.

**Correlazione delle Eccezioni di Sicurezza**: Tracciare la percentuale di incidenti di sicurezza che si verificano durante i periodi ad alta pressione identificati (fine trimestre, scadenze di progetti, periodi di conformità). Obiettivo: Ridurre la correlazione del 50% entro 90 giorni. Misurare tramite analisi della tempistica degli incidenti e riportare trimestralmente.

**Frequenza di Override dei Dirigenti**: Monitorare la frequenza degli override (sostituzioni) delle procedure di sicurezza richieste dalla leadership senior durante situazioni urgenti. Obiettivo: Stabilire una baseline e ridurre del 30% attraverso processi sicuri alternativi. Tracciare mensilmente tramite log di eccezioni di sicurezza e sessioni di feedback con la leadership.
