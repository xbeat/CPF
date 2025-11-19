# 📋 INDICATOR 6.6: FIELD KIT ASSUNZIONI DI GRUPPO DI DIPENDENZA

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Selezioni SÌ/NO per ogni indicatore:**

☐ **Dominanza Singolo Fornitore**: Un fornitore di sicurezza riceve >50% del budget annuale di sicurezza?

☐ **Collo di Bottiglia Decisionale**: Solo 1-2 persone sono autorizzate a prendere decisioni di sicurezza di routine?

☐ **Risposta Prima Esterna**: La prima risposta agli incidenti di sicurezza è sempre la consultazione esterna?

☐ **Fiducia Fornitore Non Questionata**: Sono passati >12 mesi dall'ultima revisione formale delle prestazioni del fornitore?

☐ **Ricerca Pallottola d'Argento**: Gli ultimi 2+ acquisti di strumenti di sicurezza sono stati effettuati senza confrontare alternative?

☐ **Rischio Persona Chiave**: Le operazioni di sicurezza si fermerebbero se il CISO/responsabile sicurezza non fosse disponibile per 2 settimane?

☐ **Nessun Piano di Backup**: Ci sono procedure di backup non testate o inesistenti per strumenti di sicurezza critici?

**PUNTEGGIO**: 0-2 SÌ = Verde | 3-4 SÌ = Giallo | 5-7 SÌ = Rosso

---

## 📝 RACCOLTA DI EVIDENZE (10 minuti)

### **Documenti da Richiedere**
- [ ] Pagamenti/contratti fornitori sicurezza ultimi 12 mesi
- [ ] Matrice autorizzazione decisioni sicurezza
- [ ] Revisioni prestazioni fornitori più recenti
- [ ] Registri risposta incidenti (ultimi 6 mesi)
- [ ] Documentazione valutazione strumenti sicurezza
- [ ] Piani continuità aziendale/successione

### **Dimostrazioni da Osservare**
- [ ] "Mi mostri chi può approvare acquisti di sicurezza di emergenza"
- [ ] "Mi illustri la Sua ultima risposta agli incidenti di sicurezza"
- [ ] "Dimostri il Suo sistema di monitoraggio della sicurezza di backup"

### **Controlli di Sistema da Eseguire**
- [ ] Revisionare i termini contrattuali dei fornitori per clausole di esclusività
- [ ] Controllare i registri delle decisioni per modelli di autorizzazione
- [ ] Verificare lo stato di funzionalità degli strumenti di backup
- [ ] Esaminare l'architettura di ridondanza degli strumenti di sicurezza

### **Ruoli Chiave da Intervistare**
- [ ] **CISO/Security Manager**: Autorità decisionale e relazioni con i fornitori
- [ ] **IT Director**: Procedure di backup e dipendenze dagli strumenti
- [ ] **Procurement**: Processi di selezione e valutazione dei fornitori
- [ ] **Executive Sponsor**: Allocazione budget e processi di approvazione

---

## 🎯 MATRICE DI PUNTEGGIO RAPIDO (2 minuti)

### **Albero Decisionale**

**INIZI QUI**: Quale percentuale del budget di sicurezza va al fornitore principale?

- **>50%** → ROSSO
- **30-50%** → Continui al prossimo controllo
- **<30%** → Continui al prossimo controllo

**PROSSIMO**: Quante persone possono autorizzare decisioni di sicurezza di routine?

- **1-2 persone** → ROSSO
- **3-4 persone** → Continui al prossimo controllo
- **5+ persone** → Continui al prossimo controllo

**PROSSIMO**: Quando ha revisionato formalmente l'ultima volta le prestazioni del fornitore?

- **>12 mesi fa** → ROSSO
- **6-12 mesi fa** → GIALLO
- **<6 mesi fa** → Continui al prossimo controllo

**FINALE**: Prima risposta agli incidenti di sicurezza?

- **Sempre esterna** → ROSSO (a meno che i controlli precedenti indichino VERDE)
- **Misto interno/esterno** → GIALLO (a meno che i controlli precedenti indichino ROSSO)
- **Prima interna** → VERDE (a meno che i controlli precedenti indichino ROSSO/GIALLO)

---

## 🔧 MATRICE DI PRIORITÀ DELLE SOLUZIONI (5 minuti)

### **ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA**
- **Audit Spesa Fornitori** (Costo: Basso, Tempistiche: 2 settimane)
  - Mappare gli attuali rapporti di concentrazione dei fornitori
  - Identificare opportunità immediate di diversificazione
- **Matrice Decisioni di Emergenza** (Costo: Basso, Tempistiche: 1 settimana)
  - Documentare chi può prendere quali decisioni quando
  - Creare procedure di autorizzazione di backup

### **ALTO IMPATTO / LUNGO TERMINE**
- **Diversificazione Portfolio Fornitori** (Costo: Alto, Tempistiche: 12 mesi)
  - Redistribuire gradualmente la spesa di sicurezza tra più fornitori
  - Dipendenze: Cicli di budget, negoziazioni contrattuali
- **Costruzione Capacità Interne** (Costo: Medio, Tempistiche: 6 mesi)
  - Formare in modo incrociato il personale di sicurezza sui sistemi critici
  - Dipendenze: Disponibilità personale, risorse formative

### **MEDIO IMPATTO / IMPLEMENTAZIONE RAPIDA**
- **Revisioni Trimestrali Fornitori** (Costo: Basso, Tempistiche: 1 mese)
  - Stabilire scorecard delle prestazioni e programmi di revisione
  - Creare processi di monitoraggio del miglioramento
