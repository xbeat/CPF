#!/usr/bin/env node
/**
 * Fix it-IT 2.x indicators - add missing items array to sections
 */

const fs = require('fs');
const path = require('path');

const BASE_PATH = './auditor field kit/interactive';

console.log('Fixing it-IT indicators 2.x...');

let fixed = 0;

for (let i = 1; i <= 10; i++) {
    const filePath = path.join(BASE_PATH, 'it-IT', '2.x-temporal', `indicator_2.${i}.json`);

    if (!fs.existsSync(filePath)) {
        console.log(`  2.${i}: FILE NOT FOUND`);
        continue;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content);

        if (!json.sections || !Array.isArray(json.sections)) {
            console.log(`  2.${i}: SKIP - no sections`);
            continue;
        }

        let modified = false;

        json.sections.forEach((section, idx) => {
            // Add missing items array
            if (!section.items || !Array.isArray(section.items)) {
                section.items = [];
                modified = true;
            }

            // Add missing subsections array
            if (!section.subsections || !Array.isArray(section.subsections)) {
                section.subsections = [];
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
            console.log(`  2.${i}: ✅ FIXED`);
            fixed++;
        } else {
            console.log(`  2.${i}: ⚪ OK (already valid)`);
        }

    } catch (error) {
        console.log(`  2.${i}: ❌ ERROR - ${error.message}`);
    }
}

console.log(`\n✅ Fixed ${fixed} indicators`);
