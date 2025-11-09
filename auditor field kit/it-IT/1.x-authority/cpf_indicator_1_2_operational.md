# INDICATORE 1.2: Diffusione della Responsabilità nelle Strutture Gerarchiche

## CONTESTO

La diffusione della responsabilità si verifica quando gli individui assumono che qualcun altro nella loro organizzazione stia gestendo la supervisione della sicurezza, creando lacune pericolose dove decisioni critiche cadono tra i livelli di gestione. Questo pattern psicologico porta a risposta ritardata agli incidenti, vulnerabilità senza patch e attacchi di social engineering riusciti perché nessuno si assume la responsabilità personale per le azioni di sicurezza. Le organizzazioni con gerarchie complesse sono particolarmente vulnerabili poiché i dipendenti deferiscono le decisioni di sicurezza verso l'alto mentre il management assume che i team operativi stiano monitorando le minacce.

## VALUTAZIONE

### Domanda 1: Autorità Decisioni di Sicurezza
Quando viene rilevato un potenziale incidente di sicurezza, quanto tempo occorre tipicamente per ottenere l'autorizzazione a intraprendere azioni protettive (come bloccare traffico sospetto o disabilitare account compromessi)?
- **Ci racconti il Suo esempio specifico**: Descriva l'ultima volta che il Suo team ha avuto bisogno di approvazione di sicurezza e ci illustri il processo decisionale.

### Domanda 2: Proprietà Risposta Incidenti
Chi è personalmente responsabile di prendere la decisione finale durante un incidente di sicurezza quando l'orario di lavoro normale termina e il senior management non è disponibile?
- **Ci racconti il Suo esempio specifico**: Ci fornisca una recente situazione di sicurezza fuori orario e spieghi esattamente chi ha preso la decisione di agire.

### Domanda 3: Coordinamento Sicurezza Cross-Dipartimentale
Con quale frequenza i diversi dipartimenti (IT, Sicurezza, Operazioni, HR) si incontrano specificamente per chiarire chi gestisce le responsabilità di sicurezza per sistemi e processi condivisi?
- **Ci racconti il Suo esempio specifico**: Descriva il Suo più recente incontro di coordinamento sicurezza cross-dipartimentale e cosa è stato deciso.

### Domanda 4: Responsabilità Gestione Patch
Quando vengono rilasciate patch di sicurezza critiche, qual è il Suo processo per assicurare che vengano applicate, e chi è personalmente responsabile se non vengono installate entro il Suo timeframe obiettivo?
- **Ci racconti il Suo esempio specifico**: Ci racconti dell'ultima patch critica che ha distribuito e chi era responsabile per ogni step.

### Domanda 5: Gestione Eccezioni Policy di Sicurezza
Cosa succede quando qualcuno ha bisogno di deviare dalle policy di sicurezza stabilite per soddisfare esigenze aziendali, e chi ha l'autorità di approvare queste eccezioni?
- **Ci racconti il Suo esempio specifico**: Ci fornisca un caso recente dove era necessaria flessibilità di policy e come è stato gestito.

### Domanda 6: Responsabilità Sicurezza Nuovi Dipendenti
Quando nuovi dipendenti si uniscono a dipartimenti che gestiscono dati sensibili, chi è specificamente responsabile di assicurare che comprendano i loro obblighi di sicurezza personali (non solo formazione generale)?
- **Ci racconti il Suo esempio specifico**: Ci illustri come la Sua più recente assunzione con accesso sensibile ha appreso le sue responsabilità di sicurezza specifiche.

### Domanda 7: Risoluzione Risultati Audit
Quando gli audit di sicurezza identificano rischi o violazioni, qual è il Suo processo per assicurare che qualcuno si assuma la proprietà personale delle correzioni piuttosto che creare semplicemente action item di comitato?
- **Ci racconti il Suo esempio specifico**: Descriva come il Suo ultimo risultato audit significativo è stato risolto e chi lo ha portato a completamento.

## PUNTEGGIO

**Verde (0)**: Individui nominati hanno chiara autorità di prendere decisioni di sicurezza entro timeframe definiti (sotto 30 minuti per problemi critici). Le responsabilità di sicurezza sono documentate con assegnazioni a persone specifiche, non assegnazioni a dipartimenti. Il coordinamento cross-dipartimentale avviene mensilmente o più con risultati documentati.

**Giallo (1)**: Le decisioni di sicurezza richiedono approvazioni multiple creando ritardi di 30 minuti a 4 ore per problemi critici. Alcune responsabilità di sicurezza sono specifiche per persona mentre altre sono assegnate a dipartimenti. Il coordinamento cross-dipartimentale è ad-hoc o trimestrale.

**Rosso (2)**: Le decisioni di sicurezza richiedono estesa approvazione gerarchica creando ritardi superiori a 4 ore per problemi critici. Le responsabilità di sicurezza sono primariamente assegnate a dipartimenti o ruoli piuttosto che a individui nominati. Non esistono coordinamenti cross-dipartimentali regolari sulla sicurezza.

