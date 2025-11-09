# 📋 CPF INDICATORE 4.2 FIELD KIT
## ASSUNZIONE DI RISCHI INDOTTA DALLA RABBIA

---

## ⚡ VALUTAZIONE RAPIDA (5 minuti)

**Verifichi SÌ se condizione esiste:**

□ **Richieste di Eccezioni Frequenti**: Richieste di eccezioni di sicurezza si verificano settimanalmente o più spesso
□ **Frustrazione Help Desk**: >15% dei ticket help desk di sicurezza contengono linguaggio arrabbiato/frustrato
□ **Nessuna Alternativa per Interruzioni**: Dipendenti mancano di workaround autorizzati quando sistemi di sicurezza falliscono
□ **Conflitti di Performance**: Dipendenti regolarmente riportano che sicurezza previene rispettare scadenze
□ **Clustering di Violazioni**: Violazioni di sicurezza aumentano dopo cambiamenti di sistema o periodi di stress
□ **Shadow IT Presente**: App/strumenti non autorizzati scoperti mensilmente o più frequentemente
□ **Lamentele Aperte**: Dipendenti apertamente criticano policy di sicurezza in riunioni/email

**Punteggio Rapido**: 0-2 SÌ = Verde | 3-4 SÌ = Giallo | 5+ SÌ = Rosso

---

## 📝 RACCOLTA EVIDENZE (10 minuti)

### Documenti da Richiedere
□ **Report ticket help desk** (ultimi 3 mesi, relativi alla sicurezza)
□ **Log richieste eccezioni di sicurezza** (formali e informali)
□ **Report scoperta Shadow IT** (log CASB, monitoraggio rete)
□ **Incidenti recenti di violazione policy di sicurezza**
□ **Survey soddisfazione dipendenti** menzionanti IT/sicurezza

### Dimostrazioni di Sistema
□ **"Mi mostri il Suo processo di login"** - cronometrare e osservare frustrazione utente
□ **"Cosa succede quando VPN fallisce?"** - documentare procedure alternative
□ **"Dimostri reset password"** - contare passi e tempo richiesto

### Interviste Chiave (5 minuti ciascuna)
□ **Manager Help Desk**: Pattern sentiment ticket, frequenza escalation
□ **Responsabile Sicurezza IT**: Richieste eccezioni, trend violazioni policy
□ **Manager di Dipartimento**: Lamentele staff riguardo strumenti sicurezza
□ **Rappresentante Utente Finale**: Esperienza personale con attrito sicurezza

### Controlli di Sistema
□ **Rivedere log di autenticazione** per pattern di retry e fallimenti
□ **Controllare monitoraggio rete** per uso applicazioni non autorizzate
□ **Esaminare report incidenti** per correlazioni periodi-stress

---

## 🎯 SCORING RAPIDO (2 minuti)

### Albero Decisionale

**INIZIO QUI** → Conti ticket frustrazione help desk

**Se <5% ticket frustrati:**
→ Conti eccezioni sicurezza → **Se <1/mese** → **VERDE**
→ **Se 1+/mese** → Conti scoperte shadow IT → **Se rare** → **VERDE** | **Se frequenti** → **GIALLO**

**Se 5-15% ticket frustrati:**
→ Controlli per clustering violazioni → **Se nessun pattern** → **GIALLO** | **Se pattern chiaro** → **ROSSO**

**Se >15% ticket frustrati:**
→ **ROSSO** (indipendentemente da altri fattori)

**Override a ROSSO se:**
- Eccezioni sicurezza settimanali/giornaliere
- Dipendenti apertamente si lamentano in riunioni
- Nessuna alternativa autorizzata durante interruzioni

---

## 🔧 PRIORITÀ SOLUZIONI (5 minuti)

### ALTO IMPATTO / IMPLEMENTAZIONE RAPIDA
□ **Procedure Accesso di Emergenza** (Costo: Basso, Tempo: 1 settimana)
  - Documentare metodi autenticazione di backup
  - Formare staff su procedure interruzione

