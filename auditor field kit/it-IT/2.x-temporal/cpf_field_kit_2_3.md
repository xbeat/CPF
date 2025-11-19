# 📋 CPF INDICATORE 2.3 KIT SUL CAMPO
## Accettazione del Rischio Guidata dalle Scadenze

---

## ⚡ VALUTAZIONE RAPIDA (5 min)

**Spuntare tutto ciò che si applica - Solo evidenze osservabili:**

- [ ] **Log di Eccezioni di Sicurezza**: L'organizzazione mantiene log formali di eccezioni di sicurezza richieste per scopi di scadenza (ultimi 6 mesi)
- [ ] **Documentazione Ritardi Patch**: Evidenza scritta di patch di sicurezza ritardate a causa di preoccupazioni per le scadenze (ultimi 6 mesi)
- [ ] **Dati di Completamento Formazione**: I tassi di completamento della formazione di sicurezza calano >15% durante i periodi noti di scadenze
- [ ] **Uso di Strumenti Non Autorizzati**: Ticket di help desk o log di sistema mostrano aumento dell'uso di dispositivi personali/servizi cloud durante i periodi di scadenza
- [ ] **Richieste di Accesso di Emergenza**: Pattern di richieste di accesso elevato raggruppate intorno alle scadenze di progetto
- [ ] **Autorità del Project Manager**: Esiste una policy scritta che definisce l'autorità del project manager di ignorare i requisiti di sicurezza
- [ ] **Ritardi nella Risposta agli Incidenti**: I tempi di completamento delle indagini sugli incidenti di sicurezza aumentano durante i periodi ad alta pressione

**Punteggio Rapido**:
- 0-1 spuntati = Verde | 2-4 spuntati = Giallo | 5+ spuntati = Rosso

---

## 📝 RACCOLTA DELLE EVIDENZE (10 min)

### Documenti da Richiedere
- [ ] Log di richieste di eccezioni di sicurezza (ultimi 6 mesi)
- [ ] Procedure di gestione progetti che menzionano requisiti di sicurezza
- [ ] Programmi di gestione patch che mostrano finestre di protezione
- [ ] Riepiloghi di ticket di help desk per richieste legate alle scadenze
- [ ] Rapporti di completamento formazione di sicurezza per mese/trimestre

### Dimostrazioni di Sistema Necessarie
- [ ] "Mi mostri il vostro processo per richieste di accesso di emergenza"
- [ ] "Mi illustri cosa succede quando le patch entrano in conflitto con le date di go-live"
- [ ] "Mi dimostri come appaiono i checkpoint di sicurezza nelle vostre timeline di progetto"

### Interviste Chiave
- [ ] **Project Manager**: Decisioni recenti di compromesso tra scadenza e sicurezza
- [ ] **Responsabile Sicurezza IT**: Processo di approvazione delle eccezioni e frequenza
- [ ] **Responsabile Help Desk**: Pattern di richieste inusuali durante i periodi di scadenza
- [ ] **Responsabile di Dipartimento**: Autorità di ignorare la sicurezza per le scadenze

### Verifiche di Sistema
- [ ] Rivedere log di accesso durante l'ultimo periodo importante di scadenza
- [ ] Verificare statistiche di utilizzo degli strumenti di sicurezza durante periodi di scadenza vs. normali
- [ ] Esaminare tassi di completamento backup durante periodi ad alta pressione
- [ ] Verificare programmi di distribuzione patch rispetto alle timeline di progetto

---

## 🎯 PUNTEGGIO RAPIDO (2 min)

### Albero Decisionale

**INIZIO QUI**: Le eccezioni di sicurezza vengono richieste formalmente per scopi di scadenza?

**Se NO** → Verificare coerenza completamento formazione
- Coerente attraverso periodi di scadenza/normali? → **VERDE**
- Calo >15% durante le scadenze? → **GIALLO**

**Se SÌ** → Con quale frequenza?
- Mensile o più → **ROSSO**
- Trimestrale o meno → Verificare processo di approvazione
  - Richiesta approvazione esecutiva formale? → **GIALLO**
  - Approvazione informale o del project manager? → **ROSSO**

### Criteri di Override
**ROSSO Automatico** se uno qualsiasi:
- [ ] I project manager possono ignorare la sicurezza senza approvazione esecutiva
- [ ] Pattern regolare di bypass di sicurezza "temporanei"
- [ ] La qualità della risposta agli incidenti di sicurezza si degrada durante i periodi di scadenza

