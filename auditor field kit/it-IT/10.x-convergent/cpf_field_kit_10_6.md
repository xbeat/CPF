# 📋 CPF KIT SUL CAMPO 10.6: Negazione del Rinoceronte Grigio

**Focus della Valutazione**: Organizzazioni che ignorano minacce di cybersecurity ad alta probabilità e alto impatto nonostante chiari avvertimenti e soluzioni disponibili.

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Istruzioni**: Verifichi SÌ/NO per ciascun elemento. 4+ risposte NO = probabile punteggio ROSSO.

☐ **Timeline Patch Critiche**: Le vulnerabilità critiche vengono costantemente corrette entro 30 giorni?
   - SÌ: Processo documentato con media <30 giorni
   - NO: Media >30 giorni o nessun sistema di tracciamento

☐ **Controllo Eccezioni di Sicurezza**: Le eccezioni alle policy di sicurezza sono <5% delle policy totali?
   - SÌ: <5% eccezioni attive con date di scadenza
   - NO: >5% eccezioni o workaround permanenti comuni

☐ **Pianificazione Sistemi Legacy**: Tutti i sistemi legacy hanno piani di risoluzione finanziati?
   - SÌ: Piani documentati con budget allocati
   - NO: Sistemi identificati ma nessuna timeline/finanziamento concreto

☐ **Test Risposta agli Incidenti**: La risposta agli incidenti viene testata trimestralmente con miglioramenti implementati?
   - SÌ: Test trimestrali con lezioni apprese documentate
   - NO: Test annuali o meno frequenti

☐ **Compliance Formazione Sicurezza**: Il completamento della formazione sulla sicurezza è >95% a livello organizzativo?
   - SÌ: >95% completamento con tracciamento automatizzato
   - NO: <95% completamento o tracciamento manuale/inconsistente

☐ **Valutazione Sicurezza Vendor**: Le revisioni di sicurezza dei vendor vengono condotte annualmente con follow-up?
   - SÌ: Valutazioni annuali con tracciamento documentato della risoluzione
   - NO: Revisioni vendor inconsistenti o nessun processo di follow-up

☐ **Investimento Rischi Conosciuti**: Il budget di sicurezza dà priorità all'affrontare vulnerabilità conosciute?
   - SÌ: Allocazione chiara verso rischi identificati con business case
   - NO: Budget focalizzato su nuovi strumenti/minacce rispetto a problemi conosciuti

---

## 📝 RACCOLTA DELLE EVIDENZE (10 minuti)

### **Documenti da Richiedere**
- [ ] Report di scansione delle vulnerabilità (ultimi 6 mesi)
- [ ] Record di deployment delle patch e timeline
- [ ] Log delle richieste di eccezioni di sicurezza
- [ ] Inventario dei sistemi legacy con piani di risoluzione
- [ ] Record dei test di risposta agli incidenti e report post-esercitazione
- [ ] Report di completamento della formazione sulla sicurezza per dipartimento
- [ ] Documentazione di valutazione sicurezza vendor
- [ ] Ripartizione allocazione budget di sicurezza

### **Dimostrazioni di Sistema**
- [ ] **Mi mostri**: Dashboard/sistema di tracciamento gestione vulnerabilità
- [ ] **Mi mostri**: Workflow di approvazione eccezioni di sicurezza
- [ ] **Mi mostri**: Processo automatizzato di deployment patch
- [ ] **Mi mostri**: Procedure di comunicazione risposta agli incidenti
- [ ] **Mi mostri**: Sistema di assegnazione e tracciamento formazione sicurezza

### **Verifiche di Sistema da Eseguire**
- [ ] Conti le eccezioni di sicurezza attive nel sistema di gestione
- [ ] Riveda l'età della vulnerabilità critica non corretta più vecchia
- [ ] Verifichi la data dell'ultimo aggiornamento del piano di risposta agli incidenti
- [ ] Verifichi le percentuali di completamento della formazione sulla sicurezza
- [ ] Esamini gli strumenti di scoring e monitoraggio del rischio vendor

### **Colloqui Chiave**
- [ ] **CISO/Responsabile Sicurezza**: Decisioni di strategia e allocazione risorse
- [ ] **Responsabile Operazioni IT**: Processi di gestione patch ed eccezioni
- [ ] **Compliance Officer**: Tracciamento formazione e valutazioni vendor
- [ ] **Responsabile Risposta Incidenti**: Frequenza test e implementazione miglioramenti

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### **Albero Decisionale**

**INIZIO**: Conti le risposte SÌ dalla sezione Valutazione Rapida

**7 risposte SÌ** → **VERDE (0 - Bassa Vulnerabilità)**
- Controlli robusti con gestione sistematica delle minacce
- Cultura di risoluzione proattiva stabilita

**5-6 risposte SÌ** → **GIALLO (1 - Vulnerabilità Moderata)**
- Alcune lacune nell'approccio sistematico
- Rischio di gestione selettiva delle minacce

**0-4 risposte SÌ** → **ROSSO (2 - Alta Vulnerabilità)**
- Evitamento sistematico di minacce conosciute
- Alta probabilità di sfruttamento

### **Criteri di Spareggio**
Se al limite tra punteggi:
- **Età vulnerabilità critica >90 giorni** = ROSSO automatico
- **>15% eccezioni di sicurezza permanenti** = ROSSO automatico
- **Nessun test risposta incidenti in 12+ mesi** = ROSSO automatico
- **<80% compliance formazione sicurezza** = ROSSO automatico

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### **ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA**
| Soluzione | Costo | Timeline | Dipendenze |
|----------|------|----------|--------------|
| Tracciamento automatizzato SLA vulnerabilità | Basso | 30 giorni | Strumenti di scansione esistenti |
| Date di scadenza eccezioni di sicurezza | Basso | 15 giorni | Approvazione aggiornamento policy |
| Programmazione test IR trimestrale | Medio | 60 giorni | Coordinamento disponibilità personale |

