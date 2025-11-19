# INDICATORE CPF 3.1: SFRUTTAMENTO DELLA RECIPROCITÀ

## CONTESTO

Lo sfruttamento della reciprocità sfrutta la pressione psicologica che le persone sentono di "ricambiare i favori" quando qualcuno fornisce aiuto, regali o servizi. Questa risposta automatica bypassa il pensiero di sicurezza e crea una finestra di vulnerabilità in cui i dipendenti concedono accesso, condividono informazioni o bypassano i protocolli perché si sentono obbligati a ricambiare. Gli attaccanti sfruttano sistematicamente questo meccanismo offrendo servizi apparentemente utili, risorse gratuite o assistenza prima di richiedere azioni che compromettono la sicurezza in cambio.

## DOMANDE DI VALUTAZIONE

1. **Politica su Regali e Favori**: Qual è la politica scritta della Sua organizzazione riguardo l'accettazione di regali, pasti o servizi da fornitori, clienti o parti sconosciute? Come viene comunicata e applicata questa politica?

2. **Richieste di Supporto IT**: Con quale frequenza i dipendenti ricevono offerte non richieste di aiuto IT, software gratuito o assistenza tecnica da fonti esterne? Qual è la Sua procedura quando il personale segnala queste offerte? *Ci fornisca un esempio specifico di come questo è stato gestito recentemente.*

3. **Gestione delle Relazioni con i Fornitori**: Descriva una situazione recente in cui un fornitore o una parte esterna ha fornito alla Sua organizzazione servizi, informazioni o risorse gratuite. Quali richieste successive hanno fatto e come sono state gestite?

4. **Processi di Eccezione alla Sicurezza**: Con quale frequenza le politiche di sicurezza vengono bypassate o vengono concesse eccezioni dopo che parti esterne hanno fornito aiuto o favori? Quale processo di approvazione esiste per queste eccezioni? *Ci fornisca un esempio recente specifico.*

5. **Formazione sulla Risposta dei Dipendenti**: Quando è stata l'ultima volta che il Suo personale ha ricevuto formazione sul riconoscimento e sulla risposta ai tentativi di social engineering (ingegneria sociale) quid pro quo? Quali scenari specifici sono stati trattati?

6. **Pratiche Commerciali Reciproche**: Come risponde tipicamente la Sua organizzazione quando clienti, fornitori o partner offrono benefici inaspettati, sconti o "offerte speciali"? Quali passaggi di verifica sono richiesti prima dell'accettazione?

7. **Tracciamento degli Incidenti**: Ha sperimentato incidenti di sicurezza nell'ultimo anno che sono iniziati con qualcuno che offriva aiuto, servizi gratuiti o regali? *Descriva l'esempio più significativo e come è stato scoperto.*

## CRITERI DI PUNTEGGIO

**Verde (0): Bassa Vulnerabilità**
- Politica scritta su regali/favori con meccanismi di applicazione e formazione regolare
- Periodo di riflessione obbligatorio (24-48 ore) tra la ricezione di benefici e la concessione di qualsiasi richiesta
- Tutte le offerte non richieste indirizzate attraverso il team di sicurezza per la valutazione
- Zero eccezioni di sicurezza concesse senza approvazione multi-livello dopo aver ricevuto favori

**Giallo (1): Vulnerabilità Moderata**
- Esiste una politica sui regali ma con applicazione o formazione limitata
- Alcuni processi informali per gestire offerte non richieste ma non applicati in modo coerente
- Eccezioni di sicurezza occasionali concesse dopo favori con approvazione a singolo livello
- La formazione di base sulla consapevolezza copre la reciprocità ma senza pratica di scenari specifici

**Rosso (2): Alta Vulnerabilità**
- Nessuna politica formale su regali/favori o politica esistente ampiamente ignorata
- I dipendenti accettano regolarmente aiuto, regali o servizi non richiesti senza segnalazione
- Eccezioni di sicurezza comunemente concesse immediatamente dopo aver ricevuto favori
- Nessuna formazione sul social engineering basato sulla reciprocità o ultima formazione oltre 2 anni fa

## SCENARI DI RISCHIO

**Supporto IT Quid Pro Quo**: L'attaccante chiama offrendo di risolvere problemi informatici o aggiornare il software di sicurezza, poi richiede credenziali di accesso remoto o chiede al dipendente di installare "strumenti diagnostici" (malware) come ricambio per l'aiuto.

**Campagne di Regali USB**: Chiavette USB brandizzate contenenti malware vengono distribuite come "regali" a conferenze o inviate per posta ai dipendenti. I destinatari si sentono obbligati a usare i dispositivi o almeno a collegarli per "vedere cosa c'è dentro", attivando l'esecuzione del malware.

**Scambio di Intelligence con Fornitori**: Parti esterne forniscono report di settore di valore, intelligence competitiva o aggiornamenti normativi, poi sfruttano la pressione della reciprocità per richiedere dati aziendali interni, liste clienti o accesso ai sistemi come "scambio di informazioni".

**Sfruttamento dell'Assistenza ai Dirigenti**: Gli attaccanti prendono di mira gli assistenti esecutivi offrendo servizi utili (gestione calendario, pianificazione viaggi, coordinamento eventi), poi sfruttano la pressione della reciprocità per ottenere accesso alle comunicazioni dei dirigenti, agli orari o alle strutture sicure.

## CATALOGO DELLE SOLUZIONI

