# INDICATORE 1.10: Escalation Autorità Crisi

## CONTESTO

L'Escalation Autorità Crisi si verifica quando i dipendenti concedono automaticamente privilegi elevati o bypassano protocolli di sicurezza durante situazioni di alto stress basandosi solamente su rivendicazioni di autorità, senza adeguata verifica. Durante le crisi, le persone cercano decisioni rapide da figure di autorità e saltano i normali controlli di sicurezza a causa della pressione temporale e dello stress. Questo crea un'opportunità primaria per gli attaccanti di impersonare dirigenti o leader IT durante emergenze per ottenere accesso non autorizzato a sistemi e dati sensibili.

## VALUTAZIONE

**1. Procedure Accesso Emergenza**
Qual è la Sua procedura standard quando qualcuno affermante di essere leadership senior richiede accesso immediato al sistema o bypass di sicurezza durante un'emergenza? Ci racconti il Suo esempio specifico degli ultimi 12 mesi.

**2. Verifica Autorità Durante le Crisi**
Con quale frequenza i Suoi dipendenti verificano l'identità delle persone richiedenti assistenza emergenza o cambiamenti di sistema durante situazioni di alto stress (interruzioni sistema, incidenti sicurezza, scadenze conformità)? Quali step di verifica sono richiesti?

**3. Canali Comunicazione Crisi**
Quali metodi di comunicazione sicuri usa la Sua organizzazione durante le emergenze, e come fanno i dipendenti a confermare che stanno ricevendo comunicazioni di crisi legittime da personale autorizzato?

**4. Controlli Accesso Rompi Vetro**
Con quale frequenza vengono usate le Sue procedure "accesso emergenza" o "rompi vetro", e quale processo di approvazione è richiesto prima di concedere questi privilegi elevati durante situazioni di crisi?

**5. Revisione Risposta Crisi Recente**
Ci faccia un esempio recente di come la Sua organizzazione ha gestito una situazione di crisi (interruzione sistema, incidente sicurezza, richiesta conformità urgente). Quali procedure di sicurezza sono state seguite o bypassate durante la risposta?

**6. Autorità Crisi Cross-Dipartimentale**
Cosa succede quando qualcuno dall'esterno della normale catena di comando di un dipendente (dipartimento diverso, consulente esterno, vendor) richiede accesso urgente o informazioni durante un'emergenza? Qual è la Sua policy di verifica?

**7. Formazione Decisione Crisi Dipendenti**
Con quale frequenza forma i dipendenti sulla verifica dell'autorità e sul mantenimento dei protocolli di sicurezza durante situazioni di emergenza ad alto stress? Ci racconti del Suo esercizio simulazione crisi più recente.

## PUNTEGGIO

**Verde (0): Bassa Vulnerabilità**
- Procedure emergenza documentate richiedono verifica multi-persona per tutto l'accesso elevato
- Formazione simulazione crisi regolare include componenti verifica autorità
- Canali comunicazione sicuri con autenticazione per comunicazioni crisi
- Accesso rompi vetro usato meno di trimestralmente con documentazione completa
- Policy chiara richiedente verifica indipendentemente dal livello di autorità rivendicato

**Giallo (1): Vulnerabilità Moderata**
- Le procedure emergenza esistono ma permettono autorizzazione singola persona in alcune situazioni
- La formazione crisi avviene annualmente ma focus limitato sulla verifica autorità
- Alcuni canali comunicazione sicuri ma lacune nella sicurezza comunicazione crisi
- Accesso rompi vetro usato mensilmente con processi approvazione base
- Requisiti verifica inconsistenti attraverso dipartimenti o situazioni

**Rosso (2): Alta Vulnerabilità**
- Le procedure emergenza bypassano abitualmente i normali controlli di sicurezza senza verifica
- Nessuna formazione crisi regolare o formazione verifica autorità
- Le comunicazioni crisi principalmente attraverso canali non sicuri (email, telefonate)
- Accesso rompi vetro usato settimanalmente o più con supervisione minima
- Cultura del "non questionare l'autorità durante le emergenze"

## SCENARI DI RISCHIO

**Frode CEO Durante Interruzioni Sistema**: Gli attaccanti monitorano le interruzioni sistema e inviano email urgenti da account dirigenziali spoofed richiedendo bonifici immediati o accesso al sistema, sfruttando il caos quando le normali procedure di verifica sono sospese.

**Supporto IT Emergenza Falso**: Durante incidenti di sicurezza legittimi, gli attaccanti chiamano i dipendenti affermando di essere contractor IT emergenza assunti per risolvere la crisi, richiedendo credenziali accesso remoto o informazioni di sistema che usano per espandere il loro attacco.

**Impersonazione Autorità Regolamentare**: Gli attaccanti si spacciano per regolatori richiedenti azioni di conformità immediate durante crisi regolamentari fabbricate o reali, sfruttando la paura di sanzioni per ottenere accesso a dati conformità sensibili e sistemi finanziari.

