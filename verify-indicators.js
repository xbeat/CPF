#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Common English words/patterns to detect (excluding technical terms that should stay in English)
const ENGLISH_PATTERNS = [
  /\b(the|The|THE)\s+(?!CEO|CTO|CISO|API|ML|AI|IT)\w+/g,
  /\b(is|are|was|were|has|have|had|will|would|should|could)\s+\w+/g,
  /\b(and|or|but|with|from|about|into|during|including)\s+\w+/g,
  /\b(this|these|that|those|your|our|their)\s+\w+/g,
  /\b(question|questions|Question|Questions)\b/g,
  /\b(security|Security|system|System|organization|Organization)\s+(?!assessment|breach|incident)/g,
  /\b(how|How|what|What|when|When|where|Where|why|Why|which|Which)\s+do(es)?\s+/g,
  /\b(please|Please|ensure|Ensure|verify|Verify|check|Check|review|Review)\b/g,
];

// Words that should remain in English (technical terms, acronyms)
const ALLOWED_ENGLISH = ['CEO', 'CTO', 'CISO', 'API', 'ML', 'AI', 'IT', 'IoT', 'DevOps', 'GDPR', 'ISO'];

const EXPECTED_STRUCTURE = {
  sections: 2,
  section0: {
    icon: '⚡',
    titleIT: 'VALUTAZIONE RAPIDA',
    titleEN: 'RAPID ASSESSMENT',
    hasItems: true
  },
  section1: {
    icon: '💬',
    titleIT: 'CONVERSAZIONE CON IL CLIENTE',
    titleEN: 'CLIENT CONVERSATION',
    subsections: 4
  }
};

function findEnglishText(obj, path = '', results = []) {
  if (typeof obj === 'string') {
    // Skip if it's just technical terms
    const cleanText = obj;
    ENGLISH_PATTERNS.forEach(pattern => {
      const matches = cleanText.match(pattern);
      if (matches && matches.length > 0) {
        // Filter out allowed technical terms
        const realMatches = matches.filter(m => {
          return !ALLOWED_ENGLISH.some(allowed => m.includes(allowed));
        });
        if (realMatches.length > 0) {
          results.push({
            path: path,
            matches: realMatches.slice(0, 3), // Show max 3 examples
            sample: obj.substring(0, 100)
          });
        }
      }
    });
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => findEnglishText(item, `${path}[${idx}]`, results));
  } else if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      // Skip fields that should be in English
      if (!['id', 'type', 'method', 'formula', 'variable'].includes(key)) {
        findEnglishText(obj[key], path ? `${path}.${key}` : key, results);
      }
    });
  }
  return results;
}

function checkStructure(indicator) {
  const issues = [];

  // Check sections count
  if (!indicator.sections || indicator.sections.length !== EXPECTED_STRUCTURE.sections) {
    issues.push(`Expected ${EXPECTED_STRUCTURE.sections} sections, found ${indicator.sections?.length || 0}`);
  }

  if (indicator.sections && indicator.sections.length >= 1) {
    const s0 = indicator.sections[0];

    // Check section 0 icon
    if (s0.icon !== EXPECTED_STRUCTURE.section0.icon) {
      issues.push(`Section 0 icon: expected '${EXPECTED_STRUCTURE.section0.icon}', found '${s0.icon}'`);
    }

    // Check section 0 has items
    if (!s0.items || s0.items.length === 0) {
      issues.push('Section 0 missing items');
    }
  }

  if (indicator.sections && indicator.sections.length >= 2) {
    const s1 = indicator.sections[1];

    // Check section 1 icon
    if (s1.icon !== EXPECTED_STRUCTURE.section1.icon) {
      issues.push(`Section 1 icon: expected '${EXPECTED_STRUCTURE.section1.icon}', found '${s1.icon}'`);
    }

    // Check section 1 has subsections
    if (!s1.subsections || s1.subsections.length !== EXPECTED_STRUCTURE.section1.subsections) {
      issues.push(`Section 1: expected ${EXPECTED_STRUCTURE.section1.subsections} subsections, found ${s1.subsections?.length || 0}`);
    }
  }

  return issues;
}

function verifyIndicator(filePath, lang) {
  const content = fs.readFileSync(filePath, 'utf8');
  const indicator = JSON.parse(content);
  const result = {
    file: filePath,
    indicator: indicator.indicator,
    title: indicator.title,
    structureIssues: [],
    englishText: []
  };

  // Check structure
  result.structureIssues = checkStructure(indicator);

  // Check for English text in Italian files
  if (lang === 'it') {
    result.englishText = findEnglishText(indicator);
  }

  return result;
}

