# 📋 CPF KIT SUL CAMPO 10.2: TRIGGER DI GUASTO A CASCATA

**Obiettivo della Valutazione**: Vulnerabilità organizzativa all'escalation degli incidenti di sicurezza durante lo stress
**Tempo Totale**: 22 minuti | **Punteggio**: Verde (0), Giallo (1), Rosso (2)

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Istruzioni**: Verifichi SÌ/NO per ciascun elemento. Cerchi solo evidenze documentate.

### 1. Struttura di Risposta agli Incidenti
□ **SÌ** - Esiste un piano scritto di risposta agli incidenti con ruoli definiti
□ **NO** - Nessun piano documentato o ruoli poco chiari

### 2. Backup delle Comunicazioni di Crisi
□ **SÌ** - Sistemi di comunicazione di backup documentati (piattaforme alternative, alberi telefonici)
□ **NO** - Disponibili solo canali di comunicazione primari

### 3. Tracciamento delle Eccezioni di Sicurezza
□ **SÌ** - Sistema digitale che traccia tutte le eccezioni alle policy di sicurezza con approvazioni
□ **NO** - Eccezioni gestite informalmente o non tracciate

### 4. Formazione della Leadership in Situazioni di Crisi
□ **SÌ** - I leader senior hanno formazione documentata sulla comunicazione di crisi
□ **NO** - Nessuna evidenza di formazione della leadership in situazioni di crisi

### 5. Dipendenze Inter-Dipartimentali
□ **SÌ** - Analisi dell'impatto sul business documentata che mostra dipendenze IT/sicurezza
□ **NO** - Dipendenze non mappate o documentate

### 6. Autorità Decisionale di Backup
□ **SÌ** - Piano di successione chiaro per decisioni di sicurezza durante crisi
□ **NO** - Non è chiaro chi prenda decisioni di sicurezza quando i leader non sono disponibili

### 7. Processo di Prioritizzazione degli Allarmi
□ **SÌ** - Procedure scritte per gestire allarmi multipli simultanei
□ **NO** - Nessun approccio strutturato alla prioritizzazione degli allarmi

---

## 📝 RACCOLTA DELLE EVIDENZE (10 minuti)

### Documenti da Richiedere
- [ ] **Piano di Risposta agli Incidenti** - Cerchi organigramma con ruoli di crisi
- [ ] **Report di Incidenti Recenti** - Verifichi i tempi di coordinamento e i dipartimenti coinvolti
- [ ] **Log delle Eccezioni di Sicurezza** - Riveda la frequenza durante i periodi di picco
- [ ] **Piano di Business Continuity** - Verifichi che esista la mappatura delle dipendenze
- [ ] **Template di Comunicazione di Crisi** - Verifichi la presenza di messaggi pre-redatti
- [ ] **Registri di Formazione** - Formazione della leadership sulla comunicazione di crisi
- [ ] **Procedure di Risposta agli Allarmi** - Processi di triage documentati

### Dimostrazioni di Sistema
- [ ] **"Mi mostri il Suo sistema di comunicazione di backup"** - Testi la funzionalità
- [ ] **"Mi illustri il Suo processo di approvazione delle eccezioni"** - Verifichi il flusso di lavoro digitale
- [ ] **"Mi dimostri la prioritizzazione degli allarmi"** - Veda strumenti/procedure reali
- [ ] **"Mi mostri il coordinamento di un incidente recente"** - Riveda i log di risposta effettivi

### Destinatari Chiave dei Colloqui
- [ ] **Responsabile IT/Sicurezza** - Chieda di situazioni travolgenti
- [ ] **Responsabile Risposta agli Incidenti** - Discuta le sfide di coordinamento
- [ ] **Responsabile di Dipartimento** - Impatto quando l'IT non è disponibile
- [ ] **Assistente Esecutivo** - Disponibilità della leadership durante stress

### Verifiche di Sistema
- [ ] **Sistema di tracciamento delle eccezioni** - Acceda e verifichi la funzionalità
- [ ] **Backup della piattaforma di comunicazione** - Testi sistemi alternativi
- [ ] **Console di gestione allarmi** - Verifichi le funzionalità di prioritizzazione
- [ ] **Strumenti di risposta agli incidenti** - Verifichi che le assegnazioni di ruolo funzionino

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale

**Inizi Qui**: Conti le risposte "SÌ" totali dalla Valutazione Rapida

**Se 6-7 risposte SÌ** → **VERDE (0)**
- Robusta prevenzione dei guasti a cascata
- Tutti i controlli critici documentati e funzionali

**Se 4-5 risposte SÌ** → **GIALLO (1)**
- Rischio di cascata moderato
- Alcuni controlli presenti ma esistono lacune

**Se 0-3 risposte SÌ** → **ROSSO (2)**
- Alta vulnerabilità a cascata
- Controlli critici mancanti o inadeguati

### Condizioni di Override del Punteggio
**Forzi ROSSO (2) se QUALSIASI di questi esiste:**
- Nessun piano di risposta agli incidenti
- Le eccezioni di sicurezza NON hanno tracciamento/approvazione
- NESSUNA autorità decisionale di backup identificata
- Un incidente recente ha causato il caos in più dipartimenti (dai colloqui)

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
- [ ] **Creare backup delle comunicazioni di crisi** (Spazio Slack alternativo, albero telefonico)
- [ ] **Implementare sistema di tracciamento eccezioni** (Semplice workflow di ticketing)
- [ ] **Documentare autorità decisionale di backup** (Aggiornare organigrammi, notificare il personale)

