# 📋 CPF INDICATORE 7.7 FIELD KIT
## Valutazione Visione a Tunnel Indotta da Stress

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Istruzioni**: Verifichi SÌ/NO per ciascuna domanda basandosi solo su prove osservabili.

□ **D1**: L'organizzazione ha procedure documentate per l'investigazione parallela di alert durante periodi ad alto stress?
   ☐ SÌ - Procedure scritte esistono e mostrano prove di utilizzo recente
   ☐ NO - Nessuna procedura o nessuna prova di utilizzo negli ultimi 6 mesi

□ **D2**: Esistono requisiti formali per la consultazione tra team durante eventi di sicurezza complessi?
   ☐ SÌ - Consultazione obbligatoria con team network/applicazioni/compliance documentata
   ☐ NO - Nessun requisito formale o consultazione opzionale

□ **D3**: Il monitoraggio di sicurezza di routine continua durante la risposta attiva agli incidenti?
   ☐ SÌ - I piani di personale mostrano team dedicati "business as usual" durante gli incidenti
   ☐ NO - Tutto il personale riassegnato agli incidenti o nessuna copertura di monitoraggio dedicata

□ **D4**: Esiste un processo documentato di validazione delle decisioni per azioni di sicurezza urgenti?
   ☐ SÌ - Approvazione di due persone richiesta per azioni critiche (shutdown, revoca accessi)
   ☐ NO - Decisioni di singola persona consentite o processo facilmente bypassato

□ **D5**: Esistono protocolli di pausa obbligatori durante la risposta estesa agli incidenti?
   ☐ SÌ - Riunioni di team richieste ogni 2 ore durante incidenti >4 ore
   ☐ NO - Nessun protocollo di pausa strutturato o solo informale

□ **D6**: Le revisioni post-incidente scoprono regolarmente indicatori mancati?
   ☐ SÌ - <20% degli incidenti risultano in risultati aggiuntivi post-risoluzione
   ☐ NO - >20% degli incidenti risultano in risultati aggiuntivi post-risoluzione

□ **D7**: Esistono protocolli formali di valutazione dello scope per determinare attacchi multi-vettore?
   ☐ SÌ - Checklist documentate con passi specifici di verifica multi-vettore
   ☐ NO - Nessun protocollo formale o assunzioni di singola minaccia standard

**Punteggio Rapido**: Conteggio risposte SÌ
- 6-7 SÌ = Verde (Rischio Basso)
- 4-5 SÌ = Giallo (Rischio Moderato)
- 0-3 SÌ = Rosso (Rischio Alto)

---

## 📝 RACCOLTA DELLE PROVE (10 minuti)

### **Documenti da Richiedere**
□ **Procedure di risposta agli incidenti** (aggiornate negli ultimi 12 mesi)
□ **Assegnazioni di personale** durante gli ultimi 3 incidenti di sicurezza maggiori
□ **Template di consultazione tra team** o log di comunicazione
□ **Workflow di approvazione delle decisioni** per azioni di sicurezza critiche
□ **Report di revisione post-incidente** degli ultimi 6 mesi
□ **Procedure di investigazione degli alert** per eventi ad alta priorità simultanei

### **Dimostrazioni di Sistema**
□ **"Mi mostri come gestisce 5+ alert critici in 2 ore"**
□ **"Mi illustri la timeline dell'ultima risposta a incidente maggiore"**
□ **"Mi dimostri il Suo processo di valutazione dello scope"**
□ **"Mi mostri il monitoraggio di routine durante la risposta agli incidenti"**

### **Verifiche di Sistema**
□ **Regole di correlazione alert SIEM** - Verificare rilevamento multi-vettore
□ **Sistema di ticketing incidenti** - Revisionare workflow di approvazione decisioni
□ **Dashboard di monitoraggio** - Verificare operazione continuata durante incidenti
□ **Strumenti di comunicazione** - Verificare template/canali di consultazione

### **Interviste Chiave**
□ **SOC Manager**: Personale durante incidenti, prioritizzazione alert
□ **Incident Response Lead**: Validazione decisioni, valutazione scope
□ **Network Team Lead**: Frequenza consultazioni, qualità comunicazione
□ **CISO/Security Director**: Allocazione risorse, consapevolezza visione a tunnel

---

## 🎯 SCORING RAPIDO (2 minuti)

### **Albero Decisionale**

**INIZIO QUI** → Sono presenti procedure documentate per investigazione parallela?

**NO** → **PUNTEGGIO ROSSO** (Vulnerabilità Alta)

**SÌ** → Le procedure sono effettivamente utilizzate (prove negli ultimi 6 mesi)?

**NO** → **PUNTEGGIO ROSSO** (Vulnerabilità Alta)

**SÌ** → Il monitoraggio di routine continua durante il 90%+ degli incidenti?

**NO** → **PUNTEGGIO GIALLO** (Vulnerabilità Moderata)

**SÌ** → Le revisioni post-incidente trovano indicatori mancati in <20% dei casi?

**NO** → **PUNTEGGIO GIALLO** (Vulnerabilità Moderata)

**SÌ** → **PUNTEGGIO VERDE** (Vulnerabilità Bassa)

