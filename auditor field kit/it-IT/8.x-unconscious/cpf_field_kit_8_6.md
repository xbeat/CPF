# CPF INDICATORE 8.6 FIELD KIT: INTERFERENZA DEI MECCANISMI DI DIFESA

## VALUTAZIONE RAPIDA (5 minuti)

**Valutazione Binaria - Segnare Sì/No per ciascuna voce:**

□ **SÌ/NO**: L'80%+ degli alert di sicurezza viene gestito entro 30 giorni?
□ **SÌ/NO**: La remediation delle valutazioni esterne avviene secondo le tempistiche concordate?
□ **SÌ/NO**: Il budget per la sicurezza è rimasto stabile negli ultimi 2 cicli di bilancio?
□ **SÌ/NO**: Le segnalazioni di sicurezza dei dipendenti ricevono un'indagine formale entro 48 ore?
□ **SÌ/NO**: Le analisi post-incidente identificano miglioramenti interni (non solo colpe esterne)?
□ **SÌ/NO**: L'organizzazione ha implementato modifiche dopo incidenti di sicurezza presso organizzazioni simili?
□ **SÌ/NO**: I requisiti di sicurezza sono integrati nelle operazioni (non bypassati per efficienza)?

**Punteggio Rapido**: 6-7 Sì = VERDE | 4-5 Sì = GIALLO | 0-3 Sì = ROSSO

---

## RACCOLTA DELLE EVIDENZE (10 minuti)

### Documenti da Richiedere
- [ ] Ultimi 6 mesi di log degli alert di sicurezza con stato di risoluzione
- [ ] Valutazione di sicurezza esterna più recente + piano di remediation
- [ ] Documenti di allocazione del budget degli ultimi 2 anni (voci relative alla sicurezza)
- [ ] Log delle segnalazioni di incidenti di sicurezza dei dipendenti
- [ ] Ultimi 3 report di analisi post-incidente
- [ ] Documenti delle policy di sicurezza vs. evidenza dell'implementazione effettiva

### Dimostrazioni da Richiedere
- [ ] "Mi mostri il Suo sistema di tracciamento degli alert di sicurezza"
- [ ] "Mi illustri il Suo ultimo processo di risposta agli incidenti"
- [ ] "Mi dimostri come i dipendenti segnalano le problematiche di sicurezza"
- [ ] "Mi mostri il processo di approvazione del budget per gli investimenti in sicurezza"

### Controlli di Sistema da Eseguire
- [ ] Rivedere il sistema di gestione degli alert per backlog/invecchiamento
- [ ] Verificare il sistema di ticketing per elementi relativi alla sicurezza
- [ ] Esaminare le dashboard di monitoraggio per i tempi di risposta
- [ ] Verificare i processi di escalation automatizzata

### Target delle Interviste
- [ ] **Security Manager**: Elaborazione degli alert, risultati esterni, sfide di budget
- [ ] **IT Operations**: Conflitti quotidiani tra sicurezza ed efficienza
- [ ] **Finance/Responsabile Budget**: Decisioni sugli investimenti in sicurezza
- [ ] **HR/Personale Generale**: Cultura e esperienza delle segnalazioni di sicurezza

---

## PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale

**Inizio**: Controllare il tempo di risposta agli alert di sicurezza
- **Se 80%+ alert risolti <30 giorni** → Continuare a Valutazione Esterna
- **Se <80% alert risolti <30 giorni** → GIALLO minimo

**Controllo Valutazione Esterna**:
- **Se i risultati esterni sono stati affrontati nei tempi** → Continuare a Budget
- **Se i risultati esterni sono ritardati/contestati** → ROSSO probabile

**Controllo Stabilità Budget**:
- **Se il budget sicurezza è protetto durante i tagli** → Continuare a Cultura
- **Se il budget sicurezza è regolarmente ridotto** → ROSSO probabile

**Controllo Cultura/Risposta**:
- **Se l'analisi degli incidenti si concentra su miglioramenti interni** → VERDE probabile
- **Se l'analisi degli incidenti incolpa fattori esterni** → GIALLO/ROSSO

**Determinazione Finale**:
- **VERDE**: 6-7 criteri soddisfatti, cultura di sicurezza proattiva
- **GIALLO**: 4-5 criteri soddisfatti, risposte incoerenti
- **ROSSO**: 0-3 criteri soddisfatti, pattern difensivi sistematici

---

## PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO - RISULTATI RAPIDI (30-90 giorni)
- **SLA Risposta alle Minacce** | Costo: BASSO | Complessità: BASSA
  - Requisito obbligatorio di valutazione degli alert entro 72 ore
  - Escalation automatizzata per ritardi
