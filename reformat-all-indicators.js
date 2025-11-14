#!/usr/bin/env node
/**
 * Reformat all 9.7-9.10 and 10.1-10.10 indicators following 9.5 structure
 */

const fs = require('fs');
const path = require('path');

// Mapping of indicator numbers to their Italian titles
const INDICATOR_TITLES = {
  '9.7': {
    it: 'Accettazione delle Allucinazioni IA',
    en: 'AI Hallucination Acceptance'
  },
  '9.8': {
    it: 'Disfunzione del Team Umano-IA',
    en: 'Human-AI Team Dysfunction'
  },
  '9.9': {
    it: 'Manipolazione Emotiva IA',
    en: 'AI Emotional Manipulation'
  },
  '9.10': {
    it: 'Cecità all\'Equità Algoritmica',
    en: 'Algorithmic Fairness Blindness'
  },
  '10.1': {
    it: 'Tempesta Perfetta dei Fattori di Rischio',
    en: 'Perfect Storm Risk Factors'
  },
  '10.2': {
    it: 'Cascata di Fallimento della Sicurezza',
    en: 'Security Failure Cascade'
  },
  '10.3': {
    it: 'Collasso dell\'Autorità sotto Pressione',
    en: 'Authority Collapse Under Pressure'
  },
  '10.4': {
    it: 'Convergenza Temporale-Sociale',
    en: 'Temporal-Social Convergence'
  },
  '10.5': {
    it: 'Amplificazione Affettiva-Tecnica',
    en: 'Affective-Technical Amplification'
  },
  '10.6': {
    it: 'Loop di Feedback Cognitivo-Organizzativo',
    en: 'Cognitive-Organizational Feedback Loop'
  },
  '10.7': {
    it: 'Stress Ambientale Multi-Dimensionale',
    en: 'Multi-Dimensional Environmental Stress'
  },
  '10.8': {
    it: 'Esaurimento della Resilienza Sistemica',
    en: 'Systemic Resilience Exhaustion'
  },
  '10.9': {
    it: 'Vulnerabilità della Transizione Adattiva',
    en: 'Adaptive Transition Vulnerability'
  },
  '10.10': {
    it: 'Punto di Rottura del Sistema Complesso',
    en: 'Complex System Breaking Point'
  }
};

function reformatIndicator(templatePath, indicatorNum, lang) {
  const langCode = lang === 'it' ? 'it-IT' : 'en-US';
  const category = indicatorNum.startsWith('9.') ? '9.x-ai' : '10.x-convergent';
  const categoryName = lang === 'it'
    ? (category === '9.x-ai' ? 'Vulnerabilità di Bias Specifiche dell\'IA' : 'Vulnerabilità Convergenti')
    : (category === '9.x-ai' ? 'AI-Specific Bias Vulnerabilities' : 'Convergent Vulnerabilities');

  const targetPath = `auditor field kit/interactive/${langCode}/${category}/indicator_${indicatorNum}.json`;

  // Read template (9.5)
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

  // Update basic fields
  template.indicator = indicatorNum;
  template.title = lang === 'it'
    ? `INDICATORE ${indicatorNum} KIT DI VALUTAZIONE`
    : `INDICATOR ${indicatorNum} FIELD KIT`;
  template.subtitle = INDICATOR_TITLES[indicatorNum][lang];
  template.category = categoryName;
  template.cpf_reference = `CPF v1.0 - ${category === '9.x-ai' ? 'Categoria' : 'Category'} ${indicatorNum.split('.')[0]}.x`;

  // Update metadata
  if (template.metadata) {
    template.metadata.language = langCode;
    template.metadata.language_name = lang === 'it' ? 'Italiano (Italia)' : 'English (United States)';
  }

  // Write to target
  fs.writeFileSync(targetPath, JSON.stringify(template, null, 2), 'utf8');

  console.log(`✅ ${langCode} ${indicatorNum}: Reformatted`);
}

console.log('🔄 Reformatting indicators 9.7-9.10 and 10.1-10.10...\n');

const templateIT = 'auditor field kit/interactive/it-IT/9.x-ai/indicator_9.5.json';
const templateEN = 'auditor field kit/interactive/en-US/9.x-ai/indicator_9.5.json';

// Reformat 9.7-9.10
['9.7', '9.8', '9.9', '9.10'].forEach(num => {
  reformatIndicator(templateIT, num, 'it');
  reformatIndicator(templateEN, num, 'en');
});

// Reformat 10.1-10.10
for (let i = 1; i <= 10; i++) {
  const num = `10.${i}`;
  reformatIndicator(templateIT, num, 'it');
  reformatIndicator(templateEN, num, 'en');
}

console.log('\n✅ All indicators reformatted!');
console.log('Note: Descriptions and content still need to be customized for each indicator.');
