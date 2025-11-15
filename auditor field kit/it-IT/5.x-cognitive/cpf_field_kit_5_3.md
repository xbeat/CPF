# 📋 CPF INDICATORE 5.3 FIELD KIT: Paralisi da Sovraccarico Informativo

*Tempo di Valutazione: 22 minuti | Nessuna competenza psicologica richiesta*

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Marcare SÌ/NO per ciascun indicatore osservabile:**

□ **SÌ/NO**: Il SOC elabora più di 50 allerta di sicurezza per analista all'ora durante le operazioni normali
□ **SÌ/NO**: Gli analisti devono controllare 7 o più strumenti/dashboard di sicurezza separati durante l'investigazione degli incidenti
□ **SÌ/NO**: Le decisioni di sicurezza di routine vengono regolarmente escalate al management a causa della complessità
□ **SÌ/NO**: I tempi di risposta peggiorano in modo misurabile (>30%) durante periodi di allerta elevate o incidenti importanti
□ **SÌ/NO**: I briefing di sicurezza per l'executive contengono dati tecnici grezzi piuttosto che riepiloghi filtrati
□ **SÌ/NO**: Le informazioni vengono perse o sono incomplete durante i passaggi di turno nelle operazioni di sicurezza
□ **SÌ/NO**: Il team di sicurezza riporta "affaticamento da allerta" o richiede di ridurre il volume informativo

**Punteggio Rapido**: 0-2 SÌ = Verde | 3-4 SÌ = Giallo | 5-7 SÌ = Rosso

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti da Richiedere
- [ ] **Report volume allerta SIEM** (ultimi 3 mesi)
- [ ] **Metriche produttività analisti SOC** per turno
- [ ] **Log tempi di risposta agli incidenti** (periodi normali vs crisi)
- [ ] **Inventario strumenti di sicurezza** con requisiti di accesso
- [ ] **Template passaggi di turno** con esempi recenti
- [ ] **Campioni di briefing di sicurezza executive** dell'ultimo trimestre

### Dimostrazioni da Richiedere
- [ ] **"Mi mostri come un analista investiga un'email sospetta"** (contare gli strumenti usati)
- [ ] **"Mi illustri il Suo processo di triage delle allerta"** (tempo e passaggi)
- [ ] **"Dimostri la procedura di passaggio di turno"** (informazioni trasferite)
- [ ] **"Mi mostri la dashboard di sicurezza executive"** (livello di complessità)

### Controlli di Sistema da Eseguire
- [ ] **Contare login separati** richiesti per l'investigazione di sicurezza
- [ ] **Cronometrare tempo allerta-valutazione iniziale** durante l'osservazione
- [ ] **Controllare regole di correlazione allerta SIEM** (presenti/assenti)
- [ ] **Verificare filtraggio informazioni** nelle dashboard di management

### Obiettivi di Intervista
- [ ] **Analista SOC (Livello 1)**: Volume allerta giornaliero e punti di stress
- [ ] **Manager SOC**: Prestazioni durante periodi di alto carico
- [ ] **CISO/Direttore Sicurezza**: Qualità delle informazioni per il processo decisionale
- [ ] **Operazioni IT**: Complessità integrazione tra strumenti di sicurezza

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale

**INIZIARE QUI**: Contare il totale degli strumenti di sicurezza che richiedono accesso separato per l'investigazione degli incidenti

**Se 3 o meno strumenti** → Controllare volume allerta per analista all'ora:
- **<20 allerta/ora** → **VERDE** (procedere a verificare le procedure di passaggio)
- **20-50 allerta/ora** → **GIALLO** (controllare degradazione prestazioni)
- **>50 allerta/ora** → **ROSSO**

**Se 4-6 strumenti** → Controllare tasso di escalation decisioni di routine:
- **<25% escalate** → **GIALLO** (verificare meccanismi di filtraggio)
- **>25% escalate** → **ROSSO**

**Se 7+ strumenti** → **ROSSO** (alta vulnerabilità automatica)

### Controlli di Verifica
- **Conferma VERDE**: Passaggi strutturati + report executive filtrati
- **Conferma GIALLO**: Qualche degradazione prestazioni durante crisi
- **Conferma ROSSO**: Uno qualsiasi tra - lamentele analisti, perdita informazioni, sovraccarico executive

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA (0-30 giorni)
- **Regole di Correlazione Allerta** (Costo: Basso, Complessità: Media)
  - Ridurre il volume di allerta del 60-80% tramite sintonizzazione SIEM
  - Dipendenze: Tempo admin SIEM, stabilimento baseline
