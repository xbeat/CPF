# 📋 KIT DA CAMPO INDICATORE 9.3
## Valutazione Paradosso Avversione Algoritmica

---

## ⚡ VALUTAZIONE RAPIDA (5 min)

**Istruzioni**: Selezionare SÌ/NO per ogni elemento. Completare tutte le 7 domande.

□ **1. Documentazione Override**: L'organizzazione traccia quando il personale ignora le raccomandazioni AI di sicurezza?
   - SÌ = Esiste sistema tracciamento documentato
   - NO = Nessun tracciamento sistematico

□ **2. Disabilitazione Strumenti AI**: Gli strumenti AI di sicurezza sono stati disabilitati per >24 ore negli ultimi 6 mesi?
   - SÌ = Strumenti disabilitati oltre manutenzione tecnica
   - NO = Nessun periodo disabilitazione esteso

□ **3. Processo Verifica**: Esiste un processo standard per verificare le raccomandazioni AI di sicurezza prima dell'azione?
   - SÌ = Esistono procedure scritte e vengono seguite
   - NO = Nessun processo verifica standard

□ **4. Protocollo Falsi Positivi**: Esistono procedure per gestire i falsi positivi AI senza disabilitare gli strumenti?
   - SÌ = Protocolli documentati mantengono operazioni AI
   - NO = I falsi positivi portano a disabilitazione strumento

□ **5. Formazione Calibrazione Fiducia**: Il personale riceve formazione su quando fidarsi vs questionare le raccomandazioni AI?
   - SÌ = Fornita formazione specifica fiducia AI
   - NO = Nessuna formazione fiducia AI

□ **6. Varianza Tempo Risposta**: Il personale risponde diversamente agli alert AI vs umani di sicurezza?
   - SÌ = Differenze osservabili nei modelli di risposta
   - NO = Risposta coerente indipendentemente dalla fonte

□ **7. Protocollo AI Crisi**: Esistono linee guida chiare per l'uso dell'AI durante incidenti di sicurezza?
   - SÌ = Protocolli crisi documentati per uso AI
   - NO = Nessuna linea guida specifica AI crisi

---

## 📝 RACCOLTA EVIDENZE (10 min)

### Documenti da Richiedere
- [ ] **Log override AI** (ultimi 90 giorni)
- [ ] **Report disponibilità strumenti sicurezza** (ultimi 6 mesi)
- [ ] **Registri formazione** per strumenti sicurezza AI
- [ ] **Procedure risposta incidenti** che menzionano sistemi AI
- [ ] **Procedure gestione falsi positivi**

### Dimostrazioni da Richiedere
- [ ] **"Mi mostri la Sua dashboard sicurezza AI"** - osservare punteggi fiducia, alert
- [ ] **"Illustri la Sua ultima decisione override"** - processo e ragionamento
- [ ] **"Dimostri risposta falsi positivi"** - procedure effettive utilizzate
- [ ] **"Mostri risposta incidente sicurezza recente"** - uso strumenti AI durante crisi

### Verifiche Sistema da Eseguire
- [ ] **Verificare punteggi fiducia AI** sono visibili agli utenti
- [ ] **Controllare flussi approvazione override** nei sistemi sicurezza
- [ ] **Confermare tracce audit** catturano decisioni override
- [ ] **Testare tempi risposta alert** per alert AI vs umani

### Obiettivi Interviste
- [ ] **Analista Sicurezza** (uso quotidiano strumenti AI)
- [ ] **Manager SOC** (politiche override e formazione)
- [ ] **Responsabile Risposta Incidenti** (uso AI durante crisi)
- [ ] **Amministratore Sicurezza IT** (configurazione e manutenzione strumenti AI)

---

## 🎯 PUNTEGGIO RAPIDO (2 min)

**Albero Decisionale**: Seguire il percorso basato sui risultati Valutazione Rapida.

```
INIZIO: Contare risposte "NO" dalla Valutazione Rapida

├── 0-1 risposte NO → VERDE (0)
│   └── L'organizzazione ha forte governance AI
│
├── 2-3 risposte NO → GIALLO (1)
│   └── Verificare: Incidenti sicurezza recenti coinvolgenti decisioni AI?
│       ├── SÌ → ROSSO (2)
│       └── NO → Rimanere GIALLO (1)
│
└── 4+ risposte NO → ROSSO (2)
    └── Alta vulnerabilità a sfruttamento avversione algoritmica
```

**Segnali d'Allarme Aggiuntivi** (Passare a ROSSO indipendentemente dal punteggio):
- Strumenti AI disabilitati >3 giorni dopo falsi positivi
- Nessun registro formazione per strumenti sicurezza AI nell'ultimo anno
- Incidente sicurezza recente collegato a problemi override/fiducia AI
- Il personale riporta "non ci fidiamo del sistema AI"

---

## 🔧 PRIORITÀ SOLUZIONI (5 min)

### ALTA PRIORITÀ (Implementare Per Primo)
**Impatto: Alto | Costo: Basso-Medio | Timeline: 30-60 giorni**

- [ ] **Framework Override AI** - Documentare alberi decisionali override e processi approvazione
- [ ] **Programma Formazione Base** - Esercizi calibrazione fiducia AI mensili
- [ ] **Sistema Traccia Audit** - Registrare tutte le interazioni umano-AI e decisioni override

