# 📋 CPF INDICATOR 5.9 FIELD KIT
## ERRORI INDOTTI DA COMPLESSITÀ

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Marcare SÌ/NO per ciascuna condizione osservabile:**

□ **SÌ/NO**: La procedura primaria di risposta agli incidenti richiede >15 passaggi
□ **SÌ/NO**: Gli analisti SOC monitorano >7 sistemi di sicurezza simultaneamente
□ **SÌ/NO**: I team di sicurezza riportano di essere "sopraffatti" mensilmente o più frequentemente
□ **SÌ/NO**: Esistono workaround non ufficiali diffusi (osservati o riportati)
□ **SÌ/NO**: Le procedure di sicurezza vengono regolarmente abbandonate durante emergenze
□ **SÌ/NO**: L'autenticazione richiede >5 passaggi/sistemi distinti
□ **SÌ/NO**: Non esiste processo formale per valutare la complessità delle procedure

**Punteggio Rapido**: 0-2 SÌ = Verde | 3-5 SÌ = Giallo | 6-7 SÌ = Rosso

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti da Richiedere
- [ ] **Playbook di risposta agli incidenti** (procedura principale)
- [ ] **Report volume allerta SIEM** (ultimi 3 mesi)
- [ ] **Ticket help desk** relativi a confusione procedure di sicurezza
- [ ] **Feedback formazione** che menziona problemi di complessità
- [ ] **Verbali riunioni team di sicurezza** (ultimi 6 mesi)

### Dimostrazioni da Richiedere
- [ ] **"Mi mostri il Suo processo di risposta agli incidenti"** (illustrare i primi 10 passaggi)
- [ ] **"Mi mostri una tipica postazione analista SOC"** (contare i sistemi attivi)
- [ ] **"Mi illustri il Suo processo di autenticazione"** (cronometrare e contare i passaggi)

### Controlli di Sistema da Eseguire
- [ ] **Contare dashboard di sicurezza** che l'analista deve monitorare simultaneamente
- [ ] **Cronometrare processo autenticazione** per login utente standard
- [ ] **Contare punti decisionali** nella procedura primaria risposta incidenti
- [ ] **Controllare documentazione non ufficiale** (procedure semplificate, cheat sheet)

### Obiettivi di Intervista
- [ ] **Manager SOC**: Preoccupazioni complessità, consapevolezza workaround
- [ ] **2-3 Analisti SOC**: Esperienze quotidiane di sovraccarico, scorciatoie usate
- [ ] **Team Lead Sicurezza**: Storico modifiche procedure
- [ ] **Supervisore Help Desk**: Richieste supporto relative a complessità

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale

**INIZIO**: Contare totale risposte "SÌ" dalla Valutazione Rapida

**SE 0-2 risposte SÌ:**
- **VERDE (0)**: Procedure gestibili, nessun problema sistematico di complessità

**SE 3-5 risposte SÌ:**
- Controllare: >50% del personale sicurezza riporta sovraccarico occasionale?
  - **SÌ**: GIALLO (1) - Alcune preoccupazioni complessità
  - **NO**: VERDE (0) - Problemi minori

**SE 6-7 risposte SÌ:**
- **ROSSO (2)**: Vulnerabilità sistematica indotta da complessità

### Soglie Oggettive
- **Passaggi Risposta Incidenti**: >15 = Segnale d'allarme
- **Sistemi Simultanei**: >7 = Segnale d'allarme
- **Passaggi Autenticazione**: >5 = Segnale d'allarme
- **Report Sovraccarico**: Settimanale+ = Segnale d'allarme

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
- **Riduzione Progressiva Allerta** (Costo: Basso)
  - Ridurre allerta SIEM a <50 per analista per turno
  - Dipendenze: Accesso SIEM, capacità sintonizzazione regole

- **Carte Risposta Incidenti** (Costo: Basso)
  - Carte singola pagina per i 5 tipi incidenti principali
  - Dipendenze: Analisi procedure, tempo design

### MEDIO IMPATTO / IMPLEMENTAZIONE MEDIA
- **Semplificazione Autenticazione** (Costo: Medio)
  - Autenticazione adattiva basata sul rischio
  - Dipendenze: Aggiornamento sistema autenticazione

- **Consolidamento Strumenti Sicurezza** (Costo: Medio)
  - Dashboard unificate, rimozione funzioni sovrapposte
  - Dipendenze: Inventario strumenti, pianificazione integrazione

