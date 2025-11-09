# 📋 KIT SUL CAMPO INDICATORE 3.10: Conflitti di Gestione della Reputazione

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Spuntare SÌ/NO per ogni indicatore osservabile:**

□ **SÌ/NO**: L'organizzazione ha ricevuto >15% di richieste di eccezione di sicurezza nell'ultimo trimestre
□ **SÌ/NO**: La condivisione di credenziali avviene tra team collaborativi/rivolti ai clienti
□ **SÌ/NO**: La segnalazione di incidenti di sicurezza richiede in media >8 ore dalla scoperta
□ **SÌ/NO**: Le richieste dei dirigenti bypassano i normali processi di verifica
□ **SÌ/NO**: Le revisioni delle prestazioni escludono metriche di conformità alla sicurezza
□ **SÌ/NO**: I dipendenti citano regolarmente "relazioni con i clienti" per bypass di sicurezza
□ **SÌ/NO**: Le procedure di sicurezza degradano visibilmente durante periodi di scadenza

**Punteggio Rapido**: 0-2 SÌ = Verde | 3-4 SÌ = Giallo | 5+ SÌ = Rosso

---

## 📝 RACCOLTA DI PROVE (10 minuti)

### Documenti da Richiedere
- [ ] **Log eccezioni di sicurezza** (ultimi 6 mesi con tassi di approvazione)
- [ ] **Record tempistica risposta agli incidenti** (scoperta a notifica)
- [ ] **Modelli revisione prestazioni dipendenti** (verificare metriche di sicurezza)
- [ ] **Procedure accomodamento clienti** (policy scritte)
- [ ] **Protocolli richieste dirigenti** (requisiti di verifica)

### Dimostrazioni di Sistema
- [ ] **Mostrare workflow approvazione eccezioni** (se esiste sistema automatizzato)
- [ ] **Dimostrare analisi accessi utenti** (rilevamento condivisione credenziali)
- [ ] **Visualizzare sistema segnalazione incidenti** (tempi di risposta medi)
- [ ] **Revisionare analisi comportamentale** (pattern di rischio relativi alla reputazione)

### Interviste Chiave (15 min ciascuna)
- [ ] **Responsabile Sicurezza IT**: Gestione eccezioni, ritardi segnalazione incidenti
- [ ] **Responsabile Vendite/Clienti**: Pressioni accomodamento clienti, condivisione credenziali
- [ ] **Responsabile HR/Prestazioni**: Metriche sicurezza nelle revisioni, pattern di pressione
- [ ] **Assistente Dirigente**: Gestione richieste dirigenti, bypass verifica

### Controlli di Sistema
- [ ] **Analisi login**: Prove di credenziali condivise o pattern insoliti
- [ ] **Dashboard eccezioni**: Frequenza, approvazioni, giustificazioni aziendali
- [ ] **Ticket help desk**: Richieste "urgenti" relative alla sicurezza da dirigenti

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale

**INIZIO**: Contare risposte SÌ dalla Valutazione Rapida

**SE 0-2 risposte SÌ:**
- E richieste eccezione <5% del totale → **VERDE**
- E segnalazione incidenti media <2 ore → **VERDE**
- ALTRIMENTI → **GIALLO**

**SE 3-4 risposte SÌ:**
- E tasso approvazione eccezioni >80% → **ROSSO**
- E degradazione sicurezza sistematica durante pressione → **ROSSO**
- ALTRIMENTI → **GIALLO**

**SE 5+ risposte SÌ:** → **ROSSO**

### Soglie Obiettive
- **Tasso Eccezioni**: <5% = Verde | 5-15% = Giallo | >15% = Rosso
- **Segnalazione Incidenti**: <2ore = Verde | 2-8ore = Giallo | >8ore = Rosso
- **Integrazione Prestazioni**: ≥20% peso = Verde | Qualche menzione = Giallo | Nessuna = Rosso

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / VITTORIE RAPIDE (Implementare Per Prime)
**Costo: Basso | Tempistica: 1-4 settimane**
- [ ] **Autorizzazione due persone** per eccezioni dirigenti/clienti
- [ ] **Integrazione metriche prestazioni sicurezza** (peso minimo 20%)
- [ ] **Template comunicazione clienti** per spiegare requisiti sicurezza
- [ ] **Dashboard tracciamento eccezioni** con escalation automatica

