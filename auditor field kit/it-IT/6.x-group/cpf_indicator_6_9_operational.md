## INDICATORE 6.9: Scissione Organizzativa

### CONTESTO

La scissione organizzativa si verifica quando le organizzazioni dividono inconsciamente le minacce di sicurezza in categorie eccessivamente semplificate di "interno fidato" contro "esterno pericoloso". Questo pensiero binario crea pericolosi punti ciechi fidandosi eccessivamente di insider e sistemi mentre proiettando tutto il rischio su attaccanti esterni. Le organizzazioni che sperimentano scissione mostrano fiducia estrema in certi attori (dipendenti di lungo termine, fornitori, esecutivi) mentre attribuiscono fallimenti di sicurezza esclusivamente a minacce esterne sofisticate, rendendole vulnerabili ad attacchi insider e ingegneria sociale.

### VALUTAZIONE

**Domanda 1 - Processo Attribuzione Incidenti**
Quando la Sua organizzazione sperimenta un incidente o violazione di sicurezza, qual è il Suo processo standard per determinare la causa radice? Ci parli di un incidente recente specifico e come l'investigazione è conclusa.

**Domanda 2 - Monitoraggio Minaccia Insider**
Quanto spesso la Sua organizzazione monitora attivamente le attività di utenti privilegiati (amministratori, esecutivi, dipendenti di lungo termine) per potenziali rischi di sicurezza? Quali strumenti o processi specifici di monitoraggio sono in atto per il personale interno?

**Domanda 3 - Eccezioni Politiche di Sicurezza**
Qual è la Sua procedura quando esecutivi senior, dipendenti di lungo termine o fornitori fidati richiedono eccezioni alle politiche di sicurezza standard? Ci dia un esempio recente di tale richiesta e come è stata gestita.

**Domanda 4 - Processo Decisionale Controllo Accessi**
Come determina la Sua organizzazione i livelli di accesso per diverse categorie di personale (esecutivi, personale IT, dipendenti regolari, contractor, fornitori)? Ci parli del Suo processo specifico e di eventuali differenze nei requisiti di sicurezza tra questi gruppi.

**Domanda 5 - Bilanciamento Allocazione Risorse**
Quale percentuale del Suo budget di sicurezza è allocata al rilevamento minacce esterne (firewall, sicurezza perimetrale) rispetto al monitoraggio minacce interne (analitiche comportamento utente, rilevamento minacce insider)? Fornisca suddivisioni di budget specifiche.

**Domanda 6 - Valutazione Sicurezza Fornitori**
Quanto frequentemente la Sua organizzazione rivaluta le pratiche di sicurezza di fornitori o partner fidati di lungo termine? Ci dia un esempio di quando ha cambiato per ultima volta i requisiti di sicurezza per una relazione fornitore stabilita.

**Domanda 7 - Implementazione Zero Trust**
In che misura la Sua organizzazione ha implementato principi di sicurezza zero trust (verificare ogni utente e dispositivo, indipendentemente da ubicazione o livello di fiducia percepito)? Ci dica specificamente quali sistemi o personale sono esenti da requisiti di verifica e perché.

### PUNTEGGIO

**Verde (0): Valutazione Fiducia Bilanciata**
- Tutti gli incidenti di sicurezza subiscono investigazione completa includendo fattori interni
- Sistemi di monitoraggio attivi monitorano tutte le attività di utenti privilegiati indipendentemente da ruolo o anzianità
- Le politiche di sicurezza si applicano uniformemente con eccezioni documentate e limitate richiedenti approvazione formale
- Controlli di accesso e requisiti di verifica simili per tutte le categorie di personale
- Allocazione budget di sicurezza bilanciata (minimo 30% focalizzato su rilevamento minacce insider)
- Rivalutazioni di sicurezza regolari di tutti i fornitori inclusi partner fidati
- Implementazione zero trust completa con eccezioni minime

**Giallo (1): Indicatori Scissione Moderata**
- Maggior parte degli incidenti investigati accuratamente ma qualche attribuzione esterna automatica
- Monitoraggio utenti privilegiati esistente ma con lacune per certe categorie "fidate"
- Eccezioni politiche di sicurezza concesse regolarmente ma con qualche processo di supervisione
- Standard di sicurezza diversi esistono per diversi livelli di personale con razionale documentata
- Allocazione budget mostra preferenza per sicurezza perimetrale ma qualche investimento in minacce insider
- Valutazioni fornitori si verificano ma meno frequentemente per relazioni stabilite
- Implementazione zero trust parziale con eccezioni per certi sistemi o ruoli

