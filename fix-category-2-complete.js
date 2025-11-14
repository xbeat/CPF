#!/usr/bin/env node

const fs = require('fs');

// Get 1.4 as structural template
function get14Template() {
  return JSON.parse(fs.readFileSync('auditor field kit/interactive/it-IT/1.x-authority/indicator_1.4.json', 'utf8'));
}

// Context-specific content for each 2.x indicator (based on taxonomy)
const INDICATOR_CONTEXTS = {
  '2.1': {
    mainTopic: 'bypass per urgenza',
    conversationQuestions: [
      {
        text: "Mi racconti dell'ultima volta che qualcuno ha bypassato i controlli di sicurezza perché una richiesta era etichettata come 'urgente'. Cosa è successo esattamente?",
        scoring: {
          green: "Esempio specifico dove la verifica è avvenuta nonostante l'urgenza, con documentazione del processo",
          yellow: "Esempio dove la verifica è stata parziale o accelerata a causa dell'urgenza",
          red: "Nessun esempio ricordato, o esempi dove l'urgenza ha completamente bypassato i controlli"
        },
        followups: [
          { text: "Quanto tempo è trascorso dalla richiesta urgente all'approvazione?", type: "timing_data" },
          { text: "La verifica è stata diversa rispetto a una richiesta normale?", type: "process_comparison" }
        ]
      },
      {
        text: "Quali procedure standard esistono quando qualcuno dice che una richiesta di sicurezza è 'urgente' o 'critica'?",
        scoring: {
          green: "Procedure documentate che richiedono scrutinio maggiore per richieste urgenti, non minore",
          yellow: "Procedure esistono ma vengono spesso abbreviate sotto pressione temporale",
          red: "Nessuna procedura specifica, l'urgenza giustifica il bypass dei controlli normali"
        },
        followups: [
          { text: "Può mostrarmi la documentazione di queste procedure?", type: "documentation" },
          { text: "Come distinguete tra urgenze legittime e tattiche di pressione?", type: "verification_method" }
        ]
      }
    ],
    verificationQuestions: [
      {
        text: "Come verifica l'organizzazione l'autenticità di una richiesta quando viene presentata come urgente?",
        scoring: {
          green: "Protocollo di verifica obbligatorio indipendentemente dall'urgenza dichiarata",
          yellow: "Verifica raccomandata ma spesso saltata quando c'è pressione temporale",
          red: "L'urgenza viene usata come giustificazione per saltare la verifica"
        },
        followups: [
          { text: "Esistono processi di emergenza verificati per situazioni realmente critiche?", type: "emergency_procedures" }
        ]
      }
    ],
    culturalQuestions: [
      {
        text: "Cosa succede quando un dipendente rallenta una richiesta urgente per seguire i protocolli di sicurezza?",
        scoring: {
          green: "Il dipendente viene supportato e riconosciuto per seguire le procedure corrette",
          yellow: "Risposta mista a seconda di chi ha fatto la richiesta urgente",
          red: "Il dipendente viene criticato per essere 'lento' o 'non collaborativo'"
        },
        followups: [
          { text: "Ha esempi di dipendenti premiati per resistere a pressioni temporali inappropriate?", type: "positive_reinforcement" }
        ]
      },
      {
        text: "Come viene formata la sua organizzazione a riconoscere tattiche di bypass per urgenza?",
        scoring: {
          green: "Formazione regolare con scenari specifici di tattiche urgenza e come contrastarle",
          yellow: "Formazione generica sulla sicurezza che menziona l'urgenza come rischio",
          red: "Nessuna formazione specifica, la cultura enfatizza la velocità di risposta"
        },
        followups: [
          { text: "I dipendenti praticano scenari dove devono resistere a pressioni temporali?", type: "training_methodology" }
        ]
      }
    ],
    redFlags: [
      { label: "\"Quando qualcosa è urgente, non c'è tempo per la verifica...\"", severity: "critical", score: 0.18 },
      { label: "\"Dobbiamo muoverci velocemente, la sicurezza rallenta il business...\"", severity: "critical", score: 0.16 },
      { label: "\"Le richieste urgenti hanno un processo accelerato che salta alcuni controlli...\"", severity: "high", score: 0.14 },
      { label: "\"Non abbiamo mai avuto problemi con richieste urgenti, quindi non ci preoccupiamo...\"", severity: "medium", score: 0.10 },
      { label: "Evidenza di incidenti precedenti causati da bypass per urgenza non documentati o non analizzati", severity: "high", score: 0.12 },
      { label: "\"La formazione anti-phishing non copre specificamente le tattiche di urgenza...\"", severity: "medium", score: 0.08 },
      { label: "Mancanza di metriche su quante richieste urgenti bypassano i controlli normali", severity: "medium", score: 0.08 },
      { label: "\"Nei periodi di chiusura trimestrale/annuale, alcuni controlli vengono rilassati...\"", severity: "high", score: 0.14 }
    ]
  },
  '2.2': {
    mainTopic: 'degrado cognitivo sotto pressione temporale',
    conversationQuestions: [
      {
        text: "Mi descriva una situazione recente dove decisioni di sicurezza sono state prese sotto forte pressione di tempo. Come è andata?",
        scoring: {
          green: "Esempio dove esistevano procedure specifiche per decisioni sotto pressione, con checklist semplificate ma complete",
          yellow: "Esempio dove la pressione temporale ha accelerato ma non eliminato i controlli di sicurezza",
          red: "Esempio dove la pressione ha portato a decisioni affrettate senza adeguata valutazione"
        },
        followups: [
          { text: "Quali salvaguardie esistono per decisioni prese in fretta?", type: "safety_mechanisms" },
          { text: "Come vengono riviste le decisioni prese sotto pressione?", type: "review_process" }
        ]
      },
      {
        text: "Che procedure esistono quando il team di sicurezza deve prendere decisioni critiche con poco tempo disponibile?",
        scoring: {
          green: "Procedure semplificate ma robuste specificamente progettate per situazioni ad alta pressione",
          yellow: "Procedure esistenti ma non ottimizzate per situazioni di pressione temporale",
          red: "Nessuna procedura specifica, si fa 'del proprio meglio' sotto pressione"
        },
        followups: [
          { text: "Queste procedure sono state testate in simulazioni?", type: "procedure_testing" },
          { text: "Esiste un processo di escalation rapida per decisioni critiche?", type: "escalation_mechanism" }
        ]
      }
    ],
    verificationQuestions: [
      {
        text: "Come monitora l'organizzazione la qualità delle decisioni di sicurezza prese sotto pressione temporale?",
        scoring: {
          green: "Sistema di review sistematico delle decisioni prese sotto pressione con metriche di qualità",
          yellow: "Review informale o occasionale delle decisioni sotto pressione",
          red: "Nessun monitoraggio specifico della qualità decisionale sotto pressione"
        },
        followups: [
          { text: "Quali metriche usate per valutare la qualità decisionale?", type: "quality_metrics" }
        ]
      }
    ],
    culturalQuestions: [
      {
        text: "Cosa succede quando qualcuno del team di sicurezza chiede più tempo per valutare adeguatamente una richiesta urgente?",
        scoring: {
          green: "La richiesta di tempo addizionale è supportata e vista come segno di diligenza professionale",
          yellow: "Risposta mista, dipende dalla situazione e da chi fa pressione",
          red: "Pressione negativa per 'muoversi più velocemente' o 'non bloccare il business'"
        },
        followups: [
          { text: "Esistono esempi recenti di decisioni migliorate grazie al tempo extra richiesto?", type: "positive_examples" }
        ]
      },
      {
        text: "Come viene formato il personale a mantenere standard di sicurezza anche sotto pressione temporale estrema?",
        scoring: {
          green: "Formazione regolare con simulazioni realistiche di scenari ad alta pressione",
          yellow: "Formazione teorica che menziona la pressione temporale come fattore di rischio",
          red: "Nessuna formazione specifica su come mantenere standard sotto pressione"
        },
        followups: [
          { text: "Le simulazioni includono conseguenze reali per decisioni affrettate?", type: "training_realism" }
        ]
      }
    ],
    redFlags: [
      { label: "\"Sotto scadenza, non c'è tempo per analisi approfondite...\"", severity: "critical", score: 0.18 },
      { label: "\"Le decisioni di sicurezza rallentano troppo i progetti...\"", severity: "high", score: 0.15 },
      { label: "Evidenza di decisioni di sicurezza di bassa qualità correlate a periodi di alta pressione", severity: "high", score: 0.14 },
      { label: "Mancanza di procedure semplificate ma robuste per decisioni rapide", severity: "high", score: 0.13 },
      { label: "Nessun sistema di review post-decisione per valutazioni fatte sotto pressione", severity: "medium", score: 0.12 },
      { label: "\"Il team di sicurezza deve adattarsi al ritmo del business...\"", severity: "medium", score: 0.10 },
      { label: "Assenza di formazione su decision-making sotto pressione temporale", severity: "medium", score: 0.09 },
      { label: "Cultura che penalizza chi chiede tempo addizionale per valutazioni", severity: "high", score: 0.14 }
    ]
  },
  '2.3': {
    mainTopic: 'accettazione rischio guidata da scadenze',
    conversationQuestions: [
      {
        text: "Mi racconti di una volta in cui una scadenza di progetto ha influenzato una decisione di sicurezza. Cosa è successo?",
        scoring: {
          green: "Esempio dove la scadenza non ha compromesso i controlli, eventualmente posticipando il rilascio",
          yellow: "Esempio dove alcuni controlli sono stati ridotti ma documentati come rischio accettato",
          red: "Esempio dove la scadenza ha portato a saltare controlli senza adeguata valutazione del rischio"
        },
        followups: [
          { text: "Chi ha l'autorità di accettare rischi di sicurezza per rispettare scadenze?", type: "authority_structure" },
          { text: "Come vengono documentate e tracciate queste decisioni?", type: "documentation_process" }
        ]
      },
      {
        text: "Quali processi esistono per gestire conflitti tra scadenze di business e requisiti di sicurezza?",
        scoring: {
          green: "Processo formale di risk acceptance con escalation a livelli appropriati e documentazione completa",
          yellow: "Processo informale con documentazione parziale delle decisioni",
          red: "Nessun processo formale, le scadenze tendono a prevalere sulle preoccupazioni di sicurezza"
        },
        followups: [
          { text: "Può mostrarmi esempi recenti di questo processo in azione?", type: "process_evidence" },
          { text: "Con che frequenza la sicurezza 'vince' contro le scadenze?", type: "priority_data" }
        ]
      }
    ],
    verificationQuestions: [
      {
        text: "Come viene verificato che le eccezioni di sicurezza concesse per scadenze siano effettivamente temporanee?",
        scoring: {
          green: "Sistema automatico di tracking con scadenze delle eccezioni e alert per remediation",
          yellow: "Tracking manuale delle eccezioni con follow-up occasionale",
          red: "Eccezioni 'temporanee' diventano spesso permanenti senza follow-up"
        },
        followups: [
          { text: "Quante eccezioni 'temporanee' sono ancora aperte dopo 6 mesi?", type: "exception_metrics" }
        ]
      }
    ],
    culturalQuestions: [
      {
        text: "Come reagisce il management quando il team di sicurezza respinge una richiesta di eccezione per una scadenza importante?",
        scoring: {
          green: "Il team di sicurezza è supportato, le scadenze vengono riviste se necessario",
          yellow: "Risposta dipende dall'importanza percepita del progetto",
          red: "Pressione significativa sul team di sicurezza per 'essere più flessibili'"
        },
        followups: [
          { text: "Esistono casi recenti dove progetti sono stati ritardati per motivi di sicurezza?", type: "precedent_cases" }
        ]
      },
      {
        text: "Come viene misurato e incentivato il team di sicurezza rispetto alle scadenze di business?",
        scoring: {
          green: "Metriche bilanciano sicurezza e velocità, con priorità chiara sulla sicurezza",
          yellow: "Metriche miste che possono creare pressione per compromessi",
          red: "Team di sicurezza valutato principalmente su 'non bloccare il business'"
        },
        followups: [
          { text: "Quali KPI guidano le decisioni del team di sicurezza?", type: "kpi_structure" }
        ]
      }
    ],
    redFlags: [
      { label: "\"Rilasceremo ora e patcheremo dopo la scadenza...\"", severity: "critical", score: 0.18 },
      { label: "\"Questa è solo un'eccezione temporanea per questa scadenza...\"", severity: "high", score: 0.15 },
      { label: "Evidenza di eccezioni 'temporanee' mai remediate", severity: "high", score: 0.16 },
      { label: "Nessun processo formale di risk acceptance per eccezioni legate a scadenze", severity: "high", score: 0.14 },
      { label: "Mancanza di authority chiara per accettare rischi di sicurezza", severity: "medium", score: 0.11 },
      { label: "\"Il team di sicurezza deve capire le priorità di business...\"", severity: "medium", score: 0.10 },
      { label: "Pattern di patch e update ritardati durante periodi di scadenze", severity: "high", score: 0.13 },
      { label: "Cultura dove sollevare preoccupazioni di sicurezza è visto come 'bloccare il progresso'", severity: "critical", score: 0.17 }
    ]
  },
  '2.4': {
    mainTopic: 'pregiudizio presente negli investimenti di sicurezza',
    conversationQuestions: [
      {
        text: "Come vengono prese le decisioni di allocazione del budget di sicurezza tra iniziative preventive e necessità operative immediate?",
        scoring: {
          green: "Processo strutturato con allocazione minima garantita per prevenzione indipendentemente da pressioni immediate",
          yellow: "Processo flessibile dove la prevenzione compete con necessità operative",
          red: "Budget di sicurezza dominato da spese reattive e necessità immediate"
        },
        followups: [
          { text: "Quale percentuale del budget di sicurezza va a iniziative preventive vs reattive?", type: "budget_breakdown" },
          { text: "Come è cambiata questa allocazione negli ultimi 3 anni?", type: "historical_trend" }
        ]
      },
      {
        text: "Mi descriva l'ultima volta che è stato necessario scegliere tra un'iniziativa di sicurezza preventiva e una necessità operativa immediata.",
        scoring: {
          green: "Esempio dove sono state valutate conseguenze a lungo termine e la prevenzione è stata prioritizzata",
          yellow: "Esempio dove la necessità immediata ha vinto ma con piano per tornare alla prevenzione",
          red: "Esempio dove la necessità immediata ha automaticamente prevalso senza considerare impatti futuri"
        },
        followups: [
          { text: "Come vengono quantificati i benefici a lungo termine della prevenzione?", type: "valuation_method" },
          { text: "Chi ha l'autorità di approvare investimenti preventivi significativi?", type: "approval_authority" }
        ]
      }
    ],
    verificationQuestions: [
      {
        text: "Come monitora l'organizzazione il rapporto tra spesa preventiva e reattiva nel tempo?",
        scoring: {
          green: "Tracking sistematico con target definiti e review regolari delle tendenze",
          yellow: "Tracking di base senza target o analisi delle tendenze",
          red: "Nessun monitoraggio sistematico della composizione della spesa di sicurezza"
        },
        followups: [
          { text: "Esistono alert quando la spesa reattiva supera soglie predefinite?", type: "monitoring_mechanism" }
        ]
      }
    ],
    culturalQuestions: [
      {
        text: "Come viene valutato il team di sicurezza rispetto a iniziative preventive che evitano incidenti futuri vs risoluzione di problemi immediati?",
        scoring: {
          green: "Sistema di valutazione che riconosce e premia esplicitamente prevenzione efficace",
          yellow: "Riconoscimento misto con enfasi maggiore su risposte visibili a incidenti",
          red: "Team valutato principalmente su 'spegnere incendi' e risolvere crisi immediate"
        },
        followups: [
          { text: "Come viene misurato il successo delle iniziative preventive?", type: "success_metrics" }
        ]
      },
      {
        text: "Che formazione riceve il leadership team su present bias e suoi impatti sulla sicurezza a lungo termine?",
        scoring: {
          green: "Formazione strutturata su bias decisionali con focus su investimenti di sicurezza a lungo termine",
          yellow: "Formazione generica su sicurezza che potrebbe menzionare bias temporali",
          red: "Nessuna formazione specifica su bias decisionali negli investimenti di sicurezza"
        },
        followups: [
          { text: "Il C-level è formato su come valutare ROI di sicurezza preventiva?", type: "executive_training" }
        ]
      }
    ],
    redFlags: [
      { label: "Spesa reattiva/emergenza supera 40% del budget di sicurezza totale", severity: "critical", score: 0.18 },
      { label: "\"Non possiamo permetterci iniziative preventive ora, abbiamo troppe urgenze...\"", severity: "high", score: 0.15 },
      { label: "Iniziative di sicurezza preventiva cronicamente rimandate o defunded", severity: "high", score: 0.14 },
      { label: "Nessun tracking del rapporto spesa preventiva/reattiva", severity: "medium", score: 0.11 },
      { label: "\"Investiremo in prevenzione dopo aver risolto i problemi attuali...\"", severity: "high", score: 0.13 },
      { label: "Team di sicurezza valutato principalmente su risposta a incidenti", severity: "medium", score: 0.10 },
      { label: "Evidenza di incidenti costosi che erano prevenibili con investimenti precedenti", severity: "high", score: 0.14 },
      { label: "Nessuna formazione del leadership su bias negli investimenti di sicurezza", severity: "medium", score: 0.09 }
    ]
  },
  '2.5': {
    mainTopic: 'sconto iperbolico delle minacce future',
    conversationQuestions: [
      {
        text: "Come valuta l'organizzazione minacce che potrebbero materializzarsi tra 6-12 mesi rispetto a vulnerabilità immediatamente sfruttabili?",
        scoring: {
          green: "Processo di risk assessment che valuta appropriatamente minacce future con modelli probabilistici",
          yellow: "Valutazione presente ma con tendenza a sottostimare rischi non immediati",
          red: "Focus quasi esclusivo su minacce immediate con scarsa attenzione a trend futuri"
        },
        followups: [
          { text: "Come vengono priorizz ate minacce emergenti vs vulnerabilità note?", type: "prioritization_criteria" },
          { text: "Quale framework usate per valutare probabilità e impatto nel tempo?", type: "assessment_framework" }
        ]
      },
      {
        text: "Mi descriva una minaccia o vulnerabilità che il team aveva identificato in anticipo ma che non è stata addressata fino a diventare critica.",
        scoring: {
          green: "Non ci sono esempi significativi perché le minacce vengono addressate preventivamente",
          yellow: "Alcuni esempi esistono ma hanno portato a miglioramenti nei processi",
          red: "Esempi multipli di minacce ignorate fino a diventare crisi immediate"
        },
        followups: [
          { text: "Cosa ha impedito l'azione preventiva su quella minaccia?", type: "barrier_analysis" },
          { text: "Come è cambiato il processo dopo quell'incidente?", type: "lessons_learned" }
        ]
      }
    ],
    verificationQuestions: [
      {
        text: "Che sistema esiste per monitorare e agire su minacce emergenti prima che diventino critiche?",
        scoring: {
          green: "Sistema proattivo di threat intelligence con processi di remediation basati su trend futuri",
          yellow: "Monitoring presente ma con azioni principalmente reattive",
          red: "Nessun sistema sistematico per threat intelligence e prevenzione proattiva"
        },
        followups: [
          { text: "Con che frequenza vengono rivisti e aggiornati i modelli di minaccia?", type: "update_frequency" }
        ]
      }
    ],
    culturalQuestions: [
      {
        text: "Come viene supportato chi solleva preoccupazioni su minacce future che non sono ancora materializzate?",
        scoring: {
          green: "Cultura che valorizza proactive threat identification con risorse allocate per investigazione",
          yellow: "Riconoscimento verbale ma risorse limitate per investigare minacce non immediate",
          red: "Scetticismo verso 'scenari ipotetici' e focus su 'problemi reali e attuali'"
        },
        followups: [
          { text: "Esistono esempi di azioni preventive premiate anche senza incidente visibile?", type: "positive_incentives" }
        ]
      },
      {
        text: "Che formazione viene fornita su bias cognitivi che portano a sottostimare rischi futuri?",
        scoring: {
          green: "Formazione strutturata su hyperbolic discounting e altri bias temporali nella security",
          yellow: "Menzione generica di bias cognitivi nella formazione di sicurezza",
          red: "Nessuna formazione specifica su bias temporali e loro impatto sulle decisioni di sicurezza"
        },
        followups: [
          { text: "Il team usa tecniche di debiasing nelle valutazioni di rischio?", type: "debiasing_techniques" }
        ]
      }
    ],
    redFlags: [
      { label: "\"Quella minaccia è ancora lontana, ci penseremo quando diventa reale...\"", severity: "critical", score: 0.18 },
      { label: "Pattern di minacce ignorate fino a diventare crisi immediate", severity: "high", score: 0.16 },
      { label: "\"Non possiamo allocare risorse per minacce ipotetiche...\"", severity: "high", score: 0.14 },
      { label: "Nessun sistema di threat intelligence per minacce emergenti", severity: "high", score: 0.13 },
      { label: "Evidenza di remediation reattiva molto più costosa di prevenzione ignorata", severity: "high", score: 0.15 },
      { label: "\"Le valutazioni di rischio considerano solo minacce note e immediate...\"", severity: "medium", score: 0.11 },
      { label: "Mancanza di formazione su bias cognitivi temporali", severity: "medium", score: 0.09 },
      { label: "Cultura che deride preoccupazioni per 'minacce future ipotetiche'", severity: "high", score: 0.14 }
    ]
  },
  '2.6': {
    mainTopic: 'modelli di esaurimento temporale',
    conversationQuestions: [
      {
        text: "Quanto frequentemente il personale di sicurezza lavora turni di 10+ ore durante incident response o progetti critici?",
        scoring: {
          green: "Raramente, con policy chiare su limiti orari e rest periods obbligatori",
          yellow: "Occasionalmente durante emergenze vere, con recupero pianificato",
          red: "Frequentemente, visto come 'parte del lavoro' senza limiti formali o recupero"
        },
        followups: [
          { text: "Esistono policy scritte sui limiti di ore lavorative durante incidenti?", type: "policy_documentation" },
          { text: "Come viene tracciato e monitorato il tempo di lavoro durante emergenze?", type: "tracking_mechanism" }
        ]
      },
      {
        text: "Mi racconti di una decisione di sicurezza importante presa durante o dopo un periodo di lavoro intenso. Come è andata?",
        scoring: {
          green: "Nessun esempio significativo perché decisioni critiche vengono differite se il team è affaticato",
          yellow: "Esempio dove la fatica era riconosciuta e controlli extra erano in place",
          red: "Esempi di decisioni problematiche correlate con fatica del team"
        },
        followups: [
          { text: "Esistono procedure per decision-making quando il team è affaticato?", type: "fatigue_procedures" },
          { text: "Come viene valutata la qualità delle decisioni prese sotto stress prolungato?", type: "quality_assessment" }
        ]
      }
    ],
    verificationQuestions: [
      {
        text: "Che sistema esiste per monitorare e prevenire l'esaurimento del team di sicurezza?",
        scoring: {
          green: "Monitoraggio proattivo con limiti enforced e rotazioni obbligatorie",
          yellow: "Monitoring informale con interventi occasionali",
          red: "Nessun sistema formale, dipende da individui che 'si fanno avanti'"
        },
        followups: [
          { text: "Quali metriche usate per rilevare burnout prima che diventi critico?", type: "burnout_metrics" }
        ]
      }
    ],
    culturalQuestions: [
      {
        text: "Cosa succede quando qualcuno del team di sicurezza dice di essere troppo stanco per continuare durante un incidente?",
        scoring: {
          green: "Supporto immediato con sostituzione pianificata, visto come responsabilità professionale",
          yellow: "Supporto verbale ma pressione implicita o esplicita per continuare",
          red: "Visto come 'non essere un team player' o mancanza di commitment"
        },
        followups: [
          { text: "Ha esempi di persone che hanno preso pause durante incidenti senza conseguenze negative?", type: "positive_examples" }
        ]
      },
      {
        text: "Come viene formato il team su impatti della fatica sulla qualità decisionale in security?",
        scoring: {
          green: "Formazione strutturata con scenari che dimostrano errori legati a fatica",
          yellow: "Menzione generica dell'importanza del riposo",
          red: "Nessuna formazione specifica, cultura enfatizza 'resilienza' e 'commitment'"
        },
        followups: [
          { text: "Il leadership team è formato su gestione sostenibile degli incident?", type: "leadership_training" }
        ]
      }
    ],
    redFlags: [
      { label: "Turni regolari di 10+ ore senza rest period adeguati", severity: "critical", score: 0.18 },
      { label: "\"Durante gli incidenti, lavoriamo finché il problema è risolto...\"", severity: "high", score: 0.15 },
      { label: "Nessuna policy su limiti orari massimi durante emergenze", severity: "high", score: 0.14 },
      { label: "Evidenza di errori di sicurezza correlati con periodi di lavoro intenso", severity: "critical", score: 0.17 },
      { label: "Mancanza di rotazioni o backup durante incident prolungati", severity: "high", score: 0.13 },
      { label: "Cultura che valorizza 'heroic efforts' e turni estremi", severity: "medium", score: 0.11 },
      { label: "\"Il team di sicurezza deve essere sempre disponibile...\"", severity: "medium", score: 0.10 },
      { label: "Nessun monitoraggio di burnout o wellbeing del team di sicurezza", severity: "medium", score: 0.09 }
    ]
  },
  '2.7': {
    mainTopic: 'finestre di vulnerabilità orarie',
    conversationQuestions: [
      {
        text: "Come è composto il team di sicurezza durante notti e weekend? Chi ha autorità decisionale?",
        scoring: {
          green: "Copertura 24/7 con personale senior in rotazione e autorità decisionale chiara",
          yellow: "Copertura notturna ridotta con escalation disponibile ma non immediata",
          red: "Copertura minima o nulla fuori orario, con solo reperibilità di bassa priorità"
        },
        followups: [
          { text: "Che tipo di decisioni richiede escalation durante la notte?", type: "escalation_criteria" },
          { text: "Qual è il tempo medio di risposta per incident off-hours vs business hours?", type: "response_metrics" }
        ]
      },
      {
        text: "Mi racconti di un incidente di sicurezza che è iniziato o è stato scoperto durante ore notturne o weekend.",
        scoring: {
          green: "Esempio di risposta efficace con capacità comparabili a business hours",
          yellow: "Esempio di risposta più lenta ma comunque adeguata",
          red: "Esempio di risposta significativamente degradata o ritardata fino a business hours"
        },
        followups: [
          { text: "Come è stata gestita la decision-making durante quell'incidente off-hours?", type: "decision_process" },
          { text: "Cosa è stato migliorato dopo quell'incidente?", type: "improvements" }
        ]
      }
    ],
    verificationQuestions: [
      {
        text: "Come viene verificato che la capacità di security monitoring e response sia adeguata 24/7?",
        scoring: {
          green: "Testing regolare con red team exercises in orari diversi e analisi delle metriche",
          yellow: "Monitoring di base con review occasionale della coverage",
          red: "Nessuna verifica sistematica della capacità off-hours"
        },
        followups: [
          { text: "Quando è stata l'ultima esercitazione di security durante orario notturno?", type: "testing_recency" }
        ]
      }
    ],
    culturalQuestions: [
      {
        text: "Come vengono valutate e compensate le persone che forniscono coverage di sicurezza off-hours?",
        scoring: {
          green: "Compensazione equa e riconoscimento esplicito dell'importanza della coverage 24/7",
          yellow: "Compensazione presente ma coverage off-hours vista come 'meno importante'",
          red: "Compensazione minima o inadeguata, alta turnover nelle posizioni off-hours"
        },
        followups: [
          { text: "Qual è il turnover del personale assegnato a turni notturni/weekend?", type: "turnover_metrics" }
        ]
      },
      {
        text: "Che formazione riceve il personale di sicurezza off-hours sui limiti della loro autorità e procedure di escalation?",
        scoring: {
          green: "Formazione strutturata con playbook chiari e autorità appropriata",
          yellow: "Formazione di base con playbook parziali",
          red: "Formazione minima, personale incerto su autorità e escalation"
        },
        followups: [
          { text: "Esistono playbook specifici per scenari comuni durante off-hours?", type: "playbook_coverage" }
        ]
      }
    ],
    redFlags: [
      { label: "Nessuna copertura security dedicata durante notti/weekend", severity: "critical", score: 0.18 },
      { label: "\"Di notte abbiamo solo monitoring automatico, senza personale...\"", severity: "high", score: 0.16 },
      { label: "Personale off-hours senza autorità decisionale per incident response", severity: "high", score: 0.15 },
      { label: "Tempo di risposta off-hours 3x+ più lento che business hours", severity: "high", score: 0.14 },
      { label: "\"Gli incidenti notturni vengono tipicamente gestiti la mattina seguente...\"", severity: "critical", score: 0.17 },
      { label: "Nessun testing di incident response durante orari off-hours", severity: "medium", score: 0.11 },
      { label: "Alta turnover del personale assegnato a turni off-hours", severity: "medium", score: 0.10 },
      { label: "Evidenza di attacchi che hanno sfruttato finestre orarie di scarsa coverage", severity: "critical", score: 0.18 }
    ]
  },
  '2.8': {
    mainTopic: 'lacune di sicurezza nei weekend e festività',
    conversationQuestions: [
      {
        text: "Che capacità di incident response ha l'organizzazione durante weekend e festività? Come differisce dai giorni lavorativi?",
        scoring: {
          green: "Capacità sostanzialmente equivalente con team dedicato e procedure chiare",
          yellow: "Capacità ridotta ma con escalation disponibile e procedure definite",
          red: "Capacità minima con risposta tipicamente ritardata fino al giorno lavorativo successivo"
        },
        followups: [
          { text: "Quante persone sono disponibili per incident response in un weekend tipico?", type: "staffing_levels" },
          { text: "Esistono procedure specifiche per incident durante festività?", type: "holiday_procedures" }
        ]
      },
      {
        text: "Mi descriva un incidente di sicurezza che si è verificato durante un fine settimana o festività. Come è stato gestito?",
        scoring: {
          green: "Esempio di risposta tempestiva ed efficace comparabile a giorni lavorativi",
          yellow: "Esempio di risposta adeguata ma con alcune limitazioni o ritardi",
          red: "Esempio di risposta significativamente ritardata o inadeguata a causa del timing"
        },
        followups: [
          { text: "Quali sfide specifiche sono emerse a causa del timing weekend/festività?", type: "timing_challenges" },
          { text: "Cosa è stato migliorato dopo quell'esperienza?", type: "post_incident_improvements" }
        ]
      }
    ],
    verificationQuestions: [
      {
        text: "Come viene testata la capacità dell'organizzazione di rispondere a incident durante weekend e festività?",
        scoring: {
          green: "Esercitazioni regolari programmate specificamente per weekend/festività",
          yellow: "Testing occasionale che potrebbe includere weekend",
          red: "Nessun testing specifico per scenari weekend/festività"
        },
        followups: [
          { text: "Quando è stata l'ultima table-top exercise durante un weekend o festività?", type: "last_exercise_date" }
        ]
      }
    ],
    culturalQuestions: [
      {
        text: "Come sono pianificate e comunicate le reperibilità per sicurezza durante weekend e festività?",
        scoring: {
          green: "Scheduling equo e trasparente con adeguata compensazione e backup plans",
          yellow: "Scheduling presente ma con gaps o inequità percepite",
          red: "Scheduling ad-hoc o informale con poca chiarezza su responsabilità"
        },
        followups: [
          { text: "Come viene compensata la reperibilità durante festività maggiori?", type: "compensation_policy" }
        ]
      },
      {
        text: "Quale cultura esiste riguardo all'aspettativa di disponibilità del team di sicurezza durante weekend e festività?",
        scoring: {
          green: "Equilibrio rispettoso con rotazioni eque e nessuna pressione inappropriata",
          yellow: "Aspettative talvolta poco chiare o pressure durante periodi critici",
          red: "Aspettativa implicita o esplicita di essere 'sempre disponibili'"
        },
        followups: [
          { text: "Esistono periodi di blocco dove le persone possono essere completamente off-call?", type: "time_off_policy" }
        ]
      }
    ],
    redFlags: [
      { label: "Risposta a incident durante weekend/festività ritardata di 12+ ore", severity: "critical", score: 0.18 },
      { label: "\"Durante le festività abbiamo solo monitoring minimo...\"", severity: "high", score: 0.15 },
      { label: "Nessuna procedura specifica per gestire incident durante weekend/festività", severity: "high", score: 0.14 },
      { label: "Evidenza di attacchi che hanno specificamente targetato weekend/festività", severity: "high", score: 0.16 },
      { label: "Mancanza di backup plans se la persona di reperibilità non è raggiungibile", severity: "high", score: 0.13 },
      { label: "\"Di solito aspettiamo il lunedì per gestire alert del weekend...\"", severity: "critical", score: 0.17 },
      { label: "Nessun testing di incident response durante weekend/festività", severity: "medium", score: 0.11 },
      { label: "Alta resistenza del team a coverage weekend/festività per carichi inequi", severity: "medium", score: 0.10 }
    ]
  },
  '2.9': {
    mainTopic: 'finestre di sfruttamento durante cambio turno',
    conversationQuestions: [
      {
        text: "Come funziona il processo di handoff tra turni per il team di sicurezza? Cosa viene comunicato?",
        scoring: {
          green: "Processo strutturato con checklist, documentazione e overlap period tra turni",
          yellow: "Handoff informale ma con comunicazione di base degli stati critici",
          red: "Handoff minimo o assente, ogni turno 'ricomincia da zero'"
        },
        followups: [
          { text: "Quanto tempo si sovrappongono i turni per l'handoff?", type: "overlap_duration" },
          { text: "Cosa succede se qualcuno è in ritardo o assente durante un cambio turno?", type: "absence_procedure" }
        ]
      },
      {
        text: "Mi racconti di una situazione dove qualcosa è sfuggito o è stato ritardato a causa di un cambio turno. Cosa è successo?",
        scoring: {
          green: "Nessun esempio significativo perché i processi di handoff sono robusti",
          yellow: "Esempio minore che ha portato a miglioramenti nel processo",
          red: "Esempi di incident o ritardi significativi dovuti a gap nel cambio turno"
        },
        followups: [
          { text: "Cosa è stato cambiato nel processo di handoff dopo quell'incidente?", type: "process_improvements" },
          { text: "Come vengono tracciate le attività in-progress durante i cambi turno?", type: "tracking_mechanism" }
        ]
      }
    ],
    verificationQuestions: [
      {
        text: "Che sistema esiste per garantire continuità durante i cambi turno del team di sicurezza?",
        scoring: {
          green: "Sistema formale con tracking automatico degli stati e checklist di handoff obbligatorie",
          yellow: "Procedure di base con documentazione parziale",
          red: "Nessun sistema formale, dipende da iniziativa individuale"
        },
        followups: [
          { text: "Come viene verificato che i handoff siano completi e accurati?", type: "verification_method" }
        ]
      }
    ],
    culturalQuestions: [
      {
        text: "Quanto tempo viene allocato e rispettato per handoff appropriati tra turni?",
        scoring: {
          green: "Tempo dedicato e protetto per handoff completi, visto come critico",
          yellow: "Tempo allocato ma spesso compresso per pressioni operative",
          red: "Handoff visti come 'overhead', minimizzati per efficienza"
        },
        followups: [
          { text: "Esistono metriche sulla qualità e completezza degli handoff?", type: "quality_metrics" }
        ]
      },
      {
        text: "Come viene formato il personale di sicurezza su importanza e tecniche di handoff efficaci?",
        scoring: {
          green: "Formazione strutturata con scenari pratici e best practices",
          yellow: "Formazione di base che menziona handoff",
          red: "Nessuna formazione specifica, gli handoff sono 'imparati sul campo'"
        },
        followups: [
          { text: "La formazione include esempi di incident causati da handoff inadeguati?", type: "case_studies" }
        ]
      }
    ],
    redFlags: [
      { label: "Nessun processo formale di handoff tra turni di sicurezza", severity: "critical", score: 0.18 },
      { label: "\"I turni si scambiano rapidamente le informazioni essenziali...\"", severity: "high", score: 0.14 },
      { label: "Nessun overlap time tra turni per handoff appropriato", severity: "high", score: 0.15 },
      { label: "Evidenza di incident o alert persi durante cambi turno", severity: "high", score: 0.16 },
      { label: "Mancanza di sistema per tracciare attività in-progress tra turni", severity: "high", score: 0.13 },
      { label: "\"Gli handoff rallentano le operazioni, li facciamo veloci...\"", severity: "medium", score: 0.11 },
      { label: "Nessuna formazione specifica su handoff efficaci", severity: "medium", score: 0.09 },
      { label: "Cultura che vede handoff come overhead piuttosto che controllo di sicurezza", severity: "medium", score: 0.10 }
    ]
  },
  '2.10': {
    mainTopic: 'pressione per coerenza temporale',
    conversationQuestions: [
      {
        text: "Esistono SLA o commitment di tempo di risposta che il team di sicurezza deve rispettare? Come impattano le decisioni?",
        scoring: {
          green: "SLA esistono ma con eccezioni esplicite per verifiche di sicurezza necessarie",
          yellow: "SLA esistono e creano pressione ma non impediscono verifiche critiche",
          red: "SLA rigidi che spesso portano a saltare o abbreviare controlli di sicurezza"
        },
        followups: [
          { text: "Cosa succede quando una verifica di sicurezza richiede più tempo degli SLA?", type: "sla_conflict_resolution" },
          { text: "Chi ha autorità di estendere SLA per motivi di sicurezza?", type: "override_authority" }
        ]
      },
      {
        text: "Mi descriva una situazione dove mantenere tempi di risposta consistenti è entrato in conflitto con necessità di sicurezza. Come è stata risolta?",
        scoring: {
          green: "Esempio dove la sicurezza ha avuto priorità con supporto del management",
          yellow: "Esempio di compromesso con rischi documentati e accettati formalmente",
          red: "Esempio dove la pressione per consistency ha compromesso verifiche di sicurezza"
        },
        followups: [
          { text: "Come vengono comunicati ai clienti ritardi dovuti a verifiche di sicurezza?", type: "customer_communication" },
          { text: "Esistono metriche su quante volte la sicurezza 'rallenta' il servizio?", type: "impact_metrics" }
        ]
      }
    ],
    verificationQuestions: [
      {
        text: "Come monitora l'organizzazione l'impatto degli SLA sulle decisioni di sicurezza?",
        scoring: {
          green: "Tracking sistematico con review dei casi dove SLA hanno influenzato decisioni di sicurezza",
          yellow: "Awareness del tema ma monitoring limitato",
          red: "Nessun monitoraggio dell'impatto degli SLA sulla sicurezza"
        },
        followups: [
          { text: "Esistono alert quando verifiche di sicurezza vengono abbreviate per SLA?", type: "compliance_monitoring" }
        ]
      }
    ],
    culturalQuestions: [
      {
        text: "Come viene bilanciato il team di sicurezza tra mantenere service consistency e fare verifiche appropriate?",
        scoring: {
          green: "Chiara priorità alla sicurezza con supporto esplicito del leadership",
          yellow: "Tensione presente con messaging misto dal management",
          red: "Pressione implicita o esplicita per 'non rallentare il servizio'"
        },
        followups: [
          { text: "Su cosa viene principalmente valutato il team di sicurezza?", type: "performance_criteria" }
        ]
      },
      {
        text: "Come viene formato il team customer-facing su quando e come comunicare ritardi dovuti a sicurezza?",
        scoring: {
          green: "Formazione strutturata con script e supporto esplicito per spiegare verifiche di sicurezza",
          yellow: "Linee guida di base con supporto limitato",
          red: "Nessuna formazione specifica, pressure per evitare ritardi"
        },
        followups: [
          { text: "Esistono esempi di clienti che hanno apprezzato verifiche di sicurezza anche con ritardi?", type: "positive_examples" }
        ]
      }
    ],
    redFlags: [
      { label: "\"Non possiamo far aspettare i clienti per verifiche di sicurezza...\"", severity: "critical", score: 0.18 },
      { label: "SLA rigidi senza eccezioni per verifiche di sicurezza necessarie", severity: "high", score: 0.15 },
      { label: "Evidenza di verifiche abbreviate o saltate per rispettare tempi di risposta", severity: "critical", score: 0.17 },
      { label: "\"Il team di sicurezza deve lavorare alla velocità del business...\"", severity: "high", score: 0.14 },
      { label: "Nessuna autorità chiara per estendere SLA per motivi di sicurezza", severity: "high", score: 0.13 },
      { label: "Team di sicurezza valutato principalmente su velocità di risposta", severity: "medium", score: 0.11 },
      { label: "Mancanza di comunicazione standard per spiegare ritardi dovuti a sicurezza", severity: "medium", score: 0.09 },
      { label: "Pattern di accesso emergenza usato per mantenere consistency del servizio", severity: "high", score: 0.16 }
    ]
  }
};

