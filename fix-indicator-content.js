#!/usr/bin/env node
/**
 * Fix indicators by combining:
 * - Structure from 9.5 (sections with subsections and red flags)
 * - Specific content from origin/main (descriptions, questions, formulas)
 */

const fs = require('fs');
const { execSync } = require('child_process');

function getOriginalContent(indicator, lang) {
  const langCode = lang === 'it' ? 'it-IT' : 'en-US';
  const category = indicator.startsWith('9.') ? '9.x-ai' : '10.x-convergent';
  const path = `auditor field kit/interactive/${langCode}/${category}/indicator_${indicator}.json`;

  try {
    const content = execSync(`git show origin/main:"${path}"`, { encoding: 'utf8' });
    return JSON.parse(content);
  } catch (e) {
    console.log(`⚠️  Could not find ${indicator} ${lang} in origin/main`);
    return null;
  }
}

function get95Template(lang) {
  const langCode = lang === 'it' ? 'it-IT' : 'en-US';
  const path = `auditor field kit/interactive/${langCode}/9.x-ai/indicator_9.5.json`;
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function combineIndicator(indicator, lang) {
  const original = getOriginalContent(indicator, lang);
  if (!original) return false;

  const template = get95Template(lang);

  // Start with template structure
  const combined = JSON.parse(JSON.stringify(template));

  // Replace with specific content from original
  combined.indicator = indicator;
  combined.title = original.title;
  combined.subtitle = original.subtitle;
  combined.description = original.description;

  // Keep 9.5 structure but update specific maturity levels if they exist
  if (original.scoring?.maturity_levels) {
    combined.scoring.maturity_levels = original.scoring.maturity_levels;
  }

  // Keep detection_formula from original (each indicator has unique formula)
  if (original.detection_formula) {
    combined.detection_formula = original.detection_formula;
  }

  // Keep interdependencies from original
  if (original.interdependencies) {
    combined.interdependencies = original.interdependencies;
  }

  // Keep risk_scenarios from original
  if (original.risk_scenarios) {
    combined.risk_scenarios = original.risk_scenarios;
  }

  // Keep metadata from original
  if (original.metadata) {
    combined.metadata = original.metadata;
  }

  // Section 0: Use original questions if they exist
  if (original.sections && original.sections[0] && original.sections[0].items) {
    // Keep structure from template but use content from original
    combined.sections[0].items = original.sections[0].items.map((origItem, idx) => {
      return {
        type: "radio-list",
        number: idx + 1,
        id: origItem.id || `q${idx + 1}`,
        weight: origItem.weight || (1 / original.sections[0].items.length),
        title: origItem.title || "Question Title",
        question: origItem.question || origItem.title,
        options: origItem.options || [],
        evidence_required: origItem.evidence_required || "",
        soc_mapping: origItem.soc_mapping || ""
      };
    });
  }

  // Section 1: Keep full structure from template (conversation + red flags)
  // Only update the conversation questions if we have specific ones
  if (original.sections && original.sections[1]) {
    // For now keep template structure, could customize later
  }

  return combined;
}

console.log('🔄 Combining structure from 9.5 with content from original indicators...\n');

// Fix 9.6-9.10 for both IT and EN
['9.6', '9.7', '9.8', '9.9', '9.10'].forEach(num => {
  ['it', 'en'].forEach(lang => {
    const combined = combineIndicator(num, lang);
    if (combined) {
      const langCode = lang === 'it' ? 'it-IT' : 'en-US';
      const path = `auditor field kit/interactive/${langCode}/9.x-ai/indicator_${num}.json`;
      fs.writeFileSync(path, JSON.stringify(combined, null, 2), 'utf8');
      console.log(`✅ ${langCode} ${num}: Combined`);
    }
  });
});

// Fix 10.1-10.10 for both IT and EN
for (let i = 1; i <= 10; i++) {
  const num = `10.${i}`;
  ['it', 'en'].forEach(lang => {
    const combined = combineIndicator(num, lang);
    if (combined) {
      const langCode = lang === 'it' ? 'it-IT' : 'en-US';
      const path = `auditor field kit/interactive/${langCode}/10.x-convergent/indicator_${num}.json`;
      fs.writeFileSync(path, JSON.stringify(combined, null, 2), 'utf8');
      console.log(`✅ ${langCode} ${num}: Combined`);
    }
  });
}

console.log('\n✅ All indicators fixed with correct content!');
