# 📋 CPF INDICATORE 7.5 FIELD KIT: PARALISI DA RISPOSTA DI CONGELAMENTO

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Verifichi SÌ/NO per ciascun indicatore osservabile:**

□ **SÌ/NO**: Il tempo medio di risposta agli incidenti supera le 2 ore per incidenti di sicurezza urgenti
□ **SÌ/NO**: Le decisioni di sicurezza sono ritardate quando i decision-maker primari non sono disponibili
□ **SÌ/NO**: Il team fatica a processare gli alert quando il volume aumenta 3x i livelli normali
□ **SÌ/NO**: Incidenti complessi (3+ tipi di attacco) richiedono oltre 8 ore per determinare la strategia di risposta
□ **SÌ/NO**: Multipli conflitti di autorità si verificano durante gli incidenti di sicurezza senza un chiaro processo di risoluzione
□ **SÌ/NO**: Non esiste tracking formale per tempo di decisione vs. tempo di azione durante gli incidenti
□ **SÌ/NO**: Meno del 70% degli incidenti che soddisfano i criteri di escalation vengono escalati entro le tempistiche definite

**Punteggio**: Conteggio risposte SÌ = ___/7

---

## 📝 RACCOLTA DELLE PROVE (10 minuti)

### Documenti da Richiedere
□ **Procedure di risposta agli incidenti** che mostrano le tempistiche decisionali
□ **Matrici di delega dell'autorità** e assegnazioni di backup
□ **Ultimi 10 report di incidenti di sicurezza** con timestamp
□ **Configurazioni del sistema di gestione degli alert**
□ **Registri di formazione** per scenari di stress/decision-making
□ **Report di tracking dell'escalation** degli ultimi 6 mesi

### Dimostrazioni da Richiedere
□ **"Mi mostri la Sua dashboard di risposta agli incidenti"** - osservare il tracking delle decisioni
□ **"Mi illustri il Suo ultimo incidente di sicurezza complesso"** - identificare punti di ritardo
□ **"Mi dimostri il backup dell'autorità durante le ore fuori ufficio"** - testare il sistema di delega
□ **"Mi mostri la gestione degli alert durante picchi di volume"** - osservare il processo di triage

### Verifiche di Sistema da Eseguire
□ **Revisionare statistiche del volume di alert** degli ultimi 3 mesi
□ **Verificare strumenti di supporto decisionale** disponibilità e log di utilizzo
□ **Verificare copertura autorità 24/7** nei sistemi di scheduling
□ **Testare funzionalità dei trigger di escalation automatizzati**

### Obiettivi per le Interviste
□ **SOC Manager** - strutture di autorità e pattern di escalation
□ **Senior Security Analyst** - sfide e ritardi nel decision-making
□ **Personale di Guardia** - esperienza di autorità decisionale fuori orario
□ **Incident Commander** - processi decisionali per incidenti complessi

---

## 🎯 SCORING RAPIDO (2 minuti)

**Utilizzare l'albero decisionale sottostante:**

### Se 0-1 risposte SÌ → **VERDE (Vulnerabilità Bassa)**
- Risposta media < 30 min per incidenti urgenti
- Chiara delega dell'autorità con backup
- Gestione efficace del triage degli alert durante picchi di volume
- >90% incidenti escalati entro le tempistiche

### Se 2-4 risposte SÌ → **GIALLO (Vulnerabilità Moderata)**
- Risposta media 30-120 min per incidenti urgenti
- Alcuni gap di autorità durante le ore fuori ufficio
- Il triage degli alert fatica con i picchi di volume
- 70-90% incidenti escalati entro le tempistiche

### Se 5-7 risposte SÌ → **ROSSO (Vulnerabilità Elevata)**
- Risposta media >120 min per incidenti urgenti
- Confusione di autorità comune
- I picchi di alert causano arretrati significativi
- <70% incidenti escalati entro le tempistiche

**Punteggio Finale**: □ VERDE □ GIALLO □ ROSSO

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### **ALTO IMPATTO** (Affrontare per Primo)

**Sistema di Time Boxing delle Decisioni**
- **Costo**: Basso | **Complessità**: Bassa | **Tempo**: 2-4 settimane
- Implementare tempistiche decisionali obbligatorie con auto-escalation
- **Dipendenze**: Approvazione del management dei limiti temporali

**Sistemi di Backup dell'Autorità Chiari**
- **Costo**: Basso | **Complessità**: Media | **Tempo**: 4-6 settimane
- Stabilire matrici di delega dell'autorità 24/7
- **Dipendenze**: Chiarificazione ruoli, identificazione personale di backup

### **MEDIO IMPATTO** (Affrontare in Seconda Battuta)

**Circuit Breaker per la Gestione degli Alert**
- **Costo**: Medio | **Complessità**: Media | **Tempo**: 6-8 settimane
- Implementare filtro intelligente degli alert e prioritizzazione
- **Dipendenze**: Capacità del sistema SIEM, strumenti di correlazione alert

