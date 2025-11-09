# 📋 CPF FIELD KIT 6.5: EFFETTO SPETTATORE NELLA RISPOSTA AGLI INCIDENTI

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Istruzioni**: Selezioni SÌ/NO per ogni elemento. Si concentri solo su evidenze osservabili.

□ **SÌ/NO**: L'organizzazione ha **individui nominati** assegnati come responder primari per tipi specifici di incidenti?

□ **SÌ/NO**: Gli avvisi di sicurezza sono automaticamente assegnati a **persone specifiche** entro 15 minuti dal rilevamento?

□ **SÌ/NO**: Le procedure scritte specificano **esattamente chi assume la proprietà** negli incidenti multi-team?

□ **SÌ/NO**: Esiste un **programma di rotazione** che mostra chi è responsabile per gli incidenti fuori orario?

□ **SÌ/NO**: Può verificare incidenti in cui **la risposta è avvenuta entro 30 minuti** indipendentemente dalla dimensione del team?

□ **SÌ/NO**: L'organizzazione monitora **metriche di iniziativa individuali** (escalation, buone catture)?

□ **SÌ/NO**: Ci sono **esempi recenti** (ultimi 60 giorni) di dipendenti che segnalano attività sospette?

---

## 📝 RACCOLTA DI EVIDENZE (10 minuti)

### Documenti da Richiedere
- [ ] **Registri di assegnazione incidenti** (ultimi 30 giorni)
- [ ] **Registri di assegnazione avvisi SIEM/SOAR** che mostrano workflow automatizzati
- [ ] **Playbook di risposta agli incidenti** con assegnazioni di ruolo
- [ ] **Programma di copertura fuori orario** con contatti nominati
- [ ] **Metriche di sensibilizzazione alla sicurezza** e tendenze di segnalazione
- [ ] **Rapporti di analisi post-incidente** che menzionano problemi di coordinamento

### Dimostrazioni da Richiedere
- [ ] **"Mi mostri il Suo dashboard degli avvisi"** - osservi lo stato di assegnazione in tempo reale
- [ ] **"Illustri il Suo ultimo incidente"** - timeline dall'avviso alla risposta
- [ ] **"Dimostri il processo di escalation"** - chi decide e quanto rapidamente
- [ ] **"Mostri la segnalazione email sospette"** - processo e strumenti per i dipendenti

### Controlli di Sistema da Eseguire
- [ ] **Testare il workflow di assegnazione avvisi** durante le operazioni dal vivo
- [ ] **Verificare la configurazione delle notifiche mobili** per i responder primari
- [ ] **Controllare l'accessibilità del dashboard** per il coordinamento del team
- [ ] **Revisionare i timer di escalation automatica** e le assegnazioni di backup

### Obiettivi dell'Intervista (5 minuti ciascuno)
- [ ] **Analista di Sicurezza** - "Come sa quali avvisi sono Suoi?"
- [ ] **Personale IT Helpdesk** - "Quando scala vs gestisce problemi di sicurezza?"
- [ ] **Manager di Dipartimento** - "Come i dipendenti segnalano attività sospette?"
- [ ] **Contatto Fuori Orario** - "Mi illustri la risposta agli incidenti nel weekend"

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale

**INIZI QUI**: Gli avvisi sono automaticamente assegnati a individui nominati?

➤ **SE SÌ**: Vada a Controllo Tempo di Risposta
➤ **SE NO**: **PUNTEGGIO ROSSO** - Si fermi qui

**Controllo Tempo di Risposta**: L'80%+ degli incidenti è riconosciuto entro 30 minuti?

➤ **SE SÌ**: Vada a Controllo Multi-Team
➤ **SE NO**: **PUNTEGGIO GIALLO** - Continui

**Controllo Multi-Team**: Le procedure assegnano chiaramente la proprietà per incidenti cross-dipartimento?

➤ **SE SÌ**: Vada a Controllo Iniziativa
➤ **SE NO**: **PUNTEGGIO GIALLO** - Continui

**Controllo Iniziativa**: Ci sono 3+ esempi negli ultimi 60 giorni di segnalazione/escalation proattiva?

➤ **SE SÌ**: **PUNTEGGIO VERDE**
➤ **SE NO**: **PUNTEGGIO GIALLO**

### Criteri di Punteggio Oggettivi

| Punteggio | Criteri |
|-------|----------|
| **🟢 VERDE (0)** | • Esiste assegnazione responder nominato<br>• 80%+ avvisi riconosciuti <30 min<br>• Procedure chiare di proprietà multi-team<br>• 3+ esempi di iniziativa proattiva (60 giorni) |
| **🟡 GIALLO (1)** | • Esistono alcune procedure di assegnazione<br>• Tempi di risposta variano significativamente<br>• Lacune nella copertura cross-team<br>• Evidenza limitata di segnalazione proattiva |
| **🔴 ROSSO (2)** | • Nessun sistema di assegnazione individuale<br>• Ritardi regolari >30 minuti<br>• Multipli esempi "qualcun altro"<br>• Risposta più lenta con più persone disponibili |

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA

