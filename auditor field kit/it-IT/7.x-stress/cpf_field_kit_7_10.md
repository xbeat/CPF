# 📋 CPF INDICATORE 7.10 FIELD KIT
## Vulnerabilità del Periodo di Recupero

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Verifichi tutto ciò che si applica - Solo prove osservabili:**

□ **D1:** L'organizzazione ha un protocollo di recupero documentato della durata di 72+ ore post-incidente
□ **D2:** Personale di sicurezza fresco (non i responder dell'incidente) monitora durante i periodi di recupero
□ **D3:** I controlli di sicurezza rimangono invariati durante la finestra di recupero di 72 ore
□ **D4:** Validazione esterna richiesta prima di dichiarare l'incidente "completamente risolto"
□ **D5:** Politica formale di rotazione del personale esiste per i team di risposta agli incidenti
□ **D6:** Decisioni sulla timeline di recupero basate su criteri di sicurezza (non pressione del business)
□ **D7:** Nessuna eccezione di sicurezza permessa durante i periodi di recupero

**Conteggio Caselle:** ___/7

---

## 📝 RACCOLTA DELLE PROVE (10 minuti)

### **Documenti da Richiedere:**
□ Report di risposta agli incidenti più recente e timeline di recupero
□ Procedure di monitoraggio di sicurezza per periodi post-incidente
□ Politiche di gestione rotazione/affaticamento del personale
□ Log richieste accesso dall'ultimo periodo di recupero
□ Protocolli di comunicazione fase di recupero
□ Log di approvazione eccezioni sicurezza (ultimi 6 mesi)

### **Dimostrazioni di Sistema:**
□ **"Mi mostri come dichiara un incidente risolto"** - Chi decide? Quali criteri?
□ **"Mi illustri il Suo ultimo periodo di recupero"** - Timeline da risoluzione a operazioni normali
□ **"Mi mostri chi monitora la sicurezza durante il recupero"** - Stesso team o personale diverso?

### **Obiettivi per le Interviste:**
□ **CISO/Security Manager:** Protocolli di recupero e autorità decisionale
□ **Incident Response Lead:** Rotazione personale e gestione affaticamento
□ **Operations Manager:** Pressione business vs. conflitti timeline sicurezza
□ **SOC Analyst:** Gestione alert durante periodi di recupero recenti

### **Verifiche di Sistema:**
□ Revisionare impostazioni sensibilità alert sicurezza durante ultimo recupero
□ Verificare log controllo accessi 48-72 ore post ultimo incidente maggiore
□ Verificare registri di coinvolgimento consulenti sicurezza esterni
□ Esaminare risultati audit sicurezza fase recupero

---

## 🎯 SCORING RAPIDO (2 minuti)

### **Albero Decisionale:**

**Inizio Qui:** Conteggio caselle verificate dalla Valutazione Rapida

**Se 6-7 caselle verificate:**
- **E** validazione esterna documentata **→ VERDE (0)**
- **E** nessuna validazione esterna **→ GIALLO (1)**

**Se 3-5 caselle verificate:**
- **E** protocollo formale di recupero esiste **→ GIALLO (1)**
- **E** nessun protocollo formale di recupero **→ ROSSO (2)**

**Se 0-2 caselle verificate:**
- **→ ROSSO (2)** (Vulnerabilità Recupero Alta)

**Punteggio Finale:** ___/2

### **Red Flag (ROSSO immediato indipendentemente dalla checklist):**
□ Stesso team di incidente monitora periodi di recupero
□ Eccezioni di sicurezza routinariamente approvate durante recupero
□ "Via libera" dichiarato stesso giorno della risoluzione tecnica
□ Nessun monitoraggio di sicurezza del periodo di recupero

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### **ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA**
□ **Protocollo Recupero 72 Ore** (Costo: Basso, Tempo: 2-4 settimane)
  - Definire checkpoint di sicurezza a 24/48/72 ore
  - Creare checklist criteri validazione recupero

□ **Monitoraggio Occhi Freschi** (Costo: Medio, Tempo: 1-2 settimane)
  - Assegnare personale non coinvolto nell'incidente al monitoraggio recupero
  - Ruotare team di sicurezza dopo 48 ore

### **ALTO IMPATTO / LUNGO TERMINE**
□ **Validazione Recupero Esterna** (Costo: Alto, Tempo: 2-3 mesi)
  - Contrattare consulente sicurezza di terze parti
  - Richiedere approvazione esterna prima di "via libera"
  - Dipendenze: Approvazione budget, selezione vendor

□ **Controlli Recupero Automatizzati** (Costo: Alto, Tempo: 3-6 mesi)
  - Prevenire rilassamento sicurezza durante periodi recupero
  - Dipendenze: Integrazione sistemi sicurezza

### **MEDIO IMPATTO / IMPLEMENTAZIONE RAPIDA**
□ **Protocollo Comunicazione Recupero** (Costo: Basso, Tempo: 1-2 settimane)
  - Evitare messaggi "via libera" prematuri
  - Formare leadership su comunicazioni recupero

□ **Politica Rotazione Personale** (Costo: Basso, Tempo: 2-3 settimane)
  - Riposo obbligatorio per responder incidenti
  - Personale fresco per monitoraggio recupero

---

## 💬 CONVERSAZIONE CON IL CLIENTE (3 minuti)

### **Domande di Apertura:**
- *"Mi illustri cosa succede nelle 72 ore dopo aver risolto un incidente di sicurezza maggiore."*
- *"Chi prende la decisione che un incidente è completamente finito?"*
- *"Come previene che il Suo team abbassi la guardia dopo aver gestito con successo un attacco?"*

### **Domande di Follow-Up:**
**Se menzionano pressione del business:**
- *"Può fornirmi un esempio specifico di quando le esigenze del business sono entrate in conflitto con la timeline di sicurezza?"*

**Se menzionano affaticamento del team:**
- *"Come gestisce il monitoraggio di sicurezza quando il Suo team di risposta agli incidenti è esausto?"*

**Se affermano nessuna vulnerabilità di recupero:**
- *"Quali verifiche di sicurezza esegue prima di dichiarare 'via libera'?"*

### **Indicatori di Red Flag che Richiedono Indagine Più Approfondita:**
□ **Risposte difensive** riguardo velocità di recupero
□ **Risposte vaghe** su chi monitora durante il recupero
□ **Esempi di affrettare** il ritorno alle operazioni normali
□ **Nessuna consapevolezza** dei rischi del periodo di recupero
□ **Pressione del business** che prevale su decisioni di sicurezza

### **Linguaggio Professionale per Argomenti Sensibili:**
- **Invece di:** "Il Suo processo di recupero è vulnerabile"
- **Dire:** "Esploriamo opportunità per rafforzare la Sua postura di sicurezza post-incidente"

- **Invece di:** "Il Suo team diventa negligente dopo gli incidenti"
- **Dire:** "La ricerca del settore mostra che i periodi di recupero presentano considerazioni di sicurezza uniche"

---

## 📊 TEMPLATE NOTE DI CAMPO

**Cliente:** _________________ **Data:** ___/___/_____ **Auditor:** _________________

### **Punteggio Valutazione Rapida:** ___/7 → **Punteggio Rischio Finale:** ___/2

### **Risultati Chiave:**
**Protocollo di Recupero:**
□ Documentato □ Ad-hoc □ Non esistente
**Note:** _________________________________________________

**Gestione Personale:**
□ Politica rotazione □ Monitoraggio fresco □ Stesso team continua
**Note:** _________________________________________________

**Controlli di Sicurezza:**
□ Mantenuti □ Misti □ Rilassati durante recupero
**Note:** _________________________________________________

**Validazione Esterna:**
□ Richiesta □ Opzionale □ Non usata
**Note:** _________________________________________________

### **Prove Raccolte:**
□ Report risposta incidenti
□ Timeline recupero
□ Procedure monitoraggio
□ Politiche rotazione personale
□ Log accessi
□ Registri comunicazione

### **Raccomandazioni Immediate:**
**Priorità 1:** _________________________________________________
**Priorità 2:** _________________________________________________
**Priorità 3:** _________________________________________________

### **Preoccupazioni/Resistenza Cliente:**
_____________________________________________________________

### **Follow-up Richiesto:**
□ Documentazione aggiuntiva necessaria
□ Dimostrazione tecnica richiesta
□ Intervista leadership necessaria
□ Verifica validazione esterna

**Prossimi Passi:** _______________________________________________

---

## ✅ CHECKLIST AUDITOR

**Pre-Valutazione (5 min):**
□ Revisionare storia incidenti recenti del cliente
□ Identificare personale chiave per interviste
□ Preparare richieste raccolta prove

**Durante Valutazione (22 min):**
□ Completare checklist Valutazione Rapida
□ Raccogliere tutte le prove richieste
□ Condurre interviste chiave
□ Documentare risultati in tempo reale

**Post-Valutazione (3 min):**
□ Calcolare punteggio rischio finale
□ Identificare le prime 3 priorità di soluzione
□ Programmare follow-up se necessario
□ Preparare sommario esecutivo

**Allocazione Tempo Totale:** 30 minuti massimo

---

*Field Kit Versione 1.0 | CPF Indicatore 7.10 | Vulnerabilità del Periodo di Recupero*
