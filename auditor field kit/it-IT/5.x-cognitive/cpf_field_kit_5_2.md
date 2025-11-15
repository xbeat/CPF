# 📋 CPF INDICATORE 5.2 FIELD KIT: Errori da Affaticamento Decisionale

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Marcare SÌ/NO per ciascun indicatore osservabile:**

□ **SÌ/NO**: Il team di sicurezza elabora **più di 50 decisioni** per turno di 8 ore
  - *Evidenza: Log allerta, conteggi ticket, report flusso di lavoro*

□ **SÌ/NO**: **Non esistono procedure documentate** per periodi decisionali ad alto volume
  - *Evidenza: Documenti di policy, manuali di flusso di lavoro*

□ **SÌ/NO**: Le decisioni di sicurezza sono **concentrate in 1-2 persone** (nessuna rotazione/distribuzione)
  - *Evidenza: Log di approvazione, assegnazioni decisori*

□ **SÌ/NO**: **Nessuna automazione** gestisce le decisioni di sicurezza di routine (allerta, accessi, eccezioni)
  - *Evidenza: Configurazioni strumenti, regole di automazione*

□ **SÌ/NO**: Il team riporta **sovraccarico decisionale** durante i periodi di picco
  - *Evidenza: Risultati sondaggi, risposte interviste, registrazioni straordinari*

□ **SÌ/NO**: **Nessuna approvazione secondaria** richiesta per decisioni prese dopo le 15:00 o di venerdì
  - *Evidenza: Flussi di lavoro approvazione, requisiti policy*

□ **SÌ/NO**: **Nessun sistema di monitoraggio del carico decisionale** traccia la capacità individuale/del team
  - *Evidenza: Esistenza dashboard, metriche carico di lavoro*

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### **Documenti da Richiedere:**
- [ ] **Log allerta di sicurezza** (ultimi 30 giorni) - contare decisioni per persona al giorno
- [ ] **Approvazioni richieste di accesso** - timestamp e nomi approvatori
- [ ] **Richieste di eccezione policy** - frequenza e pattern di approvazione
- [ ] **Log di risposta agli incidenti** - punti decisionali e tempistiche
- [ ] **Pianificazioni del team** - policy di rotazione, distribuzione carico di lavoro
- [ ] **Report straordinari** - team di sicurezza che lavora oltre l'orario normale

### **Dimostrazioni di Sistema:**
- [ ] **"Mi mostri la Sua dashboard di sicurezza"** - contare le allerta attive che richiedono decisioni
- [ ] **"Mi illustri l'approvazione di una richiesta di accesso"** - osservare la complessità decisionale
- [ ] **"Mi mostri i processi automatizzati vs manuali"** - identificare i colli di bottiglia decisionali
- [ ] **"Dimostri il processo di triage delle allerta"** - contare i punti decisionali per allerta

### **Obiettivi di Intervista:**
- [ ] **Manager Operazioni di Sicurezza** - carico di lavoro del team e pattern di affaticamento
- [ ] **Analisti di Sicurezza** (2-3 persone) - volume decisionale giornaliero e punti di stress
- [ ] **Supervisore Help Desk IT** - carico di elaborazione richieste di accesso
- [ ] **Responsabile Conformità** - frequenza approvazioni eccezioni

### **Controlli di Sistema:**
- [ ] **Contare gli strumenti di sicurezza attivi** che richiedono decisioni umane
- [ ] **Rivedere configurazioni di automazione** - cosa è automatizzato vs manuale
- [ ] **Controllare dimensioni code allerta** durante la valutazione
- [ ] **Verificare capacità di tracciamento decisioni** negli strumenti di sicurezza

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### **Albero Decisionale:**

**INIZIARE QUI:** Contare le decisioni di sicurezza giornaliere per membro del team

**Se MENO di 25 decisioni per persona al giorno:**
- ✅ **E** ha procedure documentate per alto volume = **VERDE (0)**
- ❌ **E** nessuna procedura documentata = **GIALLO (1)**

**Se 25-50 decisioni per persona al giorno:**
- ✅ **E** ha automazione + procedure di backup = **GIALLO (1)**
- ❌ **E** nessuna automazione o backup = **ROSSO (2)**

**Se PIÙ di 50 decisioni per persona al giorno:**
- **Sempre = ROSSO (2)** indipendentemente da altri fattori

### **Trigger Automatici ROSSO:**
- Nessun monitoraggio del carico decisionale
- Nessuna automazione per decisioni di routine
- Tutte le decisioni di sicurezza passano attraverso 1-2 persone
- Il team riporta frequente sovraccarico decisionale

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

