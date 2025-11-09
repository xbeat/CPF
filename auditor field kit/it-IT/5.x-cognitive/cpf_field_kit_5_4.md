# 📋 CPF INDICATOR 5.4 FIELD KIT: DEGRADAZIONE DA MULTITASKING

**Obiettivo Valutazione**: Vulnerabilità da sovraccarico cognitivo e frammentazione dell'attenzione del personale di sicurezza
**Tempo Totale**: 22 minuti
**Prerequisiti**: Nessuno (nessun background psicologico richiesto)

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Completare tutte le 7 domande con il rappresentante del cliente presente:**

□ **D1**: Gli analisti di sicurezza monitorano 4+ dashboard/strumenti diversi simultaneamente durante le operazioni normali?
   ☐ Sì ☐ No

□ **D2**: Il personale di sicurezza viene regolarmente interrotto da compiti non di sicurezza (admin, supporto utente, riunioni) durante i turni di monitoraggio?
   ☐ Sì ☐ No

□ **D3**: Quando si attivano più allerta di sicurezza entro 15 minuti, esiste una procedura documentata di priorità/triage?
   ☐ Sì ☐ No

□ **D4**: Il personale di sicurezza lavora da solo durante qualsiasi periodo di turno (notti, weekend, festività)?
   ☐ Sì ☐ No

□ **D5**: Gli strumenti di sicurezza sono integrati in un'unica interfaccia, o gli analisti passano tra applicazioni separate?
   ☐ Integrati (Singola) ☐ Applicazioni Separate

□ **D6**: Esiste un processo misurabile per tracciare le prestazioni di sicurezza durante periodi di alta attività?
   ☐ Sì ☐ No

□ **D7**: Il personale di sicurezza ha blocchi di tempo protetti per lavoro di investigazione approfondita senza interruzioni?
   ☐ Sì ☐ No

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti da Richiedere:
□ **Descrizioni mansioni team di sicurezza** (ruoli e responsabilità)
□ **Pianificazioni turni e modelli di copertura**
□ **Procedure di risposta alle allerta** (matrice priorità/escalation)
□ **Inventario strumenti di sicurezza** e diagramma di integrazione
□ **Report recenti di risposta agli incidenti** (ultimi 3 mesi)
□ **Dashboard metriche prestazioni** per operazioni di sicurezza

### Dimostrazioni da Richiedere:
□ **"Mi mostri una tipica postazione analista durante le operazioni normali"**
□ **"Mi illustri come gestisce più allerta simultanee"**
□ **"Dimostri il Suo processo di prioritizzazione allerta"**
□ **"Mi mostri la copertura durante il monitoraggio fuori orario/weekend"**

### Controlli di Sistema da Eseguire:
□ Contare dashboard/strumenti di sicurezza attivi che richiedono interfacce separate
□ Rivedere volumi e pattern di frequenza allerta (ultimi 30 giorni)
□ Controllare stato di integrazione tra piattaforme di sicurezza
□ Verificare capacità automatizzate di filtraggio/correlazione allerta

### Obiettivi di Intervista:
□ **Manager SOC/Responsabile Sicurezza** (supervisione operativa)
□ **Analisti di Sicurezza** (operazioni quotidiane, almeno 2 turni diversi)
□ **Manager IT** (allocazione risorse e priorità concorrenti)
□ **Team Lead Risposta Incidenti** (scenari multi-incidente)

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

**Albero Decisionale - Rispondere in sequenza:**

### Passo 1: Controllare Integrazione
- **Se D5 = Integrati E esiste correlazione allerta automatizzata** → Continuare al Passo 2
- **Se D5 = Applicazioni Separate O nessuna correlazione allerta** → **ROSSO (2)**

### Passo 2: Controllare Personale/Copertura
- **Se D4 = No (copertura adeguata) E esistono blocchi tempo protetti** → Continuare al Passo 3
- **Se D4 = Sì (turni in solitaria) O nessun tempo protetto** → **GIALLO (1)**

### Passo 3: Controllare Procedure/Metriche
- **Se D3 = Sì E D6 = Sì E interruzioni non di sicurezza minime** → **VERDE (0)**
- **Se D3 = No O D6 = No O interruzioni frequenti** → **GIALLO (1)**

### Condizioni di Override (indipendentemente da quanto sopra):
- **Se 5+ strumenti di sicurezza separati richiedono monitoraggio attivo** → **ROSSO (2)**
- **Se non esistono procedure documentate di triage allerta** → **ROSSO (2)**
- **Se il personale di sicurezza riporta frequente cambio di compito** → Aumentare di 1 livello (Verde→Giallo, Giallo→Rosso)

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO (Implementare Per Primo)

