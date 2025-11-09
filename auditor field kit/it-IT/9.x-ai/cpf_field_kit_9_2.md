# 📋 KIT DA CAMPO INDICATORE 9.2: OVERRIDE BIAS AUTOMAZIONE

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Selezionare ogni casella - Solo evidenze osservabili:**

□ **Documentazione Override Esiste**: L'organizzazione ha politiche scritte che richiedono verifica manuale delle decisioni di sicurezza automatizzate

□ **Esempi Override Recenti**: Il personale può citare istanze specifiche (entro 3 mesi) in cui ha questionato/ignorato raccomandazioni automatizzate

□ **Procedure Backup Manuali**: Esistono processi documentati per operazioni di sicurezza quando i sistemi automatizzati non sono disponibili

□ **Esercizi Manuali Regolari**: L'organizzazione conduce esercitazioni di sicurezza senza automazione programmate (mensili/trimestrali)

□ **Requisiti Decisione Duale**: Le azioni di sicurezza critiche richiedono sia approvazione umana CHE consenso del sistema automatizzato

□ **Programma Valutazione Competenze**: L'organizzazione testa il personale sulle capacità di analisi di sicurezza manuale a intervalli regolari

□ **Standard Investigazione Alert**: Le procedure scritte richiedono analisi umana prima di agire su alert automatizzati

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti da Richiedere:
- [ ] **Documentazione Politiche Override** - Procedure scritte per questionare sistemi automatizzati
- [ ] **Log Audit** - 6 mesi di registri override/approvazione sistemi automatizzati
- [ ] **Registri Formazione** - Certificati completamento formazione competenze sicurezza manuali
- [ ] **Documentazione Esercitazioni** - Risultati da esercitazioni sicurezza senza automazione
- [ ] **Procedure Investigazione Alert** - Requisiti verifica manuale passo-passo

### Dimostrazioni Sistema:
- [ ] **"Mi mostri la Sua dashboard SIEM"** - Osservare se il personale spiega elementi automatizzati vs manuali
- [ ] **"Illustri il Suo ultimo alert di sicurezza"** - Documentare livello di investigazione manuale eseguita
- [ ] **"Dimostri analisi log manuale"** - Testare capacità del personale senza strumenti automatizzati

### Obiettivi Interviste:
- [ ] **Manager SOC** - Politiche override e programmi formazione
- [ ] **Analista Sicurezza Senior** - Esempi recenti di questionamento automazione
- [ ] **Operatore Turno Notte** - Procedure manuali durante periodi basso personale
- [ ] **CISO/Direttore Sicurezza** - Approccio strategico a dipendenza automazione

---

## 🎯 MATRICE PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale - Seguire Percorso per Punteggio:

**INIZIARE QUI** → Le politiche override sono documentate?
- **NO** → **ROSSO (2)**
- **SÌ** → Continuare

**Il personale può citare esempi override recenti (ultimi 3 mesi)?**
- **NO** → **ROSSO (2)**
- **SÌ** → Continuare

**Le procedure backup manuali sono documentate E testate?**
- **NO** → **GIALLO (1)**
- **SÌ** → Continuare

**I tassi override rientrano tra 5-15% mensile?**
- **NO** → **GIALLO (1)**
- **SÌ** → **VERDE (0)**

### Soglie Oggettive:
- **VERDE (0)**: Tasso override 5-15%, procedure documentate, esempi recenti, test regolari
- **GIALLO (1)**: Tasso override 0-5% O >15%, alcune procedure, test incoerenti
- **ROSSO (2)**: Tasso override <2%, nessuna procedura, nessun esempio recente, nessuna capacità manuale

---

## 🔧 MATRICE PRIORITÀ SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
- **Tracciamento Tasso Override** (Costo: Basso, Tempo: 2 settimane)
  - Implementare monitoraggio percentuale override mensile
  - Impostare range obiettivo: 5-15% delle raccomandazioni automatizzate
- **Checklist Verifica Manuale** (Costo: Basso, Tempo: 1 settimana)
  - Creare requisiti analisi umana passo-passo per alert

### MEDIO IMPATTO / LUNGO TERMINE
- **Esercitazioni Manuali Mensili** (Costo: Medio, Tempo: 1 mese)
  - Programmare esercizi sicurezza senza automazione
  - Documentare lacune performance per formazione
