# 📋 INDICATOR 5.8 FIELD KIT: EFFETTI RESIDUI DELL'ATTENZIONE

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Domande di Valutazione Binaria** - Marcare Sì/No per ciascuna:

□ **Controllo Cambio Compito**: Le procedure scritte limitano gli analisti a <5 cambi di compito all'ora? _(Sì/No)_

□ **Protocolli di Transizione**: Le procedure di "reset mentale" obbligatorie (2-3 minuti) sono documentate tra i domini di sicurezza? _(Sì/No)_

□ **Completamento Investigazione**: >80% delle investigazioni di sicurezza vengono completate dall'analista originale? _(Sì/No)_

□ **Protezione Interruzioni**: Gli analisti sono protetti da allerta non critiche durante investigazioni complesse? _(Sì/No)_

□ **Documentazione Passaggio**: I cambi di turno includono procedure strutturate di trasferimento dello stato cognitivo? _(Sì/No)_

□ **Integrazione Strumenti**: Gli analisti usano <5 interfacce di sicurezza diverse durante periodi di punta oraria? _(Sì/No)_

□ **Blocchi Tempo Focus**: Periodi di analisi ininterrotta dedicati (>1 ora) sono pianificati quotidianamente? _(Sì/No)_

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti Richiesti
- [ ] **Procedure SOC** per cambio compito e flussi di lavoro analisti
- [ ] **Template passaggi di turno** degli ultimi 30 giorni
- [ ] **Report completamento investigazioni** che mostrano analisti originali vs trasferiti
- [ ] **Log accesso strumenti** che mostrano frequenza cambio applicazione
- [ ] **Policy interruzioni** che proteggono il tempo di focus analisti

### Richieste di Dimostrazione
- [ ] **"Mi mostri il flusso di lavoro analista di ieri"** - esempio specifico di cambi strumento
- [ ] **"Mi illustri il Suo processo di passaggio"** - procedura cambio turno effettiva
- [ ] **"Dimostri la gestione allerta urgenti"** - come vengono gestite le interruzioni
- [ ] **"Mi mostri il cambio strumento durante picchi allerta"** - osservazione flusso lavoro live

### Controlli di Sistema
- [ ] **Contare strumenti di sicurezza attivi** accessibili per analista all'ora
- [ ] **Rivedere log cambio applicazione** della settimana scorsa
- [ ] **Controllare stato casi investigazione** - tassi completamento per analista originale
- [ ] **Esaminare gestione coda allerta** durante periodi ad alto volume

### Obiettivi di Intervista
- [ ] **Manager SOC** - policy e procedure
- [ ] **Analisti Tier 1** (2-3) - realtà flusso lavoro quotidiano
- [ ] **Supervisori Turno** - pratiche gestione interruzioni
- [ ] **Analisti Senior** - esperienze passaggio investigazioni

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Formato Albero Decisionale

**INIZIARE QUI** ↓

**Domanda 1**: I tassi di completamento investigazioni sono >80%?
- **SÌ** → Andare a Domanda 2
- **NO** → **PUNTEGGIO ROSSO (2)**

**Domanda 2**: Gli analisti passano tra <5 attività all'ora?
- **SÌ** → Andare a Domanda 3
- **NO** → **PUNTEGGIO GIALLO (1)**

**Domanda 3**: I protocolli di transizione sono documentati E applicati?
- **SÌ** → **PUNTEGGIO VERDE (0)**
- **NO** → **PUNTEGGIO GIALLO (1)**

### Soglie di Riferimento Rapido
- **VERDE (0)**: <5 cambi/ora + >80% completamento + protocolli documentati
- **GIALLO (1)**: 5-10 cambi/ora + 60-79% completamento + procedure base
- **ROSSO (2)**: >10 cambi/ora + <60% completamento + nessun controllo

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA

| Soluzione | Costo | Tempo | Dipendenze |
|----------|------|------|--------------|
| **Protocollo Transizione** | Basso | 2 settimane | Nessuna |
| **Tracciamento Investigazioni** | Basso | 1 settimana | Sistema gestione casi |
| **Policy Interruzioni** | Basso | 1 settimana | Consenso management |

### MEDIO IMPATTO / TERMINE PIÙ LUNGO

| Soluzione | Costo | Tempo | Dipendenze |
|----------|------|------|--------------|
| **Sistema Raggruppamento Compiti** | Medio | 6 settimane | Riprogettazione flusso lavoro |
| **Finestre Focus Protette** | Medio | 4 settimane | Analisi personale |
| **Integrazione Strumenti** | Alto | 12 settimane | Coordinamento fornitori |

