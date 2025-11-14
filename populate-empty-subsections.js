#!/usr/bin/env node

const fs = require('fs');

// Template items in italiano per subsections vuote
const PLACEHOLDER_ITEMS = {
  conversation_questions: [
    {
      type: "question",
      id: "conv_q1",
      text: "Può descrivere una situazione recente relativa a questo indicatore e come è stata gestita?",
      scoring_guidance: {
        green: "Esempio specifico con procedure documentate e processo chiaro",
        yellow: "Esempio generale con processo parzialmente definito",
        red: "Nessun esempio specifico o procedura non chiara"
      },
      followups: [
        {
          type: "Follow-up",
          text: "Quali passaggi specifici sono stati seguiti?",
          evidence_type: "specific_procedure"
        }
      ]
    },
    {
      type: "question",
      id: "conv_q2",
      text: "Quali procedure standard esistono per gestire situazioni di questo tipo?",
      scoring_guidance: {
        green: "Procedure scritte e documentate con passaggi chiari",
        yellow: "Procedure informali o parzialmente documentate",
        red: "Nessuna procedura formale definita"
      },
      followups: [
        {
          type: "Follow-up",
          text: "Può mostrarmi la documentazione di queste procedure?",
          evidence_type: "documentation_artifact"
        }
      ]
    }
  ],
  verification_mechanisms: [
    {
      type: "question",
      id: "conv_q3",
      text: "Come viene verificata l'autenticità delle richieste in questo contesto?",
      scoring_guidance: {
        green: "Sistema di verifica multi-canale documentato",
        yellow: "Verifica informale o applicata inconsistentemente",
        red: "Nessun processo di verifica formale"
      },
      followups: [
        {
          type: "Follow-up",
          text: "Con quale frequenza viene aggiornato il processo di verifica?",
          evidence_type: "maintenance_procedure"
        }
      ]
    }
  ],
  cultural_factors: [
    {
      type: "question",
      id: "conv_q4",
      text: "Come reagisce l'organizzazione quando vengono sollevate preoccupazioni relative a questo indicatore?",
      scoring_guidance: {
        green: "Cultura aperta con protezioni esplicite per chi segnala problemi",
        yellow: "Risposta mista a seconda della situazione",
        red: "Mancanza di supporto o conseguenze negative per chi segnala"
      },
      followups: [
        {
          type: "Follow-up",
          text: "Esistono policy che proteggono chi segnala queste problematiche?",
          evidence_type: "policy_protection"
        }
      ]
    },
    {
      type: "question",
      id: "conv_q5",
      text: "Quale formazione è stata fornita al personale su questo tema?",
      scoring_guidance: {
        green: "Formazione regolare con scenari pratici e valutazioni",
        yellow: "Formazione base con contenuti generici",
        red: "Nessuna formazione specifica su questo tema"
      },
      followups: [
        {
          type: "Follow-up",
          text: "Come viene misurata l'efficacia della formazione?",
          evidence_type: "effectiveness_measurement"
        }
      ]
    }
  ],
  red_flags: [
    {
      type: "checkbox",
      id: "red_flag_1",
      label: "Mancanza di procedure documentate per gestire situazioni critiche",
      severity: "high",
      score_impact: 0.15,
      subitems: []
    },
    {
      type: "checkbox",
      id: "red_flag_2",
      label: "Resistenza culturale all'implementazione di controlli di sicurezza",
      severity: "high",
      score_impact: 0.13,
      subitems: []
    },
    {
      type: "checkbox",
      id: "red_flag_3",
      label: "Assenza di formazione specifica per il personale",
      severity: "medium",
      score_impact: 0.10,
      subitems: []
    },
    {
      type: "checkbox",
      id: "red_flag_4",
      label: "Nessun sistema di verifica o autenticazione implementato",
      severity: "critical",
      score_impact: 0.18,
      subitems: []
    },
    {
      type: "checkbox",
      id: "red_flag_5",
      label: "Evidenza di incidenti precedenti non risolti",
      severity: "medium",
      score_impact: 0.12,
      subitems: []
    }
  ],
  risk_scenarios: [
    {
      type: "info",
      id: "scenario_note",
      text: "Gli scenari di rischio specifici per questo indicatore sono documentati nella sezione 'risk_scenarios' dei metadati dell'indicatore."
    }
  ],
  scoring_summary: [
    {
      type: "info",
      id: "scoring_note",
      text: "Il riepilogo dello scoring viene calcolato automaticamente in base alle risposte fornite nella valutazione rapida e nella conversazione approfondita."
    }
  ]
};

