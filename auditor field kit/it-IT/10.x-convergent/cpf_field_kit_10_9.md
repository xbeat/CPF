# 📋 CPF KIT SUL CAMPO 10.9: Guasti di Accoppiamento del Sistema

**Tempo di Valutazione**: 22 minuti | **Focus del Rischio**: Connessioni di sistema nascoste che creano vulnerabilità a cascata

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Verifichi SÌ se esistono evidenze, NO se assenti o inadeguate:**

- [ ] **SÌ/NO**: Strumento di discovery di rete scansiona attivamente e mappa le connessioni di sistema (mensilmente o più frequentemente)
- [ ] **SÌ/NO**: Il processo di gestione cambiamenti richiede analisi dell'impatto delle connessioni prima dell'approvazione
- [ ] **SÌ/NO**: Documentazione delle dipendenze di sistema aggiornata negli ultimi 6 mesi
- [ ] **SÌ/NO**: Le procedure di risposta agli incidenti includono la verifica dei sistemi connessi
- [ ] **SÌ/NO**: Le procedure di cambiamento di emergenza hanno controlli obbligatori delle connessioni
- [ ] **SÌ/NO**: Coordinamento cross-team documentato per i cambiamenti di sistema
- [ ] **SÌ/NO**: L'integrazione vendor include revisione sicurezza delle connessioni di sistema

**Punteggio**: 6-7 SÌ = Verde | 3-5 SÌ = Giallo | 0-2 SÌ = Rosso

---

## 📝 RACCOLTA DELLE EVIDENZE (10 minuti)

### Documenti da Richiedere
- [ ] **Report di discovery di rete** (ultimi 3 mesi)
- [ ] **Diagrammi architettura di sistema** con date di aggiornamento
- [ ] **Richieste di cambiamento recenti** che mostrano analisi delle connessioni
- [ ] **Ultimi 3 report di incidenti** con azioni di risposta
- [ ] **Log cambiamenti di emergenza** degli ultimi 6 mesi
- [ ] **Valutazioni di sicurezza vendor** per implementazioni recenti

### Dimostrazioni da Richiedere
- [ ] **"Mi mostri il Suo strumento di discovery di rete e gli ultimi risultati di scansione"**
- [ ] **"Mi illustri il Suo processo di approvazione cambiamenti"**
- [ ] **"Mi mostri come verifica le connessioni di sistema durante gli incidenti"**
- [ ] **"Mi dimostri le procedure di cambiamento di emergenza"**

### Verifiche di Sistema da Eseguire
- [ ] **Verifichi che la scansione automatica di rete sia configurata e funzionante**
- [ ] **Verifichi se i diagrammi di sistema corrispondono al discovery di rete corrente**
- [ ] **Riveda il workflow di gestione cambiamenti per requisiti di connessione**
- [ ] **Esamini i playbook di risposta incidenti per procedure di connessione**

### Destinatari dei Colloqui
- [ ] **Amministratore di Rete** (conoscenza connettività sistemi)
- [ ] **Responsabile Cambiamenti** (supervisione processo approvazione)
- [ ] **Responsabile Risposta Incidenti** (procedure eventi sicurezza)
- [ ] **Responsabile Operazioni IT** (coordinamento cross-team)

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale

**INIZIO**: L'organizzazione ha uno strumento di discovery di rete con scansioni recenti?
- **NO** → **ROSSO** (Stop - Lacuna critica)
- **SÌ** → Continui

**La gestione cambiamenti richiede analisi delle connessioni?**
- **NO** → **ROSSO** (Stop - Nessuna protezione cambiamenti)
- **SÌ** → Continui

**Le dipendenze di sistema sono documentate e aggiornate (≤6 mesi)?**
- **NO** → **GIALLO** (Lacune documentazione)
- **SÌ** → Continui

**Le procedure incidenti includono verifica connessioni?**
- **NO** → **GIALLO** (Lacune risposta)
- **SÌ** → **VERDE**

### Condizioni di Override
- **Forzi ROSSO se**: Guasti di sistema mensili+ inaspettati da cambiamenti
- **Forzi ROSSO se**: Incidente sicurezza recente si è diffuso inaspettatamente ad altri sistemi
- **Forzi GIALLO se**: La documentazione esiste ma il personale non è consapevole/formato

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
- [ ] **Strumento Discovery di Rete** (Costo: Medio, Tempo: 30 giorni)
  - *Implementare scansione automatica con report settimanali*
- [ ] **Checklist Cambiamento di Emergenza** (Costo: Basso, Tempo: 1 settimana)
  - *Procedura di verifica connessione di 15 minuti*

