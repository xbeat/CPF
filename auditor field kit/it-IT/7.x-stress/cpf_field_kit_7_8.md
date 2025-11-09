# 📋 CPF INDICATORE 7.8 FIELD KIT
## Valutazione Memoria Compromessa dal Cortisolo

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Verifichi SÌ se la condizione è presente:**

□ **1. Aumento Consultazione Procedure**
   Durante gli ultimi 3 incidenti maggiori, i team hanno consultato frequentemente procedure scritte per compiti normalmente memorizzati

□ **2. Degradazione Performance nella Formazione**
   Il personale performa significativamente peggio in simulazioni ad alta pressione rispetto alla formazione in aula

□ **3. Violazioni Politiche di Autenticazione**
   Condivisione password, bypass MFA o scorciatoie aumentano durante periodi intensi/di crisi

□ **4. Dipendenza dalla Documentazione**
   Il personale di sicurezza esperto fa forte affidamento su procedure scritte quando sotto pressione organizzativa

□ **5. Errori di Sicurezza nei Periodi di Stress**
   Gli errori di sicurezza basilari aumentano durante tagli di budget, audit, scadenze o cambiamenti maggiori

□ **6. Fallimenti nel Trasferimento di Conoscenze**
   Perdita significativa di conoscenze di sicurezza quando il personale chiave non è disponibile durante periodi critici

□ **7. Varianza nei Tempi di Risposta**
   I tempi di risposta di sicurezza sono significativamente più lenti durante periodi organizzativi ad alto stress

**Punteggio Rapido:** ROSSO se 5-7 SÌ | GIALLO se 3-4 SÌ | VERDE se 0-2 SÌ

---

## 📝 RACCOLTA DELLE PROVE (10 minuti)

### Documenti da Richiedere
□ **Log di Risposta agli Incidenti** - Ultimi 6 mesi di incidenti maggiori
□ **Registri di Formazione** - Dati di performance simulazione vs. aula
□ **Violazioni delle Politiche di Sicurezza** - Violazioni di autenticazione/accesso durante periodi di stress
□ **Metriche Tempi di Risposta** - Confronti periodi normali vs. ad alto stress
□ **Report Turnover del Personale** - Cambiamenti team di sicurezza e impatti di transizione

### Dimostrazioni di Sistema
□ **"Mi mostri la risposta agli incidenti durante l'ultima interruzione maggiore"** - Illustrare i passi di risposta effettivi
□ **"Mi dimostri il Suo processo di autenticazione sotto pressione temporale"** - Osservare scorciatoie/bypass
□ **"Mi mostri i risultati delle simulazioni di formazione"** - Comparare metriche di performance stress vs. non-stress

### Obiettivi per le Interviste
□ **SOC Manager** - Cambiamenti tempi di risposta, pattern di errori
□ **Security Team Lead** - Efficacia formazione, problemi di trasferimento conoscenze
□ **IT Operations** - Cambiamenti comportamento autenticazione durante pressione
□ **Rappresentante HR** - Incidenti di sicurezza correlati allo stress, problematiche del personale

### Verifiche di Sistema
□ **Log di Autenticazione** - Tentativi di bypass durante periodi di stress noti
□ **Sistema di Formazione** - Metriche di performance per condizione di stress
□ **Gestione Incidenti** - Metriche di qualità della risposta nel tempo
□ **Applicazione Politiche** - Efficacia controlli automatizzati vs. manuali

---

## 🎯 SCORING RAPIDO (2 minuti)

```
SE Gli incidenti maggiori mostrano >50% aumento consultazione procedure
   E Formazione mostra >30% calo performance sotto pressione
   E Violazioni autenticazione aumentano durante periodi stress
   ALLORA → ROSSO (2 punti)

SE Aumenti moderati consultazione procedure
   E Qualche degradazione performance formazione
   E Scorciatoie autenticazione minori entro politiche
   ALLORA → GIALLO (1 punto)

SE Consultazione procedure minima indipendentemente dallo stress
   E Performance formazione consistente sotto pressione
   E Nessun cambiamento pratiche autenticazione
   ALLORA → VERDE (0 punti)
```

**Albero Decisionale Scoring:**
- **Conteggio indicatori ROSSI:** ___/7
- **Conteggio indicatori GIALLI:** ___/7
- **Punteggio Finale:** ROSSO (5+ indicatori) | GIALLO (3-4 indicatori) | VERDE (0-2 indicatori)

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
□ **Controlli Indipendenti dalla Memoria** (Costo: Basso)
   - Forzare MFA, timeout automatici, sistemi di applicazione politiche
   - **Dipendenze:** Infrastruttura di autenticazione esistente

