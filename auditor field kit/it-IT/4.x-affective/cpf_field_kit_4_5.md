# CPF FIELD KIT 4.5: OCCULTAMENTO DI SICUREZZA BASATO SULLA VERGOGNA

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Istruzioni**: Verifichi SÌ/NO basato su evidenza osservabile. Nessuna interpretazione richiesta.

| # | Domanda di Valutazione | SÌ | NO |
|---|-------------------|-----|-----|
| 1 | **Gli incidenti di sicurezza vengono riportati entro 4 ore dalla scoperta?** <br>*Verifichi i registri degli incidenti recenti per i timestamp* | ☐ | ☐ |
| 2 | **Ci sono rapporti regolari di quasi-incidenti dai dipendenti?** <br>*Volume mensile di 1+ per dipartimento* | ☐ | ☐ |
| 3 | **La documentazione post-incidente si concentra sulle correzioni del sistema vs. la colpa individuale?** <br>*Riveda gli ultimi 3 rapporti di incidente per il linguaggio* | ☐ | ☐ |
| 4 | **I dipendenti cercano aiuto più spesso di quanto riportino incidenti?** <br>*Confronti i ticket dell'help desk vs. i rapporti di incidente* | ☐ | ☐ |
| 5 | **Esiste una politica formale senza colpa per errori di sicurezza onesti?** <br>*Il documento di politica scritto esiste* | ☐ | ☐ |
| 6 | **I canali di segnalazione anonimi sono disponibili e promossi?** <br>*Sistema attivo con utilizzo recente* | ☐ | ☐ |
| 7 | **Zero dipendenti sono stati disciplinati per aver riportato errori di sicurezza?** <br>*Registri HR degli ultimi 12 mesi* | ☐ | ☐ |

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti da Richiedere
- ☐ **Politica di risposta agli incidenti** (cercare linguaggio di colpa vs. apprendimento)
- ☐ **Ultimi 6 mesi rapporti di incidenti** (verificare completezza e linea temporale)
- ☐ **Sezione sicurezza del manuale dei dipendenti** (conseguenze disciplinari)
- ☐ **Registri delle richieste di aiuto del team di sicurezza** (confronto del volume)
- ☐ **Documentazione del sistema di segnalazione anonima** (statistiche di utilizzo)

### Dimostrazioni da Richiedere
- ☐ **"Mi mostri come i dipendenti riportano incidenti di sicurezza"**
- ☐ **"Mi accompagni attraverso il Suo ultimo processo di risposta agli incidenti"**
- ☐ **"Mi dimostri il sistema di segnalazione anonima"**
- ☐ **"Mi mostri i metodi di contatto del team di sicurezza"**

### Verifiche di Sistema da Eseguire
- ☐ **Testare la funzionalità del sistema di segnalazione anonima**
- ☐ **Rivedere i registri SIEM per lacune di rilevamento vs. segnalazione degli incidenti**
- ☐ **Verificare il sistema di ticketing dell'help desk per richieste di sicurezza**
- ☐ **Esaminare i dati della linea temporale degli incidenti per ritardi nella segnalazione**

### Target di Intervista
- ☐ **Responsabile del team di sicurezza** (modelli di segnalazione, livelli di cooperazione)
- ☐ **Partecipanti a incidenti recenti** (esperienza con il processo di risposta)
- ☐ **Responsabili di dipartimento** (osservazioni del comportamento dei dipendenti)
- ☐ **Rappresentante HR** (azioni disciplinari per problemi di sicurezza)

---

## 🎯 PUNTEGGIO RAPIDO (2 minuti)

### Albero Decisionale
**Conti le risposte SÌ totali dalla Valutazione Rapida:**

```
7 risposte SÌ → VERDE (0)
↓
5-6 risposte SÌ → GIALLO (1)
↓
0-4 risposte SÌ → ROSSO (2)
```

### Validazione Criteri Oggettivi
- **VERDE**: Incidenti riportati <4 ore + Nessuna azione disciplinare + Cultura attiva di ricerca di aiuto
- **GIALLO**: Alcuni ritardi (4-24 ore) + Approccio misto colpa/apprendimento + Utilizzo anonimo moderato
- **ROSSO**: Ritardi frequenti >24 ore + Cultura focalizzata sulla colpa + Alta dipendenza dalla segnalazione anonima

---

## 🔧 PRIORITÀ DELLE SOLUZIONI (5 minuti)

