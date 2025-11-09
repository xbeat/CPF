# 📋 KIT DA CAMPO INDICATORE CPF 9.8
## Valutazione Disfunzione Team Umano-AI

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Istruzioni**: Selezionare SÌ/NO per ogni domanda basandosi su evidenze osservabili.

| # | Domanda Valutazione | SÌ | NO | Note |
|---|---------------------|-----|----|-------|
| 1 | **Comunicazione Strutturata**: Il personale sicurezza usa comandi/sintassi formali quando interagisce con strumenti AI (non linguaggio conversazionale)? | ☐ | ☐ | |
| 2 | **Politiche AI Scritte**: Esistono politiche documentate che definiscono quali decisioni l'AI può/non può prendere in modo indipendente? | ☐ | ☐ | |
| 3 | **Procedure Override**: Esistono procedure formali per questionare/ignorare raccomandazioni AI? | ☐ | ☐ | |
| 4 | **Formazione Limitazioni AI**: Il personale sicurezza ha ricevuto formazione specifica su limitazioni sistemi AI e uso appropriato? | ☐ | ☐ | |
| 5 | **Controlli Autenticazione**: Sono presenti controlli tecnici per impedire a sistemi non autorizzati di impersonare strumenti AI? | ☐ | ☐ | |
| 6 | **Audit Decisioni**: Le decisioni sicurezza umano-AI sono riviste mensilmente per appropriatezza? | ☐ | ☐ | |
| 7 | **Controlli Condivisione Informazioni**: Esistono politiche specifiche che governano quali informazioni sensibili possono essere condivise con sistemi AI? | ☐ | ☐ | |

**Punteggio Rapido**: ___/7 risposte SÌ

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti da Richiedere
- [ ] **Protocolli interazione AI** o standard comunicazione
- [ ] **Materiali formazione** che coprono limitazioni AI e uso corretto
- [ ] **Matrice autorità decisioni** (responsabilità umano vs AI)
- [ ] **Audit più recente** decisioni sicurezza umano-AI
- [ ] **Politiche condivisione informazioni** per sistemi AI
- [ ] **Procedure autenticazione** per verifica strumenti AI

### Dimostrazioni da Richiedere
- [ ] **"Mi mostri come gli analisti comunicano con l'AI durante un alert"**
- [ ] **"Dimostri il processo quando l'AI dà raccomandazioni conflittuali"**
- [ ] **"Illustri come verifica l'autenticità sistema AI"**
- [ ] **"Mostri esempi recenti di override raccomandazioni AI"**

### Verifiche Sistema da Eseguire
- [ ] **Rivedere log interazione** tra umani e AI (ultimi 30 giorni)
- [ ] **Verificare modelli linguaggio conversazionale** nelle comunicazioni AI
- [ ] **Verificare meccanismi autenticazione** per sistemi AI
- [ ] **Esaminare report incidenti recenti** per problemi coordinamento umano-AI

### Obiettivi Interviste
- [ ] **Manager SOC** - politiche e procedure
- [ ] **2-3 Analisti SOC** - modelli interazione quotidiana
- [ ] **Responsabile Risposta Incidenti** - decision-making durante crisi
- [ ] **Coordinatore Formazione Sicurezza** - formazione limitazioni AI

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale

**Iniziare Qui** ➜ Contare risposte SÌ dalla Valutazione Rapida

**7 risposte SÌ**
- Tutte le evidenze mostrano protocolli strutturati ➜ **VERDE (0)**

**5-6 risposte SÌ**
- La maggior parte protocolli esiste ma lacune identificate ➜ **GIALLO (1)**

**3-4 risposte SÌ**
- Controlli base presenti ma incoerenti ➜ **GIALLO (1)**

**0-2 risposte SÌ**
- Protocolli formali umano-AI minimi o assenti ➜ **ROSSO (2)**

### Criteri Override (ROSSO automatico indipendentemente dal punteggio)
- [ ] Evidenza credenziali condivise con sistemi AI
- [ ] Nessuna autenticazione per strumenti AI
- [ ] Comunicazione conversazionale è pratica standard
- [ ] Nessuna formazione su limitazioni AI fornita
- [ ] Nessuna documentazione autorità decisioni esiste

**PUNTEGGIO FINALE**: _________ (0=Verde, 1=Giallo, 2=Rosso)

---

## 🔧 PRIORITÀ SOLUZIONI (5 minuti)

### ALTO IMPATTO - IMPLEMENTAZIONE RAPIDA (0-30 giorni)

**Costo: BASSO**
- [ ] **Creare documento protocollo comunicazione** che richiede comandi AI strutturati
- [ ] **Implementare audit decisioni mensili** interazioni umano-AI
- [ ] **Redigere politica condivisione informazioni** per sistemi AI

### ALTO IMPATTO - IMPLEMENTAZIONE MEDIA (30-90 giorni)