- **Sistema di Segnalazione Dipendenti** | Costo: BASSO | Complessità: MEDIA
  - SLA di risposta di 48 ore per le segnalazioni di sicurezza dei dipendenti
  - Implementazione di feedback loop

### MEDIO IMPATTO - MEDIO TERMINE (3-6 mesi)
- **Protocollo di Validazione Esterna** | Costo: MEDIO | Complessità: MEDIA
  - Revisioni di sicurezza indipendenti trimestrali
  - Budget di emergenza per sicurezza pre-allocato
- **Standard di Analisi degli Incidenti** | Costo: BASSO | Complessità: MEDIA
  - Template strutturati che richiedono documentazione di fattori interni/esterni
  - Processo di peer review per i report degli incidenti

### ALTO IMPATTO - LUNGO TERMINE (6-12 mesi)
- **Integrazione Sicurezza-Operazioni** | Costo: ALTO | Complessità: ALTA
  - Team di sicurezza cross-funzionali in tutti i progetti
  - Implementazione di processi security-by-design
- **Monitoraggio Incidenti tra Pari** | Costo: MEDIO | Complessità: ALTA
  - Sistema di monitoraggio degli incidenti del settore
  - Valutazioni obbligatorie di applicabilità

---

## SCRIPT PER LA CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Mi illustri cosa accade quando riceve un alert di minaccia alla sicurezza."**
- *Follow-up*: "Quanto tempo occorre tipicamente per agire su questi alert?"
- *Segnale di Allarme*: Tempistiche vaghe, "li esaminiamo" senza azione

**"Mi parli della Sua ultima valutazione di sicurezza esterna."**
- *Follow-up*: "Come ha dato priorità e affrontato i risultati emersi?"
- *Segnale di Allarme*: Risultati contestati, remediation ritardata, vincoli di budget

**"Come gestisce l'organizzazione gli incidenti di sicurezza?"**
- *Follow-up*: "Cosa ha imparato dal Suo ultimo incidente?"
- *Segnale di Allarme*: Colpa agli attaccanti/fornitori, nessun miglioramento interno

### Sollecitazioni per Indagini Approfondite
**Se emergono pattern difensivi:**
- "Può mostrarmi esempi di recenti miglioramenti di sicurezza?"
- "Come bilancia la sicurezza con l'efficienza operativa?"
- "Cosa accade quando la sicurezza è in conflitto con le scadenze aziendali?"

### Linguaggio Professionale per Argomenti Delicati
- **Invece di**: "La Sua organizzazione è in negazione"
- **Dire**: "Sto osservando alcune lacune tra le intenzioni di sicurezza e l'implementazione"

- **Invece di**: "State proiettando la colpa"
- **Dire**: "Esploriamo i fattori interni che potrebbero rafforzare la Sua postura di sicurezza"

---

## TEMPLATE NOTE SUL CAMPO

**Cliente**: _________________ **Data**: _________ **Auditor**: _________________

### Prestazioni di Risposta agli Alert
- Volume alert (mensile): _____
- Tempo medio di risposta: _____
- Età del backlog: _____ giorni
- Trigger di escalation: ⚪ Presenti ⚪ Assenti

### Gestione Valutazioni Esterne
- Data ultima valutazione: _____
- Numero risultati: _____ Critici: _____ Alti: _____
- Tempistica di remediation: _____ % Completamento puntuale: _____%
- Allocazione budget: ⚪ Adeguata ⚪ Insufficiente ⚪ Contestata

### Indicatori Cultura di Sicurezza
- Segnalazioni dipendenti: _____ report/mese
- Tempo di risposta: _____ ore in media
- Profondità indagine: ⚪ Formale ⚪ Informale ⚪ Nessuna

### Pattern di Analisi Incidenti
- Focus ultimi 3 incidenti: ⚪ Fattori interni ⚪ Colpa esterna ⚪ Misto
- Miglioramenti di processo implementati: _____ (conteggio)
- Tempistica al miglioramento: _____ giorni in media

### Livello di Rischio Complessivo
⚪ **VERDE** - Approccio proattivo e realistico alla sicurezza
⚪ **GIALLO** - Risposte di sicurezza incoerenti
⚪ **ROSSO** - Pattern difensivi sistematici presenti

### Raccomandazioni Immediate
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Follow-up Richiesto
⚪ Revisione documentazione budget
⚪ Intervista team sicurezza
⚪ Osservazione processi
⚪ Dimostrazione tecnologia

---

**Valutazione Completata** | **Tempo Totale**: _____ minuti | **Prossimi Passi**: _________________