- **Test Procedure di Backup** (Costo: Basso, Tempistiche: 2 settimane)
  - Testare e documentare procedure di sicurezza alternative
  - Verificare la funzionalità degli strumenti di backup

### **MEDIO IMPATTO / LUNGO TERMINE**
- **Framework Valutazione Soluzioni** (Costo: Medio, Tempistiche: 3 mesi)
  - Implementare requisito di confronto 3 fornitori
  - Creare protocolli di test proof-of-concept
  - Dipendenze: Modifiche processo approvvigionamento

---

## 💬 SCRIPT DI CONVERSAZIONE CON IL CLIENTE (3 minuti)

### **Domande di Apertura**
- "Mi parli della Sua relazione con il Suo fornitore di sicurezza principale. Da quanto tempo lavora con loro?"
- "Quando ha un problema di sicurezza, qual è tipicamente la Sua prima chiamata?"
- "Se il Suo security manager fosse in vacanza durante un incidente, cosa succederebbe?"

### **Prompt di Follow-up per Risposte Incomplete**
- **Se dicono "Ci fidiamo del nostro fornitore"**: "Va bene. Come verifica che stiano soddisfacendo le aspettative?"
- **Se dicono "Gestiamo le cose internamente"**: "Può farmi un esempio dell'ultima volta che ha risolto un problema di sicurezza senza aiuto esterno?"
- **Se sembrano difensivi**: "Non sto mettendo in discussione le Sue scelte, sto solo comprendendo i Suoi processi per la nostra valutazione."

### **Indicatori di Segnale di Allarme che Richiedono Indagine Più Approfondita**
- [ ] Linguaggio come "Loro gestiscono tutto" o "Non dobbiamo preoccuparci"
- [ ] Incapacità di nominare persone specifiche che possono prendere decisioni di sicurezza
- [ ] Nessun esempio di questionamento o audit delle prestazioni del fornitore
- [ ] Panico o ansia quando si discute di limitazioni o backup del fornitore
- [ ] Menzioni di soluzioni "pallottola d'argento" o "protezione completa"

### **Linguaggio Professionale per Argomenti Sensibili**
- **Invece di**: "Lei è troppo dipendente dal Suo fornitore"
- **Dica**: "Esploriamo opzioni per aumentare le Sue capacità interne"
- **Invece di**: "La Sua sicurezza è a rischio"
- **Dica**: "Abbiamo identificato opportunità per rafforzare la Sua postura di sicurezza"
- **Invece di**: "Deve diversificare immediatamente"
- **Dica**: "Un approccio graduale alla diversificazione dei fornitori potrebbe ridurre il rischio operativo"

---

## 📊 MODELLO DI APPUNTI SUL CAMPO

### **Riepilogo Valutazione**
**Data**: _________________ **Auditor**: _________________

**Organizzazione**: _________________________________

**Tempo Totale di Valutazione**: _______ minuti

### **Risultati Valutazione Rapida**
- [ ] Dominanza Singolo Fornitore: ☐ Sì ☐ No
- [ ] Collo di Bottiglia Decisionale: ☐ Sì ☐ No
- [ ] Risposta Prima Esterna: ☐ Sì ☐ No
- [ ] Fiducia Fornitore Non Questionata: ☐ Sì ☐ No
- [ ] Ricerca Pallottola d'Argento: ☐ Sì ☐ No
- [ ] Rischio Persona Chiave: ☐ Sì ☐ No
- [ ] Nessun Piano di Backup: ☐ Sì ☐ No

**Punteggio Complessivo**: ☐ Verde (0-2) ☐ Giallo (3-4) ☐ Rosso (5-7)

### **Evidenze Raccolte**
**Documenti Revisionati**: _________________________________
**Risultati Chiave**: _____________________________________
**Evidenze Mancanti**: _________________________________

### **Raccomandazioni Prioritarie**
1. **Immediata (1-2 settimane)**: ____________________________
2. **Breve termine (1-3 mesi)**: __________________________
3. **Lungo termine (6-12 mesi)**: __________________________

### **Valutazione Prontezza Cliente**
**Livello di Consapevolezza**: ☐ Alto ☐ Medio ☐ Basso
**Resistenza al Cambiamento**: ☐ Alta ☐ Media ☐ Bassa
**Disponibilità Risorse**: ☐ Alta ☐ Media ☐ Bassa

### **Follow-up Richiesto**
- [ ] Revisione documenti aggiuntivi necessaria
- [ ] Valutazione tecnica richiesta
- [ ] Riunione senior leadership raccomandata
- [ ] Discussione fornitore suggerita

**Prossimi Passi**: _____________________________________

---

## 🚨 FATTORI CRITICI DI SUCCESSO

### **Per Nuovi Auditor**
- Si concentri su fatti osservabili, non interpretazioni psicologiche
- Usi le parole del cliente per descrivere i loro processi
- Documenti esempi specifici, non impressioni generali
- Mantenga obiettività e professionalità durante tutta la valutazione

### **Segnali di Allarme che Richiedono Escalation Immediata**
- L'organizzazione non può funzionare senza un singolo fornitore/persona
- Nessuna procedura di backup documentata per sistemi critici
- Reazione ostile alle domande sulle prestazioni del fornitore
- Evidenza di fornitori o soluzioni di "sicurezza" fraudolenti

### **Checklist Garanzia Qualità**
- [ ] Tutte e 7 le domande di valutazione risposte con evidenze
- [ ] La decisione sul punteggio può essere giustificata con esempi specifici
- [ ] Le raccomandazioni corrispondono al livello di rischio identificato
- [ ] Conversazione con il cliente documentata con citazioni dirette
- [ ] Evidenze raccolte supportano le conclusioni tratte

**Valutazione Completa**: ☐ Pronta per Generazione Rapporto
