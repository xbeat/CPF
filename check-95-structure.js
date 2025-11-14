const fs = require('fs');

const j95 = JSON.parse(fs.readFileSync('auditor field kit/interactive/it-IT/9.x-ai/indicator_9.5.json', 'utf8'));

console.log('=== 9.5 Complete Structure ===\n');
console.log('Sections:', j95.sections.length);
j95.sections.forEach((s,i) => {
    console.log(`\nSection ${i}: ${s.title}`);
    console.log('  ID:', s.id);
    console.log('  Icon:', s.icon);
    console.log('  Items:', s.items?.length || 0);
    console.log('  Subsections:', s.subsections?.length || 0);
    if (s.subsections?.length > 0) {
        s.subsections.forEach((sub,si) => {
            console.log(`    Subsection ${si}: ${sub.title}`);
            console.log(`      Items: ${sub.items?.length || 0}`);
        });
    }
});

console.log('\n=== Other Fields ===');
console.log('Has red_flags:', j95.red_flags ? 'YES' : 'NO');
console.log('Has interdependencies:', j95.interdependencies ? 'YES' : 'NO');
console.log('Has risk_scenarios:', j95.risk_scenarios ? 'YES' : 'NO');
console.log('Has detection_formula:', j95.detection_formula ? 'YES' : 'NO');
console.log('Has data_sources:', j95.data_sources ? 'YES' : 'NO');
console.log('Has validation:', j95.validation ? 'YES' : 'NO');
console.log('Has remediation:', j95.remediation ? 'YES' : 'NO');

if (j95.sections[1]) {
    console.log('\n=== Section 1 (Client Conversation) Details ===');
    console.log('Items:', j95.sections[1].items?.length || 0);
    console.log('Subsections:', j95.sections[1].subsections?.length || 0);
    if (j95.sections[1].subsections) {
        j95.sections[1].subsections.forEach((sub, i) => {
            console.log(`\nSubsection ${i}: ${sub.title}`);
            console.log('  Items:', sub.items?.length || 0);
            if (sub.items?.length > 0) {
                sub.items.slice(0, 2).forEach((item, ii) => {
                    console.log(`    Item ${ii}: type=${item.type}`);
                });
            }
        });
    }
}
