# 📋 INDICATOR 1.2 FIELD KIT
## Diffusione della Responsabilità nelle Strutture Gerarchiche

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Spuntare SÌ/NO per ogni domanda:**

☐ **SÌ** ☐ **NO** - L'organizzazione ha un documento scritto che elenca individui specifici (non solo ruoli) autorizzati a prendere decisioni di sicurezza?

☐ **SÌ** ☐ **NO** - Le decisioni di sicurezza per problemi critici possono essere prese in meno di 30 minuti senza approvazioni multiple?

☐ **SÌ** ☐ **NO** - Esiste un individuo nominato disponibile 24/7 che può autorizzare azioni di sicurezza di emergenza?

☐ **SÌ** ☐ **NO** - I dipartimenti si incontrano mensilmente o più per chiarire le responsabilità di sicurezza tra i team?

☐ **SÌ** ☐ **NO** - Le responsabilità di sicurezza sono assegnate a persone specifiche piuttosto che a dipartimenti nei documenti di policy?

☐ **SÌ** ☐ **NO** - La gestione patch ha una persona nominata responsabile per ogni step del processo?

☐ **SÌ** ☐ **NO** - Le metriche di prestazione di sicurezza individuali sono tracciate e collegate alle revisioni dei dipendenti?

**Anteprima Punteggio:** 6-7 SÌ = Verde | 4-5 SÌ = Giallo | 0-3 SÌ = Rosso

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti da Richiedere:
- [ ] Matrice autorità sicurezza o documento processo decisionale
- [ ] Procedure risposta incidenti mostrando autorità decisionale
- [ ] Ultimi 3 report incidenti sicurezza con timestamp
- [ ] Note incontri cross-dipartimentali (ultimi 6 mesi)
- [ ] Documentazione processo gestione patch
- [ ] Record approvazioni eccezioni policy sicurezza

### Dimostrazioni da Richiedere:
- [ ] "Mi illustri cosa succede quando rileva traffico di rete sospetto"
- [ ] "Mi mostri il Suo processo per blocchi account di emergenza fuori orario"
- [ ] "Dimostri come scala una preoccupazione di sicurezza al management"

### Controlli di Sistema:
- [ ] Rivedere workflow escalation alert SIEM
- [ ] Controllare sistema ticketing per tempi approvazione decisioni sicurezza
- [ ] Esaminare processi revisione accessi utenti e proprietà
- [ ] Auditare assegnazioni amministrative strumenti sicurezza

### Obiettivi Intervista:
- [ ] **IT Manager**: Autorità decisionale e processi escalation
- [ ] **Team Lead Sicurezza**: Coordinamento cross-dipartimentale
- [ ] **Staff Help Desk**: Procedure incidenti fuori orario
- [ ] **Manager Dipartimento**: Comprensione responsabilità sicurezza

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale:

**INIZIA QUI:** Rivedi risultati Valutazione Rapida

**SE 6-7 risposte SÌ:**
- ✅ **VERDE (0)** - Individui nominati hanno chiara autorità, decisioni sotto 30 minuti, coordinamento regolare

**SE 4-5 risposte SÌ:**
- Controlla: Le decisioni critiche sono ritardate 30min-4ore? → ⚠️ **GIALLO (1)**
- Controlla: Assegnazioni miste individuo/dipartimento? → ⚠️ **GIALLO (1)**

**SE 0-3 risposte SÌ:**
- Controlla: Le decisioni critiche sono ritardate 4+ ore? → 🚨 **ROSSO (2)**
- Controlla: Solo assegnazioni livello dipartimento? → 🚨 **ROSSO (2)**

### Soglie Obiettive:
- **Velocità Decisione**: Sotto 30min = Verde | 30min-4ore = Giallo | 4+ ore = Rosso
- **Assegnazione Autorità**: Persone nominate = Verde | Misto = Giallo | Solo dipartimenti = Rosso
- **Coordinamento**: Mensile+ = Verde | Trimestrale = Giallo | Ad-hoc/Nessuno = Rosso

---

## 🔧 PRIORITÀ SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
- **Matrice Autorità Sicurezza** (Costo Basso)
  - Creare documento decisioni persone nominate
  - Implementazione 2 settimane
  - Richiede: Solo approvazione management

- **Limiti Tempo Decisioni** (Costo Basso)
  - Impostare requisiti risposta 30min/4ore/24ore
  - Implementazione 1 settimana
  - Richiede: Aggiornamento policy

### IMPATTO MEDIO / IMPLEMENTAZIONE MEDIA
- **Rete Security Champions** (Costo Medio)
  - Incontri cross-dipartimentali mensili
  - Implementazione 4-6 settimane
  - Richiede: Selezione champion, formazione

