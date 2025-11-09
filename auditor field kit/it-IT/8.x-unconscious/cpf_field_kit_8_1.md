# CPF FIELD KIT 8.1: Proiezione dell'Ombra sugli Aggressori

**Tempo di valutazione: 22 minuti totali**
**Vulnerabilità**: Le organizzazioni si concentrano esclusivamente sulle minacce esterne ignorando i rischi interni

---

## VALUTAZIONE RAPIDA (5 minuti)

**Spunti tutte le voci applicabili - Cercare 4+ spunte per rischio ROSSO:**

□ **Squilibrio di bilancio**: Meno del 20% del budget di cybersecurity allocato al rilevamento delle minacce interne
□ **Ritardi nelle indagini**: Gli avvisi di minacce interne richiedono più del doppio del tempo per essere investigati rispetto agli avvisi esterni
□ **Revisioni degli accessi**: I diritti di accesso dei dipendenti vengono revisionati annualmente o meno frequentemente
□ **Supervisione fornitori**: Nessun monitoraggio formale della sicurezza per l'accesso ai sistemi di fornitori/partner
□ **Formazione mirata**: Meno del 25% della formazione sulla sicurezza affronta le minacce interne o l'ingegneria sociale (social engineering)
□ **Attribuzione degli incidenti**: Gli ultimi 3 incidenti di sicurezza attribuiti principalmente ad "aggressori esterni sofisticati"
□ **Threat Intelligence**: Nessuna fonte dedicata per l'intelligence sulle minacce interne o sui rischi della catena di fornitura (supply chain)

**Punteggio rapido**: 0-2 spunte = VERDE | 3-4 spunte = GIALLO | 5+ spunte = ROSSO

---

## RACCOLTA DELLE PROVE (10 minuti)

### Documenti da richiedere:
□ **Ripartizione del budget di cybersecurity attuale** (ultimi 12 mesi)
□ **Ultimi 3 rapporti di incidenti di sicurezza**
□ **Log di revisione degli accessi dei dipendenti** (ultimi 6 mesi)
□ **Programma di formazione sulla sicurezza e registri di completamento**
□ **Checklist/processo di valutazione della sicurezza dei fornitori**
□ **Riepilogo della configurazione degli strumenti di monitoraggio della sicurezza**

### Dimostrazioni da richiedere:
□ **"Mi mostri la Sua dashboard degli avvisi di sicurezza e il processo di risposta tipico"**
□ **"Mi guidi attraverso il processo di indagine di un avviso di accesso sospetto da parte di un dipendente"**
□ **"Mi dimostri il Suo sistema di gestione degli accessi privilegiati (Privileged Access Management)"**
□ **"Mi mostri le Sue capacità di monitoraggio degli accessi dei fornitori"**

### Verifiche di sistema:
□ **Categorie di avvisi SIEM (Security Information and Event Management)**
□ **Presenza e configurazione dello strumento UBA (User Behavior Analytics)**
□ **Implementazione del sistema PAM (Privileged Access Management)**
□ **Capacità di rilevamento delle minacce interne**

### Obiettivi delle interviste:
□ **CISO o Direttore della Sicurezza**
□ **Manager del SOC (Security Operations Center) o Analista Senior**
□ **Amministratore IT con accesso privilegiato**
□ **Rappresentante HR (processo di verifica dei precedenti)**

---

## PUNTEGGIO RAPIDO (2 minuti)

### Albero decisionale:

