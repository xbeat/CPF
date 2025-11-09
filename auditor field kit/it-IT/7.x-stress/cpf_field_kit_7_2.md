# 📋 CPF INDICATORE 7.2 FIELD KIT
## VALUTAZIONE BURNOUT DA STRESS CRONICO

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Verifichi SÌ/NO per ciascun indicatore osservabile:**

☐ **Il personale di sicurezza lavora abitualmente >50 ore/settimana** (verificare fogli presenza, registri straordinari)
☐ **Il SOC elabora >200 alert giornalieri per analista** (verificare dashboard SIEM, volumi di alert)
☐ **Nessuna politica di ferie forzate durante gli incidenti** (verificare esistenza di programmi di rotazione)
☐ **Nessun supporto psicologico documentato post-incidente** (verificare procedure di risposta agli incidenti)
☐ **Le raccomandazioni di sicurezza sono frequentemente rifiutate dal business** (verificare tassi di approvazione)
☐ **Budget formazione annuale <€2.000 per membro del personale di sicurezza** (verificare spese sviluppo professionale)
☐ **Il team mostra visibile affaticamento/cinismo durante le interviste** (osservare comportamento, risposte)

**SCORING:** Conteggio totale risposte SÌ = **___/7**

---

## 📝 RACCOLTA DELLE PROVE (10 minuti)

### **Documenti da Richiedere:**
- [ ] **Registri fogli presenza** per il personale di sicurezza (ultimi 6 mesi)
- [ ] **Report volumi alert SIEM** (medie giornaliere/settimanali)
- [ ] **Log di risposta agli incidenti** (ultimi 3 incidenti maggiori)
- [ ] **Organigramma team di sicurezza** con livelli di personale attuali
- [ ] **Allocazione budget sviluppo professionale** per la sicurezza
- [ ] **Indagini di soddisfazione dei dipendenti** (se disponibili)

### **Dimostrazioni da Osservare:**
- [ ] **"Mi mostri le operazioni del Suo SOC durante un turno tipico"**
- [ ] **"Mi illustri il Suo processo di triage degli alert"**
- [ ] **"Mi dimostri la Sua procedura di escalation degli incidenti"**

### **Verifiche di Sistema da Eseguire:**
- [ ] **Percentuale di automazione SOAR** (quale % di alert elaborati automaticamente?)
- [ ] **Tempi da alert a risoluzione** (tempi medi di risposta)
- [ ] **Utilizzo ferie/congedi per malattia** vs. media aziendale

### **Obiettivi per le Interviste:**
- [ ] **SOC Manager** (pattern di personale, gestione del carico di lavoro)
- [ ] **2-3 Analisti SOC** (livelli di stress individuali, soddisfazione lavorativa)
- [ ] **CISO/Security Director** (politiche di supporto del team, programmi di riconoscimento)
- [ ] **Rappresentante HR** (identificazione burnout, risorse di supporto)

---

## 🎯 SCORING RAPIDO (2 minuti)

### **Albero Decisionale:**

**Se 0-1 risposte SÌ:** → **VERDE (Rischio Basso)**
- Orari di lavoro standard mantenuti
- Volumi di alert gestibili con automazione
- Sistemi di supporto chiari in atto

**Se 2-4 risposte SÌ:** → **GIALLO (Rischio Moderato)**
- Alcuni indicatori di burnout presenti
- Intervento raccomandato entro 30 giorni
- Monitorare attentamente per deterioramento

**Se 5-7 risposte SÌ:** → **ROSSO (Rischio Elevato)**
- Multipli indicatori severi di burnout
- Intervento immediato richiesto
- Vulnerabilità di sicurezza significativa esistente

**PUNTEGGIO FINALE:** ☐ Verde ☐ Giallo ☐ Rosso

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### **ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA (0-30 giorni)**
**Costo: Basso**
- [ ] **Iniziativa di tuning degli alert** - Ridurre falsi positivi del 50%
- [ ] **Politica di pausa obbligatoria** - Recupero di 48 ore tra incidenti maggiori
- [ ] **Lancio programma di riconoscimento** - Celebrazioni mensili dei successi di sicurezza

