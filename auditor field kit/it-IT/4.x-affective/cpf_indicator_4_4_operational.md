# INDICATORE CPF 4.4: ATTACCAMENTO AI SISTEMI LEGACY

## CONTESTO

Le organizzazioni sviluppano legami emozionali con i sistemi legacy (legacy systems) che si estendono oltre l'utilità funzionale, creando resistenza psicologica agli aggiornamenti e alle sostituzioni di sicurezza. Questo attaccamento (attachment) si manifesta quando i team trattano i sistemi obsoleti come "troppo importanti per cambiare" nonostante vulnerabilità (vulnerabilities) conosciute, portando a finestre di attacco estese e aumentato rischio di violazione. L'attaccamento ai sistemi legacy crea punti ciechi dove i team di sicurezza evitano di implementare controlli su sistemi "fidati", mentre gli attori delle minacce prendono specificamente di mira questi asset obsoleti e sotto-protetti.

## VALUTAZIONE

**Domanda 1**: Quanti sistemi nel vostro ambiente IT stanno attualmente funzionando oltre il ciclo di vita del supporto di sicurezza ufficiale del vendor (vendor)? Fornisca esempi specifici dei vostri sistemi più vecchi ancora in produzione.

**Domanda 2**: Qual è la vostra timeline standard per sostituire i sistemi quando i vendors (vendors) terminano il supporto di sicurezza? Ci guidi attraverso il vostro progetto di sostituzione del sistema più recente e quanto tempo ha richiesto dalla decisione al deployment (deployment).

**Domanda 3**: Con quale frequenza i sistemi legacy ricevono esenzioni dalle vostre policy (policies) di sicurezza standard (programmi di patching (patching), requisiti di monitoraggio, controlli di accesso)? Ci fornisca un esempio recente in cui ha fatto tale esenzione e perché.

**Domanda 4**: Cosa succede quando il vostro team di sicurezza propone cambiamenti o sostituzioni per sistemi legacy critici? Descriva la tipica risposta organizzativa e il processo decisionale.

**Domanda 5**: Come gestisce le situazioni in cui solo una o due persone comprendono come mantenere un sistema legacy? Ci racconti di un sistema specifico in cui ha questo rischio di concentrazione della conoscenza.

**Domanda 6**: Quale percentuale del vostro budget (budget) IT va attualmente verso il mantenimento dei sistemi legacy rispetto all'investimento nelle sostituzioni? Fornisca esempi di recenti decisioni di budget tra mantenimento legacy e acquisizione di nuovi sistemi.

**Domanda 7**: Quando sperimenta incidenti di sicurezza o vulnerabilità sui sistemi legacy, come risponde tipicamente la sua organizzazione? Ci fornisca un esempio di un recente problema di sicurezza del sistema legacy e come è stato risolto.

## PUNTEGGIO

**Verde (0)**: L'organizzazione ha gestione del ciclo di vita documentata con trigger (triggers) automatici di sostituzione quando termina il supporto del vendor. Nessun sistema funziona oltre il ciclo di vita del supporto di sicurezza per più di 6 mesi. I sistemi legacy seguono le stesse policy di sicurezza dei sistemi moderni. Più membri del personale addestrati su ogni sistema critico.

**Giallo (1)**: Alcuni sistemi funzionano oltre il supporto del vendor ma con controlli compensativi e accettazione del rischio documentata. Esenzioni occasionali dalle policy di sicurezza con processo di approvazione formale. Timeline per le sostituzioni tipicamente 12-18 mesi dalla decisione. Qualche concentrazione della conoscenza ma pianificazione della successione in atto.

**Rosso (2)**: Più sistemi che funzionano anni oltre il supporto di sicurezza del vendor. Esenzioni regolari dalle policy di sicurezza senza valutazione formale del rischio. Forte resistenza organizzativa ai cambiamenti del sistema legacy. Sistemi critici dipendenti da singoli individui. Nessuna timeline o processo di sostituzione definito.

