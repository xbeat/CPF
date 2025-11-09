# CPF INDICATORE 8.7 FIELD KIT
**Valutazione della Confusione da Equazione Simbolica**

---

## VALUTAZIONE RAPIDA (5 minuti)

**Segnare SÌ/NO per ciascuna osservazione:**

□ **D1:** Gli utenti tipicamente cliccano sugli alert di sicurezza entro 10 secondi senza leggere il contenuto?
□ **D2:** La formazione sulla sicurezza si concentra sul "riconoscere simboli affidabili" piuttosto che sui passaggi di verifica?
□ **D3:** Gli utenti non sono in grado di spiegare come verificare un certificato SSL oltre a "cercare il lucchetto"?
□ **D4:** I report degli incidenti mostrano utenti che installano software basandosi su popup a tema sicurezza?
□ **D5:** Non esiste una policy scritta che richieda di contattare l'IT prima di agire su avvisi di sicurezza non familiari?
□ **D6:** Gli utenti riportano "sembrava legittimo" come motivo principale per le decisioni di sicurezza negli incidenti?
□ **D7:** Si verificano più di 2 infezioni malware correlate alla sicurezza al mese nonostante la formazione sulla consapevolezza della sicurezza?

**CONTEGGIO SEGNALI DI ALLARME:** ___/7

---

## RACCOLTA DELLE EVIDENZE (10 minuti)

### Documenti da Richiedere
- [ ] **Report di incidenti di sicurezza** degli ultimi 90 giorni (focus su malware/phishing)
- [ ] **Materiali di formazione sulla consapevolezza della sicurezza** (cercare riconoscimento simboli vs. verifica)
- [ ] **Ticket dell'help desk IT** relativi a "popup sospetti" o "avvisi di sicurezza"
- [ ] **Policy di sicurezza scritte** per la risposta degli utenti ad alert non familiari
- [ ] **Screenshot della configurazione della protezione endpoint**

