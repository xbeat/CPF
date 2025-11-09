# 📋 KIT SUL CAMPO CPF 2.1: Bypass di Sicurezza Indotto dall'Urgenza

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Spunti SÌ/NO per ciascun indicatore osservabile:**

- [ ] **SÌ/NO**: L'organizzazione dispone di procedure documentate di accesso di emergenza con limiti di tempo automatici
- [ ] **SÌ/NO**: La leadership senior richiede di bypassare le normali procedure di sicurezza durante situazioni urgenti
- [ ] **SÌ/NO**: L'utilizzo dell'accesso di emergenza aumenta significativamente durante i periodi di fine trimestre/fine anno
- [ ] **SÌ/NO**: Gli incidenti di sicurezza correlano con periodi di scadenze ad alta pressione
- [ ] **SÌ/NO**: I dipendenti condividono credenziali o utilizzano strumenti non autorizzati durante scadenze strette
- [ ] **SÌ/NO**: Le revisioni di sicurezza vengono regolarmente saltate o accelerate sotto pressione temporale
- [ ] **SÌ/NO**: L'organizzazione traccia le richieste di eccezione di sicurezza rispetto al calendario aziendale

**Valutazione Rapida del Rischio**:
- **0-2 risposte SÌ**: Procedere con la raccolta delle evidenze
- **3-4 risposte SÌ**: Richiesta valutazione ad alta priorità
- **5-7 risposte SÌ**: Vulnerabilità critica presente

---

## 📝 RACCOLTA DELLE EVIDENZE (10 minuti)

### Documenti da Richiedere
- [ ] Politiche e procedure di accesso di emergenza
- [ ] Log (registri) di eccezioni di sicurezza (ultimi 12 mesi)
- [ ] Log di utilizzo dell'accesso di emergenza (ultimi 12 mesi)
- [ ] Rapporti recenti di incidenti con timestamp (marcature temporali)
- [ ] Log di gestione del cambiamento (change management) durante i recenti periodi di scadenza

### Dimostrazioni di Sistema
- [ ] **"Mi mostri come viene concesso l'accesso di emergenza"**
- [ ] **"Mi illustri la Sua ultima eccezione di sicurezza urgente"**
- [ ] **"Mi dimostri cosa succede quando i dirigenti hanno bisogno di accesso immediato"**
- [ ] **"Mi mostri i log delle revisioni di sicurezza durante i periodi di scadenza"**

### Target delle Interviste
- [ ] **Responsabile Sicurezza IT**: Procedure di emergenza e frequenza di override (sostituzioni)
- [ ] **Personale Operazioni IT**: Pressione a bypassare durante le scadenze
- [ ] **Responsabili di Reparto**: Esempi di richieste di accesso urgente
- [ ] **Help Desk**: Pattern di chiamate per accesso di emergenza

### Controlli di Sistema
- [ ] Rivedere i log di autenticazione per picchi di account condivisi
- [ ] Controllare i pattern di attività degli account di accesso di emergenza
- [ ] Esaminare i tempi di risposta agli avvisi di sicurezza durante i periodi intensi
- [ ] Verificare la funzionalità di revoca automatica dell'accesso

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale

**Inizio**: L'organizzazione dispone di procedure di emergenza?

**SE NO** → **ROSSO (2 punti)**

**SE SÌ** → Continuare alla domanda successiva:

**Le procedure di emergenza vengono bypassate sotto pressione?**
- **Regolarmente bypassate** → **ROSSO (2 punti)**
- **Talvolta bypassate** → Continuare al controllo di correlazione
- **Raramente bypassate** → Continuare al controllo di correlazione

**Esiste correlazione tra scadenze e incidenti di sicurezza?**
- **Pattern chiaro esiste** → **ROSSO (2 punti)**
- **Qualche correlazione** → **GIALLO (1 punto)**
- **Nessuna correlazione** → **VERDE (0 punti)**

### Criteri di Override
- **La leadership richiede frequentemente override** → **ROSSO**
- **Condivisione di credenziali è comune durante le scadenze** → **ROSSO**
- **>30% di aumento nell'accesso di emergenza durante i periodi di scadenza** → **ROSSO**

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO - Implementazione Rapida
- [ ] **Accesso di Emergenza Automatizzato** (costo BASSO, 2-4 settimane)
- [ ] **Prevenzione Bypass Dirigenziale** (costo MEDIO, 4-6 settimane)
- [ ] **Politica di Buffer Temporale** (costo BASSO, 1-2 settimane)

