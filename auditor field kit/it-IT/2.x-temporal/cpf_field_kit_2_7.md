# 📋 CPF INDICATOR 2.7 FIELD KIT
## Finestre di Vulnerabilità Temporale

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Lista di Controllo per Valutazione Binaria - Spuntare tutte le voci applicabili:**

□ **Operazioni 24/7**: L'organizzazione gestisce sistemi critici per la sicurezza al di fuori dell'orario di lavoro 9-17
□ **Personale Ridotto**: Meno del 50% del personale di sicurezza normale durante notti/weekend
□ **Incidenti Fuori Orario**: Si sono verificati incidenti di sicurezza durante sere/notti/weekend negli ultimi 6 mesi
□ **Documentazione di Bypass**: Esistono prove scritte di procedure di sicurezza bypassate durante pressione temporale
□ **Lacune di Autorità**: Nessun responsabile delle decisioni di sicurezza designato disponibile durante orari non lavorativi
□ **Passaggi di Turno**: L'organizzazione utilizza turni multipli con periodi di passaggio di consegne
□ **Richieste di Emergenza**: Richieste di sicurezza "urgenti" fuori orario si verificano mensilmente o più frequentemente

**Punteggio Rapido**: 0-2 caselle = Verde | 3-4 caselle = Giallo | 5+ caselle = Rosso

---

## 📝 RACCOLTA PROVE (10 minuti)

### Documenti da Richiedere
- [ ] **Programmazione dei turni** e livelli di personale per periodo temporale
- [ ] **Registri degli incidenti** degli ultimi 6 mesi (annotare timestamp)
- [ ] **Registri di approvazione fuori orario** (reset password, richieste di accesso)
- [ ] **Programmazione copertura SOC/monitoraggio**
- [ ] **Elenchi dei contatti di emergenza** e procedure di escalation
- [ ] **Modelli di passaggio di turno** o registri di comunicazione

### Dimostrazioni Necessarie
- [ ] **"Mostratemi come"** qualcuno richiede accesso urgente alle 2 del mattino
- [ ] **"Guidatemi attraverso"** il vostro processo di cambio turno
- [ ] **"Dimostrate"** la vostra procedura di risposta agli incidenti fuori orario

### Verifiche di Sistema
- [ ] **Rivedere gli alert SIEM** raggruppati tra le 18:00 e le 6:00
- [ ] **Verificare i log di autenticazione** per pattern di accesso fuori orario
- [ ] **Esaminare i ticket dell'help desk** inviati durante notti/weekend
- [ ] **Verificare i dashboard di monitoraggio** mostrano lacune di copertura

### Obiettivi Chiave per le Interviste
- [ ] **Responsabile SOC** - copertura notturna e gestione degli alert
- [ ] **Responsabile Help Desk IT** - procedure di richiesta fuori orario
- [ ] **Responsabile Sicurezza** - autorità decisionale fuori orario
- [ ] **Supervisore di Turno** - processi di comunicazione durante i passaggi di consegne

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale

**INIZIO QUI** → L'organizzazione opera 24/7 o ha operazioni fuori orario?
- **NO** → **VERDE (0)** - Vulnerabilità temporale minima
- **SÌ** → Continuare sotto

**Verifica Copertura** → È presente personale di sicurezza dedicato durante tutte le ore operative?
- **SÌ** → Verificare i passaggi di consegne sotto
- **NO** → **ROSSO (2)** se <25% copertura, **GIALLO (1)** se 25-75% copertura

**Verifica Autorità** → Le decisioni di sicurezza possono essere prese a qualsiasi ora?
- **SÌ** → Verificare gli incidenti sotto
- **NO** → **ROSSO (2)** se nessuna autorità fuori orario, **GIALLO (1)** se autorità limitata

**Pattern di Incidenti** → Incidenti di sicurezza durante orari non lavorativi negli ultimi 6 mesi?
- **NESSUNO** → **VERDE (0)**
- **1-2 incidenti** → **GIALLO (1)**
- **3+ incidenti** → **ROSSO (2)**

**Punteggio Finale**: Il punteggio individuale più alto determina la valutazione complessiva

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
- **Verifica Rafforzata Fuori Orario** (Costo: Basso)
  - Richiedere verifica tramite callback per richieste fuori orario
  - Implementare doppia approvazione per modifiche di sicurezza al di fuori dell'orario lavorativo
- **Passaggi di Turno Strutturati** (Costo: Basso)
  - Distribuire checklist digitale per i passaggi di consegne
  - Richiedere briefing specifici sulla sicurezza tra i turni