// Generate complete subsections based on 1.4 structure
function generateSubsections(indicatorId, template) {
  const context = INDICATOR_CONTEXTS[indicatorId];
  if (!context) {
    console.log(`  ⚠️  No context defined for ${indicatorId}, using generic template`);
    return template.sections[1].subsections; // Fallback to 1.4 template
  }

  const subsections = [
    {
      title: `Domande Apertura - ${context.mainTopic}`,
      weight: 0.30,
      items: context.conversationQuestions.map((q, idx) => ({
        type: "question",
        id: `conv_q${idx + 1}`,
        text: q.text,
        scoring_guidance: q.scoring,
        followups: q.followups.map(f => ({
          type: "Follow-up",
          text: f.text,
          evidence_type: f.type
        }))
      }))
    },
    {
      title: "Meccanismi Verifica",
      weight: 0.25,
      items: context.verificationQuestions.map((q, idx) => ({
        type: "question",
        id: `conv_q${idx + 3}`,
        text: q.text,
        scoring_guidance: q.scoring,
        followups: q.followups.map(f => ({
          type: "Follow-up",
          text: f.text,
          evidence_type: f.type
        }))
      }))
    },
    {
      title: "Fattori Culturali e Psicologici",
      weight: 0.30,
      items: context.culturalQuestions.map((q, idx) => ({
        type: "question",
        id: `conv_q${idx + 5}`,
        text: q.text,
        scoring_guidance: q.scoring,
        followups: q.followups.map(f => ({
          type: "Follow-up",
          text: f.text,
          evidence_type: f.type
        }))
      }))
    },
    {
      title: "Sondaggio per Segnali d'Allarme",
      weight: 0,
      description: "Indicatori osservabili che aumentano il punteggio di vulnerabilità indipendentemente dalle policy dichiarate",
      items: context.redFlags.map((rf, idx) => ({
        type: "checkbox",
        id: `red_flag_${idx + 1}`,
        label: rf.label,
        severity: rf.severity,
        score_impact: rf.score,
        subitems: []
      }))
    }
  ];

  return subsections;
}