function getAllIndicators(baseDir, lang) {
  const langCode = lang === 'it' ? 'it-IT' : 'en-US';
  const indicatorDir = path.join(baseDir, 'auditor field kit/interactive', langCode);
  const categories = fs.readdirSync(indicatorDir).filter(f =>
    fs.statSync(path.join(indicatorDir, f)).isDirectory()
  );

  const indicators = [];
  categories.forEach(category => {
    const categoryPath = path.join(indicatorDir, category);
    const files = fs.readdirSync(categoryPath)
      .filter(f => f.startsWith('indicator_') && f.endsWith('.json'))
      .sort();

    files.forEach(file => {
      indicators.push(path.join(categoryPath, file));
    });
  });

  return indicators;
}

function main() {
  const baseDir = process.cwd();

  console.log('🔍 CPF Indicator Verification Tool\n');
  console.log('Checking structure and language for all indicators...\n');

  const results = {
    it: { total: 0, structureErrors: 0, englishText: 0, issues: [] },
    en: { total: 0, structureErrors: 0, issues: [] }
  };

  // Check Italian indicators
  console.log('📋 Verifying Italian indicators (it-IT)...');
  const itIndicators = getAllIndicators(baseDir, 'it');
  results.it.total = itIndicators.length;

  itIndicators.forEach(filePath => {
    const result = verifyIndicator(filePath, 'it');

    if (result.structureIssues.length > 0) {
      results.it.structureErrors++;
      results.it.issues.push(result);
    }

    if (result.englishText.length > 0) {
      results.it.englishText++;
      if (!results.it.issues.find(i => i.file === result.file)) {
        results.it.issues.push(result);
      }
    }
  });

  // Check English indicators
  console.log('📋 Verifying English indicators (en-US)...');
  const enIndicators = getAllIndicators(baseDir, 'en');
  results.en.total = enIndicators.length;

  enIndicators.forEach(filePath => {
    const result = verifyIndicator(filePath, 'en');

    if (result.structureIssues.length > 0) {
      results.en.structureErrors++;
      results.en.issues.push(result);
    }
  });

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(80));

  console.log(`\n🇮🇹 Italian Indicators (it-IT): ${results.it.total} total`);
  console.log(`   ✅ Structure OK: ${results.it.total - results.it.structureErrors}`);
  console.log(`   ❌ Structure errors: ${results.it.structureErrors}`);
  console.log(`   ❌ Contains English text: ${results.it.englishText}`);

  console.log(`\n🇬🇧 English Indicators (en-US): ${results.en.total} total`);
  console.log(`   ✅ Structure OK: ${results.en.total - results.en.structureErrors}`);
  console.log(`   ❌ Structure errors: ${results.en.structureErrors}`);

  // Print detailed issues
  if (results.it.issues.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('🔴 ITALIAN INDICATORS WITH ISSUES');
    console.log('='.repeat(80));

    results.it.issues.forEach(issue => {
      const filename = path.basename(issue.file);
      console.log(`\n📄 ${issue.indicator} - ${issue.title}`);
      console.log(`   File: ${filename}`);

      if (issue.structureIssues.length > 0) {
        console.log('   🏗️  Structure issues:');
        issue.structureIssues.forEach(si => console.log(`      - ${si}`));
      }

      if (issue.englishText.length > 0) {
        console.log('   🔤 English text found:');
        issue.englishText.slice(0, 5).forEach(et => {
          console.log(`      - ${et.path}`);
          console.log(`        Examples: ${et.matches.join(', ')}`);
          if (et.sample) {
            console.log(`        Sample: "${et.sample}${et.sample.length >= 100 ? '...' : ''}"`);
          }
        });
        if (issue.englishText.length > 5) {
          console.log(`      ... and ${issue.englishText.length - 5} more locations`);
        }
      }
    });
  }

  if (results.en.issues.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('🔴 ENGLISH INDICATORS WITH ISSUES');
    console.log('='.repeat(80));

    results.en.issues.forEach(issue => {
      const filename = path.basename(issue.file);
      console.log(`\n📄 ${issue.indicator} - ${issue.title}`);
      console.log(`   File: ${filename}`);

      if (issue.structureIssues.length > 0) {
        console.log('   🏗️  Structure issues:');
        issue.structureIssues.forEach(si => console.log(`      - ${si}`));
      }
    });
  }

  // Print conclusion
  console.log('\n' + '='.repeat(80));
  const totalIssues = results.it.issues.length + results.en.issues.length;
  if (totalIssues === 0) {
    console.log('✅ All indicators passed verification!');
  } else {
    console.log(`⚠️  Found ${totalIssues} indicators with issues (${results.it.issues.length} IT, ${results.en.issues.length} EN)`);
    console.log('\nNext steps:');
    console.log('1. Fix structure issues');
    console.log('2. Translate English text in Italian indicators');
    console.log('3. Use external LLM to verify content is contextually appropriate');
  }
  console.log('='.repeat(80) + '\n');

  // Exit with error code if issues found
  process.exit(totalIssues > 0 ? 1 : 0);
}

main();
