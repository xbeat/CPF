## INDICATORE 3.2: TRAPPOLE DI ESCALATION DEL COMMITMENT

### CONTESTO

Le trappole di escalation del commitment (impegno) si verificano quando le organizzazioni continuano a investire in misure di sicurezza fallimentari o ad espandere permessi di accesso rischiosi semplicemente perché hanno preso un impegno iniziale, piuttosto che valutare oggettivamente l'efficacia attuale. Questo modello psicologico crea vulnerabilità in cui gli attaccanti possono sfruttare relazioni di fiducia consolidate e gradualmente aumentare il loro accesso sfruttando la riluttanza dell'organizzazione a mettere in discussione o invertire le decisioni di sicurezza precedenti. In pratica, questo si manifesta come richieste di eccezione alla sicurezza che si espandono progressivamente in portata, relazioni con fornitori che crescono oltre i confini appropriati e tecnologie di sicurezza che continuano a ricevere investimenti nonostante le scarse prestazioni.

### VALUTAZIONE

**Domanda 1**: Con quale frequenza concede eccezioni alle politiche di sicurezza, e qual è il Suo processo per verificare se le eccezioni temporanee sono diventate pratiche permanenti?
*Ci racconti il Suo esempio specifico di una recente richiesta di eccezione e come è stata gestita.*

**Domanda 2**: Quando implementa nuovi strumenti o processi di sicurezza, qual è la Sua procedura per valutarne l'efficacia e apportare modifiche se non funzionano come previsto?
*Ci fornisca un esempio di una soluzione di sicurezza che ha modificato o sostituito nell'ultimo anno.*

**Domanda 3**: Come gestisce le situazioni in cui un fornitore o partner commerciale richiede accesso espanso oltre il loro ambito di lavoro originale?
*Descriva una situazione recente in cui qualcuno ha chiesto accesso aggiuntivo al sistema o permessi sui dati.*

**Domanda 4**: Cosa succede quando un dipendente o un reparto richiede ripetutamente eccezioni alle politiche di sicurezza per "esigenze aziendali urgenti"?
*Ci parli di un recente modello di richieste di eccezione dalla stessa fonte.*

**Domanda 5**: Come traccia e rivede gli investimenti di sicurezza a lungo termine per assicurarsi che stiano ancora fornendo valore?
*Ci fornisca un esempio di come ha valutato se continuare o interrompere un'iniziativa di sicurezza.*

**Domanda 6**: Qual è il Suo processo quando i risultati degli audit o gli incidenti di sicurezza suggeriscono che le pratiche attuali debbano cambiare?
*Descriva come ha gestito un feedback che metteva in discussione un approccio di sicurezza esistente.*

