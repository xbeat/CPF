# CPF FIELD KIT 5.1: Desensibilizzazione da Affaticamento Allerta

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Marcare SÌ/NO per ciascuna condizione osservabile:**

□ **SÌ/NO**: Il team di sicurezza riceve >150 allerta per analista al giorno
□ **SÌ/NO**: Il tasso di falsi positivi supera il 70% (o il team stima "la maggior parte delle allerta sono false")
□ **SÌ/NO**: Il tempo medio di risposta alle allerta supera le 4 ore
□ **SÌ/NO**: Non esiste un processo formale di sintonizzazione delle allerta (nessuna revisione/modifica documentata)
□ **SÌ/NO**: Gli analisti si lamentano regolarmente del "rumore delle allerta" o di "troppe allerta"
□ **SÌ/NO**: Incidenti di sicurezza critici sono stati mancati negli ultimi 12 mesi
□ **SÌ/NO**: Gli analisti hanno disabilitato/soppresso tipi di allerta senza approvazione formale

**Punteggio Rapido**: 0-2 SÌ = Verde | 3-4 SÌ = Giallo | 5+ SÌ = Rosso

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti da Richiedere
- [ ] **Log SIEM/Allerta** degli ultimi 30 giorni che mostrano i volumi giornalieri
- [ ] **Report di risoluzione allerta** che mostrano la disposizione (falso positivo/azione richiesta)
- [ ] **Ticket di risposta agli incidenti** con timestamp (allerta→investigazione)
- [ ] **Documentazione di sintonizzazione allerta** (modifiche di configurazione, approvazioni)
- [ ] **Pianificazione personale di sicurezza** (copertura durante assenze)

### Dimostrazioni di Sistema
- [ ] **"Mi mostri la Sua dashboard delle allerta"** - osservare i volumi correnti delle allerta
- [ ] **"Mi illustri l'investigazione di questa allerta"** - cronometrare il processo
- [ ] **"Mi mostri le allerta disabilitate/filtrate"** - identificare le notifiche soppresse
- [ ] **"Dimostri il processo di escalation"** - verificare le procedure di copertura

### Interviste Chiave
- [ ] **Analisti SOC** (2-3 individui): Esperienza quotidiana nella gestione delle allerta
- [ ] **Manager della Sicurezza**: Politiche e procedure di gestione delle allerta
- [ ] **Operazioni IT**: Impatto della manutenzione del sistema sulle allerta
- [ ] **Nuovo assunto**: Formazione sulla gestione delle allerta

### Controlli di Sistema
- [ ] **Calcolo del volume di allerta**: Totale allerta ÷ numero di analisti ÷ giorni
- [ ] **Analisi dei tempi di risposta**: Revisione dei timestamp nel sistema di ticketing
- [ ] **Tasso di falsi positivi**: (Allerta respinte ÷ Totale allerta) × 100

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

**Albero Decisionale - Iniziare Qui:**

**PASSO 1**: Allerte giornaliere per analista?
- **<50**: Continuare al Passo 2
- **50-150**: Passare al controllo criteri Giallo
- **>150**: Punteggio ROSSO immediatamente

**PASSO 2**: Tasso di falsi positivi?
- **<30%**: Continuare al Passo 3
- **30-70%**: Passare al controllo criteri Giallo
- **>70%**: Punteggio ROSSO immediatamente

**PASSO 3**: Coerenza del tempo di risposta?
- **<30 min media**: Continuare al Passo 4
- **30min-4hr variabile**: Controllo criteri Giallo
- **>4hr frequente**: Punteggio ROSSO immediatamente

**PASSO 4**: Esistono processi formali?
- **Sì + documentati**: Punteggio VERDE
- **Solo informali**: Punteggio GIALLO
- **Nessuno**: Punteggio ROSSO

**Controllo Criteri Giallo** (necessari 2+ per Giallo, altrimenti Verde):
- □ Tempi di risposta inconsistenti
- □ Alcuni incidenti mancati
- □ Gestione informale delle allerta
- □ Lamentele occasionali

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO - Implementazione Rapida
| Soluzione | Costo | Tempo | Dipendenze |
|----------|------|------|--------------|
| **Audit del volume di allerta** | Basso | 1-2 settimane | Accesso SIEM corrente |
| **Baseline falsi positivi** | Basso | 1 settimana | Log allerta |
| **Sintonizzazione base allerta** | Medio | 2-4 settimane | Supporto fornitore |