### ALTO IMPATTO / STRATEGICO

| Soluzione | Costo | Tempo | Dipendenze |
|----------|------|------|--------------|
| **Piattaforma di Sicurezza Unificata** | Alto | 6 mesi | Approvazione budget |
| **Monitoraggio Carico Cognitivo** | Alto | 8 settimane | Deployment tecnologia |
| **Dashboard Consapevolezza-Attenzione** | Alto | 12 settimane | Sviluppo personalizzato |

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Mi parli del Suo periodo di allerta di sicurezza più intenso della settimana scorsa..."**
- Follow-up: *"Quanti strumenti diversi hanno usato gli analisti durante quel periodo?"*
- Segnale d'allarme: Più di 8-10 strumenti menzionati

**"Mi illustri cosa succede quando allerta urgenti interrompono investigazioni in corso..."**
- Follow-up: *"Quanto spesso questo causa investigazioni da abbandonare?"*
- Segnale d'allarme: "Succede costantemente" o "La maggior parte delle investigazioni viene interrotta"

**"Come gestisce i cambi di turno durante incidenti di sicurezza attivi?"**
- Follow-up: *"Mi mostri la Sua documentazione passaggio di ieri..."*
- Segnale d'allarme: Nessun processo formale di passaggio o documentazione mancante

### Trigger Investigazione Più Approfondita
**Se sente:**
- "I nostri analisti sono grandi multitasker" → **Sondare per tassi completamento effettivi**
- "Gestiamo tutto in tempo reale" → **Chiedere metriche qualità investigazione**
- "Le interruzioni sono semplicemente parte del lavoro" → **Richiedere esempi specifici e dati impatto**
- "Usiamo i migliori strumenti disponibili" → **Contare strumenti e interfacce effettivi**

### Linguaggio Professionale per Argomenti Delicati
- Invece di: *"I Suoi analisti hanno problemi cognitivi"*
- Dica: *"Ottimizziamo l'efficienza del Suo flusso di lavoro e la qualità dell'investigazione"*

- Invece di: *"Sta mancando minacce a causa di problemi di attenzione"*
- Dica: *"Possiamo migliorare l'accuratezza del rilevamento riducendo l'overhead del cambio compito"*

---

## 📊 MODELLO NOTE DI CAMPO

### RIEPILOGO VALUTAZIONE
**Data**: _________ **Auditor**: _________ **Cliente**: _________

**Punteggio Valutazione Rapida**: ___/7 domande risposte "Sì"

**Qualità Evidenza**:
- [ ] Documentazione completa fornita
- [ ] Dimostrazioni live osservate
- [ ] Interviste multiple condotte
- [ ] Accesso sistema verificato

### GIUSTIFICAZIONE PUNTEGGIO
**Punteggio Finale**: VERDE (0) / GIALLO (1) / ROSSO (2)

**Evidenza Primaria**:
- Cambi compito all'ora: _____
- Tasso completamento investigazioni: _____%
- Procedure documentate: Presenti/Assenti
- Controlli interruzioni: Efficaci/Inefficaci

### RISULTATI CHIAVE
**Rischi Immediati**:
1. _________________________________
2. _________________________________
3. _________________________________

**Raccomandazioni Prioritarie**:
1. _________________________________
2. _________________________________
3. _________________________________

### PRONTEZZA CLIENTE
**Capacità Implementazione**: Alta/Media/Bassa
**Supporto Management**: Forte/Moderato/Debole
**Disponibilità Risorse**: Adeguata/Limitata/Vincolata

**Prossimi Passi**:
- [ ] Proposta soluzione dettagliata
- [ ] Design programma pilota
- [ ] Valutazione requisiti formazione
- [ ] Valutazione follow-up programmata

---

## 🎯 METRICHE DI SUCCESSO PER CLIENTE

### Obiettivi 90 Giorni
- **Ridurre** cambi compito a <5 all'ora per analista
- **Aumentare** tasso completamento investigazioni a >80%
- **Implementare** protocolli transizione obbligatori 3 minuti
- **Stabilire** blocchi focus protetti 2 ore quotidianamente

### Metodi di Misurazione
- **Tracciamento automatizzato** tramite log strumenti sicurezza
- **Sondaggi mensili** sul carico cognitivo analisti
- **Valutazione trimestrale** accuratezza rilevamento
- **Revisione semestrale** efficienza flusso lavoro

**Tempo Valutazione**: _____ minuti **Punteggio Totale**: _____ **Livello Priorità**: _____
