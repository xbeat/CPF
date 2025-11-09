# 📋 INDICATOR 6.4 FIELD KIT
## Ozio Sociale nei Compiti di Sicurezza

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Selezioni SÌ/NO per ogni indicatore:**

□ **SÌ** / □ **NO** - I compiti di sicurezza hanno proprietari individuali nominati (non solo assegnazioni di team)

□ **SÌ** / □ **NO** - Gli avvisi di sicurezza sono inviati a individui specifici piuttosto che a gruppi/team

□ **SÌ** / □ **NO** - Esistono metriche di prestazione della sicurezza individuali e sono monitorate

□ **SÌ** / □ **NO** - Gli account di sicurezza condivisi hanno attribuzione/registrazione dell'attività individuale

□ **SÌ** / □ **NO** - La risposta agli incidenti di sicurezza ha ruoli di responsabilità individuale chiari

□ **SÌ** / □ **NO** - La documentazione sulla sicurezza ha proprietari individuali nominati per aggiornamenti/manutenzione

□ **SÌ** / □ **NO** - Il completamento della formazione sulla sicurezza individuale è monitorato separatamente dalle metriche del team

**Punteggio Rapido:** 6-7 SÌ = Verde | 4-5 SÌ = Giallo | 0-3 SÌ = Rosso

---

## 📝 RACCOLTA DI EVIDENZE (10 minuti)

### Documenti da Richiedere:
- [ ] **Registri di assegnazione compiti di sicurezza** (ultimi 30 giorni)
- [ ] **Scorecard o metriche di prestazione della sicurezza individuali**
- [ ] **Liste di distribuzione avvisi di sicurezza** e registri di risposta
- [ ] **Registri di accesso account condivisi** con attribuzione utente
- [ ] **Descrizioni delle mansioni** con responsabilità di sicurezza individuali specifiche
- [ ] **Rapporti di completamento formazione sulla sicurezza** per individuo
- [ ] **Procedura di risposta agli incidenti** con definizioni di ruolo individuali

### Dimostrazioni di Sistema:
- [ ] **"Mi mostri come vengono assegnati gli avvisi di sicurezza"** - verifichi targeting individuale vs di gruppo
- [ ] **"Illustri l'ultima risposta agli incidenti di sicurezza"** - identifichi la responsabilità individuale
- [ ] **"Dimostri il monitoraggio degli account condivisi"** - verifichi la capacità di attribuzione individuale
- [ ] **"Mostri il sistema di monitoraggio dei compiti di sicurezza"** - confermi la visibilità della proprietà individuale

### Obiettivi dell'Intervista:
- [ ] **Responsabile Team Sicurezza** - chieda sulla struttura di responsabilità individuale vs team
- [ ] **Analisti SOC** (2-3 individui) - valuti la consapevolezza della responsabilità individuale
- [ ] **IT Manager** - verifichi il monitoraggio delle prestazioni di sicurezza individuali
- [ ] **Coordinatore Risposta Incidenti** - confermi la chiarezza dei ruoli individuali

### Controlli di Sistema:
- [ ] **Configurazione avvisi SIEM** - notifiche individuali vs di gruppo
- [ ] **Sistema di gestione compiti** - capacità di assegnazione individuale
- [ ] **Account servizi condivisi** - registrazione attività individuali
- [ ] **Piattaforma sensibilizzazione sicurezza** - funzionalità di monitoraggio individuale

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale:

**INIZI QUI:** I compiti di sicurezza sono assegnati a individui nominati?

- **SÌ** → Vada ad A
- **NO** → **PUNTEGGIO ROSSO**

**A:** Le metriche di sicurezza individuali sono monitorate e revisionate?

- **SÌ** → Vada a B
- **NO** → Vada a C

**B:** Gli avvisi di sicurezza vanno a individui specifici con responsabilità?

- **SÌ** → **PUNTEGGIO VERDE**
- **NO** → **PUNTEGGIO GIALLO**

**C:** C'è qualche responsabilità individuale per le risorse di sicurezza condivise?

- **SÌ** → **PUNTEGGIO GIALLO**
- **NO** → **PUNTEGGIO ROSSO**

### Soglie Oggettive:
- **VERDE:** >80% compiti di sicurezza assegnati individualmente + metriche individuali + proprietà avvisi individuali
- **GIALLO:** 50-80% assegnazione individuale O metriche parziali O distribuzione avvisi mista
- **ROSSO:** <50% assegnazione individuale + nessuna metrica individuale + avvisi solo di gruppo

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
- **Assegnazione Avvisi Individuali** - Configurare strumenti di sicurezza per notifiche individuali
- **Proprietà Compiti Nominata** - Assegnare individui specifici ai compiti di sicurezza esistenti
- **Monitoraggio Risposta Individuale** - Monitorare chi risponde agli avvisi/incidenti di sicurezza
- *Costo: BASSO | Tempistiche: 1-4 settimane*

