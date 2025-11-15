# 📋 CPF INDICATORE 5.5 FIELD KIT: Vulnerabilità da Cambio di Contesto

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Istruzioni:** Marcare SÌ/NO per ciascuna domanda basandosi su osservazione diretta o revisione della documentazione.

| # | Domanda di Valutazione | SÌ | NO |
|---|---------------------|-----|----|
| 1 | Gli analisti di sicurezza usano 7+ strumenti diversi durante un singolo turno? | ☐ | ☐ |
| 2 | Ci sono 3+ dashboard separate senza integrazione per il monitoraggio di sicurezza? | ☐ | ☐ |
| 3 | I passaggi di turno richiedono briefing verbali a causa della mancanza di documentazione integrata? | ☐ | ☐ |
| 4 | Gli incidenti multi-dominio richiedono il passaggio tra 4+ strumenti/sistemi separati? | ☐ | ☐ |
| 5 | L'escalation coinvolge 4+ canali di comunicazione o processi di approvazione separati? | ☐ | ☐ |
| 6 | Gli analisti devono visualizzare più schermi/monitor per ottenere il quadro completo della sicurezza? | ☐ | ☐ |
| 7 | I report di conformità richiedono l'accesso a 3+ sistemi separati? | ☐ | ☐ |

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti da Richiedere
- [ ] **Log passaggi di turno SOC** (ultimi 30 giorni)
- [ ] **Elenco inventario strumenti di sicurezza** con frequenza di utilizzo
- [ ] **Diagrammi flusso di lavoro risposta incidenti**
- [ ] **Screenshot postazione analista** durante monitoraggio attivo
- [ ] **Post-mortem incidenti di sicurezza recenti** (identificare pattern cambio strumento)

### Dimostrazioni di Sistema
- [ ] **"Mi mostri la configurazione postazione analista"** - contare finestre/dashboard attive
- [ ] **"Mi illustri l'ultima investigazione di allerta di sicurezza"** - tracciare cambi di strumento
- [ ] **"Dimostri il processo di passaggio di turno"** - osservare lacune documentali
- [ ] **"Mi mostri la procedura di escalation"** - contare cambi di sistema/processo

### Obiettivi di Intervista
- [ ] **Manager SOC** - strategia strumenti complessiva e flusso di lavoro analisti
- [ ] **Analista di Sicurezza Senior** - sfide operative quotidiane
- [ ] **Team Lead Risposta Incidenti** - gestione incidenti multi-dominio
- [ ] **Operazioni IT** - stato integrazione strumenti e limitazioni

### Controlli di Sistema
- [ ] **Contare strumenti di monitoraggio sicurezza attivi** nell'ambiente
- [ ] **Verificare stato integrazione SIEM** con altri strumenti di sicurezza
- [ ] **Controllare esistenza documentazione passaggio automatizzata**
- [ ] **Rivedere sforzi di consolidamento dashboard**

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale

**Iniziare Qui:** Contare il totale delle risposte "SÌ" dalla Valutazione Rapida

**0-2 risposte SÌ** → **VERDE (0 punti)**
- Operazioni integrate con cambio di contesto minimo

**3-5 risposte SÌ** → **GIALLO (1 punto)**
- Frammentazione moderata che richiede attenzione

**6-7 risposte SÌ** → **ROSSO (2 punti)**
- Alta frammentazione che crea vulnerabilità significativa

### Checkpoint di Verifica
- [ ] Se segnato ROSSO: Confermare che 7+ strumenti sono attivamente usati (non solo installati)
- [ ] Se segnato VERDE: Verificare che l'integrazione riduca effettivamente il cambio (non solo dichiarazioni)
- [ ] Se l'escalation coinvolge 4+ passaggi: ROSSO automatico indipendentemente da altri fattori

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### Alto Impatto / Implementazione Rapida
- [ ] **Dashboard di Sicurezza Unificata** (30-45 giorni, Costo medio)
  - *Consolidare 3+ dashboard separate in viste basate sui ruoli*
- [ ] **Protocolli Passaggio di Turno** (15-30 giorni, Costo basso)
  - *Documentazione digitale passaggio standardizzata*

### Alto Impatto / Implementazione Lungo Termine
- [ ] **Consolidamento SIEM** (30-60 giorni, Costo alto)
  - *Aggregare allerta da tutti gli strumenti in interfaccia singola*
