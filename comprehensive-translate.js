#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Map of comprehensive translations - this needs to be VERY comprehensive
const translations = {
  // === 5.4 Multitasking questions ===
  "How many different security tools or dashboards does your security team typically monitor simultaneously during a normal shift?": "Quanti strumenti di sicurezza o dashboard differenti monitora tipicamente il vostro team di sicurezza simultaneamente durante un turno normale?",

  "What happens when a high-priority security alert comes in while your team is already handling another incident or administrative task?": "Cosa succede quando arriva un alert di sicurezza ad alta priorità mentre il vostro team sta già gestendo un altro incidente o task amministrativo?",

  "How often do your security personnel need to switch between security monitoring and non-security responsibilities (like system administration, user support, or meetings) during their shifts?": "Con quale frequenza il vostro personale di sicurezza deve passare tra monitoraggio della sicurezza e responsabilità non di sicurezza (come amministrazione di sistema, supporto utenti o riunioni) durante i loro turni?",

  "What is your procedure when multiple security alerts from different systems trigger within a short time period?": "Qual è la vostra procedura quando molteplici alert di sicurezza da sistemi differenti si attivano in un breve periodo di tempo?",

  "How does your organization handle security monitoring during off-hours, weekends, or when key security staff are unavailable?": "Come gestisce la vostra organizzazione il monitoraggio della sicurezza durante le ore non lavorative, weekend o quando il personale chiave di sicurezza non è disponibile?",

  "What tools or processes do you have in place to help security staff prioritize and focus on the most critical threats when multiple issues compete for attention?": "Quali strumenti o processi avete in atto per aiutare il personale di sicurezza a prioritizzare e concentrarsi sulle minacce più critiche quando molteplici problemi competono per l'attenzione?",

  "How do you measure whether your security team is effectively detecting and responding to threats when they're managing multiple responsibilities?": "Come misurate se il vostro team di sicurezza sta rilevando e rispondendo efficacemente alle minacce quando sta gestendo molteplici responsabilità?",

  "To what extent are security monitoring responsibilities separated from other operational duties in your organization?": "In che misura le responsabilità di monitoraggio della sicurezza sono separate da altri compiti operativi nella vostra organizzazione?",

  // Common words and patterns for translation
  "How many": "Quanti",
  "How often": "Con quale frequenza",
  "How does": "Come",
  "How do you": "Come",
  "What happens": "Cosa succede",
  "What is your": "Qual è il vostro",
  "What tools": "Quali strumenti",
  "To what extent": "In che misura",
  "When facing": "Di fronte a",
  "Does your organization": "La vostra organizzazione",
  "Do you have": "Avete",
  "Are there": "Ci sono",

  // Common security terms
  "security team": "team di sicurezza",
  "security alerts": "alert di sicurezza",
  "security monitoring": "monitoraggio della sicurezza",
  "security personnel": "personale di sicurezza",
  "security staff": "personale di sicurezza",
  "incident response": "risposta agli incidenti",
  "high-priority": "ad alta priorità",
  "during normal operations": "durante le operazioni normali",
  "shift changes": "cambi turno",
  "multiple": "molteplici",
  "simultaneously": "simultaneamente",
};

// Simple word-by-word translation fallback (very basic)
const wordMap = {
  "the": "il/la",
  "and": "e",
  "or": "o",
  "in": "in",
  "to": "a/per",
  "of": "di",
  "your": "vostro/vostra",
  "team": "team",
  "security": "sicurezza",
  "when": "quando",
  "during": "durante",
  "how": "come",
  "what": "cosa/quale",
  "do": "fare",
  "does": "fa",
  "you": "voi",
  "have": "avete",
  "are": "sono/siete",
  "is": "è",
  "monitoring": "monitoraggio",
  "response": "risposta",
  "incident": "incidente",
  "alert": "alert",
  "system": "sistema",
  "staff": "personale",
  "organization": "organizzazione",
};

function translateText(text) {
  if (typeof text !== 'string') return text;

  // Try exact match first
  if (translations[text]) {
    return translations[text];
  }

  // Try case-insensitive match
  const lowerText = text.toLowerCase();
  for (const [en, it] of Object.entries(translations)) {
    if (en.toLowerCase() === lowerText) {
      return it;
    }
  }

  // If not found, return original (we'll need to add more translations)
  return text;
}

function translateField(key, value) {
  // Fields that should be translated
  const translateKeys = [
    'title', 'subtitle', 'question', 'label', 'description',
    'evidence_required', 'instructions', 'text', 'interpretation',
    'real_world_example'
  ];

  if (translateKeys.includes(key) && typeof value === 'string') {
    return translateText(value);
  }

  return value;
}

function translateObject(obj, depth = 0) {
  if (Array.isArray(obj)) {
    return obj.map(item => translateObject(item, depth + 1));
  }

  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip purely technical fields
      const skipFields = [
        'formula', 'query', 'soc_mapping', 'id', 'value', 'score',
        'weight', 'probability', 'factor', 'threshold', 'color',
        'score_range', 'fields', 'source', 'retention', 'type',
        'method', 'number', 'icon', 'time', 'evidence_type',
        'calculation', 'variables', 'parameters', 'alpha', 'tau',
        'lambda', 'beta', 'range', 'thresholds', 'default_weights'
      ];

      if (skipFields.includes(key)) {
        result[key] = value;
      } else {
        const translated = translateField(key, value);
        result[key] = translated === value ? translateObject(value, depth + 1) : translated;
      }
    }
    return result;
  }

  return obj;
}

function processIndicator(itPath, enPath) {
  try {
    // Read Italian version (partially translated)
    const itData = JSON.parse(fs.readFileSync(itPath, 'utf8'));

    // Read English version for reference
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

    // Translate IT data
    const translated = translateObject(itData);

    // Write back
    fs.writeFileSync(itPath, JSON.stringify(translated, null, 2), 'utf8');

    return { success: true, file: path.basename(itPath) };
  } catch (error) {
    return { success: false, file: path.basename(itPath), error: error.message };
  }
}

const basePath = '/home/user/CPF/auditor field kit/interactive';

const indicators = [
  // 5.x
  ...['5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', '5.10'].map(id => ({
    id,
    itPath: path.join(basePath, `it-IT/5.x-cognitive/indicator_${id}.json`),
    enPath: path.join(basePath, `en-US/5.x-cognitive/indicator_${id}.json`)
  })),
  // 7.x
  ...['7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9', '7.10'].map(id => ({
    id,
    itPath: path.join(basePath, `it-IT/7.x-stress/indicator_${id}.json`),
    enPath: path.join(basePath, `en-US/7.x-stress/indicator_${id}.json`)
  }))
];

console.log('Running comprehensive translation...\n');

const results = indicators.map(({ id, itPath, enPath }) => {
  const result = processIndicator(itPath, enPath);
  if (result.success) {
    console.log(`✅ ${id}`);
  } else {
    console.log(`❌ ${id}: ${result.error}`);
  }
  return result;
});

const successful = results.filter(r => r.success).length;
console.log(`\nProcessed: ${successful}/${indicators.length} indicators`);
