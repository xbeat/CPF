# 📋 CPF INDICATORE 4.1 FIELD KIT
## Paralisi Decisionale Basata sulla Paura

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Verifichi SÌ/NO per ciascun indicatore:**

□ **SÌ** / □ **NO** - L'organizzazione ha limiti di tempo documentati per decisioni di sicurezza critiche (patch, incidenti)

□ **SÌ** / □ **NO** - Esiste una matrice di autorità decisionale chiara specificando chi può approvare differenti azioni di sicurezza

□ **SÌ** / □ **NO** - Esistono procedure di bypass di emergenza per situazioni fuori orario/crisi

□ **SÌ** / □ **NO** - I playbook di risposta agli incidenti includono azioni pre-autorizzate (nessuna approvazione aggiuntiva necessaria)

□ **SÌ** / □ **NO** - Il team di sicurezza può mostrare evidenza di decisioni prese entro 72 ore per patch critiche

□ **SÌ** / □ **NO** - Meno del 15% delle decisioni di sicurezza di routine richiede escalation oltre l'autorità designata

□ **SÌ** / □ **NO** - Lo staff può chiaramente articolare la propria autorità di decision-making di sicurezza senza esitazione

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti da Richiedere:
- [ ] **Playbook di risposta agli incidenti** (ultimi 3 usati)
- [ ] **Matrice di autorità decisionale** o documento ruoli di sicurezza
- [ ] **Log di gestione patch** (ultimi 6 mesi)
- [ ] **Ticket di incidenti di sicurezza** (ultimi 3 mesi - dati di temporizzazione)
- [ ] **Procedure di contatto/escalation di emergenza**

### Dimostrazioni da Richiedere:
- [ ] **"Mi mostri la Sua ultima decisione di patch critica"** - percorrere timeline effettiva
- [ ] **"Chi chiamerebbe per un incidente di sicurezza alle 2 AM?"** - testare conoscenza autorità
- [ ] **"Mi percorra il Suo alert di sicurezza più recente"** - processo decisionale

### Controlli di Sistema:
- [ ] **Timeline di deployment patch** nel sistema di ticketing
- [ ] **Timestamp di risposta agli incidenti** in SIEM/logging
- [ ] **Workflow di approvazione** nel sistema di gestione cambiamenti

### Obiettivi di Intervista:
- [ ] **Responsabile team sicurezza** (comprensione autorità decisionale)
- [ ] **Manager IT** (pattern di escalation)
- [ ] **Staff help desk** (procedure fuori orario)
- [ ] **1-2 dipendenti generali** (confidenza decisioni sicurezza)

---

## 🎯 SCORING RAPIDO (2 minuti)

### Albero Decisionale:

**INIZIO:** Conti risposte SÌ dalla Valutazione Rapida

**7 risposte SÌ** → **VERDE (0)**
- E patch critiche deployate <72 ore
- E incidenti contenuti <1 ora

**5-6 risposte SÌ** → **GIALLO (1)**
- O patch critiche prendono 3-7 giorni
- O incidenti prendono 1-4 ore per contenere

**<5 risposte SÌ** → **ROSSO (2)**
- O patch critiche prendono >7 giorni
- O incidenti prendono >4 ore per contenere
- O nessuna procedura di emergenza esiste

### Condizioni di Override:
- **ROSSO Automatico** se: Nessun limite di tempo documentato esiste
- **ROSSO Automatico** se: Lo staff non può articolare autorità decisionale
- **ROSSO Automatico** se: >3 decisioni di sicurezza ritardate >1 settimana negli ultimi 6 mesi

---

## 🔧 PRIORITÀ SOLUZIONI (5 minuti)

### ALTO Impatto / Implementazione Rapida:
- **Matrice Autorità Decisionale** (Costo: Basso, Tempo: 1 settimana)
  - Documentare chi decide cosa, quando, con soglie in euro
- **Schede di Contatto di Emergenza** (Costo: Basso, Tempo: 2 giorni)
  - Informazioni di contatto decisore 24/7 per tutto lo staff
- **Standard Time-Box** (Costo: Basso, Tempo: 1 settimana)
  - Tempi decisionali massimi: Critico=24h, Alto=3 giorni, Medio=1 settimana

### MEDIO Impatto / Implementazione Moderata:
- **Playbook Pre-Autorizzati** (Costo: Medio, Tempo: 4-6 settimane)
  - Risposta agli incidenti con approvazioni integrate
- **Protocollo Bypass Escalation** (Costo: Basso, Tempo: 2-3 settimane)
  - Procedure di emergenza con revisione post-incidente