**Rosso (2): Alta Vulnerabilità da Scissione**
- Incidenti di sicurezza costantemente attribuiti ad attaccanti esterni senza investigazione interna
- Monitoraggio minimo o assente di utenti privilegiati, specialmente esecutivi o dipendenti di lungo termine
- Eccezioni frequenti alle politiche di sicurezza per personale "fidato" con supervisione minima
- Standard di sicurezza significativamente diversi basati su livelli di fiducia percepiti
- Budget di sicurezza fortemente focalizzato su minacce esterne (meno del 20% su rilevamento minacce insider)
- Relazioni fornitore stabilite raramente rivalutate per sicurezza
- Principi zero trust rifiutati o implementati con eccezioni importanti per entità "fidate"

### SCENARI DI RISCHIO

**Furto Dati Insider Fidato**
Dipendenti con status idealizzato (esecutivi, personale di lungo termine, personale IT privilegiato) sfruttano la loro posizione fidata per esfiltrate dati sensibili per periodi estesi. Il monitoraggio minimo delle loro attività abilita escalation di privilegi graduale e furto dati che non viene rilevato finché non si verificano danni significativi, come visto in casi come Edward Snowden.

**Ingegneria Sociale via Trasferimento Fiducia**
Gli attaccanti sfruttano la tendenza alla scissione dell'organizzazione posizionandosi come "fidati" attraverso impersonificazione di figure di autorità, fornitori stabiliti o personale interno. Una volta categorizzati come fidati, bypassano normale scrutinio di sicurezza e ottengono accesso a sistemi sensibili, simile alla violazione Target dove credenziali fornitore fidato hanno abilitato infiltrazione rete.

**Infiltrazione Supply Chain**
Organizzazioni con forti modelli di scissione non riescono a scrutinare adeguatamente relazioni fornitore fidate, abilitando attacchi sofisticati alla supply chain. Gli attaccanti compromettono partner o fornitori software fidati per ottenere accesso all'organizzazione target, sfruttando il punto cieco "partner fidato" come dimostrato nell'attacco SolarWinds.

**Sfruttamento Movimento Laterale**
Una volta dentro il perimetro di rete, gli attaccanti sfruttano le assunzioni di fiducia implicita dell'organizzazione per muoversi lateralmente attraverso i sistemi. Ambienti ad alta scissione presumono che il traffico di rete interno sia fidato, abilitando ricognizione estensiva e accesso dati prima che si verifichi il rilevamento.

### CATALOGO SOLUZIONI

**Implementazione Analitiche Comportamentali**
Implementare sistemi di analitiche comportamentali utente e entità (UEBA) che monitorano tutte le attività del personale indipendentemente da ruolo o anzianità. Implementare modellazione comportamento baseline per utenti privilegiati, rilevamento anomalie automatizzato per modelli di accesso inusuali e scoring del rischio per tutti gli attori interni. Stabilire procedure di escalation chiare per anomalie comportamentali.

**Implementazione Architettura Zero Trust**
Implementare principi zero trust completi richiedenti verifica per tutti gli utenti e dispositivi indipendentemente da livello di fiducia percepito. Implementare autenticazione multi-fattore per tutti gli accessi a sistemi, micro-segmentazione di risorse di rete e autenticazione continua per operazioni sensibili. Eliminare eccezioni a politiche di sicurezza basate su ruolo o anzianità.

**Sviluppo Programma Minacce Insider**
Stabilire programma formale minacce insider con personale e risorse dedicati. Implementare valutazione psicologica per posizioni ad alto rischio, formazione regolare di consapevolezza sicurezza focalizzata su rischi insider, meccanismi di segnalazione tra pari per comportamenti preoccupanti e processi di investigazione strutturati per incidenti interni.

**Miglioramento Processo Risposta Incidenti**
Rivedere procedure di risposta agli incidenti per imporre investigazione completa di tutti gli eventi di sicurezza includendo fattori interni. Implementare analisi causa radice strutturata richiedente esame sia di vettori di attacco esterni che vulnerabilità interne. Stabilire processi di revisione incidenti indipendenti per prevenire bias di attribuzione.