function populateEmptySubsections(indicator, indicatorId) {
  if (!indicator.sections || indicator.sections.length < 2) return false;

  const section1 = indicator.sections[1];
  if (!section1.subsections) return false;

  let modified = false;

  section1.subsections.forEach((sub, idx) => {
    if (!sub.items || sub.items.length === 0) {
      console.log(`   Populating Sub${idx}: "${sub.title}"`);

      // Determine which placeholder to use based on subsection title
      const titleLower = sub.title.toLowerCase();

      if (titleLower.includes('apertura') || titleLower.includes('domande iniziali') || titleLower.includes('conversazione approfondita')) {
        sub.items = PLACEHOLDER_ITEMS.conversation_questions;
        sub.weight = 0.30;
      } else if (titleLower.includes('verifica') || titleLower.includes('meccanismi')) {
        sub.items = PLACEHOLDER_ITEMS.verification_mechanisms;
        sub.weight = 0.25;
      } else if (titleLower.includes('culturali') || titleLower.includes('psicologici') || titleLower.includes('formazione')) {
        sub.items = PLACEHOLDER_ITEMS.cultural_factors;
        sub.weight = 0.30;
      } else if (titleLower.includes('segnali') || titleLower.includes('rossi') || titleLower.includes('rosso') || titleLower.includes('bandiere') || titleLower.includes('flag')) {
        sub.items = PLACEHOLDER_ITEMS.red_flags;
        sub.weight = 0;
        sub.description = "Indicatori osservabili che aumentano il punteggio di vulnerabilità indipendentemente dalle policy dichiarate";
      } else if (titleLower.includes('scenari') || titleLower.includes('rischio')) {
        sub.items = PLACEHOLDER_ITEMS.risk_scenarios;
        sub.weight = 0;
      } else if (titleLower.includes('scoring') || titleLower.includes('riepilogo')) {
        sub.items = PLACEHOLDER_ITEMS.scoring_summary;
        sub.weight = 0;
      } else {
        // Generic conversation questions for unknown subsection types
        sub.items = PLACEHOLDER_ITEMS.conversation_questions;
        sub.weight = 0.25;
      }

      modified = true;
    }
  });

  return modified;
}

// Process indicators 1.5-2.10
const indicatorsToFix = [
  '1.5', '1.6', '1.7', '1.8', '1.9', '1.10',
  '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '2.10'
];

console.log('🔧 Populating empty subsections in indicators 1.5-2.10\n');

let totalFixed = 0;

indicatorsToFix.forEach(id => {
  const category = id.startsWith('1.') ? '1.x-authority' : '2.x-temporal';
  const filePath = `auditor field kit/interactive/it-IT/${category}/indicator_${id}.json`;

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${id}: File not found`);
    return;
  }

  console.log(`\n📄 Processing ${id}...`);

  const indicator = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (populateEmptySubsections(indicator, id)) {
    fs.writeFileSync(filePath, JSON.stringify(indicator, null, 2) + '\n', 'utf8');
    console.log(`   ✅ Updated`);
    totalFixed++;
  } else {
    console.log(`   ✓ No empty subsections`);
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ Complete! Populated ${totalFixed} indicators with Italian content`);
console.log(`\nNote: Content is generic placeholder based on 1.4 structure.`);
console.log(`For context-specific validation, use external LLM as planned.`);
console.log('='.repeat(60));