### IMPATTO MEDIO / TEMPISTICHE MODERATE
- **Matrice di Autorità Basata sul Tempo** (Costo: Medio)
  - Definire l'autorità decisionale di sicurezza per periodo temporale
  - Creare sistema di rotazione "ufficiale di servizio di sicurezza"
- **Rilevamento Attacchi Temporali** (Costo: Medio)
  - Configurare alert SIEM per pattern di attacco basati sui tempi
  - Monitorare la frequenza delle richieste di accesso fuori orario

### ALTO IMPATTO / INVESTIMENTO A LUNGO TERMINE
- **Copertura SOC 24/7** (Costo: Alto)
  - Personale di sicurezza dedicato disponibile 24 ore su 24
  - Implementare programmazione dei turni ottimizzata per i ritmi circadiani
- **Controlli di Sicurezza Automatizzati** (Costo: Alto)
  - Distribuire sistemi che richiedono un minimo processo decisionale umano
  - Implementare politiche di negazione predefinita per le richieste fuori orario

### Dipendenze
- **Necessaria Adesione della Leadership**: personale 24/7, modifiche alla matrice di autorità
- **Prerequisiti Tecnologici**: configurazione SIEM, controlli automatizzati
- **Aggiornamenti delle Politiche Necessari**: tutte le procedure di verifica e passaggio di consegne

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
- *"Quante ore alla settimana operate al di fuori del normale orario lavorativo?"*
- *"Chi prende le decisioni di sicurezza quando il Suo team principale non è disponibile?"*
- *"Mi parli del Suo ultimo incidente di sicurezza - a che ora si è verificato?"*

### Solleciti di Follow-up per Risposte Incomplete
- **Se dicono "Abbiamo copertura"**: *"Quante persone, e qual è la loro autorità decisionale in materia di sicurezza?"*
- **Se menzionano incidenti**: *"A che ora del giorno si verificano la maggior parte dei Suoi problemi di sicurezza?"*
- **Se descrivono i passaggi di consegne**: *"Mi mostri la documentazione dell'ultimo passaggio di turno."*

### Indicatori di Segnale Rosso che Richiedono Indagini Più Approfondite
- **Frequenti "emergenze" fuori orario** che richiedono bypass di sicurezza
- **Raggruppamenti di incidenti durante periodi temporali specifici** (notti, cambi di turno)
- **Risposte vaghe sull'autorità decisionale fuori orario**
- **Nessuna documentazione delle comunicazioni di turno**
- **Il personale menziona "scorciatoie del weekend"** o pressione per bypassare la sicurezza

### Linguaggio Professionale per Argomenti Sensibili
- Invece di: "Il Suo personale notturno è vulnerabile"
- Dire: "Vogliamo garantire standard di sicurezza coerenti in tutte le ore operative"
- Invece di: "Le persone prendono decisioni sbagliate quando sono stanche"
- Dire: "La ricerca mostra che le prestazioni cognitive variano nel corso della giornata"

---

## 📊 MODELLO NOTE SUL CAMPO

**Organizzazione**: _________________ **Data**: _________ **Auditor**: _________________

### Ore Operative
□ Solo orario lavorativo standard (9-17) □ Orario esteso □ Operazioni 24/7
**Dettagli**: ________________________________________________________________

### Copertura Attuale Fuori Orario
**Personale di sicurezza presente**: _______ **Livello di autorità decisionale**: _______________
**Processo di escalation**: _____________________________________________________

### Incidenti Temporali Recenti
**Incidente 1**: ____________________________________________________________
**Ora/Data**: ________________________ **Impatto**: ______________________

**Incidente 2**: ____________________________________________________________
**Ora/Data**: ________________________ **Impatto**: ______________________

### Qualità del Passaggio di Turno
□ Processo documentato □ Solo verbale □ Nessun passaggio formale
**Trasferimento informazioni di sicurezza**: __________________________________________

### Raccomandazioni Immediate
**Priorità 1**: ____________________________________________________________
**Priorità 2**: ____________________________________________________________
**Priorità 3**: ____________________________________________________________

### Giustificazione del Punteggio
**Punteggio Finale**: _______ **Fattori principali**: ________________________________

---

## ✅ LISTA DI CONTROLLO SUCCESSO DELL'AUDITOR

Prima di lasciare il sito del cliente, confermare:
- [ ] Tutti i 7 elementi di valutazione rapida valutati
- [ ] Almeno 3 prove documentali raccolte
- [ ] Processo di passaggio di turno osservato o documentato
- [ ] Catena di autorità fuori orario confermata
- [ ] Pattern temporali degli incidenti recenti identificati
- [ ] Raccomandazioni prioritarie fornite al cliente
- [ ] Modello note sul campo completamente compilato

**Tempo Totale di Valutazione**: _______ minuti (Obiettivo: <25 minuti)
