# 📋 CPF INDICATORE 5.7 FIELD KIT: Sovraccarico della Memoria di Lavoro

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Marcare tutto ciò che si applica - Cercare evidenza oggettiva:**

□ **Sovraccarico Allerta**: Gli analisti gestiscono regolarmente 6+ allerta di sicurezza concorrenti durante le operazioni normali?

□ **Cambio Strumento**: Una tipica investigazione di incidente richiede l'accesso a 5+ strumenti/interfacce di sicurezza diverse?

□ **Nessun Controllo Interruzioni**: Tutte le allerta di sicurezza sono trattate come ugualmente urgenti senza sistema di triage?

□ **Documentazione Manuale**: Gli analisti creano manualmente report di incidente mentre rispondono attivamente alle minacce?

□ **Passaggi Complessi**: I cambi di turno coinvolgono il trasferimento di 8+ problemi in corso tra i team?

□ **Lacune Periodo di Picco**: I livelli di personale sono gli stessi durante periodi di stress prevedibili ad alto stress (lunedì mattina, post-festività)?

□ **Nessun Tracciamento Errori**: Non esiste sistema per tracciare gli errori durante periodi di allerta elevate vs operazioni normali?

**Punteggio**: 0-2 marcati = Verde | 3-5 marcati = Giallo | 6-7 marcati = Rosso

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti da Richiedere:
- [ ] Report volume allerta SIEM (ultimi 30 giorni)
- [ ] Inventario strumenti di sicurezza e requisiti di accesso
- [ ] Procedure di risposta agli incidenti e template
- [ ] Esempi documentazione passaggi di turno
- [ ] Pianificazioni personale per periodi di picco
- [ ] Metriche errori/qualità per operazioni di sicurezza

### Dimostrazioni da Richiedere:
- [ ] "Mi mostri come investiga un'allerta di sicurezza tipica"
- [ ] "Mi illustri il Suo processo di passaggio di turno"
- [ ] "Dimostri come gestisce più allerta concorrenti"
- [ ] "Mi mostri il Suo processo di documentazione durante un incidente attivo"

### Controlli di Sistema da Eseguire:
- [ ] Contare strumenti di sicurezza che richiedono login separato
- [ ] Rivedere complessità dashboard SIEM e volume allerta
- [ ] Controllare sistemi di monitoraggio carico di lavoro
- [ ] Verificare automazione nei flussi di lavoro di documentazione

### Obiettivi di Intervista:
- [ ] **Analisti SOC**: Carico di lavoro giornaliero e periodi di stress di picco
- [ ] **Manager SOC**: Decisioni di personale e pattern di errori
- [ ] **Team Lead Risposta Incidenti**: Sfide di coordinamento e cambio strumento
- [ ] **CISO**: Allocazione risorse durante periodi di allerta elevate

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

**Seguire questo albero decisionale:**

### VERDE (0): Bassa Vulnerabilità
**Se TUTTI sono veri:**
- Gli analisti gestiscono max 3-4 elementi concorrenti durante i picchi
- Strumenti single-pane-of-glass O <4 interfacce per incidente
- Esiste ruolo dedicato al triage
- Documentazione automatizzata riduce lavoro manuale >50%
- Procedure passaggio strutturate con limiti di complessità

### ROSSO (2): Alta Vulnerabilità
**Se UNO QUALSIASI è vero:**
- Gli analisti gestiscono routinariamente 8+ elementi concorrenti
- Richiede 7+ strumenti diversi per investigazione tipica
- Nessuna gestione formale delle interruzioni
- Documentazione manuale estensiva durante risposta attiva
- Procedure passaggio ad-hoc senza limiti

### GIALLO (1): Vulnerabilità Moderata
**Tutte le altre situazioni**

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
- **Dashboard Carico Cognitivo** (Costo: Medio)
  - Monitoraggio carico di lavoro analisti in tempo reale
  - Escalation automatica quando >4 compiti concorrenti
  - Dipendenze: Integrazione SIEM

- **Protocollo Gestione Interruzioni** (Costo: Basso)
  - Ruolo dedicato al triage durante analisi complessa
  - Periodi "Non disturbare" >30 minuti
  - Dipendenze: Formazione personale