- **Training Simulazione Decisionale** (Costo: Medio, Tempo: Continuativo)
  - Scenari mensili focalizzando su velocità decisionale

### BASSO Impatto / Implementazione a Lungo Termine:
- **Supporto Decisionale Automatizzato** (Costo: Alto, Tempo: 3-6 mesi)
  - Integrazione sistemi per approvazioni più veloci
- **Programma Cambio Culturale** (Costo: Alto, Tempo: 6-12 mesi)
  - Costruzione confidenza decisionale a livello organizzativo
- **Analytics Avanzato** (Costo: Alto, Tempo: 3-4 mesi)
  - Tracking temporizzazione decisioni ed esiti

---

## 💬 CONVERSAZIONE CLIENTE (3 minuti)

### Domande di Apertura:
- **"Mi percorra la Sua ultima patch di sicurezza critica - da identificazione a deployment."**
- **"Chi ha autorità di spegnere un server durante una violazione sospetta?"**
- **"Cosa succede quando il Suo team di sicurezza è in disaccordo sulla risposta a una minaccia?"**

### Prompt di Follow-up:
- **Se ritardi menzionati:** "Cosa ha causato il ritardo - problemi tecnici o processo di approvazione?"
- **Se autorità non chiara:** "Chi farebbe quella decisione se [persona] non fosse disponibile?"
- **Se escalation frequente:** "Quanto spesso decisioni di sicurezza vanno a [livello senior]?"

### Indicatori di Bandiera Rossa:
- **Multiple firme di approvazione** richieste per azioni di routine
- **"Sbagliamo sempre per eccesso di cautela"** (linguaggio paralisi dell'analisi)
- **"Meglio sicuri che dispiaciuti"** riguardo decisioni di sicurezza
- **Staff che esprime paura** di fare scelte di sicurezza sbagliate
- **Ritardi incolpati sulla "dovuta diligenza"** senza vincoli di tempo

### Linguaggio Professionale per Argomenti Sensibili:
- **Invece di "paralisi":** "opportunità di ottimizzazione decisionale"
- **Invece di "basato sulla paura":** "aree di costruzione della confidenza"
- **Invece di "ritardi":** "miglioramenti di efficienza del processo"

---

## 📊 TEMPLATE NOTE SUL CAMPO

**Cliente:** _________________________ **Data:** ___________ **Auditor:** _____________

### Punteggio Valutazione Rapida: ___/7 risposte SÌ

### Risultati Chiave:
- **Autorità Decisionale:** Chiara □ Non chiara □ Mancante □
- **Limiti di Tempo:** Documentati □ Informali □ Nessuno □
- **Procedure di Emergenza:** Testate □ Documentate □ Mancanti □

### Evidenze Raccolte:
□ Playbook revisionati  □ Matrice autorità ottenuta  □ Dati temporizzazione analizzati
□ Staff intervistato   □ Sistemi controllati          □ Pattern escalation documentati

### Ritardi Critici Identificati:
1. ________________________________________________
2. ________________________________________________
3. ________________________________________________

### Raccomandazioni Immediate:
- **Priorità 1:** _________________________________
- **Priorità 2:** _________________________________
- **Priorità 3:** _________________________________

### Follow-up Richiesto:
□ Interviste aggiuntive  □ Analisi log di sistema  □ Revisione documentazione policy
□ Briefing esecutivo     □ Deep-dive tecnico   □ Valutazione culturale

### Punteggio Finale: **VERDE** □ **GIALLO** □ **ROSSO** □

**Livello di Confidenza:** Alto □ Medio □ Basso □ (basato su qualità evidenza)

---

## 🚀 CHECKLIST DI DEPLOYMENT RAPIDO

**Prima della Visita sul Sito:**
- [ ] Rivedere organigramma cliente per decisori
- [ ] Preparare template raccolta evidenze
- [ ] Pianificare interviste con ruoli chiave
- [ ] Configurare condivisione file sicura per documenti

**Durante Valutazione:**
- [ ] Iniziare con Valutazione Rapida (costruisce rapport)
- [ ] Richiedere evidenza presto (tempo di elaborazione)
- [ ] Prendere note di temporizzazione dettagliate
- [ ] Documentare citazioni esatte su confusione autorità

**Dopo Valutazione:**
- [ ] Fare scoring immediatamente mentre fresco
- [ ] Identificare top 3 soluzioni
- [ ] Preparare sommario esecutivo
- [ ] Pianificare follow-up se necessario

**Tempo Totale Valutazione: 22 minuti**
