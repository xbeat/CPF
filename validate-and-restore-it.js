#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const files = [
    'auditor field kit/interactive/it-IT/1.x-authority/indicator_1.8.json.orig',
    'auditor field kit/interactive/it-IT/1.x-authority/indicator_1.9.json.orig',
    'auditor field kit/interactive/it-IT/1.x-authority/indicator_1.10.json.orig',
    'auditor field kit/interactive/it-IT/4.x-affective/indicator_4.8.json.orig',
    'auditor field kit/interactive/it-IT/4.x-affective/indicator_4.9.json.orig'
];

console.log('Validating and restoring IT indicators...\n');

files.forEach(file => {
    const target = file.replace('.orig', '');

    try {
        const content = fs.readFileSync(file, 'utf8');
        const json = JSON.parse(content);

        console.log(`✅ ${path.basename(target)}`);
        console.log(`   Indicator: ${json.indicator}`);
        console.log(`   Title: ${json.subtitle || json.title}`);
        console.log(`   Sections: ${json.sections ? json.sections.length : 'MISSING'}`);

        if (!json.sections || !Array.isArray(json.sections)) {
            console.log(`   ⚠️  WARNING: Missing sections array!`);
        } else {
            // Validate sections structure
            let hasIssues = false;
            json.sections.forEach((section, idx) => {
                if (!section.items || !Array.isArray(section.items)) {
                    section.items = [];
                    hasIssues = true;
                }
                if (!section.subsections || !Array.isArray(section.subsections)) {
                    section.subsections = [];
                    hasIssues = true;
                }
            });

            if (hasIssues) {
                console.log(`   🔧 Fixed missing items/subsections arrays`);
            }

            // Write back
            fs.writeFileSync(target, JSON.stringify(json, null, 2), 'utf8');
            console.log(`   📝 Restored to ${path.basename(target)}`);
        }

        // Remove .orig file
        fs.unlinkSync(file);

    } catch (error) {
        console.log(`❌ ${path.basename(file)}: ${error.message}`);
    }

    console.log('');
});

console.log('Done!');