### IMPATTO MEDIO - Medio Termine
- [ ] **Monitoraggio Periodo di Stress** (costo MEDIO, 6-8 settimane)
- [ ] **Formazione sul Riconoscimento dell'Urgenza** (costo BASSO, 8-12 settimane)
- [ ] **Integrazione Risposta alle Crisi** (costo ALTO, 12-16 settimane)

### Dipendenze
- **I sistemi automatizzati richiedono**: Approvazione del management, allocazione del budget
- **I programmi di formazione richiedono**: Coordinamento delle pianificazioni, sviluppo dei materiali
- **Le modifiche alle politiche richiedono**: Revisione legale, adesione degli stakeholder (portatori di interesse)

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Può illustrarmi cosa succede quando qualcuno ha bisogno di accesso di emergenza durante i Suoi periodi più intensi?"**

**Follow-up:**
- "Con quale frequenza succede effettivamente?"
- "Chi tipicamente fa queste richieste?"
- "Qual è il processo di approvazione?"

### Domande sui Punti di Pressione
**"Mi racconti dell'ultima volta che un dirigente senior ha avuto bisogno di accesso immediato a qualcosa che normalmente richiede passaggi di sicurezza aggiuntivi."**

**Follow-up:**
- "Qual era la giustificazione aziendale?"
- "Quanto tempo ha richiesto il processo?"
- "Sono state modificate procedure normali?"

### Indicatori di Red Flag (Segnale di Allarme)
- **Risposte vaghe** sulle procedure di emergenza
- **"Ci fidiamo delle nostre persone"** invece di controlli documentati
- **Multipli esempi** di bypass recenti
- **Reazioni difensive** alle domande sui bypass
- **Nessun tracciamento di correlazione** tra scadenze e sicurezza

### Sondaggi Professionali
**"Durante i periodi ad alta pressione, quali procedure di sicurezza vengono tipicamente adattate per rispettare le scadenze?"**

**"Come verifica la Sua organizzazione le richieste urgenti che sembrano provenire dalla leadership?"**

---

## 📊 TEMPLATE NOTE SUL CAMPO

### Riepilogo della Valutazione
**Data**: ________________  **Valutatore**: ________________

**Punteggio Complessivo**: ⬜ VERDE (0) ⬜ GIALLO (1) ⬜ ROSSO (2)

### Risultati Chiave
**Esistono Procedure di Emergenza**: ⬜ SÌ ⬜ NO
**Procedure Regolarmente Bypassate**: ⬜ SÌ ⬜ NO
**Pattern di Override Leadership**: ⬜ SÌ ⬜ NO
**Correlazione Scadenze-Incidenti**: ⬜ SÌ ⬜ NO

### Evidenze Critiche
**Risultato Più Preoccupante**:
_________________________________________________

**Fattore di Rischio Immediato**:
_________________________________________________

### Raccomandazioni di Soluzione
**Priorità 1 (Immediata)**:
_________________________________________________

**Priorità 2 (30 giorni)**:
_________________________________________________

**Priorità 3 (90 giorni)**:
_________________________________________________

### Metriche di Successo da Stabilire
- [ ] Misurazione baseline del rapporto di accesso di emergenza
- [ ] Tracciamento della correlazione delle eccezioni di sicurezza
- [ ] Monitoraggio della frequenza di override dirigenziale

### Follow-up Richiesto
- [ ] Necessarie interviste aggiuntive agli stakeholder
- [ ] Richiesta analisi dei log di sistema
- [ ] In attesa revisione della documentazione delle politiche
- [ ] Necessaria verifica dei controlli tecnici

---

**⚠️ NOTE PER L'AUDITOR**:
- Concentrarsi sui pattern osservabili, non sui singoli incidenti
- Documentare esempi specifici con timestamp quando possibile
- Mantenere un tono professionale quando si discutono i pattern di bypass della leadership
- Enfatizzare i benefici della continuità aziendale delle procedure di urgenza sicure