### MEDIA PRIORITÀ (Implementare Secondo)
**Impatto: Medio | Costo: Medio | Timeline: 60-90 giorni**

- [ ] **Protocolli Basati su Fiducia** - Risposte diverse per fiducia AI alta/media/bassa
- [ ] **Dashboard Trasparenza AI** - Visualizzazione performance AI in tempo reale
- [ ] **Gestione Falsi Positivi** - Procedure che mantengono operazioni AI durante falsi positivi

### BASSA PRIORITÀ (Lungo Termine)
**Impatto: Medio | Costo: Alto | Timeline: 90+ giorni**

- [ ] **Esposizione AI Graduata** - Rollout graduale per nuovi strumenti sicurezza AI
- [ ] **Analitiche Avanzate** - Modellazione predittiva per modelli interazione umano-AI
- [ ] **Programma Cambiamento Culturale** - Iniziativa cultura algoritmica organizzativa

### Dipendenze
- **Formazione** richiede sistema traccia audit per misurazione efficacia
- **Dashboard trasparenza** necessita protocolli basati fiducia per essere significativa
- **Soluzioni avanzate** dipendono da implementazione framework base

---

## 💬 CONVERSAZIONE CLIENTE (3 min)

### Domande Chiave Intervista

**Apertura**: *"Vorrei capire come lavora il Suo team con i sistemi sicurezza AI..."*

1. **"Mi parli dell'ultima volta che non è stato d'accordo con una raccomandazione AI di sicurezza. Cosa è successo?"**
   - *Follow-up*: "Come ha deciso se ignorarla?"

2. **"Quando gli strumenti AI di sicurezza generano falsi allarmi, qual è la Sua risposta tipica?"**
   - *Follow-up*: "Quanto tempo rimangono tipicamente disabilitati quegli strumenti?"

3. **"Durante il Suo ultimo incidente sicurezza importante, come hanno aiutato o ostacolato gli strumenti AI la Sua risposta?"**
   - *Follow-up*: "Cosa cambierebbe del coinvolgimento AI la prossima volta?"

4. **"Quale formazione riceve il Suo team sugli strumenti sicurezza AI?"**
   - *Follow-up*: "Come sa quando fidarsi versus questionare le raccomandazioni AI?"

### Indicatori Segnali d'Allarme
- **"Abbiamo disattivato [strumento AI] mesi fa"** → Indagare ragioni e timeline
- **"L'AI sbaglia sempre"** → Investigare modelli falsi positivi
- **"Seguiamo solo quello che dice l'AI"** → Verificare rischi eccessiva dipendenza
- **"Solo [persona specifica] capisce l'AI"** → Rischio singolo punto di fallimento

### Linguaggio Professionale per Argomenti Sensibili
- **Invece di**: "Il Suo team non si fida dell'AI"
- **Dire**: "Come valuta il Suo team le raccomandazioni AI?"

- **Invece di**: "Si affida eccessivamente all'AI"
- **Dire**: "Quali passi di verifica adotta con gli output AI?"

- **Invece di**: "Questa è una vulnerabilità"
- **Dire**: "Questo crea opportunità di miglioramento"

---

## 📊 TEMPLATE NOTE DA CAMPO

**Cliente**: _________________________ **Data**: _____________
**Revisore**: _______________________ **Durata**: __________

### Risultati Valutazione Rapida
□ **VERDE (0)**: Framework governance AI forte
□ **GIALLO (1)**: Problemi fiducia AI moderati
□ **ROSSO (2)**: Alta vulnerabilità avversione algoritmica

### Risultati Critici
**Più Preoccupante**: _______________________________________________
**Rischio Immediato**: _______________________________________________
**Causa Radice**: __________________________________________________

### Riepilogo Evidenze
**Documenti Revisionati**: ___________________________________________
**Dimostrazioni Chiave**: __________________________________________
**Osservazioni Sistema**: _________________________________________

### Raccomandazioni Prioritarie
1. **Immediato** (0-30 giorni): ____________________________________
2. **Breve termine** (30-60 giorni): _________________________________
3. **Lungo termine** (60+ giorni): ___________________________________

### Azioni Follow-up
□ **Programmare sessione formazione** - Data obiettivo: ___________________
□ **Rivedere politiche** - Aree specifiche: ________________________
□ **Valutazione tecnica** - Sistemi da esaminare: ________________
□ **Briefing management** - Stakeholder chiave: ___________________

### Note
________________________________________________________________
________________________________________________________________
________________________________________________________________

**Fiducia Valutazione**: □ Alta □ Media □ Bassa
**Rivalutazione Raccomandata**: □ 30 giorni □ 60 giorni □ 90 giorni

---

## 📋 VALIDAZIONE SUCCESSO

**Il Kit da Campo funziona quando**:
- ✅ Valutazione completata in <25 minuti
- ✅ Determinazione VERDE/GIALLO/ROSSO chiara
- ✅ Il cliente comprende i risultati e accetta le raccomandazioni
- ✅ Prossimi passi attuabili identificati con timeline
- ✅ La documentazione supporta i requisiti traccia audit

**Controllo Qualità**: Un altro revisore può raggiungere la stessa conclusione usando queste note? □ SÌ □ NO