### **ALTO IMPATTO / LUNGO TERMINE**
| Soluzione | Costo | Timeline | Dipendenze |
|----------|------|----------|--------------|
| Programma di risoluzione sistemi legacy | Alto | 12-24 mesi | Approvazione budget capitale |
| Piattaforma gestione rischio terze parti | Medio | 90 giorni | Processo selezione vendor |
| Compliance formazione sicurezza automatizzata | Medio | 60 giorni | Integrazione LMS |

### **IMPATTO MEDIO / MANUTENZIONE**
| Soluzione | Costo | Timeline | Dipendenze |
|----------|------|----------|--------------|
| Documentazione processo gestione vulnerabilità | Basso | 45 giorni | Chiarificazione ownership processo |
| Standardizzazione valutazione sicurezza vendor | Basso | 30 giorni | Aggiornamenti template contratti |
| Allocazione budget basata su rischio sicurezza | Basso | Prossimo ciclo budget | Collaborazione finance |

---

## 💬 SCRIPT DI CONVERSAZIONE CON IL CLIENTE (3 minuti)

### **Domande di Apertura**
"Vorrei capire come la Sua organizzazione gestisce le minacce di sicurezza prevedibili che può vedere arrivare..."

### **Suggerimenti Chiave per il Colloquio**

**Sulla Gestione delle Vulnerabilità**:
- "Mi illustri cosa succede quando riceve un report di vulnerabilità critica."
- *Follow-up*: "Qual è il Suo tempo medio dalla scoperta al deployment della patch?"
- *Segnale rosso*: Risposte >90 giorni o "dipende dall'impatto sul business"

**Sulle Eccezioni di Sicurezza**:
- "Con quale frequenza i dipartimenti richiedono eccezioni alle policy di sicurezza?"
- *Follow-up*: "Quale percentuale di eccezioni 'temporanee' diventano permanenti?"
- *Segnale rosso*: >15% eccezioni o "la maggior parte diventa permanente per ragioni operative"

**Sui Sistemi Legacy**:
- "Qual è il Suo sistema più vecchio che sa avere problemi di sicurezza?"
- *Follow-up*: "Qual è la Sua timeline per affrontarlo?"
- *Segnale rosso*: Nessuna timeline specifica o "stiamo esplorando opzioni"

**Sulla Preparazione agli Incidenti**:
- "Quando ha testato l'ultima volta il Suo piano di risposta agli incidenti?"
- *Follow-up*: "Quali miglioramenti ha implementato successivamente?"
- *Segnale rosso*: >12 mesi fa o nessun miglioramento implementato

### **Linguaggio per Argomenti Sensibili**
- Usi: "le organizzazioni spesso hanno difficoltà con..." invece di "state fallendo nel..."
- Usi: "sfide prevedibili" invece di "problemi ovvi"
- Usi: "opportunità di ottimizzazione" invece di "lacune critiche"

---

## 📊 MODELLO DI NOTE SUL CAMPO

**Data Valutazione**: ________________
**Valutatore**: ________________
**Organizzazione**: ________________

### **Risultati Valutazione Rapida**
☐ Timeline Patch Critiche: S/N - Note: _________________
☐ Controllo Eccezioni Sicurezza: S/N - Note: _________________
☐ Pianificazione Sistemi Legacy: S/N - Note: _________________
☐ Test Risposta Incidenti: S/N - Note: _________________
☐ Compliance Formazione Sicurezza: S/N - Note: _________________
☐ Valutazione Sicurezza Vendor: S/N - Note: _________________
☐ Investimento Rischi Conosciuti: S/N - Note: _________________

**Conteggio Totale SÌ**: ____/7

### **Evidenze Chiave Raccolte**
**Vulnerabilità Critiche**: Più vecchia non corretta = _____ giorni
**Eccezioni Sicurezza**: Conteggio attivo = _____ (____% delle policy)
**Sistemi Legacy**: Conteggio senza piano di risoluzione = _____
**Test IR**: Data ultimo test = _____ Miglioramenti implementati = S/N
**Compliance Formazione**: Percentuale complessiva = _____%
**Valutazioni Vendor**: Revisioni annuali = S/N Tracciamento follow-up = S/N

### **Segnali Rossi Identificati**
☐ Vulnerabilità >6 mesi ancora non corretta
☐ >20% delle eccezioni di sicurezza sono permanenti
☐ Nessun test risposta incidenti in 18+ mesi
☐ Multipli sistemi legacy con "nessun piano attuale"
☐ Budget sicurezza focalizzato su nuove minacce vs. rischi conosciuti

### **Raccomandazioni Immediate**
**Priorità 1 (30 giorni)**:
1. _________________________________________________
2. _________________________________________________

**Priorità 2 (90 giorni)**:
1. _________________________________________________
2. _________________________________________________

**Punteggio Finale**: VERDE / GIALLO / ROSSO
**Livello di Confidenza**: Alto / Medio / Basso
**Follow-up Richiesto**: S/N - Dettagli: ________________

---

## 📋 RIEPILOGO DELLA VALUTAZIONE

**Investimento Tempo Totale**: 22 minuti massimo
**Materiali Richiesti**: Laptop, accesso rete, blocco note
**Preparazione**: Riveda il settore industriale del cliente per contesto
**Follow-up**: Programmi sessione di pianificazione risoluzione entro 48 ore

**Criteri di Successo**: Determinazione chiara del punteggio con evidenze specifiche e prossimi passi attuabili identificati.