### Dimostrazioni da Richiedere
- [ ] **"Mi mostri come verifica che un sito web sia sicuro"** (osservare l'approccio basato solo sul lucchetto)
- [ ] **"Mi illustri la Sua risposta a un popup di sicurezza"** (cronometrare il processo decisionale)
- [ ] **"Mi mostri l'elenco dei software di sicurezza approvati"** (verificare se esiste)

### Controlli di Sistema da Eseguire
- [ ] **Impostazioni di group policy** - verificare la prevenzione dell'installazione non autorizzata di software di sicurezza
- [ ] **Regole di sicurezza email** - controllare la segnalazione di messaggi a tema sicurezza esterni
- [ ] **Configurazione sistema di alert** - documentare tutte le fonti di notifiche di sicurezza

### Target delle Interviste
- [ ] **Utenti finali** (2-3 membri del personale a caso)
- [ ] **Personale help desk IT**
- [ ] **Formatore consapevolezza sicurezza**
- [ ] **Amministratore IT** responsabile della protezione endpoint

---

## PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale
**ROSSO (2 punti):**
- Se 5+ domande Valutazione Rapida = SÌ
- OPPURE se >3 infezioni malware di sicurezza in 90 giorni
- OPPURE se gli utenti non sanno spiegare i passaggi di verifica oltre al riconoscimento visivo

**GIALLO (1 punto):**
- Se 3-4 domande Valutazione Rapida = SÌ
- E alcune procedure di verifica esistono ma sono seguite in modo incoerente
- E 1-3 infezioni malware di sicurezza in 90 giorni

**VERDE (0 punti):**
- Se ≤2 domande Valutazione Rapida = SÌ
- E procedure di verifica documentate esistono e sono seguite
- E <1 infezione malware di sicurezza in 90 giorni
- E la formazione include esercizi pratici di verifica

**PUNTEGGIO FINALE:** _____ (0=Verde, 1=Giallo, 2=Rosso)

---

## PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA (Da Fare Per Primo)
- [ ] **Bloccare popup di sicurezza non autorizzati** tramite group policy (Costo: Basso, Tempo: 1 giorno)
- [ ] **Creare checklist di verifica degli alert di sicurezza** (Costo: Basso, Tempo: 2 giorni)
- [ ] **Stabilire policy di installazione software di sicurezza solo IT** (Costo: Basso, Tempo: 1 settimana)

### ALTO IMPATTO / LUNGO TERMINE (Pianificare Successivamente)
- [ ] **Implementare sistema di notifiche di sicurezza centralizzato** (Costo: Medio, Tempo: 4-6 settimane)
- [ ] **Implementare workshop di formazione pratica sulla verifica** (Costo: Medio, Tempo: 8 settimane)
- [ ] **Creare sistema di audit trail delle decisioni di sicurezza** (Costo: Alto, Tempo: 12 settimane)

### MEDIO IMPATTO / CONTINUATIVO
- [ ] **Simulazioni di phishing regolari con notifiche di sicurezza false** (Costo: Basso, Continuativo)
- [ ] **Consapevolezza dei simboli di sicurezza nella formazione mensile** (Costo: Basso, Continuativo)
- [ ] **Monitorare i ticket help desk per le tendenze dei pattern di verifica** (Costo: Basso, Continuativo)

**DIPENDENZE:**
- Le modifiche alle group policy richiedono accesso amministratore di dominio
- I workshop di formazione necessitano dell'approvazione del management per il tempo del personale
- Le notifiche centralizzate necessitano di valutazione dell'infrastruttura IT

---

## CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Quando i Suoi utenti vedono un popup di avviso di sicurezza, cosa accade tipicamente?"**
- *Follow-up: "Quanto rapidamente rispondono di solito?"*
- *Ascoltare: Clic immediato vs. passaggi di verifica*

**"Può illustrarmi l'ultimo incidente di sicurezza che ha coinvolto un utente che ha cliccato su qualcosa che non avrebbe dovuto?"**
- *Follow-up: "Qual è stata la loro spiegazione per averci cliccato?"*
- *Segnale di allarme: "Sembrava legittimo" o "Mi fidavo del logo dell'antivirus"*

**"Come forma gli utenti a distinguere tra alert di sicurezza reali e falsi?"**
- *Follow-up: "Può mostrarmi i materiali di formazione?"*
- *Segnale di allarme: Focus sul riconoscimento dei simboli piuttosto che sui passaggi di verifica*

### Domande di Approfondimento per Segnali di Allarme
**Se gli utenti menzionano segnali visivi:** "Oltre all'aspetto, quali altri controlli eseguono?"

**Se esiste formazione:** "Come praticano queste competenze di verifica gli utenti?"

**Se si sono verificati incidenti:** "Quali pattern osserva nel motivo per cui gli utenti si fidano di messaggi di sicurezza falsi?"

### Linguaggio Professionale per Argomenti Delicati
- **Invece di:** "I Suoi utenti cadono in truffe ovvie"
- **Dire:** "Stiamo osservando un pattern in cui gli indicatori di sicurezza visivi potrebbero guidare le decisioni"

- **Invece di:** "Questo è un fallimento di sicurezza di base"
- **Dire:** "C'è un'opportunità per rafforzare le procedure di verifica"

---

## TEMPLATE NOTE SUL CAMPO

**Cliente:** _________________ **Data:** _______ **Auditor:** _________

### Risultati Valutazione Rapida
**Risultati Domande 1-7:** S/N S/N S/N S/N S/N S/N S/N
**Conteggio Segnali di Allarme:** ___/7

### Evidenze Chiave Raccolte
**Incidenti di sicurezza (90 giorni):** ________________________________
**Approccio formativo:** ___________________________________________
**Policy esistenti:** __________________________________________
**Controlli tecnici:** _________________________________________

### Osservazioni Critiche
**Pattern comportamentali utenti:** _____________________________________
**Procedure di verifica:** ____________________________________
**Velocità decisionale:** ____________________________________________

### Preoccupazioni Immediate
**Risultati ad alto rischio:** ________________________________________
**Risultati rapidi identificati:** _____________________________________
**Requisiti risorse:** ______________________________________

### Follow-Up Richiesto
□ Interviste aggiuntive necessarie
□ Accesso ai sistemi richiesto per verifica
□ Revisione documentazione policy in sospeso
□ Analisi materiali formativi incompleta

**Prossimi passi raccomandati:** ____________________________________
____________________________________________________________

**Tempo di completamento valutazione:** _______ minuti
**Confidenza nel punteggio:** Alta / Media / Bassa
**Ricettività del cliente:** Alta / Media / Bassa

---

## METRICHE DI SUCCESSO DA TRACCIARE POST-IMPLEMENTAZIONE

**Target a 30 giorni:**
- [ ] 80% degli alert di sicurezza segnalati all'IT prima dell'azione dell'utente
- [ ] <5 secondi di aumento medio del tempo per il processo decisionale di sicurezza
- [ ] Zero installazioni di software di sicurezza non autorizzate

**Target a 90 giorni:**
- [ ] Riduzione del 60% degli incidenti malware correlati alla sicurezza
- [ ] 90% degli utenti può dimostrare la verifica dei certificati
- [ ] Tutte le decisioni di sicurezza documentate con motivazione

**Valutazione completa. Procedere alla pianificazione della remediation basata sulla matrice di priorità.**