### ALTO IMPATTO / LUNGO TERMINE
- **Piattaforma di Sicurezza Integrata** (Costo: Alto)
  - Soluzione SIEM/SOAR single-pane-of-glass
  - Riduce cambio strumento da 7+ a 2-3 interfacce
  - Dipendenze: Investimento tecnologico importante

- **Documentazione Automatizzata** (Costo: Medio)
  - Flussi di lavoro SOAR auto-generano report incidenti
  - Riduzione 70% documentazione manuale
  - Dipendenze: Implementazione piattaforma SOAR

### MEDIO IMPATTO / IMPLEMENTAZIONE RAPIDA
- **Personale Periodo di Picco** (Costo: Medio)
  - Personale predittivo basato su pattern storici
  - Supporto on-call durante periodi di picco identificati
  - Dipendenze: Analisi dati storici

- **Aiuti Working Memory** (Costo: Basso)
  - Template investigazione standardizzati
  - Checklist digitali e flussi di lavoro visivi
  - Dipendenze: Sviluppo template

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura:
**"Durante il Suo giorno di sicurezza più intenso del mese scorso, quante cose diverse stava gestendo simultaneamente ciascun analista?"**
- *Follow-up*: "Può illustrarmi quello specifico giorno?"

**"Quando investiga un incidente di sicurezza, in quanti sistemi diversi deve effettuare il login il Suo team?"**
- *Follow-up*: "Può mostrarmi il flusso di lavoro tipico?"

### Indicatori Segnale d'Allarme:
- **Menzioni Burnout Analisti**: "Il nostro personale è esaurito"
- **Riconoscimenti Errori**: "A volte le cose ci sfuggono"
- **Frustrazione Strumenti**: "Abbiamo troppi sistemi che non comunicano tra loro"
- **Caos Periodo di Picco**: "I lunedì mattina sono sempre pazzi"

### Argomenti Delicati - Linguaggio Professionale:
- **Invece di**: "Il Suo team è sovraccaricato cognitivamente"
- **Dica**: "I Suoi analisti stanno gestendo alti volumi informativi"

- **Invece di**: "Working memory overflow"
- **Dica**: "Vincoli di capacità durante periodi di picco"

### Prompt di Follow-up:
- "Cosa succede quando arrivano allerta urgenti durante investigazioni complesse?"
- "Come garantisce che nulla venga perso durante i cambi di turno?"
- "Quali pattern nota negli errori di sicurezza durante periodi intensi?"

---

## 📊 MODELLO NOTE DI CAMPO

**Cliente**: _________________________ **Data**: _____________

**Auditor**: _______________________ **Ora**: _____________

### Risultati Valutazione Rapida:
□ Sovraccarico Allerta □ Cambio Strumento □ Nessun Controllo Interruzioni
□ Documentazione Manuale □ Passaggi Complessi □ Lacune Periodo Picco □ Nessun Tracciamento Errori

**Punteggio**: _______ (0-2 Verde | 3-5 Giallo | 6-7 Rosso)

### Evidenze Chiave Osservate:
- **Picco allerta concorrenti/analista**: _______
- **Strumenti richiesti per incidente**: _______
- **Gestione interruzioni**: Sì/No
- **Automazione documentazione**: ____%
- **Complessità passaggio**: _______

### Citazioni Critiche:
```
"_________________________________________________"
"_________________________________________________"
"_________________________________________________"
```

### Segnali d'Allarme Immediati:
□ Analisti menzionano essere "sopraffatti"
□ Nessun processo di triage chiaro osservato
□ Incidenti multipli mancati a causa del volume
□ Turnover personale attribuito allo stress
□ Processi manuali durante risposta crisi

### Priorità Soluzioni per Cliente:
**ALTA**: ___________________________________
**MEDIA**: _________________________________
**BASSA**: ___________________________________

### Prossimi Passi:
□ Programmare follow-up per discussione soluzioni
□ Richiedere documentazione aggiuntiva
□ Proporre implementazioni vittoria rapida
□ Escalare a leadership senior

**Valutazione Completata**: _______minuti