□ **Risposta Frustrazione Help Desk** (Costo: Basso, Tempo: 2 settimane)
  - Segnalare e prioritizzare ticket frustrati
  - Impegno risposta 24 ore

### MEDIO IMPATTO / TIMELINE MEDIA
□ **Revisione Comunicazione Sicurezza** (Costo: Medio, Tempo: 1 mese)
  - Creare spiegazioni policy in linguaggio semplice
  - Comunicazioni cambiamento proattive

□ **Audit User Experience** (Costo: Medio, Tempo: 6 settimane)
  - Misurare tempi login e tassi errore
  - Implementare soluzioni single sign-on

### ALTO IMPATTO / LUNGO TERMINE
□ **Programma Integrazione Shadow IT** (Costo: Alto, Tempo: 3 mesi)
  - Deploy monitoraggio CASB
  - Coinvolgimento utente per alternative strumenti

□ **Supporto Sicurezza Periodo-Stress** (Costo: Medio, Tempo: Continuativo)
  - Monitorare indicatori stress organizzativo
  - Procedure flessibilità policy temporanea

---

## 💬 CONVERSAZIONE CLIENTE (3 minuti)

### Domande di Apertura
**"Mi percorra cosa succede quando un dipendente non può accedere alla VPN."**
- *Follow-up*: "Hanno altre opzioni autorizzate?"
- *Bandiera rossa*: "Se la cavano da soli"

**"Come dipendenti tipicamente esprimono frustrazione con strumenti sicurezza?"**
- *Follow-up*: "Dove vanno tipicamente queste lamentele?"
- *Bandiera rossa*: Critica aperta in riunioni

**"Mi parli della Sua richiesta eccezione sicurezza più recente."**
- *Follow-up*: "Quanto spesso riceve queste richieste?"
- *Bandiera rossa*: Richieste settimanali o giornaliere

### Domande di Approfondimento
**"Quando implementa nuove misure sicurezza, qual è la risposta utente tipica?"**
- *Bandiera rossa*: Lamentele immediate o workaround

**"Nota pattern nelle violazioni sicurezza?"**
- *Bandiera rossa*: Clustering attorno periodi stressanti

### Formulazione Professionale per Argomenti Sensibili
- Invece di "Sono dipendenti arrabbiati?" → "Come utenti tipicamente forniscono feedback riguardo strumenti sicurezza?"
- Invece di "Gente bypassa sicurezza?" → "Quali metodi alternativi dipendenti usano durante interruzioni sistema?"
- Invece di "C'è shadow IT?" → "Quali strumenti produttività ha scoperto che non erano formalmente approvati?"

---

## 📊 TEMPLATE NOTE SUL CAMPO

**Organizzazione**: _________________ **Data**: _________ **Auditor**: _________________

### Risultati Valutazione
**Tasso Frustrazione Help Desk**: _____%
**Eccezioni Sicurezza/Mese**: _____
**Scoperte Shadow IT/Trimestre**: _____
**Alternative Interruzioni Disponibili**: S / N
**Clustering Violazioni Osservato**: S / N

### Evidenza Chiave Trovata
□ **Ticket frustrati** - Esempi: ________________________________
□ **Richieste eccezioni** - Più recente: _____________________________
□ **Shadow IT scoperto** - Tipi: ________________________________
□ **Lamentele aperte** - Contesto: ___________________________________

### Giustificazione Punteggio Rischio
**Punteggio Finale**: Verde / Giallo / Rosso
**Fattori Rischio Primari**:
1. ________________________________________________________________
2. ________________________________________________________________
3. ________________________________________________________________

### Raccomandazioni Immediate
**Priorità 1**: ____________________________________________________
**Priorità 2**: ____________________________________________________
**Priorità 3**: ____________________________________________________

### Follow-up Richiesto
□ **Interviste aggiuntive necessarie** - Chi: ___________________________
□ **Accesso sistemi richiesto** - Cosa: _____________________________
□ **Documentazione mancante** - Quale: ______________________________

---

**Valutazione Completa**: Tempo totale _____ minuti | Livello confidenza: Alto / Medio / Basso