## SCENARI DI RISCHIO

**Scenario 1 - Sfruttamento Legacy Mirato**: Gli attaccanti scansionano e prendono specificamente di mira vulnerabilità conosciute in sistemi legacy non supportati, usandoli come punti di compromissione iniziali. Le organizzazioni ritardano il patching a causa di preoccupazioni per la "stabilità del sistema", fornendo finestre di attacco estese. Esempio: Il ransomware (ransomware) WannaCry (WannaCry) del 2017 ha preso specificamente di mira sistemi Windows XP (Windows XP) che le organizzazioni hanno mantenuto operativi oltre la fine del supporto di Microsoft (Microsoft).

**Scenario 2 - Attacchi di Impersonificazione del Vendor**: Gli attori delle minacce impersonano vendors di sistemi legacy o contractor (contractors) di supporto, sfruttando le relazioni di fiducia e dipendenza che le organizzazioni hanno con questi sistemi. I team bypassano (bypass) la normale verifica di sicurezza a causa dell'attaccamento alle relazioni familiari con i vendor. Questo abilita attacchi di social engineering (social engineering) e accesso malevolo al sistema.

**Scenario 3 - Movimento Laterale di Rete**: I sistemi legacy spesso ricevono esenzioni dalla segmentazione di rete e dal monitoraggio, creando percorsi per il movimento laterale dopo la compromissione iniziale. Gli attaccanti usano sistemi legacy fidati per muoversi attraverso le reti senza essere rilevati, sapendo che i team di sicurezza monitorano questi sistemi meno rigorosamente.

**Scenario 4 - Sfruttamento della Finestra di Manutenzione**: Gli attaccanti temporizzano gli attacchi durante finestre di manutenzione estese quando i sistemi legacy vengono messi offline per aggiornamenti, sapendo che la resistenza guidata dall'attaccamento crea periodi di manutenzione infrequenti e lunghi. Le organizzazioni possono ripristinare da backups (backups) obsoleti o saltare aggiornamenti di sicurezza per minimizzare la "interruzione" ai sistemi amati.

## CATALOGO DELLE SOLUZIONI

**Soluzione 1 - Sistema di Tracciamento del Ciclo di Vita Automatizzato**: Implementare strumenti di gestione degli asset (asset management) che segnalano automaticamente i sistemi che si avvicinano alle date di fine supporto con trigger obbligatori di pianificazione della sostituzione. Il sistema genera report che mostrano lo stato del supporto di sicurezza, forza la pianificazione del budget per le sostituzioni 18 mesi prima della fine del supporto ed escala al livello esecutivo quando i sistemi funzionano oltre il ciclo di vita del supporto.

**Soluzione 2 - Isolamento di Sicurezza del Sistema Legacy**: Distribuire micro-segmentazione di rete e monitoraggio migliorato specificamente per i sistemi legacy che non possono essere immediatamente sostituiti. Implementare livelli di autenticazione aggiuntivi, restringere l'accesso di rete solo alle comunicazioni essenziali e distribuire monitoraggio specializzato che compensa i limiti del sistema. Creare un "wrapper (wrapper) di sicurezza" attorno ai sistemi legacy.

**Soluzione 3 - Programma di Documentazione del Trasferimento della Conoscenza**: Stabilire requisiti di documentazione obbligatoria e cross-training (cross-training) per tutti i sistemi legacy. Creare runbooks (runbooks) dettagliati, richiedere almeno tre membri del personale addestrati su ogni sistema critico e implementare test regolari di verifica della conoscenza. Includere la documentazione del sistema legacy nella pianificazione della continuità aziendale.

**Soluzione 4 - Processo di Pianificazione della Sostituzione Graduale**: Sviluppare metodologia di sostituzione graduale che tratta le transizioni di sistema come progetti di gestione del cambiamento piuttosto che eventi di cutover (cutover) tecnici. Includere pianificazione del coinvolgimento degli stakeholders (stakeholders), operazioni di sistema parallele durante le transizioni e tracciamento delle metriche di successo che dimostrano i benefici della sostituzione mentre si onorano i contributi del sistema legacy.

