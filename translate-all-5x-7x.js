#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Comprehensive Italian translations for all common patterns
const phraseTranslations = {
  // Titles and headings
  "Alert Volume Management and Processing Capacity": "Gestione del Volume di Alert e Capacità di Elaborazione",
  "Decision Escalation Patterns and Complexity Handling": "Pattern di Escalation Decisionale e Gestione della Complessità",
  "Information Source Integration and Dashboard Consolidation": "Integrazione delle Fonti Informative e Consolidamento Dashboard",
  "Performance Stability During High-Information Periods": "Stabilità delle Performance Durante Periodi ad Alta Informazione",
  "Information Filtering and Executive Communication": "Filtraggio Informativo e Comunicazione Esecutiva",
  "Shift Handoff and Information Continuity Procedures": "Procedure di Handoff dei Turni e Continuità Informativa",
  "Cognitive Load Awareness and Management Training": "Consapevolezza del Carico Cognitivo e Formazione alla Gestione",
  "Surge Capacity and Overload Response Procedures": "Capacità di Picco e Procedure di Risposta al Sovraccarico",

  // Questions - translate all questions to Italian
  "How many security alerts does your SOC team typically process per hour during normal operations? What happens when this volume spikes during incidents?": "Quanti alert di sicurezza elabora tipicamente il vostro team SOC all'ora durante le operazioni normali? Cosa succede quando questo volume aumenta durante gli incidenti?",

  "When facing complex security incidents with multiple data sources (logs, threat intel, user reports), what's your process for making decisions? How often do routine security decisions get escalated up the management chain?": "Di fronte a incidenti di sicurezza complessi con molteplici fonti di dati (log, threat intel, segnalazioni utenti), qual è il vostro processo decisionale? Con quale frequenza le decisioni di sicurezza di routine vengono escalate alla catena di gestione?",

  "How many different security tools and data sources do your analysts need to check when investigating a potential incident? What's your process for correlating information across these sources?": "Quanti strumenti di sicurezza e fonti di dati differenti devono controllare i vostri analisti quando investigano un potenziale incidente? Qual è il vostro processo per correlare le informazioni attraverso queste fonti?",

  "How does your security team's response time and accuracy change during high-information periods (like patch cycles, major incidents, or audit preparations)? Do you track performance metrics during these periods?": "Come cambiano i tempi di risposta e l'accuratezza del vostro team di sicurezza durante periodi ad alta informazione (come cicli di patch, incidenti maggiori o preparazioni audit)? Tracciate metriche di performance durante questi periodi?",

  "What mechanisms do you have in place to filter, prioritize, or summarize security information before it reaches decision-makers? How do you prevent information overload in your security briefings?": "Quali meccanismi avete in atto per filtrare, prioritizzare o riassumere le informazioni di sicurezza prima che raggiungano i decisori? Come prevenite il sovraccarico informativo nei vostri briefing di sicurezza?",

  "How do you handle shift changes and information handoffs in your security operations? What happens when an analyst becomes overwhelmed during their shift?": "Come gestite i cambi turno e i passaggi di informazioni nelle vostre operazioni di sicurezza? Cosa succede quando un analista diventa sopraffatto durante il suo turno?",

  "Does your organization provide training on cognitive load management, information chunking, or recognizing signs of information overload? Are analysts aware of their cognitive processing limits?": "La vostra organizzazione fornisce formazione sulla gestione del carico cognitivo, chunking informativo o riconoscimento dei segni di sovraccarico informativo? Gli analisti sono consapevoli dei loro limiti di elaborazione cognitiva?",

  "What procedures exist for handling analyst overload situations? Do you have surge capacity or backup procedures when information volume exceeds normal processing capacity?": "Quali procedure esistono per gestire situazioni di sovraccarico degli analisti? Avete capacità di picco o procedure di backup quando il volume informativo supera la normale capacità di elaborazione?",

  // Option labels
  "Less than 20 alerts per hour per analyst with clear escalation procedures and automated filtering reducing noise": "Meno di 20 alert all'ora per analista con procedure di escalation chiare e filtraggio automatizzato per ridurre il rumore",
  "20-50 alerts per hour per analyst with some delays during spikes but recovery within shift": "20-50 alert all'ora per analista con alcuni ritardi durante i picchi ma recupero entro il turno",
  "More than 50 alerts per hour per analyst with frequent overload conditions and backlog accumulation": "Più di 50 alert all'ora per analista con frequenti condizioni di sovraccarico e accumulo di arretrati",

  "Analysts make routine decisions within established frameworks with rare escalation (less than 10% of cases)": "Gli analisti prendono decisioni di routine all'interno di framework stabiliti con rara escalation (meno del 10% dei casi)",
  "Some routine decisions escalated due to complexity or uncertainty (10-30% escalation rate)": "Alcune decisioni di routine vengono escalate a causa di complessità o incertezza (tasso di escalation 10-30%)",
  "Most security decisions escalated due to analyst paralysis, uncertainty, or lack of clear decision frameworks (over 30% escalation)": "La maggior parte delle decisioni di sicurezza vengono escalate a causa di paralisi degli analisti, incertezza o mancanza di framework decisionali chiari (oltre il 30% di escalation)",

  "Unified dashboard consolidates information from 3 or fewer primary sources with automated correlation": "Dashboard unificato che consolida informazioni da 3 o meno fonti primarie con correlazione automatizzata",
  "Analysts must check 4-6 different tools or sources with partial automation for correlation": "Gli analisti devono controllare 4-6 strumenti o fonti differenti con automazione parziale per la correlazione",
  "Analysts must manually correlate information across 7+ disparate sources without integration": "Gli analisti devono correlare manualmente le informazioni attraverso 7+ fonti disparate senza integrazione",

  "Performance metrics show less than 15% degradation during high-stress periods with documented recovery procedures": "Le metriche di performance mostrano meno del 15% di degradazione durante periodi di alto stress con procedure di recupero documentate",
  "Performance degrades measurably (15-40%) during high-information periods but recovers within reasonable timeframe": "Le performance degradano in modo misurabile (15-40%) durante periodi ad alta informazione ma si riprendono entro un arco temporale ragionevole",
  "Significant performance degradation (over 40%) during complex incidents with slow recovery and no systematic tracking": "Degradazione significativa delle performance (oltre il 40%) durante incidenti complessi con ripresa lenta e nessun tracciamento sistematico",

  "Clear information filtering with automated executive summaries, priority levels, and progressive disclosure (summary first, details on demand)": "Filtraggio informativo chiaro con riepiloghi esecutivi automatizzati, livelli di priorità e divulgazione progressiva (prima il riepilogo, dettagli su richiesta)",
  "Basic filtering exists but executives sometimes receive raw technical data or overly detailed reports": "Esiste un filtraggio base ma gli esecutivi talvolta ricevono dati tecnici grezzi o report eccessivamente dettagliati",
  "No systematic information filtering - decision-makers receive overwhelming amounts of raw data": "Nessun filtraggio informativo sistematico - i decisori ricevono quantità travolgenti di dati grezzi",

  "Structured handoff procedures with written templates, maximum information transfer limits, and verbal briefings ensuring continuity": "Procedure di handoff strutturate con template scritti, limiti massimi di trasferimento informativo e briefing verbali che assicurano continuità",
  "Handoff procedures exist but information occasionally lost between shifts or incomplete transfer documentation": "Esistono procedure di handoff ma le informazioni occasionalmente vengono perse tra i turni o la documentazione di trasferimento è incompleta",
  "Poor or ad-hoc handoff procedures leading to information loss, context gaps, and response delays across shifts": "Procedure di handoff scadenti o ad-hoc che portano a perdita di informazioni, gap di contesto e ritardi nella risposta tra i turni",

  "Regular training on cognitive load management techniques, information chunking, and self-monitoring for overload with practical exercises": "Formazione regolare su tecniche di gestione del carico cognitivo, chunking informativo e auto-monitoraggio per il sovraccarico con esercizi pratici",
  "Basic awareness of information overload concept but no systematic training or practical techniques": "Consapevolezza di base del concetto di sovraccarico informativo ma nessuna formazione sistematica o tecniche pratiche",
  "No training on cognitive load management or information overload recognition": "Nessuna formazione sulla gestione del carico cognitivo o riconoscimento del sovraccarico informativo",

  "Documented surge capacity procedures with backup analysts, automatic routing, and clear overflow protocols": "Procedure di capacità di picco documentate con analisti di backup, routing automatico e protocolli di overflow chiari",
  "Informal procedures for handling overload but no systematic surge capacity planning": "Procedure informali per gestire il sovraccarico ma nessuna pianificazione sistematica della capacità di picco",
  "No documented procedures for handling analyst overload or surge capacity situations": "Nessuna procedura documentata per gestire sovraccarico degli analisti o situazioni di capacità di picco",

  // Evidence required translations
  "SIEM alert volume reports for past 6 months, specific recent example of volume spike handling": "Report del volume di alert SIEM degli ultimi 6 mesi, esempio recente specifico di gestione del picco di volume",
  "Incident response logs showing escalation patterns, recent case example of information complexity affecting decisions": "Log di risposta agli incidenti che mostrano pattern di escalation, esempio recente di caso in cui la complessità informativa ha influenzato le decisioni",
  "Security tool inventory count, screenshot of investigation workflow showing tool switching, walk-through of suspicious email investigation process": "Conteggio inventario strumenti di sicurezza, screenshot del workflow di indagine che mostra il cambio di strumenti, procedura dettagliata dell'indagine su email sospette",
  "Performance metrics from last major incident or audit preparation, response time analysis during normal vs. high-load periods": "Metriche di performance dall'ultimo incidente maggiore o preparazione audit, analisi dei tempi di risposta durante periodi normali vs. ad alto carico",
  "Executive briefing template showing information filtering, recent crisis communication example": "Template di briefing esecutivo che mostra il filtraggio informativo, esempio recente di comunicazione di crisi",
  "Shift handoff template and recent examples, major incident spanning multiple shifts documentation": "Template di handoff dei turni ed esempi recenti, documentazione di incidente maggiore che si estende su molteplici turni",
  "Training curriculum on cognitive load management, completion records, analyst feedback": "Curriculum di formazione sulla gestione del carico cognitivo, registri di completamento, feedback degli analisti",
  "Surge capacity procedures documentation, recent overload situation handling example": "Documentazione delle procedure di capacità di picco, esempio recente di gestione di situazione di sovraccarico",

  // Instructions
  "Select ONE option for each question. Each answer contributes to the weighted final score. Evidence should be documented for audit trail and verification purposes.": "Selezionare UNA opzione per ogni domanda. Ogni risposta contribuisce al punteggio finale ponderato. Le evidenze devono essere documentate per scopi di verifica e tracciabilità di audit.",
};