**Amplificazione Minaccia Insider**: Durante crisi organizzative, gli insider malintenzionati sfruttano ambienti di sicurezza rilassati per rivendicare falsa autorità emergenza o espandere la loro autorità legittima oltre i confini normali, accedendo a sistemi e dati tipicamente ristretti.

## CATALOGO SOLUZIONI

**Autorizzazione Multi-Persona per Accesso Emergenza**: Implementare requisiti "integrità due persone" per tutte le concessioni di accesso emergenza, dove qualsiasi bypass di sicurezza legato a crisi richiede approvazione da due individui autorizzati separati con verifica indipendente dell'identità del richiedente.

**Sistema Autenticazione Comunicazione Crisi**: Distribuire piattaforme comunicazione sicure con autenticazione multi-fattore per comunicazioni crisi, includendo codici verifica pre-condivisi o frasi che le figure di autorità legittime usano per confermare la loro identità durante le emergenze.

**Alberi Decisione Verifica Autorità**: Creare flowchart semplici affissi alle postazioni di lavoro e integrati nei sistemi che guidano i dipendenti attraverso step di verifica identità durante situazioni di alto stress, includendo numeri di contatto specifici e domande di verifica per diversi livelli di autorità.

**Simulazione Autorità Crisi Regolare**: Condurre esercizi tabletop trimestrali che includono scenari di autorità falsi mescolati con formazione risposta crisi legittima, insegnando ai dipendenti a mantenere protocolli di verifica anche sotto pressione misurando i tassi di conformità.

**Monitoraggio Accesso Rompi Vetro**: Implementare monitoraggio automatizzato dell'uso di accesso emergenza con alert in tempo reale ai team di sicurezza e revisioni post-incidente obbligatorie entro 24 ore, includendo verifica che l'accesso fosse legittimamente autorizzato e appropriatamente scoped.

**Pre-Autenticazione Team Risposta Crisi**: Stabilire team risposta crisi pre-verificati con carte identificazione fotografiche, autenticazione biometrica o altri metodi di verifica che permettono identificazione rapida ma sicura durante emergenze reali, riducendo la pressione a saltare step di verifica.

## CHECKLIST VERIFICA

**Documentazione Procedure Emergenza**:
- Richiedere copie delle procedure di accesso emergenza documentate
- Verificare che esistano requisiti autorizzazione multi-persona e siano applicati
- Controllare step specifici di verifica autorità nei piani risposta crisi
- Rivedere log accesso rompi vetro per frequenza e documentazione approvazione

**Sicurezza Comunicazione Crisi**:
- Osservare piattaforme comunicazione crisi e meccanismi autenticazione
- Verificare che i canali sicuri siano effettivamente usati durante esercitazioni o incidenti recenti
- Controllare codici autenticazione pre-condivisi o procedure di verifica
- Testare conoscenza dipendenti dei metodi comunicazione crisi legittimi

**Evidenza Programma Formazione**:
- Rivedere documentazione esercizi simulazione crisi degli ultimi 12 mesi
- Verificare che componenti verifica autorità siano inclusi nei materiali formazione
- Controllare record presenze e valutazioni competenza per formazione crisi
- Osservare un'esercitazione crisi se possibile per valutare conformità mondo reale

**Implementazione Controllo Accessi**:
- Rivedere log accesso rompi vetro e workflow approvazione
- Verificare che i sistemi monitoraggio e allerta automatizzati siano operativi
- Controllare documentazione revisione post-incidente per concessioni accesso emergenza
- Testare che l'accesso emergenza richieda effettivamente approvazioni documentate

**Valutazione Consistenza Policy**:
- Intervistare dipendenti di dipartimenti diversi sulle procedure crisi
- Verificare comprensione consistente dei requisiti verifica autorità
- Controllare variazioni specifiche-dipartimento nelle procedure risposta crisi
- Valutare se i requisiti verifica sono culturalmente supportati o resistiti

## METRICHE DI SUCCESSO

**Tasso Conformità Accesso Emergenza**: Misurare percentuale richieste accesso emergenza che seguono adeguate procedure di verifica, mirando a conformità 100% con requisiti autorizzazione multi-persona e mantenendo log dettagliati di tutte le concessioni accesso emergenza.

**Prestazioni Simulazione Crisi**: Tracciare conformità dipendenti con protocolli verifica autorità durante esercizi crisi trimestrali, mirando a tasso verifica adeguata 95% anche sotto condizioni alto stress simulate con miglioramento continuo nel tempo.

**Frequenza Accesso Rompi Vetro**: Monitorare uso mensile delle procedure di accesso emergenza, mirando a riduzione nella frequenza (indicando migliore provisioning accesso normale) mantenendo capacità risposta incidenti rapida quando legittimamente necessario.