- **Flusso Lavoro Decisione Duale** (Costo: Medio, Tempo: 6 settimane)
  - Richiedere approvazione umana + automatizzata per azioni critiche

### ALTO IMPATTO / LUNGO TERMINE
- **Programma Valutazione Competenze** (Costo: Alto, Tempo: 3 mesi)
  - Test trimestrale competenza analisi sicurezza manuale
  - Formazione correttiva per performance in declino
- **Strumenti Trasparenza Automazione** (Costo: Alto, Tempo: 6 mesi)
  - Implementare sistemi che mostrano ragionamento decisioni automatizzate

### Dipendenze:
- Consenso management richiesto per programmazione esercitazioni
- Approvazione budget necessaria per strumenti valutazione
- Allocazione tempo personale per pratica competenze manuali

---

## 💬 SCRIPT CONVERSAZIONE CLIENTE (3 minuti)

### Domande Iniziali:
**"Mi parli dell'ultima volta che qualcuno del Suo team non è stato d'accordo con una raccomandazione sicurezza automatizzata."**
- *Follow-up*: "Quanto spesso accade?"
- *Segnale d'Allarme*: Non può fornire esempio specifico o dice "mai"

**"Cosa succede quando il Suo SIEM o monitoraggio automatizzato non funziona?"**
- *Follow-up*: "Può illustrarmi le Sue procedure manuali?"
- *Segnale d'Allarme*: Nessun processo documentato o panico del personale

**"Come garantisce che i Suoi analisti non accettino semplicemente ciò che gli strumenti automatizzati dicono loro?"**
- *Follow-up*: "Mi mostri i Suoi requisiti di verifica."
- *Segnale d'Allarme*: "Ci fidiamo del sistema" o nessun processo di verifica

### Approfondimento:
**"Descriva la Sua più recente investigazione alert di sicurezza."**
- *Cercare*: Passi manuali, verifica indipendente, giudizio umano
- *Segnale d'Allarme*: "Ho solo seguito quello che ha detto il sistema"

**"Come forma il personale sull'analisi sicurezza manuale?"**
- *Follow-up*: "Quando è stata l'ultima formazione competenze manuali?"
- *Segnale d'Allarme*: Solo formazione strumenti automazione

### Approccio Argomenti Sensibili:
**"Ogni organizzazione bilancia efficienza automazione con supervisione umana. Mi aiuti a capire il Suo approccio."**
- *Evita*: Suggerire che stanno facendo qualcosa di sbagliato
- *Consente*: Discussione aperta sulle pratiche attuali

---

## 📊 TEMPLATE NOTE DA CAMPO

### Evidenze Override:
```
Politica Override: □ Esiste □ Mancante □ Incompleta
Esempi Recenti: □ Multipli □ Singolo □ Nessuno
Tasso Override: ___% (Obiettivo: 5-15%)
Fiducia Personale: □ Alta □ Media □ Bassa
```

### Capacità Manuali:
```
Procedure Backup: □ Documentate □ Solo Verbali □ Nessuna
Ultima Esercitazione Manuale: _____ (Data)
Risultati Esercitazione: □ Successo □ Lacune Trovate □ Fallimento
Test Competenze: □ Regolare □ Occasionale □ Nessuno
```

### Dipendenza Automazione:
```
Risposta Downtime Sistema: □ Preparati □ Ritardati □ Panico
Investigazione Alert: □ Sempre Manuale □ A volte □ Mai
Fiducia Decisione senza Automazione: □ Alta □ Media □ Bassa
Bilanciamento Formazione: ___% Manuale ___% Strumenti Automazione
```

### Indicatori Rischio:
```
□ Personale non può operare senza strumenti automatizzati
□ Nessuno ricorda di aver ignorato raccomandazioni sistema
□ Panico quando automazione fallisce
□ 100% deferenza a output algoritmici
□ Nessuna formazione analisi sicurezza manuale
□ Investigazione alert = "cliccare approva"
□ Downtime significa operazioni sicurezza si fermano
```

### Azioni Immediate Richieste:
```
□ Implementare tracciamento override immediatamente
□ Programmare esercitazione manuale entro 30 giorni
□ Documentare procedure backup
□ Formare personale su questionamento automazione
□ Stabilire requisiti decisione duale
```

---

**Valutazione Completata** ✅
**Tempo Totale**: ~22 minuti
**Prossimi Passi**: Generare report risultati e raccomandazioni soluzioni