## SCENARI DI RISCHIO

### Sfruttamento Autorità Social Engineering
Gli attaccanti impersonano dirigenti verso staff di livello inferiore mentre simultaneamente si rappresentano come personale autorizzato verso i dirigenti. Sfruttano il gap dove ogni livello assume che l'altro abbia verificato la richiesta. Questo porta ad accesso dati non autorizzato, pagamenti fraudolenti o compromissione di sistema perché nessuna singola persona si assume la responsabilità per la verifica attraverso i livelli gerarchici.

### Paralisi Risposta Crisi
Durante incidenti di sicurezza attivi, il processo decisionale si blocca poiché ogni livello gerarchico attende autorizzazione dagli altri. Gli attaccanti creano deliberatamente situazioni urgenti che sopraffanno i normali processi di approvazione. Recenti attacchi ransomware sono riusciti specificamente perché la risposta agli incidenti è stata ritardata da requisiti di consultazione gerarchica, consentendo agli attaccanti ore o giorni aggiuntivi per diffondersi attraverso le reti.

### Escalation Privilegi attraverso Gap di Supervisione
Gli insider malintenzionati sfruttano la diffusione della responsabilità accumulando gradualmente accessi non autorizzati. Temporizzano le richieste di privilegi per coincidere con transizioni di management, cambiamenti di ruolo o periodi intensi quando ogni livello assume che un altro livello stia fornendo supervisione. Questo crea un percorso per furto di dati o sabotaggio di sistema che rimane non rilevato per mesi.