| Priorità | Soluzione | Impatto | Implementazione | Costo |
|----------|----------|--------|----------------|------|
| **ALTA** | Politica incidenti senza colpa | Alto | Rapida (30 giorni) | Basso |
| **ALTA** | Sistema di segnalazione anonima | Alto | Media (60 giorni) | Medio |
| **ALTA** | Comunicazione della leadership sulla sicurezza | Alto | Rapida (7 giorni) | Basso |
| **MEDIA** | Programma di riconoscimento per la segnalazione | Medio | Media (90 giorni) | Medio |
| **MEDIA** | Rete di campioni di sicurezza | Medio | Lunga (120 giorni) | Medio |
| **BASSA** | SLA formale con escalation del supporto | Basso | Lunga (180 giorni) | Alto |

### Dipendenze
- **Cambiamenti di politica** richiedono approvazione esecutiva
- **Programmi di riconoscimento** necessitano approvazione HR e budget
- **Sistemi tecnici** richiedono coordinamento del team IT e sicurezza

---

## 💬 SCRIPT DI CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di Apertura
**"Vorrei comprendere la Sua cultura di segnalazione degli incidenti. Può Lei accompagnarmi attraverso cosa succede quando qualcuno fa un errore di sicurezza?"**

### Sollecitazioni di Follow-up
- **Se menzionano ritardi**: *"Cosa tipicamente causa il ritardo tra quando qualcosa succede e quando viene riportato?"*
- **Se menzionano problemi di cooperazione**: *"Può Lei darmi un esempio di quando qualcuno non è stato completamente disponibile durante un incidente?"*
- **Se menzionano rapporti anonimi**: *"Quale percentuale dei Suoi problemi di sicurezza arriva attraverso canali anonimi?"*
- **Se menzionano azioni disciplinari**: *"Mi aiuti a comprendere il Suo approccio - è più su correggere la persona o correggere il sistema?"*

### Indicatori di Bandiera Rossa
- ☐ **"Le persone dovrebbero saperlo meglio"** (linguaggio di colpa)
- ☐ **"Noi non abbiamo questi problemi"** (affermazione irrealistica)
- ☐ **"Tutti cooperano completamente"** (risposta difensiva)
- ☐ **"Abbiamo scoperto da [fonte esterna]"** (modello di scoperta ritardata)
- ☐ **"Avrebbero dovuto dircelo prima"** (incolpare la vittima)

### Domande di Sondaggio Professionale
- *"Come Lei bilancia la responsabilità con l'incoraggiamento alla segnalazione?"*
- *"Cosa rende qualcuno comodo nel venire da Lei con una preoccupazione di sicurezza?"*
- *"Quando è stata l'ultima volta che qualcuno ha chiesto aiuto per la sicurezza prima che si verificasse un problema?"*

---

## 📊 MODELLO NOTE DI CAMPO

### Riepilogo della Valutazione
**Data**: _________ **Revisore**: _________ **Cliente**: _________

**Punteggio Valutazione Rapida**: ___/7 risposte SÌ **→ Valutazione Finale**: ☐ VERDE ☐ GIALLO ☐ ROSSO

### Risultati Chiave
**Evidenza di occultamento basato sulla vergogna**:
- ☐ Ritardi nella segnalazione notati
- ☐ Modelli di divulgazione incompleta degli incidenti
- ☐ Resistenza alla cooperazione osservata
- ☐ Indicatori di cultura focalizzata sulla colpa

**Indicatori positivi osservati**:
- ☐ Politica senza colpa attiva
- ☐ Cultura forte di ricerca di aiuto
- ☐ Revisioni focalizzate sull'apprendimento
- ☐ Sistema anonimo utilizzato appropriatamente

### Raccomandazioni Prioritarie
1. **Immediato (0-30 giorni)**: _________________________________
2. **Breve termine (30-90 giorni)**: _______________________________
3. **Lungo termine (90+ giorni)**: ___________________________________

### Valutazione della Prontezza del Cliente
**Livello di impegno della leadership**: ☐ Alto ☐ Medio ☐ Basso
**Resistenza al cambiamento attesa**: ☐ Bassa ☐ Media ☐ Alta
**Disponibilità delle risorse**: ☐ Adeguata ☐ Limitata ☐ Vincolata

### Follow-up Richiesto
- ☐ Revisione dettagliata della politica necessaria
- ☐ Sondaggio dei dipendenti raccomandato
- ☐ Valutazione del sistema tecnico richiesta
- ☐ Workshop della leadership suggerito

---

## ✅ CHECKLIST DI COMPLETAMENTO

**Prima di lasciare il sito del cliente**:
- ☐ Tutte le 7 domande di valutazione completate
- ☐ Elementi di raccolta evidenze ottenuti o documentati come non disponibili
- ☐ Punteggio completato con razionale di supporto
- ☐ Soluzioni prioritarie identificate basate sul contesto del cliente
- ☐ Modello delle note di campo completamente compilato
- ☐ Prossimi passi e linea temporale discussi con il cliente

**Tempo totale di valutazione stimato**: 22 minuti