**Standardizzazione Matrice Controllo Accessi**
Sviluppare matrici di controllo accessi standardizzate applicando requisiti di sicurezza consistenti attraverso tutte le categorie di personale. Implementare revisioni accessi regolari per tutti gli account privilegiati, processi di provisioning e deprovisioning automatizzati e requisiti di giustificazione documentati per eventuali eccezioni di accesso. Stabilire controlli di accesso basati su ruolo con principio di minimo privilegio.

**Programma Gestione Rischio Fornitori**
Creare programma completo di gestione rischio fornitori con valutazioni di sicurezza regolari di tutti i partner indipendentemente da durata relazione. Implementare monitoraggio continuo di posture di sicurezza fornitori, requisiti di sicurezza contrattuali per tutti i fornitori e procedure di coordinamento risposta incidenti. Stabilire controlli di accesso fornitori con permessi limitati nel tempo.

### CHECKLIST DI VERIFICA

**Per Analitiche Comportamentali:**
- Richiedere documentazione di implementazione e configurazione sistema UEBA
- Revisionare baseline comportamentali campione e rapporti rilevamento anomalie
- Osservare dashboard di monitoraggio e processi di gestione avvisi
- Verificare inclusione di tutti gli utenti privilegiati nell'ambito di monitoraggio
- Verificare procedure di risposta agli incidenti per anomalie comportamentali

**Per Implementazione Zero Trust:**
- Revisionare diagrammi architettura di rete mostrando micro-segmentazione
- Testare requisiti autenticazione multi-fattore attraverso diversi sistemi
- Verificare meccanismi di autenticazione continua per operazioni sensibili
- Documentare eventuali eccezioni di accesso basate su fiducia rimanenti e giustificazioni
- Osservare flussi di autenticazione per diverse categorie di utenti

**Per Programma Minacce Insider:**
- Revisionare statuto programma e assegnazioni personale dedicato
- Esaminare metodologie di valutazione rischio minacce insider
- Revisionare materiali di formazione e registri di consegna per consapevolezza minacce insider
- Verificare meccanismi di segnalazione e procedure di investigazione
- Verificare integrazione con processi HR e risposta incidenti di sicurezza

**Per Risposta Incidenti Migliorata:**
- Revisionare playbook di risposta agli incidenti per requisiti di investigazione
- Esaminare rapporti incidenti recenti per analisi fattori interni
- Verificare processi di revisione indipendente e assegnazioni personale
- Verificare template di analisi causa radice e requisiti di completamento
- Revisionare modelli di attribuzione incidenti negli ultimi 12 mesi

**Per Standardizzazione Controllo Accessi:**
- Revisionare matrici di controllo accessi e workflow di approvazione
- Esaminare procedure di revisione accessi e registri di completamento
- Verificare configurazione sistema di provisioning/deprovisioning automatizzato
- Verificare requisiti di documentazione per eccezioni di accesso
- Testare implementazione minimo privilegio attraverso diversi ruoli

**Per Gestione Rischio Fornitori:**
- Revisionare programmi di valutazione rischio fornitori e registri di completamento
- Esaminare clausole requisiti di sicurezza in contratti fornitori
- Verificare meccanismi di controllo accessi e monitoraggio fornitori
- Verificare procedure di coordinamento risposta incidenti fornitori
- Revisionare processi di monitoraggio postura di sicurezza fornitori

### METRICHE DI SUCCESSO

**Tasso Rilevamento Minacce Insider**
Misurare la percentuale di incidenti di sicurezza interni rilevati attraverso monitoraggio proattivo rispetto a scoperta reattiva. Obiettivo miglioramento da baseline all'80% di rilevamento proattivo entro 90 giorni. Monitorare mensilmente e assegnare responsabilità al team operazioni di sicurezza.

**Frequenza Eccezioni Politiche**
Monitorare il numero di eccezioni a politiche di sicurezza concesse mensilmente, categorizzate per tipo di richiedente e giustificazione. Obiettivo riduzione 50% in eccezioni basate su fiducia entro 90 giorni. Monitorare settimanalmente e assegnare responsabilità al team conformità.

**Bilanciamento Attribuzione Incidenti**
Misurare la percentuale di incidenti di sicurezza con analisi completa di fattori interni rispetto ad attribuzione solo-esterna. Obiettivo 100% di analisi completa entro 60 giorni. Monitorare per incidente e assegnare responsabilità al team di risposta agli incidenti.