| Soluzione | Costo | Complessità | Tempistiche |
|----------|------|------------|----------|
| **Procedure Triage Allerta** | Basso | Bassa | 2-4 settimane |
| **Blocchi Tempo Focus Protetti** | Basso | Bassa | 1-2 settimane |
| **Segregazione Ruoli (Sicurezza vs Admin)** | Medio | Media | 1-3 mesi |

### MEDIO IMPATTO (Fase Successiva)

| Soluzione | Costo | Complessità | Tempistiche |
|----------|------|------------|----------|
| **Integrazione SIEM/SOAR** | Alto | Alta | 3-6 mesi |
| **Correlazione Automatizzata Allerta** | Medio | Media | 2-4 mesi |
| **Dashboard Metriche Prestazioni** | Medio | Bassa | 1-2 mesi |

### BASSO IMPATTO (Lungo termine)

| Soluzione | Costo | Complessità | Tempistiche |
|----------|------|------------|----------|
| **Formazione Gestione Attenzione** | Basso | Bassa | In corso |
| **Piattaforma Analytics Avanzata** | Alto | Alta | 6-12 mesi |
| **Espansione Personale 24/7** | Alto | Media | 3-6 mesi |

---

## 💬 SCRIPT CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura:
**"Può illustrarmi cosa succede durante un periodo tipicamente intenso per il Suo team di sicurezza?"**
*Follow-up*: "Quanti schermi o strumenti diversi stanno guardando simultaneamente?"

**"Quando riceve più allerta di sicurezza contemporaneamente, qual è il processo?"**
*Segnale d'Allarme*: Nessun processo chiaro, o "chiunque sia disponibile gestisce qualsiasi cosa arrivi"

**"Come garantisce che il monitoraggio di sicurezza continui durante notti, weekend, o quando il personale chiave è assente?"**
*Segnale d'Allarme*: Singoli punti di fallimento, lacune nella formazione incrociata

### Domande di Approfondimento:
**"Mi parli di una volta recente in cui il Suo team stava gestendo più problemi di sicurezza simultaneamente."**
*Ascoltare per*: Indicatori mancati, risposte ritardate, problemi di coordinamento

**"Quali compiti non di sicurezza gestiscono i Suoi analisti di sicurezza durante i loro turni?"**
*Segnale d'Allarme*: Supporto utente, admin sistema, riunioni durante monitoraggio attivo

**"Come misura se il Suo team di sicurezza è efficace quando è occupato?"**
*Segnale d'Allarme*: Nessuna metrica, solo valutazioni soggettive

### Argomenti Delicati (Usare Linguaggio Professionale):
- **Invece di**: "Il Suo team è sovraccaricato cognitivamente"
- **Dica**: "Vogliamo garantire che il Suo team possa mantenere il focus sulle minacce critiche"

- **Invece di**: "Il multitasking sta degradando le prestazioni"
- **Dica**: "Ottimizziamo l'attenzione del Suo team sugli eventi di sicurezza ad alta priorità"

---

## 📊 MODELLO NOTE DI CAMPO

**Cliente**: _________________ **Data**: _______ **Auditor**: _____________

### Risultati Valutazione Rapida:
□ D1: ___  □ D2: ___  □ D3: ___  □ D4: ___  □ D5: ___  □ D6: ___  □ D7: ___

### **Punteggio Finale**: ☐ Verde (0) ☐ Giallo (1) ☐ Rosso (2)

### Osservazioni Chiave:
**Conteggio Strumenti di Sicurezza**: _____ (Interfacce separate che richiedono cambio compito)
**Lacune Personale**: ________________________________________________
**Volume Allerta**: _____ al giorno (media)
**Problemi Tempo di Risposta**: ____________________________________

### Risultati Critici:
□ **Rischio Immediato**: ________________________________________
□ **Vincolo Risorse**: ___________________________________
□ **Lacuna Processi**: __________________________________________

### Soluzioni Raccomandate (Top 3):
1. **Alta Priorità**: _______________________________________
2. **Media Priorità**: ____________________________________
3. **Vittoria Rapida**: _________________________________________

### Valutazione Prontezza Cliente:
□ **Consenso Leadership**: ☐ Alto ☐ Medio ☐ Basso
□ **Budget Disponibile**: ☐ Alto ☐ Medio ☐ Basso
□ **Capacità Tecnica**: ☐ Alta ☐ Media ☐ Bassa

### Prossimi Passi:
□ **Follow-up Richiesto**: ___________________________________
□ **Valutazione Aggiuntiva**: ________________________________
□ **Supporto Implementazione**: _______________________________

---

**Valutazione Completata** ✓
**Tempo Utilizzato**: _____ minuti
**Soddisfazione Cliente**: ☐ Alta ☐ Media ☐ Bassa