**1. Formazione sul Riconoscimento della Reciprocità**
- Implementare formazione trimestrale basata su scenari specificamente sugli attacchi quid pro quo
- Includere esercizi di role-playing in cui i dipendenti praticano il rifiuto di richieste reciproche
- Fornire risposte predefinite per rinviare educatamente le richieste dopo aver ricevuto favori
- Creare carte di riferimento rapido "radar della reciprocità" per tattiche di manipolazione comuni

**2. Protocollo di Ritardo Obbligatorio**
- Istituire un periodo di riflessione di 48 ore tra la ricezione di qualsiasi beneficio non richiesto e le decisioni relative alla sicurezza
- Richiedere che tutte le offerte esterne di aiuto/regali/servizi siano segnalate al team di sicurezza entro 24 ore
- Implementare un flusso di lavoro di approvazione che impedisca risposte reciproche immediate
- Creare un processo di eccezione che richieda l'approvazione duplice di manager e team di sicurezza

**3. Sistema di Gestione di Regali e Favori**
- Implementare un sistema centralizzato per registrare tutti i regali, favori e offerte non richieste ricevute
- Stabilire soglie monetarie che richiedono revisione automatica della sicurezza (€25+) e rifiuto (€100+)
- Creare protocolli di relazione con i fornitori che richiedono accordi formali prima di accettare qualsiasi beneficio
- Implementare audit trimestrali dei modelli di accettazione di regali per reparto e individuo

**4. Controlli Tecnici per la Prevenzione Quid Pro Quo**
- Bloccare la funzionalità di auto-esecuzione USB su tutti gli endpoint per prevenire malware da USB regalo
- Implementare filtri email per mettere in quarantena messaggi che offrono software, servizi o aiuto sospetto gratuiti
- Implementare regole di rilevamento endpoint per segnalare l'installazione di software dopo contatti esterni
- Creare segmentazione di rete che impedisca a parti esterne "utili" di accedere ai sistemi interni

**5. Canali di Reciprocità Alternativi**
- Stabilire programmi formali di apprezzamento dei fornitori che non compromettano la sicurezza
- Creare processi strutturati per esprimere gratitudine senza concedere accesso o eccezioni
- Sviluppare offerte di valore reciproco che mantengano le relazioni senza rischio per la sicurezza
- Implementare programmi di responsabilità sociale aziendale come sbocchi di reciprocità alternativi

**6. Framework di Escalation e Segnalazione**
- Creare un meccanismo di segnalazione semplice per approcci sospetti basati sulla reciprocità
- Stabilire percorsi di escalation chiari quando i dipendenti si sentono sotto pressione per ricambiare
- Implementare protezione per i dipendenti che segnalano tentativi di manipolazione della reciprocità
- Sviluppare un ciclo di feedback per condividere le lezioni apprese dagli incidenti basati sulla reciprocità

## CHECKLIST DI VERIFICA

**Revisione della Documentazione delle Politiche**
- Richiedere le politiche attuali di accettazione di regali e favori
- Verificare che la politica includa linee guida specifiche sulla reciprocità e soglie
- Verificare la presenza di aggiornamenti della politica negli ultimi 12 mesi
- Confermare i registri di distribuzione della politica e le firme di riconoscimento

**Osservazione dei Processi**
- Osservare il personale della reception durante le interazioni con fornitori/visitatori per un giorno
- Osservare la gestione dei ticket di supporto IT quando viene offerto aiuto esterno
- Rivedere le recenti richieste di eccezione alla sicurezza per modelli di reciprocità
- Verificare i sistemi email per tentativi bloccati di quid pro quo

**Validazione della Formazione**
- Rivedere il curriculum della formazione per contenuti specifici sulla reciprocità
- Verificare i registri di presenza per i tassi di completamento della formazione sulla reciprocità
- Condurre interviste spot con 5-10 dipendenti sul riconoscimento della reciprocità
- Testare le risposte dei dipendenti a scenari simulati di quid pro quo

**Revisione della Configurazione del Sistema**
- Verificare che l'auto-esecuzione USB sia disabilitata su tutti gli endpoint
- Verificare le regole di filtro email per modelli di attacco quid pro quo
- Rivedere le configurazioni di rilevamento endpoint per installazioni software sospette
- Verificare i log di accesso alla rete per tentativi di connessione di "helper" esterni

## METRICHE DI SUCCESSO

**1. Tasso di Riduzione degli Incidenti di Reciprocità**
- Baseline: Numero di incidenti di sicurezza preceduti da regali/favori negli ultimi 12 mesi
- Obiettivo: Riduzione del 75% degli incidenti di sicurezza basati sulla reciprocità entro 6 mesi
- Misurazione: Analisi mensile degli incidenti con identificazione dei modelli di reciprocità

**2. Miglioramento della Conformità alle Politiche**
- Baseline: Tasso attuale di violazione della politica sui regali e accettazione di favori non segnalati
- Obiettivo: 90% di conformità ai requisiti di segnalazione dei regali entro 90 giorni
- Misurazione: Audit di conformità trimestrali e sondaggi anonimi di auto-segnalazione

**3. Velocità di Riconoscimento da Parte dei Dipendenti**
- Baseline: Tempo medio per identificare la manipolazione basata sulla reciprocità in scenari simulati
- Obiettivo: Miglioramento del 50% nella velocità di riconoscimento entro 3 mesi dalla formazione
- Misurazione: Simulazioni di phishing mensili che incorporano elementi di quid pro quo
