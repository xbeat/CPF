# KIT DA CAMPO CPF 9.6: Fiducia Opacità Machine Learning

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Selezionare SÌ/NO per ogni indicatore osservabile:**

□ **Log Decisioni AI**: L'organizzazione mantiene ragionamento documentato per raccomandazioni AI di sicurezza?
□ **Evidenza Override**: Può trovare esempi di personale che ignora raccomandazioni AI negli ultimi 3 mesi?
□ **Trasparenza Fornitore**: I contratti fornitori AI includono requisiti spiegabilità?
□ **Processo Verifica**: Esiste un processo documentato per validare indipendentemente decisioni AI di sicurezza?
□ **Formazione Personale**: Il personale sicurezza ha ricevuto formazione su quando questionare raccomandazioni AI?
□ **Documentazione Fallimenti**: L'organizzazione può descrivere un'istanza recente in cui l'AI ha fornito analisi errata?
□ **Calibrazione Fiducia**: I membri del personale cercano regolarmente seconde opinioni su raccomandazioni AI inusuali?

**Livello Rischio Iniziale**:
- 6-7 SÌ = Verde (Rischio Basso)
- 3-5 SÌ = Giallo (Rischio Moderato)
- 0-2 SÌ = Rosso (Rischio Alto)

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti da Richiedere
□ Log audit strumenti sicurezza AI (ultimi 90 giorni)
□ Registri formazione personale su limitazioni sistemi AI
□ Contratti fornitori per strumenti sicurezza AI
□ Report incidenti coinvolgenti fallimenti sistemi AI
□ Politiche per ignorare raccomandazioni AI

### Dimostrazioni Sistema
□ "Mi mostri come vengono registrate le raccomandazioni AI di sicurezza"
□ "Illustri il Suo processo per questionare una decisione AI"
□ "Dimostri come verifica le classificazioni minacce AI"
□ "Mostri esempi di personale che ignora l'AI nell'ultimo mese"

### Obiettivi Interviste
□ **Analista Sicurezza**: Modelli uso quotidiano strumenti AI
□ **Manager SOC**: Politiche override e frequenza
□ **Procurement IT**: Requisiti trasparenza fornitori
□ **Responsabile Conformità**: Procedure audit decisioni AI

### Verifiche Sistema
□ Rivedere tassi accettazione raccomandazioni AI
□ Verificare logging spiegazione/punteggio fiducia
□ Verificare disponibilità strumenti verifica indipendenti
□ Esaminare affaticamento alert vs modelli override

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Punteggio Albero Decisionale

**INIZIARE QUI** → Le decisioni AI sono documentate con ragionamento?

├── **NO** → **ROSSO (Rischio Alto)**
└── **SÌ** → Il personale ignora raccomandazioni AI >10% del tempo?
    ├── **NO** → Esistono requisiti trasparenza fornitore?
    │   ├── **NO** → **ROSSO (Rischio Alto)**
    │   └── **SÌ** → **GIALLO (Rischio Moderato)**
    └── **SÌ** → Esiste processo verifica indipendente?
        ├── **NO** → **GIALLO (Rischio Moderato)**
        └── **SÌ** → **VERDE (Rischio Basso)**

### Soglie Oggettive
- **Tasso Override**: <5% = Rosso, 5-15% = Giallo, >15% = Verde
- **Copertura Documentazione**: <25% = Rosso, 25-75% = Giallo, >75% = Verde
- **Completamento Formazione**: <50% = Rosso, 50-85% = Giallo, >85% = Verde

---

## 🔧 PRIORITÀ SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
- **Logging Decisioni AI** (Costo: Basso, Tempo: 2 settimane)
  - Abilitare tracce audit su strumenti AI esistenti
  - Richiedere punteggi fiducia e fattori chiave
- **Formazione Override** (Costo: Medio, Tempo: 1 mese)
  - Workshop 4 ore su questionare raccomandazioni AI
  - Scenari pratici con override simulati

### MEDIO IMPATTO / TIMELINE MEDIA
- **Aggiornamento Requisiti Fornitore** (Costo: Basso, Tempo: 3 mesi)
  - Aggiungere clausole trasparenza a contratti rinnovo
  - Creare scorecard spiegabilità per procurement
- **Processo Verifica** (Costo: Medio, Tempo: 2 mesi)
  - Definire trigger per validazione indipendente
  - Stabilire metodi verifica alternativi