**Tracking Decisionale in Tempo Reale**
- **Costo**: Medio | **Complessità**: Alta | **Tempo**: 8-12 settimane
- Installare monitoraggio delle decisioni con sistemi di feedback
- **Dipendenze**: Sviluppo dashboard, integrazione processi

### **LUNGO TERMINE** (Iniziative Strategiche)

**Programma di Training di Inoculazione allo Stress**
- **Costo**: Alto | **Complessità**: Alta | **Tempo**: 3-6 mesi
- Formazione con esposizione graduata per decision-making sotto stress
- **Dipendenze**: Sviluppo programma di formazione, expertise esterno

**Strumenti di Riduzione del Carico Cognitivo**
- **Costo**: Alto | **Complessità**: Alta | **Tempo**: 6-12 mesi
- Sistemi di supporto decisionale e triage automatizzato
- **Dipendenze**: Procurement strumenti, integrazione sistemi

---

## 💬 SCRIPT CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Mi racconti del Suo ultimo incidente di sicurezza che ha richiesto più tempo del previsto per essere risolto."**
- *Follow-up*: "Quali fattori specifici hanno causato ritardi nel decision-making?"
- *Red flag*: Fasi di analisi estese senza corrispondente azione

**"Cosa succede quando il Suo security manager non è disponibile durante un incidente?"**
- *Follow-up*: "Può fornirmi un esempio recente?"
- *Red flag*: Ritardi in attesa di decision-maker non disponibili

**"Come gestisce il Suo team i picchi di volume degli alert?"**
- *Follow-up*: "Mi racconti dell'ultima volta che gli alert sono aumentati significativamente"
- *Red flag*: I picchi di alert correlano con incidenti critici mancati

### Aree Sensibili

**Quando si discutono ritardi decisionali:**
- Usare: *"Stiamo cercando di ottimizzare l'efficienza della risposta agli incidenti"*
- Evitare: *"Il Suo team sembra paralizzato durante gli incidenti"*

**Quando si affronta la confusione di autorità:**
- Usare: *"Chiariamo la struttura decisionale"*
- Evitare: *"C'è confusione su chi è al comando"*

**Quando si notano gap di formazione:**
- Usare: *"Una formazione decisionale migliorata potrebbe essere benefica"*
- Evitare: *"Il Suo staff non è preparato per lo stress"*

### Domande di Approfondimento per Risposte Incomplete

- *"Può illustrarmi la timeline di quell'incidente?"*
- *"Chi ha preso le decisioni chiave e quando?"*
- *"Cosa avrebbe aiutato ad accelerare la risposta?"*
- *"Come traccia l'efficacia del decision-making?"*

---

## 📊 TEMPLATE NOTE DI CAMPO

### Valutazione Risposta agli Incidenti
**Tempo Medio di Risposta**: _____ minuti (ultimi 10 incidenti)
**Tempo di Risposta Più Lungo**: _____ minuti | **Causa**: ________________
**Problemi di Autorità Identificati**: □ Sì □ No | **Dettagli**: ________________

### Valutazione Gestione Alert
**Volume Alert Giornaliero**: _____ alert
**Volume Picco Gestito**: _____ alert | **Performance**: ________________
**Problemi di Arretrato Alert**: □ Sì □ No | **Frequenza**: ________________

### Valutazione Autorità Decisionale
**Autorità Fuori Orario**: □ Chiara □ Poco chiara | **Copertura**: ____%
**Conflitti di Autorità**: _____ incidenti negli ultimi 6 mesi
**Tasso di Successo Escalation**: ____% | **Target**: >90%

### Valutazione Formazione & Supporto
**Formazione Decisionale**: □ Formale □ Informale □ Nessuna
**Formazione Stress**: □ Presente □ Assente
**Strumenti di Supporto Decisionale**: □ Disponibili □ Utilizzati □ Efficaci

### Valutazione Complessiva del Rischio
**Preoccupazioni Principali**: ________________________________________________
**Azioni Immediate Necessarie**: ____________________________________
**Priorità Raccomandata**: □ Alta □ Media □ Bassa

---

## ✅ CHECKLIST DI COMPLETAMENTO VALUTAZIONE

□ **Valutazione rapida** completata (7 domande binarie)
□ **Raccolta prove** completata (documenti, demo, sistemi, interviste)
□ **Scoring rapido** determinato (Verde/Giallo/Rosso con razionale)
□ **Priorità soluzioni** identificate (Alto/Medio/Lungo termine)
□ **Conversazione cliente** condotta (domande chiave poste)
□ **Note di campo** documentate (tutte le sezioni completate)
□ **Azioni di follow-up** programmate (se richiesto)

**Tempo Totale Valutazione**: _____ minuti (Obiettivo: <25 minuti)
**Livello di Confidenza Auditor**: □ Alto □ Medio □ Basso
**Richiede Revisione Esperto**: □ Sì □ No