### IMPATTO MEDIO / TEMPI MEDI
- [ ] **Formazione sul sistema di comando degli incidenti** (Formare più persone per i ruoli)
- [ ] **Coaching comunicazione di crisi per dirigenti** (Sviluppo professionale)
- [ ] **Programma di esercitazioni tabletop** (Scenari trimestrali di guasto a cascata)

### ALTO IMPATTO / TEMPI LUNGHI
- [ ] **Mappatura delle dipendenze aziendali** (Analisi completa dell'impatto sul business)
- [ ] **Interruttori automatici** (Sistemi per isolare i guasti)
- [ ] **Dashboard di monitoraggio dello stress** (Metriche anonime della salute organizzativa)

### Stime dei Costi
**Basso (€1.000-€10.000)**: Backup comunicazioni, aggiornamenti documentazione, formazione base
**Medio (€10.000-€50.000)**: Sistemi di tracciamento eccezioni, esercitazioni strutturate, coaching
**Alto (€50.000+)**: Interruttori automatici, analisi completa delle dipendenze

---

## 💬 SCRIPT DI CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Mi racconti del Suo ultimo incidente IT significativo..."**
- Chi era coinvolto? Come sono state prese le decisioni?
- Quanto tempo ha richiesto il coordinamento?
- Quali dipartimenti sono stati colpiti?

### Suggerimenti di Follow-up
**Se menzionano problemi di coordinamento:**
- "Quali specifici guasti di comunicazione si sono verificati?"
- "Come ha impattato questo sui Suoi tempi di risposta?"

**Se menzionano eccezioni di sicurezza:**
- "Con quale frequenza le persone richiedono eccezioni alle policy durante i periodi di picco?"
- "Chi le approva? Come le tracciate?"

**Se descrivono la leadership durante la crisi:**
- "Come comunicano i leader senior durante le sfide organizzative?"
- "Il personale è fiducioso nella leadership durante i periodi stressanti?"

### Indicatori di Segnale Rosso
- [ ] **"Lo risolviamo semplicemente man mano"** - Nessuna struttura di incidente
- [ ] **"Le persone mandano email a chiunque conoscano"** - Nessuna comunicazione formale
- [ ] **"Pieghiamo le regole quando le cose si fanno intense"** - Eccezioni non tracciate
- [ ] **"La leadership tace durante i periodi difficili"** - Fallimento della comunicazione di crisi
- [ ] **"Tutto si ferma quando l'IT ha problemi"** - Dipendenze non documentate

### Linguaggio Professionale per Argomenti Sensibili
**Invece di**: "La Sua organizzazione ha vulnerabilità di guasto a cascata"
**Dica**: "Abbiamo identificato opportunità per rafforzare il coordinamento durante i periodi ad alto stress"

**Invece di**: "I Suoi leader creano panico"
**Dica**: "Una formazione migliorata sulla comunicazione di crisi potrebbe migliorare la fiducia organizzativa"

---

## 📊 MODELLO DI NOTE SUL CAMPO

### Riepilogo della Valutazione
**Data**: _________ **Auditor**: _________________ **Punteggio**: _______

### Risultati della Valutazione Rapida
Conteggio SÌ: ___/7 | Controlli Chiave Mancanti:
- [ ] _________________________________
- [ ] _________________________________
- [ ] _________________________________

### Risultati Critici
**Lacuna Più Preoccupante**: _________________________________

**Rischio Immediato**: _________________________________

**Evidenza di Incidenti Recenti**: _________________________________

### Priorità del Cliente (Dal Colloquio)
1. _________________________________
2. _________________________________
3. _________________________________

### Azioni Raccomandate
**Settimana 1**: _________________________________
**Mese 1**: _________________________________
**Trimestre 1**: _________________________________

### Follow-up Richiesto
□ **Validare che il sistema di tracciamento eccezioni funzioni effettivamente**
□ **Osservare esercitazione tabletop se programmata**
□ **Intervistare personale aggiuntivo per confermare il pattern di cascata**
□ **Rivedere l'architettura di sistema per punti di cascata tecnica**

---

## ✅ CHECKLIST DI COMPLETAMENTO DELLA VALUTAZIONE

- [ ] Tutti i 7 elementi della valutazione rapida completati
- [ ] Almeno 4 documenti chiave revisionati
- [ ] Minimo 2 dimostrazioni osservate
- [ ] Almeno 3 ruoli diversi intervistati
- [ ] Razionale del punteggio documentato
- [ ] Identificate le 3 soluzioni principali con costi
- [ ] Note di conversazione con il cliente complete
- [ ] Modello di note sul campo compilato

**Controllo Qualità della Valutazione**: Un altro auditor può comprendere i Suoi risultati e il razionale del punteggio solo dalle Sue note?

---

**Prossimi Passi**: Programmi un debriefing di 30 minuti con il cliente per presentare i risultati e discutere le priorità di implementazione per le soluzioni classificate più in alto.