### ALTO IMPATTO / TIMELINE LUNGA
- **Dashboard Affidabilità AI** (Costo: Alto, Tempo: 6 mesi)
  - Tracciare accuratezza AI vs fiducia nel tempo
  - Alert su deviazione da modelli baseline
  - *Dipendenza*: Richiede risorsa ops AI dedicata

### BASSO IMPATTO / CONTINUO
- **Test AI Red Team** (Costo: Alto, Tempo: Trimestrale)
  - Test adversarial esterno strumenti AI
  - *Dipendenza*: Richiede budget sicurezza specializzato

---

## 💬 CONVERSAZIONE CLIENTE (3 minuti)

### Domande Iniziali
**"Mi parli di una recente decisione sicurezza dove l'AI ha avuto un ruolo chiave."**
- *Follow-up*: "Come ha verificato la raccomandazione dell'AI?"
- *Segnale d'allarme*: Nessuna verifica menzionata

**"Quando è stata l'ultima volta che qualcuno non è stato d'accordo con uno strumento AI di sicurezza?"**
- *Follow-up*: "Cosa è successo? L'override è stato documentato?"
- *Segnale d'allarme*: "Non succede mai" o "Non ricordo"

### Approfondimento Fiducia Opacità
**"Come sa quando fidarsi dei Suoi strumenti AI di sicurezza?"**
- *Follow-up*: "Cosa La farebbe questionare una raccomandazione AI?"
- *Segnale d'allarme*: Le risposte si concentrano sulla sofisticazione sistema vs accuratezza effettiva

**"Quali domande pone ai fornitori AI su come funzionano i loro strumenti?"**
- *Follow-up*: "E se non possono spiegare il loro processo decisionale?"
- *Segnale d'allarme*: Nessun requisito trasparenza o "Ci fidiamo del fornitore"

### Gestione Argomenti Sensibili
**Per modelli alta fiducia**: "I Suoi strumenti AI sembrano molto affidabili. Come mantiene supervisione appropriata beneficiando dell'efficienza AI?"

**Per relazioni fornitore**: "Il procurement AI può essere complesso. Come bilancia innovazione con requisiti trasparenza?"

---

## 📊 TEMPLATE NOTE DA CAMPO

### Riepilogo Valutazione
**Data**: ____________  **Revisore**: ____________  **Sede**: ____________

**Punteggio Valutazione Rapida**: ___/7  **Livello Rischio**: Verde/Giallo/Rosso

### Evidenze Raccolte
**Strumenti AI in Uso**: _________________________________________________
**Esempi Override Trovati**: _____________________________________
**Qualità Documentazione**: Buona / Discreta / Scarsa / Nessuna
**Evidenza Formazione**: Recente / Obsoleta / Nessuna

### Risultati Chiave
**Punti di Forza**:
- _______________________________________________________________
- _______________________________________________________________

**Vulnerabilità**:
- _______________________________________________________________
- _______________________________________________________________

**Lacune Critiche**:
- _______________________________________________________________
- _______________________________________________________________

### Azioni Raccomandate
**Immediato (0-30 giorni)**:
□ _________________________________________________________________
□ _________________________________________________________________

**Breve termine (1-3 mesi)**:
□ _________________________________________________________________
□ _________________________________________________________________

**Lungo termine (3+ mesi)**:
□ _________________________________________________________________
□ _________________________________________________________________

### Follow-up Richiesto
□ Revisione tecnica configurazioni sistemi AI
□ Interviste personale per valutazione calibrazione fiducia
□ Revisione documentazione fornitore
□ Consulenza sviluppo politiche

**Data Prossima Revisione**: ____________

---

## 🔍 RIFERIMENTO RAPIDO REVISORE

### Segnali d'Allarme (Attenzione Immediata)
- Raccomandazioni AI accettate >95% senza questionare
- Nessun fallimento o limitazione decisioni AI documentati
- Il personale descrive strumenti AI come "sempre giusti" o "troppo sofisticati per questionare"
- I contratti fornitori non hanno requisiti trasparenza

### Indicatori Successo
- Override documentati regolari con ragionamento
- Il personale può descrivere scenari fallimento AI specifici
- Più metodi verifica disponibili e usati
- I registri formazione mostrano aggiornamenti regolari su limitazioni AI

### Errori Comuni da Evitare
- Non confondere coerenza AI con accuratezza AI
- Non accettare "l'AI è troppo complessa per spiegare"
- Non saltare test processo verifica
- Non assumere che presentazione high-tech equivalga a affidabilità

**Tempo Totale Valutazione**: 22 minuti massimo