**Soluzione 5 - Dashboard (Dashboard) di Rischio Esecutivo**: Creare reporting (reporting) a livello esecutivo che traduce i rischi del sistema legacy in termini di impatto aziendale. Il dashboard mostra la potenziale esposizione finanziaria, i rischi di conformità regolatoria e le minacce alla continuità aziendale dalle dipendenze del sistema legacy. Include confronto con i concorrenti che mostra come le dipendenze legacy influenzano la competitività del mercato.

**Soluzione 6 - Framework (Framework) dei Controlli Compensativi**: Per i sistemi legacy che non possono essere immediatamente sostituiti, implementare controlli compensativi standardizzati includendo procedure di backup (backup) migliorate, segmenti di rete isolati, logging (logging) di accesso aggiuntivo e procedure di risposta agli incidenti specifiche per compromissioni del sistema legacy. Documentare l'accettazione del rischio con chiara responsabilità.

## CHECKLIST DI VERIFICA

**Verifica della Gestione degli Asset**:
- Richiedere l'inventario degli asset corrente che mostra tutti i sistemi e lo stato del ciclo di vita del supporto
- Rivedere i documenti di pianificazione della sostituzione e le timeline
- Esaminare le allocazioni del budget per il mantenimento legacy vs la sostituzione
- Verificare alerts automatizzati o sistemi di tracciamento per la gestione del ciclo di vita del supporto

**Verifica della Conformità delle Policy**:
- Rivedere i logs di esenzione delle policy di sicurezza e i processi di approvazione
- Fare audit (audit) delle valutazioni di sicurezza recenti sui sistemi legacy
- Esaminare la segmentazione di rete e i controlli di accesso per i sistemi legacy
- Verificare la copertura del monitoraggio e le procedure di risposta agli incidenti per i sistemi legacy

**Verifica della Gestione della Conoscenza**:
- Richiedere documentazione per i sistemi legacy critici
- Verificare i registri di cross-training e le procedure di trasferimento della conoscenza
- Verificare i piani di continuità aziendale per le dipendenze del sistema legacy
- Intervistare più membri del personale riguardo alle operazioni del sistema legacy

**Verifica della Gestione del Rischio**:
- Rivedere i registri del rischio per i rischi del sistema legacy e le strategie di mitigazione
- Esaminare la storia della risposta agli incidenti per eventi di sicurezza del sistema legacy
- Verificare i sistemi di reporting esecutivo e dashboard per la visibilità del rischio del sistema legacy
- Verificare l'implementazione dei controlli compensativi e i test di efficacia

## METRICHE DI SUCCESSO

**Tasso di Riduzione del Sistema Legacy**: Misurare la riduzione percentuale dei sistemi che funzionano oltre il ciclo di vita del supporto di sicurezza del vendor. Target (Target): Riduzione del 50% entro 12 mesi, eliminazione dei sistemi più di 2 anni oltre il supporto entro 24 mesi. Tracciare mensilmente e riportare trimestralmente alla leadership (leadership) esecutiva.

**Frequenza delle Eccezioni di Sicurezza**: Monitorare il numero di esenzioni delle policy di sicurezza concesse ai sistemi legacy e la durata media dell'esenzione. Target: Riduzione del 25% nelle esenzioni entro 6 mesi, durata massima di 90 giorni per qualsiasi esenzione di sicurezza con giustificazione richiesta per il rinnovo.

**Punteggio di Rischio della Concentrazione della Conoscenza**: Calcolare la percentuale di sistemi critici dipendenti da singoli individui per le operazioni. Target: Zero dipendenze da una singola persona entro 18 mesi, minimo tre membri del personale qualificati per sistema critico, verificato attraverso test di competenza trimestrali e revisioni della documentazione.
