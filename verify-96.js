const fs = require('fs');

const j96 = JSON.parse(fs.readFileSync('auditor field kit/interactive/it-IT/9.x-ai/indicator_9.6.json', 'utf8'));

console.log('=== 9.6 IT Verification ===');
console.log('Subtitle:', j96.subtitle);
console.log('Q1 title:', j96.sections[0].items[0].title);
console.log('Q1 question:', j96.sections[0].items[0].question);
console.log('\nDetection formula component:', Object.keys(j96.detection_formula.mathematical_model.components)[0]);
console.log('Has correct OTI:', j96.detection_formula.mathematical_model.components.opacity_trust_index ? 'YES ✅' : 'NO ❌');