function fixIndicator(indicatorId) {
  const filePath = `auditor field kit/interactive/it-IT/2.x-temporal/indicator_${indicatorId}.json`;

  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ File not found: ${indicatorId}`);
    return false;
  }

  console.log(`\n📄 Processing ${indicatorId}...`);

  const indicator = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const template = get14Template();

  // Keep all existing data
  // Fix only sections[1].subsections to match 1.4 structure

  if (indicator.sections && indicator.sections[1]) {
    const newSubsections = generateSubsections(indicatorId, template);

    indicator.sections[1].subsections = newSubsections;
    indicator.sections[1].calculation = "Conversation_Score = Weighted_Average(subsection_scores) + Σ(red_flag_impacts)";

    // Also ensure section 0 has proper structure
    if (indicator.sections[0]) {
      indicator.sections[0].id = "quick-assessment";
      indicator.sections[0].type = "radio-questions";
      indicator.sections[0].scoring_method = "weighted_average";
      indicator.sections[0].instructions = "Selezionare UNA opzione per ciascuna domanda. Ogni risposta contribuisce al punteggio finale ponderato. Le evidenze dovrebbero essere documentate per la traccia di audit.";
      indicator.sections[0].calculation = "Quick_Score = SUM(question_score x question_weight) / SUM(question_weight)";
    }

    fs.writeFileSync(filePath, JSON.stringify(indicator, null, 2) + '\n', 'utf8');
    console.log(`  ✅ Fixed with proper 1.4 structure`);
    return true;
  } else {
    console.log(`  ❌ Invalid structure`);
    return false;
  }
}

console.log('🔧 Fixing Category 2.x with 1.4 structure template\n');
console.log('This will:');
console.log('  - Use 1.4 subsection structure (detailed questions with followups)');
console.log('  - Add context-specific Italian content for each indicator');
console.log('  - Replace subsections with proper 4-subsection structure\n');

const indicatorsToFix = ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '2.10'];
let fixedCount = 0;
let failedCount = 0;

indicatorsToFix.forEach(id => {
  if (fixIndicator(id)) {
    fixedCount++;
  } else {
    failedCount++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Fixed ${fixedCount}/${indicatorsToFix.length} indicators successfully`);
if (failedCount > 0) {
  console.log(`❌ Failed to fix ${failedCount} indicators`);
}
console.log('\nAll category 2.x indicators now have:');
console.log('  - Proper 1.4 structure (4 subsections with weights)');
console.log('  - Context-specific Italian questions with scoring_guidance');
console.log('  - Followup questions with evidence types');
console.log('  - Red flags with severity and score_impact');
console.log('='.repeat(60));