- **Semplificazione Dashboard Executive** (Costo: Basso, Complessità: Bassa)
  - Sistema di briefing a tre livelli: Riepilogo/Dettagli/Approfondimento
  - Dipendenze: Consenso management, creazione template

### MEDIO IMPATTO / MEDIO TERMINE (1-6 mesi)
- **Dashboard di Sicurezza Unificata** (Costo: Medio, Complessità: Alta)
  - Consolidare 5+ strumenti in interfaccia singola
  - Dipendenze: Integrazione strumenti, possibili cambi fornitore
- **Framework Decisionali Strutturati** (Costo: Basso, Complessità: Media)
  - Alberi decisionali per scenari comuni
  - Dipendenze: Documentazione processi, tempo formazione

### ALTO IMPATTO / LUNGO TERMINE (6+ mesi)
- **Prioritizzazione Intelligente Allerta** (Costo: Alto, Complessità: Alta)
  - Prioritizzazione minacce basata su machine learning (apprendimento automatico)
  - Dipendenze: Capacità data science, approvvigionamento strumenti
- **Programma Formazione Carico Cognitivo** (Costo: Medio, Complessità: Media)
  - Chunking informativo e gestione attenzione
  - Dipendenze: Budget formazione, competenza esterna

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Mi illustri cosa succede quando il Suo SOC viene colpito da una grande tempesta di allerta."**
- *Ascoltare per*: Risposte di panico, allerta mancate, stress analisti
- *Follow-up*: "Quanto tempo impiega tipicamente per tornare alle operazioni normali?"

**"Quando è stata l'ultima volta che una decisione di sicurezza è stata escalata quando probabilmente non avrebbe dovuto esserlo?"**
- *Ascoltare per*: Complessità informativa, problemi di fiducia analisti
- *Follow-up*: "Cosa ha reso quella decisione troppo complessa per l'analista da gestire?"

### Sonde Segnale d'Allarme
**Se menzionano "affaticamento da allerta":**
- "Quale percentuale delle Sue allerta si rivelano falsi positivi?"
- "Come decidono gli analisti quali allerta investigare per prime?"

**Se riportano problemi di prestazioni durante incidenti:**
- "Traccia le differenze nei tempi di risposta tra periodi normali e di crisi?"
- "Quali informazioni necessitano gli executive durante una crisi di sicurezza?"

### Punti di Sensibilità Professionale
- **Evitare**: "I Suoi analisti sembrano sopraffatti" (giudicante)
- **Usare**: "Come supporta gli analisti durante periodi ad alto volume?" (supportivo)
- **Evitare**: "Questo sistema è chiaramente rotto" (critico)
- **Usare**: "Quali miglioramenti ha considerato per la gestione delle allerta?" (collaborativo)

---

## 📊 MODELLO NOTE DI CAMPO

### Riepilogo Valutazione
**Data**: _________ **Auditor**: _________ **Cliente**: _________

### Risultati Punteggio Rapido
- [ ] Verde (0-2 indicatori)
- [ ] Giallo (3-4 indicatori)
- [ ] Rosso (5-7 indicatori)

### Risultati Chiave
**Volume Allerta**: _____ allerta/ora/analista (normale) | _____ allerta/ora/analista (picco)
**Conteggio Strumenti**: _____ strumenti separati per investigazione incidenti
**Tasso Escalation**: _____% di decisioni di routine escalate
**Impatto Prestazioni**: _____% degradazione durante periodi di crisi

### Evidenze Raccolte
- [ ] Report SIEM ottenuti
- [ ] Inventario strumenti confermato
- [ ] Procedure passaggio osservate
- [ ] Briefing executive revisionati

### Lacune Critiche Identificate
1. ________________________________________________
2. ________________________________________________
3. ________________________________________________

### Raccomandazioni Immediate (Pronte per il Cliente)
1. **Alta Priorità**: ________________________________
2. **Media Priorità**: _____________________________
3. **Bassa Priorità**: ________________________________

### Follow-up Richiesto
- [ ] Revisione tecnica aggiuntiva necessaria
- [ ] Intervista management richiesta
- [ ] Dimostrazione strumento incompleta
- [ ] Dati metriche insufficienti

### Valutazione Prontezza Cliente
- [ ] **Pronto per azione immediata** (problema chiaro, leadership disponibile)
- [ ] **Necessita consenso executive** (team tecnico pronto, leadership esitante)
- [ ] **Richiede cambio culturale** (resistente a modifiche processi)
- [ ] **Vincolato da budget** (comprende problema, mancano risorse)

---

**Field Kit Completato** | Tempo Totale Valutazione: ≤22 minuti