**Domanda 7**: Come previene lo "scope creep" (espansione incontrollata dell'ambito) nelle relazioni con i fornitori o nei permessi di accesso dei dipendenti nel tempo?
*Ci parli delle Sue procedure per revisioni periodiche degli accessi e manutenzione dei confini delle relazioni.*

### PUNTEGGIO

**Verde (0)**: L'organizzazione ha processi documentati per rivedere regolarmente le decisioni di sicurezza, dimostra chiari esempi di interruzione di misure di sicurezza inefficaci, mantiene confini rigorosi di accesso ai fornitori con revisioni regolari e mostra evidenza di adattamento degli approcci di sicurezza basati su nuove informazioni o circostanze mutevoli.

**Giallo (1)**: L'organizzazione ha alcuni processi di revisione ma li applica in modo incoerente, mostra risultati misti nel mettere in discussione gli impegni di sicurezza esistenti, ha esempi occasionali di cambiamenti nell'approccio alla sicurezza ma anche evidenza di mantenimento di pratiche fallimentari, o dimostra successo parziale nel prevenire l'espansione dell'ambito di accesso.

**Rosso (2)**: L'organizzazione manca di processi sistematici di revisione per le decisioni di sicurezza, mostra chiari modelli di mantenimento di misure di sicurezza inefficaci a causa di investimenti precedenti, dimostra relazioni con fornitori o di accesso che si sono espanse oltre l'ambito originale senza giustificazione, o mostra resistenza al cambiamento degli approcci di sicurezza nonostante l'evidenza di inefficacia.

### SCENARI DI RISCHIO

**Compromissione Progressiva del Fornitore**: Gli attaccanti compromettono un fornitore legittimo che ha già accesso consolidato ai Suoi sistemi. Sfruttano la riluttanza della Sua organizzazione a mettere in discussione la relazione con il fornitore per richiedere gradualmente privilegi di accesso espansi, permessi di sistema aggiuntivi o accesso a dati più sensibili. La Sua riluttanza a mettere in discussione un "partner consolidato" consente all'attaccante di muoversi lateralmente attraverso la Sua rete per mesi.

**Catene di Escalation di Social Engineering**: Un attaccante si finge qualcuno che ha precedentemente fornito aiuto legittimo ai Suoi dipendenti (supporto IT, consulente, ecc.). Sfrutta l'impegno del Suo personale a essere utile e coerente con la precedente cooperazione per richiedere informazioni o accessi sempre più sensibili. Ciò che inizia come "verifichi questa configurazione di sistema" si trasforma in "resetti questa password di amministratore" perché i Suoi dipendenti vogliono mantenere coerenza con il loro comportamento collaborativo.

**Minaccia Insider attraverso Espansione del Ruolo**: Un dipendente legittimo espande gradualmente il proprio accesso ai dati e i privilegi di sistema attraverso richieste incrementali giustificate dall'evoluzione delle responsabilità lavorative. L'impegno della Sua organizzazione a supportare la crescita dei dipendenti e a evitare l'imbarazzo di mettere in discussione il personale fidato consente furto sistematico di dati o compromissione del sistema che appare seguire i normali processi aziendali.

**Evoluzione del Business Email Compromise**: Gli attaccanti sfruttano l'impegno della Sua organizzazione al servizio clienti o alle relazioni con i fornitori impersonando contatti commerciali consolidati. Iniziano con richieste minori coerenti con normali interazioni commerciali, poi si trasformano in richieste di pagamento fraudolente o condivisione di dati sensibili. L'impegno dei Suoi team finanziari o operativi a essere reattivi verso "contatti conosciuti" impedisce una corretta verifica delle richieste in escalation.

### CATALOGO DELLE SOLUZIONI

**Sistema Automatico di Scadenza delle Eccezioni**: Implementare tecnologia che fa scadere automaticamente tutte le eccezioni alle politiche di sicurezza dopo un periodo definito (30-90 giorni) a meno che non vengano esplicitamente rinnovate con nuova giustificazione. Configurare il Suo sistema di gestione degli accessi per segnalare e disabilitare i permessi temporanei che non sono stati rivisti. Questo impedisce alle eccezioni di diventare pratiche permanenti e forza la rivalutazione periodica delle decisioni di sicurezza.

**Monitoraggio dei Confini di Accesso dei Fornitori**: Implementare strumenti di monitoraggio che tracciano e avvisano sui cambiamenti nei modelli di accesso dei fornitori, volumi di dati insoliti o tentativi di accedere a sistemi al di fuori del loro ambito originale. Creare report automatizzati che mostrano le tendenze di accesso dei fornitori nel tempo e implementare flussi di lavoro di approvazione per qualsiasi richiesta di espansione dell'accesso dei fornitori che richiedano giustificazione aziendale e revisione della sicurezza.

**Processo di Revisione degli Investimenti di Sicurezza**: Stabilire "revisioni trimestrali del portfolio di sicurezza" in cui i team devono presentare evidenza di efficacia per le iniziative di sicurezza in corso utilizzando metriche specifiche (riduzione degli incidenti, costo per asset protetto, tassi di conformità degli utenti). Creare un processo formale per interrompere investimenti di sicurezza sottoperformanti e riallocare risorse, inclusi criteri chiari per quando "chiudere" strumenti o processi di sicurezza.

**Team Indipendenti di Revisione degli Accessi**: Formare team interfunzionali (inclusi membri non coinvolti nelle decisioni di accesso originali) per condurre revisioni periodiche dei permessi degli utenti, delle relazioni con i fornitori e delle eccezioni di sicurezza. Dare a questi team l'autorità di mettere in discussione gli impegni esistenti e raccomandare modifiche senza richiedere l'approvazione dei decisori originali, impedendo che l'investimento dell'ego blocchi i miglioramenti di sicurezza necessari.

**Rilevamento dei Modelli di Escalation**: Implementare analisi comportamentali che segnalano modelli insoliti nelle richieste di help desk, tentativi di accesso al sistema o query di dati che mostrano escalation graduale dalle stesse fonti. Configurare avvisi per richieste di eccezione ripetute dagli stessi individui o reparti e creare flussi di lavoro che richiedono approvazioni aggiuntive quando i modelli di richiesta suggeriscono potenziale sfruttamento del commitment.

**Protocolli di Revisione delle Decisioni**: Creare processi formali che celebrano e premiano i cambiamenti negli approcci di sicurezza basati su nuove evidenze piuttosto che trattarli come ammissioni di fallimento. Stabilire "protocolli pivot" che forniscono modi per salvare la faccia ai team per modificare gli impegni di sicurezza, inclusi template di comunicazione standard che inquadrano i cambiamenti come apprendimento organizzativo piuttosto che errori precedenti.

### CHECKLIST DI VERIFICA

**Per il Sistema Automatico di Scadenza delle Eccezioni**:
- ✓ Richiedere screenshot del sistema di gestione accessi che mostrano le impostazioni di scadenza automatica
- ✓ Rivedere i log che mostrano le eccezioni scadute automaticamente
- ✓ Verificare che i flussi di lavoro di approvazione richiedano nuova giustificazione per i rinnovi
- ✓ Verificare la presenza di avvisi/report che mostrano eccezioni scadute non rinnovate

**Per il Monitoraggio dei Confini di Accesso dei Fornitori**:
- ✓ Esaminare il dashboard di monitoraggio che mostra i modelli di accesso dei fornitori e gli avvisi
- ✓ Rivedere gli avvisi recenti per violazioni dei confini di accesso dei fornitori
- ✓ Verificare la documentazione del processo di approvazione per l'espansione dell'accesso dei fornitori
- ✓ Verificare i log di audit che mostrano le revisioni dell'ambito di accesso dei fornitori

**Per il Processo di Revisione degli Investimenti di Sicurezza**:
- ✓ Richiedere documentazione dalle recenti revisioni trimestrali del portfolio di sicurezza
- ✓ Rivedere evidenze di iniziative di sicurezza interrotte basate su prestazioni scadenti
- ✓ Verificare l'esistenza di metriche e criteri utilizzati per le decisioni di investimento in sicurezza
- ✓ Verificare i verbali delle riunioni che mostrano discussioni sulla riallocazione delle risorse

**Per i Team Indipendenti di Revisione degli Accessi**:
- ✓ Rivedere lo statuto del team e la composizione che mostrano l'indipendenza dai decisori originali
- ✓ Esaminare i recenti report di revisione degli accessi e le loro raccomandazioni
- ✓ Verificare esempi di modifiche agli accessi implementate in base alle raccomandazioni del team
- ✓ Verificare la presenza di evidenza che i team hanno l'autorità di annullare le decisioni originali

**Per il Rilevamento dei Modelli di Escalation**:
- ✓ Rivedere il dashboard di analisi comportamentale e le configurazioni degli avvisi
- ✓ Esaminare gli avvisi recenti per modelli di escalation e come sono stati gestiti
- ✓ Verificare i flussi di lavoro per approvazioni aggiuntive quando vengono rilevati modelli
- ✓ Verificare i report degli incidenti per l'analisi dei modelli di escalation

**Per i Protocolli di Revisione delle Decisioni**:
- ✓ Rivedere la documentazione dei protocolli pivot e dei template di comunicazione
- ✓ Esaminare esempi di cambiamenti negli approcci di sicurezza comunicati utilizzando questi protocolli
- ✓ Verificare i materiali formativi che promuovono la revisione delle decisioni come apprendimento positivo
- ✓ Verificare la presenza di premi/riconoscimenti dati per pivot di sicurezza vantaggiosi

### METRICHE DI SUCCESSO

**Tasso di Normalizzazione delle Eccezioni**: Misurare la percentuale di eccezioni di sicurezza temporanee che diventano permanenti senza revisione appropriata. Obiettivo: Ridurre dalla baseline a meno del 5% delle eccezioni che diventano permanenti. Misurare mensilmente confrontando le eccezioni attive con le loro date di scadenza originali e gli aggiornamenti delle giustificazioni.

**Miglioramento del ROI degli Investimenti di Sicurezza**: Tracciare il rapporto costo-efficacia degli investimenti di sicurezza prima e dopo l'implementazione dei processi di revisione. Obiettivo: Migliorare il ROI della sicurezza del 25% entro 12 mesi attraverso una migliore allocazione delle risorse. Misurare trimestralmente utilizzando metriche come costo per incidente prevenuto o miglioramento della conformità degli utenti per euro speso.

**Incidenti di Espansione dell'Ambito di Accesso**: Contare il numero di incidenti di sicurezza attribuibili all'escalation graduale dei permessi di accesso o delle relazioni con i fornitori oltre i confini appropriati. Obiettivo: Ridurre gli incidenti di espansione dell'ambito del 40% entro 6 mesi. Misurare attraverso report di analisi degli incidenti che identificano specificamente i fattori di escalation come cause contribuenti.