### MEDIO IMPATTO - Lungo termine
| Soluzione | Costo | Tempo | Dipendenze |
|----------|------|------|--------------|
| **Sistema di prioritizzazione allerta** | Alto | 3-6 mesi | Approvazione budget |
| **Programma di formazione incrociata** | Medio | 2-3 mesi | Disponibilità personale |
| **Dashboard consolidata** | Medio | 1-3 mesi | Integrazione strumenti |

### FONDAMENTALE - Strategico
| Soluzione | Costo | Tempo | Dipendenze |
|----------|------|------|--------------|
| **Sostituzione/aggiornamento SIEM** | Alto | 6-12 mesi | Ciclo di budget principale |
| **Consolidamento strumenti di sicurezza** | Alto | 6-18 mesi | Revisione architettura |
| **Aumento personale** | Alto | 3-6 mesi | Approvazione HR |

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Quante allerta di sicurezza vede il Suo team in un giorno tipico?"**
- *Follow-up*: "Quante richiedono un'azione effettiva?"
- *Segnale d'allarme*: Risposte vaghe o "troppe per contare"

**"Mi parli di un recente incidente di sicurezza che ha mancato o rilevato in ritardo."**
- *Follow-up*: "C'erano allerta che avrebbero dovuto rilevarlo?"
- *Segnale d'allarme*: Incidenti multipli o atteggiamento sprezzante

**"Cosa succede quando il Suo analista di sicurezza si ammala?"**
- *Follow-up*: "Come garantisce la copertura delle allerta?"
- *Segnale d'allarme*: Nessun piano di backup o singoli punti di fallimento

### Argomenti Delicati
**Invece di**: "I Suoi analisti ignorano le allerta?"
**Dica**: "Come stabilisce la priorità delle allerta da investigare per primo il Suo team?"

**Invece di**: "I Suoi strumenti di sicurezza sono mal configurati?"
**Dica**: "Con quale frequenza rivede e sintonizza le Sue soglie di allerta?"

**Invece di**: "Ha problemi di affaticamento da allerta?"
**Dica**: "Come misura l'efficacia delle Sue allerta di sicurezza?"

### Risposte Segnale d'Allarme
- [ ] **"Riceviamo così tante allerta che non riusciamo a stare al passo"**
- [ ] **"La maggior parte delle nostre allerta sono falsi positivi"**
- [ ] **"Abbiamo dovuto disattivare alcuni monitoraggi a causa del rumore"**
- [ ] **"I nostri analisti si lamentano del sovraccarico di allerta"**
- [ ] **"Abbiamo mancato [incidente] perché si è perso tra tutte le allerta"**

---

## 📊 MODELLO NOTE DI CAMPO

**Data Valutazione**: ________________  **Auditor**: ________________

### Metriche Volume Allerta
- **Totale allerta giornaliere**: ______
- **Numero di analisti**: ______
- **Allerta per analista al giorno**: ______

### Analisi Falsi Positivi
- **Totale allerta revisionate (30 giorni)**: ______
- **Falsi positivi**: ______ **Percentuale**: ______%

### Dati Tempo di Risposta
- **Tempo medio di risposta**: ______ ore
- **Tempo di risposta più lungo**: ______ ore
- **Tempo di risposta durante periodi ad alto volume**: ______ ore

### Documentazione Processi
- [ ] **Processo di sintonizzazione allerta documentato**
- [ ] **Esiste un programma di revisione regolare**
- [ ] **Procedure di escalation definite**
- [ ] **Piano di copertura per assenze**

### Riepilogo Feedback Personale
**Analista #1**: ________________________________
**Analista #2**: ________________________________
**Manager**: ___________________________________

### Risultati Critici
**Incidenti Mancati**: ___________________________
**Monitoraggio Disabilitato**: ________________________
**Lamentele del Personale**: ___________________________

### Raccomandazioni Immediate
1. ____________________________________________
2. ____________________________________________
3. ____________________________________________

**Punteggio Complessivo**: □ Verde □ Giallo □ Rosso

**Livello di Confidenza**: □ Alto □ Medio □ Basso

---

**Valutazione Completata - Tempo Totale: ~22 minuti**