| **Soluzione** | **Impatto** | **Tempistiche** | **Costo** | **Dipendenze** |
|--------------|------------|--------------|----------|------------------|
| **Bilanciamento Carico Decisionale** | ALTO | 2-4 settimane | BASSO | Formazione team, modifiche flusso lavoro |
| **Regole Automazione Allerta** | ALTO | 1-2 settimane | MEDIO | Configurazione strumenti sicurezza |
| **Checkpoint Qualità Decisioni** | MEDIO | 1 settimana | BASSO | Aggiornamento policy, accordo team |
| **Gestione Carico Cognitivo** | MEDIO | 4-6 settimane | BASSO | Riprogettazione processi, template |
| **Protocolli Decisioni di Emergenza** | ALTO | 2 settimane | BASSO | Creazione template, formazione team |
| **Dashboard Monitoraggio Carico di Lavoro** | BASSO | 4-8 settimane | ALTO | Nuovo strumento, lavoro di integrazione |

### **Vittorie Rapide (Iniziare Immediatamente):**
1. **Implementare quote decisionali** per membro del team al giorno
2. **Creare template decisionali standard** per scenari comuni
3. **Stabilire requisito di revisione alle 16:00** per scelte critiche
4. **Raggruppare decisioni simili** in blocchi temporali dedicati

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### **Domande di Apertura:**
- *"Quante allerta di sicurezza gestisce il Suo team in un giorno tipico?"*
- *"A che ora del giorno vede accumularsi il maggior numero di decisioni di sicurezza?"*
- *"Quando è stata l'ultima volta che il Suo team di sicurezza si è sentito sopraffatto dal volume decisionale?"*

### **Prompt di Follow-up:**
- **Se dicono "non molte decisioni":** *"Contiamo insieme - allerta, richieste di accesso, eccezioni policy, classificazioni incidenti..."*
- **Se dicono "lo gestiamo bene":** *"Può mostrarmi i Suoi log decisionali del venerdì pomeriggio scorso?"*
- **Se menzionano automazione:** *"Quale percentuale di decisioni è completamente automatizzata vs richiede revisione umana?"*

### **Indicatori Segnale d'Allarme (Investigare Più a Fondo):**
- ⚠️ **"A volte respingiamo le allerta in massa"** → Affaticamento da allerta presente
- ⚠️ **"I venerdì pomeriggio sono pazzi"** → Periodi di picco affaticamento identificati
- ⚠️ **"Il nostro analista senior gestisce tutta la roba complessa"** → Singolo punto di fallimento
- ⚠️ **"Approviamo eccezioni per far procedere le cose"** → Degradazione qualità

### **Linguaggio Professionale per Argomenti Delicati:**
- Invece di *"Il Suo team prende decisioni sbagliate"* → *"Ottimizziamo l'efficienza del processo decisionale"*
- Invece di *"L'affaticamento decisionale è pericoloso"* → *"Possiamo ridurre il carico cognitivo sul Suo team"*
- Invece di *"Questo è un rischio importante"* → *"C'è l'opportunità di rafforzare la Sua postura di sicurezza"*

---

## 📊 MODELLO NOTE DI CAMPO

**Data:** _________ **Ora:** _________ **Auditor:** _________________

### **Risultati Quantitativi:**
- **Decisioni di sicurezza giornaliere per persona:** _______
- **Ore di picco decisionale:** _______
- **Numero di decisori:** _______
- **Percentuale automazione:** _______%

### **Evidenze Chiave:**
□ Log allerta revisionati (intervallo date: _______)
□ Flussi di lavoro decisionali osservati
□ Interviste al team completate (conteggio: _____)
□ Dimostrazioni di sistema eseguite

### **Indicatori di Rischio Presenti:**
□ Volume decisionale oltre la soglia
□ Nessuna procedura di gestione affaticamento
□ Processo decisionale centralizzato
□ Sovraccarico periodo di picco riportato
□ Nessun monitoraggio qualità decisioni

### **Raccomandazioni Immediate:**
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### **Giustificazione Punteggio:**
**VERDE/GIALLO/ROSSO** perché: ____________________________
________________________________________________________

### **Priorità Cliente:** ALTA / MEDIA / BASSA
**Motivazione:** ________________________________________

---

## ✅ VALUTAZIONE COMPLETATA

**Tempo Totale:** _____ minuti
**Follow-up Richiesto:** SÌ / NO
**Prossimi Passi:** _______________________________________
