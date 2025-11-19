# 📋 CPF INDICATORE 5.6 FIELD KIT: TUNNELING COGNITIVO

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Marcare SÌ/NO per ciascun indicatore osservabile:**

□ **SÌ/NO**: L'organizzazione ha procedure documentate che richiedono rotazione dell'attenzione durante incidenti della durata >2 ore

□ **SÌ/NO**: SIEM/strumenti di sicurezza hanno regole di correlazione attive che segnalano allerta simultanee attraverso diversi domini di sicurezza (rete + endpoint + email, ecc.)

□ **SÌ/NO**: Il team di sicurezza usa un sistema a coppie (buddy system) o monitoraggio accoppiato durante incidenti ad alta priorità

□ **SÌ/NO**: Esiste un processo di approvazione formale per bypassare i controlli di sicurezza durante operazioni urgenti

□ **SÌ/NO**: L'organizzazione può mostrare evidenza di rilevamento riuscito di attacchi multi-vettore negli ultimi 12 mesi

□ **SÌ/NO**: I registri di formazione mostrano formazione sulla consapevolezza del cognitive tunneling (tunneling cognitivo) condotta negli ultimi 24 mesi

□ **SÌ/NO**: I sistemi di monitoraggio automatizzati continuano la scansione di background quando i team umani si concentrano su incidenti specifici

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### **Documenti da Richiedere**
- [ ] Procedure di risposta agli incidenti (cercare requisiti di gestione attenzione)
- [ ] Configurazione regole di correlazione SIEM
- [ ] Log approvazioni override/eccezioni di sicurezza degli ultimi 90 giorni
- [ ] Registri di formazione per il team di sicurezza (ultimi 24 mesi)
- [ ] Report post-incidente degli ultimi 12 mesi (controllare menzioni multi-vettore)

### **Dimostrazioni di Sistema**
- [ ] "Mi mostri la Sua dashboard SIEM durante un'allerta ad alta priorità simulata"
- [ ] "Mi illustri il Suo processo di risposta agli incidenti per un'intrusione di rete"
- [ ] "Dimostri come le allerta da diversi strumenti di sicurezza vengono correlate"
- [ ] "Mi mostri come le eccezioni temporanee di sicurezza vengono approvate e ripristinate"

### **Obiettivi di Intervista Chiave**
- [ ] **Manager/Team Lead SOC**: Operazioni quotidiane e coordinamento team
- [ ] **Analista SOC Senior**: Esperienze e sfide di incidenti reali
- [ ] **Manager Operazioni IT**: Procedure di bypass dei controlli di sicurezza
- [ ] **CISO/Direttore Sicurezza**: Programmi e policy di formazione

### **Controlli di Sistema**
- [ ] Rivedere volume allerta e tassi di correlazione nel SIEM degli ultimi 30 giorni
- [ ] Controllare configurazioni di monitoraggio automatizzato in background
- [ ] Verificare che i log eccezioni di sicurezza mostrino flussi di lavoro di approvazione
- [ ] Esaminare dimensione del team di risposta agli incidenti e pianificazioni di rotazione

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### **Albero Decisionale**

**INIZIARE QUI** → L'organizzazione ha procedure documentate di rotazione attenzione + regole di correlazione SIEM + sistema a coppie?

**↓ SÌ** → Può mostrare evidenza di rilevamento attacchi multi-vettore + processo formale di override sicurezza?
   - **SÌ** → **VERDE (0)**: Forti controlli cognitive tunneling
   - **NO** → **GIALLO (1)**: Controlli parziali, evidenza mancante

**↓ NO** → Ha qualche rilevamento multi-vettore sistematico O procedure di gestione attenzione?
   - **SÌ** → **GIALLO (1)**: Alcuni controlli ma inconsistenti
   - **NO** → **ROSSO (2)**: Nessuna prevenzione sistematica del tunneling

### **Soglie Oggettive**
- **VERDE**: ≥5 risposte SÌ nella Valutazione Rapida + evidenza di rilevamento multi-vettore
- **GIALLO**: 3-4 risposte SÌ + evidenza parziale
- **ROSSO**: ≤2 risposte SÌ + nessuna evidenza di rilevamento multi-vettore

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### **ALTO IMPATTO - Implementazione Rapida**
| Soluzione | Costo | Tempo | Dipendenze |
|----------|------|------|--------------|
| **Protocollo Rotazione Attenzione** | Basso | 2 settimane | Solo formazione team |
| **Regole Correlazione SIEM** | Basso | 1 settimana | Sistema SIEM esistente |
| **Sistema a Coppie Risposta Incidenti** | Basso | 1 settimana | Nessuna |