### MEDIO IMPATTO / SFORZO MODERATO
**Costo: Medio | Tempistica: 2-6 mesi**
- [ ] **Programma formazione sicurezza positiva per reputazione**
- [ ] **Sistema analisi comportamentale** per rischi guidati dalla reputazione
- [ ] **Sistema workflow automatizzato** per richieste eccezioni
- [ ] **Programma riconoscimento** per conformità sicurezza sotto pressione

### STRATEGICO / LUNGO TERMINE
**Costo: Alto | Tempistica: 6+ mesi**
- [ ] **Iniziativa trasformazione culturale** (sicurezza come competenza)
- [ ] **Programma modellamento leadership** (conformità sicurezza dirigenti)
- [ ] **Riprogettazione workflow integrato** (sicurezza integrata nei processi aziendali)

---

## 💬 SCRIPT DI CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Mi parli delle Sue recenti richieste di eccezione di sicurezza..."**
- Follow-up: *"Quale percentuale è stata approvata e perché?"*
- Bandiera rossa: *Tasso approvazione >80% o giustificazioni vaghe*

**"Quando i clienti Le chiedono di bypassare la sicurezza per convenienza..."**
- Follow-up: *"Può darmi un esempio recente specifico?"*
- Bandiera rossa: *Bypass di routine con giustificazioni "relazionali"*

**"Quanto rapidamente gli incidenti di sicurezza vengono segnalati all'IT?"**
- Follow-up: *"Mi parli di un recente ritardo e della ragione."*
- Bandiera rossa: *Ritardi >8 ore o scuse di "indagine"*

### Script Argomenti Sensibili
**Per condivisione credenziali:** *"Sto vedendo alcuni pattern di login che suggeriscono accesso condiviso. Questo è comune in ambienti collaborativi - può aiutarmi a capire le Sue pratiche attuali?"*

**Per pressione dirigenti:** *"Quando la leadership senior necessita eccezioni urgenti, qual è il Suo processo standard?"*

**Per preoccupazioni prestazioni:** *"Come bilanciano le Sue revisioni delle prestazioni la conformità alla sicurezza con gli obiettivi aziendali?"*

---

## 📊 MODELLO NOTE SUL CAMPO

### Riepilogo Valutazione
**Data**: _________ **Revisore**: _________________ **Cliente**: _________________

**Punteggio Valutazione Rapida**: ___/7 **Livello Rischio**: Verde / Giallo / Rosso

### Prove Raccolte
□ Log eccezioni (tasso ___%, approvati ___%)
□ Tempi risposta incidenti (media: ___ ore)
□ Template prestazioni (peso sicurezza: ___%)
□ Documentazione policy (completa/incompleta/mancante)

### Risultati Chiave
**Comportamenti a Rischio Più Alto**:
1. _________________________________
2. _________________________________
3. _________________________________

**Comportamenti Sicurezza Positivi**:
1. _________________________________
2. _________________________________

### Raccomandazioni Immediate (Top 3)
1. **Priorità 1**: ________________________________
   - Impatto: Alto/Medio/Basso | Sforzo: Basso/Medio/Alto
2. **Priorità 2**: ________________________________
   - Impatto: Alto/Medio/Basso | Sforzo: Basso/Medio/Alto
3. **Priorità 3**: ________________________________
   - Impatto: Alto/Medio/Basso | Sforzo: Basso/Medio/Alto

### Azioni di Follow-Up
□ **Programmare presentazione al management** (se punteggio Rosso/Giallo)
□ **Richiedere documentazione aggiuntiva**: _________________
□ **Pianificare valutazione follow-up** tra ___ mesi
□ **Escalare a leadership cliente** (se risultati critici)

---

## 🚨 BANDIERE ROSSE CRITICHE

**Escalation Immediata Richiesta:**
- [ ] Tentativi di frode CEO riusciti a causa di pressione reputazione
- [ ] Dati clienti esposti attraverso bypass di accomodamento
- [ ] Sotto-segnalazione sistematica di incidenti di sicurezza
- [ ] Richieste dirigenti bypassano TUTTI i processi di verifica
- [ ] Sicurezza completamente abbandonata durante periodi di pressione

**Passi Successivi per Bandiere Rosse:**
1. Documentare incidenti specifici con tempistica
2. Notificare immediatamente leadership cliente
3. Raccomandare misure di rimedio di emergenza
4. Programmare follow-up entro 30 giorni

---

**Valutazione Completa** ✅
**Tempo Totale**: _____ minuti
**Livello di Confidenza**: Alto / Medio / Basso
**Richiede Follow-up**: Sì / No
