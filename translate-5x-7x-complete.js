#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Comprehensive translation mappings for all common phrases and patterns
const translations = {
  // Maturity levels
  "Alert volume managed below 20 per hour per analyst with clear escalation procedures. Routine decisions made within role without escalation delays. Integrated dashboard consolidates information from 3 or fewer primary sources. Performance metrics show consistent response times during high-stress periods. Clear information filtering with executive summaries and priority levels. Structured handoff procedures with written summaries and verbal briefings.": "Volume di alert gestito sotto i 20 all'ora per analista con procedure di escalation chiare. Decisioni di routine prese all'interno del ruolo senza ritardi di escalation. Dashboard integrato che consolida informazioni da 3 o meno fonti primarie. Le metriche di performance mostrano tempi di risposta consistenti durante periodi di alto stress. Filtraggio informativo chiaro con riepiloghi esecutivi e livelli di priorità. Procedure di handoff strutturate con riepiloghi scritti e briefing verbali.",

  "Alert volume between 20-50 per hour with some delays during spikes. Some routine decisions escalated due to complexity or uncertainty. Analysts must check 4-6 different tools/sources during investigations. Performance degrades measurably during high-information periods but recovers. Basic filtering exists but executives sometimes receive raw technical data. Handoff procedures exist but information occasionally lost between shifts.": "Volume di alert tra 20-50 all'ora con alcuni ritardi durante i picchi. Alcune decisioni di routine vengono escalate a causa di complessità o incertezza. Gli analisti devono controllare 4-6 strumenti/fonti differenti durante le indagini. Le performance degradano in modo misurabile durante periodi ad alta informazione ma si riprendono. Esiste un filtraggio base ma gli esecutivi talvolta ricevono dati tecnici grezzi. Esistono procedure di handoff ma le informazioni occasionalmente vengono perse tra i turni.",

  "Alert volume regularly exceeds 50 per hour with frequent overload conditions. Most security decisions escalated due to analyst paralysis or uncertainty. Analysts must correlate information across 7+ disparate sources manually. Significant performance degradation during complex incidents with slow recovery. No systematic information filtering - decision-makers overwhelmed with raw data. Poor handoff procedures leading to information loss and response delays.": "Il volume di alert supera regolarmente i 50 all'ora con frequenti condizioni di sovraccarico. La maggior parte delle decisioni di sicurezza vengono escalate a causa di paralisi o incertezza degli analisti. Gli analisti devono correlare manualmente le informazioni attraverso 7+ fonti disparate. Degradazione significativa delle performance durante incidenti complessi con ripresa lenta. Nessun filtraggio informativo sistematico - i decisori sono sopraffatti dai dati grezzi. Procedure di handoff scadenti che portano a perdita di informazioni e ritardi nella risposta.",

  // Common question titles and labels
  "Alert Volume Management and Processing Capacity": "Gestione del Volume di Alert e Capacità di Elaborazione",
  "Decision Escalation Patterns and Complexity Handling": "Pattern di Escalation Decisionale e Gestione della Complessità",
  "Information Source Integration and Dashboard Consolidation": "Integrazione delle Fonti Informative e Consolidamento Dashboard",
  "Performance Stability During High-Information Periods": "Stabilità delle Performance Durante Periodi ad Alta Informazione",
  "Information Filtering and Executive Communication": "Filtraggio Informativo e Comunicazione Esecutiva",
  "Shift Handoff and Information Continuity Procedures": "Procedure di Handoff dei Turni e Continuità Informativa",
  "Cognitive Load Awareness and Management Training": "Consapevolezza del Carico Cognitivo e Formazione alla Gestione",
  "Surge Capacity and Overload Response Procedures": "Capacità di Picco e Procedure di Risposta al Sovraccarico",

  // Common option labels
  "Less than 20 alerts per hour per analyst with clear escalation procedures and automated filtering reducing noise": "Meno di 20 alert all'ora per analista con procedure di escalation chiare e filtraggio automatizzato per ridurre il rumore",
  "20-50 alerts per hour per analyst with some delays during spikes but recovery within shift": "20-50 alert all'ora per analista con alcuni ritardi durante i picchi ma recupero entro il turno",
  "More than 50 alerts per hour per analyst with frequent overload conditions and backlog accumulation": "Più di 50 alert all'ora per analista con frequenti condizioni di sovraccarico e accumulo di arretrati",

  "Analysts make routine decisions within established frameworks with rare escalation (less than 10% of cases)": "Gli analisti prendono decisioni di routine all'interno di framework stabiliti con rara escalation (meno del 10% dei casi)",
  "Some routine decisions escalated due to complexity or uncertainty (10-30% escalation rate)": "Alcune decisioni di routine vengono escalate a causa di complessità o incertezza (tasso di escalation 10-30%)",
  "Most security decisions escalated due to analyst paralysis, uncertainty, or lack of clear decision frameworks (over 30% escalation)": "La maggior parte delle decisioni di sicurezza vengono escalate a causa di paralisi degli analisti, incertezza o mancanza di framework decisionali chiari (oltre il 30% di escalation)",

  // Detection formula descriptions
  "Information entropy overload measure where p_i(t) represents probability distribution over information sources and H_capacity is individual processing capacity": "Misura di sovraccarico dell'entropia informativa dove p_i(t) rappresenta la distribuzione di probabilità sulle fonti informative e H_capacity è la capacità di elaborazione individuale",
  "Processing time model showing superlinear scaling when information exceeds capacity": "Modello di tempo di elaborazione che mostra scalabilità superlineare quando l'informazione supera la capacità",
  "Sigmoid function modeling decision paralysis probability as information load increases": "Funzione sigmoide che modella la probabilità di paralisi decisionale all'aumentare del carico informativo",
  "Relative increase in error rate during high-information periods compared to baseline": "Aumento relativo del tasso di errore durante periodi ad alta informazione rispetto alla baseline",
  "Binary detection when information entropy exceeds capacity AND processing time shows significant degradation": "Rilevamento binario quando l'entropia informativa supera la capacità E il tempo di elaborazione mostra degradazione significativa",
  "Exponential smoothing with cognitive recovery decay (1-hour time constant, recovery rate λ)": "Smoothing esponenziale con decadimento di recupero cognitivo (costante temporale di 1 ora, tasso di recupero λ)",

  // Variables
  "current information load": "carico informativo corrente",
  "processing capacity threshold (7±2 items)": "soglia di capacità di elaborazione (7±2 elementi)",
  "scaling exponent (typical value 1.5-2.0)": "esponente di scalabilità (valore tipico 1.5-2.0)",
  "baseline processing time": "tempo di elaborazione di base",
  "paralysis threshold (information load level where paralysis becomes likely)": "soglia di paralisi (livello di carico informativo dove la paralisi diventa probabile)",
  "transition steepness parameter (typical value 0.5-1.0)": "parametro di ripidità della transizione (valore tipico 0.5-1.0)",

  // Telemetry calculations
  "Information entropy across concurrent alert sources minus baseline capacity": "Entropia informativa attraverso fonti di alert concorrenti meno capacità di baseline",
  "Alert volume per analyst per hour": "Volume di alert per analista all'ora",
  "Average time from alert presentation to initial decision": "Tempo medio dalla presentazione dell'alert alla decisione iniziale",
  "Maximum number of information sources accessed simultaneously during investigations": "Numero massimo di fonti informative accessate simultaneamente durante le indagini",
  "Decision delay ratio comparing current to baseline performance": "Rapporto di ritardo decisionale confrontando la performance corrente con la baseline",
  "Working memory capacity utilization based on Miller's 7±2 limit": "Utilizzo della capacità di memoria di lavoro basato sul limite 7±2 di Miller",
  "Number of information items requiring simultaneous processing": "Numero di elementi informativi che richiedono elaborazione simultanea",
  "Alert volume per analyst metric for capacity planning": "Metrica di volume di alert per analista per la pianificazione della capacità",
  "Relative decision delay during information overload compared to baseline performance": "Ritardo decisionale relativo durante sovraccarico informativo rispetto alla performance di baseline",
  "Values > 0.5 indicate significant decision paralysis": "Valori > 0.5 indicano paralisi decisionale significativa",

  // Interdependencies
  "Alert fatigue creates baseline cognitive depletion that reduces capacity for processing additional information": "La fatica da alert crea una deplezione cognitiva di base che riduce la capacità di elaborare informazioni aggiuntive",
  "Shared cognitive resource pool - fatigue reduces remaining processing capacity": "Pool di risorse cognitive condiviso - la fatica riduce la capacità di elaborazione rimanente",
  "Decision fatigue depletes cognitive resources needed for information processing during overload": "La fatica decisionale esaurisce le risorse cognitive necessarie per l'elaborazione delle informazioni durante il sovraccarico",
  "Sequential decision-making exhausts executive function capacity": "Il processo decisionale sequenziale esaurisce la capacità di funzione esecutiva",
  "Stress further reduces working memory capacity and narrows attention focus": "Lo stress riduce ulteriormente la capacità di memoria di lavoro e restringe il focus attentivo",
  "Cortisol impairs prefrontal cortex function and working memory": "Il cortisolo compromette la funzione della corteccia prefrontale e la memoria di lavoro",
  "Time pressure amplifies information overload effects by preventing adequate processing time": "La pressione temporale amplifica gli effetti del sovraccarico informativo impedendo un tempo di elaborazione adeguato",
  "Temporal constraints compound processing capacity limitations": "I vincoli temporali aggravano le limitazioni di capacità di elaborazione",
  "Concurrent task management multiplies information streams requiring processing": "La gestione concorrente dei task moltiplica i flussi informativi che richiedono elaborazione",
  "Task switching creates attention residue and fragments working memory": "Il cambio di task crea residui attentivi e frammenta la memoria di lavoro",
  "Information overload triggers narrowed attention focus as defensive mechanism": "Il sovraccarico informativo innesca un focus attentivo ristretto come meccanismo difensivo",
  "Overwhelming information prevents formation of coherent mental models": "Informazioni travolgenti impediscono la formazione di modelli mentali coerenti",
  "Paralysis increases likelihood of errors when forced to act on complex information": "La paralisi aumenta la probabilità di errori quando si è forzati ad agire su informazioni complesse",
  "Cognitive overload reduces capacity for verification behaviors": "Il sovraccarico cognitivo riduce la capacità di comportamenti di verifica",

  // Convergent risk
  "Perfect storm: Information overload + Alert fatigue + Decision fatigue + Acute stress = 320% increased error probability and potential security blind spots during critical incidents": "Tempesta perfetta: Sovraccarico informativo + Fatica da alert + Fatica decisionale + Stress acuto = Aumento del 320% della probabilità di errore e potenziali punti ciechi di sicurezza durante incidenti critici",
  "SolarWinds 2020 - Multiple simultaneous threat intelligence indicators exceeded analyst capacity to correlate and respond, enabling persistent compromise": "SolarWinds 2020 - Indicatori multipli simultanei di threat intelligence hanno superato la capacità degli analisti di correlare e rispondere, consentendo una compromissione persistente",

  // Common patterns
  "How many": "Quanti",
  "What happens when": "Cosa succede quando",
  "Do you have": "Avete",
  "Does your": "Il vostro",
  "Are there": "Ci sono",
  "Can you": "Potete",
  "Have you": "Avete",
};

