# 📋 CPF FIELD KIT 2.9: SFRUTTAMENTO DEL CAMBIO TURNO

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Verificare ogni elemento - Rispondere solo SÌ/NO:**

□ **Esistono procedure di passaggio scritte** che menzionano specificamente le responsabilità di sicurezza
□ **I periodi di sovrapposizione dei turni sono di 15+ minuti** con entrambi i membri del personale attivamente presenti
□ **Esiste un'assegnazione chiara della responsabilità primaria** per la sicurezza durante i passaggi di consegne
□ **Gli incidenti di sicurezza non mostrano correlazione** con i tempi di cambio turno (ultimi 6 mesi)
□ **I sistemi di monitoraggio degli alert continuano a operare** senza lacune durante i passaggi
□ **I programmi dei turni sono variati/non prevedibili** o non accessibili pubblicamente
□ **Esiste un processo di verifica** per confermare il completamento del trasferimento dello stato di sicurezza

**PUNTEGGIO**:
- 6-7 SÌ = VERDE (0)
- 4-5 SÌ = GIALLO (1)
- 0-3 SÌ = ROSSO (2)

---

## 📝 RACCOLTA PROVE (10 minuti)

### Documenti da Richiedere
□ Procedure scritte di passaggio per ruoli critici per la sicurezza
□ Programmi dei turni degli ultimi 3 mesi
□ Registro degli incidenti di sicurezza con timestamp (ultimi 6 mesi)
□ Checklist di completamento dei passaggi (ultimo mese)
□ Registri di formazione per le procedure di cambio turno

### Dimostrazioni da Richiedere
□ "Mostratemi il Vostro processo di passaggio effettivo per [analista SOC/guardia di sicurezza/operazioni IT]"
□ "Guidatemi attraverso cosa succede quando arriva un alert durante un cambio turno"
□ "Mostratemi come verificate che lo stato di sicurezza è stato trasferito"

### Verifiche di Sistema da Eseguire
□ Rivedere i sistemi di monitoraggio degli alert per lacune durante i passaggi
□ Verificare le procedure di escalation automatica durante le transizioni
□ Verificare i sistemi dashboard utilizzati per il supporto ai passaggi
□ Testare l'attivazione del monitoraggio di riserva durante i turni

### Obiettivi Chiave per le Interviste
□ Supervisore del turno uscente
□ Supervisore del turno entrante
□ Personale delle operazioni di sicurezza
□ Assunzione recente (negli ultimi 6 mesi)

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale

**INIZIO QUI:**
1. Esistono procedure scritte di passaggio per la sicurezza?
   - NO → **ROSSO (2)**
   - SÌ → Continuare

2. C'è sovrapposizione di 15+ minuti con doppia copertura?
   - NO → Verificare correlazione incidenti
   - SÌ → Continuare

3. Gli incidenti di sicurezza sono correlati con i tempi dei turni?
   - SÌ → **ROSSO (2)**
   - NO → Continuare

4. Tutti i 7 elementi di valutazione rapida sono SÌ?
   - 6-7 SÌ → **VERDE (0)**
   - 4-5 SÌ → **GIALLO (1)**
   - 0-3 SÌ → **ROSSO (2)**

### Soglie Oggettive
- **Correlazione Incidenti**: >20% di incidenti entro 30 min dal cambio turno = ROSSO
- **Tempo di Sovrapposizione**: <5 min = ROSSO, 5-14 min = GIALLO, 15+ min = VERDE
- **Prevedibilità del Programma**: Stessi orari ogni giorno = ROSSO, qualche variazione = GIALLO, randomizzato = VERDE

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
□ **Checklist di passaggio orientate alla sicurezza** (Costo: Basso, Tempo: 2 settimane)
□ **Mandato di sovrapposizione di 15 minuti** (Costo: Medio, Tempo: 1 settimana)
□ **Assegnazione esplicita della responsabilità** (Costo: Basso, Tempo: 1 settimana)

### ALTO IMPATTO / LUNGO TERMINE
□ **Sistemi di supporto ai passaggi automatizzati** (Costo: Alto, Tempo: 3-6 mesi)
□ **Programma di randomizzazione dei programmi** (Costo: Medio, Tempo: 2-3 mesi)
□ **Modello di doppia responsabilità** (Costo: Medio, Tempo: 1-2 mesi)