### **Soglie Obiettive**
- **VERDE**: 6-7 controlli presenti + prove di utilizzo consistente
- **GIALLO**: 4-5 controlli presenti + applicazione inconsistente
- **ROSSO**: 0-3 controlli presenti + nessuna prova di approccio sistematico

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### **ALTO IMPATTO - Implementazione Rapida**
□ **Alberi Decisionali di Risposta agli Incidenti** (Costo: Basso, Tempo: 2-4 settimane)
   - Checkpoint obbligatori per considerazione multi-vettore
   - Previene immediatamente la visione a tunnel su singola minaccia

□ **Circuit Breaker dello Stress** (Costo: Basso, Tempo: 1-2 settimane)
   - Riunioni di 15 minuti ogni 2 ore durante incidenti estesi
   - Consapevolezza immediata e rivalutazione dello scope

### **ALTO IMPATTO - Implementazione a Lungo Termine**
□ **Team di Investigazione Paralleli** (Costo: Medio, Tempo: 2-3 mesi)
   - Personale di monitoraggio "business as usual" dedicato
   - Richiede cambiamenti al modello di personale

□ **Panel di Revisione Cross-Funzionali** (Costo: Medio, Tempo: 1-2 mesi)
   - Consultazione obbligatoria con altri team
   - Richiede integrazione di processo tra dipartimenti

### **MEDIO IMPATTO - Implementazione Rapida**
□ **Revisioni Red Team Post-Incidente** (Costo: Basso, Tempo: 2-3 settimane)
   - Processo di revisione strutturato di 48 ore
   - Requisito di prospettiva esterna

### **Dipendenze**
- **Approvazione budget** richiesta per: Personale aggiuntivo, consulenti esterni
- **Supporto esecutivo** richiesto per: Requisiti di consultazione tra team
- **Integrazione tecnologica** necessaria per: Strumenti automatizzati di valutazione scope

---

## 💬 SCRIPT CONVERSAZIONE CON IL CLIENTE (3 minuti)

### **Domande di Apertura**
**"Mi racconti del Suo ultimo incidente di sicurezza maggiore. Come ha allocato il tempo del Suo team tra l'investigare i sintomi ovvi versus la ricerca completa delle minacce?"**

**Follow-up**: *Cercare >40% tempo su analisi completa (Verde) vs <20% (Rosso)*

### **Test di Pressione**
**"Quando riceve multipli alert critici simultaneamente, qual è la Sua procedura standard? Può fornirmi un esempio recente con 5+ alert in 2 ore?"**

**Follow-up**: *Cercare procedure documentate vs risposte ad-hoc*

### **Dinamiche tra Team**
**"Quanto spesso i Suoi analisti di sicurezza consultano i team di network, applicazioni o compliance durante investigazioni ad alto stress?"**

**Red flag**: *"Lo gestiamo internamente," "Nessun tempo per riunioni durante incidenti"*

### **Qualità delle Decisioni**
**"Qual è il Suo processo per verificare decisioni urgenti di sicurezza come shutdown di sistema o revoche di accesso?"**

**Red flag**: *"Ci fidiamo dei nostri esperti," "Nessun tempo per validazione durante emergenze"*

### **Valutazione dello Scope**
**"Come determina se un incidente di sicurezza potrebbe essere parte di un attacco più grande e coordinato piuttosto che isolato?"**

**Red flag**: *"Ci concentriamo su ciò che abbiamo davanti," "Solitamente solo una minaccia alla volta"*

---

## 📊 TEMPLATE NOTE DI CAMPO

### **Riepilogo Valutazione**
- **Organizzazione**: ________________
- **Data**: ___/___/_____
- **Contatto Principale**: ________________
- **Durata Valutazione**: _______ minuti

### **Risultati Scoring**
- **Punteggio Valutazione Rapida**: ___/7 (Verde/Giallo/Rosso)
- **Vulnerabilità Principali**:
  □ Nessuna procedura di investigazione parallela
  □ Consultazione tra team inadeguata
  □ Monitoraggio di routine si ferma durante incidenti
  □ Nessun processo di validazione decisioni
  □ Protocolli di valutazione scope mancanti
  □ Alto tasso di scoperta post-incidente
  □ Nessun circuit breaker dello stress

### **Qualità delle Prove**
□ **Forte** - Forme multiple di documentazione e prove di sistema
□ **Moderata** - Qualche documentazione, verifica di sistema limitata
□ **Debole** - Principalmente basata su interviste, documentazione minima

### **Raccomandazioni Immediate**
1. **Priorità 1**: ________________________________
2. **Priorità 2**: ________________________________
3. **Priorità 3**: ________________________________

### **Timeline di Implementazione**
- **30 giorni**: ________________________________
- **90 giorni**: ________________________________
- **6 mesi**: ________________________________

### **Follow-up Richiesto**
□ Briefing esecutivo necessario
□ Deep-dive tecnico raccomandato
□ Consultazione ridisegno processi
□ Sviluppo programma di formazione

---

## ⚠️ RED FLAG CHE RICHIEDONO ESCALATION IMMEDIATA

- **"Non abbiamo tempo per checklist durante incidenti reali"**
- **"I nostri team lead prendono decisioni rapidamente senza burocrazia"**
- **"Ci concentriamo sul fuoco più grande per primo"**
- **"Le riunioni tra team ci rallentano durante le crisi"**
- **Prove di tasso di scoperta post-incidente >40%**
- **Nessuna documentazione di processi di validazione delle decisioni**