- [ ] **Implementazione SOAR** (60-90 giorni, Costo alto)
  - *Automatizzare compiti di cambio contesto di routine*

### Medio Impatto / Implementazione Rapida
- [ ] **Programma Formazione Incrociata** (45-60 giorni, Costo medio)
  - *Ridurre carico cognitivo tramite competenza di dominio*
- [ ] **Configurazione Monitor** (15-30 giorni, Costo basso)
  - *Ottimizzare spazio di lavoro fisico per preservazione contesto*

### Dipendenze
- **SIEM prima di SOAR** - Piattaforma di integrazione necessaria per prima
- **Design dashboard richiede** completamento inventario strumenti
- **Formazione incrociata necessita** documentazione flusso di lavoro corrente

---

## 💬 SCRIPT CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Quanti strumenti di sicurezza diversi usa il Suo analista tipico durante un turno di 8 ore?"**
- *Follow-up: "Può mostrarmi una postazione durante il monitoraggio attivo?"*

**"Quando ha avuto il Suo ultimo incidente di sicurezza, quali strumenti doveva usare l'analista?"**
- *Follow-up: "In quale sequenza? Ci sono stati ritardi nel passaggio tra di essi?"*

**"Come gestisce i cambi di turno quando ci sono attività di sicurezza in corso?"**
- *Follow-up: "Può mostrarmi la documentazione del passaggio di ieri?"*

### Indicatori Segnale d'Allarme che Richiedono Investigazione Più Approfondita
- [ ] **Passaggi solo verbali** - Nessun processo documentato
- [ ] **Risposte "Ci siamo abituati"** - Disfunzione normalizzata
- [ ] **Più schermi richiesti** - Mancanza di integrazione
- [ ] **Escalation "Dipende"** - Nessun processo standardizzato
- [ ] **Ritardi cambio strumento** - Inefficienza riconosciuta

### Linguaggio Professionale di Follow-up
- *"Mi aiuti a comprendere i Suoi sforzi attuali di integrazione..."*
- *"Quali sfide ha sperimentato con il consolidamento degli strumenti?"*
- *"Come misura l'efficacia degli analisti tra diversi sistemi?"*
- *"Come sarebbe l'integrazione ideale per il Suo team?"*

---

## 📊 MODELLO NOTE DI CAMPO

### Riepilogo Valutazione
**Data:** _________ **Valutatore:** _________ **Organizzazione:** _________

**Punteggio Valutazione Rapida:** ___/7 **Valutazione Finale:** Verde / Giallo / Rosso

### Ambiente Strumenti
**Strumenti di Sicurezza Principali in Uso:**
1. ___________________ 4. ___________________
2. ___________________ 5. ___________________
3. ___________________ 6. ___________________

**Conteggio Dashboard:** _____ **Livello Integrazione:** Nessuno / Parziale / Completo

### Osservazioni Critiche
**Problema Massima Priorità:** _________________________________

**Rischio Immediato:** _____________________________________

**Opportunità Vittoria Rapida:** _______________________________

### Raccomandazioni
**Raccomandazione Primaria:** _______________________________
- **Tempistiche:** _______ **Costo:** Basso/Medio/Alto **Impatto:** Basso/Medio/Alto

**Raccomandazione Secondaria:** _____________________________
- **Tempistiche:** _______ **Costo:** Basso/Medio/Alto **Impatto:** Basso/Medio/Alto

### Follow-up Richiesto
- [ ] **Valutazione tecnica** necessaria per fattibilità SIEM/SOAR
- [ ] **Analisi flusso di lavoro** richiesta per design dashboard
- [ ] **Valutazione esigenze formazione** per competenza cross-dominio
- [ ] **Processo approvazione budget** per consolidamento strumenti

---

## ✅ CHECKLIST DI COMPLETAMENTO

Valutazione Completata Quando:
- [ ] Tutte le 7 domande valutazione rapida risposte
- [ ] Almeno 3 elementi evidenza raccolti
- [ ] Punteggio assegnato usando albero decisionale
- [ ] Raccomandazione primaria identificata
- [ ] Conversazione con cliente documentata
- [ ] Template note di campo completato

**Tempo Totale:** _______ minuti (Obiettivo: <25 minuti)