**VERDE Automatico** se tutti:
- [ ] Zero eccezioni di sicurezza concesse per scopi di scadenza (6 mesi)
- [ ] Tassi di completamento formazione stabili tutto l'anno
- [ ] Tempi di risposta agli incidenti coerenti indipendentemente dalla pressione di scadenza

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 min)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
- **Sicurezza Integrata nella Timeline** (Costo Basso)
  - Aggiungere checkpoint di sicurezza al software di gestione progetti
  - Richiedere approvazione di sicurezza prima del completamento delle milestone
- **Chiarificazione Matrice di Autorità** (Costo Basso)
  - Documentare chi può approvare eccezioni di sicurezza
  - Rimuovere autorità di override informali

### IMPATTO MEDIO / IMPLEMENTAZIONE MODERATA
- **Automazione Consapevole delle Scadenze** (Costo Medio)
  - Distribuire monitoraggio potenziato durante i periodi di scadenza
  - Automatizzare distribuzione patch con capacità di rollback
- **Protocolli per Periodi di Stress** (Costo Medio)
  - Aumentare personale help desk durante le finestre di scadenza
  - Inviare promemoria di sicurezza mirati prima delle scadenze importanti

### ALTO IMPATTO / IMPLEMENTAZIONE A LUNGO TERMINE
- **Trasformazione Culturale** (Costo Alto)
  - Integrare metriche di sicurezza nei criteri di successo del progetto
  - Formare la leadership sull'impatto psicologico della pressione di scadenza
- **Monitoraggio Avanzato** (Costo Alto)
  - Implementare analytics comportamentali per vulnerabilità nei periodi di scadenza
  - Distribuire rilevamento minacce basato su AI durante le finestre ad alto rischio

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 min)

### Domande di Apertura
**"Mi racconti della sua scadenza importante più recente - fine trimestre, lancio prodotto o deposito normativo."**

**Follow-up**: "Cosa è successo ai processi di sicurezza durante quel periodo?"

### Domande di Approfondimento
- **"Chi ha l'autorità di dire 'salta la sicurezza per ora, sistemeremo dopo'?"**
- **"Con quale frequenza i team chiedono eccezioni di sicurezza temporanee?"**
- **"Cosa è diverso riguardo alla sicurezza durante i vostri periodi intensi rispetto ai periodi normali?"**

### Risposte di Allarme
- "La sicurezza deve semplicemente comprendere le priorità aziendali"
- "Sistemiamo sempre i problemi di sicurezza dopo la scadenza"
- "Tutti sanno che le scadenze vengono prima"
- "La Sicurezza IT deve essere più flessibile"

### Follow-up Professionali
- **"Può mostrarmi come i checkpoint di sicurezza sono integrati nei piani di progetto?"**
- **"Qual è il vostro processo per assicurare che le eccezioni temporanee vengano ripristinate?"**
- **"Come misurate la coerenza della sicurezza attraverso diversi periodi temporali?"**

---

## 📊 MODELLO DI NOTE SUL CAMPO

### Riepilogo Valutazione
**Data**: _________________ **Valutatore**: _________________

**Punteggio Complessivo**: ⬜ Verde ⬜ Giallo ⬜ Rosso

### Risultati Chiave
**Frequenza Eccezioni di Sicurezza**: _________________________________

**Impatto Scadenza Più Recente**: _________________________________

**Problemi Struttura di Autorità**: ___________________________________

### Evidenze Raccolte
- [ ] Log di eccezioni (quantità: ______)
- [ ] Documentazione procedure di progetto
- [ ] Dati di completamento formazione
- [ ] Note interviste (ruoli: _______)

### Preoccupazioni Immediate
**Alta Priorità**: ________________________________________________

**Richiede Follow-up**: __________________________________________

### Soluzioni Raccomandate
**Vittorie Rapide**: _________________________________________________

**Iniziative Strategiche**: ________________________________________

**Stima Budget**: ⬜ Basso (<€10.000) ⬜ Medio (€10.000-50.000) ⬜ Alto (>€50.000)

---

## 🔍 CHECKLIST DI VERIFICA

**Prima di lasciare il sito del cliente:**
- [ ] Tutti gli elementi di raccolta evidenze completati o documentati come non disponibili
- [ ] Almeno un'intervista per categoria di ruolo chiave
- [ ] Dimostrazioni di sistema testimoniate o documentate come rifiutate
- [ ] Rationale del punteggio documentato con esempi specifici
- [ ] Il cliente riconosce la discussione dei risultati
- [ ] Prossimi passi e timeline comunicati

**Rapporto Pronto**: Tutte le sezioni complete per deliverable immediato al cliente

---

**Versione Kit Sul Campo**: 2.3.1 | **Tempo di Valutazione**: 22 minuti | **Generazione Rapporto**: 30 minuti