□ **Protocolli per Stati di Stress** (Costo: Basso)
   - Schede procedure plastificate, reminder visivi, checklist semplificate
   - **Dipendenze:** Nessuna - deployment immediato

### MEDIO IMPATTO / TIMELINE MEDIA
□ **Sistema Buddy** (Costo: Medio)
   - Verifica di due persone durante periodi ad alto stress
   - **Dipendenze:** Disponibilità personale, aggiornamenti procedure

□ **Intervalli di Recupero dallo Stress** (Costo: Basso)
   - Pause obbligatorie ogni 2 ore durante incidenti
   - **Dipendenze:** Buy-in del management, copertura personale

### ALTO IMPATTO / LUNGO TERMINE
□ **Formazione Contestuale allo Stress** (Costo: Alto)
   - Tutta la formazione condotta sotto condizioni di stress realistiche
   - **Dipendenze:** Revisione sistema di formazione, capacità di simulazione

□ **Attivazione Conoscenze Pre-Stress** (Costo: Medio)
   - Revisioni di conoscenze prima di periodi di stress anticipati
   - **Dipendenze:** Predizione periodi stress, sistemi di scheduling

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Mi racconti del Suo ultimo incidente di sicurezza maggiore - come ha performato il Suo team rispetto alla formazione?"**

**Follow-up:**
- "Quali procedure hanno dovuto consultare che normalmente conoscono?"
- "Quanto tempo ha richiesto la risposta rispetto alle esercitazioni tabletop?"
- "Quali errori sono successi che L'hanno sorpreso?"

### Valutazione dello Stress
**"Quando la Sua organizzazione è sotto pressione - tagli di budget, audit, scadenze strette - cosa cambia nel comportamento di sicurezza?"**

**Follow-up:**
- "Le persone prendono scorciatoie con password o autenticazione?"
- "Come cambiano i tempi di risposta durante periodi intensi?"
- "Quali errori di sicurezza aumentano quando tutti sono stressati?"

### Indicatori di Red Flag
□ **Atteggiamento difensivo** riguardo relazione stress-performance
□ **"È così che funziona la sicurezza"** come attitudine
□ **Nessuna metrica** che traccia performance in condizioni diverse
□ **Cultura della colpa** attorno errori correlati allo stress
□ **Resistenza** a discutere fattori psicologici

### Linguaggio Professionale per Argomenti Sensibili
❌ Evitare: "Le Sue persone non riescono a ricordare sicurezza basilare"
✅ Usare: "Stiamo valutando come la pressione organizzativa influenza l'aderenza ai protocolli di sicurezza"

❌ Evitare: "Lo stress rende il Suo team incompetente"
✅ Usare: "Le situazioni ad alta pressione possono impattare la performance anche di professionisti ben formati"

---

## 📊 TEMPLATE NOTE DI CAMPO

**Organizzazione:** _________________ **Data:** ___/___/_____ **Auditor:** _______________

### Risultati Valutazione
**Punteggio Rapido:** □ VERDE (0-2) □ GIALLO (3-4) □ ROSSO (5-7)

**Prove Chiave Trovate:**
- Frequenza consultazione risposta incidenti: ________________________________
- Delta performance formazione: ____________________________________________
- Pattern violazioni autenticazione: _____________________________________
- Varianza tempi di risposta: _______________________________________________

### Raccomandazioni Prioritarie
**Immediato (0-30 giorni):**
1. _________________________________________________________________
2. _________________________________________________________________

**Breve termine (30-90 giorni):**
1. _________________________________________________________________
2. _________________________________________________________________

**Lungo termine (90+ giorni):**
1. _________________________________________________________________
2. _________________________________________________________________

### Prontezza del Cliente
□ **Alta** - Riconosce il problema, pronto ad implementare soluzioni
□ **Media** - Qualche resistenza ma disposto a considerare cambiamenti
□ **Bassa** - Difensivo, richiede educazione sull'impatto della vulnerabilità

### Follow-up Richiesto
□ **Analisi periodo stress** - Necessità di osservare durante evento ad alto stress effettivo
□ **Valutazione formazione** - Richiede revisione più approfondita efficacia formazione
□ **Revisione politiche** - Politiche di autenticazione e risposta incidenti necessitano esame
□ **Valutazione cultura** - Cultura dello stress organizzativo potrebbe necessitare valutazione separata

**Prossimi Passi:** ________________________________________________________
____________________________________________________________________

---

**⏱️ Tempo Totale Valutazione:** 22 minuti | **📋 Checklist Completa:** ___/30 elementi
