#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get 9.5 template structure
function get95Structure(lang) {
  const langCode = lang === 'it' ? 'it-IT' : 'en-US';
  const path95 = `auditor field kit/interactive/${langCode}/9.x-ai/indicator_9.5.json`;
  return JSON.parse(fs.readFileSync(path95, 'utf8'));
}

// Common translation mappings for obvious English->Italian
const TRANSLATIONS = {
  'Question Title': 'Titolo Domanda',
  'Question': 'Domanda',
  'Security': 'Sicurezza',
  'security': 'sicurezza',
  'System': 'Sistema',
  'system': 'sistema',
  'Organization': 'Organizzazione',
  'organization': 'organizzazione',
  'the': 'il/la',
  'and': 'e',
  'or': 'o',
  'with': 'con',
};

// Fix structure based on 9.5 template
function fixStructure(indicator, template) {
  // Ensure 2 sections
  if (!indicator.sections || indicator.sections.length < 2) {
    console.log(`   ⚠️  Fixing sections count: ${indicator.sections?.length || 0} -> 2`);

    if (!indicator.sections) indicator.sections = [];

    // Ensure section 0 exists
    if (!indicator.sections[0]) {
      indicator.sections[0] = {
        title: template.sections[0].title,
        icon: '⚡',
        type: 'assessment',
        items: []
      };
    }

    // Ensure section 1 exists
    if (!indicator.sections[1]) {
      indicator.sections[1] = {
        title: template.sections[1].title,
        icon: '💬',
        type: 'conversation',
        subsections: []
      };
    }
  }

  // Fix section 0
  if (indicator.sections[0]) {
    if (indicator.sections[0].icon !== '⚡') {
      console.log(`   ⚠️  Fixing section 0 icon: ${indicator.sections[0].icon} -> ⚡`);
      indicator.sections[0].icon = '⚡';
    }

    // Ensure items array exists
    if (!indicator.sections[0].items) {
      indicator.sections[0].items = [];
    }
  }

  // Fix section 1
  if (indicator.sections[1]) {
    if (indicator.sections[1].icon !== '💬') {
      console.log(`   ⚠️  Fixing section 1 icon: ${indicator.sections[1].icon} -> 💬`);
      indicator.sections[1].icon = '💬';
    }

    // Ensure subsections
    if (!indicator.sections[1].subsections || indicator.sections[1].subsections.length !== 4) {
      console.log(`   ⚠️  Fixing subsections: ${indicator.sections[1].subsections?.length || 0} -> 4`);

      // If subsections exist but incomplete, merge with template
      const existing = indicator.sections[1].subsections || [];
      indicator.sections[1].subsections = template.sections[1].subsections.map((tplSub, idx) => {
        return existing[idx] || {
          title: tplSub.title,
          items: []
        };
      });
    }
  }

  return indicator;
}

// Basic translation of obvious English terms in Italian files
function translateObvious(obj) {
  if (typeof obj === 'string') {
    let text = obj;
    // Only translate obvious standalone terms
    if (text === 'Question Title') return 'Titolo Domanda';
    if (text === 'Security Champions') return 'Security Champions'; // Keep as is (term of art)
    // Don't over-translate, just flag obvious mistakes
    return text;
  } else if (Array.isArray(obj)) {
    return obj.map(item => translateObvious(item));
  } else if (obj && typeof obj === 'object') {
    const result = {};
    for (const key in obj) {
      // Skip bibliography
      if (key === 'research_basis' || key === 'academic_references') {
        result[key] = obj[key];
      } else {
        result[key] = translateObvious(obj[key]);
      }
    }
    return result;
  }
  return obj;
}

// Process single indicator
function processIndicator(filePath, lang) {
  console.log(`\n📄 Processing: ${path.basename(filePath)}`);

  let indicator = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const template = get95Structure(lang);

  let modified = false;

  // Fix structure
  const beforeSections = JSON.stringify(indicator.sections);
  indicator = fixStructure(indicator, template);
  if (JSON.stringify(indicator.sections) !== beforeSections) {
    modified = true;
  }

  // Translate obvious English in IT files
  if (lang === 'it') {
    const beforeTranslation = JSON.stringify(indicator);
    indicator = translateObvious(indicator);
    if (JSON.stringify(indicator) !== beforeTranslation) {
      console.log(`   ✏️  Applied obvious translations`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(indicator, null, 2) + '\n', 'utf8');
    console.log(`   ✅ Updated`);
    return true;
  } else {
    console.log(`   ✓ No changes needed`);
    return false;
  }
}

// Get all indicators for a category
function getIndicatorsForCategory(category) {
  const results = { it: [], en: [] };

  // Italian
  const itPath = `auditor field kit/interactive/it-IT/${category}`;
  if (fs.existsSync(itPath)) {
    results.it = fs.readdirSync(itPath)
      .filter(f => f.startsWith('indicator_') && f.endsWith('.json'))
      .map(f => path.join(itPath, f))
      .sort();
  }

  // English
  const enPath = `auditor field kit/interactive/en-US/${category}`;
  if (fs.existsSync(enPath)) {
    results.en = fs.readdirSync(enPath)
      .filter(f => f.startsWith('indicator_') && f.endsWith('.json'))
      .map(f => path.join(enPath, f))
      .sort();
  }

  return results;
}

// Main execution
function main() {
  console.log('🔧 CPF Indicator Auto-Fix Tool\n');
  console.log('This script will:');
  console.log('  1. Fix structure (2 sections, correct icons, 4 subsections)');
  console.log('  2. Translate obvious English terms in IT files');
  console.log('  3. Preserve all other content\n');

  const categories = [
    '1.x-authority',
    '2.x-temporal',
    '3.x-social',
    '4.x-affective',
    '5.x-cognitive',
    '6.x-group',
    '7.x-stress',
    '8.x-unconscious',
    '9.x-ai',
    '10.x-convergent'
  ];

  let totalFixed = 0;

  categories.forEach(category => {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📁 Category: ${category}`);
    console.log('='.repeat(80));

    const indicators = getIndicatorsForCategory(category);

    // Process Italian
    console.log(`\n🇮🇹 Italian indicators (${indicators.it.length} files):`);
    indicators.it.forEach(file => {
      if (processIndicator(file, 'it')) totalFixed++;
    });

    // Process English
    console.log(`\n🇬🇧 English indicators (${indicators.en.length} files):`);
    indicators.en.forEach(file => {
      if (processIndicator(file, 'en')) totalFixed++;
    });
  });

  console.log(`\n${'='.repeat(80)}`);
  console.log(`✅ Auto-fix complete! Fixed ${totalFixed} indicators`);
  console.log(`\nNext steps:`);
  console.log(`  1. Run verify-indicators.js to check remaining issues`);
  console.log(`  2. Review and manually fix remaining English text`);
  console.log(`  3. Use external LLM to verify contextual appropriateness`);
  console.log('='.repeat(80));
}

main();