**INIZIO** → Il budget per le minacce interne è ≥25% del budget totale per la sicurezza?
├─ **SÌ** → Le revisioni degli accessi vengono condotte trimestralmente con risultati documentati?
│   ├─ **SÌ** → **VERDE** (Approccio equilibrato)
│   └─ **NO** → **GIALLO** (Buon investimento, processi deboli)
└─ **NO** → Gli avvisi interni ricevono la stessa priorità degli avvisi esterni?
    ├─ **SÌ** → **GIALLO** (Buona risposta, investimento debole)
    └─ **NO** → **ROSSO** (Focus pesante sull'esterno)

### Soglie oggettive:
- **VERDE**: ≥25% budget minacce interne + revisioni accessi trimestrali + priorità avvisi uguale
- **GIALLO**: 15-24% budget minacce interne OPPURE revisioni accessi semestrali OPPURE alcuni ritardi negli avvisi
- **ROSSO**: <15% budget minacce interne E revisioni accessi annuali/ad hoc E ritardi significativi negli avvisi

---

## PRIORITÀ DELLE SOLUZIONI (5 minuti)

### ALTO IMPATTO / RISULTATI RAPIDI (Implementare per primi)
- **User Behavior Analytics (UBA) - Analisi del comportamento utente** - Costo: Medio | Tempo: 3-6 mesi
- **Privileged Access Management (PAM) - Gestione degli accessi privilegiati** - Costo: Alto | Tempo: 6-9 mesi
- **Aggiornamento della formazione sulla sensibilizzazione alla sicurezza** - Costo: Basso | Tempo: 1-2 mesi

### MEDIO IMPATTO / MEDIO SFORZO
- **Programma per le minacce interne** - Costo: Medio | Tempo: 6-12 mesi | *Richiede personale dedicato*
- **Processo di gestione del rischio fornitori** - Costo: Basso | Tempo: 3-4 mesi | *Necessita aggiornamenti delle policy*
- **Test di ingegneria sociale** - Costo: Medio | Tempo: 2-3 mesi | *Programma continuo*

### LUNGO TERMINE / ALTA COMPLESSITÀ
- **Architettura Zero Trust** - Costo: Alto | Tempo: 12-24 mesi | *Cambiamento importante dell'infrastruttura*
- **Threat Intelligence avanzata** - Costo: Medio | Tempo: 6-9 mesi | *Richiede formazione degli analisti*
- **Operazioni di sicurezza integrate** - Costo: Alto | Tempo: 9-18 mesi | *Ristrutturazione organizzativa*

---

## SCRIPT CONVERSAZIONE CON IL CLIENTE (3 minuti)

### Domande di apertura:
**"Quando pensa alle minacce alla cybersecurity, cosa Le viene in mente per primo?"**
*Ascoltare: Hacker esterni, stati nazionali, criminali vs. menzioni di insider*

**"Mi parli del Suo ultimo incidente di sicurezza. Cosa è successo e come lo ha investigato?"**
*Ascoltare: Attribuzione esterna, considerazione di fattori interni, accuratezza dell'indagine*

**"Come monitora ciò che i Suoi dipendenti e collaboratori fanno con il loro accesso ai sistemi?"**
*Ascoltare: Strumenti specifici, processi, frequenza, esempi*

### Sollecitazioni di follow-up:
- *Se menzionano solo minacce esterne*: **"E i rischi derivanti da dipendenti o partner fidati?"**
- *Se mancano di monitoraggio interno*: **"Come rileverebbe se un dipendente stesse accedendo a dati insoliti?"**
- *Se hanno accesso fornitori*: **"Come monitora ciò che i Suoi fornitori stanno facendo nei Suoi sistemi?"**

### Indicatori di bandiera rossa:
□ **Focus esclusivamente esterno** ("La nostra più grande minaccia sono gli hacker/stati nazionali")
□ **Idealizzazione dei dipendenti** ("Ci fidiamo completamente delle nostre persone")
□ **Punti ciechi sui fornitori** ("I nostri partner sono estensioni del nostro team")
□ **Esternalizzazione degli incidenti** ("È stato un attacco sofisticato, niente che potessimo fare")
□ **Lacune nel monitoraggio** ("Non monitoriamo l'attività interna - sarebbe Grande Fratello")

---

## MODELLO DI NOTE SUL CAMPO

**Cliente**: _________________ **Data**: _________ **Auditor**: _________________

### Allocazione del bilancio:
- Budget totale per la sicurezza: €__________
- Allocazione minacce interne: €__________ (____ %)
- Allocazione minacce esterne: €__________ (____ %)

### Maturità dei processi:
- Frequenza revisione accessi: __________
- Ultimo incidente di minaccia interna: __________
- Valutazioni di sicurezza dei fornitori: __________

### Capacità tecniche:
□ SIEM implementato  □ UBA implementato  □ PAM implementato  □ Strumenti per minacce interne

### Indicatori culturali:
- Linguaggio principale sulle minacce utilizzato: __________
- Priorità indagini interne vs. esterne: __________
- Equilibrio formazione: ____% esterno / ____% interno

### Punteggio di rischio: □ VERDE □ GIALLO □ ROSSO

### Raccomandazioni immediate:
1. ________________________________
2. ________________________________
3. ________________________________

### Preoccupazioni/Obiezioni del cliente:
_________________________________________________
_________________________________________________

---

**Field Kit completato** - Tempo di valutazione: _____ minuti
**Prossimi passi**: Generare rapporto formale entro 24 ore