### **ALTO IMPATTO - Lungo termine**
| Soluzione | Costo | Tempo | Dipendenze |
|----------|------|------|--------------|
| **Dashboard Allerta Cross-Domain** | Medio | 8 settimane | Possibile aggiornamento SIEM |
| **Monitoraggio Background Automatizzato** | Alto | 12 settimane | Capacità AI/ML |
| **Controlli Override Sicurezza** | Basso | 4 settimane | Sistema workflow |

### **MEDIO IMPATTO**
| Soluzione | Costo | Tempo | Dipendenze |
|----------|------|------|--------------|
| **Formazione Consapevolezza Periferica** | Medio | 6 settimane | Fornitore formazione |
| **Esercitazioni Tabletop** | Basso | 4 settimane | Sviluppo scenari |

---

## 💬 SCRIPT CONVERSAZIONE CON IL CLIENTE (3 minuti)

### **Domande di Apertura**
- *"Mi illustri cosa succede quando riceve un'allerta di sicurezza ad alta priorità mentre sta già lavorando su un altro incidente."*
- *"Mi parli dell'ultima volta che ha scoperto che un attacco era più complesso di quanto apparisse inizialmente."*
- *"Come garantisce che il Suo team non manchi altre minacce quando è focalizzato su problemi IT urgenti?"*

### **Prompt di Follow-up per Risposte Incomplete**
- **Se menzionano procedure**: *"Può mostrarmi il processo documentato? Quando è stato usato l'ultima volta?"*
- **Se menzionano formazione**: *"Quali scenari specifici praticate? Come misura l'efficacia?"*
- **Se menzionano strumenti**: *"Dimostri come le allerta da diversi sistemi vengono collegate insieme."*

### **Indicatori Segnale d'Allarme**
- **🚩** "Gestiamo gli incidenti come arrivano" (nessun approccio sistematico)
- **🚩** "Il nostro team è piccolo quindi tutti si concentrano sul problema più grande" (tunneling guidato dalle risorse)
- **🚩** "Non abbiamo mai avuto un attacco multi-vettore" (mancanza consapevolezza/rilevamento)
- **🚩** "Durante interruzioni, la sicurezza passa in secondo piano" (cultura override operativo)

### **Linguaggio Professionale per Argomenti Delicati**
- Invece di: *"Il Suo team manca minacce"*
- Dica: *"Esploriamo come mantenere ampia consapevolezza durante periodi di focus intensivo"*

- Invece di: *"Ha punti ciechi"*
- Dica: *"Stiamo valutando le capacità di consapevolezza situazionale attraverso vettori di minaccia multipli"*

---

## 📊 MODELLO NOTE DI CAMPO

**Data Valutazione**: ___________  **Auditor**: _______________

### **Risultati Chiave**
**Punti di Forza Osservati**:
- □ _________________________________
- □ _________________________________
- □ _________________________________

**Lacune Identificate**:
- □ _________________________________
- □ _________________________________
- □ _________________________________

### **Evidenze Raccolte**
- [ ] Procedure di risposta agli incidenti revisionate
- [ ] Correlazione SIEM dimostrata
- [ ] Registri formazione verificati
- [ ] Evidenza rilevamento multi-vettore: **SÌ/NO**

### **Raccomandazioni Immediate**
**Priorità 1** (Implementare entro 30 giorni):
- _________________________________

**Priorità 2** (Implementare entro 90 giorni):
- _________________________________

### **Valutazione del Rischio**
**Livello di Rischio Corrente**: **VERDE / GIALLO / ROSSO**

**Preoccupazione Primaria**: _________________________________

**Impatto Business se Non Affrontato**: _________________________________

### **Prossimi Passi Cliente**
1. _________________________________
2. _________________________________
3. _________________________________

**Data Follow-up**: ___________

---

## 📋 CHECKLIST DI RIFERIMENTO RAPIDO

**Configurazione Pre-Valutazione** (2 min):
- [ ] Accesso SIEM organizzato
- [ ] Personale chiave disponibile
- [ ] Documenti risposta incidenti pronti

**Durante la Valutazione**:
- [ ] Valutazione Rapida completata
- [ ] Evidenze raccolte e documentate
- [ ] Dimostrazioni di sistema osservate
- [ ] Interviste chiave condotte

**Post-Valutazione** (5 min):
- [ ] Punteggio completato usando albero decisionale
- [ ] Soluzioni prioritarie identificate
- [ ] Note di campo completate
- [ ] Prossimi passi cliente documentati

**Budget Tempo Totale**: 22 minuti massimo
