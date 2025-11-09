# CPF FIELD KIT 8.4: VALUTAZIONE DEL TRASFERIMENTO DI AUTORITÀ

## VALUTAZIONE RAPIDA (5 minuti)

**Spuntare SÌ/NO per ogni elemento:**

□ **SÌ/NO**: Esistono procedure scritte che richiedono la verifica dell'identità per TUTTE le richieste dei dirigenti (livello C, VP)

□ **SÌ/NO**: Le procedure di contatto del supporto IT vietano richieste dirette di password/accesso ai dipendenti

□ **SÌ/NO**: Le procedure di contatto regolatorio esterno richiedono passaggi di verifica obbligatori

□ **SÌ/NO**: Test di phishing basati sull'autorità condotti negli ultimi 6 mesi

□ **SÌ/NO**: I dipendenti possono mettere in discussione richieste di autorità senza timore di ritorsioni (policy documentata)

□ **SÌ/NO**: Tasso di conformità alla verifica >90% basato su test/audit recenti

□ **SÌ/NO**: Zero incidenti di frode CEO/impersonificazione di autorità riusciti negli ultimi 12 mesi

---

## RACCOLTA DELLE PROVE (10 minuti)

### Documenti da richiedere:
- [ ] **Procedure di verifica dell'autorità** (policy scritte)
- [ ] **Risultati dei test di ingegneria sociale** (ultimi 12 mesi)
- [ ] **Rapporti di incidenti** che coinvolgono figure di autorità/frode CEO
- [ ] **Policy di protezione dei dipendenti** riguardanti la messa in discussione dell'autorità
- [ ] **Protocolli di comunicazione di crisi**

### Dimostrazioni da richiedere:
- [ ] **"Mi mostri come verifica una richiesta email del CEO"** (procedura effettiva passo-passo)
- [ ] **"Mi dimostri la procedura di contatto del supporto IT"** (come devono rispondere i dipendenti)
- [ ] **"Mi guidi attraverso la verifica del contatto regolatorio"** (processo passo-passo)

### Verifiche di sistema:
- [ ] **Log del sistema di verifica** (se esiste un sistema automatizzato)
- [ ] **Impostazioni di autenticazione email** (SPF, DKIM, DMARC)
- [ ] **Tracciamento delle richieste di autorità** (flussi di approvazione)

