# INDICATORE CPF 6.7: POSTURE DI SICUREZZA ATTACCO-FUGA

## CONTESTO

Le posture di sicurezza attacco-fuga si verificano quando le organizzazioni adottano inconsciamente o posture difensive aggressive (attacco) o comportamenti di evitamento completo (fuga) quando affrontano minacce di cybersecurity. Questo crea punti ciechi sistematici dove le organizzazioni o sovra-investono in difese perimetrali ignorando minacce interne, o evitano decisioni di sicurezza interamente attraverso negazione e delega. Questi modelli reattivi bypassano valutazione razionale del rischio e creano vulnerabilità prevedibili che gli attaccanti possono sfruttare.

## VALUTAZIONE

**Domanda 1**: Negli ultimi 12 mesi, quale percentuale del Suo budget di cybersecurity è stata spesa su sicurezza perimetrale (firewall, rilevamento intrusioni, monitoraggio rete) rispetto a sicurezza interna (protezione endpoint, controlli accessi, prevenzione perdita dati)? Ci dica la Sua suddivisione budget specifica.

**Domanda 2**: Quando viene identificata una potenziale minaccia di sicurezza, quanto tempo impiega tipicamente la Sua organizzazione per prendere una decisione su azioni di risposta? Ci guidi attraverso un esempio recente di processo decisionale risposta minaccia.

**Domanda 3**: Quanto spesso vengono approvate eccezioni alle politiche di sicurezza, e qual è il tipico processo di approvazione? Ci dia un esempio specifico di una recente richiesta di eccezione sicurezza e come è stata gestita.

**Domanda 4**: Descriva la Sua ultima decisione importante di investimento in sicurezza. Cosa ha innescato la decisione, chi era coinvolto, e quanto tempo ha richiesto il processo dalla discussione iniziale all'implementazione?

**Domanda 5**: Quando gli strumenti di sicurezza generano avvisi o raccomandazioni, quale percentuale tipicamente viene investigata entro 48 ore? Ci parli della gestione avvisi di una settimana recente.

**Domanda 6**: Come gestisce la Sua organizzazione le discussioni sulla sicurezza nelle riunioni esecutive? Descriva la reazione tipica quando vengono sollevate questioni di sicurezza e fornisca un esempio recente.

**Domanda 7**: Cosa succede quando le misure di sicurezza sono in conflitto con le operazioni di business? Ci dia un esempio specifico di come tali conflitti sono stati risolti negli ultimi 6 mesi.

## PUNTEGGIO

**Verde (0)**: Investimenti sicurezza bilanciati (40-60% interno vs perimetrale), decisioni di sicurezza prese entro 5 giorni lavorativi, tasso eccezioni sotto 10% con processo documentato, decisioni investimento basate su evidenza, tasso investigazione avvisi sopra 80%, discussioni esecutive sicurezza costruttive, processo risoluzione conflitti strutturato.

**Giallo (1)**: Investimenti moderatamente sbilanciati (divisione 30-70%), decisioni di sicurezza richiedono 1-2 settimane, tasso eccezioni 10-25% con approvazioni informali, decisioni investimento miste razionali/reattive, tasso investigazione avvisi 50-80%, coinvolgimento esecutivo inconsistente, risoluzione conflitti ad-hoc.

**Rosso (2)**: Investimenti gravemente sbilanciati (oltre 70% perimetrale o sotto 30% interno), decisioni di sicurezza ritardate oltre 2 settimane o prese frettolosamente sotto pressione, tasso eccezioni sopra 25% o nessun monitoraggio, decisioni investimento puramente reattive, tasso investigazione avvisi sotto 50%, esecutivi evitano discussioni sicurezza o reagiscono difensivamente, conflitti risolti disabilitando controlli di sicurezza.

## SCENARI DI RISCHIO

**Sfruttamento Minaccia Insider**: Organizzazioni con postura attacco si concentrano intensamente su perimetri esterni mentre dipendenti fidati operano con privilegi eccessivi e monitoraggio minimo. Un dipendente scontento o account insider compromesso può accedere ed esfiltrate dati sensibili perché controlli interni sono stati trascurati in favore di difese perimetrali "mentalità fortezza".

**Campagne Minaccia Persistente Avanzata (APT)**: Attori APT sfruttano organizzazioni con postura fuga usando tecniche lente e graduali che evitano di innescare il monitoraggio di sicurezza minimo in atto. Queste organizzazioni ritardano investigazione e risposta minacce, permettendo agli attaccanti mesi o anni per stabilire persistenza, muoversi lateralmente e completare i loro obiettivi.

**Attacchi Business Email Compromise (BEC)**: Organizzazioni fuga evitano di implementare forti controlli di sicurezza email per prevenire disruzione business, rendendole vulnerabili ad attacchi di ingegneria sociale. Organizzazioni attacco possono bloccare email legittime con filtraggio aggressivo mentre perdono attacchi BEC sofisticati che non innescano rilevamenti basati su firma.

**Compromessi Supply Chain**: Entrambe le posture creano vulnerabilità - organizzazioni attacco possono frettolosamente tagliare relazioni fornitori dopo incidenti minori, disrumpendo continuità business, mentre organizzazioni fuga evitano valutazioni sicurezza fornitori interamente, permettendo a fornitori compromessi di accedere alle loro reti.