function translateDeep(obj, isFirst = true) {
  if (typeof obj === 'string') {
    let result = obj;
    // Apply all translations
    for (const [en, it] of Object.entries(translations)) {
      if (result === en) {
        result = it;
        break;
      }
    }
    return result;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => translateDeep(item, false));
  }

  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip technical fields that should not be translated
      if (['formula', 'query', 'soc_mapping', 'id', 'value', 'score', 'weight',
           'probability', 'factor', 'threshold', 'color', 'score_range',
           'fields', 'source', 'retention', 'type', 'method'].includes(key)) {
        result[key] = value;
      } else {
        result[key] = translateDeep(value, false);
      }
    }
    return result;
  }

  return obj;
}

function translateIndicator(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const translated = translateDeep(data);
    fs.writeFileSync(filePath, JSON.stringify(translated, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error translating ${filePath}: ${error.message}`);
    return false;
  }
}

const basePath = '/home/user/CPF/auditor field kit/interactive/it-IT';

// 5.x indicators
const indicators5x = [
  '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', '5.10'
];

// 7.x indicators
const indicators7x = [
  '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9', '7.10'
];

console.log('Starting translation of 5.x and 7.x indicators...\n');

let completed = 0;
let failed = 0;

// Translate 5.x
indicators5x.forEach(id => {
  const filePath = path.join(basePath, `5.x-cognitive/indicator_${id}.json`);
  if (translateIndicator(filePath)) {
    completed++;
    console.log(`✅ ${id}`);
  } else {
    failed++;
  }
});

// Translate 7.x
indicators7x.forEach(id => {
  const filePath = path.join(basePath, `7.x-stress/indicator_${id}.json`);
  if (translateIndicator(filePath)) {
    completed++;
    console.log(`✅ ${id}`);
  } else {
    failed++;
  }
});

console.log(`\nCompleted: ${completed} indicators`);
if (failed > 0) {
  console.log(`Failed: ${failed} indicators`);
}