| Soluzione | Costo | Tempo | Dipendenze |
|----------|------|------|--------------|
| **Assegnazione Avvisi Individuali** | Basso | 2-4 settimane | Sistema SIEM/ticketing |
| **Configurazione Notifiche Mobili** | Basso | 1-2 settimane | Dispositivi mobili esistenti |
| **Schede Decisione Escalation** | Basso | 1 settimana | Solo materiali formazione |

### MEDIO IMPATTO / LUNGO TERMINE

| Soluzione | Costo | Tempo | Dipendenze |
|----------|------|------|--------------|
| **Protocollo Incident Commander** | Medio | 2-3 mesi | Formazione, aggiornamenti politiche |
| **Programma di Riconoscimento** | Medio | 6-8 settimane | Integrazione HR |
| **Dashboard di Coordinamento** | Alto | 3-6 mesi | Implementazione piattaforma SOAR |

### FONDAMENTALE / LUNGO TERMINE

| Soluzione | Costo | Tempo | Dipendenze |
|----------|------|------|--------------|
| **Formazione Micro-Simulazione** | Medio | 3-4 mesi | Sviluppo scenari |
| **Esercitazioni Cross-funzionali** | Basso | In corso | Pianificazione regolare |

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Mi illustri cosa è successo durante il Suo ultimo avviso di sicurezza che ha coinvolto più persone che avrebbero potuto rispondere."**

**Prompt di follow-up:**
- "Quanto tempo prima che qualcuno assumesse la proprietà?"
- "Qualcuno ha presunto che qualcun altro se ne stesse occupando?"
- "Cosa sarebbe successo se [persona primaria] non fosse stata disponibile?"

### Indicatori di Segnale di Allarme
- **Frasi come**: "Pensavamo che l'IT se ne stesse occupando" / "La sicurezza di solito se ne occupa"
- **Ritardi di tempo**: >30 minuti tra avviso e risposta umana
- **Confusione su**: Chi ha l'autorità di scalare gli incidenti
- **Più persone**: Avrebbero potuto agire ma nessuno lo ha fatto inizialmente

### Linguaggio Professionale per Argomenti Sensibili
- Invece di: "Il Suo team ha problemi di effetto spettatore"
- Dica: "Ottimizziamo il coordinamento degli incidenti e la responsabilità individuale"

- Invece di: "Le persone sono pigre/irresponsabili"
- Dica: "Possiamo migliorare la chiarezza sulla proprietà della risposta"

- Invece di: "Questo è un problema psicologico"
- Dica: "Questo riguarda l'ottimizzazione del workflow e procedure chiare"

### Domande Chiave di Follow-up
1. **"Chi viene specificamente notificato quando si attiva [tipo di avviso specifico]?"**
2. **"Cosa succede se quella persona non è disponibile o non risponde?"**
3. **"Come monitora se qualcuno ha iniziato a investigare un avviso?"**
4. **"Quando è stata l'ultima volta che qualcuno ha segnalato qualcosa di sospetto che ha notato?"**

---

## 📊 MODELLO DI APPUNTI SUL CAMPO

### Riepilogo Valutazione
**Data**: _________________ **Auditor**: _________________

**Organizzazione**: ________________________________

**Contatti Primari Intervistati**:
- Sicurezza: _________________________________
- IT Operations: ____________________________
- Management: ______________________________

### Risultati Chiave

**Sistema Assegnazione Avvisi**: □ Esiste □ Parziale □ Mancante
**Monitoraggio Tempo di Risposta**: □ Coerente □ Variabile □ Non misurato
**Coordinamento Multi-team**: □ Procedure chiare □ Alcune lacune □ Poco chiaro
**Iniziativa Individuale**: □ Incoraggiata □ Mista □ Scoraggiata

### Evidenze Raccolte
- [ ] Registri di assegnazione avvisi revisionati
- [ ] Dimostrazione dashboard osservata
- [ ] Analisi timeline incidenti completata
- [ ] Esempi di segnalazione dipendenti documentati

### Priorità Raccomandazioni
1. **Immediata (0-30 giorni)**: ________________________________
2. **Breve termine (1-3 mesi)**: _____________________________
3. **Lungo termine (3-12 mesi)**: _____________________________

### Giustificazione Punteggio
**Punteggio Finale**: □ Verde (0) □ Giallo (1) □ Rosso (2)

**Fattori chiave che influenzano il punteggio**:
________________________________________________
________________________________________________

### Follow-up Cliente Richiesto
- [ ] Documentazione aggiuntiva necessaria
- [ ] Dimostrazione tecnica programmata
- [ ] Intervista management in sospeso
- [ ] Discussione timeline implementazione

**Prossimi Passi**: ________________________________________
__________________________________________________

---

## 🎯 VALIDAZIONE DEL SUCCESSO

**Questa valutazione è completa quando può rispondere:**
- ✅ Chi risponde agli avvisi quando si attivano?
- ✅ Quanto rapidamente qualcuno assume la proprietà?
- ✅ Cosa succede negli incidenti multi-team?
- ✅ Le persone stanno prendendo iniziativa individuale?
- ✅ Quali miglioramenti specifici sono necessari?

**Tempo Totale di Valutazione**: _______ minuti (Obiettivo: <25 minuti)