### Obiettivi delle interviste:
- [ ] **Assistenti amministrativi** (alto rischio frode CEO)
- [ ] **Personale finanziario** (autorità bonifici bancari)
- [ ] **Help desk IT** (richieste di autorità tecniche)
- [ ] **Dipendenti casuali** (conformità generale all'autorità)

---

## PUNTEGGIO RAPIDO (2 minuti)

### Albero decisionale:

**INIZIO QUI** → Contare le risposte SÌ dalla valutazione rapida:

**6-7 risposte SÌ** → **VERDE (0)**
- Tutte le protezioni principali presenti
- Alta conformità dimostrata
- Nessun incidente recente

**4-5 risposte SÌ** → **GIALLO (1)**
- La maggior parte delle protezioni presenti
- Lacune di conformità moderate
- Incidenti minori possibili

**0-3 risposte SÌ** → **ROSSO (2)**
- Lacune di protezione importanti
- Conformità bassa/sconosciuta
- Alto rischio di incidenti

### Regole di verifica:
- **Mancanza di procedure scritte** = GIALLO automatico minimo
- **Nessun test condotto** = GIALLO automatico minimo
- **Attacco recente riuscito** = ROSSO automatico
- **Dipendenti timorosi di mettere in discussione l'autorità** = ROSSO automatico

---

## PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
- [ ] **Script di verifica dell'autorità** (Costo: Basso, Tempo: 2 settimane)
  - Risposte template per i dipendenti per verificare l'identità
  - Procedure chiare di escalation

- [ ] **Policy di protezione dei dipendenti** (Costo: Basso, Tempo: 1 settimana)
  - Diritto esplicito di verificare richieste di autorità
  - Garanzia di non ritorsione

### MEDIO IMPATTO / IMPLEMENTAZIONE MEDIA
- [ ] **Sistema automatizzato di verifica** (Costo: Medio, Tempo: 8 settimane)
  - Flusso di lavoro che richiede autenticazione doppia per richieste di autorità
  - Avvisi di sistema per richieste non verificate

- [ ] **Formazione sui bias di autorità** (Costo: Medio, Tempo: 4 settimane)
  - Moduli di micro-apprendimento sulla pressione dell'autorità
  - Scenari specifici per ruolo

### ALTO IMPATTO / IMPLEMENTAZIONE A LUNGO TERMINE
- [ ] **Piattaforma di autenticazione delle richieste** (Costo: Alto, Tempo: 16 settimane)
  - Verifica crittografica per comunicazioni di livello C
  - Firme digitali richieste

- [ ] **Protocolli di autorità in crisi** (Costo: Medio, Tempo: 12 settimane)
  - Team di risposta alla crisi pre-autorizzati
  - Canali di verifica fuori banda (out-of-band)

**Dipendenze:** La sicurezza email (SPF/DKIM) deve essere implementata prima della piattaforma di autenticazione

---

## CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di apertura:
**"Mi guidi attraverso cosa succede quando il Suo CEO invia un'email urgente richiedendo un bonifico bancario."**

**Sollecitazioni di follow-up:**
- "Quali passaggi di verifica sono richiesti?"
- "Qualcuno ha mai messo in discussione una tale richiesta?"
- "Cosa succederebbe se lo facessero?"

### Indicatori di bandiera rossa:
- [ ] **"Ci fidiamo dei nostri dirigenti"** (nessuna verifica menzionata)
- [ ] **"L'IT gestisce quello"** (procedure per i dipendenti poco chiare)
- [ ] **"Durante le emergenze, agiamo velocemente"** (protocolli bypassati)
- [ ] **"Le persone sanno di non mettere in discussione la leadership"** (cultura basata sulla paura)

### Linguaggio professionale per argomenti sensibili:
**Invece di:** "I Suoi dipendenti hanno vulnerabilità psicologiche"
**Dire:** "Stiamo valutando quanto bene funzionano le Sue procedure di verifica sotto pressione"

**Invece di:** "Il trasferimento di autorità è una debolezza psicologica"
**Dire:** "La ricerca del settore mostra che le richieste basate sull'autorità richiedono passaggi di verifica extra"

### Domande chiave di follow-up:
- **"Quando è stato il Suo ultimo test di phishing basato sull'autorità?"**
- **"Può mostrarmi un esempio recente di qualcuno che ha seguito le procedure di verifica?"**
- **"Quale formazione ricevono i dipendenti sulla verifica delle richieste di autorità?"**

---

## MODELLO DI NOTE SUL CAMPO

**Cliente:** _________________ **Data:** _________ **Auditor:** _____________

### Punteggio valutazione rapida: ___/7 risposte SÌ → **Valutazione colore: VERDE/GIALLO/ROSSO**

### Risultati critici:
□ **Non esistono procedure di verifica**
□ **Dipendenti timorosi di mettere in discussione l'autorità**
□ **Attacco recente basato sull'autorità riuscito**
□ **Nessun test/misurazione della conformità**

### Prove raccolte:
- [ ] Policy revisionate: ________________________________
- [ ] Dimostrazioni osservate: __________________________
- [ ] Sistemi verificati: ___________________________________
- [ ] Personale intervistato: _____________________________

### Raccomandazioni immediate:
1. **Priorità 1:** _________________________________________
2. **Priorità 2:** _________________________________________
3. **Priorità 3:** _________________________________________

### Feedback del cliente:
**Resistenza notata:** ____________________________________
**Tempistica di implementazione:** ______________________________
**Vincoli di budget:** ___________________________________

### Follow-up richiesto:
□ **Valutazione tecnica aggiuntiva necessaria**
□ **Supporto per lo sviluppo di policy richiesto**
□ **Progettazione di programma di formazione necessaria**
□ **Aggiornamento del piano di risposta agli incidenti richiesto**

**Durata della valutazione:** _______ minuti **Data prossima revisione:** _________
