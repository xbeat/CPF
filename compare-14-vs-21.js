#!/usr/bin/env node

const fs = require('fs');

const j14 = JSON.parse(fs.readFileSync('auditor field kit/interactive/it-IT/1.x-authority/indicator_1.4.json', 'utf8'));
const j21 = JSON.parse(fs.readFileSync('auditor field kit/interactive/it-IT/2.x-temporal/indicator_2.1.json', 'utf8'));

console.log('=== CONFRONTO STRUTTURA 1.4 vs 2.1 ===\n');

console.log('1.4 Top-level fields:', Object.keys(j14).length);
console.log('2.1 Top-level fields:', Object.keys(j21).length);

console.log('\n=== CAMPI MANCANTI IN 2.1 ===');
const missing = Object.keys(j14).filter(k => !j21[k]);
if (missing.length > 0) {
  missing.forEach(k => console.log('  ❌', k));
} else {
  console.log('  ✅ Nessun campo mancante');
}

console.log('\n=== SEZIONI 1.4 ===');
j14.sections.forEach((s,i) => {
  console.log(`Section ${i}: ${s.title}`);
  console.log('  Items:', s.items?.length || 0);
  console.log('  Subsections:', s.subsections?.length || 0);
  if (s.subsections) {
    s.subsections.forEach((sub, idx) => {
      console.log(`    Sub${idx}: ${sub.title} - ${sub.items?.length || 0} items, weight: ${sub.weight || 'N/A'}`);
    });
  }
});

console.log('\n=== SEZIONI 2.1 ===');
j21.sections.forEach((s,i) => {
  console.log(`Section ${i}: ${s.title}`);
  console.log('  Items:', s.items?.length || 0);
  console.log('  Subsections:', s.subsections?.length || 0);
  if (s.subsections) {
    s.subsections.forEach((sub, idx) => {
      const itemsCount = sub.items?.length || 0;
      const weight = sub.weight || 'N/A';
      const status = itemsCount > 0 ? '✓' : '❌';
      console.log(`    ${status} Sub${idx}: ${sub.title} - ${itemsCount} items, weight: ${weight}`);
    });
  }
});

console.log('\n=== ANALISI SUBSECTIONS 2.1 ===');
if (j21.sections[1]?.subsections) {
  const sub0 = j21.sections[1].subsections[0];
  const sub1 = j21.sections[1].subsections[1];

  console.log('\nSub0 (Conversazione):', sub0.title);
  console.log('  Items:', sub0.items?.length);
  if (sub0.items && sub0.items.length > 0) {
    console.log('  Primo item:', sub0.items[0].type, '-', sub0.items[0].text?.substring(0, 50));
  }

  console.log('\nSub1 (Red Flags):', sub1.title);
  console.log('  Items:', sub1.items?.length);
  if (sub1.items && sub1.items.length > 0) {
    console.log('  Primo item:', sub1.items[0].type, '-', sub1.items[0].label?.substring(0, 50));
  }
}