## CATALOGO SOLUZIONI

**Revisione Architettura Sicurezza Bilanciata**: Condurre revisioni trimestrali di allocazione spesa sicurezza usando framework standardizzato che impone percentuali minime per diversi domini di sicurezza (30-40% perimetrale, 35-45% interno, 15-25% risposta/recovery). Creare dashboard esecutive mostrando bilanciamento investimenti con chiare giustificazioni per eventuali deviazioni da allocazioni target.

**Implementazione Framework Decisione Sicurezza**: Implementare processo decisionale strutturato con tempistiche definite (valutazione iniziale 72 ore, deadline decisione 5 giorni, procedure escalation per ritardi). Includere matrici criteri decisionali che pesano impatto business, probabilità minaccia, complessità implementazione e requisiti risorse per contrastare decisioni emotive.

**Ottimizzazione Gestione Avvisi**: Implementare prioritizzazione avvisi a livelli con triage iniziale automatizzato, tempistiche risposta obbligatorie per ogni livello e reporting metriche settimanali su tassi investigazione e tempi risoluzione. Includere monitoraggio fatica avvisi attraverso metriche monitorando tassi falso positivo e indicatori burnout analisti.

**Protocollo Briefing Sicurezza Esecutivo**: Stabilire briefing sicurezza mensili strutturati usando formati standardizzati che presentano informazioni rischio bilanciate senza innescare risposte attacco-fuga. Includere sia aggiornamenti panorama minacce che risultati programma sicurezza per mantenere coinvolgimento costruttivo.

**Processo Risoluzione Conflitti**: Creare procedure formali per risolvere conflitti sicurezza-business entro tempistiche definite, includendo documentazione accettazione rischio, identificazione controlli compensativi e revisione regolare di eccezioni temporanee per prevenire degradazione sicurezza permanente.

**Strumento Auto-Valutazione Postura Sicurezza**: Implementare sondaggi auto-valutazione trimestrali per team sicurezza ed esecutivi per identificare tendenze attacco-fuga presto, con risultati revisionati da consulenti sicurezza esterni per fornire feedback oggettivo su bilanciamento postura sicurezza organizzativa.

## CHECKLIST DI VERIFICA

**Revisione Architettura Sicurezza**:
- Richiedere ultimi 12 mesi di rapporti spesa sicurezza
- Revisionare diagrammi architettura sicurezza mostrando posizionamento controlli
- Intervistare team sicurezza su razionale decisione investimento
- Segnale allarme: Oltre 70% spesa in singolo dominio sicurezza senza giustificazione rischio documentata

**Implementazione Framework Decisionale**:
- Richiedere documentazione di processo decisione sicurezza e tempistiche
- Revisionare verbali riunioni da decisioni sicurezza recenti
- Intervistare stakeholder su processo effettivo vs documentato
- Segnale allarme: Esempi multipli di decisioni richiedenti settimane senza giustificazione emergenza

**Processo Gestione Avvisi**:
- Revisionare statistiche avvisi SIEM/SOC degli ultimi 3 mesi
- Osservare processo triage avvisi durante visita sito
- Intervistare analisti sicurezza su carico lavoro e qualità avvisi
- Segnale allarme: Tassi investigazione sotto 50% o analisti riportanti fatica avvisi cronica

**Qualità Coinvolgimento Esecutivo**:
- Revisionare verbali riunioni esecutive menzionanti argomenti sicurezza
- Intervistare esecutivi su percezione programma sicurezza
- Osservare briefing sicurezza esecutivo se possibile
- Segnale allarme: Modello di discussioni sicurezza rimandate, abbreviate o generanti risposte difensive

**Efficacia Risoluzione Conflitti**:
- Richiedere esempi di conflitti sicurezza-business recenti
- Revisionare registri eccezioni sicurezza e processi approvazione
- Intervistare stakeholder business su esperienza interazione sicurezza
- Segnale allarme: Alto numero di eccezioni permanenti o modello di disabilitazione controlli sicurezza

## METRICHE DI SUCCESSO

**Rapporto Bilanciamento Investimenti Sicurezza**: Misurare allocazione percentuale trimestrale attraverso domini sicurezza (perimetrale/interno/risposta). Obiettivo: Mantenere 35-45% spesa sicurezza interna. Baseline: Distribuzione spesa attuale. Monitorare via rapporti budget sicurezza revisionati da CFO e CISO mensilmente.

**Velocità Decisione Sicurezza**: Monitorare tempo medio da identificazione minaccia a implementazione decisione risposta. Obiettivo: 95% di decisioni completate entro 5 giorni lavorativi. Baseline: Tempistica decisione media attuale. Monitorare via sistema monitoraggio incidenti con reporting esecutivo mensile.

**Efficacia Investigazione Avvisi**: Monitorare percentuale di avvisi sicurezza investigati entro 48 ore e tasso riduzione falso positivo. Obiettivo: 85% tasso investigazione con <20% falsi positivi. Baseline: Statistiche investigazione attuali. Monitorare via dashboard SIEM con revisione team sicurezza settimanale.