### ALTO IMPATTO / LUNGO TERMINE
- **Monitoraggio Carico Cognitivo** (Costo: Alto)
  - Analytics esperienza utente su strumenti sicurezza
  - Dipendenze: Piattaforma analytics, monitoraggio continuo

- **Formazione Complessità Team** (Costo: Medio)
  - Riconoscimento e gestione sovraccarico cognitivo
  - Dipendenze: Sviluppo formazione, allocazione tempo

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura Chiave
1. **"Mi illustri cosa succede quando riceve un'allerta di sicurezza durante un periodo intenso."**
2. **"Con quale frequenza i Suoi team di sicurezza Le dicono che le procedure sono troppo complesse?"**
3. **"Quali scorciatoie usa il Suo team che non sono nelle procedure ufficiali?"**

### Prompt di Follow-Up per Risposte Incomplete
- **Se dicono "raramente" alle preoccupazioni complessità**: *"Può mostrarmi i Suoi ticket help desk relativi a confusione sulla sicurezza?"*
- **Se negano l'esistenza di workaround**: *"Come semplificano tipicamente le procedure i nuovi dipendenti durante la formazione?"*
- **Se affermano che le procedure sono semplici**: *"Può cronometrare quanto tempo impiega la Sua risposta agli incidenti dall'inizio alla fine?"*

### Indicatori Segnale d'Allarme che Richiedono Investigazione Più Approfondita
- **Risposte difensive** sulla complessità delle procedure
- **Incapacità di dimostrare** procedure chiave di sicurezza
- **Frustrazione visibile** quando si discute di strumenti di sicurezza
- **Menzioni frequenti** di "lo facevamo diversamente prima"
- **Più persone** che menzionano gli stessi workaround

### Linguaggio Professionale per Argomenti Delicati
- **Invece di**: "Le Sue procedure sono troppo complesse"
- **Dica**: "Stiamo valutando opportunità di ottimizzazione per l'efficienza della sicurezza"

- **Invece di**: "Il Suo team sta facendo errori"
- **Dica**: "Stiamo valutando l'allineamento tra procedure e realtà operativa"

---

## 📊 MODELLO NOTE DI CAMPO

### Riepilogo Valutazione
**Data**: _____________ **Auditor**: _____________
**Organizzazione**: _____________ **Dipartimento**: _____________

### Risultati Valutazione Rapida
**Totale risposte SÌ**: ___/7
**Punteggio Preliminare**: Verde / Giallo / Rosso

### Risultati Chiave
**Procedura Più Complessa**: _________________________________
**Fonte Primaria Sovraccarico**: _______________________________
**Workaround Più Comune**: ________________________________

### Evidenze Raccolte
□ Documentazione risposta incidenti
□ Dati volume allerta
□ Ticket complessità help desk
□ Osservazione postazione SOC
□ Note interviste team

### Raccomandazioni Immediate
1. **Priorità 1**: ___________________________________________
2. **Priorità 2**: ___________________________________________
3. **Priorità 3**: ___________________________________________

### Follow-Up Richiesto
□ Dimostrazioni sistema aggiuntive necessarie
□ Più tempo intervista con ________________
□ Revisione documenti in sospeso: ________________
□ Valutazione tecnica richiesta: ___________

### Feedback Cliente
**Recettività ai risultati**: Alta / Media / Bassa
**Volontà implementazione**: Alta / Media / Bassa
**Vincoli budget menzionati**: Sì / No
**Preferenze tempistiche**: Immediato / 90 giorni / Anno prossimo

---

## 🔍 CONTROLLI RAPIDI DI VERIFICA

**Prima di concludere la valutazione:**
- [ ] Confermato conteggio passaggi per procedura risposta incidenti principale
- [ ] Osservata configurazione effettiva postazione analista SOC
- [ ] Raccolti esempi specifici di preoccupazioni complessità
- [ ] Identificato almeno un workaround non ufficiale
- [ ] Documentata evidenza a supporto del punteggio assegnato

**Controllo Qualità:**
- [ ] Il punteggio si allinea con l'evidenza raccolta
- [ ] Le raccomandazioni corrispondono alle fonti di complessità identificate
- [ ] Il cliente comprende i risultati e la motivazione
- [ ] Tutta la documentazione richiesta ottenuta o annotata come non disponibile