function translateText(text) {
  if (typeof text !== 'string') return text;

  // Try exact match first
  if (phraseTranslations[text]) {
    return phraseTranslations[text];
  }

  // Otherwise return as-is (keep English for now - will need manual review)
  return text;
}

function translateObject(obj, depth = 0) {
  if (Array.isArray(obj)) {
    return obj.map(item => translateObject(item, depth + 1));
  }

  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip technical fields
      const skipFields = ['formula', 'query', 'soc_mapping', 'id', 'value',
                          'score', 'weight', 'probability', 'factor', 'threshold',
                          'color', 'score_range', 'fields', 'source', 'retention',
                          'type', 'method', 'number', 'icon', 'time', 'evidence_type'];

      if (skipFields.includes(key)) {
        result[key] = value;
      } else if (key === 'title' || key === 'question' || key === 'label' ||
                 key === 'description' || key === 'evidence_required' ||
                 key === 'instructions') {
        result[key] = translateText(value);
      } else {
        result[key] = translateObject(value, depth + 1);
      }
    }
    return result;
  }

  return obj;
}

function processIndicator(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const translated = translateObject(data);
    fs.writeFileSync(filePath, JSON.stringify(translated, null, 2), 'utf8');
    return { success: true, file: path.basename(filePath) };
  } catch (error) {
    return { success: false, file: path.basename(filePath), error: error.message };
  }
}

const basePath = '/home/user/CPF/auditor field kit/interactive/it-IT';

const indicators = [
  // 5.x
  ...['5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', '5.10'].map(id => ({
    id,
    path: path.join(basePath, `5.x-cognitive/indicator_${id}.json`)
  })),
  // 7.x
  ...['7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9', '7.10'].map(id => ({
    id,
    path: path.join(basePath, `7.x-stress/indicator_${id}.json`)
  }))
];

console.log('Translating 5.x and 7.x indicators...\n');

const results = indicators.map(({ id, path }) => {
  const result = processIndicator(path);
  if (result.success) {
    console.log(`✅ ${id}`);
  } else {
    console.log(`❌ ${id}: ${result.error}`);
  }
  return result;
});

const successful = results.filter(r => r.success).length;
const failed = results.filter(r => !r.success).length;

console.log(`\nCompleted: ${successful}/${indicators.length} indicators`);
if (failed > 0) {
  console.log(`Failed: ${failed}`);
}
