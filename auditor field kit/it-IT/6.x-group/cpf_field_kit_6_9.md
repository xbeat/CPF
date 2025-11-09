# 📋 CPF FIELD KIT 6.9: SCISSIONE ORGANIZZATIVA

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Selezioni SÌ/NO per ogni indicatore osservabile:**

□ **SÌ/NO**: Incidenti di sicurezza recenti automaticamente attribuiti ad attaccanti esterni senza investigazione interna
□ **SÌ/NO**: Esistono standard di sicurezza diversi per executive vs dipendenti regolari
□ **SÌ/NO**: Utenti privilegiati (amministratori, executive, personale anziano) hanno monitoraggio attività minimo
□ **SÌ/NO**: Allocazione budget sicurezza <30% focalizzata su rilevamento minacce interne
□ **SÌ/NO**: Frequenti eccezioni alle politiche di sicurezza concesse a personale "fidato"
□ **SÌ/NO**: Relazioni con fornitori consolidate raramente rivalutate per sicurezza (>2 anni)
□ **SÌ/NO**: Principi zero trust rifiutati o esistono eccezioni importanti per certi ruoli

**Punteggio Rapido**: 0-2 SÌ = Verde | 3-4 SÌ = Giallo | 5-7 SÌ = Rosso

---

## 📝 RACCOLTA DI EVIDENZE (10 minuti)

### Documenti da Richiedere
□ **Rapporti incidenti sicurezza** (ultimi 6 mesi) - verifichi modelli di attribuzione
□ **Suddivisione budget sicurezza** - spesa minacce esterne vs interne
□ **Matrice controllo accessi** - standard diversi per ruolo
□ **Registro eccezioni politiche** - frequenza e giustificazioni
□ **Valutazioni sicurezza fornitori** - date ultime revisioni

### Dimostrazioni di Sistema
□ **"Mi mostri il monitoraggio utenti privilegiati"** - cosa esiste per executive/amministratori
□ **"Illustri il processo risposta incidenti"** - come viene determinata la causa principale
□ **"Dimostri il workflow approvazione accessi"** - eccezioni per personale senior
□ **"Mostri i controlli accesso fornitori"** - come vengono gestiti i partner fidati

### Interviste Chiave
□ **CISO/Security Leader**: Razionale allocazione budget, modelli incidenti
□ **IT Administrator**: Capacità monitoraggio, eccezioni accessi
□ **Compliance Officer**: Frequenza eccezioni politiche e processo approvazione
□ **Incident Response Lead**: Approcci investigazione incidenti recenti

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale

**INIZI QUI:** L'organizzazione ha monitoraggio minacce interne per TUTTI gli utenti privilegiati?

**NO** → Verifichi allocazione budget:
- <20% focus minacce interne = **ROSSO**
- 20-29% focus minacce interne = **GIALLO**

**SÌ** → Verifichi attribuzione incidenti:
- Sempre attribuzione esterna = **ROSSO**
- Modelli attribuzione misti = **GIALLO**
- Investigazioni complete = **VERDE**

**Override Eccezioni Politiche:**
- Frequenti eccezioni per personale "fidato" = Aumenti rischio di un livello
- Applicazione politiche uniforme = Mantenga livello corrente

**Controllo Finale:**
- Implementazione zero trust completa = **VERDE**
- Zero trust parziale con eccezioni giustificate = **GIALLO**
- Zero trust rifiutato o eccezioni importanti basate su fiducia = **ROSSO**

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
□ **Implementare User Behavior Analytics** - Costo medio, 30-60 giorni
□ **Standardizzare Controlli Accesso** - Costo basso, 30 giorni
□ **Processo Risposta Incidenti Potenziato** - Costo basso, immediato

### ALTO IMPATTO / LUNGO TERMINE
□ **Architettura Zero Trust** - Costo alto, 6-12 mesi
□ **Programma Formale Minacce Interne** - Costo medio, 90-180 giorni

### MEDIO IMPATTO / IMPLEMENTAZIONE RAPIDA
□ **Pilot Behavioral Analytics** - Costo basso, 30 giorni
□ **Programma Valutazione Rischio Fornitori** - Costo basso, immediato
□ **Revisione Eccezioni Politiche** - Costo basso, immediato