### **MEDIO IMPATTO / IMPLEMENTAZIONE MODERATA (1-6 mesi)**
**Costo: Medio**
- [ ] **Deployment piattaforma SOAR** - Automatizzare 60-80% degli alert di routine
- [ ] **Programma di formazione incrociata** - Abilitare copertura flessibile dei ruoli
- [ ] **Accesso counseling EAP** - Supporto specializzato per stress da cybersecurity

### **ALTO IMPATTO / IMPLEMENTAZIONE A LUNGO TERMINE (6+ mesi)**
**Costo: Elevato**
- [ ] **Modello di personale follow-the-sun** - Operazioni 24/7 senza sovraccarico individuale
- [ ] **Programma di sviluppo di carriera** - Percorsi di avanzamento chiari + formazione annuale €3.000+
- [ ] **Trasformazione culturale** - Passaggio da cultura della colpa a cultura orientata all'apprendimento

**Dipendenze:**
- Impegno della leadership esecutiva richiesto per cambiamenti culturali
- Approvazione budget necessaria per SOAR ed espansioni di personale
- Partnership HR essenziale per programmi di supporto psicologico

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### **Domande di Apertura:**
- *"Quante ore ha lavorato il Suo team di sicurezza durante l'ultimo incidente maggiore?"*
- *"Qual è la sfida più grande che i Suoi analisti SOC affrontano quotidianamente?"*
- *"Quando ha celebrato l'ultima volta un successo di sicurezza o una prevenzione efficace?"*

### **Domande di Follow-up:**
**Se menzionano volumi elevati di alert:**
- *"Quale percentuale di quegli alert richiede analisi umana?"*
- *"Come previene l'affaticamento da alert tra il Suo team?"*

**Se menzionano sfide di personale:**
- *"Qual è la Sua politica per le ferie obbligatorie durante i periodi intensi?"*
- *"Come gestisce la copertura quando più membri del team necessitano pause?"*

**Se menzionano stress da incidenti:**
- *"Quale supporto fornisce ai membri del team dopo eventi di sicurezza maggiori?"*
- *"Come aiuta le persone a decomprimere e recuperare?"*

### **Indicatori di Red Flag:**
⚠️ **"Il nostro team è disponibile 24/7"** (nessuna politica di pausa)
⚠️ **"Non abbiamo tempo per la formazione"** (nessuno sviluppo professionale)
⚠️ **"La sicurezza è responsabilità di tutti"** (diffusione della responsabilità)
⚠️ **"Impariamo dai nostri errori"** (cultura focalizzata sulla colpa)

### **Linguaggio Professionale per Argomenti Sensibili:**
- **Invece di:** "Il Suo team appare esaurito"
- **Dire:** "Discutiamo la sostenibilità del carico di lavoro e il benessere del team"

- **Invece di:** "Questa è una situazione ad alto rischio"
- **Dire:** "Ho identificato alcune opportunità per migliorare la resilienza del team"

---

## 📊 TEMPLATE NOTE DI CAMPO

**Cliente:** _________________________ **Data:** ___/___/_____

**Tempo di Valutazione:** Inizio: _______ Fine: _______ **Totale:** _______

### **Risultati Chiave:**
**Pattern di Personale:** _________________________________________________
**Volume di Alert:** ____________________________________________________
**Sistemi di Supporto:** _________________________________________________
**Morale del Team Osservabile:** __________________________________________

### **Citazioni Critiche:**
**SOC Manager:** ___________________________________________________
**Feedback Analista:** _______________________________________________
**Prospettiva Leadership:** __________________________________________

### **Preoccupazioni Immediate:**
☐ **Urgente:** Team mostra segni severi di esaurimento
☐ **Monitorare:** Alcuni indicatori di stress ma gestibili
☐ **Stabile:** Buoni sistemi di supporto in atto

### **Prossimi Passi:**
**Azioni a 30 giorni:** ________________________________________________
**Obiettivi a 90 giorni:** __________________________________________________
**Punti per briefing esecutivo:** _____________________________________

### **Follow-up Richiesto:**
☐ Programmare interviste di valutazione dello stress
☐ Revisionare opportunità di automazione
☐ Presentazione esecutiva sui risultati
☐ Consultazione HR su programmi di supporto

---

**Valutazione completata in meno di 25 minuti ✓**
**Risultati azionabili identificati ✓**
**Fiducia del cliente mantenuta ✓**