### ALTO IMPATTO / LUNGO TERMINE
- [ ] **Processo Cambiamento Cross-Sistema** (Costo: Medio, Tempo: 90 giorni)
  - *Analisi obbligatoria connessioni nel workflow cambiamenti*
- [ ] **Protocollo Connessione Risposta Incidenti** (Costo: Basso, Tempo: 60 giorni)
  - *Playbook aggiornati con passi di verifica connessioni*

### IMPATTO MEDIO / MANUTENZIONE
- [ ] **Revisioni Trimestrali Dipendenze** (Costo: Basso, Tempo: Continuativo)
  - *Riunioni regolari cross-team per aggiornamenti documentazione*
- [ ] **Valutazione Integrazione Vendor** (Costo: Medio, Tempo: 45 giorni)
  - *Template revisione sicurezza per connessioni terze parti*

### Dipendenze
- **Strumento discovery di rete** → Richiesto prima di miglioramenti processo cambiamenti
- **Formazione personale** → Richiesta per tutti i miglioramenti procedurali
- **Strumenti documentazione** → Richiesti per manutenzione sostenibile

---

## 💬 SCRIPT DI CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Quando apporta modifiche ai sistemi, cosa succede se qualcosa si rompe inaspettatamente?"**
- *Ascolti per*: Guasti sorpresa, colpa su "connessioni strane"

**"Mi racconti del Suo ultimo incidente di sicurezza - ha affettato altri sistemi?"**
- *Ascolti per*: Focus su singolo sistema, diffusione mancata, scoperta ritardata

**"Come sa quali sistemi si connettono a quali?"**
- *Ascolti per*: Congetture, diagrammi obsoleti, conoscenza tribale

### Suggerimenti di Follow-up
- **Se menzionano documentazione**: *"Mi mostri la Sua versione più recente e quando è stata aggiornata"*
- **Se menzionano strumenti**: *"Può richiamare gli ultimi risultati di scansione?"*
- **Se menzionano processi**: *"Mi illustri l'ultima volta che ha usato questo processo"*

### Indicatori di Segnale Rosso che Richiedono Indagine Approfondita
- [ ] **"Di solito non abbiamo problemi con questo"** (Negazione/inconsapevolezza)
- [ ] **"È troppo complesso documentare tutto"** (Complessità travolgente)
- [ ] **"Ogni team gestisce i propri sistemi"** (Isolamento pericoloso)
- [ ] **"Risolviamo le cose quando si rompono"** (Approccio solo reattivo)

### Linguaggio Professionale per Argomenti Sensibili
- **Invece di**: "I Vostri sistemi sono pericolosamente connessi"
- **Dica**: "Rivediamo come le relazioni di sistema sono documentate e gestite"

- **Invece di**: "Non avete visibilità"
- **Dica**: "Potrebbero esserci opportunità per migliorare la consapevolezza delle relazioni di sistema"

---

## 📊 MODELLO DI NOTE SUL CAMPO

### Riepilogo della Valutazione
**Data**: __________ **Valutatore**: __________
**Contatto Cliente**: __________ **Sistemi Revisionati**: __________

### Evidenze Raccolte
- [ ] Discovery di rete: **Presente/Assente** - Ultima scansione: __________
- [ ] Processo cambiamenti: **Formale/Informale/Assente** - Analisi connessioni: **Sì/No**
- [ ] Documentazione: **Aggiornata/Obsoleta/Mancante** - Ultimo aggiornamento: __________
- [ ] Risposta incidenti: **Include connessioni/Focus singolo sistema**

### Indicatori di Rischio Osservati
- [ ] Personale sorpreso dalle interazioni di sistema durante dimostrazione
- [ ] Molteplici incidenti recenti con impatti di sistema inaspettati
- [ ] Cambiamenti di emergenza effettuati senza considerazione delle connessioni
- [ ] Team inconsapevoli delle dipendenze di sistema di altri team

### Razionale del Punteggio
**Punteggio Finale**: Verde/Giallo/Rosso
**Giustificazione Principale**: ________________________________
**Override Applicato**: Sì/No **Motivo**: ___________________

### Raccomandazioni Immediate
**Priorità 1**: ________________________________
**Priorità 2**: ________________________________
**Priorità 3**: ________________________________

### Livello di Impegno del Cliente
- [ ] **Alto**: Pronto per implementare immediatamente
- [ ] **Medio**: Necessita pianificazione budget/risorse
- [ ] **Basso**: Richiede prima approvazione esecutiva

---

**Validazione Kit sul Campo**: Questa valutazione mantiene fedeltà alle fondamenta teoriche del CPF 10.9 permettendo valutazione rapida e consistente da parte di auditor senza competenze psicologiche.