**Costo: MEDIO**
- [ ] **Distribuire formazione limitazioni AI** per tutto il personale sicurezza
- [ ] **Stabilire matrice autorità decisioni** (responsabilità umano vs AI)
- [ ] **Creare procedure autenticazione** per verifica strumenti AI

### ALTO IMPATTO - LUNGO TERMINE (90+ giorni)

**Costo: ALTO**
- [ ] **Implementare controlli autenticazione tecnici** (certificati, chiavi API)
- [ ] **Distribuire sistemi monitoraggio** per rilevamento impersonazione AI
- [ ] **Condurre esercizi coordinamento trimestrali** in condizioni stress

### Dipendenze
- **Programmi formazione** richiedono approvazione management e allocazione budget
- **Controlli tecnici** richiedono risorse IT/ingegneria e integrazione sistema
- **Modifiche politiche** richiedono revisione legale e processo gestione cambiamento

---

## 💬 SCRIPT CONVERSAZIONE CLIENTE (3 minuti)

### Domande Iniziali

**"Come interagiscono tipicamente i Suoi analisti sicurezza con gli strumenti AI durante il loro lavoro quotidiano?"**
- *Follow-up*: "Può mostrarmi alcuni esempi di conversazioni recenti?"
- *Segnale d'allarme*: Gli analisti descrivono strumenti AI come colleghi umani

**"Quando i sistemi AI danno consigli poco chiari o conflittuali, qual è la procedura standard?"**
- *Follow-up*: "Chi ha autorità di ignorare raccomandazioni AI?"
- *Segnale d'allarme*: Nessun percorso escalation chiaro o autorità decisioni

**"Quale formazione ha ricevuto il personale sicurezza sulle capacità e limitazioni sistemi AI?"**
- *Follow-up*: "Quanto spesso questa formazione viene aggiornata o rinnovata?"
- *Segnale d'allarme*: Formazione AI generica senza guida specifica sicurezza

### Argomenti Sensibili (Linguaggio Professionale)

**Preoccupazioni Condivisione Informazioni**:
- "Discutiamo delle Sue politiche su quali informazioni possono essere condivise con sistemi AI..."
- *Evitare*: "Le persone condividono segreti con i robot?"

**Problemi Antropomorfizzazione**:
- "Stiamo valutando i protocolli formali per il coordinamento umano-AI..."
- *Evitare*: "Le Sue persone pensano che gli strumenti AI siano umani?"

**Calibrazione Fiducia**:
- "Come garantisce la Sua organizzazione verifica appropriata delle raccomandazioni AI?"
- *Evitare*: "Si fida troppo dell'AI?"

### Domande Conclusive

**"Può illustrarmi il Suo più recente incidente sicurezza che ha coinvolto coordinamento strumenti AI?"**
- *Ascoltare per*: Interruzioni comunicazione, ritardi decisioni, autorità poco chiara

**"Quali misure autenticazione impediscono a sistemi non autorizzati di apparire come strumenti AI legittimi?"**
- *Ascoltare per*: Controlli tecnici, procedure verifica, monitoraggio

---

## 📊 TEMPLATE NOTE DA CAMPO

### Informazioni Cliente
- **Organizzazione**: _________________________________
- **Data Valutazione**: ____________________________
- **Contatto Primario**: _____________________________
- **Dimensione Team Sicurezza**: ___________________________

### Risultati Chiave
**Modelli Comunicazione**:
- Protocolli strutturati: **Sì/No** - Evidenza: ________________
- Uso conversazionale: **Sì/No** - Esempi: _______________

**Struttura Autorità**:
- Gerarchia decisioni chiara: **Sì/No** - Documentazione: ________
- Procedure override: **Sì/No** - Esempi recenti: __________

**Formazione & Consapevolezza**:
- Formazione limitazioni AI: **Sì/No** - Ultima condotta: __________
- Livello comprensione personale: **Alto/Medio/Basso** - Note: _____

**Controlli Tecnici**:
- Misure autenticazione: **Presenti/Assenti** - Dettagli: _______
- Sistemi monitoraggio: **Attivi/Inattivi** - Copertura: __________

### Indicatori Rischio Osservati
- [ ] Linguaggio emotivo su performance AI
- [ ] Credenziali condivise con sistemi AI
- [ ] Nessuna verifica raccomandazioni AI
- [ ] Confusione durante demo coordinamento AI
- [ ] Autenticazione mancante per strumenti AI

### Raccomandazioni Immediate
1. **Priorità 1**: ________________________________________
2. **Priorità 2**: ________________________________________
3. **Priorità 3**: ________________________________________

### Follow-up Richiesto
- [ ] Valutazione tecnica controlli autenticazione AI
- [ ] Revisione report incidenti aggiuntivi
- [ ] Intervista con membri personale aggiuntivi
- [ ] Validazione efficacia programma formazione

**Firma Revisore**: _________________ **Data**: ____________