### Dipendenze
- **Zero Trust** richiede investimento infrastruttura rete
- **Programma Minacce Interne** richiede personale dedicato
- **UEBA** richiede integrazione dati e formazione

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Quando ha avuto l'ultimo incidente di sicurezza, come ha determinato se fosse un lavoro interno o esterno?"**
- *Follow-up*: "Quali evidenze ha cercato internamente?"
- *Segnale allarme*: Attribuzione esterna immediata senza investigazione

**"Mi illustri come un executive senior ottiene accesso a un nuovo sistema."**
- *Follow-up*: "Ci sono differenze rispetto a come i dipendenti regolari ottengono accesso?"
- *Segnale allarme*: Standard diversi, approvazione accelerata, verifica minima

**"Quale percentuale del Suo budget di sicurezza va al monitoraggio del comportamento utenti interni?"**
- *Follow-up*: "Come monitora i Suoi utenti privilegiati e amministratori?"
- *Segnale allarme*: Allocazione budget <20%, nessun monitoraggio utenti privilegiati

### Gestione Argomenti Sensibili
**"Stiamo esaminando approcci di sicurezza bilanciati che proteggono contro tutti i vettori di minaccia..."**
- Eviti: Linguaggio "minaccia interna" inizialmente
- Inquadri: "Postura di sicurezza completa"
- Enfatizzi: "Best practice del settore" e "aspettative regolamentari"

### Follow-up di Approfondimento
- "Può farmi un esempio specifico?"
- "Quanto spesso succede?"
- "Chi prende quelle decisioni?"
- "Cosa innescherebbe un'eccezione a quella politica?"

---

## 📊 MODELLO DI APPUNTI SUL CAMPO

### Riepilogo Valutazione
**Cliente**: _________________ **Data**: _________ **Auditor**: _____________

**Punteggio Valutazione Rapida**: ___/7 → **Livello Rischio**: Verde/Giallo/Rosso

### Risultati Chiave
**Indicatori Scissione Osservati:**
□ Bias attribuzione esterna nella risposta incidenti
□ Standard sicurezza differenziali per ruolo/anzianità
□ Monitoraggio utenti privilegiati inadeguato
□ Eccezioni politiche basate su fiducia
□ Investimento sicurezza focalizzato su perimetro
□ Punti ciechi relazioni fornitori
□ Lacune implementazione zero trust

### Evidenze Raccolte
**Documenti Revisionati:** ________________________________
**Sistemi Dimostrati:** _____________________________
**Interviste Chiave:** ____________________________________

### Raccomandazioni Immediate
1. **Priorità 1 (30 giorni)**: ____________________________
2. **Priorità 2 (60 giorni)**: ____________________________
3. **Priorità 3 (90+ giorni)**: ___________________________

### Valutazione Prontezza Cliente
**Sponsor Executive Identificato**: Sì/No
**Autorità Budget Presente**: Sì/No
**Risorse Tecniche Disponibili**: Sì/No
**Resistenza Culturale Prevista**: Alta/Media/Bassa

### Azioni di Follow-up
□ Proposta valutazione dettagliata necessaria
□ Revisione architettura tecnica richiesta
□ Supporto sviluppo politiche raccomandato
□ Sviluppo programma formazione suggerito
□ Assistenza pianificazione budget necessaria

---

## 🚨 AVVISI PER L'AUDITOR

### Segnali di Allarme che Richiedono Escalation Immediata
- **Completa mancanza di monitoraggio minacce interne**
- **Nessuna investigazione fattori interni in incidenti recenti**
- **Esenzioni executive da tutti i controlli di sicurezza**
- **Accesso fornitori mai revisionato o monitorato**

### Pushback Comune del Cliente
*"Ci fidiamo delle nostre persone"* → "La fiducia con verifica è lo standard del settore"
*"Le minacce esterne sono il rischio reale"* → "La protezione completa affronta tutti i vettori"
*"Questo danneggerebbe la nostra cultura"* → "La sicurezza bilanciata rafforza effettivamente la cultura"

### Controlli Qualità Valutazione
- Ha visto sistemi di monitoraggio effettivi, non solo politiche?
- Ha revisionato rapporti incidenti reali, non solo procedure?
- Ha verificato numeri budget, non solo stime?
- Ha testato controlli accesso, non solo documentazione?

---

**Versione Field Kit 1.0** | **Tempo Valutazione: 22 minuti** | **Generazione Rapporto: 8 minuti**