### IMPATTO MEDIO / MANUTENZIONE
□ **Audit regolari dei passaggi** (Costo: Basso, Tempo: Continuativo)
□ **Programmi di formazione incrociata** (Costo: Medio, Tempo: 3-6 mesi)
□ **Tracciamento delle metriche di prestazione** (Costo: Basso, Tempo: Continuativo)

### Dipendenze
- **Soluzioni tecnologiche** richiedono approvazione del budget e risorse IT
- **Modifiche ai programmi** richiedono coordinamento sindacale/HR
- **Programmi di formazione** richiedono impegno della direzione e allocazione del tempo

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
- "Mi guidi attraverso cosa succede durante un tipico cambio turno per il Suo team di sicurezza."
- "Come garantisce che il monitoraggio della sicurezza continui durante i passaggi?"
- "Ha notato pattern in quando si verificano gli incidenti di sicurezza?"

### Solleciti di Follow-up
**Se menzionano processi informali:**
- "Può mostrarmi la procedura scritta per questo?"
- "Come forma le nuove persone su questo processo?"

**Se menzionano lacune o ritardi:**
- "Con quale frequenza succede questo?"
- "Qual è il Suo piano di riserva quando questo si verifica?"

**Se sembrano sulla difensiva:**
- "Questa è una sfida comune in molte organizzazioni. Cosa funziona bene nel Vostro processo attuale?"

### Indicatori di Segnale Rosso che Richiedono Indagini Più Approfondite
□ Risposte vaghe su chi è responsabile durante i passaggi
□ Menzioni di "di solito funziona bene" senza specifiche
□ Nessuna consapevolezza della correlazione temporale dei turni con gli incidenti
□ Resistenza a mostrare le procedure di passaggio effettive
□ Risposte diverse da personale di turno diverso

### Linguaggio Professionale per Argomenti Sensibili
**Invece di:** "La Vostra sicurezza è vulnerabile durante i cambi turno"
**Dire:** "Stiamo esaminando opportunità per rafforzare la continuità durante le transizioni"

**Invece di:** "Questa è una lacuna di sicurezza importante"
**Dire:** "Questo rappresenta un'area per il miglioramento della sicurezza"

---

## 📊 MODELLO NOTE SUL CAMPO

### Sito: _________________ Data: _________ Auditor: _____________

**Punteggio Valutazione Rapida: VERDE / GIALLO / ROSSO**

### Prove Raccolte
□ Documento procedure di passaggio
□ Programmi dei turni rivisti
□ Analisi temporale degli incidenti
□ Osservazione passaggio in diretta
□ Interviste al personale completate

### Risultati Chiave
**Punti di Forza:**
-
-
-

**Lacune Identificate:**
-
-
-

**Analisi di Correlazione:**
- Incidenti totali ultimi 6 mesi: ____
- Incidenti entro 30 min dal cambio turno: ____
- Percentuale di correlazione: _____%

### Raccomandazioni Immediate
**Priorità 1 (Implementare entro 30 giorni):**
-
-

**Priorità 2 (Implementare entro 90 giorni):**
-
-

### Follow-up Richiesto
□ Necessaria revisione del sistema tecnologico
□ Necessaria revisione della documentazione delle politiche
□ Necessaria valutazione della formazione del personale
□ Richiesta analisi dei programmi

### Contatto Cliente per Follow-up
Nome: _________________ Ruolo: _________________
Email: _________________ Telefono: _______________

---

## 📋 LISTA DI CONTROLLO COMPLETAMENTO VALUTAZIONE

□ Valutazione rapida completata (5 min)
□ Raccolta prove terminata (10 min)
□ Punteggio determinato (2 min)
□ Priorità delle soluzioni identificate (5 min)
□ Conversazione con cliente condotta (3 min)
□ Note sul campo documentate
□ Azioni di follow-up identificate
□ Informazioni di contatto del cliente acquisite

**Tempo Totale: _____ minuti (Obiettivo: <25 minuti)**

---

**Data Valutazione:** _________ **Prossima Revisione:** _________ **Firma Auditor:** _________________