### ALTO IMPATTO / LUNGO TERMINE
- **Scorecard Sicurezza Individuali** - Implementare metriche di prestazione della sicurezza personali
- **Attribuzione Account Condivisi** - Implementare registrazione individuale per credenziali di sicurezza condivise
- **Aggiornamenti Descrizioni Mansioni** - Aggiungere responsabilità di sicurezza individuali specifiche
- *Costo: MEDIO | Tempistiche: 2-6 mesi*

### MEDIO IMPATTO / IMPLEMENTAZIONE RAPIDA
- **Proprietà Documentazione Sicurezza** - Assegnare proprietari individuali a politiche/procedure
- **Monitoraggio Formazione Individuale** - Separare metriche di formazione individuali da quelle del team
- **Reporting Responsabilità** - Revisioni mensili del contributo alla sicurezza individuale
- *Costo: BASSO | Tempistiche: 2-8 settimane*

### Dipendenze:
- **Adesione del Management** richiesta per modifiche alla responsabilità individuale
- **Coordinamento HR** necessario per aggiornamenti descrizioni mansioni/metriche prestazione
- **Sistemi IT** possono richiedere modifiche di configurazione per il monitoraggio individuale

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura:
**"Quando il Suo team di sicurezza riceve un avviso, chi è specificamente responsabile di rispondere?"**
- *Follow-up: "Come garantisce che qualcuno intraprenda effettivamente un'azione?"*

**"Può mostrarmi come monitora la prestazione della sicurezza individuale vs quella del team?"**
- *Follow-up: "Cosa succede se un individuo sottoperforma costantemente sulla sicurezza?"*

**"Mi illustri il Suo ultimo incidente di sicurezza - chi era individualmente responsabile per ogni passaggio?"**
- *Follow-up: "Come ha garantito che nessuno presumesse che qualcun altro se ne stesse occupando?"*

### Indicatori di Segnale di Allarme:
- **Risposte come "il team se ne occupa"** senza nominare individui specifici
- **Incapacità di mostrare metriche di sicurezza individuali** o misure di responsabilità
- **Esempi di compiti di sicurezza assegnati a gruppi** senza proprietà individuale
- **Account condivisi senza attribuzione individuale** o monitoraggio

### Linguaggio Professionale per Argomenti Sensibili:
- **Invece di "ozio sociale"** → *"garantire la responsabilità individuale nei compiti di sicurezza"*
- **Invece di "le persone fannullano"** → *"ottimizzare il coinvolgimento individuale nella sicurezza"*
- **Invece di "il Suo team sta fallendo"** → *"opportunità per migliorare la responsabilità individuale"*

### Domande di Approfondimento:
**"Come previene che i compiti di sicurezza cadano nelle crepe?"**
**"Cosa succede quando più persone pensano che qualcun altro stia gestendo un problema di sicurezza?"**
**"Come misura i contributi individuali alla Sua postura di sicurezza?"**

---

## 📊 MODELLO DI APPUNTI SUL CAMPO

**Organizzazione:** _____________________ **Data:** __________ **Auditor:** ______________

### Riepilogo Stato Corrente:
□ **Assegnazione Individuale:** ________________________________
□ **Assegnazione Basata su Team:** _______________________________
□ **Approccio Misto:** ____________________________________

### Evidenze Raccolte:
□ **Documenti:** _______________________________________
□ **Demo Sistema:** ___________________________________
□ **Interviste:** ____________________________________

### Risultati Chiave:
**Punti di Forza:** ________________________________________
**Lacune:** __________________________________________
**Problemi Critici:** __________________________________

### Raccomandazioni Immediate:
1. **Priorità 1:** ____________________________________
2. **Priorità 2:** ____________________________________
3. **Priorità 3:** ____________________________________

### Follow-up Richiesto:
□ **Documentazione Aggiuntiva** ________________________
□ **Revisione Configurazione Sistema** ____________________
□ **Discussione con Management** _________________________

### Livello di Confidenza:
□ **Alto** - Evidenze chiare supportano il punteggio
□ **Medio** - Qualche ambiguità nei risultati
□ **Basso** - Richiede indagine aggiuntiva

**Punteggio Finale:** □ Verde □ Giallo □ Rosso

**Tempo di Valutazione:** _______ minuti
