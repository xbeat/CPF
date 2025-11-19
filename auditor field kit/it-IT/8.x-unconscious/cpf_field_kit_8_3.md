# INDICATORE 8.3 FIELD KIT
## Modelli di compulsione alla ripetizione

---

## VALUTAZIONE RAPIDA (5 min)

**Spuntare SÌ/NO per ogni condizione osservabile:**

□ **SÌ/NO**: L'organizzazione ha subito 3+ incidenti di sicurezza con cause radice simili negli ultimi 3 anni
□ **SÌ/NO**: Le raccomandazioni post-incidente rimangono non implementate prima che si verifichi il prossimo incidente simile
□ **SÌ/NO**: Gli incidenti di sicurezza si raggruppano attorno alle date anniversario di eventi importanti passati
□ **SÌ/NO**: L'organizzazione seleziona ripetutamente fornitori/strumenti con caratteristiche simili a scelte problematiche passate
□ **SÌ/NO**: La comunicazione di crisi torna agli stessi modelli che sono falliti in precedenza
□ **SÌ/NO**: L'allocazione del budget di sicurezza rispecchia decisioni passate che hanno creato vulnerabilità
□ **SÌ/NO**: Non esiste un processo sistematico per verificare le decisioni correnti rispetto ai modelli di fallimento passati

**Punteggio rapido**: 4+ risposte SÌ = ROSSO | 2-3 SÌ = GIALLO | 0-1 SÌ = VERDE

---

## RACCOLTA DELLE PROVE (10 min)