- **Scorecard Individuali** (Costo Medio)
  - Tracciamento metriche sicurezza personali
  - Implementazione 6-8 settimane
  - Richiede: Integrazione sistema HR

### ALTO IMPATTO / IMPLEMENTAZIONE A LUNGO TERMINE
- **Workflow Decisioni Automatizzati** (Costo Alto)
  - Piattaforma SOAR per decisioni di routine
  - Implementazione 3-6 mesi
  - Richiede: Investimento tecnologico

- **Struttura Comando Incidenti** (Costo Medio)
  - Bypass gerarchia durante incidenti
  - Implementazione 2-3 mesi
  - Richiede: Gestione cambiamento culturale

### Dipendenze:
- Buy-in dirigenti richiesto per cambiamenti autorità
- Coinvolgimento HR necessario per metriche individuali
- Risorse IT richieste per soluzioni automazione

---

## 💬 CONVERSAZIONE CLIENTE (3 minuti)

### Domande Iniziali:
**"Quando scopre un potenziale problema di sicurezza, chi contatta per primo?"**
- Follow-up: *"Quanto tempo occorre tipicamente per ottenere permesso di agire?"*

**"Cosa succede se un problema di sicurezza si verifica alle 2 del mattino di sabato?"**
- Follow-up: *"Chi ha l'autorità di spegnere sistemi o bloccare traffico?"*

**"Come coordinano i diversi dipartimenti le responsabilità di sicurezza?"**
- Follow-up: *"Quando è stato il Suo ultimo incontro sicurezza cross-dipartimentale?"*

### Indicatori Bandiera Rossa:
- 🚨 "Abbiamo un comitato che si incontra per discutere..."
- 🚨 "Dipende da chi è disponibile..."
- 🚨 "Non è veramente la mia area..."
- 🚨 "Dovremmo controllare con diverse persone..."
- 🚨 "La policy dice di contattare il dipartimento..."

### Linguaggio Professionale per Argomenti Sensibili:
**Invece di**: "La Sua sicurezza è compromessa"
**Dire**: "Abbiamo identificato opportunità per snellire il Suo processo decisionale di sicurezza"

**Invece di**: "Nessuno è responsabile"
**Dire**: "Potrebbero esserci opportunità per chiarire le responsabilità di sicurezza"

**Invece di**: "Questo crea vulnerabilità"
**Dire**: "Questa struttura può rallentare i tempi di risposta agli incidenti"

---

## 📊 TEMPLATE NOTE DI CAMPO

**Data:** _____________ **Auditor:** _________________ **Organizzazione:** _________________

### Risultati Valutazione Rapida:
- Autorità individuale documentata: ☐ Sì ☐ No
- Capacità decisione veloce (<30min): ☐ Sì ☐ No
- Copertura autorità 24/7: ☐ Sì ☐ No
- Incontri coordinamento regolari: ☐ Sì ☐ No
- Assegnazioni specifiche per persona: ☐ Sì ☐ No
- Responsabilità patch: ☐ Sì ☐ No
- Metriche individuali: ☐ Sì ☐ No

**Totale risposte SÌ: ___/7**

### Evidenze Raccolte:
- Documentazione autorità: ☐ Presente ☐ Assente ☐ Incompleta
- Tempi risposta incidenti: Media ____ minuti/ore
- Coordinamento cross-dipartimentale: ☐ Mensile ☐ Trimestrale ☐ Ad-hoc ☐ Nessuno
- Ritardi approvazione decisioni: ☐ <30min ☐ 30min-4ore ☐ 4ore+

### Determinazione Punteggio:
☐ **VERDE (0)** - Autorità chiara, decisioni veloci, coordinamento regolare
☐ **GIALLO (1)** - Alcuni ritardi, assegnazioni miste, coordinamento periodico
☐ **ROSSO (2)** - Ritardi maggiori, assegnazioni dipartimenti, coordinamento scarso

### Raccomandazioni Prioritarie:
☐ Matrice Autorità Sicurezza (ALTO/RAPIDO)
☐ Limiti Tempo Decisioni (ALTO/RAPIDO)
☐ Rete Security Champions (MEDIO/MEDIO)
☐ Scorecard Individuali (MEDIO/MEDIO)
☐ Workflow Automatizzati (ALTO/LUNGO)
☐ Struttura Comando Incidenti (ALTO/LUNGO)

### Feedback/Preoccupazioni Cliente:
_________________________________________________
_________________________________________________
_________________________________________________

### Azioni Follow-up Richieste:
☐ Presentazione dirigenti necessaria
☐ Revisione documentazione aggiuntiva
☐ Interviste follow-up programmate
☐ Valutazione tecnica richiesta

**Valutazione Completata:** _____ minuti
**Tempo Generazione Report:** _____ minuti