### Compromissione Supply Chain via Gap Gestione Vendor
Gli attaccanti mirano allo spazio tra IT (che gestisce l'accesso tecnico ai vendor) e Procurement (che gestisce le relazioni con i vendor) e Sicurezza (che valuta i rischi dei vendor). Ogni dipartimento assume che gli altri stiano fornendo supervisione adeguata, creando opportunità per vendor malintenzionati di ottenere accesso eccessivo ai sistemi o installare software compromesso.

## CATALOGO SOLUZIONI

### 1. Matrice Autorità Sicurezza Persone Nominate
Creare un documento che elenca scenari di sicurezza specifici (richieste reset password, anomalie di rete, accesso vendor, ecc.) con individui nominati autorizzati a prendere decisioni entro timeframe definiti. Includere decision-maker di backup per ogni scenario. Questo elimina le risposte "controlla con qualcun altro" e crea chiare catene di responsabilità.
- **Implementazione**: Il team sicurezza redige la matrice, i dirigenti approvano, distribuiscono a tutto lo staff, aggiornano trimestralmente
- **ROI**: Riduce il tempo di risposta agli incidenti del 60-80%, previene l'escalation di problemi minori

### 2. Limiti Tempo Decisioni Sicurezza
Stabilire tempi di risposta massimi per diverse categorie di decisioni di sicurezza (immediato/30min/4ore/24ore) con escalation automatica a decision-maker di backup. Qualsiasi decisione di sicurezza che richiede più tempo del limite definito scala automaticamente al livello successivo con piena autorità di agire.
- **Implementazione**: Aggiornamento policy con enforcement sistema ticketing automatizzato, formazione manager sui trigger di escalation
- **ROI**: Previene paralisi dell'analisi, riduce la durata della finestra di violazione, migliora i tempi di risposta compliance

### 3. Rete Security Champions Cross-Level
Assegnare security champion a ogni livello organizzativo che si incontrano mensilmente per chiarire confini di responsabilità e condividere preoccupazioni di sicurezza attraverso i dipartimenti. I champion hanno autorità esplicita di coordinare risposte di sicurezza che attraversano i loro normali confini gerarchici.
- **Implementazione**: Selezionare champion da ogni livello/dipartimento, fornire formazione sicurezza base, stabilire calendario incontri regolari
- **ROI**: Riduce ritardi di comunicazione, aumenta il rilevamento precoce delle minacce, migliora la cultura della sicurezza

### 4. Scorecard Responsabilità Sicurezza Individuale
Creare metriche di sicurezza personali per ogni dipendente che non possono essere diffuse ad altri: tassi di applicazione patch per sistemi che controllano, completamento formazione, partecipazione reporting incidenti, conformità policy di sicurezza. Collegare a revisioni delle prestazioni e programmi di riconoscimento.
- **Implementazione**: Integrazione sistema HR, formazione manager sull'uso scorecard, revisioni trimestrali
- **ROI**: Aumenta l'engagement di sicurezza personale, riduce gli atteggiamenti "non è il mio lavoro", migliora le metriche complessive di sicurezza

### 5. Workflow Decisioni Sicurezza Automatizzati
Implementare soluzioni tecnologiche che gestiscono automaticamente decisioni di sicurezza di routine (come blocchi temporanei account, approvazioni accesso base, eccezioni policy standard) senza richiedere consultazione gerarchica. Riservare il processo decisionale umano per situazioni genuinamente complesse.
- **Implementazione**: Distribuzione piattaforma SOAR, definizione workflow, integrazione con strumenti sicurezza esistenti
- **ROI**: Riduce i colli di bottiglia decisionali del 70%, libera staff sicurezza per problemi complessi, migliora coerenza risposta

### 6. Struttura Comando Incidenti Sicurezza
Stabilire una chiara struttura di comando incidenti che temporaneamente bypassa la normale autorità gerarchica durante eventi di sicurezza. Il comandante incidenti ha piena autorità di prendere decisioni di sicurezza e dirigere risorse senza ritardi di approvazione gerarchica.
- **Implementazione**: Aggiornamento piano risposta incidenti, formazione autorità comando, configurazione sistema comunicazione
- **ROI**: Riduce durata e impatto incidenti, previene compromissioni secondarie, migliora conformità regolamentare

## CHECKLIST VERIFICA

### Implementazione Matrice Autorità
- **Richiedere**: Documento matrice autorità sicurezza corrente
- **Verificare**: Ogni scenario elenca nomi persone specifiche (non solo titoli), include decision-maker di backup, mostra aggiornamenti recenti
- **Bandiera Rossa**: Il documento elenca solo dipartimenti o titoli di lavoro, nessuna copertura backup, non è stato aggiornato da 6+ mesi

### Monitoraggio Tempo Decisioni
- **Richiedere**: Ultimi 10 incidenti di sicurezza mostrando timestamp decisioni
- **Verificare**: Tempo da rilevamento incidente ad autorizzazione azione, evidenza di escalation automatica quando i limiti sono superati
- **Bandiera Rossa**: Ritardi consistenti oltre i limiti di policy, nessun record di escalation, documentazione timestamp mancante

### Evidenza Coordinamento Cross-Level
- **Richiedere**: Note incontri security champions ultimi 6 mesi
- **Verificare**: Occorrenza regolare incontri, chiarimenti specifici di responsabilità documentati, action item con proprietari nominati
- **Bandiera Rossa**: Incontri irregolari, topic discussione vaghi, action item assegnati a dipartimenti piuttosto che a individui

### Implementazione Responsabilità Individuale
- **Richiedere**: Scorecard sicurezza campione per diversi livelli organizzativi
- **Verificare**: Le metriche sono specifiche per azioni individuali, collegate a sistemi prestazioni, aggiornate regolarmente
- **Bandiera Rossa**: Solo metriche livello dipartimento, nessuna integrazione prestazioni, dati obsoleti

### Distribuzione Decisioni Automatizzate
- **Richiedere**: Lista di decisioni di sicurezza ora gestite automaticamente
- **Verificare**: Documentazione workflow, integrazione con sistemi esistenti, procedure gestione eccezioni
- **Bandiera Rossa**: Ambito automazione molto limitato, frequenza override manuale sopra 20%, nessuna documentazione

### Autorità Comando Incidenti
- **Richiedere**: Log risposta incidenti recenti mostrando decisioni comando
- **Verificare**: Chiara attivazione autorità comando, decisioni prese senza ritardi gerarchici, ritorno autorità post-incidente
- **Bandiera Rossa**: Autorità comando mai attivata, consultazione gerarchica durante incidenti, transizione comando poco chiara

## METRICHE DI SUCCESSO

### Tempo Risposta Decisioni Sicurezza
**Misurazione Baseline**: Tempo medio da rilevamento problema sicurezza ad azione di risposta autorizzata attraverso tutte le categorie di incidenti
**Obiettivo**: 50% riduzione tempo medio risposta entro 90 giorni
**Monitoraggio**: Report settimanali tempi risposta incidenti con analisi trend e identificazione colli di bottiglia

### Tasso Engagement Sicurezza Individuale
**Misurazione Baseline**: Percentuale di dipendenti che riportano proattivamente preoccupazioni di sicurezza o intraprendono azioni di sicurezza preventive mensilmente
**Obiettivo**: 40% aumento comportamenti di sicurezza proattivi entro 90 giorni
**Monitoraggio**: Metriche engagement sicurezza mensili tracciando report, preoccupazioni inviate e azioni preventive intraprese

### Frequenza Coordinamento Sicurezza Cross-Gerarchico
**Misurazione Baseline**: Numero di chiarimenti responsabilità sicurezza documentati e collaborazioni sicurezza cross-dipartimentali per mese
**Obiettivo**: 200% aumento attività coordinamento sicurezza formale entro 90 giorni
**Monitoraggio**: Report attività coordinamento mensili mostrando chiarimenti responsabilità, iniziative congiunte e risoluzione conflitti autorità