### Documenti da richiedere
- [ ] **Rapporti di incidenti** degli ultimi 3 anni (focus sull'analisi delle cause radice)
- [ ] **Piani d'azione post-incidente** e stato di implementazione
- [ ] **Documentazione di selezione dei fornitori** degli ultimi 2 anni
- [ ] **Decisioni di allocazione del budget di sicurezza** e giustificazioni
- [ ] **Log di comunicazione di crisi** da eventi di sicurezza recenti

### Dimostrazioni da osservare
- [ ] **"Mi mostri il Suo processo di revisione degli incidenti"** - osservare la procedura effettiva
- [ ] **"Mi guidi attraverso i Suoi criteri di selezione dei fornitori"** - osservare il framework decisionale
- [ ] **"Mi dimostri il protocollo di comunicazione di crisi"** - vedere i canali di comunicazione effettivi

### Verifiche di sistema da eseguire
- [ ] **Ricerca nel database degli incidenti** per capacità di analisi dei modelli
- [ ] **Inventario degli strumenti di sicurezza** confrontato con selezioni di strumenti fallite in passato
- [ ] **Sistemi di avviso** per il monitoraggio delle date anniversario
- [ ] **Documentazione delle decisioni** tracciabilità ai risultati storici

### Obiettivi delle interviste
- [ ] **CISO/Leader della sicurezza** (modelli strategici)
- [ ] **Manager della risposta agli incidenti** (modelli operativi)
- [ ] **Responsabile procurement IT** (modelli di selezione fornitori)
- [ ] **Responsabile comunicazioni di crisi** (modelli di comunicazione)

---

## PUNTEGGIO RAPIDO (2 min)

### Punteggio ad albero decisionale

**Inizio qui:** L'organizzazione ha un'analisi documentata dei modelli di incidenti?

**NO** → Verificare la frequenza degli incidenti:
- Stessa causa radice 4+ volte in 3 anni = **ROSSO**
- Stessa causa radice 2-3 volte in 3 anni = **GIALLO**
- Stessa causa radice 0-1 volte in 3 anni = **VERDE**

**SÌ** → Verificare l'efficacia dell'implementazione:
- I modelli continuano nonostante l'analisi = **ROSSO**
- Qualche miglioramento ma i modelli persistono = **GIALLO**
- Chiara rottura dei modelli con risultati misurabili = **VERDE**

### Verifica dei modelli anniversario
- **Gli incidenti si raggruppano entro 30 giorni dagli anniversari di eventi passati** = Aggiungere 1 livello (VERDE→GIALLO→ROSSO)
- **Nessuna correlazione con anniversari** = Nessun cambiamento al punteggio base

---

## PRIORITÀ DELLE SOLUZIONI (5 min)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
- **Dashboard dei modelli di incidenti** (Costo: Basso, Tempo: 30 giorni)
  - Analisi automatizzata del raggruppamento degli incidenti
  - Sistema di avviso per date anniversario
- **Checklist storica delle decisioni** (Costo: Basso, Tempo: 14 giorni)
  - Confronto obbligatorio con decisioni passate per scelte importanti
  - Integrazione di template semplice nei processi esistenti

### MEDIO IMPATTO / IMPLEMENTAZIONE MEDIA
- **Procedure di risposta alternative** (Costo: Medio, Tempo: 60 giorni)
  - Dipendenza: Disponibilità del team di risposta agli incidenti
  - Opzioni di risposta "che rompono i modelli" pre-sviluppate
- **Controlli sulla selezione dei fornitori** (Costo: Medio, Tempo: 45 giorni)
  - Integrazione delle performance storiche dei fornitori
  - Modifica richiesta del processo di approvvigionamento

### ALTO IMPATTO / IMPLEMENTAZIONE A LUNGO TERMINE
- **Interruttori di circuito per comunicazione di crisi** (Costo: Alto, Tempo: 90 giorni)
  - Dipendenza: Contratti con facilitatori esterni
  - Richiede gestione del cambiamento culturale
- **Sistema completo di analisi dei modelli** (Costo: Alto, Tempo: 120 giorni)
  - Dipendenza: Integrazione dei dati tra più sistemi
  - Implementazione di piattaforma di analisi avanzata

---

## CONVERSAZIONE CON IL CLIENTE (3 min)

### Domande di apertura
- **"Mi parli del Suo incidente di sicurezza più recente. Quanto era simile agli incidenti precedenti che ha sperimentato?"**
- **"Quando implementa raccomandazioni dalle revisioni degli incidenti, cosa tipicamente impedisce l'implementazione completa?"**

### Sollecitazioni di follow-up
- **Se menzionano problemi ripetuti:** "Quante volte si è verificato questo tipo di incidente? Cosa è stato diverso nella Sua risposta ogni volta?"
- **Se menzionano modelli temporali:** "Ha notato incidenti che si verificano attorno a date significative o anniversari?"
- **Se menzionano problemi con fornitori:** "Come valuta i potenziali fornitori rispetto a relazioni passate con fornitori che non hanno funzionato?"

### Indicatori di bandiera rossa
- **Modelli linguistici:** "Gestiamo sempre così" / "Questo è come abbiamo sempre gestito la risposta alla crisi"
- **Risposte sprezzanti:** "Quegli incidenti erano completamente diversi" quando i modelli sono ovvi
- **Raggruppamento anniversario:** Reazione difensiva quando viene chiesto dei tempi degli incidenti
- **Fedeltà ai fornitori:** "Ci fidiamo di questo fornitore" senza riferimento ai modelli di performance passati

### Formulazione professionale per argomenti sensibili
- **Invece di:** "Lei continua a fare gli stessi errori"
- **Dire:** "Le organizzazioni spesso trovano certi modelli di incidenti difficili da rompere"
- **Invece di:** "Il Suo processo decisionale è difettoso"
- **Dire:** "Molte organizzazioni beneficiano di processi decisionali che incorporano l'analisi storica"

---

## MODELLO DI NOTE SUL CAMPO

### Riepilogo della valutazione
**Data:** _________________ **Auditor:** _________________
**Organizzazione:** _________________ **Contatto:** _________________

### Prove dei modelli (Spuntare tutto ciò che è stato osservato)
□ **Ripetizione incidenti:** Stessa causa radice _____ volte in 3 anni
□ **Lacune di implementazione:** _____% delle raccomandazioni implementate prima del prossimo incidente
□ **Correlazione anniversario:** _____ incidenti entro 30 giorni dalle date di eventi passati
□ **Modelli fornitori:** _____ selezioni di fornitori rispecchiano scelte problematiche passate
□ **Regressione comunicazione:** La comunicazione di crisi torna a modelli falliti
□ **Ripetizione budget:** L'allocazione delle risorse rispecchia decisioni passate che hanno creato vulnerabilità

### Motivazione del punteggio
**Punteggio finale:** VERDE / GIALLO / ROSSO
**Fattori chiave:** ________________________________________________
**Aggiustamento modello anniversario:** Applicato / Non applicato
**Confidenza della decisione:** Alta / Media / Bassa

### Raccomandazioni immediate (Top 3)
1. **Priorità:** Alta/Media/Bassa **Soluzione:** _________________________ **Tempistica:** _______
2. **Priorità:** Alta/Media/Bassa **Soluzione:** _________________________ **Tempistica:** _______
3. **Priorità:** Alta/Media/Bassa **Soluzione:** _________________________ **Tempistica:** _______

### Follow-up richiesto
□ **Revisione documenti aggiuntiva** necessaria
□ **Valutazione tecnica del sistema** richiesta
□ **Intervista estesa** con _________________ raccomandata
□ **Analisi dei modelli** richiede periodo di osservazione più lungo
□ **Consulenza esterna** suggerita per ________________________

### Feedback del cliente
**Comprensione dei risultati da parte del cliente:** Chiara / Parziale / Confusa
**Accettazione delle raccomandazioni da parte del cliente:** Alta / Media / Bassa / Resistente
**Prontezza all'implementazione:** Pronto / Necessita preparazione / Non pronto

---

## CHECKLIST DI COMPLETAMENTO

□ **Tutte le 7 domande di valutazione rapida** completate
□ **Minimo 3 fonti di prova** raccolte
□ **Albero decisionale di punteggio** seguito completamente
□ **Top 3 priorità delle soluzioni** identificate con tempistiche
□ **Conversazione con il cliente** documentata con esempi specifici
□ **Template note sul campo** completamente compilato
□ **Azioni di follow-up** chiaramente identificate

**Tempo totale di valutazione:** _______ minuti (Obiettivo: <25 minuti)
**Pronto per la generazione del rapporto:** SÌ / NO
