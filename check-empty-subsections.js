#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check indicators 1.5-2.10 for empty subsections
const indicatorsToCheck = [
  '1.5', '1.6', '1.7', '1.8', '1.9', '1.10',
  '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '2.10'
];

console.log('🔍 Checking indicators 1.5-2.10 for empty subsections\n');

indicatorsToCheck.forEach(id => {
  const category = id.startsWith('1.') ? '1.x-authority' : '2.x-temporal';
  const filePath = `auditor field kit/interactive/it-IT/${category}/indicator_${id}.json`;

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${id}: File not found`);
    return;
  }

  const indicator = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!indicator.sections || indicator.sections.length < 2) {
    console.log(`❌ ${id}: Missing sections (has ${indicator.sections?.length || 0})`);
    return;
  }

  const section1 = indicator.sections[1];
  if (!section1.subsections || section1.subsections.length === 0) {
    console.log(`❌ ${id}: No subsections in section 1`);
    return;
  }

  const emptySubsections = section1.subsections.filter(sub => !sub.items || sub.items.length === 0);

  if (emptySubsections.length > 0) {
    console.log(`\n📄 ${id} - ${indicator.title}`);
    console.log(`   Subsections: ${section1.subsections.length}`);
    section1.subsections.forEach((sub, idx) => {
      const itemCount = sub.items?.length || 0;
      const status = itemCount === 0 ? '❌ EMPTY' : '✓';
      console.log(`   ${status} Sub${idx}: "${sub.title}" (${itemCount} items)`);
    });
  } else {
    console.log(`✅ ${id}: All subsections have content`);
  }
});

console.log('\n✅ Check complete');
